# New Medium DataWeave Q&A — DW-M126 to DW-M150

## DW-M126 — Normalize and deduplicate email records
**Question:** Normalize email addresses to lowercase and keep the first record for each email.
**Input**
```json
[{"id":1,"email":"A@EXAMPLE.COM"},{"id":2,"email":"b@example.com"},{"id":3,"email":"a@example.com"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload distinctBy lower($.email)
```
**Output**
```json
[{"id":1,"email":"A@EXAMPLE.COM"},{"id":2,"email":"b@example.com"}]
```
**Explanation:** The uniqueness criterion is the normalized email.
**Common mistake:** Deduplicating by the original case-sensitive value.
**Interview tip:** Clarify whether first-wins or last-wins is required.

## DW-M127 — Convert entries into a lookup object
**Question:** Convert customer records into an object keyed by customer ID.
**Input**
```json
[{"id":"C1","name":"A"},{"id":"C2","name":"B"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((item, acc = {}) -> acc ++ {(item.id): item})
```
**Output**
```json
{"C1":{"id":"C1","name":"A"},"C2":{"id":"C2","name":"B"}}
```
**Explanation:** Each record becomes a dynamic-key object and is merged into the accumulator.
**Common mistake:** Forgetting the dynamic-key parentheses.
**Interview tip:** Discuss duplicate-key behavior before using this pattern as an index.

## DW-M128 — Build an indexed object from an array
**Question:** Create an object keyed by array position such as `0`, `1`, and `2`.
**Input**
```json
["A","B","C"]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((item, index) -> {(index as String): item})
```
**Output**
```json
{"0":"A","1":"B","2":"C"}
```
**Explanation:** The array index is converted into a dynamic object key.
**Common mistake:** Treating an array index as an object field automatically.
**Interview tip:** Compare this with a simple `map` result.

## DW-M129 — Group records and calculate totals
**Question:** Group sales by region and calculate the total amount for each region.
**Input**
```json
[{"region":"S","amount":100},{"region":"N","amount":50},{"region":"S","amount":75}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.region) mapObject ((rows, region) -> {(region): sum(rows.amount)})
```
**Output**
```json
{"S":175,"N":50}
```
**Explanation:** `groupBy` creates region buckets and `mapObject` aggregates each bucket.
**Common mistake:** Summing the entire input instead of each group.
**Interview tip:** This is a common group-and-aggregate pattern.

## DW-M130 — Return unique nested codes
**Question:** Collect unique product codes from all order items.
**Input**
```json
{"orders":[{"items":[{"code":"A"},{"code":"B"}]},{"items":[{"code":"A"}]}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
flatten(payload.orders.items).code distinctBy $
```
**Output**
```json
["A","B"]
```
**Explanation:** Nested arrays are flattened, codes are projected, and duplicates removed.
**Common mistake:** Applying `distinctBy` before projecting the code.
**Interview tip:** Describe the shape after each stage.

## DW-M131 — Build a dynamic allow-list object
**Question:** Keep only configuration keys listed in an allow-list.
**Input**
```json
{"allowed":["host","port"],"config":{"host":"api","port":443,"debug":true}}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.config filterObject ((value, key) -> payload.allowed contains key)
```
**Output**
```json
{"host":"api","port":443}
```
**Explanation:** `filterObject` evaluates each object entry against a runtime allow-list.
**Common mistake:** Using `filter`, which operates on arrays.
**Interview tip:** Explain the difference between `filter` and `filterObject`.

## DW-M132 — Create a query parameter string
**Question:** Convert an object into `key=value` pairs joined by `&`.
**Input**
```json
{"page":2,"size":50,"active":true}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
entriesOf(payload) map ($.key ++ "=" ++ (($.value) as String)) joinBy "&"
```
**Output**
```json
"page=2&size=50&active=true"
```
**Explanation:** Object entries are converted to strings and joined.
**Common mistake:** Ignoring URL encoding requirements for values containing reserved characters.
**Interview tip:** Distinguish transformation from actual URI encoding.

## DW-M133 — Generate a CSV row object
**Question:** Produce a consistent export record from an order.
**Input**
```json
{"id":"O1","customer":{"name":"Ravi"},"total":250}
```
**DataWeave**
```dw
%dw 2.0
output application/csv
---
[{orderId: payload.id, customerName: payload.customer.name, total: payload.total}]
```
**Output**
```text
orderId,customerName,total
O1,Ravi,250
```
**Explanation:** A target object is constructed before CSV serialization.
**Common mistake:** Exposing the entire nested customer object.
**Interview tip:** Explicitly define the export schema.

