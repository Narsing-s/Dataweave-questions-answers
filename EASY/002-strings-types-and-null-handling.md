# Easy DataWeave — Strings, Types & Null Handling

These are real, hand-readable practice questions. Each question includes the input, answer, expected result, explanation, mistakes, and interview tip.

## DW-E021 — Convert a name to uppercase

**Question:** Convert `narsing` to uppercase.

### Input
```json
{"name":"narsing"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ name: upper(payload.name) }
```
### Expected Output
```json
{"name":"NARSING"}
```
### Explanation
`upper` returns a new string with alphabetic characters converted to uppercase. The original payload is not changed.
### Common Mistakes
- Calling `upper()` on the entire object instead of the string field.
- Forgetting that null input needs explicit handling.
### Interview Tip
Explain the difference between selecting a field and transforming the selected value.

## DW-E022 — Convert text to lowercase

**Question:** Normalize an email address to lowercase.

### Input
```json
{"email":"USER@EXAMPLE.COM"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ email: lower(payload.email) }
```
### Expected Output
```json
{"email":"user@example.com"}
```
### Explanation
`lower` is useful when a downstream system expects case-normalized text.
### Common Mistakes
- Using `lower` on a non-string value.
- Assuming lowercasing validates that the value is a valid email.
### Interview Tip
Mention that normalization and validation are separate concerns.

## DW-E023 — Trim whitespace

**Question:** Remove leading and trailing spaces from a customer name.

### Input
```json
{"name":"  Ravi Kumar  "}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ name: trim(payload.name) }
```
### Expected Output
```json
{"name":"Ravi Kumar"}
```
### Explanation
`trim` removes whitespace around the string while preserving internal spaces.
### Common Mistakes
- Expecting internal repeated spaces to be removed.
- Applying it before checking that the field is a String.
### Interview Tip
State exactly which whitespace `trim` targets: the boundaries of the string.

## DW-E024 — Check a string with `contains`

**Question:** Determine whether a product code contains `PRO`.

### Input
```json
{"code":"MULE-PRO-01"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ containsPro: payload.code contains "PRO" }
```
### Expected Output
```json
{"containsPro":true}
```
### Explanation
`contains` tests whether the supplied substring occurs in the string.
### Common Mistakes
- Confusing substring matching with regular-expression matching.
- Assuming matching is case-insensitive.
### Interview Tip
Discuss whether the source system guarantees the case of the code.

## DW-E025 — Test a prefix

**Question:** Check whether an API path starts with `/customers`.

### Input
```json
{"path":"/customers/1001/orders"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ customerPath: payload.path startsWith "/customers" }
```
### Expected Output
```json
{"customerPath":true}
```
### Explanation
`startsWith` checks only the beginning of the string.
### Common Mistakes
- Using `contains` when the requirement is specifically a prefix.
- Forgetting that a different case will not match automatically.
### Interview Tip
Choose the narrowest predicate that matches the business rule.

## DW-E026 — Test a suffix

**Question:** Check whether a file name ends in `.csv`.

### Input
```json
{"file":"customers.csv"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ isCsv: payload.file endsWith ".csv" }
```
### Expected Output
```json
{"isCsv":true}
```
### Explanation
`endsWith` is useful for simple file-extension checks.
### Common Mistakes
- Treating `.CSV` as automatically equal to `.csv`.
- Using a suffix check as a complete MIME-type validation.
### Interview Tip
Mention case normalization when source filenames have inconsistent casing.

## DW-E027 — Get string length

**Question:** Return the number of characters in `MuleSoft`.

### Input
```json
{"value":"MuleSoft"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ length: sizeOf(payload.value) }
```
### Expected Output
```json
{"length":8}
```
### Explanation
`sizeOf` returns the size of the supplied string.
### Common Mistakes
- Using array-specific logic for a string.
- Ignoring null input.
### Interview Tip
Know that `sizeOf` also works with collections and other supported values.

## DW-E028 — Replace text

**Question:** Replace the hyphen in an order code with an underscore.

### Input
```json
{"orderCode":"ORD-1001"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ orderCode: payload.orderCode replace "-" with "_" }
```
### Expected Output
```json
{"orderCode":"ORD_1001"}
```
### Explanation
The `replace ... with ...` expression replaces matching text.
### Common Mistakes
- Expecting unrelated characters to change.
- Forgetting that replacement rules depend on the exact expression used.
### Interview Tip
Be ready to explain when a regular expression is more appropriate than literal replacement.

## DW-E029 — Provide a default for null

**Question:** Return `Unknown` when the customer city is null.

### Input
```json
{"city":null}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ city: payload.city default "Unknown" }
```
### Expected Output
```json
{"city":"Unknown"}
```
### Explanation
`default` supplies a fallback when the selected value is null.
### Common Mistakes
- Confusing null with an empty string.
- Applying a default to the wrong field.
### Interview Tip
Always ask whether the requirement treats null and empty string differently.

## DW-E030 — Default a missing optional field

**Question:** Produce `false` when `subscribed` is absent or null.

### Input
```json
{"name":"Ravi"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ name: payload.name, subscribed: payload.subscribed default false }
```
### Expected Output
```json
{"name":"Ravi","subscribed":false}
```
### Explanation
The default makes an optional input field safe for a fixed output contract.
### Common Mistakes
- Returning the field without a default and producing null.
- Using a string `"false"` instead of Boolean `false`.
### Interview Tip
Distinguish Boolean values from their string representations.

