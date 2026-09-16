# DataWeave Q&A Gap Analysis

This file tracks topics that should receive dedicated, non-duplicate questions as the curated bank grows.

## Priority gaps

- `do` scopes and local variables
- `using` declarations and reusable local bindings
- `update` operator for nested field changes
- `match` with multiple business branches
- `try` / error-value handling and safe fallbacks
- `orElse` and optional-value flows
- `read` / `write` for explicit MIME conversion
- Binary and text conversion boundaries
- CSV quoting, headers and row normalization
- XML attributes, repeated elements, mixed content and namespaces
- Date, LocalDateTime, DateTime, Time and timezone edge cases
- Regular-expression extraction versus validation
- Selector variations and safe navigation
- Large-collection performance and avoiding repeated scans
- Typed functions and reusable modules
- Validation result aggregation
- API error normalization
- Reconciliation with duplicate business keys
- Financial precision, rounding and zero-denominator cases
- Idempotency and deterministic business keys

## Duplication rule

A new question is not considered unique merely because IDs, names, numbers, or business nouns were changed. The transformation objective, operator combination, edge case, or business rule must materially differ.

## Verification rule

Every new question must contain the complete transformation, concrete input, deterministic expected output, explanation, common mistake, and interview tip. Runtime correctness must not be claimed unless the expression has actually been executed in a compatible DataWeave runtime.
