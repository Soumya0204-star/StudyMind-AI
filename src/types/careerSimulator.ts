export type CareerRoleId =
  | "ai-ml-engineer"
  | "fullstack-engineer"
  | "cybersecurity-analyst"
  | "data-analyst"
  | "cloud-devops"
  | "product-manager";

export interface CareerRole {
  id: CareerRoleId;
  title: string;
  badge: string;
  tagline: string;
  avgSalary: string;
  marketDemand: string;
  accentColor: string;
  iconName: string;
  description: string;
  coreCompetencies: string[];
}

export interface MicroTask {
  id: string;
  title: string;
  category: "Code Analysis" | "System Architecture" | "Data & Stats" | "Practical Debugging";
  scenario: string;
  codeSnippet?: string;
  options: {
    id: string;
    text: string;
    explanation: string;
    isCorrect: boolean;
  }[];
}

export interface WorkScenario {
  id: string;
  title: string;
  urgency: "High" | "Critical" | "P1 Incident";
  briefing: string;
  telemetrySnippet: string;
  hypotheses: {
    id: string;
    label: string;
    diagnosis: string;
    remediationAction: string;
    isCorrect: boolean;
    tradeoffs: string;
  }[];
}

export interface StressCurveball {
  id: string;
  title: string;
  timeLimitSeconds: number;
  triggerMessage: string;
  unexpectedCondition: string;
  choices: {
    id: string;
    text: string;
    impact: string;
    score: number;
  }[];
}

export interface RealityScoreEvidence {
  conceptualFoundation: number; // 0-100
  practicalDebugging: number; // 0-100
  problemSolving: number; // 0-100
  technicalCommunication: number; // 0-100
  timePressureResilience: number; // 0-100
  overallReadiness: "High Match" | "Moderate Progression" | "Critical Skill Gaps";
  evidenceGaps: {
    skill: string;
    severity: "High" | "Medium" | "Critical";
    description: string;
    recommendedTechnique: "feynman" | "active-recall" | "study-plan";
    studyTopic: string;
  }[];
  recommendedNextExperiment: string;
}

export interface CareerSimulationDataset {
  role: CareerRole;
  stage1MicroTasks: MicroTask[];
  stage2Scenario: WorkScenario;
  stage3Curveball: StressCurveball;
  defaultRealityEvidence: RealityScoreEvidence;
}

export interface CareerFailurePoint {
  id: string;
  title: string;
  roleId: CareerRoleId;
  severity: "Critical Bottleneck" | "High Probability" | "Moderate Friction";
  rootCause: string;
  placementImpact: string;
  triggerSymptom: string;
  studyMindIntervention: {
    technique: "feynman" | "active-recall" | "study-plan";
    topic: string;
    interventionPlan: string;
    expectedImprovement: string;
  };
}

export interface CareerSwitchCostProfile {
  id: string;
  currentRole: string;
  targetRole: string;
  sourceRoleId: string;
  targetRoleId: CareerRoleId;
  transferablePercentage: number;
  transferableSkills: {
    skill: string;
    howItApplies: string;
  }[];
  missingFoundations: {
    skill: string;
    estimatedHours: number;
    difficulty: "Moderate" | "Steep" | "High";
  }[];
  totalEstimatedWeeks: number;
  learningWorkloadBar: number; // percentage of 100
  switchRecommendation: string;
}

export interface BossBattleIncident {
  id: string;
  roleId: CareerRoleId;
  title: string;
  threatLevel: "CODE RED" | "SEV-1 OUTAGE" | "ACTIVE EXFILTRATION" | "REVENUE ANOMALY";
  environment: string;
  situation: string;
  initialLogs: string[];
  telemetryData: {
    time: string;
    metric1: number; // e.g. latency or loss
    metric2: number; // e.g. cpu or drift
    metric3: number; // e.g. errors or drop
  }[];
  metricLabels: [string, string, string];
  diagnosticActions: {
    id: string;
    actionLabel: string;
    discoveredLog: string;
    revealedHint: string;
  }[];
  mitigationOptions: {
    id: string;
    title: string;
    description: string;
    isOptimal: boolean;
    consequence: string;
  }[];
  postMortemPrompt: string;
}

export interface CareerComparisonPair {
  id: string;
  roleA: CareerRole;
  roleB: CareerRole;
  dimensionComparisons: {
    dimension: string;
    roleANote: string;
    roleBNote: string;
    verdict: string;
  }[];
  commonMistake: string;
  clarifyingQuestion: string;
}
