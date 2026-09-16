# Additional DataWeave Format and Runtime Gaps — A277-A286

This batch covers official DataWeave capabilities that were still not represented as dedicated curated questions after repository review. It avoids repeating the already-covered JSON/XML/CSV/streaming/Java/multipart basics.

## A277 — Avro schema-driven transformation

**Difficulty:** Advanced

**Question:** How can DataWeave transform an Avro payload when the writer must use an external schema?

**DataWeave**
```dataweave
%dw 2.0
output application/avro schemaUrl="classpath://user.avsc"
---
{
  username: payload.username,
  active: payload.active
}
```

**Input**
```json
{"username":"Ravi","active":true}
```

**Expected result:** An Avro binary payload conforming to the schema at `classpath://user.avsc`.

**Explanation:** Avro is schema-driven. The transformation's object shape must be compatible with the schema; unlike JSON, the writer cannot be treated as a schema-free serialization step.

**Common mistake:** Treating Avro output as ordinary JSON with a different MIME type.

## A278 — YAML null-output policy

**Difficulty:** Medium

**Question:** How can YAML output omit null values from objects while retaining non-null fields?

**DataWeave**
```dataweave
%dw 2.0
output application/yaml skipNullOn="objects"
---
{
  customer: "C100",
  middleName: null,
  active: true
}
```

**Expected output concept:**
```yaml
customer: C100
active: true
```

**Explanation:** `skipNullOn="objects"` is a YAML writer setting. It changes serialization, not the underlying DataWeave object.

**Common mistake:** Filtering null fields before the transformation when the requirement is only to control YAML serialization.

## A279 — Excel workbook shape

**Difficulty:** Advanced

**Question:** How does DataWeave represent an XLSX workbook with multiple sheets?

**DataWeave**
```dataweave
%dw 2.0
output application/xlsx header=true
---
{
  Customers: [
    {id: "C1", name: "Ravi"},
    {id: "C2", name: "Priya"}
  ],
  Accounts: [
    {id: "A1", customerId: "C1"}
  ]
}
```

**Expected result:** An XLSX workbook containing two sheets, `Customers` and `Accounts`.

**Explanation:** DataWeave models a workbook as an object whose keys are sheet names. Each sheet is represented as an array of row objects.

**Common mistake:** Modeling the entire workbook as one array and losing sheet boundaries.

## A280 — Excel date mapping

**Difficulty:** Advanced

**Question:** What DataWeave type should be expected when an Excel date cell is read?

**Answer:** Excel date cells map to DataWeave `Date` values. Numeric cells map to `Number`, booleans to `Boolean`, and text to `String`.

**Interview tip:** Do not blindly cast every Excel cell to `String`; preserve the source type when the business transformation depends on dates or numbers.

## A281 — Newline-delimited JSON

**Difficulty:** Advanced

**Question:** How is NDJSON different from a normal JSON array when designing an integration?

**DataWeave**
```dataweave
%dw 2.0
output application/x-ndjson
---
[
  {id: "C1", active: true},
  {id: "C2", active: false}
]
```

**Expected result concept:** One JSON object per output line rather than one enclosing JSON array.

**Explanation:** NDJSON is record-oriented. This distinction matters for line-based ingestion, streaming pipelines, and systems that expect independent JSON documents separated by newlines.

**Common mistake:** Returning a JSON array while labeling it as NDJSON.

## A282 — Protobuf schema/type boundary

**Difficulty:** Advanced

**Question:** Why must a DataWeave transformation targeting Protobuf be designed around the Protobuf schema rather than arbitrary JSON-like fields?

**Answer:** Protobuf is schema-driven binary serialization. The DataWeave object must correspond to the message structure and field types defined by the Protobuf schema.

**Interview tip:** Treat Protobuf mapping like Avro schema mapping: validate the message contract before designing the transformation.

## A283 — Java generic collection metadata

**Difficulty:** Advanced

**Question:** How can DataWeave preserve the generic element type when creating a Java `ArrayList`?

**DataWeave**
```dataweave
%dw 2.0
output application/java
---
[
  {name: "Ravi"},
  {name: "Priya"}
] as Array {class: "java.util.ArrayList<com.example.User>"}
```

**Expected result:** A Java `ArrayList` whose generic metadata identifies `com.example.User`, assuming the class exists and is compatible.

**Explanation:** Java output can use generic class metadata so the element type is defined by the target collection declaration instead of repeatedly specifying it for each element.

**Common mistake:** Assuming `ArrayList` alone carries enough information to infer a domain element class.

## A284 — Type introspection of a function

**Difficulty:** Advanced

**Question:** How can DataWeave inspect a function's parameter and return types?

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Types
output application/json
fun add(a: Number, b: Number): Number = a + b
---
{
  parameters: functionParamTypes(add),
  returnType: functionReturnType(add)
}
```

**Expected result concept:** Metadata describing two `Number` parameters and a `Number` return type.

**Explanation:** `dw::core::Types` provides type-introspection functions for advanced library and tooling scenarios.

**Common mistake:** Confusing the runtime value produced by a function with the function's type metadata.

## A285 — Environment-variable access

**Difficulty:** Advanced

**Question:** How can a DataWeave transformation read an environment variable while safely handling an undefined variable?

**DataWeave**
```dataweave
%dw 2.0
import * from dw::System
output application/json
---
{
  environment: envVar("APP_ENV") default "unknown"
}
```

**Expected output when `APP_ENV` is undefined:**
```json
{"environment":"unknown"}
```

**Explanation:** `dw::System::envVar` returns the environment variable value or `null` when it is not defined. Environment access is a runtime integration concern and should not replace proper configuration management.

**Common mistake:** Assuming an absent environment variable automatically becomes an empty string.

## A286 — Flat-file required-field enforcement

**Difficulty:** Advanced

**Question:** How can a flat-file transformation require schema fields instead of silently accepting missing values?

**DataWeave**
```dataweave
%dw 2.0
output application/flatfile
  schemaPath="src/main/resources/customer.esl"
  enforceRequires=true
---
payload
```

**Expected result:** A flat-file serialization that enforces required schema fields and fails when required values are missing.

**Explanation:** `enforceRequires` is a format-level validation setting. It is different from writing a DataWeave `if` condition because the requirement comes from the flat-file schema.

**Common mistake:** Reimplementing schema-required validation manually while leaving the flat-file writer unconstrained.

## Coverage note

These questions intentionally add format/runtime areas that were not represented as dedicated questions during the previous repository searches: Avro, YAML serialization policy, Excel workbook/date mapping, NDJSON, Protobuf schema boundaries, Java generic collection metadata, function type introspection, environment-variable access, and flat-file required-field enforcement.
