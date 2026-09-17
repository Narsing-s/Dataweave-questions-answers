# A497 — Invalid DataWeave Range Semantics and Upgrade-Safe Validation

**Difficulty:** Advanced / Critical Interview

## Question
A production Mule application generates numeric ranges from configuration values and uses those ranges for batching, pagination, or array selection. After upgrading the Mule/DataWeave runtime, a case that previously produced an unexpected range result now produces `null` for an invalid range.

Answer all of the following:

1. What is the current DataWeave behavior for an invalid range produced with the range operator (`to`)?
2. Why should application code distinguish an invalid range from an empty business collection?
3. How would you validate configuration before using the range in downstream transformation logic?
4. How can an upgrade expose this issue even when the DataWeave source code itself has not changed?
5. How would you design a regression test so that the transformation does not silently convert a bad pagination/batching configuration into an incorrect business result?

## Answer

The current DataWeave behavior is that the **range operator returns `null` for an invalid range**. MuleSoft documented this behavior change in DataWeave 2.11.2, and the fix is also present in later compatible runtime lines. citeturn2search0

The important distinction is between an **invalid range** and a legitimate empty result. An application might use a range to calculate indexes, page boundaries, batch numbers, or positions in an array. If the configuration says that the start/end relationship is invalid, treating the resulting `null` as if it represented an ordinary empty collection can hide a configuration defect.

For example, suppose a flow receives:

```json
{
  "start": 10,
  "end": 5
}
```

A robust transformation should not blindly assume that the values form a valid range. Validate the business rule first and make the failure explicit:

```dataweave
%dw 2.0
output application/json
var start = payload.start
var end = payload.end
---
if (start <= end)
  {
    valid: true,
    range: start to end
  }
else
  {
    valid: false,
    error: "Invalid range configuration",
    start: start,
    end: end
  }
```

The exact business rule can differ. For pagination, for example, the application may require `start <= end`; for another use case, a descending range may be intentionally meaningful. The transformation should therefore validate the **business contract**, not merely rely on the operator's behavior.

### Why this is an upgrade-sensitive question

DataWeave minor releases can change language behavior while providing compatibility mechanisms for older applications. MuleSoft's versioning documentation explains that language behavior can change between minor versions and that the effective DataWeave language level in a Mule application is related to `minMuleVersion`. citeturn1search11

Therefore, when an application is upgraded, regression tests should cover boundary inputs such as:

- valid ascending range;
- equal start and end values;
- invalid start/end relationship;
- missing/null configuration;
- non-numeric configuration;
- configuration values that exceed the intended business limits.

### Production scenario

A banking API uses a configured index range to select transaction records for a page. A deployment upgrades the Mule runtime, and an invalid page configuration starts producing `null`. The correct response is not to blindly replace `null` with `[]`. First determine whether the configuration itself violates the API's pagination contract. If it does, return a controlled validation error instead of silently producing an empty transaction page.

### Common mistakes

1. Assuming every range expression produces an array.
2. Treating `null` from an invalid range as equivalent to an empty array.
3. Fixing the symptom with `default []` before validating the configuration.
4. Testing only normal ranges and never testing invalid boundaries.
5. Assuming a Mule runtime upgrade cannot affect DataWeave semantics when the `%dw` source is unchanged.

### Interview tip

A strong answer connects **operator semantics → input validation → business rules → runtime/language-level compatibility → regression testing**. The key lesson is that a DataWeave transformation must not hide an invalid range configuration merely because downstream code can technically continue processing a `null` value.

### Source note

MuleSoft's DataWeave 2.11 release notes identify the invalid-range behavior change as W-21781423. citeturn2search0
