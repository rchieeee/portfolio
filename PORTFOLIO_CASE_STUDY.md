# Project Case Study: PNP-CCACGI Personnel Registry & Attendance System

> **A real-time, cloud-synced civic & auxiliary operations platform engineered for verified personnel identification, 1-tap roll call attendance, automated disciplinary memorandums, and field-ready offline resiliency.**

---

## 📌 Project Overview

| Metric / Detail | Description |
| :--- | :--- |
| **Project Name** | PNP-CCACGI Attendance & Personnel Management System |
| **Client / Organization** | Philippine National Police COMMEL Auxiliary — Cobra Civic Group Inc. *(SEC Reg. CN2020-67-150)* |
| **Headquarters** | Camp Capt. Domingo E. Leonor, San Pedro St., Davao City |
| **Role** | Full-Stack Software Engineer & UI/UX Architect |
| **Tech Stack** | React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Google Cloud Firestore, Firebase Auth, ExcelJS |
| **Live Production URL** | [https://pnp-ccacgi.vercel.app/](https://pnp-ccacgi.vercel.app/) |
| **Primary Endpoints** | `/` (Landing Hub), `/portal` (Member Terminal), `/admin` (Command Center) |

---

## 🎯 The Problem & Challenge

The **Philippine National Police Communications & Electronics Auxiliary (PNP-CCACGI)** operates across regional municipal chapters in Davao Region and Davao Oriental. As an accredited auxiliary unit, personnel assist law enforcement with emergency radio communications, civil defense, and community patrols.

Prior to this application, the organization faced major operational bottlenecks:
1. **Manual Paper Roll Calls:** Attendance sheets from field meetings and assemblies were frequently misplaced or difficult to audit.
2. **Unverified Checkpoint Credentials:** In the field, Philippine National Police (PNP) highway checkpoints needed an instant, verifiable way to confirm whether a volunteer's ID and vehicle decal were active and authorized.
3. **Spotty Field Connectivity:** Radio nets and roll calls often take place in provincial areas with unstable cellular reception, leading to lost data in standard web apps.
4. **Disciplinary Inefficiency:** Inactive members with consecutive absences were hard to track, leading to unauthorized people displaying organizational vehicle emblems long after leaving the unit.

---

## 💡 The Solution & Architecture

I designed and engineered an **enterprise-grade, responsive, cloud-synced web application** that unifies public orientation, member self-service, and command administration into three dedicated routes:

```
                      ┌────────────────────────────────────────┐
                      │        pnp-ccacgi.vercel.app           │
                      └──────────────────┬─────────────────────┘
                                         │
       ┌─────────────────────────────────┼────────────────────────────────┐
       ▼                                 ▼                                ▼
┌──────────────┐                 ┌──────────────┐                 ┌──────────────┐
│      /       │                 │   /portal    │                 │    /admin    │
│  Executive   │                 │    Member    │                 │   Command    │
│ Landing Hub  │                 │   Terminal   │                 │    Center    │
└──────────────┘                 └──────────────┘                 └──────────────┘
  Public Info,                     8-Digit OTP,                     Admin Auth,
  Creed, FAQ,                      Digital Card,                    1-Tap Roll Call,
  User Guide                       Weekly Logs                      Memos & Settings
```

---

## 🚀 Key Engineering & Feature Highlights

### 1. 🪪 Instant Member Access Terminal (`/portal`)
* **Frictionless 8-Digit OTP Lookup:** Members enter their assigned `YYYY-XXXX` ID across auto-advancing input boxes with backspace traversal, clipboard paste support, and cooldown rate-limiting.
* **Digital Credential Card:** Real-time visual identification card rendering verified member photo, chapter assignment, official rank, and emergency radio call-sign.
* **Weekly Attendance Ledger:** Segmented week navigation (`< Prev Week` / `Next Week >`) with verified Present / Absent badges and automatic entry timestamps.
* **Disciplinary Memorandums Viewer:** In-app inspection of formal administrative notices and active grace periods.

### 2. ⚡ HQ Command Center & Admin Dashboard (`/admin`)
* **1-Tap Roll Call Attendance:** Mark members ✓ Present or ✕ Absent with instant background timestamping (`HH:MM AM/PM`) and state change confirmation guards.
* **Automated Member Roster:** Sequential ID generation, active/archived tabs, search filtering by name/chapter/ID, and official position rank dropdowns.
* **Smart Client-Side Canvas Image Compression:** Uploaded member photos (often 5MB–10MB phone captures) are preprocessed via HTML5 Canvas into ultra-compact, high-fidelity WebP/JPEG data (~30 KB per avatar). **Allows 25,000+ member profiles on free cloud storage tiers with zero bloat.**
* **3-Stage Disciplinary Escalation Engine:**
  * **1st Warning:** Notice of Inactivity (3-week validation period).
  * **2nd Warning:** Impending Removal Notice (Final 3-week window).
  * **3rd Warning:** Membership Revocation, de-authorization of vehicle decals, and PNP checkpoint flagging.
* **Official Memorandum Generator:** Dual-crest letterhead, structured dispatch metadata table (`TO`, `FROM`, `DATE`, `SUBJECT`), and dual official signatories (Secretariat & Presiding Officer / Commander) with print-ready formatting.
* **Excel Data Export (`.xlsx`):** Comprehensive attendance logs export with styled header bars, chapter breakdowns, and time-in timestamps using `ExcelJS`.

### 3. 🌐 Executive Landing Hub (`/`)
* **Commanding Hero Section:** High-contrast presentation with dual official crests, accreditation chips, and single master **`[ 🔑 Access Member Portal → ]`** action button with animated loading transition.
* **In-Page Orientation Guide:** 4-step segmented navigator explaining ID anatomy, roll call logging, 3-stage warning progression, and digital credential presentation.
* **Auxiliary Creed of Honor:** The Four Pillars of the Cobra Civic Volunteer (Loyalty, Communications Vigilance, Discipline, Regional Brotherhood).
* **Smooth CSS Grid FAQ Accordion:** Zero-layout-shift expandable questions answering common member inquiries.
* **Regulatory Compliance:** Clear data privacy notice compliant with Republic Act No. 10173 (Data Privacy Act of 2012) and vehicle emblem regulations.

### 4. 🛡️ Multi-Tier Security & Offline Resiliency
* **Hardened Cloud Security Rules (`firestore.rules`):** Only authenticated administrators (Email/Password) can create, edit, or delete records. Anonymous portal visitors have strict read-only access for member lookup, completely blocking unauthorized console injections.
* **Offline Connection-Drop Buffer:** IndexedDB persistence (`persistentSingleTabManager`) buffers local writes if mobile data drops in remote areas and automatically synchronizes to Google Cloud upon reconnection.

---

## 📸 Visual Showcase & Screenshots

> *Screenshots from the production build located in `images2/`:*

| Screenshot | Feature / Interface | Description |
| :--- | :--- | :--- |
| **`Screenshot 2026-08-25 190335.png`** | **Executive Landing Hub** | Clean hero section with dual emblems, single master CTA, and accreditation badges. |
| **`Screenshot 2026-08-25 190350.png`** | **Orientation Guide & Core Services** | In-page 4-step user guide detailing 8-digit ID format, attendance rules, and warning levels. |
| **`Screenshot 2026-08-25 190502.png`** | **Member Portal Terminal** | 8-digit OTP entry terminal (`YYYY-XXXX`) with real-time validation and rate-limiting. |
| **`Screenshot 2026-08-25 190510.png`** | **Digital Credential Card** | Live member profile with framed photo, rank, chapter assignment, and radio call-sign. |
| **`Screenshot 2026-08-25 190533.png`** | **Weekly Attendance History** | Interactive roll call ledger with weekly calendar controls, timestamps, and Present/Absent badges. |
| **`Screenshot 2026-08-25 190553.png`** | **Admin Dashboard & Attendance Matrix** | Real-time member table with 1-tap Present/Absent toggles, search, and active/archive filters. |
| **`Screenshot 2026-08-25 190604.png`** | **Official Warning Memorandum** | Dual-crest letterhead dispatch with dual signatories and high-fidelity print formatting. |
| **`Screenshot 2026-08-25 190645.png`** | **Organization & Chapter Settings** | Management panel for municipal chapters, signatories, and 1-click portal link copy. |

---

## 🛠️ Technical Stack Breakdown

```
┌─────────────────────────────────────────────────────────────┐
│                       FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  • React 19 + TypeScript (Strict Mode)                      │
│  • Vite (Ultra-fast build & HMR)                            │
│  • Tailwind CSS + shadcn/ui Component Architecture          │
│  • Lucide Icons + Geist Typography Variable Fonts           │
│  • Next-Themes (Flawless Dark/Light Mode Switcher)          │
│  • HTML5 Canvas API (Client-Side Image Compression)         │
│  • ExcelJS (Client-Side Styled Spreadsheet Generation)      │
└─────────────────────────────────────────────────────────────┘
                               ▲
                               │ Secure HTTPS & Firestore SDK
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND & CLOUD SERVICES                  │
├─────────────────────────────────────────────────────────────┤
│  • Google Cloud Firestore (NoSQL Real-Time Cloud DB)        │
│  • Firestore IndexedDB Persistent Cache (Offline-Ready)     │
│  • Firebase Authentication (Email/Password + Anonymous)     │
│  • Granular Firestore Security Rules v2 (Role Isolation)   │
│  • Vercel Edge Hosting (Continuous CI/CD Pipeline)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Achievements & Quantifiable Impact

1. **100% Paperless Transition:** Replaced physical clipboards with instant, timestamped cloud roll calls across multiple municipal chapters.
2. **Sub-35 KB Image Optimization:** Developed custom client-side compression that reduces 10MB camera uploads by **99.6%**, saving bandwidth and enabling thousands of member records on free-tier infrastructure.
3. **Zero-Lag Field Lookup:** Auxiliary officers can check attendance and digital credentials in **under 1.5 seconds** using only their 8-digit ID.
4. **Enhanced Law Enforcement Coordination:** Standardized digital records and warning notices ensure only verified, active personnel display organizational vehicle decals at PNP checkpoints.

---

## 💬 Sample Portfolio Prompt for AI Agent

```markdown
I want to showcase my "PNP-CCACGI Personnel Registry & Attendance System" project on my portfolio website.

Here are the project details and assets:
- Live Demo: https://pnp-ccacgi.vercel.app/
- Organization: PNP COMMEL Auxiliary Cobra Civic Group Inc. (Camp Capt. Domingo E. Leonor, Davao City)
- Key Tech: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Google Cloud Firestore, Firebase Auth, ExcelJS
- Screenshots: Located in `images2/` folder (featuring Landing Hub, Member Portal, Credential Card, Admin Dashboard, Attendance Table, and Official Warning Memorandums).
- Key highlights: 1-tap roll call attendance, client-side canvas photo compression (~30KB), 8-digit OTP access, 3-stage warning memorandums with print layout, offline connection-drop resiliency, and hardened Firebase security rules.

Please design an engaging, modern portfolio project section / case study modal based on this documentation!
```
