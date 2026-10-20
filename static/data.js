// CV data extracted from the original repo
window.CV_DATA = {
  name: "FILIP CSUPKA",
  status: "talent.io/v1alpha1 · UniversalSoldier/filip-csupka",
  statusBadge: "Running",
  roles: [
    "DevOps Engineer",
    "SRE Specialist",
    "Kubernetes Architect",
    "GitOps Practitioner",
    "Platform Engineer",
    "OpenShift Expert",
    "Pentest & Load Testing",
  ],
  subtitle:
    "Building resilient Kubernetes platforms, GitOps delivery and observability while learning fast enough to look suspicious.",
  summary:
    "DevOps / SRE engineer focused on Kubernetes, OpenShift, GitOps and observability, now also doing pentests and load tests of production platforms. I like platforms that are boring in production, fast for developers, and documented well enough that future-me does not need a detective board.",
  resume: {
    href: "/Filip_csupka_CV.docx",
    label: "DOWNLOAD CV",
  },

  // WHERE I USED IT — filter keys for the toolbox
  contexts: [
    { key: "ocp",  label: "OpenShift private cloud", color: "#5cffb1" },
    { key: "hc",   label: "Healthcare platforms",    color: "#ffc64a" },
    { key: "sec",  label: "Pentest",                 color: "#ff5f80" },
    { key: "perf", label: "Load testing",            color: "#ff8a4c" },
    { key: "lab",  label: "Home lab",                color: "#42e0ff" },
  ],

  // TOOLBOX — grouped by job to be done; `in` = where the tool was actually used ([] = everywhere)
  toolbox: [
    { key: "os", title: "Linux, network, security", color: "#FCC624", tools: [
      { n: "Linux", in: [] }, { n: "bash", in: [] }, { n: "systemd", in: [] }, { n: "iptables / nftables", in: ["sec"] },
      { n: "tcpdump", in: [] }, { n: "strace", in: [] }, { n: "TLS / PKI", in: ["sec", "ocp"] },
    ]},
    { key: "compute", title: "Compute and cloud", color: "#d50c2d", tools: [
      { n: "Bare-metal OpenShift", in: ["ocp"] }, { n: "AKS", in: ["hc"] }, { n: "Hetzner", in: ["hc", "perf", "lab"] },
      { n: "RKE2 / VMware VCD", in: ["sec"] }, { n: "Talos", in: ["hc"] }, { n: "AWS", in: [] },
    ]},
    { key: "k8s", title: "Kubernetes and OpenShift", color: "#326CE5", tools: [
      { n: "Kubernetes", in: ["ocp", "hc", "sec", "lab"] }, { n: "OpenShift 4.18–4.20", in: ["ocp"] }, { n: "ACM hub / spoke", in: ["ocp"] },
      { n: "OLM operators", in: ["ocp"] }, { n: "k3s", in: ["lab"] }, { n: "Containers / OCI", in: [] },
    ]},
    { key: "gitops", title: "Packaging and GitOps", color: "#EF7B4D", tools: [
      { n: "Helm", in: ["ocp", "hc"] }, { n: "Helmfile", in: ["ocp"] }, { n: "Kustomize", in: ["hc", "lab"] },
      { n: "Argo CD", in: ["ocp", "hc", "lab"] }, { n: "Sealed Secrets", in: ["hc", "lab"] },
      { n: "External Secrets", in: ["ocp"] }, { n: "Vault", in: ["ocp"] }, { n: "Kyverno", in: ["ocp"] },
    ]},
    { key: "iac", title: "IaC and CI/CD", color: "#7B42BC", tools: [
      { n: "Terraform", in: ["perf", "lab"] }, { n: "Ansible", in: ["ocp", "perf"] },
      { n: "GitHub Actions", in: ["ocp", "lab"] }, { n: "GitLab CI", in: ["hc"] },
    ]},
    { key: "data", title: "Storage and data", color: "#5cffb1", tools: [
      { n: "ODF / Ceph", in: ["ocp"] }, { n: "OADP backup", in: ["ocp"] }, { n: "PostgreSQL", in: ["hc", "ocp"] },
      { n: "MongoDB", in: ["hc", "ocp"] }, { n: "Kafka / Redpanda", in: ["hc", "ocp"] },
      { n: "MariaDB / ProxySQL", in: ["sec"] }, { n: "Redis-protocol caches", in: ["sec"] },
    ]},
    { key: "obs", title: "Observability", color: "#F46800", tools: [
      { n: "Prometheus", in: ["ocp", "hc", "lab"] }, { n: "Alertmanager", in: ["ocp", "lab"] }, { n: "Grafana", in: ["ocp", "hc", "perf", "lab"] },
      { n: "Loki", in: ["ocp", "hc", "lab"] }, { n: "Tempo / OpenTelemetry", in: ["ocp", "hc"] },
      { n: "Thanos", in: ["ocp"] }, { n: "VictoriaMetrics", in: ["perf"] },
    ]},
    { key: "sec", title: "Security testing", color: "#ff5f80", tools: [
      { n: "nmap", in: ["sec"] }, { n: "httpx", in: ["sec"] }, { n: "sslyze", in: ["sec"] },
      { n: "Trivy", in: ["sec"] }, { n: "Grype", in: ["sec"] }, { n: "rbac-tool", in: ["sec"] },
      { n: "Pod Security probes", in: ["sec"] }, { n: "Go tooling", in: ["sec"] },
      { n: "ACS / StackRox", in: ["ocp"] }, { n: "Compliance Operator", in: ["ocp"] },
    ]},
    { key: "perf", title: "Performance testing", color: "#ff8a4c", tools: [
      { n: "k6", in: ["perf"] }, { n: "Terraform + Ansible rigs", in: ["perf"] }, { n: "vmagent", in: ["perf"] },
      { n: "node_exporter", in: ["perf"] }, { n: "nginx sink", in: ["perf"] }, { n: "Python reports", in: ["perf"] },
    ]},
    { key: "ai", title: "AI and agents", color: "#a78bfa", tools: [
      { n: "Claude Code", in: ["lab"] }, { n: "Codex", in: ["lab"] }, { n: "MCP", in: ["lab"] },
      { n: "LangGraph", in: ["lab"] }, { n: "Ollama", in: ["lab"] }, { n: "ChromaDB", in: ["lab"] },
    ]},
  ],

  // FLOWS — how work actually moves, one row per workstream
  flows: [
    { key: "delivery-ocp", title: "Cluster change delivery", ctx: "ocp", steps: [
      { s: "Chart",   t: "~100 custom Helm charts" },
      { s: "Render",  t: "Helmfile per cluster" },
      { s: "Review",  t: "PR + render check" },
      { s: "Sync",    t: "Argo CD app-of-apps" },
      { s: "Adopt",   t: "live diff, auto-sync off first" },
    ]},
    { key: "upgrade-ocp", title: "OpenShift upgrade", ctx: "ocp", steps: [
      { s: "Read",    t: "Upgradeable=False, operator limits" },
      { s: "Order",   t: "operator sequence, API removals" },
      { s: "QA first", t: "ACM policy, hub then spoke" },
      { s: "Approve", t: "manual InstallPlans" },
      { s: "Verify",  t: "ClusterOperators, nodes, drains" },
    ]},
    { key: "delivery-hc", title: "Release to tenant environments", ctx: "hc", steps: [
      { s: "Build",   t: "GitLab CI templates" },
      { s: "Package", t: "image + Kustomize overlay" },
      { s: "Secure",  t: "Sealed Secrets" },
      { s: "Sync",    t: "Argo CD per environment" },
      { s: "Observe", t: "Prometheus, Tempo, Loki" },
    ]},
    { key: "pentest", title: "Platform pentest", ctx: "sec", steps: [
      { s: "Recon",     t: "nmap, httpx, CT logs" },
      { s: "Perimeter", t: "CDN bypass, TLS matrix" },
      { s: "Cluster",   t: "RBAC, Pod Security, quotas" },
      { s: "Images",    t: "Trivy + Grype cross-check" },
      { s: "Data",      t: "cache + DB reachability, isolation" },
      { s: "Report",    t: "severity, evidence, fix" },
    ]},
    { key: "loadtest", title: "Load test", ctx: "perf", steps: [
      { s: "Rig",      t: "Terraform + Ansible on Hetzner" },
      { s: "Calibrate", t: "local sink, CPU < 70%, 0 drops" },
      { s: "Scenarios", t: "k6: baseline, spike, stress" },
      { s: "Observe",  t: "vmagent, VictoriaMetrics, Grafana" },
      { s: "Report",   t: "ceiling, bottleneck, advice" },
    ]},
    { key: "agent", title: "Alert to diagnosis", ctx: "lab", steps: [
      { s: "Alert",    t: "Alertmanager" },
      { s: "Investigate", t: "LangGraph ReAct loop" },
      { s: "Evidence", t: "k8s API: pods, logs, events" },
      { s: "Diagnose", t: "Ollama on GPU node" },
      { s: "Report",   t: "Slack" },
    ]},
  ],

  // EXPERIENCE TABLE — newest first. `situations` = short real cases, sanitised (no client names, hosts or finding details).
  experience: [
    {
      id: "security-performance",
      title: "Security assessment and performance testing",
      org: "VASops · consulting",
      status: "Running",
      color: "#ff5f80",
      focus: "pentest, k6 load testing, RKE2 private cloud",
      summary: "Break it on purpose, with a written scope, before someone does it without one. Two workstreams on a public-sector media platform running on private-cloud RKE2.",
      highlights: [
        "Pentest across the whole platform: recon, CDN and perimeter bypass, TLS, Kubernetes RBAC, Pod Security and quotas, container images, CI runner runtime, ingress, database layer and isolation between four environments. Worked in a team; I covered perimeter, data layer, isolation and image scanning.",
        "Evidence-first reporting: every finding carries severity, reproducible evidence and a remediation matched to the client's own IaC. Customer summary in Czech, technical evidence in English.",
        "Separate performance workstream: baseline, typical day, peak, CDN-to-origin pass-through, spike, stress-to-failure, mixed readers and editors, push-notification surge.",
        "Built the load rig from scratch: disposable multi-VM k6 on Hetzner (Terraform + Ansible), coordinated start, metrics to a separate VictoriaMetrics so the target's monitoring stays clean.",
        "Wrote small Go tools where off-the-shelf ones fell short (RBAC audit, TCP sweeper) and cross-checked scanners (Trivy against Grype) before trusting a result.",
      ],
      situations: [
        { t: "One load box can't carry the target", d: "Built a disposable multi-VM k6 rig and measured its own ceiling first, about 30k req/s on three small VMs, before touching the client." },
        { t: "Is the generator the bottleneck?", d: "Stepped arrival-rate runs against a local sink with CPU under 70% and zero drops as pass criteria. Only then are the client numbers trustworthy." },
        { t: "CDN assumed to protect everything", d: "Tested direct-to-origin with preserved hostnames in all four environments. Bypass confirmed, reported with the difference between an auth challenge and a breach." },
        { t: "Is the shared cache reachable?", d: "Bounded probes from in-scope workloads in every environment. A reachability matrix instead of opinions, plus the exact fix." },
        { t: "Do environments really isolate?", d: "Real-token and permission probes across every environment pair. Database grants held, network and ingress hostname overlap did not." },
      ],
      tags: ["Pentest", "k6", "Go", "nmap", "sslyze", "Trivy", "Grype", "RBAC", "Pod Security", "Terraform", "Ansible", "VictoriaMetrics", "RKE2", "Hetzner"],
    },
    {
      id: "openshift-private-cloud",
      title: "Private-cloud OpenShift operations",
      org: "Aspecta",
      status: "Running",
      color: "#5cffb1",
      focus: "ACM hub/spoke, upgrades, operators, storage, production reliability",
      summary: "Bare-metal OpenShift for a public-sector client: prod, QA and lab hubs with spokes, kept healthy and upgraded without drama.",
      highlights: [
        "Operate ACM hub/spoke OpenShift 4.18–4.20 on bare metal across prod, QA and lab, including hosted-control-plane spokes.",
        "About 100 custom Helm charts carry operators and cluster configuration. Flow: chart, Helmfile render per cluster, PR with render check in GitHub Actions, Argo CD app-of-apps.",
        "Run operator and platform upgrades through ACM policy and OLM manual approvals, with the blockers mapped before anything is clicked.",
        "Storage and backup: ODF / Ceph, OADP, etcd backups. Policy and secrets: Kyverno, ACS, Compliance Operator, Vault with External Secrets.",
        "Observability: Prometheus and Alertmanager, Loki, Tempo and OpenTelemetry, NetObserv, Thanos. Incidents end in a root cause and a runbook.",
      ],
      situations: [
        { t: "Operator upgrade deadlocked on the prod hub", d: "Three stacked causes: registry proxy-cache errors, a pruned catalog and a stray manual approval. Reinstalled the operator stack with the data plane untouched." },
        { t: "QA cluster wedged for about 29 hours", d: "Pods stuck creating, nodes Ready. Registry crashloop led to process exhaustion and CRI-O timeouts on near-full storage. Unblocked writes, rolling reboots, fast-path runbook. Dropped my own wrong OOM theory before it spread." },
        { t: "OpenShift 4.19 to 4.20 flagged Upgradeable=False", d: "Mapped operator version limits and removed-API acks, set the order, ran 4.18 to 4.19 via ACM policy including a drain stuck on a PDB." },
        { t: "GitOps operator 1.17 to 1.21", d: "Checked every breaking change against our config, rolled QA through a chart bump, both clusters healthy." },
        { t: "Security namespace down, symptom pointed elsewhere", d: "Collector log spam hid missing SCC role bindings after an operator crash. Re-reconcile fixed it." },
      ],
      tags: ["OpenShift", "ACM", "OLM", "Helm", "Helmfile", "Argo CD", "ODF / Ceph", "Kyverno", "Vault", "GitHub Actions", "Loki", "Tempo", "Thanos", "Runbooks"],
    },
    {
      id: "healthcare-platforms",
      title: "Healthcare platform engineering",
      org: "ProsoftKe",
      status: "Running",
      color: "#ffc64a",
      focus: "AKS, Hetzner, multi-tenant Kubernetes, GitOps delivery",
      summary: "Building and operating clusters for hospital software where every namespace wants privacy, uptime and a little emotional support.",
      highlights: [
        "Operate multiple AKS clusters and a larger Hetzner Kubernetes platform across development, test, production and customer-dedicated environments.",
        "Own GitOps delivery from container build to Argo CD sync, using GitLab CI templates, Kustomize, Helm and sealed secrets to keep releases reproducible.",
        "Scaled a multi-tenant cluster to thousands of pods with namespace isolation, quotas and enough observability to answer questions before they become incidents.",
        "Debug service connectivity, PostgreSQL, MongoDB, Kafka-compatible (Redpanda) flows and tracing issues across teams when the symptom says one thing and the root cause says another.",
      ],
      situations: [
        { t: "Kubernetes writes blocked, readiness green", d: "Fragmented etcd. Sequential member defrag with validation between steps restored writes." },
        { t: "Search stopped advancing", d: "Lost CDC replication slot. Diagnosed, repaired and re-snapshotted the flow." },
        { t: "Alerts silently stopped arriving", d: "A retired connector was the only path. Replaced the integration and verified delivery end to end." },
        { t: "Partial migration crash-looped a service", d: "Found the migration layer, stopped the workload and cleaned the orphaned state before restart." },
      ],
      tags: ["AKS", "Hetzner", "Argo CD", "GitLab CI", "Kustomize", "Helm", "Redpanda", "PostgreSQL", "MongoDB", "Loki", "Tempo", "etcd"],
    },
    {
      id: "home-lab",
      title: "Home lab: k3s cloud, GPU node and AI stack",
      org: "Personal",
      status: "Running",
      color: "#42e0ff",
      focus: "Hetzner k3s, home GPU worker, RAG chatbot, Kubernetes AI agent, full GitOps",
      summary: "Personal playground for learning the AI stack hands-on. Built to experiment, break things safely and carry the patterns into real projects.",
      highlights: [
        "k3s control-plane on Hetzner plus an NVIDIA GPU worker at home (RTX 2070) joined over Tailscale. One cluster, two locations.",
        "All apps deployed via Argo CD GitOps with selfHeal and prune. No manual kubectl apply.",
        "AI chat (ai.filipcsupka.online): RAG chatbot answering questions about me. Ollama qwen3:8b on the GPU node, nomic-embed-text embeddings, ChromaDB, FastAPI. Content is markdown; push, CI rebuilds, pod re-ingests.",
        "k8s-ai-agent: Alertmanager fires, a LangGraph ReAct loop (max 120 s, 3 concurrent) calls k8s API tools, Ollama diagnoses the root cause, Slack gets the report.",
        "Observability: kube-prometheus-stack, Loki, Grafana, DCGM exporter for GPU metrics. CI/CD: GitHub Actions to GHCR, image tag bump in the infra repo, Argo CD deploys.",
      ],
      situations: [],
      tags: ["k3s", "Hetzner", "GPU", "Tailscale", "Argo CD", "Ollama", "LangGraph", "ChromaDB", "RAG", "Prometheus", "FastAPI", "Python"],
    },
    {
      id: "cloud-foundations",
      title: "Cloud infrastructure foundations",
      org: "Ness · MaxintheCloud",
      status: "Running",
      color: "#a78bfa",
      focus: "AWS fundamentals, Bicep, infrastructure thinking, delivery discipline",
      summary: "Moved deeper into cloud architecture and learned that most outages are just undocumented assumptions wearing a hoodie.",
      highlights: [
        "Converted ARM templates to Bicep and built CI/CD pipelines for automated template deployment and validation.",
        "Worked on AWS-oriented infrastructure topics and prepared toward Solutions Architect Associate level knowledge.",
        "Strengthened the habit of designing for repeatability, recovery and operational ownership instead of only getting things deployed once.",
      ],
      situations: [],
      tags: ["AWS", "Bicep", "CI/CD", "Cloud Architecture", "Reliability"],
    },
    {
      id: "team-leadership",
      title: "Technical leadership and migrations",
      org: "Datagroup",
      status: "Running",
      color: "#42e0ff",
      focus: "team leadership, groupware migrations, customer coordination",
      summary: "Led admins, migrations and vendor conversations; translated business urgency into technical work without losing the plot.",
      highlights: [
        "Provided technical leadership, mentoring and delivery coordination for an administration team.",
        "Supported rollouts, migrations and documentation across collaboration platforms.",
        "Kept customers, vendors and internal teams aligned when timelines were optimistic and reality had comments.",
      ],
      situations: [],
      tags: ["Leadership", "Migration", "Exchange", "Teams", "Documentation"],
    },
    {
      id: "enterprise-operations",
      title: "Enterprise operations",
      org: "Diebold Nixdorf",
      status: "Running",
      color: "#ffc64a",
      focus: "service quality, people coordination, operational discipline",
      summary: "The earlier ops years: people, process, uptime and the discovery that clear communication fixes more tickets than heroic typing.",
      highlights: [
        "Coordinated administration work, team health and service quality for enterprise environments.",
        "Worked with department leads and customers on priorities, escalations and operational improvements.",
        "Built the practical foundation for later SRE work: measure, communicate, automate, repeat.",
      ],
      situations: [],
      tags: ["Operations", "Service Management", "Leadership", "Customer Support"],
    },
  ],

  // SKILL MATRIX TABLE
  skills: [
    { name: "Orchestration",      note: "Clusters, workloads, upgrades and the occasional pod that needs a calm conversation.", level: 0.92, tags: ["Kubernetes", "OpenShift", "AKS", "Helm", "Kustomize", "Docker"] },
    { name: "GitOps & automation", note: "Deployments should be reviewable, repeatable and less dependent on someone remembering the magic command.", level: 0.88, tags: ["ArgoCD", "GitLab CI", "GitHub Actions", "Terraform", "Sealed Secrets"] },
    { name: "Observability",      note: "Dashboards that answer real questions; alerts that try not to ruin dinner.", level: 0.84, tags: ["Prometheus", "Grafana", "Loki", "Tempo", "Alloy", "Tracing"] },
    { name: "Data & messaging",   note: "Enough database and streaming knowledge to debug cross-service mysteries without blaming the network.", level: 0.74, tags: ["Kafka", "MongoDB", "PostgreSQL", "Kafka Connect"] },
  ],

  languages: [
    { lang: "Slovak",  level: 1.0, note: "native" },
    { lang: "English", level: 0.85, note: "professional" },
    { lang: "Czech",   level: 0.78, note: "comfortably understood" },
  ],

  // ABOUT TABLE
  about: [
    { key: "Energy",   val: "Hybrid athlete, every-sport enjoyer, master of none, happily over-scheduled by choice.", color: "#5cffb1" },
    { key: "Home lab", val: "Hosts this web and my wife's web on Hetzner Kubernetes because a simple VPS would be suspiciously reasonable.", color: "#42e0ff" },
    { key: "Family",   val: "Free time belongs to my kid first. The cluster can wait; childhood does not have retry logic.", color: "#ffc64a" },
    { key: "AI mode",  val: "Since AI found me, I became a workaholic who occasionally thinks he can do everything alone. Then production politely disagrees.", color: "#ff5f80" },
    { key: "Typos",    val: "If you find a typo in the repo, it is probably already labeled with my name.", color: "#a78bfa" },
  ],

  notes: [
    "Map the unknown, test it, document it, automate it.",
    "Turn vague production pain into dashboards, runbooks, and pipelines.",
    "Sit between dev, ops, and management without losing the YAML.",
    "Repeatable automation > heroic typing.",
    "Clusters supervised by reality, no matter how loud the AI.",
  ],

  // CONTACT TABLE
  contact: [
    { key: "Location", val: "Kosice, Slovakia" },
    { key: "Role",     val: "DevOps / SRE / Kubernetes Engineer" },
    { key: "Mobile",   val: "0919 235 462", href: "tel:+421919235462" },
    { key: "Email",    val: "devopssro@gmail.com", href: "mailto:devopssro@gmail.com" },
    { key: "GitHub",   val: "github.com/Filipcsupka", href: "https://github.com/Filipcsupka" },
    { key: "LinkedIn", val: "linkedin.com/in/filip-csupka", href: "https://linkedin.com/in/filip-csupka-21a26713a" },
    { key: "CV",       val: "Download CV (.docx)", href: "/Filip_csupka_CV.docx", download: "Filip_csupka_CV.docx" },
    { key: "Status",   val: "Open to remote / relocation" },
  ],

  sideProjects: [
    {
      name: "vevsdesign.sk",
      href: "https://vevsdesign.sk",
      tagline: "wife's design studio",
      blurb: "Hosted on my home Hetzner Kubernetes cluster, deployed via GitOps. Same pipeline as this CV.",
      color: "#a78bfa",
    },
    {
      name: "filip-cv",
      href: "https://github.com/Filipcsupka/cv-web",
      tagline: "this site",
      blurb: "React · Babel-standalone · Docker · nginx · K8s · Cloudflare Tunnel. No build step.",
      color: "#42e0ff",
    },
    {
      name: "home-lab",
      href: null,
      tagline: "personal cluster",
      blurb: "Hetzner Kubernetes running production-style: ArgoCD, sealed secrets, Prometheus, the whole stack on a budget.",
      color: "#5cffb1",
    },
  ],
};
