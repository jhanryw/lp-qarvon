"use client";

import { useEffect, useRef, useState } from "react";
import {
  cargoOptions,
  capacidadeInvestimentoOptions,
  faixaMidiaOptions,
  faturamentoOptions,
  gargaloOptions,
  jaInvesteTrafegoOptions,
  stepSchemas,
} from "@/lib/schema";
import { captureAttribution } from "@/lib/attribution";
import { formatBrPhone } from "@/lib/phone";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "./ProgressBar";
import { RadioCardGroup } from "./RadioCardGroup";
import { Field, inputClassName } from "./Field";

type FormState = {
  nome: string;
  whatsapp: string;
  email: string;
  empresa: string;
  instagram_site: string;
  cargo: string;
  segmento: string;
  faturamento: string;
  ja_investe_trafego: string;
  faixa_midia: string;
  gargalo: string;
  objetivo_90d: string;
  faixa_investimento_assessoria: string;
  consentimento: boolean;
  website: string;
};

const initialState: FormState = {
  nome: "",
  whatsapp: "",
  email: "",
  empresa: "",
  instagram_site: "",
  cargo: "",
  segmento: "",
  faturamento: "",
  ja_investe_trafego: "",
  faixa_midia: "",
  gargalo: "",
  objetivo_90d: "",
  faixa_investimento_assessoria: "",
  consentimento: false,
  website: "",
};

