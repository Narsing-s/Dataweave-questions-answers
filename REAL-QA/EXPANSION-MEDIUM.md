# Expansion — Medium DataWeave Q&A

## DW-M61 — Group customers by country
**Question:** Group customer records by country.
**Input**
```json
[{"id":1,"country":"IN"},{"id":2,"country":"US"},{"id":3,"country":"IN"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload groupBy $.country
```
**Output**
```json
{"IN":[{"id":1,"country":"IN"},{"id":3,"country":"IN"}],"US":[{"id":2,"country":"US"}]}
```
**Explanation:** `groupBy` returns an object whose keys are grouping criteria and whose values are arrays of matching records.
**Common mistake:** Expecting an array instead of an object.
**Interview tip:** Explain the output type of `groupBy` before continuing with `mapObject`.

## DW-M62 — Sum grouped values
**Question:** Group sales by region and calculate each region's total.
**Input**
```json
[{"region":"S","amount":100},{"region":"S","amount":50},{"region":"N","amount":80}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.region) mapObject ((rows, region) -> {
  (region): sum(rows.amount)
})
```
**Output**
```json
{"S":150,"N":80}
```
**Explanation:** First group records, then aggregate the amount array for each group.
**Common mistake:** Summing the complete payload for every group.
**Interview tip:** Separate grouping and aggregation into understandable stages.

## DW-M63 — Deduplicate by ID
**Question:** Keep the first record for each customer ID.
**Input**
```json
[{"id":1,"name":"A"},{"id":1,"name":"A2"},{"id":2,"name":"B"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
distinctBy payload, $.id
```
**Output**
```json
[{"id":1,"name":"A"},{"id":2,"name":"B"}]
```
**Explanation:** `distinctBy` uses the lambda result as the uniqueness criterion.
**Common mistake:** Assuming it merges duplicate records.
**Interview tip:** State what record should win when duplicate values differ.

## DW-M64 — Flatten nested arrays
**Question:** Convert nested item arrays into one item array.
**Input**
```json
{"orders":[{"items":[1,2]},{"items":[3,4]}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
flatten(payload.orders.items)
```
**Output**
```json
[1,2,3,4]
```
**Explanation:** The nested arrays are combined into one level.
**Common mistake:** Using `flatten` when nested depth or parent information must be preserved.
**Interview tip:** Ask whether the business needs a flat list or parent-child relationships.

## DW-M65 — Use flatMap
**Question:** Return one record per order item while retaining the order ID.
**Input**
```json
[{"id":"O1","items":[{"sku":"A"},{"sku":"B"}]},{"id":"O2","items":[{"sku":"C"}]}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload flatMap ((order) -> order.items map {orderId: order.id, sku: $.sku})
```
**Output**
```json
[{"orderId":"O1","sku":"A"},{"orderId":"O1","sku":"B"},{"orderId":"O2","sku":"C"}]
```
**Explanation:** Each order produces an array of child records and `flatMap` combines those arrays.
**Common mistake:** Using `map` alone and leaving an array of arrays.
**Interview tip:** `flatMap` is useful when one source element produces zero or more output elements.

## DW-M66 — Sort records by amount
**Question:** Sort transactions from lowest to highest amount.
**Input**
```json
[{"id":"A","amount":50},{"id":"B","amount":10},{"id":"C","amount":30}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload orderBy $.amount
```
**Output**
```json
[{"id":"B","amount":10},{"id":"C","amount":30},{"id":"A","amount":50}]
```
**Explanation:** `orderBy` orders the array using the selected value.
**Common mistake:** Sorting textual numbers without converting them.
**Interview tip:** Check whether the source contains Number or String values.

## DW-M67 — Convert object keys to uppercase
**Question:** Uppercase every key in an object.
**Input**
```json
{"firstName":"Ravi","city":"Hyderabad"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload mapObject ((value, key) -> {(upper(key)): value})
```
**Output**
```json
{"FIRSTNAME":"Ravi","CITY":"Hyderabad"}
```
**Explanation:** `mapObject` transforms object entries while retaining object shape.
**Common mistake:** Using `map`, which is intended for arrays.
**Interview tip:** `mapObject` receives value, key and index.

