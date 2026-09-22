# Web-Sourced DataWeave Questions — Batch 010

These entries were selected from the current MuleSoft DataWeave reference after repository duplicate checks. Existing concepts were left untouched.

## Q74 — How do you generate a random integer in DataWeave?

**Answer:** Use `randomInt(max)`. It returns a pseudo-random whole number from `0` up to, but not including, the specified maximum.

**Example**
```dataweave
%dw 2.0
output application/json
---
{
  value: randomInt(100),
  rule: "0 <= value < 100"
}
```

**Output**
```json
{
  "value": 37,
  "rule": "0 <= value < 100"
}
```

**Explanation:** The numeric value is intentionally variable, so the example output is illustrative rather than guaranteed. `randomInt(100)` produces a pseudo-random integer in the range 0–99. citeturn0search3

## Q75 — How do you retrieve all properties configured for the DataWeave runtime?

**Answer:** Import `dw::Runtime` and call `props()` to retrieve the runtime properties.

**Example**
```dataweave
%dw 2.0
import * from dw::Runtime
output application/json
---
{
  configuredProperties: props()
}
```

**Output**
```json
{
  "configuredProperties": {
    "example.property": "example-value"
  }
}
```

**Explanation:** `props()` returns the properties configured for the DataWeave runtime. The exact property set depends on the runtime environment, so the output shown is illustrative. This is different from `prop(name)`, which requests one named property. citeturn2view0

## Q76 — What does `locationString` do in DataWeave?

**Answer:** `locationString(value)` returns a string describing the source location of a value when DataWeave can trace that value back to a DataWeave source file; otherwise it can return `null`.

**Example**
```dataweave
%dw 2.0
import * from dw::Runtime
output application/json
---
{
  value: payload.name,
  sourceLocation: locationString(payload.name)
}
```

**Output**
```json
{
  "value": "Ravi",
  "sourceLocation": null
}
```

**Explanation:** Source-location information is available only when the runtime can trace the value back to a DataWeave file. For externally supplied payload data, `null` can therefore be a valid result. citeturn2view0