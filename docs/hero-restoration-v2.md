# Hero restaurada e card de Odontologia 24h

Modo: edição pela ferramenta integrada ImageGen. Fotografia original da unidade de Ipanema, obtida no site oficial e preservada em `dist/assets/clinica-ipanema.jpg` (1280 × 853).

A restauração gerou um arquivo de 1672 × 941 pixels. A entrega 4K foi exportada em 3840 × 2160 por reamostragem Lanczos; não é uma captura ou geração nativa em 4K. A nitidez e a iluminação foram aprimoradas com ImageGen antes da exportação. O enquadramento recebe apenas o ajuste mínimo necessário para 16:9. Mantém-se o cenário da clínica, com pequenas reconstruções de detalhes próprias da restauração generativa.

## Arquivos finais

- `dist/assets/hero-clinica-v2-3840.webp`: 3840 × 2160, arquivo 4K.
- `dist/assets/hero-clinica-v2-1920.webp`: 1920 × 1080, versão responsiva.
- `dist/assets/hero-clinica-v2-1280.webp`: 1280 × 720, versão responsiva.
- `output/imagegen/hero-clinica-restaurada-v2.png`: mestre nativo gerado, preservado.
- `dist/assets/clinica-placa-24h-v1.webp`: foto real anexada pelo cliente, 446 × 579, convertida em WebP sem edição generativa.

O navegador seleciona a versão da hero conforme a largura e a densidade de pixels da tela. Em celulares permanece a fotografia vertical `consultorio.webp`. O primeiro quadro continua sem textos ou contraste verde; os textos aparecem após iniciar o scroll.

O card central usa a foto real da placa 24h no lugar da paisagem de Ipanema. O enquadramento superior preserva o letreiro laranja, sem zoom ou parallax que o recorte. Título, horário, descrição e localização ficam na parte inferior, sobre um gradiente escuro. O card continua com sua animação de entrada por scroll.

## Prompt final

```text
Use case: lighting-weather.
Asset type: photographic website hero for J.Jucá Odontologia.
Input image 1: EDIT TARGET, the real clinic frontage, preserve its identity and geometry.
Primary request: carefully restore and upscale this exact photograph into a beautiful, crisp 4K architectural photograph, output 3840 x 2160 pixels, landscape 16:9. Keep the same frontal viewpoint and the same clinic, using a minimal vertical crop rather than changing the scene.
Lighting/mood: elegant cinematic architectural photography, inviting and warm, naturally luminous cream interiors, subtle warm amber light and deep muted green accent wall, excellent highlight detail and rich shadow detail, balanced glass reflections. Polished and welcoming, realistic rather than fantasy.
Materials/textures: restore clean fine detail on the white frames, glass, wood flooring, woven chairs, patterned armchair and mosaic walkway, with controlled sharpening and no halos.
Invariants: retain exactly the positions and shapes of the glass facade, door and number 202, frosted glass stripes, back doors, chairs, dark green wall, desk, ceiling and all architectural features. Preserve natural perspective and the recognizable actual space. Keep existing signage as in the original, do not invent lettering. Do not add furniture, decor, plants, equipment or people. Do not redesign or enlarge any room. No text overlay or watermark. The output should be this same photograph enhanced in quality, not a different clinic.
```
