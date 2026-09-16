# New Medium DataWeave Q&A — DW-M101 to DW-M125

## DW-M101 — Normalize and compare emails
**Difficulty:** Medium  
**Topic:** lower + trim + distinctBy

**Question:** Normalize emails by trimming and lowercasing, then keep one record per normalized email.

**Input**
```json
[
  {"id":1,"email":" User@Example.com "},
  {"id":2,"email":"user@example.COM"},
  {"id":3,"email":"admin@example.com"}
]
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
payload
  map ((item) -> item ++ {email: lower(trim(item.email))})
  distinctBy $.email
```

**Expected output**
```json
[
  {"id":1,"email":"user@example.com"},
  {"id":3,"email":"admin@example.com"}
]
```

**Explanation:** Normalize first, then deduplicate using the normalized business key.

**Common mistake:** Running `distinctBy` on the original email before normalization.

**Interview tip:** Separate normalization from identity rules.

---

## DW-M102 — Convert object values into labeled entries
**Difficulty:** Medium  
**Topic:** pluck

**Question:** Convert a score object into an array containing each subject and score.

**Input**
```json
{"math":90,"english":82,"science":88}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload pluck ((value, key) -> {
  subject: key,
  score: value
})
```

**Expected output**
```json
[
  {"subject":"math","score":90},
  {"subject":"english","score":82},
  {"subject":"science","score":88}
]
```

**Explanation:** `pluck` converts object entries into an array while exposing value and key.

**Common mistake:** Using `map`, which is primarily for arrays.

**Interview tip:** Know when to choose `mapObject`, `pluck`, and `entriesOf`.

---

## DW-M103 — Filter object fields using a dynamic list
**Difficulty:** Medium  
**Topic:** filterObject

**Question:** Keep only fields listed in `allowed`.

**Input**
```json
{
  "record":{"id":"C1","name":"Ravi","phone":"9999","internalCode":"X"},
  "allowed":["id","name","phone"]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.record filterObject ((value, key) -> payload.allowed contains key)
```

**Expected output**
```json
{"id":"C1","name":"Ravi","phone":"9999"}
```

**Explanation:** `filterObject` evaluates object entries and retains only keys present in the allow-list.

**Common mistake:** Using `filter`, which operates on arrays.

**Interview tip:** Explain the key type and the source allow-list contract.

---

## DW-M104 — Convert an array into an object keyed by ID
**Difficulty:** Medium  
**Topic:** reduce + dynamic keys

**Question:** Re-key customer records by `id`.

**Input**
```json
[
  {"id":"C1","name":"Ravi"},
  {"id":"C2","name":"Anu"}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload reduce ((item, acc = {}) ->
  acc ++ {(item.id): item}
)
```

**Expected output**
```json
{
  "C1":{"id":"C1","name":"Ravi"},
  "C2":{"id":"C2","name":"Anu"}
}
```

**Explanation:** The accumulator starts as an object and receives one dynamic property per record.

**Common mistake:** Forgetting parentheses around the dynamic key expression.

**Interview tip:** State the accumulator's type before explaining the reduce expression.

---

## DW-M105 — Produce a comma-separated list from filtered records
**Difficulty:** Medium  
**Topic:** filter + map + joinBy

**Question:** Return active customer names as a comma-separated string.

**Input**
```json
[
  {"name":"Ravi","active":true},
  {"name":"Anu","active":false},
  {"name":"Kiran","active":true}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
(payload filter $.active map $.name) joinBy ", "
```

**Expected output**
```json
"Ravi, Kiran"
```

**Explanation:** The transformation filters first, projects the names, and finally joins them.

**Common mistake:** Joining the complete objects instead of projected strings.

**Interview tip:** Describe the intermediate type after every operator.

---

## DW-M106 — Extract a filename and extension
**Difficulty:** Medium  
**Topic:** string parsing

**Question:** Return both the filename and extension from `invoice.2026.pdf`.

**Input**
```json
{"file":"invoice.2026.pdf"}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
{
  name: substringBeforeLast(payload.file, "."),
  extension: substringAfterLast(payload.file, ".")
}
```

**Expected output**
```json
{"name":"invoice.2026","extension":"pdf"}
```

**Explanation:** Using the final delimiter correctly handles names containing earlier dots.

**Common mistake:** Splitting on every dot without defining which segment represents the extension.

**Interview tip:** Ask whether hidden files and filenames without extensions are valid inputs.

---

## DW-M107 — Normalize optional text fields
**Difficulty:** Medium  
**Topic:** isBlank + default

**Question:** Convert blank phone values to null while trimming valid values.

