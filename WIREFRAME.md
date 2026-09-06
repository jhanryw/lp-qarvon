# Wireframe v2 — LP Qarvon (reconstrução)

Direção visual validada no brainstorming: fundo quase preto (`#08090a`), acento mint (`#2bc9a8`), grain universal (textura, não decoração), grid de pontos + orbs de glow para profundidade, molduras tipo "monitor/CRT" para todo vídeo real, ícones de linha SVG (nunca emoji), cards "gradeados" (gradiente radial) no lugar de foto que não existe, números com gráfico SVG real desenhando-se. Nenhuma seção seguida de "fundo + título + parágrafo + cards" sem quebra visual (vídeo, número gigante, diagrama, timeline).

Formulário: modal (desktop) / drawer de baixo pra cima (mobile), acionado por CTA contextual em vários pontos — nunca inline ocupando a dobra.

---

## Ato 1 — Hero
**Desktop:** logo discreta + link fantasma "Aplicar" (nav mínima) → headline centralizada → subheadline/Big Idea → VSL em moldura CRT/monitor grande e centralizada → CTA primário + secundário abaixo do vídeo → 1 linha de microprova (R$50k→R$210k) abaixo do CTA.
**Mobile:** mesma ordem, vídeo full-width (edge-to-edge dentro da margem), sem formulário.
**Mídia:** `TODO_CONTENT_VSL` na moldura CRT.
**CTA:** "Analisar minha operação" (abre modal) + ghost "Ver o case Luzanni" (rola até Ato 9).

## Ato 2 — O problema (dramatização do funil)
**Conceito:** "Existe uma mentira cara sendo repetida no varejo" → diagrama vertical animado: CRIATIVO → CLIQUES → WHATSAPP/SITE → ATENDIMENTO → FOLLOW-UP → VENDA, com uma barra de "vazamento" (largura decrescente, tipo funil) e um pingo de glow vermelho em cada etapa indicando perda.
**Desktop:** diagrama centralizado, largura ~600px, cada etapa com ícone de linha + rótulo + indicador de vazamento (seta saindo lateral).
**Mobile:** mesmo diagrama, vertical, mais compacto, ícones menores.
**Quebra visual:** o próprio diagrama animado (funil encolhendo + glow vermelho viajando e "vazando" nas transições).
**Sem CTA aqui** — é construção de tensão, não pedido de ação.

## Ato 3 — Identificação (sequência de contraste)
**Conceito:** 4–5 pares de frase-contraste, uma de cada vez ocupando protagonismo (não lista de bullets):
- "Seu Meta Ads mostra resultado. Seu caixa discorda."
- "Você gera lead. O WhatsApp não fecha."
- "Um mês vende. No próximo despenca."
- "Quando a meta não bate: mais orçamento."
- "Você troca de gestor. O problema continua."
**Desktop:** cada par em card "gradeado" grande (não 5 cards pequenos iguais) — primeira frase em tom neutro, segunda frase (a virada) em mint, com ícone de linha associado (ex.: gráfico quebrado, cadeado, seta circular).
**Mobile:** mesma sequência, 1 por linha, scroll vertical natural — funciona como uma sequência tipo "Stories" de texto.
**Quebra visual:** o contraste tipográfico entre a frase neutra e a frase-virada já é a quebra; sem necessidade de imagem aqui.

## Ato 4 — Reframe (tela cheia)
**Desktop/mobile:** tela quase vazia, fundo com 1 orb de glow, tipografia gigante centralizada:
"MAIS TRÁFEGO NÃO CORRIGE UMA OPERAÇÃO INEFICIENTE."
Sem CTA, sem mais nada — pausa cinematográfica.

## Ato 5 — Prova precoce (teaser Luzanni)
**Desktop:** número grande R$50k→R$210k sobre card gradeado com gráfico SVG real desenhando-se, 1 linha de curiosidade ("E não começou aumentando a verba."), `TODO_CONTENT_LUZANNI_REVENUE_PROOF` como elemento visual ao lado/abaixo, CTA ghost "Ver como aconteceu" (rola até Ato 9).
**Mobile:** número + gráfico full-width, proof screenshot abaixo, CTA full-width.
**Quebra visual:** gráfico animado + print real (quando existir).

