# Advanced DataWeave Q&A — DW-A211 to DW-A225

## DW-A211 — Capture values with regular-expression scan
**Question:** Extract all ticket numbers from a text string using a regex scan.
**Input** `{"text":"INC-1001 closed; INC-1002 open"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload.text scan /INC-[0-9]+/) map $[0]
```
**Output** `["INC-1001","INC-1002"]`
**Explanation:** `scan` finds all matching substrings; the first capture element contains the complete match.
**Common mistake:** Using `matches`, which answers a validation question rather than extracting every occurrence.
**Interview tip:** Explain the difference between validation, replacement, and extraction.

## DW-A212 — Parse structured text with capture groups
**Question:** Extract the numeric ID and status from an incident string.
**Input** `{"value":"INC-1042:OPEN"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload.value scan /INC-([0-9]+):([A-Z]+)/) map ((m) -> {id: m[1], status: m[2]})
```
**Output** `[{"id":"1042","status":"OPEN"}]`
**Explanation:** Capture groups expose individual pieces of a larger regex match.
**Common mistake:** Treating the full match as if it were the first capture group.
**Interview tip:** Draw the full match and capture groups separately when debugging regex mappings.

## DW-A213 — Protect a calculation from zero denominator
**Question:** Calculate success rate as a percentage and return zero when there are no attempts.
**Input** `{"successful":0,"attempts":0}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.attempts == 0) 0 else (payload.successful / payload.attempts) * 100
```
**Output** `0`
**Explanation:** The denominator is validated before division.
**Common mistake:** Dividing first and trying to handle the result afterward.
**Interview tip:** Boundary validation belongs before the risky operation.

## DW-A214 — Normalize multiple API versions
**Question:** Convert two source API shapes into one customer contract.
**Input** `{"version":"v1","data":{"id":"C1","fullName":"Ravi"}}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.version match {
  case "v1" -> {id: payload.data.id, name: payload.data.fullName}
  case "v2" -> {id: payload.customer.id, name: payload.customer.name}
  else -> {id: null, name: null}
}
```
**Output** `{"id":"C1","name":"Ravi"}`
**Explanation:** Version-specific source structures are normalized at the integration boundary.
**Common mistake:** Passing version-specific fields downstream.
**Interview tip:** Keep version handling isolated from the canonical target contract.

## DW-A215 — Resolve duplicates using latest version
**Question:** Keep the highest version of each product record.
**Input** `[{"id":"P1","version":1,"price":10},{"id":"P1","version":3,"price":14},{"id":"P2","version":2,"price":20}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.id) pluck ((items, id) -> items orderBy -$.version)[0]
```
**Output** `[{"id":"P1","version":3,"price":14},{"id":"P2","version":2,"price":20}]`
**Explanation:** Records are grouped by business key, ordered by version descending, and the first record is selected.
**Common mistake:** Using `distinctBy $.id`, which does not express latest-version selection.
**Interview tip:** Make the duplicate-resolution rule explicit rather than relying on source order.

## DW-A216 — Build an audit record
**Question:** Create a deterministic audit object containing operation, business key, and source status.
**Input** `{"customerId":"C42","status":"ACTIVE"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  operation: "CUSTOMER_SYNC",
  businessKey: payload.customerId,
  sourceStatus: payload.status
}
```
**Output** `{"operation":"CUSTOMER_SYNC","businessKey":"C42","sourceStatus":"ACTIVE"}`
**Explanation:** A canonical audit structure is created from business fields.
**Common mistake:** Including nondeterministic timestamps when a deterministic fixture is required.
**Interview tip:** Distinguish business audit data from technical logging metadata.

## DW-A217 — Create a deterministic composite business key
**Question:** Build a stable key from customer ID, account type, and branch code.
**Input** `{"customerId":"C1","accountType":"SAVINGS","branch":"HYD01"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
[payload.customerId, payload.accountType, payload.branch] joinBy "|"
```
**Output** `"C1|SAVINGS|HYD01"`
**Explanation:** The same business fields in the same order produce the same composite key.
**Common mistake:** Omitting fields that are required to distinguish records.
**Interview tip:** Check delimiter collisions and normalization rules before using a composite key operationally.

