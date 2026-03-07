# Profit Diagnostic

Find Your Restaurant's #1 Bottleneck.

A 10-question diagnostic tool that identifies a restaurant's primary constraint using the Restaurant Money Model's six-layer sequence: Demand, Capacity, Experience, Behavior, Economics, and Profit.

**Live site:** [https://saidkhan005.github.io/profit-diagnostic/](https://saidkhan005.github.io/profit-diagnostic/)

---

## Project Structure

```
profit-diagnostic/
├── src/
│   ├── css/                  # Source stylesheets (8 files)
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── cta.css
│   │   ├── quiz.css
│   │   ├── results.css
│   │   ├── navigation.css
│   │   └── responsive.css
│   ├── partials/             # HTML partials (9 files)
│   │   ├── head.html
│   │   ├── body-open.html
│   │   ├── navigation.html
│   │   ├── hero.html
│   │   ├── how-it-works.html
│   │   ├── quiz.html
│   │   ├── results.html
│   │   ├── faq.html
│   │   └── footer.html
│   ├── js/
│   │   └── diagnostic.js     # Quiz logic, scoring, results
│   └── build.js
├── docs/                     # Built output (GitHub Pages)
│   ├── index.html
│   ├── css/
│   └── js/
├── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (any recent version)

### Build

```bash
npm run build
```

### Preview Locally

```bash
npx serve docs
```

## Making Changes

1. Edit HTML partials in `src/partials/`
2. Edit styles in `src/css/`
3. Run `npm run build`
4. Commit and push to deploy via GitHub Pages

## Hosting

Hosted on GitHub Pages, serving from the `docs/` folder on the `main` branch.
