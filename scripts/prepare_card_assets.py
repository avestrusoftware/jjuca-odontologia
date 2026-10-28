from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
generated = Path('C:/Users/Rafael/.codex/generated_images/01a17e54-9e22-7250-8602-89765b44f3e7')
output = root / 'dist' / 'assets'
assets = [
    ('exec-f2ed8ed9-26c3-4680-a6b9-23b6a84822d4.png', 'ipanema-postal-v1.webp', (1000, 1000)),
    ('exec-d85f1852-4f9e-466a-8a4d-4c42a7db883e.png', 'scanner-digital-v1.webp', (1000, 1000)),
    ('exec-3ef0b8cc-812a-49f7-9f34-9f031219531e.png', 'dente-natural-v1.webp', (640, 960)),
    ('exec-756c4abc-87b4-42ee-9955-26b80b169fa9.png', 'dente-scanner-v2.webp', (640, 960)),
    ('exec-1c36f056-dbf2-4324-85bc-f5a27535aa49.png', 'dente-scanner-laranja-v1.webp', (256, 384)),
]
for original, name, size in assets:
    if (output / name).exists():
        continue
    image = Image.open(generated / original)
    image.thumbnail(size, Image.Resampling.LANCZOS)
    image.save(output / name, 'WEBP', quality=90, method=6)
    print(f'{name}: {image.size}, {image.mode}, {(output / name).stat().st_size} bytes')
