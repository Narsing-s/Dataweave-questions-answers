# DataWeave Q&A Gap Analysis

This file tracks topics that should receive dedicated, non-duplicate questions as the curated bank grows. The latest final-gap batch now gives dedicated coverage to the previously listed underrepresented areas.

## Covered in the latest final-gap batch

- Binary/text conversion boundaries — E226-E227
- Date-only versus time-only handling — E228
- XML attributes — E230, A233
- XML repeated elements — M226
- XML attribute selectors — M227
- XML namespace-qualified selectors — M228
- Module organization and imports — M229, A235
- Short and out-of-range pagination windows — M230-M231, A232
- Recursive tree transformations — A226
- Recursive arbitrary-depth array traversal — A227
- Currency minor-unit representation — A228
- Currency-specific precision metadata — A229
- Single-pass aggregation — A230, A236
- Deterministic key collision avoidance — A231
- XML mixed-content handling — A234
- Reusable lookup/index construction for large payloads — A237

## Previously covered

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

## Future expansion rule

The repository should not keep adding questions merely to increase the count. Future additions should target a genuinely different DataWeave feature, input shape, edge case, business rule, runtime behavior, or performance/design trade-off. Examples of valid future depth include more complex namespace combinations, deeper date/time conversion matrices, advanced XML schema shapes, streaming-specific reader/writer behavior, module dependency patterns, and runtime-specific functions introduced in newer DataWeave versions.

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

`scripts/check-real-qa-duplicates.py` checks exact normalized question-title duplicates. GitHub Actions runs this check whenever `REAL-QA` changes. Exact-title checking does not replace human conceptual-duplicate review.

See [`docs/REAL-QA-COVERAGE.md`](../docs/REAL-QA-COVERAGE.md) for the broader coverage matrix.
