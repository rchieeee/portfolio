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

export const pnpScreenshots = [
  {
    id: 'pnp-landing',
    title: 'Executive Landing Hub',
    category: 'Public Hub',
    src: '/project-images/pnp/1.png',
    desc: 'Commanding landing portal with dual organizational crests, creed of honor, and secure member access gate.',
  },
  {
    id: 'pnp-orientation',
    title: 'Orientation Guide & Core Services',
    category: 'Public Hub',
    src: '/project-images/pnp/2.png',
    desc: 'Interactive 4-step user guide detailing the 8-digit ID format, roll call attendance rules, and disciplinary levels.',
  },
  {
    id: 'pnp-portal-terminal',
    title: 'Member Access Terminal (8-Digit OTP)',
    category: 'Member Portal',
    src: '/project-images/pnp/3.png',
    desc: 'Auto-advancing 8-digit OTP ID verification terminal with clipboard paste and cooldown rate-limiting.',
  },
  {
    id: 'pnp-credential-card',
    title: 'Digital Credential Card & Call-Sign',
    category: 'Member Portal',
    src: '/project-images/pnp/4.png',
    desc: 'Live verified member digital ID card with photo, rank, chapter assignment, and radio call-sign for PNP checkpoint verification.',
  },
  {
    id: 'pnp-weekly-attendance',
    title: 'Weekly Attendance History Ledger',
    category: 'Member Portal',
    src: '/project-images/pnp/5.png',
    desc: 'Segmented weekly attendance roll call logs with verified Present/Absent badges and automated timestamps.',
  },
  {
    id: 'pnp-admin-dashboard',
    title: 'Command Center & 1-Tap Roll Call',
    category: 'Command Center',
    src: '/project-images/pnp/6.png',
    desc: 'HQ administrative dashboard with 1-tap Present/Absent attendance marking, search filters, and active roster management.',
  },
  {
    id: 'pnp-memorandum',
    title: 'Official Warning Memorandum Dispatch',
    category: 'Disciplinary Engine',
    src: '/project-images/pnp/7.png',
    desc: '3-stage disciplinary escalation engine generating print-ready official memorandums with dual command signatories.',
  },
  {
    id: 'pnp-settings',
    title: 'Chapter Settings & Organization Config',
    category: 'Command Center',
    src: '/project-images/pnp/8.png',
    desc: 'Management panel for regional municipal chapters, official signatories, and instant portal link sharing.',
  },
]

