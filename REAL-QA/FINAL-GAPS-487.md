# DataWeave Extension — Final Gap 487

This question was added only after checking the current DataWeave Extension documentation and searching the repository for existing coverage. The repository already covers Maven documentation generation, generated-document customization, independent documentation deployment, and function-description annotations. This question targets the distinct **editor-side documentation-template generation workflow** in the DataWeave Extension.

## A487 — Generate a DataWeave function documentation template from the editor

**Difficulty:** Intermediate

**Question:**
A developer has written a public function in a DataWeave module and wants to document it before publishing the library. They are using the DataWeave Extension in Visual Studio Code. What editor action can generate the documentation template, where does the generated content appear, and how is this different from Maven documentation generation and `@GlobalDescription`?

**Answer:**
The DataWeave Extension provides the **Generate Weave Documentation** action above a function in a `.dwl` file. Selecting it generates a documentation template as a comment above that function, giving the developer a starting structure for documenting the function before library publication.

This is different from **Maven documentation generation**, which is part of the library build/delivery process and generates the published documentation output. It is also different from **`@GlobalDescription`**, which controls the global description metadata used for overloaded functions; the editor action is an authoring aid that inserts a documentation comment template.

**Expected result:**
The selected DataWeave function receives an auto-generated documentation comment template above the function, which the developer can complete with the appropriate description and parameter/return documentation before publishing the library.

**Common mistake:**
Treating the editor's documentation-template action as the final documentation publishing step, or assuming that it replaces annotation-based metadata such as `@GlobalDescription`.

**Interview tip:**
Separate the lifecycle into **authoring → build/documentation generation → publication**. The extension action helps author documentation; Maven handles build-time documentation generation and deployment; annotations provide DataWeave metadata semantics.
