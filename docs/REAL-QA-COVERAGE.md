# Curated DataWeave Q&A Coverage Matrix

This matrix prevents the curated bank from becoming a collection of repeated `map`/`filter` variations.

## Covered strongly

- Script structure and selectors
- Arrays and objects
- `map`, `filter`, `mapObject`, `filterObject`
- `reduce`, `groupBy`, `distinctBy`, `flatten`, `flatMap`
- `pluck`, keys, values and entries
- Dynamic object keys
- Null, missing and blank values
- Type conversion and numeric calculations
- Conditional fields and business rules
- Functions, lambdas and local scope
- `do`, `using`, `update`, `match`
- Regex validation/extraction
- JSON, XML and CSV transformations
- Date/time scenarios and timezone handling
- API request/response mappings
- Error envelopes and validation aggregation
- Lookup/enrichment patterns
- Reconciliation and duplicate resolution
- Financial, banking, customer and order scenarios
- Idempotency and audit patterns
- Polymorphic input normalization

## Continue expanding carefully

These areas need additional dedicated questions only when the transformation objective is genuinely different from existing material:

1. `try` and structured error values
2. `orElse` and optional-value fallback patterns
3. `read`/`write` with explicit MIME types
4. Binary/text conversion boundaries
5. CSV quoting, escaping and header configuration
6. XML attributes, repeated elements and mixed content
7. XML namespace edge cases beyond basic namespace selection
8. Date versus LocalDateTime versus DateTime versus Time semantics
9. Regex `scan`/capture-group extraction versus validation
10. Selector and navigation edge cases
11. Large-payload performance and repeated-scan avoidance
12. Typed reusable functions and module organization
13. Advanced recursive transformations
14. Pagination/windowing with explicit boundary rules
15. Precision, rounding and currency-specific calculations
16. Deterministic business-key generation

## Question design rule

Before adding a question, compare its transformation objective against the existing bank. A different customer name, ID, amount, field name or wording is not enough. Prefer a new operator combination, input shape, edge case, business rule, or performance/design trade-off.

## Runtime honesty

The repository's static checks validate structure and metadata. They do not prove that every expression executes on every Mule/DataWeave runtime. Runtime-sensitive questions must be tested against the intended runtime before being described as runtime-verified.
