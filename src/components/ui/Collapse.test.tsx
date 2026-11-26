import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Collapse } from "./Collapse";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Collapse", () => {
  it("keeps closed content in the page but out of reach", () => {
    render(
      <Collapse open={false}>
        <button type="button">Inside</button>
      </Collapse>
    );

    const button = screen.getByText("Inside");
    expect(button.closest("[inert]")).not.toBeNull();
  });

  it("makes open content reachable", () => {
    render(
      <Collapse open>
        <button type="button">Inside</button>
      </Collapse>
    );

    expect(screen.getByText("Inside").closest("[inert]")).toBeNull();
  });

  it("renders nothing while closed with unmountOnClose", () => {
    render(
      <Collapse open={false} unmountOnClose>
        <p>Card</p>
      </Collapse>
    );

    expect(screen.queryByText("Card")).toBeNull();
  });

  it("keeps the last content during the exit, then unmounts", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Collapse open motion="entrance" unmountOnClose>
        <p>Card</p>
      </Collapse>
    );

    rerender(
      <Collapse open={false} motion="entrance" unmountOnClose>
        {null}
      </Collapse>
    );
    expect(screen.getByText("Card")).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.queryByText("Card")).toBeNull();
  });
});
