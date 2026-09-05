import { Container } from "@/components/ui/Container";
import { TodoContent } from "@/components/ui/TodoContent";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col gap-4 text-sm text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Qarvon. Todos os direitos reservados.</span>
        <a href="/privacidade" className="hover:text-fg-muted">
          Política de privacidade
        </a>
      </Container>
      <Container className="mt-4">
        <TodoContent label="CNPJ / razão social no rodapé — confirmar dados legais antes de publicar." />
      </Container>
    </footer>
  );
}
