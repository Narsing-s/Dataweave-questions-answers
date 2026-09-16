# Mastering DataWeave — Solutions

## Q1

```dataweave
%dw 2.0
output application/json
---
payload.products.*product map (p) -> {
  code: p.@code,
  name: p
}
```

**Why:** `.*product` selects repeated XML elements and `.@code` reads an XML attribute.

## Q2

```dataweave
%dw 2.0
import * from dw::core::Strings
output application/json
---
substringBeforeLast(payload.value, "/") ++ "|" ++ substringAfterLast(payload.value, "/")
```

**Why:** The `Last` variants preserve every earlier delimiter.

## Q3

```dataweave
%dw 2.0
output application/json
---
{
  byYear: payload.ids groupBy ((id) -> id[4 to 7])
}
```

**Why:** `groupBy` produces an object keyed by the expression result.

## Q4

```dataweave
%dw 2.0
output application/json
---
payload map (employee) -> {
  (employee.employee): employee.code
}
```

**Why:** Parentheses make the field expression a dynamic key.

## Q5

```dataweave
%dw 2.0
output application/json
---
(payload groupBy ((row) -> row.invoice))
  pluck ((rows) -> {
    invoice: rows[0].invoice,
    supplier: rows[0].supplier,
    total: rows[0].total as Number,
    items: rows map (row) -> {
      item: row.item,
      quantity: row.quantity as Number
    }
  })
```

**Why:** Group by the parent ID, take parent-level values from one representative row, and map every row into a child item.

## Q6

```dataweave
%dw 2.0
output application/json
---
payload.employees
  map (employee) -> {
    id: employee.id,
    name: employee.name,
    department: (
      payload.departments
        filter ((department) -> department.employeeIds contains employee.id)
    )[0].name default "Unassigned"
  }
  orderBy ((employee) -> employee.id)
```

**Why:** `filter` performs the lookup, `default` protects missing matches, and `orderBy` provides deterministic output.

## Q7

```dataweave
%dw 2.0
output application/json
---
payload groupBy ((row) -> row.region)
  mapObject ((rows, region) -> {
    (region): rows.product
  })
```

**Why:** `groupBy` creates region groups and `mapObject` transforms each object entry.

## Q8

```dataweave
%dw 2.0
output application/json
fun qualified(score) = (score as Number) >= 80
---
payload.customers.*customer
  filter ((customer) -> qualified(customer.score))
  map ((customer) -> {
    id: customer.@id,
    name: customer.name,
    score: customer.score as Number
  })
```

**Why:** The business rule is isolated in a function; XML text is explicitly cast to `Number` before comparison.

## Q9

```dataweave
%dw 2.0
output application/json
---
payload orderBy ((value) ->
  ("01-" ++ value) as Date {format: "dd-MMM-yyyy"}
)
```

**Why:** Comparing parsed dates gives calendar ordering instead of lexicographic ordering.

## Q10

```dataweave
%dw 2.0
import camelize from dw::core::Strings
output application/json

fun normalize(value) = value match {
  case object ->
    value mapObject ((item, key) -> {
      (camelize((key as String) replace "_" with " ")): normalize(item)
    })
  case array -> value map ((item) -> normalize(item))
  else -> value
}
---
normalize(payload)
```

**Why:** Pattern matching separates objects, arrays, and scalar values. Recursion applies the same rule at every nesting level.

## Alternative-solution exercise

After understanding each answer, try solving Q3 with `mapObject`, Q6 with an indexed lookup object, and Q10 without importing a string case-conversion helper. The goal is not to memorize one script; it is to understand the transformation model.
