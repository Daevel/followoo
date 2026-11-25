import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY, ThemeProvider, useTheme } from "./ThemeProvider";

let systemDark = true;
const listeners: Array<() => void> = [];

beforeEach(() => {
  systemDark = true;
  listeners.length = 0;
  window.localStorage.clear();
  vi.stubGlobal("matchMedia", (query: string) => ({
    get matches() {
      return query.includes("dark") ? systemDark : false;
    },
    media: query,
    addEventListener: (_: string, cb: () => void) => listeners.push(cb),
    removeEventListener: () => {},
  }));
  document.head.innerHTML = '<meta name="theme-color" content="#000000">';
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  delete document.documentElement.dataset.theme;
});

function Probe() {
  const { preference, resolvedTheme, setPreference } = useTheme();
  return (
    <div>
      <span data-testid="state">
        {preference}/{resolvedTheme}
      </span>
      <button type="button" onClick={() => setPreference("light")}>
        light
      </button>
      <button type="button" onClick={() => setPreference("system")}>
        system
      </button>
    </div>
  );
}

const renderProbe = () =>
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>
  );

describe("ThemeProvider", () => {
  it("follows the system by default", () => {
    renderProbe();

    expect(screen.getByTestId("state").textContent).toBe("system/dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("updates live when the system switches", () => {
    renderProbe();

    act(() => {
      systemDark = false;
      for (const listener of listeners) listener();
    });

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(
      document
        .querySelector('meta[name="theme-color"]')
        ?.getAttribute("content")
    ).toBe("#f6f4ef");
  });

  it("remembers a chosen theme and forgets it on system", () => {
    renderProbe();

    act(() => screen.getByText("light").click());
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");

    act(() => screen.getByText("system").click());
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("starts from a stored choice", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    renderProbe();

    expect(screen.getByTestId("state").textContent).toBe("light/light");
  });
});
