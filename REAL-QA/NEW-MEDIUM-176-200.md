# Medium DataWeave Q&A — DW-M176 to DW-M200

## DW-M176 — Group orders by status
**Question:** Group orders into status buckets.
**Input** `[{"id":"O1","status":"PAID"},{"id":"O2","status":"PENDING"},{"id":"O3","status":"PAID"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload groupBy $.status
```
**Output** `{"PAID":[{"id":"O1","status":"PAID"},{"id":"O3","status":"PAID"}],"PENDING":[{"id":"O2","status":"PENDING"}]}`
**Explanation:** `groupBy` creates an object keyed by the selected status.
**Common mistake:** Expecting a flat array after grouping.
**Interview tip:** Grouping is useful before aggregation or bucket-specific processing.

## DW-M177 — Calculate totals per category
**Question:** Return the total sales amount for each category.
**Input** `[{"category":"A","amount":100},{"category":"B","amount":50},{"category":"A","amount":75}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload groupBy $.category mapObject ((items, category) -> {
  (category): sum(items.amount)
})
```
**Output** `{"A":175,"B":50}`
**Explanation:** The records are grouped first, then each group's amounts are summed.
**Common mistake:** Summing the complete input instead of each group.
**Interview tip:** Explain the change from array-of-records to object-of-aggregates.

## DW-M178 — Deduplicate objects by business key
**Question:** Keep the first customer record for each customer ID.
**Input** `[{"id":"C1","name":"Ravi"},{"id":"C2","name":"Asha"},{"id":"C1","name":"Ravi Updated"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload distinctBy $.id
```
**Output** `[{"id":"C1","name":"Ravi"},{"id":"C2","name":"Asha"}]`
**Explanation:** `distinctBy` uses the ID as the uniqueness criterion and preserves the first matching item.
**Common mistake:** Assuming the last duplicate automatically replaces the first.
**Interview tip:** State which duplicate should win when source data contains revisions.

## DW-M179 — Flatten nested arrays
**Question:** Convert nested item arrays into one item array.
**Input** `[{"items":[1,2]},{"items":[3]}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map $.items flatten
```
**Output** `[1,2,3]`
**Explanation:** Mapping extracts the nested arrays and `flatten` removes one array nesting level.
**Common mistake:** Using `flatMap` without understanding the equivalent transformation.
**Interview tip:** Know when one-level flattening is sufficient.

## DW-M180 — Use flatMap for nested records
**Question:** Return every product from every order as one array.
**Input** `[{"order":"O1","products":[{"sku":"P1"},{"sku":"P2"}]},{"order":"O2","products":[{"sku":"P3"}]}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload flatMap $.products
```
**Output** `[{"sku":"P1"},{"sku":"P2"},{"sku":"P3"}]`
**Explanation:** `flatMap` maps each order to an array and flattens the result by one level.
**Common mistake:** Expecting order metadata to be retained automatically.
**Interview tip:** Add the parent ID explicitly when downstream consumers need it.

## DW-M181 — Enrich records from a lookup object
**Question:** Add a country name using a country-code lookup.
**Input** `[{"id":"C1","countryCode":"IN"},{"id":"C2","countryCode":"US"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
var countries = {IN: "India", US: "United States"}
payload map ((item) -> item ++ {country: countries[item.countryCode] default "Unknown"})
```
**Output** `[{"id":"C1","countryCode":"IN","country":"India"},{"id":"C2","countryCode":"US","country":"United States"}]`
**Explanation:** A lookup object provides O(1)-style direct key access for a small in-memory mapping.
**Common mistake:** Returning null for an unknown code without a defined fallback.
**Interview tip:** Discuss how a large lookup should be sourced or indexed.

## DW-M182 — Build an index from an array
**Question:** Convert customer records into an object keyed by customer ID.
**Input** `[{"id":"C1","name":"Ravi"},{"id":"C2","name":"Asha"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload map ((item) -> {(item.id): item})) reduce ((item, acc = {}) -> acc ++ item)
```
**Output** `{"C1":{"id":"C1","name":"Ravi"},"C2":{"id":"C2","name":"Asha"}}`
**Explanation:** Each record becomes a one-key object and `reduce` merges those objects into an index.
**Common mistake:** Using the array index as the business key.
**Interview tip:** Explain duplicate-ID behavior before using this as an index.

## DW-M183 — Create a conditional output field
**Question:** Include `discount` only when an order amount exceeds 1000.
**Input** `{"id":"O1","amount":1500}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  id: payload.id,
  amount: payload.amount,
  (discount: payload.amount * 0.10) if payload.amount > 1000
}
```
**Output** `{"id":"O1","amount":1500,"discount":150}`
**Explanation:** Conditional object fields allow the target schema to omit fields when the condition is false.
**Common mistake:** Producing `discount: null` when omission is required.
**Interview tip:** Distinguish optional fields from fields that must explicitly contain null.

