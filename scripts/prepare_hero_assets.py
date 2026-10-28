"""Export the ImageGen restoration as responsive WebP assets.

ImageGen restores the photo at its native output size. The 4K delivery is a
Lanczos resample of that restoration, not a claim of native 4K generation.
The original clinic photograph and generated master are kept unchanged.
"""
from pathlib import Path
from shutil import copy2
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
generated = Path('C:/Users/Rafael/.codex/generated_images/01a17e54-9e22-7250-8602-89765b44f3e7/exec-d7ab4206-283c-4193-bc5c-07aeac25307a.png')
master = root / 'output' / 'imagegen' / 'hero-clinica-restaurada-v2.png'
master.parent.mkdir(parents=True, exist_ok=True)
if not master.exists():
    copy2(generated, master)

image = Image.open(master).convert('RGB')
for width, height in [(1280, 720), (1920, 1080), (3840, 2160)]:
    target = root / 'dist' / 'assets' / f'hero-clinica-v2-{width}.webp'
    if not target.exists():
        ImageOps.fit(image, (width, height), method=Image.Resampling.LANCZOS).save(
            target, 'WEBP', quality=93, method=6
        )
    print(f'{target.name}: {width} x {height}, {target.stat().st_size} bytes')

sign = root / 'dist' / 'assets' / 'clinica-placa-24h-v1.webp'
if not sign.exists():
    Image.open('C:/Users/Rafael/AppData/Local/Temp/codex-clipboard-df581b41-c707-45fc-81ed-acec8740b343.png').convert('RGB').save(
        sign, 'WEBP', quality=94, method=6
    )
print(f'{sign.name}: {Image.open(sign).size}, {sign.stat().st_size} bytes')
