"""
FastAPI Application Entry Point
Tropical Cyclone AI/ML Detection & Decision Support System (SIH MVP)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import (
    APP_TITLE,
    APP_VERSION,
    API_V1_STR,
    CORS_ORIGINS,
    SAMPLE_FRAMES_DIR,
)
from app.api.v1.detection import router as detection_router
from app.api.v1.cyclones import router as cyclones_router
from app.api.v1.advisory import router as advisory_router

app = FastAPI(
    title=APP_TITLE,
    version=APP_VERSION,
    description="Smart India Hackathon MVP: Multi-tier cyclone detection and maritime decision support API.",
)

# CORS middleware for local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(detection_router, prefix=API_V1_STR)
app.include_router(cyclones_router, prefix=API_V1_STR)
app.include_router(advisory_router, prefix=API_V1_STR)


@app.get("/health", summary="Health check endpoint")
def health_check():
    return {
        "status": "healthy",
        "service": APP_TITLE,
        "version": APP_VERSION,
        "architecture_tiers": {
            "tier_1_implemented": "YOLO11 Object Detection (640x640, BBox, Confidence)",
            "tier_2_integration_ready": "IBTrACS Ground Truth, Meteorology & LLM Advisory (DEMO / SIMULATION)",
            "tier_3_phase_2": "Temporal Sequence Modeling, Trajectory & Landfall Prediction (Roadmap)"
        }
    }


@app.get("/", summary="Root Redirect / Welcome")
def root_info():
    return {
        "system": APP_TITLE,
        "docs_url": "/docs",
        "api_v1_prefix": API_V1_STR
    }
