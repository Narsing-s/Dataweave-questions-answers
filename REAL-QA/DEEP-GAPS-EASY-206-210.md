# Easy — Deep Gap Coverage E206-E210

These questions target previously underrepresented fundamentals without renaming existing exercises.

## E206 — What does `orElse` provide for an optional value?

**Difficulty:** Easy  
**Topic:** Optional-value fallback

### Input
```json
{"nickname": null, "name": "Anita"}
```

### DataWeave
```dataweave
%dw 2.0
output application/json
---
{
  displayName: payload.nickname orElse payload.name
}
```

### Expected output
```json
{"displayName":"Anita"}
```

### Explanation
`orElse` supplies the alternative when the left expression produces `null`.

### Common mistake
Using string concatenation and checking for the literal text `"null"` instead of handling the value as `null`.

### Interview tip
Explain the difference between a missing/null optional value and an empty string.

### Edge case
If `nickname` is an empty string rather than `null`, the fallback is not selected automatically.

## E207 — How can `try` capture a conversion failure as a value?

**Difficulty:** Easy  
**Topic:** Structured error values

### Input
```json
{"amount":"not-a-number"}
```

### DataWeave
```dataweave
%dw 2.0
output application/json
---
{
  conversion: try(() -> payload.amount as Number)
}
```

### Expected output
The result is a structured `TryResult` value representing the failed conversion; exact serialized error details can vary by runtime.

### Explanation
`try` turns an expression failure into a value that can be inspected instead of immediately propagating the error.

### Common mistake
Assuming `try` silently returns `null`.

### Interview tip
Mention that error details should be shaped explicitly before exposing them through an API.

### Edge case
The exact error metadata should not be treated as a stable public API contract.

## E208 — How do you distinguish an empty string from a missing value?

**Difficulty:** Easy  
**Topic:** Missing/null/blank handling

### Input
```json
{"firstName":"", "lastName":"Rao"}
```

### DataWeave
```dataweave
%dw 2.0
output application/json
---
{
  firstNamePresent: payload.firstName != null,
  firstNameBlank: isBlank(payload.firstName),
  lastNamePresent: payload.lastName != null
}
```

### Expected output
```json
{"firstNamePresent":true,"firstNameBlank":true,"lastNamePresent":true}
```

### Explanation
The field exists and is not null, but its string value is blank.

### Common mistake
Treating `!= null` as equivalent to non-blank validation.

### Interview tip
Production validation often needs separate rules for presence and content.

## E209 — How can you safely normalize a text field before validation?

**Difficulty:** Easy  
**Topic:** Text normalization

### Input
```json
{"email":"  USER@EXAMPLE.COM  "}
```

### DataWeave
```dataweave
%dw 2.0
output application/json
---
{
  email: lower(trim(payload.email))
}
```

### Expected output
```json
{"email":"user@example.com"}
```

### Explanation
`trim` removes surrounding whitespace and `lower` normalizes case.

### Common mistake
Validating before removing accidental surrounding spaces.

### Interview tip
Normalize first, then validate and map the canonical value.

## E210 — How can you use a selector with a default for a missing nested field?

**Difficulty:** Easy  
**Topic:** Selector/navigation edge case

### Input
```json
{"customer":{"id":"C100"}}
```

### DataWeave
```dataweave
%dw 2.0
output application/json
---
{
  customerId: payload.customer.id,
  phone: payload.customer.phone default "NOT_PROVIDED"
}
```

### Expected output
```json
{"customerId":"C100","phone":"NOT_PROVIDED"}
```

### Explanation
The `default` operator provides a value when the selected field is absent or null.

### Common mistake
Hard-coding a value without documenting whether it represents missing, null, or genuinely unknown data.

### Interview tip
Ask what semantic value the default represents before choosing it.
