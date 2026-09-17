# New Critical DataWeave Gap Additions — Verified Non-Duplicate Set

> Additive set. These questions target function-level and integration-level gaps not represented by the repository's previously indexed question titles/results. They deliberately use different business objectives rather than renaming existing examples.

## DW-G18-001 — Stop processing at the first threshold with `takeWhile`
**Difficulty:** Advanced  
**Topic:** `takeWhile`

**Question:** Given transaction amounts `[100, 200, 300, 700, 50]`, keep the leading amounts while each amount is below `500`. Do not continue scanning after the first amount that fails.

**Input**
```json
[100, 200, 300, 700, 50]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload takeWhile ($ < 500)
```

**Expected Output**
```json
[100, 200, 300]
```

**Explanation:** `takeWhile` keeps the leading elements while the condition remains true; it stops at the first failure.

**Common mistake:** Using `filter`, which would incorrectly include `50` after `700`.

**Interview tip:** Know the semantic difference between filtering the entire collection and taking a contiguous prefix.

---

## DW-G18-002 — Skip leading records until a condition fails with `dropWhile`
**Difficulty:** Advanced  
**Topic:** `dropWhile`

**Question:** Remove leading zero-balance records until the first non-zero balance is encountered. Keep everything from that record onward.

**Input**
```json
[
  {"id":"A1","balance":0},
  {"id":"A2","balance":0},
  {"id":"A3","balance":250},
  {"id":"A4","balance":0}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload dropWhile ($.balance == 0)
```

**Expected Output**
```json
[
  {"id":"A3","balance":250},
  {"id":"A4","balance":0}
]
```

**Explanation:** `dropWhile` removes only the leading elements satisfying the predicate.

**Common mistake:** Replacing it with `filter ($.balance != 0)`, which would also remove later zero balances.

---

## DW-G18-003 — Extract a bounded array range with `slice`
**Difficulty:** Medium  
**Topic:** `slice`

**Question:** From a zero-based transaction list, return elements at indexes 2 through 4.

**Input**
```json
["T1","T2","T3","T4","T5","T6"]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload[2 to 4]
```

**Expected Output**
```json
["T3","T4","T5"]
```

**Explanation:** A range selector extracts a contiguous section using zero-based indexes.

**Common mistake:** Assuming the starting index is one-based.

---

## DW-G18-004 — Count occurrences by normalized status with `countBy`
**Difficulty:** Advanced  
**Topic:** `countBy`

**Question:** Count orders by status after treating status values case-insensitively.

**Input**
```json
[
  {"id":"O1","status":"paid"},
  {"id":"O2","status":"PAID"},
  {"id":"O3","status":"pending"},
  {"id":"O4","status":"Paid"}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload map $.status map lower($) countBy ($)
```

**Expected Output**
```json
{
  "paid": 3,
  "pending": 1
}
```

**Explanation:** The statuses are normalized first, then `countBy` counts each resulting value.

**Common mistake:** Counting before normalization, which creates separate keys for `paid`, `PAID`, and `Paid`.

---

## DW-G18-005 — Verify that every required object entry is populated
**Difficulty:** Advanced  
**Topic:** `everyEntry`

**Question:** Validate that every required field in an object is a non-empty string.

**Input**
```json
{
  "name":"Ravi",
  "email":"ravi@example.com",
  "city":"Vizag"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload everyEntry ((value, key) ->
  value is String and !isEmpty(trim(value))
)
```

**Expected Output**
```json
true
```

**Explanation:** `everyEntry` evaluates a predicate against every key/value entry of an object.

**Common mistake:** Using `every` for an object when the requirement is explicitly entry-based validation.

---

## DW-G18-006 — Check whether an array contains a required permission
**Difficulty:** Medium  
**Topic:** `contains`

**Question:** Determine whether a user has the `TRANSFER` permission.

**Input**
```json
["VIEW","TRANSFER","STATEMENT"]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload contains "TRANSFER"
```

**Expected Output**
```json
true
```

**Explanation:** `contains` tests whether the collection contains the requested value.

**Common mistake:** Using a string-specific search approach when the input is an array.

---

## DW-G18-007 — Locate the first occurrence with `indexOf`
**Difficulty:** Medium  
**Topic:** `indexOf`

**Question:** Find the zero-based position of transaction `T300`.

**Input**
```json
["T100","T200","T300","T400"]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload indexOf "T300"
```

**Expected Output**
```json
2
```

**Explanation:** `indexOf` returns the first matching index.

**Common mistake:** Returning the ordinal position as one-based `3` instead of the zero-based index `2`.

---

