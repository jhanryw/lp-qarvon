"use client";

import { useState } from "react";

const STEPS = [
  {
    letter: "Q",
    name: "Qualificação",
    function: "Entender negócio, momento, metas, histórico de mídia e capacidade operacional.",
    result: "Clareza total do ponto de partida.",
  },
  {
    letter: "A",
    name: "Análise",
    function: "Mapear aquisição, criativos, oferta, atendimento, follow-up, conversão e indicadores.",
    result: "Os gargalos ficam nomeados, não sentidos.",
  },
  {
    letter: "R",
    name: "Reestruturação",
    function: "Corrigir campanhas, criativos, proposta, processo comercial e acompanhamento.",
    result: "A operação para de vazar receita.",
  },
  {
    letter: "V",
    name: "Validação",
    function: "Testar as mudanças com dados reais antes de escalar o investimento.",
    result: "Prova de que a correção funciona, não achismo.",
  },
  {
    letter: "O",
    name: "Otimização",
    function: "Melhorar CAC, conversão, criativos, campanhas e velocidade de atendimento continuamente.",
    result: "Cada real investido rende mais que antes.",
  },
  {
    letter: "N",
    name: "Nova Escala",
    function: "Aumentar investimento e metas só quando a operação prova que aguenta mais demanda.",
    result: "Crescimento sem quebrar o que já funciona.",
  },
] as const;

export function MethodPipeline() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <div>
      <div className="flex items-center overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s.letter} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              onClick={() => setActive(i)}
              className={`flex size-8 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-bold transition-colors sm:size-12 sm:rounded-xl sm:text-base ${
                i === active
                  ? "border-accent bg-accent text-[#03110c] shadow-[0_0_28px_rgba(43,201,168,0.7)]"
                  : "border-accent/50 bg-accent/10 text-accent hover:bg-accent/20"
              }`}
              aria-pressed={i === active}
            >
              {s.letter}
            </button>
            {i < STEPS.length - 1 && (
              <div className="relative mx-0.5 h-0.5 min-w-2 flex-1 bg-gradient-to-r from-accent to-accent/10 sm:mx-1">
                <span className="animate-travel-particle absolute -top-[3px] size-2 rounded-full bg-[#8ff5da] shadow-[0_0_10px_#8ff5da]" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 border-l-2 border-accent pl-4">
        <p className="text-lg font-semibold text-fg">{step.name}</p>
        <p className="mt-1 text-sm leading-relaxed text-fg-muted">{step.function}</p>
        <p className="mt-2 text-sm font-medium text-accent">→ {step.result}</p>
      </div>
    </div>
  );
}
