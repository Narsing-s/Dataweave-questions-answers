# Easy DataWeave Q&A — DW-E211 to DW-E225

## DW-E211 — Provide a fallback for a null value
**Question:** Return a customer's phone number or `N/A` when the source value is null.
**Input** `{"phone":null}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.phone default "N/A"
```
**Output** `"N/A"`
**Explanation:** `default` supplies the fallback when the selected value is null or missing.
**Common mistake:** Testing only for a missing key.
**Interview tip:** Explain the difference between null and absent data.

## DW-E212 — Filter active records
**Question:** Return only customers whose `active` flag is true.
**Input** `[{"id":1,"active":true},{"id":2,"active":false}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter $.active
```
**Output** `[{"id":1,"active":true}]`
**Explanation:** `filter` keeps elements whose condition evaluates to true.
**Common mistake:** Using `map` and returning Boolean values instead of records.
**Interview tip:** `filter` changes collection membership; `map` changes element values.

## DW-E213 — Convert an array of names to uppercase
**Question:** Return all customer names in uppercase.
**Input** `["ravi","sita","kiran"]`
**DataWeave**
```dw
%dw 2.0
import * from dw::core::Strings
output application/json
---
payload map upper($)
```
**Output** `["RAVI","SITA","KIRAN"]`
**Explanation:** Each string is transformed independently.
**Common mistake:** Calling the string function on the whole array.
**Interview tip:** Know when a core function expects a scalar versus a collection.

## DW-E214 — Count records in an array
**Question:** Return the number of orders received.
**Input** `[{"id":"O1"},{"id":"O2"},{"id":"O3"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
sizeOf(payload)
```
**Output** `3`
**Explanation:** `sizeOf` returns the collection size.
**Common mistake:** Using `sum` or `reduce` when no aggregation is required.
**Interview tip:** Mention how empty collections behave.

## DW-E215 — Check whether a string is blank
**Question:** Return true when the supplied customer code contains only whitespace or is empty.
**Input** `{"code":"   "}`
**DataWeave**
```dw
%dw 2.0
import * from dw::core::Strings
output application/json
---
isBlank(payload.code)
```
**Output** `true`
**Explanation:** `isBlank` is useful for validation where whitespace should count as empty.
**Common mistake:** Using only `isEmpty`, which does not express the same business rule.
**Interview tip:** Clarify whether whitespace has business meaning.

## DW-E216 — Add a field to every object
**Question:** Add `source: "CRM"` to every customer record.
**Input** `[{"id":1,"name":"Ravi"},{"id":2,"name":"Sita"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map ($ ++ {source: "CRM"})
```
**Output** `[{"id":1,"name":"Ravi","source":"CRM"},{"id":2,"name":"Sita","source":"CRM"}]`
**Explanation:** Each object is merged with a new field.
**Common mistake:** Appending a single object to the array instead of changing each element.
**Interview tip:** Explain object concatenation with `++`.

## DW-E217 — Sort numbers ascending
**Question:** Sort transaction amounts from smallest to largest.
**Input** `[400,100,250]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload orderBy $
```
**Output** `[100,250,400]`
**Explanation:** `orderBy` creates an ordered collection using the supplied ordering expression.
**Common mistake:** Using `sort` from another language's syntax.
**Interview tip:** Know the difference between ordering by the item and ordering by a derived key.

## DW-E218 — Remove duplicate values
**Question:** Return unique product codes while preserving their first occurrence.
**Input** `["P1","P2","P1","P3","P2"]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload distinctBy $
```
**Output** `["P1","P2","P3"]`
**Explanation:** `distinctBy` removes duplicate values according to the supplied expression.
**Common mistake:** Assuming it sorts the result.
**Interview tip:** Explain the distinction between uniqueness and ordering.

## DW-E219 — Extract object keys
**Question:** Return the field names from a customer object.
**Input** `{"id":101,"name":"Ravi","active":true}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
keysOf(payload)
```
**Output** `["id","name","active"]`
**Explanation:** `keysOf` returns the object's keys.
**Common mistake:** Using `valuesOf` when field names are required.
**Interview tip:** Compare `keysOf`, `valuesOf`, and `pluck`.

## DW-E220 — Convert text to a number
**Question:** Convert an amount supplied as text into a numeric value.
**Input** `{"amount":"1250.50"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.amount as Number
```
**Output** `1250.5`
**Explanation:** The explicit cast converts the string representation into a Number.
**Common mistake:** Performing arithmetic while the value is still text.
**Interview tip:** Discuss invalid numeric input and validation before casting.

## DW-E221 — Create a nested object
**Question:** Transform a flat customer record into a nested API structure.
**Input** `{"id":10,"firstName":"Ravi","city":"Hyderabad"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  customer: {
    id: payload.id,
    name: payload.firstName,
    address: {
      city: payload.city
    }
  }
}
```
**Output** `{"customer":{"id":10,"name":"Ravi","address":{"city":"Hyderabad"}}}`
**Explanation:** DataWeave can reshape flat input into any required object hierarchy.
**Common mistake:** Copying the source hierarchy instead of mapping to the target contract.
**Interview tip:** Mapping is about the target contract, not merely renaming fields.

## DW-E222 — Return an empty array safely
**Question:** Return an empty array when no orders are supplied.
**Input** `[]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (isEmpty(payload)) [] else payload
```
**Output** `[]`
**Explanation:** The condition explicitly preserves an empty collection as a valid result.
**Common mistake:** Returning null for a collection endpoint.
**Interview tip:** Discuss API contracts that distinguish `[]` from `null`.

## DW-E223 — Build a simple status field
**Question:** Return `PAID` when an invoice amount is zero after payment, otherwise `PENDING`.
**Input** `{"balance":0}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.balance == 0) "PAID" else "PENDING"
```
**Output** `"PAID"`
**Explanation:** A target status is derived from a numeric business condition.
**Common mistake:** Treating any falsy value as paid.
**Interview tip:** Keep business conditions explicit instead of relying on truthiness assumptions.

## DW-E224 — Select the first array element
**Question:** Return the first order from a list.
**Input** `[{"id":"O1"},{"id":"O2"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload[0]
```
**Output** `{"id":"O1"}`
**Explanation:** Array indexing selects the first element using zero-based indexing.
**Common mistake:** Assuming the first index is `1`.
**Interview tip:** Mention what should happen when the array is empty.

## DW-E225 — Convert a numeric flag to Boolean
**Question:** Treat numeric flag `1` as active and `0` as inactive.
**Input** `{"flag":1}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.flag == 1
```
**Output** `true`
**Explanation:** The numeric representation is explicitly mapped to a Boolean contract.
**Common mistake:** Casting arbitrary numbers directly when only `0` and `1` are valid.
**Interview tip:** Validate unexpected flag values when the source contract permits them.