## DW-M68 — Filter object keys by prefix
**Question:** Keep only keys beginning with `x-`.
**Input**
```json
{"x-id":1,"x-trace":"abc","name":"Ravi"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> key startsWith "x-")
```
**Output**
```json
{"x-id":1,"x-trace":"abc"}
```
**Explanation:** `filterObject` evaluates object keys and retains matching entries.
**Common mistake:** Filtering values instead of keys.
**Interview tip:** This pattern is useful for metadata/header-like objects.

## DW-M69 — Create a lookup object
**Question:** Convert product records into an object keyed by product ID.
**Input**
```json
[{"id":"P1","name":"Phone"},{"id":"P2","name":"Tablet"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload map ((item) -> {(item.id): item.name})) reduce ((item, acc = {}) -> acc ++ item)
```
**Output**
```json
{"P1":"Phone","P2":"Tablet"}
```
**Explanation:** Each record becomes a one-entry object and the entries are merged.
**Common mistake:** Ignoring duplicate IDs.
**Interview tip:** Define duplicate-key policy before creating lookup maps.

## DW-M70 — Remove blank strings
**Question:** Remove object fields whose values are blank.
**Input**
```json
{"name":"Ravi","phone":"   ","city":"Hyd"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filterObject ((value) -> !isBlank(value as String))
```
**Output**
```json
{"name":"Ravi","city":"Hyd"}
```
**Explanation:** The predicate treats whitespace-only strings as blank.
**Common mistake:** Checking only `value != null`.
**Interview tip:** Null and blank are separate data-quality cases.

## DW-M71 — Aggregate with reduce
**Question:** Calculate a running sum of numbers.
**Input**
```json
[10,20,30]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((item, acc = 0) -> acc + item)
```
**Output**
```json
60
```
**Explanation:** The accumulator starts at zero and receives each item.
**Common mistake:** Using the current item as the accumulator.
**Interview tip:** Be able to state the accumulator's initial type and final type.

## DW-M72 — Conditional field inclusion
**Question:** Include `vip: true` only when spend exceeds 10000.
**Input**
```json
{"id":1,"spend":12000}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  spend: payload.spend,
  (vip: true) if payload.spend > 10000
}
```
**Output**
```json
{"id":1,"spend":12000,"vip":true}
```
**Explanation:** DataWeave supports conditional object fields using `if`.
**Common mistake:** Creating `vip: null` when the field should be absent.
**Interview tip:** Distinguish omitted fields from null-valued fields in API contracts.

## DW-M73 — Normalize an array of names
**Question:** Trim and lowercase every name.
**Input**
```json
[" Ravi ","ANU","  John"]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map trim($) map lower($)
```
**Output**
```json
["ravi","anu","john"]
```
**Explanation:** Two transformations are chained so normalization remains readable.
**Common mistake:** Calling `lower` before removing whitespace when whitespace is significant to the source.
**Interview tip:** Chained transformations are often easier to maintain than one large lambda.

## DW-M74 — Extract unique categories
**Question:** Return unique product categories.
**Input**
```json
[{"category":"A"},{"category":"B"},{"category":"A"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload map $.category) distinctBy $
```
**Output**
```json
["A","B"]
```
**Explanation:** First project the category values, then deduplicate them.
**Common mistake:** Applying `distinctBy $` directly to objects when uniqueness should be based on a field.
**Interview tip:** Separate projection from uniqueness criteria.

## DW-M75 — Build a summary response
**Question:** Return count, total amount and average amount for transactions.
**Input**
```json
[{"amount":100},{"amount":200},{"amount":300}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  count: sizeOf(payload),
  total: sum(payload.amount),
  average: avg(payload.amount)
}
```
**Output**
```json
{"count":3,"total":600,"average":200}
```
**Explanation:** Several aggregate functions are combined into one response object.
**Common mistake:** Calculating average manually without considering an empty array.
**Interview tip:** Always discuss empty-input behavior for aggregate APIs.
