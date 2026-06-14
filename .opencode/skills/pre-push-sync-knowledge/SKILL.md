---
name: pre-push-sync-knowledge
description: Git push, pre-push, project knowledge, internal documentation. Use before suggesting or running git push to keep Culturando agent knowledge synchronized.
---

# Pre-Push Knowledge Sync Skill — Culturando

## Scopo della skill

Questa skill definisce il comportamento che ogni agente deve seguire **prima di lanciare una push** nel progetto **Culturando**.

L’obiettivo non è soltanto verificare che il commit sia corretto, ma anche mantenere aggiornate le skill e i documenti di contesto del progetto, in modo che ogni agente futuro possa conoscere lo stato reale dell’applicazione, delle librerie installate, delle feature introdotte e delle decisioni architetturali prese.

Questa skill va eseguita dopo che:

- l’agente ha già letto `git status`;
- l’agente ha già analizzato i file modificati;
- l’agente ha già costruito uno o più commit secondo la skill `git-commits`;
- l’agente sta per suggerire o lanciare una `git push`.

Prima della push, l’agente deve chiedersi:

> Le modifiche appena committate cambiano qualcosa che gli agenti futuri devono sapere?

Se la risposta è sì, deve aggiornare la skill o il documento di contesto competente prima della push.

---

## Principio fondamentale

Il codice e la conoscenza del progetto devono rimanere sincronizzati.

Ogni volta che il progetto evolve, anche la documentazione interna per gli agenti deve evolvere.

Esempio:

```txt
Se viene introdotto Auth.js nel codice,
la skill di contesto del progetto deve riportare che l’autenticazione è gestita tramite Auth.js.

Se viene creato packages/translation,
la skill di contesto deve spiegare che il progetto usa un package condiviso per i testi e i dizionari i18n.

Se vengono aggiunti nuovi componenti UI,
la skill deve aggiornare l’elenco o la descrizione dell’area components/ui.

Se viene installata una nuova libreria importante,
la skill deve riportarne il ruolo architetturale.
```

---

## Quando eseguire questa skill

Questa skill deve essere eseguita:

- prima di ogni push;
- dopo aver creato uno o più commit;
- dopo aver modificato architettura, feature, package, dipendenze, pagine, componenti o configurazioni importanti;
- prima di inviare codice che cambia il contesto tecnico del progetto.

Non è necessario aggiornare le skill se il commit riguarda solo:

- refusi minori;
- piccoli fix visuali non strutturali;
- modifiche temporanee;
- formattazione automatica;
- rimozione di codice morto non rilevante;
- modifiche già completamente descritte nelle skill esistenti.

---

## Checklist obbligatoria pre-push

Prima di proporre o lanciare:

```bash
git push
```

l’agente deve verificare:

```txt
1. Ho controllato git status?
2. Ho capito quali file sono stati modificati?
3. Ho creato commit coerenti e separati per area?
4. Le modifiche introducono nuove conoscenze di progetto?
5. Le skill/documentazioni interne sono ancora aggiornate?
6. Se necessario, ho aggiornato la skill competente?
7. Ho committato anche l’aggiornamento della skill/documentazione?
8. Ho eseguito o suggerito i check tecnici adeguati?
```

---

## Comandi da usare prima della push

L’agente deve sempre partire da:

```bash
git status
```

Poi, se serve, deve controllare gli ultimi commit:

```bash
git log --oneline -5
```

Per vedere cosa è incluso nel commit più recente:

```bash
git show --stat HEAD
```

Per controllare più commit prima della push:

```bash
git log --oneline origin/main..HEAD
```

Oppure, se il branch remoto non è `main`, adattare il riferimento:

```bash
git log --oneline origin/<branch>..HEAD
```

Per controllare i file modificati rispetto al remoto:

```bash
git diff --name-only origin/main..HEAD
```

---

## Cosa deve cercare l’agente

L’agente deve identificare se i commit introducono:

```txt
- nuove librerie;
- nuove feature;
- nuove pagine;
- nuovi componenti;
- nuovi package;
- nuove configurazioni;
- nuove regole architetturali;
- nuove cartelle strutturali;
- nuovi pattern di sviluppo;
- nuove scelte tecniche;
- modifiche al sistema auth;
- modifiche al sistema i18n;
- modifiche al database;
- modifiche alla geolocalizzazione;
- modifiche alla UI foundation;
- modifiche alla roadmap;
- modifiche allo stack tecnico;
- modifiche alla gestione dei commit;
- modifiche ai workflow di sviluppo.
```

