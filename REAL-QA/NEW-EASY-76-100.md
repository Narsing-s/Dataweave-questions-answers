# New Easy DataWeave Q&A — DW-E76 to DW-E100

These are new beginner problems focused on concepts not used as the primary task in the previous expansion.

## DW-E76 — Extract object keys
**Question:** Return all keys from a customer object.
**Input**
```json
{"id":101,"name":"Ravi","city":"Hyderabad"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
keysOf(payload)
```
**Output**
```json
["id","name","city"]
```
**Explanation:** `keysOf` returns the keys of an object as an array.
**Common mistake:** Using `valuesOf` when keys are required.
**Interview tip:** Compare `keysOf`, `valuesOf`, and `entriesOf`.

## DW-E77 — Extract key-value entries
**Question:** Convert an object into key/value entry records.
**Input**
```json
{"A":10,"B":20}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
entriesOf(payload)
```
**Output**
```json
[{"key":"A","value":10},{"key":"B","value":20}]
```
**Explanation:** `entriesOf` exposes object entries in array form.
**Common mistake:** Expecting an object instead of an array.
**Interview tip:** This is useful when object metadata must be processed with array functions.

## DW-E78 — Check whether an array contains a value
**Question:** Return whether `INR` exists in the currency list.
**Input**
```json
{"currencies":["USD","EUR","INR"]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.currencies contains "INR"
```
**Output**
```json
true
```
**Explanation:** `contains` checks whether the collection contains the supplied value.
**Common mistake:** Comparing the entire array to one string.
**Interview tip:** Distinguish membership checks from filtering.

## DW-E79 — Check a string prefix
**Question:** Determine whether an order ID starts with `ORD-`.
**Input**
```json
{"orderId":"ORD-1001"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.orderId startsWith "ORD-"
```
**Output**
```json
true
```
**Explanation:** `startsWith` tests the beginning of a string.
**Common mistake:** Using `contains` when position matters.
**Interview tip:** Explain why prefix validation is different from substring search.

## DW-E80 — Check a string suffix
**Question:** Determine whether a filename ends with `.csv`.
**Input**
```json
{"file":"customers.csv"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.file endsWith ".csv"
```
**Output**
```json
true
```
**Explanation:** `endsWith` checks the final characters of a string.
**Common mistake:** Checking only whether `.csv` occurs somewhere in the filename.
**Interview tip:** File-extension validation is a common integration example.

## DW-E81 — Split a delimited string
**Question:** Convert a comma-separated list into an array.
**Input**
```json
{"tags":"api,mule,dataweave"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.tags splitBy ","
```
**Output**
```json
["api","mule","dataweave"]
```
**Explanation:** `splitBy` separates a string using the supplied delimiter.
**Common mistake:** Forgetting that whitespace around delimiters remains part of values.
**Interview tip:** Mention trimming when input quality is inconsistent.

## DW-E82 — Join array values
**Question:** Convert a list of roles into one pipe-separated string.
**Input**
```json
{"roles":["ADMIN","USER","AUDITOR"]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.roles joinBy "|"
```
**Output**
```json
"ADMIN|USER|AUDITOR"
```
**Explanation:** `joinBy` combines array elements into one string.
**Common mistake:** Using string concatenation without handling an arbitrary number of values.
**Interview tip:** `joinBy` is useful for legacy delimited formats.

## DW-E83 — Replace a substring
**Question:** Replace `localhost` with `api.example.com` in a URL.
**Input**
```json
{"url":"https://localhost/orders"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
replace(payload.url, "localhost") with "api.example.com"
```
**Output**
```json
"https://api.example.com/orders"
```
**Explanation:** The `replace ... with` expression changes matching text.
**Common mistake:** Replacing unrelated parts of a URL with a broad pattern.
**Interview tip:** Prefer explicit replacements for controlled integration transformations.

