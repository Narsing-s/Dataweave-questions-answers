# DataWeave Extension — Final Gaps 484-486

These questions were added only after checking the current DataWeave Extension documentation and searching the repository for the specific concepts. They target distinct extension/project-authoring behavior that was not represented by the existing curated questions. They are not reworded versions of the existing testing, scenario, debugging, dependency-view, or project-bootstrap questions.

## A484 — Diagnose DataWeave dependency loading and indexing before library navigation

**Difficulty:** Intermediate

**Question:**
A developer creates a DataWeave library project and immediately tries to search or navigate into functions from its Maven dependencies. The dependency APIs are not yet available in completion or navigation. What project-level preparation does the DataWeave Extension perform, and what should the developer wait for before concluding that dependency resolution or library navigation is broken?

**Answer:**
The DataWeave Extension loads and indexes the project's dependencies before it can search those libraries and make their DataWeave sources available to the project. The extension shows dependency-loading and indexing progress in Visual Studio Code. The developer should allow dependency loading and indexing to complete before diagnosing missing completion/navigation as a dependency problem.

This is different from the DataWeave Dependencies View covered elsewhere: the Dependencies View explains how to inspect already-resolved dependencies, while this question focuses on the prerequisite loading/indexing lifecycle that makes those dependencies searchable and navigable.

**Expected result:**
After dependency loading and indexing completes, the project can resolve and expose the relevant dependency content to the extension's search/navigation features, subject to the dependency being correctly declared and available.

**Common mistake:**
Treating the temporary absence of completion or source navigation while dependencies are still loading as proof that the Maven dependency is invalid.

**Interview tip:**
Separate **Maven dependency resolution** from **DataWeave Extension indexing**. A dependency can be correctly declared while the editor is still processing it.

---

## A485 — Choose between creating a DataWeave module and creating a DataWeave mapping

**Difficulty:** Intermediate

**Question:**
A developer is starting a new DataWeave library and must choose between **DataWeave: Create New Module** and **DataWeave: Create New Mapping**. What is the functional difference, where does each file belong in a normal DataWeave project, and when should each be used?

**Answer:**
A DataWeave **module** is a reusable `.dwl` source file that defines reusable functions, variables, types, and namespaces. It does not contain an output directive, body expression, or `---` separator. The extension creates a new module under `src/main/dw`.

A DataWeave **mapping** is an executable `.dwl` transformation. It can define functions, variables, types, and namespaces and also has a body section after `---`. It transforms one or more inputs into a single output and can be developed as a reusable library asset. A newly created mapping is also placed under `src/main/dw`.

Use a **module** when the primary goal is to publish reusable transformation logic. Use a **mapping** when the primary artifact is an executable transformation with an output.

**Expected result:**
The project contains the appropriate `.dwl` artifact in `src/main/dw`, with module semantics used for reusable declarations and mapping semantics used for an executable transformation.

**Common mistake:**
Assuming that every `.dwl` file is interchangeable and that a module can contain an executable `---` body just because mappings can.

**Interview tip:**
Remember the distinction as **module = reusable declarations** and **mapping = executable transformation**. Both are `.dwl` files, but their roles and allowed structure differ.

---

## A486 — Compare Run Preview with AutoPreview in the DataWeave Extension

**Difficulty:** Intermediate

**Question:**
A developer is iterating rapidly on a DataWeave module or mapping in Visual Studio Code. They want either a one-time preview or automatic preview execution after every file change. Which DataWeave Extension features provide these two workflows, and when is each appropriate?

**Answer:**
The DataWeave Extension provides **DataWeave: Run Preview** for an explicit, one-time preview execution. It also provides **DataWeave: Enable AutoPreview**, which reruns the preview whenever the file changes.

For a module, the preview workflow normally uses an integration mapping under `src/test/dw` to import and invoke the module's functions. For a mapping, preview uses the mapping's configured sample-data/scenario inputs.

Use **Run Preview** when you want deliberate execution at a chosen point. Use **AutoPreview** when you are making repeated edits and want continuous feedback without manually starting each preview.

This question is intentionally separate from the repository's existing debugging question: preview is a rapid authoring-feedback workflow, whereas run/debug provides step-by-step execution and breakpoint-based investigation.

**Expected result:**
Run Preview executes the current preview on demand, while AutoPreview automatically reruns the preview after file changes.

**Common mistake:**
Treating preview as proof that the deployed Mule application will behave identically in production. Preview is a development feedback mechanism; runtime behavior still needs validation in the target runtime/context.

**Interview tip:**
Explain the workflow distinction as **manual preview for controlled feedback** versus **automatic preview for rapid iteration**.
