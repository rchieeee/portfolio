# KABAN — Student Council Treasury System

> **A full-stack, enterprise-grade financial management platform built for a real student council treasury office.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Turnstile-F38020?logo=cloudflare)](https://www.cloudflare.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://treasurer-system.vercel.app)

---

## 🖼️ Preview

<!-- Replace these with your actual screenshots from public/images -->
| Dashboard | Student Payments | Transparency Portal |
|:---:|:---:|:---:|
| ![Dashboard](./public/images/dashboard.png) | ![Payments](./public/images/payments.png) | ![Transparency](./public/images/transparency.png) |

| Login (3FA) | Students Roster | Expenses |
|:---:|:---:|:---:|
| ![Login](./public/images/login.png) | ![Students](./public/images/students.png) | ![Expenses](./public/images/expenses.png) |

---

## 🔗 Links

- 🌐 **Live Demo:** [treasurer-system.vercel.app](https://treasurer-system.vercel.app)
- 💻 **GitHub:** [github.com/XeinQt/treasurerSystem](https://github.com/XeinQt/treasurerSystem)
- 👤 **Developer:** Archie S. Boiser

---

## 📖 About the Project

**KABAN** (Tagalog for *treasury/vault*) is a production-ready web application built for a real **Student Council Treasury Office**. It digitizes and secures the entire financial workflow — from collecting student fees and tracking balances to disbursing expenses and publishing a public transparency report — replacing paper-based manual processes with a modern, real-time platform.

The system is actively used by the council's officers and treasurers to manage hundreds of student records and financial transactions every semester.

---

## ✨ Core Features

### 🔐 Secure Admin Portal (3-Factor Authentication)
- **Factor 1 — Email & Password** with salted SHA-256 hashing (Web Crypto API, `$kaban$v1$` format)
- **Factor 2 — Gmail OTP** sent via Supabase SMTP (6-digit, 120-second timer, 3-attempt lockout)
- **Factor 3 — Security PIN** with 24-hour account freeze after 3 failed attempts
- Cloudflare Turnstile bot protection on the login page
- HMAC-SHA256 session tokens (8-hour expiry) verified by Next.js Edge Middleware

### 📊 Financial Dashboard
- Real-time animated SVG line charts (inflow vs. outflow)
- Filter by time period: Today · Week · Month · Year · All Time
- Filter by payable event (e.g., "SSC ID", "Org Fee")
- Live multi-admin sync via **Supabase Realtime Channels**
- Key metrics: Total Collected, Total Disbursed, Net Balance, Pending Dues

### 👩‍🎓 Student Management
- Full student roster with course, year level, and section
- Bulk CSV import for batch student enrollment
- Automatic fee assignment based on scope (all students, specific course, year, or section)
- Per-student payment history and balance tracking

### 💰 Fee & Payment Management
- Create and manage payable events (fees) with flexible targeting scopes
- Record official payments with auto-generated receipt numbers
- View and print official receipts (PDF-ready)
- Complete payment history with search and filter

### 📉 Expense Tracking
- Log council disbursements with category, amount, and receipt upload
- Expense status workflow: pending → disbursed
- Archive old expenses without deleting records

### 🌐 Public Transparency Portal
- Zero-friction student-facing portal (no login required)
- Students enter their 8-digit ID to view their personal balance and payment receipts
- Council-wide financial overview: total collected, disbursed, and net treasury balance
- Rate-limited to prevent data scraping (sliding-window limiter)

### ⚙️ Settings & System Management
- Council profile settings (org name, logo, academic year)
- Add/edit/deactivate officer accounts with role-based access
- System reset with OTP + PIN double-confirmation safety gate
- Complete audit trail log (every action is recorded with officer name and timestamp)

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router, Server Components) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Custom Design System |
| **Database** | Supabase (PostgreSQL) with Row-Level Security (RLS) |
| **Auth** | Custom 3FA — Web Crypto API + Supabase Auth OTP + HMAC JWT |
| **Bot Protection** | Cloudflare Turnstile |
| **File Exports** | PapaParse (CSV), SheetJS/XLSX (Excel) |
| **Realtime** | Supabase Realtime Channels |
| **Deployment** | Vercel (Edge Network) |
| **Icons** | Lucide React |

---

## 🏗️ Architecture

```
Browser ──► Cloudflare WAF + Turnstile
              │
              ▼
         Next.js 14 (Vercel Edge)
              │
    ┌─────────┴──────────┐
    │                    │
 src/lib/db.ts       src/lib/storage.ts
 (Supabase Cloud)    (LocalStorage Fallback)
    │                    │
    └─────────┬──────────┘
              │
        In-Memory SWR Cache
              │
        Supabase Realtime
        (Multi-admin live sync)
```

**Offline-First Design:** The system stays fully functional even without internet. All data is cached in `localStorage` and synced to Supabase when connectivity is restored.

---

## 🛡️ Security Architecture

| Layer | Implementation |
| :--- | :--- |
| **Password Hashing** | Salted SHA-256 via Web Crypto API |
| **Session Tokens** | HMAC-SHA256 signed, 8-hour expiry |
| **Route Protection** | Next.js Edge Middleware on all `/admin/*` routes |
| **Bot Shield** | Cloudflare Turnstile on admin login |
| **Rate Limiting** | Sliding-window limiter (5 attempts / 15 min) |
| **Database Security** | Supabase Row-Level Security on all 9 tables |
| **HTTP Headers** | HSTS, X-Frame-Options, Permissions-Policy |
| **Audit Trail** | Every action logged with officer name, timestamp, and entity ID |

---

## 🚧 Key Engineering Challenges Solved

### 1. Offline-First Hybrid Sync
Built a dual-layer persistence system: Supabase as the source of truth with a `localStorage`-backed fallback. The system gracefully degrades without network connectivity and re-syncs on reconnect — critical for a school setting with unreliable internet.

### 2. Custom 3-Factor Auth Without Third-Party Auth Libraries
Implemented the entire authentication flow from scratch using the Web Crypto API, Supabase Auth for OTP delivery, and HMAC-SHA256 session tokens — without relying on NextAuth or similar libraries. Each factor has its own lockout and rate-limiting logic.

### 3. Real-Time Multi-Admin Sync
Multiple council officers can be logged in simultaneously and see live updates (new payments, expenses) without refreshing. Implemented using Supabase Realtime Channels with an in-memory SWR cache layer to reduce redundant fetches.

### 4. Dynamic Fee Assignment Engine
Built a payable scope engine that automatically assigns fees to the correct students based on configurable targeting rules (all students, specific course, specific year level, or specific section). Syncs automatically when students or payables are added or edited.

### 5. Public Transparency Portal
Designed a completely frictionless public ledger for students to check their own balances without an account — while protecting against data scraping using a custom sliding-window rate limiter.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/     # Analytics hub with live charts
│   │   ├── login/         # 3FA authentication flow
│   │   ├── students/      # Student roster management
│   │   ├── payables/      # Fee management
│   │   ├── payments/      # Payment collection
│   │   ├── expenses/      # Expense disbursements
│   │   ├── users/         # Officer account management
│   │   ├── courses/       # Course management
│   │   ├── audit-logs/    # Complete activity trail
│   │   └── settings/      # System configuration
│   ├── transparency/      # Public student portal
│   └── api/
│       └── verify-turnstile/  # Cloudflare server-side verification
├── lib/
│   ├── db.ts              # Supabase repository layer + SWR cache
│   ├── storage.ts         # LocalStorage persistence engine
│   ├── security.ts        # Hashing, HMAC tokens, password policy
│   ├── rateLimiter.ts     # Sliding-window rate limiter
│   └── utils.ts           # Helpers (UUID, currency, date)
├── components/
│   ├── TurnstileWidget.tsx
│   ├── ThemeProvider.tsx
│   └── LoadingState.tsx
├── middleware.ts           # Edge route protection
└── types/                 # TypeScript interfaces
```

---

## 🚀 Getting Started (Local Setup)

```bash
# Clone the repository
git clone https://github.com/XeinQt/treasurerSystem.git
cd treasurerSystem

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL, Anon Key, and Cloudflare Turnstile keys

# Run development server
npm run dev

# Or build for production
npm run build && npm start
```

### Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your_turnstile_site_key
CLOUDFLARE_TURNSTILE_SECRET_KEY=your_turnstile_secret_key
SESSION_SECRET_KEY=your_custom_hmac_secret
```

---

## 📸 Screenshots

> *Screenshots showcase the dark-mode UI. A light mode is also available.*

### Admin Dashboard
<!-- Add: public/images/dashboard.png -->

### Login — 3-Factor Authentication Flow
<!-- Add: public/images/login.png -->

### Student Roster Management
<!-- Add: public/images/students.png -->

### Payment Collection
<!-- Add: public/images/payments.png -->

### Public Transparency Portal
<!-- Add: public/images/transparency.png -->

### Audit Log
<!-- Add: public/images/audit-logs.png -->

---

## 👨‍💻 Developers

- **Archie S. Boiser**
- **Rico Alentijo**

---

*Built with ❤️ for the Student Council Treasury Office · A.Y. 2026–2027*