**Input**
```json
[
  {"name":"Ravi","phone":" 98765 "},
  {"name":"Anu","phone":"   "},
  {"name":"Kiran","phone":null}
]
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
payload map ((item) ->
  item ++ {
    phone: if (item.phone == null or isBlank(item.phone as String))
      null
    else trim(item.phone as String)
  }
)
```

**Expected output**
```json
[
  {"name":"Ravi","phone":"98765"},
  {"name":"Anu","phone":null},
  {"name":"Kiran","phone":null}
]
```

**Explanation:** Blank and null are normalized to one representation, while meaningful text is trimmed.

**Common mistake:** Calling `trim` without considering null input.

**Interview tip:** Explicitly document the chosen missing-value representation.

---

## DW-M108 — Build a URL path from fields
**Difficulty:** Medium  
**Topic:** concatenation + casting

**Question:** Build `/customers/C100/orders/42` from customer and order fields.

**Input**
```json
{"customerId":"C100","orderId":42}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
"/customers/" ++ payload.customerId ++ "/orders/" ++ (payload.orderId as String)
```

**Expected output**
```json
"/customers/C100/orders/42"
```

**Explanation:** Numeric IDs are explicitly converted before string concatenation.

**Common mistake:** Relying on implicit coercion in a mixed-type expression.

**Interview tip:** Make boundary types explicit when constructing URLs or headers.

---

## DW-M109 — Group records by the first segment of a code
**Difficulty:** Medium  
**Topic:** substring + groupBy

**Question:** Group records by the prefix before `-` in their code.

**Input**
```json
[
  {"code":"US-100","amount":10},
  {"code":"IN-200","amount":20},
  {"code":"US-300","amount":30}
]
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
payload groupBy substringBefore($.code, "-")
```

**Expected output**
```json
{
  "US":[{"code":"US-100","amount":10},{"code":"US-300","amount":30}],
  "IN":[{"code":"IN-200","amount":20}]
}
```

**Explanation:** The grouping criterion is derived from the code prefix.

**Common mistake:** Grouping by the complete code and expecting prefixes automatically.

**Interview tip:** Make the grouping key expression explicit.

---

## DW-M110 — Create a lookup map from reference data
**Difficulty:** Medium  
**Topic:** reduce + lookup

**Question:** Convert country records into an object keyed by country code.

**Input**
```json
[
  {"code":"IN","name":"India"},
  {"code":"US","name":"United States"}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload reduce ((item, acc = {}) -> acc ++ {(item.code): item.name})
```

**Expected output**
```json
{"IN":"India","US":"United States"}
```

**Explanation:** The array is transformed into an object that supports direct key lookup.

**Common mistake:** Re-scanning the array for every target record when a lookup object can simplify repeated access.

**Interview tip:** Discuss the trade-off between readability and lookup efficiency for larger mappings.

---

## DW-M111 — Enrich orders with a status label
**Difficulty:** Medium  
**Topic:** lookup + map

**Question:** Add a human-readable status label to each order.

**Input**
```json
{
  "orders":[{"id":"O1","status":"P"},{"id":"O2","status":"S"}],
  "statusMap":{"P":"Pending","S":"Shipped"}
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload.orders map ((order) ->
  order ++ {statusLabel: payload.statusMap[order.status] default "Unknown"}
)
```

**Expected output**
```json
[
  {"id":"O1","status":"P","statusLabel":"Pending"},
  {"id":"O2","status":"S","statusLabel":"Shipped"}
]
```

**Explanation:** Each order uses its status as a dynamic lookup key, with a fallback for unknown values.

**Common mistake:** Hard-coding each status branch.

**Interview tip:** Explain why lookup data can be easier to maintain than repeated conditions.

---

## DW-M112 — Convert nested line items into invoice rows
**Difficulty:** Medium  
**Topic:** flatMap

**Question:** Produce one output row for every invoice line while retaining the invoice ID.

**Input**
```json
[
  {"invoice":"I1","lines":[{"sku":"A","qty":2},{"sku":"B","qty":1}]},
  {"invoice":"I2","lines":[{"sku":"C","qty":3}]}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload flatMap ((invoice) ->
  invoice.lines map ((line) -> {
    invoiceId: invoice.invoice,
    sku: line.sku,
    quantity: line.qty
  })
)
```

**Expected output**
```json
[
  {"invoiceId":"I1","sku":"A","quantity":2},
  {"invoiceId":"I1","sku":"B","quantity":1},
  {"invoiceId":"I2","sku":"C","quantity":3}
]
```

**Explanation:** Each invoice produces an array of rows and `flatMap` combines those child arrays into one array.

