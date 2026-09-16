# New Advanced DataWeave Q&A — DW-A126 to DW-A150

## DW-A126 — Reconcile two transaction snapshots
**Question:** Return transactions whose amount differs between an expected and actual snapshot.
**Input**
```json
{"expected":[{"id":"T1","amount":100},{"id":"T2","amount":200}],"actual":[{"id":"T1","amount":100},{"id":"T2","amount":250}]}
```
**DataWeave**
```dw
%dw 2.0
var actualById = payload.actual reduce ((item, acc = {}) -> acc ++ {(item.id): item})
output application/json
---
payload.expected filter ((expected) -> (actualById[expected.id] default {}).amount != expected.amount) map ((expected) -> {
  id: expected.id,
  expectedAmount: expected.amount,
  actualAmount: actualById[expected.id].amount default null
})
```
**Output**
```json
[{"id":"T2","expectedAmount":200,"actualAmount":250}]
```
**Explanation:** The actual records are indexed once, then expected records are compared against the index.
**Common mistake:** Repeatedly scanning the actual array for every expected record without considering scale.
**Interview tip:** Explain why building a lookup can make reconciliation easier to reason about.

## DW-A127 — Perform an anti-join against reference data
**Question:** Return orders whose customer ID does not exist in the customer reference list.
**Input**
```json
{"orders":[{"id":"O1","customerId":"C1"},{"id":"O2","customerId":"C9"}],"customers":[{"id":"C1"},{"id":"C2"}]}
```
**DataWeave**
```dw
%dw 2.0
var customerIds = payload.customers map $.id
output application/json
---
payload.orders filter !(customerIds contains $.customerId)
```
**Output**
```json
[{"id":"O2","customerId":"C9"}]
```
**Explanation:** The reference IDs are collected once and orders are filtered against them.
**Common mistake:** Assuming every foreign key has a matching reference record.
**Interview tip:** Anti-joins are useful for data-quality and reconciliation checks.

## DW-A128 — Re-key nested records
**Question:** Convert customers with nested accounts into an object keyed by customer ID, preserving the account list.
**Input**
```json
[{"id":"C1","accounts":["A1","A2"]},{"id":"C2","accounts":["A3"]}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((customer, acc = {}) -> acc ++ {(customer.id): {accounts: customer.accounts}})
```
**Output**
```json
{"C1":{"accounts":["A1","A2"]},"C2":{"accounts":["A3"]}}
```
**Explanation:** The customer ID becomes the dynamic key while nested account data is preserved.
**Common mistake:** Using an array when downstream lookup requires direct key access.
**Interview tip:** Re-keying is useful when converting lists into indexes.

## DW-A129 — Produce a hierarchical financial summary
**Question:** Summarize transaction totals by account and transaction type.
**Input**
```json
[{"account":"A1","type":"DEBIT","amount":100},{"account":"A1","type":"CREDIT","amount":250},{"account":"A2","type":"DEBIT","amount":40}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.account) mapObject ((accountRows, account) -> {
  (account): (accountRows groupBy $.type) mapObject ((typeRows, type) -> {(type): sum(typeRows.amount)})
})
```
**Output**
```json
{"A1":{"DEBIT":100,"CREDIT":250},"A2":{"DEBIT":40}}
```
**Explanation:** Grouping is performed at two levels to build a nested summary.
**Common mistake:** Aggregating all accounts into one type bucket.
**Interview tip:** Nested `groupBy` is useful for multi-dimensional reporting.

## DW-A130 — Calculate net transaction movement
**Question:** Calculate credit minus debit for each account.
**Input**
```json
[{"account":"A1","type":"CREDIT","amount":250},{"account":"A1","type":"DEBIT","amount":100},{"account":"A2","type":"DEBIT","amount":40}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.account) mapObject ((rows, account) -> {
  (account): (sum((rows filter $.type == "CREDIT").amount) default 0) - (sum((rows filter $.type == "DEBIT").amount) default 0)
})
```
**Output**
```json
{"A1":150,"A2":-40}
```
**Explanation:** Credits and debits are aggregated separately before calculating net movement.
**Common mistake:** Adding both transaction types instead of applying their business signs.
**Interview tip:** Make the financial sign convention explicit.

## DW-A131 — Build a reusable pagination function
**Question:** Create a function that returns page metadata and the selected records.
**Input**
```json
{"items":[1,2,3,4,5],"page":2,"size":2}
```
**DataWeave**
```dw
%dw 2.0
fun page(items: Array<Any>, number: Number, size: Number) = {
  page: number,
  size: size,
  total: sizeOf(items),
  items: items[((number - 1) * size) to (((number - 1) * size) + size - 1)] default []
}
output application/json
---
page(payload.items, payload.page, payload.size)
```
**Output**
```json
{"page":2,"size":2,"total":5,"items":[3,4]}
```
**Explanation:** A reusable function computes the slice boundaries from page number and size.
**Common mistake:** Treating page numbers as zero-based when the contract is one-based.
**Interview tip:** Also discuss total pages and out-of-range behavior for a production API.

