from pathlib import Path
from PIL import Image
from urllib.request import urlopen, Request
from concurrent.futures import ThreadPoolExecutor

root = Path(__file__).resolve().parents[1]
dest = root / 'dist' / 'assets'
dest.mkdir(parents=True, exist_ok=True)
temp = Path('C:/Users/Rafael/AppData/Local/Temp')
photos = {
 'recepcao': 'codex-clipboard-a9ab63af-0dc3-417e-b4b4-aea8572fdfe8.png',
 'consultorio': 'codex-clipboard-09c9f832-547f-4d7f-8962-ad67e8733b48.png',
 'dr-juca-social': 'codex-clipboard-a35e0282-b311-46ff-887b-8148d738a7e3.png',
 'placa-24h': 'codex-clipboard-df2915ee-b66d-42a9-913a-af1beb511247.png',
 'entrada': 'codex-clipboard-28032397-9f07-49e5-8857-69c72691ea7f.png',
}
for name, source in photos.items():
 im = Image.open(temp / source).convert('RGB')
 im.save(dest / (name + '.webp'), 'WEBP', quality=90)

official = {
 'clinica-wide.jpg': 'https://j-juca-odontologia.com.br/wp-content/uploads/2019/07/cropped-ALFA_0047-3.jpg',
 'clinica-ipanema.jpg': 'https://j-juca-odontologia.com.br/wp-content/uploads/2019/07/WhatsApp-Image-2021-02-08-at-18.57.21.jpeg',
 'dr-juca.jpg': 'https://j-juca-odontologia.com.br/wp-content/uploads/2019/07/WhatsApp-Image-2020-12-21-at-13.29.30-1-1.jpeg',
 'logo-original.png': 'https://j-juca-odontologia.com.br/wp-content/uploads/2019/07/logo-jjuca-preta.png',
}
def download(item):
 name, url = item
 request = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
 with urlopen(request, timeout=35) as response:
  (dest / name).write_bytes(response.read())
 im = Image.open(dest / name)
 print(name, im.size)
 if name.endswith('.jpg'):
  im.thumbnail((2200, 1800))
  im.convert('RGB').save(dest / name.replace('.jpg', '.webp'), 'WEBP', quality=88)
for item in ThreadPoolExecutor(4).map(download, official.items()):
 pass
