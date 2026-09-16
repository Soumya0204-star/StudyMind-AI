import {
  CareerRole,
  CareerSimulationDataset,
  CareerFailurePoint,
  CareerSwitchCostProfile,
  BossBattleIncident,
  CareerComparisonPair,
} from "@/types/careerSimulator";

export const CAREER_ROLES: CareerRole[] = [
  {
    id: "ai-ml-engineer",
    title: "AI / ML Engineer",
    badge: "High Math & Systems",
    tagline: "Build, debug, and scale production predictive models and neural pipelines",
    avgSalary: "$125,000 - $185,000",
    marketDemand: "Extreme (42% YoY Growth)",
    accentColor: "from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30",
    iconName: "BrainCircuit",
    description:
      "Combines mathematical foundations (linear algebra, probability), Python engineering, PyTorch/TensorFlow, and ML infrastructure (MLOps, data drift, deployment latency).",
    coreCompetencies: [
      "Vectorized Python & PyTorch",
      "Model Debugging & Drift Diagnostics",
      "Feature Engineering Pipelines",
      "Evaluation Metrics (AUC-ROC, F1, Loss Divergence)",
      "Serving & Latency Constraints",
    ],
  },
  {
    id: "fullstack-engineer",
    title: "Full Stack Software Engineer",
    badge: "Core Industry Backbone",
    tagline: "Architect scalable backend services, performant APIs, and responsive frontends",
    avgSalary: "$105,000 - $160,000",
    marketDemand: "Very High (Consistently #1 Campus Volume)",
    accentColor: "from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/30",
    iconName: "Code2",
    description:
      "Builds robust end-to-end architectures: relational schemas, concurrency, caching, REST/GraphQL APIs, microservices, and reactive UI frameworks.",
    coreCompetencies: [
      "Data Structures & Algorithmic Complexity",
      "Database Indexing & Query Profiling",
      "Concurrency & Race Condition Mitigation",
      "API Reliability & Distributed Systems",
      "State Management & Browser Lifecycle",
    ],
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    badge: "Zero-Trust Defense",
    tagline: "Detect intrusion vectors, audit vulnerability surfaces, and orchestrate incident triage",
    avgSalary: "$110,000 - $165,000",
    marketDemand: "Critical Shortage (3.5M unfilled global roles)",
    accentColor: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    iconName: "ShieldAlert",
    description:
      "Analyzes network anomalies, packet captures, SIEM telemetry, cryptography implementations, authentication vectors, and adversary tactics (MITRE ATT&CK).",
    coreCompetencies: [
      "Network Protocol Telemetry (TCP/IP, TLS)",
      "Log Auditing & SIEM Alert Triaging",
      "Vulnerability Identification & Penetration Mechanics",
      "Privilege Escalation Containment",
      "Incident Response & Forensic Defense",
    ],
  },
  {
    id: "data-analyst",
    title: "Data Analyst / Analytics Engineer",
    badge: "Business Intelligence",
    tagline: "Transform messy transactional data into actionable commercial decision models",
    avgSalary: "$85,000 - $130,000",
    marketDemand: "High Across Enterprise Verticals",
    accentColor: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
    iconName: "BarChart3",
    description:
      "Dissects multi-table data warehouses, formulates statistical hypothesis tests, detects metric decay anomalies, and builds executive operational dashboards.",
    coreCompetencies: [
      "Advanced SQL (Window functions, CTEs, self-joins)",
      "Statistical Significance & A/B Test Power",
      "Cohort & Retention Decoupling",
      "Data Warehouse Modeling (Star/Snowflake)",
      "Data Storytelling & Executive Communication",
    ],
  },
  {
    id: "cloud-devops",
    title: "Cloud & DevOps Engineer",
    badge: "Infrastructure & SRE",
    tagline: "Orchestrate automated CI/CD pipelines, Kubernetes clusters, and zero-downtime scale",
    avgSalary: "$118,000 - $175,000",
    marketDemand: "Very High (Cloud Migration Acceleration)",
    accentColor: "from-sky-500/20 to-blue-500/10 text-sky-400 border-sky-500/30",
    iconName: "CloudLightning",
    description:
      "Automates infrastructure as code (Terraform), manages container orchestrators (Kubernetes), observability pipelines, and disaster recovery architectures.",
    coreCompetencies: [
      "Container Orchestration & Pod Lifecycle",
      "CI/CD Pipeline Security & Automation",
      "Cloud Networking (VPC, Subnets, Gateways)",
      "Distributed Telemetry & SRE Error Budgets",
      "Linux Kernel Performance & I/O Tuning",
    ],
  },
  {
    id: "product-manager",
    title: "Technical Product Manager",
    badge: "Strategy & Execution",
    tagline: "Define product vision, synthesize user analytics, and prioritize engineering roadmaps",
    avgSalary: "$120,000 - $170,000",
    marketDemand: "Selective / Highly Competitive",
    accentColor: "from-pink-500/20 to-rose-500/10 text-pink-400 border-pink-500/30",
    iconName: "Layers",
    description:
      "Bridges technical feasibility, commercial market viabilities, and user experience metrics to drive shipping velocity and customer retention.",
    coreCompetencies: [
      "Product Metric Frameworks (North Star, LTV/CAC)",
      "Feature Prioritization (RICE, Kano Model)",
      "User Cohort Friction Identification",
      "Technical Trade-off Evaluation",
      "Cross-functional Stakeholder Alignment",
    ],
  },
];

