---
{"dg-publish":true,"dg-permalink":"data-observability-dbt-testing","permalink":"/data-observability-dbt-testing/","created":"2024-03-06T13:14:00.187+07:00","updated":"2024-03-11T19:14:43.152+07:00"}
---

[[Inbox/Testing and Observability in dbt project — meta analysis\|Read in English]]
# Premise
Допустим, мы — компания, только что прошедшая первый уровень организации своих данных:
- узнали что вообще-то это делают не склеивая изолентой и рандомно создавая таблицы в базах, спредшитах, и других источниках
- узнали, что существует dbt и написали свой первый warehouse, размером в десятки-малые сотни моделей 
- поняли, что раз такое чудо появилось, то надо его использовать в полный рост
- знаете про пользу автоматического тестирования софта, но вот сейчас задумались про то что данные тоже полезно тестировать
- узнали про dbt test, написали простые тесты на многие модели, увидели как это круто
- начали смотреть на свои данные и искать в них недостатки, неполноту, нарушения
- и хотите теперь понять — как этими данными управлять, тестировать их, отслеживать инфраструктуру вашего пайплайна
- коротко говоря, хотите с первого уровня перейти на второй
- деньги имеют значение. Тратить $1000+ в месяц вы не хотите

# Road to Level 2
## Короткий путь
- [ ] Подготовить набор тестов в dbt
	- [ ] Использовать пакет [Meta Testing](https://hub.getdbt.com/tnightengale/dbt_meta_testing/latest/) для установки требований к тестам
	- [ ] Подключить [slidoapp/dbt-coverage: One-stop-shop for docs and test coverage of dbt projects.](https://github.com/slidoapp/dbt-coverage)
	- [ ] Имплементировать базовые generic тесты dbt-моделей
	- [ ] Имплементировать singular тесты dbt-моделей
- [ ] Добавить запуск dbt build в CI
- [ ] Подключить сборку dbt docs в CI
- [ ] Подключить генерацию отчетов Elementary
	- [ ] Сначала настроить триал платного варианта (месяц бесплатно, потом $600 в месяц)
	- [GitHub - elementary-data/dbt-data-reliability](https://github.com/elementary-data/dbt-data-reliability)
	- [Install Elementary dbt package - Elementary](https://docs.elementary-data.com/oss/quickstart/quickstart-cli-package)
	- [Elementary OSS - Elementary](https://docs.elementary-data.com/oss/oss-introduction)
- [ ] Подключить генерацию отчетов re_data
- [ ] Реализовать хостинг документации дата-платформы (dbt docs, re_data, elementary) с помощью [re_cloud?](https://docs.getre.io/master/docs/re_cloud/whatis_cloud/)
- [ ] Добавить сообщения о проваленных тестах в discord-канал
- [ ] Добавить сенсор в Dagster с алертами о freshness
	- [Dagster Docs](https://docs.dagster.io/_apidocs/schedules-sensors#dagster.freshness_policy_sensor)
## Дополнительные решения
- [ ] Убедиться что у всех моделей есть primary keys, использовать суррогатные ключи используя [макро из dbt-utils](https://github.com/dbt-labs/dbt-utils#generate_surrogate_key-source), иметь not_null&unique тест на них
- [ ] Подключить [dbt-labs/dbt-project-evaluator](https://github.com/dbt-labs/dbt-project-evaluator)
- [ ] Описать внешних потребителей в виде [exposures](https://docs.getdbt.com/docs/build/exposures), интегрировать dbt и metabase
	- [[GitHub - gouline/dbt-metabase: dbt + Metabase integration](https://github.com/gouline/dbt-metabase)
- [ ] Реализовать загрузку результатов тестов в warehouse
	- [GitHub - brooklyn-data/dbt\_artifacts: A dbt package for modelling dbt metadata](https://github.com/brooklyn-data/dbt_artifacts)
	- [ ] установить [store_failures](https://docs.getdbt.com/reference/resource-configs/store_failures) в true
	- [ ] создать metadata-файл для тестов, который является [seed](https://docs.getdbt.com/docs/build/seeds). Хранить там название теста, владельца, важность теста, и другие дополнительные поля (см. [[Inbox/Тестирование и наблюдаемость данных в Dbt и не только#^dbt-article\|#^dbt-article]] )
	- далее, данные агрегируются средствами dbt, объединяя результаты запуска тестов с  метаданными. Из этой базовой таблицы строятся всевозможные views, которые предоставляют дешборды для owners, по severity и другим срезам
	- [ ] Добавить дешборд про [test success rate over time](https://www.getdbt.com/blog/dbt-live-apac-tracking-dbt-test-success)
	- [ ] Добавить кастомные дешборды в Metabase на основе данных, экспортированных из dbt
- [ ] Попробовать интеграцию с Metaplane в CI (бесплатный тариф)
	- [dbt Core](https://docs.metaplane.dev/docs/dbt-core)
- [ ] Подключить data diff в CI систему
	- [GitHub - datafold/data-diff: Compare tables within or across databases](https://github.com/datafold/data-diff)
- [ ] Развернуть Datahub  и интегрировать его со всеми элементами системы
	- [A Metadata Platform for the Modern Data Stack | DataHub](https://datahubproject.io/)
	- [Интеграция Dagster и Datahub](https://docs.dagster.io/_apidocs/libraries/dagster-datahub)
	- [MariaDB | DataHub](https://datahubproject.io/docs/generated/ingestion/sources/mariadb)
	- [BigQuery | DataHub](https://datahubproject.io/docs/generated/ingestion/sources/bigquery)
	- [dbt | DataHub](https://datahubproject.io/docs/generated/ingestion/sources/dbt)
	- [Google Cloud Storage | DataHub](https://datahubproject.io/docs/generated/ingestion/sources/gcs)
	- [Metabase | DataHub](https://datahubproject.io/docs/generated/ingestion/sources/metabase)

# Сервисы Data Observability
- [DataHub](https://datahubproject.io) — A Metadata Platform for the Modern Data Stack
	- OS-решение с опцией cloud за деньги
	- Каталог ваших ассетов из разных источников с lineage
	- Централизированное место для просмотра метаданных, владельцев, документации, тестов и т.п.
	- Выглядит promising, но молодой (версия 0.13)
	- Множество интеграций, хорошая поддержка
	- Требует поддержки разработчиков для конфигурации и использования (писать yaml конфиги для алертов и т.п.)
- [Elementary Data](https://www.elementary-data.com/) — dbt native data observability
	- от 600 в месяц 
	- довольно простой обзор результатов запуска тестов dbt
	- column level lineage
	- интеграция с BI для lineage
	- дешборд про время затраченное на сбор моделей
	- **есть бесплатная CLI-версия** для генерации отчетов и отправки алертов
	- [GitHub - elementary-data/elementary: The dbt-native data observability solution for data & analytics engineers. Monitor your data pipelines in minutes. Available as self-hosted or cloud service with premium features.](https://github.com/elementary-data/elementary)
	- [GitHub - elementary-data/dbt-data-reliability: Data anomalies monitoring as dbt tests and dbt artifacts uploader.](https://github.com/elementary-data/dbt-data-reliability)
- [Synq](https://www.synq.io/) — Reliability Platform for business-critical data
	- в private beta
	- довольно простая, в основном - трекинг инцидентов
	- column-level lineage 
	- анализ влияния на потребителей 
	- система алертов с определением владельцев сломанных объектов
- [Sifflet](https://www.siffletdata.com/) — Full Data Stack Observability for Data Engineers and Data Consumers
	- Нет информации о цене и свободной регистрации 
	- Все обычные интеграции 
	- Поиск по всем вашим data assets
	- Сбор метаданных и анализов со всех систем 
	- Мониторинг с ML-возможностями
	- Готовый каталог стратегий мониторинга 
- [Bigeye](https://www.bigeye.com/) — Find and fix data issues before they break your business
	- Нет свободной регистрации (только через демо)
	- Автоматический мониторинг data quality 
	- Lineage на уровне колонок
	- Автоматическое определение аномалий 
	- Анализ причины ошибок и управление инцидентами
	- Анализ на уровне строк — запросы для дебага проблем, информация о затронутых проблемой данных
- [Metaplane](https://metaplane.dev) — Trust the data that powers your business
	- интегрируется с dbt и <mark style="background: #ADCCFFA6;">metabase</mark>
	- интеграцию с dbt нельзя наладить с macos (только linux)
	- автодетект аномалий
	- умеет в column-level lineage и в целом хорошо показывает lineage (в том числе на основе истории запросов)
	- бесплатный план (10 таблиц, 3 кастомных монитора, один юзер)
	- платный $1500 в месяц (100 таблиц, 5 юзеров, column lineage)
	- есть система алертов
	- следит за отваливающимися коннекторами
	- сообщает на каких потребителей повлиял инцидент (exposures)
- [Datafold](https://www.datafold.com/) — Automated testing for data engineers
	- главная фишка: сравнение непосредственно данных 
	- показывает как каждое изменение кода влияет непосредственно на данные на уровне столбцов и колонок 
	- показывает изменения на уровне значений ("выросло на 33%")
	- запускается в CI и делает репорты в PR 
	- анализ соответствия между хранилищами (сравнить два хранилища - что они синхронизированы верно) 
	- есть OS-пакет, который можно использовать самостоятельно [GitHub - datafold/data-diff: Compare tables within or across databases](https://github.com/datafold/data-diff)
- [Soda](https://www.soda.io/) — Data Quality Platform, Test and deliver data that everyone can trust
	- Триал на 45 дней
	- Своя система тестов на мощном человекочитаемом языке
	- Простой но симпатичный дешборд по поводу всех чеков
	- Интеграции с dbt, airflow и всеми usual suspects
	- Система алертов (slack, email, pagerduty)
- [dbt Cloud](https://www.getdbt.com/product/dbt-cloud) — интегрированное облачное решение для dbt
	- самое главное: позволяет иметь PR-based разработку dbt (каждая ветка отдельно)
	- может шедулить запуски сборки моделей и запускает тесты
	- есть логирование и алерты, интеграции
	- можно делать метрики, можно объединять dbt проекты в mesh
	- $100 в месяц (есть бесплатный план тоже)

# Важные dbt пакеты 
- [dbt-labs/dbt-utils](https://github.com/dbt-labs/dbt-utils) — стандартный набор дополнительных функций от dbt-labs 
- [calogica/dbt-expectations](https://github.com/calogica/dbt-expectations) — большой набор тестов-макросов на все случаи data quality checks
- [mjirv/dbt-datamocktool](https://github.com/mjirv/dbt-datamocktool) — юнит-тесты для dbt
- [EqualExperts/dbt-unit-testing](https://github.com/EqualExperts/dbt-unit-testing) — макросы для юнит-тестов dbt на основе SQL
- [dbt-labs/dbt-project-evaluator](https://github.com/dbt-labs/dbt-project-evaluator) — контроль качества dbt-проекта в целом, в смысле соответствия практикам dbt-labs 
{ #u2p37h}

- [dbt_artifacts](https://github.com/brooklyn-data/dbt_artifacts) — пакет, который выгружает в ваш warehouse информацию о самом dbt проекте  (модели, их запуски, тесты и т.п.) и генерируют витрины (marts) для их анализа. Это позволяет, например, иметь метрику затраченных ресурсов или свежести моделей.
- [dbt profiler](https://hub.getdbt.com/data-mie/dbt_profiler/latest/) — набор макросов, генерирущих _профиль_ таблицы: статистические показатели, отношения (relations), типы. Этот пакет можно использовать для генерации документации.
- [dbt_meta_testing](https://hub.getdbt.com/tnightengale/dbt_meta_testing/latest/) — пакет dbt, которым можно установить требования к тестам: что они есть, что они документированы
- [gouline/dbt-metabase](https://github.com/gouline/dbt-metabase) — интеграция dbt и Metabase 

# Reading List
- [State of Data Quality Monitoring in 2024](https://www.metaplane.dev/state-of-data-quality-monitoring-2024)
	- хорошая обзорная статья
- [Building a Data Platform in 2024. How to build a modern, scalable data…](https://towardsdatascience.com/building-a-data-platform-in-2024-d63c736cccef)
	- [Fivetran | Automated data movement platform](https://fivetran.com/) и [Airbyte | Open-Source Data Integration Platform | ELT tool](https://airbyte.com/) — ведущие решения для batch выгрузки/загрузки данных 
	- [Confluent | Apache Kafka Reinvented for the Cloud](https://www.confluent.io/) — ведущее решение для стриминга данных
	- [Debezium](https://debezium.io/) — CDC-решение
		- Change Data Capture это когда сами CRUD-команды базы данных используются как источник событий для синхронизации
	- [About dbt Core and installation | dbt Developer Hub](https://docs.getdbt.com/docs/core/installation-overview) — незаменимый и ключевой элемент дата-платформы, в контексте слоя трансформации.
	- [dbt mesh](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-1-intro) — способ объединить несколько dbt-проектов и масштабировать систему трансформации
	- [Apache Airflow](https://airflow.apache.org/) остается основным решением для оркестрации, вместе со своими managed-версиями:
		- [What Is Amazon Managed Workflows for Apache Airflow? - Amazon Managed Workflows for Apache Airflow](https://docs.aws.amazon.com/mwaa/latest/userguide/what-is-mwaa.html)
		- [Deliver Your Data On Time with Astronomer: The Best Place to Run Apache Airflow™](https://astronomer.io/)
		- [Prefect | Modern Workflow Orchestration](https://www.prefect.io/) и [Dagster | Cloud-native orchestration of data pipelines](https://dagster.io/) — вдохновляющие альтернативы
	- В визуализации продолжают доминировать традиционные решения: [Tableau](https://www.tableau.com/), [PowerBI](https://www.microsoft.com/en-us/power-platform/products/power-bi/), [Looker](https://lookerstudio.google.com/u/0/navigation/reporting), and [Qlik](https://www.qlik.com/us)
	- Новые платформы [Sigma Computing. Business Intelligence and Analytics Solution](https://www.sigmacomputing.com/) и [Welcome | Superset](https://superset.apache.org/) интересны
	- Интересен пакет [Streamlit • A faster way to build and share data apps](https://streamlit.io/), позволяющий быстро строить интерфейсы для работы с данными на питоне
	- Reverse ETL — выгрузка данных из аналитики назад в оконечные приложения, и здесь безусловно лидирует [Hightouch | Composable CDP & Reverse ETL | Activate data | Hightouch](https://hightouch.com/)
	- Опенсурс проект [DataHub](https://datahubproject.io/)  и его [Managed-вариант](https://www.acryldata.io/observe) — решение для объединения метаданных разных хранилищ и систем и обеспечения observability 
	- [Monte Carlo | Data Reliability Delivered](https://www.montecarlodata.com/) — система для мониторинга данных и управления инцидентами (закрытая)
	- [GX: a proactive, collaborative data quality platform • Great Expectations](https://greatexpectations.io/)
- [The Four Pillars of Data Observability | Metaplane](https://www.metaplane.dev/blog/the-four-pillars-of-data-observability)
	- Есть 4 столпа data observability 
	- [Метрики](https://www.metaplane.dev/blog/data-quality-metrics-for-data-warehouses) — внутренние характеристики данных. Статистика, уникальность, точность и т.п.
	- Метаданные — внешние характеристики. Объем, схема, свежесть, владелец.
	- Наследственность (Lineage) — связи внутри данных. Что зависит от чего, что получилось из чего
	- Логи — взаимодействия между машинами и между машиной и человеком. Запросы к warehouse, трансформации dbt, загрузка и выгрузка.
- [7 dbt Testing Best Practices  | Datafold](https://www.datafold.com/blog/7-dbt-testing-best-practices)
	- Есть singular тесты, простые .sql файлы с select statement, которые возвращают ошибочные rows (или ничего, если тест проходит)
	- Есть generic тесты, которые можно применять к разным таблицам (типа not null у колонки)
	- Начать стоит с generic тестов, проверяющих на not_null, unique, accepted_values, [relationships](https://docs.getdbt.com/reference/resource-properties/tests#relationships)
	- Потом написать специфические singular тесты 
	- Можно использовать [dbt-expectations](https://github.com/calogica/dbt-expectations) - библиотеку generic тестов на разные случаи жизни
		- [GX: a proactive, collaborative data quality platform • Great Expectations](https://greatexpectations.io/) —  специальный отдельный сервис для работы с качеством данных
		- Полезные тесты `expect_row_values_to_have_recent_data`, `expect_column_to_exist`
	- Следует тестировать не только downstream модели, но и sources, включая CSV
	- Для алертов можно использовать [dbt cloud](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-notifications), или анализировать логи ([включить json-структурированные логи](https://docs.getdbt.com/reference/events-logging))
	- Тесты надо [Accelerating dbt core CI/CD with GitHub actions: A step-by-step guide | Datafold](https://www.datafold.com/blog/accelerating-dbt-core-ci-cd-with-github-actions-a-step-by-step-guide)
- [What the heck is data diffing?! | Datafold](https://www.datafold.com/blog/what-the-heck-is-data-diffing)
	- [Datafold - Automated testing for data engineers](https://www.datafold.com/) — автоматизированные тесты для данных, проверяющие изменения данных в рамках CI, дающие доступ к column-level lineage
	- (price model не открывают, исключительно через звонок с их инженером, то есть видимо дорого)
	- есть [бесплатный CLI-инструмент](https://github.com/datafold/data-diff) для data diff
	- Data Diff — это тестирование с помощью непосредственного сравнения данных в разных хранилищах (например: новая версия vs текущий продакшен)
	- dbt тесты не позволяют увидеть "неожиданные изменения в данных" — они по определению следят только за "ожидаемыми"
	- диффы стоит проверять при разработке, чтобы видеть как именно ваш код меняет данные
	- при деплойменте: в качестве проверки в рамках CI чтобы не зарелизить поломанное
	- **во время миграций данных** — для непосредственной проверки качества миграции
	- при репликациях — для контроля качества репликации
- [A Simple (Yet Effective) Approach to Implementing Unit Tests for dbt Models | by Mahdi Karabiben | Towards Data Science](https://towardsdatascience.com/a-simple-yet-effective-approach-to-implementing-unit-tests-for-dbt-models-da2583ea8e79)
	- Кроме dbt тестов можно говорить также о dbt unit tests 
	- Тестируемый unit — это как сами модели, так и CTE, из которых они состоят
	- Структуру модели надо стандартизировать: import CTEs, Intermediate CTEs, Final CTE
	- Тестировать надо intermediate CTEs и final CTE
	- Первый компонент системы тестирования: mock inputs в виде [dbt seeds](https://docs.getdbt.com/docs/build/seeds)
	- Второй компонент: expected outputs, в виде тех же CSV.
	- Процесс тестирования это просто сравнение таблицы созданной из seed.input через трансформации dbt и таблицы expected outputs
	- Для непосредственно сравнения можно использовать пакет [dbt_audit_helper](https://github.com/dbt-labs/dbt-audit-helper) или систему вроде [Soda Core](https://github.com/sodadata/soda-core)
	- Описан общий процесс системы юнит-тестирования, но реализовать его (подмену референсов на таблицы моками и сравнение с expectation) нужно будет реализовать самим
- [Unit Testing · dbt-labs/dbt-core · Discussion #8275 · GitHub](https://github.com/dbt-labs/dbt-core/discussions/8275)
	- Подробное обсуждение предлагаемого процесса Unit-тестирования в dbt core, которое запланировано выпустить в версии 1.8
- [Audit\_helper in dbt: Bringing data auditing to a higher level | dbt Developer Blog](https://docs.getdbt.com/blog/audit-helper-for-migration)
	- пакет, который помогает провести аудит таблиц через сравнение данных (обычно для миграций или рефакторинга)
	- предоставляет два основных макроса: `compare_queries` и `compare_column_values`
	- `compare_queries` позволяет сравнить строки, исключив некоторые колонки, если нужно, и получить отчёт о совпадении данных 
	- `compare_column_values` сравнивает значения в конкретной колонке для проверки её совместимости между хранилищами
	  ![Pasted image 20240307153405.png|300](/img/user/files/Pasted%20image%2020240307153405.png)
- [Data Observability dbt Packages | The Infinite Lambda Blog](https://infinitelambda.com/data-observability-dbt-packages/)
	- Описывают стандартные пакеты codegen, utils, expectations
	- Описывают пакеты [dbt-labs/dbt-project-evaluator](https://github.com/dbt-labs/dbt-project-evaluator), [dbt profiler](https://hub.getdbt.com/data-mie/dbt_profiler/latest/), [dbt_artifacts](https://github.com/brooklyn-data/dbt_artifacts) — см. [[Inbox/Тестирование и наблюдаемость данных в Dbt и не только#^u2p37h\|выше]]
- [Data Observability on Steroids](https://hiflylabs.com/blog/2022/07/08/data-observability-on-steroids)
	- [What is re_data?](https://docs.getre.io/master/docs/re_data/introduction/whatis_data) — генератор отчетов о dbt-проекте, включает lineage данных, их статистические характеристики и результаты выполнения тестов
	- [What is re\_cloud?](https://docs.getre.io/master/docs/re_cloud/whatis_cloud) — хостинг отчетов dbt, включая отчеты redata, dbt docs, elementary
	- [Data Observability Features Built for Today's Data Teams | Metaplane](https://www.metaplane.dev/platform-overview) — платформа для мониторинга данных, управления инцидентами и алертинга. Якобы умеет в автоматизированный поиск аномалий.
- [Data quality dimensions for better decision-making | Datafold](https://www.datafold.com/blog/data-quality-dimensions)
	- Есть семь измерений "качества данных"
	- Точность. Обычно меряют в процентах. Может падать из-за задержек, ошибок ввода, ошибок обработки
	- Полнота. Например, "у нас есть адрес 95% клиентов"
	- Консистентность. Единообразие в форматах (24.99USD vs $24.99), таймзонах. Измерять проще всего сравнивания одни и те же даные в разных отчетах.
	- Надежность. Постоянство данных, отсутствие "мельканий", регулярность. То, насколько можно доверять отдельному измерению. Для проверки можно сравнивать с независимым источником или делать повторные измерения.
	- Своевременность. Прогноз погоды на завтра будет не нужен через неделю. Если данные поступают медленно, невозможно делать качественные прогнозы. Метрика: задержка между сбором данных и моментом, когда они готовы к использованию. Можно иметь алерты по staleness.
	- Уникальность. Отсутствие (ошибочно) дублирующихся данных. Другой пример: плохо организованная версионность — две таблицы типа `customers` и `customers_v1`
	- Полезность. Субъективная характеристика того, насколько ваши модели кому-то реально полезны. Напоминает что не всегда надо строить сложные ML-модели, где можно обойтись пивот-таблицами
- [dbt at Super Part 3: Observability | by Jonathan Talmi | Super.com | Medium](https://medium.com/super/dbt-at-super-part-3-observability-c8755109901f)
	- Хранить результаты запусков и другие артефакты в warehouse и использовать BI (metabase) для анализа и алертов
	- [elementary-data/dbt-data-reliability](https://github.com/elementary-data/dbt-data-reliability)
	- Добавлять в манифест модели (dbt meta) имя owner'а данных, чтобы в алертах можно было сразу тегать того, кто отвечает, например, за freshness
	- OS Python Package, от Elementary, который умеет слать уведомления в Slack / MS Teams (note: вроде можно слать в [дискорд как будто в слек](https://discord.com/developers/docs/resources/webhook#execute-slackcompatible-webhook))
	- Elementary позволяет исследовать время запуска моделей и их стоимость
- [dbt: How We Improved Our Data Quality by Cutting 80% of Our Tests | by Noah Kennedy | Better Programming](https://betterprogramming.pub/dbt-how-we-improved-our-data-quality-by-cutting-80-of-our-tests-78fc35621e4e)
{ #dbt-article}

	- главный блокер хорошей системы тестирования: наблюдаемость и actionability тестов (когда они падают). Мы всё улучшили, попутно убрав 80% тестов.
	- трехшаговый процесс: детальные высококачественные тесты, агрегация результатов тестирования, построение вьюх для результатов тестов с разделением по владельцам и/или важности.
	- тесты должны явно указывать свою серьезность (severity)
	- каждый тест должен соответствовать установленным нормам [[Inbox/RACI-матрица\|RACI]] (кто будет чинить, кого надо информировать)
	- два класса тестов: data integrity и context-driven. 
	- data integrity тесты чинят программисты, context-driven предполагают участие людей из предметной области
	- строгое название тестов (table_name__column_name__test_name) и [test aliasing](https://docs.getdbt.com/reference/resource-configs/alias)
	- обязательно установить [store_failures](https://docs.getdbt.com/reference/resource-configs/store_failures) в true
	- используют metadata-файл для тестов, который является [seed](https://docs.getdbt.com/docs/build/seeds). Там хранится название теста, владелец, важность теста, и другие дополнительные поля.
	- далее, данные агрегируются средствами dbt, объединяя результаты запуска тестов с  метаданными. Из этой базовой таблицы строятся всевозможные views, которые предоставляют дешборды для owners, по severity и другим срезам
- [dbt Tests. A necessary assertion to ensure the… | by Jimmy Pang | Data Panda | Medium](https://medium.com/data-panda/dbt-tests-813f0aeacac8)
	- В Elementary [есть дополнительные тесты](https://docs.elementary-data.com/data-tests/introduction) для моделей
	- [Указание severity для тестов](https://docs.getdbt.com/reference/resource-configs/severity), в виде пороговых значений на количество ошибок
	- Обязательно чтобы у всех моделей были primary keys + поставить тест на not_null & unique
	- Генерировать суррогатные ключи, используя [макро из dbt-utils](https://github.com/dbt-labs/dbt-utils#generate_surrogate_key-source)
- [So you're using dbt tests—Validio is what's next in data quality validation for scalability and comprehensiveness](https://validio.io/blog/whats-next-in-data-quality)
	- кроме warehouses (таблиц), есть и другие данные (object stores и streams), которые до warehouse могут и не доходить, а тестировать их тоже надо

# Находки по пути
Здесь то, что не относится к теме тестирования, к dbt и, может быть вообще к разработке, но попалось по пути.
- [Modern Business Intelligence | Better data, better decisions](https://mode.com/)
- [Date dimension: How to Create a Practical and Useful Date Dimension in dbt | by Gabriel Campos | Indicium Engineering | Medium](https://medium.com/indiciumtech/date-dimension-how-to-create-a-practical-and-useful-date-dimension-in-dbt-5ee70a18f3bb)
- [GitHub - mckaywrigley/chatbot-ui: AI chat for every model.](https://github.com/mckaywrigley/chatbot-ui)
- [Deepnote: Analytics and data science notebook for teams.](https://deepnote.com/) — AI-supported блокноты для работы с данными
- [Hightouch | Composable CDP & Reverse ETL | Activate data | Hightouch](https://hightouch.com/)
- [Managing a dynamic dbt project at Whatnot | Whatnot Engineering](https://medium.com/whatnot-engineering/managing-a-dynamic-dbt-project-929db0a134fb)
- [dbt action · Actions · GitHub Marketplace · GitHub](https://github.com/marketplace/actions/dbt-action)

# Обсуждение в Твиттере
<blockquote class="twitter-tweet"><a href="https://twitter.com/user/status/1765736017615863884?ref_src=twsrc%5Etfw"></a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet"><a href="https://twitter.com/user/status/1765258852306673714?ref_src=twsrc%5Etfw"></a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
