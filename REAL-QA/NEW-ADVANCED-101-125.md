# New Advanced DataWeave Q&A — DW-A101 to DW-A125

These scenarios focus on production-style transformations, reusable functions, dynamic structures, XML/CSV handling, error-safe mapping, and contract-aware design.

## DW-A101 — Preserve an API envelope while replacing nested data
**Difficulty:** Advanced  
**Topic:** nested update

**Question:** Replace `data.customer.name` while preserving metadata and all other fields.

**Input**
```json
{
  "meta":{"requestId":"R1","source":"CRM"},
  "data":{"customer":{"id":"C1","name":"Old Name"},"status":"ACTIVE"}
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload update {
  case .data.customer.name -> "New Name"
}
```

**Expected output**
```json
{
  "meta":{"requestId":"R1","source":"CRM"},
  "data":{"customer":{"id":"C1","name":"New Name"},"status":"ACTIVE"}
}
```

**Explanation:** The update expression changes only the selected nested field and keeps the rest of the structure.

**Common mistake:** Rebuilding the whole object and accidentally dropping metadata.

**Interview tip:** Explain why targeted updates can reduce accidental contract changes.

---

## DW-A102 — Add a derived nested field with update
**Difficulty:** Advanced  
**Topic:** update operator

**Question:** Add a `riskLevel` inside each customer record based on its score while preserving the original customer fields.

**Input**
```json
[
  {"id":"C1","score":85},
  {"id":"C2","score":45}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload map ((customer) ->
  customer update {
    case .riskLevel -> if (customer.score >= 70) "HIGH" else "NORMAL"
  }
)
```

**Expected output**
```json
[
  {"id":"C1","score":85,"riskLevel":"HIGH"},
  {"id":"C2","score":45,"riskLevel":"NORMAL"}
]
```

**Explanation:** Each object is updated without manually copying every existing field.

**Common mistake:** Assuming `update` mutates the original input in place.

**Interview tip:** Describe the transformation as producing updated values rather than mutating source state.

---

## DW-A103 — Use a do scope for reusable intermediate values
**Difficulty:** Advanced  
**Topic:** do scope

**Question:** Calculate a subtotal, tax, and total using local intermediate values without repeating expressions.

**Input**
```json
{"quantity":3,"unitPrice":100,"taxRate":0.18}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
do {
  var subtotal = payload.quantity * payload.unitPrice
  var tax = subtotal * payload.taxRate
  ---
  {
    subtotal: subtotal,
    tax: tax,
    total: subtotal + tax
  }
}
```

**Expected output**
```json
{"subtotal":300,"tax":54,"total":354}
```

**Explanation:** `do` creates a local scope where intermediate variables can be calculated once and reused.

**Common mistake:** Repeating the same calculation in multiple output fields.

**Interview tip:** Use local variables when they improve readability and prevent inconsistent repeated expressions.

---

## DW-A104 — Use a reusable function with a default argument
**Difficulty:** Advanced  
**Topic:** functions

**Question:** Create a function that applies a discount rate, defaulting to 10% when no rate is supplied.

**Input**
```json
{"price":200}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
fun discounted(price: Number, rate: Number = 0.10) = price * (1 - rate)
---
{
  defaultDiscount: discounted(payload.price),
  customDiscount: discounted(payload.price, 0.20)
}
```

**Expected output**
```json
{"defaultDiscount":180,"customDiscount":160}
```

**Explanation:** The function provides a reusable rule with a default parameter value.

**Common mistake:** Hard-coding the rate inside the function body when callers need controlled variation.

**Interview tip:** Mention type annotations and default arguments as part of a reusable transformation contract.

---

## DW-A105 — Create a normalized composite business key
**Difficulty:** Advanced  
**Topic:** normalization + composite key

**Question:** Build a stable business key from country, customer ID, and account type after trimming and lowercasing text fields.

**Input**
```json
{"country":" IN ","customerId":" C100 ","accountType":"Savings"}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
upper(trim(payload.country)) ++ "|" ++
trim(payload.customerId) ++ "|" ++
lower(trim(payload.accountType))
```

**Expected output**
```json
"IN|C100|savings"
```

**Explanation:** Components are normalized before being combined into a deterministic key.

**Common mistake:** Building the key from raw fields and allowing inconsistent whitespace/case.

**Interview tip:** Explain the uniqueness assumptions behind every component.

---