## DW-A132 — Preserve a stable API contract while selecting dynamic metadata
**Question:** Return known fields and only metadata beginning with `meta_`.
**Input**
```json
{"id":"O1","status":"READY","meta_trace":"T1","meta_region":"IN","internalSecret":"x"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  status: payload.status,
  metadata: payload filterObject ((value, key) -> startsWith(key as String, "meta_"))
}
```
**Output**
```json
{"id":"O1","status":"READY","metadata":{"meta_trace":"T1","meta_region":"IN"}}
```
**Explanation:** The mapping explicitly controls exposed fields and separately allows a controlled metadata namespace.
**Common mistake:** Passing the whole payload through and accidentally exposing internal fields.
**Interview tip:** This pattern supports controlled forward compatibility without making the whole payload dynamic.

## DW-A133 — Build an API error envelope from validation failures
**Question:** Return a standard error response when required fields are invalid.
**Input**
```json
{"id":"","amount":-5}
```
**DataWeave**
```dw
%dw 2.0
var errors = [
  {field: "id", message: "ID is required"} if isBlank(payload.id),
  {field: "amount", message: "Amount must be positive"} if payload.amount <= 0
] filter ($ != null)
output application/json
---
{
  success: isEmpty(errors),
  errors: errors
}
```
**Output**
```json
{"success":false,"errors":[{"field":"id","message":"ID is required"},{"field":"amount","message":"Amount must be positive"}]}
```
**Explanation:** Validation rules are assembled into a structured error list.
**Common mistake:** Returning only the first validation error when the contract expects all errors.
**Interview tip:** Separate transformation-level validation from Mule error handling policy.

## DW-A134 — Mask a sensitive account identifier
**Question:** Show only the final four digits of an account number and mask the rest.
**Input**
```json
{"account":"1234567890123456"}
```
**DataWeave**
```dw
%dw 2.0
var value = payload.account as String
output application/json
---
{
  masked: ("*" repeat (sizeOf(value) - 4)) ++ value[-4 to -1]
}
```
**Output**
```json
{"masked":"************3456"}
```
**Explanation:** The length determines the number of masking characters and the final four characters are preserved.
**Common mistake:** Hard-coding the number of mask characters.
**Interview tip:** Validate minimum length before applying fixed suffix slicing in production.

## DW-A135 — Normalize a polymorphic input
**Question:** Accept either a single customer object or an array of customers and always return an array.
**Input**
```json
{"id":"C1","name":"Ravi"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload is Array) payload else [payload]
```
**Output**
```json
[{"id":"C1","name":"Ravi"}]
```
**Explanation:** The type check normalizes two possible input shapes into one target shape.
**Common mistake:** Assuming a collection contract when a source system sometimes sends a singleton.
**Interview tip:** Document the accepted input shapes explicitly.

## DW-A136 — Branch transformation by type
**Question:** Return a normalized value for String, Number, and Boolean inputs.
**Input**
```json
{"value":42}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.value match {
  case is String -> upper(payload.value)
  case is Number -> payload.value as String
  case is Boolean -> if (payload.value) "YES" else "NO"
  else -> null
}
```
**Output**
```json
"42"
```
**Explanation:** Pattern matching selects behavior according to the runtime type.
**Common mistake:** Assuming every source field has one fixed type.
**Interview tip:** `match` is useful when multiple type-specific branches are required.

## DW-A137 — Extract XML attributes into JSON
**Question:** Convert customer XML attributes into JSON fields.
**Input**
```xml
<customer id="C1" status="ACTIVE"><name>Ravi</name></customer>
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.customer.@id,
  status: payload.customer.@status,
  name: payload.customer.name
}
```
**Output**
```json
{"id":"C1","status":"ACTIVE","name":"Ravi"}
```
**Explanation:** XML attributes use the `.@attribute` selector while child elements use normal selectors.
**Common mistake:** Treating XML attributes like child elements.
**Interview tip:** Explain element-versus-attribute selectors clearly.

## DW-A138 — Handle an XML namespace
**Question:** Select a namespaced XML element and produce JSON.
**Input**
```xml
<ns:customer xmlns:ns="urn:example"><ns:id>C1</ns:id></ns:customer>
```
**DataWeave**
```dw
%dw 2.0
ns namespace ns "urn:example"
output application/json
---
{
  id: payload.ns#customer.ns#id
}
```
**Output**
```json
{"id":"C1"}
```
**Explanation:** The namespace declaration lets the transformation address namespaced XML elements explicitly.
**Common mistake:** Selecting the element without considering its namespace.
**Interview tip:** Namespace handling is important when integrating SOAP/XML systems.