export const SIMULATION_DATASETS: Record<string, CareerSimulationDataset> = {
  "ai-ml-engineer": {
    role: CAREER_ROLES[0],
    stage1MicroTasks: [
      {
        id: "ai-task-1",
        title: "Tensor Shape & Loss Divergence Audit",
        category: "Practical Debugging",
        scenario:
          "During neural network batch training, cross-entropy loss suddenly outputs 'NaN' after epoch 4. You inspect the forward pass:",
        codeSnippet: `def forward(self, x):
    # x shape: [batch_size, 128]
    hidden = torch.relu(self.fc1(x))
    logits = self.fc2(hidden)
    # Output layer:
    probs = torch.softmax(logits, dim=-1)
    # Custom loss computation:
    loss = -torch.sum(targets * torch.log(probs))
    return loss`,
        options: [
          {
            id: "opt-1",
            text: "Add torch.clamp(probs, min=1e-7, max=1.0) or use nn.CrossEntropyLoss with raw logits to prevent log(0) numeric underflow.",
            explanation:
              "Accurate. When softmax generates exact zero or near-zero probabilities for certain classes, torch.log(0) returns -infinity, immediately poisoning weights into NaN.",
            isCorrect: true,
          },
          {
            id: "opt-2",
            text: "Increase the learning rate by 10x to skip over zero-loss local minima.",
            explanation: "Incorrect. Increasing the learning rate will worsen gradient explosion.",
            isCorrect: false,
          },
          {
            id: "opt-3",
            text: "Replace ReLU activation with pure Linear activation.",
            explanation: "Incorrect. Linear activations remove non-linear expressive power.",
            isCorrect: false,
          },
        ],
      },
      {
        id: "ai-task-2",
        title: "Evaluation Metric Imbalance Trap",
        category: "Data & Stats",
        scenario:
          "A fraud detection model reports 99.2% accuracy on validation data. However, in production, fraudulent transactions are routinely passing through undetected. What is happening?",
        options: [
          {
            id: "opt-a",
            text: "Extreme class imbalance: 99.5% of transactions are legitimate. A dummy model guessing 'Legitimate' 100% of the time gets 99.5% accuracy with 0% Recall.",
            explanation:
              "Correct. Accuracy is a deceptive metric on skewed datasets. Precision-Recall AUC or F1 score calibrated to minority class recall must be evaluated.",
            isCorrect: true,
          },
          {
            id: "opt-b",
            text: "The model is suffering from excessive regularization.",
            explanation: "Incorrect. Regularization does not disguise undetected fraudulent transactions.",
            isCorrect: false,
          },
          {
            id: "opt-c",
            text: "GPU memory caching is corrupting inference tensors.",
            explanation: "Incorrect. Hardware caching does not cause mathematical class imbalance masking.",
            isCorrect: false,
          },
        ],
      },
    ],
    stage2Scenario: {
      id: "ai-scen-1",
      title: "The Production Model Accuracy Collapse",
      urgency: "Critical",
      briefing:
        "Your loan default classification model achieved 91.4% accuracy during offline testing in September. Last night, the model went live in production. By morning, real-world accuracy dropped precipitously to 67.2%. The VP of Risk has frozen approvals. You must diagnose and isolate the root cause.",
      telemetrySnippet: `[METRICS MONITOR]
Offline Test Dataset: Mean user age = 34.2, Mean income = $72,500, Feature 'prior_delinquencies' correlated r=0.88 with target.
Production Stream (Last 12h): Mean user age = 22.1, Mean income = $29,100.
Feature Importance Shift: 'prior_delinquencies' importance dropped by 74%.
Distribution Drift (Wasserstein distance): 0.48 (Severe Drift Alert).`,
      hypotheses: [
        {
          id: "hyp-1",
          label: "Covariate / Distribution Shift (Demographic Discrepancy)",
          diagnosis:
            "The offline model was trained predominantly on established mid-career prime borrowers. The marketing team launched a university student campaign overnight, bombarding the pipeline with thin-credit borrowers with no prior history.",
          remediationAction:
            "Segment inference by borrower credit profile; route new-to-credit demographic to an alternative rule-based/alternative-data risk engine while retraining with active domain adaptation.",
          isCorrect: true,
          tradeoffs: "Requires marketing pause or secondary credit policy; model cannot magically generalize to unrepresented distributions.",
        },
        {
          id: "hyp-2",
          label: "Hardware Quantization Precision Loss",
          diagnosis: "Converting float32 weights to INT8 on the inference server truncated small weights.",
          remediationAction: "Revert back to 32-bit floating point inference across all worker instances.",
          isCorrect: false,
          tradeoffs: "Does not explain the massive shift in borrower demographics and age distributions.",
        },
        {
          id: "hyp-3",
          label: "Overfitting on Validation Epochs",
          diagnosis: "The model trained for 100 extra epochs causing memorization.",
          remediationAction: "Apply dropout 0.5 to all dense layers.",
          isCorrect: false,
          tradeoffs: "Does not address the live input stream demographic shift.",
        },
      ],
    },
    stage3Curveball: {
      id: "ai-curve-1",
      title: "Streaming Pipeline Corruption Incident",
      timeLimitSeconds: 180,
      triggerMessage: "⚠️ LIVE PIPELINE ALERT: Upstream data provider updated JSON schema without notice.",
      unexpectedCondition:
        "38% of incoming transaction records now contain NULL in 'account_balance_ratio', causing model inference workers to throw unhandled exceptions and drop requests.",
      choices: [
        {
          id: "cb-1",
          text: "Implement graceful imputation using historic customer median with fallback flag, and route high-uncertainty scores to human review queue.",
          impact: "Zero crash downtime, preserves audit trail, maintains acceptable inference SLA.",
          score: 95,
        },
        {
          id: "cb-2",
          text: "Drop all rows with null values silently and only score remaining complete rows.",
          impact: "Rejects 38% of legitimate customers, triggering severe customer support backlash.",
          score: 40,
        },
        {
          id: "cb-3",
          text: "Hardcode null values to zero without checking feature distribution effects.",
          impact: "Distorts risk probability by treating null balance as bankrupt zero balance, causing mass wrongful rejections.",
          score: 25,
        },
      ],
    },
    defaultRealityEvidence: {
      conceptualFoundation: 84,
      practicalDebugging: 48,
      problemSolving: 72,
      technicalCommunication: 65,
      timePressureResilience: 58,
      overallReadiness: "Moderate Progression",
      evidenceGaps: [
        {
          skill: "Production Data Drift & Validation",
          severity: "Critical",
          description: "Struggled with detecting covariate shift versus feature corruption under live production conditions.",
          recommendedTechnique: "feynman",
          studyTopic: "Covariate Shift and Population Drift in Machine Learning Systems",
        },
        {
          skill: "Loss Underflow & Numerical Stability",
          severity: "High",
          description: "Hesitated on float precision mechanics and custom loss function log-softmax stabilization.",
          recommendedTechnique: "active-recall",
          studyTopic: "Numerical Stability in Deep Learning: Softmax and Cross-Entropy Mechanics",
        },
      ],
      recommendedNextExperiment:
        "Build a lightweight drift detection pipeline using Evidently AI or Kolmogorov-Smirnov statistical testing on a synthetic noisy dataset.",
    },
  },

  "fullstack-engineer": {
    role: CAREER_ROLES[1],
    stage1MicroTasks: [
      {
        id: "fs-task-1",
        title: "Database N+1 Query & Transaction Lockout",
        category: "System Architecture",
        scenario:
          "The users dashboard query takes 4.8 seconds to load for 200 items. Profiling logs show 201 distinct SELECT queries executed in a single request:",
        codeSnippet: `// Controller logic:
const users = await db.users.findMany({ where: { active: true } });
for (const user of users) {
  user.orders = await db.orders.findMany({ where: { userId: user.id } });
  user.tier = await db.tiers.findFirst({ where: { id: user.tierId } });
}`,
        options: [
          {
            id: "fs-opt-1",
            text: "Refactor with Eager Loading (JOIN or batch 'IN' query) and add composite index on (user_id, created_at) to consolidate 201 queries into 2.",
            explanation:
              "Correct! The classic N+1 query problem is solved by eager loading associations in bulk, drastically cutting network latency overhead.",
            isCorrect: true,
          },
          {
            id: "fs-opt-2",
            text: "Wrap the loop in Promise.all() to run all 200 queries concurrently against the database.",
            explanation:
              "Dangerous. Running 200 queries concurrently exhausts the database connection pool and causes connection timeouts.",
            isCorrect: false,
          },
          {
            id: "fs-opt-3",
            text: "Increase the client request timeout in the frontend fetch wrapper.",
            explanation: "Incorrect. Masking slow latency does not fix server scalability.",
            isCorrect: false,
          },
        ],
      },
      {
        id: "fs-task-2",
        title: "Frontend State Mutation & Race Condition",
        category: "Code Analysis",
        scenario:
          "Users clicking 'Add to Cart' rapidly report that the total item counter displays an incorrect stale count. What is the root cause?",
        codeSnippet: `const handleAddToCart = () => {
  setCartCount(cartCount + 1);
  syncWithBackend(cartCount + 1);
};`,
        options: [
          {
            id: "fs-opt-a",
            text: "Stale state closure: setCartCount must use a functional updater setCartCount(prev => prev + 1) or manage state via atomic reducer/optimistic locking.",
            explanation:
              "Correct! React state updates within the same event cycle close over the stale render variable instead of reading the latest atomic state.",
            isCorrect: true,
          },
          {
            id: "fs-opt-b",
            text: "The button should be made synchronous with a while(true) busy wait.",
            explanation: "Incorrect. That locks the browser UI thread completely.",
            isCorrect: false,
          },
          {
            id: "fs-opt-c",
            text: "React 18 has a bug with integer numbers.",
            explanation: "Nonsense.",
            isCorrect: false,
          },
        ],
      },
    ],
    stage2Scenario: {
      id: "fs-scen-1",
      title: "Production API Latency Spiked 300% & Memory Leak Outage",
      urgency: "P1 Incident",
      briefing:
        "At 14:00, API p99 latency spiked from 140ms to 4,200ms. Node.js backend pods are restarting every 12 minutes due to Out-Of-Memory (OOM) kills. Incoming customer checkouts are failing with 504 Gateway Timeouts.",
      telemetrySnippet: `[APM TELEMETRY]
Heap Used: 512MB -> 1.8GB (Linear climb over 12 mins).
Garbage Collection: Scavenge runs every 300ms, Full GC taking 850ms pause.
Top Heap Retained Object: ArrayBuffer / EventListener closures in 'NotificationWebSocketService'.
Active DB Connections: 98/100 (Connection Pool Exhaustion).`,
      hypotheses: [
        {
          id: "fs-hyp-1",
          label: "Unbounded Event Listener & WebSocket Reconnection Memory Leak",
          diagnosis:
            "Every client reconnection instantiates a new listener on the global emitter without calling removeListener() on disconnect. Retained buffers prevent garbage collection, dragging down V8 and starving the event loop.",
          remediationAction:
            "Patch connection cleanup hook to explicitly remove listeners on client disconnect; temporarily restart workers with lowered max connection caps.",
          isCorrect: true,
          tradeoffs: "Brief restart clears memory; permanent code fix required in git repo.",
        },
        {
          id: "fs-hyp-2",
          label: "Database Disk Full Anomaly",
          diagnosis: "PostgreSQL transaction logs filled the root volume.",
          remediationAction: "Increase AWS EBS volume size.",
          isCorrect: false,
          tradeoffs: "Does not explain Node.js heap memory accumulation.",
        },
        {
          id: "fs-hyp-3",
          label: "DDoS Attack on Landing Page",
          diagnosis: "External botnet flooding static CSS files.",
          remediationAction: "Enable Cloudflare Under Attack mode.",
          isCorrect: false,
          tradeoffs: "Fails to diagnose backend Node.js memory leak.",
        },
      ],
    },
    stage3Curveball: {
      id: "fs-curve-1",
      title: "Payment Gateway Webhook Timeout",
      timeLimitSeconds: 180,
      triggerMessage: "🚨 CRITICAL WEBHOOK ANOMALY: Stripe webhooks are timing out after 10s.",
      unexpectedCondition:
        "The webhook endpoint is doing synchronous PDF invoice generation and external email dispatch before responding 200 OK. Stripe has begun queuing retries.",
      choices: [
        {
          id: "fs-cb-1",
          text: "Acknowledge webhook immediately with HTTP 200 OK after signature verification, and push the PDF/email task onto an asynchronous Redis BullMQ queue.",
          impact: "Webhook response drops from 9s to 18ms; Stripe retries stop; invoices process reliably in background.",
          score: 98,
        },
        {
          id: "fs-cb-2",
          text: "Double the server timeout on AWS Application Load Balancer to 60 seconds.",
          impact: "Keeps connections open longer, exhausts server sockets, and fails Stripe's hard 10s cutoff.",
          score: 30,
        },
        {
          id: "fs-cb-3",
          text: "Disable invoice PDF generation completely forever.",
          impact: "Solves speed but violates legal invoicing compliance.",
          score: 35,
        },
      ],
    },
    defaultRealityEvidence: {
      conceptualFoundation: 78,
      practicalDebugging: 52,
      problemSolving: 70,
      technicalCommunication: 62,
      timePressureResilience: 64,
      overallReadiness: "Moderate Progression",
      evidenceGaps: [
        {
          skill: "Node.js Event Loop & Memory Profiling",
          severity: "High",
          description: "Struggled to isolate V8 heap leaks and asynchronous closure retention paths.",
          recommendedTechnique: "feynman",
          studyTopic: "Node.js Event Loop, Garbage Collection, and Memory Leak Diagnostics",
        },
        {
          skill: "Distributed Message Queues & Webhook Idempotency",
          severity: "Medium",
          description: "Defaulted to synchronous webhook processing instead of decoupled background workers.",
          recommendedTechnique: "active-recall",
          studyTopic: "Asynchronous Job Queues, Event-Driven Architecture, and Webhook Idempotency",
        },
      ],
      recommendedNextExperiment:
        "Use Chrome DevTools / Clinic.js to profile a memory-leaking Node.js script and fix closure listeners.",
    },
  },

  "cybersecurity-analyst": {
    role: CAREER_ROLES[2],
    stage1MicroTasks: [
      {
        id: "sec-task-1",
        title: "Malicious PCAP & Reverse Shell Triage",
        category: "Practical Debugging",
        scenario:
          "Your IDS flags an outbound connection from an internal Linux payroll server (10.0.4.15) to an external Russian IP (185.220.101.5) over port 4444. You inspect the tcpdump packet string:",
        codeSnippet: `0x0000:  4500 0054 b21a 4000 4006 f92a 0a00 040f
0x0010:  b9dc 6505 8b4a 115c 4a21 ...
ASCII Payload:
/bin/sh -i <&3 >&3 2>&3`,
        options: [
          {
            id: "sec-opt-1",
            text: "Classic interactive bash reverse shell. Immediately sever the network connection at the firewall/switchport, preserve RAM for forensics, and dump process tree for PID with open socket on fd 3.",
            explanation:
              "Accurate response! The bash invocation redirects stdin, stdout, and stderr to a TCP socket descriptor, granting the attacker remote interactive shell access.",
            isCorrect: true,
          },
          {
            id: "sec-opt-2",
            text: "Reboot the server immediately to wipe the hacker's memory.",
            explanation:
              "Terrible mistake! Rebooting wipes volatile RAM evidence, active processes, and decryptor keys needed for forensic attribution.",
            isCorrect: false,
          },
          {
            id: "sec-opt-3",
            text: "Send a polite email to 185.220.101.5 asking them to disconnect.",
            explanation: "Comical and ineffective.",
            isCorrect: false,
          },
        ],
      },
    ],
    stage2Scenario: {
      id: "sec-scen-1",
      title: "Rogue Port 8443 Lateral Movement & Credential Dumping",
      urgency: "P1 Incident",
      briefing:
        "At 02:30 AM, Windows Event Logs on the Domain Controller register event ID 4624 (Successful Logon) from an unrecognized hostname using an administrative service account. Concurrently, LSASS memory access spikes.",
      telemetrySnippet: `[SIEM ALERT]
Host: DC-01.corp.internal
Process: C:\\Windows\\Temp\\procdump.exe -ma lsass.exe C:\\Windows\\Temp\\lsass.dmp
Network: Outbound SMB (Port 445) and RPC traffic propagating to 14 file servers.
Account: svc_backup (Kerberos ticket requested with RC4 encryption instead of AES-256).`,
      hypotheses: [
        {
          id: "sec-hyp-1",
          label: "Pass-the-Hash / Kerberoasting & Lateral Credential Exfiltration",
          diagnosis:
            "Adversary compromised service account svc_backup with a weak RC4 service ticket, dumped LSASS memory for cleartext credentials/hashes, and is using PsExec/WMI across SMB to traverse the subnet.",
          remediationAction:
            "Isolate compromised DC-01 from VLAN, revoke Kerberos Krbtgt password twice, force password rotation on svc_backup, and terminate rogue procdump handles.",
          isCorrect: true,
          tradeoffs: "Brief disruption to backup automation; prevents enterprise-wide domain compromise.",
        },
        {
          id: "sec-hyp-2",
          label: "Windows Update Automated Telemetry",
          diagnosis: "Microsoft Defender downloading definitions.",
          remediationAction: "Whitelist the alert in SIEM.",
          isCorrect: false,
          tradeoffs: "Allows complete ransomware deployment.",
        },
      ],
    },
    stage3Curveball: {
      id: "sec-curve-1",
      title: "Active Data Exfiltration via DNS Tunneling",
      timeLimitSeconds: 180,
      triggerMessage: "🚨 DATA LOSS ALERT: Outbound HTTPS blocked, but DNS queries spiking 50,000 req/min.",
      unexpectedCondition:
        "Subdomain queries look like: '7a8f9b2c.corp-cdn-update.xyz'. The attacker is encoding sensitive database tables into base32 DNS query labels to bypass firewall egress filtering.",
      choices: [
        {
          id: "sec-cb-1",
          text: "Blackhole domain 'corp-cdn-update.xyz' on internal DNS forwarders, enforce DNS query length rate-limiting, and identify internal endpoint source IP from query logs.",
          impact: "Halts exfiltration stream immediately while pinpointing infected host.",
          score: 96,
        },
        {
          id: "sec-cb-2",
          text: "Shut down the entire company internet connection for all 4,000 employees indefinitely.",
          impact: "Extreme business disruption when targeted DNS filtering was sufficient.",
          score: 45,
        },
      ],
    },
    defaultRealityEvidence: {
      conceptualFoundation: 82,
      practicalDebugging: 60,
      problemSolving: 75,
      technicalCommunication: 55,
      timePressureResilience: 70,
      overallReadiness: "High Match",
      evidenceGaps: [
        {
          skill: "Active Directory Forensics & LSASS Triage",
          severity: "Critical",
          description: "Needed deeper understanding of Kerberos ticket encryption and memory isolation.",
          recommendedTechnique: "feynman",
          studyTopic: "Kerberoasting, Pass-The-Hash, and Active Directory Defense Mechanics",
        },
      ],
      recommendedNextExperiment:
        "Analyze a sample PCAP inside Wireshark to isolate DNS tunneling payloads and extract decoded byte streams.",
    },
  },
};

