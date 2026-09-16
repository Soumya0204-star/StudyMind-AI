import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Square, Timer, Sparkles } from "lucide-react";
import { formatDuration, EndSessionMetrics } from "@/hooks/useStudySessions";
import { useSmartMonitoring } from "@/hooks/useSmartMonitoring";
import SmartSessionModal from "@/components/smart-session/SmartSessionModal";
import SmartSessionStatusCard from "@/components/smart-session/SmartSessionStatusCard";
import WebcamPreview from "@/components/smart-session/WebcamPreview";

interface Props {
  activeSession: {
    id: string;
    start_time: string;
    subject: string | null;
    monitoring_enabled?: boolean | null;
  } | null;
  subjects: string[];
  onStart: (subject?: string, monitoringEnabled?: boolean) => void;
  onEnd: (metrics?: EndSessionMetrics) => void;
}

export default function StudySessionCard({ activeSession, subjects, onStart, onEnd }: Props) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const isSessionActive = Boolean(activeSession);
  const monitoringEnabled = Boolean(activeSession?.monitoring_enabled);

  // Hook for smart webcam monitoring
  const {
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
  } = useSmartMonitoring({
    isSessionActive,
  });

  // Start webcam monitoring if active session was created with monitoring_enabled
  useEffect(() => {
    if (activeSession && monitoringEnabled && !isCameraActive && monitoringState === "IDLE") {
      startMonitoring();
    }
  }, [activeSession, monitoringEnabled, isCameraActive, monitoringState, startMonitoring]);

  // Overall wall-clock elapsed timer
  useEffect(() => {
    if (!activeSession) {
      setElapsed(0);
      return;
    }
    const start = new Date(activeSession.start_time).getTime();
    const tick = () => setElapsed(Math.round((Date.now() - start) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const handleStartPrompt = () => {
    setShowModal(true);
  };

  const handleConfirmStart = (enableMonitoring: boolean) => {
    onStart(selectedSubject || undefined, enableMonitoring);
  };

  const handleEndSession = () => {
    stopCameraStream();
    if (monitoringEnabled) {
      onEnd(metrics);
    } else {
      onEnd({
        activeDuration: elapsed,
        pausedDuration: 0,
        pauseEvents: 0,
        presenceRatio: 1.0,
      });
    }
  };

  return (
    <>
      <Card className={activeSession ? "border-primary/40 bg-primary/5" : ""}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              Study Session
            </CardTitle>
            {activeSession && monitoringEnabled && (
              <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3" /> Smart Active
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSession ? (
            <div className="space-y-4">
              {/* Primary Time Display */}
              <div className="text-center">
                <p className="text-4xl font-bold font-mono tabular-nums tracking-wider text-foreground">
                  {monitoringEnabled ? formatDuration(activeDuration) : formatDuration(elapsed)}
                </p>
                <div className="flex items-center justify-center gap-2 mt-1 text-xs text-muted-foreground">
                  {activeSession.subject && <span>Studying: {activeSession.subject}</span>}
                  {monitoringEnabled && (
                    <span>• Total Session: {formatDuration(elapsed)}</span>
                  )}
                </div>
              </div>

              {/* Smart Session Real-time Controls & Indicators */}
              {monitoringEnabled && (
                <div className="space-y-3 pt-1">
                  <SmartSessionStatusCard
                    monitoringState={monitoringState}
                    activeDuration={activeDuration}
                    pausedDuration={pausedDuration}
                    pauseEvents={pauseEvents}
                    presenceRatio={presenceRatio}
                    gracePeriodRemaining={gracePeriodRemaining}
                    pauseReason={pauseReason}
                    drowsinessState={drowsinessState}
                    drowsinessEvents={drowsinessEvents}
                    onResumeManually={resumeManually}
                  />

                  <WebcamPreview
                    videoRef={videoRef}
                    mediaStream={mediaStream}
                    landmarks={landmarks}
                    poseState={currentPose}
                    isCameraActive={isCameraActive}
                    drowsinessState={drowsinessState}
                    onDisableCamera={disableCamera}
                  />
                </div>
              )}

              <Button onClick={handleEndSession} variant="destructive" className="w-full" size="lg">
                <Square className="h-4 w-4" />
                End Session
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {subjects.length > 0 && (
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button onClick={handleStartPrompt} className="w-full" size="lg">
                <Play className="h-4 w-4" />
                Start Studying
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consent / Permission Modal */}
      <SmartSessionModal
        open={showModal}
        onOpenChange={setShowModal}
        onConfirm={handleConfirmStart}
        subject={selectedSubject || undefined}
      />
    </>
  );
}
