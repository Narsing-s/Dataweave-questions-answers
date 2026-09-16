# DataWeave Lab — Questions, Answers & 10,000 Examples

A practical, self-contained learning library for MuleSoft DataWeave developers built around one workflow:

**Question → Input → DataWeave Answer → Expected Output → Explanation → Common Mistakes → Interview Tip**

## 🚀 What is included

The repository contains an ordered **10,000-record DataWeave practice bank**, with IDs `DW-00001` through `DW-10000`, plus separately maintained readable examples in Easy, Medium, and Advanced folders.

Each structured record contains:

- Question
- Difficulty
- Topic
- Input
- DataWeave 2.x answer
- Expected output
- Explanation
- Common mistakes / edge cases
- Interview tip

The 10,000-record bank is generated and structurally validated. Individual transformations should still be runtime-tested against the DataWeave/Mule runtime used in a real project. Hand-authored examples demonstrate the intended quality and learning style.

The curated `REAL-QA` bank is maintained separately so interview and learning questions remain readable, intentionally authored, and conceptually distinct.

## 🌐 Interactive learning site

Open `index.html` for the account page, then continue to **Explorer** after authentication.

The browser-only learning account supports:

- Unique username per browser
- Unique email per browser
- Username + email + password required for login
- Duplicate account rejection
- Account deletion after credential verification
- Logout and session clearing
- No account creation during login

The account model is intentionally backend-free. It is suitable for a learning/demo site, not sensitive production authentication. See [`docs/ACCOUNT-SECURITY.md`](./docs/ACCOUNT-SECURITY.md).

### Practice Assistant

[`assistant.html`](./assistant.html) is a working, backend-free practice assistant. It loads the repository's local 10,000-question dataset in the browser and searches for the closest examples. It is intentionally transparent: it does not claim to be a remote generative AI service.

### 10,000 Practice Bank

The dedicated [`practice-bank.html`](./practice-bank.html) page provides a focused interface for the complete generated dataset:

- Search all 10,000 records by `DW-xxxxx`, question, topic, DataWeave code, input, output, or explanation
- Filter by **Easy / Medium / Advanced**
- Filter by topic
- Choose 10 / 25 / 50 / 100 records per page
- Open any record through its ID/search result
- See **Input → DataWeave → Expected Output → Explanation** together
- Read common mistakes and interview tips
- Hide/show reference DataWeave
- Copy DataWeave code
- Open a question in a dedicated practice/challenge view before revealing the solution
- Copy a shareable URL for a specific `DW-xxxxx` record
- Responsive layout for desktop and mobile
- Dataset loading, validation, empty-result, and retry states

The page reads `dataset/questions-10000.json` directly in the browser, so no backend service is required.

The main explorer is `explorer.html` and supports:

- Easy / Medium / Advanced navigation
- Topic buttons and topic dropdown
- Full-text search across question, code, input, output and explanation
- 10 / 25 / 50 / 100 questions per page
- Pagination with disabled edge controls
- Random question
- Copy DataWeave with visual confirmation
- Hide/show reference solutions
- Practice-this challenge mode
- Challenge mode with reference solution, output and interview tip
- Shareable question links
- Practice Assistant navigation
- URL-based topic/level/search/challenge routing
- Mobile responsive layout
- Loading, empty and dataset-error states

## 📚 Read and learn directly in GitHub

- [10,000 Practice Bank UI](./practice-bank.html)
- [Practice Assistant](./assistant.html)
- [Easy Q&A](./EASY/README.md)
- [Medium Q&A](./MEDIUM/README.md)
- [Advanced Q&A](./ADVANCED/README.md)
- [Curated real Q&A index](./REAL-QA/INDEX.md)
- [Curated Q&A coverage matrix](./docs/REAL-QA-COVERAGE.md)
- [Feature guide](./docs/FEATURES.md)
- [Visual learning diagrams](./docs/DIAGRAMS.md)
- [Practice mode guide](./docs/PRACTICE-MODE.md)
- [All structured records](./dataset/questions-10000.json)
- [Complete learning path](./docs/LEARNING-PATH.md)
- [Interactive user guide](./docs/USER-GUIDE.md)
- [Account security model](./docs/ACCOUNT-SECURITY.md)
- [Question quality standard](./docs/QUESTION-STANDARD.md)
- [Quality and verification guide](./docs/QUALITY-AND-VERIFICATION.md)
- [Product roadmap](./docs/PRODUCT-ROADMAP.md)
- [Release checklist](./docs/RELEASE-CHECKLIST.md)
- [Package guide](./PACKAGE.md)
- [Release readiness](./RELEASE.md)

