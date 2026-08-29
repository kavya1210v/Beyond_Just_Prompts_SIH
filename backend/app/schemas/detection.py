"""
Tier 1 - IMPLEMENTED
Strict YOLO11 Detection Data Schemas
Outputs strictly reflect object detection coordinates and confidence scores.
Geographic coordinates (lat/lon) or intensity predictions are NOT included here.
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class BoundingBoxPixel(BaseModel):
    x1: float = Field(..., description="Top-left X coordinate in pixels (0..640)")
    y1: float = Field(..., description="Top-left Y coordinate in pixels (0..640)")
    x2: float = Field(..., description="Bottom-right X coordinate in pixels (0..640)")
    y2: float = Field(..., description="Bottom-right Y coordinate in pixels (0..640)")


class BoundingBoxNormalized(BaseModel):
    x_center: float = Field(..., description="Normalized center X (0.0..1.0)")
    y_center: float = Field(..., description="Normalized center Y (0.0..1.0)")
    width: float = Field(..., description="Normalized width (0.0..1.0)")
    height: float = Field(..., description="Normalized height (0.0..1.0)")


class DetectionObject(BaseModel):
    class_id: int = Field(0, description="Detection class index (0 for cyclone)")
    class_name: str = Field("cyclone", description="Detection class name")
    confidence: float = Field(..., description="Confidence score from YOLO model (0.0..1.0)")
    bbox_pixel: BoundingBoxPixel
    bbox_normalized: BoundingBoxNormalized


class ModelMeta(BaseModel):
    engine: str = Field("YOLO11", description="Model architecture")
    weights_version: str = Field("yolo11_cyclone_v1.0", description="Model checkpoint or simulation tag")
    latency_ms: float = Field(..., description="Inference runtime latency in milliseconds")
    tier_status: str = Field("TIER 1 - IMPLEMENTED", description="System tier classification")


class YOLODetectionResponse(BaseModel):
    inference_timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO 8601 UTC timestamp of inference"
    )
    image_name: Optional[str] = Field(None, description="Original filename or sample ID")
    image_dimensions: dict = Field(default_factory=lambda: {"width": 640, "height": 640})
    cyclone_detected: bool = Field(..., description="True if at least one cyclone bbox meets threshold")
    detection_count: int = Field(..., description="Number of detected cyclone instances")
    detections: List[DetectionObject] = Field(default_factory=list)
    model_meta: ModelMeta
