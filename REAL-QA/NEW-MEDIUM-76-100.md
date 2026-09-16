# New Medium DataWeave Q&A — DW-M76 to DW-M100

## DW-M76 — Group orders by status and return IDs
**Question:** Group orders by status and return only their IDs.
**Input**
```json
[{"id":"O1","status":"NEW"},{"id":"O2","status":"SHIPPED"},{"id":"O3","status":"NEW"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.status) mapObject ((orders, status) -> {(status): orders map $.id})
```
**Output**
```json
{"NEW":["O1","O3"],"SHIPPED":["O2"]}
```
**Explanation:** Grouping is followed by a projection inside each group.
**Common mistake:** Mapping IDs before grouping and losing the status context.
**Interview tip:** Explain the intermediate grouped structure.

## DW-M77 — Count distinct customers
**Question:** Count unique customer IDs in transaction records.
**Input**
```json
[{"customerId":"C1"},{"customerId":"C2"},{"customerId":"C1"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
sizeOf((payload map $.customerId) distinctBy $)
```
**Output**
```json
2
```
**Explanation:** Project the identifier, remove duplicates, then count.
**Common mistake:** Counting transactions instead of customers.
**Interview tip:** Separate business entities from event records.

## DW-M78 — Select the latest record per customer
**Question:** Keep the record with the greatest timestamp for each customer.
**Input**
```json
[{"customer":"C1","ts":2,"value":"B"},{"customer":"C1","ts":1,"value":"A"},{"customer":"C2","ts":3,"value":"C"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.customer) pluck ((rows, customer) -> (rows orderBy $.ts)[-1])
```
**Output**
```json
[{"customer":"C1","ts":2,"value":"B"},{"customer":"C2","ts":3,"value":"C"}]
```
**Explanation:** Records are grouped and each group is sorted before selecting the final record.
**Common mistake:** Taking the last input record without considering timestamp order.
**Interview tip:** State the definition of “latest” explicitly.

## DW-M79 — Build a frequency table
**Question:** Count occurrences of each event type.
**Input**
```json
["LOGIN","VIEW","LOGIN","LOGOUT","VIEW"]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $) mapObject ((items, event) -> {(event): sizeOf(items)})
```
**Output**
```json
{"LOGIN":2,"VIEW":2,"LOGOUT":1}
```
**Explanation:** Equal values become groups and group sizes become frequencies.
**Common mistake:** Counting unique values only.
**Interview tip:** Frequency tables are a useful application of `groupBy`.

## DW-M80 — Pivot rows by month
**Question:** Sum sales by month.
**Input**
```json
[{"month":"JAN","amount":100},{"month":"JAN","amount":50},{"month":"FEB","amount":80}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.month) mapObject ((rows, month) -> {(month): sum(rows.amount)})
```
**Output**
```json
{"JAN":150,"FEB":80}
```
**Explanation:** The month is the grouping key and amount is the aggregate measure.
**Common mistake:** Summing before grouping.
**Interview tip:** Identify dimensions and measures in reporting transformations.

## DW-M81 — Join parent data to child records
**Question:** Add the customer ID to every order.
**Input**
```json
{"customerId":"C1","orders":[{"id":"O1"},{"id":"O2"}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.orders map {customerId: payload.customerId, orderId: $.id}
```
**Output**
```json
[{"customerId":"C1","orderId":"O1"},{"customerId":"C1","orderId":"O2"}]
```
**Explanation:** Root-level context is combined with each child record.
**Common mistake:** Referencing the child as though it contains the root customer ID.
**Interview tip:** Track lambda scope carefully.

## DW-M82 — Filter and project in one transformation
**Question:** Return names of employees earning above 100000.
**Input**
```json
[{"name":"A","salary":90000},{"name":"B","salary":120000},{"name":"C","salary":150000}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload filter $.salary > 100000) map $.name
```
**Output**
```json
["B","C"]
```
**Explanation:** Filtering determines which records survive and mapping determines their output shape.
**Common mistake:** Filtering after projecting only the names.
**Interview tip:** Transformation order matters when later steps need source fields.

## DW-M83 — Remove duplicate objects by normalized email
**Question:** Keep one record for each email regardless of case.
**Input**
```json
[{"email":"A@X.COM","id":1},{"email":"a@x.com","id":2},{"email":"b@x.com","id":3}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
distinctBy payload, lower($.email)
```
**Output**
```json
[{"email":"A@X.COM","id":1},{"email":"b@x.com","id":3}]
```
**Explanation:** The uniqueness criterion normalizes the email before comparison.
**Common mistake:** Deduplicating the raw case-sensitive values.
**Interview tip:** Normalize before applying business uniqueness rules.

