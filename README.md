# Women's Health Gaps

A three-part story about where women's healthcare falls short, how we got here, and where we're headed.

**Live site:** https://tjzmendes10-ai.github.io/womens-health-gaps/

Built by Tom Mendes with [Astro](https://astro.build), deployed to GitHub Pages.

> This site is for general information only and is not medical advice.

---

## How the site is organised

| Part | Page | Content file(s) |
| --- | --- | --- |
| Home | `/` | `src/content/pages/home.md` |
| Act 1: Where care falls short | `/dismissed-as-normal/` (hub) | `src/content/topics/dismissed-as-normal.md` |
| | `/dismissed-as-normal/endometriosis/` etc. | `src/content/problems/dismissed-as-normal/*.md` |
| | Heart, Bones ("coming soon" cards) | `src/content/topics/heart-disease.md`, `bones.md` |
| Act 2: How we got here | `/history/` | `src/content/pages/history.md` (intro) + `src/content/timeline/*.md` (one file per event) |
| Act 3: Where we're headed | `/where-were-headed/` | `src/content/pages/headed.md` |
| About | `/about/` | `src/content/pages/about.md` |

**You only need to edit files in `src/content/`.** Everything else is layout and code.

Each content file has two parts:

```markdown
---
title: Endometriosis        ← "frontmatter": labelled fields between the --- lines
hook: One line summary
---

Normal text goes here.      ← the "body": ordinary writing, in Markdown
```

Markdown basics: `## Heading`, `**bold**`, `*italic*`, `[link text](https://example.com)`, and a blank line between paragraphs.

---

## Editing a problem page

File: `src/content/problems/<topic>/<page>.md`, e.g. `src/content/problems/dismissed-as-normal/pmdd.md`.

```markdown
---
title: PMDD
hook: One-line hook shown under the title.
order: 3                       # position on the hub page (1 = first)
mentalHealth: true             # true shows the Lifeline box. REQUIRED on any mental-health page.
stats:                         # 3 to 5 stats
  - value: "1 in 20"           # always wrap in "quotes"
    label: What the number means, in a sentence.
    region: Australia          # Australia or Global
    source: 1                  # number of the source in the list below (1 = first)
sources:
  - title: Name of the report or paper
    publisher: Who published it
    year: 2025                 # optional
    url: https://...
  - needed: "what's missing"   # use this until you have the real source
lastReviewed: 2026-11-02       # or: not yet reviewed
---

Summary: two or three paragraphs.

## Why it matters in Australia

Text...

## Global context

Optional. Delete this heading and its text if you don't need it.
```

The page always shows: title, hook, summary, stats, "Why it matters in Australia", global context (if present), numbered sources, and the last-reviewed date. Keep the two `##` headings spelled exactly as above.

**Naming:** always write **PMOS (formerly PCOS)**.

To add a new problem page, copy an existing file in the same folder, rename it (the filename becomes the web address), and edit it.

## Editing the timeline

One file per event in `src/content/timeline/`. Events are ordered by `sortYear`, not by filename.

```markdown
---
date: "1977"             # the label shown on the page
sortYear: 1977           # for ordering; negative for BCE, e.g. -400
title: What happened
source:
  title: ...
  publisher: ...
  url: https://...
---

Description of the event.
```

## Content rules

1. **Never invent statistics, studies or quotes.** Until you have a verified source, use a placeholder.
2. **Any page covering PMDD or mental health** must have `mentalHealth: true`. That shows a prominent Lifeline (13 11 14) box near the top of the page.
3. **The "Where we're headed" page is factual and non-partisan.** Describe what was funded and what changed, not which party did it well.
4. The "not medical advice" line is built into the footer and the About page. You don't need to add it.

## Placeholders

Any text in square brackets that starts with a capitalised word is a placeholder:

```
[STAT – source needed]    [TEXT – your personal story]    [HOOK – one-line hook]
```

Placeholders show up **highlighted in yellow** on the site. Every build also ends with a list of how many are left on each page:

```
[WARN] [placeholder-report] 80 placeholder(s) still on the site:
[WARN] [placeholder-report]    14  dismissed-as-normal/endometriosis/index.html
```

For sources and the action links on the "Where we're headed" page, write `needed: "what's missing"` instead of the real details.

## When something's wrong

If a content file is missing a field or has a mistake, the build stops and tells you which file and what to fix. For example:

```
problems → dismissed-as-normal/pmos data does not match collection schema.
  mentalHealth: Add   mentalHealth: true   or   mentalHealth: false. ...
  stats.2.region: Each stat needs   region: Australia   or   region: Global
```

List positions in these messages **count from 0**, so `stats.2` means the **3rd** stat.

---

## Working on the site

### See your changes on your own computer

Run these in the Terminal, inside the project folder:

```sh
npm install      # first time only: downloads the tools the site needs
npm run dev      # starts a preview at http://localhost:4321/womens-health-gaps/
```

The preview updates every time you save a file. Press `Ctrl + C` in the Terminal to stop it.

**If Claude Code (or another AI assistant) started the preview**, it runs in the background instead. Astro does this automatically when it detects an AI agent, so the assistant doesn't get stuck waiting. There's no Terminal window to press `Ctrl + C` in, so use these instead:

```sh
npx astro dev status   # is a preview running, and on which address?
npx astro dev stop     # stop the background preview
```

If the preview starts on a different address, such as `localhost:4322`, another preview is probably still running in the background. Stop it with `npx astro dev stop`, then run `npm run dev` again.

To run the exact same checks GitHub runs before publishing:

```sh
npm run build
```

### Publishing changes

`main` is the live site. Every change to `main` is published automatically within a couple of minutes.

The workflow for changes:

1. Create a branch: `git switch -c endometriosis-content`
2. Edit and save files, and check them with `npm run dev`.
3. Commit: `git add -A && git commit -m "Add verified stats to endometriosis page"`
4. Push and open a pull request: `git push -u origin endometriosis-content`, then `gh pr create`
5. GitHub test-builds the pull request (the **Check pull request** workflow). If it's green, review and merge it on GitHub.
6. Merging publishes the site (the **Deploy to GitHub Pages** workflow).
7. Back on your computer: `git switch main && git pull`

You can see each build's progress and results in the repository's **Actions** tab.

---

## Under the hood (for the curious)

- `src/content.config.ts` holds the rules each content file must follow (the "schemas").
- `src/pages/` holds the page templates. File names map to web addresses.
- `src/components/` holds reusable pieces: stat callouts, the Lifeline box, the timeline, sources.
- `src/layouts/Base.astro` is the shared page shell (header, footer).
- `src/styles/global.css` holds the design. Colours, fonts, sizes and spacing are set once at the top ("design tokens"), so the whole look can be adjusted there.
- Fonts (Newsreader for headings, Inter for body text) are set in `astro.config.mjs`. They're downloaded at build time and served from this site.
- `src/lib/placeholder-plugins.mjs` contains the placeholder highlighting and the end-of-build report.
- `.github/workflows/` holds the automated build and deploy steps.
