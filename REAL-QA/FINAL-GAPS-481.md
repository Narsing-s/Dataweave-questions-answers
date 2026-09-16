# A481 — Creating a DataWeave mapping test from a snapshot

## Question
A developer has a DataWeave mapping that already produces the desired output for a particular input and wants to turn that working example into a repeatable mapping test without manually rebuilding the test scenario. Which DataWeave Extension workflow should be used, and what does it capture?

## Answer
Use the **DataWeave: Create Mapping Test** workflow from the mapping file. The extension creates a new mapping-test `.dwl` file from a snapshot of the mapping's current input and current output. The resulting scenario can also be reused as a normal preview/autocompletion scenario.

This is different from generating a **unit test for a module function** (A475): a mapping test captures an executable mapping scenario and its expected result, whereas the unit-test workflow targets a reusable module function and its assertions. It is also different from merely defining sample data (A479), because the mapping-test workflow captures the current output as part of the test scenario.

## Source
MuleSoft's DataWeave Extension documentation describes the `Create Mapping Test` workflow as creating a mapping test from a snapshot of the input and current output, with the resulting scenario usable for preview or autocompletion.
