"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { faturamentoOptions, jaInvesteTrafegoOptions, stepSchemas } from "@/lib/schema";
import { captureAttribution } from "@/lib/attribution";
import { formatBrPhone } from "@/lib/phone";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "./ProgressBar";
import { RadioCardGroup } from "./RadioCardGroup";
import { Field, inputClassName } from "./Field";

type FormState = {
  nome: string;
  whatsapp: string;
  empresa: string;
  faturamento: string;
  ja_investe_trafego: string;
  website: string;
};

const initialState: FormState = {
  nome: "",
  whatsapp: "",
  empresa: "",
  faturamento: "",
  ja_investe_trafego: "",
  website: "",
};

const TOTAL_STEPS = stepSchemas.length;
// Selecting an option on these steps advances immediately — no extra click.
// Keeps the whole application to 5 taps, aiming for a sub-60s completion.
const AUTO_ADVANCE_STEPS = new Set([3, 4]);

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function LeadForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const leadIdRef = useRef<string>("");

  useEffect(() => {
    leadIdRef.current = crypto.randomUUID();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function validateStep(currentStep: number, currentForm: FormState): boolean {
    const schema = stepSchemas[currentStep];
    const fields = Object.keys(schema.shape) as Array<keyof FormState>;
    const subset = Object.fromEntries(fields.map((key) => [key, currentForm[key]]));
    const result = schema.safeParse(subset);

    if (result.success) {
      setErrors({});
      return true;
    }

    const nextErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string") nextErrors[key] = issue.message;
    }
    setErrors(nextErrors);
    return false;
  }

  function handleNext() {
    if (!validateStep(step, form)) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  /** Radio steps call this directly with the freshly-picked value so submit/advance
   * doesn't race the next render of `form`. */
  function handleAutoAdvance<K extends keyof FormState>(key: K, value: FormState[K]) {
    const nextForm = { ...form, [key]: value };
    setForm(nextForm);
    setErrors((prev) => ({ ...prev, [key]: "" }));

    if (!validateStep(step, nextForm)) return;

    if (step === TOTAL_STEPS - 1) {
      void handleSubmit(nextForm);
    } else {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    }
  }

  async function handleSubmit(currentForm: FormState) {
    if (!validateStep(TOTAL_STEPS - 1, currentForm)) return;
    setStatus("submitting");
    setServerError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentForm,
          lead_id: leadIdRef.current,
          attribution: captureAttribution(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setServerError(data.error ?? "Não conseguimos enviar agora. Tente novamente.");
        return;
      }

      setStatus("success");
      window.fbq?.("track", "Lead");
      router.push(data.redirectUrl || "/obrigado");
    } catch {
      setStatus("error");
      setServerError("Falha de conexão. Verifique sua internet e tente novamente.");
    }
  }

  function handleTextStepKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  }

  const isLastStep = step === TOTAL_STEPS - 1;

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/10 p-8 text-center animate-fade-up">
        <p className="text-lg font-semibold text-fg">Aplicação enviada.</p>
        <p className="mt-2 text-sm text-fg-muted">Redirecionando…</p>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar step={step} totalSteps={TOTAL_STEPS} />

      <div className="flex flex-col gap-4">
        {step === 0 && (
          <Field label="Nome completo" htmlFor="nome" error={errors.nome}>
            <input
              id="nome"
              className={inputClassName}
              value={form.nome}
              onChange={(e) => update("nome", e.target.value)}
              onKeyDown={handleTextStepKeyDown}
              autoComplete="name"
              autoFocus
            />
          </Field>
        )}

        {step === 1 && (
          <Field label="WhatsApp com DDD" htmlFor="whatsapp" error={errors.whatsapp}>
            <input
              id="whatsapp"
              inputMode="numeric"
              className={inputClassName}
              value={form.whatsapp}
              onChange={(e) => update("whatsapp", formatBrPhone(e.target.value))}
              onKeyDown={handleTextStepKeyDown}
              placeholder="(11) 91234-5678"
              autoComplete="tel"
              autoFocus
            />
          </Field>
        )}

        {step === 2 && (
          <Field label="Nome da empresa" htmlFor="empresa" error={errors.empresa}>
            <input
              id="empresa"
              className={inputClassName}
              value={form.empresa}
              onChange={(e) => update("empresa", e.target.value)}
              onKeyDown={handleTextStepKeyDown}
              placeholder="Nome da sua loja"
              autoFocus
            />
          </Field>
        )}

        {step === 3 && (
          <Field label="Faturamento mensal" htmlFor="faturamento" error={errors.faturamento}>
            <RadioCardGroup
              name="faturamento"
              options={faturamentoOptions}
              value={form.faturamento}
              onChange={(v) => handleAutoAdvance("faturamento", v)}
            />
          </Field>
        )}

        {step === 4 && (
          <Field
            label="Hoje você já investe em tráfego pago?"
            htmlFor="ja_investe_trafego"
            error={errors.ja_investe_trafego}
          >
            <RadioCardGroup
              name="ja_investe_trafego"
              options={jaInvesteTrafegoOptions}
              value={form.ja_investe_trafego}
              onChange={(v) => handleAutoAdvance("ja_investe_trafego", v)}
            />
          </Field>
        )}

        {/* Honeypot: hidden from real users, catches naive bots. */}
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {serverError ? <p className="text-sm text-danger">{serverError}</p> : null}

        {!AUTO_ADVANCE_STEPS.has(step) && (
          <div className="mt-2 flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button type="button" variant="secondary" onClick={handleBack}>
                Voltar
              </Button>
            ) : (
              <span />
            )}

            <Button type="button" onClick={handleNext} disabled={status === "submitting"}>
              Continuar
            </Button>
          </div>
        )}

        {AUTO_ADVANCE_STEPS.has(step) && step > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="self-start text-sm text-fg-muted underline underline-offset-4 hover:text-fg"
          >
            Voltar
          </button>
        )}

        {isLastStep && status === "submitting" && (
          <p className="text-center text-sm text-fg-muted">Enviando…</p>
        )}

        <p className="text-center text-xs text-fg-subtle">
          Ao enviar, você concorda em ser contatado pela Qarvon.{" "}
          <a href="/privacidade" className="underline underline-offset-2 hover:text-fg-muted">
            Política de privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
}
