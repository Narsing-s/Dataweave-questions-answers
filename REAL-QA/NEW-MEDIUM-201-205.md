# Medium DataWeave Q&A — DW-M201 to DW-M205

## DW-M201 — Normalize nested optional data
**Question:** Return a customer's phone list even when the source provides one phone as a scalar.
**Input** `{"phone":"9999999999"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.phone is Array) payload.phone else [payload.phone]
```
**Output** `["9999999999"]`
**Explanation:** The transformation normalizes two possible source shapes into an array.
**Common mistake:** Always wrapping the value and creating a nested array.
**Interview tip:** Normalize polymorphic inputs before downstream processing.

## DW-M202 — Build a reusable local variable with `do`
**Question:** Calculate an invoice total while keeping intermediate values local.
**Input** `{"subtotal":1000,"tax":180}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
do {
  var total = payload.subtotal + payload.tax
  ---
  {subtotal: payload.subtotal, tax: payload.tax, total: total}
}
```
**Output** `{"subtotal":1000,"tax":180,"total":1180}`
**Explanation:** `do` creates a local scope for intermediate declarations.
**Common mistake:** Repeating the same calculation throughout the output.
**Interview tip:** Explain why local scope improves readability and avoids accidental variable leakage.

## DW-M203 — Use `using` for local bindings
**Question:** Build a display label from two fields using a local binding.
**Input** `{"first":"Ravi","last":"Kumar"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
using (fullName = payload.first ++ " " ++ payload.last)
  {name: fullName}
```
**Output** `{"name":"Ravi Kumar"}`
**Explanation:** `using` creates a local variable available to the following expression.
**Common mistake:** Defining a variable globally when it is only needed locally.
**Interview tip:** Compare local bindings with named reusable functions.

## DW-M204 — Update a nested field
**Question:** Change a customer's nested city without rebuilding the complete object manually.
**Input** `{"id":"C1","address":{"city":"Kurnool","zip":"518001"}}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload update {
  case .address.city -> "Hyderabad"
}
```
**Output** `{"id":"C1","address":{"city":"Hyderabad","zip":"518001"}}`
**Explanation:** The `update` operator changes a selected field while retaining the rest of the structure.
**Common mistake:** Reconstructing a large nested object and accidentally dropping fields.
**Interview tip:** `update` is useful when only a small part of a complex structure changes.

## DW-M205 — Create an optional field only when data is present
**Question:** Add `email` only when a customer email is non-blank.
**Input** `{"id":"C1","email":"ravi@example.com"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  (email: trim(payload.email)) if !isBlank(payload.email)
}
```
**Output** `{"id":"C1","email":"ravi@example.com"}`
**Explanation:** A conditional object field keeps optional data out of the response when it is not meaningful.
**Common mistake:** Returning an empty string as if it were valid data.
**Interview tip:** Distinguish omitted fields, null values, and blank strings.
