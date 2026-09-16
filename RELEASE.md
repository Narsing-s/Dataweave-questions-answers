# DataWeave Lab Release Guide

## Release readiness

The repository is release-ready when all of these are true:

- [x] 10,000 structured examples exist.
- [x] IDs are sequential from `DW-00001` to `DW-10000`.
- [x] Easy, Medium and Advanced banks are published.
- [x] Interactive Explorer/Lab is included.
- [x] Search, filters, topic navigation and pagination are wired.
- [x] Copy, hide/show, practice, challenge and share operations are wired.
- [x] GitHub Pages deployment workflow exists.
- [x] Dataset generation workflow exists.
- [x] A repeatable package/release workflow is included.
- [ ] DataWeave transformations have been exhaustively runtime-executed against every target Mule/DataWeave runtime. This remains a release-quality limitation; static validation alone cannot prove runtime correctness for every transformation.

## Recommended release

Version: `v1.0.0`

Suggested title:

`DataWeave Lab v1.0.0 — 10,000 Practice Examples`

## Package contents

The release package should contain:

- `index.html`
- `explorer.html`
- `examples.html`
- `lab.html`
- `lab-v2.html`
- `dataset/`
- `EASY/`
- `MEDIUM/`
- `ADVANCED/`
- `MASTERING-DATAWEAVE/`
- `docs/`
- `scripts/`
- `.github/`
- `README.md`
- `RELEASE.md`
- `PACKAGE.md`

## Release process

1. Run the dataset validator.
2. Run the package workflow or local package script.
3. Open the Pages site and test all navigation/actions.
4. Create tag `v1.0.0` on `main`.
5. The release workflow creates the GitHub Release and attaches the generated ZIP.

Do not describe the project as runtime-certified unless the DataWeave code has been executed against the target runtime.
