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
  { label: 'Email', username: profile.email, url: `mailto:${profile.email}` },
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

export const projects = [
  {
    id: 'pollen',
    slug: 'pollen',
    name: 'Pollen Workspace',
    category: 'Productivity & Team Momentum',
    tagline: 'Focused planning space turning scattered ideas into weekly execution.',
    year: '2026',
    featured: true,
    accent: 'from-emerald-500/20 to-teal-500/5',
    badge: 'Flagship App',
    tools: ['React', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'Vite'],
    summary:
      'A lightweight, focused weekly planning dashboard for engineering teams to eliminate management bloat and track momentum.',
    overview:
      'Pollen gives small teams one calm place to collect ideas, choose weekly priorities, and understand what needs to happen next without cumbersome Jira-like complexity.',
    challenge:
      'Existing task management tools often feel overwhelming and demand more effort to maintain than actual product development.',
    solution:
      'Designed a streamlined weekly sprint view, keyboard-driven navigation, and real-time task syncing backed by a relational PostgreSQL schema.',
    highlights: [
      'Keyboard-first weekly task organizer',
      'Real-time team presence and updates',
      'Sub-100ms API response latency',
    ],
    githubUrl: 'https://github.com/rchieeee',
    liveUrl: 'https://github.com/rchieeee',
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
  • play        - Launch realtime multiplayer Cyber Arcade & live chat
  • coffee      - Pang-kape & OpenAI Token Fund (GCash)
  • about       - View Archie's engineering bio & philosophy
  • projects    - List featured full-stack & AI projects
  • stack       - Inspect full technical toolchain
  • experience  - Review career timeline & roles
  • contact     - Get direct communication links
  • time        - Check live Manila timezone & node status
  • clear       - Clear terminal history`,
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
1. Pollen Workspace — Team Momentum & Planning Space (React + Node.js)
2. Kanso Studio — Modern Editorial Commerce Flagship (Next.js + Stripe)
3. Common Ground — Realtime Community & Event Platform (React + WebSockets)
4. Synapse AI Engine — Automated Code Refactor & Verification Harness`,
  stack: `Tech Stack:
• Frontend: React 19, Next.js, TypeScript, Tailwind CSS, Vite
• Backend: Node.js, Express, Python, FastAPI, PostgreSQL, Supabase
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
