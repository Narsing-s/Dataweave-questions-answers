# Advanced DataWeave Q&A — DW-A176 to DW-A200

## DW-A176 — Reconcile two transaction snapshots
**Question:** Return transaction IDs whose amount changed between old and new snapshots.
**Input** `old=[{"id":"T1","amount":100},{"id":"T2","amount":200}]`, `new=[{"id":"T1","amount":125},{"id":"T2","amount":200}]`
**DataWeave**
```dw
%dw 2.0
output application/json
var old = [{id: "T1", amount: 100}, {id: "T2", amount: 200}]
var new = [{id: "T1", amount: 125}, {id: "T2", amount: 200}]
var oldIndex = (old map ((item) -> {(item.id): item})) reduce ((item, acc = {}) -> acc ++ item)
---
new filter ((item) -> oldIndex[item.id] != null and oldIndex[item.id].amount != item.amount) map $.id
```
**Output** `["T1"]`
**Explanation:** The old snapshot is indexed by ID so each new transaction can be compared directly.
**Common mistake:** Comparing records by array position.
**Interview tip:** Indexing is usually clearer than nested scans for reconciliation logic.

## DW-A177 — Identify new and removed records in one response
**Question:** Produce both added and removed customer IDs between snapshots.
**Input** `current=["C1","C3"]`, `previous=["C1","C2"]`
**DataWeave**
```dw
%dw 2.0
output application/json
var current = ["C1", "C3"]
var previous = ["C1", "C2"]
---
{
  added: current filter ((id) -> !(previous contains id)),
  removed: previous filter ((id) -> !(current contains id))
}
```
**Output** `{"added":["C3"],"removed":["C2"]}`
**Explanation:** Each direction of set comparison answers a different reconciliation question.
**Common mistake:** Returning only one side of the difference.
**Interview tip:** Name snapshot direction explicitly in reconciliation code.

## DW-A178 — Detect duplicate business keys
**Question:** Return customer IDs that occur more than once.
**Input** `[{"id":"C1"},{"id":"C2"},{"id":"C1"},{"id":"C3"},{"id":"C2"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.id)
  pluck ((items, id) -> {id: id, count: sizeOf(items)})
  filter $.count > 1
  map $.id
```
**Output** `["C1","C2"]`
**Explanation:** Grouping exposes frequency per business key, allowing duplicate detection.
**Common mistake:** Using `distinctBy` because it removes duplicates instead of identifying them.
**Interview tip:** Distinguish deduplication from data-quality detection.

## DW-A179 — Produce duplicate records with counts
**Question:** Return each duplicated product code and its occurrence count.
**Input** `["P1","P2","P1","P3","P2","P2"]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $)
  pluck ((items, code) -> {code: code, count: sizeOf(items)})
  filter $.count > 1
```
**Output** `[{"code":"P1","count":2},{"code":"P2","count":3}]`
**Explanation:** Grouping by the value creates frequency buckets, which are then filtered to duplicates.
**Common mistake:** Returning the duplicated values without explaining frequency.
**Interview tip:** Frequency summaries are useful for data-quality reports.

## DW-A180 — Build an indexed lookup for nested enrichment
**Question:** Enrich orders with customer names without scanning the customer array for every order.
**Input** `customers=[{"id":"C1","name":"Ravi"},{"id":"C2","name":"Asha"}]`, `orders=[{"id":"O1","customerId":"C2"},{"id":"O2","customerId":"C1"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
var customers = [{id: "C1", name: "Ravi"}, {id: "C2", name: "Asha"}]
var orders = [{id: "O1", customerId: "C2"}, {id: "O2", customerId: "C1"}]
var customerIndex = (customers map ((c) -> {(c.id): c})) reduce ((item, acc = {}) -> acc ++ item)
---
orders map ((order) -> order ++ {customerName: customerIndex[order.customerId].name default "Unknown"})
```
**Output** `[{"id":"O1","customerId":"C2","customerName":"Asha"},{"id":"O2","customerId":"C1","customerName":"Ravi"}]`
**Explanation:** A lookup index makes the enrichment expression direct and readable.
**Common mistake:** Failing to define behavior for an unknown customer ID.
**Interview tip:** Discuss indexing when lookup collections are reused many times.

