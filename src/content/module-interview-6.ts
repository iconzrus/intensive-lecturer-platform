import type { LectureModule } from './schema';
import { topic } from './module-1';

type QuestionDef = {
  id: string;
  title: string;
  answer: string;
  practicalHint?: string;
  pitfall?: string;
  prevention?: string;
};

type Interview6Category =
  | 'kafka'
  | 'sql'
  | 'grpc'
  | 'scheduler'
  | 'oop'
  | 'collections'
  | 'jvm'
  | 'spring'
  | 'graphql'
  | 'hibernate';

const INTERVIEW6_LINKS = [
  {
    title: 'Apache Kafka Documentation',
    url: 'https://kafka.apache.org/documentation/',
    description: 'Топики, consumer groups, гарантии доставки, lag и эксплуатационные паттерны.',
  },
  {
    title: 'Spring Framework Reference',
    url: 'https://docs.spring.io/spring-framework/reference/',
    description: 'IoC/DI, AOP, транзакции, proxy и жизненный цикл bean.',
  },
  {
    title: 'Spring Boot Reference',
    url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/',
    description: 'Auto-configuration, starters, actuator и embedded server conventions.',
  },
  {
    title: 'Hibernate ORM Documentation',
    url: 'https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html',
    description: 'Persistence context, fetch, Criteria API, кэши и транзакции.',
  },
  {
    title: 'PostgreSQL Documentation',
    url: 'https://www.postgresql.org/docs/current/index.html',
    description: 'WHERE/HAVING, блокировки, EXPLAIN и практики запросов.',
  },
  {
    title: 'gRPC Documentation',
    url: 'https://grpc.io/docs/',
    description: 'Контракты, Protobuf, streaming и интеграционные практики.',
  },
  {
    title: 'GraphQL Documentation',
    url: 'https://graphql.org/learn/',
    description: 'Схема, запросы, overfetching/underfetching и ограничения сложности.',
  },
  {
    title: 'GraphQL Java',
    url: 'https://www.graphql-java.com/documentation/',
    description: 'Реализация GraphQL на JVM, DataLoader и интеграция со Spring.',
  },
  {
    title: 'JUnit 5 User Guide',
    url: 'https://junit.org/junit5/docs/current/user-guide/',
    description: 'Структура тестов, lifecycle и интеграционные сценарии.',
  },
  {
    title: 'Testcontainers Documentation',
    url: 'https://java.testcontainers.org/',
    description: 'Реальный Kafka/PostgreSQL в контейнерах для интеграционных тестов.',
  },
];

const CATEGORY_EXPLAIN_TAIL: Record<Interview6Category, string[]> = {
  kafka: [
    'По Kafka важно мышление эксплуатации: lag, rebalancing, offset commit, идемпотентность и DLQ.',
    'Сильный ответ связывает гарантии брокера с бизнес-идемпотентностью консюмера, а не только теорию.',
  ],
  sql: [
    'По SQL важно видеть порядок выполнения: фильтрация строк, группировка, фильтрация групп.',
    'Хороший ответ подкрепляется мини-примером и проверкой через EXPLAIN/логи.',
  ],
  grpc: [
    'По gRPC важно различать “теоретически возможно” и “стандартный production-выбор”.',
    'Сильный ответ объясняет contract-first, типизацию и совместимость версий схемы.',
  ],
  scheduler: [
    'По scheduler важно понимать разницу между локальным cron и распределённым запуском в кластере.',
    'На собесе ожидается идемпотентность job и защита от параллельного запуска на нескольких pod.',
  ],
  oop: [
    'По ООП важны границы применимости: когда наследование помогает, а когда создаёт хрупкую иерархию.',
    'Сильный ответ показывает trade-off между моделированием домена и overengineering.',
  ],
  collections: [
    'По коллекциям важно знать контракты интерфейсов и асимптотику операций в реальных структурах.',
    'Хороший ответ связывает выбор структуры с паттерном доступа: поиск, вставка, порядок, потокобезопасность.',
  ],
  jvm: [
    'По JVM-памяти важно различать stack, heap, metaspace и где лежат ссылки vs объекты.',
    'Сильный ответ объясняет immutability String и отличие pool/caching от “магии GC”.',
  ],
  spring: [
    'По Spring важна механика контейнера: registry bean, proxy, transactional boundary и self-invocation.',
    'Хороший ответ отделяет Spring Framework от Spring Boot auto-configuration.',
  ],
  graphql: [
    'По GraphQL важно видеть плюсы для read-моделей и минусы для кеширования, безопасности и N+1.',
    'Сильный ответ упоминает DataLoader и контроль complexity/depth запросов.',
  ],
  hibernate: [
    'По Hibernate важны persistence context, lazy loading, N+1 и границы транзакции.',
    'Хороший ответ показывает диагностику через SQL/logs, fetch join и осознанный выбор Criteria API.',
  ],
};

const CATEGORY_PRACTICAL_HINT: Record<Interview6Category, string> = {
  kafka:
    'Практический ответ: какой был lag, как настраивали retry/backoff/DLQ, как обеспечивали идемпотентность и какие тесты с реальным брокером запускали.',
  sql:
    'Практический ответ: показать запрос с WHERE и HAVING, объяснить план выполнения и как проверяли эффект через EXPLAIN.',
  grpc:
    'Практический ответ: описать .proto-контракт, генерацию stubs, versioning полей и почему выбрали gRPC вместо REST для конкретного кейса.',
  scheduler:
    'Практический ответ: какой scheduler использовали (@Scheduled, Quartz, K8s CronJob), как исключали двойной запуск и что делали при падении pod.',
  oop:
    'Практический ответ: пример из кода, где наследование/композиция реально упростили домен, и где пришлось отказаться от “жирной” иерархии.',
  collections:
    'Практический ответ: какую структуру выбрали в сервисе, какой был паттерн доступа и какая проблема решалась (latency, память, порядок).',
  jvm:
    'Практический ответ: кейс с памятью/GC/утечкой или объяснение бага из-за equals/hashCode/immutability на реальном инциденте.',
  spring:
    'Практический ответ: как устроен контекст в проекте, как проверяли tx/proxy в рантайме и какие starter/auto-config реально использовали.',
  graphql:
    'Практический ответ: где GraphQL дал выигрыш клиенту, как боролись с N+1 и какие ограничения query complexity вводили.',
  hibernate:
    'Практический ответ: как ловили N+1/LazyInitializationException, какие fetch-стратегии и блокировки применяли в проде.',
};

const CATEGORY_PITFALL: Record<Interview6Category, string> = {
  kafka: 'Считать Kafka “очередью с exactly-once” без идемпотентного консюмера, DLQ и мониторинга lag.',
  sql: 'Путать WHERE и HAVING или фильтровать агрегаты в WHERE вместо HAVING после GROUP BY.',
  grpc: 'Утверждать, что Protobuf единственно возможен теоретически, но не объяснить production-стандарт .proto.',
  scheduler: 'Запускать одну бизнес-job параллельно на всех pod без distributed lock/leader election.',
  oop: 'Строить глубокие иерархии с обязательными методами для всех наследников (классическая ловушка Bird.fly()).',
  collections: 'Выбирать LinkedList “для скорости” без понимания O(n) поиска и cache locality.',
  jvm: 'Путать String pool с обычным heap-кэшем и думать, что `new String("x")` всегда переиспользует literal.',
  spring: 'Смешивать Spring Framework и Spring Boot, считая auto-configuration частью “чистого Spring”.',
  graphql: 'Воспринимать GraphQL как замену REST везде, игнорируя кеширование, безопасность и операционную сложность.',
  hibernate: 'Лечить N+1 только `@Transactional` на контроллере, не глядя SQL и fetch plan.',
};

const CATEGORY_PREVENTION: Record<Interview6Category, string> = {
  kafka: 'Проектировать consumer как at-least-once + идемпотентность, retry/backoff, DLQ, observability lag/offset.',
  sql: 'Строить запрос по этапам: WHERE -> GROUP BY -> HAVING; проверять EXPLAIN и кардинальность.',
  grpc: 'Держать contract-first .proto, semver полей, backward compatibility и явные SLA latency.',
  scheduler: 'Делать job идемпотентной, координировать запуск (ShedLock/DB lock/leader), логировать owner и timeout.',
  oop: 'Моделировать поведение через интерфейсы/композицию, наследование — только для устойчивого is-a.',
  collections: 'Выбирать структуру по dominant operation: get/put/iterate/order/thread-safety.',
  jvm: 'Разделять stack/heap/metaspace, понимать immutability и когда нужен intern/кэш boxed-типов.',
  spring: 'Проверять proxy/tx границы, DI через конструктор, auto-config — как Boot-надстройку.',
  graphql: 'Ограничивать глубину/сложность, использовать DataLoader, мониторить resolver latency.',
  hibernate: 'Смотреть SQL, fetch join/entity graph, версионирование и осознанные блокировки в транзакции.',
};

