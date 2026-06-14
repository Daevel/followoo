---
name: git-commits
description: Git commit, commit message, git status, git diff. Use when preparing, suggesting, reviewing, or creating commits for the Culturando project.
---

# Git Commits Skill — Culturando

## Scopo della skill

Questa skill definisce le regole che ogni agente deve seguire quando deve preparare, suggerire o scrivere un commit per il progetto **Culturando**.

L’obiettivo è mantenere una cronologia Git chiara, leggibile e professionale, usando convenzioni standard internazionali e separando correttamente i commit in base all’area del progetto modificata.

Ogni commit deve essere comprensibile anche a distanza di tempo e deve spiegare con precisione cosa è stato fatto, dove è stato fatto e perché appartiene a una determinata area.

---

## Regola obbligatoria iniziale

Prima di proporre o creare qualsiasi commit, l’agente deve sempre controllare lo stato dei file modificati tramite:

```bash
git status
```

Se serve maggiore dettaglio, deve usare anche:

```bash
git diff --stat
git diff --name-only
git diff
```

L’agente non deve mai scrivere un commit generico senza prima aver verificato quali file sono stati modificati, aggiunti o rimossi.

---

## Obiettivo del controllo `git status`

Il comando `git status` serve per capire:

- quali file sono stati modificati;
- quali file sono stati aggiunti;
- quali file sono stati eliminati;
- quali file sono non tracciati;
- se le modifiche appartengono a una sola area o a più aree del progetto;
- se conviene creare un unico commit o più commit separati.

---

## Regola di raggruppamento

L’agente deve separare i commit in base all’area di appartenenza delle modifiche.

Nel progetto Culturando le aree principali sono:

```txt
web
packages
auth
ui
config
types
db
geo
ai
translation
docs
tooling
repo
```

Se le modifiche coinvolgono aree diverse e indipendenti, l’agente deve proporre commit separati.

Esempio:

```txt
Modifiche a LoginForm.tsx e SignupForm.tsx
→ commit area auth oppure web/auth

Modifiche a packages/config e packages/types
→ commit area packages

Modifiche a README.md o documentazione
→ commit area docs

Modifiche a biome.json, pnpm-workspace.yaml, package.json root
→ commit area tooling oppure repo
```

---

## Formato commit obbligatorio

I commit devono seguire il formato **Conventional Commits**:

```txt
type(scope): short description
```

Esempi:

```txt
feat(auth): implement login form
feat(web): add auth routes
feat(packages): add shared config package
refactor(auth): move auth copy into feature constants
fix(ui): correct input checkbox usage
docs(project): add architecture context
chore(repo): update workspace configuration
```

---

## Tipi di commit ammessi

### `feat`

Usare quando viene aggiunta una nuova funzionalità.

Esempi:

```txt
feat(auth): implement login form
feat(web): add signup page
feat(packages): add shared translation package
```

---

### `fix`

Usare quando viene corretto un bug.

Esempi:

```txt
fix(auth): correct password label target
fix(ui): prevent children on input component
fix(config): restore tailwind content paths
```

---

### `refactor`

Usare quando il codice viene ristrutturato senza cambiare comportamento funzionale.

Esempi:

```txt
refactor(auth): move login form into feature folder
refactor(web): derive metadata from shared app config
refactor(packages): reorganize shared domain types
```

---

### `docs`

Usare per documentazione, file `.md`, README, skill o note architetturali.

Esempi:

```txt
docs(project): add architecture context skill
docs(git): add commit conventions skill
docs(readme): update setup instructions
```

---

### `chore`

Usare per attività tecniche non direttamente legate a feature o bug fix.

Esempi:

```txt
chore(repo): configure pnpm workspace
chore(tooling): add biome scripts
chore(deps): install zod
```

---

### `style`

Usare solo per modifiche stilistiche che non cambiano logica.

Esempi:

```txt
style(auth): improve login form spacing
style(ui): update card shadow classes
```

---

### `test`

Usare per test.

Esempi:

```txt
test(auth): add login schema validation tests
test(geo): add distance calculation tests
```

---

### `build`

Usare per modifiche al sistema di build.

Esempi:

```txt
build(web): configure next transpile packages
build(repo): update nx build settings
```

---

### `ci`

Usare per pipeline CI/CD.

Esempi:

```txt
ci(github): add build workflow
ci(repo): run biome checks on pull requests
```

---

## Scope consigliati per Culturando

Gli scope devono essere brevi, chiari e coerenti con l’area del progetto.

Scope principali:

```txt
auth
web
ui
packages
config
types
db
geo
ai
translation
project
repo
tooling
docs
deps
```

