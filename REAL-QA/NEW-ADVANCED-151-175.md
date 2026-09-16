# Advanced DataWeave Q&A — DW-A151 to DW-A175

## DW-A151 — Reconcile records with missing and mismatched data
**Question:** Report expected records that are missing from actual data or have a different amount.
**Input** `{"expected":[{"id":"A","amount":100},{"id":"B","amount":200}],"actual":[{"id":"A","amount":110}]}`
**DataWeave**
```dw
%dw 2.0
var actualById = payload.actual reduce ((x, acc = {}) -> acc ++ {(x.id): x})
output application/json
---
payload.expected map ((x) -> {
  id: x.id,
  status: if (!(actualById[x.id] default null)) "MISSING" else if (actualById[x.id].amount != x.amount) "MISMATCH" else "MATCH"
})
```
**Output** `[{"id":"A","status":"MISMATCH"},{"id":"B","status":"MISSING"}]`
**Explanation:** An index allows one transformation to distinguish missing and mismatched records.
**Common mistake:** Treating missing and mismatched as the same exception.
**Interview tip:** Reconciliation status should be explicit and deterministic.

## DW-A152 — Detect duplicate records with conflicting payloads
**Question:** Identify business IDs that map to more than one distinct amount.
**Input** `[{"id":"T1","amount":100},{"id":"T1","amount":100},{"id":"T1","amount":120},{"id":"T2","amount":50}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.id)
  filterObject ((rows, id) -> sizeOf(rows map $.amount distinctBy $) > 1)
  pluck ((rows, id) -> {id: id, amounts: rows map $.amount distinctBy $})
```
**Output** `[{"id":"T1","amounts":[100,120]}]`
**Explanation:** Repeated identical records are not considered conflicting; distinct values indicate a conflict.
**Common mistake:** Treating any duplicate ID as a data conflict.
**Interview tip:** Define the fields that constitute a conflict.

## DW-A153 — Build a multi-level reconciliation report
**Question:** Group reconciliation results by status and count each category.
**Input** `[{"id":"A","status":"MATCH"},{"id":"B","status":"MISMATCH"},{"id":"C","status":"MISSING"},{"id":"D","status":"MISMATCH"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.status) mapObject ((rows, status) -> {(status): sizeOf(rows)})
```
**Output** `{"MATCH":1,"MISMATCH":2,"MISSING":1}`
**Explanation:** Reconciliation results can be summarized dynamically without hard-coded status keys.
**Common mistake:** Counting only failures and losing the complete picture.
**Interview tip:** A summary plus detailed exceptions is often useful operationally.

## DW-A154 — Enrich a batch using reference data
**Question:** Add customer segment to every order using a customer reference list.
**Input** `{"orders":[{"id":"O1","customerId":"C1"}],"customers":[{"id":"C1","segment":"GOLD"}]}`
**DataWeave**
```dw
%dw 2.0
var customerById = payload.customers reduce ((c, acc = {}) -> acc ++ {(c.id): c})
output application/json
---
payload.orders map ((order) -> order ++ {segment: customerById[order.customerId].segment default "UNKNOWN"})
```
**Output** `[{"id":"O1","customerId":"C1","segment":"GOLD"}]`
**Explanation:** Reference data is indexed once and then used for each order.
**Common mistake:** Rebuilding the lookup inside the mapping expression.
**Interview tip:** Define lookup lifetime and memory considerations for large reference sets.

## DW-A155 — Create a reusable normalization module function
**Question:** Define a reusable function that normalizes optional email input.
**Input** `{"email":"  USER@EXAMPLE.COM "}`
**DataWeave**
```dw
%dw 2.0
fun normalizeEmail(value: String | Null): String | Null = if (value == null) null else lower(trim(value))
output application/json
---
normalizeEmail(payload.email)
```
**Output** `"user@example.com"`
**Explanation:** The function explicitly accepts null and String values.
**Common mistake:** Declaring only String when the source may legitimately contain null.
**Interview tip:** Typed reusable functions make shared transformations easier to maintain.

## DW-A156 — Normalize polymorphic batch input
**Question:** Accept a single object or array and process both through one batch transformation.
**Input** `{"id":"C1","name":"Ravi"}`
**DataWeave**
```dw
%dw 2.0
var records = if (payload is Array) payload else [payload]
output application/json
---
records map {id: $.id, name: trim($.name)}
```
**Output** `[{"id":"C1","name":"Ravi"}]`
**Explanation:** The source is normalized to one collection shape before transformation.
**Common mistake:** Maintaining two separate mapping branches for equivalent business logic.
**Interview tip:** Shape normalization early reduces downstream complexity.

