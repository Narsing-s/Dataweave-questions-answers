# DataWeave Q&A Gap Analysis

This file tracks topics that should receive dedicated, non-duplicate questions as the curated bank grows. Several previously listed gaps are now represented in the curated bank; they remain candidates for deeper variations only when the transformation objective is genuinely different.

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

## Remaining / deeper gaps

- `try` and structured error values
- `orElse` and optional-value fallback patterns
- `read` / `write` with explicit MIME types
- Binary and text conversion boundaries
- CSV quoting, escaping and header configuration
- XML attributes, repeated elements and mixed content
- Advanced XML namespace combinations
- Date versus LocalDateTime versus DateTime versus Time semantics
- Regular-expression `scan` and capture-group extraction versus validation
- Selector/navigation edge cases
- Large-payload performance and repeated-scan avoidance
- Typed reusable functions and module organization
- Advanced recursive transformations
- Pagination/windowing with explicit boundary rules
- Precision, rounding and currency-specific calculations
- Deterministic business-key generation

## Duplication rule

A new question is not considered unique merely because IDs, names, numbers, or business nouns were changed. The transformation objective, operator combination, input shape, edge case, or business rule must materially differ.

## Verification rule

Every new question must contain the complete transformation, concrete input, deterministic expected output, explanation, common mistake, and interview tip. Runtime correctness must not be claimed unless the expression has actually been executed in a compatible DataWeave runtime.

## Automated protection

`python scripts/check-real-qa-duplicates.py` checks exact normalized question-title duplicates. GitHub Actions runs this check whenever `REAL-QA` changes. Exact-title checking does not replace human conceptual-duplicate review.

See [`docs/REAL-QA-COVERAGE.md`](../docs/REAL-QA-COVERAGE.md) for the broader coverage matrix.
