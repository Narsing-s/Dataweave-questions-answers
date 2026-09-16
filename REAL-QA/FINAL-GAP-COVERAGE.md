# Final DataWeave Gap Coverage — Non-Duplicate Additions

This batch adds questions only for gaps that were explicitly identified as underrepresented in the repository. The questions are intentionally different in transformation objective, input shape, operator combination, or business rule; changing names or numbers alone is not treated as a new question.

> Runtime note: examples are written for DataWeave 2.x concepts. They are not labeled runtime-verified unless executed against a compatible Mule/DataWeave runtime.

## Easy — binary/text and date fundamentals

### E226 — How can UTF-8 text be converted to Binary for a downstream binary contract?

**Difficulty:** Easy  
**Topic:** Binary/text conversion

**Input**
```json
{"message":"Hello MuleSoft"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  binaryValue: payload.message as Binary {encoding: "UTF-8"},
  encoding: "UTF-8"
}
```

**Expected output**
An object containing the UTF-8 binary representation of `Hello MuleSoft` and the declared encoding.

**Explanation**
DataWeave distinguishes text from binary data. The explicit encoding prevents an implicit charset assumption at the conversion boundary.

**Common mistake**
Treating every binary payload as UTF-8 text without first confirming its encoding.

**Interview tip**
Explain that a byte sequence does not inherently mean UTF-8; the encoding is part of the contract.

### E227 — How can UTF-8 Binary content be decoded as text?

**Difficulty:** Easy  
**Topic:** Binary/text conversion

