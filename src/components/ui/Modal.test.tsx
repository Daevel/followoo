import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

afterEach(() => {
  cleanup();
});

function renderModal(props: { onClose?: () => void; closeDisabled?: boolean }) {
  const onClose = props.onClose ?? vi.fn();
  const view = render(
    <div data-testid="host" style={{ backdropFilter: "blur(4px)" }}>
      <Modal
        onClose={onClose}
        labelledBy="modal-title"
        closeDisabled={props.closeDisabled}
      >
        <h2 id="modal-title">Unlock your history</h2>
        <input aria-label="Passphrase" />
      </Modal>
    </div>
  );
  return { ...view, onClose };
}

describe("Modal", () => {
  it("renders on document.body, outside the component that opens it", () => {
    renderModal({});

    const dialog = screen.getByRole("dialog", { name: "Unlock your history" });
    expect(screen.getByTestId("host").contains(dialog)).toBe(false);
    expect(document.body.contains(dialog)).toBe(true);
  });

  it("focuses the first field when it opens", () => {
    renderModal({});

    expect(document.activeElement).toBe(screen.getByLabelText("Passphrase"));
  });

  it("closes on Escape after its exit animation", () => {
    vi.useFakeTimers();
    const { onClose } = renderModal({});

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(250);

    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("closes from the close button, once even if pressed twice", () => {
    vi.useFakeTimers();
    const { onClose } = renderModal({});

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    vi.advanceTimersByTime(250);

    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("can't be closed while closeDisabled is set", () => {
    const { onClose } = renderModal({ closeDisabled: true });

    vi.useFakeTimers();
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    vi.advanceTimersByTime(250);

    expect(onClose).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("locks page scroll while open and restores it on close", () => {
    const { unmount } = renderModal({});

    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
