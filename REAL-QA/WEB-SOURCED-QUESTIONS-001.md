# Web-Sourced DataWeave Questions — Deduplicated Additions

This file contains DataWeave/Mule 4 interview questions discovered from public web sources and added only after checking the repository for the same concept. Questions that were already represented in the repository were intentionally not duplicated.

## DW-WEB-001 — Swap two values
**Difficulty:** Easy  
**Question:** How can you swap two numbers or two values in DataWeave without using a temporary mutable variable?

**Answer:** DataWeave is expression-oriented, so create the output from the two original values in reversed positions.

**Example**
```dataweave
%dw 2.0
output application/json
var a = 10
var b = 20
---
{
  first: b,
  second: a
}
```

**Expected output**
```json
{
  "first": 20,
  "second": 10
}
```

**Interview tip:** Explain that DataWeave transformations construct new values rather than mutating the existing variables.

**Source:** Mule Zone, “Dataweave 2.0 interview questions” (2021).

## DW-WEB-002 — Multiple variables in one DataWeave transformation
**Difficulty:** Easy  
**Question:** How can you define multiple variables in a single DataWeave transformation?

**Answer:** Declare multiple local variables in the DataWeave header and use them in the body. This keeps repeated calculations in one place.

**Example**
```dataweave
%dw 2.0
var price = 100
var quantity = 3
var taxRate = 0.18
output application/json
---
{
  subtotal: price * quantity,
  tax: price * quantity * taxRate,
  total: (price * quantity) * (1 + taxRate)
}
```

**Expected output**
```json
{
  "subtotal": 300,
  "tax": 54,
  "total": 354
}
```

**Interview tip:** Distinguish script-level/local variables from Mule event variables such as `vars`.

**Source:** Mule Zone, “Dataweave 2.0 interview questions” (2021).

## DW-WEB-003 — Print/log DataWeave values during development
**Difficulty:** Easy  
**Question:** How can you get a DataWeave value into the Mule/Anypoint Studio logs while troubleshooting a transformation?

**Answer:** Use DataWeave's logging capability where supported, or use a Mule Logger component with a DataWeave expression. A Logger component is usually clearer for application-level diagnostics.

**Example**
```xml
<logger level="INFO"
        message="#[payload]"
        doc:name="Log Payload"/>
```

**Interview tip:** Do not confuse application logging with a Java-style `System.out.println`; production Mule applications should use structured/application logging rather than console printing.

**Source:** Green Cloud Trainings, “MuleSoft Interview Q&As | DataWeave Part 1” (2024).

## DW-WEB-004 — Application and flow names in logs
**Difficulty:** Medium  
**Question:** How can you include the Mule application name and current flow name in a log message?

**Answer:** Mule 4 exposes predefined context values that can be used in Mule expressions. A Logger can include `app.name` and `flow.name`.

**Example**
```xml
<logger level="INFO"
        message="AppName: #[app.name] | FlowName: #[flow.name] | Payload: #[payload]"
        doc:name="Request Logger"/>
```

**Expected log shape**
```
AppName: my-order-api | FlowName: process-order-flow | Payload: ...
```

**Interview tip:** Treat these as Mule runtime context values, not ordinary fields in the input payload.

**Sources:** Stack Overflow discussion on retrieving the Mule application name; MuleSoft release notes documenting `flow.name`; current MuleSoft examples showing `app.name` and `flow.name` in Logger expressions.

## DW-WEB-005 — Reading properties with p()
**Difficulty:** Easy  
**Question:** What is the `p()` function in DataWeave, and how do you use it to read a Mule property?

**Answer:** `p` retrieves a configured Mule property, system property, or environment property. In modern Mule 4 usage, the Mule namespace form `Mule::p(...)` is recommended.

**Example**
```dataweave
%dw 2.0
output application/json
---
{
  port: Mule::p("http.port")
}
```

For a secure property:
```dataweave
Mule::p("secure::db.password")
```

**Interview tip:** `p()` is for property lookup; it is not the same thing as reading a field from `payload` or `vars`.

**Source:** MuleSoft documentation, “External Functions Available to DataWeave” and the `p` function reference.

## Deduplication note

The repository already covers the following web-discovered topics, so they were not added again as separate questions:

- `map` vs `mapObject`
- `flatten` vs `flatMap`
- `reduce`
- `groupBy`, `orderBy`, `splitBy`
- null handling
- `read` vs `readUrl`
- JSON/XML/CSV transformations
- dynamic selectors and query-parameter construction
- runtime/dynamic evaluation
- Java interoperability
- flow lookup
- masking
- custom functions
- DataWeave script variables and selectors

The repository's existing curated banks and gap-analysis files were checked before adding the five entries above. This file is intentionally limited to additions that were not already represented as the same question/concept.

## Web sources

- https://mulezone.blogspot.com/2021/06/dataweave-20-interview-questions.html
- https://www.youtube.com/watch?v=lxVOG8Kfwvg
- https://stackoverflow.com/questions/18314683/how-to-get-the-mule-application-name
- https://docs.mulesoft.com/release-notes/mule-runtime/mule-4.3.0-release-notes
- https://docs.mulesoft.com/dataweave/2.5/dataweave-runtime-functions
- https://docs.mulesoft.com/dataweave/2.3/dw-mule-functions-p
