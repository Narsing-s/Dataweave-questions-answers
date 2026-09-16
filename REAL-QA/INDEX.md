# Real DataWeave Q&A Index

This index is the entry point for the curated question bank. The repository also contains the large generated practice dataset; `REAL-QA` is specifically for distinct, hand-written learning and interview problems.

## Current curated bank

**630 curated questions:** 210 Easy + 210 Medium + 210 Advanced.

### Easy
- [Original Easy bank](./EASY.md)
- [Easy expansion](./EXPANSION-EASY.md)
- [Easy E76-E100](./NEW-EASY-76-100.md)
- [Easy E101-E125](./NEW-EASY-101-125.md)
- [Easy E126-E150](./NEW-EASY-126-150.md)
- [Easy E151-E175](./NEW-EASY-151-175.md)
- [Easy E176-E200](./NEW-EASY-176-200.md)
- [Easy E201-E205](./NEW-EASY-201-205.md)
- [Easy E206-E210 — deep gaps](./DEEP-GAPS-EASY-206-210.md)

### Medium
- [Original Medium bank](./MEDIUM.md)
- [Medium expansion](./EXPANSION-MEDIUM.md)
- [Medium M76-M100](./NEW-MEDIUM-76-100.md)
- [Medium M101-M125](./NEW-MEDIUM-101-125.md)
- [Medium M126-M150](./NEW-MEDIUM-126-150.md)
- [Medium M151-M175](./NEW-MEDIUM-151-175.md)
- [Medium M176-M200](./NEW-MEDIUM-176-200.md)
- [Medium M201-M205](./NEW-MEDIUM-201-205.md)
- [Medium M206-M210 — deep gaps](./DEEP-GAPS-MEDIUM-206-210.md)

### Advanced
- [Original Advanced bank](./ADVANCED.md)
- [Advanced expansion](./EXPANSION-ADVANCED.md)
- [Advanced A76-A100](./NEW-ADVANCED-76-100.md)
- [Advanced A101-A125](./NEW-ADVANCED-101-125.md)
- [Advanced A126-A150](./NEW-ADVANCED-126-150.md)
- [Advanced A151-A175](./NEW-ADVANCED-151-175.md)
- [Advanced A176-A200](./NEW-ADVANCED-176-200.md)
- [Advanced A201-A205](./NEW-ADVANCED-201-205.md)
- [Advanced A206-A210 — deep gaps](./DEEP-GAPS-ADVANCED-206-210.md)

## Gap tracking

- [DataWeave Q&A Gap Analysis](./GAP-ANALYSIS.md) — tracks uncovered or underrepresented concepts so future additions remain meaningful rather than superficial duplicates.

## Learning order

### Easy
Focus on selectors, arrays, objects, strings, conditions, defaults, basic filtering, mapping, type conversion, collection functions and small business transformations.

### Medium
Focus on grouping, deduplication, flattening, `flatMap`, object transformations, aggregation, conditional fields, lookups, dynamic projections, validation, local scopes and practical API mappings.

### Advanced
Focus on reconciliation, multi-level grouping, dynamic keys, nested indexes, reusable typed functions, polymorphic input, dates, XML/CSV, financial calculations, idempotency, audit transformations, regex processing, validation aggregation and production-style contracts.

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
- New batches must be checked against existing question concepts and titles before being added; superficial renaming is not considered a new question.

## Coverage checklist

The curated bank progressively covers:

- Selectors and navigation
- Arrays and objects
- `map`, `filter`, `mapObject`, `filterObject`
- `pluck`, `keysOf`, `valuesOf`, `entriesOf`
- `reduce`, `groupBy`, `distinctBy`
- `flatten`, `flatMap`
- `orderBy`, `sizeOf`, `isEmpty`, `isBlank`
- String manipulation and normalization
- Number calculations and type casting
- Null/default handling and optional-value fallbacks
- Conditional fields and expressions
- Functions, lambdas and local scopes
- `$`, `$$`, `$$$`
- `do`, `using`, `update` and pattern matching
- Regular-expression validation, scanning and capture extraction
- Date/time transformations and type semantics
- JSON/XML/CSV transformations, MIME types and namespaces
- API request/response mappings
- Error-response shaping and validation aggregation
- Lookup and enrichment patterns
- Financial/order/customer/banking scenarios
- Reconciliation and snapshot comparison
- Duplicate detection and deterministic duplicate resolution
- Idempotency and deterministic business-key patterns
- Polymorphic input normalization
- Pagination/windowing and boundary rules
- Performance-aware reuse of derived collections
- Edge cases and interview challenges

## Verification note

Static review can validate structure, required sections and obvious consistency. It cannot by itself prove that every DataWeave expression executes successfully on every Mule runtime. Runtime execution should be added to CI as the executable test suite grows. Questions that depend on runtime-specific serialized error metadata or line-ending representation intentionally describe those outputs without pretending they were runtime-verified.