## 🧭 Recommended learning path

### 🟢 Easy — build the foundation

1. DataWeave script structure
2. `payload` and selectors
3. Objects and arrays
4. Strings and string functions
5. Numbers and arithmetic
6. `if / else`
7. `default`, `null`, and type checks
8. Basic `map` and `filter`

### 🟡 Medium — become productive

9. Nested objects and arrays
10. `map`, `filter`, `reduce`
11. `flatten` and nested collections
12. `distinctBy`, `groupBy`, `orderBy`
13. `mapObject` and `filterObject`
14. `pluck`, keys and values
15. Type conversion
16. JSON/XML/CSV mappings
17. API request/response transformations
18. Reusable functions and business rules
19. `do` / `using` local scopes and conditional fields

### 🔴 Advanced — production-style practice

20. Complex nested transformations
21. Dynamic keys and object construction
22. `update` and `match`
23. Dates, DateTime, LocalDateTime and business periods
24. Null/empty/error edge cases
25. Aggregations, normalization and reconciliation
26. API metadata, validation and error responses
27. Database/file/MQ-oriented mappings
28. XML namespaces and complex XML structures
29. Regex extraction and validation
30. Performance and maintainability considerations
31. Idempotency, duplicate resolution and deterministic business keys
32. Interview coding and output-prediction problems
33. Real-world MuleSoft scenarios

See [`docs/LEARNING-PATH.md`](./docs/LEARNING-PATH.md) for the complete beginner-to-advanced workflow.

## 🛠️ Regenerate and validate

```bash
python scripts/generate_10000.py
python scripts/validate_examples.py
python scripts/check-real-qa-duplicates.py
python scripts/quality-audit.py
```

The generated outputs include the structured dataset and readable Easy/Medium/Advanced Markdown banks. GitHub Actions also runs repository validation and the curated Q&A duplicate check.

The duplicate checker catches exact normalized question-title duplicates. It does not replace conceptual review; changing only names, IDs, numbers, or wording is still considered a duplicate when the underlying transformation objective is unchanged.

The repository quality audit additionally checks the 10,000-record count, sequential IDs, required fields, DataWeave headers, duplicate normalized questions and required UI entry pages. It deliberately does not claim runtime execution.

## 📦 Packaging and releases

Project version is stored in `VERSION`. Release history is tracked in `CHANGELOG.md`.

The repository includes a repeatable GitHub Actions release workflow that validates the dataset, creates a versioned ZIP package, creates a SHA-256 checksum, and can publish a GitHub Release when a `vMAJOR.MINOR.PATCH` tag is pushed.

See:

- [`PACKAGE.md`](./PACKAGE.md)
- [`RELEASE.md`](./RELEASE.md)
- [`docs/RELEASE-CHECKLIST.md`](./docs/RELEASE-CHECKLIST.md)

## 🧪 Quality rules

The repository checks the structured bank for:

- exactly 10,000 records
- sequential IDs
- required fields
- supported difficulty values
- DataWeave script headers
- readable Markdown banks for all three levels
- exact normalized duplicate question titles in `REAL-QA`

Static validation does **not** prove that every transformation executes successfully on every Mule/DataWeave runtime. See [`docs/QUALITY-AND-VERIFICATION.md`](./docs/QUALITY-AND-VERIFICATION.md) for the verification model and production-use checklist.

Curated questions should follow [`docs/QUESTION-STANDARD.md`](./docs/QUESTION-STANDARD.md), including distinct concepts, reproducible input/output, edge cases, and honest runtime/version notes.

## 🏗️ Repository structure

```text
.
├── index.html
├── explorer.html
├── practice-bank.html
├── assistant.html
├── examples.html
├── lab.html
├── lab-v2.html
├── auth.js
├── EASY/
├── MEDIUM/
├── ADVANCED/
├── REAL-QA/
├── ARTICLE-INSPIRED/
├── MASTERING-DATAWEAVE/
├── dataset/
├── docs/
├── scripts/
├── VERSION
├── CHANGELOG.md
├── PACKAGE.md
├── RELEASE.md
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
└── .github/workflows/
```

## 🤝 Contribution standard

New curated questions should contain a meaningful problem, realistic synthetic input, valid DataWeave, deterministic expected output, a clear explanation, edge-case guidance, and interview value. Avoid changing only numbers/names while teaching the same concept repeatedly. See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## 🔐 Safety

Use synthetic data only. Never commit credentials, tokens, private keys, production database strings, or real customer/account information. See [`SECURITY.md`](./SECURITY.md).

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