## DW-A181 — Aggregate by two business dimensions
**Question:** Calculate total sales by region and product category.
**Input** `[{"region":"APAC","category":"A","amount":100},{"region":"APAC","category":"B","amount":50},{"region":"EU","category":"A","amount":75}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload groupBy $.region mapObject ((regionItems, region) -> {
  (region): regionItems groupBy $.category mapObject ((categoryItems, category) -> {
    (category): sum(categoryItems.amount)
  })
})
```
**Output** `{"APAC":{"A":100,"B":50},"EU":{"A":75}}`
**Explanation:** Nested `groupBy` operations create a two-dimensional aggregate.
**Common mistake:** Grouping by only one dimension and losing the second grouping key.
**Interview tip:** Use nested grouping when the target contract genuinely has hierarchical dimensions.

## DW-A182 — Calculate a weighted average
**Question:** Calculate the weighted average score using each item's weight.
**Input** `[{"score":80,"weight":1},{"score":90,"weight":2}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
var weightedTotal = sum(payload map ($.score * $.weight))
var totalWeight = sum(payload map $.weight)
---
weightedTotal / totalWeight
```
**Output** `86.66666666666667`
**Explanation:** A weighted average divides the sum of weighted values by total weight.
**Common mistake:** Using a simple average when weights differ.
**Interview tip:** Define behavior when total weight is zero before production use.

## DW-A183 — Round a financial result
**Question:** Calculate tax and round it to two decimal places.
**Input** `{"amount":123.456,"rate":0.18}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
round(payload.amount * payload.rate * 100) / 100
```
**Output** `22.22`
**Explanation:** Multiplying by 100, rounding, and dividing by 100 produces a two-decimal numeric result.
**Common mistake:** Assuming all financial rounding rules are identical.
**Interview tip:** State the required rounding mode and precision for financial contracts.

## DW-A184 — Apply a tiered fee
**Question:** Apply a 1 percent fee up to 10,000 and 0.5 percent above 10,000.
**Input** `{"amount":20000}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.amount <= 10000)
  payload.amount * 0.01
else
  (10000 * 0.01) + ((payload.amount - 10000) * 0.005)
```
**Output** `150`
**Explanation:** The calculation applies the first tier completely and the second rate only to the excess.
**Common mistake:** Applying the lower rate to the entire amount.
**Interview tip:** Test values exactly at each threshold and just above it.

## DW-A185 — Mask sensitive account numbers
**Question:** Keep only the last four digits of an account number and mask the rest.
**Input** `{"account":"123456789012"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  masked: repeat("*", sizeOf(payload.account) - 4) ++ payload.account[-4 to -1]
}
```
**Output** `{"masked":"********9012"}`
**Explanation:** The prefix is replaced with masking characters while the final four digits remain visible.
**Common mistake:** Exposing more digits than the policy allows.
**Interview tip:** Define behavior for short or malformed account numbers.

## DW-A186 — Build an idempotency fingerprint from stable fields
**Question:** Produce a deterministic text fingerprint from transaction ID and amount.
**Input** `{"transactionId":"T100","amount":250}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload.transactionId ++ "|" ++ (payload.amount as String))
```
**Output** `"T100|250"`
**Explanation:** Stable business fields are combined into a deterministic identifier string.
**Common mistake:** Calling this a cryptographic hash.
**Interview tip:** A production idempotency key should use a documented uniqueness strategy appropriate to the system.

## DW-A187 — Create a canonical field order for audit data
**Question:** Produce a stable JSON-compatible audit projection from a larger event.
**Input** `{"extra":"x","id":"E1","status":"SUCCESS","source":"API"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  source: payload.source,
  status: payload.status
}
```
**Output** `{"id":"E1","source":"API","status":"SUCCESS"}`
**Explanation:** An explicit projection creates a stable audit contract and excludes unrelated fields.
**Common mistake:** Persisting every source field without defining an audit schema.
**Interview tip:** Stable projections make downstream audit processing easier.

## DW-A188 — Normalize polymorphic scalar input
**Question:** Accept either one customer ID or an array of IDs and always return an array.
**Input** `{"customerIds":"C1"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.customerIds is Array)
  payload.customerIds
else
  [payload.customerIds]
```
**Output** `["C1"]`
**Explanation:** The transformation normalizes two accepted input shapes into one internal shape.
**Common mistake:** Mapping directly and assuming the source is always an array.
**Interview tip:** Normalize polymorphic inputs early in a transformation.