## DW-E84 — Convert boolean text to Boolean
**Question:** Convert the string `true` into a Boolean.
**Input**
```json
{"enabled":"true"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.enabled as Boolean
```
**Output**
```json
true
```
**Explanation:** Explicit casting converts textual input into a Boolean value.
**Common mistake:** Comparing the string to the Boolean literal without normalization.
**Interview tip:** Type conversion is important when integrating query parameters or CSV data.

## DW-E85 — Round a decimal
**Question:** Round a calculated price to two decimal places.
**Input**
```json
{"price":12.3456}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
round(payload.price * 100) / 100
```
**Output**
```json
12.35
```
**Explanation:** The value is shifted, rounded, and shifted back.
**Common mistake:** Assuming formatting and numeric rounding are the same operation.
**Interview tip:** Separate numeric calculations from output formatting.

## DW-E86 — Find the maximum value
**Question:** Return the largest transaction amount.
**Input**
```json
[{"amount":120},{"amount":450},{"amount":210}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
max(payload.amount)
```
**Output**
```json
450
```
**Explanation:** The amounts are projected and the maximum is selected.
**Common mistake:** Passing the objects when the aggregation expects the numeric values.
**Interview tip:** Explain the projection step before aggregation.

## DW-E87 — Find the minimum value
**Question:** Return the smallest transaction amount.
**Input**
```json
[{"amount":120},{"amount":450},{"amount":210}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
min(payload.amount)
```
**Output**
```json
120
```
**Explanation:** `min` returns the smallest value in the selected array.
**Common mistake:** Sorting the entire array when only the minimum is needed.
**Interview tip:** Choose the simplest aggregation that matches the requirement.

## DW-E88 — Calculate an average safely
**Question:** Calculate the average score when records are present.
**Input**
```json
[{"score":80},{"score":90},{"score":70}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (isEmpty(payload)) null else avg(payload.score)
```
**Output**
```json
80
```
**Explanation:** The empty-input case is handled before calculating the average.
**Common mistake:** Ignoring the empty collection case in an API transformation.
**Interview tip:** Always discuss empty input for statistical functions.

## DW-E89 — Get the last array element
**Question:** Return the last event from an event array.
**Input**
```json
{"events":["LOGIN","VIEW","LOGOUT"]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.events[-1]
```
**Output**
```json
"LOGOUT"
```
**Explanation:** Negative indexing can select from the end of an array.
**Common mistake:** Using a hard-coded last index.
**Interview tip:** Negative indexing is useful when array length is dynamic.

## DW-E90 — Count only matching records
**Question:** Count orders whose status is `SHIPPED`.
**Input**
```json
[{"status":"SHIPPED"},{"status":"NEW"},{"status":"SHIPPED"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
sizeOf(payload filter $.status == "SHIPPED")
```
**Output**
```json
2
```
**Explanation:** The records are filtered and then counted.
**Common mistake:** Counting the complete input.
**Interview tip:** Combining small collection operations often gives clear solutions.

## DW-E91 — Default a nested value
**Question:** Return `N/A` when a nested phone number is missing.
**Input**
```json
{"customer":{"name":"Ravi"}}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.customer.phone default "N/A"
```
**Output**
```json
"N/A"
```
**Explanation:** The default expression handles an absent selected value.
**Common mistake:** Assuming every optional nested field exists.
**Interview tip:** Defaults are useful at API contract boundaries.

## DW-E92 — Select nested array values
**Question:** Return all product SKUs from nested orders.
**Input**
```json
{"orders":[{"items":[{"sku":"A"},{"sku":"B"}]},{"items":[{"sku":"C"}]}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
flatten(payload.orders.items) map $.sku
```
**Output**
```json
["A","B","C"]
```
**Explanation:** Nested item arrays are flattened before projecting the SKU.
**Common mistake:** Selecting `payload.orders.sku` when SKU belongs to each item.
**Interview tip:** Understand the shape after every transformation stage.

