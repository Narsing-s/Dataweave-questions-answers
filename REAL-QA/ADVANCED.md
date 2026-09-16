# Advanced — Curated DataWeave Q&A

## DW-R41 — Department summary with totals
**Question:** Group orders by department and calculate both count and total amount.

**Input**
```json
[{"dept":"IT","amount":100},{"dept":"IT","amount":250},{"dept":"HR","amount":80}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.dept) mapObject ((orders, dept) -> {
  (dept): {
    count: sizeOf(orders),
    total: orders.amount reduce ((item, acc = 0) -> acc + item)
  }
})
```
**Output**
```json
{"IT":{"count":2,"total":350},"HR":{"count":1,"total":80}}
```
**Explanation:** The transformation separates grouping from aggregation and produces a reusable summary structure.
**Common mistake:** Calculating totals across the entire payload instead of each group.
**Interview tip:** Explain the intermediate type after every major operator.

## DW-R42 — Convert nested JSON into an API response
**Question:** Convert customer records into an API-friendly response with metadata.

**Input**
```json
{"customers":[{"id":1,"first":"A","last":"Rao"},{"id":2,"first":"B","last":"Shah"}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  count: sizeOf(payload.customers),
  data: payload.customers map {
    id: $.id,
    fullName: $.first ++ " " ++ $.last
  }
}
```
**Output**
```json
{"count":2,"data":[{"id":1,"fullName":"A Rao"},{"id":2,"fullName":"B Shah"}]}
```
**Explanation:** A response envelope is created while the source records are reshaped.
**Common mistake:** Returning the source array directly and losing the response contract.
**Interview tip:** API transformation questions often test both business mapping and output shape.

## DW-R43 — Dynamic lookup object
**Question:** Build a lookup object from product records keyed by SKU.

**Input**
```json
[{"sku":"A1","price":10},{"sku":"B2","price":20}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  (payload map ((item) -> (item.sku): item.price))
}
```
**Output**
```json
{"A1":10,"B2":20}
```
**Explanation:** Dynamic keys convert a list into an efficient object-shaped lookup representation.
**Common mistake:** Forgetting parentheses around the dynamic key expression.
**Interview tip:** Discuss duplicate SKU behavior if the source can contain repeated keys.

## DW-R44 — Multi-level grouping
**Question:** Group employees by department and then by location.

**Input**
```json
[{"name":"A","dept":"IT","city":"Hyd"},{"name":"B","dept":"IT","city":"Pune"},{"name":"C","dept":"IT","city":"Hyd"}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.dept) mapObject ((employees, dept) -> {
  (dept): employees groupBy $.city
})
```
**Output**
```json
{"IT":{"Hyd":[{"name":"A","dept":"IT","city":"Hyd"},{"name":"C","dept":"IT","city":"Hyd"}],"Pune":[{"name":"B","dept":"IT","city":"Pune"}]}}
```
**Explanation:** The result of one `groupBy` becomes the input to another transformation.
**Common mistake:** Grouping the original payload again and losing the department boundary.
**Interview tip:** Multi-level grouping is a common real-world reporting transformation.

## DW-R45 — Deduplicate using a composite key
**Question:** Keep one record for each customer/product combination.

**Input**
```json
[{"customer":"C1","product":"P1","value":10},{"customer":"C1","product":"P1","value":20},{"customer":"C1","product":"P2","value":30}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
distinctBy payload, $.customer ++ "|" ++ $.product
```
**Output**
```json
[{"customer":"C1","product":"P1","value":10},{"customer":"C1","product":"P2","value":30}]
```
**Explanation:** A composite string acts as the uniqueness criterion.
**Common mistake:** Deduplicating only by customer and unintentionally removing different products.
**Interview tip:** Define the business key before choosing `distinctBy`.

## DW-R46 — Merge arrays and remove duplicate IDs
**Question:** Combine two customer feeds and keep unique customer IDs.

**Input**
```json
{"a":[{"id":1,"name":"A"},{"id":2,"name":"B"}],"b":[{"id":2,"name":"B2"},{"id":3,"name":"C"}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
distinctBy (payload.a ++ payload.b), $.id
```
**Output**
```json
[{"id":1,"name":"A"},{"id":2,"name":"B"},{"id":3,"name":"C"}]
```
**Explanation:** Arrays are concatenated first, then deduplicated using the business ID.
**Common mistake:** Assuming the second feed automatically overwrites the first.
**Interview tip:** State explicitly which source wins when duplicate records disagree.

## DW-R47 — Transform XML to JSON
**Question:** Convert a simple XML customer list to JSON.

