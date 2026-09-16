# Final Gaps A452-A456 — DataWeave Maven Testing and Library Delivery

These questions cover Maven lifecycle capabilities of the DataWeave library toolchain that were not represented as dedicated scenarios in the curated bank. They are intentionally different from A450-A451, which focus on component descriptor generation and production/test component ownership.

## A452 — Enabling DataWeave test coverage reports

**Question:** A DataWeave library already has unit tests, and the CI pipeline must publish coverage information. Which Maven test configuration enables coverage, and which output formats are supported?

**Difficulty:** Advanced  
**Topic:** DataWeave Testing Framework / Maven / coverage

**Expected behavior:** Configure the DataWeave Maven plugin's `tests` section with `coverageEnabled=true`. The supported `coverageFormat` values are `sonar` and `html`; the default is `sonar` when coverage is enabled.

**Explanation:** Coverage generation is part of the Maven `test` goal configuration. It is separate from the normal HTML execution report controlled by `htmlReport`.

**Common mistake:** Assuming `htmlReport=true` automatically enables code coverage, or inventing a third coverage format.

**Interview tip:** Distinguish test execution reporting from coverage reporting: `htmlReport` controls the test report, while `coverageEnabled` and `coverageFormat` control coverage output.

## A453 — Separating execution reports from coverage reports

**Question:** A CI job wants coverage enabled but does not want the normal HTML test execution report. Which two Maven test settings should be configured, and what do they control?

**Difficulty:** Advanced  
**Topic:** DataWeave Testing Framework / Maven test configuration

**Expected behavior:** Set `coverageEnabled=true` to generate coverage information and `htmlReport=false` to disable the auto-generated HTML execution report. The report output directory can independently be controlled with the `output` setting.

**Explanation:** These settings control different artifacts. Turning off the HTML execution report does not disable the test suite or coverage generation.

**Common mistake:** Treating `htmlReport` as a master switch for all test reporting.

**Interview tip:** Explain that Maven test reporting has independent controls for execution reports, coverage, and the output directory.

## A454 — Choosing the generated DataWeave library documentation template

**Question:** A DataWeave library build must generate documentation for different consumers. Which Maven `docs.template` values are supported, and what is the default?

**Difficulty:** Advanced  
**Topic:** DataWeave Maven plugin / library documentation

**Expected behavior:** The supported values are `exchange_markdown`, `markdown`, and `asciidoc`. The default is `exchange_markdown`.

**Explanation:** The DataWeave Maven plugin's `generate-docs` goal can generate documentation in one of these formats. The Exchange Markdown template is intended for documentation compatible with Anypoint Exchange.

**Common mistake:** Assuming the plugin only generates Markdown, or confusing the template name with the output directory.

**Interview tip:** Mention that `template` controls the documentation representation, while `output` controls where generated documentation files are written.

## A455 — Skipping Exchange documentation during Maven deployment

**Question:** A DataWeave library must be deployed with Maven, but the build should not upload its generated documentation to Exchange. How can the documentation upload be skipped without disabling the library deployment itself?

**Difficulty:** Advanced  
**Topic:** DataWeave Maven plugin / deployment / Exchange

**Expected behavior:** Run the Maven deployment with the `skipDeployDocs` system property set to `true`, for example `mvn deploy -DskipDeployDocs=true`. This skips the Exchange documentation upload while the library deployment remains part of the Maven lifecycle.

**Explanation:** The Maven plugin's `deploy` goal normally deploys the library and uploads the generated documentation. `skipDeployDocs` separates those concerns.

**Common mistake:** Removing the `deploy` goal or disabling documentation generation when the requirement is only to skip the Exchange upload.

**Interview tip:** Distinguish generating documentation locally, uploading documentation to Exchange, and deploying the library artifact.

## A456 — Passing environment variables and system properties to DataWeave test runners

**Question:** A DataWeave Maven test suite runs in a forked test process and needs CI-specific environment variables and JVM/DataWeave system properties. Which test-runner configuration areas provide these values?

**Difficulty:** Advanced  
**Topic:** DataWeave Maven testing / forked runner configuration

**Expected behavior:** Use `runnerEnvironmentVariables` to pass additional environment variables and `runnerSystemProperties` to pass additional system properties to the test runner process. The plugin also provides `runnerLogForkedProcessCommand`, `runnerArgLine`, and `runnerJvmDebug` for other forked-runner concerns.

**Explanation:** These settings configure the process that executes the DataWeave tests. They are distinct from the DataWeave script's own input/output data and from ordinary Maven project properties.

**Common mistake:** Assuming a CI environment variable automatically becomes a DataWeave system property, or using `runnerArgLine` as a replacement for the dedicated environment-variable map.

**Interview tip:** Separate environment variables, system properties, JVM options, and runner diagnostics when explaining Maven-based DataWeave test execution.
