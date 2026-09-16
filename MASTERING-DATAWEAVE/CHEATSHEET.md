# DataWeave Cheatsheet

## Script structure

```dw
%dw 2.0
output application/json
---
{
  message: "Hello"
}
```

## Common variables

```dw
var name = payload.name
---
{name: name}
```

## Common shortcuts

```dw
payload map $.name
payload filter $.active
payload groupBy $.city
payload mapObject $ ++ {processed: true}
```

## Anonymous parameters

- `$` = current value
- `$$` = current index/key or accumulator context depending on function

Always verify the function signature when using shorthand parameters.

## Object dynamic key

```dw
{
  (payload.status): payload.message
}
```

## Conditional field

```dw
{
  name: payload.name,
  (email: payload.email) if !isEmpty(payload.email)
}
```

## Type coercion

```dw
payload.amount as Number
payload.date as Date {format: "yyyy-MM-dd"}
```

## Common string operations

```dw
upper(payload.name)
lower(payload.name)
trim(payload.name)
payload.name splitBy " "
["A", "B"] joinBy ","
```

## Function

```dw
fun mask(value: String): String =
  "*" repeat (sizeOf(value) - 4) ++ value[-4 to -1]
```

Use production-safe implementations appropriate to the input constraints; the example is intended to demonstrate function structure.

## Rule of thumb

Array -> `map` / `filter` / `reduce` / `groupBy`

Object -> `mapObject` / `filterObject` / `pluck`

Nested arrays -> `flatten` / `flatMap`

Repeated business logic -> `fun`

Runtime output format -> `output application/json|xml|csv`
