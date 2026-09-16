# Medium DataWeave Q&A — DW-M211 to DW-M225

## DW-M211 — Group orders by status
**Question:** Group orders into `PAID` and `PENDING` buckets.
**Input** `[{"id":"O1","status":"PAID"},{"id":"O2","status":"PENDING"},{"id":"O3","status":"PAID"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload groupBy $.status
```
**Output** `{"PAID":[{"id":"O1","status":"PAID"},{"id":"O3","status":"PAID"}],"PENDING":[{"id":"O2","status":"PENDING"}]}`
**Explanation:** `groupBy` creates object keys from the grouping expression.
**Common mistake:** Expecting an array of groups instead of an object.
**Interview tip:** Explain how dynamic group keys are created.

## DW-M212 — Calculate a total with reduce
**Question:** Calculate the total value of three line items.
**Input** `[{"amount":100},{"amount":250},{"amount":50}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((item, total = 0) -> total + item.amount)
```
**Output** `400`
**Explanation:** `reduce` accumulates values into one result.
**Common mistake:** Returning an array from the reducer.
**Interview tip:** Describe the accumulator and current item separately.

## DW-M213 — Create an object with mapObject
**Question:** Convert each customer field into an object containing its original value.
**Input** `{"name":"Ravi","city":"Hyderabad"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload mapObject ((value, key) -> {(key): {value: value}})
```
**Output** `{"name":{"value":"Ravi"},"city":{"value":"Hyderabad"}}`
**Explanation:** `mapObject` transforms each key-value pair while preserving dynamic keys.
**Common mistake:** Using `map`, which is intended for arrays.
**Interview tip:** Compare `map` and `mapObject` using input types.

## DW-M214 — Filter object fields
**Question:** Keep only fields whose values are strings.
**Input** `{"name":"Ravi","age":26,"city":"Hyderabad"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> value is String)
```
**Output** `{"name":"Ravi","city":"Hyderabad"}`
**Explanation:** `filterObject` evaluates every key-value pair.
**Common mistake:** Filtering an object with array-only assumptions.
**Interview tip:** Explain value type checks and dynamic object filtering.

## DW-M215 — Flatten nested arrays
**Question:** Convert nested order-item arrays into one item array.
**Input** `[[{"id":"I1"}],[{"id":"I2"},{"id":"I3"}]]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
flatten(payload)
```
**Output** `[{"id":"I1"},{"id":"I2"},{"id":"I3"}]`
**Explanation:** `flatten` removes one level of array nesting.
**Common mistake:** Assuming it recursively removes every possible depth.
**Interview tip:** Distinguish `flatten` from recursive normalization.

## DW-M216 — Use flatMap for one-to-many expansion
**Question:** Expand each order into one record per item.
**Input** `[{"order":"O1","items":["A","B"]},{"order":"O2","items":["C"]}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload flatMap ((order) -> order.items map ((item) -> {order: order.order, item: item}))
```
**Output** `[{"order":"O1","item":"A"},{"order":"O1","item":"B"},{"order":"O2","item":"C"}]`
**Explanation:** `flatMap` maps each parent to multiple records and flattens the result.
**Common mistake:** Producing nested arrays with plain `map`.
**Interview tip:** Use `flatMap` for one-to-many transformations.

## DW-M217 — Add a conditional field
**Question:** Add `priority: "HIGH"` only when an order amount exceeds 10000.
**Input** `{"id":"O1","amount":15000}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  amount: payload.amount,
  (priority: "HIGH") if payload.amount > 10000
}
```
**Output** `{"id":"O1","amount":15000,"priority":"HIGH"}`
**Explanation:** Conditional object fields let the target shape change without emitting null placeholders.
**Common mistake:** Always creating the field with null.
**Interview tip:** Discuss when optional fields should be omitted versus null.

## DW-M218 — Build a lookup index
**Question:** Create an object keyed by customer ID for fast repeated lookup.
**Input** `[{"id":"C1","name":"Ravi"},{"id":"C2","name":"Sita"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((item, acc = {}) -> acc ++ {(item.id): item})
```
**Output** `{"C1":{"id":"C1","name":"Ravi"},"C2":{"id":"C2","name":"Sita"}}`
**Explanation:** The array is transformed into an index keyed by business ID.
**Common mistake:** Performing a full filter scan for every lookup when the same source is queried repeatedly.
**Interview tip:** Explain the trade-off between building an index and doing direct scans.

