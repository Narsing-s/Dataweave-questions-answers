# Release Checklist

## Content

- [ ] Question bank contains the expected number of records.
- [ ] IDs are unique and sequential.
- [ ] Required fields are present.
- [ ] Easy/Medium/Advanced banks are generated.
- [ ] Hand-authored examples are reviewed.
- [ ] No secrets or real customer data are included.

## Website

- [ ] Landing page opens.
- [ ] Explorer opens.
- [ ] Level filters work.
- [ ] Topic filters work.
- [ ] Search works.
- [ ] Pagination works.
- [ ] Random question works.
- [ ] Copy action works.
- [ ] Solution show/hide works.
- [ ] Practice/challenge mode works.
- [ ] Shareable question links work.
- [ ] Mobile layout is usable.
- [ ] Dataset loading/error states are visible.

## Automation

- [ ] Dataset validation passes.
- [ ] GitHub Pages workflow is present.
- [ ] Release/package workflow is present.
- [ ] Package contains the website, docs, dataset, and scripts.
- [ ] SHA-256 checksum is generated.

## Runtime verification

Static validation is not runtime execution. Before a production-facing release, execute representative DataWeave examples with the target Mule/DataWeave runtime and record any version-specific differences.

## Versioning

Update `VERSION` and `CHANGELOG.md`, then create the release tag using the format `vMAJOR.MINOR.PATCH`. The release workflow packages the repository and publishes the package for the tag.