const CATEGORY_FOLLOW_UP: Record<Interview6Category, { question: string; hint: string }> = {
  kafka: {
    question: 'Какой минимальный набор метрик и алертов нужен для Kafka consumer в проде?',
    hint: 'Lag, error rate, rebalance events, processing time, DLQ depth, offset commit failures.',
  },
  sql: {
    question: 'Как быстро доказать, что HAVING применён корректно, а не “случайно заработало”?',
    hint: 'EXPLAIN, сравнение cardinality до/после GROUP BY, тестовый запрос с малым набором данных.',
  },
  grpc: {
    question: 'Как вы обеспечиваете совместимость .proto между сервисами при релизах?',
    hint: 'Правила field numbering, optional/required эволюция, consumer-driven checks, breaking change policy.',
  },
  scheduler: {
    question: 'Что произойдёт, если два pod одновременно запустят одну scheduled job?',
    hint: 'Нужен distributed coordination; без него — дубли бизнес-эффекта, гонки, двойные списания.',
  },
  oop: {
    question: 'Какой признак показывает, что иерархия наследования пора разрезать?',
    hint: 'Пустые overrides, instanceof-лесенки, нарушение LSP, рост связанности при добавлении типа.',
  },
  collections: {
    question: 'Какой симптом в проде подскажет неверный выбор коллекции?',
    hint: 'Деградация latency на поиске, рост памяти, частые rehash/resize, lock contention.',
  },
  jvm: {
    question: 'Как отличить проблему heap от metaspace по симптомам?',
    hint: 'OOM типа, GC-логи, что растёт: объекты домена vs class metadata/генерируемые классы.',
  },
  spring: {
    question: 'Как в рантайме убедиться, что @Transactional реально сработал?',
    hint: 'Tx active log/trace, SQL begin/commit, отсутствие self-invocation, тип proxy (JDK/CGLIB).',
  },
  graphql: {
    question: 'Какой контроль нужен, чтобы один “тяжёлый” GraphQL-запрос не положил API?',
    hint: 'Query depth/complexity limits, timeouts, DataLoader batching, rate limit per client.',
  },
  hibernate: {
    question: 'Как за 10 минут подтвердить N+1 в конкретном endpoint?',
    hint: 'SQL log count, Hibernate statistics, trace с числом SELECT, сравнение с fetch join вариантом.',
  },
};

const CATEGORY_LECTURER_NOTES: Record<Interview6Category, string[]> = {
  kafka: [
    'Если кандидат не упомянул Testcontainers/Embedded Kafka — уточнить, как вообще проверяли consumer.',
    'На partitions vs instances обязательно попросить нарисовать 4 pod / 3 partitions и обратный кейс.',
  ],
  sql: [
    'Попросите переписать условие с ошибочным WHERE на HAVING — это быстрый фильтр глубины.',
  ],
  grpc: [
    'Важно услышать: Protobuf не единственный теоретический формат, но де-факто стандарт в gRPC ecosystem.',
  ],
  scheduler: [
    'Вопрос про два инстанса и LIMIT 10 — проверка distributed coordination, не Java Lock.',
  ],
  oop: [
    'Bird/Penguin — классическая ловушка LSP; ждём Flyable или композицию, не “пингвин летает”.',
  ],
  collections: [
    'HashMap — спросить про equals/hashCode контракт и treeification при длинных bucket chains.',
  ],
  jvm: [
    'String: развести literal, new String, intern(); String Pool в heap, не в Metaspace.',
  ],
  spring: [
    'Контекст как Map — хороший образ, но уточнить BeanDefinition и singleton registry.',
    'final + @Transactional — связать с proxy mode, не оставлять ответ “заработает всегда”.',
  ],
  graphql: [
    'Если кандидат хвалит GraphQL без минусов — углубить в caching и security.',
  ],
  hibernate: [
    'Criteria API — спросить, когда предпочли JPQL/QueryDSL/native SQL вместо Criteria.',
  ],
};

type PlanPrompt = { question: string; hintPrefix: string };

const CATEGORY_DEEP_DIVE_PROMPTS: Record<Interview6Category, PlanPrompt[]> = {
  kafka: [
    { question: 'Какой production-кейс по "{topic}" вы разбирали по lag или rebalance?', hintPrefix: 'Нужны цифры lag, причина и фикс.' },
    { question: 'Как по "{topic}" устроены retry topics и DLQ?', hintPrefix: 'Опишите poison pill handling и backoff.' },
    { question: 'Как тестировали "{topic}" с реальным брокером?', hintPrefix: 'Testcontainers/Embedded Kafka/TopologyTestDriver.' },
  ],
  sql: [
    { question: 'Покажи запрос по "{topic}" с WHERE и HAVING на реальной таблице.', hintPrefix: 'Нужен осмысленный GROUP BY пример.' },
    { question: 'Как по "{topic}" проверяли план выполнения?', hintPrefix: 'EXPLAIN, метрики, cardinality.' },
    { question: 'Какая ошибка в "{topic}" чаще всего ломает отчёт?', hintPrefix: 'Фильтрация не на том этапе.' },
  ],
  grpc: [
    { question: 'Почему для "{topic}" выбрали gRPC, а не REST?', hintPrefix: 'Latency, streaming, строгий контракт.' },
    { question: 'Как версионировали контракт в "{topic}"?', hintPrefix: 'Backward compatibility и policy релизов.' },
    { question: 'Где "{topic}" использует .proto как source of truth?', hintPrefix: 'Codegen stubs, CI проверка breaking changes.' },
  ],
  scheduler: [
    { question: 'Как по "{topic}" исключали параллельный запуск на двух pod?', hintPrefix: 'ShedLock/DB lock/leader election.' },
    { question: 'Как сделали job по "{topic}" идемпотентной?', hintPrefix: 'Business key, dedup, safe retry.' },
    { question: 'Какой инцидент был из-за scheduler по "{topic}"?', hintPrefix: 'Двойной запуск, пропуск, зависание lock.' },
  ],
  oop: [
    { question: 'Где в коде "{topic}" наследование было оправдано?', hintPrefix: 'Устойчивый is-a и контракт.' },
    { question: 'Где по "{topic}" перешли на композицию?', hintPrefix: 'Слабая связь и тестируемость.' },
    { question: 'Какой LSP-контрпример связан с "{topic}"?', hintPrefix: 'Penguin/Struthio или fat interface.' },
  ],
  collections: [
    { question: 'Какую структуру выбрали для "{topic}" и почему?', hintPrefix: 'Dominant operations и асимптотика.' },
    { question: 'Какой баг из-за equals/hashCode был в "{topic}"?', hintPrefix: 'Конкретный Map/Set инцидент.' },
    { question: 'Когда "{topic}" деградировала на нагрузке?', hintPrefix: 'Профиль, размер, rehash, lock.' },
  ],
  jvm: [
    { question: 'Где объекты темы "{topic}" лежат в памяти?', hintPrefix: 'Stack vs heap vs metaspace.' },
    { question: 'Какой инцидент связан с "{topic}" на проде?', hintPrefix: 'OOM, leak, неверный intern/pool.' },
    { question: 'Как проверили гипотезу по "{topic}"?', hintPrefix: 'Heap dump, GC log, jcmd.' },
  ],
  spring: [
    { question: 'Как в рантайме проверили "{topic}"?', hintPrefix: 'Proxy, tx log, bean scope.' },
    { question: 'Где "{topic}" ломается из-за self-invocation?', hintPrefix: 'Внутренний вызов без proxy.' },
    { question: 'Что Boot добавил к "{topic}" поверх Framework?', hintPrefix: 'Auto-config vs core container.' },
  ],
  graphql: [
    { question: 'Где GraphQL в "{topic}" реально ускорил фронт?', hintPrefix: 'Меньше round-trips, выбор полей.' },
    { question: 'Как боролись с N+1 в "{topic}"?', hintPrefix: 'DataLoader, batching, fetch plan.' },
    { question: 'Какие лимиты query ввели для "{topic}"?', hintPrefix: 'Depth/complexity/rate limit.' },
  ],
  hibernate: [
    { question: 'Какой SQL увидели по "{topic}" в логах?', hintPrefix: 'Число запросов, N+1, fetch.' },
    { question: 'Когда Criteria API по "{topic}" оправдан?', hintPrefix: 'Динамические фильтры vs читаемость.' },
    { question: 'Какой LazyInitialization кейс был в "{topic}"?', hintPrefix: 'Граница tx/session, DTO.' },
  ],
};

