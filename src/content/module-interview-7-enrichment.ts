import type { TopicCodeExample, TopicGlossaryEntry } from './schema';

export type Interview7TopicEnrichment = {
  simpleDefinition: string;
  quickAnswer: string;
  explainBrief: string[];
  questionPlan: { question: string; answerHint: string }[];
  glossary: TopicGlossaryEntry[];
  codeExample: TopicCodeExample;
  liveCheatsheet: string[];
};

export const INTERVIEW7_TOPIC_ENRICHMENT: Record<string, Interview7TopicEnrichment> = {
  'int-7-01': {
    simpleDefinition:
      'Оптимистичная блокировка предполагает, что конфликты редки: транзакция читает строку без блокировки, а при сохранении проверяет, что данные никто не изменил (поле version или условие в WHERE). Пессимистичная блокировка сразу «занимает» строку — другие транзакции ждут, пока вы не сделаете COMMIT или ROLLBACK.',
    quickAnswer:
      'Оптимистичная — для редких одновременных правок: читаем свободно, при UPDATE проверяем version; если строка уже изменена — OptimisticLockException и retry. Пессимистичная — для «горячих» строк, которые все меняют: SELECT … FOR UPDATE держит строку до конца транзакции. В Hibernate: @Version и LockModeType.PESSIMISTIC_WRITE.',
    explainBrief: [
      'Оптимистичная не блокирует чтение — конфликт виден только в момент записи (0 обновлённых строк или исключение).',
      'Пессимистичная блокирует строку на время транзакции — другие UPDATE/DELETE ждут.',
      'SQL оптимистичной: UPDATE … SET …, version = version + 1 WHERE id = ? AND version = ?.',
      'SQL пессимистичной: BEGIN; SELECT * FROM account WHERE id = ? FOR UPDATE; … COMMIT;',
      'JPA: @Version на сущности; @Lock(LockModeType.PESSIMISTIC_WRITE) или entityManager.lock().',
      'Выбор: редкие конфликты → optimistic; одна строка баланса/остатка, много конкурентов → pessimistic короткой транзакцией.',
      'NOWAIT / SKIP LOCKED — варианты FOR UPDATE, когда ждать нельзя.',
    ],
    questionPlan: [
      {
        question: 'Чем оптимистичная блокировка отличается от пессимистичной по поведению в базе?',
        answerHint:
          'Оптимистичная не держит блокировку при чтении; пессимистичная блокирует строку до COMMIT. Конфликт optimistic — при UPDATE, pessimistic — ожидание других транзакций.',
      },
      {
        question: 'Как выглядит оптимистичная блокировка в SQL и в JPA?',
        answerHint:
          'SQL: version в UPDATE … WHERE version = ?. JPA: @Version, при конфликте OptimisticLockException.',
      },
      {
        question: 'Когда на проде выберете pessimistic lock?',
        answerHint:
          'Горячая строка (баланс, остаток на складе), короткая транзакция, нельзя потерять update из-за retry на UI.',
      },
      {
        question: 'Какой красный флаг в ответе кандидата?',
        answerHint:
          '«Optimistic всегда быстрее» без учёта частоты конфликтов; пессимистичная lock на длинной транзакции с внешними вызовами.',
      },
    ],
    glossary: [
      { term: 'Оптимистичная блокировка', meaning: 'Проверка «никто не изменил строку» при записи, без блокировки на чтении.' },
      { term: 'Пессимистичная блокировка', meaning: 'Явная блокировка строки (FOR UPDATE) до конца транзакции.' },
      { term: '@Version', meaning: 'Поле версии в JPA/Hibernate; инкремент при каждом успешном UPDATE.' },
      { term: 'OptimisticLockException', meaning: 'Исключение JPA, когда version при сохранении не совпал с БД.' },
      { term: 'FOR UPDATE', meaning: 'Режим PostgreSQL: выбранные строки заблокированы для других транзакций.' },
      { term: 'LockModeType.PESSIMISTIC_WRITE', meaning: 'Режим JPA для пессимистичной блокировки при чтении сущности.' },
      { term: 'NOWAIT', meaning: 'FOR UPDATE NOWAIT — сразу ошибка, если строка уже заблокирована, без ожидания.' },
    ],
    codeExample: {
      title: 'SQL и JPA: две стратегии блокировки',
      language: 'text',
      snippet: `-- Оптимистичная (поле version)
UPDATE account
SET balance = :newBalance, version = version + 1
WHERE id = :id AND version = :expectedVersion;
-- 0 строк → конфликт, retry или 409

-- Пессимистичная
BEGIN;
SELECT id, balance FROM account WHERE id = :id FOR UPDATE;
-- логика внутри транзакции
COMMIT;

// JPA
@Version private Long version;
@Lock(LockModeType.PESSIMISTIC_WRITE) Account findForUpdate(Long id);`,
      walkthrough: [
        'На собесе попросите нарисовать timeline: два потока, одна строка — где ждут, где падают.',
        'Связать optimistic с редкими конфликтами, pessimistic с hot row.',
      ],
      commonPitfall: 'Держать FOR UPDATE, пока сервис ходит во внешний HTTP — deadlock и исчерпание пула соединений.',
      productionNote: 'При optimistic — понятный retry для пользователя; логировать version conflict rate.',
    },
    liveCheatsheet: [
      'Оптимистичная: version / WHERE version = ?',
      'Пессимистичная: FOR UPDATE до COMMIT',
      'JPA: @Version | PESSIMISTIC_WRITE',
      'Hot row → pessimistic, короткая tx',
    ],
  },
  'int-7-02': {
    simpleDefinition:
      'Индекс в PostgreSQL — отдельная структура данных, которая ускоряет поиск строк по условию в WHERE/JOIN/ORDER BY, ценой места на диске и замедления INSERT/UPDATE. Тип индекса выбирают под форму запроса: B-Tree — универсальный, GIN — для «содержимого внутри» (jsonb, массивы, полнотекст), Hash — почти только равенство и редко используется.',
    quickAnswer:
      'B-Tree (по умолчанию) — равенство, диапазоны, сортировка. GIN — jsonb @>, полнотекст, массивы. Hash — только =, на практике почти не нужен. Всегда смотреть EXPLAIN: Index Scan, Bitmap Index Scan, Seq Scan.',
    explainBrief: [
      'B-Tree: WHERE id = ?, диапазоны дат, ORDER BY по индексируемому столбцу.',
      'GIN: «есть ли ключ в jsonb», to_tsvector, elem = ANY(array).',
      'Hash: только equality; не поддерживает range; в современных PG B-Tree часто достаточно.',
      'Составной индекс (a, b) работает для WHERE a = ? AND b = ?, но не всегда для одного b.',
      'Partial index: CREATE INDEX … WHERE active = true — меньше размер, точнее под запрос.',
      'EXPLAIN (ANALYZE, BUFFERS) — обязательный инструмент проверки, что индекс реально используется.',
    ],
    questionPlan: [
      {
        question: 'Зачем нужен индекс и чем платим за него?',
        answerHint: 'Быстрее чтение; медленнее запись, место на диске, нужен VACUUM/статистика.',
      },
      {
        question: 'Когда B-Tree, когда GIN?',
        answerHint: 'B-Tree — скалярные столбцы, диапазоны; GIN — jsonb, full-text, массивы.',
      },
      {
        question: 'Как проверить, что индекс используется?',
        answerHint: 'EXPLAIN / EXPLAIN ANALYZE; смотреть Index Scan vs Seq Scan, rows, cost.',
      },
      {
        question: 'Что такое partial index и зачем?',
        answerHint: 'Индекс только на подмножество строк (WHERE …) — меньше, быстрее под частый запрос.',
      },
    ],
    glossary: [
      { term: 'B-Tree индекс', meaning: 'Стандартный индекс PG: равенство, диапазоны, ORDER BY.' },
      { term: 'GIN индекс', meaning: 'Inverted index для составных значений: jsonb, tsvector, массивы.' },
      { term: 'Hash индекс', meaning: 'Только операция равенства; редко выбирают вместо B-Tree.' },
      { term: 'Seq Scan', meaning: 'Полный перебор таблицы — признак отсутствия подходящего индекса.' },
      { term: 'Bitmap Index Scan', meaning: 'PG объединяет несколько индексов через bitmap перед чтением heap.' },
      { term: 'Составной индекс', meaning: 'Индекс по нескольким столбцам; порядок столбцов важен.' },
      { term: 'Partial index', meaning: 'Индекс только на строки, удовлетворяющие условию WHERE в определении.' },
    ],
    codeExample: {
      title: 'Типы индексов под запрос',
      language: 'text',
      snippet: `CREATE INDEX idx_orders_created ON orders (created_at);          -- B-Tree, диапазоны
CREATE INDEX idx_payload_gin ON events USING gin (payload jsonb_path_ops); -- GIN, jsonb
CREATE INDEX idx_active_users ON users (email) WHERE deleted_at IS NULL;  -- partial

EXPLAIN ANALYZE
SELECT * FROM orders WHERE created_at >= '2026-01-01';`,
      walkthrough: [
        'Связать тип индекса с predicate в WHERE, не с названием таблицы.',
        'GIN без jsonb/@> или full-text — лишний индекс.',
      ],
      commonPitfall: 'Индекс на низкоселективный столбец (boolean) — planner всё равно выберет Seq Scan.',
      productionNote: 'После миграции — ANALYZE; мониторить bloat индексов.',
    },
    liveCheatsheet: ['B-Tree = =, диапазон, ORDER BY', 'GIN = jsonb, текст, массивы', 'Проверка: EXPLAIN ANALYZE'],
  },
  'int-7-03': {
    simpleDefinition:
      'MVCC в PostgreSQL означает, что каждая транзакция видит согласованный «снимок» данных на момент старта: читатели не блокируют писателей, писатели создают новые версии строк, старые помечаются как мёртвые до VACUUM. При уровне SERIALIZABLE возможна ошибка сериализации (SQLSTATE 40001) — транзакцию нужно повторить.',
    quickAnswer:
      'Читатели видят snapshot; UPDATE создаёт новую версию строки. Конфликт сериализации — сигнал, что параллельные транзакции нарушили бы изоляцию SERIALIZABLE; ответ — rollback и retry с backoff, а не игнорирование.',
    explainBrief: [
      'Каждая строка может иметь несколько версий (xmin/xmax) — видимость зависит от id транзакции.',
      'READ COMMITTED (по умолчанию) — новый snapshot на каждый statement.',
      'REPEATABLE READ / SERIALIZABLE — один snapshot на всю транзакцию (с нюансами SSI).',
      'Serialization failure (40001) — «гонка сериализации»: две tx логически несовместимы при полной изоляции.',
      'Длинные транзакции → bloat (мёртвые версии), рост таблицы, давление на autovacuum.',
      'VACUUM очищает dead tuples; без него — деградация и риск transaction id wraparound.',
    ],
    questionPlan: [
      {
        question: 'Как MVCC помогает читателям и писателям не мешать друг другу?',
        answerHint: 'Snapshot read не блокирует write; write создаёт новую версию, старая скрыта для новых snapshot.',
      },
      {
        question: 'Что такое serialization failure и что делать?',
        answerHint: 'SQLSTATE 40001; rollback; retry с jitter; не считать это «багом БД».',
      },
      {
        question: 'Чем опасны длинные транзакции при MVCC?',
        answerHint: 'Bloat, рост dead tuples, autovacuum не успевает, рост диска и замедление scan.',
      },
      {
        question: 'Какой уровень изоляции по умолчанию в PostgreSQL?',
        answerHint: 'READ COMMITTED.',
      },
    ],
    glossary: [
      { term: 'MVCC', meaning: 'Многоверсионность: хранение нескольких версий строк для параллельных транзакций.' },
      { term: 'Snapshot', meaning: 'Снимок данных, который видит транзакция на момент своего правила изоляции.' },
      { term: 'Serialization failure', meaning: 'Ошибка 40001: транзакция не может быть сериализована с другими.' },
      { term: 'Dead tuple', meaning: 'Старая версия строки, уже невидимая, но занимающая место до VACUUM.' },
      { term: 'VACUUM', meaning: 'Фоновая очистка мёртвых версий и обновление статистики видимости.' },
      { term: 'SSI', meaning: 'Serializable Snapshot Isolation — реализация SERIALIZABLE в PostgreSQL.' },
      { term: 'READ COMMITTED', meaning: 'Уровень изоляции по умолчанию: новый snapshot на каждый запрос.' },
    ],
    codeExample: {
      title: 'Retry при serialization failure',
      language: 'text',
      snippet: `BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- бизнес-логика
COMMIT;
-- при ошибке: SQLSTATE 40001 → rollback, sleep(jitter), retry (лимит попыток)`,
      walkthrough: [
        'На собесе: отличить deadlock (40P01) от serialization failure (40001).',
        'Retry только идемпотентных операций или с dedup ключом.',
      ],
      commonPitfall: 'SERIALIZABLE везде «на всякий случай» — лишние 40001 и retry storm.',
      productionNote: 'Мониторить pg_stat_database_conflicts и длительность tx.',
    },
    liveCheatsheet: ['Snapshot → читатели не блокируют писателей', '40001 → retry', 'Длинная tx → bloat'],
  },
  'int-7-04': {
    simpleDefinition:
      'Секционирование (partitioning) делит одну логическую таблицу на физические части — партиции. RANGE делит по интервалам (даты, числа), LIST — по списку значений (регион, статус). Planner может отсекать лишние партиции (partition pruning), если в WHERE есть ключ секционирования.',
    quickAnswer:
      'RANGE: заказы по месяцам (created_at). LIST: продажи по региону (EU, US). Без ключа в WHERE — скан всех партиций. Для архива — DROP старой партиции вместо DELETE миллионов строк.',
    explainBrief: [
      'Родительская таблица — логическая; данные лежат в child partition tables.',
      'RANGE PARTITION BY RANGE (created_at) — удобно для time-series и TTL.',
      'LIST PARTITION BY LIST (region) — удобно для фиксированного набора категорий.',
      'Partition pruning: WHERE created_at >= «2026-05-01» → только нужные партиции в плане.',
      'DEFAULT partition — ловит строки вне объявленных границ.',
      'Индексы обычно локальные на партицию; глобальный уникальный ключ сложнее.',
    ],
    questionPlan: [
      {
        question: 'Чем RANGE partition отличается от LIST?',
        answerHint: 'RANGE — интервалы; LIST — дискретный набор значений.',
      },
      {
        question: 'Приведите пример таблицы с RANGE и LIST.',
        answerHint: 'orders по month; sales по region EU/US/APAC.',
      },
      {
        question: 'Что такое partition pruning?',
        answerHint: 'Planner не читает партиции, не попадающие под WHERE по ключу.',
      },
      {
        question: 'Зачем секционирование на проде?',
        answerHint: 'Быстрые запросы по свежим данным, дешёвое удаление старых партиций, меньше индекс на hot data.',
      },
    ],
    glossary: [
      { term: 'Секционирование (partitioning)', meaning: 'Разбиение большой таблицы на управляемые физические части.' },
      { term: 'RANGE partition', meaning: 'Партиции по непрерывным интервалам (даты, числа).' },
      { term: 'LIST partition', meaning: 'Партиции по явному списку значений столбца.' },
      { term: 'Partition pruning', meaning: 'Исключение ненужных партиций из плана запроса.' },
      { term: 'Партиция по умолчанию (DEFAULT)', meaning: 'Партиция для строк, не попавших в другие правила.' },
      { term: 'Child partition', meaning: 'Физическая таблица, хранящая подмножество строк родителя.' },
    ],
    codeExample: {
      title: 'RANGE и LIST в PostgreSQL',
      language: 'text',
      snippet: `CREATE TABLE orders (
  id bigint, created_at date, amount numeric
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2026_05 PARTITION OF orders
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');

CREATE TABLE sales (
  id bigint, region text, total numeric
) PARTITION BY LIST (region);

CREATE TABLE sales_eu PARTITION OF sales FOR VALUES IN ('EU');`,
      walkthrough: [
        'Попросить: что будет в EXPLAIN, если забыть created_at в WHERE.',
        'Связать с операционкой: detach/drop старой партиции.',
      ],
      commonPitfall: 'Секционировать без ключа в типичных запросах — нет pruning, только overhead.',
      productionNote: 'Автоматическое создание партиций (pg_partman или cron DDL).',
    },
    liveCheatsheet: ['RANGE = даты/числа', 'LIST = регион/статус', 'WHERE по ключу → pruning'],
  },
  'int-7-05': {
    simpleDefinition:
      'Жизненный цикл сообщения в Kafka: продюсер сериализует запись и отправляет в партицию лидера; брокер дописывает в лог-сегмент; консюмер читает batch, обрабатывает бизнес-логику и фиксирует offset. Committed offsets хранятся во внутреннем топике __consumer_offsets.',
    quickAnswer:
      'producer.send → partition leader → log segment → consumer.poll → handler → commit offset. Offsets — в __consumer_offsets (ключ: group + topic + partition). Commit после успешной обработки = at-least-once при падении между process и commit.',
    explainBrief: [
      'Партиционер выбирает partition (по key или round-robin).',
      'acks=all ждёт подтверждения ISR перед ответом продюсеру.',
      'Consumer group: каждая partition в момент времени у одного consumer в группе.',
      'Auto-commit vs manual commit — когда фиксируется offset относительно обработки.',
      'Порядок сообщений гарантирован только внутри одной partition.',
      'При rebalance — revoke partitions, commit sync, передать назначение другому consumer.',
    ],
    questionPlan: [
      { question: 'Опишите путь сообщения от send до commit.', answerHint: 'Producer → log → poll → process → offset commit.' },
      { question: 'Где физически хранятся offsets?', answerHint: '__consumer_offsets, compacted topic.' },
      { question: 'Когда возможны дубликаты?', answerHint: 'Crash после process до commit; at-least-once + rebalance.' },
      { question: 'Что влияет на выбор partition?', answerHint: 'Key hash, custom partitioner, число partitions.' },
    ],
    glossary: [
      { term: 'Offset', meaning: 'Позиция чтения в partition log для consumer group.' },
      { term: '__consumer_offsets', meaning: 'Служебный топик Kafka с закоммиченными offset.' },
      { term: 'Partition leader', meaning: 'Брокер, принимающий записи и отдающий чтение для partition.' },
      { term: 'Consumer group', meaning: 'Группа consumers, совместно читающих топик и делящих partitions.' },
      { term: 'acks', meaning: 'Сколько реплик должно подтвердить запись (0/1/all).' },
      { term: 'At-least-once', meaning: 'Сообщение может быть обработано более одного раза при retry/rebalance.' },
    ],
    codeExample: {
      title: 'Lifecycle и commit',
      language: 'text',
      snippet: `producer.send(new ProducerRecord<>("orders", orderId, payload));
// → leader append → ack

while (true) {
  ConsumerRecords r = consumer.poll(Duration.ofMillis(500));
  for (ConsumerRecord rec : r) {
    process(rec);           // side effect: БД, статус
    consumer.commitSync();  // offset+1 в __consumer_offsets
  }
}`,
      walkthrough: ['Нарисовать на доске: log, offset, consumer group.', 'Commit после side effect.'],
      commonPitfall: 'commitSync до записи в БД — потеря при crash после commit.',
      productionNote: 'Метрики: consumer lag, commit rate, rebalance count.',
    },
    liveCheatsheet: ['send → log → poll → process → commit', 'Offsets: __consumer_offsets', 'Порядок только в partition'],
  },
  'int-7-06': {
    simpleDefinition:
      'Rebalancing — перераспределение партиций между участниками consumer group при join/leave, изменении числа partitions или таймауте consumer. На время rebalance обработка останавливается (или частично при cooperative assignor). Стратегии назначения: Range, RoundRobin, Sticky, CooperativeSticky.',
    quickAnswer:
      'Новый consumer или падение старого → group coordinator инициирует rebalance → revoke → assign. CooperativeSticky уменьшает «стоп всего». Тюнинг: session.timeout.ms, max.poll.interval.ms, static group.instance.id.',
    explainBrief: [
      'Stop-the-world rebalance: все consumers отпускают partitions, потом получают новые.',
      'Cooperative (incremental): сначала revoke лишние, consumer продолжает читать остальные.',
      'max.poll.interval.ms — если обработка batch дольше, consumer исключают из группы.',
      'static membership (group.instance.id) — меньше rebalance при рестарте pod.',
      'onPartitionsRevoked — место для commit и flush состояния.',
      'Rebalance storm при частых деплоях — рост lag и дубликатов.',
    ],
    questionPlan: [
      { question: 'Что такое rebalance и когда он случается?', answerHint: 'Join/leave, timeout, изменение subscriptions/partitions.' },
      { question: 'Как rebalance влияет на lag и дубликаты?', answerHint: 'Пауза чтения; незакоммиченные сообщения перечитывают.' },
      { question: 'Чем CooperativeSticky лучше Range?', answerHint: 'Меньше revoke всех partitions сразу.' },
      { question: 'Как уменьшить rebalance в Kubernetes?', answerHint: 'static instance id, graceful shutdown, commit в revoke.' },
    ],
    glossary: [
      { term: 'Rebalance', meaning: 'Переназначение partitions между members consumer group.' },
      { term: 'Group coordinator', meaning: 'Брокер, управляющий membership и offset metadata группы.' },
      { term: 'CooperativeStickyAssignor', meaning: 'Инкрементальный rebalance — меньше простоя.' },
      { term: 'max.poll.interval.ms', meaning: 'Макс. время между poll до исключения consumer из группы.' },
      { term: 'group.instance.id', meaning: 'Статический id consumer для уменьшения rebalance при рестарте.' },
      { term: 'onPartitionsRevoked', meaning: 'Callback перед отбором partitions — commit и cleanup.' },
    ],
    codeExample: {
      title: 'Revoke и commit',
      language: 'text',
      snippet: `consumer.subscribe(List.of("orders"), new ConsumerRebalanceListener() {
  public void onPartitionsRevoked(Collection<TopicPartition> parts) {
    consumer.commitSync(); // зафиксировать обработанное
  }
  public void onPartitionsAssigned(Collection<TopicPartition> parts) { }
});
// partition.assignment.strategy = CooperativeStickyAssignor`,
      walkthrough: ['Связать с K8s rolling update.', 'Длинный handler → max.poll.interval.'],
      commonPitfall: 'Тяжёлая обработка в poll loop без pause — постоянный rebalance.',
      productionNote: 'Алерт на rebalance rate; cooperative assignor в новых клиентах.',
    },
    liveCheatsheet: ['Rebalance = перераздача partitions', 'CooperativeSticky — меньше stop', 'Revoke → commit'],
  },
  'int-7-07': {
    simpleDefinition:
      'Exactly-once в Kafka на стороне брокера достигается идемпотентным продюсером (PID + sequence number) и транзакциями (atomic write в несколько partitions + sendOffsetsToTransaction). Consumer с isolation.level=read_committed не видит aborted записей. Бизнес-эффект в БД всё равно требует идемпотентности или outbox.',
    quickAnswer:
      'enable.idempotence=true — дедуп повторных send в рамках сессии. transactional.id + beginTransaction/commit — атомарная запись. EOS не заменяет идемпотентный INSERT в PostgreSQL — нужен уникальный ключ или outbox.',
    explainBrief: [
      'Идемпотентный producer: ProducerId + sequence per partition — брокер отбрасывает дубликаты.',
      'Транзакция producer: begin → send → sendOffsetsToTransaction → commit.',
      'read_committed consumer пропускает сообщения aborted transaction.',
      'consume-transform-produce в Streams использует EOS внутри приложения.',
      'transaction.timeout.ms и max.transaction.timeout.ms — лимиты жизни транзакции.',
      'Связка Kafka txn + DB — классически transactional outbox, не 2PC на каждый запрос.',
    ],
    questionPlan: [
      { question: 'Роль идемпотентного продюсера?', answerHint: 'PID+seq; retry send не создаёт дубликат в log.' },
      { question: 'Что дают транзакции Kafka?', answerHint: 'Атомарность нескольких writes + commit offsets в одной txn.' },
      { question: 'Где граница «exactly-once»?', answerHint: 'Брокер/streams vs side effect в БД.' },
      { question: 'Как связать с PostgreSQL?', answerHint: 'Outbox, inbox, idempotency key, не только Kafka txn.' },
    ],
    glossary: [
      { term: 'Идемпотентный продюсер', meaning: 'Продюсер с PID; брокер дедуплицирует повторы в partition.' },
      { term: 'Транзакция Kafka', meaning: 'Atomic batch produce + опционально commit consumer offsets.' },
      { term: 'read_committed', meaning: 'Уровень изоляции consumer: не читать aborted сообщения.' },
      { term: 'sendOffsetsToTransaction', meaning: 'Включение offset commit в ту же транзакцию producer.' },
      { term: 'Transactional outbox', meaning: 'Запись события в БД в той же tx, что и бизнес-данные.' },
      { term: 'Бизнес-идемпотентность', meaning: 'Повтор обработки не меняет результат (unique key, dedup).' },
    ],
    codeExample: {
      title: 'Идемпотентный и транзакционный producer',
      language: 'text',
      snippet: `props.put(ENABLE_IDEMPOTENCE_CONFIG, true);
props.put(TRANSACTIONAL_ID_CONFIG, "order-tx-1");

producer.initTransactions();
producer.beginTransaction();
try {
  producer.send(record);
  producer.sendOffsetsToTransaction(offsets, consumerGroupMetadata);
  producer.commitTransaction();
} catch (Exception e) {
  producer.abortTransaction();
}`,
      walkthrough: ['Развести broker EOS и DB.', 'Outbox для микросервисов.'],
      commonPitfall: 'Считать EOS «оплата дважды невозможна» без unique в БД.',
      productionNote: 'Мониторить transaction abort rate; короткие txn.',
    },
    liveCheatsheet: ['idempotence = PID+seq', 'txn = atomic write', 'БД = outbox / unique key'],
  },
  'int-7-08': {
    simpleDefinition:
      'ISR (In-Sync Replicas) — реплики, которые не отстают от лидера больше чем на replica.lag.time.max.ms. Лидер выбирается из ISR. «Чистый» выбор лидера — только из ISR (unclean.leader.election.enable=false). Unclean — лидером может стать отставшая реплика → риск потери данных.',
    quickAnswer:
      'ISR = актуальные копии partition. acks=all + min.insync.replicas гарантируют, что commit виден минимум N репликам. Unclean election в проде обычно выключен — лучше недоступность, чем silent data loss.',
    explainBrief: [
      'Leader принимает write; followers реплицируют.',
      'Replica вне ISR не участвует в выборе лидера при clean election.',
      'under-replicated partitions — алерт: ISR меньше replication.factor.',
      'acks=1 может вернуть success до репликации на все ISR.',
      'min.insync.replicas=2 при replication.factor=3 — пережить падение одной реплики без потери commit.',
      'Unclean — аварийный компромисс при потере всех ISR (редко, осознанно).',
    ],
    questionPlan: [
      { question: 'Что такое ISR?', answerHint: 'Реплики в синхроне с лидером по lag.' },
      { question: 'Чем unclean отличается от clean leader election?', answerHint: 'Unclean допускает лидера вне ISR → возможна потеря.' },
      { question: 'Как настроить durability?', answerHint: 'acks=all, min.insync.replicas, replication.factor.' },
      { question: 'Что мониторить?', answerHint: 'Under-replicated partitions, offline replicas, ISR shrink.' },
    ],
    glossary: [
      { term: 'ISR (In-Sync Replicas)', meaning: 'Набор реплик partition, синхронных с лидером.' },
      { term: 'Unclean leader election', meaning: 'Выбор лидера из реплики вне ISR; риск потери данных.' },
      { term: 'min.insync.replicas', meaning: 'Минимум ISR для принятия записи при acks=all.' },
      { term: 'replication.factor', meaning: 'Число копий partition на кластере.' },
      { term: 'Under-replicated partition', meaning: 'Partition с меньшим числом ISR, чем replication factor.' },
      { term: 'Leader election', meaning: 'Выбор брокера-лидера для partition при падении.' },
    ],
    codeExample: {
      title: 'Durability настройки',
      language: 'text',
      snippet: `# topic
replication.factor=3
min.insync.replicas=2

# producer
acks=all
enable.idempotence=true

# broker (prod)
unclean.leader.election.enable=false`,
      walkthrough: ['Сценарий: один брокер упал — ISR и доступность.', 'Unclean только DR policy.'],
      commonPitfall: 'acks=1 и «у нас Kafka надёжная».',
      productionNote: 'Алерт на URP; runbook при потере лидера.',
    },
    liveCheatsheet: ['ISR = синхронные реплики', 'acks=all + min.insync.replicas', 'unclean=false в проде'],
  },
  'int-7-09': {
    simpleDefinition:
      'Лог partition в Kafka — цепочка сегментов на диске. Активный сегмент принимает записи; когда достигает log.segment.bytes или по времени — закрывается. К каждому сегменту — индекс offset и timeindex. Старые сегменты удаляются по retention или compacted для changelog.',
    quickAnswer:
      'Файлы .log + .index + .timeindex на брокере. Consumer seek по offset через индекс. retention.ms/bytes удаляет старые сегменты; compaction оставляет последнее значение по key.',
    explainBrief: [
      'Append-only log — быстрая запись, последовательное чтение.',
      'Sparse index: offset → позиция в файле .log.',
      'sendfile / zero-copy при отдаче данных consumer.',
      'Compaction topic (changelog) — хранит last value per key.',
      'Слишком малый retention — consumer не успеет replay после долгого downtime.',
      'Большой segment — дольше recovery при crash брокера.',
    ],
    questionPlan: [
      { question: 'Из чего состоит хранение partition на диске?', answerHint: 'Сегменты .log, индексы, активный/закрытые.' },
      { question: 'Чем retention отличается от compaction?', answerHint: 'Retention удаляет по времени/размеру; compaction — last key.' },
      { question: 'Как consumer быстро ищет offset?', answerHint: 'Index file в сегменте.' },
      { question: 'Операционные риски?', answerHint: 'Диск, retention vs replay SLA, segment size.' },
    ],
    glossary: [
      { term: 'Log segment', meaning: 'Файловый кусок partition log на диске брокера.' },
      { term: 'Активный сегмент', meaning: 'Текущий открытый сегмент, принимающий новые записи.' },
      { term: 'Log compaction', meaning: 'Политика хранения последнего значения для каждого key.' },
      { term: 'Retention', meaning: 'Удаление сегментов старше лимита времени или размера.' },
      { term: 'Sparse index', meaning: 'Индекс не на каждый offset, а с шагом — экономия места.' },
      { term: 'Zero-copy (sendfile)', meaning: 'Передача данных с диска в сеть без лишнего копирования в JVM.' },
    ],
    codeExample: {
      title: 'Сегменты и политики',
      language: 'text',
      snippet: `# server.properties / topic config
log.segment.bytes=1073741824
log.retention.hours=168
cleanup.policy=delete   # или compact для changelog

# путь на брокере (упрощённо)
/kafka-data/topic-0/partition-0/00000000000012345678.log
00000000000012345678.index
00000000000012345678.timeindex`,
      walkthrough: ['Changelog vs event stream retention.', 'Дисковое планирование.'],
      commonPitfall: 'delete retention на topic, где consumer offline неделю — потеря данных для replay.',
      productionNote: 'Мониторить disk usage per broker; отдельные диски для log.dirs.',
    },
    liveCheatsheet: ['.log + .index + .timeindex', 'delete vs compact', 'retention = SLA replay'],
  },
  'int-7-10': {
    simpleDefinition:
      'Модель памяти Java (JMM) задаёт правила видимости изменений между потоками. Отношение happens-before гарантирует: действие A видно потоку после B. Data race — доступ к общей переменной без happens-before, хотя бы одна запись. volatile даёт видимость, но не делает i++ атомарным.',
    quickAnswer:
      'happens-before: unlock→lock, volatile write→read, start/join потока. Пример гонки: два потока делают count++ без синхронизации. volatile подходит для флага остановки; для счётчика — AtomicInteger или synchronized.',
    explainBrief: [
      'Без happens-before поток может видеть устаревшее значение в CPU cache.',
      'volatile запрещает reordering write/read относительно volatile-операций.',
      'count++ — read-modify-write; нужен AtomicInteger или lock.',
      'final поля после безопасной публикации (constructor finish) видны всем потокам.',
      'synchronized устанавливает happens-before между unlock и последующим lock.',
      'java.util.concurrent построен на happens-before и CAS.',
    ],
    questionPlan: [
      { question: 'Что такое happens-before простыми словами?', answerHint: 'Если A happens-before B, то B видит все записи A.' },
      { question: 'Пример data race?', answerHint: 'Общий int count++, два потока без sync.' },
      { question: 'Что исправляет volatile, что нет?', answerHint: 'Видимость флага; не атомарность ++.' },
      { question: 'Когда synchronized вместо volatile?', answerHint: 'Составной инвариант на нескольких полях.' },
    ],
    glossary: [
      { term: 'JMM (модель памяти Java)', meaning: 'Спецификация видимости и упорядочивания операций между потоками.' },
      { term: 'happens-before', meaning: 'Гарантия: действия одного потока видны другому в определённом порядке.' },
      { term: 'Data race (гонка данных)', meaning: 'Параллельный доступ без happens-before, есть запись.' },
      { term: 'volatile', meaning: 'Ключевое слово: видимость и запрет части переупорядочиваний.' },
      { term: 'AtomicInteger', meaning: 'Атомарные операции над счётчиком без полной блокировки объекта.' },
      { term: 'Visibility', meaning: 'Видимость записи другим потокам (не путать с atomicity).' },
    ],
    codeExample: {
      title: 'Гонка и volatile',
      language: 'java',
      snippet: `// гонка
class BadCounter {
  int count;
  void inc() { count++; }
}

// флаг — volatile уместен
class Worker {
  volatile boolean stop;
  void run() { while (!stop) { work(); } }
}

// счётчик — AtomicInteger
AtomicInteger ok = new AtomicInteger();
ok.incrementAndGet();`,
      walkthrough: ['count++ разобрать на три шага.', 'Double-checked locking — volatile ref.'],
      commonPitfall: 'volatile на счётчике «для скорости» — гонка остаётся.',
      productionNote: 'При странных багах под нагрузкой — искать racy поля в metrics/cache.',
    },
    liveCheatsheet: ['happens-before = видимость', 'volatile ≠ атомарность ++', 'счётчик → Atomic*'],
  },
  'int-7-11': {
    simpleDefinition:
      'Collections.synchronizedList оборачивает список mutex’ом на каждую операцию. CopyOnWriteArrayList при изменении копирует весь массив — чтение и итерация без блокировки, запись дорогая. Vector — устаревший synchronized ArrayList, в новом коде не используют.',
    quickAnswer:
      'CopyOnWrite — много читателей, редкие записи (listeners, конфиг). synchronizedList — редкие короткие записи при умеренной конкуренции. Vector — не выбирать; лучше ArrayList + внешняя синхронизация или concurrent-коллекции.',
    explainBrief: [
      'Итерация synchronizedList требует внешней синхронизации на том же mutex.',
      'CopyOnWrite итератор — snapshot на момент создания, без ConcurrentModificationException.',
      'Частые add на CopyOnWrite — O(n) копирование на каждую запись.',
      'Vector синхронизирует каждый метод — как synchronizedList, но legacy API.',
      'Для высокой записи — ConcurrentLinkedQueue, блокирующие очереди, ConcurrentHashMap.',
      'Выбор по профилю read/write, не «на всякий случай thread-safe».',
    ],
    questionPlan: [
      { question: 'Когда CopyOnWriteArrayList?', answerHint: 'Read-heavy, редкие write, размер умеренный.' },
      { question: 'Подводный камень synchronizedList?', answerHint: 'Итерация без sync; составные операции не атомарны.' },
      { question: 'Почему Vector не рекомендуют?', answerHint: 'Legacy; те же минусы, лучше явные альтернативы.' },
      { question: 'Что если write 50% времени?', answerHint: 'Не CopyOnWrite; concurrent или отдельный lock сегментов.' },
    ],
    glossary: [
      { term: 'Collections.synchronizedList', meaning: 'Обёртка: каждый метод list синхронизирован на общем mutex.' },
      { term: 'CopyOnWriteArrayList', meaning: 'Список: копия массива при каждой мутации; быстрое чтение.' },
      { term: 'Vector', meaning: 'Устаревший потокобезопасный динамический массив из Java 1.0.' },
      { term: 'Snapshot iterator', meaning: 'Итератор по копии данных на момент обхода (COW).' },
      { term: 'ConcurrentModificationException', meaning: 'Изменение коллекции во время итерации (fail-fast).' },
      { term: 'Read-write профиль', meaning: 'Соотношение частоты чтения и записи для выбора структуры.' },
    ],
    codeExample: {
      title: 'Три списка — три сценария',
      language: 'java',
      snippet: `List<String> sync = Collections.synchronizedList(new ArrayList<>());
synchronized (sync) {
  for (String s : sync) { /* безопасно */ }
}

CopyOnWriteArrayList<String> listeners = new CopyOnWriteArrayList<>();
listeners.add(listener); // копия массива
for (String l : listeners) { /* без lock */ }`,
      walkthrough: ['Спросить размер списка и частоту add.', 'Vector — красный флаг в новом коде.'],
      commonPitfall: 'CopyOnWrite на списке из 100k элементов с частыми обновлениями.',
      productionNote: 'Для shared state чаще ConcurrentHashMap + immutable snapshots.',
    },
    liveCheatsheet: ['COW = много read', 'syncList = mutex на метод', 'Vector — не использовать'],
  },
  'int-7-12': {
    simpleDefinition:
      'HashMap в Java 21 — массив корзин (buckets). hashCode определяет индекс корзины, equals — совпадение ключа внутри цепочки. При длинной цепочке (порог 8) цепочка превращается в красно-чёрное дерево (TreeNode) — поиск O(log n) в корзине. При сокращении до 6 — обратно в список.',
    quickAnswer:
      'hashCode → bucket; equals → точный ключ. Порог treeify = 8, untreeify = 6, load factor 0.75 → resize. Ключи должны быть immutable или стабильны по hashCode/equals. «Всегда O(1)» — неверно при коллизиях.',
    explainBrief: [
      'Node: hash, key, value, next; TreeNode extends Node для дерева.',
      'resize при превышении capacity * loadFactor — rehash всех элементов.',
      'Плохой hashCode → много коллизий → деревья или длинные цепочки.',
      'Mutable key меняет hash после put — запись «теряется».',
      'equals/hashCode контракт обязателен для ключей.',
      'Согласовано с canonical int-6-16 / int-4-02: не ослаблять формулировки.',
    ],
    questionPlan: [
      { question: 'Шаги get(key) в HashMap?', answerHint: 'hash → index → chain/tree → equals.' },
      { question: 'Когда включается красно-чёрное дерево?', answerHint: 'Длина цепочки > 8 (и capacity >= 64).' },
      { question: 'Почему mutable key опасен?', answerHint: 'hash bucket изменился после put.' },
      { question: 'Worst-case сложность?', answerHint: 'O(n) цепочка или O(log n) дерево в bucket.' },
    ],
    glossary: [
      { term: 'Корзина (bucket)', meaning: 'Ячейка массива HashMap, хранящая цепочку или дерево узлов.' },
      { term: 'TreeNode', meaning: 'Узел красно-чёрного дерева в bucket при многих коллизиях.' },
      { term: 'Treeify / untreeify', meaning: 'Преобразование цепочки в дерево (порог 8) и обратно (6).' },
      { term: 'Load factor', meaning: 'Коэффициент 0.75 — когда массив расширяется (resize).' },
      { term: 'Resize (rehash)', meaning: 'Удвоение массива и перераспределение элементов по новым индексам.' },
      { term: 'Контракт equals/hashCode', meaning: 'Равные ключи → один hashCode; нужен для корректного Map.' },
      { term: 'Коллизия', meaning: 'Разные ключи попали в один bucket по hash.' },
    ],
    codeExample: {
      title: 'Потеря ключа при mutable key',
      language: 'java',
      snippet: `Map<UserKey, String> map = new HashMap<>();
UserKey key = new UserKey("dev", 1);
map.put(key, "ok");
key.setLogin("ops"); // изменили поле из equals/hashCode
map.get(key); // может вернуть null`,
      walkthrough: ['hashCode → bucket, equals → key match.', 'Treeify при длинной цепочке.'],
      commonPitfall: 'Ответ «HashMap всегда O(1)» без оговорок про коллизии и resize.',
      productionNote: 'На собесе связать с int-6-16; в проде — immutable keys.',
    },
    liveCheatsheet: ['hashCode → bucket, equals → ключ', '8 → дерево, 6 → список', 'immutable keys'],
  },
  'int-7-13': {
    simpleDefinition:
      'Виртуальные потоки (Java 21) — лёгкие потоки JVM, которые монтируются на небольшое число платформенных (carrier) потоков. Подходят для массового blocking I/O (HTTP, JDBC). Платформенные потоки — 1:1 с OS thread; пул фиксирует параллелизм для CPU-bound задач.',
    quickAnswer:
      'Executors.newVirtualThreadPerTaskExecutor() — тысячи запросов без тысячи OS threads. Не для CPU-bound. Опасность: pinning — synchronized/native блокирует carrier. Platform pool — ограниченное число ядер для вычислений.',
    explainBrief: [
      'Virtual thread дешёв в создании; блокировка на I/O освобождает carrier.',
      'Carrier pool ≈ число ядер; на них крутятся mount/unmount virtual threads.',
      'Pinning: долгий synchronized или JNI внутри VT держит carrier.',
      'Thread-per-request модель снова практична для I/O сервисов.',
      'ForkJoinPool.commonPool() — не путать с virtual thread executor.',
      'Мониторинг: JFR event VirtualThreadPinned, carrier utilization.',
    ],
    questionPlan: [
      { question: 'Чем virtual thread отличается от platform?', answerHint: 'Лёгкий, mount на carrier; не OS thread 1:1.' },
      { question: 'Когда НЕ использовать virtual threads?', answerHint: 'CPU-bound, долгий synchronized, native CPU work.' },
      { question: 'Что такое pinning?', answerHint: 'VT заблокировал carrier на monitor/native.' },
      { question: 'Сравнение с thread pool?', answerHint: 'Pool лимитирует OS threads; VT масштабирует I/O concurrency.' },
    ],
    glossary: [
      { term: 'Виртуальный поток', meaning: 'Лёгкий поток JVM, планируемый на carrier, не равный OS thread.' },
      { term: 'Платформенный поток', meaning: 'Классический Thread, привязанный к потоку ОС.' },
      { term: 'Carrier thread', meaning: 'OS-поток, на котором исполняются виртуальные потоки.' },
      { term: 'Pinning (закрепление)', meaning: 'Виртуальный поток удерживает carrier из-за monitor/native.' },
      { term: 'newVirtualThreadPerTaskExecutor', meaning: 'Фабрика executor: одна задача — один virtual thread.' },
      { term: 'Blocking I/O', meaning: 'Операции ожидания сети/диска — сценарий для virtual threads.' },
    ],
    codeExample: {
      title: 'Virtual thread executor',
      language: 'java',
      snippet: `try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
  for (int i = 0; i < 10_000; i++) {
    executor.submit(() -> httpClient.send(request)); // blocking I/O
  }
}
// CPU-bound — по-прежнему фиксированный pool размером ~ cores`,
      walkthrough: ['Модель «thread per request» для REST.', 'Избегать synchronized в hot path.'],
      commonPitfall: '10k platform threads вместо VT на I/O — OOM и context switch.',
      productionNote: 'Смотреть pinned threads в JFR после миграции.',
    },
    liveCheatsheet: ['VT = много I/O', 'Carrier ≈ cores', 'Pinning = synchronized/native'],
  },
  'int-7-14': {
    simpleDefinition:
      'Strong reference — обычная ссылка, объект живёт пока достижим. Soft — GC может очистить при нехватке памяти (чувствительный кэш). Weak — при следующем GC ключ может исчезнуть (WeakHashMap). Phantom — уведомление после финализации для очистки нативных ресурсов через ReferenceQueue.',
    quickAnswer:
      'Кэши в проде чаще Caffeine с size/TTL, не SoftReference. WeakHashMap — listeners без утечки. Phantom + ReferenceQueue — освобождение off-heap/native после удаления объекта.',
    explainBrief: [
      'SoftReference очищается перед OOM — непредсказуемый размер кэша.',
      'WeakHashMap: ключи собираются GC — map сама чистится.',
      'PhantomReference.get() всегда null — только queue callback.',
      'ReferenceQueue обрабатывает в отдельном потоке очистки.',
      'Утечка памяти — часто strong refs на listeners/cache без weak.',
      'Strong reachability — цепочка strong ссылок от GC root.',
    ],
    questionPlan: [
      { question: 'Разница Strong, Soft, Weak, Phantom?', answerHint: 'Когда GC может собрать; для чего применяют.' },
      { question: 'Зачем WeakHashMap?', answerHint: 'Кэш по объектам без удержания ключей навсегда.' },
      { question: 'Почему SoftReference плох как основной кэш?', answerHint: 'Непредсказуемость, нет лимита size.' },
      { question: 'Сценарий PhantomReference?', answerHint: 'Cleanup native/direct buffer после смерти объекта.' },
    ],
    glossary: [
      { term: 'Strong reference', meaning: 'Обычная ссылка; объект не собирается, пока достижим.' },
      { term: 'SoftReference', meaning: 'GC очищает при давлении на память; «мягкий» кэш.' },
      { term: 'WeakReference', meaning: 'Собирается при следующем GC; не удерживает объект.' },
      { term: 'PhantomReference', meaning: 'Уведомление после финализации; не для доступа к объекту.' },
      { term: 'ReferenceQueue', meaning: 'Очередь, куда GC помещает reference после очистки referent.' },
      { term: 'WeakHashMap', meaning: 'Map с weak-ключами; записи исчезают с ключом.' },
      { term: 'Reachability', meaning: 'Цепочка ссылок от GC root определяет, жив ли объект.' },
    ],
    codeExample: {
      title: 'WeakHashMap vs SoftReference',
      language: 'java',
      snippet: `Map<Listener, Void> reg = new WeakHashMap<>();
reg.put(listener, null); // listener может быть собран → запись пропадёт

// Phantom — cleanup native
ReferenceQueue<Cleanable> q = new ReferenceQueue<>();
PhantomReference<Cleanable> ref = new PhantomReference<>(resource, q);`,
      walkthrough: ['В проде: Caffeine с maximumSize.', 'Phantom — не кэш.'],
      commonPitfall: 'SoftReference «кэш без лимита» — нестабильная latency под GC.',
      productionNote: 'Heap dump: искать strong chains к утечкам.',
    },
    liveCheatsheet: ['Strong = обычная', 'Weak = WeakHashMap', 'Phantom = cleanup native'],
  },
  'int-7-15': {
    simpleDefinition:
      'G1GC делит heap на регионы. Young GC (Stop-The-World) эвакуирует Eden/Survivor. Concurrent marking помечает старые регионы с мусором. Mixed GC собирает часть old regions вместе с young. В логах: Pause Young, Concurrent Mark, Pause Mixed; проблемы — длинные паузы, Full GC, to-space exhausted.',
    quickAnswer:
      'Цикл: young GC → concurrent mark → remark (короткая пауза) → mixed GC. Логи: -Xlog:gc*. Симптомы: частые Mixed, Humongous objects, Allocation Failure → Full GC — сначала leak/heap, потом tuning.',
    explainBrief: [
      'G1 цель — контролировать MaxGCPauseMillis (эвристика).',
      'Humongous object > 50% region — отдельная обработка, фрагментация.',
      'Concurrent marking работает параллельно с приложением.',
      'Mixed GC выбирает «мусорные» old regions по predicted reclaim.',
      'Full GC в G1 — признак серьёзной проблемы или heap слишком мал.',
      'GC logs + heap dump + metaspace — базовая диагностика.',
    ],
    questionPlan: [
      { question: 'Фазы G1 от young до mixed?', answerHint: 'Young STW → concurrent mark → remark → mixed.' },
      { question: 'Что такое Humongous в G1?', answerHint: 'Объект больше половины region; влияет на фрагментацию.' },
      { question: 'Какие строки в GC log тревожат?', answerHint: 'Full GC, to-space exhausted, паузы >> SLA.' },
      { question: 'Порядок диагностики?', answerHint: 'Leak? heap size? потом tuning G1.' },
    ],
    glossary: [
      { term: 'G1GC', meaning: 'Garbage-First: сборщик с регионами heap и целевой паузой.' },
      { term: 'Young GC', meaning: 'Пауза эвакуации молодого поколения (Eden/Survivor).' },
      { term: 'Mixed GC', meaning: 'Сборка части старых регионов вместе с young.' },
      { term: 'Concurrent marking', meaning: 'Фоновая разметка живых объектов в old generation.' },
      { term: 'Humongous object', meaning: 'Объект, занимающий более половины G1 region.' },
      { term: 'Full GC', meaning: 'Полная сборка всего heap — часто симптом проблемы в G1.' },
      { term: 'MaxGCPauseMillis', meaning: 'Целевое время паузы для эвристик G1.' },
    ],
    codeExample: {
      title: 'Включение GC логов (Java 21)',
      language: 'text',
      snippet: `-Xlog:gc*,gc+heap=info:file=gc.log:time,uptime,level,tags
# смотреть: Pause Young, Concurrent Cycle, Pause Mixed, Full GC`,
      walkthrough: ['Связать паузу с SLA API.', 'Full GC → heap dump.'],
      commonPitfall: 'Тюнить G1 без проверки утечки и humongous allocations.',
      productionNote: 'Алерт на pause > p99 SLA; correlate с deployment.',
    },
    liveCheatsheet: ['Young → mark → Mixed', 'Full GC = красный флаг', '-Xlog:gc*'],
  },
  'int-7-16': {
    simpleDefinition:
      'JPMS (Java Platform Module System) описывает модули в module-info.java: exports, requires, opens. requires — модуль нужен для компиляции и runtime. requires transitive — ещё и «пробрасывает» читаемость зависимости потребителям вашего модуля (как public API dependency).',
    quickAnswer:
      'requires com.foo — только ваш модуль видит foo. requires transitive com.foo — любой, кто зависит от вас, тоже читает foo без своего requires. Automatic module — jar без module-info на module-path. IllegalAccessError — reflective access без opens.',
    explainBrief: [
      'module-path vs classpath — разные правила видимости пакетов.',
      'exports — какие пакеты видны снаружи.',
      'opens — reflection для Hibernate/Spring в named modules.',
      'transitive удобен для API-модулей библиотек (модель в public API).',
      'split packages запрещены между модулями.',
      'jlink — custom runtime из набора модулей.',
    ],
    questionPlan: [
      { question: 'Зачем module-info.java?', answerHint: 'Явные границы, encapsulation, jlink.' },
      { question: 'requires vs requires transitive?', answerHint: 'Transitive re-export readability downstream.' },
      { question: 'Что такое automatic module?', answerHint: 'Jar без module-info на module-path.' },
      { question: 'Типичная ошибка при миграции?', answerHint: 'IllegalAccessError, split package, missing opens.' },
    ],
    glossary: [
      { term: 'JPMS', meaning: 'Система модулей Java 9+: module-info.java.' },
      { term: 'requires', meaning: 'Зависимость модуля; делает модуль readable.' },
      { term: 'requires transitive', meaning: 'Зависимость, читаемая и для модулей-потребителей вашего модуля.' },
      { term: 'exports', meaning: 'Пакеты, доступные другим модулям.' },
      { term: 'opens', meaning: 'Разрешение deep reflection в пакет для фреймворков.' },
      { term: 'Automatic module', meaning: 'Не-модульный jar на module-path; имя из MANIFEST или jar.' },
      { term: 'module-path', meaning: 'Путь модулей вместо плоского classpath.' },
    ],
    codeExample: {
      title: 'module-info.java',
      language: 'java',
      snippet: `module com.acme.api {
  requires transitive com.acme.model; // потребители api видят model
  requires spring.boot;
  exports com.acme.api.dto;
  opens com.acme.api.internal to spring.core;
}`,
      walkthrough: ['Библиотека: transitive для типов в public API.', 'Spring: opens для beans.'],
      commonPitfall: 'Всё на classpath в «модульном» проекте — нет пользы JPMS.',
      productionNote: 'Документировать opens для Hibernate entities.',
    },
    liveCheatsheet: ['requires transitive = re-export', 'exports / opens', 'automatic module = jar без module-info'],
  },
  'int-7-17': {
    simpleDefinition:
      'LMAX Disruptor — высокопроизводительная очередь событий на кольцевом буфере (Ring Buffer) без блокировок в hot path. Sequences координируют producers/consumers. Используется там, где latency важнее простоты BlockingQueue (биржевые, финтех pipelines).',
    quickAnswer:
      'Ring Buffer — заранее выделенные слоты событий. Producers claim sequence, consumers ждут доступный sequence (WaitStrategy). Плюс — микросекунды latency; минус — сложность и жёсткая модель (часто single producer).',
    explainBrief: [
      'Preallocate events — нет alloc в hot loop.',
      'Cache line padding против false sharing.',
      'WaitStrategy: BusySpin, Yielding, Blocking — trade-off CPU/latency.',
      'Batch processing: флаг endOfBatch в handler.',
      'Не замена Kafka — in-process messaging.',
      'Benchmark перед внедрением vs ArrayBlockingQueue.',
    ],
    questionPlan: [
      { question: 'Что такое Ring Buffer в Disruptor?', answerHint: 'Кольцо слотов фиксированного размера, power of 2.' },
      { question: 'Почему быстрее BlockingQueue?', answerHint: 'Lock-free sequences, cache-friendly, no alloc.' },
      { question: 'Когда НЕ использовать?', answerHint: 'Обычный CRUD, команда не готова поддерживать.' },
      { question: 'Роль WaitStrategy?', answerHint: 'Как consumer ждёт новые события.' },
    ],
    glossary: [
      { term: 'LMAX Disruptor', meaning: 'Библиотека low-latency обмена событиями между потоками.' },
      { term: 'Ring Buffer', meaning: 'Кольцевой буфер фиксированного размера для событий.' },
      { term: 'Sequence', meaning: 'Счётчик позиции producer/consumer в кольце.' },
      { term: 'WaitStrategy', meaning: 'Политика ожидания consumer: spin, yield, block.' },
      { term: 'False sharing', meaning: 'Конкуренция за cache line между ядрами CPU.' },
      { term: 'endOfBatch', meaning: 'Флаг handler: конец пакета событий для batch flush.' },
    ],
    codeExample: {
      title: 'Disruptor sketch',
      language: 'text',
      snippet: `Disruptor<Event> disruptor = new Disruptor<>(
  Event::new, bufferSize, DaemonThreadFactory.INSTANCE);
disruptor.handleEventsWith((event, seq, endOfBatch) -> process(event));
RingBuffer<Event> ring = disruptor.start();`,
      walkthrough: ['Сравнить p99 latency с ArrayBlockingQueue.', 'Single vs multi producer.'],
      commonPitfall: 'Disruptor везде «потому что fast» без профиля и команды.',
      productionNote: 'Только после доказанного bottleneck в профиле.',
    },
    liveCheatsheet: ['Ring Buffer = фикс. слоты', 'Sequence = курсор', 'WaitStrategy = spin/block'],
  },
  'int-7-18': {
    simpleDefinition:
      'HikariCP — пул JDBC-соединений: ограниченный набор физических connections к PostgreSQL, быстрая выдача приложению. Connection — дорогой ресурс; незакрытый ResultSet/Statement удерживает connection → пул исчерпывается, потоки висят на getConnection().',
    quickAnswer:
      'try-with-resources на Connection/Statement/ResultSet. leakDetectionThreshold — лог stack, если connection держали дольше N ms. maxLifetime чуть меньше idle timeout PostgreSQL. Размер пула — не «чем больше, тем лучше».',
    explainBrief: [
      'minimumIdle / maximumPoolSize — границы пула.',
      'connectionTimeout — сколько ждать свободный connection.',
      'maxLifetime — ротация connections против stale/firewall drop.',
      'ORM Session может держать connection до конца @Transactional.',
      'Метрика pending threads на pool — сигнал исчерпания.',
      'Формула старта: connections ≈ ((core_count * 2) + effective_spindle_count).',
    ],
    questionPlan: [
      { question: 'Что происходит, если не закрыть ResultSet?', answerHint: 'Connection не возвращается в пул → exhaustion.' },
      { question: 'Как найти утечку connection?', answerHint: 'leakDetectionThreshold, thread dump, metrics.' },
      { question: 'Как связать с @Transactional?', answerHint: 'Connection на время транзакции; короткие tx.' },
      { question: 'Как выбрать pool size?', answerHint: 'Не больше чем PG max_connections / instances; формула + метрики.' },
    ],
    glossary: [
      { term: 'HikariCP', meaning: 'Быстрый пул JDBC-соединений, default в Spring Boot 2+.' },
      { term: 'maximumPoolSize', meaning: 'Максимум одновременных connections в пуле.' },
      { term: 'leakDetectionThreshold', meaning: 'Порог ms: если connection не вернули — warn в лог со stack.' },
      { term: 'maxLifetime', meaning: 'Максимальное время жизни connection в пуле до замены.' },
      { term: 'connectionTimeout', meaning: 'Сколько ждать свободный connection из пула.' },
      { term: 'Connection leak', meaning: 'Connection не возвращён в пул из-за незакрытого ресурса.' },
    ],
    codeExample: {
      title: 'try-with-resources',
      language: 'java',
      snippet: `try (Connection c = dataSource.getConnection();
     PreparedStatement ps = c.prepareStatement("SELECT ...");
     ResultSet rs = ps.executeQuery()) {
  while (rs.next()) { map(rs); }
} // всё закрыто → connection в пул`,
      walkthrough: ['Показать pool exhausted thread dump.', 'Короткая @Transactional.'],
      commonPitfall: 'Открыть connection вручную и забыть close при exception.',
      productionNote: 'Hikari metrics + PG max_connections budget per service.',
    },
    liveCheatsheet: ['try-with-resources всегда', 'leakDetectionThreshold', 'maxLifetime < PG idle'],
  },
  'int-7-19': {
    simpleDefinition:
      'Идемпотентность REST — повторный запрос с тем же ключом не меняет результат повторно (повторная оплата не списывает дважды). На уровне PostgreSQL — уникальный индекс (client_id, idempotency_key) и сохранение ответа. В Kafka — dedup по message id / inbox и бизнес-ключ партиционирования.',
    quickAnswer:
      'Header Idempotency-Key + UNIQUE в БД + возврат сохранённого ответа при повторе. Kafka: consumer проверяет processed_message_id ON CONFLICT DO NOTHING. TTL очистки старых ключей. Retry-safe только с идемпотентностью.',
    explainBrief: [
      'POST без идемпотентности опасен при network retry.',
      'Схема: idempotency_key, response_body, status, created_at.',
      'ON CONFLICT DO NOTHING / RETURNING — атомарная dedup.',
      'Kafka ordering по key не заменяет dedup на consumer.',
      'Inbox table: message_id PRIMARY KEY, processed_at.',
      'Метрики: duplicate rejected, conflict rate.',
    ],
    questionPlan: [
      { question: 'Как реализовать в REST + PostgreSQL?', answerHint: 'Idempotency-Key, unique, cache response.' },
      { question: 'Как в Kafka consumer?', answerHint: 'Inbox, unique message_id, idempotent handler.' },
      { question: 'Зачем TTL на ключи?', answerHint: 'Рост таблицы; политика хранения.' },
      { question: 'Отличие от дедупа брокера?', answerHint: 'Broker dedup produce; business dedup side effect.' },
    ],
    glossary: [
      { term: 'Идемпотентность', meaning: 'Повтор операции не меняет итог сверх первого успешного раза.' },
      { term: 'Idempotency-Key', meaning: 'HTTP-заголовок клиента для безопасного retry.' },
      { term: 'ON CONFLICT', meaning: 'PostgreSQL: ветвление при нарушении unique constraint.' },
      { term: 'Inbox pattern', meaning: 'Таблица обработанных message_id перед бизнес-логикой.' },
      { term: 'Outbox pattern', meaning: 'Событие в БД в той же tx, что и данные — потом в Kafka.' },
      { term: 'Бизнес-ключ Kafka', meaning: 'Key сообщения для порядка в partition, не для dedup сам по себе.' },
    ],
    codeExample: {
      title: 'Unique idempotency key',
      language: 'text',
      snippet: `CREATE UNIQUE INDEX ux_payment_idem
  ON payments (client_id, idempotency_key);

INSERT INTO payments (..., idempotency_key, ...)
VALUES (...)
ON CONFLICT (client_id, idempotency_key) DO NOTHING
RETURNING id;`,
      walkthrough: ['Первый запрос — insert; второй — conflict → старый response.', 'Kafka inbox аналогично.'],
      commonPitfall: 'Dedup только в Redis без персистентности — потеря при restart.',
      productionNote: 'Документировать срок хранения ключей; GDPR на payload.',
    },
    liveCheatsheet: ['Idempotency-Key + UNIQUE', 'Inbox для Kafka', 'TTL cleanup'],
  },
  'int-7-20': {
    simpleDefinition:
      'REQUIRES_NEW приостанавливает внешнюю транзакцию и открывает новую физическую — её COMMIT не откатывается при rollback внешней (audit log). NESTED создаёт savepoint во внешней транзакции — откат вложенной только до savepoint, если БД поддерживает savepoints.',
    quickAnswer:
      'REQUIRES_NEW — отдельная tx (отдельный connection из пула). NESTED — та же tx, вложенный savepoint. Kafka consumer: commit offset и DB tx — разный ресурс; outbox или идемпотентность. Self-invocation и proxy — как в int-6-27.',
    explainBrief: [
      'REQUIRES_NEW: AuditService в отдельном @Service bean, не this.audit().',
      'NESTED rollback — только вложенная часть; внешняя может продолжиться.',
      'NESTED не работает на всех ресурсах одинаково — нужен JDBC savepoint.',
      'Kafka: process в tx → outbox row → отдельный publisher; или process → commit offset после commit.',
      'REQUIRES_NEW + Kafka — audit сохранится даже если основная tx откатилась.',
      'Тесты: rollback сценарии с assert counts в обеих tx.',
    ],
    questionPlan: [
      { question: 'REQUIRES_NEW vs NESTED одной фразой?', answerHint: 'Новая физическая tx vs savepoint в текущей.' },
      { question: 'Пример REQUIRES_NEW на проде?', answerHint: 'Audit, security log, нотификация при rollback основной.' },
      { question: 'Как связать с Kafka consumer?', answerHint: 'Outbox; не commit offset до DB; idempotent retry.' },
      { question: 'Почему не работает @Transactional на this?', answerHint: 'Self-invocation минует proxy.' },
    ],
    glossary: [
      { term: 'REQUIRES_NEW', meaning: 'Propagation: всегда новая транзакция, внешняя приостановлена.' },
      { term: 'NESTED', meaning: 'Propagation: вложенная tx как savepoint во внешней.' },
      { term: 'Savepoint', meaning: 'Точка отката внутри одной JDBC-транзакции.' },
      { term: 'Propagation', meaning: 'Правило Spring: как метод входит в существующую tx.' },
      { term: 'Transactional outbox', meaning: 'Событие в той же БД-tx, публикация асинхронно.' },
      { term: 'Self-invocation', meaning: 'Вызов this.method() — AOP proxy не применяется.' },
    ],
    codeExample: {
      title: 'REQUIRES_NEW vs NESTED',
      language: 'java',
      snippet: `@Transactional
public void order() {
  repo.save(order);
  auditService.log(); // @Transactional(REQUIRES_NEW) — другой bean
}

@Transactional(propagation = REQUIRES_NEW)
public void log() { auditRepo.save(...); }

@Transactional(propagation = NESTED)
public void partial() { /* rollback только savepoint */ }`,
      walkthrough: ['Отдельный bean для REQUIRES_NEW.', 'Kafka — outbox diagram.'],
      commonPitfall: 'commit offset Kafka до commit DB.',
      productionNote: 'Интеграционные тесты rollback + audit row exists.',
    },
    liveCheatsheet: ['REQUIRES_NEW = новая tx', 'NESTED = savepoint', 'Kafka+DB = outbox'],
  },
  'int-7-21': {
    simpleDefinition:
      'Двухфазный коммит (2PC): координатор спрашивает участников prepare → если все OK, commit, иначе abort. Блокирует ресурсы, чувствителен к падению координатора. В микросервисах чаще Saga (цепочка локальных tx + compensating actions) или outbox.',
    quickAnswer:
      '2PC: XA/JTA между DB и MQ в монолите — редко в K8s mesh. Saga: OrderCreated → PaymentCaptured → при ошибке CompensatePayment. Outbox надёжнее «распределённой магии» на каждый запрос.',
    explainBrief: [
      'Фаза prepare — участники резервируют, фаза commit — фиксируют.',
      'In-doubt transaction при падении координатора — ручное решение.',
      'Saga choreography — события между сервисами; orchestration — центральный координатор.',
      'Compensating transaction должна быть идемпотентной.',
      'TCC (Try-Confirm-Cancel) — вариант резервирования ресурсов.',
      'Eventual consistency — осознанный trade-off микросервисов.',
    ],
    questionPlan: [
      { question: 'Опишите фазы 2PC.', answerHint: 'Prepare vote → commit/abort all.' },
      { question: 'Минусы 2PC в микросервисах?', answerHint: 'Latency, locks, coordinator SPOF, coupling.' },
      { question: 'Как работает Saga?', answerHint: 'Локальные tx + compensate при сбое.' },
      { question: 'Outbox vs 2PC?', answerHint: 'Outbox — проще, eventual delivery в Kafka.' },
    ],
    glossary: [
      { term: '2PC (двухфазный коммит)', meaning: 'Протокол: prepare всех участников, затем commit или abort.' },
      { term: 'Saga', meaning: 'Цепочка локальных транзакций с компенсирующими шагами.' },
      { term: 'Compensating transaction', meaning: 'Отменяющее действие, обратное успешному шагу Saga.' },
      { term: 'Координатор 2PC', meaning: 'Узел, управляющий prepare/commit; точка отказа.' },
      { term: 'TCC', meaning: 'Try-Confirm-Cancel — резервирование перед подтверждением.' },
      { term: 'Eventual consistency', meaning: 'Согласованность наступает со временем, не мгновенно.' },
    ],
    codeExample: {
      title: 'Saga vs 2PC (схема)',
      language: 'text',
      snippet: `2PC: Coordinator → DB.prepare, MQ.prepare → commit/abort

Saga:
  T1: Order CREATED (local commit)
  T2: Payment CAPTURED
  on fail T2: Compensate Order (CANCEL)

Outbox: same DB tx inserts order + outbox_event`,
      walkthrough: ['Микросервисы — Saga/outbox.', 'Монолит+XA — редкий 2PC.'],
      commonPitfall: '2PC между 5 HTTP-сервисами «для надёжности».',
      productionNote: 'Compensation playbook в runbook; idempotent compensate.',
    },
    liveCheatsheet: ['2PC = prepare→commit', 'Saga = локальные tx + compensate', 'Outbox для Kafka'],
  },
  'int-7-22': {
    simpleDefinition:
      'Circuit Breaker защищает систему от каскадных вызовов упавшего downstream: при росте ошибок переходит в OPEN (fail-fast), после паузы HALF_OPEN пробует несколько вызовов, при успехе CLOSED. Resilience4j и Spring Cloud CircuitBreaker — стандарт в JVM.',
    quickAnswer:
      'CLOSED → (failure rate) → OPEN → (wait) → HALF_OPEN → CLOSED. Настройки: failureRateThreshold, waitDurationInOpenState, slidingWindowSize. Fallback — кэш, degraded response, не retry storm на неидемпотентных операциях.',
    explainBrief: [
      'Цель — дать downstream восстановиться, не забивать потоки ожиданием.',
      'Slow call rate тоже может открыть breaker.',
      'Bulkhead — ограничение параллельных вызовов отдельно от CB.',
      'Retry только на идемпотентных операциях и после CB логики.',
      'Метрики в Prometheus: state, calls, failure rate.',
      'Chaos test: inject 503, проверить open и fallback.',
    ],
    questionPlan: [
      { question: 'Состояния Circuit Breaker?', answerHint: 'CLOSED, OPEN, HALF_OPEN.' },
      { question: 'Пример Resilience4j / Spring?', answerHint: '@CircuitBreaker, CircuitBreakerRegistry.' },
      { question: 'Зачем fallback?', answerHint: 'Degraded UX, не каскад timeout.' },
      { question: 'Как не «флапать»?', answerHint: 'Window size, minimum calls, wait duration.' },
    ],
    glossary: [
      { term: 'Circuit Breaker', meaning: 'Паттерн: при сбоях downstream прекратить вызовы (fail-fast).' },
      { term: 'CLOSED / OPEN / HALF_OPEN', meaning: 'Состояния breaker: норма / блок / пробные вызовы.' },
      { term: 'Resilience4j', meaning: 'Библиотека fault tolerance для Java (CB, retry, bulkhead).' },
      { term: 'Fallback', meaning: 'Запасной ответ при открытом breaker или ошибке.' },
      { term: 'Sliding window', meaning: 'Окно последних N вызовов для расчёта failure rate.' },
      { term: 'Bulkhead', meaning: 'Изоляция пулов потоков/connections per dependency.' },
    ],
    codeExample: {
      title: 'Resilience4j CircuitBreaker',
      language: 'java',
      snippet: `@CircuitBreaker(name = "payments", fallbackMethod = "payFallback")
public PaymentResult pay(Order o) {
  return paymentClient.charge(o);
}

public PaymentResult payFallback(Order o, Throwable t) {
  return PaymentResult.degraded("try later");
}`,
      walkthrough: ['Связать с timeout.', 'Half-open probes в конфиге.'],
      commonPitfall: 'Breaker без timeout — потоки всё равно висят.',
      productionNote: 'Dashboard: breaker state per dependency.',
    },
    liveCheatsheet: ['CLOSED→OPEN→HALF_OPEN', 'failureRateThreshold', 'fallback обязателен'],
  },
  'int-7-23': {
    simpleDefinition:
      'SCA (Software Composition Analysis) сканирует зависимости (Maven/Gradle) на известные CVE. SAST анализирует исходный код на уязвимые паттерны. Критичная уязвимость в transitive dependency (как log4j) требует dependency:tree, принудительной версии в BOM и проверки classpath после сборки.',
    quickAnswer:
      'SCA — OWASP Dependency-Check, Snyk, GitHub Dependabot. SAST — SonarQube, Semgrep. log4j: mvn dependency:tree, dependencyManagement с log4j2.version ≥ 2.17, exclude старого transitive, CI gate по CVSS.',
    explainBrief: [
      'Transitive — зависимость вашей зависимости; не видна в pom напрямую.',
      'BOM (Spring Boot parent) фиксирует версии согласованно.',
      'maven-enforcer-plugin — запрет диапазонов и banned dependencies.',
      'SBOM (CycloneDX) — артефакт релиза для аудита.',
      'SAST ловит SQL injection в коде; SCA — уязвимую библиотеку.',
      'Shaded jar может прятать дубликат уязвимой версии.',
    ],
    questionPlan: [
      { question: 'SCA vs SAST?', answerHint: 'SCA — библиотеки/CVE; SAST — исходники.' },
      { question: 'Как чинить transitive log4j?', answerHint: 'tree, BOM override, exclude, verify.' },
      { question: 'Что в CI pipeline?', answerHint: 'Fail build CVSS≥7, Dependabot PRs.' },
      { question: 'Почему direct bump недостаточен?', answerHint: 'Transitive тянет старую версию.' },
    ],
    glossary: [
      { term: 'SCA', meaning: 'Анализ состава ПО: CVE в зависимостях.' },
      { term: 'SAST', meaning: 'Статический анализ исходного кода на уязвимости.' },
      { term: 'Transitive dependency', meaning: 'Зависимость, подтянутая другой библиотекой.' },
      { term: 'BOM (Bill of Materials)', meaning: 'POM с согласованными версиями артефактов.' },
      { term: 'SBOM', meaning: 'Software Bill of Materials — список компонентов сборки.' },
      { term: 'CVSS', meaning: 'Шкала серьёзности уязвимости (score).' },
      { term: 'dependency:tree', meaning: 'Maven-команда: полный граф зависимостей.' },
    ],
    codeExample: {
      title: 'Исправление log4j в Maven',
      language: 'text',
      snippet: `mvn dependency:tree -Dincludes=org.apache.logging.log4j

<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.apache.logging.log4j</groupId>
      <artifactId>log4j-bom</artifactId>
      <version>2.24.3</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>`,
      walkthrough: ['Log4Shell — JNDI lookup в старых версиях.', 'Проверить runtime classpath staging.'],
      commonPitfall: 'Обновили direct log4j, transitive log4j-core 2.14 остался.',
      productionNote: 'CI OWASP + policy exception process с expiry date.',
    },
    liveCheatsheet: ['SCA = CVE в deps', 'SAST = код', 'tree + BOM + enforcer'],
  },
};
