# Easy DataWeave Q&A — DW-E201 to DW-E205

## DW-E201 — Check a field exists before using it
**Question:** Return the customer city when present, otherwise `UNKNOWN`.
**Input** `{"name":"Ravi"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.city default "UNKNOWN"
```
**Output** `"UNKNOWN"`
**Explanation:** `default` provides a safe value for a missing selector result.
**Common mistake:** Assuming every source field exists.
**Interview tip:** Discuss missing versus null values.

## DW-E202 — Convert a Boolean to text
**Question:** Return an API-friendly text status from a Boolean flag.
**Input** `{"active":true}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.active) "ACTIVE" else "INACTIVE"
```
**Output** `"ACTIVE"`
**Explanation:** A Boolean is mapped to the target contract's status text.
**Common mistake:** Returning the Boolean when the API expects text.
**Interview tip:** Separate source representation from target representation.

## DW-E203 — Remove leading zeros from a numeric value
**Question:** Convert numeric text `00042` to the number `42`.
**Input** `{"value":"00042"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.value as Number
```
**Output** `42`
**Explanation:** Numeric casting normalizes the representation.
**Common mistake:** Removing zeros with string replacement when the target is numeric.
**Interview tip:** Decide whether leading zeros carry business meaning before casting.

## DW-E204 — Create a simple boolean flag from a threshold
**Question:** Return whether a payment requires review when its amount exceeds 10000.
**Input** `{"amount":12000}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.amount > 10000
```
**Output** `true`
**Explanation:** A comparison directly produces a Boolean business flag.
**Common mistake:** Returning a text value instead of Boolean.
**Interview tip:** Keep threshold rules explicit and test boundary values.

## DW-E205 — Select one field from each record
**Question:** Return only order references from an array of orders.
**Input** `[{"reference":"O1","amount":100},{"reference":"O2","amount":200}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map $.reference
```
**Output** `["O1","O2"]`
**Explanation:** `map` projects each record to one selected value.
**Common mistake:** Using `filter`, which selects records instead of transforming them.
**Interview tip:** Clearly distinguish projection from filtering.
