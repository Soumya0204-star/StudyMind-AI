import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Flame, TrendingUp, Sparkles } from "lucide-react";
import { formatDuration } from "@/hooks/useStudySessions";

interface Props {
  progress: number;
  completedCount: number;
  totalTasks: number;
  todayTaskCount: number;
  todayStudyTime: number;
  todayActiveStudyTime?: number;
  weekStudyTime: number;
  currentStreak: number;
}

export default function StatsCards({
  progress,
  completedCount,
  totalTasks,
  todayTaskCount,
  todayStudyTime,
  todayActiveStudyTime,
  weekStudyTime,
  currentStreak,
}: Props) {
  const displayStudyTime =
    todayActiveStudyTime !== undefined && todayActiveStudyTime > 0
      ? formatDuration(todayActiveStudyTime)
      : formatDuration(todayStudyTime);

  const hasSmartBreakdown =
    todayActiveStudyTime !== undefined &&
    todayStudyTime > 0 &&
    todayActiveStudyTime < todayStudyTime;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Overall Progress</span>
            </div>
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1.5">
            {completedCount} of {totalTasks} tasks completed
          </p>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Today's Tasks",
            value: `${todayTaskCount}`,
            icon: Calendar,
            color: "text-[hsl(var(--warning))]",
            bg: "bg-[hsl(var(--warning))]/10",
          },
          {
            label: hasSmartBreakdown ? "Active Study (Today)" : "Today Study",
            value: displayStudyTime,
            subtext: hasSmartBreakdown ? `Total: ${formatDuration(todayStudyTime)}` : undefined,
            icon: Clock,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "This Week",
            value: formatDuration(weekStudyTime),
            icon: Clock,
            color: "text-[hsl(var(--success))]",
            bg: "bg-[hsl(var(--success))]/10",
          },
          {
            label: "Streak",
            value: `${currentStreak}🔥`,
            icon: Flame,
            color: "text-[hsl(var(--warning))]",
            bg: "bg-[hsl(var(--warning))]/10",
          },
        ].map((s) => (
          <Card key={s.label} className="overflow-hidden">
            <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
              <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${s.bg}`}>
                <s.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{s.label}</p>
                <p className="text-sm sm:text-lg font-bold leading-tight truncate">{s.value}</p>
                {s.subtext && (
                  <p className="text-[10px] text-muted-foreground truncate font-mono mt-0.5">
                    {s.subtext}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
