# Medium DataWeave Q&A — DW-M151 to DW-M175

## DW-M151 — Convert object to array of labels
**Question:** Convert a configuration object into `key=value` labels.
**Input** `{"region":"IN","tier":"gold"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
entriesOf(payload) map ($.key ++ "=" ++ ($.value as String))
```
**Output** `["region=IN","tier=gold"]`
**Explanation:** `entriesOf` provides both key and value for formatting.
**Common mistake:** Iterating values only and losing the key.
**Interview tip:** Use `pluck` when transforming object entries directly.

## DW-M152 — Transform an object with mapObject
**Question:** Prefix every configuration value with `cfg-`.
**Input** `{"host":"api","region":"IN"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload mapObject ((value, key) -> {(key): "cfg-" ++ (value as String)})
```
**Output** `{"host":"cfg-api","region":"cfg-IN"}`
**Explanation:** `mapObject` preserves object structure while transforming entries.
**Common mistake:** Using `map`, which is for arrays.
**Interview tip:** `mapObject` is one of the core object-transformation functions.

## DW-M153 — Extract object values conditionally
**Question:** Return values for configuration keys whose values are enabled booleans.
**Input** `{"logging":true,"metrics":false,"tracing":true}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload filterObject ((value, key) -> value is Boolean and value)) pluck $ 
```
**Output** `[true,true]`
**Explanation:** The object is filtered before its values are projected.
**Common mistake:** Filtering an object with array-only `filter`.
**Interview tip:** If the key names are needed, retain entries rather than plucking values.

## DW-M154 — Return enabled feature names
**Question:** Return the keys of all enabled Boolean features.
**Input** `{"search":true,"export":false,"alerts":true}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
keysOf(payload filterObject ((value, key) -> value is Boolean and value))
```
**Output** `["search","alerts"]`
**Explanation:** `filterObject` selects enabled entries and `keysOf` extracts their names.
**Common mistake:** Returning the Boolean values instead of feature names.
**Interview tip:** This pattern is useful for dynamic capability lists.

## DW-M155 — Group and sort records
**Question:** Group tickets by priority and sort each group by ticket ID.
**Input** `[{"id":"T3","priority":"HIGH"},{"id":"T1","priority":"HIGH"},{"id":"T2","priority":"LOW"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.priority) mapObject ((rows, priority) -> {(priority): rows orderBy $.id})
```
**Output** `{"HIGH":[{"id":"T1","priority":"HIGH"},{"id":"T3","priority":"HIGH"}],"LOW":[{"id":"T2","priority":"LOW"}]}`
**Explanation:** Grouping establishes buckets and `orderBy` sorts each bucket.
**Common mistake:** Sorting before grouping when group-local order is required.
**Interview tip:** Break multi-stage transformations into named variables when they become complex.

## DW-M156 — Deduplicate by normalized composite key
**Question:** Keep the first record for each case-insensitive email and country combination.
**Input** `[{"email":"A@X.COM","country":"IN"},{"email":"a@x.com","country":"IN"},{"email":"a@x.com","country":"US"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload distinctBy (lower($.email) ++ "|" ++ upper($.country))
```
**Output** `[{"email":"A@X.COM","country":"IN"},{"email":"a@x.com","country":"US"}]`
**Explanation:** A composite normalized expression defines uniqueness.
**Common mistake:** Deduplicating by email alone and incorrectly merging countries.
**Interview tip:** Composite business keys are common in integration work.

## DW-M157 — Find duplicate normalized values
**Question:** Return normalized email addresses that occur more than once.
**Input** `[{"email":"A@X.COM"},{"email":"a@x.com"},{"email":"b@x.com"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
((payload map lower($.email)) groupBy $) filterObject ((rows, key) -> sizeOf(rows) > 1) pluck ((rows, key) -> key)
```
**Output** `["a@x.com"]`
**Explanation:** Normalize first, group second, then retain groups with multiple occurrences.
**Common mistake:** Using `distinctBy`, which hides duplicate counts.
**Interview tip:** Duplicate detection and deduplication have different outputs.

## DW-M158 — Convert nested arrays to one business list
**Question:** Return all SKU values from all shipment packages.
**Input** `{"packages":[{"items":[{"sku":"A"},{"sku":"B"}]},{"items":[{"sku":"C"}]}]}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
flatten(payload.packages.items).sku
```
**Output** `["A","B","C"]`
**Explanation:** The nested item arrays are flattened before selecting SKU.
**Common mistake:** Selecting `.sku` while the data is still nested one level deeper.
**Interview tip:** Trace the data shape after every operation.

## DW-M159 — Use flatMap for child projection
**Question:** Return only the IDs of active child records.
**Input** `[{"active":true,"children":[{"id":1},{"id":2}]},{"active":false,"children":[{"id":3}]}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload flatMap ((parent) -> if (parent.active) parent.children map $.id else [])
```
**Output** `[1,2]`
**Explanation:** Each parent contributes an array, and `flatMap` combines those arrays.
**Common mistake:** Producing nested arrays with plain `map`.
**Interview tip:** `flatMap` is useful when one input element can produce zero or many outputs.

