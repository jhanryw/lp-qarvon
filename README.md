# LP Qarvon

Landing page de aquisição B2B da Qarvon. Especificação completa (ICP, posicionamento,
copy, arquitetura, critérios de aceite) em [`LP-QARVON-SPEC.md`](./LP-QARVON-SPEC.md) —
leia antes de mexer em copy ou fluxo.

Stack: Next.js (App Router) + TypeScript + Tailwind v4. Sem banco de dados: leads vão
para o Google Sheets via service account, com webhooks best-effort e redirect para
Cal.com no sucesso.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000 (ou a porta que o Next escolher, se 3000 estiver ocupada).

Sem nenhuma variável de ambiente configurada, o formulário ainda funciona de ponta a
ponta: `/api/leads` detecta que o Google Sheets não está configurado e grava o lead em
`.data/leads.local.jsonl` (gitignored, nunca usado em produção — ver
`lib/devFallback.ts`). Isso existe só para testar o fluxo completo sem credenciais reais.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha o que já existir. Ver
`LP-QARVON-SPEC.md` seção 17 para o que ainda está pendente (vídeo, Cal.com, Sheets,
Pixel, política de privacidade completa).

| Variável | Uso |
|---|---|
| `CALCOM_BOOKING_URL` | URL real do tipo de evento no Cal.com. Sem ela, o redirect pós-formulário fica desabilitado (mostra apenas o botão de fallback). |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY` / `GOOGLE_SHEETS_SPREADSHEET_ID` / `GOOGLE_SHEETS_TAB_NAME` | Credenciais de service account com acesso de edição à planilha. Nunca expostas ao cliente — usadas só em `app/api/leads/route.ts` (server-side). |
| `WEBHOOK_URLS` | Lista separada por vírgula. Disparado após persistir o lead; falha de webhook não derruba a resposta ao usuário. |
| `WEBHOOK_SECRET` | Se definido, assina o corpo do webhook com HMAC-SHA256 no header `X-Qarvon-Signature`. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Ativa o Meta Pixel (PageView automático; `Lead` disparado só após submit bem-sucedido). |
| `NEXT_PUBLIC_CASE_VIDEO_URL` | Depoimento de Pedro André (Luzanni) na seção de case. Sem isso, mostra placeholder em dev e a seção some em produção. |
| `NEXT_PUBLIC_VSL_URL` | VSL institucional (roteiro em `LP-QARVON-SPEC.md` §14, ainda não gravada). |
| `NEXT_PUBLIC_SITE_URL` | Usado em metadata/Open Graph. |

## Como o lead viaja

```
form (client) → POST /api/leads
  → valida com zod (lib/schema.ts)
  → honeypot: se preenchido, responde 200 sem persistir nada
  → scoreLead (lib/scoring.ts) → lead_score / lead_tier / is_icp
  → appendLeadRow no Sheets (lib/sheets.ts), idempotente por lead_id
    → se Sheets não configurado, cai no fallback local (dev only)
  → dispatchLeadWebhooks (lib/webhooks.ts), best-effort, não bloqueia a resposta
  → resposta inclui redirectUrl do Cal.com (lib/calcom.ts)
  → client mostra estado de sucesso e redireciona
```

Se nada conseguir persistir o lead (Sheets falhou e fallback local falhou), a API
responde 502 e o formulário mostra erro — o lead nunca é descartado silenciosamente.

## Conteúdo pendente (`TODO_CONTENT`)

Alguns blocos dependem de ativos reais que ainda não existem (vídeo final, datas do
case, política de privacidade completa, CNPJ no rodapé). Eles aparecem como caixas
tracejadas vermelhas em desenvolvimento (`components/ui/TodoContent.tsx`) e desaparecem
automaticamente em `next build`/produção — nada fabricado chega ao ar. Substitua o
conteúdo real no lugar do `TodoContent`, não remova o wrapper até ter o dado definitivo.

## Comandos

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção (roda TypeScript + lint)
npm run lint     # eslint
npx tsc --noEmit # typecheck isolado
```
