# Curated DataWeave Q&A Coverage Matrix

This matrix prevents the curated bank from becoming a collection of repeated `map`/`filter` variations.

## Covered strongly

- Script structure, selectors and navigation edge cases
- Arrays, objects, keys, values, entries and dynamic keys
- `map`, `filter`, `mapObject`, `filterObject`, `pluck`
- `reduce`, `groupBy`, `distinctBy`, `flatten`, `flatMap`
- `orderBy`, aggregation and performance-aware reuse
- Null, missing, blank and whitespace handling
- Type conversion, coercion utilities and semantic types
- Conditional fields, business rules and validation aggregation
- Functions, lambdas, local scope, generics and typed reusable functions
- `do`, `using`, `update`, `match`, recursion and relevant annotations
- Regex validation/extraction and semantic Regex coercion
- JSON, XML, CSV, multipart and DWB transformations
- XML attributes, repeated elements, mixed content and namespaces
- Date/time types, Period arithmetic, timezone conversion and DST concerns
- Binary/text, Base64 and Java InputStream boundaries
- Java POJOs, Optional, Enum, class metadata and Java 17 interoperability
- URI semantics and URI/query transformation boundaries
- API request/response mappings and version normalization
- Error envelopes, `try`/fallback patterns and result success/error handling
- Lookup/enrichment, reconciliation and duplicate resolution
- Financial, banking, customer and order scenarios
- Idempotency, audit patterns and deterministic business keys
- Polymorphic input normalization
- Pagination/windowing with explicit boundary rules
- Streaming, stream-capable functions and deferred output constraints
- Module organization, imports, visibility and component packaging
- DataWeave component descriptor generation and test-component packaging behavior
- Crypto hashing, HMAC and cryptographic sink validation
- DataWeave system properties and language-level compatibility
- Schema-driven type reuse from JSON Schema and Avro schema modules

## Continue expanding carefully

Only add another question when the transformation objective is genuinely different from existing material. Potential future depth includes a materially different MIME format, advanced XML schema shapes, additional language-level features, distinct Java interoperability cases, or new runtime/design trade-offs.

## Question design rule

Before adding a question, compare its transformation objective against the existing bank. A different customer name, ID, amount, field name or wording is not enough. Prefer a new operator combination, input shape, edge case, business rule, or performance/design trade-off.

## Runtime honesty

The repository's static checks validate structure and metadata. They do not prove that every expression executes on every Mule/DataWeave runtime. Runtime-sensitive questions must be tested against the intended runtime before being described as runtime-verified.