const CATEGORY_RISK_PROMPTS: Record<Interview6Category, PlanPrompt[]> = {
  kafka: [
    { question: 'Какой fail-case по "{topic}" обязателен в тестах?', hintPrefix: 'Rebalance, duplicate, broker down.' },
    { question: 'Как по "{topic}" ограничить бесконечные ретраи?', hintPrefix: 'Max attempts, DLQ, backoff cap.' },
    { question: 'Что будет при poison message в "{topic}"?', hintPrefix: 'DLQ, skip, manual replay policy.' },
  ],
  sql: [
    { question: 'Какая ошибка в "{topic}" даёт неверную агрегацию?', hintPrefix: 'WHERE вместо HAVING.' },
    { question: 'Как по "{topic}" не сломать отчёт на больших данных?', hintPrefix: 'Индексы, фильтры, лимиты.' },
    { question: 'Как откатить изменение запроса по "{topic}"?', hintPrefix: 'Feature flag, dual query period.' },
  ],
  grpc: [
    { question: 'Какой breaking change в "{topic}" опасен?', hintPrefix: 'Удаление/смена типа поля без versioning.' },
    { question: 'Что при timeout в "{topic}" на стороне клиента?', hintPrefix: 'Retry idempotency, deadline.' },
    { question: 'Как мониторить "{topic}" в проде?', hintPrefix: 'Latency, error rate, payload size.' },
  ],
  scheduler: [
    { question: 'Что если pod умер посередине job по "{topic}"?', hintPrefix: 'Lease timeout, reclaim, idempotency.' },
    { question: 'Как по "{topic}" избежать starvation задач?', hintPrefix: 'Fairness, SKIP LOCKED, batch size.' },
    { question: 'Какой риск у cron без timezone в "{topic}"?', hintPrefix: 'DST, drift, double fire.' },
  ],
  oop: [
    { question: 'Какой антипаттерн в "{topic}" ломает расширяемость?', hintPrefix: 'God class, deep hierarchy.' },
    { question: 'Где "{topic}" нарушает LSP на практике?', hintPrefix: 'Неожиданное поведение подтипа.' },
    { question: 'Как упростить дизайн по "{topic}" без big-bang refactor?', hintPrefix: 'Extract interface, composition.' },
  ],
  collections: [
    { question: 'Какой worst-case по "{topic}" важен на собесе?', hintPrefix: 'O(n) search, hash collisions.' },
    { question: 'Почему synchronized Stack плох для "{topic}"?', hintPrefix: 'Legacy, Deque alternatives.' },
    { question: 'Как concurrency ломает "{topic}"?', hintPrefix: 'Non-thread-safe structure under load.' },
  ],
  jvm: [
    { question: 'Какой OOM по "{topic}" вы видели?', hintPrefix: 'Heap vs metaspace, leak vs peak.' },
    { question: 'Почему mutating String опасен в "{topic}"?', hintPrefix: 'Immutability, shared pool/literals.' },
    { question: 'Когда intern() вреден в "{topic}"?', hintPrefix: 'Heap pressure, unbounded String Pool, memory retention.' },
  ],
  spring: [
    { question: 'Что сломается в "{topic}" при final class + CGLIB?', hintPrefix: 'Proxy cannot subclass final.' },
    { question: 'Как self-invocation ломает "{topic}"?', hintPrefix: 'Tx/AOP bypass.' },
    { question: 'Какой симптом неверного scope в "{topic}"?', hintPrefix: 'Stale state, memory leak.' },
  ],
  graphql: [
    { question: 'Какой DoS-риск у "{topic}"?', hintPrefix: 'Deep query, fan-out resolvers.' },
    { question: 'Почему CDN-кеш плохо дружит с "{topic}"?', hintPrefix: 'POST queries, per-client shape.' },
    { question: 'Как versioning в "{topic}" сложнее REST?', hintPrefix: 'Implicit schema evolution.' },
  ],
  hibernate: [
    { question: 'Как N+1 проявится в "{topic}" под нагрузкой?', hintPrefix: 'Latency spike, DB CPU.' },
    { question: 'Какой риск optimistic lock в "{topic}"?', hintPrefix: 'Conflict storm, retry UX.' },
    { question: 'Когда Criteria по "{topic}" хуже JPQL?', hintPrefix: 'Verbosity, reviewability.' },
  ],
};

const CATEGORY_ROLLOUT_PROMPTS: Record<Interview6Category, PlanPrompt[]> = {
  kafka: [
    { question: 'Какой trade-off по "{topic}": latency vs durability?', hintPrefix: 'acks, replication, batching.' },
    { question: 'Exactly-once в "{topic}" — где граница обещания?', hintPrefix: 'Broker vs business effect.' },
    { question: 'Как масштабировать consumer по "{topic}"?', hintPrefix: 'Partitions cap parallelism.' },
  ],
  sql: [
    { question: 'Trade-off: фильтр в WHERE vs в HAVING в "{topic}"?', hintPrefix: 'Раннее отсечение vs агрегат.' },
    { question: 'Когда денормализация лучше тяжёлого "{topic}"?', hintPrefix: 'Read model, materialized view.' },
    { question: 'Как безопасно менять отчётный запрос "{topic}"?', hintPrefix: 'Shadow compare metrics.' },
  ],
  grpc: [
    { question: 'Trade-off gRPC vs REST в "{topic}"?', hintPrefix: 'Tooling, browser, human debug.' },
    { question: 'Unary vs streaming в "{topic}"?', hintPrefix: 'Backpressure, complexity.' },
    { question: 'JSON transcoding для "{topic}" — когда уместен?', hintPrefix: 'Edge gateway, not core contract.' },
  ],
  scheduler: [
    { question: 'fixedRate vs fixedDelay в "{topic}"?', hintPrefix: 'Overlap risk under slow job.' },
    { question: 'Cron в app vs K8s CronJob для "{topic}"?', hintPrefix: 'Ops ownership, scaling.' },
    { question: 'Trade-off DB lock vs Redis lock в "{topic}"?', hintPrefix: 'Consistency, TTL, fencing.' },
  ],
  oop: [
    { question: 'Наследование vs композиция в "{topic}"?', hintPrefix: 'Coupling, testability.' },
    { question: 'Когда SOLID избыточен для "{topic}"?', hintPrefix: 'Small module, YAGNI.' },
    { question: 'ISP vs fat interface в "{topic}"?', hintPrefix: 'Split ports by client.' },
  ],
  collections: [
    { question: 'ArrayList vs LinkedList для "{topic}"?', hintPrefix: 'Random access vs insert middle.' },
    { question: 'HashMap vs TreeMap в "{topic}"?', hintPrefix: 'O(1) avg vs sorted order O(log n).' },
    { question: 'Когда concurrent collection нужна в "{topic}"?', hintPrefix: 'Visibility, atomic compound ops.' },
  ],
  jvm: [
    { question: 'Heap tuning trade-off для "{topic}"?', hintPrefix: 'Throughput vs pause time.' },
    { question: 'Когда boxed cache в "{topic}" вводит в заблуждение?', hintPrefix: 'Identity vs value equality.' },
    { question: 'String concatenation vs Builder в "{topic}"?', hintPrefix: 'Loop in hot path.' },
  ],
  spring: [
    { question: 'Constructor vs field injection в "{topic}"?', hintPrefix: 'Testability, immutability.' },
    { question: 'JDK proxy vs CGLIB в "{topic}"?', hintPrefix: 'Interface requirement, final limits.' },
    { question: 'Boot auto-config vs explicit beans в "{topic}"?', hintPrefix: 'Predictability, overrides.' },
  ],
  graphql: [
    { question: 'GraphQL vs BFF REST в "{topic}"?', hintPrefix: 'Team boundaries, cache.' },
    { question: 'Schema stitching cost в "{topic}"?', hintPrefix: 'Ownership, latency.' },
    { question: 'Pagination style trade-off в "{topic}"?', hintPrefix: 'Cursor vs offset cost.' },
  ],
  hibernate: [
    { question: 'Lazy vs eager в "{topic}"?', hintPrefix: 'N+1 vs overfetch memory.' },
    { question: '2nd level cache trade-off в "{topic}"?', hintPrefix: 'Stale reads, invalidation.' },
    { question: 'JPQL vs native SQL в "{topic}"?', hintPrefix: 'Portability vs performance.' },
  ],
};

