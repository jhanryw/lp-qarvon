import { Container } from "@/components/ui/Container";
import { TodoContent } from "@/components/ui/TodoContent";

export function ProofBar() {
  return (
    <section className="border-b border-border bg-bg-elevated/40 py-6">
      <Container>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          <div>
            <p className="text-2xl font-semibold tracking-tight text-fg">
              R$50 mil <span className="text-fg-subtle">→</span> R$210 mil
            </p>
            <p className="text-sm text-fg-muted">Faturamento mensal da Luzanni com a Qarvon</p>
          </div>

          <TodoContent label="Ativação de mais provas na barra">
            Quando houver 2º/3º case, nº de operações atendidas, tempo de operação, ou
            investimento total gerenciado (com dado real e auditável), adicionar aqui como novo
            item — nunca como número estimado.
          </TodoContent>
        </div>
      </Container>
    </section>
  );
}