**Input**
```xml
<customers><customer><id>1</id><name>A</name></customer><customer><id>2</id><name>B</name></customer></customers>
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  customers: payload.customers.*customer map {
    id: $.id as Number,
    name: $.name
  }
}
```
**Output**
```json
{"customers":[{"id":1,"name":"A"},{"id":2,"name":"B"}]}
```
**Explanation:** XML selectors are used to collect repeated `customer` elements and the ID is explicitly converted to a number.
**Common mistake:** Assuming XML text nodes are automatically typed as JSON numbers.
**Interview tip:** Always inspect XML reader behavior and explicitly cast fields whose target type matters.

## DW-R48 — JSON to XML
**Question:** Create a simple XML customer response from JSON.

**Input**
```json
{"customers":[{"id":1,"name":"A"},{"id":2,"name":"B"}]}
```
**DataWeave**
```dw
%dw 2.0
output application/xml
---
customers: {
  customer: payload.customers map {
    id: $.id,
    name: $.name
  }
}
```
**Output**
```xml
<customers><customer><id>1</id><name>A</name></customer><customer><id>2</id><name>B</name></customer></customers>
```
**Explanation:** The output MIME type controls XML serialization and repeated object entries create repeated elements.
**Common mistake:** Designing JSON-style arrays without checking the required XML hierarchy.
**Interview tip:** XML mappings are contract-sensitive; confirm the exact target schema.

## DW-R49 — Conditional transformation with match
**Question:** Map transaction types to different output objects.

**Input**
```json
[{"type":"PAY","amount":100},{"type":"REFUND","amount":25}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map ((tx) -> tx.type match {
  case "PAY" -> {kind: "debit", amount: tx.amount}
  case "REFUND" -> {kind: "credit", amount: tx.amount}
  else -> {kind: "unknown", amount: tx.amount}
})
```
**Output**
```json
[{"kind":"debit","amount":100},{"kind":"credit","amount":25}]
```
**Explanation:** Each record is mapped and then classified with `match`.
**Common mistake:** Returning different field names for each branch without a stable contract.
**Interview tip:** Keep branch outputs consistent when downstream consumers expect one schema.

## DW-R50 — Reduce into an object
**Question:** Convert a list of tags into an object containing occurrence counts.

**Input**
```json
["api","dw","api","mule"]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((item, acc = {}) -> {
  (item): (acc[item] default 0) + 1
} ++ acc)
```
**Output**
```json
{"api":2,"dw":1,"mule":1}
```
**Explanation:** The accumulator is an object and each iteration updates the count for the current tag.
**Common mistake:** Treating the accumulator as an array.
**Interview tip:** `reduce` can produce objects, arrays, strings or numbers; the accumulator type determines the pattern.

## DW-R51 — Build a normalized record
**Question:** Normalize a customer record with trimming, lowercasing and a default country.

**Input**
```json
{"name":"  Ravi Rao ","email":" RAVI@EXAMPLE.COM ","country":null}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  name: trim(payload.name),
  email: lower(trim(payload.email)),
  country: payload.country default "IN"
}
```
**Output**
```json
{"name":"Ravi Rao","email":"ravi@example.com","country":"IN"}
```
**Explanation:** Normalization is performed before the values enter the target contract.
**Common mistake:** Lowercasing without trimming whitespace.
**Interview tip:** Separate normalization, validation and business enrichment.

## DW-R52 — Convert nested objects to flat records
**Question:** Flatten an order/customer structure into one record per order.

**Input**
```json
{"customer":{"id":"C1","name":"A"},"orders":[{"id":"O1","amount":100},{"id":"O2","amount":200}]}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.orders map {
  orderId: $.id,
  amount: $.amount,
  customerId: payload.customer.id,
  customerName: payload.customer.name
}
```
**Output**
```json
[{"orderId":"O1","amount":100,"customerId":"C1","customerName":"A"},{"orderId":"O2","amount":200,"customerId":"C1","customerName":"A"}]
```
**Explanation:** Parent-level customer fields are combined with each child order.
**Common mistake:** Referencing `$.customer` from the order item when customer is actually at the root.
**Interview tip:** Clearly identify the scope of `$` when nested mappings are involved.

## DW-R53 — Filter nested records
**Question:** Return only orders containing at least one item with quantity greater than 5.

**Input**
```json
[{"id":1,"items":[{"qty":2},{"qty":7}]},{"id":2,"items":[{"qty":3}]}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter (order) -> !isEmpty(order.items filter $.qty > 5)
```
**Output**
```json
[{"id":1,"items":[{"qty":2},{"qty":7}]}]
```
**Explanation:** The inner filter tests whether qualifying children exist; the outer filter keeps the parent.
**Common mistake:** Filtering the child array and returning children instead of parent orders.
**Interview tip:** Nested predicates are common in API and database transformations.

