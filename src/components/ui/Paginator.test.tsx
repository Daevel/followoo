import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Paginator } from "./Paginator";

beforeEach(() => {
  // jsdom has no matchMedia; Paginator uses it to pick the mobile page window.
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Paginator", () => {
  it("navigates to a page when its number is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Paginator currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );

    fireEvent.click(screen.getByRole("button", { name: "3" }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("marks only the current page with aria-current", () => {
    render(<Paginator currentPage={2} totalPages={5} onPageChange={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "2" }).getAttribute("aria-current")
    ).toBe("page");
    expect(
      screen.getByRole("button", { name: "1" }).getAttribute("aria-current")
    ).toBeNull();
  });
});
