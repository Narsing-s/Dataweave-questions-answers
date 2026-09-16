# Advanced DataWeave Practice — 2025-Inspired Expert Chapter

> **Important:** This is an **original practice chapter** created from the topic areas visible in the referenced 2025 practice article. It does **not** reproduce the article's questions, wording, answers, or code verbatim. It expands the ideas into new enterprise-style exercises and adds explanations, edge cases, and interview guidance.

## What this chapter covers

- `map`, indexed mapping, and object-key transformations
- `filter`, `filterObject`, and nested predicates
- `pluck`, `keysOf`, `valuesOf`, and `entriesOf`
- `reduce` for stateful aggregation
- `groupBy` and grouped reporting
- joins and dataset reconciliation
- `distinctBy` and business-key deduplication
- dates, nulls, strings, type conversion, and validation
- advanced banking/API transformation scenarios

---

## 1. Mapping & Projection

### Q1 — Calculate a risk-adjusted amount
**Input**
```json
[{"amount":1000,"risk":0.10},{"amount":2500,"risk":0.25}]
```

**Answer**
```dataweave
%dw 2.0
output application/json
---
payload map {
  amount: $.amount,
  risk: $.risk,
  riskAdjusted: $.amount * (1 + $.risk)
}
```

**Output**
```json
[{"amount":1000,"risk":0.1,"riskAdjusted":1100},{"amount":2500,"risk":0.25,"riskAdjusted":3125}]
```

**Why:** The transformation projects each source record into a new business model instead of mutating the input.

### Q2 — Add a position number to transaction records
```dataweave
%dw 2.0
output application/json
---
payload map ((item, index) -> item ++ {position: index + 1})
```

For `[ {"id":"T1"}, {"id":"T2"} ]`, the result contains positions `1` and `2`.

**Interview point:** Know the two-parameter form of `map` when the index matters.

### Q3 — Convert a customer list into API summaries
```dataweave
%dw 2.0
output application/json
---
payload map {
  id: $.customerId,
  displayName: upper(trim($.firstName)) ++ " " ++ upper(trim($.lastName)),
  city: $.address.city default "UNKNOWN"
}
```

**Key lesson:** Projection is also the first line of API contract control: expose only fields the consumer needs.

### Q4 — Create dynamic labels from object fields
**Input:** `{ "first":"Ravi", "last":"Beesetti" }`

```dataweave
%dw 2.0
output application/json
---
{
  ("name_" ++ "first"): payload.first,
  ("name_" ++ "last"): payload.last
}
```

**Output:** `{ "name_first":"Ravi", "name_last":"Beesetti" }`

**Key lesson:** Parentheses allow expressions to generate object keys.

### Q5 — Convert an array of codes into lookup objects
```dataweave
%dw 2.0
output application/json
---
payload map (code, i) -> {
  code: upper(code),
  sequence: i,
  active: true
}
```

Use this pattern when an upstream system sends compact codes but the downstream API requires richer objects.

---

## 2. Filtering & Validation

### Q6 — Keep transactions that are both successful and high value
```dataweave
%dw 2.0
output application/json
---
payload filter ($.status == "SUCCESS" and $.amount >= 10000)
```

**Why:** Multiple predicates can be combined directly. Avoid two passes when one readable predicate is sufficient.

### Q7 — Filter an object using a value rule
**Input:** `{ "a":10, "b":75, "c":20, "d":100 }`

```dataweave
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> value >= 50)
```

**Output:** `{ "b":75, "d":100 }`

### Q8 — Keep customers with complete contact information
```dataweave
%dw 2.0
output application/json
---
payload filter (
  !isEmpty(trim(($.email default "") as String)) and
  !isEmpty(trim(($.mobile default "") as String))
)
```

**Edge case:** `default ""` prevents missing fields from becoming a validation failure caused by null handling.

### Q9 — Build a validation result instead of dropping bad records
```dataweave
%dw 2.0
output application/json
---
payload map (item) -> {
  id: item.id,
  valid: !isEmpty(item.name default "") and ((item.age default 0) >= 18),
  errors: [
    if (isEmpty(item.name default "")) "NAME_REQUIRED" else null,
    if ((item.age default 0) < 18) "AGE_INVALID" else null
  ] filter ($ != null)
}
```

