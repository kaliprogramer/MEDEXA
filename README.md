# 🏥 MEDEXA

### AI-Powered Hospital Management & Clinical Risk Prediction Platform
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 400" width="1280" height="400">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1d" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#050811" />
    </linearGradient>

    <!-- Brand Cyan-Green Gradient -->
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00a8ff" />
      <stop offset="50%" stop-color="#00d2ff" />
      <stop offset="100%" stop-color="#00ff88" />
    </linearGradient>

    <!-- Glassmorphism Card Gradient -->
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.07" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02" />
    </linearGradient>

    <!-- Card Border Gradient -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00d2ff" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#00ff88" stop-opacity="0.1" />
    </linearGradient>

    <!-- Glow Effect -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Base Background -->
  <rect width="1280" height="400" fill="url(#bg)" />

  <!-- Accent Glow Circles -->
  <circle cx="1100" cy="80" r="180" fill="#00d2ff" opacity="0.08" filter="url(#glow)" />
  <circle cx="200" cy="350" r="150" fill="#00ff88" opacity="0.05" filter="url(#glow)" />

  <!-- Left Column: Branding & Value Proposition -->
  <g transform="translate(60, 0)">
    <!-- Logo Accent Arrow Element -->
    <path d="M 0 75 Q 30 75, 45 45 T 90 25" fill="none" stroke="url(#brandGrad)" stroke-width="6" stroke-linecap="round" />
    
    <text x="0" y="110" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="46" fill="#ffffff" letter-spacing="2">MEDEXA</text>
    <text x="0" y="135" font-family="'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="15" fill="url(#brandGrad)" letter-spacing="1">NEXT-GEN CLINICAL AI &amp; HEALTHCARE MANAGEMENT</text>
    
    <text x="0" y="180" font-family="'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="16" fill="#94a3b8">
      Empowering clinicians with real-time, multi-modal diagnostic assistance 
    </text>
    <text x="0" y="202" font-family="'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="16" fill="#94a3b8">
      and automated hospital workflow optimization.
    </text>

    <!-- Key Metrics / Highlights -->
    <g transform="translate(0, 240)">
      <!-- High Accuracy AI Tag -->
      <rect x="0" y="0" width="140" height="38" rx="8" fill="url(#cardGrad)" stroke="url(#borderGrad)" stroke-width="1" />
      <text x="15" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#00ff88">✓ Multi-Disease AI</text>

      <!-- Secure Data Tag -->
      <rect x="155" y="0" width="130" height="38" rx="8" fill="url(#cardGrad)" stroke="url(#borderGrad)" stroke-width="1" />
      <text x="170" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#00d2ff">🛡️ Patient Data</text>

      <!-- Inventory & Clinical Tag -->
      <rect x="298" y="0" width="150" height="38" rx="8" fill="url(#cardGrad)" stroke="url(#borderGrad)" stroke-width="1" />
      <text x="313" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#ffffff">📊 Inventory Hub</text>
    </g>

    <text x="0" y="340" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#64748b">
      Built for Healthcare Professionals &bull; Powered by Deep Learning
    </text>
  </g>

  <!-- Right Column: Featured Feature Cards -->
  <!-- Card 1: Chest X-Ray AI Analysis (Recruiter Highlight) -->
  <g transform="translate(560, 45)">
    <rect width="320" height="145" rx="12" fill="url(#cardGrad)" stroke="url(#borderGrad)" stroke-width="1.5" />
    <text x="20" y="35" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="16" fill="#ffffff">🫁 Lung &amp; X-Ray Vision AI</text>
    <text x="20" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="12" fill="#64748b">Grad-CAM Heatmap Localization</text>
    
    <rect x="20" y="75" width="280" height="20" rx="4" fill="#0f172a" />
    <rect x="20" y="75" width="280" height="20" rx="4" fill="url(#brandGrad)" opacity="0.85" />
    <text x="120" y="89" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="11" fill="#0f172a">100.0% Confidence</text>
    
    <text x="20" y="122" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" fill="#94a3b8">Identifies Tuberculosis, Pneumonia &amp; Lesions</text>
  </g>

  <!-- Card 2: Risk Prediction Suite (Technical Highlight) -->
  <g transform="translate(900, 45)">
    <rect width="320" height="145" rx="12" fill="url(#cardGrad)" stroke="url(#borderGrad)" stroke-width="1.5" />
    <text x="20" y="35" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="16" fill="#ffffff">❤️ Cardiac &amp; Risk Analytics</text>
    <text x="20" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="12" fill="#64748b">Heart, Stroke, Diabetes &amp; CKD</text>

    <!-- Gauge Representation -->
    <rect x="20" y="78" width="180" height="12" rx="6" fill="#1e293b" />
    <rect x="20" y="78" width="40" height="12" rx="6" fill="#00ff88" />
    <text x="210" y="89" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="12" fill="#00ff88">Low Risk (17.4%)</text>

    <text x="20" y="122" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" fill="#94a3b8">Real-time risk scoring from clinical metrics</text>
  </g>

  <!-- Card 3: Clinical Management Suite (Customer/Client Highlight) -->
  <g transform="translate(560, 210)">
    <rect width="660" height="145" rx="12" fill="url(#cardGrad)" stroke="url(#borderGrad)" stroke-width="1.5" />
    <text x="25" y="40" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="18" fill="#ffffff">🏥 Integrated Hospital Management System</text>
    <text x="25" y="65" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" fill="#94a3b8">Complete workflow support designed for clinics, doctors, and pharmacy inventory.</text>
    
    <!-- Mini Specs Grid -->
    <g transform="translate(25, 85)">
      <circle cx="10" cy="15" r="5" fill="#00d2ff" />
      <text x="25" y="19" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0">Patient Records</text>

      <circle cx="210" cy="15" r="5" fill="#00ff88" />
      <text x="225" y="19" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0">Staff Management</text>

      <circle cx="410" cy="15" r="5" fill="#a855f7" />
      <text x="425" y="19" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#e2e8f0">Medicine &amp; Low Stock Alerts</text>
    </g>
  </g>
</svg>

MEDEXA is a full-stack healthcare platform that combines **hospital management, clinical analytics, and AI-powered disease risk prediction** into a unified system.

Built with **Next.js, Django REST Framework, PostgreSQL, Redis, and AI/ML inference services**, MEDEXA is designed around production-oriented concepts such as secure authentication, API security, rate limiting, analytics, scalable service architecture, and responsive clinical workflows.

<p align="center">
  <strong>🏥 Hospital Management</strong> ·
  <strong>🤖 AI Risk Prediction</strong> ·
  <strong>📊 Clinical Analytics</strong> ·
  <strong>🔐 Secure APIs</strong> ·
  <strong>⚡ Scalable Architecture</strong>
</p>

---

## 🎥 Product Demo

> **See MEDEXA in action:** dashboard → patient management → AI prediction → analytics → inventory → API workflow.

<!-- Replace the URL below with your YouTube/Loom/demo video -->

## 🎥 Product Demo

<video
  src="Backends/Backend-Django-Main/video-demo/medexa.mp4"
  autoplay
  muted
  loop
  playsinline
  width="900">
</video>

**▶️ Watch the full product walkthrough**

---

## 🚀 What is MEDEXA?

MEDEXA is designed as more than a CRUD hospital application.

The platform brings together three major systems:

```text
                    ┌─────────────────────────┐
                    │        MEDEXA            │
                    │ Healthcare Platform      │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       Hospital System       AI/ML System      Platform APIs
              │                  │                  │
       ┌──────┼──────┐      ┌────┴─────┐      ┌────┴─────┐
       │      │      │      │          │      │          │
    Patients Inventory Analytics   Prediction Security  Rate Limits
       │      │      │      │          │      │          │
       └──────┴──────┘      └──────────┘      └──────────┘
```

The objective is to demonstrate how modern **AI + full-stack engineering + backend architecture** can be combined into a practical healthcare product.

---

## ✨ Core Features

### 🏥 Hospital Management

* Patient registration and management
* Patient profile and medical information
* Add, update, view and delete patient records
* Doctor-focused dashboard
* Hospital inventory management
* Medicine and stock tracking
* Low-stock and out-of-stock monitoring
* Room availability management
* Recent patient activity

### 🤖 AI & Clinical Intelligence

MEDEXA integrates machine-learning models for healthcare risk assessment, including:

* ❤️ Heart disease risk prediction
* 🧠 Stroke risk prediction
* 🩸 Diabetes risk prediction
* 🫘 Chronic kidney disease prediction
* 🫁 Lung disease image classification
* 📈 Probability-based prediction results
* 🔍 Explainable AI support for model interpretation

> **Important:** AI predictions are intended as decision-support functionality and are not a replacement for professional medical diagnosis.

### 📊 Analytics

The platform provides analytics for understanding hospital activity:

* Patient growth analytics
* Monthly patient statistics
* Gender distribution
* Inventory analytics
* Low-stock monitoring
* Prediction activity
* Dashboard-level KPIs
* Historical data visualization

### 🔐 Security

Security is treated as a core part of the application architecture:

* JWT authentication
* HttpOnly cookie-based authentication
* Protected API endpoints
* Role-based access control
* API key authentication
* API key hashing
* API key expiration
* API key activation/deactivation
* Request tracking
* Rate limiting
* Redis-backed usage control
* CORS protection
* CSRF protection

### ⚡ API Platform

MEDEXA also includes an API-oriented architecture for exposing AI prediction capabilities.

Example architecture:

```text
Client
  │
  │ Bearer API Key
  ▼
Django API Gateway
  │
  ├── Authentication
  ├── Permission Checks
  ├── Rate Limiting
  ├── Usage Tracking
  └── Request Logging
          │
          ▼
     AI Inference API
          │
          ▼
     ML Prediction
```

This allows the AI functionality to be consumed independently from the hospital management interface.

---

## 🧠 AI Architecture

The AI layer is separated from the main application to keep responsibilities clear.

```text
Next.js
   │
   │ HTTPS / REST
   ▼
Django REST Framework
   │
   ├── Authentication
   ├── Users
   ├── Patients
   ├── Inventory
   ├── Analytics
   ├── API Keys
   ├── Rate Limiting
   │
   └──────────────► AI Inference Service
                         │
                         ├── Heart Disease Model
                         ├── Stroke Model
                         ├── Diabetes Model
                         ├── CKD Model
                         └── Lung Disease CNN
```

This separation makes the system easier to maintain and allows the AI inference layer to evolve independently from the core application.

---

## 🛠️ Technology Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Lucide React**
* **Recharts**

### Backend

* **Python**
* **Django**
* **Django REST Framework**
* **JWT Authentication**
* **RESTful APIs**

### AI / Machine Learning

* **PyTorch**
* **Transformers**
* **scikit-learn**
* **CNN-based image classification**
* **SHAP / LIME**
* **Joblib**

### Infrastructure

* **PostgreSQL**
* **Redis**
* **Docker**
* **Git / GitHub**
* **CI/CD**

---

## 🏗️ Engineering Highlights

MEDEXA focuses on real-world engineering concepts rather than only building UI screens.

### Authentication Flow

```text
Login
  ↓
Django Authentication
  ↓
JWT Access + Refresh Tokens
  ↓
HttpOnly Cookies
  ↓
Protected API Requests
```

### API Security Flow

```text
Request
  ↓
API Key Authentication
  ↓
Permission Validation
  ↓
Subscription Check
  ↓
Redis Rate Limit
  ↓
Request Logging
  ↓
AI Inference
  ↓
Response
```

### Redis Usage

Redis is used for fast, temporary application state such as:

* Daily API request counters
* Rate limiting
* Usage tracking
* Cached application data

Example subscription limits:

| Plan | Daily API Requests |
| ---- | -----------------: |
| Free |                100 |
| Pro  |             10,000 |

---

## 📡 API Example

Example AI prediction request:

```http
POST /api/v1/predictions/heart/
Authorization: Bearer drk_live_xxxxxxxxx
Content-Type: application/json
```

Example response:

```json
{
  "prediction": 0,
  "probabilities": {
    "0": 0.9932,
    "1": 0.0068
  }
}
```

The API layer is designed so that external applications can consume the prediction services without directly interacting with the internal ML implementation.

---

## 📊 Dashboard

The dashboard is designed around actionable clinical and operational information rather than simply displaying database records.

It provides:

* Patient statistics
* Monthly analytics
* Risk prediction overview
* Inventory status
* Low-stock alerts
* Recent patients
* AI system status
* Hospital activity metrics

---

## 📸 Screenshots

### Dashboard

<!-- Add dashboard screenshot here -->

### Patient Management

<!-- Add patient management screenshot here -->

### AI Prediction

<!-- Add AI prediction screenshot here -->

### Inventory

<!-- Add inventory screenshot here -->

---

## 📁 Project Architecture

```text
MEDEXA/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   └── ...
│
├── backend/
│   ├── authentication/
│   ├── patients/
│   ├── inventory/
│   ├── analytics/
│   ├── api_management/
│   └── ...
│
├── ai-service/
│   ├── models/
│   ├── inference/
│   ├── preprocessing/
│   └── ...
│
├── docker/
├── .github/
│   └── workflows/
│
└── README.md
```

---

## 🎯 Project Goals

MEDEXA is being developed to explore and demonstrate:

* Full-stack application development
* Secure REST API design
* AI/ML model deployment
* Healthcare data management
* Microservice-oriented architecture
* Redis-based rate limiting
* API management
* Production-oriented authentication
* Analytics and data visualization
* Scalable frontend architecture
* Dockerized development and deployment
* CI/CD automation

---

## 🗺️ Roadmap

### Completed

* [x] Authentication
* [x] Patient management
* [x] Doctor dashboard
* [x] REST API
* [x] Pagination
* [x] Dark mode
* [x] Inventory management
* [x] Analytics dashboard
* [x] AI prediction models
* [x] API key authentication
* [x] Redis rate limiting

### In Progress

* [ ] Advanced AI explainability
* [ ] Improved clinical analytics
* [ ] Production PostgreSQL deployment
* [ ] Docker deployment
* [ ] Automated testing
* [ ] CI/CD pipeline
* [ ] API documentation
* [ ] Advanced monitoring

### Future

* [ ] Role-based hospital staff accounts
* [ ] Appointment management
* [ ] Prescription management
* [ ] Notifications
* [ ] Audit logging
* [ ] Advanced observability
* [ ] Cloud deployment
* [ ] Model monitoring

---

## 🔬 Engineering Philosophy

> **Build systems, not just features.**

MEDEXA is an ongoing project focused on understanding how AI models can be integrated into secure, maintainable and scalable software systems.

The project intentionally combines **frontend engineering, backend architecture, machine learning, security, APIs, databases, caching and DevOps** to simulate the challenges of building a real-world healthcare technology platform.

---

## 📌 Project Status

🚧 **Active Development**

MEDEXA is continuously evolving as new healthcare workflows, AI capabilities, security features and infrastructure components are implemented.

---

## ⚠️ Disclaimer

MEDEXA is a software engineering and AI research project.

AI-generated predictions are for **educational and decision-support purposes only** and should not be used as a substitute for professional medical diagnosis or treatment.

---

## 👨‍💻 Built With

**Next.js · Django · DRF · PostgreSQL · Redis · PyTorch · Docker · REST APIs · Machine Learning**
