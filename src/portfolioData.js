// ============================================================
// ARCHIE S. BOISER — PORTFOLIO DATA
// Full-Stack Developer + AI Product Builder
// ============================================================

export const profile = {
  brand: 'archie',
  siteTitle: 'Archie S. Boiser — Full-Stack Developer & Generative AI Builder',
  name: 'Archie S. Boiser',
  role: 'Full-Stack Developer & Generative AI Builder',
  tagline: 'Building cool web applications and smart generative AI projects.',
  avatar: '/profile_picture/profile_image.png',
  location: 'Lupon, Davao Oriental, Philippines',
  timezone: 'Asia/Manila',
  email: 'archie.boiser05@gmail.com',
  status: 'Open for cool projects & collaborations',
  statement:
    'I build fast, responsive web apps and smart generative AI tools from scratch.',
  bio:
    'a full-stack developer and generative AI builder based in the Philippines. I love turning wild ideas into fast web apps and building smart AI tools that actually get things done.',
}

export const socials = [
  { label: 'GitHub', username: '@rchieeee', url: 'https://github.com/rchieeee' },
  { label: 'LinkedIn', username: 'Archie Boiser', url: 'https://www.linkedin.com/in/archie-boiser-552548344/' },
  { label: 'Facebook', username: 'Archie Boiser', url: 'https://www.facebook.com/rchieaa/' },
  { label: 'Email', username: profile.email, url: 'https://mail.google.com/mail/?view=cm&fs=1&to=archie.boiser05@gmail.com' },
]

export const keyMetrics = [
  { label: 'Projects Shipped', value: '15+', detail: 'Full-stack & AI applications' },
  { label: 'Core Stack', value: 'React / Node', detail: 'Next.js, Python, PostgreSQL' },
  { label: 'AI Harnesses', value: 'Deterministic', detail: 'Validation & RAG pipelines' },
  { label: 'Base Location', value: 'PH / UTC+8', detail: 'Lupon, Davao Oriental' },
]

export const codeSnippets = {
  frontend: `// React 19 + Tailwind CSS — Responsive UI Component
export function MetricsCard({ title, value, trend }) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white/80 p-5 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <p className="font-mono text-xs text-gray-500 uppercase">{title}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        <span className="text-xs font-mono text-emerald-500">{trend}</span>
      </div>
    </div>
  );
}`,
  backend: `// Node.js + Express / FastAPI — Resilient API Handler
app.post('/api/v1/harness/execute', authenticate, async (req, res) => {
  const { prompt, context, constraints } = req.body;
  
  // 1. Guardrail validation & AST verification
  const sanitized = await validateInput(prompt, constraints);
  
  // 2. Multi-step LLM Execution with fallback
  const result = await aiEngine.process(sanitized, { retries: 3 });
  
  // 3. Structured output diff verification
  const verifiedOutput = await verifySyntaxAndDiff(result);
  return res.json({ success: true, data: verifiedOutput });
});`,
  aiHarness: `// Custom Deterministic AI Harness Pipeline
class AIProductHarness {
  constructor(config) {
    this.validator = new GuardrailValidator(config.rules);
    this.orchestrator = new LLMOrchestrator(config.model);
    this.sandbox = new CodeSandboxRunner();
  }

  async runPipeline(input) {
    const valid = this.validator.check(input);
    const generated = await this.orchestrator.generate(valid);
    const testResult = await this.sandbox.executeTests(generated);
    return testResult.passed ? generated : this.heal(generated, testResult.error);
  }
}`,
}

export const harnessStages = [
  {
    step: '01',
    name: 'Context & Guardrails',
    desc: 'Sanitizes input, verifies constraints, and injects project schemas into prompt context.',
    badge: 'Input Guard',
  },
  {
    step: '02',
    name: 'LLM Orchestration',
    desc: 'Processes tasks with structured JSON schemas and model fallback redundancy.',
    badge: 'Execution',
  },
  {
    step: '03',
    name: 'Validation Sandbox',
    desc: 'Runs AST linting, syntax verification, and unit tests before applying changes.',
    badge: 'Verification',
  },
  {
    step: '04',
    name: 'Deterministic Diff',
    desc: 'Produces precise, auditable visual diffs and logs for complete reliability.',
    badge: 'Deployment',
  },
]