**Interview point:** Filtering removes evidence. Validation reports preserve it.

### Q10 — Reject transactions with invalid amounts
```dataweave
%dw 2.0
output application/json
---
payload filter (($.amount default 0) > 0)
```

Use explicit defaults when the upstream schema is not guaranteed.

---

## 3. Pluck & Object Introspection

### Q11 — Build a sorted list of field names
```dataweave
%dw 2.0
output application/json
---
keysOf(payload) orderBy $
```

**Why:** `keysOf` gives the object schema at runtime, useful for metadata-driven integrations.

### Q12 — Extract values while ignoring nulls
```dataweave
%dw 2.0
output application/json
---
valuesOf(payload) filter ($ != null)
```

### Q13 — Produce audit entries from an object
```dataweave
%dw 2.0
output application/json
---
entriesOf(payload) map (entry) -> {
  field: entry.key,
  value: entry.value,
  present: entry.value != null
}
```

### Q14 — Convert an object into a two-column export
```dataweave
%dw 2.0
output application/csv header=true
---
entriesOf(payload) map (e) -> {
  field: e.key,
  value: e.value
}
```

**Use case:** Generic audit/export utilities where field names are not known at design time.

### Q15 — Find fields whose names start with `x_`
```dataweave
%dw 2.0
output application/json
---
keysOf(payload) filter ($ startsWith "x_")
```

---

## 4. Reduce & Stateful Aggregation

### Q16 — Build a running account balance
**Input**
```json
[{"type":"CREDIT","amount":1000},{"type":"DEBIT","amount":250},{"type":"CREDIT","amount":500}]
```

**Answer**
```dataweave
%dw 2.0
output application/json
---
payload reduce ((item, balance = 0) ->
  if (item.type == "CREDIT") balance + item.amount
  else balance - item.amount
)
```

**Output:** `1250`

### Q17 — Produce a transaction count and total together
```dataweave
%dw 2.0
output application/json
---
payload reduce ((item, acc = {count: 0, total: 0}) -> {
  count: acc.count + 1,
  total: acc.total + item.amount
})
```

### Q18 — Find the first negative balance while scanning records
Use `reduce` with an accumulator containing both the current balance and a flag. Stop changing the flag after the first negative value.

```dataweave
%dw 2.0
output application/json
---
payload reduce ((item, acc = {balance: 0, crossed: false}) -> do {
  var next = acc.balance + item.change
  ---
  {
    balance: next,
    crossed: acc.crossed or next < 0
  }
})
```

**Why:** This demonstrates an accumulator with multiple pieces of state.

### Q19 — Calculate minimum and maximum in one pass
```dataweave
%dw 2.0
output application/json
---
payload reduce ((n, acc = {min: null, max: null}) -> {
  min: if (acc.min == null or n < acc.min) n else acc.min,
  max: if (acc.max == null or n > acc.max) n else acc.max
})
```

### Q20 — Build a frequency table with reduce
```dataweave
%dw 2.0
output application/json
---
payload reduce ((word, acc = {}) ->
  acc ++ {(word): ((acc[word] default 0) + 1)}
)
```

**Interview point:** `reduce` is strongest when each iteration depends on accumulated state, not merely when another simpler function already expresses the operation.

---

## 5. Grouped Reporting

### Q21 — Group orders by region
```dataweave
%dw 2.0
output application/json
---
payload groupBy (($.region default "UNKNOWN"))
```

### Q22 — Produce a region summary from grouped orders
```dataweave
%dw 2.0
output application/json
---
(payload groupBy $.region) mapObject ((orders, region) -> {
  region: region,
  orderCount: sizeOf(orders),
  total: orders.amount reduce ((n, s = 0) -> s + n)
})
```

### Q23 — Group events by month
```dataweave
%dw 2.0
output application/json
---
payload groupBy ((($.timestamp as DateTime) as String {format: "yyyy-MM"}))
```

