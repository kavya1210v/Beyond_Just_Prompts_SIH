"""
Application Configuration
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
WEIGHTS_DIR = BASE_DIR / "weights"
DATA_DIR = BASE_DIR / "app" / "data"
SAMPLE_FRAMES_DIR = DATA_DIR / "sample_satellite_frames"

# Ensure directories exist
WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)
SAMPLE_FRAMES_DIR.mkdir(parents=True, exist_ok=True)

# App Settings
APP_TITLE = "Tropical Cyclone AI/ML Detection & Decision Support System (SIH)"
APP_VERSION = "1.0.0-MVP"
API_V1_STR = "/api/v1"
CORS_ORIGINS = ["*"]

YOLO_INPUT_SIZE = 640
DEFAULT_CONFIDENCE_THRESHOLD = 0.10
