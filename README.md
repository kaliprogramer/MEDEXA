# 🏥 MEDEXA

<p align="center">
  <img
    src="Backends/Backend-Django-Main/video-demo/banner.svg"
    alt="MEDEXA - AI-Powered Hospital Management & Clinical Risk Prediction Platform"
    width="100%"
  />
</p>

<p align="center">
  <strong>AI-Powered Hospital Management & Clinical Risk Prediction Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" />
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<p align="center">
  <strong>🏥 Hospital Management</strong> ·
  <strong>🤖 AI Risk Prediction</strong> ·
  <strong>📊 Clinical Analytics</strong> ·
  <strong>🔐 Secure APIs</strong> ·
  <strong>⚡ Scalable Architecture</strong>
</p>

---

## 🎥 Product Demo

<p align="center">
  <img
    src="./assets/medexa-demo.gif"
    alt="MEDEXA Product Demo"
    width="900"
  />
</p>

<p align="center">
  <strong>MEDEXA in action</strong><br/>
  Dashboard → Patient Management → AI Prediction → Analytics → Inventory → API Management
</p>

### 🎬 Full Walkthrough

> A complete product walkthrough demonstrating the major features and system architecture.

**▶️ [Watch the full MEDEXA demo](./Backends/Backend-Django-Main/video-demo/medexa.mp4)**

---

## 🚀 Overview

MEDEXA is a full-stack healthcare platform that combines **hospital management, clinical analytics, and AI-powered disease risk prediction** into a unified system.

The platform is designed around production-oriented engineering principles including secure authentication, protected APIs, API-key management, Redis-based rate limiting, analytics, service separation, and AI inference.

Rather than being only a CRUD application, MEDEXA explores how **AI, backend engineering, frontend architecture, security, databases, caching, and DevOps** can work together in a real-world healthcare platform.

---

## ✨ Core Capabilities

| Module                     | Capabilities                                                       |
| -------------------------- | ------------------------------------------------------------------ |
| 🏥 **Hospital Management** | Patients, doctors, inventory, rooms and clinical workflows         |
| 🤖 **AI/ML**               | Heart, stroke, diabetes, CKD and lung disease prediction           |
| 📊 **Analytics**           | Patient trends, risk analytics, inventory statistics and KPIs      |
| 🔐 **Security**            | JWT, HttpOnly cookies, API keys, permissions and protected APIs    |
| ⚡ **API Platform**         | External AI prediction APIs with authentication and usage tracking |
| 🚦 **Rate Limiting**       | Redis-backed daily API usage limits                                |
| 🗄️ **Data Layer**         | PostgreSQL-ready architecture with structured REST APIs            |
| 🐳 **Infrastructure**      | Docker and CI/CD-oriented architecture                             |

---

## 🧠 AI & Clinical Intelligence

MEDEXA integrates multiple machine-learning models for clinical risk assessment and image-based prediction.

### Current AI Modules

* ❤️ Heart disease risk prediction
* 🧠 Stroke risk prediction
* 🩸 Diabetes risk prediction
* 🫘 Chronic kidney disease prediction
* 🫁 Lung disease image classification
* 📈 Probability-based prediction
* 🔍 Explainability and model interpretation

> ⚠️ **Medical Disclaimer:** AI predictions are intended for educational and decision-support purposes only. They are not a substitute for professional medical diagnosis or treatment.

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │       MEDEXA        │
                         │  Healthcare Platform │
                         └──────────┬──────────┘
                                    │
                         ┌──────────▼──────────┐
                         │      Next.js        │
                         │  Web Application    │
                         └──────────┬──────────┘
                                    │
                              HTTPS / REST
                                    │
                         ┌──────────▼──────────┐
                         │ Django REST API     │
                         │                      │
                         │ Authentication       │
                         │ Patients             │
                         │ Inventory             │
                         │ Analytics             │
                         │ API Management       │
                         └──────┬───────┬───────┘
                                │       │
                    ┌───────────┘       └────────────┐
                    ▼                                ▼
             ┌─────────────┐                  ┌─────────────┐
             │    Redis    │                  │ PostgreSQL  │
             │             │                  │             │
             │ Rate Limits │                  │ Application │
             │ Caching     │                  │ Data        │
             └─────────────┘                  └─────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ AI Inference    │
                       │ Service         │
                       ├─────────────────┤
                       │ Heart           │
                       │ Stroke          │
                       │ Diabetes        │
                       │ CKD             │
                       │ Lung CNN        │
                       └─────────────────┘
