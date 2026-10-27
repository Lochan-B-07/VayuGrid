"""
Synthetic Test Image Generator for VayuGrid AI Multimodal Evaluation
Generates synthetic benchmark test images for:
- Open plastic burning
- Construction demolition dust
- Clean paved road (negative control / anti-spoofing)
- Indoor room (spoofing rejection control)
- Industrial stack emission
- Biomass stubble burning
"""

import os
from PIL import Image, ImageDraw, ImageFilter


def create_test_images(output_dir: str = None, force_regenerate: bool = False):
    """Returns visual test fixtures, generating synthetics only if files are missing."""
    if output_dir is None:
        output_dir = os.path.join(os.path.dirname(__file__), "test_images")
    os.makedirs(output_dir, exist_ok=True)

    expected_files = {
        "plastic_burning": os.path.join(output_dir, "plastic_burning.jpg"),
        "construction_dust": os.path.join(output_dir, "construction_dust.jpg"),
        "clean_road": os.path.join(output_dir, "clean_road.jpg"),
        "indoor_room": os.path.join(output_dir, "indoor_room.jpg"),
        "industrial_stack": os.path.join(output_dir, "industrial_stack.jpg"),
        "stubble_burning": os.path.join(output_dir, "stubble_burning.jpg"),
    }

    if not force_regenerate and all(os.path.exists(p) and os.path.getsize(p) > 0 for p in expected_files.values()):
        return expected_files

    # 1. Plastic Burning (Open Municipal Waste Burning)
    # Dark acrid smoke, fiery orange embers, grey/black debris
    img_waste = Image.new("RGB", (640, 480), color=(50, 50, 50))
    draw = ImageDraw.Draw(img_waste)
    # Ground pile
    draw.polygon([(0, 320), (640, 300), (640, 480), (0, 480)], fill=(35, 30, 25))
    # Garbage debris
    for i in range(20, 620, 30):
        draw.rectangle([i, 350 + (i % 40), i + 25, 420], fill=((i * 3) % 200, 50, 40))
    # Flames
    for i in range(150, 450, 40):
        draw.polygon([(i, 350), (i + 20, 260 - (i % 30)), (i + 40, 350)], fill=(255, 120 + (i % 80), 10))
    # Dense black and grey smoke plume billowing up
    for i in range(100, 500, 50):
        draw.ellipse([i - 30, 80 + (i % 60), i + 120, 280], fill=(20, 20, 22))
    img_waste = img_waste.filter(ImageFilter.GaussianBlur(radius=3))
    waste_path = os.path.join(output_dir, "plastic_burning.jpg")
    img_waste.save(waste_path, "JPEG", quality=90)

    # 2. Construction Site Dust
    # Pale beige/tan mineral particulate cloud, building silhouette, earth
    img_const = Image.new("RGB", (640, 480), color=(180, 200, 220))
    draw = ImageDraw.Draw(img_const)
    # Concrete structure outline
    draw.rectangle([80, 150, 280, 420], fill=(130, 130, 130))
    for r in range(180, 400, 40):
        for c in range(100, 260, 40):
            draw.rectangle([c, r, c + 25, r + 25], fill=(70, 70, 75))
    # Excavation ground
    draw.rectangle([0, 380, 640, 480], fill=(160, 130, 95))
    # Dust cloud
    for i in range(200, 580, 60):
        draw.ellipse([i - 50, 180 + (i % 50), i + 150, 390], fill=(210, 190, 155))
    img_const = img_const.filter(ImageFilter.GaussianBlur(radius=4))
    const_path = os.path.join(output_dir, "construction_dust.jpg")
    img_const.save(const_path, "JPEG", quality=90)

    # 3. Clean Road (Anti-Spoofing Negative Control - Clear Sky & Paved Highway)
    img_clean = Image.new("RGB", (640, 480), color=(100, 180, 255))
    draw = ImageDraw.Draw(img_clean)
    # Green trees / landscape
    draw.rectangle([0, 240, 640, 320], fill=(40, 140, 40))
    # Clean blacktop asphalt highway
    draw.polygon([(260, 320), (380, 320), (600, 480), (40, 480)], fill=(45, 45, 50))
    # White road lane markings
    draw.polygon([(315, 320), (325, 320), (325, 480), (315, 480)], fill=(255, 255, 255))
    clean_path = os.path.join(output_dir, "clean_road.jpg")
    img_clean.save(clean_path, "JPEG", quality=90)

    # 4. Indoor Room (Anti-Spoofing Spoof Rejection Control)
    img_indoor = Image.new("RGB", (640, 480), color=(240, 235, 225))
    draw = ImageDraw.Draw(img_indoor)
    # Wooden flooring
    draw.rectangle([0, 340, 640, 480], fill=(160, 100, 60))
    # Indoor sofa
    draw.rectangle([150, 250, 490, 370], fill=(80, 100, 140))
    draw.rectangle([180, 220, 460, 260], fill=(70, 90, 130))
    indoor_path = os.path.join(output_dir, "indoor_room.jpg")
    img_indoor.save(indoor_path, "JPEG", quality=90)

    # 5. Industrial Stack Emission
    img_ind = Image.new("RGB", (640, 480), color=(160, 180, 200))
    draw = ImageDraw.Draw(img_ind)
    # Industrial roof line
    draw.rectangle([0, 360, 640, 480], fill=(60, 65, 75))
    # Chimney stack
    draw.polygon([(300, 180), (340, 180), (350, 380), (290, 380)], fill=(120, 50, 40))
    # Dark chemical plume rising from stack
    for i in range(250, 60, -30):
        draw.ellipse([300 - (250 - i), i - 20, 400 + (250 - i) * 2, i + 60], fill=(30, 30, 35))
    img_ind = img_ind.filter(ImageFilter.GaussianBlur(radius=3))
    ind_path = os.path.join(output_dir, "industrial_stack.jpg")
    img_ind.save(ind_path, "JPEG", quality=90)

    # 6. Biomass Stubble Burning
    img_stubble = Image.new("RGB", (640, 480), color=(180, 190, 200))
    draw = ImageDraw.Draw(img_stubble)
    # Farmland field
    draw.rectangle([0, 260, 640, 480], fill=(140, 110, 50))
    # Low-lying flame line
    draw.line([(50, 340), (590, 320)], fill=(255, 140, 0), width=6)
    # Wide white/pale grey aerosol sheet drifting horizontally
    for i in range(50, 600, 40):
        draw.ellipse([i - 30, 180 + (i % 30), i + 100, 310], fill=(225, 230, 235))
    img_stubble = img_stubble.filter(ImageFilter.GaussianBlur(radius=4))
    stubble_path = os.path.join(output_dir, "stubble_burning.jpg")
    img_stubble.save(stubble_path, "JPEG", quality=90)

    return {
        "plastic_burning": waste_path,
        "construction_dust": const_path,
        "clean_road": clean_path,
        "indoor_room": indoor_path,
        "industrial_stack": ind_path,
        "stubble_burning": stubble_path
    }


if __name__ == "__main__":
    paths = create_test_images()
    print("Created synthetic test images:")
    for k, v in paths.items():
        print(f" - {k}: {v}")