export const CAREER_FAILURE_POINTS: CareerFailurePoint[] = [
  {
    id: "fail-1",
    title: "The Timed DSA Blindspot",
    roleId: "fullstack-engineer",
    severity: "Critical Bottleneck",
    rootCause:
      "Student can solve LeetCode Medium problems when relaxed with unlimited time, but accuracy collapses by 65% when placed under an interactive 35-minute interviewer countdown.",
    placementImpact: "Fails 80% of round 1 technical coding screenings despite knowing concepts.",
    triggerSymptom: "Rapid cognitive fatigue, freezing on edge cases under ticking timers.",
    studyMindIntervention: {
      technique: "active-recall",
      topic: "Time-Constrained Algorithmic Pattern Recognition (Two Pointers, Sliders, BFS/DFS)",
      interventionPlan: "Complete 5 timed flash drills with 12-minute strict caps in StudyMind Active Recall.",
      expectedImprovement: "Reduces panic latency from 14 mins to 2 mins for identifying problem arch.",
    },
  },
  {
    id: "fail-2",
    title: "Surface-Level 'Tutorial Project' Evidence",
    roleId: "ai-ml-engineer",
    severity: "High Probability",
    rootCause:
      "Resume lists 3 standard projects (e.g. MNIST classifier, sentiment analysis with prebuilt HuggingFace pipeline). Candidate has never debugged data drift, latency bottlenecks, or deployment failures.",
    placementImpact: "Interviewer asks: 'How did you handle model drift or deployment scale?' Candidate freezes.",
    triggerSymptom: "Unable to explain why a model failed or how it was served in production.",
    studyMindIntervention: {
      technique: "feynman",
      topic: "Production Machine Learning Failures: Overfitting vs Covariate Shift vs Concept Drift",
      interventionPlan: "Use Feynman Technique to explain the mathematics of distribution shift simply.",
      expectedImprovement: "Transforms generic project pitch into defensible production engineering evidence.",
    },
  },
  {
    id: "fail-3",
    title: "The 'Code Works, Can't Explain Why' Gap",
    roleId: "fullstack-engineer",
    severity: "Critical Bottleneck",
    rootCause:
      "Candidate relies on trial-and-error and StackOverflow/Copilot pasting. When asked to explain the architectural trade-offs between SQL vs NoSQL or optimistic vs pessimistic locking, explanation is fragmented.",
    placementImpact: "Senior engineers reject candidate during System Design & Technical Discussion rounds.",
    triggerSymptom: "Heavy reliance on buzzwords without explaining concurrency or data consistency trade-offs.",
    studyMindIntervention: {
      technique: "feynman",
      topic: "Database Concurrency Control: ACID, Optimistic Locking, and Isolation Levels",
      interventionPlan: "Explain locking mechanisms without jargon using StudyMind Feynman AI Evaluator.",
      expectedImprovement: "Scores 9/10 on architectural clarity and technical communication.",
    },
  },
  {
    id: "fail-4",
    title: "Network Telemetry & Protocol Illiteracy",
    roleId: "cybersecurity-analyst",
    severity: "High Probability",
    rootCause:
      "Candidate memorized definitions of attacks (DDoS, XSS, Phishing) but cannot read raw hex packet headers or diagnose how a reverse shell works at the socket level.",
    placementImpact: "Fails technical lab assessments where candidates are handed Wireshark captures.",
    triggerSymptom: "Cannot correlate TCP flags (SYN, ACK, RST) with actual network events.",
    studyMindIntervention: {
      technique: "active-recall",
      topic: "TCP/IP Handshake, TCP Flags, and Socket Descriptors in Linux",
      interventionPlan: "Drill packet analysis questions with immediate active retrieval feedback.",
      expectedImprovement: "Instant recognition of anomalous TCP flags and payload signatures.",
    },
  },
  {
    id: "fail-5",
    title: "Metric Vanity over Root Cause Reasoning",
    roleId: "data-analyst",
    severity: "Moderate Friction",
    rootCause:
      "Candidate builds visually pleasing charts in Tableau/PowerBI, but lacks statistical rigor to separate correlation from causation or detect Simpson's Paradox in aggregated cohorts.",
    placementImpact: "Leadership rejects business recommendations that collapse when drilled down.",
    triggerSymptom: "Recommending decisions based on raw averages without segmenting cohorts.",
    studyMindIntervention: {
      technique: "feynman",
      topic: "Simpson's Paradox, Cohort Decoupling, and Statistical Power",
      interventionPlan: "Explain how aggregate trends reverse when partitioned into sub-groups.",
      expectedImprovement: "Prevents flawed executive presentations and demonstrates elite analytics.",
    },
  },
];

