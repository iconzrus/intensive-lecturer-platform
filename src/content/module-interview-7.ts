// Canonical alignment: docs/content-canonical-map.md — sync с int-6 / int-4 где тема повторяется.
import { INTERVIEW7_TOPIC_ENRICHMENT } from './module-interview-7-enrichment';
import type { LectureModule } from './schema';
import { topic } from './module-1';

type Topic = LectureModule['topics'][number];

type QuestionDef = {
  id: string;
  title: string;
  practicalHint: string;
  pitfall: string;
  prevention: string;
};

type Interview7Category =
  | 'postgres'
  | 'kafka'
  | 'jvm'
  | 'collections'
  | 'concurrency'
  | 'spring'
  | 'distributed'
  | 'resilience'
  | 'security';

const INTERVIEW7_LINKS = [
  {
    title: 'PostgreSQL Documentation',
    url: 'https://www.postgresql.org/docs/current/index.html',
    description: 'MVCC, блокировки, индексы, секционирование, уровни изоляции.',
  },
  {
    title: 'Apache Kafka Documentation',
    url: 'https://kafka.apache.org/documentation/',
    description: 'Lifecycle, ISR, exactly-once, log segments, rebalancing.',
  },
  {
    title: 'Java Memory Model (JLS)',
    url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html',
    description: 'happens-before, visibility, data races, volatile.',
  },
  {
    title: 'Virtual Threads (JEP 444)',
    url: 'https://openjdk.org/jeps/444',
    description: 'Platform vs virtual threads, carrier threads, pinning.',
  },
  {
    title: 'G1 Garbage Collector',
    url: 'https://docs.oracle.com/en/java/javase/21/gctuning/garbage-first-garbage-collector1.html',
    description: 'Young/mixed GC, marking, tuning и GC logs.',
  },
  {
    title: 'HikariCP',
    url: 'https://github.com/brettwooldridge/HikariCP',
    description: 'Pool sizing, leak detection, JDBC lifecycle.',
  },
  {
    title: 'Resilience4j',
    url: 'https://resilience4j.readme.io/docs/circuitbreaker',
    description: 'Circuit Breaker, retry, rate limiter для high-load.',
  },
  {
    title: 'Spring @Transactional',
    url: 'https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html',
    description: 'Propagation REQUIRES_NEW, NESTED, rollback rules.',
  },
  {
    title: 'OWASP Dependency-Check / SCA',
    url: 'https://owasp.org/www-project-dependency-check/',
    description: 'SCA, transitive CVE, remediation log4j-class incidents.',
  },
];

const CATEGORY_LECTURER_NOTES: Record<Interview7Category, string[]> = {
  postgres: [
    'Optimistic: @Version / UPDATE ... WHERE version = ?; pessimistic: FOR UPDATE NOWAIT/SKIP LOCKED.',
    'GIN — jsonb/full-text; Hash index редок; B-Tree default для range/equality.',
  ],
  kafka: [
    'Offset commit — __consumer_offsets internal topic; auto vs manual commit trade-off.',
    'Log segment: .log + .index + .timeindex; retention bytes/ms.',
  ],
  jvm: [
    'happens-before: unlock→lock, volatile write→read, thread start/join.',
    'G1: Young GC (Eden), concurrent marking, mixed GC old regions.',
  ],
  collections: [
    'HashMap Java 21: Node/TreeNode; treeify threshold 8, untreeify 6; load factor 0.75.',
    'CopyOnWrite — snapshot iterator; synchronizedList — mutex on each op.',
  ],
  concurrency: ['Disruptor: RingBuffer, Sequence, Barrier, EventHandler; LMAX architecture.'],
  spring: [
    'NESTED требует JDBC savepoint support; REQUIRES_NEW suspend outer tx.',
    'Hikari: maxLifetime < DB timeout; leakDetectionThreshold ms.',
  ],
  distributed: ['2PC: prepare/commit; Saga: forward + compensate; outbox for Kafka+DB.'],
  resilience: ['States: CLOSED → OPEN → HALF_OPEN; failureRateThreshold, waitDurationInOpenState.'],
  security: ['SCA = composition; SAST = source rules; both in pipeline.'],
};

