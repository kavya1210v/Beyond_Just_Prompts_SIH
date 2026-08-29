# Cyclone Detection and Classification AI Dashboard 🌀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-green.svg)
![YOLO](https://img.shields.io/badge/YOLO-11-yellow.svg)

An advanced, AI-driven disaster management and decision-support dashboard. Built for the Smart India Hackathon (SIH), this project integrates real-time geospatial tracking, object detection via YOLO11 on multi-spectral satellite imagery, XGBoost-based intensity classification, and a Gemini-powered Retrieval-Augmented Generation (RAG) knowledge base to provide actionable intelligence for disaster response authorities.

---

## 🌟 Key Features

### 1. Vision AI Satellite Studio (YOLO11)
- **Multi-Spectral Ingestion:** Upload and analyze INSAT-3D satellite frames (TIR-1, WV, GeoColor) for real-time inference.
- **Deep Convective Core Detection:** Dynamically detects the cyclone's eye and dense convective core using our custom-trained YOLO11s model (`cyclone_yolo11s_best.pt`).
- **Interactive UI:** Features adjustable confidence thresholds, live 640x640 pixel-coordinate inspectors, and toggleable bounding box overlays.

### 2. Meteorological Classification Engine (XGBoost)
- **Real-Time Telemetry Processing:** Predicts the official Cyclone Category (from *Depression* up to *Super Cyclonic Storm*) based on real-time atmospheric telemetry.
- **Features Analyzed:** Central Pressure (hPa), Sustained Winds (km/h), Sea Surface Temperature (SST), and Vertical Wind Shear.

### 3. Geospatial Command Center
- **Interactive Radar Mapping:** Powered by `react-leaflet`, visualizing the cyclone's track.
- **Threat Radius Simulation:** Displays the estimated Radius of Maximum Winds (RMW) and high-vulnerability port warnings in real-time.

### 4. AI Decision Support (RAG + Gemini)
- **Tactical Advisories:** Generates strict, authority-grade disaster advisories utilizing a local ChromaDB vector database.
- **NDMP Grounded:** The database is indexed entirely from the official NDMP-2019 guidelines, preventing LLM hallucinations during critical, high-stress operations.

---

## 🏗️ System Architecture

The project is structured into three highly modular tiers for clean separation of concerns:

1. **TIER 1 (Computer Vision):** YOLO11 Object Detection for extracting spatial intelligence from raw satellite imagery.
2. **TIER 2 (Classification & Telemetry):** XGBoost Classification bridging numerical telemetry with IBTrACS ground truth.
3. **TIER 3 (Generative Advisory):** RAG Pipeline querying ChromaDB and utilizing Google Gemini for grounded situational awareness.

---

## 📁 Repository Structure

```text
cyclone-detection-and-classification/
├── backend/                  # FastAPI Application Server
│   ├── app/                  # Routes, Pydantic Schemas, and AI Services
│   ├── weights/              # Trained ML weights (.pt, .json)
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React Application (Vite + TypeScript)
│   ├── src/                  # Components, Custom Hooks, API Clients
│   ├── public/               # Static assets
│   └── package.json          # Node dependencies
├── RAG/                      # Retrieval-Augmented Generation Engine
│   ├── knowledge_base/       # NDMP Guidelines & Raw PDF Documents
│   ├── vectordb/             # ChromaDB Persistent Storage
│   └── scripts/              # Ingestion & chunking scripts
├── models/                   # Classification training scripts and artifacts
├── notebooks/                # Jupyter Notebooks for Data Prep & YOLO Training
├── docs/                     # Project Documentation & Architecture Reports
└── README.md                 # You are here!
```

---

## 🚀 Getting Started

Follow these steps to run the complete dashboard environment locally.

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- API Keys: **Google Gemini API** (Required for the RAG LLM engine)

### 1. Backend Setup (FastAPI + AI Services)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   ```
3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your environment variables (Add your Gemini API Key in `backend/app/services/llm_inference.py` or a `.env` file).
5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   *The backend will be available at `http://localhost:8000`. You can test endpoints via the interactive Swagger docs at `http://localhost:8000/docs`.*

### 2. Frontend Setup (React + Vite)

1. Open a **new** terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The command center dashboard will be accessible at `http://localhost:5173`.*

---

## 🔗 Core API Endpoints

The backend exposes a highly robust, asynchronously-driven REST API:

- **`POST /api/v1/detect`**: Submit a multi-spectral satellite frame. Returns a structured JSON payload containing bounding boxes, confidence scores, and normalized pixel coordinates from YOLO11.
- **`POST /api/v1/cyclones/classify`**: Submit atmospheric telemetry (e.g., wind speed, pressure). Returns the predicted IMD Cyclone Category.
- **`GET /api/v1/advisory/{scenario_id}`**: Retrieves context-aware, NDMP-grounded disaster advisories generated via the RAG pipeline.

---

## 💡 Usage Scenarios

1. **Upload an Image:** In the *Vision AI Satellite Studio*, click the upload button to ingest a raw `.png` satellite frame. The `cyclone_yolo11s_best.pt` model will instantly run inference and overlay the cyclone core.
2. **Adjust Thresholds:** Use the slider in the *Inference Engine Controls* to filter out low-confidence cloud formations dynamically.
3. **Analyze Telemetry:** Input real-time metrics (like 120 km/h sustained winds) into the *Classification Engine* to determine if the storm has escalated to a Severe Cyclonic Storm.
4. **Generate Advisories:** Click *Generate Executive Briefing* to cross-reference the active scenario with the NDMP-2019 database.

---

## 📜 License

Developed exclusively for the **Smart India Hackathon (SIH)**.
Released under the MIT License.
