/**
 * Approximate posture/presence state classified from the webcam stream.
 */
export type PoseState = "SITTING" | "STANDING" | "AWAY" | "UNKNOWN";

/**
 * State machine states for the Smart Session lifecycle.
 */
export type SessionMonitoringState =
  | "IDLE"
  | "STARTING"
  | "ACTIVE"
  | "STANDING_DETECTED"
  | "PAUSED"
  | "RETURN_DETECTED"
  | "WEBCAM_DENIED"
  | "WEBCAM_DISABLED"
  | "DETECTION_ERROR";

/**
 * Real-time Drowsiness & Alertness Telemetry.
 */
export interface DrowsinessTelemetry {
  isDrowsy: boolean;
  noddingDetected: boolean;
  eyesClosed: boolean;
  eyesClosedDurationSec: number;
  eyesClosedThresholdSec: number;
  blinkScore: number; // 0.0 (open) to 1.0 (closed)
  headDroopRatio: number; // 1.0 = alert & upright, < 0.65 = drooping/nodding
  alertnessScore: number; // 0 - 100%
  alertMessage: string | null;
}

/**
 * Aggregated session metrics tracked during the study session.
 */
export interface SmartSessionMetrics {
  /** Active study duration in seconds where user was confirmed seated */
  activeDuration: number;
  /** Paused/idle duration in seconds while session was paused */
  pausedDuration: number;
  /** Total count of auto-pause events during the session */
  pauseEvents: number;
  /** Ratio of active study duration to total elapsed duration (0.0 to 1.0) */
  presenceRatio: number;
  /** Total count of drowsiness/nodding off incidents detected */
  drowsinessEvents?: number;
  /** Average alertness score (0-100) */
  averageAlertness?: number;
}

/**
 * Normalized 2D/3D coordinate for visual landmark overlay.
 */
export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}
