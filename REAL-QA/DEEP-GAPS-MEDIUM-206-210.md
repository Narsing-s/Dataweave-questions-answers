# Medium — Deep Gap Coverage M206-M210

## M206 — How can you parse JSON text with an explicit MIME type?

**Difficulty:** Medium  
**Topic:** `read` and MIME types

### Input
```json
{"body":"{\"id\":\"C100\",\"active\":true}"}
```

### DataWeave
```dataweave
%dw 2.0
output application/json
var parsed = read(payload.body, "application/json")
---
{
  customerId: parsed.id,
  active: parsed.active
}
```

### Expected output
```json
{"customerId":"C100","active":true}
```

### Explanation
`read` interprets text or binary content using the supplied MIME type.

### Common mistake
Assuming a string containing JSON automatically behaves like an object.

### Interview tip
Mention that explicit MIME types make parsing intent clear and reduce format ambiguity.

## M207 — How can you produce CSV with explicit header and quote configuration?

**Difficulty:** Medium  
**Topic:** CSV configuration

### Input
```json
[{"id":"C1","name":"Rao, Anita"},{"id":"C2","name":"Kiran"}]
```

### DataWeave
```dataweave
%dw 2.0
output application/csv header=true, quoteValues=true
---
payload
```

### Expected output
A CSV document with `id,name` as the header and quoting applied where required by the CSV writer.

### Explanation
CSV output is controlled by writer properties such as `header` and `quoteValues`.

### Common mistake
Treating CSV as line-separated text and manually joining fields with commas.

### Interview tip
CSV requires correct escaping when values contain commas, quotes, or line breaks.

## M208 — How can you extract a regex capture group from a string?

**Difficulty:** Medium  
**Topic:** Regex extraction

### Input
```json
{"reference":"INV-2026-0042"}
```

### DataWeave
```dataweave
%dw 2.0
output application/json
var matches = (payload.reference scan /INV-(\d{4})-(\d+)/)
---
{
  year: matches[0][1],
  number: matches[0][2]
}
```

### Expected output
```json
{"year":"2026","number":"0042"}
```

### Explanation
`scan` returns matches and capture groups, which can be mapped into structured fields.

### Common mistake
Using a boolean regex match when the actual requirement is extraction.

### Interview tip
Separate validation (`matches`) from extraction (`scan`) in your explanation.

## M209 — How can you create reusable typed business logic with a function?

**Difficulty:** Medium  
**Topic:** Typed functions

### Input
```json
[{"amount":100},{"amount":250}]
```

### DataWeave
```dataweave
%dw 2.0
output application/json
fun fee(amount: Number): Number = amount * 0.02
---
payload map {
  amount: $.amount,
  fee: fee($.amount)
}
```

### Expected output
```json
[{"amount":100,"fee":2},{"amount":250,"fee":5}]
```

### Explanation
The function declares a numeric input and numeric return type, making its contract explicit.

### Common mistake
Repeating the same fee formula in multiple mapping expressions.

### Interview tip
Typed functions improve readability and make business rules easier to reuse and test.

## M210 — How can you avoid repeatedly scanning the same collection?

**Difficulty:** Medium  
**Topic:** Large-payload performance

### Input
```json
{"orders":[{"status":"PAID","amount":100},{"status":"PENDING","amount":50},{"status":"PAID","amount":75}]}
```

### DataWeave
```dataweave
%dw 2.0
output application/json
var paidOrders = payload.orders filter ($.status == "PAID")
---
{
  paidCount: sizeOf(paidOrders),
  paidAmount: sum(paidOrders.amount)
}
```

### Expected output
```json
{"paidCount":2,"paidAmount":175}
```

### Explanation
The filtered collection is calculated once and reused for both metrics.

### Common mistake
Filtering the same large array independently for every derived field.

### Interview tip
For large payloads, discuss repeated traversal, readability, and whether a single aggregation pass is justified.