### Q24 — Group customers by normalized city
```dataweave
%dw 2.0
output application/json
---
payload groupBy upper(trim($.city default "UNKNOWN"))
```

**Key lesson:** Normalize the grouping key before grouping, otherwise `vizag`, `Vizag`, and `VIZAG` become separate buckets.

### Q25 — Create a grouped status dashboard
```dataweave
%dw 2.0
output application/json
---
(payload groupBy $.status) mapObject ((items, status) -> {
  status: status,
  count: sizeOf(items)
})
```

---

## 6. Joins & Reconciliation

### Q26 — Enrich accounts with customer names
```dataweave
%dw 2.0
output application/json
var customers = payload.customers
var accounts = payload.accounts
---
accounts map (a) -> do {
  var c = customers filter ($.customerId == a.customerId) [0]
  ---
  a ++ {customerName: c.name default "UNKNOWN"}
}
```

**Why:** The lookup is explicit and preserves accounts that have no matching customer.

### Q27 — Identify records missing from the second dataset
```dataweave
%dw 2.0
output application/json
var leftIds = payload.left map $.id
var rightIds = payload.right map $.id
---
leftIds filter !(rightIds contains $)
```

**Use case:** Reconciliation between database extracts and an external service.

### Q28 — Find records existing in both datasets
```dataweave
%dw 2.0
output application/json
var rightIds = payload.right map $.id
---
payload.left filter (rightIds contains $.id)
```

### Q29 — Report amount differences between two systems
```dataweave
%dw 2.0
output application/json
var right = payload.systemB
---
payload.systemA map (a) -> do {
  var b = right filter ($.id == a.id) [0]
  ---
  {
    id: a.id,
    sourceAmount: a.amount,
    targetAmount: b.amount default null,
    difference: if (b == null) null else a.amount - b.amount
  }
}
```

### Q30 — Create a left-style enrichment with a default status
```dataweave
%dw 2.0
output application/json
var lookup = payload.statuses
---
payload.accounts map (a) ->
  a ++ {
    status: ((lookup filter ($.accountId == a.accountId))[0].status default "NOT_FOUND")
  }
```

**Interview point:** Always define what should happen when the right-side dataset has zero, one, or multiple matches.

---

## 7. Deduplication & Business Keys

### Q31 — Keep the latest customer record by ID
Assume the array is ordered from oldest to newest.

```dataweave
%dw 2.0
output application/json
---
(payload distinctBy $.customerId) // use only when the first occurrence is desired
```

**Advanced note:** If the source order is newest-first, this retains the newest record. If source ordering is not guaranteed, establish the order first and then deduplicate.

### Q32 — Deduplicate case-insensitive email addresses
```dataweave
%dw 2.0
output application/json
---
payload distinctBy lower(trim($.email default ""))
```

### Q33 — Deduplicate using a composite business key
```dataweave
%dw 2.0
output application/json
---
payload distinctBy (
  upper(trim($.bankCode)) ++ "|" ++ trim($.accountType) ++ "|" ++ trim($.customerId)
)
```

### Q34 — Deduplicate transactions while retaining a complete record
Use a normalized transaction identifier as the selector rather than deduplicating on the entire object.

```dataweave
%dw 2.0
output application/json
---
payload distinctBy $.transactionReference
```

**Why:** Business identity and object equality are different concepts.

### Q35 — Merge two feeds and then apply business-key uniqueness
```dataweave
%dw 2.0
output application/json
---
(payload.feedA ++ payload.feedB) distinctBy upper(trim($.externalId))
```

---

## 8. Advanced String & Date Transformations

### Q36 — Normalize a full name
```dataweave
%dw 2.0
output application/json
---
{
  name: trim(payload.firstName default "") ++ " " ++ trim(payload.lastName default "")
}
```

### Q37 — Extract the year from a date
```dataweave
%dw 2.0
output application/json
---
(payload.date as Date).year
```

### Q38 — Convert a timestamp into an API display value
```dataweave
%dw 2.0
output application/json
---
{
  display: (payload as DateTime) as String {format: "dd-MMM-yyyy HH:mm:ss"}
}
```

