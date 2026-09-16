# Mastering DataWeave — 10 Practice Challenges

Try these first without looking at `ANSWERS.md`.

## Q1 — XML attributes

Convert this XML into a JSON array containing `code` and `name`.

```xml
<products>
  <product code="P01">Keyboard</product>
  <product code="P02">Mouse</product>
  <product code="P03">Monitor</product>
</products>
```

Expected shape:

```json
[
  {"code":"P01","name":"Keyboard"},
  {"code":"P02","name":"Mouse"},
  {"code":"P03","name":"Monitor"}
]
```

## Q2 — Replace the last delimiter

Input:

```json
{"value":"IN/FINANCE/2026/STATEMENT"}
```

Change only the final `/` to `|`.

Expected result:

```text
IN/FINANCE/2026|STATEMENT
```

## Q3 — Group IDs by embedded year

Input:

```json
{"ids":["TXN-2026-001","TXN-2025-002","TXN-2026-003","TXN-2024-004"]}
```

Return an object grouped by the four-digit year.

## Q4 — Dynamic object keys

Input:

```json
[
  {"employee":"Ravi","code":"E101"},
  {"employee":"Meena","code":"E102"},
  {"employee":"Arjun","code":"E103"}
]
```

Create one object per employee where the employee name is the key.

## Q5 — Flat rows to hierarchical invoices

Input CSV:

```csv
invoice,supplier,total,item,quantity
I100,Acme,300,Keyboard,2
I100,Acme,300,Mouse,3
I200,Zenith,150,Monitor,1
I200,Zenith,150,Stand,2
```

Create one invoice object per invoice with an `items` array.

## Q6 — Enrich employees from departments

Input:

```json
{
  "employees":[
    {"id":"E3","name":"Sara"},
    {"id":"E1","name":"Rohit"},
    {"id":"E2","name":"Kiran"}
  ],
  "departments":[
    {"name":"Finance","employeeIds":["E1","E3"]},
    {"name":"Technology","employeeIds":["E2"]}
  ]
}
```

Add the matching department to each employee and sort by ID.

## Q7 — Group CSV values

Input:

```csv
region,product
North,Laptop
South,Phone
North,Mouse
South,Tablet
North,Keyboard
```

Return:

```json
{
  "North":["Laptop","Mouse","Keyboard"],
  "South":["Phone","Tablet"]
}
```

## Q8 — XML filter with a reusable function

Return only customers with a numeric score of at least 80 and include the XML `id` attribute.

```xml
<customers>
  <customer id="C1"><name>Asha</name><score>91</score></customer>
  <customer id="C2"><name>Vikram</name><score>74</score></customer>
  <customer id="C3"><name>Neha</name><score>86</score></customer>
</customers>
```

## Q9 — Chronological month sorting

Sort this array chronologically, not alphabetically:

```json
["Nov-2025","Jan-2024","Mar-2026","Jul-2024","Feb-2025"]
```

## Q10 — Recursive key transformation

Convert all object keys from `snake_case` to `camelCase`, including nested objects and objects inside arrays.

```json
{
  "customer_name":"Asha",
  "address_details":{"postal_code":"530001"},
  "accounts":[{"account_number":"AC1001","account_type":"Savings"}]
}
```

Do not modify primitive values.