## DW-M184 — Convert an object to an array of key/value records
**Question:** Transform a configuration object into records suitable for a table.
**Input** `{"region":"APAC","tier":"gold"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
entriesOf(payload)
```
**Output** `[{"key":"region","value":"APAC"},{"key":"tier","value":"gold"}]`
**Explanation:** `entriesOf` makes dynamic object properties easier to process as array records.
**Common mistake:** Assuming object property order is a business guarantee.
**Interview tip:** Use entries when both key and value are required downstream.

## DW-M185 — Rebuild an object from entries
**Question:** Convert key/value records back into an object.
**Input** `[{"key":"region","value":"APAC"},{"key":"tier","value":"gold"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload reduce ((item, acc = {}) -> acc ++ {(item.key): item.value})
```
**Output** `{"region":"APAC","tier":"gold"}`
**Explanation:** Each entry becomes a dynamic-key object and `reduce` merges them.
**Common mistake:** Using a literal key named `item.key`.
**Interview tip:** Dynamic keys require parentheses around the expression.

## DW-M186 — Create a reusable function
**Question:** Define a function that returns a customer's display name.
**Input** `{"firstName":"Ravi","lastName":"Kumar"}`
**DataWeave**
```dw
%dw 2.0
output application/json
fun displayName(c) = c.firstName ++ " " ++ c.lastName
---
displayName(payload)
```
**Output** `"Ravi Kumar"`
**Explanation:** A named function isolates reusable transformation logic.
**Common mistake:** Repeating the same expression across many mappings.
**Interview tip:** Functions improve readability when a rule has a meaningful business name.

## DW-M187 — Use a function with a default parameter
**Question:** Create a greeting with a configurable prefix.
**Input** `{"name":"Ravi"}`
**DataWeave**
```dw
%dw 2.0
output application/json
fun greet(name, prefix = "Hello") = prefix ++ ", " ++ name
---
greet(payload.name)
```
**Output** `"Hello, Ravi"`
**Explanation:** The function supplies a default when the optional argument is not provided.
**Common mistake:** Treating the default as a global variable.
**Interview tip:** Default parameters are useful for small reusable rules.

## DW-M188 — Normalize an array before comparison
**Question:** Compare product codes without case differences.
**Input** `["p100","P200","p300"]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map upper($)
```
**Output** `["P100","P200","P300"]`
**Explanation:** Normalizing each code creates a consistent representation for later comparison.
**Common mistake:** Assuming source systems use consistent casing.
**Interview tip:** Normalize once near the boundary rather than repeatedly in downstream logic.

## DW-M189 — Filter records using multiple conditions
**Question:** Keep orders that are paid and above 1000.
**Input** `[{"status":"PAID","amount":1500},{"status":"PAID","amount":500},{"status":"PENDING","amount":2000}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload filter (($.status == "PAID") and ($.amount > 1000))
```
**Output** `[{"status":"PAID","amount":1500}]`
**Explanation:** Multiple predicates can be combined with Boolean operators.
**Common mistake:** Using `or` and accidentally admitting pending orders.
**Interview tip:** Translate each business condition separately before combining them.

## DW-M190 — Create a sorted top-N result
**Question:** Return the two highest transaction amounts.
**Input** `[120,500,300,700]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
(payload orderBy -$)[0 to 1]
```
**Output** `[700,500]`
**Explanation:** Descending ordering followed by a range selects the top two values.
**Common mistake:** Using an exclusive end index and returning the wrong number of elements.
**Interview tip:** Verify boundary behavior when slicing collections.

## DW-M191 — Select a nested array conditionally
**Question:** Return a customer's first phone number when phone data exists.
**Input** `{"phones":["9999999999","8888888888"]}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload.phones[0] default null
```
**Output** `"9999999999"`
**Explanation:** Index selection combined with `default` handles missing or empty phone arrays.
**Common mistake:** Assuming the array always has an element.
**Interview tip:** Boundary-safe selectors reduce transformation failures.

## DW-M192 — Create an error response from an error-like object
**Question:** Map an internal error record to a stable API error envelope.
**Input** `{"type":"VALIDATION","detail":"Missing email"}`
**DataWeave**
```dw
%dw 2.0
output application/json
---
{
  success: false,
  error: {
    code: payload.type,
    message: payload.detail
  }
}
```
**Output** `{"success":false,"error":{"code":"VALIDATION","message":"Missing email"}}`
**Explanation:** The transformation separates API metadata from internal error field names.
**Common mistake:** Exposing internal stack traces or implementation details.
**Interview tip:** Stable error contracts make integrations easier to maintain.

## DW-M193 — Compare two arrays of IDs
**Question:** Find customer IDs present in the current list but absent from the previous list.
**Input** `current=["C1","C2","C3"]`, `previous=["C1","C3"]`
**DataWeave**
```dw
%dw 2.0
output application/json
var current = ["C1","C2","C3"]
var previous = ["C1","C3"]
---
current filter ((id) -> !(previous contains id))
```
**Output** `["C2"]`
**Explanation:** Filtering the current IDs against the previous set identifies additions.
**Common mistake:** Comparing array positions instead of business IDs.
**Interview tip:** This is a common snapshot-difference pattern.

