# DataWeave Quick Cheatsheet

| Need | Common tool | Shape |
|---|---|---|
| Transform array items | `map` | Array -> Array |
| Keep array items | `filter` | Array -> Array |
| Group array items | `groupBy` | Array -> Object |
| Transform object entries | `mapObject` | Object -> Object |
| Convert object entries to array | `pluck` | Object -> Array |
| Sort values | `orderBy` | Array -> Array |
| Find text before last delimiter | `substringBeforeLast` | String -> String |
| Find text after last delimiter | `substringAfterLast` | String -> String |
| Read XML attribute | `.@name` | XML element -> value |
| Dynamic key | `(expression)` inside object | expression -> key |
| Reusable business rule | `fun name(...) = ...` | function |
| Type branching | `match` | value -> branch |
| Missing-value fallback | `default` | value -> value |

## Mental model

```text
Input shape
   ↓
Select the records
   ↓
Filter when necessary
   ↓
Group or lookup when necessary
   ↓
Map into the target shape
   ↓
Cast/format types deliberately
   ↓
Validate edge cases
   ↓
Output contract
```

## Operator-selection rule

- Array in → start by thinking `map`, `filter`, `groupBy`, or `orderBy`.
- Object in → start by thinking `mapObject` or `pluck`.
- XML in → identify elements and attributes first.
- CSV in → confirm whether fields need numeric/date casting.
- Nested data → consider recursion or nested `map` operations.
- Cross-reference data → consider an indexed lookup when volume is high.

## Common mistakes

1. Using `mapObject` on an Array.
2. Using `map` when the requirement is to transform object keys.
3. Comparing numeric-looking strings without casting.
4. Sorting dates alphabetically.
5. Assuming an XML attribute is a normal child field.
6. Repeating a large `filter` lookup inside a large `map` without considering complexity.
7. Ignoring null and empty-array behavior.
8. Returning an output shape different from the API contract.