export const CAREER_SWITCH_PROFILES: CareerSwitchCostProfile[] = [
  {
    id: "switch-web-to-ai",
    currentRole: "Full Stack Web Developer",
    targetRole: "AI / ML Engineer",
    sourceRoleId: "fullstack-engineer",
    targetRoleId: "ai-ml-engineer",
    transferablePercentage: 45,
    transferableSkills: [
      { skill: "Python & General Programming", howItApplies: "Clean modular scripting, OOP, packaging, and async I/O." },
      { skill: "SQL & Relational Schemas", howItApplies: "Feature store data extraction, cohort aggregations, and ETL." },
      { skill: "REST / FastAPI Backend", howItApplies: "Serving model endpoints, batching inferences, and JSON serialization." },
      { skill: "Git & CI/CD Pipelines", howItApplies: "Reproducible experiment versioning and automated model testing." },
    ],
    missingFoundations: [
      { skill: "Linear Algebra & Vector Calculus", estimatedHours: 45, difficulty: "Steep" },
      { skill: "Probability, Bayesian Inference & Statistics", estimatedHours: 40, difficulty: "Moderate" },
      { skill: "PyTorch & Tensor Operations", estimatedHours: 50, difficulty: "Moderate" },
      { skill: "Model Evaluation & Loss Function Debugging", estimatedHours: 35, difficulty: "Moderate" },
      { skill: "MLOps & Feature Store Architectures", estimatedHours: 30, difficulty: "Moderate" },
    ],
    totalEstimatedWeeks: 14,
    learningWorkloadBar: 68,
    switchRecommendation:
      "You do NOT need to restart from zero! Your backend and data processing skills already give you a 45% head start over fresh graduates. Focus exclusively on mathematical foundations (matrix gradients) and PyTorch debugging rather than generic coding tutorials.",
  },
  {
    id: "switch-mech-to-tech",
    currentRole: "Mechanical / Core Engineering",
    targetRole: "Full Stack Software Engineer",
    sourceRoleId: "core-engineering",
    targetRoleId: "fullstack-engineer",
    transferablePercentage: 35,
    transferableSkills: [
      { skill: "Strong Analytical & Mathematical Rigor", howItApplies: "Algorithmic thinking, discrete logic, and complexity analysis." },
      { skill: "System Modeling & Thermodynamics/Mechanics", howItApplies: "Understanding state transitions, resource limits, and throughput." },
      { skill: "CAD / Numerical Computing (MATLAB/C)", howItApplies: "Loops, memory management, and structured procedural logic." },
    ],
    missingFoundations: [
      { skill: "Data Structures & Algorithms (Trees, Graphs, DP)", estimatedHours: 70, difficulty: "Steep" },
      { skill: "Modern Web Technologies (TypeScript, React, Node)", estimatedHours: 60, difficulty: "Moderate" },
      { skill: "Database Architecture (PostgreSQL, ACID, Indexing)", estimatedHours: 35, difficulty: "Moderate" },
      { skill: "Web Protocols (HTTP/2, WebSockets, TLS)", estimatedHours: 25, difficulty: "Moderate" },
    ],
    totalEstimatedWeeks: 18,
    learningWorkloadBar: 78,
    switchRecommendation:
      "Leverage your analytical engineering background as your superpower. Tech interviewers respect candidates who grasp systems architecture and physical constraints. Don't waste time on 10 different frameworks—master TypeScript and PostgreSQL deeply.",
  },
  {
    id: "switch-web-to-cyber",
    currentRole: "Full Stack Web Developer",
    targetRole: "Cybersecurity Analyst",
    sourceRoleId: "fullstack-engineer",
    targetRoleId: "cybersecurity-analyst",
    transferablePercentage: 55,
    transferableSkills: [
      { skill: "Web Application Architecture (HTTP, Cookies, CORS)", howItApplies: "Understands exactly how OWASP Top 10 vulnerabilities (XSS, CSRF, SSRF) manifest." },
      { skill: "Database Queries (SQL)", howItApplies: "Immediate mastery of SQL injection vectors and blind boolean extraction." },
      { skill: "Authentication & JWT/OAuth", howItApplies: "Can audit flawed token validation and session hijacking risks." },
    ],
    missingFoundations: [
      { skill: "Network Protocols & Packet Inspection (Wireshark, TCP/IP)", estimatedHours: 35, difficulty: "Moderate" },
      { skill: "Linux Internals, Kernel Auditing & Syscalls", estimatedHours: 35, difficulty: "Moderate" },
      { skill: "Active Directory Architecture & Kerberos", estimatedHours: 40, difficulty: "Steep" },
      { skill: "SIEM & SOC Alert Triaging (Splunk, Elastic)", estimatedHours: 30, difficulty: "Moderate" },
    ],
    totalEstimatedWeeks: 12,
    learningWorkloadBar: 52,
    switchRecommendation:
      "Web developers make terrifyingly good AppSec and security analysts because you know how software breaks from the inside. Focus on infrastructure, networking, and SIEM tooling to complete your pivot rapidly in 12 weeks.",
  },
];

