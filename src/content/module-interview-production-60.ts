import type { LectureModule } from './schema';
import { topic } from './module-1';

const PROD_LINKS = [
  {
    title: 'Microservices.io — паттерны',
    url: 'https://microservices.io/patterns/index.html',
    description: 'Transactional outbox, saga, idempotent consumer, service boundary.',
  },
  {
    title: 'Apache Kafka Documentation',
    url: 'https://kafka.apache.org/documentation/',
    description: 'Consumer groups, rebalance, at-least-once, DLQ-паттерны.',
  },
  {
    title: 'Camunda 8 / BPMN',
    url: 'https://docs.camunda.io/',
    description: 'Long-running process, delegates, incidents, message correlation.',
  },
  {
    title: 'Spring Boot Reference',
    url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/',
    description: 'JPA, транзакции, graceful shutdown, actuator.',
  },
  {
    title: 'OpenAPI Specification',
    url: 'https://swagger.io/specification/',
    description: 'Contract-first, versioning, backward compatibility.',
  },
  {
    title: 'Liquibase Documentation',
    url: 'https://docs.liquibase.com/',
    description: 'Versioned migrations, rollback, CI review.',
  },
];

export const moduleInterviewProduction60: LectureModule = {
  id: 'interview-production-60',
  interviewSectionKicker: 'Production Java / микросервисы, 60 мин',
  title: 'Интервью: production Java / микросервисы на 60 минут',
  targetDurationMinutes: 60,
  audienceLevel: 'Middle+ / Senior',
  isAvailable: true,
  summary:
    'Шпаргалка ведущего для production-техпрогона: архитектура, REST/OpenAPI, JPA, Kafka/outbox, Camunda, K8s и observability. 60 минут по таймингу.',
  topics: [
    topic({
      id: 'int-prod-00',
      title: 'План техпрогона на 60 минут',
      priority: 'core',
      simpleDefinitionOverride:
        'Карта техпрогона: таймбоксы, must-ask вопросы и правила сокращения. Открывать перед началом и держать под рукой весь слот.',
      quickAnswer:
        '60 минут: проект кандидата → архитектура → REST → БД/JPA → Kafka/outbox → Camunda → инциденты/observability → финал. Не уходить в лекцию — слушать production-опыт и дожимать follow-up.',
      explainBrief: [
        '0–5 мин: краткий рассказ кандидата о проекте — слушаем стек, роль, инциденты, границы сервисов.',
        '5–15 мин: архитектура и микросервисы — core vs payment, границы, интеграции.',
        '15–25 мин: REST / Spring Boot / OpenAPI — контракт, идемпотентность API.',
        '25–35 мин: PostgreSQL / JPA / транзакции — миграции, OSIV, proxy.',
        '35–45 мин: Kafka / outbox / идемпотентность consumer — dual-write, DLQ.',
        '45–52 мин: Camunda — long-running, delegate errors, retry.',
        '52–57 мин: production debugging — PG timeouts, K8s shutdown + Kafka.',
        '57–60 мин: observability + итоговая оценка по матрице.',
      ],
      questionPlan: [
        {
          question: 'С чего начинаем слот?',
          answerHint: '«Расскажите о проекте: стек, ваша зона, один сложный инцидент» — не перебивать первые 3 минуты.',
        },
        {
          question: 'Куда переходим после intro?',
          answerHint: 'По таймингу — int-prod-01 (архитектура). Если кандидат сам упомянул Kafka/Camunda — можно чуть сдвинуть, но не пропускать REST и outbox.',
        },
        {
          question: 'Когда сокращать?',
          answerHint: 'Если кандидат силён в Kafka — сжать rebalance/DLQ до одного follow-up. Если слаб в JPA — не копать Criteria, достаточно OSIV + N+1.',
        },
        {
          question: 'Что не выкидывать?',
          answerHint: 'Границы сервисов, идемпотентность (REST + consumer), outbox, Camunda error handling, correlation id в инциденте.',
        },
      ],
      extraKeyPoints: [
        'Must-ask: core vs payment, contract-first, идемпотентность API, ddl-auto vs Liquibase, OSIV, @Transactional proxy, outbox, consumer dedup, Camunda delegate 500, observability.',
        'Оценка: 0 — не слышал тему; 1 — термины без опыта; 2 — правильная модель без прод-кейса; 3 — прод-кейс + trade-offs.',
      ],
      interviewFocus: [
        {
          question: 'Как вести техпрогон, если кандидат уходит в детали?',
          expectedAnswer:
            'Вежливо вернуть к вопросу: «Как это было в вашем проекте?» Если нет опыта — дать мини-кейс из int-prod-16 и смотреть ход рассуждений, а не заученные определения.',
        },
      ],
      codeExample: {
        title: 'Ран-лист техпрогона (60 мин)',
        language: 'text',
        snippet: `0–5   Рассказ кандидата о проекте
5–15  int-prod-01  Архитектура: core vs payment
15–25 int-prod-02/03 REST, OpenAPI, идемпотентность
25–35 int-prod-04/05/06 Liquibase, OSIV/N+1, @Transactional
35–45 int-prod-07–10 Outbox, consumer idempotency, rebalance, DLQ
45–52 int-prod-11/12 Camunda orchestration, delegate 500
52–57 int-prod-13/14 PG incident, K8s graceful + Kafka
57–60 int-prod-15 Observability + оценка

Must-ask (10):
1 core vs payment          6 @Transactional proxy
2 contract-first OpenAPI   7 outbox vs dual-write
3 REST idempotency         8 Kafka consumer dedup
4 Liquibase vs ddl-auto    9 Camunda delegate failure
5 OSIV / N+1              10 observability при инциденте`,
        walkthrough: [
          'Открыть эту карточку до звонка — таймбоксы и must-ask на одном экране.',
          'Во время слота переключаться по sidebar; не читать карточки вслух кандидату.',
          'Если отстаёте от тайминга — сократить int-prod-09/10, не трогать outbox и Camunda.',
        ],
        commonPitfall: 'Превратить техпрогон в лекцию или уйти в один стек (только Kafka) без охвата REST и БД.',
        productionNote: 'Цель — оценить production-мышление за час, а не проверить все технологии глубоко.',
        referenceSolution: `Чеклист ведущего

Обязательно спросить:
- Границы core-оркестрации и payment (своя БД, REST/Kafka)
- Contract-first OpenAPI и backward compatibility
- Идемпотентность создания заявки (ключ, constraint, повтор)
- Почему ddl-auto нельзя на prod (Liquibase, validate)
- OSIV=false: где грузить lazy, как ловить N+1
- @Transactional и self-invocation через proxy
- Почему save()+kafkaTemplate.send() опасно (outbox)
- Повторное Kafka-сообщение: dedup в handler
- Camunda: transient 500 в delegate — retry/incident
- Метрики и correlation id при разборе инцидента

Где сокращать:
- Kafka rebalance/DLQ — один follow-up, если силён в consumer idempotency
- Hibernate детали — не углубляться в Criteria, хватит fetch join
- K8s — если нет опыта, один вопрос про graceful shutdown

Не выкидывать:
- Outbox (dual-write)
- Идемпотентность на REST и consumer
- Camunda error model (не глотать 500)
- Production incident reasoning (int-prod-13–16)

Быстрая оценка:
- Не знает термин → 0
- Знает определение, нет кейса → 1
- Правильная модель + нюансы → 2
- Реальный прод-инцидент / trade-offs → 3
- Middle+: среднее ≥ 1.5 по core-темам; Senior: ≥ 2 с кейсами в Kafka/Camunda/инцидентах`,
        referenceSolutionLanguage: 'text',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Техпрогон', meaning: 'Структурированное интервью по стеку проекта — проверка опыта, а не лекция.' },
        { term: 'Must-ask', meaning: 'Вопросы, без которых нельзя закрыть слот — ядро оценки.' },
        { term: 'Follow-up', meaning: 'Уточняющий вопрос после ответа — «а что было на проде?»' },
      ],
      lecturerNotes: [
        'Держать таймер: если на 25-й минуте ещё на архитектуре — сжать follow-up, не пропускать блоки 25–45.',
        'Записывать оценку 0–3 по каждой теме сразу в заметках — в конце усреднить.',
        'Кейсы int-prod-16 — подставлять, если кандидат «знает теорию», но не приводит примеры.',
      ],
      estimatedMinutes: 0,
    }),
    topic({
      id: 'int-prod-01',
      title: 'Core orchestration vs Payment service',
      priority: 'core',
      simpleDefinitionOverride:
        'Core-оркестрация ведёт длинный бизнес-процесс (saga, шаги, ожидание событий). Payment-сервис — system of record для заявок, транзакций и реестров. У каждого своя БД и контракт.',
      quickAnswer:
        'Core знает порядок шагов и ждёт внешние события; payment владеет данными оплат. Core не лезет в БД payment — только REST-команды и Kafka-события.',
      explainBrief: [
        'Core = long-running process / saga: какой шаг сейчас, что ждём, куда идти дальше.',
        'Payment = system of record: заявки, транзакции, реестры, статусы денег.',
        'Своя БД и публичный контракт у каждого сервиса — без shared database.',
        'Core не ходит напрямую в таблицы payment — только через API или события.',
        'REST для команд («создай платёж»), Kafka для фактов («платёж проведён»).',
      ],
      questionPlan: [
        { question: 'Кто за что отвечает?', answerHint: 'Core — процесс и координация; payment — данные и правила денег.' },
        { question: 'Как общаются?', answerHint: 'Синхронно REST, асинхронно Kafka; не общая БД.' },
        { question: 'Где Camunda?', answerHint: 'В core (или отдельном orchestration-сервисе) — state machine процесса, не в payment CRUD.' },
      ],
      extraKeyPoints: [
        'Core = long-running process / saga / порядок шагов / ожидание внешних событий.',
        'Payment = system of record для заявок, транзакций, реестров.',
        'Своя БД и контракт у каждого; core не ходит в БД payment.',
        'REST для команд, Kafka для событий.',
      ],
      interviewFocus: [
        {
          question: 'Как объяснить разделение ответственности между core-оркестрацией и payment-сервисом?',
          expectedAnswer:
            'Core ведёт бизнес-процесс: какие шаги, в каком порядке, что делать при сбое и ожидании внешних систем. Payment — единственный владелец данных о платежах и заявках: создаёт, хранит, меняет статусы по своим правилам. Интеграция через контракты: core шлёт команду создать платёж, payment публикует событие «проведено» или «отклонено». Общая БД — антипаттерн: слипаются границы, ломаются независимые релизы.',
        },
        {
          question: 'Follow-up: что если payment лежит, а процесс в Camunda уже запущен?',
          expectedAnswer:
            'Процесс не должен «успешно» завершить шаг: delegate бросает transient error, Camunda делает retry с backoff; после лимита — incident. Состояние процесса переживает падение payment; при восстановлении — повтор шага с идемпотентным вызовом payment.',
        },
      ],
      codeExample: {
        title: 'Границы core и payment',
        language: 'text',
        snippet: `Core (orchestration)          Payment (system of record)
├── Camunda BPMN                ├── REST API: заявки, платежи
├── ждёт Kafka-события          ├── своя PostgreSQL
├── REST → payment (команда)    ├── публикует PaymentCompleted
└── своя БД (процесс, не деньги)└── не знает шаги всего процесса

Запрещено: core SELECT * FROM payment.transactions`,
        walkthrough: [
          'Слушать: кандидат разделяет «процесс» и «данные денег», не смешивает в один сервис.',
          'Дожать: «Как core узнает, что платёж прошёл?» — событие, не polling БД соседа.',
        ],
        commonPitfall: 'Общий доступ к БД payment или Camunda как «просто красивая схема» без state и retry.',
        productionNote: 'Нарушение границ — первый источник dual-write и неконтролируемых связей при релизах.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'System of record', meaning: 'Единственный авторитетный источник данных по домену (заявки, транзакции).' },
        { term: 'Saga', meaning: 'Длинная операция из локальных шагов с компенсациями при сбоях.' },
        { term: 'Orchestration', meaning: 'Центральный координатор ведёт процесс по шагам.' },
      ],
      lecturerNotes: ['Red flag: «все сервисы знают всё друг о друге» — спросить про контракт и события.'],
      estimatedMinutes: 8,
    }),
    topic({
      id: 'int-prod-02',
      title: 'REST / OpenAPI contract-first',
      priority: 'core',
      simpleDefinitionOverride:
        'Contract-first: OpenAPI-спека — source of truth; из неё генерятся DTO и API. Потребители и QA опираются на версионированный контракт, а не на «как получилось в коде».',
      quickAnswer:
        'Сначала контракт, потом код. Codegen DTO, backward compatibility, breaking changes только через v2. Swagger — не только красивая документация.',
      explainBrief: [
        'Контракт как source of truth — изменения видны в PR на YAML, не внезапно в runtime.',
        'Codegen DTO/API — меньше расхождений между сервисами.',
        'Backward compatibility: новые поля optional, старые клиенты не ломаются.',
        'Breaking changes — новая major-версия (/v2), deprecation period.',
        'Удобно QA, аналитикам, потребителям — один язык описания API.',
      ],
      questionPlan: [
        { question: 'Зачем contract-first?', answerHint: 'Единый источник правды, совместимость, review до кода.' },
        { question: 'Как ломать контракт безопасно?', answerHint: 'v2, deprecation, не менять семантику полей молча.' },
        { question: 'Где не должен жить бизнес?', answerHint: 'Не в controller — service/domain layer.' },
      ],
      extraKeyPoints: [
        'Контракт как source of truth; codegen DTO/API.',
        'Backward compatibility; breaking → v2.',
        'Удобно QA/аналитикам/потребителям.',
      ],
      interviewFocus: [
        {
          question: 'Почему contract-first OpenAPI полезен в микросервисном проекте?',
          expectedAnswer:
            'В микросервисах много потребителей одного API. Если контракт в коде одного сервиса, остальные узнают о breaking change после деплоя. OpenAPI-first: спека в репозитории, review, генерация stubs/server interfaces, контрактные тесты. Добавление optional-поля — совместимо; переименование — только с версией. Это снижает интеграционные инциденты и ускоряет согласование с аналитикой.',
        },
        {
          question: 'Follow-up: кто владеет openapi.yaml и как проверяете совместимость?',
          expectedAnswer:
            'Команда-владелец сервиса; CI: diff breaking changes (openapi-diff), consumer-driven contract tests или Pact. Релиз без зелёного контрактного пайплайна — риск.',
        },
      ],
      codeExample: {
        title: 'Contract-first flow',
        language: 'text',
        snippet: `1. PR: openapi.yaml (новое optional поле statusReason)
2. CI: codegen → PaymentApi, PaymentDto
3. Реализация в service, controller тонкий
4. Consumer генерит client stub из той же спеки
5. Breaking? → /v2/payments, v1 deprecated 6 мес`,
        walkthrough: [
          'Слушать: контракт до кода, не «написали controller — потом Swagger».',
          'Red flag: «потребители сами поправятся» — спросить про mobile/внешних партнёров.',
        ],
        commonPitfall: 'Swagger только для документации; менять DTO без версии; бизнес-логика в controller.',
        productionNote: 'Контрактные инциденты дороже багов внутри одного сервиса — ловить на CI.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'OpenAPI', meaning: 'Стандарт описания REST API (бывш. Swagger spec).' },
        { term: 'Codegen', meaning: 'Генерация классов и клиентов из спеки.' },
        { term: 'Backward compatibility', meaning: 'Старые клиенты работают с новой версией API.' },
      ],
      lecturerNotes: ['Если кандидат слаб — достаточно «спека в git + генерация DTO».'],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-prod-03',
      title: 'REST idempotency',
      priority: 'core',
      simpleDefinitionOverride:
        'Идемпотентный API: повтор того же запроса не создаёт дубль и возвращает тот же результат или актуальное состояние. Критично при timeout и retry на клиенте.',
      quickAnswer:
        'Повтор POST с тем же idempotency key → тот же resource id, не вторая заявка. Timeout клиента ≠ rollback на сервере. Unique constraint + correlation id для разбора.',
      explainBrief: [
        'Повтор запроса не создаёт дубль заявки/платежа.',
        'Business key / Idempotency-Key header / unique constraint в БД.',
        'Timeout у клиента не значит, что сервер откатил операцию — мог успеть commit.',
        'Повтор возвращает 200/201 с тем же телом или текущим статусом.',
        'Correlation id связывает попытки в логах и трассировке.',
      ],
      questionPlan: [
        { question: 'POST может быть идемпотентным?', answerHint: 'Да, с ключом и dedup в БД.' },
        { question: 'Что при timeout?', answerHint: 'Клиент retry с тем же ключом; сервер отдаёт существующую запись.' },
        { question: 'Где хранить ключ?', answerHint: 'Таблица idempotency_keys или unique (client_id, key).' },
      ],
      extraKeyPoints: [
        'Повтор не создаёт дубль; business key / idempotency key / unique constraint.',
        'Timeout клиента ≠ rollback на сервере.',
        'Повтор → тот же результат; correlation id для разбора.',
      ],
      interviewFocus: [
        {
          question: 'Что значит сделать API создания/обновления заявки идемпотентным?',
          expectedAnswer:
            'Клиент при создании передаёт Idempotency-Key (или business key). Первый запрос создаёт заявку и сохраняет ключ; повтор с тем же ключом не вставляет вторую строку — возвращает id и статус первой. Реализация: unique index, INSERT ON CONFLICT или проверка в транзакции. При сетевом timeout клиент обязан retry с тем же ключом — иначе дубли в production неизбежны.',
        },
        {
          question: 'Follow-up: TTL для ключей и что при смене payload с тем же ключом?',
          expectedAnswer:
            '409 Conflict если payload отличается при том же ключе. TTL чистит старые ключи (30–90 дней). Метрика duplicate_rejected.',
        },
      ],
      codeExample: {
        title: 'Идемпотентное создание заявки',
        language: 'text',
        snippet: `POST /applications
Header: Idempotency-Key: uuid-123
Body: { amount, clientId }

1-й вызов → 201 { id: 42, status: NEW }
timeout → клиент retry с тем же ключом
2-й вызов → 200 { id: 42, status: NEW }  // не id: 43

DB: UNIQUE(client_id, idempotency_key)`,
        walkthrough: [
          'Слушать: ключ + constraint, не «retry на клиенте достаточно».',
          'Дожать сценарий timeout после commit на сервере.',
        ],
        commonPitfall: '«POST не может быть идемпотентным»; «дубли потом почистим»; только client retry без серверного dedup.',
        productionNote: 'Дубли заявок — прямой путь к финансовым и комплаенс-инцидентам.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Idempotency-Key', meaning: 'Заголовок или поле для безопасного повтора запроса.' },
        { term: 'Correlation id', meaning: 'Идентификатор цепочки запросов для логов и трассировки.' },
      ],
      lecturerNotes: ['Связать с payment-сервисом из int-prod-01 — кто генерит ключ, core или клиент.'],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-prod-04',
      title: 'Liquibase / Hibernate DDL',
      priority: 'core',
      simpleDefinitionOverride:
        'На production схема БД меняется только versioned changesets (Liquibase/Flyway). Hibernate ddl-auto=validate — проверка соответствия, не автосоздание таблиц.',
      quickAnswer:
        'ddl-auto update/create-drop на проде запрещён: нет review, rollback, контроля данных. Liquibase в CI, Hibernate только validate, миграции backward-compatible.',
      explainBrief: [
        'Схема меняется через versioned changesets в git.',
        'Hibernate ddl-auto=validate — старт падает при расхождении entity и БД.',
        'Review/rollback/CI на каждую миграцию.',
        'Контроль данных: NOT NULL, default, backfill в отдельном шаге.',
        'Миграции backward-compatible: сначала add column, потом код, потом drop.',
      ],
      questionPlan: [
        { question: 'Почему не ddl-auto:update?', answerHint: 'Непредсказуемые ALTER, нет истории, риск на prod.' },
        { question: 'Как выкатывать rename колонки?', answerHint: 'Expand-contract: add new, dual write, migrate, drop old.' },
        { question: 'Кто ревьюит changeset?', answerHint: 'Разработчик + при необходимости DBA; в CI.' },
      ],
      extraKeyPoints: [
        'Versioned changesets; Hibernate только validate.',
        'Review/rollback/CI; контроль данных и совместимости.',
        'Миграции backward-compatible.',
      ],
      interviewFocus: [
        {
          question: 'Почему на production нельзя ddl-auto:update/create-drop?',
          expectedAnswer:
            'Hibernate может добавить/изменить колонки без согласования, lock таблицы на больших объёмах, потерять данные при create-drop. На prod нужен аудит: кто, когда, какой SQL. Liquibase даёт changelog, идемпотентность changeset, rollback-скрипты. Деплой приложения и миграции — отдельный контролируемый шаг. validate гарантирует, что entity не врут про схему.',
        },
      ],
      codeExample: {
        title: 'Безопасная миграция',
        language: 'text',
        snippet: `application.yml: ddl-auto: validate

Liquibase:
  001-create-application.xml
  002-add-status-reason.xml  -- nullable сначала
  003-backfill-status-reason.sql
  004-not-null-status-reason.xml

Релиз: migrate → deploy app (читает новое поле)`,
        walkthrough: [
          'Слушать: validate + versioned migrations, не «Hibernate сам создаст».',
          'Спросить про zero-downtime deploy и add-column-before-code.',
        ],
        commonPitfall: 'Hibernate сам всё создаст; update на проде норм; Liquibase только для DBA.',
        productionNote: 'Плохая миграция — downtime и откат релиза всего кластера.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Liquibase', meaning: 'Инструмент versioned миграций схемы БД.' },
        { term: 'ddl-auto', meaning: 'Настройка Hibernate: create/update/validate/none.' },
        { term: 'Expand-contract', meaning: 'Паттерн безопасного изменения схемы без downtime.' },
      ],
      lecturerNotes: ['Не углубляться в синтаксис XML — достаточно процесса.'],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-05',
      title: 'JPA / OSIV / N+1',
      priority: 'core',
      simpleDefinitionOverride:
        'При open-in-view=false lazy-связи грузятся внутри service-транзакции: fetch join, entity graph или DTO projection. Web-слой не догружает данные; OSIV off освобождает connection раньше.',
      quickAnswer:
        'OSIV off → загрузка в @Transactional service: join fetch / EntityGraph / projection. Web не трогает lazy. N+1 ловим через SQL log, statistics, metrics.',
      explainBrief: [
        'Lazy грузим внутри service transaction — пока session открыта.',
        'fetch join / @EntityGraph / DTO projection вместо доступа из controller.',
        'Web layer не должен инициировать lazy load — LazyInitializationException или скрытый N+1.',
        'OSIV off не держит DB connection до конца HTTP response — лучше для пула.',
        'N+1: один запрос на коллекцию → включить show_sql, p6spy, Hibernate stats.',
      ],
      questionPlan: [
        { question: 'Где грузить lazy collection?', answerHint: 'В service method в транзакции, явным fetch.' },
        { question: 'Почему OSIV off?', answerHint: 'Короче жизнь connection, явные границы загрузки.' },
        { question: 'Как нашли N+1 на проде?', answerHint: 'Логи SQL, APM, spike запросов на один HTTP call.' },
      ],
      extraKeyPoints: [
        'Lazy в service transaction; fetch join / entity graph / DTO.',
        'Web layer не догружает; OSIV off → connection не до конца HTTP.',
        'N+1 — SQL logs/statistics/metrics.',
      ],
      interviewFocus: [
        {
          question: 'Если open-in-view=false, где и как загружать lazy-связи?',
          expectedAnswer:
            'В публичном методе сервиса с @Transactional: один запрос с JOIN FETCH или EntityGraph на нужные связи, либо отдельный read-only query с projection в DTO. Controller получает уже собранный DTO. Если нужен список с вложенными — batch size или @BatchSize, но лучше один осознанный запрос. На проде N+1 часто виден как сотни одинаковых SELECT в трейсе — лечится не EAGER везде, а правильным fetch на use-case.',
        },
      ],
      codeExample: {
        title: 'Загрузка без OSIV',
        language: 'text',
        snippet: `@Transactional(readOnly=true)
ApplicationDto get(UUID id) {
  // JOIN FETCH items в repository query
  // или EntityGraph на findById
  return mapper.toDto(entity); // lazy уже инициализированы
}
// controller только return dto — без entity`,
        walkthrough: [
          'Слушать: граница транзакции = граница загрузки.',
          'Red flag «включим OSIV» — спросить про connection pool под нагрузкой.',
        ],
        commonPitfall: 'Включить OSIV обратно; EAGER везде; «N+1 не страшно».',
        productionNote: 'N+1 под нагрузкой — типичная причина PG timeouts после «безобидного» релиза.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'OSIV', meaning: 'Open Session In View — session JPA открыта на весь HTTP-запрос.' },
        { term: 'N+1', meaning: 'Один запрос за родителями + N запросов за детьми.' },
        { term: 'Fetch join', meaning: 'JOIN FETCH в JPQL — связи в одном SQL.' },
      ],
      lecturerNotes: ['Связать с int-prod-13 — N+1 как причина таймаутов.'],
      estimatedMinutes: 4,
    }),
    topic({
      id: 'int-prod-06',
      title: 'Spring transactions / proxy / self-invocation',
      priority: 'core',
      simpleDefinitionOverride:
        '@Transactional работает через Spring proxy на внешний вызов public-метода bean. Self-invocation, private и final обходят AOP — транзакция не откроется там, где ожидаете.',
      quickAnswer:
        'Транзакция на границе use-case: public метод Spring bean, вызов снаружи. this.internal() — без proxy. REQUIRES_NEW — отдельный commit и частичные side effects.',
      explainBrief: [
        '@Transactional обычно через JDK/CGLIB proxy.',
        'Self-invocation (this.method()) обходит proxy — @Transactional игнорируется.',
        'private/final методы — не перехватываются стандартным Spring AOP.',
        'Transaction boundary — public метод сервиса, вызываемый из controller/consumer.',
        'REQUIRES_NEW — новая транзакция, commit независимо от outer (audit, outbox publish).',
      ],
      questionPlan: [
        { question: 'Почему @Transactional не сработал?', answerHint: 'Self-invocation, не public, не Spring bean.' },
        { question: 'Как починить self-invocation?', answerHint: 'Вынести в другой bean или self-injection (осторожно).' },
        { question: 'Когда REQUIRES_NEW?', answerHint: 'Лог/audit должен сохраниться при rollback основной tx.' },
      ],
      extraKeyPoints: [
        '@Transactional через proxy; self-invocation обходит proxy.',
        'private/final — нет ожидаемой AOP-семантики.',
        'Boundary на public Spring bean; REQUIRES_NEW — отдельный commit.',
      ],
      interviewFocus: [
        {
          question: 'Какие проблемы могут быть с @Transactional из-за proxy/self-invocation?',
          expectedAnswer:
            'Класс вызывает свой же @Transactional метод через this — proxy не участвует, транзакция не стартует, LazyInitializationException или частичный commit. То же с private @Transactional. Решение: вынести в отдельный сервис-bean, вызывать через инжектированный self или TransactionTemplate. REQUIRES_NEW создаёт независимый commit — audit может сохраниться при rollback бизнес-транзакции; злоупотребление ломает атомарность.',
        },
      ],
      codeExample: {
        title: 'Proxy vs self-invocation',
        language: 'text',
        snippet: `// НЕ работает:
class Svc {
  void a() { this.b(); }  // без proxy
  @Transactional void b() { ... }
}

// Работает:
class Svc {
  @Transactional
  public void useCase() { repo.save(); }  // вызов из controller
}`,
        walkthrough: [
          'Слушать: понимание proxy, не магия аннотации.',
          'Спросить, как дебажили «транзакция не откатилась».',
        ],
        commonPitfall: '@Transactional всегда работает; на private можно; REQUIRES_NEW решает всё.',
        productionNote: 'Тихие partial commit — один из самых неприятных классов прод-багов.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Proxy', meaning: 'Обёртка Spring вокруг bean для AOP (транзакции, security).' },
        { term: 'Self-invocation', meaning: 'Вызов метода того же объекта через this, минуя proxy.' },
        { term: 'REQUIRES_NEW', meaning: 'Propagation: всегда новая транзакция, suspend внешней.' },
      ],
      lecturerNotes: ['Короткий слот — один вопрос про self-invocation достаточно.'],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-07',
      title: 'DB + Kafka consistency / outbox',
      priority: 'core',
      simpleDefinitionOverride:
        'Прямой save() + kafkaTemplate.send() — dual-write: commit БД без события или событие без commit. Outbox пишет бизнес-изменение и запись события в одной DB-транзакции; publisher шлёт позже.',
      quickAnswer:
        'Нельзя две независимые записи без координации. Outbox: INSERT business + INSERT outbox в одной tx; отдельный poller публикует в Kafka с retry. Consumer всё равно idempotent.',
      explainBrief: [
        'Dual-write problem: два разных хранилища без атомарности.',
        'Сценарий A: DB commit, Kafka send упал — потеря события.',
        'Сценарий B: Kafka ok, DB rollback — ложное событие.',
        'Outbox: event row в той же транзакции, что бизнес-данные.',
        'Publisher с retry; consumer с dedup — at-least-once end-to-end.',
      ],
      questionPlan: [
        { question: 'Почему не send после save?', answerHint: 'Нет общей транзакции между PG и Kafka.' },
        { question: 'Как работает outbox?', answerHint: 'Таблица outbox, poller, mark published.' },
        { question: 'Exactly-once достаточно?', answerHint: 'Нет для бизнес-дублей — нужен dedup на consumer.' },
      ],
      extraKeyPoints: [
        'Dual-write; DB без Kafka / Kafka без DB.',
        'Outbox в одной DB transaction; publisher с retry.',
        'Consumer idempotent.',
      ],
      interviewFocus: [
        {
          question: 'Почему нельзя просто save() в БД и потом kafkaTemplate.send()?',
          expectedAnswer:
            'Между commit JDBC и send нет атомарности. При crash после commit событие не уйдёт; при send до commit — событие о несуществующей записи. @Transactional на метод с send не объединяет Kafka с PostgreSQL. Outbox pattern: в той же транзакции INSERT в business table и outbox table; фоновый процесс читает unpublished, шлёт в Kafka, помечает sent. Дубликаты от poller возможны — consumer идемпотентен по event id.',
        },
      ],
      codeExample: {
        title: 'Outbox flow',
        language: 'text',
        snippet: `@Transactional
void createPayment() {
  paymentRepo.save(p);
  outboxRepo.save(event);  // та же tx
}
// отдельно: OutboxPoller → kafka.send → UPDATE published_at
// consumer: dedup by event_id`,
        walkthrough: [
          'Слушать: одна транзакция для бизнеса и outbox, не «Kafka почти не падает».',
          'Дожать: кто poller, at-least-once, idempotent consumer.',
        ],
        commonPitfall: 'Kafka send почти не падает; @Transactional на Kafka+БД; exactly-once без бизнес-dedup.',
        productionNote: 'Потерянное PaymentCompleted — застрявший процесс в Camunda и ручные разборы.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Outbox', meaning: 'Таблица исходящих событий в той же БД, что бизнес-данные.' },
        { term: 'Dual-write', meaning: 'Запись в два хранилища без общей транзакции.' },
        { term: 'At-least-once', meaning: 'Сообщение доставлено минимум раз; возможны дубли.' },
      ],
      lecturerNotes: ['Must-ask тема — не пропускать даже при нехватке времени.'],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-08',
      title: 'Kafka consumer idempotency',
      priority: 'core',
      simpleDefinitionOverride:
        'При at-least-once повтор сообщения нормален. Handler проверяет event id / business key / статус; дубль безопасно завершается, offset коммитится. In-memory Set не подходит.',
      quickAnswer:
        'Второй раз то же сообщение → проверка processed_events или unique business key → skip side effect → commit offset. Память не переживает рестарт.',
      explainBrief: [
        'Повтор нормален при at-least-once, rebalance, crash до commit.',
        'Handler: event id уже обработан? → exit ok.',
        'Dedup: UNIQUE(event_id) или status transition only from EXPECTED.',
        'Дубль завершается без ошибки — иначе poison loop.',
        'In-memory Set теряется при рестарте pod.',
      ],
      questionPlan: [
        { question: 'Сообщение пришло дважды — что делает handler?', answerHint: 'Проверка id, идемпотентное обновление, commit.' },
        { question: 'Где хранить processed?', answerHint: 'Таблица в БД той же транзакции, что side effect.' },
        { question: 'Commit до или после обработки?', answerHint: 'После успешной tx; до — риск потери при crash.' },
      ],
      extraKeyPoints: [
        'Повтор нормален; event id / business key / status check.',
        'Dedup: unique constraint или processed_events.',
        'Дубль → ok + commit offset; не in-memory Set.',
      ],
      interviewFocus: [
        {
          question: 'Consumer получил одно сообщение два раза. Что должно произойти?',
          expectedAnswer:
            'Обработчик в транзакции: проверить, обрабатывали ли event_id. Если да — выйти без side effect. Если нет — бизнес-логика + insert в processed_events в той же tx. Offset commit после успеха. При уникальном business key — INSERT ON CONFLICT DO NOTHING. Ошибка «уже обработано» не должна уходить в бесконечный retry. Set в памяти на pod — антипаттерн: после рестарта дубль снова применится.',
        },
      ],
      codeExample: {
        title: 'Идемпотентный consumer',
        language: 'text',
        snippet: `onMessage(evt):
  BEGIN;
  IF EXISTS processed_events WHERE id = evt.id → COMMIT; return
  UPDATE application SET status='PAID' WHERE id=evt.appId AND status='PENDING'
  INSERT processed_events (id, processed_at)
  COMMIT;
  commitOffset()`,
        walkthrough: [
          'Слушать: dedup в БД, не «Kafka не дублирует».',
          'Связать с int-prod-07 — outbox может слать дважды.',
        ],
        commonPitfall: 'Kafka не присылает дубли; Set в памяти; игнорировать без проверки состояния.',
        productionNote: 'Без idempotency любой rebalance или redeploy — риск двойного списания.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'At-least-once', meaning: 'Доставка с возможными дубликатами.' },
        { term: 'Offset commit', meaning: 'Фиксация позиции consumer в partition.' },
        { term: 'Dedup', meaning: 'Дедупликация — отсечение повторной обработки.' },
      ],
      lecturerNotes: ['Кейс int-prod-16 Case 1 — если ответ слабый.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'int-prod-09',
      title: 'Kafka rebalance',
      priority: 'core',
      simpleDefinitionOverride:
        'Rebalance перераспределяет partitions между consumers в группе. Обработка паузирует, незакоммиченные сообщения могут прийти снова. Нужны max.poll.interval, commit policy, idempotency.',
      quickAnswer:
        'Rebalance = stop-the-world (или cooperative с меньшей паузой). Незакоммиченные offsets переобрабатываются. Тюнинг max.poll.interval.ms и времени обработки; idempotency обязательна.',
      explainBrief: [
        'Partitions переназначаются при join/leave consumer, session timeout.',
        'Обработка останавливается на время rebalance (classic) или revoke select partitions (cooperative).',
        'Незакоммиченные сообщения придут другому consumer — дубли.',
        'max.poll.interval.ms — если обработка дольше, consumer исключают из группы.',
        'Cooperative rebalancing снижает паузу, но не отменяет idempotency.',
      ],
      questionPlan: [
        { question: 'Что триггерит rebalance?', answerHint: 'Новый consumer, падение, превышение max.poll.interval.' },
        { question: 'Чем опасно?', answerHint: 'Дубли, stop processing, lag spike.' },
        { question: 'Как снизить боль?', answerHint: 'Cooperative assignor, static membership, pause обработку on revoke.' },
      ],
      extraKeyPoints: [
        'Partitions перераспределяются; пауза обработки.',
        'Незакоммиченные → повтор; max.poll.interval, commit policy.',
        'Cooperative не отменяет idempotency.',
      ],
      interviewFocus: [
        {
          question: 'Что происходит при rebalance consumer group и чем это опасно?',
          expectedAnswer:
            'Координатор отзывает partitions, назначает заново. Пока идёт rebalance, poll не обрабатывает новые записи (classic — все partitions). Сообщения, обработанные но без commit, придут снова. Опасность: дубли side effect, рост lag, каскад при долгой обработке и исключении consumer из группы. Митигация: идемпотентный handler, commit после tx, увеличить max.poll.interval или ускорить batch, cooperative-sticky assignor, обработка onPartitionsRevoked с завершением текущих задач.',
        },
      ],
      codeExample: {
        title: 'Rebalance timeline',
        language: 'text',
        snippet: `consumer-1: processing msg@offset 100 (not committed)
deploy → consumer-1 leaves
rebalance → partition → consumer-2
consumer-2: reads from last committed 99 → msg 100 again

Fix: idempotent handler + commit after tx
Tune: max.poll.interval.ms, cooperative rebalance`,
        walkthrough: [
          'Слушать: rebalance = дубли, не абстракция «нас не касается».',
          'Можно сократить follow-up, если силён в int-prod-08.',
        ],
        commonPitfall: 'Rebalance не касается; главное partitions; commit offset при получении.',
        productionNote: 'Деплой в часы нагрузки без idempotency — классический источник дублей.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Rebalance', meaning: 'Перераспределение partitions в consumer group.' },
        { term: 'max.poll.interval.ms', meaning: 'Макс. время между poll до исключения consumer.' },
        { term: 'Cooperative rebalance', meaning: 'Постепенный revoke без полной остановки всех partitions.' },
      ],
      lecturerNotes: ['Сокращаемая тема при нехватке времени.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'int-prod-10',
      title: 'DLQ / poison messages',
      priority: 'core',
      simpleDefinitionOverride:
        'Сообщение, которое стабильно ломает consumer (bad payload, schema), нельзя retry бесконечно. После лимита — DLT/DLQ с payload и причиной; мониторинг и ручная переигровка.',
      quickAnswer:
        'Transient — retry с backoff. Permanent — после N попыток в DLQ с headers, error, correlation id. DLQ мониторится, не свалка.',
      explainBrief: [
        'Отличить transient (сеть, 503) от permanent (deserialization, unknown enum).',
        'Retry с backoff и max attempts.',
        'После лимита — Dead Letter Topic/Queue.',
        'Сохранить payload, headers, stacktrace, correlation id.',
        'Runbook: кто смотрит DLQ, как replay после фикса.',
      ],
      questionPlan: [
        { question: 'Бесконечный retry?', answerHint: 'Нет — блокирует partition, растёт lag.' },
        { question: 'Что в DLQ сообщении?', answerHint: 'Original + error + metadata для replay.' },
        { question: 'Как replay?', answerHint: 'После фикса схемы/кода — процедурно, с идемпотентностью.' },
      ],
      extraKeyPoints: [
        'Transient vs permanent; retry с лимитом.',
        'DLT с payload, headers, error, correlation id.',
        'DLQ мониторится и переигрывается.',
      ],
      interviewFocus: [
        {
          question: 'Как обрабатывать сообщение, которое стабильно ломает consumer?',
          expectedAnswer:
            'Classify error: SQLException timeout — retry; JsonMappingException — permanent. Spring Kafka ErrorHandler с backoff, затем DeadLetterPublishingRecoverer в .DLT топик. Алерт на rate в DLQ. Не catch Exception and log без действия. Replay только после root cause fix, с тем же idempotency. DLQ — очередь на разбор, с retention и доступом для поддержки.',
        },
      ],
      codeExample: {
        title: 'Retry → DLQ',
        language: 'text',
        snippet: `attempt 1..3: backoff 1s, 5s, 30s
permanent error / attempts exhausted:
  → publish to orders.DLT
  → alert: dlq_rate > threshold
  → runbook: fix schema → replay tool → idempotent consumer`,
        walkthrough: [
          'Слушать: лимит retry + DLQ + процесс, не «log and forget».',
        ],
        commonPitfall: 'catch Exception and log; retry бесконечно; DLQ — мусорка без мониторинга.',
        productionNote: 'Один poison message без DLQ может стопорить обработку partition часами.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'DLQ', meaning: 'Dead Letter Queue/Topic — для сообщений после исчерпания retry.' },
        { term: 'Poison message', meaning: 'Сообщение, которое всегда падает при обработке.' },
        { term: 'Backoff', meaning: 'Увеличивающаяся пауза между повторами.' },
      ],
      lecturerNotes: ['Можно объединить с int-prod-09 в один блок 35–45.'],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-11',
      title: 'Camunda orchestration',
      priority: 'core',
      simpleDefinitionOverride:
        'Long-running процесс с ожиданием внешних систем лучше в BPMN/Camunda: state, retries, history, timers, message correlation. Это process manager/saga, не REST-цепочка в одной HTTP-транзакции.',
      quickAnswer:
        'Процесс длится часы/дни, ждёт Kafka/REST. Camunda хранит состояние, BPMN показывает gateways/timers. REST-цепочка без движка теряет state при падении.',
      explainBrief: [
        'Процесс длится долго — HTTP transaction не подходит.',
        'Ожидание внешних систем и событий — message catch, timer.',
        'Camunda: state, retries, audit history, incidents.',
        'BPMN: явные gateways, parallel paths, compensation.',
        'Process manager / orchestration saga, не CRUD в payment.',
      ],
      questionPlan: [
        { question: 'Зачем Camunda, а не код if/else?', answerHint: 'Visibility, timers, persistence state, ops tooling.' },
        { question: 'Как ждать Kafka-событие?', answerHint: 'Message catch event + correlation by businessKey.' },
        { question: 'Где delegate?', answerHint: 'Вызов REST к payment; ошибки — BPMN error или retry.' },
      ],
      extraKeyPoints: [
        'Long-running; ожидание внешних событий.',
        'Camunda: state, retries, history; BPMN gateways/timers.',
        'Process manager/saga, не CRUD.',
      ],
      interviewFocus: [
        {
          question: 'Почему long-running процесс лучше вести через BPMN/Camunda, а не REST-цепочку?',
          expectedAnswer:
            'REST-цепочка синхронна: падение посередине — потеря контекста, сложно resume. Camunda персистит process instance, знает active activity, умеет timer «подождать 3 дня», correlate message PaymentCompleted. BPMN читается аналитиками и поддержкой. Retries и incidents — штатные механизмы. Это orchestration saga: core координирует, payment исполняет — см. int-prod-01.',
        },
      ],
      codeExample: {
        title: 'Long-running BPMN sketch',
        language: 'text',
        snippet: `Start → CreatePayment (delegate REST)
      → WaitPaymentEvent (message catch, correlationKey)
      → Gateway success/fail
      → NotifyCore (Kafka) → End

Timer boundary: escalation if no event 24h
State в Camunda DB — переживает рестарт core`,
        walkthrough: [
          'Слушать: state persistence, не «Camunda для аналитиков».',
          'Дожать: correlation businessKey с Kafka событием.',
        ],
        commonPitfall: 'Camunda только схема; всё в одной HTTP transaction; delegate глотает ошибку.',
        productionNote: 'Без orchestration engine длинные процессы разъезжаются в кастомных status-полях.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'BPMN', meaning: 'Нотация модели бизнес-процесса (шлюзы, события, задачи).' },
        { term: 'Delegate', meaning: 'Java-код, вызываемый из service task Camunda.' },
        { term: 'Message correlation', meaning: 'Связь входящего события с ждущим process instance.' },
      ],
      lecturerNotes: ['Must-ask в блоке 45–52 мин.'],
      estimatedMinutes: 4,
    }),
    topic({
      id: 'int-prod-12',
      title: 'External service failure in delegate',
      priority: 'core',
      simpleDefinitionOverride:
        'Transient 500 от внешнего сервиса в Camunda delegate не должен становиться success. Exception или BPMN error → retry с лимитом → incident/manual resolution. Логировать processInstanceId, businessKey.',
      quickAnswer:
        '500 transient → throw, Camunda retry с backoff. После лимита — incident. Не catch-and-continue. Логи с businessKey и externalRequestId.',
      explainBrief: [
        'Transient technical error ≠ business reject.',
        'Delegate бросает exception или mapped BPMN error.',
        'Retry с лимитом и backoff в job configuration.',
        'После исчерпания — incident, ops dashboard, manual retry/skip.',
        'Лог: processInstanceId, businessKey, externalRequestId, HTTP status.',
      ],
      questionPlan: [
        { question: '500 от payment — success шаг?', answerHint: 'Нет — retry или incident.' },
        { question: '400 business reject?', answerHint: 'BPMN error → ветка компенсации/отказ, не retry 500-style.' },
        { question: 'Как не потерять контекст?', answerHint: 'businessKey в логах и в payment idempotency key.' },
      ],
      extraKeyPoints: [
        'Transient error не → success; exception / BPMN error.',
        'Retry с лимитом; incident после исчерпания.',
        'Логировать processInstanceId, businessKey, externalRequestId.',
      ],
      interviewFocus: [
        {
          question: 'Внешний сервис вернул 500 при выполнении Camunda delegate. Что делать?',
          expectedAnswer:
            'Не ловить и не маркировать шаг успешным. Пробросить исключение — job retry с exponential backoff. Настроить max attempts; затем incident для ручного разбора. Отличить 400 «недостаточно средств» — бизнес-ветка без бесконечного retry. В логах: processInstanceId, businessKey, correlation id запроса к payment. При восстановлении payment — idempotent retry того же шага.',
        },
      ],
      codeExample: {
        title: 'Delegate error flow',
        language: 'text',
        snippet: `delegate call payment API → 500
  → throw BpmnError("PAYMENT_UNAVAILABLE") OR RuntimeException
  → Camunda job retry 1..5
  → still fail → INCIDENT (ops)
  → NOT: catch { /* continue */ }`,
        walkthrough: [
          'Слушать: различие technical vs business failure.',
          'Кейс int-prod-16 Case 3 — если нет прод-примера.',
        ],
        commonPitfall: 'catch и continue; retry без лимита; 500 = business error без ветвления.',
        productionNote: 'Проглоченный 500 — «зелёный» процесс без реального платежа.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Incident', meaning: 'Запись в Camunda о failed job, требующем вмешательства.' },
        { term: 'Transient error', meaning: 'Временный сбой — имеет смысл retry.' },
        { term: 'BpmnError', meaning: 'Бизнес-ошибка, маршрутизируемая в BPMN.' },
      ],
      lecturerNotes: ['Связать с int-prod-03 idempotency при retry delegate.'],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-13',
      title: 'PostgreSQL performance incident',
      priority: 'core',
      simpleDefinitionOverride:
        'После релиза выросли таймауты к PG — сначала pool, slow queries, locks, ресурсы DB, новые запросы/планы, N+1, длинные транзакции. Не «увеличить timeout» как первый шаг.',
      quickAnswer:
        'Чеклист: Hikari/PgBouncer exhausted → pg_stat_activity locks → slow query log → EXPLAIN новых запросов → N+1 в трейсе → длинные tx. Потом железо.',
      explainBrief: [
        'Hikari pool wait / PgBouncer queue — connections исчерпаны.',
        'slow queries, pg_stat_statements, APM DB span.',
        'locks/waits — блокирующие транзакции.',
        'CPU/IO на инстансе БД.',
        'Новые запросы релиза — EXPLAIN ANALYZE, missing index.',
        'N+1 и длинные транзакции держат connections.',
      ],
      questionPlan: [
        { question: 'Первый шаг при таймаутах?', answerHint: 'Метрики pool + active connections + locks, не сразу scale DB.' },
        { question: 'Как связать с релизом?', answerHint: 'Diff запросов, новые endpoint, Hibernate SQL count.' },
        { question: 'Когда индексы?', answerHint: 'После EXPLAIN, не «на всё подряд».' },
      ],
      extraKeyPoints: [
        'Hikari/PgBouncer; slow queries; locks/waits; CPU/IO.',
        'EXPLAIN новых запросов; N+1; длинные транзакции.',
      ],
      interviewFocus: [
        {
          question: 'После релиза выросли таймауты к PostgreSQL. Что проверять первым?',
          expectedAnswer:
            'Дашборд: pool pending threads, active connections, connection acquire time. pg_stat_activity — waiting on lock. Top slow queries за последний час vs baseline. Сравнить релиз: новые endpoint, join без индекса, OSIV/N+1. EXPLAIN ANALYZE подозрительного запроса. Длинные idle in transaction — убить или починить код. Увеличение statement_timeout — только после диагноза.',
        },
      ],
      codeExample: {
        title: 'Incident checklist PG',
        language: 'text',
        snippet: `1. metrics: hikari.connections.pending, pool usage
2. SELECT * FROM pg_stat_activity WHERE wait_event IS NOT NULL
3. slow query log / pg_stat_statements top 10
4. trace: HTTP → 200 SQL queries? → N+1
5. EXPLAIN ANALYZE <new query from release>
6. rollback feature flag if needed`,
        walkthrough: [
          'Слушать: системный подход, не «добавим индексы на всё».',
          'Case int-prod-16 #4 — практический якорь.',
        ],
        commonPitfall: 'Увеличить timeout; индексы на всё; Hibernate сам оптимизирует.',
        productionNote: 'Pool exhaustion маскируется как «БД медленная» — смотреть оба конца.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'HikariCP', meaning: 'Пул JDBC-соединений в Spring Boot.' },
        { term: 'pg_stat_activity', meaning: 'Системное представление активных сессий PostgreSQL.' },
        { term: 'EXPLAIN ANALYZE', meaning: 'План и фактическое время выполнения запроса.' },
      ],
      lecturerNotes: ['Блок 52–57 мин вместе с int-prod-14.'],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-14',
      title: 'Kubernetes graceful shutdown + Kafka',
      priority: 'core',
      simpleDefinitionOverride:
        'При SIGTERM pod снимается с readiness, Kafka listener останавливается, текущие сообщения дообрабатываются в grace period. Незакоммиченный offset → повтор; нужна idempotency и согласованный terminationGracePeriodSeconds.',
      quickAnswer:
        'Readiness off → stop poll → finish in-flight → commit offset. Grace period ≥ max processing time. Повтор сообщения нормален — idempotent handler.',
      explainBrief: [
        'SIGTERM → preStop / graceful shutdown hook.',
        'Readiness probe fail — трафик HTTP не идёт на pod.',
        'KafkaListenerContainer stop — не брать новые, завершить текущие.',
        'Offset не committed → redelivery после rebalance.',
        'terminationGracePeriodSeconds ≥ worst-case message processing.',
      ],
      questionPlan: [
        { question: 'Pod умер mid-processing — что с сообщением?', answerHint: 'Придёт снова; handler идемпотентен.' },
        { question: 'Commit в начале?', answerHint: 'Нет — потеря при crash после commit.' },
        { question: 'Как настроить Spring Boot?', answerHint: 'server.shutdown=graceful, kafka listener ack-mode, lifecycle timeout.' },
      ],
      extraKeyPoints: [
        'Readiness убирает из трафика; listener stop корректно.',
        'Grace period для current processing; offset не committed → повтор.',
        'Idempotency; terminationGracePeriodSeconds по времени обработки.',
      ],
      interviewFocus: [
        {
          question: 'Pod завершился во время обработки Kafka-сообщения. Что будет и как сделать безопасно?',
          expectedAnswer:
            'Kubernetes шлёт SIGTERM, начинается grace period. Нужно: снять readiness, остановить приём новых HTTP/Kafka, дождаться завершения текущего message processing, commit offset. Если pod убит до commit — at-least-once redelivery. Безопасность = идемпотентный consumer (int-prod-08). Настроить terminationGracePeriodSeconds больше p99 обработки. Антипаттерн: commit offset в начале обработки.',
        },
      ],
      codeExample: {
        title: 'Graceful shutdown sequence',
        language: 'text',
        snippet: `SIGTERM
→ readiness=false (no new HTTP)
→ KafkaListenerContainer.stop()
→ wait in-flight (max 30s)
→ commit offset + close consumer
→ exit before grace period ends

If killed early: msg redelivered → dedup by event_id`,
        walkthrough: [
          'Слушать: связка K8s + Kafka + idempotency.',
          'Case int-prod-16 #5.',
        ],
        commonPitfall: 'K8s сам всё завершит; повторов не будет; commit offset в начале.',
        productionNote: 'Rolling deploy без graceful Kafka — всплеск дублей и lag.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'SIGTERM', meaning: 'Сигнал Kubernetes на корректное завершение pod.' },
        { term: 'Readiness probe', meaning: 'Проверка готовности принимать трафик.' },
        { term: 'terminationGracePeriodSeconds', meaning: 'Время на завершение перед SIGKILL.' },
      ],
      lecturerNotes: ['Если нет K8s опыта — достаточно принципа + idempotency.'],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'int-prod-15',
      title: 'Observability',
      priority: 'core',
      simpleDefinitionOverride:
        'Для разбора инцидентов нужны метрики (latency, errors, lag, pool), логи с correlation id и бизнес-метрики (процессы Camunda, заявки по статусам). Не «достаточно логов».',
      quickAnswer:
        'HTTP/Feign latency&errors, Kafka lag/DLQ/rebalance, DB pool/slow queries, pod restarts. Бизнес: stuck BPM, SLA, статусы заявок. Везде correlation id, businessKey, processInstanceId.',
      explainBrief: [
        'HTTP/Feign: latency p95/p99, error rate по downstream.',
        'Kafka: consumer lag, rebalance rate, DLQ count.',
        'DB: pool active/pending, slow query count, lock wait.',
        'K8s: restarts, OOMKilled, probe failures.',
        'Business: active Camunda instances, stuck > N hours, заявки PENDING anomaly.',
        'Correlation id / businessKey / processInstanceId в каждом логе цепочки.',
      ],
      questionPlan: [
        { question: 'С чего начнёте разбор инцидента «заявки не двигаются»?', answerHint: 'Бизнес-метрика статусов → Camunda incidents → Kafka lag → payment errors.' },
        { question: 'Что в structured log?', answerHint: 'traceId, businessKey, eventId, outcome, duration.' },
        { question: 'Только логов достаточно?', answerHint: 'Нет — lag и pool видны в метриках раньше, чем в grep.' },
      ],
      extraKeyPoints: [
        'HTTP/Kafka/DB/K8s метрики + business metrics.',
        'Correlation id, business key, processInstanceId, external request id.',
      ],
      interviewFocus: [
        {
          question: 'Какие метрики и логи нужны для разбора инцидентов?',
          expectedAnswer:
            'Три столпа: metrics, logs, traces. RED для API; consumer lag и DLQ для Kafka; Hikari pending для DB. Алерты на SLO breach. Логи JSON с correlation id сквозь core→payment→Camunda. Бизнес-дашборд: count по status, age of oldest PENDING, Camunda incidents open. При инциденте: traceId из support ticket → цепочка span → конкретный downstream 500 или missing event.',
        },
      ],
      codeExample: {
        title: 'Incident observability map',
        language: 'text',
        snippet: `Symptom: заявки stuck in PENDING
1. dashboard: applications_by_status, oldest_pending_age
2. camunda: open incidents, failed jobs
3. kafka: lag on payment-events, DLQ rate
4. logs: traceId=abc → payment 500 at T
5. fix + verify metric recovery`,
        walkthrough: [
          'Слушать: business + tech метрики, не только «откроем логи».',
          'Финал 57–60: суммировать оценку по матрице int-prod-00.',
        ],
        commonPitfall: 'Достаточно логов; метрики только для SRE; смотреть руками в БД без trace.',
        productionNote: 'Без business metrics инцидент обнаруживают клиенты, не команда.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Correlation id', meaning: 'Сквозной id запроса/процесса в логах и трейсах.' },
        { term: 'Consumer lag', meaning: 'Отставание consumer от конца partition.' },
        { term: 'RED method', meaning: 'Rate, Errors, Duration — базовые метрики сервиса.' },
      ],
      lecturerNotes: ['Закрыть слот: сильные/слабые стороны кандидата по 0–3 матрице.'],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-16',
      title: 'Production cases — разбор инцидентов',
      priority: 'core',
      simpleDefinitionOverride:
        'Пять типовых прод-кейсов для проверки рассуждения: дубли Kafka, outbox rollback, stuck Camunda, PG timeouts, pod + Kafka. Использовать, если кандидат не приводит свой опыт.',
      quickAnswer:
        'Кейсы проверяют цепочку: симптом → гипотезы → метрики/логи → root cause → идемпотентность/outbox/graceful. Не заученный ответ — порядок мыслей.',
      explainBrief: [
        'Case 1: дубль Kafka — dedup, at-least-once, rebalance/deploy.',
        'Case 2: событие есть, записи в БД нет — dual-write без outbox.',
        'Case 3: Camunda job stuck — incident, 500 swallowed, retry exhausted.',
        'Case 4: PG timeouts после релиза — pool, N+1, new query.',
        'Case 5: pod died — redelivery, graceful shutdown, idempotency.',
      ],
      questionPlan: [
        { question: 'Какой кейс задать?', answerHint: 'По слабой зоне: Kafka → Case 1/2, Camunda → 3, DB → 4, K8s → 5.' },
        { question: 'Сколько времени?', answerHint: '3–5 мин на один кейс — ход рассуждений важнее деталей.' },
        { question: 'Критерий сильного ответа?', answerHint: 'Называет метрики, idempotency/outbox, не прыгает к «перезапустим». ' },
      ],
      extraKeyPoints: [
        'Каждый case: ситуация → проверки → хороший ход → ошибки кандидата → вывод ведущего.',
      ],
      interviewFocus: [
        {
          question: 'Case 1: Kafka duplicate processing — платёж применился дважды. С чего начнёте?',
          expectedAnswer:
            'Симптом: две записи или двойное списание. Гипотезы: at-least-once redelivery, rebalance, deploy без idempotency. Проверить: consumer logs same event_id дважды, offset commit timing, недавний deploy. Root cause: нет dedup table. Fix: unique event_id + идемпотентный handler. Ошибка кандидата: «Kafka не дублирует».',
        },
        {
          question: 'Case 2: Kafka event published, DB transaction rolled back.',
          expectedAnswer:
            'Симптом: consumer видит PaymentCompleted, в payment БД записи нет. Причина: send до commit или после rollback без outbox. Проверить: порядок операций в коде, outbox table empty. Fix: transactional outbox. Ошибка: «добавим @Transactional на весь метод с kafka send».',
        },
        {
          question: 'Case 3: Camunda job stuck after external service failure.',
          expectedAnswer:
            'Симптом: процесс на шаге CreatePayment, incident в ops. Payment лежал, delegate catch-and-continue или retry exhausted. Логи: 500 без throw. Fix: правильный error propagation, idempotent retry payment. Ошибка: пометить шаг success при 500.',
        },
        {
          question: 'Case 4: PostgreSQL timeouts after release.',
          expectedAnswer:
            'Симптом: spike timeouts с релиза. Pool exhausted + N+1 в новом endpoint. pg_stat_activity, EXPLAIN, trace SQL count. Fix: fetch join, индекс. Ошибка: сразу scale RDS без анализа.',
        },
        {
          question: 'Case 5: Pod died while processing Kafka message.',
          expectedAnswer:
            'Симптом: дубль после rolling update. SIGTERM, grace too short, offset not committed. Fix: graceful listener shutdown, idempotency, grace ≥ p99. Ошибка: «повторов не будет».',
        },
      ],
      codeExample: {
        title: 'Case cards (кратко)',
        language: 'text',
        snippet: `CASE 1 Duplicate Kafka
  check: event_id в логах 2x, deploy/rebalance time
  good: dedup table, idempotent handler
  bad: "Kafka exactly-once спасёт"
  вывод: at-least-once + dedup обязательны

CASE 2 Event without DB row
  check: код save→send, outbox empty
  good: transactional outbox
  bad: @Transactional на Kafka

CASE 3 Camunda stuck
  check: incidents, delegate logs 500 swallowed
  good: throw + retry + idempotent payment call
  bad: catch and continue

CASE 4 PG timeouts
  check: pool, pg_stat, EXPLAIN new query, N+1 trace
  good: fix query + index
  bad: только ↑ timeout

CASE 5 Pod + Kafka
  check: k8s events, grace period, offset commit time
  good: graceful shutdown + dedup
  bad: commit at start`,
        walkthrough: [
          'Не зачитывать кейс целиком — описать симптом, слушать рассуждение.',
          'Подсказка через вопрос: «какие метрики откроете первыми?»',
          'Сильный кандидат сам упомянет int-prod-07/08 без подсказки.',
        ],
        commonPitfall: 'Кандидат прыгает к решению без диагностики или не знает at-least-once/retry.',
        productionNote: 'Кейсы отделяют Middle с теорией от Senior с боевым опытом.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Root cause', meaning: 'Первопричина инцидента, а не симптом.' },
        { term: 'Redelivery', meaning: 'Повторная доставка Kafka-сообщения.' },
        { term: 'Rolling update', meaning: 'Поочерёдная замена pod при деплое.' },
      ],
      lecturerNotes: [
        'Case 1–2 — блок Kafka; 3 — Camunda; 4 — JPA/PG; 5 — K8s. Можно вставить вместо слабого ответа по теме.',
        'Вывод ведущего: зафиксировать 0–3 после кейса в заметках.',
      ],
      estimatedMinutes: 3,
    }),
  ],
};
