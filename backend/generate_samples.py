"""
Script to generate realistic synthetic 640x640 satellite test frames
(Cyclone Positive and Cyclone Negative cases)
"""

import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent / "app" / "data" / "sample_satellite_frames"
DATA_DIR.mkdir(parents=True, exist_ok=True)


def generate_cyclone_positive_frame(filename: str, center_x=320, center_y=300, intensity=1.0, seed=42):
    np.random.seed(seed)
    # Background ocean (dark deep blue/black)
    base = np.zeros((640, 640, 3), dtype=np.uint8)
    base[:, :, 0] = 12   # R
    base[:, :, 1] = 24   # G
    base[:, :, 2] = 48   # B

    # Add ocean texture
    noise = np.random.normal(0, 4, (640, 640, 3))
    base = np.clip(base + noise, 0, 255).astype(np.uint8)
    img = Image.fromarray(base)
    draw = ImageDraw.Draw(img)

    # Draw spiral cloud arms (logarithmic spiral pattern)
    num_arms = 4
    for arm in range(num_arms):
        arm_offset = arm * (2 * math.pi / num_arms)
        points = []
        for theta_deg in range(0, 720, 2):
            theta = math.radians(theta_deg)
            r = 15.0 * math.exp(0.24 * theta)
            if r > 300:
                break
            x = center_x + r * math.cos(theta + arm_offset)
            y = center_y + r * math.sin(theta + arm_offset)
            points.append((x, y))
            
            # Draw convective cloud puffs along spiral
            puff_rad = int(8 + (r / 18.0) + np.random.randint(-2, 4))
            brightness = int(min(255, 180 + (250 - r) * 0.3 + np.random.randint(-15, 15)))
            # Color: cold cloud tops (white with slight cyan/infrared tint)
            color = (brightness, brightness, min(255, brightness + 10))
            draw.ellipse([x - puff_rad, y - puff_rad, x + puff_rad, y + puff_rad], fill=color)

    # Draw dense central overcast / eyewall
    for r in range(120, 10, -5):
        brightness = int(240 - r * 0.4)
        draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r], fill=(brightness, brightness, 255))

    # Draw eye (darker center for intense cyclones)
    eye_radius = int(14 * intensity)
    draw.ellipse([center_x - eye_radius, center_y - eye_radius, center_x + eye_radius, center_y + eye_radius], fill=(25, 40, 65))

    # Soften with realistic atmospheric Gaussian blur
    img = img.filter(ImageFilter.GaussianBlur(radius=3.5))

    # Add realistic satellite telemetry watermark
    draw = ImageDraw.Draw(img)
    draw.rectangle([10, 10, 280, 42], fill=(0, 0, 0, 180))
    draw.text((16, 16), "INSAT-3D / 3DR SATELLITE (SIMULATED)", fill=(100, 220, 255))
    draw.text((16, 28), "640x640 ENHANCED INFRARED (TIR-1)", fill=(180, 180, 180))

    out_path = DATA_DIR / filename
    img.save(out_path, "PNG")
    print(f"Generated positive sample: {out_path}")


def generate_cyclone_negative_frame(filename: str, mode="clear", seed=101):
    np.random.seed(seed)
    # Ocean background
    base = np.zeros((640, 640, 3), dtype=np.uint8)
    base[:, :, 0] = 15
    base[:, :, 1] = 30
    base[:, :, 2] = 55

    img = Image.fromarray(base)
    draw = ImageDraw.Draw(img)

    if mode == "clear":
        # Scattered fair-weather cumulus puffs (random non-spiral)
        for _ in range(80):
            rx = np.random.randint(20, 620)
            ry = np.random.randint(20, 620)
            w = np.random.randint(6, 25)
            h = np.random.randint(4, 15)
            b = np.random.randint(140, 200)
            draw.ellipse([rx - w, ry - h, rx + w, ry + h], fill=(b, b, b))
    else:
        # Linear monsoon cloud band (non-rotating)
        for x in range(0, 640, 15):
            y_base = int(240 + 60 * math.sin(x / 100.0) + np.random.randint(-20, 20))
            for _ in range(12):
                puff_x = x + np.random.randint(-15, 15)
                puff_y = y_base + np.random.randint(-35, 35)
                rad = np.random.randint(15, 35)
                b = np.random.randint(160, 230)
                draw.ellipse([puff_x - rad, puff_y - rad, puff_x + rad, puff_y + rad], fill=(b, b, min(255, b + 15)))

    img = img.filter(ImageFilter.GaussianBlur(radius=4.0))

    draw = ImageDraw.Draw(img)
    draw.rectangle([10, 10, 280, 42], fill=(0, 0, 0, 180))
    draw.text((16, 16), "INSAT-3D / 3DR SATELLITE (SIMULATED)", fill=(100, 220, 255))
    draw.text((16, 28), "640x640 [STATE: CYCLONE-NEGATIVE]", fill=(240, 180, 80))

    out_path = DATA_DIR / filename
    img.save(out_path, "PNG")
    print(f"Generated negative sample: {out_path}")


if __name__ == "__main__":
    generate_cyclone_positive_frame("sample_cyclone_positive_1.png", center_x=340, center_y=310, intensity=1.2, seed=42)
    generate_cyclone_positive_frame("sample_cyclone_positive_2.png", center_x=310, center_y=280, intensity=1.5, seed=88)
    generate_cyclone_negative_frame("sample_cyclone_negative_1.png", mode="clear", seed=202)
    generate_cyclone_negative_frame("sample_cyclone_negative_2.png", mode="linear", seed=303)
