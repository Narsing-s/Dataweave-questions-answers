# Expansion — Advanced DataWeave Q&A

## DW-A61 — Multi-level customer order summary
**Question:** Group orders by customer and calculate count and total value.
**Input**
```json
[{"customer":"C1","amount":100},{"customer":"C1","amount":250},{"customer":"C2","amount":80}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.customer) mapObject ((orders, customer) -> {
  (customer): {
    count: sizeOf(orders),
    total: sum(orders.amount)
  }
})
```
**Output**
```json
{"C1":{"count":2,"total":350},"C2":{"count":1,"total":80}}
```
**Explanation:** The transformation combines grouping with per-group aggregation.
**Common mistake:** Calculating totals before grouping.
**Interview tip:** Describe the intermediate grouped object before the final `mapObject`.

## DW-A62 — Composite business-key deduplication
**Question:** Keep one record for each customer and date combination.
**Input**
```json
[{"customer":"C1","date":"2026-01-01","value":10},{"customer":"C1","date":"2026-01-01","value":20},{"customer":"C1","date":"2026-01-02","value":30}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
distinctBy payload, $.customer ++ "|" ++ $.date
```
**Output**
```json
[{"customer":"C1","date":"2026-01-01","value":10},{"customer":"C1","date":"2026-01-02","value":30}]
```
**Explanation:** A composite criterion models a multi-column business key.
**Common mistake:** Deduplicating on only one field.
**Interview tip:** Ask what should happen when duplicate records contain different values.

## DW-A63 — Nested grouping
**Question:** Group employees by department and then city.
**Input**
```json
[{"dept":"IT","city":"Hyd","name":"A"},{"dept":"IT","city":"Pune","name":"B"},{"dept":"HR","city":"Hyd","name":"C"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.dept) mapObject ((rows, dept) -> {
  (dept): rows groupBy $.city
})
```
**Output**
```json
{"IT":{"Hyd":[{"dept":"IT","city":"Hyd","name":"A"}],"Pune":[{"dept":"IT","city":"Pune","name":"B"}]},"HR":{"Hyd":[{"dept":"HR","city":"Hyd","name":"C"}]}}
```
**Explanation:** The result of the first grouping is transformed into a second grouping for each department.
**Common mistake:** Applying the second `groupBy` to the original payload.
**Interview tip:** Nested grouping is common in reporting and hierarchical APIs.

## DW-A64 — Dynamic API response keys
**Question:** Create an object where each status becomes a dynamic key containing its count.
**Input**
```json
[{"status":"OPEN"},{"status":"OPEN"},{"status":"CLOSED"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.status) mapObject ((rows, status) -> {(status): sizeOf(rows)})
```
**Output**
```json
{"OPEN":2,"CLOSED":1}
```
**Explanation:** Dynamic object keys are generated from runtime values.
**Common mistake:** Writing a literal `status` key instead of `(status)`.
**Interview tip:** Parentheses around dynamic keys are important in DataWeave object construction.

## DW-A65 — Parent-child order expansion
**Question:** Produce one output row per order item while retaining customer and order context.
**Input**
```json
{"customerId":"C1","orders":[{"id":"O1","items":[{"sku":"A","qty":2},{"sku":"B","qty":1}]}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.orders flatMap ((order) -> order.items map {
  customerId: payload.customerId,
  orderId: order.id,
  sku: $.sku,
  quantity: $.qty
})
```
**Output**
```json
[{"customerId":"C1","orderId":"O1","sku":"A","quantity":2},{"customerId":"C1","orderId":"O1","sku":"B","quantity":1}]
```
**Explanation:** Parent context is captured while the child collection is expanded.
**Common mistake:** Losing root-level customer context inside the child mapper.
**Interview tip:** Track the scope of `$` carefully in nested lambdas.

## DW-A66 — Conditional aggregation
**Question:** Calculate only successful transaction totals by currency.
**Input**
```json
[{"status":"SUCCESS","currency":"INR","amount":100},{"status":"FAILED","currency":"INR","amount":50},{"status":"SUCCESS","currency":"USD","amount":20}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload filter $.status == "SUCCESS" groupBy $.currency)
  mapObject ((rows, currency) -> {(currency): sum(rows.amount)})
```
**Output**
```json
{"INR":100,"USD":20}
```
**Explanation:** Filtering first prevents failed transactions from entering the aggregation.
**Common mistake:** Grouping all transactions and filtering after totals are calculated.
**Interview tip:** Order transformations according to business semantics, not just code brevity.

## DW-A67 — Convert an object to indexed entries
**Question:** Return object entries with explicit index, key and value.
**Input**
```json
{"A":10,"B":20}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload mapObject ((value, key, index) -> {
  index: index,
  key: key,
  value: value
}) pluck $
```
**Output**
```json
[{"index":0,"key":"A","value":10},{"index":1,"key":"B","value":20}]
```
**Explanation:** `mapObject` builds an object for each entry and `pluck` converts the resulting object into an array.
**Common mistake:** Expecting `mapObject` itself to return an array.
**Interview tip:** Know when to use `mapObject` versus `pluck`.

