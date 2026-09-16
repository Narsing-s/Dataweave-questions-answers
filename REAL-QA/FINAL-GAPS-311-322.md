# Final Unique DataWeave Gaps — A311-A322

These questions add capabilities that remain materially distinct from the existing curated bank. They are not simple renamings or function-by-function duplicates.

## A311 — Runtime data-format descriptor discovery
**Question:** A reusable DataWeave diagnostic tool must discover which data formats are installed at runtime and inspect each format's MIME type, encoding, reader properties, and writer properties. How can `dw::Runtime::dataFormatsDescriptor` and `DataFormatDescriptor` be used?

**Focus:** runtime format discovery and metadata-driven tooling.

---

## A312 — Dynamic `read` with runtime MIME type and reader properties
**Question:** A service receives a Binary payload whose MIME type and reader configuration are supplied at runtime. Design a DataWeave transformation using `read` so that the same script can parse different supported formats without hard-coding the reader configuration in the output directive.

**Focus:** dynamic parsing, MIME-driven reader behavior, `read` readerProperties.

---

## A313 — Dynamic writer properties with `write`
**Question:** A transformation must choose the output format and writer properties from runtime configuration, such as CSV separator or JSON null-handling. How can `write(value, contentType, writerProperties)` be used, and what validation constraint applies when the value cannot be represented in the selected format?

**Focus:** dynamic serialization and runtime writer configuration.

---

## A314 — Custom MIME type with `with` format syntax
**Question:** An API must return a custom MIME type such as `application/problem+json` while still using the JSON DataWeave writer. Explain how `output application/problem+json with json` separates the externally reported MIME type from the serialization format.

**Focus:** custom MIME types versus DataWeave format IDs.

---

## A315 — URL-encoded form data as structured input
**Question:** An HTTP integration receives `application/x-www-form-urlencoded` content containing repeated keys and encoded characters. Design a DataWeave transformation that parses the form payload into structured data and explain how URL-encoded format handling differs from manually splitting the raw string.

**Focus:** URL-encoded format, form semantics, encoded data.

---

## A316 — Java Properties format round trip
**Question:** A deployment tool must convert a DataWeave object into a Java `.properties` file and later read it back. What type does the Properties reader produce, which values are represented as strings, and how do `bufferSize`, `encoding`, and `deferred` affect writing?

**Focus:** Java Properties format and round-trip behavior.

---

## A317 — YAML entity-count protection
**Question:** A YAML integration must protect itself from documents containing an excessive number of parsed entities while still accepting legitimate large documents. How does the YAML `maxEntityCount` reader property change parsing behavior, and how should the limit be chosen?

**Focus:** YAML parser safety and resource-bound configuration.

---

## A318 — Avro embedded schema versus external schema
**Question:** An Avro reader receives files that may contain an embedded schema, while another integration supplies a schema URL. Explain when `schemaUrl` is optional for reading, when an embedded schema is required, and why writing Avro requires an explicit schema value.

**Focus:** Avro schema source and reader/writer asymmetry.

---

## A319 — Design-only type validation
**Question:** A reusable DataWeave module accepts a very large and complex Object type that is expensive to validate fully at runtime. How does `@DesignOnlyType` change the validation boundary, and what trade-off does it introduce between design-time correctness and runtime validation cost?

**Focus:** annotation-driven type-validation performance.

---

## A320 — Annotation target restrictions
**Question:** A library defines a custom annotation that should be legal only on functions and variables, not parameters, types, or imports. How can `@AnnotationTarget` enforce that contract, and what should happen when the annotation is applied to an unsupported target?

**Focus:** annotation design and compile-time target restrictions.

---

## A321 — Untrusted DataWeave execution boundary
**Question:** A platform executes DataWeave supplied by an untrusted source. Explain the purpose of `@UntrustedCode`, how it changes available privileges, and why a script that accesses environment variables or external resources should be treated differently from trusted library code.

**Focus:** DataWeave security boundaries and privilege restriction.

---

## A322 — Runtime privilege and intercepted function access
**Question:** A custom DataWeave function must require a specific runtime privilege before execution. Explain the relationship between `@RuntimePrivilege`, annotation interception, and the security check performed around a privileged operation.

**Focus:** runtime security annotations and intercepted execution.