const CATEGORY_CODE_EXAMPLE: Record<
  Interview7Category,
  { title: string; snippet: string; walkthrough: string[]; pitfall: string; productionNote: string }
> = {
  postgres: {
    title: 'PostgreSQL: optimistic vs pessimistic lock',
    snippet: `-- optimistic (JPA @Version)
UPDATE account SET balance = :new, version = version + 1
WHERE id = :id AND version = :expected; -- 0 rows => OptimisticLockException

-- pessimistic (JPA LockModeType.PESSIMISTIC_WRITE)
BEGIN;
SELECT * FROM account WHERE id = :id FOR UPDATE;
-- business logic
COMMIT;`,
    walkthrough: [
      'Optimistic — без блокировки чтения; конфликт при commit через version.',
      'Pessimistic — блокирует строку до конца tx; hot row contention.',
    ],
    pitfall: 'Optimistic без retry UX; pessimistic на длинной tx — deadlock.',
    productionNote: 'Serialization failure (SQLSTATE 40001) — retry с jitter на SERIALIZABLE.',
  },
  kafka: {
    title: 'Kafka: message lifecycle + offsets',
    snippet: `producer.send(record) -> partition leader append log segment
consumer.poll() -> fetch from offset
process(record) -> side effect (DB)
consumer.commitSync(offset+1)  // stored in __consumer_offsets`,
    walkthrough: [
      'Ordering только внутри partition; key → partition hash.',
      'Commit после успешной обработки — at-least-once при crash до commit.',
    ],
    pitfall: 'Commit до обработки без идемпотентности — потеря при crash после commit.',
    productionNote: 'Мониторить ISR, under-replicated partitions, consumer lag.',
  },
  jvm: {
    title: 'JMM: data race и volatile',
    snippet: `// broken
class Metrics { int count; void inc() { count++; } }

// fix visibility
class Metrics { volatile int count; void inc() { count++; } }
// or AtomicInteger / synchronized`,
    walkthrough: [
      'happens-before: volatile write виден следующему volatile read.',
      'count++ не атомарен — нужен AtomicInteger или sync.',
    ],
    pitfall: 'volatile для compound ops — race остаётся.',
    productionNote: 'Virtual threads: избегать long synchronized/native в hot path (pinning).',
  },
  collections: {
    title: 'Thread-safe lists + HashMap bucket tree',
    snippet: `Collections.synchronizedList(list)  // mutex each op
CopyOnWriteArrayList           // copy on write, fast read
// HashMap: chain > 8 -> TreeNode (red-black), < 6 -> list`,
    walkthrough: [
      'CopyOnWrite — итератор без lock, но дорогой write.',
      'HashMap treeify при длинных коллизиях — O(log n) в bucket.',
    ],
    pitfall: 'Vector — legacy; CopyOnWrite на частых writes.',
    productionNote: 'Immutable keys; equals/hashCode contract (canonical int-6-16).',
  },
  concurrency: {
    title: 'LMAX Disruptor: Ring Buffer sketch',
    snippet: `RingBuffer<Event> ring = RingBuffer.createMultiProducer(...);
Sequence cursor; // monotonic slot
EventHandler onEvent(Event e, long seq, boolean endOfBatch)`,
    walkthrough: [
      'Preallocated ring — без alloc в hot path.',
      'Sequencer координирует producers/consumers без lock.',
    ],
    pitfall: 'Multi-producer без понимания claim sequence — complexity.',
    productionNote: 'Использовать когда latency SLA жёсткий и команда готова.',
  },
  spring: {
    title: 'Propagation: REQUIRES_NEW vs NESTED',
    snippet: `@Transactional(propagation = REQUIRES_NEW)
void audit() { /* new tx, outer suspended */ }

@Transactional(propagation = NESTED)
void partial() { /* savepoint in same tx */ }`,
    walkthrough: [
      'REQUIRES_NEW — commit audit даже если outer rollback.',
      'NESTED rollback — только до savepoint; нужен JDBC savepoint.',
    ],
    pitfall: 'NESTED на datasource без savepoints; self-invocation bypass proxy.',
    productionNote: 'Kafka consumer: DB tx + offset commit ordering; outbox надёжнее.',
  },
  distributed: {
    title: 'Idempotency: REST + PostgreSQL',
    snippet: `CREATE UNIQUE INDEX ON payments (client_id, idempotency_key);
INSERT ... ON CONFLICT DO NOTHING RETURNING id;
-- Kafka: same key -> same partition ordering`,
    walkthrough: [
      'Idempotency-Key header → unique constraint.',
      'Kafka business key dedup + DB record processed_at.',
    ],
    pitfall: 'In-memory dedup only — lost on restart.',
    productionNote: 'TTL cleanup idempotency rows; metrics duplicate rejected.',
  },
  resilience: {
    title: 'Resilience4j CircuitBreaker',
    snippet: `CircuitBreaker cb = CircuitBreaker.of("downstream", config);
Supplier<String> decorated = CircuitBreaker.decorateSupplier(cb, client::call);
// states: CLOSED -> OPEN -> HALF_OPEN`,
    walkthrough: [
      'OPEN — fail fast без вызова downstream.',
      'HALF_OPEN — probe calls после waitDurationInOpenState.',
    ],
    pitfall: 'CB без timeout/retry idempotency — ложные open.',
    productionNote: 'Spring Cloud CircuitBreaker abstraction over Resilience4j.',
  },
  security: {
    title: 'SCA: fix transitive log4j CVE',
    snippet: `# dependency:tree | grep log4j
# pom.xml dependencyManagement force version
# or exclude + add log4j-core safe version
# CI: OWASP dependency-check fail on CVSS >= 7`,
    walkthrough: [
      'SCA сканирует граф зависимостей; SAST — исходники.',
      'Transitive CVE требует BOM/enforcer/explicit override.',
    ],
    pitfall: 'Обновили direct, transitive старый остался.',
    productionNote: 'SBOM на релиз; verify runtime classpath в staging.',
  },
};

