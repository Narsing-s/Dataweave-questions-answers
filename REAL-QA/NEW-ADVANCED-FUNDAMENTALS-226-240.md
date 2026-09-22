# Advanced DataWeave Q&A — Fundamentals Deep Practice (DW-A226 to DW-A240)

These questions revisit core arrays, nested data, null/default handling, numbers, objects, functions, strings, map, and filter at Advanced difficulty through distinct production-style scenarios. They are not copies of the repository's existing examples.

## DW-A226 — Find the first eligible transaction with firstWith
**Difficulty:** Advanced  
**Topic:** Array fundamentals / firstWith

**Question:** From transactions ordered by priority, return the first transaction that is both approved and above the minimum settlement amount.

**Input**
~~~json
{"minimum":500,"transactions":[{"id":"T1","status":"PENDING","amount":900},{"id":"T2","status":"APPROVED","amount":300},{"id":"T3","status":"APPROVED","amount":750}]}
~~~

**DataWeave**
~~~dw
%dw 2.0
import firstWith from dw::core::Arrays
output application/json
---
payload.transactions firstWith ((tx) ->
  tx.status == "APPROVED" and tx.amount >= payload.minimum
)
~~~

**Expected Output**
~~~json
{"id":"T3","status":"APPROVED","amount":750}
~~~

**Explanation:** firstWith searches in source order and returns the first matching element, or null when no element matches.

**Common Mistake:** Sorting or filtering first when the requirement is to preserve incoming priority order.

**Interview Tip:** Explain why firstWith is preferable when only the first qualifying record is needed.

---

## DW-A227 — Calculate totals inside nested order lines
**Difficulty:** Advanced  
**Topic:** Nested arrays / map / reduce

**Question:** For each order, calculate the total from its nested line items and return a compact order summary.

**Input**
~~~json
{"orders":[{"id":"O100","lines":[{"sku":"A1","qty":2,"price":12.5},{"sku":"B2","qty":3,"price":5}]},{"id":"O101","lines":[{"sku":"C3","qty":4,"price":7.25}]}]}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
payload.orders map ((order) -> {
  id: order.id,
  total: order.lines reduce ((line, total = 0) ->
    total + (line.qty * line.price)
  )
})
~~~

**Expected Output**
~~~json
[{"id":"O100","total":40},{"id":"O101","total":29}]
~~~

**Explanation:** The outer map creates one result per order; the inner reduce collapses each order's nested lines into one numeric total.

**Common Mistake:** Applying one reduce to all orders instead of reducing each order's own lines array.

**Interview Tip:** This demonstrates nested collection processing without imperative loops.

---

## DW-A228 — Apply defaults while calculating a nested invoice
**Difficulty:** Advanced  
**Topic:** Nested data / null / default

**Question:** Calculate an invoice total when optional tax and discount values can be missing or null. Treat missing/null tax and discount as zero.

**Input**
~~~json
{"invoice":{"subtotal":1000,"tax":null,"discount":75}}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
var invoice = payload.invoice
var tax = invoice.tax default 0
var discount = invoice.discount default 0
---
{
  subtotal: invoice.subtotal,
  tax: tax,
  discount: discount,
  total: invoice.subtotal + tax - discount
}
~~~

**Expected Output**
~~~json
{"subtotal":1000,"tax":0,"discount":75,"total":925}
~~~

**Explanation:** default provides a fallback for a value that is absent or null in this expression context.

**Common Mistake:** Performing arithmetic directly against optional fields.

**Interview Tip:** Explain why the fallback is a business rule rather than an automatic data-quality fix.

---

## DW-A229 — Preserve a nested optional object while defaulting one field
**Difficulty:** Advanced  
**Topic:** Null handling / nested objects

**Question:** Return a customer profile while defaulting only a missing/null preferred language. Do not replace the entire nested preferences object.

