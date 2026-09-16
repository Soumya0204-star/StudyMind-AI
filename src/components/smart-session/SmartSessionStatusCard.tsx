import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SessionMonitoringState, DrowsinessTelemetry } from "@/types/smartMonitoring";
import { formatDuration } from "@/hooks/useStudySessions";
import { alertSoundService, AlarmSoundType } from "@/services/alertSoundService";
import {
  Sparkles,
  Pause,
  Play,
  UserCheck,
  UserX,
  AlertCircle,
  Activity,
  Radio,
  Eye,
  ShieldCheck,
  Volume2,
  VolumeX,
  BellRing,
  AlertTriangle,
  Zap,
} from "lucide-react";

interface SmartSessionStatusCardProps {
  monitoringState: SessionMonitoringState;
  activeDuration: number;
  pausedDuration: number;
  pauseEvents: number;
  presenceRatio: number;
  gracePeriodRemaining: number | null;
  pauseReason: string | null;
  drowsinessState?: DrowsinessTelemetry | null;
  drowsinessEvents?: number;
  onResumeManually: () => void;
}

export default function SmartSessionStatusCard({
  monitoringState,
  activeDuration,
  pausedDuration,
  pauseEvents,
  presenceRatio,
  gracePeriodRemaining,
  pauseReason,
  drowsinessState,
  drowsinessEvents = 0,
  onResumeManually,
}: SmartSessionStatusCardProps) {
  const [soundEnabled, setSoundEnabled] = useState(alertSoundService.isSoundEnabled());
  const [alarmTone, setAlarmTone] = useState<AlarmSoundType>(alertSoundService.getAlarmType());
  const [dismissedDrowsy, setDismissedDrowsy] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    alertSoundService.setSoundEnabled(next);
    if (next) {
      alertSoundService.playSuccessChime();
    }
  };

  const handleToneChange = (tone: AlarmSoundType) => {
    setAlarmTone(tone);
    alertSoundService.setAlarmType(tone);
    alertSoundService.unlockAudio();
    alertSoundService.playAlarmBurst(true);
  };

  const handleTestSound = () => {
    alertSoundService.unlockAudio();
    alertSoundService.playAlarmBurst(true);
  };

  const handleDismissDrowsy = () => {
    setDismissedDrowsy(true);
    alertSoundService.stopAlarm();
    alertSoundService.playSuccessChime();
  };
  const getStatusBadge = () => {
    switch (monitoringState) {
      case "ACTIVE":
        return {
          icon: UserCheck,
          text: "Seated — Verified Active",
          className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 animate-pulse",
        };
      case "STANDING_DETECTED":
        return {
          icon: AlertCircle,
          text: `Movement Detected — ${gracePeriodRemaining ?? 5}s grace`,
          className: "bg-amber-500/15 text-amber-600 border-amber-500/30 animate-bounce",
        };
      case "PAUSED":
        return {
          icon: Pause,
          text: "Paused — Student Away",
          className: "bg-destructive/15 text-destructive border-destructive/30",
        };
      case "RETURN_DETECTED":
        return {
          icon: Radio,
          text: "Return Detected — Resuming...",
          className: "bg-primary/15 text-primary border-primary/30 animate-pulse",
        };
      case "WEBCAM_DENIED":
      case "WEBCAM_DISABLED":
      case "DETECTION_ERROR":
        return {
          icon: UserX,
          text: "Monitoring Inactive (Standard Timer)",
          className: "bg-muted text-muted-foreground border-muted",
        };
      default:
        return {
          icon: Sparkles,
          text: "Initializing Vision...",
          className: "bg-muted text-muted-foreground",
        };
    }
  };

  const status = getStatusBadge();
  const StatusIcon = status.icon;
  const isPaused = monitoringState === "PAUSED";

  // 20-20-20 Digital Eye Wellness reminder: triggers when active study exceeds 20 minutes (1200 seconds)
  const isEyeBreakDue = activeDuration > 0 && activeDuration % 1200 <= 60 && activeDuration >= 1200;

  // Reset dismissal once student sits back up and is no longer drowsy
  if (!drowsinessState?.isDrowsy && dismissedDrowsy) {
    setDismissedDrowsy(false);
  }

  const isDrowsyActive = Boolean(drowsinessState?.isDrowsy && !dismissedDrowsy);
  const alertnessScore = drowsinessState?.alertnessScore ?? 100;

  return (
    <div className="space-y-3">
      {/* Real-time Drowsiness & Eyes Closed Alert Banner (Only fires after >= 5.0s of closed eyes) */}
      {isDrowsyActive && (
        <Card className="border-amber-500/60 bg-amber-500/15 shadow-md animate-in fade-in zoom-in-95 ring-2 ring-amber-500/30">
          <CardContent className="p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-500/25 text-amber-600 shrink-0 animate-bounce">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-1.5">
                    <span>⚠️ Drowsiness Alert: Eyes Closed &gt; 5 Seconds!</span>
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0 animate-pulse">
                      Microsleep Detected
                    </Badge>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {drowsinessState?.alertMessage || `Eyes remained closed for ${drowsinessState?.eyesClosedDurationSec ?? 5} seconds. Sit upright, stretch, or take a quick sip of water to refocus.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button
                  size="sm"
                  onClick={handleDismissDrowsy}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 px-3 gap-1 shadow-sm font-semibold"
                >
                  <Zap className="h-3.5 w-3.5" />
                  I'm Awake / Dismiss Alarm
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-amber-500/20 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSound}
                  className="h-7 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                >
                  {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-emerald-500" /> : <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />}
                  <span>Alert: {soundEnabled ? "ON" : "Muted"}</span>
                </Button>

                {/* Alarm Tone Chooser */}
                <div className="flex items-center gap-1 bg-background/60 p-0.5 rounded-md border border-amber-500/20 text-[10px]">
                  <button
                    onClick={() => handleToneChange("DIGITAL_CLOCK")}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      alarmTone === "DIGITAL_CLOCK" ? "bg-amber-500 text-white font-bold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    ⏰ Clock Beep
                  </button>
                  <button
                    onClick={() => handleToneChange("SIREN")}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      alarmTone === "SIREN" ? "bg-amber-500 text-white font-bold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    🚨 Siren
                  </button>
                  <button
                    onClick={() => handleToneChange("CHIME")}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      alarmTone === "CHIME" ? "bg-amber-500 text-white font-bold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    🔔 Chime
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestSound}
                  className="h-7 px-2 text-[11px] gap-1 text-primary hover:text-primary bg-background/80"
                >
                  <BellRing className="h-3 w-3" />
                  Test Alarm Sound
                </Button>
              </div>

              <span className="text-[11px] text-muted-foreground">
                Alertness Score: <strong className="text-amber-600">{alertnessScore}%</strong>
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Eyes Closed Countdown Tracker (< 5 seconds) */}
      {drowsinessState?.eyesClosed && !isDrowsyActive && (
        <Card className="border-amber-500/30 bg-amber-500/10 animate-in fade-in">
          <CardContent className="p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium">
              <Eye className="h-4 w-4 animate-pulse" />
              <span>Eyes Closed: {drowsinessState.eyesClosedDurationSec}s / 5.0s</span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              Drowsiness alert will only fire if closed &gt; 5.0s
            </span>
          </CardContent>
        </Card>
      )}

      {/* Eye Strain Alert (20-20-20 Rule for Digital Wellbeing) */}
      {isEyeBreakDue && (
        <Card className="border-blue-500/30 bg-blue-500/10 animate-in fade-in">
          <CardContent className="p-3 flex items-center gap-2.5 text-xs text-foreground">
            <Eye className="h-4 w-4 text-blue-500 shrink-0 animate-pulse" />
            <div className="min-w-0">
              <span className="font-semibold block text-blue-600">20-20-20 Eye Wellness Break:</span>
              <span>You've focused for 20 minutes. Look at an object 20 feet away for 20 seconds to prevent digital eye strain.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prominent Pause Banner when Session is Paused */}
      {isPaused && (
        <Card className="border-destructive/40 bg-destructive/10 animate-in fade-in zoom-in-95">
          <CardContent className="p-4 space-y-3 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-destructive/20 text-destructive shrink-0">
                  <Pause className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground">Study Session Paused</h4>
                  <p className="text-xs text-muted-foreground">
                    {pauseReason || "Student stepped away from study position."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" onClick={onResumeManually} className="gap-1.5 shadow-sm text-xs">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Resume Manually
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-destructive/20 text-xs">
              <div>
                <span className="text-muted-foreground">Verified Active Study: </span>
                <span className="font-semibold text-foreground">{formatDuration(activeDuration)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Away Duration: </span>
                <span className="font-semibold text-destructive">{formatDuration(pausedDuration)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Status Card */}
      <Card className="border-primary/20 bg-card/80">
        <CardContent className="p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Verified Smart Session
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestSound}
                className="h-6 px-2 text-[10px] gap-1 text-primary border-primary/30 hover:bg-primary/10"
                title="Test wake-up alarm sound"
              >
                <BellRing className="h-3 w-3" />
                <span>Test Alarm</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSound}
                className="h-6 px-1.5 text-[10px] gap-1 text-muted-foreground"
                title="Toggle Drowsiness Audio Alarm"
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-emerald-500" /> : <VolumeX className="h-3.5 w-3.5" />}
              </Button>
              <Badge variant="outline" className={`text-[11px] font-medium px-2.5 py-0.5 ${status.className}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.text}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1 border-t text-center">
            <div className="p-2 rounded-lg bg-primary/5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Verified Active</p>
              <p className="text-sm font-bold text-primary font-mono tabular-nums mt-0.5">
                {formatDuration(activeDuration)}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-muted/40">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Paused / Away</p>
              <p className="text-sm font-bold text-muted-foreground font-mono tabular-nums mt-0.5">
                {formatDuration(pausedDuration)}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Presence Rate</p>
              <p className="text-sm font-bold text-emerald-600 font-mono tabular-nums mt-0.5">
                {Math.round(presenceRatio * 100)}%
              </p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/5">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Alertness</p>
              <p className={`text-sm font-bold font-mono tabular-nums mt-0.5 ${alertnessScore < 70 ? "text-amber-600" : "text-emerald-600"}`}>
                {alertnessScore}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