Se una di queste cose è presente, la documentazione/skill deve essere valutata.

---

## Documenti e skill da aggiornare

I file di conoscenza del progetto possono includere, ad esempio:

```txt
.opencode/skills/project-context/SKILL.md
.opencode/skills/git-commits/SKILL.md
.opencode/skills/pre-push-sync-knowledge/SKILL.md
altre skill future del progetto
README.md
docs/*
```

La skill principale di contesto progetto è:

```txt
.opencode/skills/project-context/SKILL.md
```

Questa deve essere aggiornata quando cambiano:

- stack tecnico;
- architettura;
- feature principali;
- struttura cartelle;
- package condivisi;
- roadmap;
- convenzioni progettuali;
- librerie fondamentali;
- scelte tecniche rilevanti.

La skill dei commit è:

```txt
.opencode/skills/git-commits/SKILL.md
```

Questa deve essere aggiornata quando cambiano:

- convenzioni dei commit;
- scope ammessi;
- regole di staging;
- regole di naming;
- procedure Git;
- workflow branch/push.

Questa skill è:

```txt
.opencode/skills/pre-push-sync-knowledge/SKILL.md
```

Questa deve essere aggiornata quando cambiano:

- regole pre-push;
- criteri di aggiornamento delle skill;
- checklist obbligatorie;
- criteri per decidere se aggiornare o meno la knowledge base.

---

## Regola “se necessario”

L’agente non deve aggiornare le skill in modo meccanico per ogni commit.

Deve farlo **solo se la modifica cambia la conoscenza utile del progetto**.

### Esempi in cui aggiornare la skill

#### Auth.js

Se viene installato e configurato Auth.js:

```txt
packages installati:
- next-auth oppure @auth/*
file creati:
- apps/web/src/config/auth.ts
- apps/web/src/app/api/auth/[...nextauth]/route.ts
- middleware.ts
```

Allora aggiornare `.opencode/skills/project-context/SKILL.md` nelle sezioni:

```txt
- Stack tecnico
- Feature Auth
- Roadmap
- Architettura applicazione web
```

Aggiungere che:

```txt
L’autenticazione è gestita tramite Auth.js.
La feature auth usa Credentials Provider o provider configurati.
Le route protette passeranno da middleware/sessione Auth.js.
```

---

#### Nuovo package `packages/translation`

Se viene creato:

```txt
packages/translation
```

Allora aggiornare `.opencode/skills/project-context/SKILL.md` nelle sezioni:

```txt
- Package condivisi
- i18n / translation package
- Convenzioni architetturali
```

Aggiungere che:

```txt
Il progetto usa @culturando/translation per centralizzare dizionari e chiavi testuali.
La web app consuma le traduzioni tramite useTranslation.
I testi hardcoded devono essere evitati dove esiste una chiave di traduzione.
```

---

#### Nuovi componenti UI

Se vengono creati componenti come:

```txt
Checkbox
Textarea
Dialog
Select
FormMessage
```

Allora aggiornare la sezione UI della skill di contesto.

Esempio:

```txt
components/ui include componenti base riutilizzabili come Button, Input, Label, Card, Badge, Checkbox e FormMessage.
```

Non serve aggiornare la skill per piccoli aggiustamenti di classi CSS.

---

#### Nuove pagine

Se vengono create route importanti:

```txt
/dashboard
/books
/books/[slug]
/dashboard/books/new
```

Allora aggiornare:

```txt
- struttura app router
- feature interessata
- roadmap, se una parte passa da futura ad attuale
```

Esempio:

```txt
La dashboard è stata introdotta come area privata utente e rappresenta la destinazione post-login.
```

---

#### Nuove librerie

Se viene installata una libreria architetturalmente rilevante:

```txt
zod
next-auth
prisma
@prisma/client
maplibre-gl
react-map-gl
lucide-react
```

Allora aggiornare lo stack tecnico e spiegare il ruolo della libreria.

Esempio:

```txt
Zod viene usato per la validazione type-safe dei form e degli input utente.
```

Non serve aggiornare la skill per dipendenze indirette o librerie minori non usate direttamente nel progetto.

