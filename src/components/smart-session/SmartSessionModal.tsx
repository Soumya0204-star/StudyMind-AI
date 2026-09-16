import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Play, CheckCircle2, PauseCircle } from "lucide-react";
import PrivacyNotice from "./PrivacyNotice";
import { alertSoundService } from "@/services/alertSoundService";

interface SmartSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (enableMonitoring: boolean) => void;
  subject?: string;
}

export default function SmartSessionModal({
  open,
  onOpenChange,
  onConfirm,
  subject,
}: SmartSessionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Camera className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl">Enable Smart Session Monitoring?</DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            {subject ? `Starting session for ${subject}. ` : "Starting study session. "}
            StudyMind can intelligently pause and resume your timer by detecting your presence at your desk.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 shrink-0" />
              <span>
                <strong>Pose-aware focus:</strong> Automatically pauses when you stand up and leave.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <PauseCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>
                <strong>Auto-resume:</strong> Resumes automatically as soon as you sit back down.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--warning))] mt-0.5 shrink-0" />
              <span>
                <strong>Adaptive calibration:</strong> Feeds actual active study time into your study plan.
              </span>
            </div>
          </div>

          <PrivacyNotice />
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              alertSoundService.unlockAudio();
              onOpenChange(false);
              onConfirm(false);
            }}
            className="w-full sm:w-auto"
          >
            <Play className="h-4 w-4" />
            Continue Without Webcam
          </Button>
          <Button
            onClick={() => {
              alertSoundService.unlockAudio();
              onOpenChange(false);
              onConfirm(true);
            }}
            className="w-full sm:w-auto gap-2"
          >
            <Camera className="h-4 w-4" />
            Enable Webcam Monitoring
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
