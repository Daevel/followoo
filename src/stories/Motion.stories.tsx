import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { Collapse } from "../components/ui/Collapse";
import { DropdownCard } from "../components/ui/DropdownCard";
import { Modal } from "../components/ui/Modal";
import { SortSelect } from "../components/ui/SortSelect";
import { TabButton } from "../components/ui/TabButton";
import { TabIndicator } from "../components/ui/TabIndicator";

const durations = [
  {
    name: "fast",
    value: "150 ms",
    use: "Hover, cambi di colore, pressione dei pulsanti",
  },
  {
    name: "base",
    value: "200 ms",
    use: "Menu, schede, interruttori, checkbox",
  },
  {
    name: "slow",
    value: "300 ms",
    use: "Finestre, fogli dal basso, sezioni che si aprono",
  },
  {
    name: "entrance",
    value: "500 ms",
    use: "Blocchi che entrano in pagina, numeri che contano",
  },
];

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-line-subtle flex flex-col gap-3 border-t pt-6">
      <div>
        <h4 className="text-fg text-base font-semibold">{title}</h4>
        <p className="text-fg-muted mt-1 max-w-xl text-sm">{note}</p>
      </div>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  );
}

function TabsDemo() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState("mutual");
  const tabs = [
    { key: "mutual", label: "Mutual" },
    { key: "back", label: "Don't follow you back" },
    { key: "yours", label: "You don't follow back" },
  ];

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label="Esempio"
      className="border-line-subtle bg-surface-1 relative inline-flex gap-0.5 rounded-xl border p-[3px]"
    >
      <TabIndicator containerRef={ref} activeKey={active} />
      {tabs.map((tab) => (
        <TabButton
          key={tab.key}
          active={active === tab.key}
          withIndicator
          onClick={() => setActive(tab.key)}
        >
          {tab.label}
        </TabButton>
      ))}
    </div>
  );
}

function MotionSheet() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockShown, setIsBlockShown] = useState(false);
  const closeModal = useRef<(() => void) | null>(null);
  const [sort, setSort] = useState<"recent" | "name">("recent");

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <h3 className="text-fg text-xl font-semibold">Followoo motion</h3>
        <p className="text-fg-muted mt-2 text-sm">
          Quattro durate e due curve, uguali per CSS (
          <code>duration-150/200/300/500</code>, <code>ease-motion-out</code>{" "}
          per entrare, <code>ease-motion-in</code> per uscire) e GSAP (
          <code>src/animations/tokens.ts</code>). Le uscite durano circa il 70%
          delle entrate. Con “Riduci animazioni” attivo nel sistema tutto arriva
          subito allo stato finale.
        </p>
        <table className="mt-4 w-full text-left text-sm">
          <tbody>
            {durations.map((d) => (
              <tr key={d.name} className="border-line-subtle border-t">
                <td className="text-fg py-2 pr-4 font-medium">{d.name}</td>
                <td className="text-fg-muted py-2 pr-4 tabular-nums">
                  {d.value}
                </td>
                <td className="text-fg-muted py-2">{d.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Section
        title="Pulsanti"
        note="Colore in 150 ms; premendo si abbassano al 96% e tornano su."
      >
        <Button>Pulsante principale</Button>
        <Button variant="secondary">Secondario</Button>
      </Section>

      <Section
        title="Menu"
        note="Entrano sfumando, scendono di 4 px e crescono dall’angolo da cui si aprono (200 ms)."
      >
        <SortSelect
          label="Ordina per"
          value={sort}
          onChange={setSort}
          options={[
            { label: "Più recenti", value: "recent" },
            { label: "Nome, A-Z", value: "name" },
          ]}
        />
      </Section>

      <Section
        title="Schede"
        note="Lo sfondo della scheda attiva scivola verso quella nuova (200 ms)."
      >
        <TabsDemo />
      </Section>

      <Section
        title="Finestre"
        note="Lo sfondo sfuma; il pannello cresce dal 96% salendo di 6 px (200 ms). Su telefono il foglio sale dal basso (300 ms). Esc, lo sfondo, la X e i pulsanti interni (tramite closeRef) riproducono l’uscita prima di chiudere."
      >
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
          Apri una finestra
        </Button>
        {isModalOpen && (
          <Modal
            labelledBy="motion-modal-title"
            onClose={() => setIsModalOpen(false)}
            closeRef={closeModal}
          >
            <h2
              id="motion-modal-title"
              className="text-fg text-lg font-semibold"
            >
              Esempio di finestra
            </h2>
            <p className="text-fg-muted mt-2 text-sm">
              Chiudila con Esc, toccando lo sfondo o con la X per vedere
              l’uscita.
            </p>
            <Button className="mt-5" onClick={() => closeModal.current?.()}>
              Fatto
            </Button>
          </Modal>
        )}
      </Section>

      <Section
        title="Sezioni che si aprono"
        note="Collapse: altezza e opacità in 300 ms con la curva out, chiusura in 200 ms; la freccia ruota insieme. Lo usano FAQ, tag “changed username”, “Your own changes”, “Show more”."
      >
        <DropdownCard
          title="I miei dati vengono caricati su un server?"
          description="No. Followoo legge l’export nel tuo browser: niente del suo contenuto viene inviato a un server."
        />
      </Section>

      <Section
        title="Blocchi che arrivano dopo"
        note="Collapse motion=“entrance”: lo spazio si apre e il blocco sale di 14 px sfumando (500 ms), esce in 300 ms. Per card che arrivano dopo il caricamento, come “Since your last analysis”. Un blocco che sostituisce un segnaposto usa invece la classe animate-enter."
      >
        <div className="flex w-full flex-col">
          <Button
            variant="secondary"
            className="self-start"
            onClick={() => setIsBlockShown((previous) => !previous)}
          >
            {isBlockShown ? "Togli il blocco" : "Fai arrivare un blocco"}
          </Button>
          <Collapse open={isBlockShown} motion="entrance" unmountOnClose>
            <div className="pt-4">
              <div className="border-line-subtle bg-surface-1 shadow-elev-1 rounded-card border p-5">
                <p className="text-fg text-lg font-semibold">
                  Nobody unfollowed you
                </p>
                <p className="text-fg-muted mt-1 text-sm">
                  Un blocco arrivato dopo il resto della pagina.
                </p>
              </div>
            </div>
          </Collapse>
          <p className="text-fg-faint mt-4 text-sm">
            Il contenuto sotto scende e risale senza scatti.
          </p>
        </div>
      </Section>
    </div>
  );
}

const meta: Meta<typeof MotionSheet> = {
  title: "Foundations/Motion",
  component: MotionSheet,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MotionSheet>;

export const Motion: Story = {};
