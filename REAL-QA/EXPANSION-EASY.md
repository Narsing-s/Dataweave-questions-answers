# Expansion — Easy DataWeave Q&A

These questions extend the curated bank with distinct beginner problems. Every example is intended for DataWeave 2.x and should be executed against the runtime version used by the project.

## DW-E61 — Select one nested field
**Question:** Return only customer names from nested customer records.

**Input**
```json
{"customers":[{"id":1,"name":"Ravi"},{"id":2,"name":"Anu"}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.customers map $.name
```
**Output**
```json
["Ravi","Anu"]
```
**Explanation:** The selector is applied to every element through `map`.
**Common mistake:** Selecting `payload.name` when `name` is inside the array.
**Interview tip:** Explain the input type before choosing the operator.

## DW-E62 — Filter active users
**Question:** Return users whose status is `ACTIVE`.
**Input**
```json
[{"id":1,"status":"ACTIVE"},{"id":2,"status":"INACTIVE"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter $.status == "ACTIVE"
```
**Output**
```json
[{"id":1,"status":"ACTIVE"}]
```
**Explanation:** `filter` keeps array elements whose predicate is true.
**Common mistake:** Using `map` and returning null for non-matches.
**Interview tip:** `filter` changes which records exist; `map` changes their shape.

## DW-E63 — Add a calculated field
**Question:** Add `total` as price multiplied by quantity.
**Input**
```json
{"price":25,"quantity":4}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  price: payload.price,
  quantity: payload.quantity,
  total: payload.price * payload.quantity
}
```
**Output**
```json
{"price":25,"quantity":4,"total":100}
```
**Explanation:** The target object explicitly maps source values and computes a new field.
**Common mistake:** Multiplying string values without converting them when the source is textual.
**Interview tip:** Mention input typing when discussing arithmetic transformations.

## DW-E64 — Uppercase a string
**Question:** Convert a customer name to uppercase.
**Input**
```json
{"name":"ravi"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
upper(payload.name)
```
**Output**
```json
"RAVI"
```
**Explanation:** `upper` transforms the string value.
**Common mistake:** Applying an array function to a scalar string.
**Interview tip:** Know the difference between string and array functions.

## DW-E65 — Default a missing value
**Question:** Use `IN` when `country` is absent or null.
**Input**
```json
{"name":"Ravi","country":null}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  name: payload.name,
  country: payload.country default "IN"
}
```
**Output**
```json
{"name":"Ravi","country":"IN"}
```
**Explanation:** `default` supplies a fallback when the selected value is null or absent.
**Common mistake:** Assuming a missing field and an empty string are identical.
**Interview tip:** Discuss the source contract before deciding whether empty strings also need normalization.

## DW-E66 — Count array elements
**Question:** Return the number of products.
**Input**
```json
{"products":[{"id":1},{"id":2},{"id":3}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
sizeOf(payload.products)
```
**Output**
```json
3
```
**Explanation:** `sizeOf` returns the number of elements in the array.
**Common mistake:** Using a string length function on an array.
**Interview tip:** Always identify the value type before selecting a size operation.

## DW-E67 — Concatenate names
**Question:** Build a full name from first and last name.
**Input**
```json
{"first":"Ravi","last":"Rao"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.first ++ " " ++ payload.last
```
**Output**
```json
"Ravi Rao"
```
**Explanation:** `++` concatenates strings.
**Common mistake:** Forgetting the separator or using `+` for string concatenation.
**Interview tip:** Know that `++` is a general concatenation operator in DataWeave.

## DW-E68 — Remove a field
**Question:** Remove the internal `password` field from a user object.
**Input**
```json
{"id":1,"name":"Ravi","password":"secret"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload - "password"
```
**Output**
```json
{"id":1,"name":"Ravi"}
```
**Explanation:** The subtraction operator removes the specified object key.
**Common mistake:** Returning the password and relying on a downstream consumer to remove it.
**Interview tip:** Explicitly remove sensitive fields before external responses.

## DW-E69 — Select the first item
**Question:** Return the first transaction from an array.
**Input**
```json
{"transactions":[{"id":"T1"},{"id":"T2"}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.transactions[0]
```
**Output**
```json
{"id":"T1"}
```
**Explanation:** Array indexing starts at zero.
**Common mistake:** Using index `1` when the requirement is the first element.
**Interview tip:** Mention what should happen when the array is empty.

## DW-E70 — Build an object from selected fields
**Question:** Return only `id` and `email` for each customer.
**Input**
```json
[{"id":1,"email":"a@example.com","phone":"111"},{"id":2,"email":"b@example.com","phone":"222"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map {id: $.id, email: $.email}
```
**Output**
```json
[{"id":1,"email":"a@example.com"},{"id":2,"email":"b@example.com"}]
```
**Explanation:** The mapping creates an allow-list output contract.
**Common mistake:** Copying every source field into a public response.
**Interview tip:** Allow-list mappings help prevent accidental field exposure.

## DW-E71 — Convert text to number
**Question:** Convert a string amount into a Number.
**Input**
```json
{"amount":"125.50"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.amount as Number
```
**Output**
```json
125.5
```
**Explanation:** `as Number` performs an explicit type conversion.
**Common mistake:** Performing arithmetic while assuming the source text is numeric.
**Interview tip:** Explain that casting is part of contract normalization.

## DW-E72 — Check an empty array
**Question:** Return whether the `items` array is empty.
**Input**
```json
{"items":[]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
isEmpty(payload.items)
```
**Output**
```json
true
```
**Explanation:** `isEmpty` checks whether the supplied collection has no elements.
**Common mistake:** Comparing arrays to the string `""`.
**Interview tip:** Know the difference between empty, null and missing.

## DW-E73 — Conditional status
**Question:** Return `HIGH` when amount is above 1000, otherwise `NORMAL`.
**Input**
```json
{"amount":1500}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.amount > 1000) "HIGH" else "NORMAL"
```
**Output**
```json
"HIGH"
```
**Explanation:** DataWeave `if/else` expressions return a value.
**Common mistake:** Writing statement-style syntax instead of an expression.
**Interview tip:** DataWeave expressions can be nested directly inside object fields.

## DW-E74 — Filter non-null object fields
**Question:** Remove null-valued fields from a customer object.
**Input**
```json
{"id":1,"name":"Ravi","phone":null,"city":"Hyd"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filterObject $ != null
```
**Output**
```json
{"id":1,"name":"Ravi","city":"Hyd"}
```
**Explanation:** `filterObject` operates on object key-value pairs rather than array elements.
**Common mistake:** Using `filter`, which expects an array.
**Interview tip:** This is a classic `filter` versus `filterObject` interview distinction.

## DW-E75 — Extract object values
**Question:** Return the values from a simple object as an array.
**Input**
```json
{"a":10,"b":20,"c":30}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
valuesOf(payload)
```
**Output**
```json
[10,20,30]
```
**Explanation:** `valuesOf` extracts object values into an array.
**Common mistake:** Expecting `payload.*value` to work like an object selector.
**Interview tip:** Know `keysOf`, `valuesOf` and `entriesOf` for object introspection.
