/**
 * Configuration thresholds for Smart Webcam-Based Study Session.
 * All timing thresholds and pose confidence parameters are centralized here
 * for easy tuning and calibration.
 */
export const SMART_MONITORING_CONFIG = {
  /**
   * Grace period in seconds when transition from Sitting -> Standing is detected.
   * Gives the student time to stretch or shift before pausing.
   */
  STANDING_GRACE_PERIOD_SEC: 7,

  /**
   * Time in seconds without any detected pose (person left camera frame)
   * before auto-pausing the study session.
   */
  AWAY_THRESHOLD_SEC: 4,

  /**
   * Time in seconds of consecutive confirmed sitting required before
   * automatically resuming a paused session.
   */
  RESUME_STABILITY_PERIOD_SEC: 2.5,

  /**
   * Minimum confidence score required to consider a pose detected.
   */
  POSE_DETECTION_CONFIDENCE: 0.5,

  /**
   * Minimum tracking confidence score between consecutive video frames.
   */
  POSE_TRACKING_CONFIDENCE: 0.5,

  /**
   * Frame processing interval in milliseconds (~6.6 FPS).
   * Prevents excessive CPU/GPU usage while maintaining real-time responsiveness.
   */
  DETECTION_INTERVAL_MS: 150,

  /**
   * Relative vertical delta (shoulder Y coordinate change) indicating
   * that the user has stood up from their seated desk position.
   */
  SHOULDER_DELTA_Y_THRESHOLD: 0.12,

  /**
   * MediaPipe CDN Assets path for WebAssembly binaries.
   */
  MEDIAPIPE_WASM_PATH: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm",

  /**
   * MediaPipe Lite Pose Landmarker model asset (~5MB, optimized for client-side browser execution).
   */
  MEDIAPIPE_MODEL_PATH: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",

  /**
   * MediaPipe Face Landmarker model asset with blendshapes for real-time eye-blink & eyelid tracking.
   */
  FACE_LANDMARKER_MODEL_PATH: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",

  /**
   * Continuous seconds with eyes closed required to trigger a Drowsiness Alert.
   */
  DROWSINESS_EYES_CLOSED_THRESHOLD_SEC: 5.0,
} as const;