## DW-A106 — Detect conflicting duplicate business keys
**Difficulty:** Advanced  
**Topic:** groupBy + filterObject

**Question:** Find customer IDs that appear with conflicting account types.

**Input**
```json
[
  {"customer":"C1","type":"SAVINGS"},
  {"customer":"C1","type":"CURRENT"},
  {"customer":"C2","type":"SAVINGS"}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
(payload groupBy $.customer)
  mapObject ((items, customer) ->
    {(customer): (items.type distinctBy $)}
  )
  filterObject ((types) -> sizeOf(types) > 1)
```

**Expected output**
```json
{"C1":["SAVINGS","CURRENT"]}
```

**Explanation:** Records are grouped by customer and only groups containing multiple distinct types remain.

**Common mistake:** Treating repeated identical types as a conflict.

**Interview tip:** Define “conflict” as a business rule before writing the transformation.

---

## DW-A107 — Reconcile two feeds by business ID
**Difficulty:** Advanced  
**Topic:** lookup + reconciliation

**Question:** Compare expected and actual payment amounts and return only mismatches.

**Input**
```json
{
  "expected":[{"id":"P1","amount":100},{"id":"P2","amount":200}],
  "actual":[{"id":"P1","amount":100},{"id":"P2","amount":180}]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.expected
  map ((e) -> do {
    var a = (payload.actual filter $.id == e.id)[0] default null
    ---
    {
      id: e.id,
      expected: e.amount,
      actual: if (a == null) null else a.amount,
      difference: if (a == null) null else a.amount - e.amount
    }
  })
  filter $.difference != 0
```

**Expected output**
```json
[{"id":"P2","expected":200,"actual":180,"difference":-20}]
```

**Explanation:** Each expected payment is matched to an actual payment and the difference is calculated.

**Common mistake:** Comparing arrays by position rather than the business ID.

**Interview tip:** For large datasets, discuss replacing repeated scans with a lookup map.

---

## DW-A108 — Build a reference lookup and enrich a large feed
**Difficulty:** Advanced  
**Topic:** lookup optimization pattern

**Question:** Enrich orders with product descriptions using a product catalog.

**Input**
```json
{
  "orders":[{"id":"O1","sku":"A1"},{"id":"O2","sku":"B2"}],
  "products":[{"sku":"A1","description":"Keyboard"},{"sku":"B2","description":"Mouse"}]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
do {
  var catalog = payload.products reduce ((p, acc = {}) -> acc ++ {(p.sku): p})
  ---
  payload.orders map ((order) ->
    order ++ {description: catalog[order.sku].description default "Unknown"}
  )
}
```

**Expected output**
```json
[
  {"id":"O1","sku":"A1","description":"Keyboard"},
  {"id":"O2","sku":"B2","description":"Mouse"}
]
```

**Explanation:** The catalog is prepared once and reused for each order lookup.

**Common mistake:** Re-filtering the entire product array for every order without considering the data size.

**Interview tip:** Explain the readability and repeated-lookup advantages of an intermediate lookup object.

---

## DW-A109 — Generate a stable request fingerprint
**Difficulty:** Advanced  
**Topic:** deterministic fingerprint

**Question:** Build a deterministic text fingerprint from selected request fields for logging or idempotency-key input.

**Input**
```json
{"customerId":"C1","amount":125,"currency":"INR"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.customerId ++ "|" ++
(payload.amount as String) ++ "|" ++
payload.currency
```

**Expected output**
```json
"C1|125|INR"
```

**Explanation:** The output is deterministic for the same selected field values.

**Common mistake:** Calling this a cryptographic hash; this example is only a deterministic composite string.

**Interview tip:** If a real cryptographic hash is required, use an approved platform capability rather than treating concatenation as security.

---

## DW-A110 — Build an API response with conditional metadata
**Difficulty:** Advanced  
**Topic:** conditional object fields

**Question:** Include `pagination` only when pagination data exists.

**Input**
```json
{
  "items":[{"id":1}],
  "page":1,
  "totalPages":3
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  data: payload.items,
  (pagination: {
    page: payload.page,
    totalPages: payload.totalPages
  }) if (payload.page != null and payload.totalPages != null)
}
```

**Expected output**
```json
{
  "data":[{"id":1}],
  "pagination":{"page":1,"totalPages":3}
}
```

**Explanation:** Conditional object fields let the response shape reflect the available contract data.

**Common mistake:** Returning null pagination objects when the API contract says the field should be absent.