**Input**
A Binary value containing the UTF-8 bytes for `Hello`.

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  text: payload as String {encoding: "UTF-8"}
}
```

**Expected output**
```json
{"text":"Hello"}
```

**Explanation**
The conversion explicitly declares how the bytes should be interpreted as characters.

**Common mistake**
Assuming the default encoding is always the same as the source system's encoding.

**Interview tip**
Binary-to-text conversion is a boundary concern and should be driven by the producer's documented charset.

### E228 — How can a date-only value be kept separate from a time-only value?

**Difficulty:** Easy  
**Topic:** Date and Time types

**Input**
```json
{"date":"2026-09-16","time":"17:05:00"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var d = payload.date as Date
var t = payload.time as Time
---
{
  dateType: typeOf(d),
  timeType: typeOf(t),
  date: d,
  time: t
}
```

**Expected output**
The output contains a `Date` value for the calendar date and a `Time` value for the time-of-day value.

**Explanation**
A date-only value and a time-only value represent different pieces of temporal information.

**Common mistake**
Combining them and silently inventing a timezone or timestamp.

**Interview tip**
A `DateTime` represents an instant-like date/time value with timezone information, while `Date` and `Time` do not carry the same semantics.

### E229 — How can an optional value fall back without confusing null with an empty string?

**Difficulty:** Easy  
**Topic:** Optional values and defaults

**Input**
```json
{"middleName":null,"nickname":""}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  middleName: payload.middleName default "Not provided",
  nickname: if (isEmpty(payload.nickname)) "Not provided" else payload.nickname
}
```

**Expected output**
```json
{"middleName":"Not provided","nickname":"Not provided"}
```

**Explanation**
`default` is useful for null or missing values, while an empty-string requirement needs an explicit emptiness rule.

**Common mistake**
Assuming `default` is a universal blank-value normalizer.

**Interview tip**
Ask whether the source contract distinguishes missing, null, blank, and whitespace-only values.

### E230 — How can an XML attribute be emitted separately from an XML element value?

**Difficulty:** Easy  
**Topic:** XML attributes

**Input**
```json
{"id":"B100","title":"DataWeave"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/xml
---
book @(id: payload.id): {
  title: payload.title
}
```

**Expected output**
```xml
<book id="B100"><title>DataWeave</title></book>
```

**Explanation**
The `@(...)` constructor syntax creates XML attributes instead of child elements.

**Common mistake**
Producing `{id: ...}` and expecting it to become an XML attribute automatically.

**Interview tip**
Know the difference between XML attributes and XML child elements because downstream schemas can treat them differently.

## Medium — XML, modules, namespaces and pagination

### M226 — How can repeated XML elements be normalized into an array?

**Difficulty:** Medium  
**Topic:** XML repeated elements

**Input**
```xml
<orders>
  <order><id>O1</id></order>
  <order><id>O2</id></order>
</orders>
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  orders: payload.order map (o) -> {
    id: o.id as String
  }
}
```

**Expected output**
```json
{"orders":[{"id":"O1"},{"id":"O2"}]}
```

**Explanation**
Repeated XML elements are represented as repeated keys and can be mapped as a collection.

**Common mistake**
Assuming an XML element is always a single object even when the schema permits repetition.

**Interview tip**
Design XML transformations for both one-occurrence and multiple-occurrence cases when the source contract allows either.

### M227 — How can XML attributes and child values be normalized into one JSON object?

**Difficulty:** Medium  
**Topic:** XML attribute selectors

**Input**
```xml
<customer id="C1"><name>Ravi</name><status>ACTIVE</status></customer>
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  id: payload.@id as String,
  name: payload.name as String,
  status: payload.status as String
}
```

**Expected output**
```json
{"id":"C1","name":"Ravi","status":"ACTIVE"}
```

**Explanation**
The attribute selector and child-element selector address different parts of the XML model.

**Common mistake**
Using `payload.id` when `id` exists only as an XML attribute.

**Interview tip**
When debugging XML mappings, first identify whether the source value is an attribute, element, namespace-qualified element, or repeated element.

### M228 — How can a namespaced XML document be transformed without losing namespace-qualified fields?

**Difficulty:** Medium  
**Topic:** XML namespaces

**Input**
```xml
<ns:customer xmlns:ns="urn:customer"><ns:id>C1</ns:id><ns:name>Ravi</ns:name></ns:customer>
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  id: payload.ns#id as String,
  name: payload.ns#name as String
}
```

**Expected output**
```json
{"id":"C1","name":"Ravi"}
```

**Explanation**
Namespace-qualified selectors identify elements using the namespace prefix and local name.

**Common mistake**
Selecting only `id` and assuming the local name is globally unique.

**Interview tip**
Namespace handling matters when two XML vocabularies use the same local element names.

### M229 — How can a shared transformation be moved into a reusable DataWeave module?

**Difficulty:** Medium  
**Topic:** Module organization and imports

**Input**
A reusable normalization function that accepts a customer object.

**Module: `modules/Customer.dwl`**
```dataweave
%dw 2.0
fun normalizeCustomer(c) = {
  id: c.id as String,
  name: upper(c.name)
}
```

**Main script**
```dataweave
%dw 2.0
import * from modules::Customer
output application/json
---
normalizeCustomer(payload)
```

**Expected output**
For `{"id":"C1","name":"ravi"}`:
```json
{"id":"C1","name":"RAVI"}
```

**Explanation**
A DataWeave module separates reusable transformation logic from the orchestration script.

**Common mistake**
Duplicating the same normalization function across multiple mappings.

**Interview tip**
Explain when a module is preferable to a local `fun`, especially when several flows share the same contract logic.

### M230 — How can a short final pagination page be handled safely?

**Difficulty:** Medium  
**Topic:** Pagination boundaries

**Input**
```json
{"items":["A","B","C","D","E"],"page":3,"pageSize":2}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var start = (payload.page - 1) * payload.pageSize
---
{
  page: payload.page,
  items: payload.items[start to (start + payload.pageSize - 1)] default []
}
```

**Expected output**
```json
{"page":3,"items":["E"]}
```

**Explanation**
The requested window is allowed to end beyond the array length, so the final page naturally contains fewer records.

**Common mistake**
Treating a short final page as an error when the pagination contract permits it.

**Interview tip**
Define the contract for empty pages, short final pages, invalid page numbers, and zero page size separately.

### M231 — How can a page number outside the available range be converted into an explicit empty result?

**Difficulty:** Medium  
**Topic:** Pagination validation

**Input**
```json
{"items":["A","B"],"page":4,"pageSize":2}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var start = (payload.page - 1) * payload.pageSize
---
{
  page: payload.page,
  items: if (start >= sizeOf(payload.items)) []
          else payload.items[start to (start + payload.pageSize - 1)]
}
```

**Expected output**
```json
{"page":4,"items":[]}
```

**Explanation**
The explicit boundary test distinguishes a valid short final page from a page that starts after the collection ends.

**Common mistake**
Returning the last page for every out-of-range request.

**Interview tip**
State whether the API should return an empty page, a validation error, or a 404-style application response for an out-of-range page.

## Advanced — recursion, precision, streaming and deterministic keys

### A226 — How can a recursive function walk a nested category tree?

**Difficulty:** Advanced  
**Topic:** Recursive transformations

**Input**
```json
{"name":"Root","children":[{"name":"A","children":[]},{"name":"B","children":[{"name":"B1","children":[]}]}]}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
fun flattenTree(node, path = []) =
  [{
    name: node.name,
    path: (path ++ [node.name]) joinBy "/"
  }] ++
  ((node.children default []) flatMap ((child) -> flattenTree(child, path ++ [node.name])))