## DW-A157 — Preserve unknown extension fields safely
**Question:** Preserve only source keys beginning with `x-` while mapping a stable response.
**Input** `{"id":"C1","name":"Ravi","x-source":"CRM","secret":"x"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  name: payload.name,
  extensions: payload filterObject ((value, key) -> startsWith(key as String, "x-"))
}
```
**Output** `{"id":"C1","name":"Ravi","extensions":{"x-source":"CRM"}}`
**Explanation:** A controlled key namespace allows extension data without exposing arbitrary fields.
**Common mistake:** Copying the entire source object for convenience.
**Interview tip:** Explicit allow-listing is safer than unrestricted pass-through.

## DW-A158 — Generate a deterministic idempotency key
**Question:** Build a stable business key from tenant, operation, and transaction ID.
**Input** `{"tenant":"TEN1","operation":"CREATE","transaction":"T100"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
upper(payload.tenant) ++ "|" ++ upper(payload.operation) ++ "|" ++ payload.transaction
```
**Output** `"TEN1|CREATE|T100"`
**Explanation:** The key is based only on fields that define business identity.
**Common mistake:** Including volatile timestamps.
**Interview tip:** A deterministic key is useful for idempotency, but uniqueness depends on the chosen business fields.

## DW-A159 — Calculate a weighted average by group
**Question:** Calculate weighted score per category using quantity as the weight.
**Input** `[{"category":"A","score":80,"qty":2},{"category":"A","score":100,"qty":3},{"category":"B","score":60,"qty":1}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.category) mapObject ((rows, category) -> {(category): if (sum(rows.qty) == 0) null else sum(rows map ($.score * $.qty)) / sum(rows.qty)})
```
**Output** `{"A":92,"B":60}`
**Explanation:** Each category has its own weighted calculation.
**Common mistake:** Calculating one global weighted average.
**Interview tip:** Guard against a zero total weight.

## DW-A160 — Build a daily operational dashboard object
**Question:** Produce count, success count, failure count, and total amount per day.
**Input** `[{"date":"2026-09-16","status":"SUCCESS","amount":100},{"date":"2026-09-16","status":"FAIL","amount":20}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.date) mapObject ((rows, date) -> {
  (date): {
    count: sizeOf(rows),
    success: sizeOf(rows filter $.status == "SUCCESS"),
    failure: sizeOf(rows filter $.status == "FAIL"),
    amount: sum(rows.amount)
  }
})
```
**Output** `{"2026-09-16":{"count":2,"success":1,"failure":1,"amount":120}}`
**Explanation:** Multiple operational metrics are calculated per day.
**Common mistake:** Mixing metrics across dates.
**Interview tip:** This pattern can feed operational reporting APIs.

## DW-A161 — Detect missing child records
**Question:** Return customers that have no accounts.
**Input** `[{"id":"C1","accounts":[{"id":"A1"}]},{"id":"C2","accounts":[]},{"id":"C3"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter (isEmpty($.accounts default [])) map $.id
```
**Output** `["C2","C3"]`
**Explanation:** Missing and empty account collections are normalized to an empty array.
**Common mistake:** Checking only `accounts == []`, which misses absent fields.
**Interview tip:** Missing versus empty collections often need the same business treatment.

## DW-A162 — Create an exception object for missing references
**Question:** Report orders whose product reference is absent.
**Input** `{"orders":[{"id":"O1","productId":"P1"},{"id":"O2","productId":"P9"}],"products":[{"id":"P1"}]}`
**DataWeave**
```dw
%dw 2.0
var productIds = payload.products map $.id
output application/json
---
payload.orders filter !(productIds contains $.productId) map {
  orderId: $.id,
  productId: $.productId,
  error: "PRODUCT_NOT_FOUND"
}
```
**Output** `[{"orderId":"O2","productId":"P9","error":"PRODUCT_NOT_FOUND"}]`
**Explanation:** The transformation turns a reference mismatch into a structured exception record.
**Common mistake:** Silently dropping the invalid order.
**Interview tip:** Integration flows often need explicit exception records for downstream review.

