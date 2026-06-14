# Storybook Story Generation

You generate Storybook stories for `/src/stories` components. Every story file MUST follow the patterns and conventions described below.

## Tech Stack

- **Storybook** with `@storybook/react-vite` framework
- **CSF 3** (Component Story Format) — object-based stories, no CSF 2 `Template.bind({})`
- Types imported from `@storybook/react-vite`: `Meta`, `StoryObj`
- Preview loads `bootstrap/dist/css/bootstrap.min.css` and `src/styles/fonts.css`

## File Naming and Location

Story files live alongside the component:

```
src/components/<ComponentName>/<ComponentName>.stories.tsx
```

## Story Structure

Read existing stories in `src/components/` for reference patterns. Follow this structure:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentName } from "./ComponentName";

const meta: Meta<typeof ComponentName> = {
  title: "Components/<Category>/<ComponentName>",
  component: ComponentName,
  tags: ["autodocs"],
  argTypes: {
    // Controls for interactive props — see "ArgTypes" section below
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// One story per variant — no Default, no Disabled, no edge cases.
// Prop combinations (count, size, disabled, visible, …) are reachable
// from the Storybook controls panel.
export const Primary: Story = {
  args: {
    variant: "primary",
  },
};
```

## Key Rules

### 1. Meta object

- `title`: follows the folder hierarchy — `"Components/Buttons/Button"`, `"Components/Inputs/InputToggle"`, `"Components/Banner"`, etc.
- `tags: ["autodocs"]` — always include for auto-generated documentation
- `component` — always set to the actual component reference
- `args` on meta — use for shared defaults across all stories (e.g., `onClick: () => {}` for buttons)

### 2. Story naming

- Use PascalCase export names: `export const Primary: Story`
- Use `name` property for Italian display labels when useful: `{ name: "Tutte le varianti" }`
- If the component has a `variant` prop: one story per variant + one `AllVariants` story. Nothing else.
- If the component has no variants: a single story (named after the component, e.g. `Banner`) is enough.
- Do NOT add `Default`, `Disabled`, `Loading`, `WithIcon`, `XSmall`, `XColumn`, etc. — every prop combination is reachable from the controls panel at the bottom of Storybook.

### 3. ArgTypes

Define `argTypes` in meta to configure Storybook controls. Read the component's props type to determine which controls to add:

- **Variant/enum props**: use `control: "radio"` or `control: "select"` with `options` array
- **Boolean props**: use `control: "boolean"`
- **Token-backed props** (colors, sizes, fonts): use `control: { type: "select" }` with `options` listing the relevant token keys — read the token source files from `src/styles/theme/` to get the available keys

### 4. Composing stories with `render`

For stories that show multiple states or require layout, use the `render` function with `Box`:

```tsx
import { Box } from "../Box";

export const AllVariants: Story = {
  name: "Tutte le varianti",
  render: () => (
    <Box display="flex" flexDirection="column" gap="m" p="l">
      <ComponentName variant="primary" />
      <ComponentName variant="secondary" />
    </Box>
  ),
};
```

### 5. Form-based components (Inputs)

**All components inside `src/components/Inputs/`** use `react-hook-form` and MUST have a `FormProvider` decorator. This is not optional — without it, `useFormContext` will throw at runtime. Use this pattern:

```tsx
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

const withForm =
  (defaultValues: Record<string, unknown> = {}) =>
  (Story: () => ReactNode) => {
    const Wrapper = () => {
      const methods = useForm({ defaultValues });
      return <FormProvider {...methods}>{Story()}</FormProvider>;
    };
    return <Wrapper />;
  };

export const InputToggle: Story = {
  decorators: [withForm({ fieldName: false })],
  render: () => (
    <Box p="l">
      <InputComponent name="fieldName" label="Label" />
    </Box>
  ),
};
```

### 6. Content language

Use **English** for all story content text (labels, placeholder text, descriptions). This is a banking app — use realistic banking/financial context:

- "Conferma", "Annulla", "Vai al dettaglio"
- "Il saldo del tuo conto", "Bonifico bancario"
- "Operazione completata con successo"
- "Si è verificato un errore. Riprova più tardi."

### 7. Stories to always include

Keep the story file minimal — Storybook controls already let the user toggle every prop. For every component, generate exactly:

1. **One story per `variant` value** — `args` set the variant and any prop required to make it meaningful (e.g. `children` fallback so the user can flip `visible` from controls and see something)
2. **`AllVariants`** — `render` function showing every variant side by side, with `name: "Tutte le varianti"`

If the component has no `variant` prop, emit a single story with the component's name (e.g. `Banner`) and stop there.

Do NOT add per-prop-combination stories (`Default`, `Disabled`, `Loading`, `WithIcon`, `XSmall`, `XColumn`, `Hidden`, `WithChildren`, …). Each is already reachable by tweaking controls on the existing per-variant story.

#### Interactive props

When a component prop only makes sense in combination with other state (e.g. `children` only renders when `visible=false`), put that prop in the `args` of every per-variant story so the user can toggle the gating prop from the controls and see the effect immediately.

## Checklist Before Generating a Story

1. `Meta` uses `@storybook/react-vite` types, not `@storybook/react`
2. `tags: ["autodocs"]` is present
3. CSF 3 format — `args` object, no `Template.bind({})`
4. `argTypes` configured for all controllable props
5. `Box` used for layout in `render` stories (with theme spacing tokens)
6. Form inputs wrapped with `withForm` decorator
7. Content text is in Italian with banking context
8. Exactly one story per `variant` value + `AllVariants` for components with variants; one story for components without variants
9. NO `Default`, `Disabled`, `Loading`, `Hidden`, `WithIcon`, `XSmall`, `XColumn`, … — controls panel covers prop combinations
10. Interactive props (e.g. `children` fallback) set in `args` of every per-variant story
11. `type Story = StoryObj<typeof ComponentName>` — not generic `StoryObj`