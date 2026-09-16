# DataWeave Interview Questions and Answers

## 1. What is DataWeave?
DataWeave is MuleSoft's transformation language used to read, transform and write data between formats and structures.

## 2. Why is DataWeave functional?
It separates data from transformation functions and favors expressions over imperative loop control. Data is treated immutably and transformations create resulting values rather than relying on assignment-based mutation. citeturn0search8

## 3. map vs filter?
`map` transforms every array element. `filter` keeps only elements whose condition evaluates to true. citeturn0search11turn0search6

## 4. map vs mapObject?
`map` works on arrays; `mapObject` works on object key/value entries. citeturn0search1

## 5. What does groupBy return?
For an array, it returns an object grouped by the value produced by its criteria function. citeturn0search0

## 6. What is reduce used for?
It accumulates array values into one result, such as a sum, concatenated value or constructed object. citeturn0search2

## 7. What is `default` used for?
It provides a fallback when a value is absent or null in the relevant expression context.

## 8. How do you handle null safely?
Use explicit null checks, `default`, null-aware design, and input validation appropriate to the business requirement.

## 9. How do you convert a String to Number?
Use type coercion such as `payload.amount as Number` when the input is known to be numeric. MuleSoft's quickstart demonstrates this pattern. citeturn0search9

## 10. How do you create a reusable function?
Declare it with `fun`, parameters and an expression. citeturn0search7

## 11. How do you debug DataWeave?
Break a large expression into smaller expressions and use `log` where appropriate. The Core documentation describes `log` as returning the same value while emitting it to the system log. citeturn0search4

## 12. How do you improve performance?
Avoid repeated expensive searches, unnecessary transformations, excessive nested loops and needless conversions. Reduce the amount of data early when possible and choose functions that express the required operation directly.

## 13. How do you test a transformation?
Test normal input, empty arrays, null values, missing fields, duplicate records, invalid types, boundary values and large payloads.

## 14. How do you transform XML to JSON?
Read XML using the XML reader and construct the desired JSON object using selectors and mapping expressions.

## 15. How do you transform CSV to JSON?
Read the payload as CSV, map each row into the required object structure, and cast fields to the desired types.

## 16. How do you enrich one array from another?
For small datasets, a `filter`-based lookup can be clear. For larger datasets, consider building an indexed object keyed by the join field to avoid repeatedly scanning the enrichment array.

## 17. Why are dynamic keys useful?
They allow output objects to be constructed from runtime values, such as grouping records by account type or status.

## 18. What is a common DataWeave mistake?
Using an array function against an object or an object function against an array. Always identify the input type before choosing the function.

## 19. What should production transformations avoid?
Unnecessary repeated computation, unclear nested expressions, accidental data exposure, weak null handling, undocumented assumptions and transformations that are difficult to test.

## 20. What makes a DataWeave solution interview-ready?
Correct output, clear reasoning, appropriate function choice, safe handling of edge cases, readable code and an explanation of trade-offs.