## DW-A163 — Compare customer snapshots
**Question:** Return customers whose status changed between old and new snapshots.
**Input** `{"old":[{"id":"C1","status":"ACTIVE"},{"id":"C2","status":"ACTIVE"}],"new":[{"id":"C1","status":"BLOCKED"},{"id":"C2","status":"ACTIVE"}]}`
**DataWeave**
```dw
%dw 2.0
var oldById = payload.old reduce ((x, acc = {}) -> acc ++ {(x.id): x})
output application/json
---
payload.new filter ((x) -> (oldById[x.id].status default null) != x.status) map ((x) -> {
  id: x.id,
  oldStatus: oldById[x.id].status default null,
  newStatus: x.status
})
```
**Output** `[{"id":"C1","oldStatus":"ACTIVE","newStatus":"BLOCKED"}]`
**Explanation:** The old snapshot is indexed for direct comparison with new records.
**Common mistake:** Comparing arrays by position instead of business ID.
**Interview tip:** Snapshot comparison should use stable business identity.

## DW-A164 — Build a change audit list
**Question:** Create an audit entry for each changed customer status.
**Input** `{"old":[{"id":"C1","status":"ACTIVE"}],"new":[{"id":"C1","status":"BLOCKED"}]}`
**DataWeave**
```dw
%dw 2.0
var oldById = payload.old reduce ((x, acc = {}) -> acc ++ {(x.id): x})
output application/json
---
payload.new filter ((x) -> (oldById[x.id].status default null) != x.status) map ((x) -> {
  entityId: x.id,
  event: "STATUS_CHANGED",
  from: oldById[x.id].status default null,
  to: x.status
})
```
**Output** `[{"entityId":"C1","event":"STATUS_CHANGED","from":"ACTIVE","to":"BLOCKED"}]`
**Explanation:** Snapshot differences are converted into explicit audit events.
**Common mistake:** Recording only the new value.
**Interview tip:** Change records should make the before/after state clear.

## DW-A165 — Build a nested customer-account index
**Question:** Create an object keyed by customer ID where each value is an account lookup.
**Input** `[{"id":"C1","accounts":[{"id":"A1","type":"SAVINGS"},{"id":"A2","type":"CURRENT"}]}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((customer, acc = {}) -> acc ++ {
  (customer.id): customer.accounts reduce ((account, a = {}) -> a ++ {(account.id): account})
})
```
**Output** `{"C1":{"A1":{"id":"A1","type":"SAVINGS"},"A2":{"id":"A2","type":"CURRENT"}}}`
**Explanation:** Two reductions build a two-level lookup structure.
**Common mistake:** Creating one global account index when customer-scoped identity is required.
**Interview tip:** Nested indexes are useful when lookup identity has multiple scopes.

## DW-A166 — Calculate account balance movement
**Question:** Calculate net movement for each account from credits and debits.
**Input** `[{"account":"A1","type":"CREDIT","amount":500},{"account":"A1","type":"DEBIT","amount":120}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.account) mapObject ((rows, account) -> {
  (account): sum((rows filter $.type == "CREDIT").amount default []) - sum((rows filter $.type == "DEBIT").amount default [])
})
```
**Output** `{"A1":380}`
**Explanation:** Credit and debit totals are calculated separately and combined using the chosen sign convention.
**Common mistake:** Treating debit as a positive contribution.
**Interview tip:** Financial transformations require an explicit sign convention.

## DW-A167 — Create a settlement status
**Question:** Mark a settlement `SETTLED` only when expected and actual amounts match and the reference exists.
**Input** `{"expected":100,"actual":100,"reference":"SET1"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  status: if (!isBlank(payload.reference) and payload.expected == payload.actual) "SETTLED" else "EXCEPTION"
}
```
**Output** `{"status":"SETTLED"}`
**Explanation:** Multiple settlement conditions are evaluated together.
**Common mistake:** Checking the amount only and ignoring the settlement reference.
**Interview tip:** Business status rules should be explicit and testable.

## DW-A168 — Build a typed date normalization function
**Question:** Convert a date string into a standardized ISO date.
**Input** `{"date":"2026-09-16"}`
**DataWeave**
```dw
%dw 2.0
fun normalizeDate(value: String): String = ((value as Date) as String {format: "yyyy-MM-dd"})
output application/json
---
normalizeDate(payload.date)
```
**Output** `"2026-09-16"`
**Explanation:** The value is parsed as a Date and formatted consistently.
**Common mistake:** Treating arbitrary date strings as safe without validating their format.
**Interview tip:** Production integrations should define timezone and invalid-date behavior explicitly.

