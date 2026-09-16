# New Advanced DataWeave Q&A — DW-A76 to DW-A100

## DW-A76 — Reconcile expected and actual payments
**Question:** Compare expected and actual payment records by transaction ID and report the difference.
**Input**
```json
{"expected":[{"id":"T1","amount":100},{"id":"T2","amount":250}],"actual":[{"id":"T1","amount":100},{"id":"T2","amount":200}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
var actualById = payload.actual map ((x) -> {(x.id): x.amount}) reduce ((x, acc = {}) -> acc ++ x)
---
payload.expected map ((x) -> {
  id: x.id,
  expected: x.amount,
  actual: actualById[x.id] default 0,
  difference: x.amount - (actualById[x.id] default 0)
})
```
**Output**
```json
[{"id":"T1","expected":100,"actual":100,"difference":0},{"id":"T2","expected":250,"actual":200,"difference":50}]
```
**Explanation:** Actual values are indexed first so each expected record can be reconciled efficiently.
**Common mistake:** Comparing arrays by position when transaction IDs are the business key.
**Interview tip:** Explain why indexing by business key is safer than relying on array order.

## DW-A77 — Enrich orders from a product catalog
**Question:** Add product names to order lines using a catalog lookup.
**Input**
```json
{"catalog":[{"sku":"A","name":"Phone"},{"sku":"B","name":"Tablet"}],"orders":[{"sku":"A","qty":2},{"sku":"B","qty":1}]}
```
**DataWeave**
```dw
%dw 2.0
var catalogBySku = payload.catalog map ((p) -> {(p.sku): p.name}) reduce ((x, acc = {}) -> acc ++ x)
output application/json
---
payload.orders map ((line) -> line ++ {productName: catalogBySku[line.sku] default "UNKNOWN"})
```
**Output**
```json
[{"sku":"A","qty":2,"productName":"Phone"},{"sku":"B","qty":1,"productName":"Tablet"}]
```
**Explanation:** A lookup object provides enrichment without nested searching.
**Common mistake:** Assuming every SKU exists in the catalog.
**Interview tip:** Always define the behavior for missing reference data.

## DW-A78 — Detect duplicate business transactions
**Question:** Return duplicate transaction keys based on account, date and amount.
**Input**
```json
[{"account":"A1","date":"2026-09-01","amount":100},{"account":"A1","date":"2026-09-01","amount":100},{"account":"A1","date":"2026-09-02","amount":100}]
```
**DataWeave**
```dw
%dw 2.0
var keys = payload map ($.account ++ "|" ++ $.date ++ "|" ++ ($.amount as String))
---
(keys groupBy $) mapObject ((rows, key) -> {(key): sizeOf(rows)}) filterObject ($ > 1)
```
**Output**
```json
{"A1|2026-09-01|100":2}
```
**Explanation:** A composite business key is counted and only repeated keys remain.
**Common mistake:** Treating database IDs as the only possible duplicate criterion.
**Interview tip:** Duplicate detection should be driven by business identity.

## DW-A79 — Build a reconciliation exception report
**Question:** Return only transactions whose expected and actual values differ.
**Input**
```json
[{"id":"T1","expected":100,"actual":100},{"id":"T2","expected":200,"actual":180}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter $.expected != $.actual map {
  id: $.id,
  difference: $.expected - $.actual
}
```
**Output**
```json
[{"id":"T2","difference":20}]
```
**Explanation:** Only mismatches enter the exception output and the difference is calculated.
**Common mistake:** Reporting successful matches as exceptions.
**Interview tip:** Exception reports should be intentionally smaller than the source dataset.

## DW-A80 — Create a multi-level financial summary
**Question:** Group transactions by account and currency and calculate totals.
**Input**
```json
[{"account":"A1","currency":"INR","amount":100},{"account":"A1","currency":"INR","amount":50},{"account":"A1","currency":"USD","amount":20}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.account) mapObject ((accountRows, account) -> {
  (account): (accountRows groupBy $.currency) mapObject ((rows, currency) -> {(currency): sum(rows.amount)})
})
```
**Output**
```json
{"A1":{"INR":150,"USD":20}}
```
**Explanation:** The transformation performs grouping at two business dimensions.
**Common mistake:** Grouping currency globally and losing account ownership.
**Interview tip:** Build hierarchical aggregation one level at a time.

