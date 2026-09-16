# A483 — Creating a standalone DataWeave library project

**Difficulty:** Advanced  
**Topic:** DataWeave Extension / project structure / Maven library setup

## Question

A developer wants to build reusable DataWeave modules and mappings outside a Mule application using the DataWeave Extension. What does the **Create New Library Project** workflow establish, which project coordinates must be supplied, and where do production code, tests, resources, and the Maven descriptor belong?

## Expected answer

Use the DataWeave Extension's **DataWeave: Create New Library Project** command. The workflow creates a standalone DataWeave library project backed by Maven.

The initial project configuration asks for:

- **Organization ID (Group ID)**
- **Artifact ID**
- **Version**
- **Project name**
- The directory in which the project is created

The resulting structure separates production DataWeave code from tests and test resources:

```text
project/
├── src/
│   ├── main/
│   │   ├── dw/          # production mappings and modules
│   │   └── resources/   # production resources
│   └── test/
│       ├── dw/          # DataWeave tests
│       └── resources/   # test/scenario resources
└── pom.xml              # Maven project/dependency configuration
```

This structure matters because the DataWeave Extension uses the Maven project to resolve and index dependencies, while the `src/main/dw` and `src/test/dw` locations distinguish reusable production assets from tests.

## Why this is a distinct gap

This is not the same as A476's multi-project workspace support, A474's Dependencies View, or A475's unit-test/integration-mapping distinction. Those questions assume an existing DataWeave project or focus on dependency/testing behavior. A483 covers the initial standalone-library project bootstrap and its source/test/resource layout.

## Common mistake

Do not treat a standalone DataWeave library project as simply a folder containing `.dwl` files. The extension creates a Maven-backed project with defined production/test/resource locations and project coordinates used for dependency and library management.
