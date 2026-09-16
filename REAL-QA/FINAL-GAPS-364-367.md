# A364-A367 — Current DataWeave 2.12 Edge-Case Gaps

These questions are intentionally narrow and non-duplicate. They cover documented DataWeave 2.12.x behavior that is different from the existing selector, metadata, and Java-interoperability questions.

---

## A364 · Repeated attribute selector preserves empty map slots

**Difficulty:** Advanced  
**Topic:** XML selectors / repeated attributes / empty values

### Question
Given XML containing repeated attributes on sibling elements, use a DataWeave selector to collect the attribute values and explain why the result can contain an empty map slot when an element does not have that attribute.

Input:
```xml
<orders>
  <order id="A1" status="NEW"/>
  <order id="A2"/>
  <order id="A3" status="PAID"/>
</orders>
```

What should an implementation consider when using the repeated-attribute selector form `.*@status` in DataWeave 2.12.x?

### Expected behavior
The selector is evaluated across the repeated `order` elements. DataWeave 2.12.2 changed the behavior so repeated attribute selection preserves the positional result when an element has no matching attribute rather than silently collapsing the missing position.

Conceptually, the result preserves the distinction between:
- the first element having `status`,
- the second element having no `status`, and
- the third element having `status`.

### Explanation
This is different from ordinary attribute lookup on one known element. The important issue is **collection shape preservation** during a repeated attribute selector. Downstream code that assumes every selected position contains a concrete string can therefore need explicit null/missing-value handling.

### Common mistake
Assuming `.*@status` behaves exactly like mapping each element with a simple `@status` selector and automatically removing missing positions.

### Interview tip
When selecting attributes across repeated XML nodes, ask whether the operation preserves positional correspondence. This matters when the result is later zipped with another collection or used to correlate records.

---

## A365 · Type metadata sibling references must not duplicate annotations

**Difficulty:** Advanced  
**Topic:** Type metadata / annotations / sibling references

### Question
A DataWeave type contains metadata references to sibling type definitions. Explain the compatibility concern addressed in DataWeave 2.12.2 when metadata is resolved through sibling references.

Example design:
```dw
%dw 2.12
output application/json

type Address = {
  street: String,
  city: String
}

type Customer = {
  name: String,
  address: Address
}
---
{
  customerType: Customer
}
```

Why should tooling or generated metadata not treat the same annotation as newly declared every time the sibling type is referenced?

### Expected behavior
A metadata annotation attached to a type should remain represented once according to its declaration/reference semantics. DataWeave 2.12.2 fixed a case where sibling-reference resolution could cause annotations to be duplicated in type metadata.

### Explanation
This is a **metadata graph identity** problem rather than an ordinary type-definition problem. Two references to the same sibling type should not be interpreted as two independent declarations of the same annotation. Duplicate metadata can affect tooling, generated descriptors, inspection, or consumers that iterate annotations.

### Common mistake
Treating type metadata as if every reference creates a fresh metadata declaration.

### Interview tip
Separate the concepts of a type reference and a type declaration. Reusing a type should not implicitly duplicate its declaration-level metadata.

---

## A366 · Self-referential Java arrays and DataWeave scope resolution

**Difficulty:** Advanced  
**Topic:** Java interoperability / recursive metadata / array types

### Question
A Java class exposes an array type whose metadata refers back to the enclosing or recursively related Java type. What compatibility problem should be considered when DataWeave resolves that self-referential Java array type?

Illustrative Java shape:
```java
class Node {
    private Node[] children;
    public Node[] getChildren() { return children; }
}
```

The transformation reads a `Node` object and accesses `children` recursively.

### Expected behavior
DataWeave 2.12.1 included a fix for self-referential Java array scope resolution. A recursive Java array type such as `Node[]` must resolve against the correct Java metadata scope instead of incorrectly failing because the recursive type has not yet been fully resolved.

### Explanation
The important distinction is between ordinary Java-array interoperability and **recursive type scope resolution**. The array itself is not the hard part; resolving its component type when that component type points back into the same recursive object graph is.

### Common mistake
Assuming every Java array problem is caused by collection conversion or serialization. Recursive metadata resolution can fail before the transformation reaches normal collection processing.

### Interview tip
When debugging Java interoperability, classify the failure as value conversion, member lookup, metadata resolution, or recursive type resolution before changing the DataWeave expression.

---

## A367 · Recursive type metadata and stack-overflow protection

**Difficulty:** Advanced  
**Topic:** Recursive types / compiler metadata / failure boundaries

### Question
Consider a recursive DataWeave type graph where type metadata resolution repeatedly follows a self-reference. What implementation concern exists when the compiler or metadata resolver encounters recursive type metadata?

Example:
```dw
%dw 2.12
output application/json

type Node = {
  value: String,
  next: Node | Null
}
---
{
  example: "recursive type"
}
```

Explain why recursive type metadata must be resolved with cycle awareness rather than by blindly expanding the type indefinitely.

### Expected behavior
DataWeave 2.12.1 addressed a recursive type-metadata stack-overflow case. Recursive metadata resolution must recognize the recursive boundary rather than repeatedly expanding the same type until the runtime/compiler stack is exhausted.

### Explanation
A recursive type is valid as a graph, but it is not a finite tree if every reference is expanded indefinitely. Metadata resolution therefore needs cycle-aware handling. This is distinct from ordinary recursive data traversal, where the input itself may be finite and the transformation can explicitly stop at `null`.

### Common mistake
Confusing a recursive **type definition** with an infinitely large **input value**. The type can be recursive even when a particular input contains only two or three linked nodes.

### Interview tip
When a recursive type causes a compiler or metadata problem, investigate type-resolution cycles separately from runtime recursion and tail-recursion optimization.

---

## Why these four are not duplicates

- **A364** is specifically repeated XML attribute selection and positional preservation for missing attributes.
- **A365** is type-metadata annotation identity when sibling type references are resolved.
- **A366** is Java interop scope resolution for self-referential Java arrays.
- **A367** is cycle-aware recursive DataWeave type-metadata resolution and stack-overflow protection.

They address different input/model layers: XML selector result shape, metadata graph identity, Java metadata scope resolution, and recursive DataWeave type resolution.
