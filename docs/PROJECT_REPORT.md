# Tropical Cyclone AI/ML Detection & Decision Support System
## Smart India Hackathon (SIH-26070) — Complete Project Report & Architecture

**Team:** Punit Kumar Kashyap, Kavya, and team  
**Problem Statement:** AI/ML-Based System for Identification, Classification, and Prediction of Different Tropical Cyclone Patterns Using Multi-Source Satellite Data  
**Repository:** `cyclone-ai-dashboard`  
**Status:** MVP Complete (Tier 1 Live, Tier 2 Demo, Tier 3 Roadmap)

---

## 1. Problem Statement & Objective

India's coastline spans ~7,500 km and is vulnerable to tropical cyclones from the North Indian Ocean basin (Bay of Bengal and Arabian Sea). Early identification and rapid classification of cyclonic formations from satellite imagery is critical for disaster preparedness.

**Our solution** is an end-to-end AI/ML-powered operational dashboard that:

1. **Detects cyclones** in real-time satellite imagery using a custom-trained YOLO11 object detection model
2. **Classifies intensity** using the IMD (India Meteorological Department) Dvorak T-Number scale (Depression → Super Cyclone)
3. **Generates disaster response advisories** with stakeholder-specific SOPs for NDRF, port authorities, fisheries, district admin, and public safety
4. **Visualizes geospatial tracks** on an interactive maritime GIS map with IBTrACS ground truth data

---

## 2. Technology Stack

### Frontend (Dashboard UI)
| Technology | Purpose |
|---|---|
| **React 18** + **TypeScript** | Core UI framework with strict type safety |
| **Vite 5** | Build tool & dev server (HMR) |
| **Tailwind CSS 3.4** | Utility-first styling (white/slate professional theme) |
| **Recharts** | Pressure-wind time-series charts |
| **Leaflet** + **React-Leaflet** | Interactive maritime GIS map (cyclone tracks, port markers) |
| **Lucide React** | Icon system (200+ icons) |

### Backend (API Server)
| Technology | Purpose |
|---|---|
| **Python 3.10+** | Runtime |
| **FastAPI** | REST API framework with auto-generated Swagger docs |
| **Uvicorn** | ASGI server |
| **Pydantic v2** | Request/response schema validation |
| **Pillow** + **NumPy** | Image preprocessing for YOLO inference |
| **Ultralytics** (optional) | YOLO11 inference engine (activated when `weights/best.pt` exists) |

### ML / Data Science
| Technology | Purpose |
|---|---|
| **YOLO11** (Ultralytics) | Object detection model for cyclone identification |
| **INSAT-3D Satellite Data** | Multi-spectral imagery (TIR-1, WV, GeoColor, Visible) |
| **IBTrACS Dataset** | Historical tropical cyclone ground truth tracks |

---

## 3. System Architecture (Three-Tier Design)

The system is designed with **strict data and functional boundaries** to prevent conflating AI detection outputs with meteorological ground truth:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🟢 TIER 1: IMPLEMENTED (Live YOLO11 Model)                                │
│                                                                             │
│  Input:  640×640 RGB satellite frame (PNG/JPG)                             │
│  Model:  YOLO11 custom-trained on INSAT-3D cyclone imagery                 │
│  Output: Bounding box [x1, y1, x2, y2] + confidence score (0.0–1.0)       │
│  State:  Binary → Cyclone Detected / No Cyclone Detected                  │
│                                                                             │
│  Components: SatelliteViewer, YoloBoundingBoxOverlay, InferenceControls     │
│  API:        POST /api/v1/detect (multipart/form-data image upload)        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🟡 TIER 2: INTEGRATION READY (Demo / Simulation Data)                      │
│                                                                             │
│  Data Sources: IBTrACS ground truth, IMD bulletins (simulated)             │
│  Features:                                                                  │
│    • Georeferenced cyclone center coordinates (Lat/Lon)                    │
│    • Central pressure (hPa), max sustained winds (km/h & kts)             │
│    • IMD intensity scale classification with Dvorak T-Number               │
│    • Historical track progression (time-series)                            │
│    • Interactive Leaflet maritime map with track polylines                  │
│    • LLM-powered disaster advisory SOPs per stakeholder group              │
│                                                                             │
│  Components: MaritimeMap, MeteorologyCards, IntensityBadge,                │
│              PressureWindChart, DisasterAdvisoryPanel                       │
│  APIs:       GET /api/v1/cyclones/current, GET /api/v1/advisory/current    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔵 TIER 3: PHASE II (Roadmap / Architectural Blueprint)                    │
│                                                                             │
│  Planned Modules:                                                           │
│    1. Multi-frame temporal sequence model (ConvLSTM / Video Transformers)  │
│    2. 24h/48h/72h numerical track forecasting                              │
│    3. Coastal landfall point & ETA prediction                              │
│    4. Probabilistic cone of uncertainty swath                              │
│                                                                             │
│  Status: Dashboard architecture has reserved modular hooks                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Flow Diagram