### Q39 — Normalize phone numbers to digits only
```dataweave
%dw 2.0
output application/json
---
(payload.phone replace /[^0-9]/ with "")
```

### Q40 — Mask a sensitive account reference
```dataweave
%dw 2.0
output application/json
var value = payload.accountNumber as String
---
{
  masked: "****" ++ (value[-4 to -1])
}
```

**Security note:** Masking is presentation protection, not encryption.

---

## 9. Null, Missing & Empty Data

### Q41 — Apply a default only when a field is absent/null
```dataweave
%dw 2.0
output application/json
---
{
  nickname: payload.nickname default "Not Provided"
}
```

### Q42 — Preserve zero while defaulting missing amounts
```dataweave
%dw 2.0
output application/json
---
{
  amount: payload.amount default 0
}
```

**Important:** `0` is a real value; do not replace it merely because it is falsy in another programming language's mental model.

### Q43 — Return a clean empty result for a missing list
```dataweave
%dw 2.0
output application/json
---
(payload.transactions default []) map {
  id: $.id,
  amount: $.amount
}
```

### Q44 — Distinguish missing, null, empty String, and empty array
Create a diagnostic object using explicit checks rather than assuming all four cases are equivalent.

```dataweave
%dw 2.0
output application/json
---
{
  missingOrNull: payload.value == null,
  emptyString: (payload.value default "") == "",
  emptyArray: (payload.items default []) == []
}
```

**Interview point:** Null-handling bugs are common because missing data and empty data can have different business meanings.

---

## 10. Type Conversion & Runtime Safety

### Q45 — Convert numeric text only after validation
```dataweave
%dw 2.0
output application/json
---
{
  value: if (payload matches /^[0-9]+$/) payload as Number else null
}
```

### Q46 — Handle a field that can be Number or String
```dataweave
%dw 2.0
output application/json
---
payload match {
  case is Number -> payload
  case is String -> payload as Number
  else -> null
}
```

### Q47 — Normalize status values with `match`
```dataweave
%dw 2.0
output application/json
---
payload match {
  case "A" -> "ACTIVE"
  case "I" -> "INACTIVE"
  case "S" -> "SUSPENDED"
  else -> "UNKNOWN"
}
```

### Q48 — Return a typed API error for unsupported input
```dataweave
%dw 2.0
output application/json
---
{
  success: false,
  error: {
    code: "UNSUPPORTED_VALUE",
    message: "Received unsupported input type",
    receivedType: typeOf(payload) as String
  }
}
```

**Key lesson:** A predictable error contract is more useful to API consumers than an unstructured transformation failure.

---

## 11. Enterprise Banking Scenarios

### Q49 — Build an account summary without exposing the account number
```dataweave
%dw 2.0
output application/json
---
{
  customerName: payload.customerName,
  bankName: payload.bankName,
  balance: payload.balance,
  accountType: payload.accountType
}
```

**Security rule:** Never include sensitive identifiers merely because they exist in the source.

### Q50 — Create a debit/credit transaction summary
```dataweave
%dw 2.0
output application/json
var credits = payload filter ($.type == "CREDIT")
var debits = payload filter ($.type == "DEBIT")
---
{
  creditCount: sizeOf(credits),
  creditTotal: (credits map $.amount) reduce ((n, s = 0) -> s + n),
  debitCount: sizeOf(debits),
  debitTotal: (debits map $.amount) reduce ((n, s = 0) -> s + n)
}
```

### Q51 — Produce an audit-friendly account change event
```dataweave
%dw 2.0
output application/json
---
{
  eventType: "ACCOUNT_UPDATED",
  accountId: payload.accountId,
  changedFields: keysOf(payload.changes),
  source: payload.source default "UNKNOWN"
}
```

### Q52 — Create a normalized beneficiary object
```dataweave
%dw 2.0
output application/json
---
{
  name: trim(payload.name),
  bankCode: upper(trim(payload.bankCode)),
  ifsc: upper(trim(payload.ifsc)),
  mobile: payload.mobile replace /[^0-9]/ with ""
}
```

