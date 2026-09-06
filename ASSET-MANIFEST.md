# Asset Production Plan — LP Qarvon v2

Substitui a versão anterior (mero manifesto) por um plano executável: cada item tem o
suficiente para ser produzido sem mais perguntas. Nome de arquivo esperado é literal —
usar exatamente esse nome ao entregar, para o código já reconhecer/consumir sem alterações.

Convenção de prioridade:
- **P0** — obrigatório antes de subir tráfego pago.
- **P1** — importante, sobe o nível de prova, pode entrar na primeira semana pós-lançamento.
- **P2** — polimento, entra quando houver tempo/orçamento de produção.

---

## Índice de assets

| # | Nome | Seção | Prioridade | Tipo |
|---|---|---|---|---|
| 1 | VSL Hero | Hero | P0 | Vídeo |
| 2 | Depoimento Pedro André (Luzanni) | Case teaser + Case completo | P0 | Vídeo/depoimento |
| 3 | Fundador — plano fechado (talking head) | VSL, "A descoberta" | P0 | Vídeo/fotografia |
| 4 | Fundador — dashboard/análise | "A descoberta", "O que fazemos" | P1 | Fotografia/vídeo |
| 5 | Fundador — ambiente de loja | "A descoberta" | P1 | Fotografia/vídeo |
| 6 | Fundador — reunião/operação | "A descoberta" | P2 | Fotografia |
| 7 | Comprovação de faturamento Luzanni | Teaser + Case completo | P0 | Screenshot |
| 8 | Print Meta Ads Manager (Luzanni) | Case completo, "O que fazemos" | P0 | Screenshot |
| 9 | Print WhatsApp (Luzanni, antes/depois) | "O que fazemos" | P1 | Screenshot |
| 10 | Grade de criativos reais | "O que fazemos" | P1 | Gráfico/mockup |
| 11 | Dashboard de acompanhamento (CAC/conversão/margem) | "O que fazemos" | P1 | Screenshot/gravação de tela |
| 12 | B-roll loja/operação Luzanni | Ato 2, "A descoberta" | P1 | Vídeo |
| 13 | Depoimentos adicionais (02, 03) | Depoimentos | P1 | Vídeo/depoimento |
| 14 | Foto/vídeo do time Qarvon | rodapé "A descoberta" | P2 | Fotografia |
| 15 | Loop motion abstrato (reforço Método QARVON) | Método QARVON | P2 | Motion |

---

## 1. VSL Hero — detalhamento máximo

**Arquivo esperado:** `vsl-hero.mp4` (ou link hospedado via `NEXT_PUBLIC_VSL_URL`).
**Seção:** Hero, moldura central.
**Prioridade:** P0.
**Tipo:** vídeo publicitário (não institucional).
**Orientação:** 16:9 principal; gravar também um recorte 9:16 se houver verba, para reuso em Meta Ads (mesmo asset, dois cortes).
**Resolução mínima:** 3840×2160 (4K) na captura, entrega em 1920×1080 — grava em 4K para permitir reenquadre/zoom em pós.
**Duração:** 3:30–4:00.
**Desktop e mobile:** o mesmo arquivo 16:9 serve para os dois — o componente (`CrtFrame`) já é responsivo.

### Estrutura por tempo

| Tempo | Bloco | O que aparece | Plano de câmera | Gráfico/insert |
|---|---|---|---|---|
| 0:00–0:15 | Hook | Fundador direto pra câmera: "Se sua loja já investe em anúncio e mesmo assim trava, o problema pode não estar no anúncio." | Plano fechado (busto), luz dramática de fonte única, fundo escuro | Nenhum — frase carrega sozinha |
| 0:15–0:45 | Reframe | Explica a Big Idea: mais tráfego não corrige operação ineficiente | Plano médio, fundador gesticulando | Título animado "MAIS TRÁFEGO NÃO CORRIGE UMA OPERAÇÃO INEFICIENTE" em tela cheia por 2s |
| 0:45–1:30 | O mecanismo | Explica o funil: criativo → clique → WhatsApp → atendimento → follow-up → venda, e onde vaza | Plano médio + corte para tela | Diagrama animado do funil com vazamento (reaproveitar a mesma peça visual da seção "O problema" da LP — consistência de marca) |
| 1:30–2:15 | Método QARVON | Explica as 6 letras rapidamente | Plano fechado, ritmo mais rápido | Pipeline Q-A-R-V-O-N animado (mesma peça da seção Método da LP) |
| 2:15–3:00 | Prova (Luzanni) | Conta o case, número R$50k→R$210k | Corte para fundador olhando tela/dashboard (B-roll) | Insert do print real do Ads Manager + contador animado do número |
| 3:00–3:30 | Para quem é | Qualifica rapidamente quem deve/não deve aplicar | Plano médio | Nenhum, ou lower-third com os 2 critérios principais |
| 3:30–4:00 | CTA | "Preencha a aplicação abaixo" | Plano fechado, olhando direto pra câmera | Seta/indicador gráfico apontando para baixo, mockup do botão "Analisar minha operação" |