const CATEGORY_CODE_EXAMPLE: Record<
  Interview6Category,
  { title: string; snippet: string; walkthrough: string[]; pitfall: string; productionNote: string }
> = {
  kafka: {
    title: 'Kafka: lifecycle + retry/DLQ/idempotency',
    snippet: `consume -> validate -> idempotent handler (business key)
  | ok -> commit offset
  | transient -> retry topic + exponential backoff
  | poison -> DLQ + alert + manual replay policy
monitor: consumer lag, rebalance, processing time`,
    walkthrough: [
      'At-least-once — норма; бизнес-идемпотентность обязательна даже при EOS брокера.',
      'Poison pill без DLQ зацикливает consumer и растит lag.',
    ],
    pitfall: 'Коммитить offset до успешной бизнес-обработки без идемпотентности.',
    productionNote: 'Интеграционные тесты: Testcontainers Kafka / Embedded Kafka / Streams TopologyTestDriver.',
  },
  sql: {
    title: 'SQL: WHERE vs HAVING',
    snippet: `SELECT user_id, count(*) AS paid_cnt
FROM orders
WHERE status = 'PAID'
GROUP BY user_id
HAVING count(*) > 10;`,
    walkthrough: [
      'WHERE отсекает строки до группировки.',
      'HAVING фильтрует уже агрегированные группы.',
    ],
    pitfall: 'Писать условие на агрегат в WHERE — запрос невалиден или логически неверен.',
    productionNote: 'Проверять EXPLAIN: порядок фильтрации сильно влияет на стоимость.',
  },
  grpc: {
    title: 'gRPC: contract-first .proto',
    snippet: `syntax = "proto3";
service OrderService { rpc GetOrder(GetOrderRequest) returns (Order); }
// codegen stubs -> server impl + client
// versioning: only add optional fields, never reuse numbers`,
    walkthrough: [
      'Protobuf — стандартный выбор в gRPC ecosystem, не единственный теоретический формат.',
      'JSON transcoding — опция на gateway, не замена нормального контракта.',
    ],
    pitfall: 'Менять тип поля в .proto без migration policy — ломаете клиентов.',
    productionNote: 'CI: breaking change detection для proto + contract tests.',
  },
  scheduler: {
    title: 'Distributed claim: SKIP LOCKED',
    snippet: `BEGIN;
SELECT id FROM tasks
WHERE status = 'PENDING'
ORDER BY created_at
FOR UPDATE SKIP LOCKED
LIMIT 10;
UPDATE tasks SET status = 'CLAIMED', owner = :podId WHERE id IN (...);
COMMIT;`,
    walkthrough: [
      'SKIP LOCKED позволяет второму инстансу взять другие строки без ожидания.',
      'JVM Lock не работает между pod — только координация через БД/Redis/ZK.',
    ],
    pitfall: 'SELECT LIMIT 10 без транзакции и claim — два pod возьмут одни строки.',
    productionNote: 'Job должна быть идемпотентной; мониторить starvation и lock wait.',
  },
  oop: {
    title: 'OOP: Flyable вместо Bird.fly()',
    snippet: `// плохо: abstract class Bird { abstract void fly(); }
// хорошо:
interface Flyable { void fly(); }
class Sparrow implements Bird, Flyable { ... }
class Penguin implements Bird { /* no Flyable */ }`,
    walkthrough: [
      'Не заставляйте всех “птиц” летать — поведение через интерфейс/композицию.',
      'LSP: подтип не должен ломать ожидания клиента базового типа.',
    ],
    pitfall: 'Глубокое наследование с пустыми override и instanceof-лесенками.',
    productionNote: 'SOLID на собесе — через production-примеры, не расшифровку аббревиатур.',
  },
  collections: {
    title: 'HashMap lookup flow',
    snippet: `key.hashCode() -> bucket index
bucket chain/tree -> equals(key) match?
avg O(1), worst O(n) / O(log n) per bucket tree`,
    walkthrough: [
      'equals/hashCode контракт обязателен для ключей.',
      'Поиск по значению в ArrayList/LinkedList — O(n).',
    ],
    pitfall: 'Мutable key меняет hash после put — объект “теряется” в Map.',
    productionNote: 'java.util.Stack — legacy; предпочитайте Deque (ArrayDeque).',
  },
  jvm: {
    title: 'JVM memory sketch',
    snippet: `stack: frames, local refs, primitives
heap: objects, collections, String Pool (modern Java)
metaspace: class metadata (не String Pool)
String Pool != IntegerCache mechanism`,
    walkthrough: [
      'Локальная переменная collection хранит ссылку; данные — в heap.',
      'new String("abc") создаёт новый объект даже при literal в pool.',
    ],
    pitfall: 'Думать, что все “пулы” — один механизм как String intern.',
    productionNote: 'intern() без нужды может раздувать String Pool и heap; только при понятной выгоде.',
  },
  spring: {
    title: 'Spring: registry + proxy + tx boundary',
    snippet: `ApplicationContext ~ bean registry (name -> definition/instance)
@Transactional method call via proxy -> TransactionInterceptor
self-invocation (this.method()) bypasses proxy`,
    walkthrough: [
      'Singleton beans живут в singleton registry контекста.',
      'Auto-configuration — Spring Boot, не core Framework.',
    ],
    pitfall: 'final class/method + CGLIB: proxy не может корректно подменить.',
    productionNote: 'Production-safe: не делать transactional сервисы final; проверять proxy в логах.',
  },
  graphql: {
    title: 'GraphQL read path',
    snippet: `client selects fields -> single endpoint
resolvers (risk N+1) -> DataLoader batching
limits: depth / complexity / timeout`,
    walkthrough: [
      'Плюс: меньше overfetching; минус: кеш и security сложнее REST.',
      'DataLoader — типичный ответ на N+1 в GraphQL.',
    ],
    pitfall: 'Открыть схему без лимитов — один запрос может исчерпать БД.',
    productionNote: 'Observability: per-resolver metrics и tracing.',
  },
  hibernate: {
    title: 'Hibernate: fetch join + Criteria sketch',
    snippet: `// JPQL
select o from Order o join fetch o.items where o.id = :id
// Criteria (dynamic filters)
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Order> cq = cb.createQuery(Order.class);`,
    walkthrough: [
      'Lazy load вне tx -> LazyInitializationException.',
      'N+1 лечится fetch join/entity graph/batch size — проверять SQL count.',
    ],
    pitfall: 'Eager Everything — память и Cartesian product.',
    productionNote: 'Criteria полезен для динамики; иначе часто JPQL/QueryDSL читабельнее.',
  },
};

