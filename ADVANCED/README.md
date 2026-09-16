# 🚀 Advanced DataWeave Question & Answer Bank

A structured, interview-ready and project-oriented DataWeave learning library.

This directory is designed to move from **syntax → problem solving → enterprise transformations → expert integration scenarios**.

## 📚 What is included

| Section | Purpose |
|---|---|
| `001-production-transformations.md` | Production-style transformation patterns |
| `002-enterprise-api-transformations.md` | Enterprise/API integration scenarios |
| `011-original-advanced-practice-set.md` | Original advanced practice questions |
| `012-original-advanced-practice-set-2.md` | Additional original advanced scenarios |
| `013-advanced-2025-inspired-practice.md` | 57 original 2025-inspired expert exercises |
| `questions-00001-00250.md` | Large advanced practice bank |
| `questions-00251-00500.md` | Large advanced practice bank |
| `questions-00501-00750.md` | Large advanced practice bank |
| `questions-00751-01000.md` | Large advanced practice bank |

## 🎯 Core DataWeave skills covered

### Collections
- `map`
- `filter`
- `filterObject`
- `mapObject`
- `pluck`
- `reduce`
- `groupBy`
- `distinctBy`
- `orderBy`
- `flatten`
- `flatMap`
- `some`
- `every`

### Objects & selectors
- dynamic object keys
- nested selectors
- `keysOf`
- `valuesOf`
- `entriesOf`
- object merge/removal
- immutable updates

### Data formats
- JSON
- XML
- XML namespaces
- XML attributes
- CSV
- fixed-width text
- Base64
- form-urlencoded data

### Enterprise transformation patterns
- joins and reconciliation
- validation reports
- banking transactions
- account summaries
- error contracts
- audit events
- schema comparison
- deduplication by business key
- contract-safe API responses

## 🧠 Advanced language concepts

The expert material also demonstrates:

- `read()` and `write()`
- type-based `match`
- regex validation and extraction
- explicit coercion
- date/time conversion
- timezone-aware transformations
- local variables and functions
- accumulator-based `reduce`
- null/missing/empty handling
- metadata-driven transformations

## 🏦 Real-world focus

Examples are intentionally based on situations developers encounter in integration projects:

- banking and account APIs
- transaction reconciliation
- customer data normalization
- legacy CSV/mainframe data
- XML/SOAP responses
- API contract protection
- sensitive-field handling
- audit and change tracking

## 🧪 How to practice

For every question:

1. Read the requirement.
2. Write the transformation yourself.
3. Run it in Anypoint Studio/DataWeave Playground.
4. Test normal input.
5. Test `null` and missing fields.
6. Test empty arrays/objects.
7. Test invalid values.
8. Compare the expected output.
9. Refactor repeated logic into functions.
10. Explain the solution as if answering an interview question.

## 🔐 Production-quality checklist

Before using a transformation in a real API, check:

- [ ] Correct input and output MIME types
- [ ] Null and missing-field behavior
- [ ] Explicit type coercion
- [ ] Date/time format and timezone
- [ ] Duplicate/business-key rules
- [ ] Empty input behavior
- [ ] Error contract
- [ ] Sensitive-field exposure
- [ ] Performance for large arrays
- [ ] Readability and maintainability
- [ ] Reusable functions for repeated business rules
- [ ] Unit/functional test coverage

## ⚠️ Copyright / learning-material policy

Some external DataWeave articles are useful as **topic references**, but this repository should contain original educational material unless redistribution rights are available. The files marked as original are independently written exercises rather than copied third-party question banks.

The new `013-advanced-2025-inspired-practice.md` chapter was created from the **topic areas** of the referenced 2025 practice article, while using original scenarios, wording, examples, answers, and explanations.

## 📈 Suggested learning progression

```text
DataWeave Basics
      ↓
Selectors + map/filter/pluck
      ↓
groupBy + distinctBy + reduce
      ↓
Nested transformations + joins
      ↓
Validation + error contracts
      ↓
JSON/XML/CSV + MIME handling
      ↓
Namespaces + regex + coercion
      ↓
Enterprise reconciliation
      ↓
Banking/API production scenarios
      ↓
Expert DataWeave design
```

## 🔗 Repository

This advanced library is part of the main **Dataweave-questions-answers** project. Keep examples executable, explanations beginner-friendly, and advanced scenarios production-oriented.
