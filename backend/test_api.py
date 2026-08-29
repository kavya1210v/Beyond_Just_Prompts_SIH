"""
Automated Backend & Inference Unit Tests
Tests FastAPI endpoints and YOLO11 detection outputs.
"""

import io
from PIL import Image
from app.services.yolo_service import yolo_service
from app.services.ibtracs_service import ibtracs_service
from app.services.advisory_service import advisory_service


def test_yolo_detection_positive():
    # Create test image with bright central core (simulating cyclone positive)
    img = Image.new("RGB", (640, 640), color=(10, 20, 40))
    # Add high variance cloud cluster
    for x in range(250, 420):
        for y in range(220, 390):
            img.putpixel((x, y), (240, 240, 255))
    
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    img_bytes = buf.getvalue()

    res = yolo_service.run_inference(img_bytes, confidence_threshold=0.5, filename="test_positive.png")
    
    assert res.cyclone_detected is True, "Expected cyclone detected to be True"
    assert len(res.detections) >= 1, "Expected at least 1 detection"
    det = res.detections[0]
    assert det.class_name == "cyclone"
    assert det.confidence >= 0.5
    assert det.bbox_pixel.x1 < det.bbox_pixel.x2
    assert det.bbox_pixel.y1 < det.bbox_pixel.y2
    print("[PASS] YOLO Positive Detection Test passed! Confidence:", det.confidence, "BBox:", det.bbox_pixel)


def test_yolo_detection_negative():
    # Clear ocean frame
    img = Image.new("RGB", (640, 640), color=(15, 30, 60))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    img_bytes = buf.getvalue()

    res = yolo_service.run_inference(img_bytes, confidence_threshold=0.5, filename="sample_clear_negative.png")
    
    assert res.cyclone_detected is False, "Expected cyclone detected to be False"
    assert len(res.detections) == 0, "Expected 0 detections for clear negative frame"
    print("[PASS] YOLO Negative Detection Test passed! No false positives detected.")


def test_ibtracs_ground_truth_decoupling():
    meta = ibtracs_service.get_current_cyclone_metadata("remal_bob")
    assert meta.is_simulation is True
    assert meta.georeference.center_lat == 18.6
    assert meta.georeference.center_lon == 87.8
    assert len(meta.historical_track) == 4
    print("[PASS] IBTrACS Ground Truth Test passed! Center:", meta.georeference)


def test_advisory_generation():
    adv = advisory_service.generate_advisory("remal_bob")
    assert adv.is_simulation is True
    assert adv.alert_level == "RED"
    assert len(adv.stakeholder_actions.ndrf_sdma) > 0
    assert len(adv.stakeholder_actions.marine_fisheries) > 0
    print("[PASS] Advisory Generation Test passed! Alert:", adv.alert_level)


if __name__ == "__main__":
    print("Running Cyclone AI/ML Backend Test Suite...")
    test_yolo_detection_positive()
    test_yolo_detection_negative()
    test_ibtracs_ground_truth_decoupling()
    test_advisory_generation()
    print("ALL TESTS PASSED SUCCESSFULLY!")
