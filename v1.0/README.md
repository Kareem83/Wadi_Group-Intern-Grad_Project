# Wadi Group — Frontend Redesign

A modern, animated single-page website redesign for [Wadi Group](https://www.wadigroup.com/) — Egypt's leading agribusiness company.

## Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, Grid, Flexbox, responsive design
- **JavaScript** — Interactions, scroll observers, smooth navigation
- **Anime.js** — Entrance animations, counters, parallax, wave motion

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Wadi Green | `#668E3D` | Primary brand, accents, CTAs |
| Slate Blue | `#3a4c5f` | Hero overlay, values section |
| Dark Footer | `#222222` | Footer background |

## Getting Started

Open `index.html` in a browser, or run a local server from the `v1.0` folder:

```bash
cd v1.0
python3 -m http.server 8080
```

Then visit `http://localhost:8080`

## Project Structure

```
v1.0/
├── index.html
├── css/style.css
├── js/main.js
├── backend/
│   ├── SETUP.md
│   └── API_PLAN.md
└── assets/
    ├── logo.svg
    └── images/          ← fetched from wadigroup.com
```

## Backend (Laravel)

Backend planning and setup docs are available in:

- `backend/SETUP.md`
- `backend/API_PLAN.md`

After installing PHP + Composer, follow `backend/SETUP.md` to generate and run the Laravel API.
