# DataWeave Q&A Gap Analysis

This file tracks topics that should receive dedicated, non-duplicate questions as the curated bank grows. Several previously listed gaps are now represented in the curated bank; they remain candidates for deeper variations only when the transformation objective is genuinely different.

## Newly covered in the latest deep-gap batch

- `try` and structured error values — E207
- `orElse` and optional-value fallback — E206
- `read` with explicit MIME type — M206
- `write` with explicit MIME type — A206
- CSV header/quoting configuration — M207
- Date and Time type semantics — A207
- Regex `scan` and capture groups — M208
- Typed reusable functions — M209
- Reuse of derived collections for performance — M210
- Pagination/window boundaries — A208
- Financial rounding considerations — A209
- Deterministic business-key generation — A210
- Selector/navigation defaults and blank-versus-null handling — E208-E210

## Still remaining / deeper gaps

- Binary and text conversion boundaries
- XML attributes, repeated elements and mixed content
- Advanced XML namespace combinations
- Full Date versus LocalDateTime versus DateTime versus Time scenario matrix
- Module organization and imports
- Advanced recursive transformations
- Currency-specific minor-unit rules and documented rounding modes
- More complex pagination/windowing with missing/short final pages
- Large-payload streaming and single-pass aggregation strategies
- More advanced deterministic key collision analysis

## Already represented — expand only with materially different scenarios

- `do` scopes and local variables
- `using` declarations and reusable local bindings
- `update` operator for nested field changes
- `match` with business branches
- validation result aggregation
- reconciliation with duplicate business keys
- financial zero-denominator handling
- polymorphic input normalization
- XML namespace handling

## Duplication rule

A new question is not considered unique merely because IDs, names, numbers, or business nouns were changed. The transformation objective, operator combination, input shape, edge case, or business rule must materially differ.

## Verification rule

Every new question must contain the complete transformation, concrete input, deterministic expected output, explanation, common mistake, and interview tip. Runtime correctness must not be claimed unless the expression has actually been executed in a compatible DataWeave runtime. Runtime-dependent error metadata and serialized line-ending details should be described rather than fabricated.

## Automated protection

`python scripts/check-real-qa-duplicates.py` checks exact normalized question-title duplicates. GitHub Actions runs this check whenever `REAL-QA` changes. Exact-title checking does not replace human conceptual-duplicate review.

See [`docs/REAL-QA-COVERAGE.md`](../docs/REAL-QA-COVERAGE.md) for the broader coverage matrix.
