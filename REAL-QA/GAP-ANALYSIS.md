# DataWeave Q&A Gap Analysis

This file tracks topics that should receive dedicated, non-duplicate questions as the curated bank grows. The repository now includes the final-gap, deep-gap, and deeper-gap batches; future additions must continue to be conceptually distinct.

## Covered in the final gap batches

- Binary/text conversion boundaries — E226-E227, A267-A268
- Date-only versus time-only handling — E228
- XML attributes — E230, A233
- XML repeated elements — M226
- XML attribute selectors — M227
- XML namespace-qualified selectors — M228, A250
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

## Covered in the deep-gap batch

- Temporal type matrix — A238
- Generic type parameters — A239
- Type selection and metadata — A240
- End-to-end streaming — A241
- Tail recursion and stream-capable functions — A242-A243
- Java InputStream behavior — A244
- Java 17 POJO interoperability — A245
- Explicit coercion utilities — A246
- Dynamic, negative-index and key-value selector behavior — A247-A249
- Explicit XML namespace construction — A250
- DataWeave language-level compatibility — A251
- Deferred output — A252
- Result success/error handling — A253
- Selector out-of-range behavior — A254
- Nullable date coercion — A255
- Null versus empty versus whitespace — A256
- XML encoding configuration — A257
- CSV streaming unit — A258
- Component visibility — A259

## Covered in the deeper-gap batch

- Multipart/form-data part construction and boundary/default-content-type behavior — A261-A262
- HMAC generation and cryptographic sink validation — A263-A264
- URI semantic typing and query parsing — A265-A266
- Base64 binary round-trip — A267
- DWB writer/runtime properties — A268
- Java Optional mapping — A269
- Java class metadata and Enum conversion — A270-A271
- Semantic-type coercion for Key/Regex/Namespace — A272
- DST-aware timezone conversion — A273
- Period/calendar arithmetic — A274
- Streaming constraints with ordering/aggregation — A275
- DataWeave system-property-driven runtime behavior — A276

## Final format/runtime/security coverage

- Avro, YAML, Excel, NDJSON, Protobuf, Java Properties, flat-file, and DWB edge behavior — A277-A286, A301-A310, A316-A318
- Tree, Runtime, URL, Diff, binary, and function-introspection capabilities — A287-A298
- Dynamic runtime evaluation and Java metadata/writer behavior — A299-A310
- Runtime data-format descriptors, dynamic readers/writers, MIME separation, URL-encoded forms, parser limits, schema-source behavior, design-time validation, annotation targets, untrusted code, and runtime privileges — A311-A322
- Remaining `dw::Runtime` execution, source-location, property, version, and delay capabilities — A323-A330

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

## Remaining research rule

The repository should not keep adding questions merely to increase the count. The documented research checklist is now substantially covered. Future additions should target a genuinely different DataWeave feature, input shape, edge case, business rule, runtime behavior, or performance/design trade-off. Examples of valid future depth include a new MIME format, a materially different XML schema shape, a new language-level feature, a distinct Java interoperability case, or a new streaming constraint.

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
- multipart and binary boundaries
- crypto/hash/HMAC boundaries
- Java interoperability
- temporal arithmetic and timezone conversion
- streaming/deferred output
- language-level/system-property compatibility

## Duplication rule

A new question is not considered unique merely because IDs, names, numbers, or business nouns were changed. The transformation objective, operator combination, input shape, edge case, or business rule must materially differ.

## Verification rule

Every new question must contain the complete transformation, concrete input, deterministic expected output, explanation, common mistake, and interview tip. Runtime correctness must not be claimed unless the expression has actually been executed in a compatible DataWeave runtime. Runtime-dependent error metadata and serialized line-ending details should be described rather than fabricated.

## Automated protection

`scripts/check-real-qa-duplicates.py` checks exact normalized question-title duplicates. GitHub Actions runs this check whenever `REAL-QA` changes. Exact-title checking does not replace human conceptual-duplicate review.

See [`docs/REAL-QA-COVERAGE.md`](../docs/REAL-QA-COVERAGE.md) for the broader coverage matrix.
