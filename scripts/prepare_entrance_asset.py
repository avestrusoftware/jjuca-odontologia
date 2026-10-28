"""Export the ImageGen entrance restoration, preserving its portrait framing.

The 3840px delivery resamples the restored master; it is not native 4K capture.
"""
from pathlib import Path
from shutil import copy2
from PIL import Image

root = Path(__file__).resolve().parents[1]
generated = Path('C:/Users/Rafael/.codex/generated_images/01a17e54-9e22-7250-8602-89765b44f3e7/exec-3c31cfc6-9f97-4592-9753-3ffae16de4a0.png')
master = root / 'output' / 'imagegen' / 'entrada-restaurada-v2.png'
master.parent.mkdir(parents=True, exist_ok=True)
if not master.exists():
    copy2(generated, master)

image = Image.open(master).convert('RGB')
full_width = round(image.width * 3840 / image.height)
for width in [960, 1536, full_width]:
    height = 3840 if width == full_width else round(image.height * width / image.width)
    target = root / 'dist' / 'assets' / f'entrada-restaurada-v2-{width}.webp'
    if not target.exists():
        image.resize((width, height), Image.Resampling.LANCZOS).save(
            target, 'WEBP', quality=93, method=6
        )
    print(f'{target.name}: {width} x {height}, {target.stat().st_size} bytes')