export const kabanScreenshots = [
  {
    id: 'dashboard-dark',
    title: 'Treasury Overview & Analytics (Dark Mode)',
    category: 'Analytics',
    src: '/project-images/kaban/1.jpg',
    desc: 'Real-time financial analytics, live cashflow trend chart, period filters, and multi-admin sync.',
  },
  {
    id: 'dashboard-light',
    title: 'Treasury Overview & Analytics (Light Mode)',
    category: 'Analytics',
    src: '/project-images/kaban/2.jpg',
    desc: 'Clean light mode interface designed for high-visibility daytime treasury office operations.',
  },
  {
    id: 'login-3fa',
    title: '3-Factor Auth — Factor 1: Salted Hash & Bot Shield',
    category: 'Security (3FA)',
    src: '/project-images/kaban/14.jpg',
    desc: 'Factor 1: Salted SHA-256 Web Crypto hashing with Cloudflare Turnstile bot shielding.',
  },
  {
    id: 'login-otp',
    title: '3-Factor Auth — Factor 2: Gmail OTP Verification',
    category: 'Security (3FA)',
    src: '/project-images/kaban/15.jpg',
    desc: 'Factor 2: 6-digit Gmail OTP via Supabase SMTP with 120-second countdown and 3-attempt lockout.',
  },
  {
    id: 'login-pin',
    title: '3-Factor Auth — Factor 3: Security PIN & Account Freeze',
    category: 'Security (3FA)',
    src: '/project-images/kaban/16.jpg',
    desc: 'Factor 3: Master Security PIN with 24-hour automatic account freeze upon 3 failed attempts.',
  },
  {
    id: 'payables-grid',
    title: 'Payables & Dues Management Grid',
    category: 'Treasury Ops',
    src: '/project-images/kaban/7.jpg',
    desc: 'Active payable events, collection turnouts, target pools, and due date trackers.',
  },
  {
    id: 'scope-engine',
    title: 'Dynamic Fee Scope Targeting Engine',
    category: 'Treasury Ops',
    src: '/project-images/kaban/8.jpg',
    desc: 'Automated fee assignment targeting specific courses, year levels, or sections.',
  },
  {
    id: 'payment-cashier',
    title: 'Payment Collection & Realtime Cashier',
    category: 'Treasury Ops',
    src: '/project-images/kaban/5.jpg',
    desc: 'Instant student search, fee checklist, cashier change calculator, and auto-generated receipt IDs.',
  },
  {
    id: 'receipt-pdf',
    title: 'Official Receipt PDF & Print View',
    category: 'Treasury Ops',
    src: '/project-images/kaban/6.jpg',
    desc: 'High-fidelity printable student payment receipt with QR verification and audit signature.',
  },
  {
    id: 'expenses-log',
    title: 'Purchases & Expense Disbursements',
    category: 'Treasury Ops',
    src: '/project-images/kaban/9.jpg',
    desc: 'Council expense tracker with receipt attachments and pending-to-disbursed workflow.',
  },
  {
    id: 'transparency-portal',
    title: 'Public Transparency Portal & Ledger',
    category: 'Transparency',
    src: '/project-images/kaban/17.jpg',
    desc: 'Zero-friction student ledger and public fund summary with rate-limited scraping protection.',
  },
  {
    id: 'transparency-guide',
    title: 'Student Manual & Visual Walkthrough',
    category: 'Transparency',
    src: '/project-images/kaban/13.jpg',
    desc: 'Public onboarding guide showing students how to verify their dues in 4 simple steps.',
  },
  {
    id: 'student-directory',
    title: 'Student Roster Directory & Batch Actions',
    category: 'Students',
    src: '/project-images/kaban/3.jpg',
    desc: 'Comprehensive student registry with CSV batch import and filtering.',
  },
  {
    id: 'student-ledger',
    title: 'Individual Student Balance Ledger',
    category: 'Students',
    src: '/project-images/kaban/4.jpg',
    desc: 'Per-student financial ledger detailing assessed payables, payment records, and unsettled balance.',
  },
  {
    id: 'officer-rbac',
    title: 'Officer Accounts & Role-Based Access',
    category: 'Governance',
    src: '/project-images/kaban/10.jpg',
    desc: 'Multi-role officer management (Admin, Treasurer, Auditor) with granular permissions.',
  },
  {
    id: 'audit-trail',
    title: 'Immutable Audit Trail Activity Logs',
    category: 'Governance',
    src: '/project-images/kaban/11.jpg',
    desc: 'Timestamped event logs recording every financial mutation with officer signatures.',
  },
  {
    id: 'settings-reset',
    title: 'System Config & 3FA Reset Safety Gate',
    category: 'Governance',
    src: '/project-images/kaban/12.jpg',
    desc: 'Academic period switcher and double-gated emergency system reset.',
  },
]