```

---

## 🔐 Security Architecture

```text
Client
   │
   ▼
Authentication
   │
   ├── JWT
   └── HttpOnly Cookies
          │
          ▼
     Django API
          │
          ├── Permission Validation
          │
          ├── API Key Authentication
          │
          ├── Subscription Validation
          │
          ├── Redis Rate Limiting
          │
          └── Request Logging
                    │
                    ▼
              AI Inference
                    │
                    ▼
                 Response
```

---

## 📊 Analytics

MEDEXA provides a centralized analytics dashboard for monitoring hospital activity.

### Dashboard Metrics

* Patient growth
* Monthly patient statistics
* Gender distribution
* Prediction activity
* Risk overview
* Inventory value
* Low-stock items
* Out-of-stock items
* Recent patient activity
* AI system status

---

## 🔑 API Management

MEDEXA includes an API management layer for exposing AI prediction capabilities to external applications.

### API Security

* Bearer API keys
* Hashed API-key storage
* API-key expiration
* Key activation/deactivation
* Request tracking
* Usage analytics
* Subscription-based limits
* Redis-backed rate limiting

### Example

```http
POST /api/v1/predictions/heart/
Authorization: Bearer drk_live_xxxxxxxxx
Content-Type: application/json
```

Response:

```json
{
  "prediction": 0,
  "probabilities": {
    "0": 0.9932,
    "1": 0.0068
  }
}
```

---

## 🛠️ Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React
* Recharts

### Backend

* Python
* Django
* Django REST Framework
* JWT Authentication
* REST APIs

### AI / Machine Learning

* PyTorch
* scikit-learn
* Transformers
* CNN-based image classification
* SHAP / LIME
* Joblib

### Infrastructure

* PostgreSQL
* Redis
* Docker
* Git
* GitHub Actions / CI/CD

---

## 📸 Screenshots

### Dashboard

<p align="center">
  <img src="./assets/screenshots/dashboard.png" width="900" alt="MEDEXA Dashboard" />
</p>

### Patient Management

<p align="center">
  <img src="./assets/screenshots/patients.png" width="900" alt="MEDEXA Patient Management" />
</p>

### AI Prediction

<p align="center">
  <img src="./assets/screenshots/prediction.png" width="900" alt="MEDEXA AI Prediction" />
</p>

### Inventory

<p align="center">
  <img src="./assets/screenshots/inventory.png" width="900" alt="MEDEXA Inventory" />
</p>

---

## 🎯 Engineering Focus

MEDEXA is being developed to demonstrate practical engineering skills across multiple areas:

* Full-stack application architecture
* REST API development
* Secure authentication
* API security
* Machine-learning integration
* AI inference services
* Database design
* Redis caching and rate limiting
* Analytics and data visualization
* Service separation
* Docker
* CI/CD
* Automated testing
* Production-oriented development

---

## 🗺️ Roadmap

### Completed

* [x] Authentication
* [x] Patient management
* [x] Doctor dashboard
* [x] REST APIs
* [x] Pagination
* [x] Dark mode
* [x] Inventory management
* [x] Analytics dashboard
* [x] AI prediction models
* [x] API-key authentication
* [x] Redis rate limiting

### In Progress

* [ ] Automated testing
* [ ] CI/CD pipeline
* [ ] API documentation
* [ ] Advanced monitoring
* [ ] Advanced AI explainability
* [ ] Production PostgreSQL deployment
* [ ] Docker deployment

### Planned

* [ ] Appointment management
* [ ] Prescription management
* [ ] Notifications
* [ ] Audit logging
* [ ] Advanced observability
* [ ] Cloud deployment
* [ ] Model monitoring
* [ ] Expanded hospital staff roles

---

## 🔬 Engineering Philosophy

> **Build systems, not just features.**

MEDEXA is an ongoing project focused on integrating AI models into a secure, maintainable and scalable healthcare platform.

The project combines **AI/ML, full-stack development, backend architecture, API security, databases, caching, analytics and DevOps** to explore the engineering challenges involved in building modern intelligent software systems.

---

## 📌 Project Status

🚧 **Active Development**

MEDEXA is continuously evolving as new healthcare workflows, AI capabilities, security features and infrastructure components are implemented.

---

## ⚠️ Disclaimer

MEDEXA is a software engineering and AI research project.

AI-generated predictions are intended for educational and decision-support purposes only and should not be used as a substitute for professional medical diagnosis or treatment.
