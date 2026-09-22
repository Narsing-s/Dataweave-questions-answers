# Web-Sourced DataWeave Questions — Batch 009

Curated from current MuleSoft DataWeave reference material and checked against the repository for direct topic coverage. Only questions that were not found as dedicated Q&A scenarios were added.

## Q72 — How do you calculate the square root of a number in DataWeave?

**Answer:** Use the `sqrt` function. It accepts a Number and returns its square root.

**Example**
```dataweave
%dw 2.0
output application/json
---
{
  value: 144,
  squareRoot: sqrt(144)
}
```

**Output**
```json
{
  "value": 144,
  "squareRoot": 12
}
```

**Explanation:** `sqrt(number)` calculates the square root directly. It is useful when a transformation needs mathematical calculations without manually implementing the operation. MuleSoft documents `sqrt` as a core DataWeave function. citeturn1search2turn1search1

## Q73 — How do you create an XML `xsi:type` attribute with DataWeave?

**Answer:** Use `xsiType(name, namespace)` with a dynamic attribute on the XML element.

**Example**
```dataweave
%dw 2.0
output application/xml
ns acme http://acme.com
---
{
  user @((xsiType("customer", acme))): {
    name: "Ravi"
  }
}
```

**Output**
```xml
<?xml version='1.0' encoding='UTF-8'?>
<user xsi:type="acme:customer" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:acme="http://acme.com">
  <name>Ravi</name>
</user>
```

**Explanation:** `xsiType` creates an object representing the `xsi:type` attribute, so it is used with a dynamic attribute. MuleSoft documents this function for DataWeave 2.2.2 and later. citeturn1search0turn1search6