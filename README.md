# 🌾 AgroFinance BD — Smart Agriculture Investment Platform

<div align="center">

[![Live Platform](https://img.shields.io/badge/Live%20Platform-Online-059669?style=for-the-badge&logo=render&logoColor=white)](https://agrofinance-bd.onrender.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<br/>

**AgroFinance BD** is a modern Full-Stack MERN Agri-Fintech platform designed for Bangladesh. It connects retail and institutional investors directly with profitable, insured, and technology-monitored agricultural projects across crops, fisheries, dairy, and livestock.

[🌐 Live Website](https://agrofinance-bd.onrender.com)

</div>

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack (What We Used)](#-tech-stack-what-we-used)
- [System Architecture](#-system-architecture)
- [User Roles & Access](#-user-roles--access)
- [Getting Started (Local Setup)](#-getting-started-local-setup)
- [Environment Variables](#-environment-variables)
- [Project Directory Structure](#-project-directory-structure)
- [API Endpoints Overview](#-api-endpoints-overview)
- [License](#-license)

---

## 💡 About the Project

In Bangladesh, traditional farmers often struggle to secure fair capital, while everyday individuals lack safe, transparent ways to invest in the booming agriculture sector. 

**AgroFinance BD** solves this by providing a unified digital investment platform where:
- Investors can fund vetted farming projects with transparent returns and insured capital.
- Farmers receive technology, insurance, and timely working capital.
- Everything is verifiable through satellite crop monitoring (NDVI), IoT telemetry, and digital ownership certificates.

---

## 🌟 Key Features

### 1. 🌾 Agribusiness Projects Marketplace
- **Category Filtering**: Explore projects across Paddy/Grains, Dairy Farming, Fisheries, Fruit Orchards, and Modern Greenhouses.
- **Detailed Project Metrics**: Clear display of project duration (months), projected return percentage (ROI), unit cost, funding progress bar, and risk tier.
- **Interactive ROI Calculator**: Calculate potential earnings and profit breakdowns before investing.

### 2. 💳 Digital Wallet & MFS Payment Integration
- **Mobile Financial Services (MFS)**: Integrated deposit workflows for **bKash**, **Nagad**, and **Rocket** with instant Transaction ID verification.
- **Commercial Bank Deposits**: Bank wire transfer option with receipt/slip upload.
- **Withdrawals**: Fast payout requests directly to investor bank accounts or MFS wallets.
- **Transaction History**: Real-time ledger tracking deposits, investments, dividend payouts, and withdrawals with status indicators.

### 3. 📊 Investor Portfolio & Analytics
- **Portfolio Summary**: Live dashboard tracking total invested capital, total earned profit, and active investments.
- **Interactive Data Visualizations**: Built with **Chart.js**:
  - *Portfolio Growth Chart*: Monthly capital growth trajectory.
  - *Asset Allocation Chart*: Visual distribution across farming sectors.
  - *Yield Comparison Chart*: Benchmarking returns against bank FDR and Sanchayapatra.
- **Auto-Reinvest Engine**: Optional one-click toggle to automatically reinvest monthly dividend payouts into new projects for compound growth.

### 4. 📜 Digital Investment Certificates
- Instant generation of printable official **Digital Certificates of Ownership** upon project funding.
- Includes unique Cryptographic Certificate ID, project details, legal terms, and verifiable QR code badge.

### 5. 🛰️ Satellite NDVI & Farm IoT Telemetry
- **NDVI Vegetation Index**: Live canopy health monitoring using European Space Agency (ESA Sentinel-2) satellite data indices.
- **Smart Farm Sensors**: Real-time sensor metrics for soil moisture, ambient temperature, humidity, and automated drip irrigation.
- **5-Stage Farm Lifecycle**: Transparent milestone roadmap from Soil Preparation ➔ Precision Sowing ➔ Organic Crop Care ➔ Harvesting ➔ Supermarket Distribution.

### 6. 🚜 Farm Visit Booking
- Schedule in-person physical visits to project farm sites to inspect crops and livestock firsthand.

### 7. 🤖 Embedded AI Agro Advisor
- 24/7 intelligent chatbot floating assistant powered by LLM APIs.
- Answers questions about farming cycles, investment options, risk diversification, and harvest timings in both **English** and **বাংলা**.

### 8. 🌐 Dual-Language Experience (বাংলা / English)
- Instant 1-click language switch across all pages, forms, charts, and navigation menus.

### 9. 🛡️ Identity Verification (KYC) & Email OTP Security
- **Email OTP Verification**: Real-time 6-digit verification codes sent via **Brevo REST API** for signup and password resets.
- **KYC Verification**: Upload National ID (NID Smart Card) and legal nominee details for account compliance.

### 10. 👑 Admin 360 Governance Station (`#admin-gateway`)
- **Discrete Portal**: Hidden from public view; accessible exclusively via `#admin-gateway` or `/admin`.
- **KYC Verification Queue**: Review submitted investor NIDs with one-click approval or rejection.
- **Transaction Moderation**: Approve or reject wallet deposits and withdrawals (with automatic balance rollback on rejection).
- **Project CMS**: Create, update, and manage agribusiness projects and funding limits.
- **SIEM Cyber Threat Radar**: Real-time audit logs tracking user IP addresses, timestamps, failed login attempts, and platform security status.

---

## 🛠️ Tech Stack (What We Used)

### **Frontend**
| Technology | Purpose |
|---|---|
| **React 18** | Component-based Single Page Application (SPA) architecture |
| **Tailwind CSS v3.4** | Utility-first, responsive, and mobile-first UI styling |
| **Chart.js** | Interactive charts (Portfolio growth, asset distribution, yield comparison) |
| **Canvas Confetti** | Visual celebration effects upon investment completion |
| **Google Fonts** | *Hind Siliguri*, *Noto Sans Bengali*, *Inter*, and *Outfit* typography |
| **Babel Standalone** | Production-ready JSX compilation and bundling (`assemble.js`) |

### **Backend**
| Technology | Purpose |
|---|---|
| **Node.js** | High-performance asynchronous JavaScript runtime |
| **Express.js (v5)** | RESTful API framework and middleware orchestration |
| **JSON Web Tokens (JWT)** | Stateless HMAC-SHA256 authentication and session tokens |
| **Bcrypt.js** | Cryptographic password hashing (10 salt rounds) |

### **Databases (Hybrid Engine)**
| Technology | Purpose |
|---|---|
| **MongoDB (Mongoose)** | Primary NoSQL document database for scalable persistence |
| **In-Memory JSON DB** | High-speed, zero-dependency fallback database for local offline development |

### **Security Hardening (OWASP Top 10)**
| Technology | Purpose |
|---|---|
| **Helmet** | HTTP response headers protection (`CSP`, `X-Frame-Options`, `HSTS`) |
| **Express Rate Limit** | Brute-force and DDoS throttling on authentication endpoints |
| **Input Sanitizers** | NoSQL query injection prevention (stripping `$gt`, `$ne`, `$where`) |
| **BOLA / IDOR Defense** | Strict object ownership verification on user resources |

### **External Services & Integrations**
| Service | Purpose |
|---|---|
| **Brevo REST API** | Sub-second transactional email delivery (OTP verification) via Port 443 |
| **Nodemailer** | Local SMTP email dispatcher fallback |
| **OpenRouter AI API** | Large language model integration for AI Agro Advisor |
| **Render** | Cloud hosting with automated continuous deployment (CI/CD) |

---

## 🏛️ System Architecture

```text
[ Browser / Mobile Client (React 18 + Tailwind + Chart.js) ]
                             │
                             ▼  HTTPS / REST / JWT Bearer
[ Security Gateway (Helmet, Rate Limiter, NoSQL Sanitizer) ]
                             │
                             ▼
[ Express.js REST API Backend (Node.js) ]
  ├── /api/auth          ---> Registration, OTP, JWT, KYC
  ├── /api/projects      ---> Project Catalog, ROI Calculator
  ├── /api/investments   ---> Investment Engine & Certificates
  ├── /api/wallet        ---> bKash, Nagad, Bank Wire, Withdrawals
  ├── /api/market        ---> Agricultural Commodity Price Index
  ├── /api/ai            ---> AI Agro Advisor Chatbot
  └── /api/admin         ---> KYC Approvals, Financial Moderation, SIEM
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [ MongoDB / In-Memory DB ]      [ External APIs ]
   • Users & KYC                   • Brevo HTTPS (Transactional OTP)
   • Projects & Investments        • OpenRouter AI (LLM Advisor)
   • Wallet Ledger & Audits        • ESA Satellite NDVI Telemetry
```

---

## 👥 User Roles & Access

| Role | Access Level | Permissions |
|---|---|---|
| **Public Visitor** | Public | Browse projects, use ROI calculator, check market prices & satellite data |
| **Investor** | Authenticated | Manage digital wallet, invest in projects, track portfolio, download certificates |
| **Verified Investor** | KYC Approved | Full withdrawal privileges, higher investment limits, nominee security |
| **Administrator** | Discrete (`#admin-gateway`) | Approve KYC, moderate transactions, manage projects, monitor SIEM security |

---

## ⚙️ Getting Started (Local Setup)

Follow these steps to run the project on your local machine:

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/jibontara780-ctrl/agrofinance-bd.git
cd agrofinance-bd
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the project root:
```bash
cp .env.example .env
```
*(Add your environment variables as shown in the section below).*

### 5. Compile Client Bundle & Run
```bash
# Assemble and bundle modular JSX components
node client_src/assemble.js

# Start the application server
npm start
```

Open your browser and navigate to:
👉 **`http://localhost:5001`**

### 6. Run Automated Tests
Verify all system features and security assertions with the 26-point test suite:
```bash
node server/test_in_memory.js
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root directory. **Never commit actual credentials, secret tokens, or private passwords to GitHub.**

```env
# Server
PORT=5001
NODE_ENV=development

# JWT Authentication
JWT_SECRET=<your-jwt-secret-key>

# Database (Leave blank to use the high-performance In-Memory DB)
MONGO_URI=mongodb://127.0.0.1:27017/agrofinance_db

# Brevo HTTP Email API (Recommended for Port 443 OTP delivery)
BREVO_API_KEY=<your-brevo-api-key>
BREVO_SENDER=<your-verified-brevo-sender-email>

# Optional SMTP Configuration (Local Development Fallback)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=<your-smtp-email>
SMTP_PASS=<your-smtp-app-password>
EMAIL_FROM="AgroFinance BD" <security@yourdomain.com>

# Optional AI Advisor (OpenRouter API)
OPENROUTER_API_KEY=<your-openrouter-api-key>
```

---

## 📁 Project Directory Structure

```text
agrofinance-bd/
├── client/                     # Compiled production frontend bundle
│   └── index.html              # Assembled high-performance SPA
├── client_src/                 # Modular JSX frontend components
│   ├── 01_head_app.jsx         # App navigation, language state & routing
│   ├── 02_landing_dashboard.jsx# Landing page, ROI calculator, investor dashboard
│   ├── 03_projects_portfolio_market_impact.jsx # Projects, portfolio, commodity index, ESG
│   ├── 04_farm_satellite.jsx   # Satellite NDVI remote sensing, IoT telemetry & farm tour
│   ├── 05_admin_portal.jsx     # Admin 360 executive control panel & SIEM radar
│   ├── 06_modals.jsx           # Auth modals, OTP verification, MFS wallet, KYC upload
│   └── assemble.js             # Babel JSX compilation and bundler script
├── server/                     # Backend API & business logic
│   ├── server.js               # Express server entrypoint & middleware setup
│   ├── config/
│   │   └── db.js               # Hybrid database connector (MongoDB + In-Memory)
│   ├── controllers/
│   │   ├── authController.js   # Registration, OTP verification, login, KYC
│   │   ├── adminController.js  # KYC review, transaction moderation, project CMS
│   │   ├── investmentController.js # Investment creation, profit calculation
│   │   ├── walletController.js # MFS deposits, withdrawals, ledger
│   │   ├── projectController.js# Agribusiness project CRUD and stats
│   │   ├── marketController.js # Commodity market wholesale price index
│   │   ├── farmVisitController.js # Farm visit booking appointments
│   │   └── aiController.js     # AI Agro Advisor LLM integration
│   ├── middleware/
│   │   ├── auth.js             # JWT bearer verification and RBAC
│   │   └── security.js         # Helmet, rate limiting, NoSQL sanitizer
│   ├── models/                 # Data schemas and model definitions
│   ├── routes/
│   │   └── api.js              # Central REST API routes definition
│   ├── utils/
│   │   └── emailService.js     # Dual-engine email dispatcher (Brevo HTTP + SMTP)
│   ├── data/
│   │   └── seedData.js         # Agricultural projects & initial seed data
│   └── test_in_memory.js       # 26-point automated verification test suite
├── render.yaml                 # Infrastructure configuration for Render deployment
├── package.json                # Project dependencies and script shortcuts
└── README.md                   # Project documentation
```

---

## 📌 API Endpoints Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new account and send 6-digit OTP | Public |
| `POST` | `/api/auth/verify-email` | Verify OTP code and activate account | Public |
| `POST` | `/api/auth/login` | Authenticate investor and issue JWT token | Public |
| `POST` | `/api/auth/admin-login` | Administrative portal login | Public |
| `POST` | `/api/auth/forgot-password` | Dispatch password reset OTP | Public |
| `POST` | `/api/auth/reset-password` | Reset password using verified OTP | Public |
| `GET` | `/api/auth/me` | Fetch active user profile and balance | Authenticated |
| `POST` | `/api/auth/kyc` | Submit NID smart card and nominee details | Authenticated |
| `GET` | `/api/projects` | Get all active and funded agribusiness projects | Public |
| `POST` | `/api/investments` | Invest in an active agricultural project | Investor |
| `GET` | `/api/investments/my` | Retrieve authenticated user's portfolio | Authenticated |
| `POST` | `/api/wallet/deposit` | Submit bKash / Nagad / Bank deposit | Authenticated |
| `POST` | `/api/wallet/withdraw` | Submit payout withdrawal request | Verified Investor |
| `GET` | `/api/wallet/transactions` | Fetch user transaction ledger | Authenticated |
| `GET` | `/api/market` | Fetch daily agricultural commodity wholesale prices | Public |
| `POST` | `/api/farm-visit` | Book an in-person physical farm tour | Authenticated |
| `POST` | `/api/ai/chat` | Interact with the AI Agro Advisor | Public / User |
| `GET` | `/api/admin/stats` | Platform treasury, revenue, and investor stats | Administrator |
| `POST` | `/api/admin/kyc/status` | Approve or reject submitted investor KYC | Administrator |
| `POST` | `/api/admin/transactions/approve` | Approve pending deposit or withdrawal | Administrator |
| `POST` | `/api/admin/transactions/reject` | Reject transaction with wallet rollback | Administrator |
| `POST` | `/api/admin/users/freeze` | Freeze or unfreeze user account | Administrator |
| `GET` | `/api/admin/security` | Stream real-time SIEM audit events and threat score | Administrator |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">

**AgroFinance BD Limited**  
*Dhaka, Bangladesh*  
[https://agrofinance-bd.onrender.com](https://agrofinance-bd.onrender.com)

</div>
