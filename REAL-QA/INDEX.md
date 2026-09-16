# Real DataWeave Q&A Index

This index is the entry point for the curated question bank. The repository also contains the large generated practice dataset; `REAL-QA` is specifically for distinct, hand-written learning and interview problems.

## Current curated bank

**878 curated questions:** 225 Easy + 225 Medium + 225 Advanced + 23 final gap questions + 22 deep-gap questions + 16 deeper-gap questions + 10 additional format/runtime questions + 12 module/runtime gaps + 12 final runtime/format gaps + 12 final format/security/runtime gaps + 8 runtime gaps + 12 final runtime gaps + 8 final typed-runtime/compatibility gaps + 5 extension/logging/reader/diagnostic gaps + 4 DataWeave 2.12 component/math gaps + 4 current runtime/performance gaps + 4 current DataWeave 2.12 edge-case gaps + 3 current DataWeave 2.12 XML/module/deferred gaps + 3 current DataWeave 2.12 type-system/compiler gaps + 3 current DataWeave versioning/introspection/Java-output gaps + 3 current runtime/concurrency/Avro gaps + 4 current runtime/Unicode/materialization gaps + 4 current format/runtime/module/Java gaps + 2 current runtime/range gaps + 1 current temporal/DST gap + 7 current runtime/compiler/Avro/type-system gaps + 5 current compiler/materialization/Java/tooling gaps + 4 current tooling/range/version-metadata gaps + 3 current compatibility/language-edge gaps + 2 current compatibility/runtime-behavior gaps + 7 current compatibility/diagnostics/XML/runtime-memory gaps.

### Deep and specialized gaps
- [A238-A259 — Final deep gaps](./FINAL-DEEP-GAPS.md)
- [A261-A276 — Deeper gaps](./DEEPER-GAPS-261-276.md)
- [A277-A286 — Additional formats/runtime](./ADDITIONAL-FORMATS-277-286.md)
- [A287-A298 — Final module/runtime gaps](./FINAL-GAPS-287-298.md)
- [A299-A310 — Final runtime/format gaps](./FINAL-GAPS-299-310.md)
- [A311-A322 — Final format/security/runtime gaps](./FINAL-GAPS-311-322.md)
- [A323-A330 — Runtime gaps](./FINAL-GAPS-323-330.md)
- [A331-A342 — Final runtime/type/diagnostic gaps](./FINAL-GAPS-331-342.md)
- [A343-A350 — Final typed-runtime/compatibility gaps](./FINAL-GAPS-343-350.md)
- [A351-A355 — Extension/logging/reader/diagnostic gaps](./FINAL-GAPS-351-355.md)
- [A356-A359 — DataWeave 2.12 component/math gaps](./FINAL-GAPS-356-359.md)
- [A360-A363 — Current runtime/performance gaps](./FINAL-GAPS-360-363.md)
- [A364-A367 — Current DataWeave 2.12 edge-case gaps](./FINAL-GAPS-364-367.md)
- [A368-A370 — Current DataWeave 2.12 XML/module/deferred gaps](./FINAL-GAPS-368-370.md)
- [A371-A373 — Current DataWeave 2.12 type-system/compiler gaps](./FINAL-GAPS-371-373.md)
- [A374-A376 — Versioning/introspection/Java-output gaps](./FINAL-GAPS-374-376.md)
- [A377-A379 — Current runtime/concurrency/Avro gaps](./FINAL-GAPS-377-379.md)
- [A380-A383 — Current runtime/Unicode/materialization gaps](./FINAL-GAPS-380-383.md)
- [A384-A387 — Current format/runtime/module/Java gaps](./FINAL-GAPS-384-387.md)
- [A388-A389 — Current runtime/range gaps](./FINAL-GAPS-388-389.md)
- [A390 — Current temporal/DST gap](./FINAL-GAPS-390.md)
- [A391-A397 — Current runtime/compiler/Avro/type-system gaps](./FINAL-GAPS-391-397.md)
- [A398-A402 — Current compiler/materialization/Java/tooling gaps](./FINAL-GAPS-398-402.md)
- [A403-A406 — Current tooling/range/version-metadata gaps](./FINAL-GAPS-403-406.md)
- [A407-A409 — Current compatibility/language-edge gaps](./FINAL-GAPS-407-409.md)
- [A410-A411 — Current compatibility/runtime-behavior gaps](./FINAL-GAPS-410-411.md)
- [A412-A418 — Current compatibility/diagnostics/XML/runtime-memory gaps](./FINAL-GAPS-412-418.md)