```
  User uploads satellite       Frontend sends image         Backend runs
  image OR selects sample  →   via POST /api/v1/detect  →   YOLO11 inference
  from test dataset            (multipart/form-data)        on 640×640 tensor
                                                                  │
                                                                  ▼
  Frontend renders             API returns JSON              Model outputs
  bounding box overlay,   ←    YOLODetectionResponse    ←    bboxes + confidence
  confidence badges,           (see schema below)            scores per detection
  alert banner
                                      │
                                      ▼
  Simultaneously, frontend fetches:
    • GET /api/v1/cyclones/current → CycloneMetadataResponse (geo, meteo, track)
    • GET /api/v1/advisory/current → AdvisoryResponse (alert level, SOPs)
                                      │
                                      ▼
  Dashboard renders 4-panel command center:
    ┌──────────────┬──────────────┐
    │  Satellite    │  Maritime    │
    │  Vision AI    │  GIS Map     │
    ├──────────────┼──────────────┤
    │  Telemetry    │  Disaster    │
    │  & Intensity  │  Advisory    │
    └──────────────┴──────────────┘
```

---

## 5. API Contract & Schemas

### 5.1 YOLO11 Detection Endpoint (Tier 1)
```
POST /api/v1/detect?confidence_threshold=0.50
Content-Type: multipart/form-data
Body: file = <satellite_image.png>
```

**Response: `YOLODetectionResponse`**
```json
{
  "inference_timestamp": "2026-08-29T06:00:00Z",
  "image_name": "insat3d_cyclone_remal.png",
  "image_dimensions": { "width": 640, "height": 640 },
  "cyclone_detected": true,
  "detection_count": 1,
  "detections": [
    {
      "class_id": 0,
      "class_name": "cyclone",
      "confidence": 0.946,
      "bbox_pixel": { "x1": 155, "y1": 125, "x2": 525, "y2": 495 },
      "bbox_normalized": { "x_center": 0.5312, "y_center": 0.4844, "width": 0.5781, "height": 0.5781 }
    }
  ],
  "model_meta": {
    "engine": "YOLO11",
    "weights_version": "yolo11_cyclone_v1.0",
    "latency_ms": 28.2,
    "tier_status": "TIER 1 - IMPLEMENTED"
  }
}
```

### 5.2 Cyclone Metadata Endpoint (Tier 2)
```
GET /api/v1/cyclones/current?scenario=remal_bob
```

**Response: `CycloneMetadataResponse`** — includes geo-coordinates, IMD category, meteorological data (pressure, wind speed, gusts), and historical track points.

### 5.3 Disaster Advisory Endpoint (Tier 2)
```
GET /api/v1/advisory/current?scenario=remal_bob
```

**Response: `AdvisoryResponse`** — includes alert level (RED/ORANGE/YELLOW/GREEN), headline, risk assessment, and stakeholder-specific action items for NDRF, marine fisheries, port authorities, district administration, and public safety.

---

## 6. Complete File Structure