## DW-A139 — Build a CSV export with calculated fields
**Question:** Export order totals including tax calculated from subtotal.
**Input**
```json
[{"id":"O1","subtotal":100},{"id":"O2","subtotal":200}]
```
**DataWeave**
```dw
%dw 2.0
output application/csv
---
payload map {
  orderId: $.id,
  subtotal: $.subtotal,
  tax: $.subtotal * 0.18,
  total: $.subtotal * 1.18
}
```
**Output**
```text
orderId,subtotal,tax,total
O1,100,18,118
O2,200,36,236
```
**Explanation:** Calculated fields are created before CSV serialization.
**Common mistake:** Mixing display formatting with numeric calculations too early.
**Interview tip:** Keep calculations numeric until the final serialization stage.

## DW-A140 — Reconcile expected and actual record sets
**Question:** Return IDs missing from the actual set and IDs unexpectedly present in the actual set.
**Input**
```json
{"expected":[{"id":"A"},{"id":"B"}],"actual":[{"id":"B"},{"id":"C"}]}
```
**DataWeave**
```dw
%dw 2.0
var expectedIds = payload.expected map $.id
var actualIds = payload.actual map $.id
output application/json
---
{
  missing: expectedIds filter !(actualIds contains $),
  unexpected: actualIds filter !(expectedIds contains $)
}
```
**Output**
```json
{"missing":["A"],"unexpected":["C"]}
```
**Explanation:** Two set-difference operations expose both reconciliation directions.
**Common mistake:** Reporting only missing records and overlooking unexpected records.
**Interview tip:** Reconciliation normally requires both directions.

## DW-A141 — Detect conflicting duplicate records
**Question:** Find IDs that occur multiple times with different amounts.
**Input**
```json
[{"id":"T1","amount":100},{"id":"T1","amount":120},{"id":"T2","amount":50}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.id)
  filterObject ((rows, id) -> sizeOf((rows map $.amount) distinctBy $) > 1)
  pluck ((rows, id) -> {id: id, amounts: rows map $.amount distinctBy $})
```
**Output**
```json
[{"id":"T1","amounts":[100,120]}]
```
**Explanation:** Duplicate IDs are grouped and only groups with more than one distinct amount are reported.
**Common mistake:** Treating every duplicate as a conflict.
**Interview tip:** Duplicate identity and conflicting content are separate conditions.

## DW-A142 — Build a daily transaction summary
**Question:** Group transactions by date and calculate count and total amount.
**Input**
```json
[{"date":"2026-09-16","amount":100},{"date":"2026-09-16","amount":50},{"date":"2026-09-17","amount":25}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.date) mapObject ((rows, date) -> {
  (date): {
    count: sizeOf(rows),
    total: sum(rows.amount)
  }
})
```
**Output**
```json
{"2026-09-16":{"count":2,"total":150},"2026-09-17":{"count":1,"total":25}}
```
**Explanation:** Grouping creates daily buckets and each bucket is summarized independently.
**Common mistake:** Grouping by a full timestamp when the business requirement is calendar date.
**Interview tip:** Clarify timezone and date extraction rules in real systems.

## DW-A143 — Create a reusable typed validation function
**Question:** Build a function that validates a positive amount and returns a Boolean.
**Input**
```json
{"amount":125}
```
**DataWeave**
```dw
%dw 2.0
fun validAmount(value: Number): Boolean = value > 0
output application/json
---
validAmount(payload.amount)
```
**Output**
```json
true
```
**Explanation:** The function declares both parameter and return types.
**Common mistake:** Treating type declarations as runtime business validation by themselves.
**Interview tip:** Types and business rules solve different problems.

## DW-A144 — Build a controlled production envelope
**Question:** Create a standard transaction envelope containing correlation ID, operation, status, and data.
**Input**
```json
{"correlationId":"abc-123","operation":"CREATE","status":"SUCCESS","customer":{"id":"C1"}}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  correlationId: payload.correlationId,
  operation: payload.operation,
  status: payload.status,
  data: payload.customer
}
```
**Output**
```json
{"correlationId":"abc-123","operation":"CREATE","status":"SUCCESS","data":{"id":"C1"}}
```
**Explanation:** Operational metadata and business data are separated into a predictable envelope.
**Common mistake:** Copying every source field into the response.
**Interview tip:** Stable envelopes simplify logging and downstream contract handling.

