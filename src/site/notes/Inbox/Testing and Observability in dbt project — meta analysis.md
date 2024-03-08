---
{"dg-publish":true,"dg-permalink":"data-observability-dbt-testing/en","permalink":"/data-observability-dbt-testing/en/","created":"2024-03-09T00:46:31.642+07:00","updated":"2024-03-09T00:57:52.722+07:00"}
---

[[Inbox/Тестирование и наблюдаемость данных в Dbt и не только\|Читать на русском]]
# Premise
Suppose we are a company that has just passed the first level of organizing our data:
- learned that it's actually not done by duct-taping things together and randomly creating tables in databases, spreadsheets, and other sources
- discovered dbt and wrote our first warehouse, sized in dozens to a few hundred models
- realized that since such a wonder has appeared, it should be used to its full extent
- know about the benefits of automatic software testing, but now you're thinking about testing the data too
- learned about dbt test, wrote simple tests for many models, saw how cool it is
- started looking at your data and searching for flaws, incompleteness, violations
- and now you want to understand — how to manage these data, test them, monitor the infrastructure of your pipeline
- in short, you want to move from the first level to the second

# Plan for the second level of working with dbt
- [ ] Connect [slidoapp/dbt-coverage: One-stop-shop for docs and test coverage of dbt projects.](https://github.com/slidoapp/dbt-coverage)
- [ ] Connect [dbt-labs/dbt-project-evaluator](https://github.com/dbt-labs/dbt-project-evaluator)
- [ ] Use the [Meta Testing](https://hub.getdbt.com/tnightengale/dbt_meta_testing/latest/) package to set test requirements
- [ ] Implement basic generic tests for dbt models
- [ ] Implement singular tests for dbt models
- [ ] Consider the feasibility of migrating from dbt core to dbt cloud for PR-based testing, CI, alerts, Performance reports, etc.
- [ ] Describe external consumers in the form of [exposures](https://docs.getdbt.com/docs/build/exposures), integrate dbt and metabase
- [ ] Integrate re_data
- [ ] Implement hosting for the data platform documentation (primarily dbt docs), possibly with re_cloud 
- [ ] Implement uploading test results to the warehouse
	- [ ] Add a dashboard about [test success rate over time](https://www.getdbt.com/blog/dbt-live-apac-tracking-dbt-test-success)

# Data Observability Services
- [Elementary Data](https://www.elementary-data.com/) — dbt native data observability
	- from $600 per month 
	- quite a simple overview of dbt test run results
	- column level lineage
	- BI integration for lineage
	- dashboard about the time spent on collecting models
	- **there is a free CLI version** for generating reports and sending alerts
	- [GitHub - elementary-data/elementary: The dbt-native data observability solution for data & analytics engineers. Monitor your data pipelines in minutes. Available as self-hosted or cloud service with premium features.](https://github.com/elementary-data/elementary)
	- [GitHub - elementary-data/dbt-data-reliability: Data anomalies monitoring as dbt tests and dbt artifacts uploader.](https://github.com/elementary-data/dbt-data-reliability)
- [Synq](https://www.synq.io/) — Reliability Platform for business-critical data
	- in private beta
	- quite simple, mainly - tracking incidents
	- column-level lineage 
	- impact analysis on consumers 
	- alert system with determination of owners of broken objects
- [Sifflet](https://www.siffletdata.com/) — Full Data Stack Observability for Data Engineers and Data Consumers
	- No information on price and free registration 
	- All usual integrations 
	- Search across all your data assets
	- Metadata collection and analysis from all systems 
	- Monitoring with ML capabilities
	- Ready-made catalog of monitoring strategies 
- [Bigeye](https://www.bigeye.com/) — Find and fix data issues before they break your business
	- No free registration (demo only)
	- Automatic data quality monitoring 
	- Column-level lineage
	- Automatic anomaly detection 
	- Error cause analysis and incident management
	- Row-level analysis — queries for debugging problems, information about data affected by the issue
- [Metaplane](https://metaplane.dev) — Trust the data that powers your business
	- integrates with dbt and <mark style="background: #ADCCFFA6;">metabase</mark>
	- dbt integration cannot be set up with macos (only linux)
	- auto-detect anomalies
	- good at showing column-level lineage and overall lineage (including based on query history)
	- free plan (10 tables, 3 custom monitors, one user)
	- paid $1500 per month (100 tables, 5 users, column lineage)
	- has an alert system
	- monitors for failing connectors
	- informs which consumers were affected by an incident (exposures)
- [Datafold](https://www.datafold.com/) — Automated testing for data engineers
	- main feature: direct data comparison 
	- shows how each code change directly affects the data at the column and row level 
	- shows changes at the value level ("increased by 33%")
	- runs in CI and makes reports in PR 
	- compliance analysis between storages (compare two storages - that they are synchronized correctly) 
	- has an OS package that can be used independently [GitHub - datafold/data-diff: Compare tables within or across databases](https://github.com/datafold/data-diff)
- [Soda](https://www.soda.io/) — Data Quality Platform, Test and deliver data that everyone can trust
	- 45-day trial
	- Its own testing system on a powerful human-readable language
	- Simple but nice dashboard about all checks
	- Integrations with dbt, airflow, and all the usual suspects
	- Alert system (slack, email, pagerduty)
- [dbt Cloud](https://www.getdbt.com/product/dbt-cloud) — integrated cloud solution for dbt
	- most importantly: allows PR-based dbt development (each branch separately)
	- can schedule model build runs and tests
	- has logging and alerts, integrations
	- can do metrics, can combine dbt projects into mesh
	- $100 per month (there's also a free plan)

# Important dbt packages 
- [dbt-labs/dbt-utils](https://github.com/dbt-labs/dbt-utils) — a standard set of additional functions from dbt-labs 
- [calogica/dbt-expectations](https://github.com/calogica/dbt-expectations) — a large set of test macros for all cases of data quality checks
- [mjirv/dbt-datamocktool](https://github.com/mjirv/dbt-datamocktool) — unit tests for dbt
- [EqualExperts/dbt-unit-testing](https://github.com/EqualExperts/dbt-unit-testing) — macros for dbt unit tests based on SQL
- [dbt-labs/dbt-project-evaluator](https://github.com/dbt-labs/dbt-project-evaluator) — quality control of the dbt project as a whole, in terms of compliance with dbt-labs practices
- [dbt_artifacts](https://github.com/brooklyn-data/dbt_artifacts) — a package that exports information about the dbt project itself (models, their runs, tests, etc.) into your warehouse and generates marts for their analysis. This allows, for example, to have metrics on resources spent or model freshness.
- [dbt profiler](https://hub.getdbt.com/data-mie/dbt_profiler/latest/) — a set of macros generating a _profile_ of the table: statistical indicators, relationships (relations), types. This package can be used for generating documentation.
- [dbt_meta_testing](https://hub.getdbt.com/tnightengale/dbt_meta_testing/latest/) — a dbt package that allows setting requirements for tests: that they exist, that they are documented
- [gouline/dbt-metabase](https://github.com/gouline/dbt-metabase) — integration of dbt and Metabase 

# Reading List
- [State of Data Quality Monitoring in 2024](https://www.metaplane.dev/state-of-data-quality-monitoring-2024)
	- a good overview article
- [Building a Data Platform in 2024. How to build a modern, scalable data…](https://towardsdatascience.com/building-a-data-platform-in-2024-d63c736cccef)
	- [Fivetran | Automated data movement platform](https://fivetran.com/) and [Airbyte | Open-Source Data Integration Platform | ELT tool](https://airbyte.com/) — leading solutions for batch data upload/download 
	- [Confluent | Apache Kafka Reinvented for the Cloud](https://www.confluent.io/) — leading solution for data streaming
	- [Debezium](https://debezium.io/) — CDC solution
		- Change Data Capture is when the database's own CRUD commands are used as a source of events for synchronization
	- [About dbt Core and installation | dbt Developer Hub](https://docs.getdbt.com/docs/core/installation-overview) — an indispensable and key element of the data platform, in the context of the transformation layer.
	- [dbt mesh](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-1-intro) — a way to combine several dbt projects and scale the transformation system
	- [Apache Airflow](https://airflow.apache.org/) remains the main solution for orchestration, along with its managed versions:
		- [What Is Amazon Managed Workflows for Apache Airflow? - Amazon Managed Workflows for Apache Airflow](https://docs.aws.amazon.com/mwaa/latest/userguide/what-is-mwaa.html)
		- [Deliver Your Data On Time with Astronomer: The Best Place to Run Apache Airflow™](https://astronomer.io/)
		- [Prefect | Modern Workflow Orchestration](https://www.prefect.io/) and [Dagster | Cloud-native orchestration of data pipelines](https://dagster.io/) — inspiring alternatives
	- In visualization, traditional solutions continue to dominate: [Tableau](https://www.tableau.com/), [PowerBI](https://www.microsoft.com/en-us/power-platform/products/power-bi/), [Looker](https://lookerstudio.google.com/u/0/navigation/reporting), and [Qlik](https://www.qlik.com/us)
	- New platforms [Sigma Computing. Business Intelligence and Analytics Solution](https://www.sigmacomputing.com/) and [Welcome | Superset](https://superset.apache.org/) are interesting
	- The package [Streamlit • A faster way to build and share data apps](https://streamlit.io/), allowing quick building of interfaces for working with data in Python, is interesting
	- Reverse ETL — uploading data from analytics back to end applications, where [Hightouch | Composable CDP & Reverse ETL | Activate data | Hightouch](https://hightouch.com/) undoubtedly leads
	- The open-source project [DataHub](https://datahubproject.io/) and its [Managed variant](https://www.acryldata.io/observe) — a solution for combining metadata from different storages and systems and ensuring observability 
	- [Monte Carlo | Data Reliability Delivered](https://www.montecarlodata.com/) — a system for monitoring data and managing incidents (closed)
	- [GX: a proactive, collaborative data quality platform • Great Expectations](https://greatexpectations.io/)
- [The Four Pillars of Data Observability | Metaplane](https://www.metaplane.dev/blog/the-four-pillars-of-data-observability)
	- There are 4 pillars of data observability 
	- [Metrics](https://www.metaplane.dev/blog/data-quality-metrics-for-data-warehouses) — internal characteristics of data. Statistics, uniqueness, accuracy, etc.
	- Metadata — external characteristics. Volume, schema, freshness, owner.
	- Lineage — relationships within data. What depends on what, what came from what
	- Logs — interactions between machines and between machine and human. Queries to the warehouse, dbt transformations, upload and download.
- [7 dbt Testing Best Practices  | Datafold](https://www.datafold.com/blog/7-dbt-testing-best-practices)
	- There are singular tests, simple .sql files with select statements that return erroneous rows (or nothing if the test passes)
	- There are generic tests, which can be applied to different tables (like not null for a column)
	- Start with generic tests, checking for not_null, unique, accepted_values, [relationships](https://docs.getdbt.com/reference/resource-properties/tests#relationships)
	- Then write specific singular tests 
	- You can use [dbt-expectations](https://github.com/calogica/dbt-expectations) - a library of generic tests for different life situations
		- [GX: a proactive, collaborative data quality platform • Great Expectations](https://greatexpectations.io/) —  a special separate service for working with data quality
		- Useful tests `expect_row_values_to_have_recent_data`, `expect_column_to_exist`
	- You should test not only downstream models but also sources, including CSV
	- For alerts, you can use [dbt cloud](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-notifications), or analyze logs ([enable json-structured logs](https://docs.getdbt.com/reference/events-logging))
	- Tests must be [Accelerating dbt core CI/CD with GitHub actions: A step-by-step guide | Datafold](https://www.datafold.com/blog/accelerating-dbt-core-ci-cd-with-github-actions-a-step-by-step-guide)
- [What the heck is data diffing?! | Datafold](https://www.datafold.com/blog/what-the-heck-is-data-diffing)
	- [Datafold - Automated testing for data engineers](https://www.datafold.com/) — automated tests for data, checking data changes within CI, providing access to column-level lineage
	- (price model not disclosed, exclusively through a call with their engineer, so presumably expensive)
	- there is a [free CLI tool](https://github.com/datafold/data-diff) for data diff
	- Data Diff — testing by directly comparing data in different storages (e.g., new version vs current production)
	- dbt tests don't allow seeing "unexpected data changes" — they inherently only monitor for "expected" changes
	- diffs should be checked during development to see exactly how your code changes data
	- during deployment: as a check within CI to not release something broken
	- **during data migrations** — for direct quality check of the migration
	- during replications — for quality control of replication
- [A Simple (Yet Effective) Approach to Implementing Unit Tests for dbt Models | by Mahdi Karabiben | Towards Data Science](https://towardsdatascience.com/a-simple-yet-effective-approach-to-implementing-unit-tests-for-dbt-models-da2583ea8e79)
	- Besides dbt tests, one can also talk about dbt unit tests 
	- The tested unit is both the models themselves and the CTEs from which they are composed
	- The model structure should be standardized: import CTEs, Intermediate CTEs, Final CTE
	- Intermediate CTEs and final CTE should be tested
	- The first component of the testing system: mock inputs in the form of [dbt seeds](https://docs.getdbt.com/docs/build/seeds)
	- The second component: expected outputs, in the form of the same CSVs.
	- The testing process is simply comparing the table created from seed.input through dbt transformations and the table of expected outputs
	- For direct comparison, you can use the package [dbt_audit_helper](https://github.com/dbt-labs/dbt-audit-helper) or a system like [Soda Core](https://github.com/sodadata/soda-core)
	- The general process of the unit testing system is described, but implementing it (substituting references to tables with mocks and comparing with expectation) will need to be implemented by yourself
- [Unit Testing · dbt-labs/dbt-core · Discussion #8275 · GitHub](https://github.com/dbt-labs/dbt-core/discussions/8275)
	- Detailed discussion of the proposed Unit-testing process in dbt core, which is planned to be released in version 1.8
- [Audit_helper in dbt: Bringing data auditing to a higher level | dbt Developer Blog](https://docs.getdbt.com/blog/audit-helper-for-migration)
	- a package that helps conduct an audit of tables through data comparison (usually for migrations or refactoring)
	- provides two main macros: `compare_queries` and `compare_column_values`
	- `compare_queries` allows comparing rows, excluding some columns if necessary, and getting a report on data match 
	- `compare_column_values` compares values in a specific column to check its compatibility between storages
- [Data Observability dbt Packages | The Infinite Lambda Blog](https://infinitelambda.com/data-observability-dbt-packages/)
	- Describes standard packages codegen, utils, expectations
	- Describes packages [dbt-labs/dbt-project-evaluator](https://github.com/dbt-labs/dbt-project-evaluator), [dbt profiler](https://hub.getdbt.com/data-mie/dbt_profiler/latest/), [dbt_artifacts](https://github.com/brooklyn-data/dbt_artifacts) — see above
- [Data Observability on Steroids](https://hiflylabs.com/blog/2022/07/08/data-observability-on-steroids)
	- [What is re_data?](https://docs.getre.io/master/docs/re_data/introduction/whatis_data) — a report generator about the dbt project, includes data lineage, their statistical characteristics, and test results
	- [What is re_cloud?](https://docs.getre.io/master/docs/re_cloud/whatis_cloud) — hosting for dbt reports, including redata, dbt docs, elementary reports
	- [Data Observability Features Built for Today's Data Teams | Metaplane](https://www.metaplane.dev/platform-overview) — a platform for data monitoring, incident management, and alerting. Allegedly capable of automated anomaly detection.
- [Data quality dimensions for better decision-making | Datafold](https://www.datafold.com/blog/data-quality-dimensions)
	- There are seven dimensions of "data quality"
	- Accuracy. Usually measured in percentages. Can drop due to delays, input errors, processing errors.
	- Completeness. For example, "we have the address of 95% of clients."
	- Consistency. Uniformity in formats (24.99USD vs. $24.99), time zones. Easiest to measure by comparing the same data in different reports.
	- Reliability. The constancy of data, absence of "flickering," regularity. How much one can trust a particular measurement. For verification, one can compare with an independent source or conduct repeated measurements.
	- Timeliness. Tomorrow's weather forecast will not be needed in a week. If data arrives slowly, it's impossible to make quality forecasts. Metric: the delay between data collection and when they are ready for use. Can have alerts for staleness.
	- Uniqueness. Absence of (erroneously) duplicated data. Another example: poorly organized versioning — two tables like `customers` and `customers_v1`.
	- Usefulness. A subjective characteristic of how useful your models are to someone. Reminds that it's not always necessary to build complex ML models where pivot tables could suffice.
- [dbt at Super Part 3: Observability | by Jonathan Talmi | Super.com | Medium](https://medium.com/super/dbt-at-super-part-3-observability-c8755109901f)
	- Store run results and other artifacts in the warehouse and use BI (metabase) for analysis and alerts.
	- [elementary-data/dbt-data-reliability](https://github.com/elementary-data/dbt-data-reliability)
	- Add the data owner's name to the model manifest (dbt meta) so that alerts can directly tag the person responsible, for example, for freshness.
	- OS Python Package by Elementary, capable of sending notifications to Slack / MS Teams (note: is there a way to use the slack API to receive messages in Discord?)
	- Elementary allows exploring the run time of models and their cost.
- [dbt: How We Improved Our Data Quality by Cutting 80% of Our Tests | by Noah Kennedy | Better Programming](https://betterprogramming.pub/dbt-how-we-improved-our-data-quality-by-cutting-80-of-our-tests-78fc35621e4e)
	- The main blocker to a good testing system: observability and actionability of tests (when they fail). We improved everything, meanwhile removing 80% of tests.
	- Three-step process: detailed high-quality tests, aggregation of testing results, building views for test results separated by owners and/or importance.
	- Tests should explicitly indicate their severity.
	- Each test should adhere to established norms [[RACI matrix\|RACI]] (who will fix it, who needs to be informed).
	- Two classes of tests: data integrity and context-driven.
	- Data integrity tests are fixed by programmers; context-driven involve people from the subject area.
	- Strict naming of tests (table_name__column_name__test_name) and [test aliasing](https://docs.getdbt.com/reference/resource-configs/alias).
	- Definitely set [store_failures](https://docs.getdbt.com/reference/resource-configs/store_failures) to true.
	- Use a metadata file for tests, which is a [seed](https://docs.getdbt.com/docs/build/seeds). It stores the test name, owner, test importance, and other additional fields.
	- Next, data are aggregated using dbt, combining test run results with metadata. From this base table, various views are built, providing dashboards for owners, by severity, and other dimensions.
- [dbt Tests. A necessary assertion to ensure the... | by Jimmy Pang | Data Panda | Medium](https://medium.com/data-panda/dbt-tests-813f0aeacac8)
	- In Elementary, [there are additional tests](https://docs.elementary-data.com/data-tests/introduction) for models.
	- [Specifying test severity](https://docs.getdbt.com/reference/resource-configs/severity), in the form of threshold values for the number of errors.
	- Ensure all models have primary keys + set a test for not_null & unique.
	- Generate surrogate keys using [macro from dbt-utils](https://github.com/dbt-labs/dbt-utils#generate_surrogate_key-source).
- [So you're using dbt tests—Validio is what's next in data quality validation for scalability and comprehensiveness](https://validio.io/blog/whats-next-in-data-quality)
	- Besides warehouses (tables), there are other data (object stores and streams) that may not reach the warehouse but still need to be tested.

# Findings Along the Way
Here's what doesn't relate to testing, dbt, or maybe even to development at all, but came across along the way.

- [Date dimension: How to Create a Practical and Useful Date Dimension in dbt | by Gabriel Campos | Indicium Engineering | Medium](https://medium.com/indiciumtech/date-dimension-how-to-create-a-practical-and-useful-date-dimension-in-dbt-5ee70a18f3bb)
- [GitHub - mckaywrigley/chatbot-ui: AI chat for every model.](https://github.com/mckaywrigley/chatbot-ui)
- [Deepnote: Analytics and data science notebook for teams.](https://deepnote.com/) — AI-supported notebooks for data work.
- [Hightouch | Composable CDP & Reverse ETL | Activate data | Hightouch](https://hightouch.com/)
- [Managing a dynamic dbt project at Whatnot | Whatnot Engineering](https://medium.com/whatnot-engineering/managing-a-dynamic-dbt-project-929db0a134fb)
- [dbt action · Actions · GitHub Marketplace · GitHub](https://github.com/marketplace/actions/dbt-action)

# Discussion on Twitter
<blockquote class="twitter-tweet"><a href="https://twitter.com/user/status/1765736017615863884?ref_src=twsrc%5Etfw"></a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><a href="https://twitter.com/user/status/1765258852306673714?ref_src=twsrc%5Etfw"></a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>