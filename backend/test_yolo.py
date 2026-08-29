from ultralytics import YOLO
model = YOLO("weights/cyclone_yolo11s_best.pt")
res = model("app/data/sample_satellite_frames/sample_cyclone_positive_2.png", conf=0.01)
for r in res:
    print("Boxes:", r.boxes.xyxy)
    print("Conf:", r.boxes.conf)
