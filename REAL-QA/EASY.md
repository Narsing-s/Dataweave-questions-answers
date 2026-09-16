# Easy — Curated DataWeave Q&A

## DW-R01 — Select a field
**Question:** Return only the `name` from an object.

**Input**
```json
{"name":"Ravi","age":28}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.name
```
**Output**
```json
"Ravi"
```
**Explanation:** The single-value selector reads one field from the payload.
**Common mistake:** Using `payload["name"]` is valid, but unnecessary for a simple key.
**Interview tip:** Know the difference between single-value, index and multi-value selectors.

## DW-R02 — Select an array item
**Question:** Return the second element of an array.

**Input**
```json
["A","B","C"]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload[1]
```
**Output**
```json
"B"
```
**Explanation:** DataWeave array indexes start at zero.
**Common mistake:** Assuming the second item uses index `2`.
**Interview tip:** Index selectors are zero-based.

## DW-R03 — Build a new object
**Question:** Convert customer data into a smaller response object.

**Input**
```json
{"firstName":"Anu","lastName":"Rao","age":30}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  name: payload.firstName ++ " " ++ payload.lastName,
  age: payload.age
}
```
**Output**
```json
{"name":"Anu Rao","age":30}
```
**Explanation:** Object literals create the target structure.
**Common mistake:** Forgetting `++` when concatenating strings.
**Interview tip:** Explicit target objects are often easier to maintain than deeply nested expressions.

## DW-R04 — Uppercase a string
**Question:** Convert a customer name to uppercase.

**Input**
```json
{"name":"maria"}
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
"MARIA"
```
**Explanation:** `upper` transforms the string to uppercase.
**Common mistake:** Applying `upper` to an entire object instead of the string field.
**Interview tip:** Know the common string functions before using custom logic.

## DW-R05 — Lowercase a string
**Question:** Normalize an email address to lowercase.

**Input**
```json
{"email":"USER@EXAMPLE.COM"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
lower(payload.email)
```
**Output**
```json
"user@example.com"
```
**Explanation:** `lower` normalizes alphabetic characters.
**Common mistake:** Treating email normalization as validation; lowercasing does not validate an email.
**Interview tip:** Separate normalization from validation rules.

## DW-R06 — Map an array
**Question:** Return only employee names.

**Input**
```json
[{"name":"A","salary":10},{"name":"B","salary":20}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map $.name
```
**Output**
```json
["A","B"]
```
**Explanation:** `map` transforms every array element and returns a new array.
**Common mistake:** Using `mapObject` for an array.
**Interview tip:** `map` is for arrays; `mapObject` is for objects.

## DW-R07 — Filter an array
**Question:** Keep employees whose salary is at least 20.

**Input**
```json
[{"name":"A","salary":10},{"name":"B","salary":20},{"name":"C","salary":30}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter $.salary >= 20
```
**Output**
```json
[{"name":"B","salary":20},{"name":"C","salary":30}]
```
**Explanation:** `filter` keeps elements for which the condition is true.
**Common mistake:** Returning a mapped object instead of a Boolean predicate.
**Interview tip:** Be able to explain why `filter` returns an array.

## DW-R08 — Add a calculated field
**Question:** Add tax to each order.

**Input**
```json
[{"id":1,"amount":100},{"id":2,"amount":200}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map {
  id: $.id,
  amount: $.amount,
  tax: $.amount * 0.18
}
```
**Output**
```json
[{"id":1,"amount":100,"tax":18},{"id":2,"amount":200,"tax":36}]
```
**Explanation:** Each input object is transformed into a new object.
**Common mistake:** Quoting numeric values and accidentally creating strings.
**Interview tip:** Watch the input types when doing arithmetic.

## DW-R09 — Conditional value
**Question:** Mark a customer as `adult` when age is 18 or more.

**Input**
```json
{"name":"Kiran","age":21}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  name: payload.name,
  category: if (payload.age >= 18) "adult" else "minor"
}
```
**Output**
```json
{"name":"Kiran","category":"adult"}
```
**Explanation:** `if/else` returns one of two expressions.
**Common mistake:** Omitting the `else` branch.
**Interview tip:** DataWeave conditionals are expressions and produce values.

## DW-R10 — Default a missing value
**Question:** Use `UNKNOWN` when a customer nickname is absent.

