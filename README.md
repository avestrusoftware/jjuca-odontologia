# J.Jucá Odontologia

Landing page estática, responsiva, com GSAP e ScrollTrigger servidos localmente. A sequência editorial acompanha as quatro referências fornecidas. HTML sem dependência de framework; Google Fonts com fallback sans-serif.

## Rodar

`npm install` e `npm run dev`. A página abre em http://127.0.0.1:4173. `npm run check` verifica recursos, âncoras, IDs, sintaxe e manifesto.

O conteúdo publicado está em `dist/`. Não há build. Para uma instalação nova, os arquivos de GSAP já estão incluídos em `dist/vendor/`, com os avisos de licença preservados. `scripts/prepare_assets.py` documenta as imagens de origem; não é necessário executá-lo para servir ou publicar.

## Conteúdo e fontes

- Estrutura e identidade: briefing e nove imagens fornecidos pelo cliente. Paleta e movimento em `MASTER.md`.
- Perfil público: https://www.instagram.com/j.juca.odontologia/ — 30+ anos, urgências 24h, destaques Casos, Tecnologias, Odontopediatria, Sobre nós e Ipanema. O conteúdo interno de stories depende do acesso disponibilizado pelo Instagram.
- https://linktr.ee/jucaodontologia — unidades e canal de contato. A sobreloja do Largo do Machado segue a informação do Linktree (201); o site anterior mostra 208. Não foi substituída pela informação antiga.
- https://j-juca-odontologia.com.br/ — especialidades, formação do Dr. Juarez, sedação com anestesista e telefone de urgências (21) 99750-7770.
- O contato de agendamento do Linktree foi seguido até a página oficial do WhatsApp, que exibiu o perfil J.Jucá e o número +55 21 99850-2305. Os CTAs apontam diretamente para esse número com uma mensagem de interesse no site; nada é enviado automaticamente.
- Scanner intraoral: informação fornecida pelo cliente. O card usa uma cena ilustrativa de software de escaneamento e um dente branco 3D estilizado com malha de scanner, em camadas separadas; não representa um equipamento específico nem uma foto documental da equipe. Cena tecnológica e dente foram criados com a ferramenta integrada ImageGen. O card central usa a foto real da placa laranja de Odontologia 24h fornecida pelo cliente, com os textos na parte inferior. A paisagem de Ipanema anterior permanece arquivada, sem uso na página. Arquivos, origem e prompts em `docs/card-assets.md`.
- Foto do Dr. Juarez sem sobreposição de texto: `cropped-ALFA_0047-3.jpg`, do site oficial, otimizada como `clinica-wide.webp`.
- Hero, sofá, entrada e placa 24h: fotos anexadas pelo cliente, otimizadas em WebP.
- A foto da seção “O cuidado começa antes de você sentar na cadeira” foi restaurada com ImageGen. Usa `entrada-restaurada-v2-*.webp`, com versões responsivas e exportação máxima de 2970 × 3840 por upscale. O enquadramento preserva o letreiro superior. Origem, dimensões nativas e prompt em `docs/entrance-restoration-v2.md`.

## Interações

O marquee de especialidades aparece antes da faixa fotográfica da entrada, com os 12 serviços da referência do cliente. A introdução usa a mesma tipografia da seção “Odontologia que evolui”, com título em duas cores e um parágrafo curto. A faixa curva 3D adapta o componente TiltedGridHero anexado para o HTML/CSS/JavaScript existente, sem novas dependências. Inclui arraste direto das fotos nos dois sentidos, navegação por teclado, pausa somente sobre as imagens, suspensão fora da tela e galeria horizontal manual com movimento reduzido. Os botões de pausa e de navegação foram removidos. Créditos e licenças das fotos gratuitas em `docs/marquee-specialties.md`; imagens locais em `dist/assets/especialidades/`.

O detalhe decorativo da hero usa um dentinho 3D laranja com malha de scanner. A variante foi editada com ImageGen e usa alpha; arquivo e prompt em `docs/orange-tooth-v1.md`. O separador com dente do rodapé foi removido. A seção “Mais do que tratar” foi removida para reduzir o conteúdo. Seu item saiu também do menu móvel, e o card de scanner agora abre a pergunta correspondente no FAQ. O botão da faixa fotográfica mantém uma borda verde no hover e no foco por teclado.

A hero usa agora o logo manuscrito branco anexado pelo cliente, convertido em WebP lossless com transparência preservada. A versão anterior com brilho deixou de ser usada. A imagem substitui a assinatura em texto e continua aparecendo somente após iniciar a rolagem. Detalhes em `docs/hero-neon-sign-v1.md`. O mesmo logo branco aparece no rodapé. A inclinação do arquivo foi compensada em CSS em ambos os locais; na hero ele fica no canto inferior direito. O uso anterior da fonte Corinthia está documentado em `docs/brand-signature-v1.md`. O card “No coração do Rio” da hero permanece removido.

Menu móvel, navegação por âncoras, FAQ com HTML nativo, detalhes de serviços em dialog acessível, links para mapas e WhatsApp, contagem de experiência e revelações por scroll. As animações respeitam `prefers-reduced-motion`. Os diálogos devolvem o foco ao botão de origem.

`dist/motion.js` concentra as sequências de ScrollTrigger e SplitText: títulos linha a linha, parágrafos, botões, cards e fotos. As entradas revertem quando a seção volta abaixo do gatilho. Fotos usam parallax discreto apenas no desktop; a varredura do scanner acompanha a rolagem. SplitText recalcula as linhas ao mudar a largura, sem alterar o nome acessível do título. Focar um botão pelo teclado conclui sua entrada.

A hero abre apenas com a fotografia, sem fade de imagem e sem texto. Os primeiros 2 px de rolagem iniciam a entrada dos textos e do contraste. Uma breve fixação conserva a foto em cena durante a leitura. Retornar ao topo restaura a abertura apenas fotográfica. Sem animações, a mesma troca de estado funciona por scroll nativo. A fotografia horizontal oficial foi restaurada com ImageGen e exportada em versões responsivas de até 3840 × 2160 (`hero-clinica-v2-3840.webp`). A saída nativa restaurada tem 1672 × 941, reamostrada para a entrega 4K. Em celulares permanece `consultorio.webp`, fornecida pelo cliente. Prompt e detalhes em `docs/hero-restoration-v2.md`.

No ambiente local, `http://127.0.0.1:4173/?motion=full` permite revisar as animações mesmo quando o sistema usa redução de movimento. A exceção só funciona em `localhost` ou `127.0.0.1`, exige esse parâmetro explícito e não modifica as configurações do sistema. Sem o parâmetro, a preferência de acessibilidade é respeitada.

O formulário não coleta dados pessoais; agendamentos são tratados pela equipe no WhatsApp. Sem analytics, cookies próprios ou credenciais no código do site.
