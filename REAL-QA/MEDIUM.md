# Medium — Curated DataWeave Q&A

## DW-R21 — Filter and map together
**Question:** Return the names of active employees earning at least 50,000.

**Input**
```json
[{"name":"A","active":true,"salary":60000},{"name":"B","active":true,"salary":40000},{"name":"C","active":false,"salary":80000}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter ($.active and $.salary >= 50000) map $.name
```
**Output**
```json
["A"]
```
**Explanation:** `filter` first selects qualifying records and `map` projects the names.
**Common mistake:** Mapping first and losing the salary/active fields needed by the filter.
**Interview tip:** Combining small transformations often reads better than one giant lambda.

## DW-R22 — Group employees by department
**Question:** Group employees into an object keyed by department.

**Input**
```json
[{"name":"A","dept":"IT"},{"name":"B","dept":"HR"},{"name":"C","dept":"IT"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload groupBy $.dept
```
**Output**
```json
{"IT":[{"name":"A","dept":"IT"},{"name":"C","dept":"IT"}],"HR":[{"name":"B","dept":"HR"}]}
```
**Explanation:** `groupBy` returns an object whose keys represent grouping criteria and whose values contain matching input elements.
**Common mistake:** Expecting an array from `groupBy`.
**Interview tip:** Remember that object keys are ultimately represented as DataWeave keys.

## DW-R23 — Convert grouped data to a summary
**Question:** Return each department and its employee count.

**Input**
```json
[{"name":"A","dept":"IT"},{"name":"B","dept":"IT"},{"name":"C","dept":"HR"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.dept) mapObject ((employees, dept) -> {
  (dept): sizeOf(employees)
})
```
**Output**
```json
{"IT":2,"HR":1}
```
**Explanation:** `groupBy` creates groups and `mapObject` transforms each group into a count.
**Common mistake:** Using `map` on the grouped object.
**Interview tip:** `groupBy` + `mapObject` is a common aggregation pattern.

## DW-R24 — Transform object values with mapObject
**Question:** Add 10 to every numeric value in an object.

**Input**
```json
{"a":1,"b":2,"c":3}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload mapObject ((value, key) -> {
  (key): value + 10
})
```
**Output**
```json
{"a":11,"b":12,"c":13}
```
**Explanation:** `mapObject` iterates over key-value pairs and produces an object.
**Common mistake:** Using `map`, which is designed for arrays.
**Interview tip:** Know the three lambda values available to `mapObject`: value, key and index.

## DW-R25 — Filter an object by key
**Question:** Keep only keys beginning with `user`.

**Input**
```json
{"userId":1,"userName":"A","status":"ACTIVE"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> (key as String) startsWith "user")
```
**Output**
```json
{"userId":1,"userName":"A"}
```
**Explanation:** `filterObject` filters object entries rather than array elements.
**Common mistake:** Comparing a DataWeave `Key` directly with a String when type compatibility matters.
**Interview tip:** DataWeave object keys are a distinct `Key` type; casting to String can make intent explicit.

## DW-R26 — Pluck object keys
**Question:** Return all keys of an object as an array.

**Input**
```json
{"id":10,"name":"A","active":true}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload pluck ((value, key) -> key as String)
```
**Output**
```json
["id","name","active"]
```
**Explanation:** `pluck` transforms an object iteration into an array.
**Common mistake:** Expecting `mapObject` to return an array.
**Interview tip:** `pluck` is useful when the target is an array of keys, values or calculated entries.

## DW-R27 — Sum values with reduce
**Question:** Calculate the total of an array of numbers.

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
**Explanation:** `reduce` carries an accumulator through the array.
**Common mistake:** Confusing `$` and `$$` in a reduce lambda.
**Interview tip:** The current item and accumulator have different roles.

## DW-R28 — Calculate an order total
**Question:** Sum `quantity * price` across order lines.

**Input**
```json
{"items":[{"quantity":2,"price":10},{"quantity":3,"price":5}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.items reduce ((item, acc = 0) -> acc + (item.quantity * item.price))
```
**Output**
```json
35
```
**Explanation:** Each item contributes an amount to the running accumulator.
**Common mistake:** Summing only `price` and ignoring quantity.
**Interview tip:** Reduce is useful when the desired output is a single value rather than an array.

## DW-R29 — Sort by salary
**Question:** Sort employees from lowest salary to highest.

**Input**
```json
[{"name":"A","salary":50000},{"name":"B","salary":30000},{"name":"C","salary":70000}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload orderBy $.salary
```
**Output**
```json
[{"name":"B","salary":30000},{"name":"A","salary":50000},{"name":"C","salary":70000}]
```
**Explanation:** `orderBy` orders the array using the supplied criteria.
**Common mistake:** Sorting by the salary as a formatted string when numeric ordering is required.
**Interview tip:** Preserve numeric types until formatting is actually required.

## DW-R30 — Group and calculate maximum
**Question:** For each department, find the maximum salary.

**Input**
```json
[{"dept":"IT","salary":50},{"dept":"IT","salary":80},{"dept":"HR","salary":60}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.dept) mapObject ((employees, dept) -> {
  (dept): max(employees.salary)
})
```
**Output**
```json
{"IT":80,"HR":60}
```
**Explanation:** The grouped employees are projected to salaries and aggregated with `max`.
**Common mistake:** Applying `max` to the employee objects rather than numeric salaries.
**Interview tip:** Separate grouping, projection and aggregation steps mentally.