export const projects = [
  {
    id: 'kaban',
    slug: 'kaban',
    name: 'KABAN — Treasury System',
    category: 'Fintech & Public Transparency',
    tagline: 'Production financial management platform & public transparency portal built for a real university student council.',
    year: '2026',
    featured: true,
    accent: 'from-amber-500/20 via-emerald-500/10 to-teal-500/5',
    badge: 'Flagship Enterprise App',
    heroImage: '/project-images/kaban/1.jpg',
    images: kabanScreenshots,
    tools: ['Next.js 14', 'TypeScript', 'Supabase', 'Tailwind CSS', '3-Factor Auth'],
    stats: [
      { label: 'Security Model', value: '3-Factor Auth' },
      { label: 'Data Sync', value: 'Offline-First + Realtime' },
      { label: 'DB Architecture', value: '9 RLS Tables' },
      { label: 'Production Status', value: 'Active Council Use' },
    ],
    summary:
      'A production-ready financial management platform and public transparency portal built for a university student council with custom 3FA security and offline sync.',
    overview:
      'KABAN (Tagalog for "treasury/vault") digitizes and secures the entire financial workflow of a university student council. It eliminates manual paper spreadsheets with automated fee assignment, cashier collection with printable receipts, expense tracking with receipt attachments, multi-admin live synchronization, and a zero-friction public transparency portal.',
    challenge:
      'Student councils often face severe auditing discrepancies, paper receipts loss, slow manual fee collection, and lack of fiscal transparency. Furthermore, erratic campus Wi-Fi causes data loss during heavy enrollment rushes, while handling sensitive funds demands bank-grade authentication without relying on expensive SaaS identity subscriptions.',
    solution:
      'Engineered a dual-layer Offline-First architecture combining Supabase PostgreSQL (source of truth) with LocalStorage cache fallback, real-time multi-admin sync via Supabase Channels, an automated fee scope targeting engine, and a proprietary zero-dependency 3-Factor Authentication system (Salted SHA-256 + Gmail OTP + 24h Freeze PIN).',
    architecture: [
      'Edge Layer: Cloudflare WAF + Turnstile bot protection + Next.js 14 Middleware with HMAC-SHA256 session token verification.',
      'Data Layer: Supabase PostgreSQL with strict Row-Level Security (RLS) policies across 9 relational tables.',
      'Offline-First Engine: Dual-sync storage layer caching mutations in LocalStorage and syncing on network recovery.',
      'Real-Time Bus: Supabase Realtime WebSocket channels broadcasting instant collection and disbursement updates across all active admins.',
      'Public Ledger: Sliding-window rate-limited transparency portal allowing students to verify dues via 8-digit student ID without account friction.',
    ],
    highlights: [
      'Custom 3-Factor Authentication without third-party auth bloat (Web Crypto SHA-256, Gmail OTP, 24h Lockout PIN)',
      'Offline-First hybrid sync supporting intermittent campus network conditions',
      'Multi-admin live WebSocket synchronization via Supabase Realtime Channels',
      'Dynamic Fee Scope Engine targeting specific programs, year levels, or sections',
      'Frictionless Public Student Transparency Ledger with anti-scraping rate limiting',
      'High-fidelity printable official receipts (PDF-ready with verification stamps)',
      'Comprehensive audit trail logging every financial transaction with officer signatures',
    ],
    githubUrl: 'https://github.com/XeinQt/treasurerSystem',
    liveUrl: 'https://treasurer-system.vercel.app',
  },
  {
    id: 'kanso',
    slug: 'kanso',
    name: 'Kanso Studio',
    category: 'E-Commerce & Digital Flagship',
    tagline: 'Minimalist editorial commerce built around honest craftsmanship.',
    year: '2025',
    featured: true,
    accent: 'from-amber-500/20 to-stone-500/5',
    badge: 'Digital Commerce',
    tools: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe API'],
    summary:
      'An editorial storefront designed for high visual fidelity, seamless checkout flows, and sub-second page transitions.',
    overview:
      'Kanso is a digital flagship for an artisanal brand where materials and design details take center stage.',
    challenge:
      'Balancing high-resolution photography and editorial storytelling with lightning-fast Core Web Vitals and frictionless cart checkout.',
    solution:
      'Built with Next.js App Router, image optimization pipelines, and a headless checkout integration.',
    highlights: [
      '100/100 Lighthouse Performance score',
      'Instant fluid page transitions',
      'Accessible responsive cart drawer',
    ],
    githubUrl: 'https://github.com/rchieeee',
    liveUrl: 'https://github.com/rchieeee',
  },
  {
    id: 'common-ground',
    slug: 'common-ground',
    name: 'Common Ground',
    category: 'Community & Event Platform',
    tagline: 'Modular platform connecting builders, thinkers, and tech communities.',
    year: '2025',
    featured: true,
    accent: 'from-blue-500/20 to-indigo-500/5',
    badge: 'Community Hub',
    tools: ['React', 'Express', 'Tailwind CSS', 'WebSockets'],
    summary:
      'An event platform and community forum facilitating live tech meetups and collaborative initiatives.',
    overview:
      'Common Ground unites tech builders around events, shared workshops, and community-led open-source projects.',
    challenge:
      'Delivering real-time attendee interactions and calendar coordination across multiple regional chapters.',
    solution:
      'Implemented WebSockets for live chat streams, automated RSVP reminders, and modular community spaces.',
    highlights: [
      'Live discussion feeds with WebSockets',
      'Timezone-aware event scheduling',
      'Custom role-based permissions',
    ],
    githubUrl: 'https://github.com/rchieeee',
    liveUrl: 'https://github.com/rchieeee',
  },
  {
    id: 'synapse-ai',
    slug: 'synapse-ai',
    name: 'Synapse AI Engine',
    category: 'AI Tooling & Automation',
    tagline: 'Developer harness for automated code transformations and verification.',
    year: '2025',
    featured: false,
    accent: 'from-purple-500/20 to-pink-500/5',
    badge: 'AI Harness',
    tools: ['Python', 'FastAPI', 'Claude API', 'React'],
    summary:
      'An intelligent harness connecting LLMs to code repositories with strict AST validation and test execution.',
    overview:
      'Synapse enables developers to run multi-file code refactors safely with automated test validation before changes are applied.',
    challenge:
      'Raw LLM code generation often hallucinate APIs or break syntax in large codebases.',
    solution:
      'Engineered an execution harness that parses AST diffs and runs sandbox tests before staging code.',
    highlights: [
      'Automated AST syntax checking',
      'Visual before/after diff generator',
      'Sandbox test verification runner',
    ],
    githubUrl: 'https://github.com/rchieeee',
    liveUrl: 'https://github.com/rchieeee',
  },
]