## DW-A145 — Calculate weighted average
**Question:** Calculate a weighted average score using quantity as the weight.
**Input**
```json
[{"score":80,"quantity":2},{"score":90,"quantity":3}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (sum(payload.quantity) == 0) null else sum(payload map ($.score * $.quantity)) / sum(payload.quantity)
```
**Output**
```json
86
```
**Explanation:** Each score is multiplied by its weight and the result is divided by the total weight.
**Common mistake:** Using a simple average when records have different weights.
**Interview tip:** Always define the weighting rule explicitly.

## DW-A146 — Build a lookup from reference data once
**Question:** Enrich orders with product names using a product index.
**Input**
```json
{"orders":[{"productId":"P1","qty":2},{"productId":"P2","qty":1}],"products":[{"id":"P1","name":"Phone"},{"id":"P2","name":"Case"}]}
```
**DataWeave**
```dw
%dw 2.0
var productById = payload.products reduce ((p, acc = {}) -> acc ++ {(p.id): p})
output application/json
---
payload.orders map ((order) -> order ++ {productName: productById[order.productId].name default "UNKNOWN"})
```
**Output**
```json
[{"productId":"P1","qty":2,"productName":"Phone"},{"productId":"P2","qty":1,"productName":"Case"}]
```
**Explanation:** The reference array is indexed once and then used for enrichment.
**Common mistake:** Performing a full filter search for every order without considering data size.
**Interview tip:** Discuss the trade-off between memory for an index and repeated lookup work.

## DW-A147 — Create an idempotency business key
**Question:** Create a deterministic business key from source system, transaction ID, and operation.
**Input**
```json
{"source":"CRM","transactionId":"T100","operation":"CREATE"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
upper(payload.source) ++ "|" ++ payload.transactionId ++ "|" ++ payload.operation
```
**Output**
```json
"CRM|T100|CREATE"
```
**Explanation:** The selected business identity fields are combined into a stable key.
**Common mistake:** Including mutable fields such as timestamps when they are not part of identity.
**Interview tip:** Idempotency depends on a correctly defined business identity, not just string concatenation.

## DW-A148 — Produce a reconciliation exception report
**Question:** Report records where expected and actual amounts differ, including the absolute difference.
**Input**
```json
{"expected":[{"id":"A","amount":100},{"id":"B","amount":200}],"actual":[{"id":"A","amount":110},{"id":"B","amount":200}]}
```
**DataWeave**
```dw
%dw 2.0
var actualById = payload.actual reduce ((x, acc = {}) -> acc ++ {(x.id): x})
output application/json
---
payload.expected
  filter ((x) -> (actualById[x.id].amount default null) != x.amount)
  map ((x) -> {
    id: x.id,
    expected: x.amount,
    actual: actualById[x.id].amount default null,
    difference: (actualById[x.id].amount default 0) - x.amount
  })
```
**Output**
```json
[{"id":"A","expected":100,"actual":110,"difference":10}]
```
**Explanation:** An indexed actual dataset makes comparison and exception construction explicit.
**Common mistake:** Reporting only a Boolean mismatch without useful reconciliation details.
**Interview tip:** Exception reports should contain enough information for investigation.

## DW-A149 — Normalize optional nested API data
**Question:** Return a stable `preferences` object even when the source omits it.
**Input**
```json
{"id":"C1","name":"Ravi"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  name: payload.name,
  preferences: payload.preferences default {
    language: "en",
    notifications: true
  }
}
```
**Output**
```json
{"id":"C1","name":"Ravi","preferences":{"language":"en","notifications":true}}
```
**Explanation:** The response contract remains stable even when an optional source object is missing.
**Common mistake:** Defaulting individual fields while forgetting that the entire nested object can be absent.
**Interview tip:** Decide whether missing and explicitly null should have the same contract meaning.

## DW-A150 — Build a multi-rule review candidate list
**Question:** Select transactions meeting both a high-value threshold and a review status.
**Input**
```json
[{"id":"T1","amount":15000,"status":"REVIEW"},{"id":"T2","amount":5000,"status":"REVIEW"},{"id":"T3","amount":20000,"status":"APPROVED"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter ($.amount >= 10000 and $.status == "REVIEW") map {
  id: $.id,
  amount: $.amount,
  reason: "HIGH_VALUE_REVIEW"
}
```
**Output**
```json
[{"id":"T1","amount":15000,"reason":"HIGH_VALUE_REVIEW"}]
```
**Explanation:** Multiple deterministic business conditions are combined and the result is projected into a review record.
**Common mistake:** Treating the rule as a fraud determination rather than a screening transformation.
**Interview tip:** Keep transformation logic separate from downstream risk-decision systems when appropriate.