## DW-M134 — Convert CSV-like text into typed records
**Question:** Parse CSV text and convert the amount column to Number.
**Input**
```text
id,amount
A,100.50
B,25
```
**DataWeave**
```dw
%dw 2.0
input payload application/csv
output application/json
---
payload map {id: $.id, amount: $.amount as Number}
```
**Output**
```json
[{"id":"A","amount":100.5},{"id":"B","amount":25}]
```
**Explanation:** CSV fields are initially text and the amount is explicitly converted.
**Common mistake:** Assuming CSV numeric-looking values are automatically Numbers in every context.
**Interview tip:** Discuss reader configuration when CSV dialects differ.

## DW-M135 — Build a reusable normalization function
**Question:** Normalize a name by trimming whitespace and converting it to uppercase.
**Input**
```json
{"name":"  ravi  "}
```
**DataWeave**
```dw
%dw 2.0
fun normalizeName(value: String): String = upper(trim(value))
output application/json
---
normalizeName(payload.name)
```
**Output**
```json
"RAVI"
```
**Explanation:** A typed function centralizes a reusable normalization rule.
**Common mistake:** Duplicating the same expression across many mappings.
**Interview tip:** Mention type declarations when functions are part of a shared module.

## DW-M136 — Use a function with a default parameter
**Question:** Format a greeting using an optional prefix that defaults to `Hello`.
**Input**
```json
{"name":"Ravi"}
```
**DataWeave**
```dw
%dw 2.0
fun greet(name: String, prefix: String = "Hello") = prefix ++ ", " ++ name
output application/json
---
greet(payload.name)
```
**Output**
```json
"Hello, Ravi"
```
**Explanation:** The default parameter is used when the caller does not provide a value.
**Common mistake:** Treating a function default as the same thing as a payload default.
**Interview tip:** Compare parameter defaults with the `default` operator.

## DW-M137 — Create a validation summary
**Question:** Return whether an order has both an ID and a positive total.
**Input**
```json
{"id":"O1","total":125}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  valid: !isBlank(payload.id) and payload.total > 0,
  orderId: payload.id
}
```
**Output**
```json
{"valid":true,"orderId":"O1"}
```
**Explanation:** Multiple validation rules are combined into a single Boolean result.
**Common mistake:** Returning a textual `"true"` instead of Boolean `true`.
**Interview tip:** For production validation, include actionable error details when needed.

## DW-M138 — Return validation errors as an array
**Question:** Produce separate messages for missing ID and non-positive total.
**Input**
```json
{"id":"","total":0}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
[
  {field: "id", message: "ID is required"} if isBlank(payload.id),
  {field: "total", message: "Total must be positive"} if payload.total <= 0
] filter ($ != null)
```
**Output**
```json
[{"field":"id","message":"ID is required"},{"field":"total","message":"Total must be positive"}]
```
**Explanation:** Conditional array entries create only the applicable validation errors.
**Common mistake:** Returning null entries in the final error list.
**Interview tip:** Structured validation errors are easier for API consumers to process.

## DW-M139 — Compare two object fields
**Question:** Return whether the shipping and billing country codes match.
**Input**
```json
{"shipping":{"country":"IN"},"billing":{"country":"US"}}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.shipping.country == payload.billing.country
```
**Output**
```json
false
```
**Explanation:** Direct field comparison returns a Boolean.
**Common mistake:** Comparing the whole nested objects when only the country is relevant.
**Interview tip:** Define null/missing behavior when comparing optional fields.

## DW-M140 — Find the first matching record safely
**Question:** Find the first customer with ID `C2`, returning `null` if absent.
**Input**
```json
{"customers":[{"id":"C1"},{"id":"C2"}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload.customers filter $.id == "C2")[0] default null
```
**Output**
```json
{"id":"C2"}
```
**Explanation:** Filtering finds candidates and indexing selects the first; `default` protects an empty result.
**Common mistake:** Indexing without considering an empty array.
**Interview tip:** Clarify whether multiple matches are valid.

## DW-M141 — Sort records by a nested field
**Question:** Sort customers by city alphabetically.
**Input**
```json
[{"name":"A","address":{"city":"Pune"}},{"name":"B","address":{"city":"Delhi"}}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload orderBy $.address.city
```
**Output**
```json
[{"name":"B","address":{"city":"Delhi"}},{"name":"A","address":{"city":"Pune"}}]
```
**Explanation:** `orderBy` uses the nested city value as its sorting criterion.
**Common mistake:** Sorting by the entire address object.
**Interview tip:** Explain ascending order and how to reverse it when required.

## DW-M142 — Group case-insensitively
**Question:** Group ticket counts by status without treating case differences as separate groups.
**Input**
```json
[{"status":"Open"},{"status":"OPEN"},{"status":"Closed"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy lower($.status)) mapObject ((rows, status) -> {(status): sizeOf(rows)})
```
**Output**
```json
{"open":2,"closed":1}
```
**Explanation:** Status is normalized before grouping.
**Common mistake:** Grouping directly on the original case-sensitive field.
**Interview tip:** Normalize the grouping key when the business key is case-insensitive.