## DW-M84 — Flatten selected child records
**Question:** Return all SKUs whose quantity is greater than one from every order.
**Input**
```json
[{"id":"O1","items":[{"sku":"A","qty":2},{"sku":"B","qty":1}]},{"id":"O2","items":[{"sku":"C","qty":3}]}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload flatMap ((order) -> order.items filter $.qty > 1 map $.sku)
```
**Output**
```json
["A","C"]
```
**Explanation:** Each order filters its children and `flatMap` combines the resulting arrays.
**Common mistake:** Using `map`, which would leave nested arrays.
**Interview tip:** `flatMap` is ideal for one-to-many expansion followed by flattening.

## DW-M85 — Convert an object to a query parameter string
**Question:** Convert search parameters into `key=value` pairs joined by `&`.
**Input**
```json
{"page":2,"size":20,"status":"OPEN"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(entriesOf(payload) map ($.key ++ "=" ++ ($.value as String))) joinBy "&"
```
**Output**
```json
"page=2&size=20&status=OPEN"
```
**Explanation:** Object entries are converted to strings and then joined.
**Common mistake:** Assuming object serialization automatically creates the desired query syntax.
**Interview tip:** Real integrations often require explicit URL/query contracts.

## DW-M86 — Build a lookup from duplicate-free records
**Question:** Create a product-name lookup after retaining the first record for each ID.
**Input**
```json
[{"id":"P1","name":"Phone"},{"id":"P1","name":"Phone New"},{"id":"P2","name":"Tablet"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
var unique = distinctBy payload, $.id
---
unique map ((item) -> {(item.id): item.name}) reduce ((item, acc = {}) -> acc ++ item)
```
**Output**
```json
{"P1":"Phone","P2":"Tablet"}
```
**Explanation:** Deduplication defines which record wins before lookup construction.
**Common mistake:** Building a lookup directly and silently overwriting duplicate keys.
**Interview tip:** Always define duplicate-key policy.