## DW-A81 — Calculate invoice tax by jurisdiction
**Question:** Apply different tax rates based on state.
**Input**
```json
[{"state":"KA","amount":1000},{"state":"AP","amount":1000},{"state":"TS","amount":1000}]
```
**DataWeave**
```dw
%dw 2.0
fun taxRate(state) = state match {
  case "KA" -> 0.18
  case "AP" -> 0.12
  case "TS" -> 0.15
  else -> 0
}
output application/json
---
payload map ((line) -> {
  state: line.state,
  amount: line.amount,
  tax: line.amount * taxRate(line.state)
})
```
**Output**
```json
[{"state":"KA","amount":1000,"tax":180},{"state":"AP","amount":1000,"tax":120},{"state":"TS","amount":1000,"tax":150}]
```
**Explanation:** A reusable function centralizes jurisdiction-specific tax rules.
**Common mistake:** Duplicating conditional tax logic in every output field.
**Interview tip:** Reusable functions improve consistency and testability.

## DW-A82 — Generate a settlement status
**Question:** Classify a settlement using expected amount, received amount, and settlement state.
**Input**
```json
{"expected":1000,"received":1000,"state":"COMPLETED"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  status: if (payload.state != "COMPLETED") "PENDING" else if (payload.received == payload.expected) "SETTLED" else if (payload.received < payload.expected) "PARTIAL" else "OVERPAID"
}
```
**Output**
```json
{"status":"SETTLED"}
```
**Explanation:** State is evaluated before amount comparison because an incomplete settlement cannot be settled.
**Common mistake:** Checking amounts before the settlement lifecycle state.
**Interview tip:** Put business-rule precedence directly into the transformation.

## DW-A83 — Preserve unknown API fields safely
**Question:** Map known customer fields while placing all remaining source fields under `metadata`.
**Input**
```json
{"id":1,"name":"Ravi","city":"Hyd","tier":"GOLD"}
```
**DataWeave**
```dw
%dw 2.0
var known = ["id", "name"]
output application/json
---
{
  id: payload.id,
  name: payload.name,
  metadata: payload filterObject ((value, key) -> !(known contains key))
}
```
**Output**
```json
{"id":1,"name":"Ravi","metadata":{"city":"Hyd","tier":"GOLD"}}
```
**Explanation:** A known-field contract is separated from additional metadata.
**Common mistake:** Dropping new source fields unintentionally.
**Interview tip:** This pattern can help APIs evolve while keeping a stable top-level contract.

## DW-A84 — Mask sensitive account numbers
**Question:** Show only the last four digits of an account number.
**Input**
```json
{"account":"123456789012"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  account: "********" ++ (payload.account[-4 to -1])
}
```
**Output**
```json
{"account":"********9012"}
```
**Explanation:** Only the final four characters are exposed.
**Common mistake:** Returning the original sensitive value in another response field.
**Interview tip:** Data masking should be deliberate and applied before external output.

## DW-A85 — Build a validation result object
**Question:** Validate required customer fields and return all validation errors.
**Input**
```json
{"name":"","email":"bad-email","age":15}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  valid: payload.name != "" and (payload.email contains "@") and payload.age >= 18,
  errors: [
    if (payload.name == "") "NAME_REQUIRED" else null,
    if (!(payload.email contains "@")) "EMAIL_INVALID" else null,
    if (payload.age < 18) "AGE_INVALID" else null
  ] filter $ != null
}
```
**Output**
```json
{"valid":false,"errors":["NAME_REQUIRED","EMAIL_INVALID","AGE_INVALID"]}
```
**Explanation:** Each validation rule produces either an error code or null, and null entries are removed.
**Common mistake:** Stopping at the first validation error when all errors are required.
**Interview tip:** Error codes are easier for APIs to consume than free-form messages.

## DW-A86 — Create an error response from Mule attributes
**Question:** Build a stable HTTP error response from status, correlation ID, and message variables.
**Input**
```json
{"status":400,"correlationId":"abc-123","message":"Invalid request"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  error: {
    status: payload.status,
    correlationId: payload.correlationId,
    message: payload.message
  }
}
```
**Output**
```json
{"error":{"status":400,"correlationId":"abc-123","message":"Invalid request"}}
```
**Explanation:** The transformation creates a predictable error envelope for API consumers.
**Common mistake:** Returning internal exception details directly.
**Interview tip:** Production error responses should expose useful correlation information without leaking internals.

## DW-A87 — Calculate weighted average
**Question:** Calculate a weighted average price using quantity as the weight.
**Input**
```json
[{"price":100,"qty":2},{"price":200,"qty":1}]
```
**DataWeave**
```dw
%dw 2.0
var totalQty = sum(payload.qty)
output application/json
---
if (totalQty == 0) null else sum(payload map ($.price * $.qty)) / totalQty
```
**Output**
```json
133.33333333333334
```
**Explanation:** Weighted value is divided by total quantity rather than by record count.
**Common mistake:** Using a simple average when quantities differ.
**Interview tip:** Identify the denominator from the business definition of the metric.

