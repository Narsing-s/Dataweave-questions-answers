# Real DataWeave Q&A Index

This index is the entry point for the curated question bank. The repository also contains the large generated practice dataset; `REAL-QA` is specifically for distinct, hand-written learning and interview problems.

## Current curated bank

**525 curated questions:** 175 Easy + 175 Medium + 175 Advanced.

### Easy
- [Original Easy bank](./EASY.md)
- [Easy expansion](./EXPANSION-EASY.md)
- [Easy E76-E100](./NEW-EASY-76-100.md)
- [Easy E101-E125](./NEW-EASY-101-125.md)
- [Easy E126-E150](./NEW-EASY-126-150.md)
- [Easy E151-E175](./NEW-EASY-151-175.md)

### Medium
- [Original Medium bank](./MEDIUM.md)
- [Medium expansion](./EXPANSION-MEDIUM.md)
- [Medium M76-M100](./NEW-MEDIUM-76-100.md)
- [Medium M101-M125](./NEW-MEDIUM-101-125.md)
- [Medium M126-M150](./NEW-MEDIUM-126-150.md)
- [Medium M151-M175](./NEW-MEDIUM-151-175.md)

### Advanced
- [Original Advanced bank](./ADVANCED.md)
- [Advanced expansion](./EXPANSION-ADVANCED.md)
- [Advanced A76-A100](./NEW-ADVANCED-76-100.md)
- [Advanced A101-A125](./NEW-ADVANCED-101-125.md)
- [Advanced A126-A150](./NEW-ADVANCED-126-150.md)
- [Advanced A151-A175](./NEW-ADVANCED-151-175.md)

## Learning order

### Easy
Focus on selectors, arrays, objects, strings, conditions, defaults, basic filtering, mapping, type conversion, collection functions and small business transformations.

### Medium
Focus on grouping, deduplication, flattening, `flatMap`, object transformations, aggregation, conditional fields, lookups, dynamic projections, validation and practical API mappings.

### Advanced
Focus on reconciliation, multi-level grouping, dynamic keys, nested indexes, reusable typed functions, polymorphic input, dates, XML/CSV, financial calculations, idempotency, validation and production-style contracts.

## Required question format

Every curated question should contain:

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
- Do not silently replace a real transformation with pseudocode.

## Coverage checklist

The curated bank progressively covers:

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
- Reconciliation and snapshot comparison
- Idempotency and audit transformations
- Validation and production response envelopes
- Edge cases and interview challenges

## Verification note

Static review can validate structure, required sections and obvious consistency. It cannot by itself prove that every DataWeave expression executes successfully on every Mule runtime. Runtime execution should be added to CI as the executable test suite grows.