**Interview tip:** Distinguish “field absent” from “field present with null.”

---

## DW-A111 — Preserve unknown API fields under metadata
**Difficulty:** Advanced  
**Topic:** filterObject + dynamic contract

**Question:** Move all fields not in the public allow-list into an `metadata.unknown` object.

**Input**
```json
{"id":"C1","name":"Ravi","debug":"x","internalScore":9}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var publicKeys = ["id","name"]
---
{
  data: payload filterObject ((value, key) -> publicKeys contains key),
  metadata: {
    unknown: payload filterObject ((value, key) -> not (publicKeys contains key))
  }
}
```

**Expected output**
```json
{
  "data":{"id":"C1","name":"Ravi"},
  "metadata":{"unknown":{"debug":"x","internalScore":9}}
}
```

**Explanation:** The mapping preserves visibility into unexpected fields without exposing them as first-class public fields.

**Common mistake:** Silently dropping unknown fields when diagnostics require them.

**Interview tip:** Explain whether unknown fields should be retained, logged, rejected, or ignored according to the API contract.

---

## DW-A112 — Create an error envelope from validation failures
**Difficulty:** Advanced  
**Topic:** validation + error contract

**Question:** Return a consistent error response containing a correlation ID and all validation messages.

**Input**
```json
{"correlationId":"abc-123","email":"","amount":-10}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
var errors = [
  if (isBlank(payload.email)) {field:"email", message:"required"} else null,
  if (payload.amount <= 0) {field:"amount", message:"must be positive"} else null
] filter ($ != null)
---
{
  success: isEmpty(errors),
  correlationId: payload.correlationId,
  errors: errors
}
```

**Expected output**
```json
{
  "success":false,
  "correlationId":"abc-123",
  "errors":[
    {"field":"email","message":"required"},
    {"field":"amount","message":"must be positive"}
  ]
}
```

**Explanation:** Validation details are represented structurally instead of as an unstructured string.

**Common mistake:** Returning only the first validation error when the client can correct several fields at once.

**Interview tip:** Stable error contracts make client handling and production troubleshooting easier.

---

## DW-A113 — Convert XML namespaces into JSON fields
**Difficulty:** Advanced  
**Topic:** XML namespaces

**Question:** Read customer data from a namespaced XML payload and produce JSON.

**Input**
```xml
<ns:customer xmlns:ns="urn:crm">
  <ns:id>C1</ns:id>
  <ns:name>Ravi</ns:name>
</ns:customer>
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
ns ns "urn:crm"
---
{
  id: payload.ns#customer.ns#id,
  name: payload.ns#customer.ns#name
}
```

**Expected output**
```json
{"id":"C1","name":"Ravi"}
```

**Explanation:** XML namespaces must be handled explicitly when selecting namespaced elements.

**Common mistake:** Selecting `payload.customer` without considering the namespace.

**Interview tip:** Explain namespace declarations and qualified selectors.

---

## DW-A114 — Produce CSV with calculated columns
**Difficulty:** Advanced  
**Topic:** CSV output

**Question:** Generate CSV rows containing subtotal and tax from order lines.

**Input**
```json
[
  {"id":"O1","qty":2,"price":50,"taxRate":0.18},
  {"id":"O2","qty":1,"price":100,"taxRate":0.18}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/csv
---
payload map ((item) -> {
  id: item.id,
  subtotal: item.qty * item.price,
  tax: (item.qty * item.price) * item.taxRate
})
```

**Expected output**
```csv
id,subtotal,tax
O1,100,18
O2,100,18
```

**Explanation:** Calculated fields are added before the array is serialized as CSV.

**Common mistake:** Performing calculations after the output has already been serialized.

**Interview tip:** Separate transformation logic from serialization settings.

---

## DW-A115 — Normalize an API payload while preserving attributes
**Difficulty:** Advanced  
**Topic:** envelope transformation

**Question:** Convert a source envelope into a target envelope while retaining correlation metadata.

**Input**
```json
{
  "header":{"correlationId":"R1","channel":"WEB"},
  "customer":{"id":"C1","firstName":"Ravi","lastName":"K"}
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  correlationId: payload.header.correlationId,
  channel: payload.header.channel,
  customer: {
    customerId: payload.customer.id,
    name: payload.customer.firstName ++ " " ++ payload.customer.lastName
  }
}
```

