# Medium DataWeave — Functions, Arrays & Objects

## DW-M016 — Extract active customer IDs

**Question:** From an array of customers, keep only active customer IDs.

### Input
```json
[{"id":1,"status":"ACTIVE"},{"id":2,"status":"INACTIVE"},{"id":3,"status":"ACTIVE"}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
payload filter ($.status == "ACTIVE") map $.id
```
### Expected Output
```json
[1,3]
```
### Explanation
`filter` reduces the input to matching customers; `map` projects each remaining object to its ID.
### Common Mistakes
- Mapping before filtering and then losing the status field.
- Using `filterObject` for an array.
### Interview Tip
Explain why the order of collection operations matters.

## DW-M017 — Calculate an order total

**Question:** Sum all order amounts.

### Input
```json
[{"amount":100},{"amount":250},{"amount":50}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
sum(payload map $.amount)
```
### Expected Output
```json
400
```
### Explanation
First project the numeric amount from every object, then aggregate the resulting array with `sum`.
### Common Mistakes
- Calling `sum(payload)` when payload contains objects.
- Forgetting that an empty collection needs deliberate business handling.
### Interview Tip
Describe the transformation as projection followed by aggregation.

## DW-M018 — Flatten nested arrays

**Question:** Convert an array of arrays into one array.

### Input
```json
[[1,2],[3,4],[5]]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
flatten(payload)
```
### Expected Output
```json
[1,2,3,4,5]
```
### Explanation
`flatten` removes one level of nested array structure.
### Common Mistakes
- Assuming it recursively flattens arbitrary nesting.
- Using it when the nesting itself carries business meaning.
### Interview Tip
Ask how deeply nested the source structure can become before selecting a flattening strategy.

## DW-M019 — Remove duplicate values

**Question:** Return unique product categories.

### Input
```json
["BOOK","TOY","BOOK","GAME","TOY"]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
payload distinctBy $
```
### Expected Output
```json
["BOOK","TOY","GAME"]
```
### Explanation
`distinctBy` compares the key expression for each item and keeps the first occurrence of each distinct key.
### Common Mistakes
- Using `distinctBy` without understanding the key expression.
- Expecting sorted output.
### Interview Tip
Distinguish uniqueness from ordering; they are separate requirements.

## DW-M020 — Sort customers by age

**Question:** Sort customers from youngest to oldest.

### Input
```json
[{"name":"A","age":30},{"name":"B","age":22},{"name":"C","age":27}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
payload orderBy $.age
```
### Expected Output
```json
[{"name":"B","age":22},{"name":"C","age":27},{"name":"A","age":30}]
```
### Explanation
`orderBy` evaluates the supplied key for each item and returns the collection ordered by that key.
### Common Mistakes
- Sorting by the whole object.
- Assuming descending order without explicitly requesting it.
### Interview Tip
Be precise about ascending versus descending requirements.

## DW-M021 — Group orders by status

**Question:** Group orders into `PAID` and `PENDING` groups.

### Input
```json
[{"id":1,"status":"PAID"},{"id":2,"status":"PENDING"},{"id":3,"status":"PAID"}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
payload groupBy $.status
```
### Expected Output
```json
{"PAID":[{"id":1,"status":"PAID"},{"id":3,"status":"PAID"}],"PENDING":[{"id":2,"status":"PENDING"}]}
```
### Explanation
`groupBy` builds an object whose keys are produced by the grouping expression.
### Common Mistakes
- Expecting an array of groups instead of an object.
- Grouping on a field that contains null without deciding how null should be represented.
### Interview Tip
A common integration pattern is group → aggregate → map into a reporting response.

## DW-M022 — Convert an object to key/value pairs

**Question:** Convert customer metadata into an array containing each key and value.

### Input
```json
{"country":"IN","tier":"GOLD"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
payload pluck ((value, key) -> { key: key as String, value: value })
```
### Expected Output
```json
[{"key":"country","value":"IN"},{"key":"tier","value":"GOLD"}]
```
### Explanation
`pluck` iterates over an object and returns an array of results.
### Common Mistakes
- Using `map` on an object when the desired result is an array.
- Forgetting that object keys are represented as DataWeave keys.
### Interview Tip
Know the practical difference between `map`, `mapObject`, and `pluck`.

## DW-M023 — Rename every object key

**Question:** Convert all keys in an object to uppercase.

