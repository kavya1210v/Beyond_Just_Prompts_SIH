"""
Tier 1 - IMPLEMENTED API
YOLO11 Object Detection Router
"""

import os
from pathlib import Path
from typing import Optional, List
from fastapi import APIRouter, File, UploadFile, Query, HTTPException, Response
from fastapi.responses import FileResponse

from app.config import SAMPLE_FRAMES_DIR, DEFAULT_CONFIDENCE_THRESHOLD
from app.schemas.detection import YOLODetectionResponse
from app.services.yolo_service import yolo_service

router = APIRouter(prefix="/detect", tags=["Tier 1 - YOLO11 Detection"])


@router.post("", response_model=YOLODetectionResponse, summary="Run YOLO11 Cyclone Detection on 640x640 Image")
async def run_yolo_detection(
    file: UploadFile = File(..., description="Satellite image frame (JPG/PNG)"),
    confidence_threshold: float = Query(
        DEFAULT_CONFIDENCE_THRESHOLD, ge=0.05, le=0.99, description="Minimum confidence cutoff"
    ),
):
    """
    Tier 1 Operational Endpoint:
    Accepts a satellite image frame, preprocesses to 640x640, and returns:
    - cyclone_detected (bool)
    - bounding box coordinates [x1, y1, x2, y2] in pixels and normalized form
    - confidence score
    
    Geographic coordinates and intensity are decoupled and NOT returned here.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image (JPEG/PNG/WebP).")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    result = yolo_service.run_inference(
        image_bytes=contents,
        confidence_threshold=confidence_threshold,
        filename=file.filename,
    )
    return result


@router.get("/samples", summary="List bundled sample satellite frames")
def list_sample_frames():
    """
    Returns available cyclone-positive and cyclone-negative test frames.
    """
    frames = []
    if SAMPLE_FRAMES_DIR.exists():
        for p in sorted(SAMPLE_FRAMES_DIR.glob("*.png")):
            is_pos = "positive" in p.name.lower()
            frames.append({
                "id": p.stem,
                "filename": p.name,
                "label": "Cyclone Positive Frame (Spiral Vortex)" if is_pos else "Cyclone Negative Frame (No Vortex)",
                "state": "cyclone-positive" if is_pos else "cyclone-negative",
                "dimensions": "640x640",
                "preview_url": f"/api/v1/detect/samples/{p.name}"
            })
    return {"samples": frames}


@router.get("/samples/{filename}", summary="Download sample satellite frame")
def get_sample_image(filename: str):
    file_path = SAMPLE_FRAMES_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Sample frame not found.")
    return FileResponse(file_path, media_type="image/png")