## Ato 6 — A descoberta (o sistema)
**Conceito:** "O crescimento não depende só da campanha" → diagrama horizontal (desktop) / vertical (mobile) com 8 nós: AQUISIÇÃO → CRIATIVO → OFERTA → ATENDIMENTO → FOLLOW-UP → CONVERSÃO → DADOS → ESCALA, estilo pipeline (mesma linguagem visual do funil do Ato 2, mas aqui os nós ficam "saudáveis"/conectados, sem vazamento — é a versão corrigida do funil quebrado que vimos no Ato 2. Reforça visualmente a virada da história.
**Quebra visual:** o próprio diagrama, com uma partícula de luz percorrendo os 8 nós continuamente.

## Ato 7 — Método QARVON
**Desktop:** moldura CRT/monitor grande, dentro dela o pipeline Q-A-R-V-O-N (nó ativo, fio conector com partícula viajando, scanlines sutis, readout "QARVON.SYS" no topo), painel lateral/inferior com nome + função + resultado esperado + elemento visual da etapa ativa.
**Mobile:** mesma moldura, pipeline com scroll horizontal por dentro da tela do monitor.
**Mídia futura:** `TODO_CONTENT_METHOD_LOOP` (loop de motion abstrato) pode substituir o fundo da tela CRT sem mudar o layout.
**CTA contextual:** "Analisar minha operação" ao final.

## Ato 8 — O que de fato fazemos
5 blocos (Aquisição, Criativos, Conversão, Dados, Escala), cada um:
- headline curta do "o que analisamos/produzimos" (lista de 3-4 itens, direct response, não frase de agência)
- 1 elemento visual real ou `TODO_CONTENT` específico (Ads screenshot / creative grid / WhatsApp screenshot / dashboard / —)
**Desktop:** grid 2 colunas alternando texto/mídia (não 5 cards iguais em grid uniforme — alternar largura/posição por bloco para quebrar padrão).
**Mobile:** empilhado, 1 por vez, mídia sempre acima do texto.
**CTA contextual:** "Ver se minha operação se encaixa" ao final do bloco.

## Ato 9 — Case Luzanni completo (mini-documentário)
6 capítulos em timeline horizontal (desktop) / vertical (mobile) com nó pulsante:
01 O cenário · 02 Onde estava o gargalo · 03 O que mudamos · 04 O que validamos · 05 A escala · 06 O resultado.
Vídeo do Pedro André em moldura CRT no capítulo 06 (resultado). Número R$50k→R$210k com gráfico animado permanece visível/sticky enquanto rola pelos capítulos (desktop). `TODO_CONTENT_LUZANNI_ADS_SCREENSHOT` no capítulo 03/04.
**CTA contextual:** "Aplicar para o Método QARVON" ao final — maior intenção da página.

## Ato 10 — Depoimentos
Tratamento editorial, não 3 cards genéricos: 1 depoimento em destaque grande (Pedro André, reaproveitando o vídeo, ângulo diferente/citação) + espaço reservado para `TODO_CONTENT_TESTIMONIAL_02` e `_03` que só renderizam quando existirem (seção se adapta ao número real de depoimentos, nunca preenche com fictício).

## Ato 11 — Para quem é
Gate visual ✓ | ✕ lado a lado (já validado no brainstorming), tom editorial, critério original da Qarvon (não copia MoneyClub).

## FAQ
Acordeão discreto (sem quebra visual própria — a citação/gate anterior já cumpre esse papel), 8 perguntas do spec original + ajustes de tom direct response.

## Ato 12 — Aplicação (formulário)
Headline: "Veja se sua operação está pronta para o Método QARVON."
Modal (desktop, centralizado, fundo escurecido) / drawer (mobile, sobe do rodapé). Multi-step, 1 pergunta por tela, progresso fino com glow. Campos conforme `lib/schema.ts` já existente (nome, empresa, Instagram, faturamento, investimento atual, estrutura/cargo, gargalo, objetivo, capacidade de investimento, consentimento) — **sem alterar o schema/validação/scoring/API**, só o container visual (modal/drawer no lugar de inline).
Sucesso → redirect Cal.com (já implementado).

## Footer
Mantém como está (mínimo, CNPJ pendente, política de privacidade).

---

## Componentes novos/compartilhados a construir
- `GrainOverlay` — textura de grain reutilizável (mix-blend-mode overlay).
- `DotGridBackground` + `GlowOrbs` — profundidade de fundo, reutilizável em todas as seções.
- `CrtFrame` — moldura de monitor/CRT reutilizável (usa `VideoEmbed` por dentro, mantém toda a lógica de env var / TODO_CONTENT já existente).
- `MethodPipeline` — diagrama Q-A-R-V-O-N animado (SVG/CSS).
- `FunnelLeakDiagram` — diagrama do Ato 2 (funil quebrado).
- `SystemPipeline` — diagrama do Ato 6 (pipeline saudável de 8 nós) — reaproveita boa parte do `MethodPipeline`.
- `AnimatedLineChart` — SVG com stroke-dasharray, reutilizado no teaser (Ato 5) e no case completo (Ato 9).
- `LeadFormModal` — wrapper modal/drawer em volta do `LeadForm` já existente (sem tocar na lógica interna do form).
- `ContextualCta` — botão reutilizável que abre o `LeadFormModal`, usado em 5 pontos (Hero, Método, Case, "O que fazemos", CTA final).

## O que NÃO muda
`lib/schema.ts`, `lib/scoring.ts`, `lib/sheets.ts`, `lib/webhooks.ts`, `lib/calcom.ts`, `lib/attribution.ts`, `lib/rateLimit.ts`, `lib/devFallback.ts`, `app/api/leads/route.ts`, Meta Pixel em `app/layout.tsx`, `.env.example`. A reconstrução é 100% de camada visual/estrutural de apresentação.