## DW-M87 — Calculate a percentage
**Question:** Calculate the percentage of successful transactions.
**Input**
```json
[{"status":"SUCCESS"},{"status":"FAILED"},{"status":"SUCCESS"},{"status":"SUCCESS"}]
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
**Explanation:** Successful records are counted and divided by total records.
**Common mistake:** Dividing by the successful count instead of total count.
**Interview tip:** Handle zero-record input to avoid invalid calculations.

## DW-M88 — Extract unique nested values
**Question:** Return unique city names from customer records.
**Input**
```json
[{"address":{"city":"Hyd"}},{"address":{"city":"Pune"}},{"address":{"city":"Hyd"}}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload map $.address.city) distinctBy $
```
**Output**
```json
["Hyd","Pune"]
```
**Explanation:** Nested values are projected before deduplication.
**Common mistake:** Applying `distinctBy` to the complete objects when city is the business key.
**Interview tip:** Choose the uniqueness criterion explicitly.

## DW-M89 — Create a nested API response
**Question:** Return customer identity and a nested account summary.
**Input**
```json
{"id":"C1","name":"Ravi","balance":1500,"currency":"INR"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  customer: {id: payload.id, name: payload.name},
  account: {balance: payload.balance, currency: payload.currency}
}
```
**Output**
```json
{"customer":{"id":"C1","name":"Ravi"},"account":{"balance":1500,"currency":"INR"}}
```
**Explanation:** Source fields are reorganized into a nested target contract.
**Common mistake:** Returning a flat structure when the API contract is nested.
**Interview tip:** DataWeave is often used to reshape rather than simply rename fields.

## DW-M90 — Merge two objects with a controlled override
**Question:** Merge default configuration with request configuration so request values win.
**Input**
```json
{"defaults":{"timeout":30,"retries":2},"request":{"timeout":60}}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.defaults ++ payload.request
```
**Output**
```json
{"timeout":60,"retries":2}
```
**Explanation:** Object concatenation combines fields and the later value overrides the earlier matching key.
**Common mistake:** Reversing the operands and allowing defaults to override the request.
**Interview tip:** State precedence when merging configuration objects.

## DW-M91 — Build a field list from an allow-list
**Question:** Keep only API fields listed in a separate configuration array.
**Input**
```json
{"allowed":["id","name"],"record":{"id":1,"name":"A","secret":"X"}}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.record filterObject ((value, key) -> payload.allowed contains key)
```
**Output**
```json
{"id":1,"name":"A"}
```
**Explanation:** The configured allow-list controls which object keys survive.
**Common mistake:** Hard-coding the fields when the requirement says configuration-driven.
**Interview tip:** Dynamic allow-lists are useful for reusable APIs.

## DW-M92 — Convert object values to strings
**Question:** Convert every configuration value to text while retaining its keys.
**Input**
```json
{"port":8080,"enabled":true,"name":"api"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload mapObject ((value, key) -> {(key): value as String})
```
**Output**
```json
{"port":"8080","enabled":"true","name":"api"}
```
**Explanation:** `mapObject` preserves the object structure while changing value types.
**Common mistake:** Using `map`, which targets arrays.
**Interview tip:** `mapObject` is a natural choice for object-wide normalization.

## DW-M93 — Sum positive transactions only
**Question:** Calculate total positive transaction value.
**Input**
```json
[{"amount":100},{"amount":-20},{"amount":50}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
sum((payload filter $.amount > 0).amount)
```
**Output**
```json
150
```
**Explanation:** Negative values are excluded before aggregation.
**Common mistake:** Summing first and filtering afterward.
**Interview tip:** Filter the population before calculating a business metric.

## DW-M94 — Produce a running total
**Question:** Return cumulative totals for `[10, 20, 5]`.
**Input**
```json
[10,20,5]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload map ((item, index) -> sum(payload[0 to index])))
```
**Output**
```json
[10,30,35]
```
**Explanation:** Each index calculates the sum from the beginning through the current item.
**Common mistake:** Returning only the final reduce result.
**Interview tip:** Distinguish a running result from a final aggregate.

## DW-M95 — Group and sort each group
**Question:** Group products by category and sort each category by price.
**Input**
```json
[{"category":"A","price":30},{"category":"A","price":10},{"category":"B","price":20}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.category) mapObject ((items, category) -> {(category): items orderBy $.price})
```
**Output**
```json
{"A":[{"category":"A","price":10},{"category":"A","price":30}],"B":[{"category":"B","price":20}]}
```
**Explanation:** Sorting is performed independently within each group.
**Common mistake:** Sorting the complete input before grouping.
**Interview tip:** Group-level operations are common in reporting APIs.

## DW-M96 — Convert a list into a delimited export
**Question:** Create one semicolon-separated line from customer names.
**Input**
```json
[{"name":"A"},{"name":"B"},{"name":"C"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload map $.name) joinBy ";"
```
**Output**
```json
"A;B;C"
```
**Explanation:** Names are projected and then joined.
**Common mistake:** Joining the objects directly.
**Interview tip:** Project to the exact scalar values needed before joining.

## DW-M97 — Normalize blank optional fields
**Question:** Convert blank `phone` values to null while preserving valid values.
**Input**
```json
[{"phone":"  "},{"phone":"9876543210"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map ((item) -> {
  phone: if (isBlank(item.phone)) null else trim(item.phone)
})
```
**Output**
```json
[{"phone":null},{"phone":"9876543210"}]
```
**Explanation:** Blank input is normalized to a consistent null representation.
**Common mistake:** Treating whitespace as a valid phone value.
**Interview tip:** Normalization should happen before validation or persistence.

## DW-M98 — Create a rejection list
**Question:** Return IDs of records that fail an amount threshold.
**Input**
```json
[{"id":1,"amount":50},{"id":2,"amount":150},{"id":3,"amount":70}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload filter $.amount < 100) map $.id
```
**Output**
```json
[1,3]
```
**Explanation:** Validation failures are filtered and reduced to identifiers.
**Common mistake:** Returning complete records when only IDs are required.
**Interview tip:** Separate validation evidence from the original payload when designing response contracts.

## DW-M99 — Aggregate by composite region and type
**Question:** Sum transaction amounts by region and transaction type.
**Input**
```json
[{"region":"S","type":"PAY","amount":100},{"region":"S","type":"REFUND","amount":20},{"region":"S","type":"PAY","amount":50}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy ($.region ++ "|" ++ $.type)) mapObject ((rows, key) -> {(key): sum(rows.amount)})
```
**Output**
```json
{"S|PAY":150,"S|REFUND":20}
```
**Explanation:** A composite grouping key represents two business dimensions.
**Common mistake:** Grouping only by region and mixing transaction types.
**Interview tip:** Composite keys are useful when nested output is not required.

## DW-M100 — Build an API pagination summary
**Question:** Return page metadata together with records.
**Input**
```json
{"page":2,"pageSize":2,"total":5,"items":[{"id":3},{"id":4}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  page: payload.page,
  pageSize: payload.pageSize,
  total: payload.total,
  returned: sizeOf(payload.items),
  items: payload.items
}
```
**Output**
```json
{"page":2,"pageSize":2,"total":5,"returned":2,"items":[{"id":3},{"id":4}]}
```
**Explanation:** Pagination metadata is combined with the actual result set.
**Common mistake:** Using `pageSize` as the number actually returned.
**Interview tip:** `returned` and `pageSize` can differ on the final page.