### Quando usare `auth`

Usare per modifiche a:

```txt
apps/web/src/features/auth
apps/web/src/app/auth
```

Esempi:

```txt
feat(auth): implement signup form
fix(auth): validate confirm password field
refactor(auth): move auth text into constants
```

---

### Quando usare `web`

Usare per modifiche generali alla web app:

```txt
apps/web/src/app
apps/web/next.config.js
apps/web/tailwind.config.js
apps/web/postcss.config.mjs
```

Esempi:

```txt
feat(web): add dashboard placeholder
refactor(web): configure root layout metadata
fix(web): resolve Tailwind config loading issue
```

---

### Quando usare `ui`

Usare per componenti generici:

```txt
apps/web/src/components/ui
```

Esempi:

```txt
feat(ui): add checkbox component
fix(ui): correct input component props
style(ui): update button variants
```

---

### Quando usare `packages`

Usare per modifiche trasversali ai package condivisi.

Esempi:

```txt
feat(packages): add shared workspace packages
refactor(packages): expose shared config exports
```

Se il package è specifico, preferire lo scope specifico.

---

### Quando usare `config`

Usare per:

```txt
packages/config
apps/web/src/config
```

Esempi:

```txt
feat(config): add app metadata values
refactor(config): centralize auth constraints
```

---

### Quando usare `types`

Usare per:

```txt
packages/types
```

Esempi:

```txt
feat(types): add book and loan domain types
refactor(types): split auth and user types
```

---

### Quando usare `translation`

Usare per futuro package i18n:

```txt
packages/translation
apps/web/src/hooks/useTranslation.ts
```

Esempi:

```txt
feat(translation): add shared dictionaries
refactor(translation): replace auth copy with translation keys
```

---

### Quando usare `docs`

Usare per:

```txt
README.md
*.md
project skills
architecture notes
```

Esempi:

```txt
docs(project): add Culturando architecture context
docs(git): add commit conventions skill
```

---

## Commit singolo o commit multipli

L’agente deve valutare se creare un singolo commit o più commit.

### Commit singolo

Va bene se le modifiche appartengono alla stessa attività.

Esempio:

```txt
feat(auth): implement login and signup forms
```

Può includere:

```txt
- LoginForm.tsx
- SignupForm.tsx
- login.schema.ts
- signup.schema.ts
- auth-form.types.ts
```

---

### Commit multipli

Sono preferibili quando le modifiche appartengono ad aree diverse.

Esempio:

```txt
feat(auth): implement login and signup forms
```

```txt
feat(packages): add shared config and types packages
```

```txt
docs(project): add architecture context skill
```

Non bisogna mischiare in un solo commit modifiche non correlate, ad esempio:

```txt
auth forms + package translation + README + Tailwind fix
```

In quel caso l’agente deve proporre commit separati.

---

## Formato commit multilinea

Quando il commit include più attività correlate, usare un messaggio multilinea.

Formato:

```bash
git commit -m "feat(scope): short summary" \
  -m "Detailed explanation of the grouped changes."
```

Esempio:

```bash
git commit -m "feat(auth): implement login and signup forms" \
  -m "Add LoginForm and SignupForm components, configure Zod validation schemas, and prepare placeholder actions for future Auth.js integration."
```

---

## Formato per commit con elenco dettagliato

Quando serve maggiore dettaglio, il body può contenere bullet points.

Esempio:

```bash
git commit -m "feat(packages): add shared workspace packages" \
  -m "Add shared packages for config, types, geo, db and ai." \
  -m "Expose app and auth configuration through @culturando/config." \
  -m "Define initial domain types through @culturando/types."
```

---

## Esempi per Culturando

### Esempio 1 — Login form

```txt
feat(auth): implement login form
```

Body opzionale:

```txt
Add LoginForm component, connect shared auth copy, and prepare fields for email, password and remember me.
```

---

### Esempio 2 — Signup form

```txt
feat(auth): implement signup form
```

Body opzionale:

```txt
Add SignupForm component with name, email, password and confirm password fields.
```

---

### Esempio 3 — Zod validation

```txt
feat(auth): add zod validation schemas
```

Body opzionale:

```txt
Validate login and signup inputs using Zod and shared auth constraints from @culturando/config.
```

---

### Esempio 4 — Shared packages

```txt
feat(packages): add shared config and types packages
```

Body opzionale:

```txt
Create @culturando/config and @culturando/types workspace packages to centralize app metadata, auth constraints and domain types.
```

---

### Esempio 5 — Project context skill

```txt
docs(project): add Culturando architecture context
```

Body opzionale:

```txt
Document the project purpose, feature roadmap, monorepo structure and architectural conventions for future agents.
```