### Q53 — Validate a transfer request before transformation
```dataweave
%dw 2.0
output application/json
---
{
  valid:
    !isEmpty(payload.beneficiaryId default "") and
    ((payload.amount default 0) > 0) and
    !isEmpty(payload.currency default ""),
  beneficiaryPresent: !isEmpty(payload.beneficiaryId default ""),
  amountValid: (payload.amount default 0) > 0,
  currencyPresent: !isEmpty(payload.currency default "")
}
```

### Q54 — Convert a transaction feed into an API-safe contract
```dataweave
%dw 2.0
output application/json
---
payload map {
  reference: $.transactionReference,
  amount: $.amount,
  currency: $.currency,
  status: $.status,
  timestamp: $.timestamp
}
```

**Why:** Contract mapping should be intentional. Do not pass through internal fields such as database IDs or operational metadata.

---

## 12. Expert Interview Challenges

### Q55 — Reconcile two account extracts and classify each ID
**Requirement:** Return `MATCHED`, `MISSING_IN_B`, or `MISSING_IN_A` for every account ID.

```dataweave
%dw 2.0
output application/json
var a = payload.systemA map $.id
var b = payload.systemB map $.id
var all = (a ++ b) distinctBy $
---
all map (id) -> {
  id: id,
  status: if ((a contains id) and (b contains id)) "MATCHED"
          else if (a contains id) "MISSING_IN_B"
          else "MISSING_IN_A"
}
```

**Why it is advanced:** This combines union, uniqueness, membership tests, and conditional classification.

### Q56 — Produce a field-level difference report
**Requirement:** Compare two objects and report changed values.

```dataweave
%dw 2.0
output application/json
var keys = (keysOf(payload.before) ++ keysOf(payload.after)) distinctBy $
---
keys
  filter (payload.before[$] != payload.after[$])
  map (key) -> {
    field: key,
    before: payload.before[key] default null,
    after: payload.after[key] default null
  }
```

**Output example**
```json
[
  {"field":"city","before":"Vizag","after":"Hyderabad"},
  {"field":"email","before":null,"after":"ravi@example.com"}
]
```

### Q57 — Design a reusable transformation with a local function
**Requirement:** Normalize an array of customer records using one reusable function.

```dataweave
%dw 2.0
output application/json
fun normalizeCustomer(c) = {
  id: trim(c.id as String),
  name: upper(trim(c.name default "")),
  city: upper(trim(c.city default "UNKNOWN"))
}
---
payload map normalizeCustomer($)
```

**Why:** Functions isolate business rules and make transformations easier to test and reuse.

---

# Advanced Practice Checklist

Before considering a DataWeave solution production-ready, verify:

- [ ] Input MIME type is understood.
- [ ] Output MIME type is explicitly defined.
- [ ] Null and missing fields have intentional behavior.
- [ ] Numeric/date coercion is explicit where needed.
- [ ] Sensitive fields are not accidentally exposed.
- [ ] Business keys are normalized before joins/deduplication.
- [ ] Empty arrays and empty objects are handled.
- [ ] Unknown enum/status values have a defined path.
- [ ] The transformation is readable by another developer.
- [ ] Large payload behavior has been considered.
- [ ] Repeated business logic has been moved into functions.
- [ ] Error responses follow the API's documented contract.
- [ ] Test cases include normal, missing, null, empty, invalid, and boundary data.

# Recommended Study Path

**Beginner → Intermediate → Advanced → Expert**

1. Learn `map`, `filter`, `pluck`, and selectors.
2. Add `groupBy`, `distinctBy`, `orderBy`, and `reduce`.
3. Practice joins, dynamic keys, nested transformations, and validation.
4. Learn MIME-aware `read`/`write`, XML namespaces, attributes, and type matching.
5. Build banking/API transformations with security-aware output contracts.
6. Test every transformation with edge cases and production-like payloads.

# Source / Attribution Note

The referenced 2025 blog post is used only as a **topic reference** for this original study chapter. Its individual questions, wording, examples, and answers are not reproduced here. See the source article for the original publication and topic list.