## DW-M143 — Calculate a percentage
**Question:** Calculate the percentage of successful transactions.
**Input**
```json
[{"status":"SUCCESS"},{"status":"FAIL"},{"status":"SUCCESS"},{"status":"SUCCESS"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
if (isEmpty(payload)) 0 else (sizeOf(payload filter $.status == "SUCCESS") / sizeOf(payload)) * 100
```
**Output**
```json
75
```
**Explanation:** Successful records are counted and divided by the total count.
**Common mistake:** Forgetting the empty-input division case.
**Interview tip:** State the expected precision of the percentage.

## DW-M144 — Create a running total
**Question:** Add a cumulative total to each transaction.
**Input**
```json
[{"id":"A","amount":10},{"id":"B","amount":20},{"id":"C","amount":5}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map ((item, index) -> item ++ {runningTotal: sum((payload[0 to index]).amount)})
```
**Output**
```json
[{"id":"A","amount":10,"runningTotal":10},{"id":"B","amount":20,"runningTotal":30},{"id":"C","amount":5,"runningTotal":35}]
```
**Explanation:** Each record sums amounts from the beginning through its current index.
**Common mistake:** Calculating only the current row's amount.
**Interview tip:** Discuss performance if the array is very large.

## DW-M145 — Flatten selected children only
**Question:** Return item IDs only from orders marked `READY`.
**Input**
```json
{"orders":[{"status":"READY","items":[{"id":1},{"id":2}]},{"status":"HOLD","items":[{"id":3}]}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
flatten((payload.orders filter $.status == "READY").items).id
```
**Output**
```json
[1,2]
```
**Explanation:** Parent records are filtered before child arrays are flattened.
**Common mistake:** Flattening all children and filtering too late.
**Interview tip:** Filter early when the parent condition determines which children matter.

## DW-M146 — Preserve selected unknown fields
**Question:** Return known API fields plus an object containing all source metadata keys beginning with `x-`.
**Input**
```json
{"id":1,"name":"A","x-trace":"T1","x-region":"IN"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  name: payload.name,
  metadata: payload filterObject ((value, key) -> startsWith(key as String, "x-"))
}
```
**Output**
```json
{"id":1,"name":"A","metadata":{"x-trace":"T1","x-region":"IN"}}
```
**Explanation:** Known fields are explicitly mapped while selected dynamic metadata is preserved.
**Common mistake:** Returning the entire source object and accidentally exposing unrelated fields.
**Interview tip:** This pattern is useful for controlled forward compatibility.

## DW-M147 — Build a nested API response
**Question:** Wrap customer data and a request status into a standard response envelope.
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
  status: "SUCCESS",
  data: {
    customerId: payload.id,
    customerName: payload.name
  }
}
```
**Output**
```json
{"status":"SUCCESS","data":{"customerId":"C1","customerName":"Ravi"}}
```
**Explanation:** The source object is mapped into a stable API envelope.
**Common mistake:** Mixing envelope metadata with business fields at the same level.
**Interview tip:** API response contracts should be explicit and consistent.

## DW-M148 — Aggregate by two dimensions
**Question:** Calculate totals by region and currency.
**Input**
```json
[{"region":"IN","currency":"INR","amount":100},{"region":"IN","currency":"USD","amount":50},{"region":"IN","currency":"INR","amount":25}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy (($.region ++ "|" ++ $.currency))) mapObject ((rows, key) -> {(key): sum(rows.amount)})
```
**Output**
```json
{"IN|INR":125,"IN|USD":50}
```
**Explanation:** A composite grouping key represents both dimensions.
**Common mistake:** Grouping only by region and losing currency separation.
**Interview tip:** Composite keys are useful when multiple fields define a business bucket.

## DW-M149 — Detect duplicate business keys
**Question:** Return transaction IDs that occur more than once.
**Input**
```json
[{"id":"T1"},{"id":"T2"},{"id":"T1"},{"id":"T3"},{"id":"T2"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
((payload map $.id) groupBy $) filterObject ((values, key) -> sizeOf(values) > 1) pluck ((values, key) -> key)
```
**Output**
```json
["T1","T2"]
```
**Explanation:** IDs are grouped and only groups with multiple occurrences are retained.
**Common mistake:** Using `distinctBy`, which removes duplicates instead of identifying them.
**Interview tip:** Explain the difference between deduplication and duplicate detection.

## DW-M150 — Create a deterministic record fingerprint
**Question:** Build a stable string from transaction ID, date, and amount for comparison.
**Input**
```json
{"id":"T1","date":"2026-09-16","amount":100}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.id ++ "|" ++ payload.date ++ "|" ++ (payload.amount as String)
```
**Output**
```json
"T1|2026-09-16|100"
```
**Explanation:** The selected business fields are combined into a deterministic comparison string.
**Common mistake:** Calling this a cryptographic hash; it is only a deterministic composite string.
**Interview tip:** If security-grade hashing is required, use an appropriate hashing mechanism rather than plain concatenation.
