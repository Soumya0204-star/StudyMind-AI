import { useState } from "react";
import AppNavbar from "@/components/layout/AppNavbar";
import CareerSimulatorView from "@/components/career/CareerSimulatorView";
import CareerBossBattleView from "@/components/career/CareerBossBattleView";
import CareerFailureMapView from "@/components/career/CareerFailureMapView";
import CareerSwitchCostView from "@/components/career/CareerSwitchCostView";
import CareerCompareView from "@/components/career/CareerCompareView";
import ProgressProofView from "@/components/career/ProgressProofView";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Flame,
  AlertTriangle,
  Shuffle,
  Scale,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function CareerSimulator() {
  const [activeTab, setActiveTab] = useState<
    "simulator" | "boss-battle" | "failure-map" | "switch-cost" | "compare" | "proof"
  >("simulator");

  const tabs = [
    { id: "simulator", label: "Crash Simulator", icon: Rocket, badge: "Interactive" },
    { id: "boss-battle", label: "Career Boss Battle", icon: Flame, badge: "Live Incident" },
    { id: "failure-map", label: "Career Failure Map", icon: AlertTriangle, badge: "Bottlenecks" },
    { id: "switch-cost", label: "Switch Cost Analyzer", icon: Shuffle, badge: "Transferable" },
    { id: "compare", label: "Path Comparison", icon: Scale, badge: "Trade-Offs" },
    { id: "proof", label: "Proof of Progress", icon: TrendingUp, badge: "Before & After" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <AppNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Command Center Subheader */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="outline"
                className="text-[11px] font-medium py-0.5 px-2.5 gap-1.5 border-primary/30 text-primary bg-primary/10"
              >
                <Sparkles className="h-3 w-3" /> Career Reality & Simulation Infrastructure
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px]">
                Closed-Loop Engine
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Career Crash Simulator
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Experience the authentic work, expose preparation failure points, and eliminate bottlenecks before placement season.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-muted-foreground font-mono bg-card/60 px-3.5 py-2 rounded-xl border border-border/50">
            <span className="text-primary font-bold">Loop:</span>
            <span>Simulate</span>
            <span>→</span>
            <span>Expose Failure</span>
            <span>→</span>
            <span>Cognitive Fix</span>
            <span>→</span>
            <span className="text-emerald-500 font-bold">Prove Readiness</span>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-border/30">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Rendering */}
        <div className="animate-in fade-in duration-300">
          {activeTab === "simulator" && <CareerSimulatorView />}
          {activeTab === "boss-battle" && <CareerBossBattleView />}
          {activeTab === "failure-map" && <CareerFailureMapView />}
          {activeTab === "switch-cost" && <CareerSwitchCostView />}
          {activeTab === "compare" && <CareerCompareView />}
          {activeTab === "proof" && <ProgressProofView />}
        </div>
      </main>
    </div>
  );
}