---
flattenTree(payload)
```

**Expected output**
```json
[
  {"name":"Root","path":"Root"},
  {"name":"A","path":"Root/A"},
  {"name":"B","path":"Root/B"},
  {"name":"B1","path":"Root/B/B1"}
]
```

**Explanation**
The function processes the current node and recursively processes every child while carrying the path accumulated so far.

**Common mistake**
Forgetting the base case implied by an empty `children` collection.

**Interview tip**
Recursive DataWeave is useful for hierarchical data, but very deep or very large trees require careful consideration of execution cost.

### A227 — How can a recursive transformation convert an arbitrarily nested array into leaf values?

**Difficulty:** Advanced  
**Topic:** Recursive arrays

**Input**
```json
[1,[2,[3,4]],5]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
fun leaves(value) =
  if (value is Array)
    value flatMap ((item) -> leaves(item))
  else
    [value]
---
leaves(payload)
```

**Expected output**
```json
[1,2,3,4,5]
```

**Explanation**
The function recursively descends whenever the current value is an array and emits scalar values as leaves.

**Common mistake**
Using a single `flatten` when the required nesting depth is not known and the transformation needs to define its own traversal behavior.

**Interview tip**
Compare recursive traversal with `flatten`: the recursive version gives you control over what counts as a leaf.

### A228 — How can a currency amount be represented as integer minor units?

**Difficulty:** Advanced  
**Topic:** Currency precision

**Input**
```json
{"currency":"USD","amount":19.99}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  currency: payload.currency,
  minorUnits: round(payload.amount * 100)
}
```

**Expected output**
```json
{"currency":"USD","minorUnits":1999}
```

**Explanation**
For a currency whose documented minor unit is one hundredth, storing the amount as integer cents can make downstream comparisons and reconciliation explicit.

**Common mistake**
Assuming every currency has exactly two decimal places.

**Interview tip**
Minor-unit rules are currency-specific; do not hard-code `* 100` for a multi-currency system without a currency metadata rule.

### A229 — How can currency-specific scale be applied from metadata?

**Difficulty:** Advanced  
**Topic:** Currency-specific precision

**Input**
```json
{"currency":"USD","amount":12.345,"minorDigits":2}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var factor = 10 ^ payload.minorDigits
---
{
  currency: payload.currency,
  roundedAmount: round(payload.amount * factor) / factor
}
```

**Expected output**
For `minorDigits: 2`, the amount is rounded to two decimal places according to the runtime's numeric rounding behavior.

**Explanation**
The scale is derived from metadata instead of assuming every currency uses two decimal places.

**Common mistake**
Using a display formatter as the source of truth for the numeric value.

**Interview tip**
Keep numeric precision rules separate from presentation formatting.

### A230 — How can one reduce pass aggregate count and total together?

**Difficulty:** Advanced  
**Topic:** Single-pass aggregation

**Input**
```json
{"transactions":[{"amount":10},{"amount":20},{"amount":5}]}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.transactions reduce ((item, acc = {count: 0, total: 0}) -> {
  count: acc.count + 1,
  total: acc.total + item.amount
})
```

**Expected output**
```json
{"count":3,"total":35}
```

**Explanation**
A single reduction carries both aggregate values through the collection instead of separately scanning the same array for count and total.

**Common mistake**
Building multiple intermediate collections when one accumulator can hold the required aggregate state.

**Interview tip**
For large payloads, discuss whether repeated traversals and intermediate arrays are necessary.

### A231 — How can a deterministic key avoid collisions caused by ambiguous concatenation?

**Difficulty:** Advanced  
**Topic:** Deterministic key design

**Input**
```json
{"customer":"AB","account":"12"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  key: [payload.customer, payload.account] map ((v) -> (sizeOf(v as String)) as String ++ ":" ++ (v as String)) joinBy "|"
}
```

**Expected output**
```json
{"key":"2:AB|2:12"}
```

**Explanation**
Including field boundaries makes the representation unambiguous compared with a simple concatenation such as `AB12`.

**Common mistake**
Assuming a separator alone is safe when source values can themselves contain that separator.

**Interview tip**
A deterministic key needs both stable inputs and an unambiguous encoding of those inputs.

### A232 — How can a transformation preserve a short final page while returning pagination metadata?

**Difficulty:** Advanced  
**Topic:** Pagination metadata

**Input**
```json
{"items":["A","B","C","D","E"],"page":3,"pageSize":2}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var page = payload.page as Number
var size = payload.pageSize as Number
var start = (page - 1) * size
var pageItems = if (start >= sizeOf(payload.items)) [] else payload.items[start to (start + size - 1)]
---
{
  page: page,
  pageSize: size,
  itemCount: sizeOf(pageItems),
  hasNext: start + size < sizeOf(payload.items),
  items: pageItems
}
```

**Expected output**
```json
{"page":3,"pageSize":2,"itemCount":1,"hasNext":false,"items":["E"]}
```

**Explanation**
The mapping derives page metadata from the same bounded slice used for the response.

**Common mistake**
Setting `hasNext` from `itemCount == pageSize` without considering the collection boundary.

**Interview tip**
Pagination metadata should be derived from the same page/window semantics as the returned records.

### A233 — How can a transformation distinguish a missing XML attribute from an empty attribute?

**Difficulty:** Advanced  
**Topic:** XML edge cases

**Input**
Two XML inputs:
```xml
<customer><name>Ravi</name></customer>
```
and
```xml
<customer id=""><name>Ravi</name></customer>
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  hasId: payload.@id != null,
  id: payload.@id default ""
}
```

**Expected output**
For the first document, `hasId` is false; for the second, `hasId` is true and `id` is an empty string.

**Explanation**
Missing and present-but-empty attributes can have different business meanings.

**Common mistake**
Normalizing both cases to the same value before the validation rule runs.

**Interview tip**
Preserve distinctions that matter to validation and downstream contracts.

### A234 — How can a mixed XML content value be normalized without assuming every child is text?

**Difficulty:** Advanced  
**Topic:** XML mixed content

**Input**
An XML description containing text and an inline child element, such as `<description>Hello <b>world</b></description>`.

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  descriptionNode: payload.description,
  childText: payload.description.b as String default ""
}
```

