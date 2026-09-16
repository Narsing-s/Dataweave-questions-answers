# Easy — Core DataWeave Fundamentals

These are **real interview/practice questions**, not placeholders. Each problem includes the input, DataWeave 2.x solution, expected output, explanation, common mistakes, and an interview tip.

## DW-E001 — How do you return a simple string from DataWeave?

**Input**
```json
"DataWeave"
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload
```

**Expected output**
```json
"DataWeave"
```

**Explanation**
`payload` represents the current Mule event payload. Returning it directly means the transformation produces the input unchanged.

**Common mistakes**
- Forgetting the `---` separator.
- Assuming `payload` is always an object; it can be a string, array, number, or other supported type.

**Interview tip**
Explain that DataWeave expressions operate against the Mule event and that `payload` is the primary data being transformed.

---

## DW-E002 — How do you select a field from a JSON object?

**Input**
```json
{"name":"Narsing","age":26}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload.name
```

**Expected output**
```json
"Narsing"
```

**Explanation**
The `.` selector accesses the `name` field from the object stored in `payload`.

**Common mistakes**
- Using `payload["name"]` when a simple dot selector is sufficient.
- Requesting a field whose name does not exist and not considering the resulting `null` behavior.

**Interview tip**
Be able to distinguish field selectors from array indexes and explain how nested selectors are chained.

---

## DW-E003 — How do you select a nested JSON field?

**Input**
```json
{"customer":{"name":"Ravi","address":{"city":"Hyderabad"}}}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload.customer.address.city
```

**Expected output**
```json
"Hyderabad"
```

**Explanation**
DataWeave evaluates the selectors from left to right: `customer`, then `address`, then `city`.

**Common mistakes**
- Misspelling one of the nested field names.
- Forgetting that the input must actually contain the expected object structure.

**Interview tip**
Mention that nested selection is one of the most common operations in API-to-API transformations.

---

## DW-E004 — How do you convert a string to uppercase?

**Input**
```json
{"name":"dataweave"}
```

**DataWeave answer**
```dataweave
%dw 2.0
import upper from dw::core::Strings
output application/json
---
{ name: upper(payload.name) }
```

**Expected output**
```json
{"name":"DATAWEAVE"}
```

**Explanation**
The `upper` function from the Strings module converts the supplied string to uppercase. The transformed value is placed in a new object field.

**Common mistakes**
- Applying a string function to a non-string value without conversion.
- Forgetting the required module import when using the explicit module function.

**Interview tip**
Know the difference between DataWeave core functions and functions exposed through modules such as `dw::core::Strings`.

---

## DW-E005 — How do you convert a string to lowercase?

**Input**
```json
{"email":"USER@EXAMPLE.COM"}
```

**DataWeave answer**
```dataweave
%dw 2.0
import lower from dw::core::Strings
output application/json
---
{ email: lower(payload.email) }
```

**Expected output**
```json
{"email":"user@example.com"}
```

**Explanation**
`lower` converts the supplied string to lowercase. This is useful when normalizing values such as email addresses or status values before comparison.

**Common mistakes**
- Treating case normalization as validation; lowercase conversion does not validate an email address.
- Applying the function to `null` without considering null handling.

**Interview tip**
Explain why normalization before comparison can prevent case-related matching issues.

---

## DW-E006 — How do you add two numbers?

**Input**
```json
{"price":120,"tax":18}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
{ total: payload.price + payload.tax }
```

**Expected output**
```json
{"total":138}
```

**Explanation**
The `+` operator adds the two numeric values selected from the input object.

**Common mistakes**
- Treating numeric strings as numbers without conversion.
- Accidentally concatenating strings instead of performing arithmetic.

**Interview tip**
Always identify the input types before choosing arithmetic or string operations.

---

## DW-E007 — How do you calculate a total using quantity and unit price?

**Input**
```json
{"quantity":3,"unitPrice":150}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
{ total: payload.quantity * payload.unitPrice }
```

**Expected output**
```json
{"total":450}
```

**Explanation**
The multiplication operator combines quantity and unit price to calculate the line total.

**Common mistakes**
- Multiplying formatted currency strings instead of numeric values.
- Reversing fields in a more complex calculation where units matter.

**Interview tip**
For business transformations, clearly identify the meaning and type of every numeric field.

---

## DW-E008 — How do you create a new JSON object from selected fields?

**Input**
```json
{"id":101,"firstName":"Anil","lastName":"Kumar","internalCode":"X9"}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
{
  customerId: payload.id,
  name: payload.firstName ++ " " ++ payload.lastName
}
```

**Expected output**
```json
{"customerId":101,"name":"Anil Kumar"}
```

**Explanation**
The output object is constructed explicitly. `customerId` maps from `id`, while the name is created by concatenating the first and last names.

**Common mistakes**
- Copying fields that should not be exposed externally.
- Using `+` for string concatenation instead of `++`.

**Interview tip**
This pattern is fundamental for transforming internal application models into API response models.

---

## DW-E009 — How do you access an array element by index?

**Input**
```json
["MuleSoft","DataWeave","API"]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload[1]
```

**Expected output**
```json
"DataWeave"
```

**Explanation**
DataWeave arrays are zero-indexed, so index `1` refers to the second element.

**Common mistakes**
- Assuming the first element is index `1`.
- Accessing an index that is outside the array.

**Interview tip**
Remember: first element = index `0`, second element = index `1`.

---

## DW-E010 — How do you return the first item in an array?

**Input**
```json
[{"id":1},{"id":2},{"id":3}]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload[0]
```