**Input**
~~~json
{"customer":{"id":"C101","preferences":{"language":null,"currency":"EUR"}}}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{
  id: payload.customer.id,
  preferences: {
    language: payload.customer.preferences.language default "en",
    currency: payload.customer.preferences.currency
  }
}
~~~

**Expected Output**
~~~json
{"id":"C101","preferences":{"language":"en","currency":"EUR"}}
~~~

**Explanation:** Only the nullable leaf value receives a fallback; the other preference remains unchanged.

**Common Mistake:** Replacing the whole preferences object with a default object and losing existing fields.

**Interview Tip:** Default at the smallest required scope so unrelated fields are preserved.

---

## DW-A230 — Filter nested payments and map a reconciliation view
**Difficulty:** Advanced  
**Topic:** Nested arrays / filter + map

**Question:** From each account, return only successful payments above 1000 and expose a reconciliation-friendly shape.

**Input**
~~~json
{"accounts":[{"id":"A1","payments":[{"id":"P1","status":"SUCCESS","amount":1500},{"id":"P2","status":"FAILED","amount":3000},{"id":"P3","status":"SUCCESS","amount":800}]},{"id":"A2","payments":[{"id":"P4","status":"SUCCESS","amount":2200}]}]}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
payload.accounts map ((account) -> {
  accountId: account.id,
  payments: account.payments
    filter ((payment) -> payment.status == "SUCCESS" and payment.amount > 1000)
    map ((payment) -> {
      paymentId: payment.id,
      amount: payment.amount
    })
})
~~~

**Expected Output**
~~~json
[{"accountId":"A1","payments":[{"paymentId":"P1","amount":1500}]},{"accountId":"A2","payments":[{"paymentId":"P4","amount":2200}]}]
~~~

**Explanation:** The outer map keeps account boundaries. Inside each account, filter applies the business rule and map creates the target contract.

**Common Mistake:** Filtering payload.accounts instead of the nested payments collection.

**Interview Tip:** Identify which collection each lambda is operating on.

---

## DW-A231 — Calculate a guarded percentage variance
**Difficulty:** Advanced  
**Topic:** Numbers / conditional calculation

**Question:** Calculate percentage variance between expected and actual amounts. Return 0 when expected is zero.

**Input**
~~~json
{"expected":1250,"actual":1187.5}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
var expected = payload.expected
var actual = payload.actual
---
{
  expected: expected,
  actual: actual,
  variancePercent:
    if (expected == 0)
      0
    else
      round(((actual - expected) / expected) * 100 * 100) / 100
}
~~~

**Expected Output**
~~~json
{"expected":1250,"actual":1187.5,"variancePercent":-5}
~~~

**Explanation:** The denominator is checked before division and the result is rounded to two decimal places.

**Common Mistake:** Dividing before checking for zero.

**Interview Tip:** Discuss zero expected value, negative variance, and rounding requirements.

---

## DW-A232 — Build a weighted score from nested numeric factors
**Difficulty:** Advanced  
**Topic:** Numbers / map / reduce

**Question:** Calculate a weighted customer risk score from factors containing a score and weight.

**Input**
~~~json
{"factors":[{"name":"credit","score":80,"weight":0.5},{"name":"income","score":70,"weight":0.3},{"name":"history","score":90,"weight":0.2}]}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{
  weightedScore:
    payload.factors
      map ((factor) -> factor.score * factor.weight)
      reduce ((value, total = 0) -> total + value)
}
~~~

**Expected Output**
~~~json
{"weightedScore":79}
~~~

**Explanation:** Each factor becomes a weighted contribution and reduce combines the contributions.

**Common Mistake:** Adding raw scores without applying weights.

**Interview Tip:** Separate transformation from aggregation so the calculation is auditable.

---

## DW-A233 — Convert an object of thresholds into normalized numbers
**Difficulty:** Advanced  
**Topic:** Objects / mapObject

