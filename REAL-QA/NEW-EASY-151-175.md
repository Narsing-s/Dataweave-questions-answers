# Easy DataWeave Q&A — DW-E151 to DW-E175

## DW-E151 — Check array size
**Question:** Return the number of customers.
**Input**
```json
[{"id":1},{"id":2},{"id":3}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
sizeOf(payload)
```
**Output** `3`
**Explanation:** `sizeOf` returns the number of elements in the array.
**Common mistake:** Using `length` as if DataWeave arrays were strings.
**Interview tip:** Know the return type for each collection function.

## DW-E152 — Check an empty array
**Question:** Determine whether there are no orders.
**Input** `[]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
isEmpty(payload)
```
**Output** `true`
**Explanation:** `isEmpty` checks whether a collection has no elements.
**Common mistake:** Comparing only with `null`.
**Interview tip:** Empty and null are different states.

## DW-E153 — Check a value is not null
**Question:** Return whether a customer phone value exists.
**Input** `{"phone":"9999999999"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.phone != null
```
**Output** `true`
**Explanation:** Direct null comparison checks whether the selected value is non-null.
**Common mistake:** Assuming non-null means non-blank.
**Interview tip:** Combine null and blank checks when the business rule requires both.

## DW-E154 — Remove duplicate primitive values
**Question:** Return unique product codes.
**Input** `["P1","P2","P1","P3"]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload distinctBy $
```
**Output** `["P1","P2","P3"]`
**Explanation:** `distinctBy` uses each value as its uniqueness criterion.
**Common mistake:** Using `filter` without tracking prior values.
**Interview tip:** Explain the difference between deduplication and duplicate detection.

## DW-E155 — Reverse an array
**Question:** Return transaction IDs in reverse order.
**Input** `["T1","T2","T3"]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload[-1 to 0]
```
**Output** `["T3","T2","T1"]`
**Explanation:** A descending range reverses the selected array.
**Common mistake:** Confusing a range with a sort operation.
**Interview tip:** Range selectors are useful for simple positional transformations.

## DW-E156 — Get the first element safely
**Question:** Return the first order or `null` when the array is empty.
**Input** `[]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload[0] default null
```
**Output** `null`
**Explanation:** Indexing followed by `default` handles an empty array safely.
**Common mistake:** Assuming index zero always exists.
**Interview tip:** Always discuss empty collections at boundaries.

## DW-E157 — Get the last element safely
**Question:** Return the last order or `null` when empty.
**Input** `[{"id":1},{"id":2}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload[-1] default null
```
**Output** `{"id":2}`
**Explanation:** Negative indexing accesses from the end.
**Common mistake:** Using `sizeOf(payload)` directly as the final index.
**Interview tip:** Array indexes are zero-based.

## DW-E158 — Filter active customers
**Question:** Keep customers whose status is `ACTIVE`.
**Input** `[{"id":1,"status":"ACTIVE"},{"id":2,"status":"INACTIVE"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter $.status == "ACTIVE"
```
**Output** `[{"id":1,"status":"ACTIVE"}]`
**Explanation:** `filter` retains array elements satisfying the condition.
**Common mistake:** Using `filterObject` on an array.
**Interview tip:** Know the array/object distinction.

## DW-E159 — Project one field from records
**Question:** Return only customer IDs.
**Input** `[{"id":"C1","name":"A"},{"id":"C2","name":"B"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map $.id
```
**Output** `["C1","C2"]`
**Explanation:** `map` transforms every array element.
**Common mistake:** Returning the entire object when only one field is required.
**Interview tip:** `map` changes each array item; `filter` selects items.

## DW-E160 — Add a derived field
**Question:** Add `isLarge` when an order total exceeds 1000.
**Input** `{"id":"O1","total":1500}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload ++ {isLarge: payload.total > 1000}
```
**Output** `{"id":"O1","total":1500,"isLarge":true}`
**Explanation:** Object concatenation creates a new field.
**Common mistake:** Mutating the original object in place.
**Interview tip:** DataWeave expressions produce values rather than imperative mutations.

## DW-E161 — Rename a field
**Question:** Change `customerId` to `id`.
**Input** `{"customerId":"C1","name":"Ravi"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{id: payload.customerId, name: payload.name}
```
**Output** `{"id":"C1","name":"Ravi"}`
**Explanation:** Explicit mapping defines the target contract.
**Common mistake:** Returning the old key as well.
**Interview tip:** Explicit mappings make API contracts easier to review.

## DW-E162 — Convert object keys to an array
**Question:** Return all configuration key names.
**Input** `{"host":"api","port":443}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
keysOf(payload)
```
**Output** `["host","port"]`
**Explanation:** `keysOf` returns the object's keys.
**Common mistake:** Expecting key/value pairs.
**Interview tip:** Compare `keysOf`, `valuesOf`, and `entriesOf`.

## DW-E163 — Convert object entries to an array
**Question:** Return key/value entries from a configuration object.
**Input** `{"host":"api","port":443}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
entriesOf(payload)
```
**Output** `[{"key":"host","value":"api"},{"key":"port","value":443}]`
**Explanation:** `entriesOf` exposes each object entry as a record.
**Common mistake:** Treating entries as a plain array of values.
**Interview tip:** Entries are useful when object iteration needs both key and value.

