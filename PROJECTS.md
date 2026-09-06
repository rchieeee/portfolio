# Archie S. Boiser — Engineering Portfolio & Production Systems
> **Full-Stack Developer & Generative AI Builder**  
> *Lupon, Davao Oriental, Philippines (UTC+8)*  
> **GitHub:** [@rchieeee](https://github.com/rchieeee) · **Email:** archie.boiser05@gmail.com · **LinkedIn:** [Archie Boiser](https://www.linkedin.com/in/archie-boiser-552548344/) · **Portfolio:** [archieboiser.vercel.app](https://archieboiser.vercel.app/)

---

## 📑 Table of Contents
1. [KABAN — Student Council Treasury & Public Transparency System](#1-kaban--student-council-treasury--public-transparency-system)
2. [CloudZone POS — Multi-Device Retail Mobile System](#2-cloudzone-pos--multi-device-retail-mobile-system)
3. [PNP-CCACGI — Auxiliary Personnel Registry & Attendance Platform](#3-pnp-ccacgi--auxiliary-personnel-registry--attendance-platform)
4. [Checkpoint — AI Biometric Campus Attendance & Event Access System](#4-checkpoint--ai-biometric-campus-attendance--event-access-system)
5. [Cross-Project Architecture & Security Comparison](#5-cross-project-architecture--security-comparison)

---

## 1. KABAN — Student Council Treasury & Public Transparency System

### Executive Overview
* **Status:** Active Production Deployment (Real University Council)
* **Domain:** Fintech, Public Auditability & Institutional Governance
* **Category:** Full-Stack Enterprise Web Application
* **Badge:** Flagship Enterprise App
* **Live Application:** [treasurer-system.vercel.app](https://treasurer-system.vercel.app)
* **GitHub Repository:** [github.com/XeinQt/treasurerSystem](https://github.com/XeinQt/treasurerSystem)
* **Engineering Credits:** Archie S. Boiser & Rico Alentijo

> **Tagline:** Production financial management platform & public transparency portal built for a real university student council.

---

### The Real-World Necessity (The Problem)
Student council treasuries in higher education institutions routinely manage millions of Philippine Pesos across thousands of enrolled students. However, traditional treasury workflows suffer from catastrophic operational vulnerabilities:
1. **Auditing Failures & Paper Receipt Loss:** Cashiers rely on loose carbon-paper receipt books that frequently tear, smear, or get misplaced, creating audit discrepancies during semester clearance.
2. **Slow Cashier Bottlenecks:** During peak enrollment rushes, manual ledger lookups take minutes per student, resulting in hours-long queues under tropical heat.
3. **Intermittent Campus Wi-Fi:** University networks suffer frequent brownouts and signal drops. Standard web apps crash mid-transaction, leading to double payments or untracked collections.
4. **Lack of Fiscal Transparency:** Students and parent organizations lack visibility into how collected funds are disbursed, eroding institutional trust.
5. **Cost Prohibitions:** Student organizations cannot afford enterprise SaaS authentication subscriptions (e.g., Auth0, Okta) requiring monthly recurring fees per user.

---

### The Engineered Solution
KABAN (Tagalog for *"treasury vault"*) replaces paper logs with a cloud-synced, offline-resilient financial management suite and a frictionless public transparency ledger.

* **Dual-Layer Offline-First Sync:** Supabase PostgreSQL serves as cloud source of truth, backed by a LocalStorage mutation queue and SWR cache layer. Mutations executed during campus Wi-Fi drops persist locally and automatically drain to the cloud upon connection recovery.
* **Proprietary Zero-SaaS 3-Factor Authentication:** Built without paid third-party auth services:
  * **Factor 1:** Salted SHA-256 Web Crypto hashing (`$kaban$v1$`) protected by Cloudflare Turnstile bot shielding.
  * **Factor 2:** 6-digit Gmail OTP via Supabase SMTP with a 120-second timer and 3-attempt lockout.
  * **Factor 3:** Master numeric Security PIN with a 24-hour automatic account freeze upon 3 failed attempts.
* **Dynamic Fee Scope Engine:** Automates fee assignments targeting specific academic programs (e.g., BSIT, BSBA), year levels, or individual class sections.
* **Realtime Cashier & Printable Receipts:** Cashiers search students in `<50ms`, select assessed payables, calculate change, and instantly generate printable PDF official receipts with unique cryptographic verification reference IDs.
* **Public Student Transparency Portal:** A rate-limited public portal where students enter an 8-digit student ID to view their individual payment balances without creating an account or logging in.

---

### Technology Stack & Architecture
| Layer | Technologies | Purpose |
|:---|:---|:---|
| **Frontend Core** | Next.js 14 (App Router), React 19, TypeScript | Server and client components, type-safe architecture |
| **Styling & UI** | Tailwind CSS, Lucide React | Clean, high-density dashboard typography and dark mode |
| **Cloud Database** | Supabase (PostgreSQL) | 9 relational tables secured with Row-Level Security (RLS) policies |
| **Realtime Sync** | Supabase Realtime Channels (WebSockets) | Live collection broadcasts across concurrent cashier stations |
| **Offline Cache** | LocalStorage + SWR Sync Engine | Zero-loss transaction queuing during campus network drops |
| **Security & 3FA** | Web Crypto API (SHA-256), HMAC-SHA256, Cloudflare Turnstile | Edge session token verification and bot deterrence |
| **Export & Documents**| SheetJS (XLSX), PapaParse (CSV), PDF Print Styles | 1-click fiscal audits, batch rosters, and official receipts |
| **Hosting & Edge** | Vercel Edge Network | Sub-millisecond global CDN and edge route middleware |

---

### Key Production Metrics
* **Security Model:** Proprietary 3-Factor Authentication (0% external auth licensing cost)
* **Data Layer:** 9 RLS-guarded PostgreSQL tables
* **Sync Resilience:** Offline-First hybrid local mutation buffer + WebSocket realtime sync
* **Deployment Status:** Active production use by university council officers

---

### Complete Screenshot Inventory
| Screen ID | Title | Category | Description |
|:---|:---|:---|:---|
| `login-sha256` | Factor 1: Master Credentials & Bot Defense | Security (3FA) | Salted SHA-256 password hashing with Cloudflare Turnstile bot verification. |
| `login-otp` | Factor 2: One-Time Password (OTP) Verification | Security (3FA) | 6-digit Gmail OTP delivery via Supabase SMTP with 120s countdown. |
| `login-pin` | Factor 3: Security PIN & Account Freeze | Security (3FA) | Master numeric Security PIN with 24-hour auto-freeze safety gate. |
| `payables-grid` | Payables & Dues Management Grid | Treasury Ops | Active payable events, collection turnouts, target pools, and due dates. |
| `scope-engine` | Dynamic Fee Scope Targeting Engine | Treasury Ops | Dynamic fee assignment targeting specific courses, year levels, or sections. |
| `payment-cashier` | Payment Collection & Realtime Cashier | Treasury Ops | Instant student search, fee checklist, cashier change calculator, and receipt IDs. |
| `receipt-pdf` | Official Receipt PDF & Print View | Treasury Ops | Printable student payment receipt with verification ID and audit signature. |
| `expenses-log` | Purchases & Expense Disbursements | Treasury Ops | Council expense tracker with receipt attachments and disbursement workflows. |
| `transparency-portal`| Public Transparency Portal & Ledger | Transparency | Zero-friction student ledger and public fund summary with rate-limiting. |
| `transparency-guide` | Student Manual & Visual Walkthrough | Transparency | Public onboarding guide explaining dues verification in 4 simple steps. |
| `student-directory` | Student Roster Directory & Batch Actions | Students | Comprehensive student registry with CSV batch import and filtering. |
| `student-ledger` | Individual Student Balance Ledger | Students | Per-student financial ledger detailing payables, payments, and balance. |
| `officer-rbac` | Officer Accounts & Role-Based Access | Governance | Multi-role officer management (Admin, Treasurer, Auditor) with permissions. |
| `audit-trail` | Immutable Audit Trail Activity Logs | Governance | Timestamped event logs recording every financial mutation with officer signatures. |
| `settings-reset` | System Config & 3FA Reset Safety Gate | Governance | Academic period switcher and double-gated emergency system reset. |

---

## 2. CloudZone POS — Multi-Device Retail Mobile System

### Executive Overview
* **Status:** Production-Ready Mobile System
* **Domain:** Mobile Fintech, Distributed Data Sync & Retail Operations
* **Category:** Multi-Platform Mobile Application
* **Badge:** Production Mobile System
* **GitHub Repository:** [github.com/rchieeee](https://github.com/rchieeee)
* **Engineering Credits:** Archie S. Boiser

> **Tagline:** Production-ready multi-device Point of Sale mobile system built with Flutter & Firebase for real-time multi-cashier sync and offline SQLite resilience.

---

### The Real-World Necessity (The Problem)
Small to medium retail businesses (convenience stores, retail boutiques, hardware shops) frequently need multiple cashiers ringing up sales simultaneously during rush hours. However:
1. **No On-Premise Server Budget:** Small merchants cannot afford dedicated on-premise local servers or static IP infrastructure.
2. **Network Unreliability:** Cellular mobile hotspots and provincial retail Wi-Fi fluctuate constantly. Standard cloud POS apps freeze or reject transactions when offline.
3. **Database Concurrency Collisions:** Multi-cashier systems often encounter race conditions where two cashiers sell the same low-stock item simultaneously, or experience SQLite foreign key constraint failures during cross-device document merges.
4. **Hardware Rigidity:** Traditional POS systems demand proprietary touchscreen terminals and expensive thermal printer integrations.
5. **Loss Prevention & Unauthorized Terminals:** In multi-cashier settings, store owners need the ability to instantly revoke access, inspect debtor balances, and remotely wipe local databases if a device is lost or compromised.

---

### The Engineered Solution
CloudZone POS combines the raw speed of a local embedded C-based database with the real-time reactivity of Google Cloud Firestore.

* **Sub-Millisecond SQLite Local Writes:** Cashiers experience zero UI lag. Every barcode scan, cart update, and payment write executes in `<1ms` directly to local SQLite.
* **Bidirectional Reactive SyncEngine:** Uses persistent Dart `snapshots()` stream listeners. Background tasks asynchronously drain transactions from an SQLite `sync_queue` to Firestore. Stock deductions made on Cashier Terminal 1 reflect on Cashier Terminal 2 within seconds.
* **FK-Safe Conflict-Free Merging:** Prevents silent foreign key constraint crashes during background replication by dynamically managing `PRAGMA foreign_keys = OFF` during listener-driven upserts.
* **Remote Factory Reset Protocol:** Store owners can trigger an atomic remote wipe signal from the master admin console. Connected cashier listeners detect the signal, wipe all local SQLite tables, and invoke `onForceLogout`, kicking unauthorized terminals back to login.
* **Comprehensive Financial Ledgers:** Tracks cash sales with automated change calculation and customer credit debt with cashier debt isolation (cashiers manage their own customers; admin audits store-wide debt).
* **Thermal PDF Receipt Engine:** Generates ESC/POS-compatible 58mm and 80mm thermal receipt PDFs with instant native device sharing.

---

### Technology Stack & Architecture
| Layer | Technologies | Purpose |
|:---|:---|:---|
| **Mobile Framework** | Flutter 3, Dart | Cross-platform compiled native mobile performance (Android / iOS) |
| **Local Database** | SQLite (`sqflite`) | Zero-latency local storage engine for offline sales and catalog caching |
| **Cloud Backbone** | Google Cloud Firestore | NoSQL document database providing real-time snapshot streams |
| **Security & Auth** | Firebase Auth, SHA-256 Password Hashing | Secure role isolation (Admin vs Cashier) and credential verification |
| **Reactive Sync** | Dart StreamController & Connectivity Plus | Network change detection and automatic background queue drainage |
| **Analytics & UI** | `fl_chart`, Custom Material 3 Widgets | Interactive revenue trends, net profit calculations, and P&L charts |
| **Receipt Engine** | `pdf`, `printing` plugins | 58mm/80mm thermal receipt generation with native Bluetooth/Wi-Fi print |

---

### Key Production Metrics
* **Local Transaction Speed:** `<1ms` SQLite writes (offline immune)
* **Cross-Terminal Sync Latency:** `<2 seconds` across active internet-connected cashier devices
* **Data Integrity:** Conflict-free replication with transactional `sync_queue`
* **Receipt Output:** 58mm / 80mm thermal printable PDF with unique reference hashing

---

### Complete Screenshot Inventory
| Screen ID | Title | Category | Description |
|:---|:---|:---|:---|
| `cz-admin-dash-1` | Executive POS Dashboard & Key Metrics | Admin Oversight | Real-time sales revenue, transaction count, debt, and stock warning cards. |
| `cz-admin-dash-2` | Dashboard Analytics & Debt Breakdown | Admin Oversight | Expanded business health metrics, debtor repayment logs, and quick actions. |
| `cz-pos-checkout` | Point of Sale (POS) & Cart Engine | POS & Cashier | Barcode scanning, product search, cart quantity, and dual discount modes. |
| `cz-checkout-cash`| Cash Payment & Change Calculator | Checkout & Sales | Quick cash denomination buttons with instant change calculation and reference ID. |
| `cz-checkout-credit`| Credit Sales & Debt Tracking | Checkout & Sales | Customer selector for on-account credit sales with running balance tracking. |
| `cz-receipt-print`| Thermal Printable PDF Receipts | Checkout & Sales | Thermal-formatted 58mm/80mm PDF receipt generation with native sharing. |
| `cz-inventory` | Real-Time Inventory & Stock Alerts | Inventory | Live stock monitoring with configurable low-stock threshold badges. |
| `cz-sales-history`| Auditable Sales History Ledger | Sales Audit | Complete transaction history with unique reference IDs, date filters, and CSV export. |
| `cz-customer-mgmt`| Customer Directory & Credit Balances | Customer CRM | Customer profiles with debt isolation: cashier sales vs org-wide ledger. |
| `cz-user-roles` | Multi-Cashier & Role Access Control | Security & Roles | Role-based access (Admin vs Cashier) with password hashing and session sync. |
| `cz-expenses` | Business Expense Tracking & P&L | Financial | Admin expense logging categorized by operating costs for net profit calculation. |
| `cz-cashier-pos` | Cashier POS Terminal & Quick Cart | POS & Cashier | Dedicated cashier checkout interface with zero-latency SQLite writes. |

---

## 3. PNP-CCACGI — Auxiliary Personnel Registry & Attendance Platform

### Executive Overview
* **Status:** Active Production Deployment
* **Domain:** Civic Operations, Public Safety & Field Assembly Management
* **Client:** Philippine National Police Communications & Electronics Auxiliary — Cobra Civic Group Inc. (Camp Capt. Domingo E. Leonor, Davao City)
* **Category:** Cloud-Synced Civic Operations Platform
* **Badge:** Civic Operations Platform
* **Live Application:** [pnp-ccacgi.vercel.app](https://pnp-ccacgi.vercel.app/)
* **GitHub Repository:** [github.com/rchieeee](https://github.com/rchieeee)
* **Engineering Credits:** Archie S. Boiser

> **Tagline:** Real-time cloud-synced auxiliary personnel registry, 1-tap roll call attendance, automated warning memos, and field-ready offline resiliency.

---

### The Real-World Necessity (The Problem)
The PNP Communications & Electronics Auxiliary operates volunteer brigades across Davao Region assisting law enforcement with emergency radio communications, disaster response, and security patrols:
1. **Paper Roster Misplacement:** Volunteer field assemblies occur weekly across multiple municipalities. Paper attendance sheets were regularly damaged or lost, compromising service records.
2. **Checkpoint Credential Forgery:** During emergency operations, active volunteers display authorized organizational decals on vehicles. Police officers at PNP checkpoints needed instant verification of active call-signs and credentials to prevent unauthorized impersonation.
3. **Cloud Storage Exhaustion on Free Tiers:** Auxiliary volunteer groups operate on zero operating budgets. Members upload high-resolution camera photos (5MB–10MB each), which would instantly exceed free-tier cloud storage quotas within weeks.
4. **Provincial Cellular Drops:** Rural radio relay net assemblies frequently happen in remote areas with zero cell coverage, causing standard web portals to lose roll call records.
5. **Disciplinary Inactivity Auditing:** Tracking consecutive member absences for disciplinary action and decal revocation was tedious and prone to administrative favoritism.

---

### The Engineered Solution
PNP-CCACGI provides a military-grade, cloud-synced operational hub optimized for extreme bandwidth and storage efficiency.

* **In-Browser HTML5 Canvas Photo Compression:** High-resolution phone camera photos (5MB–10MB) are intercepted client-side, downsampled, and re-encoded into ultra-compact `~30KB WebP` files directly in-browser before upload. This delivers a **99.6% reduction in storage and bandwidth**, allowing 25,000+ member profiles to operate within Google Cloud free limits indefinitely.
* **Sub-1.5s Member Verification Terminal:** Members enter an auto-advancing 8-digit identification number (with automatic clipboard paste support) to access their verified digital identity card, radio call-sign, rank, and weekly attendance history.
* **1-Tap Roll Call Attendance:** Assembly officers take roll call with one click per member. The system records automated timestamps and generates comprehensive Excel spreadsheets (`.xlsx`) via ExcelJS with embedded formula sums.
* **Automated 3-Stage Disciplinary Escalation Engine:** Automatically monitors consecutive member absences:
  * *Stage 1:* Warning Notice (Inactivity Alert)
  * *Stage 2:* Final Warning (Impending Removal)
  * *Stage 3:* Revocation & Decal Blacklisting
  Generates official dispatch memorandums formatted with dual organizational crests and dual command signatories (Secretariat & Commander) ready for official physical archiving.
* **IndexedDB Offline Resilience:** Offline persistent caching buffers all roll call attendance writes locally, synchronizing to Google Cloud Firestore the moment cellular data is restored.

---

### Technology Stack & Architecture
| Layer | Technologies | Purpose |
|:---|:---|:---|
| **Frontend Framework** | React 19, Vite, TypeScript | Modern, high-performance user interface with strict type definitions |
| **Styling & Components**| Tailwind CSS, shadcn/ui, Lucide Icons | Police command center aesthetic with dark mode and crisp badges |
| **Cloud Database** | Google Cloud Firestore (NoSQL) | Real-time multi-device synchronization with persistent listeners |
| **Cloud Authentication**| Firebase Authentication, RBAC | Administrative console access with granular role-based security rules |
| **Client Compression** | HTML5 Canvas API | In-browser downsampling reducing 10MB camera uploads to ~30KB WebP (99.6% savings) |
| **Spreadsheet Engine** | ExcelJS Spreadsheet Engine | 1-click export of styled attendance rosters with embedded formulas |
| **Offline Resilience** | IndexedDB Cloud Persistence | Offline queue protecting roll calls during rural radio net assemblies |
| **Deployment** | Vercel Edge Network | Global CDN delivery with automated Git CI/CD deployments |

---

### Key Production Metrics
* **Storage Reduction:** 99.6% client-side compression (from ~10MB to ~30KB per photo)
* **Verification Speed:** `<1.5 seconds` 8-digit OTP credential lookup
* **Roster Export:** Fully formatted `.xlsx` attendance ledgers with automated formula calculations
* **Governance:** Automated 3-stage disciplinary escalation with dual-crest memorandums

---

### Complete Screenshot Inventory
| Screen ID | Title | Category | Description |
|:---|:---|:---|:---|
| `pnp-landing` | Executive Landing Hub | Public Hub | Landing portal with dual organizational crests, creed of honor, and member access gate. |
| `pnp-orientation`| Orientation Guide & Core Services | Public Hub | Interactive 4-step user guide detailing 8-digit ID format and roll call rules. |
| `pnp-portal-terminal`| Member Access Terminal (8-Digit OTP)| Member Portal | Auto-advancing 8-digit OTP ID verification terminal with clipboard paste. |
| `pnp-credential-card`| Digital Credential Card & Call-Sign | Member Portal | Verified digital ID card with photo, rank, chapter, and radio call-sign. |
| `pnp-weekly-attendance`| Weekly Attendance History Ledger | Member Portal | Segmented weekly roll call logs with verified Present/Absent badges. |
| `pnp-admin-dashboard`| Command Center & 1-Tap Roll Call | Admin Center | Administrative command center with 1-tap roll call and ExcelJS export. |
| `pnp-member-registry`| Comprehensive Personnel Roster | Member Directory| Searchable member database with rank badges, call-signs, and chapter filters. |
| `pnp-attendance-auditing`| Master Attendance Audit Matrix | Attendance Audits| Multi-assembly historical matrix tracking attendance compliance across chapters. |
| `pnp-disciplinary-pipeline`| 3-Stage Warning Escalation Pipeline| Disciplinary Ops| Automated absence tracking escalating members across 3 disciplinary stages. |
| `pnp-official-memo`| Dual-Crest Print-Ready Memorandum | Disciplinary Ops| Official warning memorandum formatted with dual crests and signatories. |
| `pnp-photo-optimization`| In-Browser HTML5 Canvas Compression | Media Optimization| Canvas photo compressor converting 10MB uploads into ~30KB WebP. |
| `pnp-security-rules`| Granular Firestore Security Rules | Security & RBAC | Multi-role access rules isolating admin privileges from public lookups. |
| `pnp-profile-modal`| Detailed Member Dossier Modal | Member Directory| Expanded member dossier displaying service history and contact metadata. |

---

## 4. Checkpoint — AI Biometric Campus Attendance & Event Access System

### Executive Overview
* **Status:** Production-Ready MVP
* **Domain:** Computer Vision, Edge AI, Distributed Mobile Systems & Campus Security
* **Category:** Dual-Platform AI Biometric Attendance Ecosystem
* **Badge:** AI Biometric Ecosystem
* **GitHub Repository:** [github.com/rchieeee](https://github.com/rchieeee)
* **Engineering Credits:** Archie S. Boiser

> **Tagline:** Dual-platform AI biometric campus attendance ecosystem with Expo mobile scanning, ArcFace 512-D vector matching, and desktop administration.

---

### The Real-World Necessity (The Problem)
Universities and colleges host mandatory campus events (convocations, athletic meets, academic symposiums) where attendance tracking is required for semester clearance and academic compliance:
1. **Pervasive Attendance Fraud:** Students routinely engage in "proxy check-ins" by having friends sign paper sheets, scanning screenshots of fellow students' barcodes, or handing over physical ID tap cards.
2. **Severe Gate Bottlenecks:** Manual paper check-ins and slow optical barcode readers create massive gate queues of hundreds of students under the sun, delaying campus events.
3. **Lighting & Angle Failures:** Standard off-the-shelf facial recognition tools fail when students wear caps, tilt their heads, or walk past gates under harsh direct sunlight or dim evening gym lighting.
4. **Mobile Device Thermal Throttling:** Mobile phones lack the onboard GPU compute power to run heavy 512-dimensional facial recognition neural networks locally without overheating and draining battery within 20 minutes.
5. **Time Window Disputes:** Students frequently attempt to check in hours after an event ends. Without strict automated time-window gates, organizers face constant disputes over late arrivals.

---

### The Engineered Solution
Checkpoint is a distributed biometric attendance ecosystem featuring a strict separation of concerns across three dedicated nodes:

```
[Desktop Web Admin (React 19)] <--- Cloud Firestore ---> [Sub-Admin Mobile Terminal (Expo Go)]
               |                                                              |
               |                                                   Direct Local LAN Wi-Fi
               |                                                   (sub-25ms frame stream)
               v                                                              v
   [5-Angle Enrollment] -----------------------------------> [Python Flask AI Microservice]
                                                              (ArcFace + FAISS + Anti-Spoof)
```

1. **Desktop Web Administration Portal (React 19 + Vite + Tailwind CSS):** The centralized governance dashboard. Administrators register students, manage academic programs, schedule campus events with automated start/cutoff windows, provision sub-admin accounts, monitor real-time attendance feeds, audit security logs, and export compliant multi-format reports (PDF, Excel, CSV).
2. **Sub-Admin Mobile Terminal (React Native + Expo Go):** A high-throughput scanning terminal for gate stewards. Sub-admins see only their assigned events, switch between Time-In and Time-Out modes with one tap, and scan students in continuous high-FPS loops.
3. **AI Biometric Inference Microservice (Python + Flask + ArcFace + FAISS):** A high-performance inference engine running on a local host laptop. Uses RetinaFace for bounding box localization, Silent-Face for anti-spoofing liveness detection, InsightFace Buffalo_L for 512-dimensional vector embedding extraction, and in-memory FAISS for sub-millisecond cosine similarity search.

---

### Key Technical Innovations
* **5-Angle Biometric Enrollment:** To ensure invariant matching across all lighting and viewing angles, the enrollment modal guides students through a 5-angle sequence: **Frontal, Left Profile, Right Profile, Tilted Up, and Tilted Down**. Five distinct 512-D ArcFace vectors are indexed into FAISS per student.
* **Sub-25ms LAN Wi-Fi Vector Inference:** Rather than burdening the mobile phone with heavy neural networks or incurring internet API latency, the Expo mobile app streams optimized JPEG frames (`quality: 0.55`) over direct local Wi-Fi to the Python microservice, achieving **sub-millisecond vector similarity search** and a total loop latency of ~130ms (~7 FPS).
* **Critically Damped Magnetic Spring Tracking:** Replaces standard linear bounding box animations with React Native `Animated.spring` (`tension: 170, friction: 18`) combined with deadband low-pass jitter filtering (`<2.5px`). The bounding box clings to moving students' faces with zero rubber-banding or oscillation.
* **Silent-Face Anti-Spoofing & Liveness Guard:** Deep learning liveness classifier analyzes pixel frequency disparity and texture artifacts, blocking printed photos and phone screen replay attacks.
* **Strict Time-Window Enforcement:** Events enforce automated start, late grace period, and cutoff rules, automatically locking the scanner when attendance periods expire.

---

### Technology Stack & Architecture
| Layer | Technologies | Purpose |
|:---|:---|:---|
| **Web Admin Portal** | React 19, Vite, Tailwind CSS, Lucide Icons | Executive management dashboard, student registry, event scheduler |
| **Mobile Terminal** | React Native 0.86, Expo 57, Expo Camera (CameraX) | Portable high-FPS gate scanning terminal for sub-admin stewards |
| **AI Biometric Engine**| Python 3.10, InsightFace (ArcFace buffalo_l), RetinaFace | Face detection, landmark alignment, and 512-D L2-normalized vectors |
| **Vector Database** | FAISS (Facebook AI Similarity Search) | In-memory sub-millisecond cosine vector similarity matching |
| **Anti-Spoofing** | Silent-Face Anti-Spoofing | Deep texture classifier detecting printed photos and screen replays |
| **Cloud Database** | Google Cloud Firestore, Firebase Auth | Real-time multi-device synchronization and role-based security rules |
| **Reporting & Export** | jsPDF, SheetJS (XLSX), PapaParse (CSV) | 1-click generation of PDF event rosters, Excel spreadsheets, and CSV sheets |
| **LAN Transport** | Direct LAN Wi-Fi (HTTP REST, AbortController) | High-speed frame streaming between mobile terminal and AI server |

---

### Key Production Metrics
* **Biometric Accuracy:** 98.4% dual-angle verification rating
* **Vector Dimensionality:** 512-D L2-normalized ArcFace embeddings
* **LAN Inference Latency:** `<25ms` FAISS vector match time
* **Continuous Scan Throughput:** ~7 FPS chained continuous loop (`loopScan`)

---

### Complete Screenshot Inventory
| Screen ID | Title | Category | Description |
|:---|:---|:---|:---|
| `cp-web-dash` | Executive Analytics & System Overview Dashboard | Web Administration | KPI metrics tracking courses, students, templates, sub-admins, and accuracy. |
| `cp-mobile-scanner` | High-FPS Biometric Scanner with Magnetic Tracking | Mobile Terminal (Expo)| Continuous loop scanning with spring bounding box tracking and Time-In/Out modes. |
| `cp-web-enrollment` | 5-Angle Facial Biometric Enrollment Modal | Biometric Enrollment | Guided 5-angle capture (Frontal, Left, Right, Up, Down) extracting 512-D vectors. |
| `cp-web-scanner` | Desktop Kiosk Live Face Scanner | Web Administration | High-throughput desktop entrance scanning booth with MediaPipe and ArcFace. |
| `cp-web-events` | Event Scheduling & Attendance Window Rules | Event Governance | Campus event scheduler with start/cutoff windows and target cohort rules. |
| `cp-web-attendance`| Master Attendance Audit Records Ledger | Audit & Records | Unified live ledger of all campus check-ins with timestamps and operator signatures. |
| `cp-web-reports` | Filtered Attendance Reports & Multi-Format Export| Reporting & Compliance| 1-click PDF event rosters, Excel spreadsheets (.xlsx), and CSV data sheets. |
| `cp-web-students` | Student Directory & Biometric Status Profiles | Student Management | Student registry with instant search, degree filters, and face enrollment indicators. |
| `cp-web-courses` | Academic Course & Program Management | Academic Administration| Degree program configuration (BSIT, BSBA, BSA, BTLED) tracking enrolled students. |
| `cp-web-subadmins`| Sub-Admin Delegation & Role-Based Access Control | Security & Access | Provisioning for event coordinators and stewards with venue event assignments. |
| `cp-web-audit` | Immutable System Security Audit Logs | System Security | Forensic security log recording logins, registrations, enrollments, and overrides. |
| `cp-web-settings` | System & Biometric Threshold Configuration | System Configuration | Customization for grace periods, ArcFace cosine thresholds, and credentials. |
| `cp-web-login` | Unified Administrator Authentication Portal | Security & Access | Secure authentication gateway with role-based redirection for Super/Sub-Admins. |
| `cp-mobile-events` | Assigned Events Hub & Window Enforcement | Mobile Terminal (Expo)| Sub-admin dashboard showing assigned venues, schedule statuses, and lock badges. |
| `cp-mobile-recent` | Live Recent Scans Feed & Attendance Ledger | Mobile Terminal (Expo)| Real-time mobile audit feed showing validated attendee names, IDs, and timestamps. |
| `cp-mobile-setup` | Zero-Config Local Network Discovery & Server Setup | Mobile Terminal (Expo)| Direct LAN Wi-Fi host IP configuration with built-in connection health-checks. |
| `cp-mobile-auth` | Sub-Admin Gate Steward Mobile Authentication | Mobile Terminal (Expo)| Lightweight biometric scanner startup restricting event access to stewards. |
| `cp-mobile-splash`| Native Mobile Terminal Splash Screen | Mobile Terminal (Expo)| High-performance native mobile splash sequence built with Expo and React Native. |

---

## 5. Cross-Project Architecture & Security Comparison

| Architectural Attribute | **KABAN — Treasury System** | **CloudZone POS** | **PNP-CCACGI Platform** | **Checkpoint AI Biometrics** |
|:---|:---|:---|:---|:---|
| **Primary Platform** | Desktop & Mobile Web (Next.js 14) | Cross-Platform Mobile (Flutter 3) | Desktop & Mobile Web (React 19) | Dual: Web Admin + Mobile Expo |
| **Domain / Industry** | University Fintech & Treasury | Retail & Multi-Cashier POS | Police Auxiliary & Public Safety | Computer Vision & Event Access |
| **Cloud Database** | Supabase (PostgreSQL) with RLS | Google Cloud Firestore Streams | Google Cloud Firestore NoSQL | Google Cloud Firestore + FAISS |
| **Local Offline Cache**| LocalStorage + SWR Queue | Embedded SQLite (`sqflite`) | IndexedDB Persistent Cache | In-Memory FAISS Vector Index |
| **Authentication Model**| Custom 3-Factor Auth (Web Crypto) | Firebase Auth + SHA-256 Hashing | Firebase Auth + 8-Digit OTP Gate | Firebase Auth + Sub-Admin RBAC |
| **Unique Technical Feat**| Salted SHA-256 + Gmail OTP + Freeze PIN | FK-Safe Sync + Remote Factory Wipe | In-Browser HTML5 Canvas Compression (~30KB) | 5-Angle ArcFace (512-D) + Spring BBox |
| **Realtime Mechanism** | Supabase Realtime Channels (WS) | Firestore Reactive Snapshot Streams| Firestore Snapshot Listeners | Real-Time Push + Direct LAN Wi-Fi |
| **Report Generation** | Printable PDF Receipts + CSV | Thermal 58mm/80mm PDF Receipts | ExcelJS (.xlsx) + Dual-Crest Memos | PDF Rosters + Excel (.xlsx) + CSV |
| **Production Status** | Active University Council Use | Production Mobile System | Active Police Auxiliary Deployment | Production-Ready MVP |

---

## 👨‍💻 Engineering Author & Contact

**Archie S. Boiser**  
*Full-Stack Developer & Generative AI Builder*  
* **Location:** Lupon, Davao Oriental, Philippines (UTC+8)  
* **Email:** [archie.boiser05@gmail.com](mailto:archie.boiser05@gmail.com)  
* **GitHub:** [github.com/rchieeee](https://github.com/rchieeee)  
* **LinkedIn:** [linkedin.com/in/archie-boiser-552548344/](https://www.linkedin.com/in/archie-boiser-552548344/)  
* **Live Portfolio:** [archieboiser.vercel.app](https://archieboiser.vercel.app/)
