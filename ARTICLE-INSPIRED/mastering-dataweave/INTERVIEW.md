# DataWeave Interview Questions — Mastering Set

## Fundamentals

### 1. What is DataWeave?
DataWeave is MuleSoft's expression and transformation language. It is commonly used to transform payloads between formats and to implement data manipulation logic in Mule applications.

### 2. What does `map` do?
`map` transforms each element of an Array and returns an Array.

### 3. What does `mapObject` do?
`mapObject` transforms key-value entries of an Object and returns an Object.

### 4. What does `filter` do?
`filter` keeps array elements that satisfy a condition.

### 5. What does `groupBy` do?
`groupBy` partitions an Array into groups and returns an Object keyed by the grouping expression.

### 6. How do you access XML attributes?
Use the attribute selector, for example `element.@id`.

### 7. Why use dynamic keys?
Dynamic keys allow the output field name to be computed from input data, using syntax such as `{ (expression): value }`.

### 8. How do you sort month strings chronologically?
Parse them into `Date` values in the `orderBy` expression rather than comparing the raw strings.

### 9. How do you enrich one collection from another?
Map the primary collection and perform a lookup into the reference collection. For large reference data, consider building an index first.

### 10. Why use reusable functions?
Functions make business rules explicit, reusable, easier to test, and easier to explain.

## Intermediate

### 11. `map` vs `mapObject`?
`map` is for arrays; `mapObject` is for objects. Choosing the wrong one commonly causes type or shape errors.

### 12. `filter` vs `filterObject`?
`filter` filters array elements; `filterObject` filters object entries.

### 13. Why does `groupBy` return an object?
Because each group needs a key. The grouping expression becomes the object key and the matching records become the associated value.

### 14. Why cast CSV fields?
CSV values commonly arrive as strings. Arithmetic and numeric comparisons require deliberate type conversion.

### 15. What is a recursive transformation?
A function calls itself on nested values, allowing the same rule to be applied to arbitrarily nested objects or arrays.

## Advanced

### 16. How would you optimize a repeated lookup?
Build an object indexed by the lookup key and access it directly rather than filtering the complete reference collection for every primary record.

### 17. How do you handle missing values safely?
Define the contract first, then use selectors, `default`, conditional logic, or explicit validation according to the required behavior.

### 18. What should you check before using a fixed substring position?
Confirm the input format is stable. Fixed positions are appropriate only when the contract guarantees the structure.

### 19. How do you make a transformation production-ready?
Test valid, empty, malformed, boundary, and large inputs; define null behavior; validate types; preserve the required output contract; and avoid unnecessary repeated work.

### 20. What should you explain during a DataWeave interview?
Do not only present the final script. Explain the input shape, output shape, operator choice, type conversions, edge cases, and complexity considerations.