## DW-A189 — Normalize a polymorphic record collection
**Question:** Accept either one order object or an order array and return an array of orders.
**Input** `{"orders":{"id":"O1","amount":100}}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (payload.orders is Array)
  payload.orders
else
  [payload.orders]
```
**Output** `[{"id":"O1","amount":100}]`
**Explanation:** Both supported source shapes become a consistent collection.
**Common mistake:** Wrapping an array again and creating a nested array.
**Interview tip:** Type checks should reflect an explicitly supported contract, not hide arbitrary malformed input.

## DW-A190 — Use pattern matching for status mapping
**Question:** Map transaction statuses to response categories.
**Input** `{"status":"PENDING"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.status match {
  case "SUCCESS" -> "COMPLETED"
  case "PENDING" -> "IN_PROGRESS"
  case "FAILED" -> "ERROR"
  else -> "UNKNOWN"
}
```
**Output** `"IN_PROGRESS"`
**Explanation:** `match` expresses mutually exclusive status mapping rules clearly.
**Common mistake:** Forgetting an `else` branch for unexpected statuses.
**Interview tip:** Pattern matching can make larger conditional mappings easier to review.

## DW-A191 — Extract regex matches
**Question:** Extract all account-like numeric tokens from a text string.
**Input** `{"text":"Accounts 123456 and 987654 were processed."}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
scan(payload.text, /\b\d{6}\b/) map $[0]
```
**Output** `["123456","987654"]`
**Explanation:** `scan` returns regex match records and `$[0]` selects the full matched text.
**Common mistake:** Confusing `scan` with a Boolean regex test.
**Interview tip:** Use regex carefully for validation and extraction, especially with sensitive data.

## DW-A192 — Validate an identifier with regex
**Question:** Check whether a value is exactly three uppercase letters followed by four digits.
**Input** `{"code":"ABC1234"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.code matches /^[A-Z]{3}\d{4}$/
```
**Output** `true`
**Explanation:** `matches` evaluates whether the entire string conforms to the supplied regular expression.
**Common mistake:** Writing a regex that can match only a substring.
**Interview tip:** Anchors such as `^` and `$` matter for full-value validation.

## DW-A193 — Parse a date and format it
**Question:** Convert an ISO date into `dd/MM/yyyy` text.
**Input** `{"date":"2026-09-16"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload.date as Date) as String {format: "dd/MM/yyyy"}
```
**Output** `"16/09/2026"`
**Explanation:** The source string is explicitly parsed as a Date and then formatted as text.
**Common mistake:** Treating a date string as if it were already a Date value.
**Interview tip:** Keep parsing and presentation formatting as separate steps.

## DW-A194 — Calculate an expiry date
**Question:** Add 30 days to a supplied date.
**Input** `{"startDate":"2026-09-16"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload.startDate as Date) + |P30D|
```
**Output** `"2026-10-16"`
**Explanation:** A Date value can be shifted using a Period duration.
**Common mistake:** Adding the number 30 without considering the Date type.
**Interview tip:** Use Date/Period types for calendar calculations rather than string manipulation.

## DW-A195 — Convert DateTime between time zones
**Question:** Convert a UTC timestamp to an Asia/Kolkata timestamp.
**Input** `{"timestamp":"2026-09-16T10:00:00Z"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload.timestamp as DateTime) >> "Asia/Kolkata"
```
**Output** `"2026-09-16T15:30:00+05:30"`
**Explanation:** The shift operator converts the DateTime representation to the requested time zone.
**Common mistake:** Manually adding hours without considering timezone rules.
**Interview tip:** Preserve the instant and change the representation rather than modifying text manually.

## DW-A196 — Transform XML with namespaces
**Question:** Read a namespaced XML customer element and produce JSON.
**Input**
```xml
<ns:customer xmlns:ns="urn:customer"><ns:id>C1</ns:id><ns:name>Ravi</ns:name></ns:customer>
```
**DataWeave**
```dw
%dw 2.0
output application/json
ns ns "urn:customer"
---
{
  id: payload.ns#customer.ns#id,
  name: payload.ns#customer.ns#name
}
```
**Output** `{"id":"C1","name":"Ravi"}`
**Explanation:** The namespace declaration allows qualified XML selectors to target the correct elements.
**Common mistake:** Ignoring the namespace and using an unqualified selector.
**Interview tip:** XML namespace handling is a frequent integration challenge.

