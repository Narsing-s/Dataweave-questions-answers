# Easy DataWeave Q&A — DW-E176 to DW-E200

## DW-E176 — Apply a default for a missing field
**Question:** Return `UNKNOWN` when a customer nickname is missing.
**Input** `{"name":"Ravi"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.nickname default "UNKNOWN"
```
**Output** `"UNKNOWN"`
**Explanation:** `default` supplies a fallback when the selected value is absent or null.
**Common mistake:** Using `or` for simple defaulting.
**Interview tip:** Explain the difference between missing, null and blank values.

## DW-E177 — Convert text to uppercase
**Question:** Normalize a customer city to uppercase.
**Input** `{"city":"hyderabad"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
upper(payload.city)
```
**Output** `"HYDERABAD"`
**Explanation:** `upper` converts alphabetic characters to uppercase.
**Common mistake:** Applying string functions to the whole object.
**Interview tip:** Normalize values before case-insensitive comparisons when required.

## DW-E178 — Convert text to lowercase
**Question:** Normalize an email address to lowercase.
**Input** `{"email":"USER@EXAMPLE.COM"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
lower(payload.email)
```
**Output** `"user@example.com"`
**Explanation:** `lower` converts alphabetic characters to lowercase.
**Common mistake:** Assuming lowercasing validates an email address.
**Interview tip:** Normalization and validation are separate concerns.

## DW-E179 — Trim surrounding whitespace
**Question:** Remove extra spaces around a customer name.
**Input** `{"name":"  Ravi Kumar  "}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
trim(payload.name)
```
**Output** `"Ravi Kumar"`
**Explanation:** `trim` removes surrounding whitespace.
**Common mistake:** Expecting it to remove spaces between words.
**Interview tip:** Use trimming at system boundaries where input quality is inconsistent.

## DW-E180 — Check whether a string is blank
**Question:** Determine whether a customer note is blank.
**Input** `{"note":"   "}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
isBlank(payload.note)
```
**Output** `true`
**Explanation:** `isBlank` is useful when whitespace-only text should count as empty.
**Common mistake:** Checking only `!= null`.
**Interview tip:** Clarify whether whitespace-only values are valid in the target contract.

## DW-E181 — Convert text to a number
**Question:** Convert a string amount into a number.
**Input** `{"amount":"1250.50"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.amount as Number
```
**Output** `1250.5`
**Explanation:** The `as Number` cast converts numeric text to a numeric value.
**Common mistake:** Treating every arbitrary string as convertible.
**Interview tip:** Mention validation or error handling for malformed numeric input.

## DW-E182 — Convert a number to text
**Question:** Return a transaction ID number as a string.
**Input** `{"transactionId":12345}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.transactionId as String
```
**Output** `"12345"`
**Explanation:** `as String` explicitly changes the value type.
**Common mistake:** Relying on implicit coercion when the target contract requires a string.
**Interview tip:** Explicit casts make mapping intent clearer.

## DW-E183 — Add two numeric fields
**Question:** Calculate an invoice subtotal from two line amounts.
**Input** `{"itemAmount":800,"shipping":100}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.itemAmount + payload.shipping
```
**Output** `900`
**Explanation:** Numeric addition produces the combined amount.
**Common mistake:** Adding numeric strings without explicit conversion.
**Interview tip:** Check the source types before performing arithmetic.

## DW-E184 — Calculate a percentage
**Question:** Calculate 18 percent tax on an amount of 500.
**Input** `{"amount":500}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.amount * 0.18
```
**Output** `90`
**Explanation:** Multiplying by the decimal rate calculates the percentage amount.
**Common mistake:** Multiplying by `18` instead of `0.18`.
**Interview tip:** State the unit of the rate explicitly.

## DW-E185 — Create a nested object
**Question:** Build a customer contact object from flat fields.
**Input** `{"name":"Ravi","email":"ravi@example.com","phone":"9999999999"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  name: payload.name,
  contact: {
    email: payload.email,
    phone: payload.phone
  }
}
```
**Output** `{"name":"Ravi","contact":{"email":"ravi@example.com","phone":"9999999999"}}`
**Explanation:** Nested object literals reshape flat source fields into a structured contract.
**Common mistake:** Leaving contact fields at the root.
**Interview tip:** This pattern is common in API request mapping.

## DW-E186 — Select nested data
**Question:** Return the city from a nested customer address.
**Input** `{"customer":{"address":{"city":"Kurnool"}}}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.customer.address.city
```
**Output** `"Kurnool"`
**Explanation:** Dot selectors navigate nested objects.
**Common mistake:** Using array indexing for object fields.
**Interview tip:** Consider missing nested fields when designing production mappings.

## DW-E187 — Build an array with a range
**Question:** Generate numbers from 1 through 5.
**Input** `{}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
1 to 5
```
**Output** `[1,2,3,4,5]`
**Explanation:** The `to` range operator creates an inclusive numeric sequence.
**Common mistake:** Assuming the end value is exclusive.
**Interview tip:** Ranges are useful for simple generated sequences.

## DW-E188 — Extract values from an object
**Question:** Return all configuration values.
**Input** `{"host":"api","port":443,"secure":true}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
valuesOf(payload)
```
**Output** `["api",443,true]`
**Explanation:** `valuesOf` returns the object's values as an array.
**Common mistake:** Expecting key/value records.
**Interview tip:** Contrast `valuesOf` with `entriesOf` when explaining object iteration.

