---
name: storybook-component-creation
description: Storybook story, CSF3, autodocs, stories per component. Use quando si crea o si aggiorna una story Storybook per un componente UI di Followoo.
---

# Storybook Story Generation - Followoo

Generi story Storybook per i componenti UI di Followoo. Ogni file di story DEVE seguire i pattern e le convenzioni descritte qui sotto.

## Tech Stack

- **Storybook** con framework `@storybook/react-vite`
- **CSF 3** (Component Story Format) — story basate su oggetti, niente `Template.bind({})` di CSF 2
- Tipi importati da `@storybook/react-vite`: `Meta`, `StoryObj`
- Styling: **Tailwind CSS 4**, con i design token definiti in `src/index.css` (blocco `@theme inline`: `--color-primary`, `--color-bg`, `--color-accent`, `--color-foreground`, font, tipografia, breakpoint)
- Il preview (`.storybook/preview.tsx`) importa `../src/index.css`, avvolge ogni story in `MemoryRouter` e applica `bg-background text-foreground p-6`

## File Naming e Posizione

Tutte le story vivono in `src/stories/`, non accanto al componente:

```
src/stories/<ComponentName>.stories.tsx
```

Il componente viene importato da `src/components/ui/<ComponentName>`:

```tsx
import { ComponentName } from "../components/ui/ComponentName";
```

## Struttura della Story

Leggi le story esistenti in `src/stories/` come riferimento (es. `Button.stories.tsx`, `Card.stories.tsx`, `Callout.stories.tsx`). Segui questa struttura:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentName } from "../components/ui/ComponentName";

const meta: Meta<typeof ComponentName> = {
  title: "Components/UI/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
  argTypes: {
    // Controlli per le props — vedi sezione "ArgTypes" sotto
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Una story per variante — niente Default, niente Disabled, niente edge case.
// Le combinazioni di prop (size, disabled, ecc.) sono raggiungibili dal
// pannello controls di Storybook.
export const Primary: Story = {
  args: {
    variant: "primary",
  },
};
```

## Regole Principali

### 1. Meta object

- `title`: sempre `"Components/UI/<ComponentName>"` — tutti i componenti di Followoo vivono sotto la stessa categoria `UI`, non serve una gerarchia di cartelle aggiuntiva
- `tags: ["autodocs"]` — sempre presente per la documentazione automatica
- `component` — sempre valorizzato con il riferimento reale al componente
- `args` su meta — usali per default condivisi tra tutte le story (es. `onClick: () => {}` per i pulsanti)

### 2. Naming delle story

- Usa nomi di export in PascalCase: `export const Primary: Story`
- Usa la proprietà `name` per etichette in italiano quando utile, in particolare per `AllVariants`: `{ name: "Tutte le varianti" }`
- Se il componente ha una prop `variant` (o equivalente, es. `color`, `size`): una story per ogni valore + una story `AllVariants`. Nient'altro.
- Se il componente non ha varianti: basta una singola story (nominata come il componente, es. `Banner`).
- NON aggiungere `Default`, `Disabled`, `Loading`, `WithIcon`, `XSmall`, ecc. — ogni combinazione di prop è raggiungibile dal pannello controls in fondo a Storybook.

### 3. ArgTypes

Definisci `argTypes` in meta per configurare i controlli di Storybook. Leggi il tipo delle props del componente per determinare quali controlli aggiungere:

- **Prop variant/enum**: usa `control: { type: "select" }` (o `"radio"`) con l'array `options`
- **Prop booleane**: usa `control: "boolean"`
- **Prop testuali**: usa `control: "text"`
- **Prop numeriche**: usa `control: { type: "number" }`
- **Prop di colore basate su token** (es. `background`, `foreground`, `color`): usa `control: { type: "select" }` con `options` che elencano i valori validi (`"primary"`, `"accent"`, `"bg"`, `"foreground"`) — leggi il tipo delle props del componente per l'elenco esatto, non serve consultare `src/index.css` per ogni story

### 4. Composizione con `render`

Per le story che mostrano più stati o richiedono un layout, usa la funzione `render` con un `div` a `style` inline (o classi Tailwind), coerente con il resto di `src/stories/`:

```tsx
export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <ComponentName variant="primary" />
      <ComponentName variant="accent" />
    </div>
  ),
};
```

Per griglie usa `display: "grid"` con `gridTemplateColumns`, come in `Card.stories.tsx` e `Skeleton.stories.tsx`.

Per componenti con stato interno (es. pagina corrente, visibilità), usa `useState` dentro `render`, come in `Paginator.stories.tsx` e `Toast.stories.tsx`.

### 5. Lingua dei contenuti

Usa l'**italiano** per tutto il testo delle story (etichette, placeholder, descrizioni), coerente con il tono prodotto di Followoo — un'app che analizza i follower/following di Instagram, mai un contesto bancario o finanziario:

- "Conferma", "Annulla", "Vai al dettaglio"
- "Operazione completata con successo"
- "Si è verificato un errore. Riprova più tardi."
- "Tutte le varianti", "Pagina intermedia", "Caricamento in corso"

Le descrizioni in `argTypes` possono restare in inglese o italiano a seconda di quanto già presente nel file (in `src/stories/` convivono entrambi gli stili — segui quello del file più simile che stai estendendo).

### 6. Story da includere sempre

Mantieni il file di story minimale — i controls di Storybook permettono già all'utente di modificare ogni prop. Per ogni componente, genera esattamente:

1. **Una story per ogni valore di `variant`** (o prop di variante equivalente) — gli `args` impostano la variante e ogni prop necessaria per renderla significativa (es. `children` per un Button)
2. **`AllVariants`** — funzione `render` che mostra tutte le varianti affiancate, con `name: "Tutte le varianti"`

Se il componente non ha prop di variante, genera una singola story con il nome del componente e fermati lì.

NON aggiungere story per singola combinazione di prop (`Default`, `Disabled`, `Loading`, `WithIcon`, `XSmall`, `Hidden`, `WithChildren`, ecc.). Sono già raggiungibili modificando i controls sulla story di variante esistente.

## Checklist Prima di Generare una Story

1. Il file vive in `src/stories/<ComponentName>.stories.tsx`
2. Il componente è importato da `../components/ui/<ComponentName>`
3. `Meta` usa i tipi di `@storybook/react-vite`, non `@storybook/react`
4. `title: "Components/UI/<ComponentName>"`
5. `tags: ["autodocs"]` presente
6. Formato CSF 3 — oggetto `args`, niente `Template.bind({})`
7. `argTypes` configurati per tutte le props controllabili
8. Contenuto testuale in italiano, coerente col tono prodotto Followoo (mai contesto bancario)
9. Esattamente una story per valore di `variant` + `AllVariants` per componenti con varianti; una sola story per componenti senza varianti
10. NO `Default`, `Disabled`, `Loading`, `Hidden`, `WithIcon`, `XSmall`, … — il pannello controls copre le combinazioni di prop
11. `type Story = StoryObj<typeof ComponentName>` — non `StoryObj` generico
