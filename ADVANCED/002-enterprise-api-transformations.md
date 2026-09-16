# Advanced DataWeave — Enterprise API Transformations

## DW-A016 — Calculate available balance after pending debits

**Question:** Subtract all pending debit amounts from the account balance.

### Input
```json
{"balance":5000,"transactions":[{"type":"DEBIT","status":"PENDING","amount":700},{"type":"CREDIT","status":"PENDING","amount":300},{"type":"DEBIT","status":"POSTED","amount":400}]}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
var pendingDebits = payload.transactions filter ($.type == "DEBIT" and $.status == "PENDING")
---
{ availableBalance: payload.balance - sum(pendingDebits map $.amount) }
```
### Expected Output
```json
{"availableBalance":4300}
```
### Explanation
The transformation isolates only pending debit transactions, sums their amounts, and subtracts that reservation from the current balance.
### Common Mistakes
- Subtracting posted debits twice.
- Including pending credits as debits.
- Forgetting an empty pending-debit collection case.
### Interview Tip
Break complex financial mappings into named variables so each business rule can be tested independently.

## DW-A017 — Normalize a nested customer response

**Question:** Convert a nested customer profile into a flat API response.

### Input
```json
{"customer":{"id":"C10","profile":{"firstName":"Ravi","lastName":"Kumar"},"address":{"city":"Hyderabad","country":"IN"}}}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{
  id: payload.customer.id,
  fullName: payload.customer.profile.firstName ++ " " ++ payload.customer.profile.lastName,
  city: payload.customer.address.city,
  country: payload.customer.address.country
}
```
### Expected Output
```json
{"id":"C10","fullName":"Ravi Kumar","city":"Hyderabad","country":"IN"}
```
### Explanation
Selectors retrieve nested values and the target object defines the external API contract.
### Common Mistakes
- Passing the internal object through unchanged.
- Building the name with missing-space or null-handling errors.
### Interview Tip
Explain why the transformation layer protects the API from internal source-model changes.

## DW-A018 — Classify payment risk

**Question:** Mark a payment `REVIEW` when amount exceeds 100000 or the customer is inactive; otherwise mark it `NORMAL`.

### Input
```json
{"amount":150000,"customerStatus":"ACTIVE"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{
  risk: if (payload.amount > 100000 or payload.customerStatus != "ACTIVE") "REVIEW" else "NORMAL"
}
```
### Expected Output
```json
{"risk":"REVIEW"}
```
### Explanation
Two business conditions are combined with `or`; if either condition is true the payment is classified for review.
### Common Mistakes
- Using `and` when either condition should trigger review.
- Applying the wrong boundary at exactly 100000.
### Interview Tip
Always test boundary values such as 100000 and 100001.

## DW-A019 — Aggregate amounts by currency

**Question:** Produce one total for each currency.

### Input
```json
[{"currency":"USD","amount":100},{"currency":"INR","amount":2000},{"currency":"USD","amount":50}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
var groups = payload groupBy $.currency
---
groups mapObject ((items, currency) -> (currency as String): sum(items map $.amount))
```
### Expected Output
```json
{"USD":150,"INR":2000}
```
### Explanation
The transformation groups transactions by currency and then aggregates each group's amount values.
### Common Mistakes
- Summing all currencies together.
- Losing the currency key during aggregation.
### Interview Tip
Grouping plus aggregation is a common reporting and reconciliation pattern.

## DW-A020 — Remove sensitive nested data

**Question:** Remove the `ssn` field from every customer object before forwarding the payload.

### Input
```json
[{"id":1,"name":"A","ssn":"111"},{"id":2,"name":"B","ssn":"222"}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
payload map ($ - "ssn")
```
### Expected Output
```json
[{"id":1,"name":"A"},{"id":2,"name":"B"}]
```
### Explanation
Each object has the sensitive key removed before the resulting array is returned.
### Common Mistakes
- Removing the field after logging the original payload.
- Removing only the first object.
### Interview Tip
Security transformations should occur before observability statements that could expose the original data.

## DW-A021 — Return only successful API results

**Question:** From a batch result, return records whose HTTP status is 2xx.

### Input
```json
[{"id":1,"status":200},{"id":2,"status":500},{"id":3,"status":201}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
payload filter ($.status >= 200 and $.status < 300)
```
### Expected Output
```json
[{"id":1,"status":200},{"id":3,"status":201}]
```
### Explanation
The predicate represents the standard 2xx HTTP status range.
### Common Mistakes
- Checking only `status == 200` and excluding other successful statuses.
- Accidentally including 300 responses.
### Interview Tip
Use a range when the business rule is about an HTTP status class.

## DW-A022 — Safely split a full name

**Question:** Return first and last name from a two-word full name.

### Input
```json
{"fullName":"Ravi Kumar"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
var parts = payload.fullName splitBy " "
---
{ firstName: parts[0], lastName: parts[1] }
```
### Expected Output
```json
{"firstName":"Ravi","lastName":"Kumar"}
```
### Explanation
`splitBy` creates an array and the selectors retrieve the required positions.
### Common Mistakes
- Assuming every name has exactly two parts.
- Ignoring extra whitespace.
### Interview Tip
Call out the real-world limitation and define how multi-part names should be handled.

## DW-A023 — Create a reusable currency conversion function

**Question:** Convert USD to INR using a supplied exchange rate.

