# Real-World Banking DataWeave Practice

These exercises are designed around integration scenarios similar to a banking API.

## Exercise 1 — Customer response

Input:

```json
{
  "customerId": "C1001",
  "fullName": "Ravi Kumar",
  "accountNumber": "123456789012",
  "balance": 45000
}
```

Requirement: return customer ID, customer name and balance while masking the account number.

Expected idea: never expose the complete account number in a public response. A possible result is `********9012`.

## Exercise 2 — Transaction summary

Input:

```json
[
  {"type":"CREDIT","amount":10000},
  {"type":"DEBIT","amount":2500},
  {"type":"DEBIT","amount":1000}
]
```

Produce:

```json
{
  "totalCredit": 10000,
  "totalDebit": 3500,
  "net": 6500
}
```

## Exercise 3 — Group transactions

Group transactions by account number and produce one array per account.

## Exercise 4 — Customer enrichment

Given a customer array and account array, join them by customer ID and return a customer-centered structure.

## Exercise 5 — API normalization

Convert inconsistent upstream fields such as `full_name`, `FULLNAME` and `name` into one canonical `fullName` field.

## Exercise 6 — Error response

Transform an internal Mule error structure into a stable API error contract containing `code`, `message`, `correlationId` and `timestamp`.

## Exercise 7 — CSV batch

Read a CSV customer file and create normalized JSON records with explicit Number/Date coercion.

## Production considerations

- Do not expose full account numbers, Aadhaar numbers, passwords, tokens or other secrets unnecessarily.
- Validate input before transformations that depend on required fields.
- Keep external contract fields stable.
- Separate reusable functions from endpoint-specific mapping.
- Test failure and boundary cases.
- Consider payload size and repeated lookups for large datasets.
