import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { FormModalProvider, useFormModal } from "./FormModalContext";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

function OpenButton() {
  const { open } = useFormModal();
  return (
    <button type="button" onClick={open}>
      Abrir
    </button>
  );
}

function Harness() {
  return (
    <FormModalProvider>
      <OpenButton />
    </FormModalProvider>
  );
}

afterEach(() => {
  cleanup();
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  vi.restoreAllMocks();
});

describe("FormModalProvider — scroll lock", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 850, configurable: true });
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  it("trava o body em position:fixed na posição atual ao abrir (não só overflow:hidden)", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir" }));

    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.top).toBe("-850px");
    expect(document.body.style.width).toBe("100%");
  });

  it("restaura o body e a posição de scroll exata ao fechar — sem pulo de layout", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir" }));

    const closeButton = screen.getByRole("button", { name: "Fechar" });
    act(() => {
      fireEvent.click(closeButton);
    });

    expect(document.body.style.position).toBe("");
    expect(document.body.style.top).toBe("");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 850);
  });
});