const QUESTIONS: QuestionDef[] = [
  {
    id: 'int-6-01',
    title: 'Как вы тестируете Kafka-потребителей и Kafka Streams? Какие подходы к интеграционным тестам с реальным брокером знаете?',
    answer:
      'Unit — логика handler/mapper; integration — Testcontainers Kafka или Embedded Kafka; Streams — TopologyTestDriver; плюс контрактные тесты сериализации.',
    practicalHint:
      'Integration: side effect в БД/статусе/outbox, offset commit, retry/DLQ; Streams: TopologyTestDriver для topology, Testcontainers — wiring и consumer group.',
    pitfall: 'Мокать только KafkaTemplate и считать, что consumer “протестирован”.',
    prevention: 'Минимум один integration test с брокером + сценарии rebalance/duplicate/poison message.',
  },
  {
    id: 'int-6-02',
    title: 'С Kafka работал? Чем Kafka отличается от очередей сообщений / классического MQ?',
    answer:
      'Kafka — распределённый commit log с партициями и consumer groups; классические MQ чаще про point-to-point/task queue с удалением после ack.',
    practicalHint:
      'Практика: Kafka держит историю, переигрывание, высокую пропускную способность; MQ — доставить задачу и забыть.',
    pitfall: 'Сравнивать только “есть брокер” без partitions, retention и consumer group semantics.',
    prevention: 'Объяснить log, offset, replay, ordering в partition и horizontal scale через partitions.',
  },
  {
    id: 'int-6-03',
    title: 'Какие паттерны отказоустойчивости вы используете в Kafka?',
    answer:
      'Идемпотентный consumer, retry с backoff, DLQ, dead-letter handling, idempotent producer, мониторинг lag, graceful rebalance handling.',
    practicalHint:
      'Практика: retry topic + max attempts, DLQ для poison pill, business key dedup, алерты на lag/rebalance.',
    pitfall: 'Бесконечные ретраи одного bad message без изоляции.',
    prevention: 'Cap retries, DLQ, manual replay playbook, observability offset/lag/error rate.',
  },
  {
    id: 'int-6-04',
    title: 'Как в Kafka работают партиции и экземпляры приложения? 4 инстанса и 3 партиции? И обратно?',
    answer:
      'Параллелизм consumer group ограничен числом partitions; 4 инстанса / 3 partitions — один idle; 3 / 4 — один инстанс возьмёт 2 partitions.',
    practicalHint:
      'Практика: ordering только внутри partition; масштабирование — увеличивать partitions и пересматривать key.',
    pitfall: 'Думать, что 10 pod автоматически дадут 10× скорость без роста partitions.',
    prevention: 'Считать max consumers = partitions; планировать partition key и rebalance impact.',
  },
  {
    id: 'int-6-05',
    title: 'Отличия HAVING и WHERE.',
    answer: 'WHERE фильтрует строки до GROUP BY; HAVING фильтрует агрегированные группы после GROUP BY.',
    practicalHint: 'Пример: PAID в WHERE, count(*) > 10 в HAVING — см. codeExample категории sql.',
    pitfall: 'Условие на агрегат писать в WHERE.',
    prevention: 'Строить запрос по этапам и проверять EXPLAIN.',
  },
  {
    id: 'int-6-06',
    title: 'Обязательно ли использовать формат Proto в gRPC?',
    answer:
      'Теоретически gRPC transport не привязан только к Protobuf, но в ecosystem стандарт — contract-first .proto с codegen.',
    practicalHint: 'Практика: .proto даёт типизацию, совместимость версий, stubs; JSON transcoding — edge option.',
    pitfall: 'Ответ “только Protobuf возможен” или “Proto не нужен вообще” без нюанса.',
    prevention: 'Развести теорию и production-default; объяснить schema evolution.',
  },
  {
    id: 'int-6-07',
    title: 'С концепцией scheduler знаком?',
    answer:
      'Да: @Scheduled/Quartz/K8s CronJob; важны fixedRate/fixedDelay/cron, идемпотентность и защита от параллельного запуска в кластере.',
    practicalHint: 'Практика: ShedLock/DB lock/leader election; не запускать одну job на всех pod одновременно.',
    pitfall: 'Cron в каждом pod без координации — дубли операций.',
    prevention: 'Distributed lock + идемпотентная бизнес-логика + мониторинг пропусков/дублей.',
  },
  {
    id: 'int-6-08',
    title: 'Как с двух инстансов отправлять запросы в БД с лимитом 10, чтобы результаты не пересекались?',
    answer:
      'В транзакции: SELECT ... FOR UPDATE SKIP LOCKED LIMIT 10, claim статусом/owner, обработать, commit; JVM Lock не подходит.',
    practicalHint:
      'Практика: claim batch, идемпотентная обработка, timeout lock, retry при пустой выборке, метрики starvation.',
    pitfall: 'ReentrantLock в сервисе — работает только в одном процессе.',
    prevention: 'DB-level coordination, короткие транзакции, observability wait/claim rate.',
  },
  {
    id: 'int-6-09',
    title: 'Расскажи про ООП. Плюсы и минусы.',
    answer:
      'Плюсы: моделирование домена, полиморфизм, переиспользование; минусы: хрупкое наследование, overengineering, жёсткие иерархии.',
    practicalHint: 'Практика: ООП + композиция; наследование только для устойчивого is-a.',
    pitfall: 'ООП как цель сама по себе, а не инструмент снижения сложности.',
    prevention: 'Оценивать связанность, тестируемость, возможность менять поведение без ломки иерархии.',
  },
  {
    id: 'int-6-10',
    title: 'Приведи пример наследования.',
    answer: 'Например Payment -> CardPayment/BankTransfer с общим контрактом process(), если is-a устойчиво.',
    practicalHint: 'Практика: наследование для общего протокола; вариации — через override, не через instanceof.',
    pitfall: 'Наследовать ради reuse полей, а не поведенческого контракта.',
    prevention: 'Предпочитать композицию, если отношение не устойчивое is-a.',
  },
  {
    id: 'int-6-11',
    title: 'Как в Java решается проблема: класс птиц, но пингвин и страус не летают?',
    answer: 'Не делать fly() у всех Bird; вынести Flyable или композицию FlyingBehavior — LSP-friendly дизайн.',
    practicalHint: 'Практика: Sparrow implements Flyable; Penguin — только Bird без Flyable.',
    pitfall: 'Пустой override fly() или UnsupportedOperationException в базовом контракте.',
    prevention: 'Моделировать способности отдельными интерфейсами/компонентами, не ломая подтипы.',
  },
  {
    id: 'int-6-12',
    title: 'Расскажи про принципы SOLID.',
    answer:
      'SRP/OCP/LSP/ISP/DIP снижают хрупкость: одна ответственность, расширение без if-лестниц, заменяемые подтипы, узкие интерфейсы, зависимость от абстракций.',
    practicalHint:
      'SRP: OrderService vs Notifier; OCP: PaymentStrategy; LSP: Flyable не Bird.fly(); ISP: не fat interface; DIP: Notifier/PaymentGateway.',
    pitfall: 'Только расшифровка букв без примеров и без trade-off «когда SOLID избыточен».',
    prevention: 'Живой пример нарушения + рефакторинг; маркер зрелости — тестируемость без реальной БД/HTTP.',
  },
  {
    id: 'int-6-13',
    title: 'Что за понятия композиция и агрегация?',
    answer: 'Композиция — сильное владение жизненным циклом; агрегация — слабая связь, часть может жить отдельно.',
    practicalHint: 'Order->OrderItem (composition); Team->Employee (aggregation).',
    pitfall: 'Путать UML-термины без связи с владением объектов в коде.',
    prevention: 'Объяснить, кто создаёт/уничтожает зависимость и можно ли переиспользовать часть.',
  },
  {
    id: 'int-6-14',
    title: 'Расскажи про Java Collection.',
    answer:
      'Collection — root для List/Set/Queue; Map отдельно. Реализации: ArrayList, LinkedList, HashSet, TreeSet, HashMap, LinkedHashMap, TreeMap.',
    practicalHint: 'Практика: выбор по операциям — get/contains/order/thread-safety.',
    pitfall: 'Считать, что Map extends Collection.',
    prevention: 'Знать контракты интерфейсов и типичные реализации под сценарий.',
  },
  {
    id: 'int-6-15',
    title: 'Какова сложность поиска по значению в ArrayList и LinkedList?',
    answer: 'O(n) в обоих; LinkedList часто медленнее из-за cache locality при последовательном обходе.',
    practicalHint: 'Практика: для частого contains по значению — Map/Set индекс, не LinkedList.',
    pitfall: '“LinkedList быстрее для поиска” без анализа паттерна доступа.',
    prevention: 'Смотреть dominant operation, не название структуры.',
  },
  {
    id: 'int-6-16',
    title: 'Как работает HashMap и что внутри? Сложность поиска в худшем случае?',
    answer: 'Buckets + hash + equals; avg O(1); worst O(n), при tree bins в bucket ближе O(log n) для длинных цепочек.',
    practicalHint: 'Практика: корректные equals/hashCode; избегать mutable keys; resize/rehash при росте.',
    pitfall: 'Игнорировать коллизии и treeification после Java 8.',
    prevention: 'Объяснить контракт ключа и влияние load factor.',
  },
  {
    id: 'int-6-17',
    title: 'Расскажи про класс Stack.',
    answer: 'java.util.Stack — устаревший synchronized LIFO на Vector; в modern code — Deque (ArrayDeque).',
    practicalHint: 'Практика: ArrayDeque для стека; concurrent — специализированные структуры.',
    pitfall: 'Использовать Stack “по привычке” в hot path из-за лишней синхронизации.',
    prevention: 'Deque API + осознанный выбор thread-safety.',
  },
  {
    id: 'int-6-18',
    title: 'Расскажи про устройство памяти в Java и где хранятся коллекции.',
    answer: 'Stack frames — локальные данные; объекты коллекций и элементов — в heap; ссылка — в stack/local.',
    practicalHint: 'Практика: OOM heap vs metaspace; коллекция — объект header + array nodes в heap.',
    pitfall: 'Думать, что коллекция хранится “в переменной”, а не по ссылке на heap.',
    prevention: 'Различать reference variable и object graph в heap.',
  },
  {
    id: 'int-6-19',
    title: 'String Pool, new String, intern и важное свойство String?',
    answer: 'String immutable; literal может быть в pool; new String("x") создаёт новый объект; intern() кладёт в pool.',
    practicalHint:
      'Literal vs new String vs intern; new String("abc") — новый объект в heap; intern() без нужды раздувает String Pool.',
    pitfall: 'Считать, что new String всегда переиспользует pool literal или что String Pool в Metaspace.',
    prevention: 'Immutability; String Pool в heap; intern() только при понятной выгоде по памяти.',
  },
  {
    id: 'int-6-20',
    title: 'В каких типах есть похожий на String pool механизм?',
    answer: 'IntegerCache (-128..127), Boolean, Byte, частично Short/Long/Character; enum singletons — похожая идея reuse.',
    practicalHint: 'Это не String pool: другой механизм кэширования boxed/enum instances.',
    pitfall: 'Смешивать все кэши в “один pool”.',
    prevention: 'Различать intern pool, boxed cache и enum constants.',
  },
  {
    id: 'int-6-21',
    title: 'Зачем нужен Spring? На каких принципах работает и как их реализует?',
    answer: 'IoC/DI, lifecycle bean, AOP, транзакции, интеграции; контейнер управляет зависимостями и cross-cutting concerns.',
    practicalHint: 'Практика: constructor injection, @Transactional через proxy, единый контекст модулей.',
    pitfall: '“Spring = только REST” без понимания контейнера.',
    prevention: 'Объяснить BeanFactory/ApplicationContext и зачем DI снижает связанность.',
  },
  {
    id: 'int-6-22',
    title: 'Точно ли автоконфигурация относится к Spring?',
    answer: 'Auto-configuration — Spring Boot; Spring Framework даёт core IoC/AOP без auto-config magic.',
    practicalHint: 'Практика: @SpringBootApplication + conditions; override через @Configuration.',
    pitfall: 'Считать auto-config частью “чистого Spring Framework”.',
    prevention: 'Разделять Framework core и Boot conventions/starters.',
  },
  {
    id: 'int-6-23',
    title: 'Если контекст — Java-структура, какая? За счёт чего DI? Где хранятся bean?',
    answer: 'Грубо Map name->BeanDefinition/instance; DI — reflection/constructor + registry; singletons в singleton registry контекста.',
    practicalHint: 'Практика: singleton по умолчанию; prototype/request/session — отдельные scope maps.',
    pitfall: 'Думать, что это простой HashMap без lifecycle/post-processors.',
    prevention: 'Упомянуть BeanDefinition, post-processors, scopes.',
  },
  {
    id: 'int-6-24',
    title: 'Знаком ли с GraphQL? Плюсы и минусы?',
    answer: 'Плюсы: выбор полей, меньше over/underfetching; минусы: кеш, N+1, security depth, observability, versioning.',
    practicalHint: 'Практика: DataLoader, query complexity limits, resolver metrics.',
    pitfall: 'GraphQL везде вместо REST без оценки операционной стоимости.',
    prevention: 'Чёткий bounded context для GraphQL read API.',
  },
  {
    id: 'int-6-25',
    title: 'Работа с Hibernate.',
    answer: 'ORM + persistence context + dirty checking; lazy/eager; tx boundaries; N+1, блокировки, SQL диагностика.',
    practicalHint: 'Практика: show sql/statistics, fetch join, @Version optimistic lock, batch size.',
    pitfall: 'Open Session In View как “решение” без понимания последствий.',
    prevention: 'Контролировать SQL count, fetch plan, границы транзакций.',
  },
  {
    id: 'int-6-26',
    title: 'Работал ли с Criteria API?',
    answer: 'Type-safe динамические запросы; полезно для сложных фильтров; минус — verbosity, альтернатива JPQL/QueryDSL/SQL.',
    practicalHint: 'Практика: Criteria для UI-фильтров; простые запросы — JPQL/native.',
    pitfall: 'Criteria везде “для типобезопасности” с нечитаемым кодом.',
    prevention: 'Выбор по читаемости команды и сложности фильтрации.',
  },
  {
    id: 'int-6-27',
    title: 'Есть final class. На него повесили @Transactional. Что будет?',
    answer:
      'Зависит от proxy mode: CGLIB не создаёт subclass proxy для final class/final method; JDK proxy может работать через interface. Production-safe: transactional service и methods не делают final; проверяют proxy/tx logs.',
    practicalHint:
      'spring.aop.proxy-target-class, JDK vs CGLIB, final class/method, self-invocation (this.*), TransactionInterceptor/tx boundaries в логах.',
    pitfall: '“Аннотация всегда сработает” без учёта proxy mode и self-invocation.',
    prevention: 'Не делать transactional код final; проверять proxy creation и tx begin/commit в логах.',
  },
];

