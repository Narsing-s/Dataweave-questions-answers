# A448-A449 — Schema type-reuse gaps

These questions were added only after exact repository searches for `jsonschema!` and `avroschema!`. They cover schema-to-DataWeave type reuse, which is distinct from ordinary schema-driven reader/writer configuration already covered elsewhere.

## A448 — Reusing types from a JSON Schema
**Question:** An integration already has a JSON Schema defining `Person` and `Account` structures. How can DataWeave import those schema-defined types so they can be used for type checks and pattern matching instead of redefining the types manually?

**Answer:** DataWeave can use the `jsonschema!` module loader to import types from a JSON Schema. The script can import all types or a specific type, and can rename an imported type with `as`. The imported type can then participate in normal DataWeave type operations such as `is` checks and `match` cases.

**Example scenario:** A RAML/API contract is backed by JSON Schema, and a DataWeave transformation needs to distinguish an incoming `person` object from an `address` object without maintaining a second handwritten type definition.

**Explanation:** This is schema-to-type reuse, not JSON parsing. The schema loader turns supported JSON Schema structures into DataWeave types. It also makes schema definitions reusable for pattern matching and type checks. This avoids duplicating contract definitions in DataWeave code.

**Common mistake:** Treating `jsonschema!` as a runtime validation engine for every JSON Schema keyword. DataWeave maps supported schema constructs into DataWeave types, and documented limitations apply to some schema constraints such as string formats, numeric minimum/maximum restrictions, and patterns.

**Interview tip:** Distinguish *loading a schema as DataWeave types* from *reading JSON data* and from external API validation.

## A449 — Reusing named types from an Avro schema
**Question:** An Avro `.avsc` file defines reusable named types. How can a DataWeave script import those types and use them in type declarations, type checks, pattern matching, or function signatures?

**Answer:** DataWeave provides the `avroschema!` module loader. A script can import all schema types with `*`, import a single named type, or rename an imported type with `as`. The imported Avro types become DataWeave type directives that can be used like other DataWeave types.

**Example scenario:** An event-integration project already maintains `Customer`, `Address`, and other named types in an Avro schema. A DataWeave mapping needs to reuse those contract types rather than recreating equivalent DataWeave type definitions.

**Explanation:** This capability is different from using `schemaUrl` to read or write Avro payloads. `schemaUrl` concerns Avro data-format processing, while `avroschema!` makes declarations from an Avro schema available to the DataWeave type system.

**Common mistake:** Assuming importing an Avro schema automatically serializes the payload as Avro. The import provides reusable type declarations; the output MIME type and Avro writer configuration are separate concerns.

**Interview tip:** Keep the three concepts separate: schema type reuse, Avro reader/writer schema configuration, and the actual transformation value.

## Source and duplication note

MuleSoft documents JSON Schema type reuse through the `jsonschema!` loader and Avro schema type reuse through `avroschema!`. Repository searches found no existing dedicated `jsonschema!` or `avroschema!` questions, while existing Avro questions were specifically about reader/writer schema behavior and top-level Avro values. These two questions therefore add distinct type-system capabilities rather than rephrasing those existing format questions.