const QUESTIONS: QuestionDef[] = [
  {
    id: 'int-7-01',
    title:
      'Объясните разницу между optimistic lock и pessimistic lock в PostgreSQL. Как их реализовать на уровне SQL и в JPA (Hibernate)?',
    practicalHint:
      'На проде: @Version + OptimisticLockException с retry на UI; для hot row — SELECT FOR UPDATE NOWAIT в короткой транзакции. Попросить нарисовать timeline двух транзакций.',
    pitfall: 'Пессимистичная блокировка на длинной транзакции с HTTP-вызовом; оптимистичная без обработки конфликта version.',
    prevention: 'Выбор по частоте конфликтов; FOR UPDATE только внутри короткой tx; метрики version conflict.',
  },
  {
    id: 'int-7-02',
    title:
      'Что такое индекс в PostgreSQL? Опишите разницу между B-Tree, Hash и GIN индексами. Когда один эффективнее другого?',
    practicalHint:
      'Показать EXPLAIN ANALYZE: Index Scan vs Seq Scan. GIN — jsonb @> и полнотекст; B-Tree — даты и ORDER BY. Partial index для active=true.',
    pitfall: 'Hash-индекс для диапазона дат; GIN «на всякий случай» без подходящего predicate.',
    prevention: 'Тип индекса = форма WHERE; после DDL — ANALYZE.',
  },
  {
    id: 'int-7-03',
    title:
      'Как работает MVCC (Multi-Version Concurrency Control) в PostgreSQL? Чем опасна "гонка" сериализации (serialization failure)?',
    practicalHint:
      'VACUUM убирает dead tuples; retry on 40001; READ COMMITTED default; SERIALIZABLE для invariant money transfer.',
    pitfall: 'Длинные tx + bloat; игнорировать retry serialization failure.',
    prevention: 'Короткие tx; retry policy; мониторить table bloat и autovacuum.',
  },
  {
    id: 'int-7-04',
    title:
      'Что такое partition (секционирование) в PostgreSQL? Чем range partition отличается от list partition? Приведите пример.',
    practicalHint:
      'RANGE: orders по month; LIST: sales BY region (EU, US). Partition pruning в EXPLAIN.',
    pitfall: 'Partition key не в WHERE — scan all partitions.',
    prevention: 'Query routing по ключу; DEFAULT partition для orphan; maintenance drop old range.',
  },
  {
    id: 'int-7-05',
    title:
      "Опишите полный жизненный цикл сообщения в Kafka: от producer.send() до consumer.commit(). Где хранятся offset'ы?",
    practicalHint:
      'Manual commit после side effect; offsets keyed by group/topic/partition; __consumer_offsets replication.',
    pitfall: 'Auto-commit до обработки; не знать internal offsets topic.',
    prevention: 'Diagram lifecycle; at-least-once + idempotent handler; monitor commit lag.',
  },
  {
    id: 'int-7-06',
    title:
      'Что такое rebalancing в Kafka? Как он влияет на работу consumer group? Какие стратегии назначения партиций существуют?',
    practicalHint:
      'Revoke → pause processing → assign; max.poll.interval.ms exceeded triggers rebalance; cooperative меньше stop-the-world.',
    pitfall: 'Long processing during rebalance → duplicate or revoke timeout.',
    prevention: 'pause/resume pattern; static membership; tune session/max.poll.',
  },
  {
    id: 'int-7-07',
    title:
      'Как работает exactly-once semantics в Kafka? Опишите роль идемпотентного продюсера и транзакций.',
    practicalHint:
      'enable.idempotence=true; transactional.id; sendOffsetsToTransaction with consume-transform-produce; still need idempotent consumer side effect.',
    pitfall: 'Считать EOS без idempotent DB write; txn timeout too short.',
    prevention: 'EOS for Kafka streams/chains; outbox for DB+Kafka; business dedup key.',
  },
  {
    id: 'int-7-08',
    title:
      'Что такое ISR (In-Sync Replicas) в Kafka? Чем отличается unclean leader election от чистого выбора лидера?',
    practicalHint:
      'min.insync.replicas + acks=all; under-replicated partitions alert; unclean only disaster trade-off.',
    pitfall: 'acks=1 and ISR shrink silent data loss risk.',
    prevention: 'Monitor ISR; disable unclean in prod unless explicit DR policy.',
  },
  {
    id: 'int-7-09',
    title: 'Как работает внутренний механизм хранения данных в Kafka (лог-сегменты)?',
    practicalHint:
      'log.segment.bytes/ms; compacted topics keep latest key; zero-copy sendfile to consumers.',
    pitfall: 'Retention too small loses replay; huge segment slows recovery.',
    prevention: 'Size retention to replay SLA; monitor disk; compaction for changelog topics.',
  },
  {
    id: 'int-7-10',
    title:
      'Расскажите про модель памяти Java (JMM). Что такое happens-before? Приведите пример гонки данных (data race) и volatile для её предотвращения.',
    practicalHint:
      'Use AtomicInteger for count++; volatile flag for shutdown; final fields safe publish.',
    pitfall: 'volatile on i++ thinking atomic; double-checked locking without volatile ref.',
    prevention: 'Prefer java.util.concurrent; happens-before table on whiteboard.',
  },
  {
    id: 'int-7-11',
    title: 'В чём разница между Collections.synchronizedList, CopyOnWriteArrayList и Vector? Когда применять каждый?',
    practicalHint:
      'CopyOnWrite for read-heavy listeners/config; synchronizedList rare short sections; Vector — avoid new code.',
    pitfall: 'CopyOnWrite with frequent writes; iterate synchronizedList without external sync.',
    prevention: 'Match structure to read/write ratio; ConcurrentHashMap for shared maps.',
  },
  {
    id: 'int-7-12',
    title:
      'Опишите внутреннее устройство HashMap в Java 21. Как работает связка с красно-чёрными деревьями при больших коллизиях?',
    practicalHint:
      'Canonical int-6-16: hashCode→bucket, equals→key; mutable key breaks lookup; treeify mitigates HashDoS long chains.',
    pitfall: '«Always O(1)»; mutable key after put.',
    prevention: 'Immutable keys; correct equals/hashCode; know resize rehash cost.',
  },
  {
    id: 'int-7-13',
    title:
      'Что такое виртуальные потоки (Virtual Threads) в Java 21? В чём отличие от платформенных (platform threads) и пула thread pool executors?',
    practicalHint:
      'Executors.newVirtualThreadPerTaskExecutor(); avoid synchronized/native pin on carrier; not for CPU-bound matrix.',
    pitfall: 'Pool of platform threads for 100k HTTP when VT fit; pinning collapses scalability.',
    prevention: 'VT for I/O; fixed pool for CPU; monitor carrier pool and pinned threads.',
  },
  {
    id: 'int-7-14',
    title:
      'Какие виды ссылок (Strong, Soft, Weak, PhantomReference) существуют в Java? Как они используются в кэшах или для предотвращения утечек памяти?',
    practicalHint:
      'WeakHashMap for listener maps; SoftReference cache with size guard; Phantom for native resource dispose.',
    pitfall: 'SoftReference as unbounded cache; Phantom expecting immediate get().',
    prevention: 'Caffeine with explicit size/TTL beats SoftReference alone.',
  },
  {
    id: 'int-7-15',
    title:
      'Опишите полный цикл сборки мусора в G1GC: от young GC до mixed GC и финального marking. Как выявить проблемы через GC logs?',
    practicalHint:
      '-Xlog:gc*:file=gc.log; watch pause times, allocation rate, to-space exhausted, Full GC (failure).',
    pitfall: 'Huge humongous objects bypass Eden; ignore metaspace/class unload.',
    prevention: 'Tune MaxGCPauseMillis; region size; fix leak before tuning.',
  },
  {
    id: 'int-7-16',
    title: 'Как работает механизм модулей (JPMS) в Java? В чём отличие requires transitive от обычного requires?',
    practicalHint:
      'Library api module requires transitive core.model; app module requires api gets model readable; unnamed/automatic modules migration pain.',
    pitfall: 'IllegalAccessError reflective access across modules; split packages.',
    prevention: 'Explicit exports/opens; jlink for custom runtime; document module path.',
  },
  {
    id: 'int-7-17',
    title: 'Что такое LMAX Disruptor? Как он связан с high-load системами и принципом Ring Buffer?',
    practicalHint:
      'Single/multiple producers publish events; wait strategies (BusySpin/Yielding); batch EndOfBatch processing.',
    pitfall: 'Use everywhere vs simple BlockingQueue team can maintain.',
    prevention: 'Adopt when latency SLA proves queue bottleneck; benchmark first.',
  },
  {
    id: 'int-7-18',
    title: 'Как работает HikariCP (пул соединений) с PostgreSQL? Что произойдёт, если не закрывать ResultSet или Statement?',
    practicalHint:
      'try-with-resources; leakDetectionThreshold logs stack; maxLifetime < PG idle timeout; pool size ~ cores*2+spindle formula guide.',
    pitfall: 'Long transaction holding connection; ORM session without clear boundaries.',
    prevention: 'Short tx; datasource metrics (pending threads); enforce try-with-resources.',
  },
  {
    id: 'int-7-19',
    title:
      'Расскажите про механизм идемпотентности в REST API. Как реализовать её на уровне базы (PostgreSQL + уникальный ключ) и на уровне Kafka?',
    practicalHint:
      'POST payment once; retry same key → 200 same body; Kafka insert inbox ON CONFLICT DO NOTHING.',
    pitfall: 'Only Redis dedup without durability; TTL too short accepts duplicate.',
    prevention: 'DB unique + response cache; metrics conflicts; document retry policy.',
  },
  {
    id: 'int-7-20',
    title:
      'В чём разница между @Transactional с propagation REQUIRES_NEW и NESTED в Spring? Как это влияет на транзакции БД и сбои в Kafka consumer?',
    practicalHint:
      'Canonical int-6-27 proxy/self-invocation still applies; separate bean for REQUIRES_NEW; NESTED needs savepoint-capable DB.',
    pitfall: 'NESTED on unsupported driver; commit offset before DB tx.',
    prevention: 'Transactional outbox; process+commit order; test propagation with rollback scenarios.',
  },
  {
    id: 'int-7-21',
    title:
      'Опишите алгоритм двухфазного коммита (2PC) в распределённых транзакциях. Где он применяется и какие есть альтернативы (Saga)?',
    practicalHint:
      'Microservices prefer outbox + Saga; 2PC rare (Atomikos); TCC try-confirm-cancel variant.',
    pitfall: '2PC across many microservices latency and locks; in-doubt after coordinator crash.',
    prevention: 'Saga compensations idempotent; event log; avoid global 2PC in K8s mesh.',
  },
  {
    id: 'int-7-22',
    title:
      'Как работает паттерн Circuit Breaker в высоконагруженных системах? Приведите пример с Resilience4j или Spring Cloud Circuit Breaker.',
    practicalHint:
      'failureRateThreshold 50%, slidingWindowSize 100, waitDurationInOpenState 60s; fallback method returns cache.',
    pitfall: 'No fallback; breaker on non-idempotent retry storm.',
    prevention: 'Combine timeout + bulkhead; metrics in Prometheus; chaos tests.',
  },
  {
    id: 'int-7-23',
    title:
      'Что такое SCA (Software Composition Analysis) и SAST (Static Application Security Testing)? Как исправить критичную уязвимость в transitive зависимости от log4j?',
    practicalHint:
      'CI fails CVSS≥7; Dependabot/Renovate PRs; enforcer ban version ranges; runtime classpath scan.',
    pitfall: 'Upgrade direct only; shaded fat jar hides duplicate versions.',
    prevention: 'SBOM each release; policy on transitive; emergency override documented.',
  },
];