const QUESTION_OVERRIDES: Record<string, Pick<QuestionDef, 'practicalHint' | 'pitfall' | 'prevention'>> = {
  'int-6-01': {
    practicalHint:
      'Unit — handler; integration — Testcontainers: assert side effect (БД, статус, outbox), offset commit, retry/DLQ; Streams — TopologyTestDriver + отдельно брокер для ser/de и consumer group.',
    pitfall: 'Только мок KafkaTemplate / EmbeddedKafka без side effect, offset, DLQ и rebalance.',
    prevention: 'Матрица: happy path, duplicate, poison pill -> DLQ, rebalance; не только факт consume.',
  },
  'int-6-04': {
    practicalHint: 'Нарисовать assignor: 3 partitions / 4 consumers -> one idle consumer; scale partitions before pods.',
    pitfall: 'Ожидать strict round-robin fairness без учёта partition count.',
    prevention: 'Key by business id для ordering; monitor per-partition lag.',
  },
  'int-6-08': {
    practicalHint:
      'UPDATE ... RETURNING + status CLAIMED; heartbeat; requeue stale claims; метрики empty fetch vs contention.',
    pitfall: 'LIMIT без ORDER BY — недетерминированный набор строк.',
    prevention: 'ORDER BY priority/created_at; короткая tx; idempotent handler.',
  },
  'int-6-11': {
    practicalHint: 'Интерфейс Flyable + композиция; тесты на поведение, не на иерархию Bird.',
    pitfall: 'abstract fly() с UnsupportedOperationException в Penguin.',
    prevention: 'LSP: подтип усиливает контракт, не ослабляет.',
  },
  'int-6-23': {
    practicalHint:
      'DefaultListableBeanFactory, BeanDefinitionRegistry, singletonObjects map; @Configuration class enhancement.',
    pitfall: '“Spring = один HashMap beanов” без lifecycle callbacks.',
    prevention: 'Упомянуть BeanPostProcessor, ApplicationContext refresh phases.',
  },
  'int-6-27': {
    practicalHint:
      'spring.aop.proxy-target-class, JDK proxy (interface) vs CGLIB (subclass), final class/method блокируют CGLIB, self-invocation обходит proxy — проверка TransactionInterceptor/tx logs.',
    pitfall: 'Transactional на final или через this.method() — tx/AOP может не сработать.',
    prevention: 'Не final transactional код; вызов через proxy/отдельный bean; verify tx boundaries в логах.',
  },
};

const QUESTION_LECTURER_NOTES: Record<string, string[]> = {
  'int-6-01': [
    'Развести три слоя: unit handler/mapper, integration с реальным брокером, TopologyTestDriver для Streams topology.',
    'В integration проверять side effect: запись в БД, смена статуса, outbox/следующее событие, commit offset, retry, DLQ.',
    'Если только “мокали KafkaTemplate” — слабый ответ; уточнить poison pill и rebalance.',
  ],
  'int-6-04': [
    'Зафиксировать: 4 consumers / 3 partitions → один consumer idle; 3 / 4 → один consumer на двух partitions.',
    'Параллелизм consumer group ≤ число partitions; ordering только внутри partition.',
  ],
  'int-6-06': [
    'Protobuf теоретически не единственный формат, но production-default в gRPC ecosystem.',
    'Ждём .proto как source of truth, codegen stubs, backward compatibility.',
    'Если “JSON значит proto не нужен” — уточнить: JSON transcoding на gateway ≠ gRPC contract.',
  ],
  'int-6-08': [
    'JVM Lock/ReentrantLock не работает между pod — только distributed coordination.',
    'Хороший ответ: SELECT ... FOR UPDATE SKIP LOCKED LIMIT 10 + claim owner/status в короткой tx.',
    'Follow-up: pod умер после claim — stale claim timeout/requeue + идемпотентная обработка.',
  ],
  'int-6-11': [
    'Проверка LSP: плохо — Bird.fly() и UnsupportedOperationException в Penguin.',
    'Хорошо — Flyable или отдельная стратегия; наследование не должно ломать контракт родителя.',
  ],
  'int-6-12': [
    'Canonical: module-3 `solid-principles`. Красный флаг — только S-O-L-I-D без кода.',
    'Production-marker: SOLID ради меньшей хрупкости и тестируемости, не ради «больше интерфейсов».',
    'LSP: Penguin/Struthio; ISP: fat ReportActions; DIP: Notifier вместо new EmailSender().',
  ],
  'int-6-16': [
    'Обязательно: hashCode → bucket, equals → совпадение ключа; коллизии, resize/load factor, treeification (Java 8+).',
    'Если только “O(1)” — уточнить worst-case и mutable key.',
  ],
  'int-6-19': [
    'Развести literal, new String (всегда новый объект в heap), intern(). String Pool в heap, не в Metaspace.',
    'intern() без нужды раздувает String Pool/heap — не путать с metaspace (metadata классов).',
  ],
  'int-6-23': [
    'Map beanName→definition/instance — только упрощение; ждём BeanFactory/ApplicationContext, BeanDefinition, singleton registry.',
    'Если “просто HashMap” — уточнить scopes, lifecycle, BeanPostProcessor.',
  ],
  'int-6-27': [
    'Результат зависит от proxy mode: CGLIB не subclass-ит final; JDK — через interface и public методы интерфейса.',
    'Production-safe: transactional service/methods не final; проверять TransactionInterceptor и tx boundaries.',
    'Обязательно self-invocation: this.method() обходит proxy — уточнить, как вызывают в коде.',
  ],
};