## DW-A68 — Remove sensitive fields recursively at a known level
**Question:** Remove `token` from every account object.
**Input**
```json
{"accounts":[{"id":1,"token":"a","name":"A"},{"id":2,"token":"b","name":"B"}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  accounts: payload.accounts map ($ - "token")
}
```
**Output**
```json
{"accounts":[{"id":1,"name":"A"},{"id":2,"name":"B"}]}
```
**Explanation:** The subtraction operation is applied independently to each account.
**Common mistake:** Removing the field only from the root object.
**Interview tip:** Clarify whether sensitive fields can occur at deeper nesting levels.

## DW-A69 — Create a stable API envelope
**Question:** Return data, count and a generated status field.
**Input**
```json
[{"id":1},{"id":2}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  status: "success",
  count: sizeOf(payload),
  data: payload
}
```
**Output**
```json
{"status":"success","count":2,"data":[{"id":1},{"id":2}]}
```
**Explanation:** The source collection is wrapped in a consistent response contract.
**Common mistake:** Returning metadata at inconsistent nesting levels across APIs.
**Interview tip:** Stable response envelopes simplify downstream integration contracts.

## DW-A70 — Use match for business classification
**Question:** Classify payments into debit, credit or unknown.
**Input**
```json
[{"type":"PAY","amount":100},{"type":"REFUND","amount":20},{"type":"OTHER","amount":5}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map ((p) -> {
  amount: p.amount,
  category: p.type match {
    case "PAY" -> "debit"
    case "REFUND" -> "credit"
    else -> "unknown"
  }
})
```
**Output**
```json
[{"amount":100,"category":"debit"},{"amount":20,"category":"credit"},{"amount":5,"category":"unknown"}]
```
**Explanation:** `match` expresses multiple mutually exclusive classification rules clearly.
**Common mistake:** Omitting an `else` branch when unknown values are possible.
**Interview tip:** Mention how the default branch protects the target contract.

## DW-A71 — Build a reusable normalization function
**Question:** Create a function that trims and lowercases email addresses.
**Input**
```json
[" A@EXAMPLE.COM ","B@example.com"]
```
**DataWeave**
```dw
%dw 2.0
output application/json
fun normalizeEmail(value) = lower(trim(value))
---
payload map normalizeEmail($)
```
**Output**
```json
["a@example.com","b@example.com"]
```
**Explanation:** The normalization rule is centralized in a reusable function.
**Common mistake:** Duplicating the same expression throughout the transformation.
**Interview tip:** Use functions when a business rule is repeated or independently testable.

## DW-A72 — Calculate line-item totals
**Question:** Calculate an invoice total from quantity, price and discount percentage.
**Input**
```json
[{"qty":2,"price":100,"discount":10},{"qty":1,"price":50,"discount":0}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
sum(payload map ((line) -> line.qty * line.price * (1 - line.discount / 100)))
```
**Output**
```json
230
```
**Explanation:** Each line is calculated first and the resulting values are aggregated.
**Common mistake:** Applying the discount once to the entire invoice when discounts are line-specific.
**Interview tip:** Break financial calculations into explicit stages for auditability.

## DW-A73 — Date conversion
**Question:** Convert an ISO date string to `MM/dd/yyyy` text.
**Input**
```json
{"date":"2026-09-16"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.date as Date {format: "MM/dd/yyyy"}
```
**Output**
```json
"09/16/2026"
```
**Explanation:** The source text is interpreted using the supplied date format.
**Common mistake:** Using a format that does not match the actual source string.
**Interview tip:** Distinguish parsing format from output serialization requirements.

## DW-A74 — Date interval calculation
**Question:** Calculate days between two dates.
**Input**
```json
{"start":"2026-09-01","end":"2026-09-16"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
daysBetween(payload.start as Date, payload.end as Date)
```
**Output**
```json
15
```
**Explanation:** Both strings are converted to dates before calculating the interval.
**Common mistake:** Comparing strings lexically instead of converting them to dates.
**Interview tip:** Clarify whether the business rule is inclusive or exclusive of endpoints.

## DW-A75 — Produce CSV from a nested API response
**Question:** Flatten customer address fields into CSV columns.
**Input**
```json
{"customers":[{"id":1,"name":"A","address":{"city":"Hyd","zip":"500001"}},{"id":2,"name":"B","address":{"city":"Pune","zip":"411001"}}]}
```
**DataWeave**
```dw
%dw 2.0
output application/csv
---
payload.customers map {
  id: $.id,
  name: $.name,
  city: $.address.city,
  zip: $.address.zip
}
```
**Output**
```text
id,name,city,zip
1,A,Hyd,500001
2,B,Pune,411001
```
**Explanation:** Nested fields are explicitly flattened into a tabular contract.
**Common mistake:** Sending nested objects directly into CSV.
**Interview tip:** Define CSV columns explicitly when integrating with legacy systems.
