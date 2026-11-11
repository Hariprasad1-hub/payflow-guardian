# ✦ PayFlow Guardian

### Smarter Invoices. Clearer Payments. Better Cash Flow.

<p align="center">
  <strong>An AI-powered payment operations copilot for freelancers and small businesses.</strong>
</p>

<p align="center">
  <img src="PayFlow%20Guardian_%20AI-Powered%20Payment%20Operations.png" alt="PayFlow Guardian Banner" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/PayPal-003087?style=for-the-badge&logo=paypal&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Powered-8B5CF6?style=for-the-badge" />
</p>

<p align="center">
  <a href="https://github.com/Hariprasad1-hub/payflow-guardian">GitHub Repository</a>
  ·
  <a href="#-getting-started">Get Started</a>
  ·
  <a href="#-features">Features</a>
</p>

---

## ✨ Overview

Managing invoices and collecting payments shouldn't feel like a second job.

Freelancers and small businesses often struggle with scattered invoices, delayed payments, manual follow-ups and limited visibility into their cash flow.

**PayFlow Guardian** aims to simplify these operations through an intelligent, unified payment management experience.

It combines invoice management, AI-assisted workflows and payment operations into one modern dashboard — helping users spend less time managing payments and more time growing their business.

## 🚀 Features

### 📊 Smart Financial Dashboard
- Revenue and payment overview.
- Pending and overdue invoice visibility.
- Cash flow visualisation.
- Recent invoice activity.

### 🧾 Intelligent Invoice Management
- Create and manage invoices.
- Natural-language invoice drafting.
- Review and edit extracted invoice information.
- Track invoice status.

### 🤖 AI-Powered Assistance
- AI-assisted invoice information extraction.
- Invoice-related assistance.
- Payment follow-up support.
- Human review before invoice creation.

### 💳 Payment Operations
- Payment activity interface.
- PayPal integration architecture.
- Payment tracking and transaction management.

### 🔔 Centralised Experience
- Unified navigation.
- Settings interface.
- Notification experience.

> Note: Features requiring external API credentials or additional payment workflow implementation may need configuration or further development. Do not treat a UI screen as proof of a completed live integration.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Styling | Tailwind CSS, CSS |
| Build Tool | Vite |
| Backend | Python, FastAPI |
| API | REST API |
| Database | SQLite |
| ORM | SQLAlchemy |
| AI | Gemini API integration |
| Payments | PayPal Developer Platform / Sandbox |

---

## 🏗️ Architecture

PayFlow Guardian follows a frontend-backend architecture.

```text
              USER
                |
                ▼
       REACT FRONTEND
         (Vite + CSS)
                |
                ▼
        FASTAPI BACKEND
                |
        ┌───────┼────────┐
        ▼       ▼        ▼
     INVOICE   AI     PAYMENT
     ROUTER  ROUTER    ROUTER
        |       |        |
        └───────┼────────┘
                |
                ▼
           SQLITE DB
                |
                ▼
       EXTERNAL SERVICES
       Gemini / PayPal
```

The frontend communicates with the FastAPI backend through REST endpoints. The backend manages application logic, database operations and integrations with external services.

---

## 📂 Project Structure

```text
payflow-guardian/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚡ Getting Started

Follow these steps to run PayFlow Guardian locally.

### Prerequisites

Make sure you have installed:

- Python 3.13 (recommended for this project setup)
- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Hariprasad1-hub/payflow-guardian.git

cd payflow-guardian
```

### 2. Backend Setup

Create and activate a Python virtual environment.

**Windows PowerShell:**

```powershell
cd backend

py -3.13 -m venv .venv

.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, you can use the virtual environment's Python executable directly.

Install dependencies:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Create your environment file:

```powershell
Copy-Item .env.example .env
```

Configure the required environment variables in `backend/.env`. Add external service credentials only when you have configured the corresponding integration.

Start the backend:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Backend URL:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 3. Frontend Setup

Open another terminal:

```powershell
cd frontend

npm install

npm run dev
```

Frontend URL:

`http://localhost:5173`

### 4. Build for Production

```powershell
cd frontend

npm run build
```

---

## 🔐 Environment Variables

The backend uses environment-based configuration.

Example:

```env
DATABASE_URL=sqlite:///./payflow.db

ALLOWED_ORIGINS=http://localhost:5173

LOG_LEVEL=INFO
```

Configure any additional Gemini or PayPal credentials according to the backend configuration.

**Security:** Never commit `.env` files, API keys, PayPal secrets or private database files to GitHub.

---

## 🧠 Our Approach to AI

AI should assist financial workflows, not make financial decisions without human oversight.

PayFlow Guardian is designed around three principles:

1. **Assist:** Extract invoice details and help prepare payment follow-ups.
2. **Review:** Allow users to inspect and correct AI-generated information.
3. **Control:** Keep invoice approval and payment actions under human control.

Accuracy, transparency and user approval are essential when dealing with financial information.

---

## 🔮 Roadmap

Our vision for PayFlow Guardian goes beyond invoice creation.

- [ ] Complete and verify the PayPal Sandbox checkout and capture workflow.
- [ ] Improve AI invoice extraction accuracy and validation.
- [ ] Build a complete notification centre.
- [ ] Automate overdue payment reminders.
- [ ] Add advanced payment reconciliation.
- [ ] Improve analytics and cash flow forecasting.
- [ ] Deploy a production-ready hosted application.
- [ ] Strengthen authentication and financial data security.

---

## 🏆 Built With Purpose

PayFlow Guardian was developed as a hackathon project exploring how AI and payment technology can simplify everyday financial operations for freelancers and small businesses.

The goal is simple:

**Make payment management smarter, more transparent and less stressful.**

---

## 👨‍💻 Author

**Hari Prasad**

B.Tech Computer Science & Engineering

- GitHub: [@Hariprasad1-hub](https://github.com/Hariprasad1-hub)
- Project: [PayFlow Guardian](https://github.com/Hariprasad1-hub/payflow-guardian)

---

## 📜 License

This project is intended to be released under the MIT License. See the [LICENSE](LICENSE) file for details once added.

---

<p align="center">
  <strong>✦ PayFlow Guardian</strong>
  <br/>
  <em>Smarter Invoices. Clearer Payments. Better Cash Flow.</em>
  <br/><br/>
  Built with ambition, AI and a vision for better financial operations.
</p>