## DW-A197 — Create CSV with a controlled header
**Question:** Convert customer records into CSV using a stable column order.
**Input** `[{"id":"C1","name":"Ravi","status":"ACTIVE"},{"id":"C2","name":"Asha","status":"BLOCKED"}]`
**DataWeave**
```dw
%dw 2.0
output application/csv header=true
---
payload map {
  customer_id: $.id,
  customer_name: $.name,
  customer_status: $.status
}
```
**Output**
```csv
customer_id,customer_name,customer_status
C1,Ravi,ACTIVE
C2,Asha,BLOCKED
```
**Explanation:** Explicit mapping controls the output column names and their order.
**Common mistake:** Passing source objects directly when the CSV contract uses different headers.
**Interview tip:** CSV transformations should define headers explicitly when downstream contracts depend on them.

## DW-A198 — Build an HTTP-style response contract
**Question:** Create a response object with status, correlation ID and data.
**Input** `{"correlationId":"abc-123","customer":{"id":"C1"}}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  status: 200,
  correlationId: payload.correlationId,
  data: payload.customer
}
```
**Output** `{"status":200,"correlationId":"abc-123","data":{"id":"C1"}}`
**Explanation:** The transformation separates transport metadata from the business data.
**Common mistake:** Embedding correlation metadata inside the customer record.
**Interview tip:** Correlation IDs are useful for tracing distributed integration flows.

## DW-A199 — Create a deterministic reconciliation result
**Question:** Return counts for matched, changed and new records between two transaction snapshots.
**Input** `old=[{"id":"T1","amount":100},{"id":"T2","amount":200}]`, `new=[{"id":"T1","amount":100},{"id":"T2","amount":250},{"id":"T3","amount":50}]`
**DataWeave**
```dw
%dw 2.0
output application/json
var old = [{id: "T1", amount: 100}, {id: "T2", amount: 200}]
var new = [{id: "T1", amount: 100}, {id: "T2", amount: 250}, {id: "T3", amount: 50}]
var oldIndex = (old map ((item) -> {(item.id): item})) reduce ((item, acc = {}) -> acc ++ item)
---
{
  matched: sizeOf(new filter ((item) -> oldIndex[item.id] != null and oldIndex[item.id].amount == item.amount)),
  changed: sizeOf(new filter ((item) -> oldIndex[item.id] != null and oldIndex[item.id].amount != item.amount)),
  new: sizeOf(new filter ((item) -> oldIndex[item.id] == null))
}
```
**Output** `{"matched":1,"changed":1,"new":1}`
**Explanation:** An indexed old snapshot lets each new record be classified without nested scans.
**Common mistake:** Treating a changed record as both new and changed.
**Interview tip:** Define mutually exclusive reconciliation categories before implementing them.

## DW-A200 — Build a production-style validation envelope
**Question:** Return field-level validation errors for a customer payload while keeping the response contract stable.
**Input** `{"name":"","email":"bad-email"}`
**DataWeave**
```dw
%dw 2.0
output application/json
var errors = []
  ++ (if (isBlank(payload.name default "")) [{field: "name", code: "REQUIRED", message: "Name is required"}] else [])
  ++ (if (!((payload.email default "") matches /^[^@\s]+@[^@\s]+\.[^@\s]+$/)) [{field: "email", code: "INVALID", message: "Email format is invalid"}] else [])
---
{
  valid: isEmpty(errors),
  errors: errors
}
```
**Output** `{"valid":false,"errors":[{"field":"name","code":"REQUIRED","message":"Name is required"},{"field":"email","code":"INVALID","message":"Email format is invalid"}]}`
**Explanation:** Independent validation rules build a deterministic field-level error list and expose it through one stable envelope.
**Common mistake:** Stopping at the first validation failure when consumers need all field errors.
**Interview tip:** Separate validation rule construction from the response contract so additional rules can be added safely.
