# Cambridge Learners Tennis

Public, anonymous site for a small group of **adult tennis learners in Cambridge**.

Live (after GitHub Pages is on): **https://rifaterdemsahin.github.io/tennis/**

Languages (top bar, remembered in the browser): English, Türkçe, Español, Deutsch, Italiano, 中文.

## What this is

Informal coordination: courts, roles, and a Saturday-first calendar.  
It is **not** a club. Contribute: [fork the repo](https://github.com/rifaterdemsahin/tennis) and send a pull request.

A live Open-Meteo forecast for Christ's Pieces lives on `weather.html`. Saturday 07:00 Europe/London reports (through 31 Dec 2026) go to the organiser inbox with a WhatsApp paste — member emails stay out of this public repo.

## Pages

| Page | Purpose |
|------|---------|
| `enter.html` | How to enter: council sign, LTA search, Codelocks keypad |
| `learn.html` | Starter guide, gate keypad, YouTube basics |
| `shop.html` | Amazon UK kit list (racket, balls, shoes) |
| `parking.html` | Petersfield Mansions CB1 1BB, ring 50, walk to Christ's Pieces |
| `kids.html` | Bring your kids — watch, practice, collect balls, talk |
| `index.html` | How the group works |
| `courts.html` | Home court: [Christ's Pieces](https://maps.app.goo.gl/mUtgDr8j7FgAicJx7) |
| `book.html` | Play Tennis app walkthrough — £3 / 45 min, Saturdays on Erdem |
| `players.html` | Roles (Erdem named only as Saturday payer) |
| `calendar.html` | Coordination calendar |
| `weather.html` | Cambridge forecast, year remaining, Saturday play call |

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
