import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NormalizedLandmark, PoseState, DrowsinessTelemetry } from "@/types/smartMonitoring";
import { Camera, CameraOff, Eye, EyeOff, ShieldCheck, Sparkles, AlertTriangle } from "lucide-react";

interface WebcamPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  mediaStream: MediaStream | null;
  landmarks: NormalizedLandmark[] | null;
  poseState: PoseState;
  isCameraActive: boolean;
  drowsinessState?: DrowsinessTelemetry | null;
  onDisableCamera: () => void;
}

export default function WebcamPreview({
  videoRef,
  mediaStream,
  landmarks,
  poseState,
  isCameraActive,
  drowsinessState,
  onDisableCamera,
}: WebcamPreviewProps) {
  const [showPreview, setShowPreview] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Bind the mediaStream to the video element whenever stream, preview, or element mounts
  useEffect(() => {
    const video = videoRef.current;
    if (video && mediaStream) {
      if (video.srcObject !== mediaStream) {
        video.srcObject = mediaStream;
      }
      video.play().catch((err) => {
        console.warn("Video playback error:", err);
      });
    }
  }, [videoRef, mediaStream, showPreview]);

  // Draw real-time pose and face tracking overlay on top of webcam feed
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !showPreview || !landmarks || landmarks.length === 0) {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Adjust canvas resolution to video stream resolution
    const w = video?.videoWidth || 320;
    const h = video?.videoHeight || 180;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Color theme based on sitting vs standing/away vs drowsiness
    const isDrowsy = Boolean(drowsinessState?.isDrowsy);
    const isSitting = poseState === "SITTING";

    ctx.lineWidth = 3;
    if (isDrowsy) {
      ctx.strokeStyle = "rgba(245, 158, 11, 0.95)";
    } else if (isSitting) {
      ctx.strokeStyle = "rgba(16, 185, 129, 0.85)";
    } else {
      ctx.strokeStyle = "rgba(245, 158, 11, 0.85)";
    }

    // Key pose skeleton connections
    const connections: [number, number][] = [
      [11, 12], // shoulder to shoulder
      [11, 23], // left shoulder to left hip
      [12, 24], // right shoulder to right hip
      [23, 24], // hip to hip
      [11, 13], [13, 15], // left arm
      [12, 14], [14, 16], // right arm
    ];

    connections.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      if (p1 && p2 && (p1.visibility ?? 1) > 0.35 && (p2.visibility ?? 1) > 0.35) {
        ctx.beginPath();
        // Mirror horizontally to match the mirrored webcam view
        ctx.moveTo((1 - p1.x) * w, p1.y * h);
        ctx.lineTo((1 - p2.x) * w, p2.y * h);
        ctx.stroke();
      }
    });

    // Draw face and shoulder tracking points
    const keypoints = [0, 11, 12, 13, 14, 23, 24];
    keypoints.forEach((idx) => {
      const p = landmarks[idx];
      if (p && (p.visibility ?? 1) > 0.35) {
        ctx.beginPath();
        // Nose point (face center) highlighted with cyan or amber if drowsy
        if (idx === 0) {
          ctx.fillStyle = isDrowsy ? "#f59e0b" : "#06b6d4";
          ctx.arc((1 - p.x) * w, p.y * h, isDrowsy ? 7 : 5, 0, 2 * Math.PI);
        } else {
          ctx.fillStyle = isDrowsy ? "#f59e0b" : isSitting ? "#10b981" : "#f59e0b";
          ctx.arc((1 - p.x) * w, p.y * h, 4, 0, 2 * Math.PI);
        }
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // If drowsy, draw a warning indicator banner on the canvas
    if (isDrowsy) {
      ctx.fillStyle = "rgba(245, 158, 11, 0.9)";
      ctx.roundRect(10, 10, w - 20, 26, 6);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("⚠️ DROWSINESS ALERT: EYES CLOSED > 5s", w / 2, 27);
    }
  }, [landmarks, showPreview, poseState, drowsinessState, videoRef]);

  if (!isCameraActive) return null;

  const isDrowsy = Boolean(drowsinessState?.isDrowsy);

  return (
    <div className="rounded-xl border bg-card/70 p-3 space-y-2.5 shadow-xs transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-xs font-semibold">Webcam Live Preview</span>
          <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 gap-1">
            <Sparkles className="h-2.5 w-2.5" /> Real-time Pose & Eyes
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs gap-1"
            onClick={() => setShowPreview((prev) => !prev)}
          >
            {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPreview ? "Hide" : "Show"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-destructive hover:text-destructive gap-1"
            onClick={onDisableCamera}
          >
            <CameraOff className="h-3.5 w-3.5" />
            Disable
          </Button>
        </div>
      </div>

      {showPreview && (
        <div className={`relative rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center border shadow-inner transition-all ${
          isDrowsy ? "ring-4 ring-amber-500 ring-offset-2 ring-offset-background animate-pulse" : ""
        }`}>
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            onLoadedMetadata={(e) => {
              const vid = e.currentTarget;
              vid.play().catch((err) => console.warn("Video autoPlay error:", err));
            }}
            className="w-full h-full object-cover scale-x-[-1]"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Drowsiness Banner Overlay (Fires only after >= 5.0s of closed eyes) */}
          {isDrowsy && (
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-md bg-amber-500/95 text-white text-xs font-semibold backdrop-blur-sm shadow-md animate-bounce border border-amber-300/50">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Drowsiness Alert: Eyes Closed &gt; 5s!
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Wake Up
              </span>
            </div>
          )}

          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] text-white/95 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-xs border border-white/10">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>Private • Local Browser Processing</span>
          </div>

          {drowsinessState && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 text-[10px] text-white/95 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-xs border border-white/10 font-mono">
              {drowsinessState.isDrowsy ? (
                <span className="text-amber-400 font-bold">⚠️ Drowsy ({drowsinessState.eyesClosedDurationSec}s)</span>
              ) : drowsinessState.eyesClosed ? (
                <span className="text-amber-300">⏳ Eyes: {drowsinessState.eyesClosedDurationSec}s/5s</span>
              ) : (
                <span className="text-emerald-400">👀 Eyes Open ({drowsinessState.alertnessScore}%)</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
