# DataWeave Lab — Questions, Answers & 10,000 Examples

A practical, open learning library for MuleSoft DataWeave developers built around one workflow:

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

The main explorer is `explorer.html` and supports:

- Easy / Medium / Advanced navigation
- Topic buttons and topic dropdown
- Full-text search across question, code, input, output and explanation
- 10 / 25 / 50 questions per page
- Pagination with disabled edge controls
- Random question
- Copy DataWeave with visual confirmation
- Hide/show reference solutions
- Practice-this challenge mode
- Challenge mode with reference solution, output and interview tip
- Shareable question links
- URL-based topic/level/search/challenge routing
- Mobile responsive layout
- Loading, empty and dataset-error states

## 📚 Read the questions directly in GitHub

- [Easy Q&A](./EASY/README.md)
- [Medium Q&A](./MEDIUM/README.md)
- [Advanced Q&A](./ADVANCED/README.md)
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

### 🔴 Advanced — production-style practice

19. Complex nested transformations
20. Dynamic keys and object construction
21. Dates, DateTime and business periods
22. Null/empty/error edge cases
23. Aggregations and normalization
24. API metadata and error responses
25. Database/file/MQ-oriented mappings
26. Performance and maintainability considerations
27. Interview coding and output-prediction problems
28. Real-world MuleSoft scenarios

See [`docs/LEARNING-PATH.md`](./docs/LEARNING-PATH.md) for the complete beginner-to-advanced workflow.

## 🛠️ Regenerate and validate

```bash
python scripts/generate_10000.py
python scripts/validate_examples.py
```

The generated outputs include the structured dataset and readable Easy/Medium/Advanced Markdown banks. GitHub Actions also runs the generation/validation workflow.

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

Static validation does **not** prove that every transformation executes successfully on every Mule/DataWeave runtime. See [`docs/QUALITY-AND-VERIFICATION.md`](./docs/QUALITY-AND-VERIFICATION.md) for the verification model and production-use checklist.

Curated questions should follow [`docs/QUESTION-STANDARD.md`](./docs/QUESTION-STANDARD.md), including distinct concepts, reproducible input/output, edge cases, and honest runtime/version notes.

## 🏗️ Repository structure

```text
.
├── index.html
├── explorer.html
├── examples.html
├── lab.html
├── lab-v2.html
├── auth.js
├── EASY/
├── MEDIUM/
├── ADVANCED/
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
