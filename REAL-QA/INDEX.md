# Real DataWeave Q&A Index

This index is the entry point for the curated question bank. The repository also contains the large generated practice dataset; `REAL-QA` is specifically for distinct, hand-written learning and interview problems.

## Learning order

### Easy
- [Original Easy bank](./EASY.md)
- [Easy expansion](./EXPANSION-EASY.md)

Focus: selectors, arrays, objects, strings, conditions, defaults, basic filtering, mapping and type conversion.

### Medium
- [Original Medium bank](./MEDIUM.md)
- [Medium expansion](./EXPANSION-MEDIUM.md)

Focus: grouping, deduplication, flattening, `flatMap`, object transformations, aggregation, conditional fields and practical API mappings.

### Advanced
- [Original Advanced bank](./ADVANCED.md)
- [Advanced expansion](./EXPANSION-ADVANCED.md)

Focus: multi-level grouping, dynamic keys, parent-child expansion, reusable functions, business classification, dates, aggregation, XML/CSV and production-style contracts.

## Required question format

Every new curated question should contain:

1. Question
2. Difficulty
3. Topic or concept
4. Input
5. Complete DataWeave script
6. Expected output
7. Explanation
8. Common mistake
9. Interview tip
10. Edge case when relevant
11. Related concept when useful

## Quality rules

- Do not create questions by changing only names, IDs or numbers.
- Each question must test a distinct transformation idea or meaningful variation.
- Inputs must be realistic and small enough to understand.
- Output must be deterministic and consistent with the input and script.
- Use DataWeave 2.x syntax appropriate to the repository's stated runtime.
- Explicitly cast values when the target type matters.
- Explain scope carefully when nested lambdas use `$`, `$$` or `$$$`.
- Explain duplicate-key behavior whenever dynamic keys are created.
- Explain empty/null/missing behavior for functions where it can affect production results.
- Do not claim runtime validation unless the script has actually been executed in a compatible DataWeave/Mule runtime.
- Prefer business scenarios over artificial function-only examples once fundamentals are covered.

## Coverage checklist

The curated bank should progressively cover:

- Selectors and navigation
- Arrays and objects
- `map`, `filter`, `mapObject`, `filterObject`
- `pluck`, `keysOf`, `valuesOf`, `entriesOf`
- `reduce`, `groupBy`, `distinctBy`
- `flatten`, `flatMap`
- `orderBy`, `sizeOf`, `isEmpty`, `isBlank`
- String manipulation
- Number calculations and type casting
- Null/default handling
- Conditional fields and expressions
- Functions and lambdas
- `$`, `$$`, `$$$`
- Pattern matching
- Date/time transformations
- JSON/XML/CSV transformations
- API request/response mappings
- Error-response shaping
- Lookup and enrichment patterns
- Financial/order/customer/banking scenarios
- Edge cases and interview challenges

## Verification note

Static review can validate structure, required sections and obvious consistency. It cannot by itself prove that every DataWeave expression executes successfully on every Mule runtime. Runtime execution should be added to CI as the executable test suite grows.
