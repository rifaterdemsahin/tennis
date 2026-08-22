# Cambridge Learners Tennis

Public, anonymous site for a small group of **adult tennis learners in Cambridge**.

Live (after GitHub Pages is on): **https://rifaterdemsahin.github.io/tennis/**

## What this is

Informal coordination: courts, roles, and a Saturday-first calendar.  
It is **not** a club, and it does **not** publish personal data.

## Pages

| Page | Purpose |
|------|---------|
| `index.html` | How the group works |
| `courts.html` | Jesus Green, Christ’s Pieces, St Ives Outdoor, Lammas Land |
| `players.html` | Anonymised roles (no names or phones) |
| `calendar.html` | Coordination calendar (Aug–Sep 2026 pattern) |

## Privacy

Chat logs used as source material were converted to English and reduced to essence. **Not published:** real names, WhatsApp handles, phone numbers, home postcodes, door/gate codes, children’s names.

## GitHub Pages

This repo is served from the `main` branch, `/` (root).

1. GitHub → Settings → Pages → Source: **Deploy from a branch**
2. Branch: `main` / folder: `/ (root)`
3. Save. Site appears at `https://<user>.github.io/tennis/`

A workflow in `.github/workflows/pages.yml` also enables Pages via Actions.

## Local

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8080
open -a "Google Chrome" http://localhost:8080
```
