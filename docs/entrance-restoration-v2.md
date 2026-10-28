# Foto da seção “O cuidado começa antes de você sentar na cadeira”

Edição feita com a ferramenta integrada ImageGen. Origem: fotografia real anexada pelo cliente, `codex-clipboard-28032397-9f07-49e5-8857-69c72691ea7f.png` (492 × 636). A versão anterior `dist/assets/entrada.webp` permanece preservada.

A restauração aprimora definição, ruído, iluminação e cores, mantendo a entrada, o letreiro e a composição vertical. A saída nativa de ImageGen tem 1103 × 1426 pixels. A entrega com 3840 pixels de altura foi reamostrada por Lanczos, sem corte, para 2970 × 3840; não é geração ou captura nativa em 4K. Pequenos detalhes podem ser reconstruídos pela restauração generativa.

## Arquivos

- `dist/assets/entrada-restaurada-v2-2970.webp`: 2970 × 3840, exportação de maior resolução.
- `dist/assets/entrada-restaurada-v2-1536.webp`: 1536 × 1986, versão responsiva.
- `dist/assets/entrada-restaurada-v2-960.webp`: 960 × 1241, versão responsiva.
- `output/imagegen/entrada-restaurada-v2.png`: mestre gerado preservado.
- `scripts/prepare_entrance_asset.py`: exportação e otimização WebP, sem edições criativas adicionais.

A página escolhe a imagem pela largura e densidade da tela, usa carregamento sob demanda e mantém as animações existentes de entrada e parallax. O enquadramento prioriza a parte superior para preservar o letreiro.

## Prompt final

```text
Use case: lighting-weather.
Asset type: high quality architectural photograph for the section "O cuidado começa antes de você sentar na cadeira" of J.Jucá Odontologia's website.
Input image 1: EDIT TARGET, the actual clinic entrance photograph. This is a faithful restoration and upscale of this specific photograph.
Primary request: restore the image into a beautifully crisp, cinematic yet natural architectural photograph. Preserve the original portrait aspect ratio and full framing. Recover fine detail and clean edges, improve dynamic range and soft natural lighting, reduce compression and noise.
Lighting and color: inviting warm light, refined soft sage-green walls, warm wood and neutral cream interior, luminous white neon script with controlled highlights. Premium welcoming feel consistent with a quiet dental clinic. Realistic color and restrained contrast.
Critical invariants: preserve the exact perspective, doorway positions and widths, black metal frames, two glass doors, frosted diagonal glass design, wood beam, white neon sign, heart-shaped hanging ornament, reception sofa and wooden chairs, floor and ceiling. Do not add or remove objects. Keep the neon lettering exactly as visible in the original, "Jucá Odontologia", in the same handwritten script, placement and proportions. Keep the existing small glass logo. Do not change the spelling, invent letters, add people, plants or decorations. Do not redesign the clinic, alter furniture or expand the room.
Composition: the same complete portrait photo, maximum available resolution, retain the entire illuminated sign and the room below, no crop, no new border. No overlay text or watermark.
```