**Question:** Normalize configuration thresholds by converting numeric strings to numbers while preserving the original keys.

**Input**
~~~json
{"warning":"70","critical":"90","block":"100"}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
payload mapObject ((value, key) -> {
  (key): value as Number
})
~~~

**Expected Output**
~~~json
{"warning":70,"critical":90,"block":100}
~~~

**Explanation:** mapObject iterates over object key-value pairs, allowing each value to be coerced while retaining the dynamic key.

**Common Mistake:** Using map, which is intended for arrays rather than object key-value pairs.

**Interview Tip:** Explain map versus mapObject versus pluck.

---

## DW-A234 — Remove internal object fields dynamically
**Difficulty:** Advanced  
**Topic:** Objects / filterObject

**Question:** Remove fields beginning with underscore from an object while keeping all public fields.

**Input**
~~~json
{"id":"C1","name":"Ravi","_debugId":"DBG-77","_source":"legacy","status":"ACTIVE"}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
payload filterObject ((value, key) -> !(key startsWith "_"))
~~~

**Expected Output**
~~~json
{"id":"C1","name":"Ravi","status":"ACTIVE"}
~~~

**Explanation:** filterObject evaluates each object entry and retains entries whose key does not start with the internal-field prefix.

**Common Mistake:** Applying array filter directly to an object.

**Interview Tip:** Dynamic field filtering is useful when input contains implementation-only metadata.

---

## DW-A235 — Build a reusable function for conditional normalization
**Difficulty:** Advanced  
**Topic:** Functions / reusable transformation

**Question:** Create a reusable function that normalizes a nullable string and apply it to multiple customer fields.

**Input**
~~~json
{"firstName":"  Ana ","middleName":null,"city":"  hyderabad "}
~~~

**DataWeave**
~~~dw
%dw 2.0
import * from dw::core::Strings
output application/json

fun normalize(value) =
  if (value == null) null
  else upper(trim(value))

---
{
  firstName: normalize(payload.firstName),
  middleName: normalize(payload.middleName),
  city: normalize(payload.city)
}
~~~

**Expected Output**
~~~json
{"firstName":"ANA","middleName":null,"city":"HYDERABAD"}
~~~

**Explanation:** The function centralizes normalization and explicitly preserves null.

**Common Mistake:** Calling string functions on null without defining null behavior.

**Interview Tip:** Reusable functions are valuable when the same business rule appears across multiple fields.

---

## DW-A236 — Normalize a composite reference string
**Difficulty:** Advanced  
**Topic:** Strings / splitBy / joinBy

**Question:** Convert IND / HYD / 00125 into IND-HYD-00125, trimming each segment.

**Input**
~~~json
{"reference":"IND / HYD / 00125"}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
{
  reference:
    ((payload.reference splitBy "/")
      map ((part) -> trim(part)))
      joinBy "-"
}
~~~

**Expected Output**
~~~json
{"reference":"IND-HYD-00125"}
~~~

**Explanation:** The string is split, each segment is normalized, and the array is joined with the required delimiter.

**Common Mistake:** Trimming the whole string only, leaving spaces around internal segments.

**Interview Tip:** This pattern is useful for normalizing identifiers from inconsistent upstream systems.

---

## DW-A237 — Filter and map only complete customer records
**Difficulty:** Advanced  
**Topic:** filter + map / validation

**Question:** Retain only records with a nonblank ID and positive balance, then produce a compact output.

**Input**
~~~json
[{"id":"C1","name":"Ana","balance":1500},{"id":"","name":"Bob","balance":2000},{"id":"C3","name":"Cara","balance":0},{"id":"C4","name":"Dan","balance":700}]
~~~

**DataWeave**
~~~dw
%dw 2.0
import isBlank from dw::core::Strings
output application/json
---
payload
  filter ((customer) ->
    !isBlank(customer.id) and customer.balance > 0
  )
  map ((customer) -> {
    customerId: customer.id,
    availableBalance: customer.balance
  })
