# Marquee de especialidades

Faixa curva 3D inserida imediatamente antes de “O cuidado começa antes de você sentar na cadeira”. Base visual e matemática: componente TiltedGridHero fornecido pelo cliente, adaptado para HTML, CSS e JavaScript do projeto. As instruções de instalação de React, shadcn, Tailwind e TypeScript no texto anexado foram tratadas como contexto do componente; o projeto continua com sua estrutura existente e sem novas dependências.

## Movimento e acesso

A curvatura foi suavizada de 78° para 38° a pedido do cliente, deixando a faixa mais reta e reduzindo a ampliação das fotos nas laterais.

Cada foto é dividida em 16 faixas sobre um cilindro. O transform do conjunto se move em CSS, e cada faixa tem uma janela de visibilidade sincronizada que a recorta logo após a borda mascarada. Isso impede que os fragmentos externos atravessem o plano da câmera e produzam flashes na entrada pela direita. As 12 imagens são decodificadas antes de iniciar o efeito e mantidas em memória. Uma única textura de fundo herdada por todas as faixas troca a fotografia de forma atômica quando o card está fora do enquadramento, sem atualizações assíncronas de 16 elementos img. A velocidade é de 4,6 segundos por card. ResizeObserver recalcula o raio, a perspectiva e a quantidade de cards conforme a largura disponível. As extremidades têm uma máscara de transparência.

A introdução usa a mesma classe `intro-copy` da seção “Odontologia que evolui”, preservando a tipografia, a escala responsiva, o destaque verde e a entrada por scroll. A chamada é “Um cuidado completo. Para cada sorriso.”, acompanhada por um parágrafo curto.

Os botões de pausa e de navegação foram removidos a pedido do cliente. Clicar e arrastar uma foto move a faixa diretamente nos dois sentidos, acompanhando a distância do ponteiro, sem saltos ao soltar. Pointer capture mantém o arraste mesmo se o ponteiro sair da foto. No toque, movimentos horizontais controlam a faixa e movimentos verticais preservam a rolagem da página. O cursor muda de grab para grabbing durante a interação. Redimensionamento, cancelamento de toque e perda de captura encerram o gesto sem deixar a faixa presa.

A pausa por mouse depende do hit testing dos fragmentos visíveis das próprias fotos em 3D. O título, o parágrafo e os espaços vazios acima e abaixo da faixa não pausam a animação. Ao soltar sobre uma foto, a faixa permanece pausada pelo hover; ao sair dela, o movimento automático retoma. Foco visível de teclado na galeria também pausa o movimento. As teclas ←/→ continuam navegando um card por vez em 560 ms, com desaceleração cúbica. A animação para fora da tela ou quando a aba fica inativa. Transformações e recorte dos fragmentos compartilham o mesmo relógio no arraste e no teclado, e a fotografia de cada tile segue sua iteração real, inclusive ao voltar por uma passagem de ciclo.

No modo explícito `?motion=reduced`, as 12 especialidades permanecem em uma galeria horizontal manual, com arraste por mouse, rolagem nativa por toque e navegação por teclado sem transição animada. A URL normal mantém a animação completa inclusive quando o sistema solicita movimento reduzido, conforme pedido do cliente. A configuração é compartilhada com o restante da página por `motion-settings.js` e funciona em qualquer domínio. A lista sem duplicações preserva os nomes para leitores de tela; as cópias visuais em 3D são decorativas. A galeria recebe foco, tem instruções acessíveis e anuncia a especialidade central após a navegação manual no modo 3D.

## Fotografias e créditos

As 12 imagens são fotografias ilustrativas de bancos gratuitos; não representam equipe, pacientes ou resultados documentais da J.Jucá. Os rótulos das especialidades seguem a imagem anexada pelo cliente.

Licenças consultadas em 27/10/2026: [Pexels](https://www.pexels.com/license/) e [Unsplash](https://unsplash.com/license). Os links abaixo levam às páginas de cada fotografia, onde a licença gratuita foi verificada. As versões locais usam WebP de 960 × 720, aproximadamente 630 KB no total. Recorte e conversão sem alterações generativas. Fontes originais baixadas em output/stock; otimização em scripts/prepare_marquee_assets.py.

| Especialidade | Fotografia / autor | Arquivo local |
|---|---|---|
| Cirurgias dentárias | [Pavel Danilyuk · Pexels](https://www.pexels.com/photo/patient-at-dental-clinic-during-procedure-6812520/) | `dist/assets/especialidades/cirurgias.webp` |
| Próteses e implantes dentários | [Harold Hisona · Unsplash](https://unsplash.com/photos/dentist-demonstrating-dental-implant-on-model-LOgBp87WzIk) | `dist/assets/especialidades/proteses-implantes.webp` |
| Reabilitação oral | [Cedric Fauntleroy · Pexels](https://www.pexels.com/photo/man-in-gray-scrub-suit-holding-teeth-model-4270084/) | `dist/assets/especialidades/reabilitacao.webp` |
| Ortodontia · Invisalign | [Diana Polekhina · Unsplash](https://unsplash.com/photos/person-inserting-clear-dental-aligner-fmB7IdFjhTM) | `dist/assets/especialidades/ortodontia.webp` |
| Clareamento | [Shiny Diamond · Pexels](https://www.pexels.com/photo/woman-with-pink-lipstick-3762441/) | `dist/assets/especialidades/clareamento.webp` |
| Facetas | [Pavel Danilyuk · Pexels](https://www.pexels.com/photo/lined-up-veneers-on-display-6812501/) | `dist/assets/especialidades/facetas.webp` |
| Endodontia | [Bakytzhan Baurzhanov · Pexels](https://www.pexels.com/photo/dentist-working-on-laptop-9951387/) | `dist/assets/especialidades/endodontia.webp` |
| Periodontia | [Anna Shvets · Pexels](https://www.pexels.com/photo/dental-cleaning-3845735/) | `dist/assets/especialidades/periodontia.webp` |
| Odontogeriatria | [Gustavo Fring · Pexels](https://www.pexels.com/photo/a-dentist-showing-an-elderly-woman-her-denture-5622025/) | `dist/assets/especialidades/odontogeriatria.webp` |
| Harmonização facial | [Ivan Babydov · Pexels](https://www.pexels.com/photo/a-woman-getting-a-facial-treatment-7789649/) | `dist/assets/especialidades/harmonizacao.webp` |
| Bichectomia | [Becca Correia · Pexels](https://www.pexels.com/photo/portrait-of-woman-with-beauty-mark-on-cheek-11033990/) | `dist/assets/especialidades/bichectomia.webp` |
| Odontopediatria | [Nadezhda Moryak · Pexels](https://www.pexels.com/photo/dentist-showing-a-dental-tool-to-patient-7800560/) | `dist/assets/especialidades/odontopediatria.webp` |

Dados completos de origem e URLs de download em `docs/marquee-assets.json`.