## DW-R54 — Aggregate by month
**Question:** Group transactions by month extracted from an ISO date.

**Input**
```json
[{"date":"2026-01-05","amount":100},{"date":"2026-01-20","amount":50},{"date":"2026-02-02","amount":80}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy ((tx) -> (tx.date as Date).month))
```
**Output**
```json
{"JANUARY":[{"date":"2026-01-05","amount":100},{"date":"2026-01-20","amount":50}],"FEBRUARY":[{"date":"2026-02-02","amount":80}]}
```
**Explanation:** The string date is cast to a Date and the month component is used as the grouping key.
**Common mistake:** Grouping by a substring without confirming the date format.
**Interview tip:** Date parsing should match the actual source contract.

## DW-R55 — Produce an API error envelope
**Question:** Create a standard error response from an error code and message.

**Input**
```json
{"code":"CUSTOMER_NOT_FOUND","message":"Customer does not exist"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  success: false,
  error: {
    code: payload.code,
    message: payload.message
  }
}
```
**Output**
```json
{"success":false,"error":{"code":"CUSTOMER_NOT_FOUND","message":"Customer does not exist"}}
```
**Explanation:** The source error is normalized to a stable API contract.
**Common mistake:** Returning internal exception details directly to clients.
**Interview tip:** Separate public error contracts from internal diagnostic information.

## DW-R56 — Create CSV-compatible rows
**Question:** Convert nested customer data into flat CSV rows.

**Input**
```json
{"customers":[{"id":1,"address":{"city":"Hyderabad","country":"IN"}},{"id":2,"address":{"city":"Pune","country":"IN"}}]}
```
**DataWeave**
```dw
%dw 2.0
output application/csv
---
payload.customers map {
  id: $.id,
  city: $.address.city,
  country: $.address.country
}
```
**Output**
```text
id,city,country
1,Hyderabad,IN
2,Pune,IN
```
**Explanation:** Nested JSON is flattened into tabular records before CSV serialization.
**Common mistake:** Passing nested objects directly to a CSV contract without deciding how to flatten them.
**Interview tip:** CSV requires a deliberate column model.

## DW-R57 — Preserve only allowed fields
**Question:** Remove internal fields from an API response.

**Input**
```json
{"id":1,"name":"A","passwordHash":"internal","createdBy":"system"}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  name: payload.name
}
```
**Output**
```json
{"id":1,"name":"A"}
```
**Explanation:** Explicit allow-list mapping is safer for stable public contracts than copying every source field.
**Common mistake:** Returning the entire payload and accidentally exposing internal data.
**Interview tip:** Prefer allow-list mappings for externally visible responses.

## DW-R58 — Convert an object into a sorted array
**Question:** Return object entries sorted by their numeric value.

**Input**
```json
{"A":30,"B":10,"C":20}
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload pluck ((value, key) -> {name: key as String, score: value})) orderBy $.score
```
**Output**
```json
[{"name":"B","score":10},{"name":"C","score":20},{"name":"A","score":30}]
```
**Explanation:** The object is first converted to an array, then ordered.
**Common mistake:** Trying to use `orderBy` directly when the required output is an array of object entries.
**Interview tip:** Convert object → array with `pluck` when array operations are required.

## DW-R59 — Calculate a weighted total
**Question:** Calculate total invoice amount after per-line discount percentages.

**Input**
```json
[{"price":100,"qty":2,"discount":10},{"price":50,"qty":1,"discount":20}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((item, acc = 0) ->
  acc + ((item.price * item.qty) * (1 - item.discount / 100))
)
```
**Output**
```json
230
```
**Explanation:** Each line computes its net amount before contributing to the accumulator.
**Common mistake:** Applying the discount to price but forgetting quantity.
**Interview tip:** Break complex arithmetic into named variables when readability matters.

## DW-R60 — Production-style normalization pipeline
**Question:** Return active customers with normalized names, unique IDs and sorted output.

**Input**
```json
[{"id":"C2","name":"  Bob ","active":true},{"id":"C1","name":" Alice","active":true},{"id":"C2","name":"Bob Duplicate","active":true},{"id":"C3","name":"Carol","active":false}]
```
**DataWeave**
```dw
%dw 2.0
output application/json
---
((payload filter $.active)
  distinctBy $.id
  map {
    id: $.id,
    name: trim($.name)
  }) orderBy $.id
```
**Output**
```json
[{"id":"C1","name":"Alice"},{"id":"C2","name":"Bob"}]
```
**Explanation:** The pipeline filters, deduplicates, normalizes and orders the data in clear stages.
**Common mistake:** Deduplicating before filtering when inactive records could affect which duplicate survives.
**Interview tip:** Transformation order matters; explain why each stage occurs where it does.