**Expected output**
An object retaining the XML node structure and separately extracting the known child element text.

**Explanation**
Mixed content is not safely treated as a simple string when markup carries meaning.

**Common mistake**
Casting the entire mixed-content node to String and assuming all structure is preserved.

**Interview tip**
Ask whether the downstream contract wants rendered text or preserved XML structure before flattening mixed content.

### A235 — How can a DataWeave script import only a named function from a module?

**Difficulty:** Advanced  
**Topic:** Module organization

**Input**
A module `modules/Amounts.dwl` containing:
```dataweave
%dw 2.0
fun cents(amount) = round(amount * 100)
fun label(amount) = "USD " ++ (amount as String)
```

**DataWeave**
```dataweave
%dw 2.0
import cents from modules::Amounts
output application/json
---
{minorUnits: cents(payload.amount)}
```

**Expected output**
For `{"amount":19.99}`:
```json
{"minorUnits":1999}
```

**Explanation**
Importing a named function makes the dependency explicit and avoids exposing unrelated module functions through a wildcard import.

**Common mistake**
Using wildcard imports everywhere and making it difficult to identify where a function comes from.

**Interview tip**
Module boundaries should make reusable transformation dependencies understandable and maintainable.

### A236 — How can an aggregation retain the first and last transaction timestamp in one pass?

**Difficulty:** Advanced  
**Topic:** Single-pass aggregation

**Input**
```json
{"transactions":[{"ts":"2026-09-16T10:00:00Z","amount":10},{"ts":"2026-09-16T12:00:00Z","amount":20}]}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var rows = payload.transactions map ((t) -> t ++ {time: t.ts as DateTime})
---
rows reduce ((item, acc = {first: null, last: null}) -> {
  first: if (acc.first == null or item.time < acc.first) item.time else acc.first,
  last: if (acc.last == null or item.time > acc.last) item.time else acc.last
})
```

**Expected output**
An object whose `first` is the earliest transaction time and `last` is the latest transaction time.

**Explanation**
The accumulator maintains both boundaries without sorting the complete collection.

**Common mistake**
Sorting the entire input when only minimum and maximum timestamps are required.

**Interview tip**
Choose aggregation state based on the business result; not every min/max problem requires ordering the whole collection.

### A237 — How can a large-payload transformation reuse one derived lookup instead of repeatedly searching the source array?

**Difficulty:** Advanced  
**Topic:** Performance-aware lookup design

**Input**
```json
{
  "customers":[{"id":"C1","tier":"GOLD"},{"id":"C2","tier":"SILVER"}],
  "orders":[{"customerId":"C1","amount":100},{"customerId":"C2","amount":50}]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var customerById = payload.customers reduce ((c, acc = {}) -> acc ++ {(c.id): c})
---
payload.orders map (o) -> {
  orderCustomer: o.customerId,
  tier: customerById[o.customerId].tier default "UNKNOWN",
  amount: o.amount
}
```

**Expected output**
```json
[
  {"orderCustomer":"C1","tier":"GOLD","amount":100},
  {"orderCustomer":"C2","tier":"SILVER","amount":50}
]
```

**Explanation**
The customer collection is transformed once into a lookup object and reused for each order.

**Common mistake**
Scanning the complete customer array separately for every order when a reusable index is appropriate.

**Interview tip**
For large payloads, compare repeated linear scans with a derived lookup structure and discuss memory versus traversal trade-offs.
