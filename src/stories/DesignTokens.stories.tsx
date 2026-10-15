import type { Meta, StoryObj } from "@storybook/react-vite";

// Class names are written in full (never built at runtime) so Tailwind
// generates them at build time.
type Swatch = { name: string; value: string; className: string; note: string };

const groups: { title: string; swatches: Swatch[] }[] = [
  {
    title: "Superfici",
    swatches: [
      {
        name: "surface-0",
        value: "#0b0d17",
        className: "bg-surface-0",
        note: "Sfondo pagina",
      },
      {
        name: "surface-1",
        value: "#12152a",
        className: "bg-surface-1",
        note: "Card, input, righe in hover",
      },
      {
        name: "surface-2",
        value: "#1a1e38",
        className: "bg-surface-2",
        note: "Menu, toast, tab attiva",
      },
      {
        name: "line-subtle",
        value: "white 6%",
        className: "bg-line-subtle",
        note: "Bordi delle card, divisori",
      },
      {
        name: "line-strong",
        value: "white 12%",
        className: "bg-line-strong",
        note: "Bordi di controlli e campi",
      },
    ],
  },
  {
    title: "Testo",
    swatches: [
      {
        name: "fg",
        value: "#f5f6fb",
        className: "bg-fg",
        note: "Testo principale · 15.1:1",
      },
      {
        name: "fg-muted",
        value: "#9aa0bd",
        className: "bg-fg-muted",
        note: "Testo secondario · 7.0:1",
      },
      {
        name: "fg-faint",
        value: "#6b7194",
        className: "bg-fg-faint",
        note: "Placeholder e assi · 3.8:1, solo testo non essenziale",
      },
    ],
  },
  {
    title: "Brand",
    swatches: [
      {
        name: "brand",
        value: "#4f46e5",
        className: "bg-brand",
        note: "Azioni primarie · bianco sopra 6.3:1",
      },
      {
        name: "brand-hover",
        value: "#5b54ef",
        className: "bg-brand-hover",
        note: "Hover delle azioni primarie · 5.3:1",
      },
      {
        name: "brand-fg",
        value: "#a5b4fc",
        className: "bg-brand-fg",
        note: "Indigo come testo, link, focus · 9.0:1",
      },
    ],
  },
  {
    title: "Stati",
    swatches: [
      {
        name: "success",
        value: "#34d399",
        className: "bg-success",
        note: "Esito positivo · 9.4:1",
      },
      {
        name: "warning",
        value: "#fbbf24",
        className: "bg-warning",
        note: "Attenzione · 10.8:1",
      },
      {
        name: "danger",
        value: "#fb7185",
        className: "bg-danger",
        note: "Errore, perdita · 6.7:1",
      },
      {
        name: "danger-fill",
        value: "#e11d48",
        className: "bg-danger-fill",
        note: "Riempimenti distruttivi · bianco sopra 4.7:1",
      },
    ],
  },
  {
    title: "Dati (persona e grafici)",
    swatches: [
      {
        name: "data-1",
        value: "#818cf8",
        className: "bg-data-1",
        note: "6.0:1",
      },
      {
        name: "data-2",
        value: "#22d3ee",
        className: "bg-data-2",
        note: "10.0:1",
      },
      {
        name: "data-3",
        value: "#fbbf24",
        className: "bg-data-3",
        note: "10.8:1",
      },
      {
        name: "data-4",
        value: "#c084fc",
        className: "bg-data-4",
        note: "6.8:1",
      },
      {
        name: "data-5",
        value: "#6b7194",
        className: "bg-data-5",
        note: "Solo riempimenti, non testo",
      },
    ],
  },
];

function DesignTokensSheet() {
  return (
    <div className="bg-surface-0 text-fg flex flex-col gap-8 rounded-card p-6">
      {groups.map((group) => (
        <section key={group.title} className="flex flex-col gap-3">
          <h4>{group.title}</h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
            {group.swatches.map((swatch) => (
              <div
                key={swatch.name}
                className="bg-surface-1 border-line-subtle shadow-elev-1 overflow-hidden rounded-card border"
              >
                <div className={`h-14 ${swatch.className}`} />
                <div className="flex flex-col gap-1 p-3">
                  <span className="text-sm font-semibold">{swatch.name}</span>
                  <span className="text-fg-muted text-xs tabular-nums">
                    {swatch.value}
                  </span>
                  <span className="text-fg-muted text-xs">{swatch.note}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="flex flex-col gap-3">
        <h4>Raggi, elevazione e focus</h4>
        <div className="flex flex-wrap gap-4">
          <div className="bg-surface-1 border-line-strong text-fg-muted flex h-20 w-40 items-center justify-center rounded-control border text-xs">
            radius-control · 10px
          </div>
          <div className="bg-surface-1 border-line-subtle shadow-elev-1 text-fg-muted flex h-20 w-40 items-center justify-center rounded-card border text-xs">
            radius-card + elev-1
          </div>
          <div className="bg-surface-2 border-line-strong shadow-elev-2 text-fg-muted flex h-20 w-40 items-center justify-center rounded-card border text-xs">
            elev-2 · flottanti
          </div>
          <button
            type="button"
            className="bg-surface-2 border-line-strong text-fg shadow-ring h-10 rounded-control border px-4 text-sm"
          >
            Focus da tastiera (ring)
          </button>
        </div>
      </section>
    </div>
  );
}

const meta: Meta<typeof DesignTokensSheet> = {
  title: "Foundations/DesignTokens",
  component: DesignTokensSheet,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DesignTokensSheet>;

export const DesignTokens: Story = {
  name: "Token del redesign",
};
