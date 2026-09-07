import { afterEach, describe, expect, it } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { useVisualViewport } from "./useVisualViewport";

class FakeVisualViewport extends EventTarget {
  height: number;
  offsetTop: number;

  constructor(height: number, offsetTop = 0) {
    super();
    this.height = height;
    this.offsetTop = offsetTop;
  }

  set(height: number, offsetTop = 0) {
    this.height = height;
    this.offsetTop = offsetTop;
    this.dispatchEvent(new Event("resize"));
  }
}

function TestComponent({ active }: { active: boolean }) {
  useVisualViewport(active);
  return null;
}

function readVar(name: string): string {
  return document.documentElement.style.getPropertyValue(name);
}

afterEach(() => {
  cleanup();
  document.documentElement.style.removeProperty("--vv-height");
  document.documentElement.style.removeProperty("--vv-offset-top");
  // @ts-expect-error -- limpando o stub entre testes
  delete window.visualViewport;
});

describe("useVisualViewport", () => {
  it("não faz nada quando window.visualViewport não existe", () => {
    // @ts-expect-error -- simulando navegador sem suporte
    delete window.visualViewport;
    render(<TestComponent active={true} />);
    expect(readVar("--vv-height")).toBe("");
    expect(readVar("--vv-offset-top")).toBe("");
  });

  it("seta --vv-height/--vv-offset-top no mount quando active e visualViewport existem", () => {
    const fake = new FakeVisualViewport(800, 0);
    // @ts-expect-error -- stub mínimo suficiente para o hook
    window.visualViewport = fake;

    render(<TestComponent active={true} />);

    expect(readVar("--vv-height")).toBe("800px");
    expect(readVar("--vv-offset-top")).toBe("0px");
  });

  it("atualiza as variáveis quando o teclado reduz o visualViewport (resize)", () => {
    const fake = new FakeVisualViewport(800, 0);
    // @ts-expect-error -- stub mínimo suficiente para o hook
    window.visualViewport = fake;

    render(<TestComponent active={true} />);
    expect(readVar("--vv-height")).toBe("800px");

    // Teclado abrindo: visual viewport encolhe.
    fake.set(420, 0);
    expect(readVar("--vv-height")).toBe("420px");
  });

  it("acompanha offsetTop quando a página rola com o teclado aberto (scroll)", () => {
    const fake = new FakeVisualViewport(420, 0);
    // @ts-expect-error -- stub mínimo suficiente para o hook
    window.visualViewport = fake;

    render(<TestComponent active={true} />);

    fake.offsetTop = 120;
    fake.dispatchEvent(new Event("scroll"));

    expect(readVar("--vv-offset-top")).toBe("120px");
  });

  it("remove os listeners e as variáveis ao desmontar", () => {
    const fake = new FakeVisualViewport(800, 0);
    // @ts-expect-error -- stub mínimo suficiente para o hook
    window.visualViewport = fake;

    const { unmount } = render(<TestComponent active={true} />);
    expect(readVar("--vv-height")).toBe("800px");

    unmount();
    expect(readVar("--vv-height")).toBe("");

    // Depois de desmontado, um resize não deve mais escrever nada.
    fake.set(300, 0);
    expect(readVar("--vv-height")).toBe("");
  });

  it("não anexa listeners quando active é false", () => {
    const fake = new FakeVisualViewport(800, 0);
    // @ts-expect-error -- stub mínimo suficiente para o hook
    window.visualViewport = fake;

    render(<TestComponent active={false} />);
    expect(readVar("--vv-height")).toBe("");

    fake.set(300, 0);
    expect(readVar("--vv-height")).toBe("");
  });
});