---

#### Database

Se viene introdotto Prisma/PostgreSQL/PostGIS:

Aggiornare:

```txt
- Stack tecnico
- packages/db
- Database
- Feature Books/Nearby, se impattate
```

Aggiungere:

```txt
Il database è gestito tramite Prisma.
PostgreSQL è il database relazionale principale.
PostGIS viene usato per query geospaziali e ricerche di prossimità.
```

---

#### MapLibre

Se viene introdotto MapLibre:

Aggiornare:

```txt
- Stack tecnico
- packages/geo
- Nearby / MapLibre
- Feature geolocalizzazione
```

Aggiungere:

```txt
MapLibre GL JS gestisce il rendering delle mappe interattive.
I dati dinamici vengono rappresentati tramite layer GeoJSON.
```

---

#### AI catalogazione

Se viene introdotto codice in `packages/ai` o feature catalogazione:

Aggiornare:

```txt
- packages/ai
- AI catalogazione
- roadmap
```

Aggiungere:

```txt
La catalogazione assistita supporta estrazione ISBN, normalizzazione metadati e suggerimenti per la scheda libro.
```

---

## Quando non aggiornare la skill

Non aggiornare le skill se il commit riguarda solo:

```txt
- correzioni di typo in un componente;
- cambio di classi Tailwind marginale;
- rename locale non architetturale;
- formattazione Biome;
- refactor interno senza nuove regole o pattern;
- piccoli fix che non cambiano la conoscenza del progetto;
- modifiche temporanee o sperimentali non ancora consolidate.
```

Esempio:

```txt
style(auth): adjust login form spacing
```

Non richiede aggiornamento skill.

Esempio:

```txt
fix(auth): correct label htmlFor attribute
```

Non richiede aggiornamento skill, salvo che il fix introduca un nuovo pattern da rispettare.

---

## Regola sul commit delle skill aggiornate

Se l’agente aggiorna una skill o un documento di contesto, deve creare un commit dedicato oppure includerlo in un commit `docs(...)` coerente.

Esempi:

```bash
git add .opencode/skills/project-context/SKILL.md
git commit -m "docs(project): update architecture context for Auth.js"
```

```bash
git add .opencode/skills/git-commits/SKILL.md
git commit -m "docs(git): update commit grouping rules"
```

```bash
git add .opencode/skills/pre-push-sync-knowledge/SKILL.md
git commit -m "docs(workflow): add pre-push knowledge sync skill"
```

Non mischiare aggiornamenti di documentazione di contesto con feature code complesse, salvo che siano parte dello stesso cambiamento e il team preferisca un commit unico.

Preferenza consigliata:

```txt
1 commit per il codice
1 commit per aggiornamento skill/documentazione
```

---

## Ordine operativo completo

Quando un agente sta per fare push, deve seguire questo ordine:

```txt
1. Leggere git status.
2. Controllare i commit locali non ancora pushati.
3. Analizzare i file inclusi nei commit.
4. Capire se i commit cambiano stack, architettura, feature o convenzioni.
5. Se non serve aggiornare skill, procedere ai check pre-push.
6. Se serve aggiornare skill, modificare il file competente.
7. Committare la modifica alla skill con commit docs(...).
8. Eseguire o suggerire i check tecnici.
9. Ricontrollare git status.
10. Procedere con git push.
```

---

## Template di analisi pre-push

L’agente deve ragionare con questo schema:

```txt
Pre-push analysis

Commits ready to push:
- feat(auth): ...
- feat(packages): ...

Changed areas:
- auth
- packages/config
- packages/types

Knowledge impact:
- Does this change the project architecture? yes/no
- Does this introduce new libraries? yes/no
- Does this introduce new features? yes/no
- Does this change conventions? yes/no

Skill updates required:
- .opencode/skills/project-context/SKILL.md: yes/no
- .opencode/skills/git-commits/SKILL.md: yes/no
- .opencode/skills/pre-push-sync-knowledge/SKILL.md: yes/no

Action:
- update skill before push
- or proceed without skill update
```

---

## Esempio completo: introduzione Auth.js

### Commit già creato

```txt
feat(auth): setup Auth.js credentials authentication
```

### File modificati