export const BOSS_BATTLE_INCIDENTS: BossBattleIncident[] = [
  {
    id: "boss-ai-drift",
    roleId: "ai-ml-engineer",
    title: "Black Friday Flash Sale: Real-Time Recommender Drift Crisis",
    threatLevel: "CODE RED",
    environment: "Production Inference Cluster (48x NVIDIA A100 Nodes)",
    situation:
      "It is 00:15 on Black Friday. The recommendation engine serving 4.2M active shoppers is suddenly serving bizarre, irrelevant products (winter snow boots to users in tropical Singapore, $5,000 industrial generators to student accounts). Conversion rates plunged 64% in 20 minutes, costing $140,000 per hour.",
    initialLogs: [
      "00:14:02 [WARN] Worker-34: Feature vector embedding distance divergence > 3.8 standard deviations.",
      "00:15:18 [CRIT] ModelSvc: Latent embedding dimension #47 contains 94.2% zero-activation outputs.",
      "00:16:44 [ALERT] RedisCache: Feature cache misses spiked to 71% following midnight catalog update.",
      "00:18:11 [METRIC] Average order value dropped from $84.20 to $11.10.",
    ],
    telemetryData: [
      { time: "23:50", metric1: 94, metric2: 24, metric3: 2 },
      { time: "00:00", metric1: 91, metric2: 38, metric3: 5 },
      { time: "00:10", metric1: 67, metric2: 82, metric3: 34 },
      { time: "00:20", metric1: 36, metric2: 96, metric3: 68 },
      { time: "00:30", metric1: 29, metric2: 98, metric3: 74 },
    ],
    metricLabels: ["Recommender Accuracy %", "Embedding Drift Index", "Revenue Loss ($K/10m)"],
    diagnosticActions: [
      {
        id: "diag-1",
        actionLabel: "Inspect Feature Store Midnight Delta",
        discoveredLog:
          "Delta log shows the marketing catalog script normalized all product category IDs with a new hashing algorithm, but the PyTorch embedding lookup table was NOT updated with the new hash dictionary.",
        revealedHint: "Category ID hash mismatch is mapping catalog items to completely random embedding indices.",
      },
      {
        id: "diag-2",
        actionLabel: "Profile Inference Worker GPU Memory",
        discoveredLog: "GPU memory is healthy (42% utilized). Latency is normal (18ms). Issue is purely mathematical.",
        revealedHint: "Hardware and network are not the bottleneck; inputs are corrupted.",
      },
      {
        id: "diag-3",
        actionLabel: "Check Fallback Heuristic Service",
        discoveredLog: "Rule-based popularity fallback service is active and tested, currently idling in standby mode.",
        revealedHint: "A reliable cold-start heuristic can immediately restore revenue while hash tables are rebuilt.",
      },
    ],
    mitigationOptions: [
      {
        id: "mit-1",
        title: "Immediate Traffic Switch to Verified Rule-Based Popularity Heuristic + Hotfix Hash Dictionary",
        description:
          "Flip feature flag to route user recommendations through verified high-margin popularity heuristics within 30 seconds to stop bleeding revenue, while regenerating the embedding mapping table offline.",
        isOptimal: true,
        consequence: "Conversion rates recover to 88% of baseline within 2 minutes; zero customer churn.",
      },
      {
        id: "mit-2",
        title: "Retrain Neural Network Model from Scratch on Fresh Midnight Shopper Traffic",
        description: "Initiate full retraining across all 48 GPU nodes on live Black Friday traffic.",
        isOptimal: false,
        consequence: "Takes 4.5 hours to converge, during which $600,000 in sales are permanently lost.",
      },
      {
        id: "mit-3",
        title: "Reboot All 48 Inference Kubernetes Pods",
        description: "Perform a rolling restart of all container instances.",
        isOptimal: false,
        consequence: "Pods come back up with the exact same mismatched hash dictionary; zero problem resolution.",
      },
    ],
    postMortemPrompt:
      "Explain in 2 sentences why neural embeddings collapsed and how you would prevent catalog schema drift in the future.",
  },
  {
    id: "boss-fs-cascade",
    roleId: "fullstack-engineer",
    title: "Cascading Database Deadlock & API Gateway Collapse",
    threatLevel: "SEV-1 OUTAGE",
    environment: "Distributed Microservices (PostgreSQL Cluster + 32 API Pods)",
    situation:
      "During a scheduled flash deal on high-demand tickets, 50,000 concurrent users attempted checkout. PostgreSQL row-level locks on inventory accumulated, thread pools exhausted, and the API gateway began returning HTTP 504 Gateway Timeout across the entire platform.",
    initialLogs: [
      "14:02:11 [FATAL] db-primary: process 41182 detected deadlock while acquiring ExclusiveLock on tuple (48, 12).",
      "14:03:04 [WARN] NodeWorker: DB connection pool 100/100 exhausted; 1,420 incoming queries waiting in queue.",
      "14:03:55 [ALERT] EnvoyGateway: Health check failed for /api/v1/checkout; circuit breaker tripped open.",
    ],
    telemetryData: [
      { time: "14:00", metric1: 95, metric2: 120, metric3: 0 },
      { time: "14:02", metric1: 420, metric2: 650, metric3: 12 },
      { time: "14:04", metric1: 3800, metric2: 980, metric3: 65 },
      { time: "14:06", metric1: 9200, metric2: 1000, metric3: 94 },
    ],
    metricLabels: ["p99 Latency (ms)", "Active DB Connections", "HTTP 5xx Error Rate %"],
    diagnosticActions: [
      {
        id: "fs-diag-1",
        actionLabel: "Analyze PostgreSQL pg_stat_activity Locks",
        discoveredLog:
          "Multiple worker threads updating 'inventory' and 'user_wallet' in reverse order: Thread A locks inventory then wallet; Thread B locks wallet then inventory.",
        revealedHint: "Classic lock order inversion causing mutual deadlocks under high concurrency.",
      },
      {
        id: "fs-diag-2",
        actionLabel: "Check Redis Atomic Counter Availability",
        discoveredLog: "Redis cluster is at 8% CPU with DECR inventory counter support available.",
        revealedHint: "Can decouple inventory deduction from heavyweight relational database transactions.",
      },
    ],
    mitigationOptions: [
      {
        id: "fs-mit-1",
        title: "Kill Deadlocked Backend PIDs, Enforce Deterministic Lock Ordering & Offload Inventory to Redis Atomic DECR",
        description:
          "Terminate stalled lock holders, sort acquisition IDs deterministically to eliminate inversions, and move real-time ticket decrement into atomic Redis transactions.",
        isOptimal: true,
        consequence: "Latencies plummet back to 110ms; database pool clears within 45 seconds.",
      },
      {
        id: "fs-mit-2",
        title: "Spin Up 20 More PostgreSQL Read Replicas",
        description: "Scale horizontal read capacity on AWS RDS.",
        isOptimal: false,
        consequence: "Does not fix write-lock deadlocks on the single primary master; adds zero benefit.",
      },
    ],
    postMortemPrompt:
      "Explain the exact condition that caused the database deadlock and how atomic Redis counters resolve lock contention.",
  },
  {
    id: "boss-sec-breach",
    roleId: "cybersecurity-analyst",
    title: "Active Lateral Ransomware Deployment on Hypervisor",
    threatLevel: "ACTIVE EXFILTRATION",
    environment: "Enterprise Hybrid Cloud & ESXi Hypervisor Infrastructure",
    situation:
      "A nation-state threat group compromised a privileged contractor account. Automated scripts are actively disabling volume shadow copies (vssadmin delete shadows) and staging encrypted file payloads across 12 virtualization hosts.",
    initialLogs: [
      "03:12:01 [ALERT] Sysmon: Event 1 - Process created 'vssadmin.exe delete shadows /all /quiet'.",
      "03:13:40 [CRIT] EDR: High-volume filesystem entropy detected in /vmfs/volumes/Datastore-01.",
      "03:14:15 [WARN] Firewall: Outbound beaconing to IP 194.26.29.111 on TLS port 8443.",
    ],
    telemetryData: [
      { time: "03:10", metric1: 2, metric2: 12, metric3: 0 },
      { time: "03:12", metric1: 38, metric2: 78, metric3: 1 },
      { time: "03:14", metric1: 89, metric2: 95, metric3: 8 },
      { time: "03:16", metric1: 98, metric2: 99, metric3: 12 },
    ],
    metricLabels: ["Filesystem Encryption Entropy %", "Command & Control Packets", "Infected Hypervisors"],
    diagnosticActions: [
      {
        id: "sec-diag-1",
        actionLabel: "Isolate Hypervisor Management VLAN via Software-Defined Switch",
        discoveredLog: "Management VLAN severed; lateral SMB and SSH propagation instantly cut.",
        revealedHint: "Containment achieved; adversary cannot pivot to secondary datastore clusters.",
      },
      {
        id: "sec-diag-2",
        actionLabel: "Query Active Directory Domain Admin Sessions",
        discoveredLog: "Session identified: Contractor user 'dev_contractor_ext' logged in from VPN IP 10.8.0.44.",
        revealedHint: "Revoking VPN token and disabling user account terminates interactive control.",
      },
    ],
    mitigationOptions: [
      {
        id: "sec-mit-1",
        title: "Hard Network Quarantine of Datastore-01, Revoke Contractor Kerberos Tickets, and Revert Hypervisors from Immutable Air-Gapped Snapshots",
        description:
          "Isolate compromised cluster at VLAN layer, kill contractor session, and trigger automated instant recovery from write-once-read-many (WORM) storage.",
        isOptimal: true,
        consequence: "100% data recovered; ransomware halted with zero ransom paid.",
      },
      {
        id: "sec-mit-2",
        title: "Pay the 40 Bitcoin Ransom Demand via Company Crypto Wallet",
        description: "Contact the extortionists on dark web portal.",
        isOptimal: false,
        consequence: "Company loses $2.4M; decryption keys fail on 40% of corrupted datastores.",
      },
    ],
    postMortemPrompt:
      "Outline the three primary containment steps you executed and how immutable snapshots thwarted the threat actor.",
  },
];

