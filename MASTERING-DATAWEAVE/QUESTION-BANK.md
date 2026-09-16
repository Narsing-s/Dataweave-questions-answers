# DataWeave Question Bank

## Beginner

1. Convert an array of customer objects into only names.
2. Return customers whose age is greater than 25.
3. Convert all names to uppercase.
4. Add an `isAdult` field.
5. Remove null fields from an object.
6. Rename fields during transformation.
7. Convert string amounts into Numbers.
8. Format a Date as `yyyy-MM-dd`.
9. Split a full name into first and last name.
10. Count records by using `sizeOf`.

## Core transformation

11. Use `map` to transform every array item.
12. Use `filter` to retain matching records.
13. Use `mapObject` to transform object keys and values.
14. Use `pluck` to convert object values into an array.
15. Group customers by city using `groupBy`.
16. Calculate a total using `reduce`.
17. Flatten nested arrays.
18. Use `flatMap` for nested collections.
19. Find minimum and maximum values.
20. Sort records by a field.

## Intermediate

21. Convert flat order data into customer -> orders hierarchy.
22. Enrich customers from a second array using an ID.
23. Join products with inventory data.
24. Group transactions by account.
25. Calculate account credit, debit and net balance.
26. Build dynamic keys from a field.
27. Create an object from an array of key/value records.
28. Convert CSV rows into JSON.
29. Convert JSON into CSV-ready records.
30. Convert JSON into XML.

## Advanced

31. Recursively transform nested objects.
32. Normalize mixed JSON/XML input.
33. Handle optional fields without runtime errors.
34. Build reusable typed functions.
35. Create a generic field-renaming function.
36. Implement conditional object fields.
37. Use pattern matching for status mapping.
38. Aggregate multiple transaction types in one pass.
39. Design a transformation for large payloads.
40. Debug a transformation with `log`.

## Real-world MuleSoft scenarios

41. Transform a bank customer request into a downstream core-banking request.
42. Mask sensitive account information in an API response.
43. Build an API response from customer + account + transaction sources.
44. Transform database rows into a REST response.
45. Convert an external SOAP-style XML response into JSON.
46. Transform an inbound CSV batch into normalized customer records.
47. Create an error response from a Mule error object.
48. Produce a notification payload after account creation.
49. Calculate transaction summaries by account and date.
50. Build a reusable DataWeave module for common bank transformations.

## Challenge levels

- 1–10: beginner
- 11–20: core functions
- 21–30: intermediate
- 31–40: advanced
- 41–50: production scenarios

For every question, first attempt the transformation without looking at the answer. Then compare output, edge-case handling and readability.