const QUESTION_LECTURER_NOTES: Record<string, string[]> = {
  'int-7-01': [
    'Попросить написать UPDATE с version и SELECT FOR UPDATE; JPA @Version entity field.',
  ],
  'int-7-05': [
    'Offsets: __consumer_offsets compacted topic; group coordinator manages.',
  ],
  'int-7-07': [
    'Развести broker EOS и business idempotency — must ask both.',
  ],
  'int-7-10': [
    'Classic broken singleton double-check — need volatile instance ref.',
  ],
  'int-7-12': [
    'Canonical HashMap: module-interview-6 int-6-16, module-interview-4 int-4-02.',
  ],
  'int-7-13': [
    'JEP 444: millions VT; thread-per-request model returns.',
  ],
  'int-7-20': [
    'Canonical @Transactional proxy: int-6-27; propagation — new depth here.',
  ],
  'int-7-23': [
    'Log4Shell: JNDI lookup; fix version + remove JndiLookup class mitigation history.',
  ],
};

/** Сжатые bullets из canonical sources — не противоречить int-6 / int-4. */
const QUESTION_CANONICAL_SYNC: Record<string, string[]> = {
  'int-7-05': [
    'Kafka — commit log; ordering в partition; consumer group (canonical int-6-02).',
    'Offset commit после обработки; at-least-once + idempotent consumer (int-6-03).',
  ],
  'int-7-06': [
    'max parallelism = partitions (int-6-04); rebalance перераспределяет assignments.',
  ],
  'int-7-07': [
    'Idempotent producer + transactions; business dedup still required (int-6-03).',
  ],
  'int-7-12': [
    'hashCode→bucket, equals→key; load factor; treeification; mutable key риск (int-6-16).',
  ],
  'int-7-20': [
    'CGLIB vs JDK proxy; self-invocation; final blocks CGLIB (int-6-27).',
  ],
};

