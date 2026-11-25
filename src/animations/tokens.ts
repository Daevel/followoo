/**
 * Followoo motion: the only durations and curves the UI uses. The same
 * values live in `src/index.css` (`--motion-*`, `ease-motion-out/in`) for
 * CSS transitions; keep both in sync.
 *
 * - fast: hover, color changes, button press
 * - base: menus, tabs, toggles, checkboxes
 * - slow: modals, bottom sheets, accordions
 * - entrance: page blocks rising in, numbers counting up
 *
 * Things entering use `out` (fast start, soft stop); things leaving use
 * `in` and take about 70% of the entrance time, so closing feels instant.
 */
export const motion = {
  duration: {
    fast: 0.15,
    base: 0.2,
    slow: 0.3,
    entrance: 0.5,
  },
  ease: {
    /** cubic-bezier(0.2, 0.8, 0.2, 1) */
    out: "power3.out",
    /** cubic-bezier(0.4, 0, 1, 1) */
    in: "power2.in",
  },
  /** Exit duration = entrance duration × this. */
  exitRatio: 0.7,
} as const;