## DW-A218 — Apply currency rounding explicitly
**Question:** Round a calculated invoice total to two decimal places.
**Input** `{"quantity":3,"unitPrice":19.999}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
round(payload.quantity * payload.unitPrice * 100) / 100
```
**Output** `60`
**Explanation:** The amount is rounded after the multiplication according to a two-decimal target.
**Common mistake:** Rounding quantity or unit price independently before multiplication.
**Interview tip:** State the business rounding rule and when it is applied.

## DW-A219 — Normalize an optional page number
**Question:** Convert a missing page number into page 1 and reject page values below 1 conceptually through normalization.
**Input** `{"page":null}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
max([1, (payload.page default 1) as Number])
```
**Output** `1`
**Explanation:** A missing page defaults to one and the lower boundary is enforced.
**Common mistake:** Allowing zero or negative page numbers into downstream slicing logic.
**Interview tip:** Normalize pagination inputs before calculating offsets.

## DW-A220 — Calculate a page slice with explicit boundaries
**Question:** Return records for page 2 with page size 2 from five records.
**Input** `["A","B","C","D","E"]`
**DataWeave**
```dw
%dw 2.0
var page = 2
var pageSize = 2
var start = (page - 1) * pageSize
output application/json
---
payload[start to min([start + pageSize - 1, sizeOf(payload) - 1])]
```
**Output** `["C","D"]`
**Explanation:** The start and inclusive end indexes are calculated explicitly.
**Common mistake:** Mixing inclusive DataWeave ranges with exclusive-end conventions from other languages.
**Interview tip:** Always test first page, middle page, final partial page, and beyond-last-page cases.

## DW-A221 — Avoid repeating a large filter
**Question:** Produce count and total from successful transactions while evaluating the status filter once.
**Input** `[{"status":"SUCCESS","amount":100},{"status":"FAILED","amount":20},{"status":"SUCCESS","amount":50}]`
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
    total: sum(successful map $.amount)
  }
}
```
**Output** `{"count":2,"total":150}`
**Explanation:** The shared subset is calculated once and reused.
**Common mistake:** Repeating the same filter for every output property.
**Interview tip:** Discuss readability and repeated-work reduction for large inputs.

## DW-A222 — Extract XML attributes and elements
**Question:** Convert an XML customer element with an ID attribute into JSON.
**Input** `<customer id="C1"><name>Ravi</name></customer>`
**DataWeave**
```dw
%dw 2.0
input application/xml
output application/json
---
{
  id: payload.customer.@id,
  name: payload.customer.name
}
```
**Output** `{"id":"C1","name":"Ravi"}`
**Explanation:** XML attributes and child elements use different navigation syntax.
**Common mistake:** Treating an XML attribute as an ordinary child element.
**Interview tip:** Practice attributes, repeated elements, namespaces, and text nodes separately.

## DW-A223 — Handle repeated XML elements
**Question:** Return all item codes from repeated XML `item` elements.
**Input** `<order><item code="A"/><item code="B"/></order>`
**DataWeave**
```dw
%dw 2.0
input application/xml
output application/json
---
payload.order.item map $.@code
```
**Output** `["A","B"]`
**Explanation:** Repeated XML elements can be treated as a collection for mapping.
**Common mistake:** Selecting only one repeated node and silently dropping the rest.
**Interview tip:** Test XML with zero, one, and many repeated elements.

## DW-A224 — Use a typed reusable function
**Question:** Create a function that accepts a numeric amount and returns a two-decimal numeric result after adding tax.
**Input** `100`
**DataWeave**
```dw
%dw 2.0
fun withTax(amount: Number, rate: Number): Number = round((amount * (1 + rate)) * 100) / 100
output application/json
---
withTax(payload, 0.18)
```
**Output** `118`
**Explanation:** Typed function parameters and return type document the transformation contract.
**Common mistake:** Leaving reusable business functions untyped when the contract is known.
**Interview tip:** Explain how typing catches incorrect usage earlier and improves maintainability.

## DW-A225 — Handle a recoverable transformation error
**Question:** Return a safe error object when numeric conversion fails.
**Input** `{"amount":"not-a-number"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
try(() -> payload.amount as Number) orElse {
  success: false,
  error: "INVALID_AMOUNT"
}
```
**Output** `{"success":false,"error":"INVALID_AMOUNT"}`
**Explanation:** `try` captures a transformation failure and `orElse` provides a fallback result.
**Common mistake:** Assuming every source string is safely numeric.
**Interview tip:** Distinguish recoverable mapping errors from errors that should propagate to the integration flow.