export const cloudzoneScreenshots = [
  {
    id: 'cz-admin-dash',
    title: 'Admin Command Dashboard & Live KPIs',
    category: 'Admin Oversight',
    src: '/project-images/cloudzone/admin1.jpg',
    desc: 'Real-time sales revenue KPIs, 7-day revenue charts, live transaction marquee, and top debtors monitor.',
  },
  {
    id: 'cz-admin-dash-2',
    title: 'Dashboard Analytics & Debt Breakdown',
    category: 'Admin Oversight',
    src: '/project-images/cloudzone/admin1.1.jpg',
    desc: 'Expanded business health metrics, recent debtor repayment logs, and quick action navigation shortcuts.',
  },
  {
    id: 'cz-pos-checkout',
    title: 'Point of Sale (POS) & Cart Engine',
    category: 'POS & Cashier',
    src: '/project-images/cloudzone/admin2.jpg',
    desc: 'Barcode scanning, product search, cart quantity editing, and dual discount modes (% percentage or fixed ₱).',
  },
  {
    id: 'cz-checkout-cash',
    title: 'Cash Payment & Change Calculator',
    category: 'Checkout & Sales',
    src: '/project-images/cloudzone/admin6(cash).jpg',
    desc: 'Quick cash denomination buttons with instant change calculation and transaction reference generation.',
  },
  {
    id: 'cz-checkout-credit',
    title: 'Credit Sales & Debt Tracking',
    category: 'Checkout & Sales',
    src: '/project-images/cloudzone/admin5(credit).jpg',
    desc: 'Searchable customer selector for on-account credit sales with running balance and payment terms.',
  },
  {
    id: 'cz-receipt-print',
    title: 'Thermal Printable PDF Receipts',
    category: 'Checkout & Sales',
    src: '/project-images/cloudzone/admin7(receipt).jpg',
    desc: 'Thermal-formatted 58mm/80mm PDF receipt generation with native sharing support and business header.',
  },
  {
    id: 'cz-inventory',
    title: 'Real-Time Inventory & Stock Alerts',
    category: 'Inventory Management',
    src: '/project-images/cloudzone/admin3.jpg',
    desc: 'Live stock monitoring with configurable low-stock threshold badges (In Stock / Low / Out of Stock).',
  },
  {
    id: 'cz-sales-history',
    title: 'Auditable Sales History Ledger',
    category: 'Sales Audit',
    src: '/project-images/cloudzone/admin8.jpg',
    desc: 'Complete transaction history with unique reference IDs, date range filters, return processing, and CSV export.',
  },
  {
    id: 'cz-customer-mgmt',
    title: 'Customer Directory & Credit Balances',
    category: 'Customer CRM',
    src: '/project-images/cloudzone/admin9(customers).jpg',
    desc: 'Customer profiles with debt isolation: cashiers manage own sales; admin views organization-wide outstanding ledger.',
  },
  {
    id: 'cz-user-roles',
    title: 'Multi-Cashier & Role Access Control',
    category: 'Security & Roles',
    src: '/project-images/cloudzone/admin10(users).jpg',
    desc: 'Role-based access (Admin vs Cashier) with SHA-256 password hashing and remote multi-device session sync.',
  },
  {
    id: 'cz-expenses',
    title: 'Business Expense Tracking & P&L',
    category: 'Financial Tracking',
    src: '/project-images/cloudzone/admin11(expenses).jpg',
    desc: 'Admin expense logging categorized by operating costs for automated net profit calculation.',
  },
  {
    id: 'cz-cashier-pos',
    title: 'Cashier POS Terminal & Quick Cart',
    category: 'POS & Cashier',
    src: '/project-images/cloudzone/cashier3.jpg',
    desc: 'Dedicated cashier checkout interface with zero-latency SQLite writes and real-time background cloud drainage.',
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
    tools: [
      'Next.js 14 (App Router)',
      'TypeScript',
      'Supabase (PostgreSQL)',
      'Tailwind CSS',
      'Custom 3-Factor Auth (Web Crypto)',
      'Cloudflare Turnstile',
      'Supabase Realtime Channels',
      'Offline-First LocalStorage Sync',
      'Row-Level Security (RLS)',
      'HMAC-SHA256 Session Tokens',
      'PapaParse (CSV)',
      'SheetJS / XLSX',
      'Lucide React',
      'Vercel Edge Network',
    ],
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
    id: 'cloudzone-pos',
    slug: 'cloudzone-pos',
    name: 'CloudZone POS — Multi-Device System',
    category: 'Mobile Fintech & Distributed Systems',
    tagline: 'Production-ready multi-device Point of Sale mobile system built with Flutter & Firebase for real-time multi-cashier sync and offline SQLite resilience.',
    year: '2026',
    featured: true,
    accent: 'from-sky-500/20 via-blue-500/10 to-indigo-500/5',
    badge: 'Production Mobile System',
    heroImage: '/project-images/cloudzone/admin1.jpg',
    images: cloudzoneScreenshots,
    tools: [
      'Flutter 3',
      'Dart',
      'Firebase Firestore',
      'SQLite (sqflite)',
      'Firebase Auth',
      'Dart Streams & Reactive Sync',
      'SHA-256 Cryptography',
      'PDF & Thermal Printing Engine',
      'fl_chart Visual Analytics',
      'Connectivity Plus',
      'Shared Preferences',
      'FK-Safe Cross-Device Sync Engine',
      'Remote Factory Reset Signal',
    ],
    stats: [
      { label: 'Local Engine', value: 'SQLite (Zero-Latency Offline)' },
      { label: 'Cloud Backbone', value: 'Firebase Firestore Streams' },
      { label: 'Sync Architecture', value: 'Bidirectional Stream DAG' },
      { label: 'Receipt Output', value: 'Thermal PDF Printable' },
    ],
    summary:
      'A production-ready mobile POS system engineered for multi-cashier retail with bidirectional Firestore sync and instant offline SQLite performance.',
    overview:
      'CloudZone POS is a distributed, production-grade Point of Sale mobile application built with Flutter, SQLite, and Firebase. Designed for multi-cashier retail businesses without expensive centralized server hardware, the system couples a fast local SQLite database with real-time Firebase Firestore snapshot streams. Stock deductions on one cashier device propagate across all connected terminals within seconds, while queued offline mutations guarantee zero lost transactions during internet outages.',
    challenge:
      'Small to medium retail businesses frequently run multiple cashier terminals simultaneously, but lack the budget or infrastructure for dedicated on-premise servers. Common solutions suffer from sync collisions, silent SQLite foreign key constraint failures during cross-device document merges, and complete operational failure during network blackouts.',
    solution:
      'Architected a resilient dual-layer data pipeline: local SQLite handles instant sub-millisecond writes, a persistent SyncEngine drains transactions to Firestore via Dart streams, and dynamic PRAGMA FK-safe upserts ensure seamless document reconciliation across terminals. Included an instant remote factory reset signal that can wipe and log out all connected cashier devices simultaneously from the master admin console.',
    highlights: [
      'Bidirectional Real-Time Sync: Firestore snapshots() listeners sync stock and sales across devices in seconds without manual refresh',
      'Offline-First Local SQLite: Cashiers can process checkouts with zero connectivity; SyncEngine drains the queue upon reconnect',
      'FK-Safe Conflict-Free Merging: Solves SQLite foreign-key constraint conflicts during cross-terminal data replication',
      'Remote Factory Reset Protocol: Master admin can remotely wipe local SQLite databases and force-logout cashier sessions',
      'Dual Payment & Credit Tracking: Supports cash with change calculation and per-customer credit debt ledgers with cashier debt isolation',
      'Thermal PDF Receipt Engine: Generates printable 58mm/80mm receipts with native sharing and transaction reference IDs',
    ],
    developer: 'Archie S. Boiser',
    organization: 'Retail Production System · Philippines 🇵🇭',
    githubUrl: 'https://github.com/rchieeee',
    liveUrl: 'https://github.com/rchieeee',
  },
  {
    id: 'pnp-ccacgi',
    slug: 'pnp-ccacgi',
    name: 'PNP-CCACGI — Personnel & Attendance System',
    category: 'Civic Operations & Security Platform',
    tagline: 'Real-time cloud-synced auxiliary personnel registry, 1-tap roll call attendance, automated warning memos, and field-ready offline resiliency.',
    year: '2026',
    featured: true,
    accent: 'from-blue-500/20 via-indigo-500/10 to-sky-500/5',
    badge: 'Civic Operations Platform',
    heroImage: '/project-images/pnp/1.png',
    images: pnpScreenshots,
    tools: [
      'React 19',
      'TypeScript',
      'Google Cloud Firestore',
      'Firebase Auth',
      'Vite',
      'Tailwind CSS',
      'shadcn/ui',
      'HTML5 Canvas Compression (~30KB)',
      'ExcelJS Spreadsheet Engine',
      'IndexedDB Offline Persistence',
      'Granular Security Rules v2',
      'Lucide Icons',
      'Vercel Edge Network',
    ],
    stats: [
      { label: 'Cloud Database', value: 'Google Firestore' },
      { label: 'Image Compression', value: '99.6% Reduction (~30KB)' },
      { label: 'Field Resiliency', value: 'IndexedDB Offline Cache' },
      { label: 'Security Model', value: 'Role-Based Firestore Rules' },
    ],
    summary:
      'A real-time, cloud-synced civic operations platform engineered for verified personnel identification, 1-tap roll call attendance, and field-ready offline resiliency.',
    overview:
      'The Philippine National Police Communications & Electronics Auxiliary (PNP-CCACGI) operates across regional municipal chapters in Davao Region assisting law enforcement with emergency radio communications and patrols. This system digitizes field assemblies, verifies checkpoint credentials in under 1.5 seconds, compresses member photos by 99.6% directly in-browser, and automates a 3-stage disciplinary warning escalation pipeline with official print-ready memorandums.',
    challenge:
      'Manual paper roll calls were frequently misplaced or difficult to audit during provincial field assemblies. Checkpoint personnel needed instant verification of active volunteers and vehicle decals. Spotty cellular reception in remote areas caused data drops, and tracking consecutive absences for disciplinary enforcement was burdensome.',
    solution:
      'Engineered a responsive React + Firestore cloud architecture with IndexedDB offline persistence, client-side HTML5 Canvas photo compression (allowing 25,000+ members on free tiers), an 8-digit OTP access terminal, 1-tap roll call attendance with ExcelJS export, and automated dual-signatory memorandum generation.',
    highlights: [
      '1-Tap Roll Call Attendance with automatic timestamps and ExcelJS (.xlsx) export',
      'Client-side Canvas image optimization reducing 10MB phone uploads to ~30KB WebP (99.6% savings)',
      'Frictionless 8-digit OTP member terminal for sub-1.5s credential and call-sign verification',
      'Automated 3-stage disciplinary escalation engine with dual-crest print-ready memorandums',
      'IndexedDB persistent offline buffer ensuring zero data loss during provincial cellular blackouts',
      'Granular Firestore Security Rules v2 enforcing strict role-based access isolation',
    ],
    developer: 'Archie S. Boiser',
    organization: 'PNP COMMEL Auxiliary — Cobra Civic Group Inc. (Camp Capt. Domingo E. Leonor, Davao City)',
    githubUrl: 'https://github.com/rchieeee',
    liveUrl: 'https://pnp-ccacgi.vercel.app/',
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
  • cloudzone   - Inspect CloudZone POS Multi-Device Retail System (Flutter)
  • pnp         - Inspect PNP-CCACGI Personnel Registry & Attendance Platform
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
  cloudzone: `☁️ CloudZone POS — Multi-Device Retail System [Mobile Distributed POS]
• Type: Multi-Cashier Production Retail Mobile Application
• Stack: Flutter 3, Dart, Firebase Firestore, SQLite (Offline), Dart Streams
• Key Tech: Bidirectional Stream Sync, FK-Safe Replication, Remote Factory Reset
• Output: Thermal-printable PDF receipts & CSV sales export
• Developer: Archie S. Boiser`,
  pos: `☁️ CloudZone POS — Multi-Device Retail System [Mobile Distributed POS]
• Type: Multi-Cashier Production Retail Mobile Application
• Stack: Flutter 3, Dart, Firebase Firestore, SQLite (Offline), Dart Streams
• Key Tech: Bidirectional Stream Sync, FK-Safe Replication, Remote Factory Reset
• Output: Thermal-printable PDF receipts & CSV sales export
• Developer: Archie S. Boiser`,
  pnp: `🛡️ PNP-CCACGI — Personnel Registry & Attendance System [Civic Platform]
• Client: PNP COMMEL Auxiliary Cobra Civic Group Inc. (Camp Capt. Domingo E. Leonor, Davao City)
• Stack: React 19, TypeScript, Google Cloud Firestore, Firebase Auth, ExcelJS
• Live Demo: https://pnp-ccacgi.vercel.app/
• GitHub: https://github.com/rchieeee
• Key Tech: 1-Tap Roll Call, ~30KB Canvas Compression, 8-Digit OTP, 3-Stage Memos
• Developer: Archie S. Boiser`,
  ccacgi: `🛡️ PNP-CCACGI — Personnel Registry & Attendance System [Civic Platform]
• Client: PNP COMMEL Auxiliary Cobra Civic Group Inc. (Camp Capt. Domingo E. Leonor, Davao City)
• Stack: React 19, TypeScript, Google Cloud Firestore, Firebase Auth, ExcelJS
• Live Demo: https://pnp-ccacgi.vercel.app/
• GitHub: https://github.com/rchieeee
• Key Tech: 1-Tap Roll Call, ~30KB Canvas Compression, 8-Digit OTP, 3-Stage Memos
• Developer: Archie S. Boiser`,
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
2. CloudZone POS — Multi-Device Retail System (Flutter + Firestore + SQLite)
3. PNP-CCACGI — Personnel & Attendance System (React 19 + Firestore + 1-Tap Roll Call)
4. Kanso Studio — Modern Editorial Commerce Flagship (Next.js + Stripe)
5. Common Ground — Realtime Community & Event Platform (React + WebSockets)
6. Synapse AI Engine — Automated Code Refactor & Verification Harness`,
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
