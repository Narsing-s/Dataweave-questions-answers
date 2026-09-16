# DataWeave Q&A — Current Tooling and Maven Delivery Gaps 457–461

These questions were selected after checking the current MuleSoft DataWeave Maven and VS Code extension documentation and searching the curated repository for the specific concepts. They target distinct project/tooling workflows rather than rewording existing transformation questions.

## A457 — Customize generated DataWeave library documentation for Exchange

**Difficulty:** Advanced

**Question:** A DataWeave library needs generated documentation in Exchange-compatible Markdown, but the project also needs a custom library landing page and a custom image asset. Which Maven documentation settings solve this without changing the DataWeave functions themselves?

**Scenario**

The project already generates documentation with the DataWeave Maven plugin. The team wants `README.md` to provide the generated documentation home page and `src/main/resources/assets/logo.jpg` to be used as the Exchange portal icon.

**Expected configuration**

```xml
<docs>
    <template>exchange_markdown</template>
    <homePage>${project.basedir}/README.md</homePage>
    <favicon>${project.basedir}/src/main/resources/assets/logo.jpg</favicon>
</docs>
```

**Expected result:** The generated documentation uses the Exchange-compatible Markdown template, incorporates the configured Markdown home page, and uses the configured PNG/JPG asset as the Exchange portal icon.

**Explanation:** `homePage` and `favicon` are documentation-generation settings. They customize the generated library documentation/Exchange presentation; they do not alter the mapping logic or function behavior.

**Common mistake:** Treating `homePage` as the path to a DataWeave entry-point mapping or assuming `favicon` changes the generated documentation format.

**Interview tip:** Separate transformation source configuration from documentation-generation configuration in a Maven DataWeave library.

## A458 — Deploy generated DataWeave documentation independently

**Difficulty:** Advanced

**Question:** A DataWeave library has already been packaged, but its generated documentation must be uploaded to Anypoint Exchange without repeating the normal library deployment. Which Maven goal is designed for that workflow?

**Command**

```bash
mvn data-weave:deploy-docs
```

**Expected result:** The auto-generated DataWeave library documentation is uploaded to Anypoint Exchange without using the full `deploy` goal for the library artifact.

**Explanation:** The DataWeave Maven plugin exposes `data-weave:deploy-docs` as a dedicated documentation-upload goal. This is different from `deploy`, which uploads the DataWeave library and its generated documentation to the deployment target/Exchange as part of the broader deployment workflow.

**Common mistake:** Running `package` and assuming that packaging automatically publishes the generated documentation to Exchange.

**Interview tip:** Know the distinction between generating documentation, packaging the library, uploading documentation, and performing the complete deployment lifecycle.

## A459 — Debug a forked DataWeave Maven test runner

**Difficulty:** Advanced

**Question:** A DataWeave Maven test fails only inside the forked test-runner process. The build needs diagnostic visibility into the launched command and JVM debugging configuration. Which test-runner settings should be considered?

**Scenario**

A Maven DataWeave test configuration needs to expose the forked-process launch command and allow a developer to attach a debugger to the test runner.

**Example configuration**

```xml
<tests>
    <runnerLogForkedProcessCommand>true</runnerLogForkedProcessCommand>
    <runnerJvmDebug>true</runnerJvmDebug>
    <runnerArgLine>-Dexample.diagnostic=true</runnerArgLine>
</tests>
```

**Expected result:** The test execution logs the command used to launch the forked process, enables the runner's JVM-debug configuration, and passes the supplied JVM argument line to the runner.

**Explanation:** These settings diagnose the test-runner process itself. They are different from `runnerEnvironmentVariables` and `runnerSystemProperties`, which pass environment variables and system properties respectively.

**Common mistake:** Trying to diagnose a forked JVM using only DataWeave source-level logging, or confusing JVM arguments with environment variables.

**Interview tip:** When Maven launches a separate test process, distinguish application data, environment variables, Java system properties, and JVM launch arguments.

## A460 — Consume a published DataWeave library with Maven coordinates

**Difficulty:** Advanced

**Question:** A team has published a reusable DataWeave library to Anypoint Exchange. What information must a consuming DataWeave project use to declare the dependency, and why can the classifier matter?

**Example dependency shape**

```xml
<dependency>
    <groupId>com.example.integration</groupId>
    <artifactId>customer-dw-library</artifactId>
    <version>1.2.0</version>
    <classifier>dw</classifier>
</dependency>
```

**Expected result:** Maven resolves the intended published DataWeave library artifact when the coordinates, repository configuration, and classifier match the asset that was published.

**Explanation:** A reusable DataWeave library is consumed through Maven dependency coordinates. The current DataWeave extension documentation identifies group ID, artifact ID, version, and classifier as the dependency information to add to the consuming project's `pom.xml`. The classifier can distinguish the intended published artifact variant.

**Common mistake:** Copying only the artifact ID and version while omitting the group ID or required classifier.

**Interview tip:** Treat Exchange consumption as dependency resolution: coordinates identify the artifact; repository configuration determines where Maven resolves it from.

## A461 — Configure DataWeave scenario-specific reader properties

**Difficulty:** Advanced

**Question:** A DataWeave mapping test uses a CSV input whose reader settings differ from the defaults. How can the test scenario provide reader properties without hard-coding those settings into the transformation expression?

**Scenario structure**

```text
src/test/resources/
└── OrdersMapping/
    └── default/
        └── inputs/
            ├── payload.csv
            └── payload-config.properties
```

**Example `payload-config.properties`**

```properties
separator=;
header=true
```

**Expected result:** When the scenario reads `payload.csv`, the adjacent `payload-config.properties` file supplies the reader properties for that input, and the same scenario-specific configuration can be used while testing the mapping.

**Explanation:** The DataWeave extension documentation supports a properties file using the `{fileName}-config.properties` naming convention in the same directory as the input. This keeps reader configuration associated with the test input rather than embedding format-specific settings in the transformation logic.

**Common mistake:** Naming the file generically, placing it outside the input directory, or assuming that the properties file changes the mapping's output logic directly.

**Interview tip:** Keep test data, expected output, and input-reader configuration close to the scenario so a test can reproduce the exact input conditions.
