# Autocrítica — "o que ainda parece artificial ou feito por IA?"

Revisão honesta da implementação atual antes de qualquer nova rodada de mockup. Cada item
abaixo é um problema real que encontrei revisando meu próprio código, com o que vou corrigir
agora (marcado ✅) e o que só se resolve com asset real (marcado ⏳, ver `ASSET-MANIFEST.md`).

## 1. Moldura de monitor/CRT usada demais
Usei o mesmo bezel "tela de sistema" em 3 lugares: VSL do hero, Método QARVON e vídeo do
case. Nos dois primeiros faz sentido (é vídeo de verdade). No Método QARVON **não** — não é
gravação nenhuma, é um diagrama, e forçar ele dentro de uma "tela" é decoração sem função,
exatamente o tipo de "elemento futurista sem função" citado. **✅ Fix:** removo a moldura CRT
do Método QARVON e dou a ele uma identidade própria (schematic/blueprint, sem bezel de tela).

## 2. "● REC" piscando é puramente decorativo
Não está gravando nada. É tech-decoration sem significado — o tipo de detalhe que grita
"IA achou que isso parece high-tech" em vez de comunicar algo real. **✅ Fix:** removo o REC
de todas as molduras.

## 3. Fundo "grid de pontos + 2 orbs de glow" repetido de forma idêntica
Usei exatamente o mesmo `DepthBackground` (mesmo grid, mesmas 2 posições de orb) em 6
seções seguidas (Hero, Problema, Identificação, Reframe, Teaser, Descoberta). Repetição
idêntica de um efeito é o padrão mais clássico de "template genérico" — o olho reconhece
cópia-e-cola rápido. **✅ Fix:** varia posição/intensidade por seção e remove de duas
seções (Identificação, Descoberta) para criar ritmo — nem toda seção precisa do mesmo
fundo "espacial".

## 4. Estrutura "eyebrow mint + heading centralizado + bloco" repetida em quase tudo
Hero, Problema, Identificação, Descoberta, Método, O-que-fazemos e Fit seguem o mesmo
esqueleto de leitura. Isso é reconhecível como template (é literalmente o padrão de landing
page SaaS que o briefing pediu pra evitar). **✅ Fix:** quebro esse padrão em pelo menos duas
seções (Descoberta e O-que-fazemos) com layout assimétrico/alternado.

## 5. Cards de dor e de alavanca são genéricos na forma
Gradiente radial + borda + texto — funcional, mas visualmente "card de agência" apesar da
paleta certa. **✅ Fix parcial:** dou peso visual desigual entre eles (não todos do mesmo
tamanho/tratamento) e removo o gradiente decorativo dos cards que não têm dado real dentro.

## 6. TODO_CONTENT em caixa cinza tracejada não simula volume nenhum
Correto do ponto de vista de honestidade (nunca fabricar conteúdo), mas visualmente é só
"aviso de erro", não dá noção nenhuma de como a seção vai ficar com o asset real. **✅ Fix:**
construo um componente `AssetPlaceholder` com formas abstratas (não fotos falsas, não
telas fake) que ocupam a proporção e o enquadramento reais do asset final, com um selo
pequeno "ativo pendente" — nunca parecendo uma foto/print real, mas dando volume de verdade.

## 7. O que só se resolve com asset real (⏳ — não dá pra "consertar" com CSS)
- **Zero presença humana.** Nenhuma foto/vídeo de pessoa real além do depoimento (que ainda
  não está hospedado). Isso é a causa raiz de "parece feito por IA" — CSS por mais rico que
  seja não substitui rosto, loja, mão, produto. Só resolve com os itens P0/P1 do
  `ASSET-MANIFEST.md` (fundador, Luzanni, operação real).
- **Zero prova documental.** Nenhum print real de Ads Manager, WhatsApp ou dashboard ainda
  existe no projeto — os slots já estão desenhados (`AssetPlaceholder`), só faltam os
  arquivos.
- **Densidade de mídia.** MoneyClub tem 58 imagens + 4 vídeos; a Qarvon hoje tem 0 de cada.
  Isso não fecha com mais CSS — fecha com os assets sendo produzidos e entrando nos slots
  que já existem.

## Direção de correção (não vira cyberpunk, mas também não vira place-holder infinito)
O ponto de equilíbrio: tecnologia + varejo real. Enquanto os assets não chegam, o CSS deve
parecer **contido e funcional** (cada elemento visual carrega um dado ou uma função real —
número, transição, estado) em vez de **decorativo e futurista por conta própria** (REC
falso, scanline em tudo, glow em tudo). Os 6 fixes ✅ acima vão nessa direção agora, no
código. Os itens ⏳ ficam documentados e visíveis como próximo passo real, não escondidos.