**Expected output**
```json
{"id":1}
```

**Explanation**
Index `0` selects the first element of the array.

**Common mistakes**
- Using `[1]` and unintentionally returning the second element.
- Assuming the array is non-empty without considering the input contract.

**Interview tip**
Discuss array bounds when explaining production-safe transformations.

---

## DW-E011 — How do you transform every item in an array with `map`?

**Input**
```json
[1,2,3,4]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload map ($ * 2)
```

**Expected output**
```json
[2,4,6,8]
```

**Explanation**
`map` executes the supplied expression once for every array element. `$` represents the current element, so each number is multiplied by two.

**Common mistakes**
- Using `filter` when the requirement is to transform every element.
- Forgetting that `map` returns an array.

**Interview tip**
Know the difference: `map` transforms elements; `filter` selects elements.

---

## DW-E012 — How do you keep only even numbers with `filter`?

**Input**
```json
[1,2,3,4,5,6]
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload filter (($ mod 2) == 0)
```

**Expected output**
```json
[2,4,6]
```

**Explanation**
`filter` keeps only elements for which the condition is true. `mod 2` produces zero for even numbers.

**Common mistakes**
- Using `map` and returning booleans instead of removing non-matching values.
- Forgetting the comparison to zero.

**Interview tip**
Be prepared to explain the role of the lambda condition in collection functions.

---

## DW-E013 — How do you check whether a value is greater than 100?

**Input**
```json
{"amount":125}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload.amount > 100
```

**Expected output**
```json
true
```

**Explanation**
The `>` comparison returns a Boolean indicating whether the amount is greater than 100.

**Common mistakes**
- Confusing `>` with `>=`.
- Comparing a numeric value with a string without proper type handling.

**Interview tip**
Explain boundary behavior: `100 > 100` is false, while `100 >= 100` is true.

---

## DW-E014 — How do you use an `if/else` condition?

**Input**
```json
{"age":20}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
{
  category: if (payload.age >= 18) "Adult" else "Minor"
}
```

**Expected output**
```json
{"category":"Adult"}
```

**Explanation**
The conditional expression evaluates the age and chooses one of two string values.

**Common mistakes**
- Omitting the `else` branch when one is required by the expression.
- Using assignment syntax instead of a Boolean condition.

**Interview tip**
Use conditions to express business rules clearly and keep complicated rules in named functions when they grow.

---

## DW-E015 — How do you provide a default value when a field is null?

**Input**
```json
{"name":null}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
{ name: payload.name default "Unknown" }
```

**Expected output**
```json
{"name":"Unknown"}
```

**Explanation**
The `default` operator supplies the fallback value when the left-hand expression is `null`.

**Common mistakes**
- Confusing `null` with an empty string.
- Assuming `default` is a general validation mechanism for every invalid value.

**Interview tip**
Explain the difference between missing/null values and values that are present but empty.

---

## DW-E016 — How do you rename a field?

**Input**
```json
{"customerId":1001,"name":"Ravi"}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
{
  id: payload.customerId,
  name: payload.name
}
```

**Expected output**
```json
{"id":1001,"name":"Ravi"}
```

**Explanation**
The output object defines the desired field names and selects values from the original object.

**Common mistakes**
- Thinking a selector automatically renames a field.
- Accidentally keeping both the old and new fields.

**Interview tip**
Explicit output construction is often clearer than copying an entire object and modifying it.

---

## DW-E017 — How do you add a new field to an existing object?

**Input**
```json
{"id":10,"name":"Ravi"}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload ++ { active: true }
```

**Expected output**
```json
{"id":10,"name":"Ravi","active":true}
```

**Explanation**
The `++` operator combines the original object with another object containing the new field.

**Common mistakes**
- Using an array operation on an object.
- Not considering what happens when both objects contain the same key.

**Interview tip**
Know that object concatenation is useful for adding or overriding fields during transformations.

---

## DW-E018 — How do you remove a field from an object?

**Input**
```json
{"id":10,"name":"Ravi","password":"secret"}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
payload - "password"
```

**Expected output**
```json
{"id":10,"name":"Ravi"}
```

**Explanation**
The `-` operator removes the specified key from an object. This is useful when sensitive or internal fields must not be returned by an API.

**Common mistakes**
- Removing the wrong key because of a spelling mismatch.
- Assuming this changes the source object outside the transformation.

**Interview tip**
Mention field removal when discussing API response sanitization and security boundaries.

---

## DW-E019 — How do you calculate a discounted price?

**Input**
```json
{"price":1000,"discountPercent":10}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
{
  finalPrice: payload.price - (payload.price * payload.discountPercent / 100)
}
```

**Expected output**
```json
{"finalPrice":900}
```

**Explanation**
The discount amount is calculated as price multiplied by the percentage divided by 100, then subtracted from the original price.

**Common mistakes**
- Forgetting to divide the percentage by 100.
- Applying the discount to the already discounted amount repeatedly.

**Interview tip**
Show the calculation in business terms before writing the DataWeave expression.

---

## DW-E020 — How do you convert a numeric string into a Number?

**Input**
```json
{"amount":"125.50"}
```

**DataWeave answer**
```dataweave
%dw 2.0
output application/json
---
{ amount: payload.amount as Number }
```

**Expected output**
```json
{"amount":125.5}
```

**Explanation**
The `as Number` coercion converts the textual numeric value into a numeric DataWeave value.

**Common mistakes**
- Assuming every string is convertible to a number.
- Ignoring malformed input such as `"N/A"`.

**Interview tip**
Discuss input validation and error handling when type coercion can fail.
