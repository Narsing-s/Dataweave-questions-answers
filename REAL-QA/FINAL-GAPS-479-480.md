# A479 — Define Sample Data and DataWeave Scenarios

## Question
A developer has a reusable DataWeave mapping and wants repeatable sample inputs that can drive preview, autocompletion, and mapping tests. What does the DataWeave Extension's **Define Sample Data** workflow create, and where are the resulting scenarios stored?

## Answer
Use **Define Sample Data** on the mapping. The extension creates sample input resources as a DataWeave scenario for the mapping. A scenario groups the inputs and, when testing, the expected output needed to exercise the mapping.

Scenarios are stored under `src/test/resources` in a directory associated with the mapping. The scenario can then be selected for preview, used to provide structure-aware autocompletion, and used as the basis for mapping tests.

This is distinct from A475: A475 focuses on the purpose and location of generated unit tests versus integration mappings, while this question focuses on the sample-data/scenario mechanism that supplies reusable mapping inputs and expected outputs.

## Source
MuleSoft documents **Define Sample Data**, DataWeave scenarios, their `src/test/resources` structure, and their use for preview, autocompletion, and testing.

---

# A480 — DataWeave Extension language features and code inspections

## Question
A developer wants IDE assistance while authoring a DataWeave library, including completion, navigation, refactoring, quick fixes, and guidance for common DataWeave idioms. Which DataWeave Extension language features provide this support, and what are code inspections intended to do?

## Answer
The DataWeave Extension Language Edition provides **completion, navigation, code editing, and code inspection** capabilities.

Examples include:
- completion for visible functions, variables, types, and fields inferred from types;
- navigation to local definitions and imported library definitions;
- find references, local/cross-file refactors, outlines, parameter information, and hover documentation;
- quick fixes such as auto-importing a function or creating a missing function, variable, or type; and
- code inspections that suggest replacements for recognized DataWeave idioms, including documented inspections for patterns involving `default`, `typeOf`, and `isEmpty`.

These are authoring/tooling capabilities; they are not substitutes for runtime execution or transformation tests.

## Source
MuleSoft documents the DataWeave Extension Language Edition features, including completion, navigation, code editing, quick fixes, and code inspections.