```txt
apps/web/src/config/auth.ts
apps/web/src/app/api/auth/[...nextauth]/route.ts
apps/web/src/features/auth/actions/login.action.ts
apps/web/src/middleware.ts
package.json
pnpm-lock.yaml
```

### Analisi

```txt
La modifica introduce Auth.js come sistema di autenticazione.
Cambia lo stack tecnico.
Cambia il comportamento della feature auth.
Introduce route API e middleware.
```

### Skill da aggiornare

```txt
.opencode/skills/project-context/SKILL.md
```

### Commit documentazione

```bash
git add .opencode/skills/project-context/SKILL.md
git commit -m "docs(project): update auth architecture context"
```

### Poi push

```bash
git push
```

---

## Esempio completo: nuovo package translation

### Commit già creato

```txt
feat(translation): add shared translation package
```

### File modificati

```txt
packages/translation/package.json
packages/translation/src/dictionaries/it.ts
packages/translation/src/dictionaries/en.ts
packages/translation/src/get-translation.ts
packages/translation/src/index.ts
apps/web/src/hooks/useTranslation.ts
apps/web/src/features/auth/components/LoginForm.tsx
apps/web/src/features/auth/components/SignupForm.tsx
```

### Analisi

```txt
La modifica introduce un nuovo package condiviso.
Elimina o riduce testi hardcoded.
Aggiunge un pattern di traduzione riusabile.
Cambia le convenzioni di scrittura dei testi nei componenti.
```

### Skill da aggiornare

```txt
.opencode/skills/project-context/SKILL.md
```

Possibile aggiornamento:

```txt
Il progetto usa @culturando/translation per centralizzare dizionari e chiavi testuali.
La web app espone useTranslation come hook React-specific.
I componenti devono usare t("...") invece di testi hardcoded quando una chiave esiste.
```

### Commit documentazione

```bash
git add .opencode/skills/project-context/SKILL.md
git commit -m "docs(project): update translation architecture context"
```

---

## Esempio completo: nuovi componenti UI

### Commit già creato

```txt
feat(ui): add checkbox and form message components
```

### File modificati

```txt
apps/web/src/components/ui/checkbox.tsx
apps/web/src/components/ui/form-message.tsx
apps/web/src/features/auth/components/LoginForm.tsx
```

### Analisi

```txt
La modifica aggiunge componenti UI generici.
La conoscenza dell'area components/ui deve essere aggiornata.
```

### Skill da aggiornare

```txt
.opencode/skills/project-context/SKILL.md
```

### Commit documentazione

```bash
git add .opencode/skills/project-context/SKILL.md
git commit -m "docs(project): update shared UI components context"
```

---

## Regola sui check tecnici

Prima della push, se sono state modificate parti di codice, suggerire o eseguire:

```bash
pnpm biome:check
pnpm build
```

Se la modifica riguarda solo documentazione Markdown, può bastare:

```bash
git status
```

Se la modifica riguarda package, config, Next.js o TypeScript, preferire sempre:

```bash
pnpm build
pnpm biome:check
```

---

## Regola finale prima della push

La push può essere suggerita solo quando:

```txt
- git status è pulito oppure contiene solo modifiche intenzionalmente non incluse;
- i commit sono separati correttamente;
- le skill/documentazioni sono aggiornate se necessario;
- eventuali aggiornamenti skill sono stati committati;
- i check tecnici adeguati sono stati eseguiti o consigliati.
```

---

## Frase operativa standard

Quando l’agente conclude l’analisi pre-push, deve rispondere con una frase simile:

```txt
La push è pronta: i commit sono coerenti, non ci sono aggiornamenti di skill necessari e lo status è pulito.
```

Oppure:

```txt
Prima della push è necessario aggiornare .opencode/skills/project-context/SKILL.md, perché questa modifica introduce una nuova decisione architetturale che gli agenti futuri devono conoscere.
```

---

## Principio conclusivo

Ogni push deve lasciare il progetto in uno stato coerente non solo a livello di codice, ma anche a livello di conoscenza.

Un agente futuro deve poter leggere le skill del progetto e capire:

```txt
- cosa esiste nel codice;
- quali librerie sono usate;
- quali feature sono state introdotte;
- quali pattern sono obbligatori;
- quali convenzioni vanno rispettate;
- quali aree sono future e quali sono già implementate.
```

Il codice evolve. La conoscenza degli agenti deve evolvere insieme al codice.