export const CAREER_COMPARISONS: CareerComparisonPair[] = [
  {
    id: "se-vs-ds",
    roleA: CAREER_ROLES[1], // Fullstack Software Engineer
    roleB: CAREER_ROLES[0], // AI / ML Engineer
    dimensionComparisons: [
      {
        dimension: "Day-to-Day Reality",
        roleANote: "Writing deterministic business logic, debugging APIs, optimizing SQL, and code reviews.",
        roleBNote: "Cleaning dirty datasets, tracking training runs, debugging non-deterministic loss curves, evaluating metrics.",
        verdict: "Software Engineering is deterministic; AI/ML is empirical and experiment-driven.",
      },
      {
        dimension: "Failure Vector in Placements",
        roleANote: "Failing timed LeetCode Medium/Hard or stumbling on database concurrency trade-offs.",
        roleBNote: "Inability to explain mathematical foundations (matrices, gradients) or model drift debugging.",
        verdict: "Software Eng demands speed & clean patterns; AI demands mathematical intuition.",
      },
      {
        dimension: "Hiring Bar for Fresh Graduates",
        roleANote: "Very high volume of campus hires. Clear roadmap (DSA + Full Stack Projects).",
        roleBNote: "Fewer pure junior roles; companies often prefer candidates with strong Math/Stats or prior research/internship.",
        verdict: "Full Stack has 3x more entry-level positions than standalone Junior AI Engineer roles.",
      },
      {
        dimension: "Workload to Placement Readiness",
        roleANote: "16-20 weeks of disciplined daily coding and full-stack project building.",
        roleBNote: "26-32 weeks (requires both software skills + college-level mathematics).",
        verdict: "Full Stack is faster to market for campus placements.",
      },
    ],
    commonMistake:
      "Students assume: 'I'll just do AI because it's trendy', without realizing 80% of junior tech jobs are Full Stack/Backend, and junior AI roles often require defending statistical theory in the interview.",
    clarifyingQuestion:
      "Do you enjoy building reliable systems that work every single time (Software Engineering), or do you enjoy experimenting with uncertain mathematical models (Data/AI)?",
  },
  {
    id: "fs-vs-cyber",
    roleA: CAREER_ROLES[1], // Software Engineer
    roleB: CAREER_ROLES[2], // Cybersecurity Analyst
    dimensionComparisons: [
      {
        dimension: "Work Dynamic",
        roleANote: "Creation-focused: Building features, UX, backend pipelines.",
        roleBNote: "Investigation-focused: Auditing logs, hunting anomalies, anticipating adversary moves.",
        verdict: "Builders vs Defenders.",
      },
      {
        dimension: "Interview Structure",
        roleANote: "LeetCode coding rounds + System Design + Project walkthrough.",
        roleBNote: "Scenario-based triage, network packet analysis, security architecture, ethical hacking CTF.",
        verdict: "Cybersecurity interviews are hands-on scenario investigations.",
      },
      {
        dimension: "Market Competition",
        roleANote: "High candidate volume; tough competition from CS peers.",
        roleBNote: "Acute talent shortage; certifications (CompTIA Security+, CEH) carry massive weight.",
        verdict: "Cybersecurity has less crowded applicant pools if certified.",
      },
    ],
    commonMistake:
      "Believing you need to be a black-hat hacker. Most cybersecurity roles are about system hardening, compliance, log auditing, and protocol hygiene.",
    clarifyingQuestion:
      "Do you prefer building new applications from scratch, or dissecting how systems can be broken and defending them?",
  },
];