**B-roll necessário (gravar à parte, cortar por cima da voz):**
- Tela gravando scroll no Meta Ads Manager (métricas reais, anonimizáveis).
- Tela gravando um gráfico subindo (pode ser o próprio dashboard da Qarvon).
- Mãos digitando/mouse.
- Se possível: ambiente de loja (Luzanni ou outra referência de varejo real).

**Elementos gráficos/inserts:** título animado (Big Idea), diagrama do funil, pipeline do método, print real do Ads Manager, contador de número animado — todos na mesma paleta da LP (`#08090a` fundo, `#2bc9a8` acento) para o vídeo e a página parecerem a mesma peça.

**Sound design:** cama sonora sutil (synth pad tenso, baixo volume) do início ao fim; leve *whoosh* nas transições de bloco; "tick" curto sincronizado com o contador de número subindo; sem música durante a frase de prova (silêncio breve antes do número = ênfase); sting curto no CTA final.

**Thumbnail:** still do fundador em plano fechado, meio-gesto (não parado/estático), luz dramática, com texto sobreposto curto (ex.: "Mais tráfego não é a resposta") em tipografia igual à da LP, glow mint sutil no texto.

**Frame inicial (poster):** mesmo still do thumbnail ou um frame do número R$210 mil animando — o primeiro frame precisa parar o scroll sozinho, antes mesmo do play.

**CTA final:** fala + gráfico apontando pro formulário, sem placa de "inscreva-se" genérica.

---

## 2. Depoimento Pedro André (Luzanni)

**Arquivo esperado:** `depoimento-pedro-andre.mp4`.
**Já gravado** — falta exportar/hospedar. Se houver mais de um corte, priorizar o mais completo; um segundo corte curto (30–45s) é ótimo para o teaser (Ato 5) enquanto o corte completo vai no case (Ato 9).
**Orientação:** a do material já gravado (informar se é 16:9 ou 9:16 — o componente aceita os dois, mas o enquadramento do bezel foi desenhado para 16:9).
**Resolução mínima:** 1080p.
**O que precisa aparecer:** Pedro falando sobre o problema antes da Qarvon, o que mudou, e o resultado (R$210 mil) — se ainda não tiver isso no corte, vale regravar um trecho complementar.

### Junto do vídeo, também precisamos (para o case completo, Ato 9):
- **Comprovação de faturamento** (`luzanni-faturamento-print.png`) — extrato/relatório real, anonimizado (esconder CNPJ, nomes de terceiros), mostrando R$50 mil e R$210 mil nos respectivos períodos.
- **Print do Meta Ads Manager** (`luzanni-ads-manager.png`) — comparando período antes/depois (CAC, ROAS ou o indicador que a Luzanni usar).
- **Print de WhatsApp antes/depois** (`luzanni-whatsapp-antes.png` / `luzanni-whatsapp-depois.png`) — conversa real anonimizada mostrando a mudança no atendimento (com autorização).
- **2–4 criativos reais** usados na campanha (`luzanni-criativo-01.jpg` … `04.jpg`) — formato 1:1 ou 4:5.
- **Datas exatas do período medido** (início/fim) — hoje é o único dado que falta para fechar a tabela do case com precisão.

---

## 3–6. Fundador da Qarvon — shot list completo

Nenhuma foto de banco de imagem. Tudo precisa ser do fundador real, em ambiente real.

| # | Cena | Enquadramento | Orientação | Onde é usada | Arquivo esperado |
|---|---|---|---|---|---|
| 3a | Falando pra câmera (talking head) | Plano fechado (busto), olhando direto pra lente | 16:9 (vídeo) | VSL Hero | (parte do `vsl-hero.mp4`) |
| 3b | Retrato sério, meio-perfil | Plano fechado, luz de fonte única | 4:5 vertical | Poster/thumbnail da VSL, "A descoberta" | `fundador-retrato.jpg` |
| 4a | Olhando dashboard/tela de dados | Plano médio, tela visível ao fundo/lado | 16:9 horizontal | "A descoberta" | `fundador-dashboard.jpg` |
| 4b | Mãos no teclado, analisando campanha | Close nas mãos + tela desfocada ao fundo | 4:5 ou 1:1 | "O que fazemos" (bloco Dados/Aquisição) | `fundador-analise.jpg` |
| 4c | Celular na mão (WhatsApp/Meta Ads app) | Plano fechado no celular, fundo desfocado | 4:5 vertical | "O que fazemos" (bloco Conversão) | `fundador-celular.jpg` |
| 5a | Dentro de uma loja (idealmente Luzanni) | Plano aberto, ambiente de varejo real ao fundo | 16:9 horizontal | "A descoberta" | `fundador-loja.jpg` |
| 5b | Conversando com dono/equipe da loja | Plano médio, dois planos (fundador + interlocutor) | 16:9 horizontal | Ato 2 ou "A descoberta" | `fundador-loja-conversa.jpg` |
| 6a | Reunião/análise em equipe | Plano aberto, mesa com laptop/gráficos visíveis | 16:9 horizontal | rodapé "A descoberta" | `qarvon-reuniao.jpg` |

