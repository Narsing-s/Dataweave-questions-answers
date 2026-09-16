# DataWeave Lab — Complete Learning Path

This path is designed so a beginner can start at the first section and progress toward production-style MuleSoft transformations.

## 1. Easy — Learn the language

Start here if DataWeave syntax is new.

1. Script structure: `%dw 2.0`, `output`, `---`
2. `payload`, variables and selectors
3. Objects and arrays
4. Strings and string functions
5. Numbers and arithmetic
6. Comparisons and `if / else`
7. `null`, `default` and type checks
8. Basic `map` and `filter`
9. Basic object construction
10. Input → output prediction

Goal: write and explain small transformations without copying a solution.

## 2. Medium — Become productive

Move here after the Easy material feels comfortable.

1. Nested objects and arrays
2. `map`, `filter`, `reduce`
3. `flatten` and nested collections
4. `distinctBy`, `groupBy`, `orderBy`
5. `mapObject` and `filterObject`
6. `pluck`, `keysOf`, `valuesOf`
7. Type coercion and formatting
8. JSON/XML/CSV mappings
9. API request and response mappings
10. Reusable functions and business rules
11. Null/empty edge cases
12. Output-prediction questions

Goal: solve common integration transformations independently.

## 3. Advanced — Production-style reasoning

Use this section for interviews and real integration scenarios.

1. Complex nested transformations
2. Dynamic object keys
3. Dates and DateTime
4. Aggregation and normalization
5. Conditional business rules
6. API metadata and error responses
7. Database/file/MQ-oriented mappings
8. Recursive and reusable patterns
9. Performance and maintainability
10. Debugging incorrect transformations
11. Production edge cases
12. Interview coding challenges

Goal: explain not only what code works, but why it works, its edge cases, and how you would maintain it in a MuleSoft application.

## 4. Recommended practice loop

For every question:

```text
Read the problem
      ↓
Inspect the input
      ↓
Predict the output
      ↓
Write DataWeave yourself
      ↓
Compare with reference
      ↓
Read explanation
      ↓
Check common mistakes
      ↓
Rewrite without looking
```

## 5. How to use the repository

- Use `index.html` as the starting page.
- Use `explorer.html` for search, filtering, pagination and challenges.
- Use the `EASY`, `MEDIUM`, and `ADVANCED` Markdown folders when you want to study directly in GitHub.
- Use `dataset/questions-10000.json` when building another learning tool or application.
- Use the scripts only for generation and validation; the published Markdown files are the human-readable learning material.

## 6. When you are ready for interviews

Practice in this order:

```text
Output prediction
      →
Write transformation from input/output
      →
Debug broken DataWeave
      →
Explain null and edge-case behavior
      →
Solve nested collection problems
      →
Solve production-style scenarios
      →
Explain performance and maintainability choices
```

Always validate runtime-specific behavior against the Mule/DataWeave version used by the target application.
