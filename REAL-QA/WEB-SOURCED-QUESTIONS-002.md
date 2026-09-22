# DataWeave Web Questions — Additional Deduplicated Set

## 41. What is the `scan` function used for in DataWeave?

**Answer:** `scan` extracts all regular-expression matches from a string. Each match contains the complete match followed by capture groups.

**Example**

```dataweave
%dw 2.0
output application/json
---
"ravi@example.com john@test.com" scan /([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+)/
```

**Explanation:** Use `scan` when you need to extract every matching occurrence. It is different from `matches`, which returns a Boolean for regex matching.

## 42. How can DataWeave check the underlying cause of a Mule error?

**Answer:** Use the Mule Runtime function `Mule::causedBy` to test whether an error was caused by a specified error type.

**Example**

```xml
<when expression="#[Mule::causedBy('HTTP:UNAUTHORIZED')]">
    <!-- handle unauthorized cause -->
</when>
```

**Explanation:** `causedBy` is useful when a higher-level error is being handled but the integration needs to distinguish a specific underlying error type.

## 43. How do you use the `default` operator in DataWeave?

**Answer:** Use `default` to provide a fallback when a value is absent or `null`.

**Example**

```dataweave
%dw 2.0
output application/json
---
{
  id: payload.id default "0000",
  name: payload.name default "Unknown"
}
```

**Input:** `{ "id": null }`

**Output:** `{ "id": "0000", "name": "Unknown" }`

**Explanation:** `default` is useful for simple fallback logic. Use `if/else` when the fallback condition is more complex.

## Deduplication note

These questions were selected only after checking the repository for the same concepts. Existing coverage for `default`, `joinBy`, `update`, `reject`, `zipWith`, `masking`, `find`, modules, and other previously documented topics was left untouched.

**Sources checked:** Mule Zone, Green Cloud Trainings, Medium practice material, and official MuleSoft DataWeave documentation.