### Input
```json
{"usd":100,"rate":83.2}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
fun convert(amount, rate) = amount * rate
---
{ inr: convert(payload.usd, payload.rate) }
```
### Expected Output
```json
{"inr":8320}
```
### Explanation
The function keeps conversion logic independent from the input field names.
### Common Mistakes
- Reversing the rate.
- Hard-coding a rate that should come from the source or configuration.
### Interview Tip
Mention that exchange-rate freshness and financial rounding belong to the surrounding integration design.

## DW-A024 — Transform nested order lines

**Question:** Return each order with line totals calculated from quantity and unit price.

### Input
```json
{"orderId":"O1","lines":[{"sku":"A","quantity":2,"unitPrice":50},{"sku":"B","quantity":3,"unitPrice":20}]}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{
  orderId: payload.orderId,
  lines: payload.lines map ((line) -> line ++ { lineTotal: line.quantity * line.unitPrice })
}
```
### Expected Output
```json
{"orderId":"O1","lines":[{"sku":"A","quantity":2,"unitPrice":50,"lineTotal":100},{"sku":"B","quantity":3,"unitPrice":20,"lineTotal":60}]}
```
### Explanation
Each line is transformed independently while retaining its original fields.
### Common Mistakes
- Calculating order total instead of line total.
- Forgetting to retain required source fields.
### Interview Tip
Separate line-level calculations from order-level aggregation to keep mappings readable.

## DW-A025 — Create transaction bands

**Question:** Classify transactions below 1000 as `LOW`, 1000–9999 as `MEDIUM`, and 10000 or above as `HIGH`.

### Input
```json
[{"id":"T1","amount":500},{"id":"T2","amount":2500},{"id":"T3","amount":15000}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
payload map ((t) -> t ++ {
  band: if (t.amount < 1000) "LOW"
        else if (t.amount < 10000) "MEDIUM"
        else "HIGH"
})
```
### Expected Output
```json
[{"id":"T1","amount":500,"band":"LOW"},{"id":"T2","amount":2500,"band":"MEDIUM"},{"id":"T3","amount":15000,"band":"HIGH"}]
```
### Explanation
The ordered conditions implement mutually exclusive numeric ranges.
### Common Mistakes
- Overlapping conditions.
- Incorrectly classifying exactly 1000 or 10000.
### Interview Tip
Boundary testing is essential for rule-based transformations.

## DW-A026 — Build an API response envelope

**Question:** Wrap a customer list with a success flag and count.

### Input
```json
[{"id":1},{"id":2},{"id":3}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{
  success: true,
  count: sizeOf(payload),
  data: payload
}
```
### Expected Output
```json
{"success":true,"count":3,"data":[{"id":1},{"id":2},{"id":3}]}
```
### Explanation
The original collection becomes the `data` member while metadata is calculated alongside it.
### Common Mistakes
- Hard-coding the count.
- Changing the data structure unnecessarily.
### Interview Tip
API envelopes should be designed consistently across endpoints.

## DW-A027 — Handle a missing optional preference

**Question:** Return the customer's preferred language, defaulting to `en`.

### Input
```json
{"id":"C1","preferences":{}}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ id: payload.id, language: payload.preferences.language default "en" }
```
### Expected Output
```json
{"id":"C1","language":"en"}
```
### Explanation
The mapping keeps the API contract stable even when the optional source property is absent.
### Common Mistakes
- Returning null when the API requires a language.
- Defaulting the entire preferences object instead of the leaf field.
### Interview Tip
Clarify whether the parent object can also be missing; that changes the defensive strategy.

## DW-A028 — Find the largest transaction object

**Question:** Return the complete transaction with the highest amount.

### Input
```json
[{"id":"T1","amount":400},{"id":"T2","amount":1200},{"id":"T3","amount":800}]
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
(payload orderBy $.amount)[-1]
```
### Expected Output
```json
{"id":"T2","amount":1200}
```
### Explanation
Sorting by amount places the largest object last, allowing the complete record to be selected.
### Common Mistakes
- Returning only the maximum numeric value when the complete object is required.
- Forgetting empty-array behavior.
### Interview Tip
Compare sorting with a reduction strategy when performance matters for large collections.

## DW-A029 — Generate a form-encoded payload

**Question:** Create a form-encoded request containing `client_id` and `grant_type`.

### Input
```json
{"clientId":"abc123","grantType":"client_credentials"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/x-www-form-urlencoded
---
{
  client_id: payload.clientId,
  grant_type: payload.grantType
}
```
### Expected Output
```text
client_id=abc123&grant_type=client_credentials
```
### Explanation
The output MIME type controls serialization while the object defines the target field names.
### Common Mistakes
- Returning JSON while the receiving endpoint expects form encoding.
- Using source field names instead of the OAuth contract names.
### Interview Tip
For API integrations, always verify both field mapping and output media type.

## DW-A030 — Create a dynamic object key

**Question:** Use the incoming currency as an object key and store the total amount under it.

### Input
```json
{"currency":"USD","amount":250}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ (payload.currency): payload.amount }
```
### Expected Output
```json
{"USD":250}
```
### Explanation
Parentheses around the key expression make the object key dynamic rather than the literal text `payload.currency`.
### Common Mistakes
- Omitting parentheses around the dynamic key.
- Assuming arbitrary values are always valid business keys.
### Interview Tip
Dynamic keys are useful for grouped API responses but should be used carefully when consumers expect a fixed schema.