export const PROGRESS_PROOF_BENCHMARK = {
  studentName: "Student Scholar",
  targetRole: "AI / ML Engineer",
  baselineDate: "Simulation #1 (7 Days Ago)",
  retestDate: "Simulation #2 (Today after StudyMind Intervention)",
  interventionDetails: [
    {
      technique: "Feynman Technique",
      topic: "Covariate Shift & Drift Diagnostics",
      sessionsCompleted: 4,
      scoreGain: "+28%",
    },
    {
      technique: "Active Recall",
      topic: "Loss Underflow & PyTorch Numerics",
      sessionsCompleted: 6,
      scoreGain: "+32%",
    },
    {
      technique: "Adaptive Study Sessions",
      topic: "Pipeline Unit Testing with Synthetic Noise",
      verifiedHours: "14.5 Hours",
      scoreGain: "+24%",
    },
  ],
  radarComparison: [
    { subject: "Conceptual Math", baseline: 52, retest: 84, fullMark: 100 },
    { subject: "Practical Debugging", baseline: 41, retest: 78, fullMark: 100 },
    { subject: "Problem Solving", baseline: 53, retest: 76, fullMark: 100 },
    { subject: "Technical Explanation", baseline: 48, retest: 82, fullMark: 100 },
    { subject: "Stress Resilience", baseline: 50, retest: 74, fullMark: 100 },
  ],
  keyOutcome:
    "Failure vectors eliminated: The candidate successfully detected covariate shift and resolved loss underflow in under 3 minutes during Simulation #2, proving verifiable career readiness.",
};