### Input
```json
{"firstName":"Ravi","lastName":"Kumar"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
payload mapObject ((value, key) -> (upper(key as String)): value)
```
### Expected Output
```json
{"FIRSTNAME":"Ravi","LASTNAME":"Kumar"}
```
### Explanation
`mapObject` transforms each key/value pair while preserving object structure.
### Common Mistakes
- Using `map`, which is array-oriented.
- Forgetting that key expressions must produce valid object keys.
### Interview Tip
Explain why `mapObject` is the natural choice for dynamic object-key transformations.

## DW-M024 — Remove sensitive fields

**Question:** Remove `password` and `token` from an object before logging it.

### Input
```json
{"id":10,"name":"Ravi","password":"secret","token":"abc"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> !(key as String in ["password", "token"]))
```
### Expected Output
```json
{"id":10,"name":"Ravi"}
```
### Explanation
`filterObject` keeps only object entries whose predicate is true.
### Common Mistakes
- Filtering the array instead of the object.
- Removing fields after the sensitive object has already been logged.
### Interview Tip
For security-sensitive transformations, sanitize before logging or forwarding the payload.

## DW-M025 — Create a reusable function

**Question:** Create a function that calculates an 18% tax.

### Input
```json
{"amount":1000}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
fun tax(amount) = amount * 0.18
---
{ tax: tax(payload.amount) }
```
### Expected Output
```json
{"tax":180}
```
### Explanation
The named function isolates business logic so it can be reused by multiple mappings.
### Common Mistakes
- Defining the function but never invoking it.
- Hard-coding the amount inside the function.
### Interview Tip
Reusable functions reduce duplication and make business rules easier to test.

## DW-M026 — Use a lambda to calculate discounts

**Question:** Apply a 10% discount to every product price.

### Input
```json
[{"name":"A","price":100},{"name":"B","price":200}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
payload map ((item) -> item ++ { discountedPrice: item.price * 0.90 })
```
### Expected Output
```json
[{"name":"A","price":100,"discountedPrice":90},{"name":"B","price":200,"discountedPrice":180}]
```
### Explanation
The lambda receives each object and returns a new object containing the calculated price.
### Common Mistakes
- Mutating the original object conceptually instead of constructing the desired output.
- Applying `0.10` when the requirement asks for the final price after a 10% discount.
### Interview Tip
Clarify whether the requested output is discount amount or discounted price.

## DW-M027 — Find the maximum amount

**Question:** Return the largest transaction amount.

### Input
```json
[{"amount":400},{"amount":1200},{"amount":800}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
max(payload map $.amount)
```
### Expected Output
```json
1200
```
### Explanation
The amount values are projected into an array and `max` returns the largest value.
### Common Mistakes
- Applying `max` directly to objects.
- Ignoring empty-array behavior in the business contract.
### Interview Tip
Explain the difference between finding the maximum value and finding the complete object containing it.

## DW-M028 — Find a transaction object by amount

**Question:** Return the transaction whose amount is `1200`.

### Input
```json
[{"id":"T1","amount":400},{"id":"T2","amount":1200},{"id":"T3","amount":800}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
(payload filter ($.amount == 1200))[0]
```
### Expected Output
```json
{"id":"T2","amount":1200}
```
### Explanation
`filter` selects matching transactions and `[0]` takes the first matching result.
### Common Mistakes
- Assuming a match always exists.
- Forgetting that multiple matches are possible.
### Interview Tip
Ask whether the requirement is first match, all matches, or exactly one match.

## DW-M029 — Build a CSV-friendly output

**Question:** Project customer records to `id`, `name`, and `status` fields.

### Input
```json
[{"id":1,"name":"A","status":"ACTIVE","secret":"x"}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/csv
---
payload map { id: $.id, name: $.name, status: $.status }
```
### Expected Output
```text
id,name,status
1,A,ACTIVE
```
### Explanation
The mapping first creates the required tabular shape and the output directive serializes it as CSV.
### Common Mistakes
- Returning fields that should not be exported.
- Confusing JSON objects with CSV records.
### Interview Tip
Mention that output MIME type is part of the transformation contract.

## DW-M030 — Handle an optional nested field

**Question:** Return `Unknown` if `customer.address.city` is missing or null.

### Input
```json
{"customer":{"address":{}}}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ city: payload.customer.address.city default "Unknown" }
```
### Expected Output
```json
{"city":"Unknown"}
```
### Explanation
The selector reaches the optional field and `default` provides the required fallback.
### Common Mistakes
- Forgetting that a missing intermediate object may require additional defensive handling.
- Returning a null value when the API contract requires text.
### Interview Tip
Discuss both missing leaf fields and missing parent objects when reviewing production mappings.
