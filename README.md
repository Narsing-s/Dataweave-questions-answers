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

## 🌍 Public launch & community

This project is prepared for public use as an open-source DataWeave learning platform.

- **Source and contributions:** GitHub
- **Interactive site:** Vercel or GitHub Pages
- **Versioned distribution:** GitHub Releases
- **Community:** GitHub Issues/Discussions and developer communities

See [`docs/PUBLIC-LAUNCH.md`](./docs/PUBLIC-LAUNCH.md) for the complete publishing, Vercel deployment, contribution, and community-distribution plan.

### 🤝 Want to contribute?

Contributions are welcome, especially from MuleSoft and DataWeave developers who can bring real integration, interview, debugging, performance, and production experience.

**Recommended path:**

**Discussion → validated idea → Issue → Pull Request → review → merge → contributor recognition**

Use Discussions for questions, brainstorming, learning conversations, and new-topic proposals. Use Issues for confirmed bugs and scoped work. Use Pull Requests for concrete repository changes.

Good first contributions include:

- finding an incorrect expected output;
- reporting a duplicate or overlapping concept;
- improving an explanation or edge-case note;
- runtime-testing an existing example;
- improving documentation or navigation;
- proposing a genuinely missing DataWeave concept;
- improving the learning-site UI or validation tooling.

For new questions, **conceptual uniqueness is mandatory**. Renaming values, IDs, business nouns, numbers, ordering, or wording does not create a new concept.

Start here:

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — contribution rules and review standards
- [`SUPPORT.md`](./SUPPORT.md) — where to ask questions and report problems
- [`docs/CONTRIBUTOR-ROADMAP.md`](./docs/CONTRIBUTOR-ROADMAP.md) — beginner-to-maintainer contribution path
- [`docs/PUBLIC-LAUNCH.md`](./docs/PUBLIC-LAUNCH.md) — public distribution and launch strategy

### Deploy the interactive site on Vercel

The project is a browser-based static site and the practice assistant loads `dataset/questions-10000.json` directly in the browser, so a backend is not required for the core learning experience.

1. Open Vercel and choose **Add New → Project**.
2. Import `Narsing-s/Dataweave-questions-answers` from GitHub.
3. Keep the project root as the repository root.
4. For this static repository, no framework-specific build command is required unless Vercel detects one.
5. Deploy and verify `index.html`, `explorer.html`, `practice-bank.html`, and `assistant.html`.
6. After deployment, connect the GitHub repository so future pushes can trigger deployments.

Vercel's current workflow supports importing an existing Git repository from the project creation flow.

**Important:** the dataset is structurally validated, not universally runtime-certified. The public site must not describe all 10,000 examples as runtime-verified.

## ⭐ Critical Interview Bank

[`CRITICAL-INTERVIEW/DATAWEAVE-CRITICAL-60.md`](./CRITICAL-INTERVIEW/DATAWEAVE-CRITICAL-60.md) contains **60 curated critical questions**, deliberately mapped one-to-one to the complete 60-category plan. It focuses on interview-critical concepts, real MuleSoft usage, debugging, API transformations, performance, and output prediction without duplicating the larger practice banks.

### The 60-category coverage

1. DataWeave Fundamentals · 2. Variables and Expressions · 3. Strings · 4. Numbers · 5. Boolean Logic · 6. Arrays · 7. Objects · 8. `map` · 9. `mapObject` · 10. `filter` · 11. `filterObject` · 12. `reduce` · 13. `groupBy` · 14. `orderBy` · 15. `distinctBy` · 16. `pluck` · 17. `some` · 18. `every` · 19. `find` · 20. `findIndex` · 21. `flatten` · 22. `flatMap` · 23. `joinBy` · 24. `splitBy` · 25. `replace` · 26. Regular Expressions · 27. Dates · 28. DateTime · 29. Time · 30. Number Aggregation · 31. `if/else` · 32. `match` · 33. `default` · 34. Null Handling · 35. Type Coercion · 36. Functions · 37. Custom Functions · 38. Lambda Functions · 39. Variables and Scope · 40. Modules · 41. Selectors · 42. Conditional Selectors · 43. Dynamic Selectors · 44. XML Transformation · 45. JSON Transformation · 46. CSV Transformation · 47. Java/Java-like Data · 48. Error Handling · 49. Real-world API Transformations · 50. MuleSoft Interview Questions · 51. Scenario-based Questions · 52. Debugging Questions · 53. Output-prediction Questions · 54. Easy Coding Problems · 55. Medium Coding Problems · 56. Advanced Coding Problems · 57. Production-style Transformations · 58. Performance/Optimization · 59. DataWeave 2.x Interview Questions · 60. Certification-style Practice Questions.

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