## DW-E031 — Check a value's type

**Question:** Determine whether `age` is a Number.

### Input
```json
{"age":26}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ numeric: payload.age is Number }
```
### Expected Output
```json
{"numeric":true}
```
### Explanation
The `is` operator tests whether a value conforms to the specified DataWeave type.
### Common Mistakes
- Comparing a value to a type as if the type were a string.
- Assuming numeric text such as `"26"` is already a Number.
### Interview Tip
Type checks are useful at integration boundaries where upstream schemas are unreliable.

## DW-E032 — Convert a number to String

**Question:** Convert customer ID `1001` to text.

### Input
```json
{"customerId":1001}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ customerId: payload.customerId as String }
```
### Expected Output
```json
{"customerId":"1001"}
```
### Explanation
`as String` explicitly converts the numeric value into a String.
### Common Mistakes
- Treating the converted value as numeric afterward.
- Omitting conversion when a downstream contract requires text.
### Interview Tip
Explain why explicit type conversion is safer at integration boundaries.

## DW-E033 — Convert numeric text to Number

**Question:** Convert `"2500"` into a numeric amount.

### Input
```json
{"amount":"2500"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ amount: payload.amount as Number }
```
### Expected Output
```json
{"amount":2500}
```
### Explanation
The conversion allows numeric operations on a value that arrived as text.
### Common Mistakes
- Passing non-numeric text to the conversion.
- Treating a currency-formatted string as a plain number without considering its format.
### Interview Tip
Mention validation/error handling for invalid numeric text.

## DW-E034 — Build a new object

**Question:** Return only the customer's name and status.

### Input
```json
{"id":10,"name":"Ravi","status":"ACTIVE","internalCode":"X"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ name: payload.name, status: payload.status }
```
### Expected Output
```json
{"name":"Ravi","status":"ACTIVE"}
```
### Explanation
An object literal explicitly defines the output contract instead of passing through unwanted fields.
### Common Mistakes
- Returning `payload` and accidentally exposing internal fields.
- Misspelling source field names.
### Interview Tip
Explicit projection is often safer than pass-through transformations for API contracts.

## DW-E035 — Rename a field

**Question:** Rename `customerId` to `id`.

### Input
```json
{"customerId":"C100"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ id: payload.customerId }
```
### Expected Output
```json
{"id":"C100"}
```
### Explanation
The output key is chosen independently from the source key.
### Common Mistakes
- Writing `customerId` as the output key by habit.
- Using a string literal for the value instead of selecting the field.
### Interview Tip
Explain this as a contract mapping between source and target schemas.

## DW-E036 — Add a constant field

**Question:** Add `source: "MuleSoft"` to a response.

### Input
```json
{"id":101}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
payload ++ { source: "MuleSoft" }
```
### Expected Output
```json
{"id":101,"source":"MuleSoft"}
```
### Explanation
`++` combines objects and produces a new object containing fields from both sides.
### Common Mistakes
- Using `+` for object concatenation.
- Forgetting that duplicate keys require careful consideration.
### Interview Tip
Know the difference between `+`, `++`, and object construction.

## DW-E037 — Create a Boolean condition

**Question:** Return `true` when an account is active.

### Input
```json
{"status":"ACTIVE"}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ active: payload.status == "ACTIVE" }
```
### Expected Output
```json
{"active":true}
```
### Explanation
The equality operator produces a Boolean result.
### Common Mistakes
- Using assignment syntax instead of comparison.
- Forgetting case differences in status values.
### Interview Tip
Mention whether status values are controlled by an API contract or external data.

## DW-E038 — Use if/else

**Question:** Return `ADULT` for age 18 or above; otherwise return `MINOR`.

### Input
```json
{"age":21}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ category: if (payload.age >= 18) "ADULT" else "MINOR" }
```
### Expected Output
```json
{"category":"ADULT"}
```
### Explanation
The condition is evaluated first; exactly one branch becomes the result.
### Common Mistakes
- Forgetting the `else` branch.
- Comparing numeric text without converting it.
### Interview Tip
Use clear business-rule wording when explaining conditional transformations.

## DW-E039 — Calculate a percentage

**Question:** Calculate an 18% tax on amount `1000`.

### Input
```json
{"amount":1000}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ tax: payload.amount * 0.18 }
```
### Expected Output
```json
{"tax":180}
```
### Explanation
Multiplying by `0.18` calculates 18 percent of the amount.
### Common Mistakes
- Multiplying by `18` instead of `0.18`.
- Ignoring currency precision requirements.
### Interview Tip
For financial integrations, discuss rounding and decimal precision rather than relying blindly on floating-point assumptions.

## DW-E040 — Safely read a nested field

**Question:** Return the customer's city from a nested address object.

### Input
```json
{"customer":{"address":{"city":"Hyderabad"}}}
```
### DataWeave Answer
```dataweave
%dw 2.0
output application/json
---
{ city: payload.customer.address.city }
```
### Expected Output
```json
{"city":"Hyderabad"}
```
### Explanation
Selectors traverse nested objects from the root payload.
### Common Mistakes
- Using the wrong nesting level.
- Ignoring the possibility that an intermediate object is absent.
### Interview Tip
In production mappings, explicitly discuss null or missing parent objects.