## DW-M219 — Remove duplicate records by key
**Question:** Keep the first record for each customer ID.
**Input** `[{"id":"C1","name":"A"},{"id":"C1","name":"B"},{"id":"C2","name":"C"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload distinctBy $.id
```
**Output** `[{"id":"C1","name":"A"},{"id":"C2","name":"C"}]`
**Explanation:** Uniqueness is determined by the business ID.
**Common mistake:** Assuming the last duplicate wins.
**Interview tip:** If the business rule requires latest-wins, use explicit version/date logic instead.

## DW-M220 — Aggregate amounts by category
**Question:** Return the total amount for each category.
**Input** `[{"category":"A","amount":10},{"category":"B","amount":20},{"category":"A","amount":15}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.category) mapObject ((items, key) -> {(key): sum(items.amount)})
```
**Output** `{"A":25,"B":20}`
**Explanation:** The transformation groups records first and then aggregates each group.
**Common mistake:** Summing the entire input instead of each group.
**Interview tip:** Separate grouping from aggregation mentally and in the script.

## DW-M221 — Normalize scalar-or-array input
**Question:** Always return `roles` as an array whether the source contains one role or many.
**Input** `{"roles":"ADMIN"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{roles: if (payload.roles is Array) payload.roles else [payload.roles]}
```
**Output** `{"roles":["ADMIN"]}`
**Explanation:** Polymorphic input is normalized into one stable target type.
**Common mistake:** Applying `map` to a scalar.
**Interview tip:** Normalize source variability at the boundary of the integration.

## DW-M222 — Validate multiple fields together
**Question:** Return all missing required fields from a customer record.
**Input** `{"name":"Ravi","email":""}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
[
  {field: "name", missing: isBlank(payload.name default "")},
  {field: "email", missing: isBlank(payload.email default "")}
] filter $.missing map $.field
```
**Output** `["email"]`
**Explanation:** Each validation rule produces a result, then only failing fields are retained.
**Common mistake:** Stopping at the first invalid field when the API needs all validation errors.
**Interview tip:** Validation aggregation improves client-side error correction.

## DW-M223 — Update a nested value
**Question:** Change a customer's city without rebuilding the entire object.
**Input** `{"customer":{"address":{"city":"Delhi","zip":"110001"}}}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload update {
  case .customer.address.city -> "Hyderabad"
}
```
**Output** `{"customer":{"address":{"city":"Hyderabad","zip":"110001"}}}`
**Explanation:** `update` targets a specific nested location while preserving unrelated fields.
**Common mistake:** Reconstructing the entire hierarchy unnecessarily.
**Interview tip:** Mention `update` when only a few nested values need modification.

## DW-M224 — Use match for classification
**Question:** Classify an account as `PREMIUM`, `STANDARD`, or `BASIC` from its balance.
**Input** `{"balance":75000}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.balance match {
  case n if n >= 100000 -> "PREMIUM"
  case n if n >= 50000 -> "STANDARD"
  else -> "BASIC"
}
```
**Output** `"STANDARD"`
**Explanation:** `match` expresses ordered business branches clearly.
**Common mistake:** Reversing threshold order so a broad condition catches everything.
**Interview tip:** Put more specific thresholds before broader ones.

## DW-M225 — Reuse a filtered collection
**Question:** Calculate both the count and total amount of successful payments without repeating the filter.
**Input** `[{"status":"SUCCESS","amount":100},{"status":"FAILED","amount":50},{"status":"SUCCESS","amount":200}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
do {
  var successful = payload filter $.status == "SUCCESS"
  ---
  {
    count: sizeOf(successful),
    total: sum(successful.amount)
  }
}
```
**Output** `{"count":2,"total":300}`
**Explanation:** A local variable avoids repeating the same filtering expression.
**Common mistake:** Copying the filter separately for every derived field.
**Interview tip:** Local bindings improve readability and can avoid unnecessary repeated work.