## DW-G18-008 — Return the first matching object with `find`
**Difficulty:** Medium  
**Topic:** `find`

**Question:** Return the first order whose amount is greater than `1000`.

**Input**
```json
[
  {"id":"O1","amount":500},
  {"id":"O2","amount":1500},
  {"id":"O3","amount":2000}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload find ($.amount > 1000)
```

**Expected Output**
```json
{"id":"O2","amount":1500}
```

**Explanation:** `find` returns the first element satisfying the predicate rather than all matches.

**Common mistake:** Using `filter`, which returns an array of all matching records.

---

## DW-G18-009 — Return the index of the first matching object with `findIndex`
**Difficulty:** Medium  
**Topic:** `findIndex`

**Question:** Find the first position where an order has `status = "FAILED"`.

**Input**
```json
[
  {"id":"O1","status":"PAID"},
  {"id":"O2","status":"PENDING"},
  {"id":"O3","status":"FAILED"}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload findIndex ($.status == "FAILED")
```

**Expected Output**
```json
2
```

**Explanation:** `findIndex` returns the zero-based index of the first matching element.

**Common mistake:** Returning the object instead of its index.

---

## DW-G18-010 — Safely obtain the first and last transaction
**Difficulty:** Medium  
**Topic:** `first` / `last`

**Question:** Return an object containing the first and last transaction IDs.

**Input**
```json
[
  {"id":"T1"},
  {"id":"T2"},
  {"id":"T3"}
]
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
{
  firstId: (payload[0]).id,
  lastId: (payload[-1]).id
}
```

**Expected Output**
```json
{
  "firstId":"T1",
  "lastId":"T3"
}
```

**Explanation:** Index selectors provide explicit first/last access without introducing a different transformation objective.

**Common mistake:** Treating `-1` as an invalid index in DataWeave.

---

## DW-G18-011 — Pair two arrays positionally
**Difficulty:** Advanced  
**Topic:** `zip`

**Question:** Pair employee IDs with their corresponding departments by position.

**Input**
```json
{
  "ids":["E1","E2","E3"],
  "departments":["IT","HR","FINANCE"]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
zip(payload.ids, payload.departments)
```

**Expected Output**
```json
[
  ["E1","IT"],
  ["E2","HR"],
  ["E3","FINANCE"]
]
```

**Explanation:** `zip` combines corresponding positions from two arrays.

**Common mistake:** Joining arrays by a business key when the requirement explicitly says positional pairing.

---

## DW-G18-012 — Transform two arrays while pairing positions with `zipWith`
**Difficulty:** Advanced  
**Topic:** `zipWith`

**Question:** Combine product IDs and quantities into order-line objects by position.

**Input**
```json
{
  "ids":["P1","P2","P3"],
  "quantities":[2,5,1]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
zipWith(payload.ids, payload.quantities, (id, qty) -> {
  productId: id,
  quantity: qty
})
```

**Expected Output**
```json
[
  {"productId":"P1","quantity":2},
  {"productId":"P2","quantity":5},
  {"productId":"P3","quantity":1}
]
```

**Explanation:** `zipWith` combines corresponding elements while applying a transformation function.

**Common mistake:** Performing a nested `map` and accidentally creating a Cartesian product.

---

## DW-G18-013 — Produce an array of values from an object without rebuilding keys
**Difficulty:** Medium  
**Topic:** object-to-array projection

**Question:** Convert a product-price lookup object into an array of price values.

**Input**
```json
{
  "P1":100,
  "P2":250,
  "P3":75
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload pluck $ 
```

**Expected Output**
```json
[100,250,75]
```

**Explanation:** `pluck` projects object values into an array.

**Common mistake:** Applying `map` directly to an object.

---

## DW-G18-014 — Build key/value records from an object
**Difficulty:** Advanced  
**Topic:** `pluck` with key and value

**Question:** Convert a status-to-count object into records suitable for a CSV-style mapping.

**Input**
```json
{
  "PAID":12,
  "PENDING":4,
  "FAILED":2
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
payload pluck ((value, key) -> {
  status: key,
  count: value
})
```

**Expected Output**
```json
[
  {"status":"PAID","count":12},
  {"status":"PENDING","count":4},
  {"status":"FAILED","count":2}
]
```

**Explanation:** `pluck` can turn each object entry into a custom array element.

**Common mistake:** Forgetting that the callback receives value first and key second.

---

## DW-G18-015 — Normalize whitespace without changing internal content
**Difficulty:** Medium  
**Topic:** whitespace normalization

**Question:** Normalize a user-entered reference by trimming leading/trailing whitespace and collapsing repeated internal whitespace.

