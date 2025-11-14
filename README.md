# Sudoku Arcade

> Xihao Liu — CS5610 Web Development

A small, static Sudoku-style website built for CS5610 — **HTML + CSS only** (no JS, no frameworks).
Live site: https://pages.github.khoury.northeastern.edu/xihao/Sudoku-cs5610asmt1/

## Overview

The site is a mock Sudoku hub with multiple pages and consistent navigation. It focuses on semantic HTML, organized folders, responsive layout, and basic accessibility.

### Pages

- **Home** – Intro, quick links to all sections.
- **Selection** – A table of (fictional) game titles and authors; links route to *Hard*.
- **Hard (9×9)** – A 9×9 board with proper 3×3 subgrids, numeric inputs (1–9), and a fake timer label. Prefilled “given” cells are disabled.
- **Easy (6×6)** – A 6×6 board with 2×3 subgrids, numeric inputs (1–6), and a fake timer label. Includes disabled given cells.
- **Rules** – Basic rules, tips, and a “Made by / Credits” section with contact links and school logo.
- **High Scores** – Static leaderboard (usernames + completed counts).
- **Login** – Username + password (type=password) + submit button (non-functional).
- **Register** – Username + password + verify password + submit button (non-functional).

## Tech & Constraints

- **HTML + CSS only** (no JavaScript, no CSS libraries, no React/Vue/Bootstrap).
- Semantic structure with labels, alt text, and ARIA where useful.
- Mobile-first responsive design using **Flex** and **Grid** + `@media` queries.
- Navigation is **sticky** at the top with a clear “current page” state.

## Project Structure

```
/
├─ index.html                 # Home (root has index.html; no .html in URLs)
├─ selection/
│  └─ index.html
├─ game-hard/
│  ├─ index.html
│  └─ game-hard.css
├─ game-easy/
│  ├─ index.html
│  └─ game-easy.css
├─ rules/
│  ├─ index.html
│  └─ rules.css
├─ high-scores/
│  ├─ index.html
│  └─ high-scores.css
├─ login/
│  ├─ index.html
│  └─ login.css
├─ register/
│  ├─ index.html
│  └─ register.css
└─ assets/
   ├─ css/
   │  ├─ common.css           # shared site styles (navbar, typography, footer, etc.)
   │  └─ home.css             # homepage hero & card grid
   ├─ img/
   │  ├─ Sudoku.svg           # favicon + branding mark
   │  └─ logo.png             # school logo for Rules page (optional)
   └─ fonts/
      └─ cheltenham-normal-300.woff2   # brand wordmark font (navbar left)
```

## Notable Implementation Details

- **Navbar**
  - `position: sticky; top: 0;` keeps it visible while scrolling.
  - Active page is highlighted with higher contrast (accent outline / brighter background).
  - Keyboard & screen-reader friendly; you can add `aria-current="page"` on the active link.
- **Boards (Hard/Easy)**
  - Use `<table>` with `table-layout: fixed` and inputs sized with `aspect-ratio: 1/1` for perfect squares.
  - Inputs use `type="number"` with `min/max/step` and `inputmode="numeric"` to prefer numeric keyboards and constrain values.
  - Disabled **given** cells are styled differently.
- **Accessibility**
  - Form fields are paired with `<label>`.
  - Images include `alt=""` (decorative) or descriptive alt text.
  - Inputs on the boards have `aria-label="rNcM"` for non-visual navigation.
- **Mobile Friendly**
  - Flexible layouts (Flex/Grid), wrapped nav, responsive paddings, and tighter nav spacing on small screens.
  - Images and SVGs scale (`max-width: 100%`).
  - Larger tap targets for buttons/inputs on phones.
- **Branding**
  - Site title: **Sudoku Arcade**.
  - Favicon: `assets/img/Sudoku.svg` (and referenced in each page’s `<head>`).
  - Navbar brand wordmark uses custom font **Cheltenham** (preloaded on Home).

## CSS Feature Checklist (per assignment)

- `font-family`, `background(-color)`, `margin`, `padding`, `position`
- `align-items` / `text-align`, **flex**, **grid**, `@media` queries
- At least two pseudo-elements/pseudo-classes: `:hover`, `:focus-visible`, `:invalid`, `::after` (used for nav underline animation)
- `transition` / `transform` used for nav underline and subtle button hover
- No usage of `!important`.

## Credits

- Brand font: *Cheltenham* (local file in `assets/fonts/`, used for brand wordmark).
- Icons/Images: **Sudoku.svg** favicon is adapted from the favicon used on the New York Times Sudoku site (https://www.nytimes.com/puzzles/sudoku), for educational use in this assignment. **logo.png** is the Northeastern University logo used on the Rules page.
- Everything else is original HTML/CSS written for this assignment.

## Author

**Xihao Liu** — CS5610 Web Development
Contact links are listed on the **Rules** page (email, GitHub, LinkedIn).