**Input**
```json
{"name":"Kiran"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  name: payload.name,
  nickname: payload.nickname default "UNKNOWN"
}
```
**Output**
```json
{"name":"Kiran","nickname":"UNKNOWN"}
```
**Explanation:** `default` supplies a fallback when the selected value is absent or null according to the expression's value semantics.
**Common mistake:** Assuming `default` validates arbitrary invalid values.
**Interview tip:** Understand `null`, absent fields and empty strings separately.

## DW-R11 — Filter active records
**Question:** Keep only active users.

**Input**
```json
[{"id":1,"active":true},{"id":2,"active":false}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter $.active
```
**Output**
```json
[{"id":1,"active":true}]
```
**Explanation:** A Boolean field can be used directly as the filter predicate.
**Common mistake:** Comparing a Boolean to the string `"true"`.
**Interview tip:** Keep Boolean data as Boolean when possible.

## DW-R12 — Flatten nested arrays
**Question:** Combine all item arrays into one array.

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
**Explanation:** `payload.orders.items` produces an array of arrays and `flatten` removes one nesting level.
**Common mistake:** Expecting `flatten` to recursively normalize every possible depth.
**Interview tip:** First inspect the shape before deciding whether `flatten` is needed.

## DW-R13 — Remove duplicates
**Question:** Return unique department names.

**Input**
```json
["IT","HR","IT","Finance","HR"]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
distinctBy payload
```
**Output**
```json
["IT","HR","Finance"]
```
**Explanation:** `distinctBy` keeps distinct elements according to its criteria.
**Common mistake:** Using `distinctBy $.id` when the array contains strings.
**Interview tip:** For objects, provide the property that defines uniqueness.

## DW-R14 — Distinct objects by ID
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
**Explanation:** The criteria expression identifies duplicate records by `id`.
**Common mistake:** Assuming the later duplicate automatically replaces the first.
**Interview tip:** Clarify which duplicate should survive when business rules matter.

## DW-R15 — Check an array size
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
**Output**
```json
3
```
**Explanation:** `sizeOf` returns the size of the input value where supported.
**Common mistake:** Treating the result as a string.
**Interview tip:** Know the types returned by common utility functions.

## DW-R16 — Concatenate arrays
**Question:** Combine two arrays of roles.

**Input**
```json
{"a":["USER","ADMIN"],"b":["AUDITOR"]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.a ++ payload.b
```
**Output**
```json
["USER","ADMIN","AUDITOR"]
```
**Explanation:** `++` concatenates arrays.
**Common mistake:** Using `+` for array concatenation.
**Interview tip:** Know `++` for concatenation and the types it supports.

## DW-R17 — String concatenation
**Question:** Build a display name.

**Input**
```json
{"first":"Nina","last":"Shah"}
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
"Nina Shah"
```
**Explanation:** Strings can be concatenated with `++`.
**Common mistake:** Forgetting the separator.
**Interview tip:** Check nullability before concatenating optional fields.

## DW-R18 — Create a CSV response
**Question:** Transform users into CSV.

**Input**
```json
[{"id":1,"name":"A"},{"id":2,"name":"B"}]
```
**DataWeave**
```dw
%dw 2.0
output application/csv
---
payload map {
  id: $.id,
  name: $.name
}
```
**Output**
```text
id,name
1,A
2,B
```
**Explanation:** The output MIME type controls serialization to CSV.
**Common mistake:** Returning JSON while expecting CSV.
**Interview tip:** Know that transformation logic and output serialization are separate concerns.

## DW-R19 — Rename fields
**Question:** Convert `firstName` and `lastName` to `first_name` and `last_name`.

**Input**
```json
{"firstName":"Asha","lastName":"Rao"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  first_name: payload.firstName,
  last_name: payload.lastName
}
```
**Output**
```json
{"first_name":"Asha","last_name":"Rao"}
```
**Explanation:** Explicit object construction is the clearest approach for a small fixed mapping.
**Common mistake:** Renaming values instead of keys.
**Interview tip:** Prefer explicit mappings for stable API contracts.

## DW-R20 — Extract names from nested data
**Question:** Return all employee names from a company object.

**Input**
```json
{"company":{"employees":[{"name":"A"},{"name":"B"}]}}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.company.employees.name
```
**Output**
```json
["A","B"]
```
**Explanation:** The selector traverses the nested structure and collects matching values.
**Common mistake:** Writing a loop when a selector already expresses the requirement.
**Interview tip:** Learn selector shortcuts before reaching for `map`.
