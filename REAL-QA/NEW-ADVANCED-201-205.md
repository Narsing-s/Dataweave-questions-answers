# Advanced DataWeave Q&A — DW-A201 to DW-A205

## DW-A201 — Normalize a polymorphic payload
**Question:** Accept either one transaction object or an array and always return an array.
**Input** `{"transactions":{"id":"T1","amount":100}}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.transactions is Array) payload.transactions else [payload.transactions]
```
**Output** `[{"id":"T1","amount":100}]`
**Explanation:** A polymorphic boundary is normalized into one predictable internal type.
**Common mistake:** Wrapping an existing array a second time.
**Interview tip:** Normalize once at the boundary instead of spreading type checks through the mapping.

## DW-A202 — Use `match` for typed business states
**Question:** Convert transaction status and amount into a processing category.
**Input** `{"status":"PENDING","amount":12000}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.status == "PENDING")
  (if (payload.amount > 10000) "HIGH_VALUE_PENDING" else "PENDING")
else
  payload.status match {
    case "SUCCESS" -> "COMPLETED"
    case "FAILED" -> "ERROR"
    else -> "OTHER"
  }
```
**Output** `"HIGH_VALUE_PENDING"`
**Explanation:** Nested business rules are evaluated in a deliberate order so the high-value pending case is not lost.
**Common mistake:** Matching only the status and ignoring the amount-specific rule.
**Interview tip:** Put the most specific business exception before broad categories.

## DW-A203 — Aggregate validation failures
**Question:** Return all missing required fields rather than stopping at the first one.
**Input** `{"name":"Ravi"}`
**DataWeave**
```dw
%dw 2.0
output application/json
var required = ["name", "email", "phone"]
var missing = required filter ((key) -> payload[key] == null or isBlank(payload[key] as String))
---
{valid: isEmpty(missing), missingFields: missing}
```
**Output** `{"valid":false,"missingFields":["email","phone"]}`
**Explanation:** Validation is accumulated into a list so consumers receive all missing fields at once.
**Common mistake:** Returning only the first validation failure.
**Interview tip:** Aggregated validation is usually more useful for API clients.

## DW-A204 — Reconcile duplicate business keys deterministically
**Question:** Keep the latest record for each customer ID based on a numeric version.
**Input** `[{"id":"C1","version":1,"name":"Old"},{"id":"C1","version":2,"name":"New"},{"id":"C2","version":1,"name":"Asha"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload
  groupBy $.id
  pluck ((records, id) -> records orderBy -$.version)[0]
```
**Output** `[{"id":"C1","version":2,"name":"New"},{"id":"C2","version":1,"name":"Asha"}]`
**Explanation:** Grouping isolates each business key and descending version order selects the newest record.
**Common mistake:** Using `distinctBy` when the winner must be explicitly defined.
**Interview tip:** Always state the duplicate-resolution rule.

## DW-A205 — Protect a percentage calculation from zero denominators
**Question:** Calculate a success rate without failing when no transactions exist.
**Input** `{"successful":0,"total":0}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.total == 0) 0 else (payload.successful / payload.total) * 100
```
**Output** `0`
**Explanation:** The zero-total branch defines a deterministic business result instead of dividing by zero.
**Common mistake:** Assuming every production batch contains at least one transaction.
**Interview tip:** Explicitly define denominator-zero behavior for reporting transformations.