## DW-M194 — Find removed IDs between snapshots
**Question:** Find IDs present previously but missing from the current list.
**Input** `current=["C1","C3"]`, `previous=["C1","C2","C3"]`
**DataWeave**
```dw
%dw 2.0
output application/json
var current = ["C1","C3"]
var previous = ["C1","C2","C3"]
---
previous filter ((id) -> !(current contains id))
```
**Output** `["C2"]`
**Explanation:** Reversing the comparison direction identifies removals.
**Common mistake:** Using the same direction as an additions calculation.
**Interview tip:** Name the two snapshots clearly to avoid direction errors.

## DW-M195 — Produce a validation summary
**Question:** Return whether all required fields are present.
**Input** `{"name":"Ravi","email":"ravi@example.com","phone":"9999999999"}`
**DataWeave**
```dw
%dw 2.0
output application/json
var required = ["name", "email", "phone"]
---
{
  valid: required every ((key) -> payload[key] != null and !isBlank(payload[key] as String))
}
```
**Output** `{"valid":true}`
**Explanation:** The rule checks every required key for a non-null, non-blank value.
**Common mistake:** Checking only whether the object contains the keys.
**Interview tip:** Validation should distinguish a present-but-empty field from a valid value.

## DW-M196 — Add a line total to each item
**Question:** Calculate `quantity * unitPrice` for every order item.
**Input** `[{"sku":"P1","quantity":2,"unitPrice":100},{"sku":"P2","quantity":3,"unitPrice":50}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload map ($ ++ {lineTotal: $.quantity * $.unitPrice})
```
**Output** `[{"sku":"P1","quantity":2,"unitPrice":100,"lineTotal":200},{"sku":"P2","quantity":3,"unitPrice":50,"lineTotal":150}]`
**Explanation:** Each object is extended with a calculated field.
**Common mistake:** Calculating one total for the entire array.
**Interview tip:** Derived fields are common in order and invoice transformations.

## DW-M197 — Calculate a grand total from line totals
**Question:** Return the total value of all order lines.
**Input** `[{"quantity":2,"unitPrice":100},{"quantity":3,"unitPrice":50}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
sum(payload map ($.quantity * $.unitPrice))
```
**Output** `350`
**Explanation:** Each line amount is calculated and then aggregated with `sum`.
**Common mistake:** Summing quantities and prices separately.
**Interview tip:** Keep the unit of each intermediate value explicit.

## DW-M198 — Create a reusable status mapping
**Question:** Map internal numeric status codes to API labels.
**Input** `[1,2,3]`
**DataWeave**
```dw
%dw 2.0
output application/json
var labels = {"1": "ACTIVE", "2": "BLOCKED", "3": "CLOSED"}
---
payload map ((code) -> labels[(code as String)] default "UNKNOWN")
```
**Output** `["ACTIVE","BLOCKED","CLOSED"]`
**Explanation:** A lookup object translates internal codes into stable API values.
**Common mistake:** Using numeric keys when the lookup keys are strings.
**Interview tip:** Normalize key types before lookup when source typing is inconsistent.

## DW-M199 — Build a grouped count summary
**Question:** Return the number of orders in each status.
**Input** `[{"status":"PAID"},{"status":"PAID"},{"status":"PENDING"}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload groupBy $.status mapObject ((items, status) -> {
  (status): sizeOf(items)
})
```
**Output** `{"PAID":2,"PENDING":1}`
**Explanation:** `groupBy` creates buckets and `sizeOf` converts each bucket into a count.
**Common mistake:** Counting the full input for every status.
**Interview tip:** This pattern is useful for dashboard and monitoring summaries.

## DW-M200 — Build a nested customer-order response
**Question:** Group orders under each customer and return a customer-centric response.
**Input** `[{"customerId":"C1","orderId":"O1","amount":100},{"customerId":"C1","orderId":"O2","amount":200},{"customerId":"C2","orderId":"O3","amount":50}]`
**DataWeave**
```dw
%dw 2.0
output application/json
---
payload groupBy $.customerId mapObject ((orders, customerId) -> {
  (customerId): {
    orderCount: sizeOf(orders),
    orders: orders map {
      orderId: $.orderId,
      amount: $.amount
    }
  }
})
```
**Output** `{"C1":{"orderCount":2,"orders":[{"orderId":"O1","amount":100},{"orderId":"O2","amount":200}]},"C2":{"orderCount":1,"orders":[{"orderId":"O3","amount":50}]}}`
**Explanation:** Grouping creates customer buckets and each bucket is projected into a nested response.
**Common mistake:** Losing the customer key while mapping the grouped data.
**Interview tip:** This combines grouping, dynamic keys, aggregation and nested mapping in one practical transformation.