**Common mistake:** Using `map` alone and leaving a nested array structure.

**Interview tip:** Say “map creates arrays; flatMap maps and flattens one level.”

---

## DW-M113 — Calculate totals by customer
**Difficulty:** Medium  
**Topic:** groupBy + sum

**Question:** Group transactions by customer and calculate each customer's total amount.

**Input**
```json
[
  {"customer":"C1","amount":100},
  {"customer":"C2","amount":50},
  {"customer":"C1","amount":25}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
(payload groupBy $.customer)
  mapObject ((items, customer) ->
    {(customer): sum(items.amount)}
  )
```

**Expected output**
```json
{"C1":125,"C2":50}
```

**Explanation:** `groupBy` creates customer buckets and `mapObject` converts each bucket into a total.

**Common mistake:** Summing the entire payload once instead of each group.

**Interview tip:** Identify the intermediate grouped object before explaining the final mapping.

---

## DW-M114 — Sort strings case-insensitively
**Difficulty:** Medium  
**Topic:** orderBy + lower

**Question:** Sort names alphabetically without case affecting the sort key.

**Input**
```json
["zoe","Alice","bob"]
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
payload orderBy lower($)
```

**Expected output**
```json
["Alice","bob","zoe"]
```

**Explanation:** The original values are preserved while the lowercase value controls ordering.

**Common mistake:** Lowercasing the output values when only the sort criterion should be normalized.

**Interview tip:** Explain that `orderBy` can sort by a derived expression.

---

## DW-M115 — Select records using a reusable predicate
**Difficulty:** Medium  
**Topic:** functions + filter

**Question:** Define a reusable function that identifies active records with a positive balance.

**Input**
```json
[
  {"id":"A","active":true,"balance":100},
  {"id":"B","active":true,"balance":0},
  {"id":"C","active":false,"balance":50}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
fun eligible(item) = item.active and item.balance > 0
---
payload filter eligible($)
```

**Expected output**
```json
[{"id":"A","active":true,"balance":100}]
```

**Explanation:** Business logic is isolated in a named function and reused by `filter`.

**Common mistake:** Writing the same condition in multiple transformations.

**Interview tip:** Explain when a named function improves readability and reuse.

---

## DW-M116 — Produce a field-level validation result
**Difficulty:** Medium  
**Topic:** validation object

**Question:** Return a validation object for a required email and positive amount.

**Input**
```json
{"email":"","amount":-5}
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
{
  valid: not isBlank(payload.email) and payload.amount > 0,
  errors: [
    if (isBlank(payload.email)) "email is required" else null,
    if (payload.amount <= 0) "amount must be positive" else null
  ] filter ($ != null)
}
```

**Expected output**
```json
{"valid":false,"errors":["email is required","amount must be positive"]}
```

**Explanation:** Validation creates explicit errors instead of silently changing invalid data.

**Common mistake:** Returning only the Boolean and losing useful diagnostic information.

**Interview tip:** Distinguish transformation from validation and error handling.

---

## DW-M117 — Extract a date portion from a timestamp
**Difficulty:** Medium  
**Topic:** DateTime casting

**Question:** Convert an ISO timestamp to a date-only value.

**Input**
```json
{"timestamp":"2026-09-16T14:30:00Z"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
(payload.timestamp as DateTime) as Date
```

**Expected output**
```json
"2026-09-16"
```

**Explanation:** The timestamp is first interpreted as a `DateTime`, then projected to a `Date`.

**Common mistake:** Treating timestamp text as a date without considering time and timezone.

**Interview tip:** Discuss timezone semantics when the source contains an offset.

---

## DW-M118 — Calculate a date offset
**Difficulty:** Medium  
**Topic:** date arithmetic

**Question:** Add seven days to a given date.

**Input**
```json
{"date":"2026-09-16"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
(payload.date as Date {format: "yyyy-MM-dd"}) + |P7D|
```

**Expected output**
```json
"2026-09-23"
```

**Explanation:** A period can be added to a Date value.

**Common mistake:** Adding the number `7` without expressing the intended temporal unit.

**Interview tip:** Explain the difference between a numeric quantity and a temporal period.

---

## DW-M119 — Preserve only API-safe fields
**Difficulty:** Medium  
**Topic:** filterObject

**Question:** Remove internal fields from an API response while preserving all allowed fields.

**Input**
```json
{"id":"C1","name":"Ravi","role":"USER","internalScore":99,"debug":"x"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> ["id","name","role"] contains key)
```

**Expected output**
```json
{"id":"C1","name":"Ravi","role":"USER"}
```

**Explanation:** An explicit allow-list controls the external contract.

