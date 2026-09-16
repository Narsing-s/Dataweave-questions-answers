# A482 — Working with DataWeave component descriptor types

**Difficulty:** Advanced  
**Topic:** DataWeave 2.12 / component metadata / `dw::meta::Component`

## Question

A DataWeave 2.12 library uses `META-INF/dw-components.dwl` to describe which DataWeave resources belong to a component. You need to reason about the DataWeave types that represent this descriptor rather than treating the descriptor as an arbitrary JSON-like object. Which `dw::meta::Component` types model the descriptor, and what does each one represent?

## Expected answer

The component-descriptor model is exposed through the `dw::meta::Component` types:

- `ComponentsDescriptor` — the top-level array type representing the complete `dw-components.dwl` descriptor.
- `ComponentDescriptor` — one component entry, containing the component `name` and its `resources`.
- `ComponentName` — the string identifier of a component; this is the name referenced by `@VisibleTo`.
- `ModuleDescriptor` — metadata for an individual resource/module owned by a component; currently its definition is reserved for future fields and is represented by `{}`.
- `NameIdentifier` — the fully qualified DataWeave module/resource name, using `::`, such as `"dw::core::Strings"`.

This is distinct from A473: A473 focuses on visibility and migration from `@Internal(permits=...)` to `private`/`internal`/`@VisibleTo`. A482 focuses on the type model used to represent and reason about the component descriptor itself.

## Practical example

Conceptually, a component descriptor can be represented as:

```dwl
%dw 2.0
---
[
  {
    name: "analytics",
    resources: {
      "acme::analytics::Metrics": {}
    }
  }
]
```

The top-level value is a `ComponentsDescriptor`; each array element is a `ComponentDescriptor`; `analytics` is a `ComponentName`; the resource key is a `NameIdentifier`; and `{}` is the current `ModuleDescriptor` value for that resource.

## Why this is a distinct gap

This is not another `private`/`internal`/`@VisibleTo` question. The repository already covers component visibility, descriptor generation/packaging, and version-aware component language levels. The missing concept is the dedicated `dw::meta::Component` type model for reading the descriptor structure and understanding its typed fields.

## Common mistake

Do not confuse the component descriptor with a Maven POM, a DataWeave module, or an arbitrary application configuration object. The descriptor has a defined DataWeave type model and is used by the compiler to associate resources with components for visibility resolution.