~~~

**Expected Output**
~~~json
[{"customerId":"C1","availableBalance":1500},{"customerId":"C4","availableBalance":700}]
~~~

**Explanation:** filter establishes eligibility first; map reshapes only eligible records.

**Common Mistake:** Mapping first and then trying to remove incomplete records.

**Interview Tip:** Separating eligibility from projection makes complex transformations easier to test.

---

## DW-A238 — Map nested beneficiaries after filtering active accounts
**Difficulty:** Advanced  
**Topic:** Nested map + filter

**Question:** For active accounts only, return beneficiary names whose allocation is greater than 25%.

**Input**
~~~json
{"accounts":[{"id":"A1","status":"ACTIVE","beneficiaries":[{"name":"Ana","allocation":60},{"name":"Bob","allocation":20}]},{"id":"A2","status":"CLOSED","beneficiaries":[{"name":"Cara","allocation":100}]}]}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
payload.accounts
  filter ((account) -> account.status == "ACTIVE")
  map ((account) -> {
    accountId: account.id,
    beneficiaries:
      account.beneficiaries
        filter ((beneficiary) -> beneficiary.allocation > 25)
        map ((beneficiary) -> beneficiary.name)
  })
~~~

**Expected Output**
~~~json
[{"accountId":"A1","beneficiaries":["Ana"]}]
~~~

**Explanation:** The first filter selects active accounts; the nested filter applies a separate rule to each account's beneficiaries.

**Common Mistake:** Applying the beneficiary condition to the account object.

**Interview Tip:** Read nested lambdas from the collection outward: accounts first, beneficiaries second.

---

## DW-A239 — Safely map arrays containing null elements
**Difficulty:** Advanced  
**Topic:** Arrays / null-safe map

**Question:** Normalize an array where some elements are null. Preserve null entries instead of failing the transformation.

**Input**
~~~json
{"codes":[" ab12 ",null," cd34 "]}
~~~

**DataWeave**
~~~dw
%dw 2.0
import * from dw::core::Strings
output application/json
---
payload.codes map ((code) ->
  if (code == null) null else upper(trim(code))
)
~~~

**Expected Output**
~~~json
{"codes":["AB12",null,"CD34"]}
~~~

**Explanation:** The lambda explicitly handles null before invoking string functions.

**Common Mistake:** Assuming every array element has the same type.

**Interview Tip:** Advanced mappings should define behavior for null, missing fields, empty strings, and unexpected types.

---

## DW-A240 — Combine object filtering with nested array mapping
**Difficulty:** Advanced  
**Topic:** filterObject + mapObject + nested map

**Question:** From a configuration object, keep only enabled services and return each service's endpoint list.

**Input**
~~~json
{"payments":{"enabled":true,"endpoints":["/pay","/refund"]},"reports":{"enabled":false,"endpoints":["/daily"]},"customers":{"enabled":true,"endpoints":["/customers"]}}
~~~

**DataWeave**
~~~dw
%dw 2.0
output application/json
---
payload
  filterObject ((service) -> service.enabled == true)
  mapObject ((service, name) -> {
    (name): service.endpoints map ((endpoint) -> endpoint)
  })
~~~

**Expected Output**
~~~json
{"payments":["/pay","/refund"],"customers":["/customers"]}
~~~

**Explanation:** filterObject removes disabled service definitions. mapObject preserves each dynamic service name while transforming its nested endpoint array.

**Common Mistake:** Hard-coding service names and losing the dynamic configuration model.

**Interview Tip:** This combines object-level and array-level transformations, a useful configuration-driven integration pattern.

---

## Coverage Note

This set covers Advanced practice for array fundamentals, nested data, null/default handling, numbers, objects, reusable functions, strings, map, filter, mapObject, and filterObject. The scenarios are intentionally distinct from existing repository examples rather than simple rewordings.