**Diretriz de produção:** luz dramática de fonte única (não luz de escritório chapada), ambiente escuro ou neutro, paleta compatível com preto/verde-menta da LP (pode aplicar leve duotone em pós, mas a captura já deve ser propositalmente de baixo-key). Nada de sorriso posado tipo banco de imagem — expressão de foco/análise, condizente com "inteligência e controle operacional".

---

## 7. Operação Qarvon — provas visuais de execução real

Para a seção "O que fazemos" (Ato 8) parecer prova, não promessa:

| Elemento | Formato | Onde entra | Arquivo esperado |
|---|---|---|---|
| Dashboard de CAC/conversão/margem (real, interno da Qarvon) | screenshot ou gravação de tela | Bloco "Dados" | `qarvon-dashboard-dados.png` |
| Print de campanha real no Meta Ads Manager (cliente autorizado) | screenshot | Bloco "Aquisição" | `qarvon-meta-ads.png` |
| Print de CRM/planilha de acompanhamento de lead | screenshot | Bloco "Dados" ou "Conversão" | `qarvon-crm.png` |
| Print de conversa de WhatsApp estruturada (script real em uso) | screenshot anonimizado | Bloco "Conversão" | `qarvon-whatsapp-script.png` |
| Grade de criativos produzidos para clientes | 4–8 imagens | Bloco "Criativos" | `qarvon-criativos-grid.png` |
| Documento/relatório de reunião de resultado (real, anonimizado) | screenshot ou foto | reforço "Dados"/"Escala" | `qarvon-relatorio.png` |
| Registro do Método QARVON em uso (quadro, planilha de qualificação, etc.) | foto ou screenshot | Método QARVON (reforço) | `qarvon-metodo-doc.png` |

---

## 8. Depoimentos — roteiro de gravação

**Arquivo esperado:** `depoimento-0X-nome.mp4` (um por cliente).
**Orientação:** 16:9 preferencial (permite o mesmo tratamento de moldura do restante da LP); se só houver 9:16 (celular), avisar para adaptar o componente.
**Duração alvo:** 60–90s por depoimento (cortar do bruto, que pode ter 5–10 min de gravação).
**Enquadramento:** plano médio, cliente centralizado, fundo do próprio negócio dele (loja, escritório) — nunca fundo neutro genérico.
**Informação obrigatória na tela (lower-third):** nome, cargo, nome da empresa.

**Roteiro de perguntas (ordem sugerida):**
1. "Como era sua operação antes da Qarvon?" (contexto/dor)
2. "O que te fez decidir aplicar/contratar?"
3. "O que mudou na prática — no dia a dia da operação?"
4. "Qual resultado você teria conforto de citar (número, se puder)?"
5. "Pra quem você recomendaria a Qarvon — e pra quem não recomendaria?"

**Instrução de edição:** manter respostas na ordem natural (contexto → mudança → resultado), cortar hesitações, não reescrever a fala do cliente em legenda — se algo não ficou claro no áudio, gravar um pickup, nunca legendar algo que ele não disse.

---

## 9. Motion loop do Método QARVON (P2)

**Arquivo esperado:** `metodo-loop.mp4` (sem áudio, 10–20s, loop perfeito).
**Conteúdo:** abstrato — partículas/circuito/linhas conectando pontos, paleta preto + `#2bc9a8`.
**Uso:** fundo da moldura do Método QARVON, atrás do pipeline Q-A-R-V-O-N (o componente já está pronto para receber via `NEXT_PUBLIC_METHOD_LOOP_URL` sem redesenho).

---

## Resumo de variáveis de ambiente

| Env var | Asset | Status |
|---|---|---|
| `NEXT_PUBLIC_VSL_URL` | #1 VSL Hero | Já existe no schema de env, aguardando arquivo |
| `NEXT_PUBLIC_CASE_VIDEO_URL` | #2 Depoimento Pedro André | Já existe, aguardando arquivo |
| `NEXT_PUBLIC_METHOD_LOOP_URL` | #15 Motion loop | A adicionar quando o asset existir |

Screenshots/fotos (itens 7, 9, 10, 11, itens da seção "Operação Qarvon") não passam por env var — entram como arquivos estáticos em `public/assets/` e são referenciados diretamente pelo componente `AssetPlaceholder`/`Image` correspondente quando chegarem (ver `SELF-CRITIQUE.md` para o novo sistema de placeholder realista usado até lá).