---

### Esempio 6 — Git commits skill

```txt
docs(git): add commit conventions skill
```

Body opzionale:

```txt
Document commit rules, status checks, Conventional Commit format and grouping strategy by project area.
```

---

### Esempio 7 — Multiple areas

Se `git status` mostra modifiche a:

```txt
apps/web/src/features/auth/*
packages/config/*
packages/types/*
docs/project-context.md
```

L’agente deve proporre commit separati:

```txt
feat(auth): implement auth form structure
```

```txt
feat(packages): add shared config and domain types
```

```txt
docs(project): add architecture context skill
```

---

## Regola sullo staging

Prima di effettuare commit, l’agente deve evitare `git add .` se le modifiche appartengono ad aree diverse e devono essere separate.

In questi casi deve usare staging selettivo:

```bash
git add apps/web/src/features/auth
git commit -m "feat(auth): implement auth form structure"
```

Poi:

```bash
git add packages/config packages/types
git commit -m "feat(packages): add shared config and domain types"
```

Poi:

```bash
git add docs/project-context.md
git commit -m "docs(project): add architecture context skill"
```

Usare `git add .` solo quando tutte le modifiche fanno parte dello stesso commit logico.

---

## Regola sui file da non includere

L’agente deve fare attenzione a non committare file non desiderati.

Controllare sempre se nello status compaiono:

```txt
node_modules/
.next/
.nx/
dist/
coverage/
.env
.env.local
.DS_Store
package-lock.json
```

Questi file non devono essere committati, salvo casi specifici e intenzionali.

In particolare, nel progetto Culturando si usa pnpm, quindi `package-lock.json` non deve essere aggiunto.

---

## Regola sul package manager

Il progetto Culturando usa pnpm.

I comandi corretti sono:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm biome:check
pnpm biome:write
```

Non usare:

```bash
npm run dev
npm install
yarn
```

Se vengono generati file da npm come `package-lock.json`, l’agente deve segnalarlo e proporre la rimozione.

---

## Regola sui controlli prima del commit

Quando possibile, prima del commit l’agente deve suggerire o eseguire:

```bash
pnpm build
pnpm biome:check
```

Se la modifica riguarda solo documentazione, il build può non essere necessario.

Se la modifica riguarda codice TypeScript, Next.js, packages o configurazioni, almeno `pnpm build` è consigliato.

---

## Regola di output dell’agente

Quando l’utente chiede un commit, l’agente deve rispondere in questo ordine:

1. mostrare o chiedere l’output di `git status`;
2. classificare i file per area;
3. suggerire se fare uno o più commit;
4. proporre i comandi `git add` selettivi;
5. proporre il messaggio di commit in formato Conventional Commit;
6. suggerire eventuali check prima del commit.

---

## Template operativo

Quando si prepara un commit, usare questo schema:

```txt
Status analysis:
- web/auth: ...
- packages/config: ...
- docs: ...

Suggested commits:
1. feat(auth): ...
2. feat(packages): ...
3. docs(project): ...

Commands:
git add ...
git commit -m "..."
```

---

## Esempio operativo completo

Input ipotetico da `git status`:

```txt
modified: apps/web/src/features/auth/components/LoginForm.tsx
modified: apps/web/src/features/auth/components/SignupForm.tsx
modified: apps/web/src/features/auth/schemas/login.schema.ts
modified: packages/config/src/auth.config.ts
new file: packages/translation/src/index.ts
new file: docs/git-commits.md
```

Analisi:

```txt
auth:
- LoginForm
- SignupForm
- login schema

config:
- auth config

translation:
- initial translation package

docs:
- git commit skill
```

Commit suggeriti:

```bash
git add apps/web/src/features/auth
git commit -m "feat(auth): complete auth form validation"
```

```bash
git add packages/config/src/auth.config.ts packages/translation
git commit -m "feat(translation): add shared translation package foundation"
```

```bash
git add docs/git-commits.md
git commit -m "docs(git): add commit conventions skill"
```

---

## Principio finale

Un buon commit deve rispondere chiaramente a tre domande:

1. Che tipo di modifica è stata fatta?
2. Quale area del progetto riguarda?
3. Quale comportamento, struttura o documentazione è stata introdotta o modificata?

Esempio ideale:

```txt
feat(auth): add zod validation for login and signup
```

È chiaro perché:

```txt
feat       → introduce una nuova funzionalità
auth       → riguarda l’area autenticazione
messaggio  → spiega la modifica concreta
```

L’agente deve sempre privilegiare commit piccoli, coerenti e leggibili rispetto a commit grandi e generici.