**Expected output**
```json
{
  "correlationId":"R1",
  "channel":"WEB",
  "customer":{"customerId":"C1","name":"Ravi K"}
}
```

**Explanation:** Source and target models are intentionally different while trace metadata is preserved.

**Common mistake:** Copying the entire source object when the target contract is narrower.

**Interview tip:** Explain field-by-field mapping and contract ownership.

---

## DW-A116 — Produce a deterministic reconciliation report
**Difficulty:** Advanced  
**Topic:** reconciliation

**Question:** Report records that are missing on either side of a reconciliation feed.

**Input**
```json
{
  "left":[{"id":"A"},{"id":"B"}],
  "right":[{"id":"B"},{"id":"C"}]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var leftIds = payload.left.id
var rightIds = payload.right.id
---
{
  missingFromRight: leftIds filter (not (rightIds contains $)),
  missingFromLeft: rightIds filter (not (leftIds contains $))
}
```

**Expected output**
```json
{"missingFromRight":["A"],"missingFromLeft":["C"]}
```

**Explanation:** Each side's IDs are compared against the other side.

**Common mistake:** Comparing complete objects when the business identity is the ID.

**Interview tip:** State the reconciliation key explicitly before writing the comparison.

---

## DW-A117 — Build a multi-level summary
**Difficulty:** Advanced  
**Topic:** nested groupBy

**Question:** Summarize sales by region and then by product category.

**Input**
```json
[
  {"region":"South","category":"A","amount":100},
  {"region":"South","category":"B","amount":50},
  {"region":"South","category":"A","amount":25},
  {"region":"North","category":"A","amount":80}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
(payload groupBy $.region)
  mapObject ((regionItems, region) ->
    {(region):
      (regionItems groupBy $.category)
        mapObject ((categoryItems, category) ->
          {(category): sum(categoryItems.amount)}
        )
    }
  )
```

**Expected output**
```json
{
  "South":{"A":125,"B":50},
  "North":{"A":80}
}
```

**Explanation:** The transformation groups at two business dimensions and aggregates each leaf group.

**Common mistake:** Performing one global sum and losing the dimensional breakdown.

**Interview tip:** Draw the intermediate object shape before writing nested `mapObject` expressions.

---

## DW-A118 — Create a typed reusable money function
**Difficulty:** Advanced  
**Topic:** typed function

**Question:** Create a function that calculates line total and rounds it to two decimal places.

**Input**
```json
{"quantity":3,"unitPrice":19.995}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
fun lineTotal(quantity: Number, unitPrice: Number): Number =
  round(quantity * unitPrice * 100) / 100
---
lineTotal(payload.quantity, payload.unitPrice)
```

**Expected output**
```json
59.99
```

**Explanation:** The function defines both parameter and return types and applies a two-decimal rounding rule.

**Common mistake:** Assuming binary floating-point arithmetic is equivalent to decimal financial arithmetic in every platform context.

**Interview tip:** For real financial systems, follow the application's approved monetary precision strategy.

---

## DW-A119 — Mask a sensitive identifier with a reusable function
**Difficulty:** Advanced  
**Topic:** masking function

**Question:** Keep only the final four characters of an account number and replace earlier characters with `*`.

**Input**
```json
{"account":"123456789012"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
fun mask(value: String) =
  repeat("*", sizeOf(value) - 4) ++ substring(value, sizeOf(value) - 4, sizeOf(value))
---
mask(payload.account)
```

**Expected output**
```json
"********9012"
```

**Explanation:** The function hides all but the final four characters.

**Common mistake:** Logging the original identifier before applying the mask.

**Interview tip:** Validate minimum input length before applying fixed-position masking in production.

---

## DW-A120 — Handle optional nested API data
**Difficulty:** Advanced  
**Topic:** safe optional mapping

**Question:** Return a default shipping city when the nested shipping object is absent.

**Input**
```json
{"orderId":"O1","shipping":null}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  orderId: payload.orderId,
  city: (payload.shipping.city default "UNKNOWN")
}
```

**Expected output**
```json
{"orderId":"O1","city":"UNKNOWN"}
```

**Explanation:** The nested access is combined with `default` to define the missing-data behavior.

**Common mistake:** Treating optional nested fields as mandatory.

**Interview tip:** Clarify whether a missing object, missing field, and explicit null should produce the same output.

---

## DW-A121 — Detect missing reference values
**Difficulty:** Advanced  
**Topic:** anti-join pattern

