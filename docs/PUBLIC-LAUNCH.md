# DataWeave Lab — Public Launch Guide

## Purpose

DataWeave Lab is an open-source learning project focused on MuleSoft DataWeave practice, interview preparation, realistic transformations, explanations, and edge cases.

The repository contains a 10,000-record structured practice bank plus separately curated Easy, Medium, Advanced, and Critical material. The structured bank is statically validated; individual transformations are not described as runtime-certified unless they have actually been executed against a compatible Mule/DataWeave runtime.

## Public distribution

### Primary project

- GitHub repository: source, documentation, issues, pull requests, releases, and contributor collaboration.
- Vercel: primary interactive website deployment.
- GitHub Pages: secondary static deployment.
- GitHub Releases: versioned source/package distribution.

### Community channels

Recommended channels for discovery and discussion:

- LinkedIn: publish useful DataWeave problems, release announcements, and contributor requests.
- Dev.to: publish technical tutorials and link back to the project.
- Hashnode: publish long-form DataWeave guides and production scenarios.
- Medium: publish a structured DataWeave learning series.
- Relevant Reddit communities: share technically useful examples and invite review rather than posting repetitive promotion.
- Awesome lists and open-source directories: submit after the project has a clear release, documentation, and contribution path, following each list's rules.

## Contributor message

Invite contributors to:

1. Propose genuinely new DataWeave questions.
2. Find and report incorrect or ambiguous transformations.
3. Runtime-test curated examples against a stated Mule/DataWeave version.
4. Add difficult XML, CSV, JSON, YAML, NDJSON, streaming, Java-interoperability, and production-style scenarios when they are conceptually distinct.
5. Improve explanations, edge cases, and interview guidance.
6. Improve accessibility, search, performance, and the learning experience.

A renamed or lightly reworded copy of an existing question should not be accepted as a new conceptual question.

## Vercel deployment

Import the GitHub repository into Vercel and deploy the repository root as a static site. No backend service is required for the browser-only learning experience.

The repository includes `vercel.json` with security headers and a cache policy for the generated dataset.

After deployment, configure the Vercel production domain and use that URL in the README, social posts, and project profile.

## Release discipline

Before a public release:

- run the repository quality audit;
- run the curated duplicate checker;
- verify the website entry points and dataset loading;
- review the curated questions for conceptual duplicates;
- runtime-test important curated transformations against the target DataWeave version;
- update `VERSION` and `CHANGELOG.md`;
- create the version tag so the release workflow can package the project.

Do not claim that every generated transformation has been runtime-tested unless that has actually been completed.

## Suggested launch sequence

1. Deploy the current `main` branch to Vercel.
2. Verify login, Explorer, Practice Bank, search, filters, challenge mode, shareable question routing, and dataset loading.
3. Keep GitHub Pages as a second public deployment.
4. Create the first public GitHub Release from the existing release workflow.
5. Enable GitHub Discussions in repository settings and create categories for questions, challenges, bugs, feature requests, and contributors.
6. Publish one detailed launch article and one technical DataWeave article.
7. Share the project on LinkedIn and relevant developer communities.
8. Add contributor-friendly issue templates and encourage runtime verification and new scenario proposals.