## DW-R31 — Convert strings to numbers
**Question:** Convert numeric strings to numbers and calculate a total.

**Input**
```json
["10","20","30"]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map ($ as Number) reduce ((item, acc = 0) -> acc + item)
```
**Output**
```json
60
```
**Explanation:** The values are explicitly cast before arithmetic.
**Common mistake:** Depending on implicit coercion without confirming the input type.
**Interview tip:** Explicit casts make contracts clearer.

## DW-R32 — Normalize nullable array input
**Question:** Safely return an empty array when `items` is null.

**Input**
```json
{"items":null}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload.items default []) map $.id
```
**Output**
```json
[]
```
**Explanation:** The default makes the downstream `map` operate on an array.
**Common mistake:** Calling `map` directly on a possibly null value.
**Interview tip:** Normalize optional collections at the boundary of a transformation.

## DW-R33 — Build dynamic object keys
**Question:** Create an object keyed by employee ID.

**Input**
```json
[{"id":"E1","name":"A"},{"id":"E2","name":"B"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  (payload map ((item) -> (item.id): item.name))
}
```
**Output**
```json
{"E1":"A","E2":"B"}
```
**Explanation:** Parentheses around a key expression make the object key dynamic.
**Common mistake:** Writing `item.id: item.name`, which is not the same dynamic-key syntax.
**Interview tip:** Dynamic keys are essential when transforming lists into lookup objects.

## DW-R34 — Remove null fields
**Question:** Remove fields whose values are null.

**Input**
```json
{"id":1,"name":"A","email":null}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> value != null)
```
**Output**
```json
{"id":1,"name":"A"}
```
**Explanation:** `filterObject` removes key-value pairs based on their values.
**Common mistake:** Confusing null with an empty string or empty array.
**Interview tip:** Define clearly which empty states your API contract permits.

## DW-R35 — Conditional object field
**Question:** Include `discount` only when the customer is premium.

**Input**
```json
{"name":"A","premium":true,"amount":100}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  name: payload.name,
  amount: payload.amount,
  (discount: 10) if payload.premium
}
```
**Output**
```json
{"name":"A","amount":100,"discount":10}
```
**Explanation:** Conditional object construction includes the field only when the condition is true.
**Common mistake:** Returning `discount: null` when the requirement is to omit the field.
**Interview tip:** Distinguish omitted fields from fields explicitly set to null.

## DW-R36 — Nested map
**Question:** Return every order ID and its item names.

**Input**
```json
[{"id":1,"items":[{"name":"A"},{"name":"B"}]},{"id":2,"items":[{"name":"C"}]}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map {
  id: $.id,
  items: $.items map $.name
}
```
**Output**
```json
[{"id":1,"items":["A","B"]},{"id":2,"items":["C"]}]
```
**Explanation:** The outer `map` transforms orders while the inner `map` transforms each order's items.
**Common mistake:** Applying the inner selector to the outer array.
**Interview tip:** Track the current `$` at each nesting level.

## DW-R37 — Join two arrays by ID
**Question:** Add a customer name to each order using a customer array.

**Input**
```json
{"orders":[{"id":1,"customerId":"C1"},{"id":2,"customerId":"C2"}],"customers":[{"id":"C1","name":"A"},{"id":"C2","name":"B"}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.orders map (order) -> {
  orderId: order.id,
  customer: (payload.customers filter $.id == order.customerId)[0].name
}
```
**Output**
```json
[{"orderId":1,"customer":"A"},{"orderId":2,"customer":"B"}]
```
**Explanation:** Each order searches the customer array for a matching ID.
**Common mistake:** Assuming a match always exists without defining the no-match behavior.
**Interview tip:** For large data sets, discuss lookup/indexing strategies rather than repeated scans.

## DW-R38 — Convert object to key-value array
**Question:** Convert configuration properties into an array of records.

**Input**
```json
{"host":"localhost","port":8081}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload pluck ((value, key) -> {
  name: key as String,
  value: value
})
```
**Output**
```json
[{"name":"host","value":"localhost"},{"name":"port","value":8081}]
```
**Explanation:** `pluck` is used to turn object entries into an array.
**Common mistake:** Expecting the result to remain an object.
**Interview tip:** This pattern is useful when an API expects a list of properties.

## DW-R39 — Create a reusable function
**Question:** Create a function that calculates a 10% discount.

**Input**
```json
100
```
**DataWeave**
```dw
%dw 2.0
output application/json
fun discounted(price) = price * 0.90
---
discounted(payload)
```
**Output**
```json
90
```
**Explanation:** Named functions encapsulate reusable transformation logic.
**Common mistake:** Defining a function after the expression that needs it in a confusing script layout.
**Interview tip:** Use functions to isolate business rules that are reused or need independent testing.

## DW-R40 — Match categories
**Question:** Convert a status code to a readable label.

**Input**
```json
{"status":"P"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.status match {
  case "A" -> "ACTIVE"
  case "P" -> "PENDING"
  case "C" -> "CLOSED"
  else -> "UNKNOWN"
}
```
**Output**
```json
"PENDING"
```
**Explanation:** `match` expresses multiple conditional branches clearly.
**Common mistake:** Forgetting a default branch for unexpected codes.
**Interview tip:** `match` is often easier to read than deeply nested `if/else` logic.