## DW-A169 — Convert a timestamp to a date
**Question:** Extract the calendar date from an ISO timestamp.
**Input** `{"timestamp":"2026-09-16T15:30:00Z"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload.timestamp as DateTime) as Date
```
**Output** `"2026-09-16"`
**Explanation:** The timestamp is parsed and converted to a Date.
**Common mistake:** Extracting characters manually when temporal types are appropriate.
**Interview tip:** Be explicit about timezone when converting timestamps across regions.

## DW-A170 — Calculate date difference
**Question:** Calculate the number of days between two dates.
**Input** `{"start":"2026-09-01","end":"2026-09-16"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
daysBetween(payload.start as Date, payload.end as Date)
```
**Output** `15`
**Explanation:** Typed Date values allow calendar-aware date arithmetic.
**Common mistake:** Subtracting date strings.
**Interview tip:** Clarify whether the business definition is calendar days or elapsed 24-hour periods.

## DW-A171 — Validate required object keys dynamically
**Question:** Return missing required keys from a customer object.
**Input** `{"id":"C1","name":"Ravi"}`
**DataWeave**
```dw
%dw 2.0
var required = ["id","name","email"]
output application/json
---
required filter (!(payload contains $))
```
**Output** `["email"]`
**Explanation:** A runtime required-field list can be compared against object membership.
**Common mistake:** Checking values instead of key presence.
**Interview tip:** Required-key validation is different from non-null validation.

## DW-A172 — Preserve object order intentionally
**Question:** Transform selected fields into a predictable API response order.
**Input** `{"name":"Ravi","id":"C1","status":"ACTIVE"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  name: payload.name,
  status: payload.status
}
```
**Output** `{"id":"C1","name":"Ravi","status":"ACTIVE"}`
**Explanation:** Explicit construction defines the target object's field order in the expression.
**Common mistake:** Depending on arbitrary source-field ordering for contract presentation.
**Interview tip:** Contract shape should be explicitly defined even when consumers do not semantically depend on JSON order.

## DW-A173 — Build a dynamic error-code object
**Question:** Count validation errors by error code.
**Input** `["MISSING_ID","INVALID_AMOUNT","MISSING_ID"]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $) mapObject ((rows, code) -> {(code): sizeOf(rows)})
```
**Output** `{"MISSING_ID":2,"INVALID_AMOUNT":1}`
**Explanation:** Error codes become dynamic keys and occurrence counts become values.
**Common mistake:** Hard-coding each known error code.
**Interview tip:** Dynamic aggregation makes monitoring summaries extensible.

## DW-A174 — Create a batch result with accepted and rejected records
**Question:** Separate orders into accepted and rejected collections based on positive amount.
**Input** `[{"id":"A","amount":100},{"id":"B","amount":0}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  accepted: payload filter $.amount > 0,
  rejected: payload filter $.amount <= 0
}
```
**Output** `{"accepted":[{"id":"A","amount":100}],"rejected":[{"id":"B","amount":0}]}`
**Explanation:** One source batch is partitioned into two business outcomes.
**Common mistake:** Returning only accepted records and silently discarding failures.
**Interview tip:** Batch integrations often need both successful and rejected outputs.

## DW-A175 — Create a production-ready transformation boundary
**Question:** Normalize input, validate required identity, and return a stable envelope containing either data or errors.
**Input** `{"customerId":"C1","name":" Ravi "}`
**DataWeave**
```dw
%dw 2.0
var customerId = payload.customerId default null
var name = if (payload.name == null) null else trim(payload.name)
var errors = [
  "CUSTOMER_ID_REQUIRED" if isBlank(customerId),
  "NAME_REQUIRED" if isBlank(name)
] filter ($ != null)
output application/json
---
{
  success: isEmpty(errors),
  errors: errors,
  data: if (isEmpty(errors)) {customerId: customerId, name: name} else null
}
```
**Output** `{"success":true,"errors":[],"data":{"customerId":"C1","name":"Ravi"}}`
**Explanation:** The transformation first normalizes input, evaluates validation rules, and then creates a stable response contract.
**Common mistake:** Performing validation after producing an incomplete success response.
**Interview tip:** This pattern separates normalization, validation, and response construction into clear stages.