## DW-E164 — Test string containment
**Question:** Check whether an order reference contains `-`.
**Input** `{"reference":"ORD-100"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
contains(payload.reference, "-")
```
**Output** `true`
**Explanation:** `contains` checks whether the string contains the requested value.
**Common mistake:** Using equality when only partial matching is required.
**Interview tip:** Clarify case sensitivity for business comparisons.

## DW-E165 — Check a prefix
**Question:** Determine whether an API path starts with `/v1`.
**Input** `{"path":"/v1/customers"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
startsWith(payload.path, "/v1")
```
**Output** `true`
**Explanation:** `startsWith` checks the beginning of a string.
**Common mistake:** Searching anywhere in the string instead.
**Interview tip:** Prefix checks are useful for simple routing transformations.

## DW-E166 — Check a suffix
**Question:** Determine whether a file name ends with `.json`.
**Input** `{"file":"customers.json"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
endsWith(payload.file, ".json")
```
**Output** `true`
**Explanation:** `endsWith` checks the final characters.
**Common mistake:** Treating `.JSON` as automatically equivalent if case sensitivity matters.
**Interview tip:** Normalize case when file extensions are case-insensitive in the business rule.

## DW-E167 — Split a comma-separated value
**Question:** Convert a comma-separated list into an array.
**Input** `{"tags":"api,mule,dataweave"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
splitBy(payload.tags, ",")
```
**Output** `["api","mule","dataweave"]`
**Explanation:** `splitBy` separates a string using the supplied delimiter.
**Common mistake:** Forgetting to trim whitespace when input contains spaces after commas.
**Interview tip:** Consider normalization after splitting.

## DW-E168 — Join an array into text
**Question:** Create a comma-separated tag string.
**Input** `["api","mule","dw"]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
joinBy(payload, ",")
```
**Output** `"api,mule,dw"`
**Explanation:** `joinBy` combines array values into one string.
**Common mistake:** Joining an object instead of an array.
**Interview tip:** Use it when a downstream system expects delimited text.

## DW-E169 — Replace a string value
**Question:** Replace `localhost` with `api.example.com` in a URL.
**Input** `{"url":"http://localhost:8080/orders"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
replace(payload.url, "localhost") with "api.example.com"
```
**Output** `"http://api.example.com:8080/orders"`
**Explanation:** The replacement expression changes the matching text.
**Common mistake:** Replacing the entire URL when only the host must change.
**Interview tip:** For complex URLs, parse components rather than relying only on string replacement.

## DW-E170 — Calculate a maximum
**Question:** Return the highest transaction amount.
**Input** `[100,250,175]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
max(payload)
```
**Output** `250`
**Explanation:** `max` returns the greatest value.
**Common mistake:** Sorting the whole array when only the maximum is needed.
**Interview tip:** Choose the simplest aggregation that meets the requirement.

## DW-E171 — Calculate a minimum
**Question:** Return the smallest transaction amount.
**Input** `[100,250,75]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
min(payload)
```
**Output** `75`
**Explanation:** `min` returns the lowest value.
**Common mistake:** Confusing `min` with minimum array index.
**Interview tip:** Explain how null/empty input should be handled.

## DW-E172 — Calculate an average
**Question:** Return the average score for three records.
**Input** `[80,90,100]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
avg(payload)
```
**Output** `90`
**Explanation:** `avg` calculates the arithmetic mean.
**Common mistake:** Forgetting the empty-array case in production transformations.
**Interview tip:** Define the expected behavior for no observations.

## DW-E173 — Filter a numeric range
**Question:** Keep ages between 18 and 60 inclusive.
**Input** `[15,18,25,60,70]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter ($ >= 18 and $ <= 60)
```
**Output** `[18,25,60]`
**Explanation:** Two comparisons define an inclusive range.
**Common mistake:** Accidentally using strict inequalities.
**Interview tip:** State whether boundaries are inclusive.

## DW-E174 — Build a status message
**Question:** Return `PAID` when an invoice balance is zero, otherwise `DUE`.
**Input** `{"balance":0}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.balance == 0) "PAID" else "DUE"
```
**Output** `"PAID"`
**Explanation:** Conditional expressions are concise for binary business rules.
**Common mistake:** Treating any negative balance as automatically equivalent without a business definition.
**Interview tip:** Document special financial cases explicitly.

## DW-E175 — Create an audit record
**Question:** Build an audit object from an operation payload.
**Input** `{"id":"O1","status":"SUCCESS"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  recordId: payload.id,
  status: payload.status,
  eventType: "ORDER_PROCESSED"
}
```
**Output** `{"recordId":"O1","status":"SUCCESS","eventType":"ORDER_PROCESSED"}`
**Explanation:** The transformation creates a small, stable audit contract.
**Common mistake:** Copying the complete payload when only audit fields are required.
**Interview tip:** Keep audit schemas intentionally explicit.
