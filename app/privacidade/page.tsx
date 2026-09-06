import { Container } from "@/components/ui/Container";
import { TodoContent } from "@/components/ui/TodoContent";

export const metadata = { title: "Política de privacidade — Qarvon" };

export default function PrivacyPage() {
  return (
    <main className="flex-1 py-16">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-fg">Política de privacidade</h1>

        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-fg-muted">
          <p>
            Ao preencher o formulário de aplicação, a Qarvon coleta nome, WhatsApp, Instagram ou
            site, faixa de faturamento e se você já investe em tráfego pago. Esses dados são
            usados exclusivamente para avaliar sua aplicação e entrar em contato.
          </p>
          <p>
            Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.
            Utilizamos ferramentas de automação e agendamento para processar sua aplicação e
            organizar o agendamento da conversa.
          </p>
        </div>

        <div className="mt-8">
          <TodoContent label="Política de privacidade completa (LGPD) — razão social, CNPJ, encarregado de dados (DPO), base legal detalhada, prazos de retenção e canal de contato oficial. Revisar com jurídico antes de publicar em produção." />
        </div>
      </Container>
    </main>
  );
}
