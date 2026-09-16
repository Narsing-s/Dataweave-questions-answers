# DataWeave Core Functions Reference

A repository-owned quick reference for the most useful DataWeave transformation functions.

| Function | Main use | Typical input | Typical output |
|---|---|---|---|
| `map` | Transform array items | Array | Array |
| `filter` | Keep matching array items | Array | Array |
| `mapObject` | Transform object entries | Object | Object |
| `pluck` | Extract object entries to array | Object | Array |
| `groupBy` | Group by criteria | Array/Object | Object |
| `reduce` | Accumulate values | Array | Any |
| `flatten` | Flatten nested arrays | Array | Array |
| `flatMap` | Map and flatten | Array | Array |
| `orderBy` | Sort values | Array | Array |
| `distinctBy` | Remove duplicates by criteria | Array | Array |
| `sizeOf` | Count elements | Collection/String | Number |
| `isEmpty` | Check empty value | Collection | Boolean |
| `default` | Supply fallback | Any | Any |
| `upper` | Uppercase text | String | String |
| `lower` | Lowercase text | String | String |
| `splitBy` | Split text | String | Array |
| `joinBy` | Join array | Array | String |
| `replace` | Replace text | String | String |
| `substring` | Extract text | String | String |
| `read` | Parse text/binary into typed data | String/Binary | Any |
| `write` | Serialize data | Any | String/Binary |
| `log` | Debug an expression | Any | Same value |

## `map`

`map` transforms every item in an array and returns a new array.

```dw
%dw 2.0
output application/json
---
payload map (item, index) -> {
  id: item.id,
  name: upper(item.name)
}
```

## `filter`

`filter` keeps only array items for which the condition evaluates to `true`.

```dw
%dw 2.0
output application/json
---
payload filter ($.active == true)
```

## `mapObject`

Use `mapObject` when the input is an object and its key/value entries need to be transformed.

```dw
%dw 2.0
output application/json
---
payload mapObject (value, key) -> {
  (upper(key)): value
}
```

## `groupBy`

`groupBy` creates groups using a calculated key.

```dw
%dw 2.0
output application/json
---
payload groupBy $.city
```

## `reduce`

`reduce` accumulates array items into one result.

```dw
%dw 2.0
output application/json
---
payload reduce ((item, acc = 0) -> acc + item.amount)
```

## Choosing the function

- One output item per array item → `map`
- Keep only matching array items → `filter`
- Transform object entries → `mapObject`
- Convert object entries into an array → `pluck`
- Create groups → `groupBy`
- Accumulate into one result → `reduce`
- Flatten nested arrays → `flatten` / `flatMap`
- Sort records → `orderBy`
- Remove duplicates → `distinctBy`

## Edge-case checklist

Before considering a transformation complete, test:

1. Empty arrays
2. Empty objects
3. `null` values
4. Missing fields
5. Duplicate records
6. Unexpected data types
7. Blank strings
8. Numeric strings versus numbers
9. Nested arrays with different lengths
10. Large collections where repeated lookups may become expensive

For complete worked examples, see the Easy, Medium and Advanced question banks in this repository.
