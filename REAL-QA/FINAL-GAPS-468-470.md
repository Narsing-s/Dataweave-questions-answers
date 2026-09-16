# A468-A470 — Current DataWeave annotation-target and metadata gaps

These questions cover annotation concepts that remain materially distinct from the existing annotation, visibility, versioning, and runtime questions.

## A468 — `@AnnotationTarget` restricting a custom annotation
**Question:** A custom annotation is intended to be used only on functions and variables. How can `@AnnotationTarget(targets = ["Function", "Variable"])` enforce that boundary, and what happens conceptually when the annotation is applied to an unsupported target?

**Answer:** `@AnnotationTarget` declares the valid target kinds for an annotation. Restricting the targets to `Function` and `Variable` prevents the annotation from being treated as valid on unrelated targets such as parameters or imports. The restriction is part of annotation semantics and gives the compiler a defined target boundary rather than relying on documentation alone.

**Focus:** custom-annotation target restrictions and compile-time validity.

---

## A469 — `@Metadata` identifying an annotation as metadata
**Question:** A DataWeave annotation is intended to represent metadata rather than ordinary executable behavior. What role does `@Metadata(key = "...")` play, and why is this different from merely adding a descriptive label to the annotation?

**Answer:** `@Metadata` marks an annotation as representing metadata and associates it with a metadata key. This establishes metadata semantics for tooling/compiler processing; it is different from `@Labels`, which supplies discovery labels for a function or variable. The annotation's metadata role therefore concerns how annotation information is represented and interpreted, not simply how a definition can be found.

**Focus:** annotation metadata semantics versus discovery labels.

---

## A470 — `@Experimental` as an explicit stability boundary
**Question:** A library exposes a feature whose API or behavior may change or be removed in a future DataWeave release. Why would the library mark it with `@Experimental`, and how should consumers interpret that annotation differently from `@Deprecated`?

**Answer:** `@Experimental` identifies functionality as experimental and subject to change or removal. It communicates an intentionally unstable API boundary. `@Deprecated` instead marks an existing feature as deprecated and can identify a replacement and the version since which the deprecation applies. Therefore, experimental status warns that the feature itself is not yet a stable contract, while deprecation signals that an established feature should no longer be preferred.

**Focus:** API stability signaling and the distinction between experimental and deprecated functionality.

---

## Source basis
- MuleSoft DataWeave Core Annotations documentation: `@AnnotationTarget`, `@Metadata`, `@Experimental`, and `@Deprecated`.
