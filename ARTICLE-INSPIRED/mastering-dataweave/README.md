# Mastering DataWeave — Practice & Learning Path

This section expands the skill areas covered by the public Medium article **“Mastering DataWeave: Solved Questions for Skill Enhancement”** by Debu Singh into an original, beginner-friendly learning path.

> **Important:** This repository does not reproduce the article's original questions, inputs, outputs, or scripts verbatim. The exercises here are independently written practice problems covering the same broad concepts.

## What you will learn

- XML element and attribute selectors
- Strings and `dw::core::Strings`
- substring extraction
- `map`, `filter`, `groupBy`, `mapObject`, `pluck`, and `orderBy`
- dynamic object keys
- flat-to-hierarchical transformations
- enrichment from a second collection
- CSV transformations
- XML filtering and reusable functions
- date parsing and chronological sorting
- recursive transformations
- type casting and null/default handling
- edge-case thinking and production considerations

## Recommended study order

1. Read `PRACTICE.md` without opening the answers.
2. Write your own DataWeave solution.
3. Run it in a MuleSoft/DataWeave runtime.
4. Compare with `ANSWERS.md`.
5. Try the edge cases in `EDGE-CASES.md`.
6. Explain each solution aloud as if answering an interview question.
7. Reimplement at least three solutions using a different valid approach.

## Files

| File | Purpose |
|---|---|
| `PRACTICE.md` | 10 original challenge questions |
| `ANSWERS.md` | Complete solutions with explanations |
| `EDGE-CASES.md` | Negative tests and production-oriented cases |
| `INTERVIEW.md` | Interview questions and model answers |
| `CHEATSHEET.md` | Quick reference for the operators used |

## Skill map

| Question | Main concepts |
|---|---|
| Q1 | XML selectors, attributes |
| Q2 | String functions |
| Q3 | substring selectors, `groupBy` |
| Q4 | dynamic keys, `map` |
| Q5 | grouping, nested arrays |
| Q6 | enrichment, `filter`, `orderBy` |
| Q7 | `groupBy`, `mapObject` |
| Q8 | XML, functions, filtering, casting |
| Q9 | Date parsing, `orderBy` |
| Q10 | pattern matching, recursion, `mapObject` |

## Official learning resources

Use the official MuleSoft DataWeave documentation and tutorials for syntax verification and deeper study. The official tutorial repository covers fundamentals, selectors, variables, functions, lambdas, and common functions such as `filter`, `groupBy`, `map`, `mapObject`, `pluck`, and `reduce`.

Reference article: Debu Singh, *Mastering DataWeave: Solved Questions for Skill Enhancement*, published December 30, 2024.
