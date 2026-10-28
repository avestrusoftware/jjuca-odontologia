"""Optimize the selected free stock photographs without generative edits."""
import json
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
items = json.loads((root / 'docs' / 'marquee-assets.json').read_text(encoding='utf-8'))
target = root / 'dist' / 'assets' / 'especialidades'
target.mkdir(parents=True, exist_ok=True)
total = 0
for item in items:
    source = root / 'output' / 'stock' / f"{item['id']}.jpg"
    position = tuple(float(value.rstrip('%')) / 100 for value in item['position'].split())
    image = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    image = ImageOps.fit(image, (960, 720), Image.Resampling.LANCZOS, centering=position)
    path = target / f"{item['id']}.webp"
    image.save(path, 'WEBP', quality=88, method=6)
    total += path.stat().st_size
    print(f"{path.name}: {path.stat().st_size} bytes")
print(f'Total: {total} bytes')
