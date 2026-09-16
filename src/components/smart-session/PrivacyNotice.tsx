import { ShieldCheck } from "lucide-react";

export default function PrivacyNotice({ className = "" }: { className?: string }) {
  return (
    <div className={`p-3 rounded-lg bg-muted/50 border text-xs text-muted-foreground flex items-start gap-2.5 ${className}`}>
      <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-foreground">100% On-Device Privacy: </span>
        Smart Monitoring processes webcam video completely inside your browser to estimate presence.
        StudyMind never records, stores, or transmits your video or facial images.
      </div>
    </div>
  );
}
