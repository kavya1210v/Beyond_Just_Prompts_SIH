# 🌀 Cyclone Detection and Classification AI Dashboard

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-green.svg)
![YOLO](https://img.shields.io/badge/YOLO-11-yellow.svg)

An advanced **AI-powered disaster management and decision-support dashboard** built for the **Smart India Hackathon (SIH)**. The platform integrates **YOLO11 object detection**, **XGBoost-based cyclone intensity classification**, **interactive geospatial visualization**, and a **Gemini-powered Retrieval-Augmented Generation (RAG)** system to provide actionable intelligence for disaster response authorities.

---

# 🌟 Key Features

## 🛰️ 1. Vision AI Satellite Studio (YOLO11)

- **Multi-Spectral Satellite Image Support**
  - Upload and analyze INSAT-3D satellite imagery (TIR-1, WV, GeoColor).

- **Deep Convective Core Detection**
  - Detect cyclone eyes and dense convective cores using a custom-trained **YOLO11s** model.

- **Interactive Dashboard**
  - Adjustable confidence threshold
  - Bounding box overlays
  - Live coordinate inspector
  - Real-time inference

---

## 🌪️ 2. Meteorological Classification Engine (XGBoost)

Predict cyclone intensity from atmospheric telemetry.

### Features Used

- Central Pressure (hPa)
- Sustained Wind Speed (km/h)
- Sea Surface Temperature (SST)
- Vertical Wind Shear

### Predicted Categories

- Depression
- Deep Depression
- Cyclonic Storm
- Severe Cyclonic Storm
- Very Severe Cyclonic Storm
- Extremely Severe Cyclonic Storm
- Super Cyclonic Storm

---

## 🗺️ 3. Geospatial Command Center

Powered by **React Leaflet**.

### Features

- Interactive cyclone tracking
- Radius of Maximum Winds (RMW)
- Coastal vulnerability visualization
- Port warning system
- Real-time mapping

---

## 🤖 4. AI Decision Support (RAG + Gemini)

Generate disaster management advisories grounded in official NDMP guidelines.

### Features

- NDMP-2019 grounded responses
- ChromaDB vector database
- Google Gemini integration
- Hallucination-resistant retrieval
- Executive-level disaster briefings

---

# 🏗️ System Architecture

The project follows a modular three-tier AI architecture.

```
Satellite Images
        │
        ▼
┌──────────────────────────┐
│  Tier 1 - YOLO11         │
│  Object Detection        │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Tier 2 - XGBoost         │
│ Cyclone Classification   │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Tier 3 - RAG + Gemini    │
│ Disaster Advisories      │
└──────────────────────────┘
```

---

# 📁 Repository Structure

```text
cyclone-detection-and-classification/
├── backend/
│   ├── app/
│   ├── weights/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── RAG/
│   ├── knowledge_base/
│   ├── vectordb/
│   └── scripts/
│
├── models/
├── notebooks/
├── docs/
└── README.md
```

---

# 📦 Pre-trained Model Weights

The custom-trained **YOLO11s Cyclone Detection** model used in this project is publicly available on Kaggle.

## 🔗 Kaggle Model

**Cyclone Detection v2 (YOLO11s)**

https://www.kaggle.com/models/punitkashyap2007/cyclone-detection-v2

Download the latest `.pt` model weights and place them inside:

```text
backend/
└── weights/
    └── cyclone_yolo11s_best.pt
```

> **Note:** The Kaggle repository contains the latest trained versions of the YOLO11s cyclone detection model used by this project.

---

# 🚀 Getting Started

## Prerequisites

- Python 3.10+
- Node.js 18+
- Google Gemini API Key

---

## Backend Setup (FastAPI)

```bash
cd backend
```

Create a virtual environment.

```bash
python -m venv .venv
```

Activate it.

### Linux/macOS

```bash
source .venv/bin/activate
```

### Windows

```powershell
.venv\Scripts\activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Create a `.env` file (or configure the API key in your backend).

```env
GEMINI_API_KEY=YOUR_API_KEY
```

Run the server.

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend URL

```
http://localhost:8000
```

Swagger Documentation

```
http://localhost:8000/docs
```

---

## Frontend Setup (React + Vite)

```bash
cd frontend
```

Install packages.

```bash
npm install
```

Run the development server.

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# 🔗 API Endpoints

## Detect Cyclone

```http
POST /api/v1/detect
```

Returns:

- Bounding boxes
- Confidence score
- Pixel coordinates

---

## Classify Cyclone

```http
POST /api/v1/cyclones/classify
```

Returns:

- IMD cyclone category
- Prediction confidence

---

## Generate Advisory

```http
GET /api/v1/advisory/{scenario_id}
```

Returns:

- NDMP-grounded disaster advisory
- Executive briefing
- Emergency recommendations

---

# 💡 Usage

### 1. Upload Satellite Image

Upload a `.png` INSAT-3D image into the Vision AI dashboard.

---

### 2. Detect Cyclone

The custom-trained YOLO11s model automatically detects:

- Cyclone eye
- Dense convective core

---

### 3. Adjust Confidence Threshold

Use the confidence slider to remove weak detections.

---

### 4. Classify Cyclone

Enter atmospheric telemetry including:

- Wind speed
- Pressure
- SST
- Wind shear

The XGBoost model predicts the cyclone category.

---

### 5. Generate Executive Briefing

Click **Generate Executive Briefing** to retrieve an NDMP-grounded advisory using the RAG pipeline.

---

# 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React 18, Vite, TypeScript |
| Backend | FastAPI, Python |
| Object Detection | YOLO11 (Ultralytics) |
| Classification | XGBoost |
| Mapping | React Leaflet |
| Vector Database | ChromaDB |
| LLM | Google Gemini |
| Data Processing | NumPy, Pandas |
| ML | Scikit-learn |
| Deployment | Docker (Optional) |

---

# 📈 Future Improvements

- Live INSAT satellite stream integration
- IMD API integration
- Multi-cyclone tracking
- Temporal cyclone forecasting
- Rainfall estimation
- Flood prediction module
- Mobile dashboard
- Automated emergency alert system

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

# 📜 License

Developed exclusively for the **Smart India Hackathon (SIH)**.

Released under the **MIT License**.

---

# 👨‍💻 Team

This project was developed by the following team members for the **Smart India Hackathon (SIH)**:

- **Punit**
- **Sahana**
- **Mandeep**
- **Rajiv**
- **Kavya**
- **Jatan**

---
