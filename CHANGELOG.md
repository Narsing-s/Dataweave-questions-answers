# Changelog

All notable changes to this project are documented here.

## [Unreleased] - 2026-09-16

### Added

- Working local Practice Assistant at `assistant.html`.
- Practice Assistant navigation from the authenticated Explorer.
- Feature guide, visual DataWeave diagrams, and practice-mode documentation.
- Comprehensive structural repository quality audit.
- Automated GitHub Actions quality-audit workflow for structural checks and curated Q&A duplicate checks.
- README documentation for the complete learning and practice surface.

### Verification

- Static audit checks the 10,000-record count, sequential IDs, required fields, difficulty/topic/question values, DataWeave headers, and required UI entry pages.
- Curated question duplicate review remains handled by `scripts/check-real-qa-duplicates.py`.
- Runtime execution of every DataWeave transformation is still not claimed by static validation.

## [1.0.0] - 2026-09-16

### Added

- 10,000-record DataWeave practice bank.
- Easy, Medium, and Advanced learning paths.
- Interactive Explorer/Lab experience.
- Search, topic filtering, pagination, random practice, copy, solution reveal, challenge mode, and shareable question routing.
- Static dataset validation and generation workflows.
- GitHub Pages deployment workflow.
- Release/package workflow with ZIP and SHA-256 checksum generation.
- Release readiness and package documentation.
- Project version metadata.

### Verification

- Static dataset/schema checks are automated.
- Full runtime execution of every DataWeave transformation is intentionally not claimed by the static validator.
- Release packaging is reproducible through GitHub Actions.

Future changes should be added to `Unreleased` before the next version is tagged.