## DW-M160 — Calculate totals by customer
**Question:** Return each customer with their total order amount.
**Input** `[{"customer":"C1","amount":100},{"customer":"C2","amount":50},{"customer":"C1","amount":25}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.customer) pluck ((rows, customer) -> {customer: customer, total: sum(rows.amount)})
```
**Output** `[{"customer":"C1","total":125},{"customer":"C2","total":50}]`
**Explanation:** `groupBy` creates customer buckets and `pluck` converts the result object to an array.
**Common mistake:** Forgetting that `groupBy` returns an object.
**Interview tip:** This is a common `groupBy` → `pluck` reporting pattern.

## DW-M161 — Calculate count and average by category
**Question:** Return count and average score per category.
**Input** `[{"category":"A","score":80},{"category":"A","score":100},{"category":"B","score":60}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.category) mapObject ((rows, category) -> {(category): {count: sizeOf(rows), average: avg(rows.score)}})
```
**Output** `{"A":{"count":2,"average":90},"B":{"count":1,"average":60}}`
**Explanation:** Multiple aggregations can be calculated from each group.
**Common mistake:** Averaging all records globally.
**Interview tip:** Group-local aggregation is central to reporting transformations.

## DW-M162 — Build a lookup with selected fields
**Question:** Index products by ID but retain only name and price.
**Input** `[{"id":"P1","name":"Phone","price":100,"internal":"x"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((item, acc = {}) -> acc ++ {(item.id): {name: item.name, price: item.price}})
```
**Output** `{"P1":{"name":"Phone","price":100}}`
**Explanation:** The lookup stores only fields needed by consumers.
**Common mistake:** Indexing sensitive or irrelevant source fields unnecessarily.
**Interview tip:** Lookup structures should contain only useful data.

## DW-M163 — Enrich with a default reference value
**Question:** Add a product category, using `UNKNOWN` if the product is missing from the catalog.
**Input** `{"orders":[{"productId":"P1"}],"products":[{"id":"P2","category":"CASE"}]}`
**DataWeave**
```dw
%dw 2.0
var products = payload.products reduce ((p, acc = {}) -> acc ++ {(p.id): p})
output application/json
---
payload.orders map ($ ++ {category: products[$.productId].category default "UNKNOWN"})
```
**Output** `[{"productId":"P1","category":"UNKNOWN"}]`
**Explanation:** Missing lookup results are handled explicitly.
**Common mistake:** Dereferencing a missing lookup record without a default.
**Interview tip:** Reference-data gaps should be part of the transformation contract.

## DW-M164 — Calculate a success ratio by service
**Question:** Calculate successful transaction percentage for each service.
**Input** `[{"service":"A","status":"SUCCESS"},{"service":"A","status":"FAIL"},{"service":"B","status":"SUCCESS"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.service) mapObject ((rows, service) -> {(service): if (isEmpty(rows)) 0 else (sizeOf(rows filter $.status == "SUCCESS") / sizeOf(rows)) * 100})
```
**Output** `{"A":50,"B":100}`
**Explanation:** Each service gets an independent success ratio.
**Common mistake:** Calculating one global ratio.
**Interview tip:** Define precision and zero-record behavior for metrics.

## DW-M165 — Build a field projection dynamically
**Question:** Return only fields listed in a runtime projection array.
**Input** `{"fields":["id","name"],"record":{"id":1,"name":"Ravi","secret":"x"}}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.record filterObject ((value, key) -> payload.fields contains key)
```
**Output** `{"id":1,"name":"Ravi"}`
**Explanation:** The allowed output fields come from runtime configuration.
**Common mistake:** Hard-coding every possible field.
**Interview tip:** Dynamic projection is useful for configurable integrations.

## DW-M166 — Normalize optional strings
**Question:** Convert blank city values to `UNKNOWN` while preserving real cities.
**Input** `[{"city":" Pune "},{"city":"   "},{"city":null}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map {city: if (isBlank($.city)) "UNKNOWN" else trim($.city)}
```
**Output** `[{"city":"Pune"},{"city":"UNKNOWN"},{"city":"UNKNOWN"}]`
**Explanation:** Blank and null values are normalized before trimming.
**Common mistake:** Calling `trim` without deciding how null should behave.
**Interview tip:** Normalize optional source fields at the transformation boundary.

## DW-M167 — Create a nested error list
**Question:** Validate each order and return order-specific errors.
**Input** `[{"id":"O1","amount":100},{"id":"","amount":0}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map {
  id: $.id,
  errors: [
    "ID_REQUIRED" if isBlank($.id),
    "AMOUNT_INVALID" if $.amount <= 0
  ] filter ($ != null)
}
```
**Output** `[{"id":"O1","errors":[]},{"id":"","errors":["ID_REQUIRED","AMOUNT_INVALID"]}]`
**Explanation:** Each input record receives its own validation collection.
**Common mistake:** Combining all errors into one unrelated global array.
**Interview tip:** Error association matters in batch APIs.

