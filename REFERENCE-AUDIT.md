# Auditoria comparativa — MoneyClub (referência) vs. Qarvon LP (atual)

Data: 2026-09-05
Referência: https://moneyclub.thiagofinch.com/
Atual: https://qarvon-lp-qarvon.uxxkgy.easypanel.host/

> Nota de posicionamento: a MoneyClub é copy de infoproduto/lançamento (medo, escassez, "gurus", stack de bônus com "valor real R$X") — isso **não** é o que a Qarvon deve reproduzir. O que auditamos aqui é **produção visual, ritmo e estrutura de direct response**, não a linguagem. Nenhum texto, imagem ou elemento proprietário da MoneyClub é reaproveitado.

## 1. Números brutos (medidos via DOM, não estimativa)

| Métrica | MoneyClub | Qarvon (atual) | Gap |
|---|---:|---:|---:|
| Altura total da página | 22.940px | 8.635px | 2,65x menor |
| Tags `<img>` | 58 | 0 | — |
| `<video>`/`<iframe>` | 4 | 0 | — |
| Elementos com `background-image` (CSS) | 61 | 0 | — |
| `<section>` | 12 | 9 | — |

**Leitura:** a Qarvon atual não tem **nenhum** pixel de mídia real — nem uma imagem, nem um vídeo, nem um background tratado. Tudo é texto, cor sólida e cards. A MoneyClub tem mídia (imagem, foto ou vídeo) a cada ~230px de rolagem, em média. Isso sozinho explica a maior parte da diferença de "sensação de produção cara".

## 2. Hero

**MoneyClub:**
- Foto do fundador em preto-e-branco dessaturado, grain pesado, iluminação de ambiente noturno (luzes desfocadas ao fundo — bokeh).
- Pill de prova social flutuante sobre a foto: contador animado ("+10.000 → +50.000 alunos") + stack de avatares circulares sobrepostos.
- Recurso de "evolução de marca": texto riscado ("CLOSE FRIENDS" com strikethrough) → "MONEY CLUB", sugerindo desdobramento/upgrade.
- Vão de respiro grande (~180px) antes do parágrafo de corpo.
- CTA com borda em glow/gradiente (dourado), não botão flat.
- VSL nativa abaixo, full-width no mobile.

**Qarvon (atual):**
- Headline + subheadline em texto puro, sem imagem, sem vídeo.
- Formulário completo de 6 campos ocupando ~50% da primeira dobra (ao lado do texto).
- Nenhuma prova social visível na dobra 1.

**Gap:** a Qarvon gasta a primeira dobra inteira pedindo dados, a MoneyClub gasta a primeira dobra **provando e mostrando o fundador**. É a inversão exata do que gera confiança antes de pedir algo.

## 3. Vídeo / VSL

**MoneyClub:** player nativo, thumbnail próprio, botão de play grande centralizado em cor de destaque (laranja), cantos arredondados, borda simples — sem exagero de moldura, mas presente logo cedo e repetido (4 instâncias de vídeo/iframe na página).

**Qarvon (atual):** `NEXT_PUBLIC_VSL_URL`/`NEXT_PUBLIC_CASE_VIDEO_URL` não configurados → seções de vídeo inteiras desaparecem em produção (comportamento correto para não fabricar conteúdo, mas o resultado visual é "buraco" onde deveria haver a peça mais forte da página).

**Gap:** não é falta de código — é falta de asset. O componente já sabe reagir a uma URL real; falta a URL real existir.

## 4. Prova / números grandes

**MoneyClub:** números como "+ de R$500 Milhões" aparecem dentro de cards com foto de fundo (desaturada) + gradiente + texto sobreposto — o número nunca é só tipografia solta, sempre tem uma "cena" atrás.

**Qarvon (atual):** o único número real (R$50 mil → R$210 mil) aparece como texto simples numa barra fina, sem card, sem cena, sem contraste.

**Gap:** mesmo dado, tratamento dramaticamente mais fraco.

## 5. Timeline / trajetória

**MoneyClub:** seção "Trajetória" com retrato circular + linha do tempo ano a ano (2017 → 2026), cada marco com uma frase curta e de impacto.

**Qarvon (atual):** não existe timeline; o case Luzanni é uma tabela Antes/Depois de 2 linhas.

## 6. Ritmo / alternância de composição

**MoneyClub** alterna a cada seção: foto → prova social → vídeo → parágrafo dramatizado → números em cards fotográficos → retrato + timeline → oferta em cards → garantia (selo) → depoimentos → FAQ. Nunca duas seções seguidas são "fundo + título + parágrafo".

**Qarvon (atual):** Hero (form) → barra de prova (texto) → VSL (some, sem asset) → dores (cards) → método (cards) → case (tabela) → alavancas (cards) → fit (listas) → FAQ (acordeão) → CTA final (texto+botão). É **cards atrás de cards atrás de cards** — exatamente o padrão que a MoneyClub evita e que o usuário identificou como falha.

## 7. Mobile

**MoneyClub:** vídeo full-width nativo, respiro generoso entre blocos, CTA com tratamento de glow, bolha de WhatsApp flutuante **apenas como suporte** (não como CTA primário), texto com ênfases em negrito dentro do parágrafo (não tudo uniforme).

**Qarvon (atual):** mobile é o desktop encolhido — mesmos componentes, mesma densidade, sem composição própria por seção.

## 8. Tensão / autoridade / quebra de monotonia

**MoneyClub** cria tensão com frases de contraste curtas ("Alguém está copiando sua oferta", "É uma ETERNIDADE!") intercaladas com números de autoridade grandes, sempre trocando o "tipo de estímulo" (texto → número → foto → vídeo → texto). A autoridade vem de números grandiosos + tempo de trincheira + prova social.

**Qarvon (atual)** tem a tese certa (spec já definida) mas comunica tudo no mesmo "volume" visual — nenhuma frase respira sozinha em tela cheia, nenhum número tem uma "cena" ao redor.

## 9. Conclusão objetiva

A Qarvon não perde para a MoneyClub em estratégia, oferta ou ICP — perde em **produção**: zero mídia real/tratada, zero alternância de composição, zero momentos de tela cheia, zero tratamento fotográfico/cinematográfico em torno dos números que já temos. A reconstrução (ver `ASSET-MANIFEST.md` e o wireframe novo) ataca exatamente esses 4 pontos, sem herdar a linguagem de infoproduto da referência.
