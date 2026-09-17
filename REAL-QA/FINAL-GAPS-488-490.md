# A488-A490 — DataWeave 2.12.3 Current Runtime and Compatibility Gaps

These questions were added only after checking the existing repository for the exact concepts. They focus on current DataWeave runtime behavior that is distinct from ordinary transformation exercises.

## A488 — DataWeave script parser cache sizing

**Difficulty:** Advanced

**Question:** What problem does `mule.weave.script.parser.cache.size` address in a DataWeave application?

**Answer:** It controls the size of the DataWeave script parser cache. The cache can reduce repeated parsing work when scripts are compiled repeatedly. It is a runtime/system-property tuning concern rather than a transformation function.

**Production scenario:** An application dynamically evaluates many DataWeave scripts and parser overhead becomes significant. Investigate parser-cache sizing together with actual runtime measurements instead of changing the value blindly.

**Common mistake:** Assuming this property changes DataWeave transformation results. It affects parser caching, not the business output of a correctly executed script.

**Interview tip:** Distinguish transformation semantics from runtime performance configuration.

---

## A489 — Java 17 JPMS access restrictions at the DataWeave boundary

**Difficulty:** Advanced

**Question:** Why can Java 17 module-system restrictions matter when DataWeave interacts with Java classes?

**Answer:** Java's module system can restrict reflective access to classes and members. DataWeave Java interoperability therefore depends not only on the shape of the Java object but also on whether the runtime is permitted to access the required members. Recent DataWeave releases improved handling of JPMS access restrictions.

**Production scenario:** A Java integration works on one environment but fails after moving to a Java 17+ runtime. Check module accessibility, exported/open packages, Java class design, and the DataWeave/Java interoperability boundary before changing the transformation itself.

**Common mistake:** Treating every Java reflection failure as a DataWeave selector or mapping error.

**Interview tip:** Explain the three layers separately: DataWeave mapping -> Java interoperability -> Java module access.

---

## A490 — Self-referential type metadata and recursive models

**Difficulty:** Advanced

**Question:** What special risk exists when DataWeave processes type metadata for self-referential recursive types?

**Answer:** A recursive type can refer to itself directly or indirectly. Type-metadata processing must avoid recursively expanding the same type forever. Recent DataWeave releases addressed stack-overflow conditions involving self-referencing recursive types.

**Example model:**
```dataweave
%dw 2.0
output application/json

type Node = {
  value: String,
  next?: Node
}
---
{
  example: "A Node type can refer to another Node"
}
```

**Explanation:** Recursive data models are different from ordinary nested object types because the type graph can contain a cycle. The important interview concept is the distinction between traversing actual finite data and recursively resolving type metadata.

**Common mistake:** Assuming a recursive type declaration means the runtime must contain an infinitely nested value.

**Interview tip:** A finite linked-list payload can use a recursive type safely; the recursive part describes the allowed shape, not an infinite concrete payload.