## DW-M168 — Re-key records by composite identity
**Question:** Create an index using `country|customerId` as the key.
**Input** `[{"country":"IN","customerId":"C1"},{"country":"US","customerId":"C1"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((item, acc = {}) -> acc ++ {(item.country ++ "|" ++ item.customerId): item})
```
**Output** `{"IN|C1":{"country":"IN","customerId":"C1"},"US|C1":{"country":"US","customerId":"C1"}}`
**Explanation:** Multiple fields are combined into a unique lookup key.
**Common mistake:** Indexing only by customer ID and causing collisions across countries.
**Interview tip:** Composite keys must reflect actual business identity.

## DW-M169 — Select latest record by timestamp
**Question:** Return the latest event for each customer.
**Input** `[{"customer":"C1","time":"2026-09-15T10:00:00Z"},{"customer":"C1","time":"2026-09-16T10:00:00Z"},{"customer":"C2","time":"2026-09-16T09:00:00Z"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.customer) pluck ((rows, customer) -> (rows orderBy $.time)[-1])
```
**Output** `[{"customer":"C1","time":"2026-09-16T10:00:00Z"},{"customer":"C2","time":"2026-09-16T09:00:00Z"}]`
**Explanation:** Records are grouped, sorted by timestamp, and the final record is selected.
**Common mistake:** Taking the final input record without sorting.
**Interview tip:** Use typed temporal values when source timestamp formats are not safely comparable as strings.

## DW-M170 — Create a monthly summary
**Question:** Group dated transactions by `YYYY-MM` and calculate total amount.
**Input** `[{"date":"2026-01-10","amount":100},{"date":"2026-01-20","amount":50},{"date":"2026-02-01","amount":25}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy ($.date[0 to 6])) mapObject ((rows, month) -> {(month): sum(rows.amount)})
```
**Output** `{"2026-01":150,"2026-02":25}`
**Explanation:** The month portion becomes the grouping key.
**Common mistake:** Grouping by the complete date and creating one bucket per day.
**Interview tip:** Prefer typed date operations when source formats require real date arithmetic.

## DW-M171 — Create a sorted unique list
**Question:** Return unique customer names alphabetically.
**Input** `["Ravi","Asha","Ravi","Bala"]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload distinctBy $) orderBy $
```
**Output** `["Asha","Bala","Ravi"]`
**Explanation:** Deduplication happens before sorting.
**Common mistake:** Sorting first when ordering does not affect uniqueness but adds unnecessary work.
**Interview tip:** Explain the sequence of operations and why it is chosen.

## DW-M172 — Build a dynamic object from selected fields
**Question:** Create an object containing only non-null fields from a customer record.
**Input** `{"id":"C1","name":"Ravi","phone":null}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> value != null)
```
**Output** `{"id":"C1","name":"Ravi"}`
**Explanation:** `filterObject` removes null-valued entries without manually listing fields.
**Common mistake:** Using `filter` on an object.
**Interview tip:** Dynamic filtering is useful for optional-field APIs.

## DW-M173 — Calculate a batch summary
**Question:** Return total records, successful records, and failed records.
**Input** `[{"status":"SUCCESS"},{"status":"FAIL"},{"status":"SUCCESS"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  total: sizeOf(payload),
  success: sizeOf(payload filter $.status == "SUCCESS"),
  failed: sizeOf(payload filter $.status == "FAIL")
}
```
**Output** `{"total":3,"success":2,"failed":1}`
**Explanation:** The same source collection can feed several independent metrics.
**Common mistake:** Performing separate transformations unnecessarily when one expression can build the summary.
**Interview tip:** Keep summary fields semantically clear.

## DW-M174 — Produce an API pagination response
**Question:** Return records plus page metadata.
**Input** `{"items":[1,2,3,4],"page":1,"size":2}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  page: payload.page,
  size: payload.size,
  total: sizeOf(payload.items),
  data: payload.items[0 to (payload.size - 1)]
}
```
**Output** `{"page":1,"size":2,"total":4,"data":[1,2]}`
**Explanation:** The response combines data and pagination metadata.
**Common mistake:** Reporting page size without limiting the returned data.
**Interview tip:** Production pagination also needs total-pages and out-of-range rules.

## DW-M175 — Build a status-count object
**Question:** Count records for each status dynamically.
**Input** `[{"status":"NEW"},{"status":"DONE"},{"status":"NEW"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload groupBy $.status) mapObject ((rows, status) -> {(status): sizeOf(rows)})
```
**Output** `{"NEW":2,"DONE":1}`
**Explanation:** Dynamic status values become output keys and group sizes become values.
**Common mistake:** Hard-coding status names when they can vary.
**Interview tip:** Dynamic aggregation is a strong interview pattern.