## Gap tracking

- [DataWeave Q&A Gap Analysis](./GAP-ANALYSIS.md) — tracks uncovered or underrepresented concepts so future additions remain meaningful rather than superficial duplicates.

## Specialized/runtime coverage

The deep batches cover streaming, temporal types, Java interoperability, multipart, binary formats, cryptographic functions, URI semantics, coercion rules, timezone/DST behavior, temporal periods, type introspection, annotations, visibility, system/environment integration, Avro, YAML, Excel, NDJSON, Protobuf, flat files, DataWeave system properties, Tree utilities, Runtime utilities, URL utilities, Diff, binary helpers, function-type introspection, runtime script evaluation, Java metadata/object construction, Java writer behavior, DWB indexing, NDJSON validation policy, Excel table/header/security settings, flat-file missing-value and multi-structure handling, less-common Java mappings, runtime data-format discovery, dynamic readers/writers, custom MIME separation, URL-encoded forms, Java Properties, YAML parser limits, Avro schema-source behavior, design-time type validation, annotation targets, untrusted execution, runtime privilege boundaries, runtime MIME descriptor lookup, explicit runtime failures, chained `try` fallbacks, complete runtime-property introspection, execution configuration, dynamic execution result contracts, structured execution failures, source-range diagnostics, typed runtime success/failure unions, runtime logging, descriptor absence handling, experimental-runtime compatibility concerns, custom data-format registration, scoped DataWeave logging configuration, dynamic `ReaderInput`, custom runtime logging services, structured `Position` diagnostics, DataWeave 2.12 component descriptors/types, per-component language levels, `UNLIMITED_CONTEXT` metadata, parser-cache sizing, large-field character chunking, per-application JavaBean caching, Java 17+ JPMS access boundaries, repeated-attribute selector result-shape preservation, sibling-reference annotation identity, self-referential Java-array scope resolution, recursive type-metadata cycle handling, cross-module overload resolution, deferred-output writer termination, indexed-XML large-text/CDATA memory behavior, consistent visibility across overloads, generic intersection type-checking, optional-to-required object-field compatibility, version-aware overload dispatch with `@Since`, optional function-parameter introspection, Java output type representation configuration, Binary-specific `isEmpty` overload behavior, lazy-materialized `KeyValuePairs` concurrency, Avro reader memory behavior in long-running flows, single-variable function materialization, multibyte streaming-reader decoding, lazy `orderBy` criteria evaluation, Unicode surrogate handling in `fromCharCode`, deeply nested flat-file schema loading, concurrent DataWeave module loading, Java bean accessor discovery, Event Stream/SSE parsing, Java module builder/converter cache livelock prevention, invalid range behavior, DST-aware `atBeginningOfDay` offset resolution, reusable materialized Java values, compiler precompilation without validation/type checking, top-level Avro enum/map/union/fixed roots, optional-type propagation through selectors, object-key subtraction type inference, lazy compiler source loading, cross-phase compiler diagnostic propagation, Java module bean introspection cache lifecycle, eager materialization for exception caching in `try`, base-type validation without premature materialization, semantic tokens in the Tooling API, type-check diagnostics for compiler subgraphs, cross-file AST scope navigation, Array range-selector performance, syntax-version metadata in compiler type graphs, Windows classloader resource resolution, `internal` identifier compatibility, `NumberType`/`sizeOf` compatibility, trailing-zero numeric formatting compatibility, strict mixed-type `orderBy` comparison behavior, runtime compatibility-flag introspection, Mule `vars` materialization behavior, XML DTD processing control, coercion-exception verbosity, exception-message length limits, CPU watchdog execution protection, direct/off-heap buffer selection, and pre-2.3 temporal subtraction compatibility.

## Quality rule

Do not add a question merely by changing IDs, names, numbers, business nouns or wording. A new question must introduce a materially different transformation objective, input shape, edge case, business rule, format/runtime behavior, or performance/design trade-off.