```
cyclone-ai-dashboard/
│
├── backend/                          # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py                   # FastAPI app, CORS, router mounting
│   │   ├── config.py                 # Paths, API prefix, CORS origins
│   │   ├── api/v1/
│   │   │   ├── detection.py          # POST /detect — YOLO11 inference
│   │   │   ├── cyclones.py           # GET /cyclones/current — IBTrACS data
│   │   │   └── advisory.py           # GET /advisory/current — SOP engine
│   │   ├── schemas/
│   │   │   ├── detection.py          # Pydantic: BBox, DetectionObject, ModelMeta
│   │   │   ├── cyclone.py            # Pydantic: GeoCoords, IMD Category, Track
│   │   │   └── advisory.py           # Pydantic: AlertLevel, StakeholderSOPs
│   │   ├── services/
│   │   │   ├── yolo_service.py       # YOLO11 inference (mock + real ultralytics)
│   │   │   ├── ibtracs_service.py    # Ground truth cyclone metadata provider
│   │   │   └── advisory_service.py   # LLM/rule-based disaster advisory engine
│   │   └── data/                     # Sample data files
│   ├── weights/                      # Drop trained best.pt here
│   ├── requirements.txt              # fastapi, uvicorn, pydantic, pillow, numpy
│   ├── run.py                        # Entry: uvicorn on port 8000
│   ├── generate_samples.py           # Synthetic sample frame generator
│   └── test_api.py                   # Automated API tests
│
├── frontend/                         # React + TypeScript + Vite Dashboard
│   ├── src/
│   │   ├── App.tsx                   # Master dashboard layout (4 views)
│   │   ├── main.tsx                  # React DOM entry point
│   │   ├── index.css                 # Global styles, scrollbar, animations
│   │   ├── components/
│   │   │   ├── Header.tsx            # Top bar: title, scenario picker, clocks
│   │   │   ├── CommandNav.tsx        # 4-view tab navigation + status HUD
│   │   │   ├── Common/
│   │   │   │   ├── GlassCard.tsx     # Reusable card container with tier badges
│   │   │   │   └── StatusPill.tsx    # Tier status indicator (Implemented/Demo/Phase2)
│   │   │   ├── VisionStudio/         # 🟢 TIER 1 Components
│   │   │   │   ├── SatelliteViewer.tsx       # 640×640 image viewer + zoom/grid
│   │   │   │   ├── YoloBoundingBoxOverlay.tsx # Yellow bbox + corner brackets
│   │   │   │   └── InferenceControls.tsx      # Threshold slider, samples, upload
│   │   │   ├── GeoMap/               # 🟡 TIER 2 Components
│   │   │   │   └── MaritimeMap.tsx   # Leaflet map: track, eye marker, ports
│   │   │   ├── Telemetry/            # 🟡 TIER 2 Components
│   │   │   │   ├── IntensityBadge.tsx     # IMD category + progression scale
│   │   │   │   ├── MeteorologyCards.tsx   # Wind, pressure, gusts, heading
│   │   │   │   └── PressureWindChart.tsx  # Recharts time-series dual-axis
│   │   │   ├── Advisory/             # 🟡 TIER 2 Components
│   │   │   │   └── DisasterAdvisoryPanel.tsx  # Tabbed SOP matrix per stakeholder
│   │   │   ├── PhaseII/              # 🔵 TIER 3 Components
│   │   │   │   └── PhaseIIRoadmapModal.tsx    # Future trajectory/landfall plans
│   │   │   ├── ModelIntegrationModal.tsx  # YOLO11 weight integration guide
│   │   │   └── RawJsonModal.tsx           # Raw JSON inference output viewer
│   │   ├── services/
│   │   │   └── api.ts                # Typed API client (fetch + fallback mocks)
│   │   ├── types/
│   │   │   └── cyclone.ts            # All TypeScript interfaces
│   │   └── utils/
│   │       └── satelliteCanvas.ts    # Multi-spectral frame generator
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── cyclone-preprocessing.ipynb       # Data preprocessing notebook
├── yolo-training.ipynb               # YOLO11 training notebook
├── README.md                         # Quickstart guide
└── PROJECT_REPORT.md                 # ← This file
```

---

## 7. Frontend Dashboard Views

The dashboard has **4 navigable command center views**:

### View 1: Command Overview (Default)
- Executive 4-panel grid showing all systems at once
- Top-left: Satellite Vision AI with YOLO bounding box
- Top-right: Maritime GIS radar map with cyclone track
- Bottom-left: Meteorological telemetry (wind, pressure, intensity)
- Bottom-right: AI disaster advisory briefing
- Bottom: YOLO11 inference testbed controls