export const experience = [
  {
    period: '2025 — Present',
    role: 'Generative Full-Stack AI Engineer',
    company: 'Independent Systems Engineering / AI Products',
    location: 'Remote · Philippines',
    description:
      'Architecting end-to-end full-stack systems, engineering generative AI products and LLM harnesses, and deploying high-performance web applications.',
    skills: ['React', 'Next.js', 'Node.js', 'Python', 'Generative AI', 'LLM Harnesses'],
  },
  {
    period: '2024 — 2025',
    role: 'Frontend & Full-Stack Developer',
    company: 'Web Solutions Studio',
    location: 'Davao / Remote',
    description:
      'Developed customer-facing web apps, built RESTful APIs, and optimized Core Web Vitals for high-traffic platforms.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
  },
  {
    period: '2023 — 2024',
    role: 'Software Developer',
    company: 'Tech Solutions & Development',
    location: 'Philippines',
    description:
      'Implemented database schemas, backend services, and interactive dashboard modules for business automation systems.',
    skills: ['JavaScript', 'Node.js', 'Express', 'MySQL'],
  },
]

export const techCategories = [
  {
    name: 'Frontend Engineering',
    items: ['React 19', 'Next.js (App Router)', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5 / CSS3', 'Vite'],
  },
  {
    name: 'Backend & APIs',
    items: ['Node.js', 'Express.js', 'Python', 'FastAPI', 'REST APIs', 'GraphQL', 'Authentication (JWT/OAuth)'],
  },
  {
    name: 'Databases & Cloud',
    items: ['PostgreSQL', 'Supabase', 'Prisma ORM', 'Redis', 'Docker', 'Vercel', 'Git & GitHub CI/CD'],
  },
  {
    name: 'AI Engineering & Tooling',
    items: ['Claude API / Anthropic', 'OpenAI API', 'Prompt Engineering', 'AI Guardrails & Harnesses', 'RAG Pipelines'],
  },
]

export const testimonials = [
  {
    quote:
      'Archie is a rare developer who truly grasps both the visual design nuances and the backend engineering logic. He delivers clean, maintainable code on tight deadlines.',
    author: 'Mark Dave',
    role: 'Lead Software Architect',
    initials: 'MD',
  },
  {
    quote:
      'His ability to implement modern AI workflows into real production features gave our project a huge competitive edge. Highly recommended for full-stack engineering.',
    author: 'Karlo Santos',
    role: 'Product Engineering Lead',
    initials: 'KS',
  },
  {
    quote:
      'Archie approaches problems with curiosity and engineering rigor. His attention to responsiveness, accessibility, and clean architecture is outstanding.',
    author: 'Janelle Cruz',
    role: 'Senior UI/UX Designer',
    initials: 'JC',
  },
]

export const terminalCommands = {
  help: `Available commands:
  • kaban       - Inspect KABAN Student Council Treasury System (Flagship)
  • play        - Launch realtime multiplayer Cyber Arcade & live chat
  • coffee      - Pang-kape & OpenAI Token Fund (GCash)
  • about       - View Archie's engineering bio & philosophy
  • projects    - List featured full-stack & AI projects
  • stack       - Inspect full technical toolchain
  • experience  - Review career timeline & roles
  • contact     - Get direct communication links
  • time        - Check live Manila timezone & node status
  • clear       - Clear terminal history`,
  kaban: `🏦 KABAN — Student Council Treasury System [Flagship Enterprise App]
• Type: Full-Stack Treasury & Transparency Platform (Real Council Production)
• Stack: Next.js 14, TypeScript, Supabase (PostgreSQL), 3-Factor Auth, Realtime
• Live Demo: https://treasurer-system.vercel.app
• GitHub: https://github.com/XeinQt/treasurerSystem
• Developers: Archie S. Boiser & Rico Alentijo`,
  treasury: `🏦 KABAN — Student Council Treasury System [Flagship Enterprise App]
• Type: Full-Stack Treasury & Transparency Platform (Real Council Production)
• Stack: Next.js 14, TypeScript, Supabase (PostgreSQL), 3-Factor Auth, Realtime
• Live Demo: https://treasurer-system.vercel.app
• GitHub: https://github.com/XeinQt/treasurerSystem
• Developers: Archie S. Boiser & Rico Alentijo`,
  play: `Launching Archie Cyber Arcade [Multiplayer Arena]...`,
  coffee: `☕ Archie's Pang-Token & Kape Fund:
"Tabangi intawon si Archie mupalit ug OpenAI credits kay hapit na mahurot ang token!"

• GCash Number: +639635272862 (09635272862)
• Recipient: Archie S. Boiser
Daghan kaayong salamat sa support bai! 🚀`,
  donate: `☕ Archie's Pang-Token & Kape Fund:
"Tabangi intawon si Archie mupalit ug OpenAI credits kay hapit na mahurot ang token!"

• GCash Number: +639635272862 (09635272862)
• Recipient: Archie S. Boiser
Daghan kaayong salamat sa support bai! 🚀`,
  tip: `☕ Archie's Pang-Token & Kape Fund:
"Tabangi intawon si Archie mupalit ug OpenAI credits kay hapit na mahurot ang token!"

• GCash Number: +639635272862 (09635272862)
• Recipient: Archie S. Boiser
Daghan kaayong salamat sa support bai! 🚀`,
  about: `Archie S. Boiser — Generative Full-Stack AI Engineer
Based in Lupon, Davao Oriental, Philippines (UTC+8).
Architecting complete systems with AI, generative product development, scalable React/Next.js/Node backends, and deterministic LLM harnesses.`,
  projects: `Featured Projects:
1. KABAN — Student Council Treasury System (Next.js 14 + Supabase + 3FA)
2. Kanso Studio — Modern Editorial Commerce Flagship (Next.js + Stripe)
3. Common Ground — Realtime Community & Event Platform (React + WebSockets)
4. Synapse AI Engine — Automated Code Refactor & Verification Harness`,
  stack: `Tech Stack:
• Frontend: React 19, Next.js 14 (App Router), TypeScript, Tailwind CSS, Vite
• Backend: Node.js, Express, Python, FastAPI, PostgreSQL, Supabase
• Security & Realtime: Web Crypto 3FA, Cloudflare Turnstile, Supabase Realtime
• AI Systems: Claude API, OpenAI API, Guardrails, Deterministic Harnesses`,
  experience: `Timeline:
• 2025 - Present: Generative Full-Stack AI Engineer (Remote)
• 2024 - 2025: Frontend & Full-Stack Developer (Web Solutions Studio)
• 2023 - 2024: Software Developer (Tech Solutions & Development)`,
  contact: `Direct Contact:
• Email: archie.boiser05@gmail.com
• GitHub: https://github.com/rchieeee
• LinkedIn: https://linkedin.com/in/archie-boiser-552548344/`,
}
