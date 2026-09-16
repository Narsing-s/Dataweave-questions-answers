# DataWeave Lab Package

## Purpose

This repository can be distributed as a static learning application plus its complete study material.

## Package layout

```text
DataWeave-Lab/
├── index.html
├── explorer.html
├── examples.html
├── lab.html
├── lab-v2.html
├── dataset/
├── EASY/
├── MEDIUM/
├── ADVANCED/
├── MASTERING-DATAWEAVE/
├── docs/
├── scripts/
├── .github/
├── README.md
├── PACKAGE.md
└── RELEASE.md
```

## Browser package

The browser application is static. No backend is required for the Explorer itself. The question bank is loaded from `dataset/questions-10000.json` using a relative URL, so it should be served over HTTP(S), such as GitHub Pages, rather than opened directly with `file://`.

## Developer package

Python is used only for dataset generation and validation. The learning site itself does not require Python, Node.js, a database, or Mule runtime.

## Package verification

Before distribution:

```bash
python scripts/generate_10000.py
python scripts/validate_examples.py
```

Then serve the repository as a static site and test:

- navigation
- search
- difficulty filters
- topic filters
- pagination
- random
- copy
- hide/show
- practice
- challenge
- share/deep links
- mobile layout
- dataset loading

## Security and content note

The repository is educational content. Never place credentials, private banking data, API keys, customer PII, or production secrets in examples.
