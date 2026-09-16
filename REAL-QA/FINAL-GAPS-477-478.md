# A477 — DataWeave Extension integration with Anypoint Code Builder

## Question
A team uses Anypoint Code Builder and wants to develop DataWeave libraries and mappings with the DataWeave Extension rather than maintaining a separate DataWeave tooling workflow. What integration is supported, and what does it enable?

## Answer
The DataWeave Extension can integrate with Anypoint Code Builder. This lets DataWeave development capabilities be used within the Anypoint Code Builder environment, so developers can work with DataWeave mappings and custom DataWeave libraries in that IDE workflow.

This is distinct from multi-project workspace support: the integration is about the DataWeave Extension working with Anypoint Code Builder, while A476 focuses on independently handling multiple DataWeave projects in one workspace.

## Source
MuleSoft DataWeave Extension release notes document Anypoint Code Builder integration in DataWeave Extension 2.10.2 (March 21, 2025).

---

# A478 — Run and debug a DataWeave mapping with breakpoints

## Question
A DataWeave mapping produces an unexpected intermediate value, and the developer wants to inspect execution rather than only looking at the final preview. What DataWeave Extension workflow can be used to debug the mapping, and what is the role of breakpoints?

## Answer
Use the DataWeave Extension's run/debug workflow for the mapping and set breakpoints at relevant DataWeave statements or expressions. When execution pauses at a breakpoint, the developer can inspect the current execution context and step through the mapping to locate where the produced value diverges from the expected result.

This is different from ordinary preview: preview is useful for quickly seeing a transformation result, while debugging is intended for investigating execution behavior interactively. It is also different from the DataWeave language-server troubleshooting coverage, which deals with tooling/server problems rather than debugging the mapping's transformation logic.

## Source
MuleSoft documents a DataWeave Extension workflow for running and debugging mappings, including breakpoint-based debugging.
