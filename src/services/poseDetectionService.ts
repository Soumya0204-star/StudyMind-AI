import { FilesetResolver, PoseLandmarker, FaceLandmarker } from "@mediapipe/tasks-vision";
import { SMART_MONITORING_CONFIG } from "@/config/smartMonitoringConfig";
import { NormalizedLandmark, PoseState, DrowsinessTelemetry } from "@/types/smartMonitoring";

export interface ErgonomicMetrics {
  slouchDetected: boolean;
  forwardHeadRatio: number;
  shoulderTiltDeg: number;
  postureQuality: "Optimal" | "Moderate" | "Slouching" | "Unknown";
  ergonomicScore: number; // 0 - 100
}

export interface PoseDetectionResult {
  state: PoseState;
  landmarks: NormalizedLandmark[] | null;
  confidence: number;
  ergonomics?: ErgonomicMetrics;
  drowsiness?: DrowsinessTelemetry;
}

class PoseDetectionService {
  private landmarker: PoseLandmarker | null = null;
  private faceLandmarker: FaceLandmarker | null = null;
  private initializingPromise: Promise<PoseLandmarker> | null = null;
  private baselineShoulderY: number | null = null;
  private baselineHeadSpineDistance: number | null = null;
  private consecutiveSittingCount = 0;
  private consecutiveStandingCount = 0;
  private consecutiveAwayCount = 0;
  private consecutiveSlouchCount = 0;

  // Eyes closed timing (drowsiness triggers only after >= 5 seconds of closed eyes)
  private eyesClosedStartTime: number | null = null;
  private lastBlinkScore = 0;