## DW-A88 — Detect missing reference records
**Question:** Return order SKUs that do not exist in the product catalog.
**Input**
```json
{"catalog":[{"sku":"A"},{"sku":"B"}],"orders":[{"sku":"A"},{"sku":"C"}]}
```
**DataWeave**
```dw
%dw 2.0
var catalogSkus = payload.catalog map $.sku
output application/json
---
(payload.orders filter !(catalogSkus contains $.sku)) map $.sku
```
**Output**
```json
["C"]
```
**Explanation:** Orders are compared against a reference dataset and missing values are isolated.
**Common mistake:** Assuming reference data is complete.
**Interview tip:** Referential-integrity checks are valuable in integration pipelines.

## DW-A89 — Re-key nested customer records
**Question:** Convert customer records into an object keyed by customer ID, with selected fields as values.
**Input**
```json
[{"id":"C1","name":"A","tier":"GOLD"},{"id":"C2","name":"B","tier":"SILVER"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map ((c) -> {(c.id): {name: c.name, tier: c.tier}}) reduce ((x, acc = {}) -> acc ++ x)
```
**Output**
```json
{"C1":{"name":"A","tier":"GOLD"},"C2":{"name":"B","tier":"SILVER"}}
```
**Explanation:** Each customer becomes one dynamic-key object and all objects are merged.
**Common mistake:** Using the entire customer record when only selected fields are required.
**Interview tip:** Dynamic-key structures are useful for lookup-oriented downstream consumers.

## DW-A90 — Build a daily transaction summary
**Question:** Group transactions by date and return count, total, and failed count.
**Input**
```json
[{"date":"2026-09-16","status":"SUCCESS","amount":100},{"date":"2026-09-16","status":"FAILED","amount":20},{"date":"2026-09-17","status":"SUCCESS","amount":50}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.date) mapObject ((rows, date) -> {
  (date): {
    count: sizeOf(rows),
    total: sum(rows.amount),
    failed: sizeOf(rows filter $.status == "FAILED")
  }
})
```
**Output**
```json
{"2026-09-16":{"count":2,"total":120,"failed":1},"2026-09-17":{"count":1,"total":50,"failed":0}}
```
**Explanation:** Each date becomes a reporting bucket with multiple measures.
**Common mistake:** Counting failed transactions globally.
**Interview tip:** Keep all measures scoped to the same grouped dataset.

## DW-A91 — Normalize XML-like records into JSON
**Question:** Transform a collection of customer records into an API-friendly JSON array.
**Input**
```xml
<customers><customer><id>1</id><name>A</name></customer><customer><id>2</id><name>B</name></customer></customers>
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.customers.customer map {
  id: $.id as Number,
  name: $.name as String
}
```
**Output**
```json
[{"id":1,"name":"A"},{"id":2,"name":"B"}]
```
**Explanation:** XML elements are selected and explicitly typed into the JSON contract.
**Common mistake:** Assuming XML text nodes already have the desired JSON types.
**Interview tip:** XML-to-JSON mappings often require explicit casting.

## DW-A92 — Produce CSV with calculated columns
**Question:** Generate CSV rows containing subtotal and tax.
**Input**
```json
[{"sku":"A","qty":2,"price":100},{"sku":"B","qty":1,"price":50}]
```
**DataWeave**
```dw
%dw 2.0
output application/csv
---
payload map ((line) -> {
  sku: line.sku,
  quantity: line.qty,
  subtotal: line.qty * line.price,
  tax: line.qty * line.price * 0.18
})
```
**Output**
```text
sku,quantity,subtotal,tax
A,2,200,36
B,1,50,9
```
**Explanation:** Calculated fields are created before CSV serialization.
**Common mistake:** Expecting the CSV writer to calculate business values.
**Interview tip:** Transformation logic belongs before serialization.

## DW-A93 — Build a reusable typed calculation function
**Question:** Create a function that calculates discounted price from numeric inputs.
**Input**
```json
{"price":1000,"discount":15}
```
**DataWeave**
```dw
%dw 2.0
fun discounted(price: Number, percent: Number): Number = price * (1 - percent / 100)
output application/json
---
discounted(payload.price, payload.discount)
```
**Output**
```json
850
```
**Explanation:** The function documents expected input and output types while centralizing the formula.
**Common mistake:** Allowing textual numeric input into a function that expects Number.
**Interview tip:** Typed functions communicate business intent clearly.

## DW-A94 — Generate an idempotency fingerprint
**Question:** Build a stable string from selected request fields.
**Input**
```json
{"customer":"C1","amount":100,"currency":"INR"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.customer ++ "|" ++ (payload.amount as String) ++ "|" ++ payload.currency
```
**Output**
```json
"C1|100|INR"
```
**Explanation:** Selected business fields form a deterministic fingerprint candidate.
**Common mistake:** Including volatile timestamps when the fingerprint must remain stable.
**Interview tip:** Define exactly which fields constitute business identity.

