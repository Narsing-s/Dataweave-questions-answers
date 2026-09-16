# DataWeave Visual Diagrams

## Data transformation pipeline

```text
Source payload
     │
     ▼
Selectors / Variables
     │
     ▼
Normalization
     │
     ├── map / mapObject
     ├── filter / filterObject
     ├── reduce / groupBy
     └── flatten / distinctBy / orderBy
     │
     ▼
Business rules
     │
     ▼
Target structure
     │
     ▼
JSON / XML / CSV / Java / other output
```

## Array vs object transformation

```text
Array [a, b, c] ── map ──► [A, B, C]

Object {a:1,b:2} ── mapObject ──► {A:2,B:4}
```

## Filtering

```text
Input collection
      │
      ▼
Predicate
   ┌──┴──┐
 true  false
  │      │
  ▼      X
output  discard
```

`filter` is normally used with arrays. `filterObject` is used with objects.

## Aggregation

```text
Many records
    │
    ├── groupBy ──► logical groups
    │                  │
    │                  ▼
    │                mapObject
    │                  │
    │                  ▼
    └──────────────► summary
```

## Mule event context

```text
Mule Event
 ├── payload
 ├── attributes
 └── variables
       │
       ▼
   DataWeave
       │
       ▼
 transformed payload / variables / output
```

## Error-handling decision

```text
Transformation
      │
      ▼
Expected input?
  ┌───┴────┐
 yes       no
 │          │
 ▼          ▼
process   default / guard / explicit error
```

The diagrams are intentionally conceptual: exact behavior depends on the expression, input types and runtime version.
