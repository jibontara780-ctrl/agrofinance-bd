# 🌾 AgroFinance BD — Enterprise Agricultural Fintech & Investment Platform

<div align="center">

[![Live Production](https://img.shields.io/badge/Live%20Platform-Online-059669?style=for-the-badge&logo=render&logoColor=white)](https://agrofinance-bd.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20In--Memory-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cybersecurity](https://img.shields.io/badge/Cybersecurity-OWASP%20Top%2010%20Hardened-red?style=for-the-badge&logo=shield&logoColor=white)](#-cybersecurity-defense-architecture)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<br/>

**AgroFinance BD** is a production-grade, enterprise agricultural investment and fintech platform built for Bangladesh's modern agribusiness ecosystem. It connects retail and institutional investors directly with high-yield, insured, technology-driven farming projects across crops, fisheries, dairy, and livestock.

[Explore Live Demo](https://agrofinance-bd.onrender.com) • [API Health Check](https://agrofinance-bd.onrender.com/api/health) • [Report Issue](https://github.com/jibontara780-ctrl/agrofinance-bd/issues)

</div>

---

## 📋 Table of Contents

- [Overview & Value Proposition](#-overview--value-proposition)
- [System Architecture](#-system-architecture)
- [Core Features & Innovations](#-core-features--innovations)
- [Cybersecurity Defense Architecture](#-cybersecurity-defense-architecture)
- [User Roles & Access Control](#-user-roles--access-control)
- [Technology Stack](#-technology-stack)
- [Getting Started & Local Installation](#-getting-started--local-installation)
- [Environment Configuration](#-environment-configuration)
- [Automated Verification & Testing](#-automated-verification--testing)
- [REST API Reference](#-rest-api-reference)
- [Project Directory Structure](#-project-directory-structure)
- [Deployment](#-deployment)
- [License & Acknowledgments](#-license--acknowledgments)

---

## 🌟 Overview & Value Proposition

Smallholder farmers and agricultural enterprises in emerging economies often lack access to formal institutional financing, while retail investors face high barriers when attempting to invest directly in real-world agricultural assets. 

**AgroFinance BD** bridges this gap through a high-performance, secure digital fintech infrastructure featuring:
- **Transparent Capital Allocation**: Direct asset-backed funding for verified farming cycles.
- **Institutional Risk Mitigation**: Mandatory comprehensive agricultural weather-index insurance and crop protection.
- **Precision Telemetry**: Satellite remote sensing (NDVI) and IoT ground sensors providing real-time crop canopy verification.
- **Frictionless Mobile Finance**: Seamless digital wallet supporting Bangladesh Mobile Financial Services (**bKash**, **Nagad**, **Rocket**) and direct corporate bank wire transfers.
- **Enterprise-Grade Security**: Hardened backend complying with **OWASP Top 10** standards, role-based access controls, and append-only SIEM audit logging.

---

## 🏛️ System Architecture

```text
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|           React 18 Single Page Application (SPA)  *  Tailwind CSS v3.4           |
|        Interactive Chart.js Visualizations  *  Responsive Mobile/Desktop UI       |
+-----------------------------------------------------------------------------------+
                                          |
                                          |  HTTPS / REST / JWT Bearer
                                          v
+-----------------------------------------------------------------------------------+
|                                 SECURITY GATEWAY                                  |
|         Helmet HTTP Headers  *  Rate Limiters  *  NoSQL Injection Sanitizer       |
|            CSRF Verification  *  Bcrypt Password Hashing (10 Rounds)              |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                            APPLICATION LOGIC (EXPRESS.JS)                         |
|   ├── Auth Controller (OTP Dispatch, Registration, JWT Verification, KYC)         |
|   ├── Investment Engine (Commitment, Auto-Reinvest, Ownership Certificates)       |
|   ├── Digital Wallet (bKash/Nagad/Rocket MFS & Bank Wire Reconciliation)          |
|   ├── Farm Telemetry & IoT (NDVI Crop Health Scores, Weather Data)                |
|   ├── AI Advisor Service (LLM Multi-Turn Portfolio Advisory)                      |
|   └── Admin Governance & SIEM (KYC Approvals, Treasury Control, Threat Radar)     |
+-----------------------------------------------------------------------------------+
                     |                                           |
                     v                                           v
+------------------------------------------+   +------------------------------------+
|               DATA STORAGE               |   |        EXTERNAL INTEGRATIONS       |
|  * MongoDB Database (Production)         |   |  * Brevo REST API (HTTPS Port 443) |
|  * High-Speed In-Memory JSON Persistence |   |  * OpenRouter AI LLM Engine        |
|    (Zero-Dependency Fallback Engine)     |   |  * European Space Agency NDVI      |
+------------------------------------------+   +------------------------------------+
```

---

## ✨ Core Features & Innovations

### 1. 📊 Interactive Portfolio Analytics & Data Visualizations
- **Portfolio Growth Trajectory**: Dynamic area chart illustrating month-by-month invested capital growth and projected yield milestones.
- **Asset Allocation Breakdown**: Real-time interactive doughnut chart categorizing portfolio exposure across Grains, Dairy, Fishery, Fruit Orchards, and High-Tech Greenhouses.
- **Yield Comparison Matrix**: Live comparative bar chart benchmarking AgroFinance returns against standard Fixed Deposit Receipts (FDR), National Sanchayapatra savings bonds, and traditional capital markets.

### 2. 🛰️ Satellite Remote Sensing & IoT Farm Telemetry
- **NDVI (Normalized Difference Vegetation Index)**: Integration with European Space Agency (ESA Sentinel-2) telemetry to measure live crop canopy density and chlorophyll absorption indices (e.g. `0.78` - Optimal Vigorous Growth).
- **IoT Ground Telemetry**: Real-time environmental metrics displaying soil moisture percentages, ambient temperature, humidity levels, and automated drip irrigation status.

### 3. 🚜 5-Stage Traceable Farm Lifecycle
Every farming project features an audited, chronological 5-stage lifecycle tracker:
1. **Phase 1: Land Preparation & Organic Fertilization** — Soil health analysis, pH balance testing, and certified seed procurement.
2. **Phase 2: Automated Planting & Solar Drip Irrigation** — High-density precision planting utilizing solar-driven water conservation grids.
3. **Phase 3: Biological Crop Care & Pest Control** — Eco-friendly pheromone trapping, organic bio-pesticides, and nutrient sprays.
4. **Phase 4: Mechanized Harvesting & Cold-Chain Logistics** — Temperature-monitored post-harvest handling to eliminate spoilage.
5. **Phase 5: Supermarket Wholesale Supply & Yield Payout** — Contracted off-take fulfillment and direct profit distribution to investor wallets.

### 4. 📜 Insured Capital & Authenticated Digital Certificates
- **Comprehensive Climate & Crop Insurance**: Partnered with institutional insurers to cover principal capital against unseasonal floods, droughts, pest outbreaks, and tropical cyclones.
- **Digital Ownership Certificates**: Instant generation of printable official investment certificates equipped with unique Cryptographic Certificate IDs, digital signatures, legal terms, and verifiable QR codes.

### 5. 🔄 Automated Wealth Compounding Engine
- Investor-controlled toggle to automatically reinvest scheduled monthly dividend disbursements into newly launched top-rated farming cycles, leveraging exponential compounding growth.

### 6. 🧑‍🌾 ESG Sustainability & Rural Social Impact
- Real-time transparency metrics tracking direct social benefits: rural female farmer employment rates, fair farmgate compensation indices, and reductions in chemical runoff.

### 7. 💳 Multi-Channel Digital Wallet (Fintech Grade)
- **Mobile Financial Services (MFS)**: Instant checkout and automated transaction reconciliation for **bKash**, **Nagad**, and **Rocket**.
- **Commercial Bank Wire**: Corporate bank deposit reconciliation supporting major commercial banking institutions.
- **Audited Withdrawal Queue**: Secure withdrawal requests to investor personal bank accounts or MFS numbers, protected by administrative verification.

### 8. 🤖 Embedded AI Agricultural Investment Advisor
- Multi-turn intelligent investment consultant powered by state-of-the-art LLMs.
- Delivers real-time portfolio suggestions, risk assessments, harvest calendars, and agricultural commodity pricing trends in both English and Bengali.

### 9. 👑 360° Admin Executive Governance Gateway (`#admin-gateway`)
- **Discrete Entrypoint**: Isolated administrative gateway accessible strictly via authenticated administrator routes (`#admin-gateway` or `/admin`).
- **KYC Verification Workflow**: High-resolution NID document inspector with one-click approval, rejection notes, and audit tagging.
- **Financial Treasury Moderation**: Centralized queue to approve or reject deposits and withdrawals with automated wallet rollback on rejection.
- **Project CMS**: Full lifecycle project management to add, update, pause, or mature agribusiness projects.
- **SIEM Cybersecurity Threat Radar**: Real-time audit log streaming client IP addresses, user agents, failed access attempts, and live security health scores.

### 10. 📧 Enterprise Transactional Email Service (Brevo HTTP API)
- **Direct HTTPS REST Integration**: Uses Brevo REST API over outbound Port 443 to guarantee sub-second OTP and notification delivery, bypassing cloud platform SMTP outbound blocks.
- **Branded Notification Templates**: Dual-language responsive HTML email templates for 6-digit registration OTPs, password reset codes, and transaction receipts.
- **Hybrid Local Fallback**: Configured with automatic SMTP fallback for offline local testing environments.

---

## 🛡️ Cybersecurity Defense Architecture

AgroFinance BD is architected following the **OWASP Top 10 Financial Application Security Guidelines**:

| Security Threat | Applied Mitigation Layer |
|---|---|
| **Broken Object Level Authorization (BOLA / IDOR)** | Cryptographic verification ensuring `req.user.id === resource.ownerId`. Unauthorized cross-tenant queries trigger instant HTTP 403 denial and SIEM logging. |
| **Brute Force & Credential Stuffing** | Tiered rate-limiting via `express-rate-limit` on all authentication and OTP verification routes, with progressive IP throttling. |
| **NoSQL & Parameter Injection** | Deep sanitization middleware intercepting and stripping MongoDB logical operator injection vectors (`$gt`, `$ne`, `$where`, `$regex`) across query, body, and params. |
| **Cross-Site Scripting (XSS) & Clickjacking** | Strict HTTP security headers enforced by `Helmet`: `Content-Security-Policy (CSP)`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and HSTS. |
| **Cross-Site Request Forgery (CSRF)** | Custom request header verification coupled with strict Origin and Referer validation on state-mutating endpoints (`POST`, `PUT`, `DELETE`). |
| **Account Freeze Enforcement** | Suspended or frozen accounts are immediately blocked at the middleware gateway from initiating financial transactions or updating records. |
| **Data Encryption & Passwords** | Cryptographic salted password hashing using `bcrypt` (10 rounds). Passwords and OTP secrets are never logged or returned in responses. |
| **SIEM Audit Logging** | Immutable security event logging capturing client IP, timestamp, user agent, and mutation payload for all administrative and authentication events. |

---

## 👥 User Roles & Access Control

AgroFinance BD implements strict Role-Based Access Control (RBAC):

```text
[ Public Visitor ]
       │
       ▼ (Register & Email OTP Verification)
[ Registered Investor ] 
       │
       ▼ (Complete NID Smart Card & Nominee KYC)
[ Verified Investor ] ───> Full Investment, Wallet, & Certificate Privileges
       │
[ System Administrator ] ───> Discrete Governance Gateway (#admin-gateway)
```

1. **Public Visitor**:
   - Explore active and upcoming agricultural projects.
   - Run interactive ROI calculations and financial projections.
   - Inspect live commodity market wholesale prices and satellite NDVI metrics.

2. **Registered Investor**:
   - Self-registers via email with a 6-digit cryptographic OTP dispatched in real time.
   - Accesses investor dashboard, browses project details, and reviews platform analytics.

3. **Verified Investor (KYC Completed)**:
   - Submits National ID (NID smart card) and legal nominee details for administrative approval.
   - Deposits and withdraws funds via MFS (bKash/Nagad/Rocket) or commercial bank transfer.
   - Commits capital to active farming projects, earns returns, downloads PDF certificates, and enables auto-reinvestment.

4. **System Administrator**:
   - Accesses the discrete administrative command center via `#admin-gateway`.
   - Reviews and approves/rejects investor KYC submissions and nominee documents.
   - Reconciles and authorizes wallet deposit and withdrawal transactions.
   - Creates, configures, and publishes agricultural project listings.
   - Enforces compliance account freezing and monitors live SIEM security alerts.

---

## 🛠️ Technology Stack

| Domain | Technologies & Libraries |
|---|---|
| **Frontend Framework** | React 18, Babel Standalone (Pre-compiled production bundle) |
| **Styling & UI Components** | Tailwind CSS v3.4, Lucide Icons, Custom Animated Modals |
| **Data Visualizations** | Chart.js 4.x (Portfolio Growth, Risk Allocation Doughnut, Comparative Yield Bar) |
| **Backend Runtime** | Node.js (v18+ LTS), Express.js |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt.js, Helmet, Express Rate Limit, Input Sanitizers |
| **Primary Database** | MongoDB with Mongoose ODM |
| **High-Speed Fallback DB** | Zero-Configuration In-Memory JSON Persistence Engine |
| **Transactional Email** | Brevo HTTP REST API (Port 443), Nodemailer (Local Fallback) |
| **AI Advisory Engine** | OpenRouter REST API (GPT-4o-mini integration) |
| **Cloud Hosting** | Render Cloud Platform (Automated CI/CD Git deploys) |

---

## ⚙️ Getting Started & Local Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [Git](https://git-scm.com/)
- *(Optional)* [MongoDB](https://www.mongodb.com/) running locally on port `27017`. *(If MongoDB is not installed, the platform automatically initializes its high-performance In-Memory JSON engine with zero extra setup).*

### Step 1: Clone the Repository
```bash
git clone https://github.com/jibontara780-ctrl/agrofinance-bd.git
cd agrofinance-bd
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the project root directory based on the template below:
```bash
cp .env.example .env
```
*(See [Environment Configuration](#-environment-configuration) for all supported parameters).*

### Step 4: Assemble Frontend Assets
The platform utilizes a modular JSX frontend architecture that is assembled into a high-performance production bundle:
```bash
node client_src/assemble.js
```

### Step 5: Start the Application Server
```bash
npm start
# or for development mode:
node server/server.js
```

Navigate to your local browser:
👉 **`http://localhost:5001`**

---

## 🔐 Environment Configuration

Create a `.env` file in the root directory. **Never commit actual credentials or secret keys to version control.**

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Cryptographic Secret
JWT_SECRET=<your-256-bit-jwt-secret-key>

# Database Connection (MongoDB URI or leave empty for In-Memory DB)
MONGO_URI=mongodb://127.0.0.1:27017/agrofinance_db

# Brevo HTTP Email API (Recommended for Cloud Deployments)
BREVO_API_KEY=<your-brevo-api-key>
BREVO_SENDER=<your-verified-brevo-sender-email>

# Optional SMTP Configuration (Local Development Fallback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=<your-smtp-username>
SMTP_PASS=<your-smtp-app-password>
EMAIL_FROM="AgroFinance BD" <security@yourdomain.com>

# Optional AI Advisor (OpenRouter API)
OPENROUTER_API_KEY=<your-openrouter-api-key>
```

---

## 🧪 Automated Verification & Testing

AgroFinance BD includes a comprehensive automated test suite validating security policies, authentication flows, mathematical dividend payouts, and transaction integrity:

```bash
node server/test_in_memory.js
```

**Test Coverage Highlights:**
- ✅ User registration & OTP cryptographic generation
- ✅ Password hashing & JWT signing/verification
- ✅ BOLA / IDOR protection & authorization boundaries
- ✅ Wallet deposit reconciliation & withdrawal verification
- ✅ Investment creation, unit caps, and portfolio allocation
- ✅ Automated maturity profit calculations
- ✅ NID KYC document submission and administrative approval
- ✅ Account freeze enforcement and transaction revocation
- ✅ SIEM audit logging verification

---

## 📡 REST API Reference

### Authentication & Account Security
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user & dispatch 6-digit OTP | Public |
| `POST` | `/api/auth/verify-email` | Validate OTP code & activate account | Public |
| `POST` | `/api/auth/login` | Authenticate investor & receive signed JWT | Public |
| `POST` | `/api/auth/admin-login` | Dedicated authentication for administrators | Public |
| `POST` | `/api/auth/forgot-password` | Dispatch password reset OTP to email | Public |
| `POST` | `/api/auth/reset-password` | Set new password with validated OTP | Public |
| `GET` | `/api/auth/me` | Fetch authenticated profile & wallet balance | Authenticated |
| `POST` | `/api/auth/kyc` | Submit NID smart card and nominee details | Authenticated |

### Projects & Investments
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/projects` | List all active, funded, and upcoming projects | Public |
| `GET` | `/api/projects/:id` | Get project telemetry, NDVI score, and specs | Public |
| `POST` | `/api/investments` | Commit investment capital to active project | Verified Investor |
| `GET` | `/api/investments/my` | Retrieve authenticated user's portfolio | Authenticated |

### Digital Wallet & Treasury
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/wallet/deposit` | Submit bKash / Nagad / Bank deposit request | Authenticated |
| `POST` | `/api/wallet/withdraw` | Submit capital withdrawal request | Verified Investor |
| `GET` | `/api/wallet/transactions` | Fetch user transaction history ledger | Authenticated |

### Administrative Governance (`#admin-gateway`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Platform treasury, revenue, and investor stats | Administrator |
| `POST` | `/api/admin/kyc/status` | Approve or reject submitted investor KYC | Administrator |
| `POST` | `/api/admin/transactions/approve` | Approve pending deposit or withdrawal | Administrator |
| `POST` | `/api/admin/transactions/reject` | Reject transaction with wallet rollback | Administrator |
| `POST` | `/api/admin/users/freeze` | Freeze or unfreeze user account | Administrator |
| `GET` | `/api/admin/security` | Stream live SIEM audit events and security score | Administrator |

---

## 📁 Project Directory Structure

```text
agrofinance-bd/
├── client/                     # Assembled production frontend bundle
│   └── index.html              # Pre-compiled high-performance SPA
├── client_src/                 # Modular JSX frontend source components
│   ├── 01_head_app.jsx         # Navigation, language state & client routing
│   ├── 02_landing_dashboard.jsx# Hero landing page, ROI calculator, investor dashboard
│   ├── 03_projects_portfolio_market_impact.jsx # Projects, portfolio, commodity index, ESG
│   ├── 04_farm_satellite.jsx   # Satellite NDVI remote sensing, IoT telemetry & farm tour
│   ├── 05_admin_portal.jsx     # Admin 360 executive control panel & SIEM radar
│   ├── 06_modals.jsx           # Auth modals, OTP verification, MFS wallet, KYC upload
│   └── assemble.js             # Babel compilation and bundler engine
├── server/                     # Backend API & business logic
│   ├── server.js               # Express application entrypoint & middleware setup
│   ├── config/
│   │   └── db.js               # Dual-engine database driver (MongoDB + In-Memory)
│   ├── controllers/
│   │   ├── authController.js   # Authentication, OTP dispatch, profile, KYC
│   │   ├── adminController.js  # KYC review, financial moderation, project CMS, audits
│   │   ├── investmentController.js # Investment creation, maturity payouts, returns
│   │   ├── walletController.js # Deposits, withdrawals, transaction history
│   │   ├── projectController.js# Agribusiness project CRUD and metrics
│   │   ├── marketController.js # Commodity market wholesale prices
│   │   ├── farmVisitController.js # Physical farm visit bookings
│   │   └── aiController.js     # AI Agricultural Investment Advisor integration
│   ├── middleware/
│   │   ├── auth.js             # JWT bearer verification and RBAC enforcement
│   │   └── security.js         # Helmet headers, rate limiters, input sanitizers
│   ├── models/                 # Mongoose schemas and data models
│   ├── routes/
│   │   └── api.js              # Central REST API routes definition
│   ├── utils/
│   │   └── emailService.js     # Dual-engine email dispatcher (Brevo HTTP + SMTP)
│   ├── data/
│   │   └── seedData.js         # Agricultural projects & pre-configured seed records
│   └── test_in_memory.js       # 26-point automated verification test suite
├── render.yaml                 # Infrastructure-as-Code blueprint for Render deployment
├── package.json                # Project dependencies and operational scripts
└── README.md                   # Comprehensive project documentation
```

---

## 🚀 Deployment

The repository includes a ready-to-deploy [`render.yaml`](render.yaml) blueprint for one-click deployment on Render:

1. Push your code to GitHub.
2. Link the repository to your [Render Dashboard](https://dashboard.render.com).
3. Set the required environment variables in Render:
   - `JWT_SECRET`
   - `BREVO_API_KEY`
   - `BREVO_SENDER`
4. Render automatically runs `npm install`, executes `node client_src/assemble.js`, and launches `node server/server.js`.

---

## ⚖️ License & Acknowledgments

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

Developed with a focus on modern fintech standards, agricultural sustainability, and digital financial inclusion in Bangladesh.

<div align="center">

**AgroFinance BD Limited**  
*Dhaka, Bangladesh*  
[https://agrofinance-bd.onrender.com](https://agrofinance-bd.onrender.com)

</div>