## DW-A95 — Compare two customer snapshots
**Question:** Return customers whose tier changed between old and new snapshots.
**Input**
```json
{"old":[{"id":"C1","tier":"SILVER"},{"id":"C2","tier":"GOLD"}],"new":[{"id":"C1","tier":"GOLD"},{"id":"C2","tier":"GOLD"}]}
```
**DataWeave**
```dw
%dw 2.0
var oldById = payload.old map ((x) -> {(x.id): x.tier}) reduce ((x, acc = {}) -> acc ++ x)
---
payload.new filter ((x) -> (oldById[x.id] default null) != x.tier) map {
  id: $.id,
  oldTier: oldById[$.id] default null,
  newTier: $.tier
}
```
**Output**
```json
[{"id":"C1","oldTier":"SILVER","newTier":"GOLD"}]
```
**Explanation:** The old snapshot becomes a lookup and new records are compared against it.
**Common mistake:** Comparing arrays by position.
**Interview tip:** Snapshot comparison should use stable business identifiers.

## DW-A96 — Build a fraud-review candidate list
**Question:** Flag transactions that are high-value and from a new device.
**Input**
```json
[{"id":"T1","amount":5000,"newDevice":true},{"id":"T2","amount":500,"newDevice":true},{"id":"T3","amount":7000,"newDevice":false}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter ($.amount >= 5000 and $.newDevice) map {
  id: $.id,
  reason: "HIGH_VALUE_NEW_DEVICE"
}
```
**Output**
```json
[{"id":"T1","reason":"HIGH_VALUE_NEW_DEVICE"}]
```
**Explanation:** Multiple risk indicators are combined into a single deterministic screening rule.
**Common mistake:** Flagging every high-value transaction regardless of the second condition.
**Interview tip:** Keep screening rules explicit and independently testable.

## DW-A97 — Create a monthly account balance summary
**Question:** Calculate net movement per account from credits and debits.
**Input**
```json
[{"account":"A1","type":"CREDIT","amount":500},{"account":"A1","type":"DEBIT","amount":120},{"account":"A2","type":"CREDIT","amount":300}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.account) mapObject ((rows, account) -> {
  (account): sum(rows map ((r) -> if (r.type == "CREDIT") r.amount else -r.amount))
})
```
**Output**
```json
{"A1":380,"A2":300}
```
**Explanation:** Each account is aggregated after converting debits to negative movement.
**Common mistake:** Summing credits and debits without sign normalization.
**Interview tip:** Normalize transaction semantics before aggregation.

## DW-A98 — Handle optional nested API data
**Question:** Return a customer's city when available, otherwise `UNKNOWN`, without failing on a missing address.
**Input**
```json
{"id":"C1","profile":{"name":"Ravi"}}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  city: payload.profile.address.city default "UNKNOWN"
}
```
**Output**
```json
{"id":"C1","city":"UNKNOWN"}
```
**Explanation:** The nested selector is given a fallback for absent optional data.
**Common mistake:** Assuming optional objects always exist.
**Interview tip:** Defensive mappings are important for APIs with partial responses.

## DW-A99 — Build a production-ready transaction envelope
**Question:** Return transaction data, processing metadata, and a deterministic result status.
**Input**
```json
{"id":"T1","amount":100,"processed":true,"correlationId":"C-1"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  result: if (payload.processed) "SUCCESS" else "PENDING",
  transaction: {
    id: payload.id,
    amount: payload.amount
  },
  metadata: {
    correlationId: payload.correlationId
  }
}
```
**Output**
```json
{"result":"SUCCESS","transaction":{"id":"T1","amount":100},"metadata":{"correlationId":"C-1"}}
```
**Explanation:** Business data and operational metadata are separated into stable sections.
**Common mistake:** Mixing correlation information into transaction business fields.
**Interview tip:** Consistent envelopes help observability and downstream consumers.

## DW-A100 — Build a reusable API pagination function
**Question:** Create a function that wraps records with page metadata and returned count.
**Input**
```json
{"page":3,"size":2,"total":6,"records":[{"id":5},{"id":6}]}
```
**DataWeave**
```dw
%dw 2.0
fun pageResponse(page: Number, size: Number, total: Number, records: Array) = {
  page: page,
  pageSize: size,
  total: total,
  returned: sizeOf(records),
  data: records
}
output application/json
---
pageResponse(payload.page, payload.size, payload.total, payload.records)
```
**Output**
```json
{"page":3,"pageSize":2,"total":6,"returned":2,"data":[{"id":5},{"id":6}]}
```
**Explanation:** The pagination contract is encapsulated in a reusable function.
**Common mistake:** Repeating pagination response logic across APIs.
**Interview tip:** Reusable functions are especially valuable for standardized integration contracts.