**Question:** Return orders whose customer ID does not exist in the customer reference list.

**Input**
```json
{
  "orders":[{"id":"O1","customer":"C1"},{"id":"O2","customer":"C9"}],
  "customers":[{"id":"C1"},{"id":"C2"}]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
var customerIds = payload.customers.id
---
payload.orders filter (not (customerIds contains $.customer))
```

**Expected output**
```json
[{"id":"O2","customer":"C9"}]
```

**Explanation:** The reference IDs are prepared once and used to identify unmatched orders.

**Common mistake:** Filtering based on customer position rather than customer ID.

**Interview tip:** This pattern is useful for data-quality and reconciliation checks.

---

## DW-A122 — Build a paginated API response
**Difficulty:** Advanced  
**Topic:** pagination

**Question:** Return a page envelope with page size, current page, total count, and items.

**Input**
```json
{
  "items":[{"id":1},{"id":2}],
  "page":2,
  "pageSize":2,
  "total":10
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  data: payload.items,
  pagination: {
    page: payload.page,
    pageSize: payload.pageSize,
    totalItems: payload.total,
    totalPages: ceil(payload.total / payload.pageSize)
  }
}
```

**Expected output**
```json
{
  "data":[{"id":1},{"id":2}],
  "pagination":{"page":2,"pageSize":2,"totalItems":10,"totalPages":5}
}
```

**Explanation:** Pagination metadata is derived from the source count and page size.

**Common mistake:** Using floor division and undercounting the final partial page.

**Interview tip:** Consider zero page size as an explicit validation case.

---

## DW-A123 — Create a generic field projection function
**Difficulty:** Advanced  
**Topic:** higher-order transformation

**Question:** Create a function that projects selected fields from any object using an allow-list.

**Input**
```json
{"id":"C1","name":"Ravi","phone":"9999","secret":"x"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
fun project(item: Object, fields: Array<String>) =
  item filterObject ((value, key) -> fields contains key)
---
project(payload, ["id", "name"])
```

**Expected output**
```json
{"id":"C1","name":"Ravi"}
```

**Explanation:** A reusable projection function centralizes allow-list filtering.

**Common mistake:** Hard-coding the selected fields inside the function.

**Interview tip:** Typed reusable functions are useful for common API-contract transformations.

---

## DW-A124 — Create a contract-aware CSV output
**Difficulty:** Advanced  
**Topic:** CSV schema shaping

**Question:** Output only selected fields in a defined CSV column order, regardless of source field order.

**Input**
```json
[
  {"internal":"x","name":"Ravi","id":"C1","active":true},
  {"active":false,"id":"C2","name":"Anu","internal":"y"}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/csv header=true
---
payload map ((item) -> {
  id: item.id,
  name: item.name,
  active: item.active
})
```

**Expected output**
```csv
id,name,active
C1,Ravi,true
C2,Anu,false
```

**Explanation:** The target object is constructed in the desired contract order and excludes internal fields before CSV serialization.

**Common mistake:** Serializing the source objects directly and allowing unwanted columns through.

**Interview tip:** Treat output serialization as part of the external contract.

---

## DW-A125 — Produce a production transaction envelope
**Difficulty:** Advanced  
**Topic:** production integration pattern

**Question:** Build a transaction envelope containing correlation data, normalized customer information, amount, and a deterministic business key.

**Input**
```json
{
  "correlationId":"R100",
  "customer":{"id":" C1 ","type":"Retail"},
  "transaction":{"amount":125.5,"currency":"INR"}
}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
do {
  var customerId = trim(payload.customer.id)
  var customerType = lower(trim(payload.customer.type))
  var currency = upper(trim(payload.transaction.currency))
  ---
  {
    correlationId: payload.correlationId,
    transaction: {
      businessKey: customerId ++ "|" ++ currency,
      customerId: customerId,
      customerType: customerType,
      amount: payload.transaction.amount,
      currency: currency
    }
  }
}
```

**Expected output**
```json
{
  "correlationId":"R100",
  "transaction":{
    "businessKey":"C1|INR",
    "customerId":"C1",
    "customerType":"retail",
    "amount":125.5,
    "currency":"INR"
  }
}
```

**Explanation:** The transformation normalizes fields once, derives a deterministic business key, and creates a clean integration envelope.

**Common mistake:** Repeating normalization expressions throughout the output.

**Interview tip:** This pattern demonstrates contract mapping, local variables, normalization, and traceability together.