## DW-E93 — Rename fields
**Question:** Produce an API object using `customerId` and `customerName` instead of source names.
**Input**
```json
{"id":10,"name":"Anu"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  customerId: payload.id,
  customerName: payload.name
}
```
**Output**
```json
{"customerId":10,"customerName":"Anu"}
```
**Explanation:** Explicit mapping creates a different target contract.
**Common mistake:** Returning the source object unchanged.
**Interview tip:** Field renaming is one of the most common API transformation tasks.

## DW-E94 — Create a boolean condition field
**Question:** Add `isAdult` based on age 18 or above.
**Input**
```json
{"name":"A","age":21}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  name: payload.name,
  age: payload.age,
  isAdult: payload.age >= 18
}
```
**Output**
```json
{"name":"A","age":21,"isAdult":true}
```
**Explanation:** A comparison directly produces a Boolean field.
**Common mistake:** Returning the text `"true"` instead of Boolean `true`.
**Interview tip:** Know the difference between Boolean and String output types.

## DW-E95 — Negate a Boolean
**Question:** Return the opposite of an account's active flag.
**Input**
```json
{"active":true}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
!payload.active
```
**Output**
```json
false
```
**Explanation:** `!` negates a Boolean expression.
**Common mistake:** Comparing a Boolean to the string `"false"`.
**Interview tip:** Boolean expressions can be used directly in object fields and conditions.

## DW-E96 — Filter by numeric range
**Question:** Keep products priced from 100 through 500 inclusive.
**Input**
```json
[{"id":"A","price":80},{"id":"B","price":250},{"id":"C","price":500},{"id":"D","price":700}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter ($.price >= 100 and $.price <= 500)
```
**Output**
```json
[{"id":"B","price":250},{"id":"C","price":500}]
```
**Explanation:** Two numeric conditions are combined into one predicate.
**Common mistake:** Using `or`, which would accept values outside the intended range.
**Interview tip:** State whether boundaries are inclusive or exclusive.

## DW-E97 — Remove an object field conditionally
**Question:** Remove `middleName` from the output when it is null.
**Input**
```json
{"firstName":"A","middleName":null,"lastName":"B"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  firstName: payload.firstName,
  (middleName: payload.middleName) if payload.middleName != null,
  lastName: payload.lastName
}
```
**Output**
```json
{"firstName":"A","lastName":"B"}
```
**Explanation:** Conditional object fields allow omission rather than emitting null.
**Common mistake:** Keeping a null field when the target contract requires omission.
**Interview tip:** Null and absent fields can have different downstream meanings.

## DW-E98 — Convert an array to a numbered object
**Question:** Create keys `item1`, `item2`, and `item3` from an array.
**Input**
```json
["A","B","C"]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload map ((value, index) -> {("item" ++ ((index + 1) as String)): value})) reduce ((item, acc = {}) -> acc ++ item)
```
**Output**
```json
{"item1":"A","item2":"B","item3":"C"}
```
**Explanation:** Each array item becomes a one-entry object and the objects are merged.
**Common mistake:** Assuming an array index can automatically become an object key.
**Interview tip:** Dynamic keys require careful attention to string conversion.

## DW-E99 — Create a simple status message
**Question:** Return a message based on an HTTP-like status code.
**Input**
```json
{"code":201}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.code >= 200 and payload.code < 300) "Success" else "Not successful"
```
**Output**
```json
"Success"
```
**Explanation:** A numeric range is used to classify the status code.
**Common mistake:** Checking only one exact success code.
**Interview tip:** Ranges are often more appropriate than exact-value checks for HTTP categories.

## DW-E100 — Build a small audit record
**Question:** Create an audit object containing an ID, action, and actor.
**Input**
```json
{"id":"TX1","action":"UPDATE","user":"narsing"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  transactionId: payload.id,
  action: payload.action,
  performedBy: payload.user
}
```
**Output**
```json
{"transactionId":"TX1","action":"UPDATE","performedBy":"narsing"}
```
**Explanation:** The transformation creates a clean audit contract from source fields.
**Common mistake:** Returning unrelated source fields.
**Interview tip:** Explicit allow-list mappings are safer for audit and API responses.
