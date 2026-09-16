# DataWeave Lab — Feature Guide

This repository is designed as a complete self-contained DataWeave learning and practice site.

## 1. Account

- `index.html` is the entry page.
- The browser-only account supports create, login, logout and credential-verified deletion.
- A login attempt never creates an account.
- Credentials are local browser data only; this is not production authentication.

## 2. Explorer

`explorer.html` opens the authenticated learning experience.

Available operations include:

- Easy / Medium / Advanced navigation
- topic filtering
- full-text search
- pagination
- random question
- challenge mode
- copy DataWeave
- hide/show solutions
- shareable question links
- mobile layout

## 3. 10,000 Practice Bank

`practice-bank.html` is the focused dataset browser. Every record is identified by `DW-xxxxx` and exposes the question, difficulty, topic, input, DataWeave, output, explanation, common mistakes and interview guidance where available.

## 4. Practice Assistant

`assistant.html` is a local, backend-free assistant. It searches `dataset/questions-10000.json` in the browser and returns the closest worked examples. It intentionally does not pretend to be a remote generative AI model.

## 5. Learning content

The repository separates:

- Easy fundamentals
- Medium productivity patterns
- Advanced production-style transformations
- Curated `REAL-QA`
- Article-inspired learning material
- Mastering DataWeave reference material

## 6. Recommended study loop

```text
Learn concept
   ↓
Read worked example
   ↓
Hide solution
   ↓
Write your own DataWeave
   ↓
Compare with expected output
   ↓
Review edge cases
   ↓
Repeat with a harder question
```

## 7. Quality model

Static checks verify structure and repository integrity. They do not claim that every generated transformation has been executed by every Mule/DataWeave runtime.

Use the runtime verification guidance in `docs/QUALITY-AND-VERIFICATION.md` when promoting an example to production use.

## 8. Privacy and safety

Use synthetic data. Do not place customer records, credentials, tokens, private keys, production URLs or confidential business information in examples, issues or pull requests.