**Common mistake:** Removing only currently known internal fields and accidentally exposing future ones.

**Interview tip:** Explain allow-list versus deny-list design.

---

## DW-M120 — Build a query string from selected fields
**Difficulty:** Medium  
**Topic:** filterObject + pluck + joinBy

**Question:** Build `page=2&limit=20` from an object containing unrelated metadata.

**Input**
```json
{"page":2,"limit":20,"debug":true}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
(payload filterObject ((value, key) -> ["page","limit"] contains key))
  pluck ((value, key) -> key ++ "=" ++ (value as String))
  joinBy "&"
```

**Expected output**
```json
"page=2&limit=20"
```

**Explanation:** The object is allow-listed, converted to key-value strings, and joined.

**Common mistake:** Including debug or internal fields in the query string.

**Interview tip:** Mention URL encoding when values can contain reserved characters.

---

## DW-M121 — Count records by a normalized status
**Difficulty:** Medium  
**Topic:** groupBy + lower

**Question:** Count statuses case-insensitively.

**Input**
```json
["PAID","paid","Pending","PAID"]
```

**DataWeave**
```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
(payload groupBy lower($)) mapObject ((items, key) -> {(key): sizeOf(items)})
```

**Expected output**
```json
{"paid":3,"pending":1}
```

**Explanation:** Normalization is part of the grouping criterion, so case variants share a bucket.

**Common mistake:** Grouping raw values and then trying to merge differently cased keys later.

**Interview tip:** Normalize at the boundary of the grouping operation.

---

## DW-M122 — Build a summary with total and average
**Difficulty:** Medium  
**Topic:** sum + avg

**Question:** Return total and average transaction amount, including safe handling for an empty array.

**Input**
```json
{"amounts":[100,200,300]}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  total: sum(payload.amounts),
  average: if (isEmpty(payload.amounts)) null else avg(payload.amounts)
}
```

**Expected output**
```json
{"total":600,"average":200}
```

**Explanation:** Total and average are calculated independently, with an explicit empty-input rule for average.

**Common mistake:** Assuming every aggregation has the same empty-input behavior.

**Interview tip:** Always discuss empty collections for aggregate functions.

---

## DW-M123 — Convert a nested object to flat key/value rows
**Difficulty:** Medium  
**Topic:** pluck + flatten

**Question:** Turn department objects into rows containing department, metric, and value.

**Input**
```json
[
  {"department":"IT","metrics":{"open":4,"closed":8}},
  {"department":"HR","metrics":{"open":2,"closed":5}}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
flatten(
  payload map ((dept) ->
    dept.metrics pluck ((value, key) -> {
      department: dept.department,
      metric: key,
      value: value
    })
  )
)
```

**Expected output**
```json
[
  {"department":"IT","metric":"open","value":4},
  {"department":"IT","metric":"closed","value":8},
  {"department":"HR","metric":"open","value":2},
  {"department":"HR","metric":"closed","value":5}
]
```

**Explanation:** Each department creates an array of metric rows and `flatten` removes the outer nesting.

**Common mistake:** Flattening more levels than intended.

**Interview tip:** State the array nesting depth before choosing `flatten`.

---

## DW-M124 — Build a compact audit message
**Difficulty:** Medium  
**Topic:** string formatting

**Question:** Build an audit message from an event ID, action, and actor.

**Input**
```json
{"eventId":"E1","action":"UPDATE","actor":"ravi"}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
"event=" ++ payload.eventId ++ "; action=" ++ payload.action ++ "; actor=" ++ payload.actor
```

**Expected output**
```json
"event=E1; action=UPDATE; actor=ravi"
```

**Explanation:** Explicit labels make the generated audit message readable and deterministic.

**Common mistake:** Depending on object serialization order for an audit contract.

**Interview tip:** Use explicit formatting when the message is consumed by humans or log processors.

---

## DW-M125 — Re-key an array while preserving selected fields
**Difficulty:** Medium  
**Topic:** mapObject + dynamic keys

**Question:** Create an object keyed by product code containing only price and active status.

**Input**
```json
[
  {"code":"P1","price":10,"active":true,"internal":"x"},
  {"code":"P2","price":20,"active":false,"internal":"y"}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload reduce ((item, acc = {}) ->
  acc ++ {(item.code): {price: item.price, active: item.active}}
)
```

**Expected output**
```json
{
  "P1":{"price":10,"active":true},
  "P2":{"price":20,"active":false}
}
```

**Explanation:** The transformation changes the collection shape from an array to a keyed object and projects only contract fields.

**Common mistake:** Copying the complete source record and exposing internal fields.

**Interview tip:** Explain both shape conversion and field projection.
