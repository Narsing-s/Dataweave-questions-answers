# A474-A475 — Current DataWeave extension testing/dependency gaps

These questions cover two distinct DataWeave Extension workflows that were not materially represented in the curated bank after checking existing testing, Maven, and Language Server coverage. They focus on practical development tooling rather than repeating runtime transformation questions.

## A474 — DataWeave Dependencies View
**Question:** A DataWeave library consumes functions from several DataWeave dependencies, and you need to inspect which dependency versions/files are actually resolved by the project and navigate into their DataWeave sources. Which DataWeave Extension feature is designed for this, and what does it provide?

**Answer:** Use the **DataWeave Dependencies view** in the DataWeave Extension. It shows the dependencies resolved for the DataWeave project and allows navigation to DataWeave files contained in those dependencies. This is different from merely listing Maven coordinates in `pom.xml`: the view is intended to inspect the DataWeave dependency graph as resolved by the development tooling and to open dependency-provided DataWeave sources.

**Focus:** dependency inspection and source navigation in the DataWeave development environment.

---

## A475 — Unit test versus integration mapping for a DataWeave module
**Question:** A reusable DataWeave module contains a function that should be tested without exposing a test mapping to library consumers. The team also wants an executable mapping scenario for manually previewing or exercising the module. How do a generated unit test and an integration mapping differ in purpose and location?

**Answer:** A **unit test** is generated as a test file under `src/test/dw` and uses the DataWeave Testing Framework (`dw::test::Tests` and `dw::test::Asserts`) to define test cases and suites that evaluate a function and assert its result. An **integration mapping** is also created under `src/test/dw`, but it provides a mapping scenario for exercising a module function and can be run or previewed as a mapping. The distinction is purpose: unit tests express repeatable assertions as tests, while an integration mapping is a reusable development scenario for invoking/exercising the module without making that scenario part of the module's consumer-facing API.

**Focus:** separating automated unit-test assertions from executable development/integration mapping scenarios.

---

## Source basis
- MuleSoft DataWeave Extension documentation: the Dependencies view shows resolved project dependencies and permits navigation into DataWeave files inside dependencies; the same documentation distinguishes unit tests from integration mappings and places generated test artifacts under `src/test/dw`.