const QUESTION_EXTRA_KEY_POINTS: Record<string, string[]> = {
  'int-6-01': [
    'Integration consumer: assert side effect (БД, статус, outbox), offset commit, retry/DLQ — не только consume.',
    'Streams: TopologyTestDriver — быстрый тест topology; Testcontainers — ser/de, consumer group, wiring.',
  ],
  'int-6-03': ['Poison pill: изолировать в DLQ, не блокировать основную consumer group.'],
  'int-6-12': [
    'SRP: не смешивать валидацию, БД и email; OCP: новая стратегия вместо if-else в сервисе.',
    'DIP: зависимость от Notifier/PaymentGateway, не от конкретного SDK.',
  ],
  'int-6-27': ['final method не override CGLIB proxy — @Transactional может не примениться.'],
};

function getQuestionNumber(questionId: string): number {
  return Number(questionId.replace('int-6-', ''));
}

function detectCategory(questionId: string): Interview6Category {
  const number = getQuestionNumber(questionId);
  if (number <= 4) {
    return 'kafka';
  }
  if (number === 5) {
    return 'sql';
  }
  if (number === 6) {
    return 'grpc';
  }
  if (number <= 8) {
    return 'scheduler';
  }
  if (number <= 13) {
    return 'oop';
  }
  if (number <= 17) {
    return 'collections';
  }
  if (number <= 20) {
    return 'jvm';
  }
  if (number <= 23) {
    return 'spring';
  }
  if (number === 24) {
    return 'graphql';
  }
  if (number <= 26) {
    return 'hibernate';
  }
  return 'spring';
}

function getQuestionGlossary(questionId: string): LectureModule['topics'][number]['glossary'] {
  switch (questionId) {
    case 'int-6-01':
      return [
        { term: 'Testcontainers', meaning: 'Поднимает реальный Kafka/БД в Docker для интеграционных тестов.' },
        { term: 'TopologyTestDriver', meaning: 'Тестирует Kafka Streams topology без живого кластера.' },
        { term: 'Offset commit', meaning: 'Фиксация позиции consumer в partition после обработки.' },
        { term: 'Poison pill', meaning: 'Сообщение, которое всегда падает — изолируют в DLQ.' },
        { term: 'DLQ', meaning: 'Dead Letter Queue — отдельный поток для проблемных сообщений.' },
      ];
    case 'int-6-02':
      return [
        { term: 'Commit log', meaning: 'Kafka хранит события как упорядоченный лог в partition.' },
        { term: 'Consumer group', meaning: 'Группа consumers, делящих partitions с координацией rebalance.' },
        { term: 'Retention', meaning: 'Сколько времени/объёма история сообщений хранится в топике.' },
      ];
    case 'int-6-03':
      return [
        { term: 'DLQ', meaning: 'Dead Letter Queue — изоляция проблемных сообщений.' },
        { term: 'Poison pill', meaning: 'Bad message, ломающий обработчик; уводят в DLQ.' },
        { term: 'Idempotent consumer', meaning: 'Повторное сообщение не дублирует бизнес-эффект.' },
        { term: 'Backoff', meaning: 'Увеличивающаяся пауза между ретраями.' },
      ];
    case 'int-6-04':
      return [
        { term: 'Partition', meaning: 'Единица параллелизма и ordering в Kafka.' },
        { term: 'Rebalance', meaning: 'Перераспределение partitions между members consumer group.' },
        { term: 'Consumer lag', meaning: 'Отставание offset consumer от конца лога.' },
      ];
    case 'int-6-05':
      return [
        { term: 'WHERE', meaning: 'Фильтрация строк до агрегирования.' },
        { term: 'HAVING', meaning: 'Фильтрация групп после GROUP BY.' },
        { term: 'GROUP BY', meaning: 'Формирование агрегатов по ключу группы.' },
      ];
    case 'int-6-06':
      return [
        { term: 'Protobuf', meaning: 'Бинарный contract-first формат; стандарт de-facto в gRPC.' },
        { term: 'Schema evolution', meaning: 'Совместимое развитие .proto между версиями сервисов.' },
        { term: 'JSON transcoding', meaning: 'HTTP/JSON шлюз поверх gRPC; не замена .proto контракта.' },
      ];
    case 'int-6-07':
      return [
        { term: 'fixedRate', meaning: 'Запуск каждые N мс от старта, может overlap при долгой job.' },
        { term: 'fixedDelay', meaning: 'Пауза N мс после завершения предыдущего запуска.' },
        { term: 'ShedLock', meaning: 'Библиотека distributed lock для @Scheduled в кластере.' },
      ];
    case 'int-6-08':
      return [
        { term: 'SKIP LOCKED', meaning: 'Пропуск заблокированных строк — параллельный claim разными инстансами.' },
        { term: 'FOR UPDATE', meaning: 'Пессимистичная блокировка выбранных строк в транзакции.' },
        { term: 'Claim pattern', meaning: 'Пометка задач owner/status перед обработкой.' },
      ];
    case 'int-6-09':
      return [
        { term: 'Encapsulation', meaning: 'Скрытие деталей реализации за API.' },
        { term: 'Polymorphism', meaning: 'Один контракт — разные реализации.' },
        { term: 'Abstraction', meaning: 'Выделение существенного контракта домена.' },
      ];
    case 'int-6-10':
      return [
        { term: 'Inheritance', meaning: 'is-a: подтип расширяет супертип.' },
        { term: 'Override', meaning: 'Переопределение метода с сохранением контракта.' },
      ];
    case 'int-6-11':
      return [
        { term: 'LSP', meaning: 'Подтип должен быть заменяем супертипом без сюрпризов.' },
        { term: 'Flyable', meaning: 'Интерфейс способности вместо обязательного fly() у всех Bird.' },
      ];
    case 'int-6-12':
      return [
        { term: 'SRP', meaning: 'Single Responsibility: одна причина для изменения класса.' },
        { term: 'OCP', meaning: 'Open/Closed: новый сценарий — новая реализация/стратегия.' },
        { term: 'LSP', meaning: 'Подтип заменяем без сюрпризов; Penguin≠Flyable в Bird.fly().' },
        { term: 'ISP', meaning: 'Узкие интерфейсы вместо fat interface с лишними методами.' },
        { term: 'DIP', meaning: 'Зависимость от Notifier/PaymentGateway, не от SDK-клиента.' },
      ];
    case 'int-6-13':
      return [
        { term: 'Composition', meaning: 'Сильное владение: часть не живёт без целого.' },
        { term: 'Aggregation', meaning: 'Слабая связь: часть может существовать отдельно.' },
      ];
    case 'int-6-14':
      return [
        { term: 'Collection', meaning: 'Root для List/Set/Queue; Map — отдельная ветка.' },
        { term: 'HashMap', meaning: 'Хеш-таблица с buckets и equals.' },
      ];
    case 'int-6-15':
      return [
        { term: 'ArrayList', meaning: 'Динамический массив; быстрый random access.' },
        { term: 'LinkedList', meaning: 'Двусвязный список; дорогой indexed access.' },
      ];
    case 'int-6-16':
      return [
        { term: 'hashCode', meaning: 'Определяет bucket; должен быть согласован с equals.' },
        { term: 'equals', meaning: 'Проверяет равенство ключа внутри bucket при коллизии hash.' },
        { term: 'Load factor', meaning: 'Порог заполнения buckets; при превышении — resize/rehash.' },
        { term: 'Treeification', meaning: 'Длинная bucket chain превращается в дерево (Java 8+).' },
      ];
    case 'int-6-17':
      return [
        { term: 'Deque', meaning: 'Двусторонняя очередь; современная замена Stack.' },
        { term: 'LIFO', meaning: 'Last In First Out — стековый порядок.' },
      ];
    case 'int-6-18':
      return [
        { term: 'Heap', meaning: 'Область для объектов и массивов.' },
        { term: 'Stack frame', meaning: 'Локальные переменные и вызовы методов в потоке.' },
        { term: 'Metaspace', meaning: 'Метаданные классов (после PermGen).' },
      ];
    case 'int-6-19':
      return [
        { term: 'String Pool', meaning: 'Пул строк в heap (modern Java); литералы и intern().' },
        { term: 'Immutability', meaning: 'Состояние String нельзя изменить после создания.' },
        { term: 'intern()', meaning: 'Кладёт строку в String Pool; без нужды раздувает heap.' },
      ];
    case 'int-6-20':
      return [
        { term: 'IntegerCache', meaning: 'Кэш Integer для значений обычно -128..127.' },
        { term: 'Autoboxing', meaning: 'Автоматическая обёртка примитива в wrapper.' },
      ];
    case 'int-6-21':
      return [
        { term: 'IoC', meaning: 'Инверсия управления: контейнер создаёт и связывает объекты.' },
        { term: 'DI', meaning: 'Внедрение зависимостей через конструктор/сеттер/поле.' },
        { term: 'AOP', meaning: 'Аспекты: tx, security, logging через proxy.' },
      ];
    case 'int-6-22':
      return [
        { term: 'Auto-configuration', meaning: 'Boot-условные @Configuration на classpath/starters.' },
        { term: 'Spring Boot', meaning: 'Надстройка: starters, actuator, embedded server.' },
      ];
    case 'int-6-23':
      return [
        { term: 'ApplicationContext', meaning: 'Расширенный контейнер Spring с событиями и ресурсами.' },
        { term: 'BeanDefinition', meaning: 'Метаданные bean: scope, type, dependencies.' },
        { term: 'Singleton registry', meaning: 'Хранилище singleton instances в контексте.' },
        { term: 'BeanPostProcessor', meaning: 'Хук до/после инициализации bean (AOP, validation).' },
      ];
    case 'int-6-24':
      return [
        { term: 'Overfetching', meaning: 'Клиент получает лишние поля REST-ответа.' },
        { term: 'DataLoader', meaning: 'Батчинг загрузки связанных сущностей в GraphQL.' },
        { term: 'Query complexity', meaning: 'Лимит “веса” GraphQL-запроса.' },
      ];
    case 'int-6-25':
      return [
        { term: 'Persistence context', meaning: 'Первый уровень кэша сессии Hibernate.' },
        { term: 'N+1', meaning: '1 запрос корня + N запросов связей.' },
        { term: 'Dirty checking', meaning: 'Авто-обновление изменённых entity при flush.' },
      ];
    case 'int-6-26':
      return [
        { term: 'Criteria API', meaning: 'Программное построение JPA-запросов.' },
        { term: 'QueryDSL', meaning: 'Альтернатива Criteria с лучшей читаемостью для некоторых команд.' },
      ];
    case 'int-6-27':
      return [
        { term: 'CGLIB proxy', meaning: 'Subclass proxy; не работает с final class/method.' },
        { term: 'JDK dynamic proxy', meaning: 'Proxy интерфейса; вызов через interface method.' },
        { term: 'Self-invocation', meaning: 'Вызов this.* обходит transactional proxy.' },
        { term: 'TransactionInterceptor', meaning: 'AOP-компонент, открывающий/закрывающий транзакцию вокруг метода.' },
      ];
    default:
      return [];
  }
}

