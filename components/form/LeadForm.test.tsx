import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { LeadForm } from "./LeadForm";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

async function fillAndSubmit(): Promise<void> {
  render(<LeadForm />);

  fireEvent.change(screen.getByLabelText("Nome completo"), { target: { value: "Maria Teste" } });
  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

  fireEvent.change(screen.getByLabelText("WhatsApp com DDD"), { target: { value: "11912345678" } });
  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

  fireEvent.change(screen.getByLabelText("Nome da empresa"), { target: { value: "Empresa Teste LP" } });
  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

  fireEvent.click(screen.getByRole("radio", { name: "R$100 mil a R$500 mil/mês" }));
  // Último passo (auto-advance): selecionar dispara handleSubmit diretamente.
  fireEvent.click(screen.getByRole("radio", { name: "Já invisto" }));
}

beforeEach(() => {
  push.mockReset();
  window.fbq = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  delete (window as { fbq?: unknown }).fbq;
});

describe("LeadForm — submissão e Pixel", () => {
  it("dispara o Pixel Lead com eventID = lead_id enviado ao backend e redireciona só após sucesso", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, duplicate: false, redirectUrl: "/obrigado" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await fillAndSubmit();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const sentBody = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(sentBody.lead_id).toEqual(expect.any(String));
    expect(sentBody.lead_id.length).toBeGreaterThan(0);

    await waitFor(() => expect(window.fbq).toHaveBeenCalledWith("track", "Lead", {}, { eventID: sentBody.lead_id }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/obrigado"));
  });

  it("não dispara o Pixel nem redireciona quando o backend responde erro (Qarvon OS fora do ar)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Não conseguimos registrar sua aplicação agora. Tente novamente em instantes." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await fillAndSubmit();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await screen.findByText("Não conseguimos registrar sua aplicação agora. Tente novamente em instantes.");

    expect(window.fbq).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("não dispara o Pixel nem redireciona em falha de rede/conexão, e não culpa a internet do usuário", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    await fillAndSubmit();

    await screen.findByText("Não foi possível conectar. Tente novamente.");
    expect(window.fbq).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("mesma mensagem de 'não foi possível conectar' quando o servidor devolve um corpo que não é JSON válido", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => {
        throw new SyntaxError("Unexpected token < in JSON");
      },
    });
    vi.stubGlobal("fetch", fetchMock);

    await fillAndSubmit();

    await screen.findByText("Não foi possível conectar. Tente novamente.");
  });

  it("mantém os dados preenchidos e oferece 'Tentar novamente' reusando o mesmo external_submission_id após uma falha", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Não foi possível enviar seus dados agora. Tente novamente em instantes." }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, duplicate: false, redirectUrl: "/obrigado" }),
      });
    vi.stubGlobal("fetch", fetchMock);

    await fillAndSubmit();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const firstBody = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);

    const retryButton = await screen.findByRole("button", { name: "Tentar novamente" });
    // O rádio já selecionado continua marcado — o formulário não voltou
    // para a etapa 1 nem perdeu o que foi preenchido.
    expect(screen.getByRole("radio", { name: "Já invisto" })).toBeChecked();

    fireEvent.click(retryButton);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const secondBody = JSON.parse((fetchMock.mock.calls[1][1] as RequestInit).body as string);
    expect(secondBody.lead_id).toBe(firstBody.lead_id);
    expect(secondBody.nome).toBe("Maria Teste");

    await waitFor(() => expect(push).toHaveBeenCalledWith("/obrigado"));
  });

  it("ignora uma segunda submissão disparada enquanto a primeira ainda está em andamento", async () => {
    let resolveFetch!: (value: unknown) => void;
    const fetchMock = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<LeadForm />);
    fireEvent.change(screen.getByLabelText("Nome completo"), { target: { value: "Maria Teste" } });
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    fireEvent.change(screen.getByLabelText("WhatsApp com DDD"), { target: { value: "11912345678" } });
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    fireEvent.change(screen.getByLabelText("Nome da empresa"), { target: { value: "Empresa Teste LP" } });
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    fireEvent.click(screen.getByRole("radio", { name: "R$100 mil a R$500 mil/mês" }));

    const jaInvisto = screen.getByRole("radio", { name: "Já invisto" });
    fireEvent.click(jaInvisto);
    // Segundo clique enquanto a primeira chamada ainda não resolveu — o
    // rádio já deveria estar desabilitado (disabled={submitting}), mas a
    // guarda em handleSubmit é a garantia real independente do disabled.
    fireEvent.click(jaInvisto);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    resolveFetch({ ok: true, json: async () => ({ success: true, redirectUrl: "/obrigado" }) });
  });

  it("reutiliza o mesmo lead_id como eventID mesmo que o Pixel seja dado como já carregado antes do submit", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, duplicate: false, redirectUrl: "/obrigado" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await fillAndSubmit();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const sentBody = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    // Pixel disparado exatamente uma vez, com o mesmo id do external_submission_id.
    await waitFor(() => expect(window.fbq).toHaveBeenCalledTimes(1));
    expect(window.fbq).toHaveBeenCalledWith("track", "Lead", {}, { eventID: sentBody.lead_id });
  });
});
