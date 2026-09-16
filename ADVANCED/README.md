# 🚀 Advanced DataWeave Question & Answer Bank

A structured **DataWeave 2.x learning, practice, and interview repository** covering beginner foundations through enterprise-grade transformations.

> The repository combines original exercises, practical MuleSoft integration scenarios, interview preparation, and format-specific DataWeave examples. Third-party articles are used as topic references; their copyrighted question sets are not reproduced verbatim.

## 📚 Advanced learning path

| Stage | Focus | Recommended files |
|---|---|---|
| 1 | Production transformation patterns | `001-production-transformations.md` |
| 2 | Enterprise API transformations | `002-enterprise-api-transformations.md` |
| 3 | Original advanced practice | `011-original-advanced-practice-set.md` |
| 4 | Advanced practice expansion | `012-original-advanced-practice-set-2.md` |
| 5 | Expert formats & language features | `013-original-expert-practice-set-3.md` |
| 6 | Core operator interview practice | `014-original-medium-part2-inspired-practice.md` |
| 7 | Large practice bank | `questions-00001-00250.md` through `questions-00751-01000.md` |

## 🧠 Core DataWeave operators covered

- `map`
- `mapObject`
- `filter`
- `filterObject`
- `groupBy`
- `distinctBy`
- `orderBy`
- `reduce`
- `pluck`
- `flatten`
- `flatMap`
- `some`
- `every`
- object selectors and dynamic keys
- date/time transformations
- regex and String processing
- XML namespaces and attributes
- CSV and fixed-width data
- Base64 and format conversion
- `read()` / `write()`
- `match`
- `update`
- validation and error-contract transformations

## 🏦 Real-world domains

Examples are intentionally based on practical integration scenarios such as:

- banking and account APIs
- customer data
- transactions and statements
- payments
- employee data
- orders
- API response normalization
- legacy CSV/XML systems
- audit and reconciliation
- error handling
- enterprise integrations

## 🎯 How to practice

For every question:

1. Read only the requirement.
2. Predict the output shape.
3. Write the DataWeave expression yourself.
4. Run it in Anypoint Studio/DataWeave Playground.
5. Test null, empty, duplicate, and malformed cases.
6. Compare with the reference answer.
7. Refactor the solution for readability and maintainability.

## 🧪 Production-quality checklist

Before using a transformation in a Mule application:

- Confirm the input MIME type.
- Confirm whether the root value is an Array, Object, String, Binary, or XML structure.
- Handle null and missing fields deliberately.
- Use explicit type coercion where source formats are text-based.
- Protect identifiers that contain leading zeroes.
- Avoid leaking internal fields into API responses.
- Validate date/time formats and timezones.
- Test duplicate handling before `distinctBy`.
- Test secondary sorting behavior.
- Verify accumulator initialization for `reduce`.
- Test empty arrays and unexpected values.
- Keep transformations readable rather than unnecessarily clever.
- Validate against the DataWeave version supported by the target Mule runtime.

## 🎤 Interview preparation

The advanced section is designed to help answer questions such as:

- When should I use `map` versus `mapObject`?
- When should I use `filter` versus `filterObject`?
- What does `groupBy` return?
- How does `distinctBy` decide which record is unique?
- How can sorting be made deterministic?
- How does a `reduce` accumulator work?
- How do I process XML attributes and namespaces?
- How do I convert CSV, JSON, XML, and text representations?
- How do I handle null and missing values safely?
- How do I build reusable DataWeave functions?
- How do I design transformations that are safe for production APIs?

## 📖 Source-inspired documentation

The repository includes original learning material inspired by publicly available DataWeave practice articles. For example, the September 21, 2024 Medium article by AMRENDRA KUMAR covers `map`, `mapObject`, `filter`, `filterObject`, `groupBy`, `distinctBy`, `orderBy`, and `reduce`. The repository's corresponding chapter teaches those concepts through newly authored scenarios rather than copying the article's text or examples.

## 🗂️ File naming convention

- `001-*`, `002-*` — structured advanced reference chapters
- `011-*`, `012-*`, `013-*`, `014-*` — original practice expansions
- `questions-00001-00250.md` etc. — numbered large practice bank

## ⭐ Recommended progression

**Beginner → Intermediate → Advanced → Expert → Production**

Do not memorize answers. Understand why the operator is selected, what type it accepts, what it returns, and how it behaves for edge cases.

---

### Official learning resource

For hands-on execution, use MuleSoft's official DataWeave learning/playground resources and validate transformations against the DataWeave version used by your Mule runtime.