  /**
   * Initializes MediaPipe Pose and Face Landmarkers using official WebAssembly binaries.
   */
  public async initialize(): Promise<PoseLandmarker> {
    if (this.landmarker) {
      return this.landmarker;
    }

    if (this.initializingPromise) {
      return this.initializingPromise;
    }

    this.initializingPromise = (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          SMART_MONITORING_CONFIG.MEDIAPIPE_WASM_PATH
        );

        // 1. Initialize Pose Landmarker
        try {
          this.landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: SMART_MONITORING_CONFIG.MEDIAPIPE_MODEL_PATH,
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numPoses: 1,
            minPoseDetectionConfidence: SMART_MONITORING_CONFIG.POSE_DETECTION_CONFIDENCE,
            minTrackingConfidence: SMART_MONITORING_CONFIG.POSE_TRACKING_CONFIDENCE,
          });
        } catch (err) {
          console.warn("PoseLandmarker GPU failed, falling back to CPU:", err);
          this.landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: SMART_MONITORING_CONFIG.MEDIAPIPE_MODEL_PATH,
              delegate: "CPU",
            },
            runningMode: "VIDEO",
            numPoses: 1,
            minPoseDetectionConfidence: SMART_MONITORING_CONFIG.POSE_DETECTION_CONFIDENCE,
            minTrackingConfidence: SMART_MONITORING_CONFIG.POSE_TRACKING_CONFIDENCE,
          });
        }

        // 2. Initialize Face Landmarker for precise eyelid & blink tracking
        try {
          this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: SMART_MONITORING_CONFIG.FACE_LANDMARKER_MODEL_PATH,
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numFaces: 1,
            outputFaceBlendshapes: true,
            minFaceDetectionConfidence: 0.4,
            minTrackingConfidence: 0.4,
          });
        } catch (err) {
          console.warn("FaceLandmarker GPU failed, trying CPU:", err);
          try {
            this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: SMART_MONITORING_CONFIG.FACE_LANDMARKER_MODEL_PATH,
                delegate: "CPU",
              },
              runningMode: "VIDEO",
              numFaces: 1,
              outputFaceBlendshapes: true,
              minFaceDetectionConfidence: 0.4,
              minTrackingConfidence: 0.4,
            });
          } catch (cpuErr) {
            console.warn("FaceLandmarker CPU fallback also failed:", cpuErr);
          }
        }

        return this.landmarker;
      } finally {
        this.initializingPromise = null;
      }
    })();

    return this.initializingPromise;
  }

  /**
   * Resets baseline posture calibration and eyes closed timer.
   */
  public resetCalibration() {
    this.baselineShoulderY = null;
    this.baselineHeadSpineDistance = null;
    this.consecutiveSittingCount = 0;
    this.consecutiveStandingCount = 0;
    this.consecutiveAwayCount = 0;
    this.consecutiveSlouchCount = 0;
    this.eyesClosedStartTime = null;
    this.lastBlinkScore = 0;
  }

  /**
   * Processes a video frame and returns the classified posture state & ergonomic telemetry.
   */
  public detect(video: HTMLVideoElement, timestamp: number): PoseDetectionResult {
    if (!this.landmarker || video.readyState < 2) {
      return { state: "UNKNOWN", landmarks: null, confidence: 0 };
    }

    try {
      const results = this.landmarker.detectForVideo(video, timestamp);

      if (!results.landmarks || results.landmarks.length === 0) {
        this.consecutiveAwayCount++;
        this.consecutiveSittingCount = 0;
        this.consecutiveStandingCount = 0;
        return {
          state: "AWAY",
          landmarks: null,
          confidence: 0,
          ergonomics: {
            slouchDetected: false,
            forwardHeadRatio: 1,
            shoulderTiltDeg: 0,
            postureQuality: "Unknown",
            ergonomicScore: 0,
          },
          drowsiness: {
            isDrowsy: false,
            noddingDetected: false,
            headDroopRatio: 1,
            alertnessScore: 0,
            alertMessage: null,
          },
        };
      }

      const landmarks = results.landmarks[0] as NormalizedLandmark[];
      const rawState = this.classifyLandmarks(landmarks);

      // Temporal smoothing to avoid single-frame flickers
      let smoothedState: PoseState = "UNKNOWN";

      if (rawState === "SITTING") {
        this.consecutiveSittingCount++;
        this.consecutiveStandingCount = 0;
        this.consecutiveAwayCount = 0;
        smoothedState = this.consecutiveSittingCount >= 2 ? "SITTING" : "UNKNOWN";
      } else if (rawState === "STANDING") {
        this.consecutiveStandingCount++;
        this.consecutiveSittingCount = 0;
        this.consecutiveAwayCount = 0;
        smoothedState = this.consecutiveStandingCount >= 2 ? "STANDING" : "SITTING";
      } else if (rawState === "AWAY") {
        this.consecutiveAwayCount++;
        this.consecutiveSittingCount = 0;
        this.consecutiveStandingCount = 0;
        smoothedState = this.consecutiveAwayCount >= 2 ? "AWAY" : "UNKNOWN";
      } else {
        smoothedState = "UNKNOWN";
      }

      // Compute Ergonomic Telemetry if sitting
      const ergonomics = this.computeErgonomics(landmarks, smoothedState);

      // Run FaceLandmarker for eyelid tracking & eye closure detection
      let faceBlendshapes: any[] | undefined;
      let faceLandmarks: NormalizedLandmark[][] | undefined;
      if (this.faceLandmarker) {
        try {
          const faceResults = this.faceLandmarker.detectForVideo(video, timestamp);
          faceBlendshapes = faceResults.faceBlendshapes;
          faceLandmarks = faceResults.faceLandmarks;
        } catch (err) {
          // Non-blocking face detection error
        }
      }

      // Compute Real-time Drowsiness & Eye Closure Telemetry
      const drowsiness = this.computeDrowsiness(landmarks, smoothedState, timestamp, faceBlendshapes, faceLandmarks);

      return {
        state: smoothedState,
        landmarks,
        confidence: 0.9,
        ergonomics,
        drowsiness,
      };
    } catch (err) {
      console.warn("Pose detection frame processing error:", err);
      return { state: "UNKNOWN", landmarks: null, confidence: 0 };
    }
  }

  private computeErgonomics(landmarks: NormalizedLandmark[], state: PoseState): ErgonomicMetrics {
    if (state !== "SITTING" || landmarks.length < 13) {
      return {
        slouchDetected: false,
        forwardHeadRatio: 1,
        shoulderTiltDeg: 0,
        postureQuality: state === "SITTING" ? "Moderate" : "Unknown",
        ergonomicScore: 70,
      };
    }

    const nose = landmarks[0];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const currentDistance = shoulderY - nose.y;

    const deltaX = rightShoulder.x - leftShoulder.x;
    const deltaY = rightShoulder.y - leftShoulder.y;
    const shoulderTiltDeg = Math.abs(Math.atan2(deltaY, deltaX) * (180 / Math.PI));

    if (this.baselineHeadSpineDistance === null && currentDistance > 0.12 && currentDistance < 0.35) {
      this.baselineHeadSpineDistance = currentDistance;
    }

    const baseline = this.baselineHeadSpineDistance || 0.22;
    const ratio = currentDistance / baseline;

    const isSlouching = ratio < 0.78 || shoulderTiltDeg > 8;
    if (isSlouching) {
      this.consecutiveSlouchCount++;
    } else {
      this.consecutiveSlouchCount = Math.max(0, this.consecutiveSlouchCount - 1);
    }

    const slouchDetected = isSlouching && this.consecutiveSlouchCount >= 3;
    const quality: ErgonomicMetrics["postureQuality"] = slouchDetected
      ? "Slouching"
      : ratio > 0.92
      ? "Optimal"
      : "Moderate";

    const score = slouchDetected
      ? Math.max(35, Math.round(50 * ratio))
      : quality === "Optimal"
      ? Math.min(100, Math.round(85 + 15 * (1 - Math.min(1, shoulderTiltDeg / 10))))
      : 75;

    return {
      slouchDetected,
      forwardHeadRatio: Number(ratio.toFixed(2)),
      shoulderTiltDeg: Math.round(shoulderTiltDeg),
      postureQuality: quality,
      ergonomicScore: score,
    };
  }

  /**
   * Real-time Drowsiness & Microsleep detection based on sustained eyes closed (> 5.0 seconds).
   */
  private computeDrowsiness(
    landmarks: NormalizedLandmark[],
    state: PoseState,
    timestamp: number,
    faceBlendshapes?: any[],
    faceLandmarks?: NormalizedLandmark[][]
  ): DrowsinessTelemetry {
    const thresholdSec = SMART_MONITORING_CONFIG.DROWSINESS_EYES_CLOSED_THRESHOLD_SEC; // 5.0s

    if (state !== "SITTING" || landmarks.length < 13) {
      this.eyesClosedStartTime = null;
      return {
        isDrowsy: false,
        noddingDetected: false,
        eyesClosed: false,
        eyesClosedDurationSec: 0,
        eyesClosedThresholdSec: thresholdSec,
        blinkScore: 0,
        headDroopRatio: 1,
        alertnessScore: state === "SITTING" ? 90 : 0,
        alertMessage: null,
      };
    }

    let leftBlink = 0;
    let rightBlink = 0;
    let hasFaceData = false;

    // 1. Extract eye blink scores from MediaPipe Face Blendshapes
    if (faceBlendshapes && faceBlendshapes.length > 0 && faceBlendshapes[0]?.categories) {
      hasFaceData = true;
      for (const cat of faceBlendshapes[0].categories) {
        if (cat.categoryName === "eyeBlinkLeft") leftBlink = cat.score;
        if (cat.categoryName === "eyeBlinkRight") rightBlink = cat.score;
      }
    }

    // 2. Extract Eye Aspect Ratio (EAR) from Face Mesh 468/478 landmarks
    let earLeft = 0;
    let earRight = 0;
    if (faceLandmarks && faceLandmarks.length > 0 && faceLandmarks[0].length >= 387) {
      hasFaceData = true;
      const fl = faceLandmarks[0];
      // Left eye
      const lUpper = fl[386];
      const lLower = fl[374];
      const lOuter = fl[263];
      const lInner = fl[362];
      if (lUpper && lLower && lOuter && lInner) {
        const lHeight = Math.abs(lUpper.y - lLower.y);
        const lWidth = Math.hypot(lOuter.x - lInner.x, lUpper.y - lLower.y) || 0.01;
        earLeft = lHeight / lWidth;
      }

      // Right eye
      const rUpper = fl[159];
      const rLower = fl[145];
      const rOuter = fl[33];
      const rInner = fl[133];
      if (rUpper && rLower && rOuter && rInner) {
        const rHeight = Math.abs(rUpper.y - rLower.y);
        const rWidth = Math.hypot(rOuter.x - rInner.x, rUpper.y - rLower.y) || 0.01;
        earRight = rHeight / rWidth;
      }
    }

    const blinkScore = hasFaceData ? Math.max(leftBlink, rightBlink) : 0;
    this.lastBlinkScore = blinkScore;

    // Both eyes closed detection:
    // Blendshape score > 0.45 for both eyes, OR EAR < 0.12 for both eyes
    const areEyesClosed = hasFaceData
      ? (leftBlink > 0.45 && rightBlink > 0.45) ||
        (earLeft > 0 && earLeft < 0.12 && earRight > 0 && earRight < 0.12)
      : false;

    let eyesClosedDurationSec = 0;

    if (areEyesClosed) {
      if (this.eyesClosedStartTime === null) {
        this.eyesClosedStartTime = timestamp;
      }
      eyesClosedDurationSec = Number(((timestamp - this.eyesClosedStartTime) / 1000).toFixed(1));
    } else {
      // Eyes are open -> immediately reset the timer!
      this.eyesClosedStartTime = null;
      eyesClosedDurationSec = 0;
    }

    // DROWSINESS TRIGGERS ONLY IF EYES ARE CONTINUOUSLY CLOSED FOR >= 5 SECONDS
    const isDrowsy = areEyesClosed && eyesClosedDurationSec >= thresholdSec;

    // Compute Alertness Score:
    // 100% when eyes are open.
    // Progressively drops as eyes stay closed toward 5s.
    // Drops to 25% when 5s threshold is reached.
    let alertnessScore = 100;
    if (areEyesClosed) {
      const fraction = Math.min(1, eyesClosedDurationSec / thresholdSec);
      alertnessScore = Math.max(25, Math.round(100 - fraction * 70));
    }

    let alertMessage: string | null = null;
    if (isDrowsy) {
      alertMessage = `Drowsiness Alert: Eyes closed for ${eyesClosedDurationSec.toFixed(1)}s (Exceeded ${thresholdSec}s limit)! Sit upright and refocus.`;
    } else if (areEyesClosed && eyesClosedDurationSec >= 2.0) {
      alertMessage = `Eyes closed: ${eyesClosedDurationSec.toFixed(1)}s / ${thresholdSec}s`;
    }

    return {
      isDrowsy,
      noddingDetected: isDrowsy,
      eyesClosed: areEyesClosed,
      eyesClosedDurationSec,
      eyesClosedThresholdSec: thresholdSec,
      blinkScore: Number(blinkScore.toFixed(2)),
      headDroopRatio: 1.0,
      alertnessScore,
      alertMessage,
    };
  }

  /**
   * Internal heuristics to classify sitting vs standing vs away from landmark coordinates.
   */
  private classifyLandmarks(landmarks: NormalizedLandmark[]): PoseState {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const nose = landmarks[0];

    const leftVis = leftShoulder?.visibility ?? 1;
    const rightVis = rightShoulder?.visibility ?? 1;
    const noseVis = nose?.visibility ?? 1;

    if (leftVis < 0.4 && rightVis < 0.4 && noseVis < 0.4) {
      return "AWAY";
    }

    const currentShoulderY = (leftShoulder.y + rightShoulder.y) / 2;

    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];

    const hipsVisible = (leftHip?.visibility ?? 0) > 0.5 || (rightHip?.visibility ?? 0) > 0.5;
    const kneesVisible = (leftKnee?.visibility ?? 0) > 0.4 || (rightKnee?.visibility ?? 0) > 0.4;

    if (hipsVisible && kneesVisible) {
      const hipY = ((leftHip?.y ?? 0) + (rightHip?.y ?? 0)) / 2;
      const kneeY = ((leftKnee?.y ?? 0) + (rightKnee?.y ?? 0)) / 2;
      const thighLengthY = Math.abs(kneeY - hipY);
      const torsoLengthY = Math.abs(hipY - currentShoulderY);

      if (thighLengthY > torsoLengthY * 0.85) {
        return "STANDING";
      }
    }

    if (this.baselineShoulderY === null) {
      if (currentShoulderY >= 0.35 && currentShoulderY <= 0.8) {
        this.baselineShoulderY = currentShoulderY;
      }
      return "SITTING";
    }

    const deltaY = this.baselineShoulderY - currentShoulderY;
    if (deltaY > SMART_MONITORING_CONFIG.SHOULDER_DELTA_Y_THRESHOLD || currentShoulderY < 0.2) {
      return "STANDING";
    }

    if (currentShoulderY >= 0.35 && currentShoulderY <= 0.8) {
      this.baselineShoulderY = this.baselineShoulderY * 0.95 + currentShoulderY * 0.05;
    }

    return "SITTING";
  }

  /**
   * Releases resources and closes detector.
   */
  public destroy() {
    if (this.landmarker) {
      try {
        this.landmarker.close();
      } catch (e) {
        console.warn("Error closing landmarker:", e);
      }
      this.landmarker = null;
    }
    if (this.faceLandmarker) {
      try {
        this.faceLandmarker.close();
      } catch (e) {
        console.warn("Error closing face landmarker:", e);
      }
      this.faceLandmarker = null;
    }
    this.resetCalibration();
  }
}

export const poseDetectionService = new PoseDetectionService();