function pickPrompt(prompts: PlanPrompt[], index: number): PlanPrompt {
  return prompts[index % prompts.length];
}

function buildTopicQuestionPlan(
  question: QuestionDef,
  category: Interview6Category,
  practicalHint: string,
  pitfall: string,
  prevention: string,
): LectureModule['topics'][number]['questionPlan'] {
  const number = getQuestionNumber(question.id);
  const deepDivePrompt = pickPrompt(CATEGORY_DEEP_DIVE_PROMPTS[category], number - 1);
  const riskPrompt = pickPrompt(CATEGORY_RISK_PROMPTS[category], number - 1);
  const rolloutPrompt = pickPrompt(CATEGORY_ROLLOUT_PROMPTS[category], number - 1);
  const followUp = CATEGORY_FOLLOW_UP[category];
  const topicText = question.title;
  const deepDiveQuestion = deepDivePrompt.question.replace('{topic}', topicText);
  const riskQuestion = riskPrompt.question.replace('{topic}', topicText);
  const rolloutQuestion = rolloutPrompt.question.replace('{topic}', topicText);

  return [
    { question: question.title, answerHint: question.answer },
    { question: deepDiveQuestion, answerHint: `${deepDivePrompt.hintPrefix} ${practicalHint}` },
    { question: riskQuestion, answerHint: `${riskPrompt.hintPrefix} Антипаттерн: ${pitfall} Защита: ${prevention}` },
    { question: rolloutQuestion, answerHint: `${rolloutPrompt.hintPrefix} ${prevention}` },
    { question: followUp.question, answerHint: followUp.hint },
  ];
}

function buildTopic(question: QuestionDef): LectureModule['topics'][number] {
  const category = detectCategory(question.id);
  const categoryCode = CATEGORY_CODE_EXAMPLE[category];
  const explainTail = CATEGORY_EXPLAIN_TAIL[category];
  const override = QUESTION_OVERRIDES[question.id];
  const practicalHint = override?.practicalHint ?? question.practicalHint ?? CATEGORY_PRACTICAL_HINT[category];
  const pitfall = override?.pitfall ?? question.pitfall ?? CATEGORY_PITFALL[category];
  const prevention = override?.prevention ?? question.prevention ?? CATEGORY_PREVENTION[category];
  const extraKeyPoints = QUESTION_EXTRA_KEY_POINTS[question.id];

  return topic({
    id: question.id,
    title: question.title,
    simpleDefinitionOverride: question.answer,
    quickAnswer: question.answer,
    explainBrief: [
      `Что отвечать кратко: ${question.answer}`,
      practicalHint,
      `Типичная ошибка: ${pitfall}`,
      `Как избежать: ${prevention}`,
      explainTail[0],
      explainTail[1],
    ],
    extraKeyPoints,
    questionPlan: buildTopicQuestionPlan(question, category, practicalHint, pitfall, prevention),
    interviewFocus: [
      {
        question: 'Ожидаемый короткий ответ кандидата',
        expectedAnswer: question.answer,
      },
      {
        question: 'Что добавит кандидат с реальным production-опытом',
        expectedAnswer: practicalHint,
      },
      {
        question: 'Красный флаг / поверхностный ответ',
        expectedAnswer: `${pitfall} Как проверять: ${prevention}`,
      },
    ],
    codeExample: {
      title: categoryCode.title,
      language: 'text',
      snippet: categoryCode.snippet,
      walkthrough: categoryCode.walkthrough,
      commonPitfall: categoryCode.pitfall,
      productionNote: categoryCode.productionNote,
    },
    usefulLinksOverride: INTERVIEW6_LINKS,
    glossary: getQuestionGlossary(question.id),
    lecturerNotes: [
      ...CATEGORY_LECTURER_NOTES[category],
      ...(QUESTION_LECTURER_NOTES[question.id] ?? []),
    ],
    estimatedMinutes: 5,
  });
}

export const moduleInterview6: LectureModule = {
  id: 'interview-6',
  interviewSectionKicker: 'Kafka, Java Core, Spring, SQL, Hibernate, gRPC',
  title: 'Интервью 6: Kafka, Java Core, Spring, SQL и системное мышление',
  targetDurationMinutes: 135,
  audienceLevel: 'Junior / Middle',
  isAvailable: true,
  summary:
    '27 тем по Kafka, Java Core, Spring, SQL, Hibernate, gRPC и scheduler: быстрый эталон ответа и rich-разбор для ведущего интервью.',
  topics: QUESTIONS.map(buildTopic),
};
