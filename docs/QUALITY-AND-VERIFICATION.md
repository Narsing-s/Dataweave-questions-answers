# DataWeave Lab — Quality and Verification

## What is structurally verified?

The repository workflow verifies that the generated practice bank has:

- exactly 10,000 records
- IDs from `DW-00001` to `DW-10000`
- required question fields
- supported Easy/Medium/Advanced levels
- DataWeave 2.x headers
- readable Markdown material for each level

## What is not automatically guaranteed?

A static JSON/schema check cannot prove that every transformation executes successfully on every Mule runtime. Writer settings, DataWeave language level, input types, modules and runtime behavior can affect execution.

Therefore the correct verification model is:

```text
Schema / structure validation
          ↓
Static DataWeave sanity checks
          ↓
Runtime execution in target Mule/DataWeave version
          ↓
Expected output comparison
          ↓
Human review for explanation and edge cases
```

## Curated vs generated material

The repository deliberately keeps two categories:

### Curated examples

These are hand-authored examples in the Easy, Medium and Advanced folders. They demonstrate the intended quality standard and contain realistic explanations and interview guidance.

### Generated practice bank

The 10,000-record dataset provides a large searchable practice bank. It is deterministic and structurally validated, but generated records should not be described as individually runtime-certified unless they have actually been executed against the relevant runtime.

## Before production use

For any transformation copied into a MuleSoft application:

1. Confirm the DataWeave language/runtime version.
2. Confirm the real input type and schema.
3. Test null, empty and unexpected values.
4. Execute the transformation with representative production-like data.
5. Compare the actual output with the required contract.
6. Add an MUnit test when the transformation is important to the application.

This distinction keeps the repository useful without overstating what static validation proves.