const QUESTION_EXTRA_KEY_POINTS: Record<string, string[]> = {
  'int-7-08': ['unclean.leader.election.enable=false в prod unless DR exception.'],
  'int-7-15': ['Full GC in G1 — sign of metaspace/heap mis-tuning or humongous leak.'],
};

function getQuestionNumber(questionId: string): number {
  return Number(questionId.replace('int-7-', ''));
}

function detectCategory(questionId: string): Interview7Category {
  const number = getQuestionNumber(questionId);
  if (number <= 4) {
    return 'postgres';
  }
  if (number <= 9) {
    return 'kafka';
  }
  if (number === 10) {
    return 'jvm';
  }
  if (number <= 12) {
    return 'collections';
  }
  if (number <= 16) {
    return 'jvm';
  }
  if (number === 17) {
    return 'concurrency';
  }
  if (number === 18 || number === 20) {
    return 'spring';
  }
  if (number === 19 || number === 21) {
    return 'distributed';
  }
  if (number === 22) {
    return 'resilience';
  }
  return 'security';
}

function buildTopic(question: QuestionDef): Topic {
  const enrichment = INTERVIEW7_TOPIC_ENRICHMENT[question.id];
  if (!enrichment) {
    throw new Error(`Missing INTERVIEW7_TOPIC_ENRICHMENT for ${question.id}`);
  }
  const category = detectCategory(question.id);
  const extraKeyPoints = [
    ...enrichment.liveCheatsheet.map((line) => `На экране ведущего: ${line}`),
    ...(QUESTION_CANONICAL_SYNC[question.id] ?? []),
    ...(QUESTION_EXTRA_KEY_POINTS[question.id] ?? []),
  ];

  return topic({
    id: question.id,
    title: question.title,
    simpleDefinitionOverride: enrichment.simpleDefinition,
    quickAnswer: enrichment.quickAnswer,
    explainBrief: [
      ...enrichment.explainBrief,
      `Production-акцент: ${question.practicalHint}`,
      `Красный флаг: ${question.pitfall}`,
      `Как проверить глубину: ${question.prevention}`,
    ],
    extraKeyPoints,
    questionPlan: enrichment.questionPlan,
    interviewFocus: [
      {
        question: 'Ожидаемый короткий ответ кандидата',
        expectedAnswer: enrichment.quickAnswer,
      },
      {
        question: 'Что добавит кандидат с реальным production-опытом',
        expectedAnswer: question.practicalHint,
      },
      {
        question: 'Красный флаг / поверхностный ответ',
        expectedAnswer: `${question.pitfall} Как проверять на собесе: ${question.prevention}`,
      },
    ],
    codeExample: {
      title: enrichment.codeExample.title,
      language: enrichment.codeExample.language,
      snippet: enrichment.codeExample.snippet,
      walkthrough: enrichment.codeExample.walkthrough,
      commonPitfall: enrichment.codeExample.commonPitfall,
      productionNote: enrichment.codeExample.productionNote ?? CATEGORY_CODE_EXAMPLE[category].productionNote,
    },
    usefulLinksOverride: INTERVIEW7_LINKS,
    glossary: enrichment.glossary,
    lecturerNotes: [
      ...CATEGORY_LECTURER_NOTES[category],
      ...(QUESTION_LECTURER_NOTES[question.id] ?? []),
    ],
    estimatedMinutes: 5,
  });
}

export const moduleInterview7: LectureModule = {
  id: 'interview-7',
  interviewSectionKicker: 'PostgreSQL, Kafka deep dive, JVM 21, distributed systems',
  title: 'Интервью 7: PostgreSQL, Kafka, JVM 21 и распределённые системы',
  targetDurationMinutes: 115,
  audienceLevel: 'Middle / Senior',
  isAvailable: true,
  summary:
    '23 темы: блокировки и MVCC PostgreSQL, Kafka lifecycle/EOS/ISR, JMM/Virtual Threads/G1GC, идемпотентность, Saga, Circuit Breaker, SCA/SAST.',
  topics: QUESTIONS.map(buildTopic),
};
