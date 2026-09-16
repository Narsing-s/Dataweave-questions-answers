# A473 — Current DataWeave visibility-migration gap

This question covers a specific DataWeave 2.12 visibility migration behavior that is distinct from the existing general scope-visibility question.

## A473 — Migrating `@Internal(permits=...)` visibility to `@VisibleTo`
**Question:** A DataWeave library previously used `@Internal(permits=...)` to widen access to selected components. In DataWeave 2.12, what is the newer visibility model for this use case, and what must the library provide so `@VisibleTo` can resolve the permitted component names?

**Answer:** DataWeave 2.12 introduces explicit scope visibility with `private`, `internal`, and `@VisibleTo`. For code that previously used `@Internal(permits=...)`, the newer model uses `internal` together with `@VisibleTo` to widen access to specifically named components. The component names used by `@VisibleTo` are resolved through component metadata, represented by `dw-components.dwl`; its top-level value is a `ComponentsDescriptor` containing `ComponentDescriptor` entries whose `name` identifies the component and whose `resources` identify its DataWeave modules. This makes visibility an explicit library/component contract rather than an annotation-local permits list.

**Focus:** DataWeave 2.12 scope-visibility migration, `@VisibleTo`, and component metadata resolution.

---

## Source basis
- MuleSoft DataWeave Scope Visibility documentation: current `private`, `internal`, and `@VisibleTo` model and migration guidance from `@Internal(permits=...)`.
- MuleSoft DataWeave Component Types documentation: `ComponentsDescriptor`, `ComponentDescriptor`, `ComponentName`, `ModuleDescriptor`, and `NameIdentifier` used by `dw-components.dwl`.