**Input**
```text
  BANK   TRANSFER   001  
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
trim(payload) replace /\\s+/ with " "
```

**Expected Output**
```json
"BANK TRANSFER 001"
```

**Explanation:** `trim` removes outer whitespace and the regex replacement collapses runs of whitespace to one space.

**Common mistake:** Calling only `trim`, which does not collapse internal whitespace.

---

## DW-G18-016 — Create a deterministic canonical key before comparison
**Difficulty:** Advanced  
**Topic:** canonicalization

**Question:** Build a comparison key from customer email and phone so that surrounding whitespace and email case do not cause false differences.

**Input**
```json
{
  "email":" Ravi@Example.COM ",
  "phone":" 999-888-7777 "
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
---
(lower(trim(payload.email)) ++ "|" ++ trim(payload.phone))
```

**Expected Output**
```json
"ravi@example.com|999-888-7777"
```

**Explanation:** Canonicalization creates a deterministic comparison representation before reconciliation or duplicate detection.

**Common mistake:** Comparing raw source values and treating formatting-only differences as business changes.

---

## DW-G18-017 — Compare two datasets and emit only changed records
**Difficulty:** Advanced  
**Topic:** reconciliation / change detection

**Question:** Given old and new customer records, return customers whose balance changed, matching by customer ID.

**Input**
```json
{
  "old":[
    {"id":"C1","balance":100},
    {"id":"C2","balance":200}
  ],
  "new":[
    {"id":"C1","balance":100},
    {"id":"C2","balance":250}
  ]
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var oldById = payload.old reduce ((item, acc = {}) ->
  acc ++ {(item.id): item}
)
---
payload.new filter ((item) ->
  oldById[item.id]?.balance != item.balance
)
```

**Expected Output**
```json
[
  {"id":"C2","balance":250}
]
```

**Explanation:** The old dataset is indexed by ID, then the new dataset is filtered for changed balances.

**Common mistake:** Comparing arrays by position rather than by the business key.

---

## DW-G18-018 — Generate a minimal patch from two objects
**Difficulty:** Advanced  
**Topic:** field-level change detection

**Question:** Compare an old and new customer object and return only fields whose values changed.

**Input**
```json
{
  "old":{"name":"Ravi","city":"Vizag","age":25},
  "new":{"name":"Ravi","city":"Hyderabad","age":26}
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var old = payload.old
var updated = payload.new
---
updated filterObject ((value, key) -> old[key] != value)
```

**Expected Output**
```json
{
  "city":"Hyderabad",
  "age":26
}
```

**Explanation:** `filterObject` turns a full object into a field-level change set.

**Common mistake:** Returning the entire new object and calling it a patch.

---

## DW-G18-019 — Validate that all required values exist before mapping
**Difficulty:** Advanced  
**Topic:** validation gate

**Question:** Return `VALID` only when `name`, `email`, and `mobile` are present and non-empty.

**Input**
```json
{
  "name":"Ravi",
  "email":"ravi@example.com",
  "mobile":"9999999999"
}
```

**DataWeave**
```dataweave
%dw 2.0
output application/json
var required = {
  name: payload.name default "",
  email: payload.email default "",
  mobile: payload.mobile default ""
}
---
if (required everyEntry ((value, key) ->
      value is String and !isEmpty(trim(value))))
  "VALID"
else
  "INVALID"
```

**Expected Output**
```json
"VALID"
```

**Explanation:** The validation object is normalized first, then every required entry is checked consistently.

**Common mistake:** Validating only whether the keys exist and accepting empty strings.

---

## DW-G18-020 — Avoid accidental Cartesian expansion when enriching records
**Difficulty:** Advanced  
**Topic:** transformation design / performance

**Question:** Explain why nested `map` over two unrelated arrays can produce a Cartesian expansion, and describe the safer pattern when records must be matched by ID.

**Answer:**

A nested transformation such as:

```dataweave
payload.customers flatMap ((customer) ->
  payload.accounts map ((account) -> {
    customerId: customer.id,
    accountId: account.id
  })
)
```

creates one result for every customer/account combination. If there are 100 customers and 100 accounts, it can produce 10,000 combinations.

For a business-key enrichment, first index the lookup data by the key and then perform one lookup per source record, for example:

```dataweave
var accountsByCustomer = payload.accounts reduce ((item, acc = {}) ->
  acc ++ {(item.customerId): item}
)
---
payload.customers map ((customer) ->
  customer ++ {
    account: accountsByCustomer[customer.id]
  }
)
```

**Interview tip:** Distinguish a deliberate Cartesian product from a key-based join. This is both a correctness and performance issue.
