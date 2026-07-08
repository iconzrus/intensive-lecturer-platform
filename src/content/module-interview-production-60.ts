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
        'Это карта часового слота: куда идти по минутам, что обязательно спросить и что можно сжать, если кандидат уходит в детали или, наоборот, отвечает односложно.',
      quickAnswer:
        'Intro → архитектура → REST/контракт → БД/JPA → Kafka/outbox → Camunda → инциденты → observability → оценка; на каждом блоке — один must-ask и follow-up «как на проде».',
      explainBrief: [
        '1. 0–5 мин — что проверить: стек, роль, один реальный инцидент; вывод: есть ли прод-контекст или только теория.',
        '2. 5–15 мин — int-prod-01: границы core vs payment; вывод: понимает ли кандидат «кто владеет процессом, а кто деньгами».',
        '3. 15–25 мин — int-prod-02/03: контракт и REST-идемпотентность; вывод: contract-first и ключ повтора, не «POST всегда создаёт новое».',
        '4. 25–35 мин — int-prod-04/05/06: миграции, OSIV, proxy; вывод: validate + явная загрузка + граница транзакции.',
        '5. 35–45 мин — int-prod-07–10: outbox, dedup consumer; вывод: dual-write опасен, at-least-once нормален.',
        '6. 45–52 мин — int-prod-11/12: Camunda и delegate 500; вывод: transient error ≠ success.',
        '7. 52–57 мин — int-prod-13/14: PG timeout, graceful shutdown; вывод: диагностика, не «увеличим timeout».',
        '8. 57–60 мин — int-prod-15 + матрица 0–3; вывод: сильные/слабые зоны и рекомендация.',
      ],
      questionPlan: [
        {
          question: 'С чего начинаем слот?',
          answerHint:
            'Сильный старт: «расскажите о проекте — стек, ваша зона, один сложный инцидент» и 3 минуты слушать без перебивания. Follow-up: «что смотрели в метриках/логах первым?» Red flag: сразу уходит в определения технологий без своего кейса.',
        },
        {
          question: 'Куда переходим после intro?',
          answerHint:
            'Сильный ход: по таймингу int-prod-01, даже если кандидат сам упомянул Kafka. Follow-up: «как core узнаёт, что payment завершил шаг?» Red flag: пропустить REST/outbox ради одной любимой темы.',
        },
        {
          question: 'Когда сокращать?',
          answerHint:
            'Сильный ответ: сжать rebalance/DLQ до одного follow-up, если силён в int-prod-08; JPA — только OSIV + N+1. Follow-up: «что вы всё равно не выкинете?» Red flag: «успеем всё подробно» — час не хватит.',
        },
        {
          question: 'Что не выкидывать?',
          answerHint:
            'Сильный минимум: границы сервисов, идемпотентность REST + consumer, outbox, Camunda 500, correlation id. Follow-up: «назовите must-ask из вашего последнего собеса как ведущего». Red flag: «outbox знаю, consumer dedup не успели».',
        },
      ],
      extraKeyPoints: [
        'Must-ask закрывает десять production-рисков: от shared DB до observability при инциденте.',
        'Оценка 0–3 ставится сразу по теме: термин без опыта — 1, модель с кейсом — 3.',
        'Кейсы int-prod-16 подставляют, когда ответ звучит заученно, но без «что смотрели в Grafana».',
      ],
      interviewFocus: [
        {
          question: 'Как вести техпрогон, если кандидат уходит в детали?',
          expectedAnswer:
            'Сначала вернуть к вопросу: «как это было у вас на проде?»; если опыта нет — дать мини-кейс int-prod-16; если уходит в лекцию — «стоп, один шаг вашего runbook»; в конце — оценка по матрице, не по одной сильной теме.',
        },
      ],
      codeExample: {
        title: 'Ран-лист техпрогона (60 мин)',
        language: 'text',
        snippet: `Symptom: слот уходит в одну технологию или в теорию без кейсов

Step 1 (0–5): intro — стек, роль, инцидент
Step 2 (5–15): int-prod-01 core vs payment
Step 3 (15–25): int-prod-02/03 контракт + REST idempotency
Step 4 (25–35): int-prod-04/05/06 миграции, OSIV, @Transactional
Step 5 (35–45): int-prod-07–10 outbox, consumer dedup
Step 6 (45–52): int-prod-11/12 Camunda delegate
Step 7 (52–57): int-prod-13/14 PG + K8s/Kafka
Step 8 (57–60): int-prod-15 observability + оценка 0–3

Fix: отстаёте — сжать int-prod-09/10, не outbox и не Camunda
Red flags: лекция вместо вопросов; нет must-ask; оценка «понравился» без матрицы`,
        walkthrough: [
          'Открыть карточку до звонка — таймбоксы и must-ask на одном экране.',
          'Слушать: кандидат сам связывает темы (outbox → dedup) или отвечает изолированными определениями.',
          'Дожать: «приведите прод-пример» — отличить 2 (модель) от 3 (кейс + trade-off).',
          'Если отстаёте — сократить int-prod-09/10, не трогать outbox и Camunda.',
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
        { term: 'Техпрогон', meaning: 'Структурированное интервью по production-стеку: проверка опыта и рассуждения, не лекция.' },
        { term: 'Must-ask', meaning: 'Вопросы, без которых слот нельзя закрыть — ядро оценки Middle+/Senior.' },
        { term: 'Follow-up', meaning: 'Уточнение после ответа: «а что было на проде?», «что смотрели первым?»' },
        { term: 'Таймбокс', meaning: 'Фиксированный интервал минут на блок тем — чтобы успеть охватить стек за час.' },
        { term: 'Матрица 0–3', meaning: 'Шкала оценки по теме: от «не слышал» до «прод-кейс с trade-offs».' },
        { term: 'Production-мышление', meaning: 'Умение связать симптом, метрики, root cause и безопасный fix — не перечисление терминов.' },
      ],
      lecturerNotes: [
        'Если на 25-й минуте ещё архитектура — сжать follow-up, не пропускать блоки 25–45 (БД и Kafka).',
        'Кандидат отвечает расплывчато — один якорный вопрос: «опишите один инцидент по шагам».',
        'Хороший знак: сам называет trade-off; red flag: «мы так не делали, но теория такая» без альтернатив.',
        'Оценку 0–3 писать сразу в заметках — в конце усреднить, не полагаться на память.',
      ],
      estimatedMinutes: 0,
    }),
    topic({
      id: 'int-prod-01',
      title: 'Core orchestration vs Payment service',
      priority: 'core',
      simpleDefinitionOverride:
        'Core-оркестрация ведёт длинный бизнес-процесс: какие шаги, в каком порядке, что делать при сбое. Payment-сервис — единственный владелец данных о деньгах: заявки, транзакции, реестры. У каждого своя база и свой контракт наружу.',
      quickAnswer:
        'Сначала разделить «кто ведёт процесс» и «кто владеет деньгами»; затем интеграция только REST-команда + Kafka-событие; общая БД — стоп.',
      explainBrief: [
        '1. Что проверить: кто отвечает за порядок шагов saga — вывод: это core (Camunda/BPMN), не payment CRUD.',
        '2. Где system of record для заявок и транзакций — вывод: payment-сервис и его PostgreSQL, не таблицы соседа.',
        '3. Есть ли shared database между сервисами — вывод: нет; иначе слипаются релизы и границы.',
        '4. Как core даёт команду — вывод: REST POST «создай платёж» с idempotency key, не SELECT в чужую БД.',
        '5. Как core узнаёт результат — вывод: Kafka-событие PaymentCompleted, не polling чужих таблиц.',
        '6. Что если payment недоступен — вывод: процесс ждёт/retry/incident, не «успех без денег».',
      ],
      questionPlan: [
        {
          question: 'Кто за что отвечает?',
          answerHint:
            'Сильный ответ: core — процесс и координация шагов; payment — данные, статусы денег, правила проведения. Follow-up: «кто system of record для transaction_id?» Red flag: «оба сервиса пишут в одну схему».',
        },
        {
          question: 'Как общаются?',
          answerHint:
            'Сильный ответ: REST для команд (создать/отменить платёж), Kafka для фактов (платёж проведён/отклонён). Follow-up: «пример payload события и correlation key». Red flag: «через общую БД быстрее».',
        },
        {
          question: 'Где Camunda?',
          answerHint:
            'Сильный ответ: в core или orchestration-сервисе — state machine процесса, timers, message catch. Follow-up: «как correlate Kafka с process instance?» Red flag: Camunda в payment «для красоты схемы» без retry/incident.',
        },
      ],
      extraKeyPoints: [
        'Core координирует saga: какой шаг сейчас и что ждём от внешних систем.',
        'Payment — единственный авторитет по заявкам и транзакциям; core не читает его таблицы напрямую.',
        'REST-команда и Kafka-событие — два канала с разной семантикой: «сделай» vs «случилось».',
      ],
      interviewFocus: [
        {
          question: 'Как объяснить разделение ответственности между core-оркестрацией и payment-сервисом?',
          expectedAnswer:
            'Сначала: core ведёт процесс (шаги, ожидание, компенсация); payment владеет деньгами (CRUD, статусы). Затем: core → REST CreatePayment; payment → Kafka PaymentCompleted. Если shared DB — fix: своя БД + контракт. Если payment down — retry/incident, не success шага.',
        },
        {
          question: 'Follow-up: что если payment лежит, а процесс в Camunda уже запущен?',
          expectedAnswer:
            'Сначала delegate бросает transient error (500), не success. Затем Camunda retry с backoff. Если лимит — incident. При восстановлении — повтор шага с тем же idempotency key в payment.',
        },
      ],
      codeExample: {
        title: 'Границы core и payment',
        language: 'text',
        snippet: `Symptom: «core не знает, прошёл ли платёж» или dual-write между сервисами

Step 1: Core → POST /payments { amount, businessKey }
        Header: Idempotency-Key: proc-123-step-pay
Step 2: Payment сохраняет заявку в СВОЕЙ PostgreSQL
Step 3: Payment → Kafka topic payment-events
        { eventId, businessKey, status: COMPLETED }
Step 4: Core message catch по businessKey → следующий шаг BPMN

Fix: убрать SELECT из payment.transactions; добавить событие + correlation
Red flags: core SELECT * FROM payment.*; одна БД на оба сервиса; polling таблиц соседа`,
        walkthrough: [
          'Слушать: кандидат разделяет «процесс» и «данные денег», не смешивает в один монолит.',
          'Дожать: «как core узнает, что платёж прошёл?» — событие, не polling БД.',
          'Сильный vs заученный: называет REST + Kafka пример; слабый — только «микросервисы общаются по API».',
        ],
        commonPitfall: 'Общий доступ к БД payment или Camunda как «просто красивая схема» без state и retry.',
        productionNote: 'Нарушение границ — первый источник dual-write и неконтролируемых связей при релизах.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Core orchestration', meaning: 'Сервис, который ведёт бизнес-процесс: порядок шагов, ожидание, обработка сбоев.' },
        { term: 'Payment service', meaning: 'Сервис домена денег: заявки, транзакции, реестры — system of record по оплатам.' },
        { term: 'System of record', meaning: 'Единственный авторитетный источник данных по домену; остальные только через контракт.' },
        { term: 'Saga', meaning: 'Длинная операция из локальных шагов с компенсациями при сбоях между сервисами.' },
        { term: 'Orchestration', meaning: 'Центральный координатор явно ведёт процесс по шагам (Camunda, process manager).' },
        { term: 'Shared database', meaning: 'Антипаттерн: несколько сервисов пишут в одну схему — ломает независимые релизы.' },
      ],
      lecturerNotes: [
        'Ответ «микросервисы» без границ — спросить: «кто владеет transaction_id, кто processInstanceId?»',
        'Путает REST и событие — нарисовать: команда vs факт на доске одной стрелкой.',
        'Хороший знак: сам упоминает idempotency при retry delegate; red flag: «Camunda вызывает payment напрямую в БД».',
      ],
      estimatedMinutes: 8,
    }),
    topic({
      id: 'int-prod-02',
      title: 'REST / OpenAPI contract-first',
      priority: 'core',
      simpleDefinitionOverride:
        'Contract-first значит: сначала описываем API в OpenAPI (YAML в git), потом генерируем DTO и интерфейсы, потом пишем реализацию. Потребители и QA смотрят на спеку, а не угадывают по коду controller.',
      quickAnswer:
        'Спека в репозитории → PR review → codegen DTO/client → реализация в service → CI ловит breaking change → major только через /v2.',
      explainBrief: [
        '1. Где живёт контракт — вывод: openapi.yaml в git репозитория владельца сервиса, не «Swagger после деплоя».',
        '2. Кто меняет спеку — вывод: PR с diff; breaking change виден до merge, не после инцидента у mobile.',
        '3. Что даёт codegen — вывод: DTO, API interface, client stub — меньше расхождений полей между сервисами.',
        '4. Как добавить поле безопасно — вывод: optional, backward compatible; старые клиенты не ломаются.',
        '5. Когда нужен v2 — вывод: rename, смена типа, смена семантики — новый path /v2, deprecation v1.',
        '6. Где бизнес-логика — вывод: service/domain, controller тонкий; не в аннотациях OpenAPI.',
      ],
      questionPlan: [
        {
          question: 'Зачем contract-first?',
          answerHint:
            'Сильный ответ: один source of truth, review до кода, совместимость потребителей (mobile, партнёры). Follow-up: «как CI проверяет breaking change?» Red flag: «Swagger для красоты документации».',
        },
        {
          question: 'Как ломать контракт безопасно?',
          answerHint:
            'Сильный ответ: только через /v2 + период deprecation; optional поля — в v1. Follow-up: «что если переименовали поле без версии?» Red flag: «потребители сами поправятся после деплоя».',
        },
        {
          question: 'Где не должен жить бизнес?',
          answerHint:
            'Сильный ответ: validation и правила — в service; controller маршрутизирует и маппит DTO. Follow-up: «кто владеет openapi.yaml в вашей команде?» Red flag: вся логика в @RestController.',
        },
      ],
      extraKeyPoints: [
        'OpenAPI в git — изменения API видны в PR так же, как изменения кода.',
        'Codegen связывает producer и consumer одной спекой; расхождение полей ловится на сборке, не в prod.',
        'Breaking change без v2 — типичный источник интеграционных инцидентов после релиза.',
      ],
      interviewFocus: [
        {
          question: 'Почему contract-first OpenAPI полезен в микросервисном проекте?',
          expectedAnswer:
            'Сначала: много потребителей одного API. Затем: спека → PR → codegen → реализация. Если rename без v2 — mobile падает; fix: openapi-diff в CI + /v2. Optional поле — ok в v1; semantic change — только v2.',
        },
        {
          question: 'Follow-up: кто владеет openapi.yaml и как проверяете совместимость?',
          expectedAnswer:
            'Сначала: команда-владелец сервиса владеет YAML. Затем CI: openapi-diff, contract tests/Pact. Если красный пайплайн — не релизим; fix breaking до merge или через v2.',
        },
      ],
      codeExample: {
        title: 'Contract-first flow',
        language: 'text',
        snippet: `Symptom: consumer получил 400 «unknown field» после деплоя producer

Step 1: PR в repo payment-service — openapi.yaml
        add optional field statusReason
Step 2: CI codegen → PaymentDto, PaymentApi interface
Step 3: Реализация в PaymentService (не в controller)
Step 4: Consumer repo — та же спека → client stub
Step 5: Breaking (rename amount→sum)? → /v2/payments, v1 deprecated 6 мес

Fix: openapi-diff в CI; contract test перед релизом
Red flags: Swagger post-factum; DTO руками без спеки; breaking в v1`,
        walkthrough: [
          'Слушать: контракт до кода, путь YAML → codegen → service.',
          'Дожать: «где лежит спека и кто ревьюит PR?»',
          'Сильный: CI + v2; заученный: «OpenAPI это документация» без codegen.',
        ],
        commonPitfall: 'Swagger только для документации; менять DTO без версии; бизнес-логика в controller.',
        productionNote: 'Контрактные инциденты дороже багов внутри одного сервиса — ловить на CI.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'OpenAPI', meaning: 'Стандарт описания REST API (YAML/JSON); бывш. Swagger Specification.' },
        { term: 'Contract-first', meaning: 'Сначала спека API, потом код — спека является источником правды.' },
        { term: 'Codegen', meaning: 'Генерация DTO, server interface и client stub из openapi.yaml.' },
        { term: 'Backward compatibility', meaning: 'Новая версия API работает со старыми клиентами без изменений у них.' },
        { term: 'Breaking change', meaning: 'Изменение, ломающее клиентов: rename, тип, обязательность, семантика.' },
        { term: 'Deprecation', meaning: 'Объявленный срок, когда старая версия API (/v1) ещё поддерживается перед отключением.' },
      ],
      lecturerNotes: [
        'Слабый кандидат — достаточно «спека в git + генерация DTO»; не углубляться в openapi-generator flags.',
        'Путает Swagger UI и contract-first — уточнить: «откуда берётся PaymentDto, из кода или из YAML?»',
        'Red flag «code-first норм» — спросить про внешнего партнёра, который не деплоится вместе с вами.',
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-prod-03',
      title: 'REST idempotency',
      priority: 'core',
      simpleDefinitionOverride:
        'Идемпотентный API: повтор того же запроса не создаёт вторую заявку и возвращает тот же результат. HTTP PUT/DELETE идемпотентны по протоколу; POST для создания — только если вы сами dedup по ключу в БД.',
      quickAnswer:
        'Клиент шлёт Idempotency-Key → сервер unique constraint → первый раз создаёт → повтор с тем же ключом возвращает ту же запись; timeout клиента ≠ откат на сервере.',
      explainBrief: [
        '1. HTTP vs business — вывод: PUT повторяем по протоколу; POST «создай заявку» — идемпотентность только через ваш ключ в БД.',
        '2. Сценарий timeout — вывод: клиент не получил ответ, но сервер мог commit; retry с тем же ключом, не новым.',
        '3. Где хранить ключ — вывод: таблица idempotency_keys или UNIQUE(client_id, idempotency_key).',
        '4. Что возвращать при повторе — вывод: 200/201 с тем же id и статусом, не 409 и не второй id.',
        '5. Payload другой при том же ключе — вывод: 409 Conflict, не молча перезаписывать.',
        '6. Разбор в логах — вывод: correlation id связывает первую попытку и retry.',
      ],
      questionPlan: [
        {
          question: 'POST может быть идемпотентным?',
          answerHint:
            'Сильный ответ: да, с Idempotency-Key и unique constraint; протокол POST сам по себе не гарантирует. Follow-up: «что вернёт сервер на второй POST?» Red flag: «POST всегда создаёт новую сущность».',
        },
        {
          question: 'Что при timeout?',
          answerHint:
            'Сильный ответ: клиент retry с тем же ключом; сервер мог успеть commit — второй вызов отдаёт существующую запись. Follow-up: «как отличить «не создалось» от «создалось, ответ потерялся»?» Red flag: «timeout значит rollback на сервере».',
        },
        {
          question: 'Где хранить ключ?',
          answerHint:
            'Сильный ответ: БД payment, UNIQUE(client_id, idempotency_key) или отдельная таблица с TTL. Follow-up: «409 если payload другой?» Red flag: dedup только in-memory или только на клиенте.',
        },
      ],
      extraKeyPoints: [
        'Timeout на клиенте не отменяет commit на сервере — без ключа retry неизбежно даёт дубли.',
        'Unique constraint — последняя линия обороны, даже если два pod обработали параллельно.',
        'Correlation id в логах связывает первую попытку и retry для support и расследований.',
      ],
      interviewFocus: [
        {
          question: 'Что значит сделать API создания заявки идемпотентным?',
          expectedAnswer:
            'Сначала: клиент шлёт Idempotency-Key. Первый POST — INSERT + сохранить ключ. Повтор — SELECT по ключу → тот же id. Timeout → retry тем же ключом. Если payload другой при том же ключе → 409. Fix без ключа — дубли в prod.',
        },
        {
          question: 'Follow-up: TTL для ключей и что при смене payload с тем же ключом?',
          expectedAnswer:
            'Сначала: 409 Conflict при разном body. Затем TTL 30–90 дней чистит старые ключи. Метрика duplicate_rejected — алерт на аномалии.',
        },
      ],
      codeExample: {
        title: 'Идемпотентное создание заявки',
        language: 'text',
        snippet: `Symptom: две заявки на один платёж после «сетевого глюка»

Step 1: POST /applications
        Header: Idempotency-Key: uuid-123
        Body: { amount: 1000, clientId: "c1" }
Step 2: 1-й вызов → 201 { id: 42, status: NEW }
Step 3: Клиент timeout (ответ потерян; сервер уже commit)
Step 4: Retry POST, тот же Idempotency-Key: uuid-123
Step 5: 2-й вызов → 200 { id: 42, status: NEW }  // не id: 43

Fix: UNIQUE(client_id, idempotency_key); INSERT ON CONFLICT → return existing
Red flags: «retry с новым ключом»; dedup только на клиенте; POST «не бывает идемпотентным»`,
        walkthrough: [
          'Слушать: ключ + constraint, не «retry на клиенте достаточно».',
          'Дожать сценарий timeout после commit — главная production-ловушка.',
          'Сильный: 409 при другом payload; слабый: только «header Idempotency-Key» без БД.',
        ],
        commonPitfall: '«POST не может быть идемпотентным»; «дубли потом почистим»; только client retry без серверного dedup.',
        productionNote: 'Дубли заявок — прямой путь к финансовым и комплаенс-инцидентам.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Idempotency', meaning: 'Повтор операции не меняет итог сильнее одного успешного выполнения.' },
        { term: 'Idempotency-Key', meaning: 'Заголовок или поле клиента для безопасного повтора POST без дубля.' },
        { term: 'HTTP idempotency', meaning: 'PUT/DELETE повторяемы по спецификации HTTP; POST — нет, без вашей логики.' },
        { term: 'Business idempotency', meaning: 'Dedup на уровне домена: unique key в БД, не только семантика HTTP-метода.' },
        { term: 'Unique constraint', meaning: 'Ограничение БД, запрещающее вторую строку с тем же ключом — защита от race.' },
        { term: 'Correlation id', meaning: 'Сквозной id цепочки запросов в логах и трассировке для разбора timeout/retry.' },
      ],
      lecturerNotes: [
        'Связать с int-prod-01: кто генерит ключ — core при delegate или клиент напрямую.',
        'Путает HTTP PUT и POST — один пример timeout на POST обычно проясняет.',
        'Red flag «дубли редко» — спросить про финансовые/compliance последствия второй заявки.',
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'int-prod-04',
      title: 'Liquibase / Hibernate DDL',
      priority: 'core',
      simpleDefinitionOverride:
        'На production схему БД меняют только через versioned changesets в Liquibase или Flyway. Hibernate с ddl-auto=validate лишь проверяет, что entity совпадает со схемой — он не создаёт и не меняет таблицы сам.',
      quickAnswer:
        'Liquibase changeset в PR → CI review → migrate на staging/prod → deploy app с ddl-auto=validate; NOT NULL только после backfill.',
      explainBrief: [
        '1. Почему не ddl-auto:update — вывод: непредсказуемый ALTER без review, риск lock и потери данных на prod.',
        '2. Где живут миграции — вывод: changelog в git, audit «кто/когда/какой SQL», rollback-скрипты.',
        '3. Роль Hibernate — вывод: validate при старте; расхождение entity и БД → падение, не тихий ALTER.',
        '4. Безопасный NOT NULL — вывод: add nullable → backfill → set NOT NULL; иначе deploy упадёт на старых строках.',
        '5. CI checks — вывод: lint SQL, review DBA, прогон на staging, expand-contract для rename.',
        '6. Порядок релиза — вывод: backward-compatible migration → deploy кода → потом drop/rename старого.',
      ],
      questionPlan: [
        {
          question: 'Почему не ddl-auto:update?',
          answerHint:
            'Сильный ответ: Hibernate ALTER без согласования, нет истории, lock на больших таблицах, create-drop = потеря данных. Follow-up: «что делает validate?» Red flag: «на prod update норм, Liquibase для DBA».',
        },
        {
          question: 'Как выкатывать rename колонки?',
          answerHint:
            'Сильный ответ: expand-contract — add new column, dual write/read, backfill, switch code, drop old. Follow-up: «zero-downtime deploy?» Red flag: «RENAME COLUMN в пятницу вечером».',
        },
        {
          question: 'Кто ревьюит changeset?',
          answerHint:
            'Сильный ответ: разработчик + DBA при рисковом SQL; CI прогон на staging. Follow-up: «как откатите failed migration?» Red flag: «миграции вручную в psql без changelog».',
        },
      ],
      extraKeyPoints: [
        'ddl-auto update/create-drop на prod — антипаттерн: нет контроля и отката.',
        'NOT NULL на колонку без backfill ломает deploy на таблицах с историческими NULL.',
        'CI и staging ловят опасный SQL до попадания на production-кластер.',
      ],
      interviewFocus: [
        {
          question: 'Почему на production нельзя ddl-auto:update/create-drop?',
          expectedAnswer:
            'Сначала: update ALTER без review → lock/downtime. create-drop → потеря данных. Затем: Liquibase changelog + migrate отдельным шагом. validate ловит drift entity/БД. NOT NULL: add nullable → backfill → constraint. Fix: только versioned migrations.',
        },
      ],
      codeExample: {
        title: 'Безопасная миграция',
        language: 'text',
        snippet: `Symptom: deploy упал или prod lock после «простого add column»

Step 1: application.yml → ddl-auto: validate
Step 2: Liquibase 002-add-status-reason.xml — nullable column
Step 3: 003-backfill-status-reason.sql — UPDATE ... WHERE NULL
Step 4: 004-not-null-status-reason.xml — SET NOT NULL
Step 5: CI: review changeset + migrate staging
Step 6: prod: migrate → deploy app (код читает поле)

Fix: expand-contract; rollback script в changelog
Red flags: ddl-auto update; NOT NULL без backfill; миграция после deploy нового кода`,
        walkthrough: [
          'Слушать: validate + versioned migrations, не «Hibernate сам создаст».',
          'Дожать: zero-downtime — add column до кода, drop после.',
          'Сильный: backfill + CI; слабый: только «Liquibase лучше» без порядка шагов.',
        ],
        commonPitfall: 'Hibernate сам всё создаст; update на проде норм; Liquibase только для DBA.',
        productionNote: 'Плохая миграция — downtime и откат релиза всего кластера.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Liquibase', meaning: 'Инструмент versioned миграций: changelog, changeset, rollback в git.' },
        { term: 'Flyway', meaning: 'Альтернатива Liquibase — SQL-скрипты с версией в имени файла.' },
        { term: 'ddl-auto', meaning: 'Настройка Hibernate: create/update/validate/none — на prod только validate.' },
        { term: 'Changeset', meaning: 'Атомарная единица миграции с id и автором — воспроизводимое изменение схемы.' },
        { term: 'Backfill', meaning: 'Заполнение новой колонки данными для существующих строк перед NOT NULL.' },
        { term: 'Expand-contract', meaning: 'Паттерн: add → migrate data → switch code → drop old без downtime.' },
      ],
      lecturerNotes: [
        'Не углубляться в XML-синтаксис — достаточно процесса и порядка шагов.',
        'Путает validate и none — validate ловит drift, none молча игнорирует.',
        'Red flag «Hibernate update на staging ok» — staging ≠ prod объём и lock time.',
      ],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-05',
      title: 'JPA / OSIV / N+1',
      priority: 'core',
      simpleDefinitionOverride:
        'OSIV (Open Session In View) держит JPA-сессию открытой до конца HTTP-ответа — controller может «случайно» догрузить lazy. При spring.jpa.open-in-view=false lazy нужно грузить явно внутри @Transactional service, иначе LazyInitializationException или скрытый N+1.',
      quickAnswer:
        'OSIV off → загрузка в service tx: JOIN FETCH / @EntityGraph / DTO query → controller только DTO; N+1 ищем в SQL log и APM; EAGER везде — не fix.',
      explainBrief: [
        '1. Что ломается при OSIV=false — вывод: доступ к lazy вне tx → LazyInitializationException или перенос N+1 в JSON-сериализацию.',
        '2. Где грузить — вывод: public @Transactional метод service, пока persistence context открыт.',
        '3. JOIN FETCH vs EntityGraph vs DTO — вывод: fetch join в JPQL для конкретного query; EntityGraph на findById; DTO projection — без entity наружу.',
        '4. Почему EAGER плох — вывод: тянет лишние join всегда, cartesian product, хуже чем точечный fetch на use-case.',
        '5. N+1 на prod — вывод: APM/trace — 1 HTTP + сотни одинаковых SELECT; p6spy, Hibernate statistics.',
        '6. OSIV off плюс — вывод: connection возвращается в pool раньше, не висит на весь HTTP.',
      ],
      questionPlan: [
        {
          question: 'Где грузить lazy collection?',
          answerHint:
            'Сильный ответ: в @Transactional service — JOIN FETCH, @EntityGraph или DTO query; controller не трогает entity. Follow-up: «чем EntityGraph от fetch join?» Red flag: «вернём OSIV=true».',
        },
        {
          question: 'Почему OSIV off?',
          answerHint:
            'Сильный ответ: явные границы загрузки, connection не до конца response, меньше скрытого N+1. Follow-up: «что увидите в pool metrics?» Red flag: «OSIV off ломает всё — включим обратно» без альтернативы.',
        },
        {
          question: 'Как нашли N+1 на проде?',
          answerHint:
            'Сильный ответ: trace HTTP → spike SQL count; pg_stat_statements; один SELECT в цикле. Follow-up: «почему не EAGER?» Red flag: «N+1 не страшно на наших объёмах».',
        },
      ],
      extraKeyPoints: [
        'Граница транзакции service = граница загрузки данных для HTTP-ответа.',
        'N+1 часто появляется после «безобидного» релиза с новым lazy-access в mapper или JSON.',
        'EAGER на всех связях маскирует проблему и создаёт новые — over-fetch и cartesian product.',
      ],
      interviewFocus: [
        {
          question: 'Если open-in-view=false, где и как загружать lazy-связи?',
          expectedAnswer:
            'Сначала: @Transactional service method. Затем: JOIN FETCH или @EntityGraph на нужные связи, либо DTO projection query. Controller — только DTO. N+1 в trace → fix fetch на use-case. Если EAGER везде — fix: убрать, точечный fetch. OSIV on — red flag под нагрузкой.',
        },
      ],
      codeExample: {
        title: 'Загрузка без OSIV',
        language: 'text',
        snippet: `Symptom: LazyInitializationException или 200+ SQL на один GET

Step 1: spring.jpa.open-in-view=false
Step 2: @Transactional(readOnly=true) ApplicationDto get(id)
Step 3a: repo — SELECT a FROM App a JOIN FETCH a.items WHERE a.id=:id
   OR 3b: @EntityGraph(attributePaths={"items"}) findById
   OR 3c: SELECT new AppDto(...) — projection без entity
Step 4: controller return dto — entity не уходит наружу
Step 5: APM — SQL count per request ≈ 1–3, not 200

Fix: fetch на use-case; не EAGER globally
Red flags: OSIV=true «проще»; EAGER OneToMany; N+1 «потом оптимизируем»`,
        walkthrough: [
          'Слушать: граница tx = граница загрузки, не магия OSIV.',
          'Дожать: fetch join vs EntityGraph vs DTO — когда что.',
          'Сильный: нашёл N+1 в APM; слабый: знает OSIV, но не naming fix.',
        ],
        commonPitfall: 'Включить OSIV обратно; EAGER везде; «N+1 не страшно».',
        productionNote: 'N+1 под нагрузкой — типичная причина PG timeouts после «безобидного» релиза.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'OSIV', meaning: 'Open Session In View — Hibernate session открыта на весь HTTP-запрос до рендера ответа.' },
        { term: 'Lazy loading', meaning: 'Связь грузится при первом обращении — только пока session открыта.' },
        { term: 'N+1', meaning: 'Один запрос за N родителей + N запросов за детьми — классическая JPA-ловушка.' },
        { term: 'Fetch join', meaning: 'JOIN FETCH в JPQL — связи в одном SQL для конкретного query.' },
        { term: 'EntityGraph', meaning: 'Декларация, какие связи подгрузить при find — альтернатива fetch join в repository.' },
        { term: 'DTO projection', meaning: 'Query сразу в DTO — entity и lazy не попадают в web-слой.' },
      ],
      lecturerNotes: [
        'Связать с int-prod-13 — N+1 как причина PG timeouts после релиза.',
        'Путает OSIV и transaction — нарисовать timeline: tx закрылась → lazy fail.',
        'Red flag «@Transactional на controller» — session не там, где думают.',
      ],
      estimatedMinutes: 4,
    }),
    topic({
      id: 'int-prod-06',
      title: 'Spring transactions / proxy / self-invocation',
      priority: 'core',
      simpleDefinitionOverride:
        'Spring оборачивает bean в proxy (JDK или CGLIB) и перехватывает вызовы снаружи — тогда @Transactional открывает транзакцию. Вызов this.internal() внутри того же класса идёт мимо proxy, и аннотация не срабатывает.',
      quickAnswer:
        'Proxy срабатывает только на внешний вызов public-метода bean → REQUIRED — одна tx; REQUIRES_NEW — отдельный commit; rollback-only + after-commit event для Kafka.',
      explainBrief: [
        '1. Proxy «на пальцах» — вывод: controller → proxy → ваш Service → tx begin/commit; this.b() — без proxy.',
        '2. Self-invocation — вывод: @Transactional на private или this.method() — tx не стартует.',
        '3. REQUIRED vs REQUIRES_NEW — вывод: REQUIRED вложен в outer; REQUIRES_NEW suspend outer, свой commit/rollback.',
        '4. Rollback-only — вывод: setRollbackOnly() помечает tx на откат без throw; outer может поймать и продолжить.',
        '5. After-commit event — вывод: kafkaTemplate.send после commit через @TransactionalEventListener(AFTER_COMMIT), не в той же tx с save (лучше outbox).',
        '6. Fix self-invocation — вывод: отдельный bean, self-injection или TransactionTemplate.',
      ],
      questionPlan: [
        {
          question: 'Почему @Transactional не сработал?',
          answerHint:
            'Сильный ответ: self-invocation через this, private/final метод, класс не Spring bean, вызов не через proxy. Follow-up: «как увидите в логах?» Red flag: «аннотация всегда работает».',
        },
        {
          question: 'Как починить self-invocation?',
          answerHint:
            'Сильный ответ: вынести в отдельный @Service bean или inject self (осторожно с циклами). Follow-up: «почему не @Transactional на controller?» Red flag: «static helper с @Transactional».',
        },
        {
          question: 'Когда REQUIRES_NEW?',
          answerHint:
            'Сильный ответ: audit/error log должен сохраниться при rollback основной tx; outbox publish иногда. Follow-up: «чем отличается от REQUIRED?» Red flag: «REQUIRES_NEW на всё — partial commit везде».',
        },
      ],
      extraKeyPoints: [
        'Транзакция живёт на границе use-case: public метод Spring bean, вызванный извне.',
        'REQUIRES_NEW создаёт независимый commit — audit переживёт rollback бизнес-операции, но ломает атомарность при злоупотреблении.',
        'Kafka send в той же @Transactional tx с JDBC не атомарен — after-commit или outbox (int-prod-07).',
      ],
      interviewFocus: [
        {
          question: 'Какие проблемы могут быть с @Transactional из-за proxy/self-invocation?',
          expectedAnswer:
            'Сначала: this.b() — без proxy, tx не открылась → partial commit или LazyInitializationException. Fix: отдельный bean. REQUIRED — default outer tx. REQUIRES_NEW — audit commit при rollback outer. Kafka: AFTER_COMMIT listener или outbox, не send в tx с save.',
        },
      ],
      codeExample: {
        title: 'Proxy vs self-invocation',
        language: 'text',
        snippet: `Symptom: «данные сохранились, но tx должна была откатиться»

Step 1: controller → PaymentServiceProxy.useCase()
Step 2: proxy opens REQUIRED tx → repo.save()
Step 3: BAD: this.sendEvent() — self-invocation, no proxy, no tx
Step 4: GOOD: auditService.log() — другой bean, REQUIRES_NEW → commit даже при rollback outer
Step 5: Kafka: @TransactionalEventListener(AFTER_COMMIT) или outbox table

Fix: @Transactional на public method, вызов снаружи; не this.internal()
Red flags: @Transactional на private; REQUIRES_NEW везде; kafka send в той же tx «и так сработает»`,
        walkthrough: [
          'Слушать: понимание proxy, не магия аннотации.',
          'Дожать: REQUIRED vs REQUIRES_NEW на примере audit.',
          'Сильный: after-commit/outbox; слабый: только «this. не работает» без fix.',
        ],
        commonPitfall: '@Transactional всегда работает; на private можно; REQUIRES_NEW решает всё.',
        productionNote: 'Тихие partial commit — один из самых неприятных классов прод-багов.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Proxy', meaning: 'Обёртка Spring вокруг bean: перехват @Transactional, security, caching через AOP.' },
        { term: 'Self-invocation', meaning: 'Вызов метода того же объекта через this — минует proxy, AOP не работает.' },
        { term: 'REQUIRED', meaning: 'Propagation по умолчанию: присоединиться к outer tx или создать новую, если нет.' },
        { term: 'REQUIRES_NEW', meaning: 'Всегда новая tx, outer suspend — независимый commit/rollback.' },
        { term: 'Rollback-only', meaning: 'Пометить tx на откат без exception — outer может обработать и завершить иначе.' },
        { term: 'After-commit', meaning: 'Слушатель события после успешного commit JDBC — безопаснее прямого Kafka send в tx.' },
      ],
      lecturerNotes: [
        'Короткий слот — один вопрос про self-invocation достаточно.',
        'Путает REQUIRES_NEW и async — REQUIRES_NEW всё ещё синхронный JDBC commit.',
        'Red flag «@Transactional на весь класс» — не все методы должны быть в tx.',
      ],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-07',
      title: 'DB + Kafka consistency / outbox',
      priority: 'core',
      simpleDefinitionOverride:
        'save() в PostgreSQL и kafkaTemplate.send() — две независимые записи: между commit JDBC и send нет атомарности. Outbox кладёт событие в таблицу в той же DB-транзакции; отдельный poller публикует в Kafka позже.',
      quickAnswer:
        'Одна tx: INSERT business + INSERT outbox → commit → poller SELECT unpublished → kafka.send → UPDATE published_at; consumer всё равно idempotent.',
      explainBrief: [
        '1. Dual-write — вывод: commit БД + падение send = потеря события; send до rollback = ложное событие.',
        '2. Outbox table — вывод: id, aggregate_id, event_type, payload, created_at, published_at NULL.',
        '3. Sequence — вывод: @Transactional save payment + save outbox row → commit → poller → Kafka.',
        '4. Poller — вывод: SELECT WHERE published_at IS NULL FOR UPDATE SKIP LOCKED; retry; mark published.',
        '5. Stuck rows — вывод: published_at NULL долго → alert, dead letter row, ручной replay после fix Kafka.',
        '6. Consumer — вывод: poller at-least-once → дубли возможны → dedup по event_id (int-prod-08).',
      ],
      questionPlan: [
        {
          question: 'Почему не send после save?',
          answerHint:
            'Сильный ответ: PG и Kafka — разные системы, @Transactional не объединяет их. Follow-up: «crash после commit, до send?» Red flag: «Kafka send в той же @Transactional — сработает».',
        },
        {
          question: 'Как работает outbox?',
          answerHint:
            'Сильный ответ: outbox row в той же tx; poller читает unpublished, шлёт, ставит published_at. Follow-up: «что в payload колонке?» Red flag: «outbox = просто очередь в памяти».',
        },
        {
          question: 'Exactly-once достаточно?',
          answerHint:
            'Сильный ответ: нет для бизнес-дублей — broker EOS ≠ идемпотентный handler. Follow-up: «poller отправил дважды — что consumer?» Red flag: «exactly-once Kafka решит всё».',
        },
      ],
      extraKeyPoints: [
        'Outbox убирает dual-write между БД и Kafka — единственный atomic commit на стороне PostgreSQL.',
        'Stuck unpublished rows — operational signal: Kafka down, poller bug, или serialization error.',
        'End-to-end at-least-once: poller retry + consumer dedup — нормальная production-модель.',
      ],
      interviewFocus: [
        {
          question: 'Почему нельзя просто save() в БД и потом kafkaTemplate.send()?',
          expectedAnswer:
            'Сначала: crash после JDBC commit → событие потеряно. Send до rollback → ghost event. Fix: outbox INSERT в той же tx. Poller → Kafka → UPDATE published_at. Stuck rows → alert/replay. Consumer dedup по event_id.',
        },
      ],
      codeExample: {
        title: 'Outbox flow',
        language: 'text',
        snippet: `Symptom: PaymentCompleted в Kafka, но записи в payment БД нет (или наоборот)

Sequence:
  [App @Transactional]
    INSERT payment (...)
    INSERT outbox (id, type, payload, published_at=NULL)
    COMMIT
  [OutboxPoller every 1s]
    SELECT * FROM outbox WHERE published_at IS NULL LIMIT 100
    kafka.send(topic, payload)
    UPDATE outbox SET published_at=now() WHERE id=...

Step: stuck row > 5 min unpublished → alert + manual replay
Fix: outbox; не save()+send() в одном методе без outbox
Red flags: @Transactional «покроет Kafka»; exactly-once без consumer dedup`,
        walkthrough: [
          'Слушать: одна tx для business + outbox, не «Kafka почти не падает».',
          'Дожать: содержимое outbox table и stuck rows monitoring.',
          'Сильный: sequence + consumer idempotent; слабый: только «outbox pattern» без poller.',
        ],
        commonPitfall: 'Kafka send почти не падает; @Transactional на Kafka+БД; exactly-once без бизнес-dedup.',
        productionNote: 'Потерянное PaymentCompleted — застрявший процесс в Camunda и ручные разборы.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Outbox', meaning: 'Таблица исходящих событий в той же БД — atomic с business-данными.' },
        { term: 'Dual-write', meaning: 'Запись в PG и Kafka отдельно — риск рассинхрона при сбое между ними.' },
        { term: 'Outbox poller', meaning: 'Фоновый процесс: читает unpublished rows, публикует в Kafka, помечает sent.' },
        { term: 'Published_at', meaning: 'Метка времени отправки — NULL значит row ещё ждёт poller.' },
        { term: 'At-least-once', meaning: 'Сообщение доставлено минимум раз; poller retry даёт дубли в Kafka.' },
        { term: 'Transactional outbox', meaning: 'Паттерн: event row commit вместе с business row, publish асинхронно.' },
      ],
      lecturerNotes: [
        'Must-ask тема — не пропускать даже при нехватке времени.',
        'Путает outbox и CDC (Debezium) — оба ok, но poller проще для собеса.',
        'Red flag «мы шлём в Kafka синхронно после save» — Case 2 из int-prod-16.',
      ],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-08',
      title: 'Kafka consumer idempotency',
      priority: 'core',
      simpleDefinitionOverride:
        'Kafka даёт at-least-once: rebalance, redeploy или crash до commit offset — сообщение придёт снова. Handler должен безопасно обработать повтор: dedup в БД в той же транзакции, что side effect, не Set в памяти.',
      quickAnswer:
        'BEGIN → IF event_id in processed_events → COMMIT skip → ELSE business logic + INSERT processed_events → COMMIT → commit offset; offset не committed = redelivery.',
      explainBrief: [
        '1. Почему повтор нормален — вывод: at-least-once, rebalance, pod kill до commit offset.',
        '2. processed_events в той же tx — вывод: side effect + INSERT processed_events → один COMMIT.',
        '3. Offset не committed — вывод: msg@100 обработан, commit offset не успели → consumer-2 читает 100 снова.',
        '4. Unique constraint — вывод: UNIQUE(event_id) или UPDATE ... WHERE status=EXPECTED ловит race двух pod.',
        '5. Дубль = success — вывод: exit ok, commit offset; иначе poison retry loop.',
        '6. In-memory Set — вывод: теряется при рестарте → дубль side effect после deploy.',
      ],
      questionPlan: [
        {
          question: 'Сообщение пришло дважды — что делает handler?',
          answerHint:
            'Сильный ответ: tx → check processed_events → skip или apply once → commit → commit offset. Follow-up: «commit offset до или после tx?» Red flag: «Kafka не дублирует».',
        },
        {
          question: 'Где хранить processed?',
          answerHint:
            'Сильный ответ: таблица processed_events в той же БД и tx, что бизнес-update. Follow-up: «UNIQUE(event_id)?» Red flag: ConcurrentHashMap на pod.',
        },
        {
          question: 'Commit до или после обработки?',
          answerHint:
            'Сильный ответ: offset после успешной tx; до tx — потеря при crash после commit offset. Follow-up: «rebalance mid-processing?» Red flag: auto-commit в начале poll.',
        },
      ],
      extraKeyPoints: [
        'processed_events и бизнес-изменение в одной транзакции — атомарность dedup и side effect.',
        'Сценарий offset not committed — главный источник «легитимного» дубля после deploy/rebalance.',
        'UNIQUE(event_id) на processed_events — страховка при параллельной обработке двумя threads.',
      ],
      interviewFocus: [
        {
          question: 'Consumer получил одно сообщение два раза. Что должно произойти?',
          expectedAnswer:
            'Сначала BEGIN. IF EXISTS processed_events(event_id) → COMMIT, return ok. ELSE UPDATE business WHERE status expected + INSERT processed_events. COMMIT. THEN commitOffset. Offset не committed → redelivery — ok если dedup. Fix: не in-memory Set.',
        },
      ],
      codeExample: {
        title: 'Идемпотентный consumer',
        language: 'text',
        snippet: `Symptom: двойное списание после rolling deploy или rebalance

Scenario: consumer-1 обработал offset 100, offset NOT committed
          rebalance → consumer-2 читает с 99 → msg 100 снова

Step 1: BEGIN
Step 2: SELECT 1 FROM processed_events WHERE event_id = :evtId
        → found → COMMIT; return (no side effect)
Step 3: UPDATE application SET status='PAID'
        WHERE id=:appId AND status='PENDING'
Step 4: INSERT INTO processed_events (event_id, processed_at)
        — UNIQUE(event_id) ловит race
Step 5: COMMIT
Step 6: commitOffset()

Fix: dedup table; offset after tx
Red flags: Set<String> in memory; «exactly-once producer enough»`,
        walkthrough: [
          'Слушать: dedup в БД, не «Kafka не дублирует».',
          'Дожать: offset not committed scenario — связь с int-prod-09/14.',
          'Сильный: same tx processed_events; слабый: «проверим id» без tx/constraint.',
        ],
        commonPitfall: 'Kafka не присылает дубли; Set в памяти; игнорировать без проверки состояния.',
        productionNote: 'Без idempotency любой rebalance или redeploy — риск двойного списания.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'At-least-once', meaning: 'Доставка минимум один раз — дубли ожидаемы, не баг брокера.' },
        { term: 'Offset commit', meaning: 'Фиксация позиции consumer в partition — после успешной обработки.' },
        { term: 'processed_events', meaning: 'Таблица уже обработанных event_id — dedup в той же tx, что side effect.' },
        { term: 'Dedup', meaning: 'Дедупликация — повторное сообщение не меняет состояние второй раз.' },
        { term: 'Redelivery', meaning: 'Повторная доставка из-за uncommitted offset, rebalance или crash.' },
        { term: 'Poison loop', meaning: 'Бесконечный retry на «уже обработано», если handler бросает error на дубле.' },
      ],
      lecturerNotes: [
        'Кейс int-prod-16 Case 1 — если ответ слабый.',
        'Связать с int-prod-07 — outbox poller тоже может слать дважды.',
        'Red flag «enable idempotent producer» — это про broker, не про бизнес-handler.',
      ],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'int-prod-09',
      title: 'Kafka rebalance',
      priority: 'core',
      simpleDefinitionOverride:
        'Consumer group — несколько инстансов, которые делят partitions топика. Rebalance — момент, когда координатор отзывает (revoke) partitions у одних и назначает (assign) другим. Пока это идёт, обработка стоит или частично паузится; всё, что обработали без commit offset, придёт снова.',
      quickAnswer:
        '1) Группа = N consumers на M partitions (не больше consumers, чем partitions). 2) Rebalance при join/leave/timeout/max.poll.interval. 3) Revoke → pause → assign → resume. 4) Незакоммиченные offsets = дубли → idempotency обязательна. 5) Тюнинг: max.poll.interval.ms, cooperative-sticky, onPartitionsRevoked.',
      explainBrief: [
        '1. Что: consumer group координирует, кто читает какую partition; rebalance перераспределяет ownership.',
        '2. Где: __consumer_offsets, group coordinator, Spring Kafka listener container, метрики rebalance rate.',
        '3. Триггеры: новый pod, падение consumer, session.timeout.ms, превышение max.poll.interval.ms (долгая обработка между poll).',
        '4. Revoke/assign: classic — stop-the-world, все partitions снимаются; cooperative — revoke только части, меньше пауза.',
        '5. Дубли: msg обработан, offset не закоммичен → partition ушла другому → читает с last committed → повтор.',
        '6. max.poll.interval.ms: если между poll() прошло больше лимита — consumer «мертв», новый rebalance, lag растёт.',
        '7. Вывод: rebalance — норма at-least-once; без dedup в handler любой deploy = риск двойного side effect.',
      ],
      questionPlan: [
        {
          question: 'Нарисуйте словами consumer group и partitions.',
          answerHint: 'Топик payment-events: 6 partitions, 3 pod → каждый ~2 partitions; 7-й consumer простаивает.',
        },
        {
          question: 'Что такое revoke и assign?',
          answerHint: 'Revoke — «отдай partitions обратно группе»; assign — «вот твои новые partitions, читай с committed offset».',
        },
        {
          question: 'Почему после деплоя дубли?',
          answerHint: 'Pod ушёл mid-processing, offset не commit → новый consumer переиграл с last committed.',
        },
        {
          question: 'max.poll.interval.ms — когда срабатывает?',
          answerHint: 'Обработка одного batch дольше интервала между poll — consumer исключат, rebalance, lag.',
        },
        {
          question: 'Production-вопрос: что настроите перед rolling deploy?',
          answerHint: 'Idempotent handler, commit after tx, graceful stop listener, cooperative assignor, алерт на rebalance spike.',
        },
      ],
      extraKeyPoints: [
        'Partitions > consumers — лишние consumers idle; consumers > partitions — лишние не получат work.',
        'onPartitionsRevoked: завершить текущие задачи, не начинать новые, потом commit — меньше «висящих» offsets.',
        'Static group.instance.id снижает churn rebalance при рестарте того же pod.',
        'Cooperative rebalance не отменяет дубли — только уменьшает stop-the-world.',
      ],
      interviewFocus: [
        {
          question: 'Что происходит при rebalance consumer group и чем это опасно на production?',
          expectedAnswer:
            'Group coordinator видит изменение состава (новый consumer, падение, timeout). Запускается rebalance protocol: сначала revoke — consumers возвращают partitions, обработка паузится (classic — все partitions сразу). Затем assign — partitions перераспределяются. Consumer, получивший partition, читает с последнего committed offset. Сообщения, которые предыдущий consumer уже обработал, но offset не закоммитил, придут снова — это главная опасность: двойной платёж, двойное изменение статуса. Параллельно растёт consumer lag и возможен каскад, если max.poll.interval.ms слишком мал для тяжёлой обработки — consumer исключают, rebalance повторяется. Митигация: идемпотентный handler (int-prod-08), commit offset только после успешной DB-транзакции, onPartitionsRevoked с drain in-flight, cooperative-sticky assignor, увеличить max.poll.interval или ускорить batch/вынести тяжёлое в async с pause consumer.',
        },
        {
          question: 'Follow-up: rolling deploy в 14:00 — что увидите в метриках и логах?',
          expectedAnswer:
            'Spike rebalance rate, краткий рост consumer lag, в логах — partition revoked/assigned, возможно duplicate event_id у одного businessKey. Если dedup есть — метрика duplicate_skipped растёт, бизнес-данные чистые. Без dedup — support ticket про дубль. Правильный ответ включает graceful shutdown (int-prod-14), не только «rebalance неизбежен».',
        },
      ],
      codeExample: {
        title: 'Rebalance: revoke → assign → duplicate',
        language: 'text',
        snippet: `Symptom: после deploy два списания по одной заявке

Diagram (text):
  Topic payment-events [P0|P1|P2|P3]
  Group payment-consumers:
    pod-A: P0,P1          pod-B: P2,P3
  deploy pod-A leaves → rebalance
    revoke P0,P1 from A
    assign P0 → pod-B, P1 → pod-C (new)

Steps:
  1. pod-A обрабатывает P0 offset=100, side effect OK, offset NOT committed
  2. SIGTERM → pod-A leaves group → rebalance
  3. pod-B получает P0, last committed=99 → снова читает offset 100
  4. без dedup → второй side effect

Fix:
  - idempotent handler (event_id UNIQUE)
  - commit offset AFTER successful tx
  - onPartitionsRevoked: finish in-flight, then commit
  - max.poll.interval.ms > worst-case batch processing
  - cooperative-sticky assignor + graceful listener stop

Red flags:
  - «rebalance нас не касается»
  - commit offset сразу после poll
  - «Kafka exactly-once решит дубли бизнес-логики»`,
        walkthrough: [
          'Попросить нарисовать словами: 4 partitions, 2 consumers, что после ухода одного.',
          'Дожать revoke/assign: «когда именно придёт дубль?» — между side effect и commit.',
          'Production hook: связать с deploy window и метрикой rebalance — сильный кандидат сам упомянет.',
        ],
        commonPitfall: 'Rebalance — абстракция «инфраструктура»; commit at poll; partitions «главнее» idempotency.',
        productionNote: 'Деплой без dedup в часы пик — один из самых частых источников финансовых дублей.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Consumer group', meaning: 'Набор consumers с общим group.id; каждая partition читается одним consumer группы.' },
        { term: 'Partition', meaning: 'Упорядоченный лог внутри топика; unit параллелизма и ordering.' },
        { term: 'Revoke', meaning: 'Фаза rebalance: consumer отдаёт partitions до переназначения.' },
        { term: 'Assign', meaning: 'Фаза rebalance: coordinator выдаёт consumer новый набор partitions.' },
        { term: 'Rebalance', meaning: 'Перераспределение partitions между members группы.' },
        { term: 'max.poll.interval.ms', meaning: 'Макс. время между poll(); превышение → consumer исключают из группы.' },
        { term: 'Cooperative rebalance', meaning: 'Incremental revoke — не все partitions сразу, меньше stop-the-world.' },
      ],
      lecturerNotes: [
        'Сокращаемая тема — но один вопрос про revoke/assign + дубли обязателен, если слаб int-prod-08.',
        'Сильный ответ связывает rebalance + deploy + max.poll.interval в одну цепочку.',
        'Red flag: не может объяснить, почему offset 100 приходит дважды при committed 99.',
      ],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'int-prod-10',
      title: 'DLQ / poison messages',
      priority: 'core',
      simpleDefinitionOverride:
        'Poison message — сообщение, которое при каждой попытке обработки падает (битый JSON, unknown enum, баг в коде). Transient error — временный сбой (503, timeout БД), имеет смысл retry. После лимита retry permanent/poison уходит в DLQ с полным контекстом для разбора и replay.',
      quickAnswer:
        '1) Классифицировать: transient → retry с backoff; permanent → не крутить бесконечно. 2) После N попыток — Dead Letter Topic с original payload + error + correlation id. 3) Алерт на DLQ rate. 4) Replay только после fix root cause + idempotent consumer. 5) DLQ — очередь на разбор, не свалка.',
      explainBrief: [
        '1. Transient: сеть, 503 downstream, PG timeout, broker glitch — retry с exponential backoff имеет смысл.',
        '2. Permanent: JsonMappingException, NPE в handler, unknown status enum — retry бесполезен, блокирует partition.',
        '3. Poison message: permanent + retry loop → lag растёт, healthy messages не обрабатываются.',
        '4. Когда DLQ: после maxAttempts или сразу на classified permanent; Spring DefaultErrorHandler + DeadLetterPublishingRecoverer.',
        '5. Что логировать: original topic/partition/offset, payload (или hash), stacktrace, correlationId, eventId, consumer group.',
        '6. Replay: fix schema/code → tool publish из DLQ в main topic → consumer dedup по event_id.',
        '7. Вывод: catch Exception and log без действия = poison message крутится часами.',
      ],
      questionPlan: [
        {
          question: 'Transient vs permanent — примеры?',
          answerHint: 'Transient: Feign 503, SocketTimeout. Permanent: cannot deserialize enum FOO, NullPointer в mapper.',
        },
        {
          question: 'Что такое poison message?',
          answerHint: 'Сообщение, которое всегда падает — partition стоит на одном offset, lag растёт.',
        },
        {
          question: 'Retry backoff — зачем?',
          answerHint: 'Не DDOS-ить упавший downstream; дать восстановиться; 1s → 5s → 30s → DLQ.',
        },
        {
          question: 'Когда отправлять в DLQ?',
          answerHint: 'Permanent сразу или после N transient; не бесконечно — иначе блок partition.',
        },
        {
          question: 'Что логировать и как replay?',
          answerHint: 'eventId, correlationId, error class, original headers; replay после fix с idempotency.',
        },
      ],
      extraKeyPoints: [
        'Бесконечный retry на poison = один bad message стопорит всю partition.',
        'DLQ retention и доступ для L2/support — иначе сообщения «пропадают» из видимости.',
        'Не смешивать transient retry policy с permanent — classify в ErrorHandler.',
        'Replay без fix root cause → сообщение снова в DLQ; нужен runbook.',
      ],
      interviewFocus: [
        {
          question: 'Как обрабатывать сообщение, которое стабильно ломает consumer?',
          expectedAnswer:
            'Сначала классификация: SQLException timeout или 503 payment — transient, retry с exponential backoff (например 3–5 попыток, 1s/5s/30s). JsonMappingException, validation «unknown field», NPE в бизнес-коде — permanent, retry бессмысленен. После исчерпания попыток — publish в orders.DLT через DeadLetterPublishingRecoverer с headers: original-topic, original-offset, exception message, correlationId, eventId. Алерт если dlq_messages_rate > threshold. В логах structured JSON: не только stacktrace, но и businessKey для связи с Camunda/заявкой. Replay: после деплоя fix — скрипт или kafka-connect reprocess из DLT в main topic; consumer идемпотентен (int-prod-08). Антипаттерн: catch (Exception e) { log.error } без rethrow/DLQ — poison крутится вечно.',
        },
        {
          question: 'Follow-up: в DLQ 500 сообщений после релиза — ваши шаги?',
          expectedAnswer:
            '1) Алерт уже сработал — смотрим error class в DLQ headers (один тип = массовый баг релиза). 2) Correlation с deploy time. 3) Rollback или hotfix. 4) Replay batch с мониторингом duplicate_skipped. 5) Postmortem: почему permanent не классифицировали сразу, почему DLQ алерт не настроен.',
        },
      ],
      codeExample: {
        title: 'Retry → DLQ → replay runbook',
        language: 'text',
        snippet: `Symptom: consumer lag растёт, partition застряла на offset 4521

Steps:
  1. Логи: JsonMappingException on field "statusReason" — unknown enum
  2. Classify: PERMANENT (не retry 100 раз)
  3. attempt 1..3 transient only: backoff 1s, 5s, 30s
  4. exhausted OR permanent → publish orders.DLT
     headers: X-Original-Topic, X-Original-Offset,
              X-Correlation-Id, X-Exception-Class
     body: original payload + error summary
  5. alert: dlq_rate > 10/min → PagerDuty
  6. fix: deploy schema tolerant reader OR producer fix
  7. replay: kafka-console-producer OR replay-tool → main topic
  8. verify: lag down, duplicate_skipped ok, no new DLQ

Fix:
  - ErrorHandler with classifier (transient vs permanent)
  - DLQ monitoring + runbook owner
  - idempotent consumer before any replay

Red flags:
  - catch Exception and log — no DLQ
  - infinite retry
  - DLQ without retention/access
  - replay before root cause fix`,
        walkthrough: [
          'Дать сценарий: «после релиза один enum не распознаётся» — слушать classify + DLQ, не «перезапустим consumer».',
          'Дожать: «что положите в DLQ message?» — original + metadata для replay.',
          'Связать с int-prod-08: replay = дубли возможны, dedup обязателен.',
        ],
        commonPitfall: 'catch Exception and log; retry бесконечно; DLQ — мусорка; replay без fix и без idempotency.',
        productionNote: 'Один poison message без DLQ может стопорить partition и SLA всего потока на часы.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'DLQ', meaning: 'Dead Letter Queue/Topic — хранилище сообщений после исчерпания retry.' },
        { term: 'Poison message', meaning: 'Сообщение, которое стабильно падает при каждой обработке.' },
        { term: 'Transient error', meaning: 'Временный сбой — retry может помочь.' },
        { term: 'Permanent error', meaning: 'Повтор не исправит — нужен fix кода/схемы или DLQ.' },
        { term: 'Backoff', meaning: 'Увеличивающаяся пауза между retry (exponential).' },
        { term: 'DeadLetterPublishingRecoverer', meaning: 'Spring Kafka компонент для отправки failed record в DLT.' },
        { term: 'Replay', meaning: 'Повторная публикация сообщений из DLQ в основной топик после fix.' },
      ],
      lecturerNotes: [
        'Можно объединить с int-prod-09 в один блок 35–45 мин — rebalance + DLQ как «at-least-once боль».',
        'Сильный кандидат сам разделяет transient/permanent до вопроса про DLQ.',
        'Кейс: «lag не падает, ошибок в info мало» — poison в retry loop.',
      ],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-11',
      title: 'Camunda orchestration',
      priority: 'core',
      simpleDefinitionOverride:
        'Camunda — process engine для long-running orchestration: хранит состояние процесса, активный шаг, variables, history. Process manager в BPMN vs REST-цепочка в одной HTTP-транзакции — Camunda переживает падения, ждёт Kafka-события и таймеры. Delegate — Java-код шага; external task — worker снаружи poll task.',
      quickAnswer:
        '1) Camunda DB: process instances, executions, variables, jobs, incidents, history. 2) REST-цепочка теряет state при crash. 3) Process variables — контекст между шагами. 4) Message correlation — businessKey связывает Kafka event с waiting catch. 5) Delegate = service task Java; external task = poll worker.',
      explainBrief: [
        '1. Что хранит Camunda: BPMN deployment, running instances, active activity id, process variables, async/timer jobs, incidents, audit history.',
        '2. Process manager vs REST chain: REST A→B→C синхронно — упал B, контекст в памяти потерян; Camunda знает «ждём PaymentCompleted на шаге X».',
        '3. Process variables: businessKey, applicationId, paymentId — между delegate, gateways, message events; не дублировать всё в custom status columns.',
        '4. Message correlation: publish message с name + correlationKey (= businessKey) → будит message catch event нужного instance.',
        '5. Delegate (JavaDelegate): код в engine JVM — REST call к payment, throw on 500. Service task vs external task worker.',
        '6. External task: worker poll topic, execute, complete/fail — decouple deploy core и worker pool.',
        '7. Вывод: Camunda — orchestration saga из int-prod-01, не замена CRUD payment.',
      ],
      questionPlan: [
        {
          question: 'Что Camunda хранит в своей БД?',
          answerHint: 'Instances, executions, variables, jobs (async/timer), incidents, history — не бизнес-деньги payment.',
        },
        {
          question: 'Process manager vs REST-цепочка?',
          answerHint: 'REST — синхронно, state в памяти; Camunda — persisted state, resume, timers, correlation.',
        },
        {
          question: 'Process variables — зачем?',
          answerHint: 'Контекст: applicationId, сумма, paymentId — доступны delegate и gateways.',
        },
        {
          question: 'Message correlation — как ждать Kafka?',
          answerHint: 'Message catch + correlate(name, businessKey) из consumer при PaymentCompleted.',
        },
        {
          question: 'Delegate vs external task?',
          answerHint: 'Delegate — Java в engine; external task — worker снаружи poll; оба вызывают payment REST.',
        },
      ],
      extraKeyPoints: [
        'businessKey = сквозной ключ заявки — в Kafka key, REST headers, Camunda instance.',
        'Timer boundary на wait step — escalation если событие не пришло за 24h.',
        'BPMN gateways — явные success/fail/compensation; не if/else в 500 строк controller.',
        'Camunda history — ops видит, где застрял процесс, без grep по кастомным status.',
      ],
      interviewFocus: [
        {
          question: 'Почему long-running процесс лучше вести через BPMN/Camunda, а не REST-цепочкой?',
          expectedAnswer:
            'REST-цепочка синхронна и живёт в HTTP: payment упал — timeout, контекст «мы на шаге 3» только в памяти thread. Camunda персистит process instance: active activity, variables, businessKey. После рестарта pod процесс продолжается. Message catch ждёт PaymentCompleted hours/days — correlate по businessKey когда Kafka consumer вызывает correlate(). Timer boundary эскалирует без cron. BPMN читается аналитиками и L2. Variables хранят applicationId между delegate; delegate (JavaDelegate) вызывает REST и бросает exception при 500 (int-prod-12). Это process manager saga: core координирует, payment исполняет (int-prod-01).',
        },
        {
          question: 'Follow-up: Kafka event PaymentCompleted — как «разбудить» процесс?',
          expectedAnswer:
            'Consumer вызывает message correlation: message name = PaymentCompleted, correlationKey = businessKey. Camunda находит waiting catch и продвигает token. Orphan event если correlation не найден — метрика + лог. Не UPDATE custom status минуя engine.',
        },
      ],
      codeExample: {
        title: 'Camunda: state, variables, correlation',
        language: 'text',
        snippet: `Symptom: процесс «завис» — непонятно на каком шаге

Steps (architecture):
  Camunda DB:
    ACT_RU_EXECUTION  — active token
    ACT_RU_VARIABLE   — applicationId, amount, paymentId
    ACT_RU_JOB        — async/timer/retry
    ACT_HI_*          — audit history

  BPMN:
    Start → CreatePayment (JavaDelegate → REST)
         → MessageCatch "PaymentCompleted" (correlationKey=businessKey)
         → Gateway → NotifyKafka → End

  Kafka consumer:
    correlate(messageName, businessKey=evt.applicationId)

  vs REST chain (anti-pattern):
    POST start → POST payment → crash → context lost

Fix:
  - persisted state, not in-memory chain
  - businessKey everywhere
  - message correlation, not status polling

Red flags:
  - Camunda only for diagrams
  - custom status ENUM instead of engine
  - delegate swallows errors`,
        walkthrough: [
          'Слушать: Camunda DB vs payment DB — разные system of record.',
          'Дожать correlation: «кто вызывает correlate?» — consumer с businessKey.',
          'Must-ask 45–52: orchestration vs payment CRUD (int-prod-01).',
        ],
        commonPitfall: 'Camunda как диаграмма без persistence; REST chain «проще»; variables дублируют application.status.',
        productionNote: 'Без engine длинные процессы разъезжаются в status-полях и cron-джобах.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'BPMN', meaning: 'Нотация модели процесса: tasks, gateways, events, timers.' },
        { term: 'Process instance', meaning: 'Запущенный экземпляр BPMN с persisted state.' },
        { term: 'Process variables', meaning: 'Key-value контекст процесса между шагами.' },
        { term: 'businessKey', meaning: 'Внешний id заявки — сквозной ключ correlation.' },
        { term: 'Message correlation', meaning: 'Связь message event с waiting process instance.' },
        { term: 'Delegate', meaning: 'JavaDelegate — Java-код service task в engine.' },
        { term: 'External task', meaning: 'Worker снаружи poll task — decoupled execution.' },
        { term: 'Process manager', meaning: 'Orchestrator saga — Camunda ведёт шаги процесса.' },
      ],
      lecturerNotes: [
        'Must-ask в блоке 45–52 мин — не пропускать даже при сильном Kafka.',
        'Слабый: «Camunda = workflow UI» — дать мини-кейс correlation.',
        'Senior: external task vs delegate trade-offs (deploy coupling).',
      ],
      estimatedMinutes: 4,
    }),
    topic({
      id: 'int-prod-12',
      title: 'External service failure in delegate',
      priority: 'core',
      simpleDefinitionOverride:
        'Delegate вызывает внешний сервис (payment REST). Technical 500/503 — transient: throw exception → Camunda job retry с backoff → incident. Business 400/422 («недостаточно средств») — BpmnError → BPMN error boundary → ветка отказа, не бесконечный retry. Не catch-and-continue — иначе «зелёный» шаг без реального платежа.',
      quickAnswer:
        '1) 500/503/timeout → RuntimeException → job retry (лимит + backoff) → incident → manual retry/skip. 2) 400/422 business → BpmnError(code) → gateway compensation/reject. 3) Лог: processInstanceId, businessKey, externalRequestId. 4) Retry payment call — idempotent (int-prod-03).',
      explainBrief: [
        '1. Technical failure: payment 500, connection reset, read timeout — временно, имеет смысл retry job.',
        '2. Business failure: 400 insufficient funds, 422 validation — не retry как 500; BpmnError → explicit BPMN path.',
        '3. Throw vs BPMN error: RuntimeException — engine retry/incident; BpmnError — controlled business flow в diagram.',
        '4. Retry: async job retries с exponential backoff, max attempts в BPMN job config или engine default.',
        '5. Incident: после исчерпания — ops dashboard, manual retry job или skip with audit.',
        '6. Manual resolution: payment восстановился → retry failed job; проверить idempotency key в payment.',
        '7. Вывод: catch (Exception e) { log; return; } = процесс «успешен», денег нет.',
      ],
      questionPlan: [
        {
          question: '500 от payment — success шага?',
          answerHint: 'Нет — throw, retry, потом incident; не маркировать complete.',
        },
        {
          question: '400 «недостаточно средств» — то же что 500?',
          answerHint: 'Нет — BpmnError → business reject path, без 10 retry на 500-style.',
        },
        {
          question: 'Throw vs BpmnError?',
          answerHint: 'Throw — technical retry/incident; BpmnError — mapped business outcome в BPMN.',
        },
        {
          question: 'Что после исчерпания retry?',
          answerHint: 'Incident в Operate/Cockpit; L2 manual retry или cancel process с audit.',
        },
        {
          question: 'Как не потерять контекст при разборе?',
          answerHint: 'Лог processInstanceId + businessKey + payment idempotency key / externalRequestId.',
        },
      ],
      extraKeyPoints: [
        'Различать HTTP status в delegate mapper — не один catch на всё.',
        'Feign Retryer на 500 в delegate + Camunda retry = двойной retry storm — осознанно.',
        'Incident без алерта = процессы копятся незаметно — метрика open_incidents.',
        'Manual retry после fix payment — тот же businessKey/idempotency key в payment API.',
      ],
      interviewFocus: [
        {
          question: 'Внешний сервис вернул 500 при выполнении Camunda delegate. Что делать?',
          expectedAnswer:
            'Delegate не ловит и не глотает. RuntimeException (или propagate Feign exception) — Camunda помечает job failed, retry с backoff (например 3–5 attempts). Лог structured: processInstanceId, businessKey, activityId, externalRequestId/correlationId, HTTP status, response body snippet. После max retries — incident для ops: payment был down, процесс ждёт. При восстановлении payment — manual retry job; вызов payment идемпотентен по businessKey (int-prod-03). Отличие: 422 «invalid account» — throw BpmnError("PAYMENT_REJECTED"), BPMN error boundary ведёт на compensation/end reject — не 5 retry как на 503. Антипаттерн: catch Exception { return; } — шаг complete, процесс идёт дальше без платежа.',
        },
        {
          question: 'Follow-up: incident висит 2 часа — ваши действия?',
          expectedAnswer:
            '1) Проверить payment health и error rate. 2) Если transient resolved — retry job из Operate. 3) Если business reject был misclassified as 500 — fix mapping, redeploy, cancel/restart instance. 4) Postmortem: алерт на incident count, runbook для L2.',
        },
      ],
      codeExample: {
        title: 'Delegate: 500 vs 422 error model',
        language: 'text',
        snippet: `Symptom: Camunda показывает COMPLETED, в payment нет транзакции

Steps:
  delegate CreatePayment:
    response 503 → throw new RuntimeException("payment unavailable")
      → job retry 1..5 (backoff)
      → still fail → INCIDENT (ops alert)

    response 422 insufficient funds → throw BpmnError("INSUFFICIENT_FUNDS")
      → BPMN error boundary → NotifyRejected → End

    BAD:
      catch (Exception e) { log.error(e); }  // step completes!

  logs MUST include:
    processInstanceId, businessKey, activityId,
    externalRequestId, httpStatus

Fix:
  - classify HTTP status in delegate
  - throw / BpmnError — never swallow
  - idempotent payment API on job retry
  - alert: camunda.open_incidents > 0

Red flags:
  - 500 treated as business success
  - infinite retry without incident
  - no businessKey in logs
  - retry payment without idempotency key`,
        walkthrough: [
          'Кейс int-prod-16 Case 3 — если нет прод-примера у кандидата.',
          'Слушать: technical vs business — два разных пути в BPMN.',
          'Дожать: «что в Operate увидит L2?» — incident vs completed path.',
        ],
        commonPitfall: 'catch и continue; retry без лимита; 500 = business error без ветвления; Feign + Camunda double retry без понимания.',
        productionNote: 'Проглоченный 500 — «зелёный» процесс без реального платежа; финансовый и compliance риск.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Incident', meaning: 'Failed job в Camunda, требующий ops intervention.' },
        { term: 'Transient error', meaning: 'Временный technical failure — retry оправдан.' },
        { term: 'BpmnError', meaning: 'Business error — маршрутизация в BPMN error boundary.' },
        { term: 'JavaDelegate', meaning: 'Java-код service task — место REST call к payment.' },
        { term: 'Job retry', meaning: 'Автоматический повтор failed async job engine.' },
        { term: 'Error boundary', meaning: 'BPMN элемент — catch BpmnError и альтернативный path.' },
      ],
      lecturerNotes: [
        'Связать с int-prod-03 idempotency при retry delegate.',
        'Must-ask: «500 — success?» — фильтр Middle vs Senior.',
        'Senior: incident workflow + Operate + alert, не только «throw exception».',
      ],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-13',
      title: 'PostgreSQL performance incident',
      priority: 'core',
      simpleDefinitionOverride:
        'После релиза выросли таймауты к PostgreSQL — системный runbook: сначала pool и locks, потом slow queries и EXPLAIN нового кода, N+1 и длинные транзакции. Mitigation — feature flag или временный timeout; long-term — fix query/index/transaction boundary. Не «увеличить timeout» первым шагом.',
      quickAnswer:
        '8 шагов: 1 pool 2 locks pg_stat_activity 3 slow queries 4 EXPLAIN новых запросов 5 N+1 в trace 6 long tx 7 mitigation (flag/timeout) 8 long-term fix. Каждый шаг — где смотреть, плохой симптом, follow-up вопрос кандидату.',
      explainBrief: [
        '1. Pool (Hikari/PgBouncer): где — Grafana hikari.connections.*, app metrics; симптом — pending threads, acquire timeout; follow-up: «pool exhausted или DB медленная?»',
        '2. Locks pg_stat_activity: где — SELECT wait_event, pg_locks; симптом — idle in transaction блокирует migration; follow-up: «кто holder lock?»',
        '3. Slow queries: где — pg_stat_statements, slow query log, APM DB span; симптом — top query 10x медленнее baseline; follow-up: «совпало с deploy time?»',
        '4. EXPLAIN ANALYZE: где — staging с prod-like data; симптом — seq scan на большой таблице; follow-up: «missing index или bad join order?»',
        '5. N+1: где — trace HTTP→SQL count, Hibernate stats; симптом — 200 SELECT на один REST call; follow-up: «OSIV off — где fetch?» (int-prod-05)',
        '6. Long transactions: где — pg_stat_activity xact_start; симптом — tx открыта минуты; follow-up: «что держит connection?»',
        '7. Mitigation: feature flag off нового endpoint, временно ↑ pool (осторожно), statement_timeout — только чтобы снять fire; follow-up: «что не лечит root cause?»',
        '8. Long-term fix: fetch join, index, split tx, batch; verify metrics recovery; follow-up: «как не повторить в CI?»',
      ],
      questionPlan: [
        {
          question: 'Первый шаг при spike таймаутов после релиза?',
          answerHint: 'Hikari pending + pg_stat_activity locks — не сразу scale RDS.',
        },
        {
          question: 'Pool exhausted — как отличить от медленной БД?',
          answerHint: 'Pending threads при низком DB CPU — pool; high CPU + slow queries — query plan.',
        },
        {
          question: 'Когда EXPLAIN, когда индекс?',
          answerHint: 'EXPLAIN сначала — индекс по диагнозу, не «на всё».',
        },
        {
          question: 'N+1 — как доказать?',
          answerHint: 'Trace: один HTTP → сотни одинаковых SELECT; correlate с новым endpoint.',
        },
        {
          question: 'Mitigation vs fix?',
          answerHint: 'Flag off — временно; fetch join + index — long-term; ↑ timeout — маскировка.',
        },
      ],
      extraKeyPoints: [
        'Pool exhaustion маскируется как «PostgreSQL тормозит» — смотреть app и DB одновременно.',
        'idle in transaction — частый виновник lock pile-up после «безобидного» @Transactional.',
        'Релиз + spike = diff endpoint и SQL count, не generic «БД плохая».',
        'Post-incident: SQL review в PR, p6spy/stats в staging, алерт на pool pending.',
      ],
      interviewFocus: [
        {
          question: 'После релиза выросли таймауты к PostgreSQL. Пройдите runbook по шагам.',
          expectedAnswer:
            'Шаг 1: метрики Hikari — connections.active, pending, acquire ms; если pending растёт — connections не возвращаются (long tx или leak). Шаг 2: pg_stat_activity — wait_event Type Lock, blocked_by pid; idle in transaction с старым xact_start. Шаг 3: pg_stat_statements top by total_time за час vs вчера; correlate с deploy. Шаг 4: EXPLAIN ANALYZE подозрительного запроса из нового endpoint — seq scan, nested loop на миллионах строк. Шаг 5: APM trace — один GET /applications/{id} → 150 SELECT (N+1 после OSIV off без fetch join). Шаг 6: long tx держит connection — batch job в одной @Transactional. Mitigation: feature flag off endpoint, kill idle tx (осторожно). Fix: JOIN FETCH, index, короче tx. Не первым делом scale RDS или statement_timeout навсегда.',
        },
        {
          question: 'Follow-up: pool OK, но один запрос 30 сек — что дальше?',
          expectedAnswer:
            'EXPLAIN ANALYZE, проверить statistics, missing index, lock wait на hot row. Не увеличивать pool — не поможет. Если migration lock — schedule off-peak.',
        },
      ],
      codeExample: {
        title: 'Runbook инцидента PostgreSQL — 8 шагов',
        language: 'text',
        snippet: `Симптом: после deploy в 14:00 — всплеск HTTP 504, JDBC timeout

Шаг 1 — Пул соединений
  Где смотрим: Grafana hikari.connections.pending, active, max
  Плохой признак: pending > 0 долго, потоки ждут getConnection
  Уточнение кандидату: «Исчерпан pool или БД не отвечает?»

Шаг 2 — Блокировки (pg_stat_activity)
  Где смотрим: SELECT pid, wait_event, query, xact_start FROM pg_stat_activity
  Плохой признак: wait_event=Lock, idle in transaction 10+ мин
  Уточнение: «Кто блокирует pid? pg_blocking_pids?»

Шаг 3 — Медленные запросы
  Где смотрим: pg_stat_statements, slow query log, APM/DBM
  Плохой признак: top query в 10 раз медленнее baseline с момента deploy
  Уточнение: «Какой endpoint породил запрос?»

Шаг 4 — EXPLAIN
  Где смотрим: EXPLAIN (ANALYZE, BUFFERS) на staging
  Плохой признак: Seq Scan на 5M строк, много rows removed by filter
  Уточнение: «Индекс или переписать join?»

Шаг 5 — N+1
  Где смотрим: trace HTTP → дочерние JDBC spans
  Плохой признак: 1 REST → 200 одинаковых SELECT по id
  Уточнение: «fetch join в repository?» (int-prod-05)

Шаг 6 — Длинные транзакции
  Где смотрим: pg_stat_activity xact_start, thread dump приложения
  Плохой признак: одна @Transactional 5 мин держит connection
  Уточнение: «REQUIRES_NEW audit? batch в одной tx?»

Шаг 7 — Временное смягчение (mitigation)
  Где смотрим: feature flag, circuit breaker, временный statement_timeout
  Плохой признак: только ↑ timeout навсегда — маскирует причину
  Уточнение: «Что откатить за 5 мин?»

Шаг 8 — Долгосрочное исправление
  Исправление: JOIN FETCH, индекс, разбить tx, пагинация
  Проверка: pool pending=0, p95 latency как до релиза
  Красные флаги: сначала scale БД; индекс на всё; «Hibernate сам оптимизирует»`,
        walkthrough: [
          'Кейс int-prod-16 #4 — практический якорь; не подсказывать шаги, слушать порядок.',
          'Сильный кандидат сам идёт pool → locks → slow → EXPLAIN → N+1.',
          'Красный флаг: сразу «добавим реплику» или «увеличим timeout в yml».',
        ],
        commonPitfall: 'Увеличить timeout; индексы на всё; scale RDS без EXPLAIN; Hibernate «сам оптимизирует».',
        productionNote: 'Pool exhaustion и N+1 после «маленького» релиза — типичный Middle+ фильтр.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'HikariCP', meaning: 'JDBC pool в Spring Boot — active, idle, pending connections.' },
        { term: 'pg_stat_activity', meaning: 'Активные сессии PG: query, wait_event, xact_start.' },
        { term: 'pg_stat_statements', meaning: 'Агрегат статистики по SQL — top slow queries.' },
        { term: 'EXPLAIN ANALYZE', meaning: 'План запроса + фактическое время и rows.' },
        { term: 'N+1', meaning: '1 query parents + N queries children — int-prod-05.' },
        { term: 'idle in transaction', meaning: 'Сессия в открытой tx без активного query — держит lock.' },
        { term: 'PgBouncer', meaning: 'Pooler перед PG — queue если pool mode transaction.' },
      ],
      lecturerNotes: [
        'Блок 52–57 мин вместе с int-prod-14.',
        'Дать только симптом «таймауты после релиза» — оценить runbook, не знание SQL наизусть.',
        'Senior: mitigation (flag) + long-term fix + postmortem CI guard.',
      ],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-14',
      title: 'Kubernetes graceful shutdown + Kafka',
      priority: 'core',
      simpleDefinitionOverride:
        'Rolling deploy шлёт SIGTERM pod — grace period до SIGKILL. Readiness снимает pod с балансировщика; liveness — «жив ли процесс», не для drain. Kafka listener stop: не poll новых, дообработать in-flight, commit offset после tx. Без commit — redelivery; idempotency обязательна.',
      quickAnswer:
        '1) SIGTERM → preStop/graceful hook. 2) Readiness fail — no new traffic. 3) KafkaListenerContainer.stop — finish in-flight. 4) Commit offset AFTER tx. 5) SIGKILL если grace истёк. 6) Redelivery нормален — dedup (int-prod-08).',
      explainBrief: [
        '1. SIGTERM lifecycle: K8s → SIGTERM → terminationGracePeriodSeconds → SIGKILL if not exited.',
        '2. Readiness vs liveness: readiness fail — Service removes pod; liveness fail — restart (не drain).',
        '3. Kafka listener: stop — pause poll, wait current handler, then commit.',
        '4. Offset commit timing: after DB tx success; commit before = loss on crash after commit.',
        '5. SIGKILL: grace too short → mid-processing kill → offset not committed → redelivery.',
        '6. Idempotency: duplicate after deploy — processed_events / business key (int-prod-08).',
        '7. Вывод: terminationGracePeriodSeconds ≥ p99 processing + buffer.',
      ],
      questionPlan: [
        {
          question: 'SIGTERM — что по шагам?',
          answerHint: 'Signal → readiness off → drain HTTP/Kafka → commit → exit; иначе SIGKILL.',
        },
        {
          question: 'Readiness vs liveness при shutdown?',
          answerHint: 'Readiness fail убирает из Service; liveness — restart, не graceful drain.',
        },
        {
          question: 'Pod умер mid-processing — что с сообщением?',
          answerHint: 'Redelivery at-least-once; handler идемпотентен.',
        },
        {
          question: 'Commit offset когда?',
          answerHint: 'После успешной обработки и tx; не в начале poll.',
        },
        {
          question: 'Spring Boot настройки?',
          answerHint: 'server.shutdown=graceful, kafka ack-mode, lifecycle timeout = K8s grace.',
        },
      ],
      extraKeyPoints: [
        'Rolling update без graceful Kafka = spike rebalance + duplicates (int-prod-09).',
        'preStop hook sleep — время LB снять endpoint до stop listener.',
        'Commit sync before exit — иначе «almost done» message переиграется.',
        'Liveness probe during long batch может убить pod — tune probe thresholds.',
      ],
      interviewFocus: [
        {
          question: 'Pod завершился во время обработки Kafka-сообщения. Что будет и как сделать безопасно?',
          expectedAnswer:
            'K8s шлёт SIGTERM при rolling update. Последовательность: fail readiness, KafkaListenerContainer.stop() — не брать новые records, дождаться handler, commit offset после DB tx, close consumer. terminationGracePeriodSeconds ≥ p99 обработки. SIGKILL до commit → redelivery (at-least-once). Безопасность = idempotent consumer (int-prod-08). Антипаттерны: commit в начале; «K8s подождёт» без grace; игнор rebalance при deploy.',
        },
        {
          question: 'Follow-up: после deploy дубли — связь с shutdown?',
          expectedAnswer:
            'Grace too short, listener killed mid-tx, offset not committed, rebalance (int-prod-09). Fix: increase grace, graceful config, dedup. Metrics: rebalance spike at deploy.',
        },
      ],
      codeExample: {
        title: 'SIGTERM → Kafka graceful shutdown',
        language: 'text',
        snippet: `Symptom: rolling deploy → duplicate payments, rebalance spike

Steps (lifecycle):
  T+0s  SIGTERM to pod
  T+1s  readiness fails → removed from Service
  T+2s  KafkaListenerContainer.stop() — no new poll
  T+2..25s  finish in-flight, DB tx, commit offset
  T+26s  consumer.close(), JVM exit
  T+30s  grace ends → SIGKILL if still running

  SIGKILL mid-tx → offset not committed → redelivery → NEED dedup

Fix:
  - server.shutdown=graceful + kafka lifecycle timeout
  - terminationGracePeriodSeconds > p99 + 10s
  - commit AFTER tx, idempotent handler
  - preStop sleep for LB propagation

Red flags:
  - K8s gracefully stops everything (myth)
  - commit offset at poll start
  - redelivery never happens
  - liveness kills pod during long batch`,
        walkthrough: [
          'Case int-prod-16 #5 — SIGTERM + redelivery + idempotency достаточно для Middle.',
          'Слушать: readiness vs liveness — частая путаница.',
          'Связать deploy window с rebalance metrics (int-prod-09).',
        ],
        commonPitfall: 'K8s сам всё завершит; повторов не будет; commit в начале; путать liveness и readiness.',
        productionNote: 'Rolling deploy без graceful Kafka — всплеск дублей и lag.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'SIGTERM', meaning: 'Сигнал корректного завершения процесса от K8s.' },
        { term: 'SIGKILL', meaning: 'Принудительное убийство после grace period.' },
        { term: 'Readiness probe', meaning: 'Pod готов к трафику — fail убирает из Service.' },
        { term: 'Liveness probe', meaning: 'Pod жив — fail перезапускает container.' },
        { term: 'terminationGracePeriodSeconds', meaning: 'Время между SIGTERM и SIGKILL.' },
        { term: 'KafkaListenerContainer', meaning: 'Spring wrapper — stop() для graceful shutdown.' },
        { term: 'Offset commit', meaning: 'Фиксация позиции после успешной обработки.' },
      ],
      lecturerNotes: [
        'Нет K8s опыта — принцип SIGTERM + redelivery + idempotency для Middle.',
        'Senior: preStop, grace tuning, deploy time ↔ duplicate metric.',
        'Блок 52–57 с int-prod-13.',
      ],
      estimatedMinutes: 2,
    }),
    topic({
      id: 'int-prod-15',
      title: 'Observability',
      priority: 'core',
      simpleDefinitionOverride:
        'Observability — metrics + logs + traces вместе. Metrics показывают «что сломалось и когда» (lag, pool, error rate); logs — «почему» с correlation id; traces — цепочка HTTP→Kafka→Camunda→external. RED для API, USE для infra; business dashboards для stuck заявок.',
      quickAnswer:
        '1) Metrics vs logs vs traces — разные роли, не «достаточно grep». 2) RED: rate, errors, duration. 3) USE: utilization, saturation, errors — pool, CPU. 4) Stuck apps: status counts, oldest PENDING, Camunda incidents, Kafka lag. 5) Log fields: traceId, businessKey, eventId, processInstanceId. 6) Chain: HTTP → Kafka → Camunda → payment.',
      explainBrief: [
        '1. Metrics: агрегаты, алерты, dashboards — consumer lag, hikari pending, http_server_requests_seconds, rebalance rate.',
        '2. Logs: события с контекстом — JSON structured, correlation id сквозь сервисы, не println.',
        '3. Traces: distributed span chain — один traceId от API через Feign, Kafka publish, Camunda delegate.',
        '4. RED (API): Request rate, Error rate, Duration p95/p99 — SLO и алерты.',
        '5. USE (infra): Utilization CPU/connections, Saturation queue/pending, Errors — pool exhausted signal.',
        '6. Stuck applications dashboard: applications_by_status, oldest_pending_age, open Camunda incidents, payment error rate.',
        '7. Log fields minimum: traceId, spanId, businessKey, processInstanceId, eventId, outcome, durationMs, downstream.',
        '8. Вывод: инцидент «заявки не двигаются» — business metric first, потом tech drill-down по chain.',
      ],
      questionPlan: [
        {
          question: 'Metrics vs logs vs traces?',
          answerHint: 'Metrics — trend/alert; logs — detail с ids; traces — latency breakdown по hop.',
        },
        {
          question: 'RED и USE — когда что?',
          answerHint: 'RED — HTTP/API SLO; USE — pool, CPU, disk — saturation раньше outage.',
        },
        {
          question: 'Dashboard для stuck заявок?',
          answerHint: 'Count by status, age oldest PENDING, Camunda incidents, Kafka lag payment-events.',
        },
        {
          question: 'Какие поля в structured log?',
          answerHint: 'traceId, businessKey, eventId, processInstanceId, outcome, error.class.',
        },
        {
          question: 'Цепочка HTTP → Kafka → Camunda → external?',
          answerHint: 'Один traceId: API start → outbox publish span → consumer → correlate Camunda → Feign payment.',
        },
      ],
      extraKeyPoints: [
        'Только logs — lag и pool видны в metrics раньше, чем в grep.',
        'Business metrics без tech — клиенты находят инцидент первыми.',
        'correlation id ≠ businessKey: первый для trace, второй для domain.',
        'Алерт на DLQ rate + open incidents + oldest_pending_age — triad для orchestration.',
      ],
      interviewFocus: [
        {
          question: 'Какие метрики и логи нужны для разбора инцидента «заявки застряли в PENDING»?',
          expectedAnswer:
            'Начать с business dashboard: count PENDING vs baseline, oldest_pending_age, новые vs stuck. Параллельно tech: Camunda open incidents и failed jobs; Kafka consumer lag на payment-events и DLQ rate; HTTP/Feign error rate к payment. RED на API: error spike, duration p99. USE: hikari.connections.pending. Logs: traceId из ticket → JSON chain core (processInstanceId, businessKey) → payment (externalRequestId, httpStatus) → consumer (eventId). Traces: span breakdown — где gap (missing Kafka event vs payment 500 vs Camunda not correlated). Не «откроем логи» без metrics; не только infra без business status.',
        },
        {
          question: 'Follow-up: traceId есть, payment 500 — что дальше?',
          expectedAnswer:
            'Feign span error, payment logs по correlation id, Camunda incident timeline, алерт recovery после payment fix. Postmortem: alert на payment error rate SLO.',
        },
      ],
      codeExample: {
        title: 'Observability chain: stuck PENDING',
        language: 'text',
        snippet: `Symptom: support — «заявки не двигаются 2 часа»

Steps:
  1. Business metrics
     applications_by_status{status="PENDING"} spike
     oldest_pending_age > 2h
  2. Camunda dashboard
     open_incidents, failed_jobs on CreatePayment
  3. Kafka metrics (USE/RED hybrid)
     consumer_lag{topic="payment-events"} up
     dlq_rate stable or up
  4. API RED
     http_errors{uri="/applications"} , feign_errors{client="payment"}
  5. DB USE
     hikari.connections.pending (if PG related)
  6. Logs (traceId=abc-123 from ticket)
     core: businessKey=APP-42 processInstanceId=pi-99
     payment: externalRequestId=req-7 httpStatus=500
     consumer: eventId=evt-55 NOT correlated (orphan)
  7. Trace waterfall
     HTTP POST /applications → delegate → Feign payment 500

Fix + verify:
  payment recovery → incident retry → PENDING count drops
  alert: payment_error_rate + oldest_pending_age

Red flags:
  - «достаточно логов»
  - grep без businessKey
  - no business dashboard
  - metrics only for SRE, dev blind`,
        walkthrough: [
          'Финал 57–60: суммировать оценку по матрице int-prod-00.',
          'Слушать: business first, then chain HTTP→Kafka→Camunda→payment.',
          'Сильный: сам называет RED/USE и log fields без подсказки.',
        ],
        commonPitfall: 'Достаточно логов; metrics только SRE; grep без traceId/businessKey; нет business dashboard.',
        productionNote: 'Без business metrics инцидент обнаруживают клиенты, не команда.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Metrics', meaning: 'Числовые агрегаты во времени — для алертов и dashboards.' },
        { term: 'Structured logging', meaning: 'JSON-логи с полями для search, не free text.' },
        { term: 'Distributed trace', meaning: 'Span chain с общим traceId через сервисы.' },
        { term: 'RED method', meaning: 'Rate, Errors, Duration — метрики API-сервиса.' },
        { term: 'USE method', meaning: 'Utilization, Saturation, Errors — infra/resources.' },
        { term: 'Correlation id', meaning: 'Сквозной id запроса в logs/traces (traceId).' },
        { term: 'Business metrics', meaning: 'KPI домена: статусы заявок, age, SLA.' },
        { term: 'Consumer lag', meaning: 'Отставание consumer — signal Kafka pipeline stuck.' },
      ],
      lecturerNotes: [
        'Закрыть слот: сильные/слабые стороны по 0–3 матрице int-prod-00.',
        'Если время 2 мин — один вопрос «заявки stuck — что откроете?» достаточно.',
        'Senior: полная chain + alert design, не только «посмотрю логи».',
      ],
      estimatedMinutes: 3,
    }),
    topic({
      id: 'int-prod-16',
      title: 'Прод-кейсы — разбор инцидентов',
      priority: 'core',
      simpleDefinitionOverride:
        'Пять типовых прод-кейсов для проверки рассуждения, если кандидат не приводит свой опыт. Формат каждого: симптом → первые проверки → сильный ответ → уточнение → красные флаги → вывод ведущего. Не заученный ответ — порядок диагностики и связь с int-prod-07–14.',
      quickAnswer:
        'Кейс 1 — дубль Kafka, 2 — outbox/rollback, 3 — Camunda застрял, 4 — таймауты PG, 5 — pod + Kafka. Задавать по слабой зоне. 3–5 мин на кейс. Оценка: диагностика → первопричина → исправление (идемпотентность/outbox/graceful) → что мониторить.',
      explainBrief: [
        '1. Кейс 1 — дубль Kafka: at-least-once, rebalance/deploy, таблица dedup (int-prod-08/09).',
        '2. Кейс 2 — событие без строки в БД: dual-write, outbox (int-prod-07).',
        '3. Кейс 3 — Camunda застрял: проглоченный 500, incident (int-prod-12).',
        '4. Кейс 4 — таймауты PG после релиза: pool, N+1, EXPLAIN (int-prod-13).',
        '5. Кейс 5 — pod умер: SIGTERM, grace period, повторная доставка (int-prod-14).',
        '6. Полный runbook каждого кейса — в codeExample.snippet ниже.',
        '7. Вывод: кейсы отделяют Middle (теория) от Senior (метрики + fix + профилактика).',
      ],
      questionPlan: [
        {
          question: 'Какой кейс задать?',
          answerHint:
            'Сильный выбор по слабой зоне: Kafka → 1/2; Camunda → 3; БД → 4; K8s → 5. Follow-up: «свой похожий инцидент?» Red flag: зачитывать готовый ответ из карточки.',
        },
        {
          question: 'Сколько времени на кейс?',
          answerHint:
            'Сильный темп: 3–5 мин на ход рассуждений, не энциклопедия. Follow-up: «что проверите первым?» Red flag: 15 минут лекции про Kafka.',
        },
        {
          question: 'Критерий сильного ответа?',
          answerHint:
            'Сильный ответ: метрики первыми, первопричина, идемпотентность/outbox/graceful — не «перезапустим». Red flag: прыжок к fix без диагностики.',
        },
        {
          question: 'Когда подсказывать?',
          answerHint:
            'После 2 мин тишины — «какие метрики откроете?»; не давать готовый ответ. Red flag: подсказать root cause до попытки кандидата.',
        },
        {
          question: 'Как фиксировать оценку?',
          answerHint:
            '0–3 сразу после кейса в заметках; вывод ведущего вслух не обязателен. Follow-up: «что бы вы изменили в архитектуре после инцидента?»',
        },
      ],
      extraKeyPoints: [
        'Не зачитывать кейс целиком — только симптом, слушать рассуждение кандидата.',
        'Сильный кандидат сам ссылается на int-prod-07/08 без подсказки.',
        'Общий красный флаг: прыжок к решению без диагностики.',
        'Можно комбинировать: кейс 2 + цепочка observability (int-prod-15).',
      ],
      interviewFocus: [
        {
          question: 'Кейс 1: платёж применился дважды после deploy. Ваш разбор?',
          expectedAnswer:
            'Симптом: двойное списание, две строки с одним event_id или businessKey. Первые проверки: логи consumer — один event_id обработан дважды; совпадение по времени с deploy/rebalance; момент commit offset. Сильный ответ: повторная доставка at-least-once, rebalance или graceful shutdown без dedup (int-prod-08/09/14). Исправление: UNIQUE на processed_events + идемпотентный handler. Уточнение: «offset коммитить до или после транзакции БД?» Красные флаги: «Kafka exactly-once всё спасёт». Вывод ведущего: 3 — был прод-инцидент с dedup; 1 — утверждает, что дублей в Kafka не бывает.',
        },
        {
          question: 'Кейс 2: PaymentCompleted в Kafka, записи в payment БД нет.',
          expectedAnswer:
            'Симптом: consumer или оркестратор видит событие, SELECT в payment пустой. Первые проверки: порядок в коде save→send; таблица outbox пустая или без публикации; логи rollback транзакции. Сильный ответ: dual-write без outbox — send до commit или после rollback (int-prod-07). Исправление: transactional outbox в одной транзакции с бизнес-данными, poller публикует позже. Уточнение: «@Transactional на метод с kafkaTemplate.send()?» Красные флаги: тот же «фикс» через одну транзакцию. Вывод ведущего: 3 — outbox + poller; 0 — «Kafka transactional достаточно».',
        },
        {
          question: 'Кейс 3: Camunda процесс застрял на CreatePayment, payment был недоступен.',
          expectedAnswer:
            'Симптом: процесс активен на шаге CreatePayment, открытый incident или «тихий» застой. Первые проверки: Camunda Operate — incidents; логи delegate — 500 проглочен? retry исчерпан? Сильный ответ: throw при 500, retry, incident; не catch-and-continue (int-prod-12). Исправление: проброс ошибки + идемпотентный повтор payment. Уточнение: «422 недостаточно средств — то же, что 500?» Красные флаги: пометить шаг успешным при 500. Вывод ведущего: 3 — workflow с incident; 1 — только «добавим retry» без понимания проглатывания ошибки.',
        },
        {
          question: 'Кейс 4: после релиза выросли таймауты PostgreSQL.',
          expectedAnswer:
            'Симптом: JDBC timeout, HTTP 504, растёт pending в пуле. Первые проверки: метрики Hikari; pg_stat_activity на locks; top slow queries в pg_stat_statements; trace на N+1; EXPLAIN нового запроса (int-prod-13). Сильный ответ: исчерпан pool + N+1 в новом endpoint, не scale RDS первым делом. Исправление: fetch join, индекс, короче транзакция; временно feature flag. Уточнение: «есть idle in transaction?» Красные флаги: только увеличить timeout; индекс на всё подряд. Вывод ведущего: 3 — 8-шаговый runbook; 2 — pool + N+1 без EXPLAIN.',
        },
        {
          question: 'Кейс 5: rolling update → дубли при обработке Kafka.',
          expectedAnswer:
            'Симптом: дубли совпадают по времени с окном deploy. Первые проверки: события завершения pod в K8s; grace period vs p99 обработки; commit offset в логах (int-prod-14). Сильный ответ: SIGTERM посередине обработки, offset не закоммичен, повторная доставка + нет dedup. Исправление: graceful stop listener, grace ≥ p99, идемпотентность. Уточнение: «readiness vs liveness при shutdown?» Красные флаги: «повторов не будет»; commit offset сразу после poll. Вывод ведущего: 3 — связка K8s + Kafka + dedup; 1 — «Kubernetes сам всё корректно завершит».',
        },
      ],
      codeExample: {
        title: 'Карточки прод-кейсов — полный формат',
        language: 'text',
        snippet: `КЕЙС 1 — Дубль платежа в Kafka
Симптом: двойное списание; тикет в поддержку после deploy в 14:00
Первые проверки:
  - логи: один event_id обработан дважды, разные имена pod
  - метрики: всплеск rebalance, краткий рост consumer lag
  - таймлайн: окно deploy = окно дублей
Что должен сказать сильный кандидат:
  повторная доставка at-least-once; commit offset после tx;
  rebalance (int-prod-09) или убийство pod (int-prod-14);
  исправление: UNIQUE на processed_events + идемпотентный handler (int-prod-08)
Уточнение: «Что если commit offset до транзакции БД?»
Красные флаги: Kafka exactly-once без бизнес-dedup; «Kafka не дублирует»
Вывод ведущего: 3 = был прод-инцидент с dedup; 1 = отрицает дубли

КЕЙС 2 — Событие опубликовано, транзакция БД откатилась
Симптом: PaymentCompleted в consumer; строки в payment БД нет
Первые проверки:
  - код: порядок save() затем kafkaTemplate.send()
  - outbox: пусто или send без соответствующей бизнес-строки
  - логи: rollback после успешного send
Что должен сказать сильный кандидат:
  проблема dual-write (int-prod-07); @Transactional не объединяет PG и Kafka;
  исправление: outbox в той же tx, poller публикует, consumer всё равно идемпотентен
Уточнение: «Почему не @Transactional на весь метод?»
Красные флаги: @Transactional «чинит» Kafka+БД; «send почти никогда не падает»
Вывод ведущего: 3 = outbox; 0 = dual-write норм

КЕЙС 3 — Camunda застрял после 500 от payment
Симптом: процесс на CreatePayment часами; клиент ждёт
Первые проверки:
  - Camunda Operate: incidents, failed jobs
  - логи delegate: 500 пойман и залогирован без throw?
  - метрики payment: outage в то же время
Что должен сказать сильный кандидат:
  проглоченный 500 = ложный успех ИЛИ incident после retry (int-prod-12);
  исправление: throw/BpmnError; идемпотентный payment при retry job
Уточнение: «422 бизнес-отказ — то же, что 500?»
Красные флаги: catch and continue; success при 500
Вывод ведущего: 3 = incident + модель ошибок; 1 = только «добавим retry»

КЕЙС 4 — Таймауты PG после релиза
Симптом: всплеск 504/JDBC timeout с момента deploy
Первые проверки:
  - hikari.connections.pending, active
  - pg_stat_activity: locks, idle in transaction
  - pg_stat_statements: новый медленный запрос
  - trace: HTTP → 200 SQL (N+1)
  - EXPLAIN ANALYZE запроса нового endpoint
Что должен сказать сильный кандидат:
  8-шаговый runbook (int-prod-13); pool vs медленный запрос;
  временно feature flag; долгосрочно fetch join + индекс
Уточнение: «Pool в норме, но один запрос 30 сек?»
Красные флаги: сначала scale RDS; timeout навсегда; индекс на все колонки
Вывод ведущего: 3 = системный runbook; 2 = N+1 без проверки locks

КЕЙС 5 — Pod умер посередине обработки Kafka
Симптом: дубль после rolling update
Первые проверки:
  - события K8s: SIGTERM, OOMKilled?, значение grace period
  - consumer: offset закоммичен? длительность обработки vs grace
  - метрики rebalance при deploy
Что должен сказать сильный кандидат:
  SIGTERM → grace → SIGKILL посередине tx → повторная доставка (int-prod-14);
  исправление: graceful stop, grace ≥ p99, dedup (int-prod-08)
Уточнение: «Readiness vs liveness при shutdown?»
Красные флаги: K8s сам graceful; commit при poll; «повторов не будет»
Вывод ведущего: 3 = цепочка K8s+Kafka+идемпотентность; 1 = «перезапуск решит»`,
        walkthrough: [
          'Озвучить только симптом — слушать, какие первые проверки назовёт кандидат.',
          'Подсказка после паузы: «какие метрики откроете первыми?» — не читать карточку вслух.',
          'После кейса — вывод 0–3 в заметках, не обязательно вслух.',
        ],
        commonPitfall: 'Прыжок к исправлению без диагностики; не знает at-least-once; «перезапустим pod/consumer».',
        productionNote: 'Кейсы отделяют Middle с теорией от Senior с боевым опытом и метриками.',
      },
      usefulLinksOverride: PROD_LINKS,
      glossary: [
        { term: 'Первопричина (root cause)', meaning: 'Настоящая причина — dual-write, нет dedup, проглоченный 500, а не симптом.' },
        { term: 'Повторная доставка (redelivery)', meaning: 'Kafka прислал сообщение снова — норма при at-least-once.' },
        { term: 'Rolling update', meaning: 'Поочерёдная замена pod при деплое — частый триггер rebalance и дублей.' },
        { term: 'Dual-write', meaning: 'Запись в БД и Kafka без общей транзакции — типичная причина кейса 2.' },
        { term: 'Incident (Camunda)', meaning: 'Запись о failed job для ручного разбора — кейс 3.' },
        { term: 'Первые проверки', meaning: 'Метрики и логи, которые открывают до гипотезы об исправлении.' },
      ],
      lecturerNotes: [
        'Кейсы 1–2 — блок Kafka; 3 — Camunda; 4 — JPA/PG; 5 — K8s. Подставлять вместо слабого ответа по теме.',
        'Вывод 0–3 фиксировать сразу; кейс может заменить целую тему при нехватке времени.',
        'Не давать больше одного кейса за слот — максимум 3–5 минут.',
      ],
      estimatedMinutes: 3,
    }),
  ],
};
