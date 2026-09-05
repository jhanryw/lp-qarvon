"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const FAQS = [
  {
    q: "Já contratei agência antes e não funcionou. Por que seria diferente?",
    a: "A maioria das agências começa pelo anúncio. A Qarvon começa pela operação: analisa aquisição, oferta, atendimento e conversão antes de decidir onde investir mídia. Se o problema estiver fora do tráfego, colocar mais uma agência de anúncio no mesmo lugar não muda o resultado.",
  },
  {
    q: "Vocês são uma agência de tráfego?",
    a: "Não. Tráfego pago é uma ferramenta dentro da solução, não a solução inteira. A Qarvon é uma assessoria de crescimento para varejo — atua em aquisição, criativos, conversão, dados e escala.",
  },
  {
    q: "Preciso investir mais em mídia?",
    a: "Não necessariamente. A Qarvon primeiro identifica se o problema está em como a operação usa o investimento atual. Só recomenda aumentar verba depois de validar que a estrutura absorve mais demanda.",
  },
  {
    q: "Quanto custa?",
    a: "Depende do momento e da estrutura da sua operação. Isso é definido na aplicação e na conversa de diagnóstico, não numa tabela genérica.",
  },
  {
    q: "Quando começo a perceber resultado?",
    a: "Varia conforme o histórico de mídia, a maturidade da operação e o mercado. O Método QARVON prioriza corrigir gargalos antes de prometer prazo — quem promete data fixa sem olhar sua operação está chutando.",
  },
  {
    q: "Minha loja precisa vender online?",
    a: "Não. O ICP principal da Qarvon é varejo de produto físico — loja física, híbrida ou com atacado, como a Luzanni.",
  },
  {
    q: "E se meu gargalo realmente estiver no tráfego?",
    a: "Então é isso que será corrigido primeiro. O Método QARVON não ignora mídia — ele impede que você invista mais numa campanha enquanto o problema real está no atendimento, na oferta ou no follow-up.",
  },
  {
    q: "Vocês garantem resultado?",
    a: "Não prometemos faturamento garantido. O compromisso é com método, transparência, diagnóstico, execução e decisões orientadas por dados.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <SectionHeading>Perguntas que todo dono de loja faz</SectionHeading>

        <div className="mt-8 divide-y divide-border rounded-2xl border border-border-strong">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-medium text-fg"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <span className="text-fg-subtle">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-[15px] leading-relaxed text-fg-muted">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
