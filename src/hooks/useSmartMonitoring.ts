import { useState, useEffect, useRef, useCallback } from "react";
import { SMART_MONITORING_CONFIG } from "@/config/smartMonitoringConfig";
import { poseDetectionService } from "@/services/poseDetectionService";
import { alertSoundService } from "@/services/alertSoundService";
import {
  NormalizedLandmark,
  PoseState,
  SessionMonitoringState,
  SmartSessionMetrics,
  DrowsinessTelemetry,
} from "@/types/smartMonitoring";
import { toast } from "@/hooks/use-toast";

interface UseSmartMonitoringProps {
  isSessionActive: boolean;
  onAutoPause?: () => void;
  onAutoResume?: () => void;
}

export function useSmartMonitoring({
  isSessionActive,
  onAutoPause,
  onAutoResume,
}: UseSmartMonitoringProps) {
  const [monitoringState, setMonitoringState] = useState<SessionMonitoringState>("IDLE");
  const [currentPose, setCurrentPose] = useState<PoseState>("UNKNOWN");
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null);
  const [activeDuration, setActiveDuration] = useState(0);
  const [pausedDuration, setPausedDuration] = useState(0);
  const [pauseEvents, setPauseEvents] = useState(0);
  const [gracePeriodRemaining, setGracePeriodRemaining] = useState<number | null>(null);
  const [pauseReason, setPauseReason] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Drowsiness detection state
  const [drowsinessState, setDrowsinessState] = useState<DrowsinessTelemetry | null>(null);
  const [drowsinessEvents, setDrowsinessEvents] = useState(0);
  const wasDrowsyRef = useRef(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastProcessedTimeRef = useRef<number>(0);

  // Timers and counters for state transitions
  const standingStartTimeRef = useRef<number | null>(null);
  const awayStartTimeRef = useRef<number | null>(null);
  const returnStartTimeRef = useRef<number | null>(null);

  // Stop camera stream cleanly
  const stopCameraStream = useCallback(() => {
    alertSoundService.stopAlarm();
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn("Error stopping video track:", e);
        }
      });
      mediaStreamRef.current = null;
    }
    setMediaStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Initialize and start webcam monitoring
  const startMonitoring = useCallback(async () => {
    setMonitoringState("STARTING");
    poseDetectionService.resetCalibration();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      setMediaStream(stream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn("play err:", e));
      }

      await poseDetectionService.initialize();

      setMonitoringState("ACTIVE");
      toast({
        title: "Smart Monitoring & Drowsiness Guardian Active 🟢",
        description: "Private on-device pose & alertness tracking started.",
      });
    } catch (err: unknown) {
      console.error("Smart monitoring initialization failed:", err);
      stopCameraStream();

      const errorName = err instanceof Error ? err.name : "";
      if (errorName === "NotAllowedError" || errorName === "PermissionDeniedError") {
        setMonitoringState("WEBCAM_DENIED");
        toast({
          title: "Webcam Access Denied",
          description: "Session will continue with standard time tracking.",
          variant: "destructive",
        });
      } else {
        setMonitoringState("DETECTION_ERROR");
        toast({
          title: "Camera Unavailable",
          description: "Continuing in standard time-tracking mode.",
        });
      }
    }
  }, [stopCameraStream]);

  // Disable camera explicitly
  const disableCamera = useCallback(() => {
    stopCameraStream();
    setMonitoringState("WEBCAM_DISABLED");
    toast({
      title: "Webcam Monitoring Disabled",
      description: "Switched to standard study timer.",
    });
  }, [stopCameraStream]);

  // Resume manually from paused state
  const resumeManually = useCallback(() => {
    standingStartTimeRef.current = null;
    awayStartTimeRef.current = null;
    returnStartTimeRef.current = null;
    setGracePeriodRemaining(null);
    setPauseReason(null);
    setMonitoringState("ACTIVE");
    onAutoResume?.();
    toast({ title: "Session Resumed ▶️" });
  }, [onAutoResume]);

  // Main processing loop using requestAnimationFrame
  useEffect(() => {
    if (!isCameraActive || !isSessionActive) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const processFrame = () => {
      const video = videoRef.current;
      const currentTime = performance.now();

      if (
        video &&
        video.readyState >= 2 &&
        currentTime - lastProcessedTimeRef.current >= SMART_MONITORING_CONFIG.DETECTION_INTERVAL_MS
      ) {
        lastProcessedTimeRef.current = currentTime;

        try {
          const result = poseDetectionService.detect(video, currentTime);

          setCurrentPose(result.state);
          setLandmarks(result.landmarks);

          // Handle real-time drowsiness detection & continuous wake-up alarm sound
          if (result.drowsiness) {
            setDrowsinessState(result.drowsiness);

            if (result.drowsiness.isDrowsy) {
              alertSoundService.startAlarm();
              if (!wasDrowsyRef.current) {
                wasDrowsyRef.current = true;
                setDrowsinessEvents((prev) => prev + 1);
                toast({
                  title: "⚠️ Drowsiness Alert: Eyes Closed > 5 Seconds!",
                  description: "Alarm sounding! Open your eyes and sit upright to dismiss.",
                  variant: "destructive",
                });
              }
            } else {
              if (wasDrowsyRef.current) {
                alertSoundService.stopAlarm();
              }
              wasDrowsyRef.current = false;
            }
          }

          // State Machine Transition Logic
          setMonitoringState((prevState) => {
            if (prevState === "ACTIVE") {
              if (result.state === "STANDING") {
                if (!standingStartTimeRef.current) {
                  standingStartTimeRef.current = currentTime;
                }
                const elapsedSec = (currentTime - standingStartTimeRef.current) / 1000;
                const remaining = Math.max(0, SMART_MONITORING_CONFIG.STANDING_GRACE_PERIOD_SEC - elapsedSec);
                setGracePeriodRemaining(Math.ceil(remaining));

                if (elapsedSec >= SMART_MONITORING_CONFIG.STANDING_GRACE_PERIOD_SEC) {
                  standingStartTimeRef.current = null;
                  setGracePeriodRemaining(null);
                  setPauseReason("Movement away from study position detected.");
                  setPauseEvents((prev) => prev + 1);
                  onAutoPause?.();
                  return "PAUSED";
                }
                return "STANDING_DETECTED";
              } else if (result.state === "AWAY") {
                if (!awayStartTimeRef.current) {
                  awayStartTimeRef.current = currentTime;
                }
                const elapsedSec = (currentTime - awayStartTimeRef.current) / 1000;
                const remaining = Math.max(0, SMART_MONITORING_CONFIG.AWAY_THRESHOLD_SEC - elapsedSec);
                setGracePeriodRemaining(Math.ceil(remaining));

                if (elapsedSec >= SMART_MONITORING_CONFIG.AWAY_THRESHOLD_SEC) {
                  awayStartTimeRef.current = null;
                  setGracePeriodRemaining(null);
                  setPauseReason("Student away from study desk.");
                  setPauseEvents((prev) => prev + 1);
                  onAutoPause?.();
                  return "PAUSED";
                }
                return "STANDING_DETECTED";
              } else {
                standingStartTimeRef.current = null;
                awayStartTimeRef.current = null;
                setGracePeriodRemaining(null);
                return "ACTIVE";
              }
            }

            if (prevState === "STANDING_DETECTED") {
              if (result.state === "SITTING") {
                standingStartTimeRef.current = null;
                awayStartTimeRef.current = null;
                setGracePeriodRemaining(null);
                return "ACTIVE";
              }

              const startTime = standingStartTimeRef.current || awayStartTimeRef.current || currentTime;
              const threshold = result.state === "AWAY"
                ? SMART_MONITORING_CONFIG.AWAY_THRESHOLD_SEC
                : SMART_MONITORING_CONFIG.STANDING_GRACE_PERIOD_SEC;
              const elapsedSec = (currentTime - startTime) / 1000;
              const remaining = Math.max(0, threshold - elapsedSec);
              setGracePeriodRemaining(Math.ceil(remaining));

              if (elapsedSec >= threshold) {
                standingStartTimeRef.current = null;
                awayStartTimeRef.current = null;
                setGracePeriodRemaining(null);
                setPauseReason(
                  result.state === "AWAY"
                    ? "Student away from study desk."
                    : "Movement away from study position detected."
                );
                setPauseEvents((prev) => prev + 1);
                onAutoPause?.();
                return "PAUSED";
              }

              return "STANDING_DETECTED";
            }

            if (prevState === "PAUSED") {
              if (result.state === "SITTING") {
                returnStartTimeRef.current = currentTime;
                return "RETURN_DETECTED";
              }
              return "PAUSED";
            }

            if (prevState === "RETURN_DETECTED") {
              if (result.state !== "SITTING") {
                returnStartTimeRef.current = null;
                return "PAUSED";
              }

              if (returnStartTimeRef.current) {
                const elapsedReturnSec = (currentTime - returnStartTimeRef.current) / 1000;
                if (elapsedReturnSec >= SMART_MONITORING_CONFIG.RETURN_CONFIRMATION_SEC) {
                  returnStartTimeRef.current = null;
                  setPauseReason(null);
                  onAutoResume?.();
                  toast({ title: "Welcome back! Session Resumed ▶️" });
                  return "ACTIVE";
                }
              }
              return "RETURN_DETECTED";
            }

            return prevState;
          });
        } catch (e) {
          console.warn("Smart monitoring frame processing error:", e);
        }
      }

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isCameraActive, isSessionActive, onAutoPause, onAutoResume]);

  // Duration accumulator timer
  useEffect(() => {
    if (!isSessionActive) {
      setActiveDuration(0);
      setPausedDuration(0);
      setPauseEvents(0);
      setDrowsinessEvents(0);
      return;
    }

    const interval = setInterval(() => {
      if (
        monitoringState === "ACTIVE" ||
        monitoringState === "STANDING_DETECTED" ||
        monitoringState === "WEBCAM_DISABLED" ||
        monitoringState === "WEBCAM_DENIED" ||
        monitoringState === "DETECTION_ERROR"
      ) {
        setActiveDuration((prev) => prev + 1);
      } else if (monitoringState === "PAUSED" || monitoringState === "RETURN_DETECTED") {
        setPausedDuration((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive, monitoringState]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
      poseDetectionService.destroy();
    };
  }, [stopCameraStream]);

  // Compute presence ratio
  const totalTracked = activeDuration + pausedDuration;
  const presenceRatio = totalTracked > 0 ? activeDuration / totalTracked : 1.0;

  const metrics: SmartSessionMetrics = {
    activeDuration,
    pausedDuration,
    pauseEvents,
    presenceRatio: Math.min(1.0, Math.max(0.0, presenceRatio)),
    drowsinessEvents,
  };

  return {
    monitoringState,
    currentPose,
    landmarks,
    videoRef,
    mediaStream,
    isCameraActive,
    activeDuration,
    pausedDuration,
    pauseEvents,
    presenceRatio,
    gracePeriodRemaining,
    pauseReason,
    drowsinessState,
    drowsinessEvents,
    metrics,
    startMonitoring,
    stopCameraStream,
    disableCamera,
    resumeManually,
    setMonitoringState,
  };
}
