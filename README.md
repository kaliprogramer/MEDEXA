# 🏥 MEDEXA

### AI-Powered Hospital Management & Clinical Risk Prediction Platform

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

[![MEDEXA Demo](Backends/Backend-Django-Main/video-demo/medexa.mp4)

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