## DW-E189 — Create a key/value pair from a record
**Question:** Create an object whose key is the customer's ID and whose value is the name.
**Input** `{"id":"C101","name":"Ravi"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{(payload.id): payload.name}
```
**Output** `{"C101":"Ravi"}`
**Explanation:** Parentheses around an expression create a dynamic object key.
**Common mistake:** Writing `payload.id:` as if it were a literal field name.
**Interview tip:** Dynamic keys are important in lookup and indexing transformations.

## DW-E190 — Sort numbers ascending
**Question:** Sort transaction amounts from smallest to largest.
**Input** `[300,100,200]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload orderBy $
```
**Output** `[100,200,300]`
**Explanation:** `orderBy` sorts an array using the supplied value expression.
**Common mistake:** Using `sortBy` syntax from another language.
**Interview tip:** Explain what expression determines the sort key.

## DW-E191 — Sort records by a field
**Question:** Sort customers alphabetically by name.
**Input** `[{"name":"Zara"},{"name":"Asha"},{"name":"Ravi"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload orderBy $.name
```
**Output** `[{"name":"Asha"},{"name":"Ravi"},{"name":"Zara"}]`
**Explanation:** The selector after `orderBy` supplies the comparison value for each record.
**Common mistake:** Sorting the object itself instead of its name field.
**Interview tip:** State whether case normalization is needed for the business rule.

## DW-E192 — Count active records
**Question:** Count how many customers are active.
**Input** `[{"status":"ACTIVE"},{"status":"INACTIVE"},{"status":"ACTIVE"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
sizeOf(payload filter $.status == "ACTIVE")
```
**Output** `2`
**Explanation:** The filter selects matching records and `sizeOf` counts them.
**Common mistake:** Counting the original array.
**Interview tip:** Combining small collection operations is a common DataWeave pattern.

## DW-E193 — Check whether any record matches
**Question:** Determine whether at least one order is cancelled.
**Input** `[{"status":"PAID"},{"status":"CANCELLED"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
contains(payload map $.status, "CANCELLED")
```
**Output** `true`
**Explanation:** Mapping to statuses and checking containment tests whether the requested status occurs.
**Common mistake:** Comparing the complete records with a string.
**Interview tip:** For complex predicates, discuss alternative filtering and size checks.

## DW-E194 — Remove a field from an object
**Question:** Remove an internal `password` field before returning a user record.
**Input** `{"id":"U1","name":"Ravi","password":"secret"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload - "password"
```
**Output** `{"id":"U1","name":"Ravi"}`
**Explanation:** The subtraction operator removes the named object key.
**Common mistake:** Returning sensitive fields unchanged.
**Interview tip:** Explicitly remove internal-only fields at external API boundaries.

## DW-E195 — Add an object field with concatenation
**Question:** Add a constant source-system field to a customer record.
**Input** `{"id":"C1","name":"Ravi"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload ++ {sourceSystem: "CRM"}
```
**Output** `{"id":"C1","name":"Ravi","sourceSystem":"CRM"}`
**Explanation:** `++` concatenates objects to produce a new object.
**Common mistake:** Assuming it mutates the original value.
**Interview tip:** Explain field collisions when both objects contain the same key.

## DW-E196 — Merge two objects
**Question:** Combine customer identity and contact objects.
**Input** `{"id":"C1","name":"Ravi"}` and `{"email":"ravi@example.com","city":"Hyderabad"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
vars.identity ++ vars.contact
```
**Output** `{"id":"C1","name":"Ravi","email":"ravi@example.com","city":"Hyderabad"}`
**Explanation:** Object concatenation combines fields from both objects.
**Common mistake:** Forgetting that duplicate keys have collision behavior.
**Interview tip:** Mention which source should win if both objects contain the same field.

## DW-E197 — Build a Boolean condition
**Question:** Determine whether an order is both paid and shipped.
**Input** `{"paid":true,"shipped":true}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.paid and payload.shipped
```
**Output** `true`
**Explanation:** `and` requires both Boolean conditions to be true.
**Common mistake:** Using `or` when both conditions are required.
**Interview tip:** Translate the business rule into Boolean logic before writing the expression.

## DW-E198 — Build an either-or condition
**Question:** Determine whether an account is suspended or blocked.
**Input** `{"suspended":false,"blocked":true}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.suspended or payload.blocked
```
**Output** `true`
**Explanation:** `or` returns true when at least one condition is true.
**Common mistake:** Requiring both flags to be true.
**Interview tip:** Use explicit Boolean expressions for business-state rules.

## DW-E199 — Use a conditional field
**Question:** Add `priority` as `HIGH` for orders above 5000, otherwise `NORMAL`.
**Input** `{"id":"O1","amount":6500}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  amount: payload.amount,
  priority: if (payload.amount > 5000) "HIGH" else "NORMAL"
}
```
**Output** `{"id":"O1","amount":6500,"priority":"HIGH"}`
**Explanation:** An `if/else` expression can directly calculate a target field.
**Common mistake:** Returning a Boolean when the contract requires a status label.
**Interview tip:** Keep threshold values aligned with documented business rules.

## DW-E200 — Create a simple success response
**Question:** Wrap an order ID in a standard success response.
**Input** `{"orderId":"O1001"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  success: true,
  message: "Order processed successfully",
  data: payload
}
```
**Output** `{"success":true,"message":"Order processed successfully","data":{"orderId":"O1001"}}`
**Explanation:** A response envelope provides a consistent API structure around the business payload.
**Common mistake:** Mixing metadata fields into the business object.
**Interview tip:** Consistent response envelopes simplify consumer integration.