const TOTAL_STEPS = stepSchemas.length;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function LeadForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const leadIdRef = useRef<string>("");

  useEffect(() => {
    leadIdRef.current = crypto.randomUUID();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function validateStep(): boolean {
    const schema = stepSchemas[step];
    const fields = Object.keys(schema.shape) as Array<keyof FormState>;
    const subset = Object.fromEntries(fields.map((key) => [key, form[key]]));
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
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    if (!validateStep()) return;
    setStatus("submitting");
    setServerError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
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

      const nextRedirectUrl: string = data.redirectUrl ?? "";
      setRedirectUrl(nextRedirectUrl);
      window.setTimeout(() => {
        if (nextRedirectUrl && nextRedirectUrl !== "#" && nextRedirectUrl !== "#calcom-not-configured") {
          window.location.href = nextRedirectUrl;
        }
      }, 900);
    } catch {
      setStatus("error");
      setServerError("Falha de conexão. Verifique sua internet e tente novamente.");
    }
  }

  const isLastStep = step === TOTAL_STEPS - 1;

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/10 p-8 text-center animate-fade-up">
        <p className="text-lg font-semibold text-fg">Aplicação enviada.</p>
        <p className="mt-2 text-sm text-fg-muted">
          Você será redirecionado para escolher um horário. Se isso não acontecer em alguns
          segundos, use o botão abaixo.
        </p>
        <a
          href={redirectUrl || "#"}
          className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#08110f]"
        >
          Agendar minha reunião
        </a>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar step={step} totalSteps={TOTAL_STEPS} />

      <div className="flex flex-col gap-4">
        {step === 0 && (
          <>
            <Field label="Nome completo" htmlFor="nome" error={errors.nome}>
              <input
                id="nome"
                className={inputClassName}
                value={form.nome}
                onChange={(e) => update("nome", e.target.value)}
                autoComplete="name"
              />
            </Field>
            <Field label="WhatsApp com DDD" htmlFor="whatsapp" error={errors.whatsapp}>
              <input
                id="whatsapp"
                inputMode="numeric"
                className={inputClassName}
                value={form.whatsapp}
                onChange={(e) => update("whatsapp", formatBrPhone(e.target.value))}
                placeholder="(11) 91234-5678"
                autoComplete="tel"
              />
            </Field>
            <Field label="E-mail" htmlFor="email" error={errors.email}>
              <input
                id="email"
                type="email"
                className={inputClassName}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Nome da empresa" htmlFor="empresa" error={errors.empresa}>
              <input
                id="empresa"
                className={inputClassName}
                value={form.empresa}
                onChange={(e) => update("empresa", e.target.value)}
              />
            </Field>
            <Field label="Instagram ou site" htmlFor="instagram_site" error={errors.instagram_site}>
              <input
                id="instagram_site"
                className={inputClassName}
                value={form.instagram_site}
                onChange={(e) => update("instagram_site", e.target.value)}
                placeholder="@sualoja ou seusite.com.br"
              />
            </Field>
            <Field label="Seu cargo" htmlFor="cargo" error={errors.cargo}>
              <RadioCardGroup
                name="cargo"
                options={cargoOptions}
                value={form.cargo}
                onChange={(v) => update("cargo", v)}
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Segmento da loja" htmlFor="segmento" error={errors.segmento}>
              <input
                id="segmento"
                className={inputClassName}
                value={form.segmento}
                onChange={(e) => update("segmento", e.target.value)}
                placeholder="Moda, calçados, ótica, móveis..."
              />
            </Field>
            <Field label="Faturamento médio mensal" htmlFor="faturamento" error={errors.faturamento}>
              <RadioCardGroup
                name="faturamento"
                options={faturamentoOptions}
                value={form.faturamento}
                onChange={(v) => update("faturamento", v)}
              />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <Field
              label="Hoje já investe em tráfego pago?"
              htmlFor="ja_investe_trafego"
              error={errors.ja_investe_trafego}
            >
              <RadioCardGroup
                name="ja_investe_trafego"
                options={jaInvesteTrafegoOptions}
                value={form.ja_investe_trafego}
                onChange={(v) => update("ja_investe_trafego", v)}
              />
            </Field>
            <Field
              label="Faixa atual de investimento mensal em mídia"
              htmlFor="faixa_midia"
              error={errors.faixa_midia}
            >
              <RadioCardGroup
                name="faixa_midia"
                options={faixaMidiaOptions}
                value={form.faixa_midia}
                onChange={(v) => update("faixa_midia", v)}
                columns={2}
              />
            </Field>
          </>
        )}

        {step === 4 && (
          <>
            <Field label="Principal gargalo percebido" htmlFor="gargalo" error={errors.gargalo}>
              <RadioCardGroup
                name="gargalo"
                options={gargaloOptions}
                value={form.gargalo}
                onChange={(v) => update("gargalo", v)}
                columns={2}
              />
            </Field>
            <Field
              label="Objetivo principal nos próximos 90 dias"
              htmlFor="objetivo_90d"
              error={errors.objetivo_90d}
            >
              <textarea
                id="objetivo_90d"
                className={`${inputClassName} min-h-[96px] resize-none`}
                value={form.objetivo_90d}
                onChange={(e) => update("objetivo_90d", e.target.value)}
              />
            </Field>
          </>
        )}

        {step === 5 && (
          <>
            <Field
              label="Capacidade de investimento na assessoria"
              htmlFor="faixa_investimento_assessoria"
              error={errors.faixa_investimento_assessoria}
            >
              <RadioCardGroup
                name="faixa_investimento_assessoria"
                options={capacidadeInvestimentoOptions}
                value={form.faixa_investimento_assessoria}
                onChange={(v) => update("faixa_investimento_assessoria", v)}
              />
            </Field>
            <label className="flex items-start gap-3 text-sm text-fg-muted">
              <input
                type="checkbox"
                className="mt-1 size-4 accent-accent"
                checked={form.consentimento}
                onChange={(e) => update("consentimento", e.target.checked)}
              />
              <span>
                Aceito ser contatado pela Qarvon sobre minha aplicação e concordo com a{" "}
                <a href="/privacidade" className="text-accent underline underline-offset-2">
                  política de privacidade
                </a>
                .
              </span>
            </label>
            {errors.consentimento ? <p className="text-sm text-danger">{errors.consentimento}</p> : null}
          </>
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

        <div className="mt-2 flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button type="button" variant="secondary" onClick={handleBack}>
              Voltar
            </Button>
          ) : (
            <span />
          )}

          {isLastStep ? (
            <Button type="button" onClick={handleSubmit} disabled={status === "submitting"}>
              {status === "submitting" ? "Enviando..." : "Quero analisar minha operação"}
            </Button>
          ) : (
            <Button type="button" onClick={handleNext}>
              Continuar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