### View 2: Vision AI Inspector
- Full-size 640×640 satellite frame with zoom (75%–200%)
- YOLO11 bounding box overlay with corner brackets
- Pixel coordinate grid toggle (64×64)
- Side panel: inference controls, threshold slider, sample selector
- Spectral channel reference guide (TIR-1, WV, GeoColor)

### View 3: Geospatial Radar & Telemetry
- Expanded Leaflet maritime map with cyclone track polyline
- IMD intensity classification badge + progression scale
- Meteorological gauge cards (wind, pressure, gusts, heading)
- Pressure vs. Wind dual-axis time-series chart

### View 4: Disaster Response SOP
- Full AI disaster advisory panel with tabbed stakeholder SOPs
- Current alert & hazard level with intensity badge
- Emergency command hotline directives
- NDRF, Marine/Fisheries, Port, District Admin, Public Safety tabs

---

## 8. UI Design System

| Element | Style |
|---|---|
| **Theme** | Light professional (white/slate) — authority-grade |
| **Font** | System sans-serif + monospace for data |
| **Cards** | `GlassCard` with color-coded top borders (cyan/emerald/amber/rose) |
| **Badges** | `StatusPill` — Tier 1 (Implemented), Tier 2 (Demo), Tier 3 (Phase II) |
| **Alert Banner** | Red pulsing banner when cyclone detected |
| **Bounding Box** | Yellow `#facc15` with corner brackets + glow shadow |
| **Map** | Leaflet with Carto basemap, custom popups |
| **Charts** | Recharts dual-axis (slate-900 wind, slate-500 pressure) |

---

## 9. How to Run

### Backend
```bash
cd backend
pip install -r requirements.txt    # fastapi, uvicorn, pydantic, pillow, numpy
python run.py                      # Starts on http://localhost:8000
                                   # Swagger docs: http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install                        # Installs React, Vite, Tailwind, Leaflet, etc.
npm run dev                        # Starts on http://localhost:5173
```

### Plugging in Trained YOLO11 Weights
1. Copy `best.pt` to `backend/weights/best.pt`
2. `pip install ultralytics` in your Python environment
3. Restart the backend — it auto-detects the weights file and switches from mock to real inference

---

## 10. Key Design Decisions

1. **Strict Tier Separation**: YOLO pixel-space detections (Tier 1) are never mixed with geo-referenced meteorological data (Tier 2). This prevents false authority claims.

2. **Graceful Degradation**: Frontend works fully offline — when the backend is unreachable, the API client falls back to built-in simulation data. The dashboard is always demonstrable.

3. **Model-Agnostic Architecture**: The YOLO inference service has a clean interface. Dropping in `best.pt` activates real inference with zero frontend changes.

4. **Scenario Switching**: Two pre-built storm scenarios (Cyclone Remal in Bay of Bengal, Cyclone Biparjoy in Arabian Sea) demonstrate the system across different basins and intensity levels.

5. **Professional Theme**: White/slate light theme chosen for authority-grade disaster management contexts (suitable for IMD, NDRF, SDMA official use).

---

## 11. Codebase Stats

| Metric | Value |
|---|---|
| Frontend lines of code | ~2,955 (TSX/TS/CSS) |
| Backend lines of code | ~1,017 (Python) |
| React components | 15 |
| API endpoints | 4 (health, detect, cyclones, advisory) |
| TypeScript interfaces | 14 |
| Pydantic schemas | ~10 |
| Frontend dependencies | 7 runtime + 8 dev |
| Backend dependencies | 6 |

---

## 12. Phase II Roadmap (Future Work)

| Module | Description |
|---|---|
| **Temporal Sequence Model** | ConvLSTM / Video Vision Transformers ingesting T-12h → T-0h consecutive frames to learn vortex rotation |
| **Track Forecasting** | 24h/48h/72h future storm center coordinate prediction, rendered on GIS map |
| **Landfall Prediction** | Intersection of forecast track with Indian coastal geometries + ETA ±3h |
| **Cone of Uncertainty** | Probabilistic error swath (standard deviation ellipse) across lead times |

---

*Generated: August 29, 2026 • SIH-26070 Prototype*
