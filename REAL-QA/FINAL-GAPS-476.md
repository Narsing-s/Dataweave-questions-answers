# A476 — DataWeave Extension multi-project workspace support

## Question
A developer is working on multiple DataWeave library projects in the same Visual Studio Code workspace and wants the DataWeave Extension to understand each project independently instead of treating the workspace as a single DataWeave project. What extension capability supports this workflow, and when is it useful?

## Answer
Use the **multi-project workspace support** provided by the DataWeave Extension. It allows multiple DataWeave projects to coexist in the same Visual Studio Code workspace while the extension recognizes the individual projects and their respective DataWeave project context.

This is useful when developing several related DataWeave libraries or projects together, especially when one project is a reusable dependency of another. It is a development-environment capability rather than a DataWeave language transformation feature, so it should not be confused with Maven dependency resolution or runtime module visibility.

## Focus
DataWeave Extension workspace/project management and multi-project development.

## Why this is a distinct gap
The curated bank already covers DataWeave dependency inspection/source navigation (A474) and Maven library packaging/testing/deployment. This question is specifically about the IDE workspace model for **multiple DataWeave projects**, so it is not a rewording of dependency resolution, Maven packaging, or runtime visibility questions.

## Source basis
MuleSoft's DataWeave Extension release notes document multi-project workspace support as an extension capability.
