# Content Canonical Map

Правило проекта для повторяющихся тем в `src/content/`:

- **Учебные модули** (`module-1.ts` … `module-5.ts`) хранят самый полный canonical-разбор: `simpleDefinitionOverride`, развёрнутый `explainBrief`, код, `productionNote`, glossary.
- **Interview-модули** (`module-interview-*.ts`) по умолчанию — **compact live** (`QuestionDef` + `buildTopic`).
- Если тема уже есть в учебном модуле и нужен **тот же разбор**, что в лекции — **не переписывать**: использовать **`CANONICAL_TOPIC_REUSE`** (см. `module-interview-6.ts`): `...source` из `module3.topics`, только другой `id` для маршрута.
- Остальные interview-темы **не должны противоречить** canonical и **не должны быть слабее** по ключевым идеям.
- **Нельзя** заменять сильную учебную тему короткой interview-версией.
- Если тема встречается в нескольких файлах, новые правки берут **лучшее из canonical source** (см. таблицу ниже).
- При добавлении нового interview-модуля **сначала** открыть этот файл.

Сборка тем: `topic()` из `module-1.ts`, регистрация в `src/content/index.ts`. Контракт полей — `src/content/schema.ts` (не менять без необходимости).

---

## Canonical topics

| Topic | Canonical source | Compact / interview duplicates | Must keep everywhere | Do not regress |
| --- | --- | --- | --- | --- |
| **SOLID** | `src/content/module-3.ts` → `solid-principles` | `module-interview-6.ts` → **`int-6-12` = reuse `solid-principles` (полная копия полей)**; отдельные live-вопросы: `int-6-09`, `int-6-11`, `int-6-13`; кратко `module-5.ts` → `final-patterns-solid` | Как в `solid-principles`: OrderService/Repository/Notifier, PaymentStrategy, Bird/**Flyable**/Penguin, ReportActions, DIP/Notifier, «не ради букв», перегиб интерфейсов | Новая страница SOLID в interview-7+. `QUESTION_CANONICAL_SYNC` вместо reuse для SOLID |
| **Design Patterns** | `src/content/module-3.ts` → `design-patterns-basics` | `module-5.ts` → `final-patterns-solid` (Builder, Decorator, DIP); упоминания в interview-модулях | Strategy, Factory Method, Builder, Adapter, Observer, Singleton; паттерн решает **реальную боль**, не «для красоты» | Перечисление без боли. Путать Spring singleton bean и GoF Singleton без пояснения |
| **OOP / inheritance / composition** | `module-1.ts` → `oop-principles`, `inheritance-association`; LSP-разбор в `module-3.ts` → `solid-principles` | `module-interview-6.ts` → `int-6-09`, `int-6-10`, `int-6-11`, `int-6-13` | Инкапсуляция, абстракция, наследование, полиморфизм. Наследование только для устойчивого **is-a**. Композиция для **has-a**. Bird/**Flyable** как антипример иерархии | Обязательный `Bird.fly()` для всех птиц. Наследование ради reuse полей |
| **Collections / HashMap / Stack** | `module-interview-6.ts` → `int-6-14`–`int-6-17`; Core: `module-1.ts` → `equals-hashcode`, коллекции в учебных темах; углубление HashMap: `module-interview-4.ts` → `int-4-02` | `module-interview-5.ts` → `int-5-14` (HashMap collision); `module-interview-3.ts` → ConcurrentHashMap | `Collection` — root для List/Set/Queue; **Map отдельно**. Поиск по значению в ArrayList/LinkedList — **O(n)**; LinkedList часто хуже (cache locality). HashMap: **hashCode → bucket**, **equals → key**; collisions; resize/**load factor**; **treeification** Java 8+; **mutable key** риск. `Stack` legacy → **Deque** / `ArrayDeque` | «HashMap O(1)» без worst-case. `Stack` как modern default |
| **String / String Pool / boxed caches** | `module-1.ts` → `string-class`, `string-pool`; `module-interview-6.ts` → `int-6-19`, `int-6-20` | Interview-вопросы по строкам в `module-1` / `module-interview-4` | String **immutable**. Literal → String Pool. `new String("abc")` — **новый объект**. `intern()` → canonical instance в pool. **Modern Java: String Pool в heap**. **Metaspace** — metadata классов, не pool. `IntegerCache` / boxed — похожий reuse, **другой механизм** | String Pool в Metaspace (modern Java). Смешивать pool, boxed cache и enum constants |
| **Spring / DI / ApplicationContext / Boot** | `module-interview-6.ts` → `int-6-21`, `int-6-22`, `int-6-23`; также `module-interview-stack.ts` → `int-stack-sc-01`, `int-stack-sc-02`; `module-interview-ms.ts` → IoC/ApplicationContext | `module-interview-5.ts` Spring block; `module-interview-4.ts` proxy topics | Spring **Framework**: IoC/DI/AOP/core container. **Spring Boot**: auto-configuration, starters, actuator, embedded server. ApplicationContext/BeanFactory; **BeanDefinition**; **singleton registry**; scopes; **BeanPostProcessor**. **Constructor injection** — default. Map — только упрощение | «Spring = REST». «Контекст = просто HashMap» без lifecycle. Auto-config как часть чистого Framework |
| **`@Transactional` / proxy / final** | `module-interview-6.ts` → `int-6-27`; `module-interview-4.ts` → `int-4-13`; `module-interview-ms.ts` → `int-ms-13` | `module-interview-5.ts` → `int-5-43`, propagation/rollback questions | **Proxy-based AOP**; **TransactionInterceptor**. **JDK dynamic proxy** vs **CGLIB**. **Self-invocation** обходит proxy. **Final class/method** мешает CGLIB subclass. JDK proxy через **interface**. Production-safe: transactional code **не final**; проверка **proxy/tx logs** | «Аннотация всегда сработает». Забыть self-invocation. Игнорировать proxy mode |
| **Hibernate / Criteria / N+1** | `module-interview-6.ts` → `int-6-25`, `int-6-26`; `module-interview-5.ts` → JPA/Hibernate block (`int-5-25`–`int-5-32`) | `module-practice-interview.ts` (LIE); другие interview SQL/JPA темы | ORM; **persistence context**; **dirty checking**; lazy/eager; **LazyInitializationException**; **N+1**; **fetch join**; entity graph; **batch size**; **Criteria API** для динамических фильтров; JPQL/QueryDSL/native SQL; **SQL logs/statistics** | N+1 только `@Transactional` на контроллере. `EAGER` везде. Criteria «везде» вместо читаемого JPQL |
| **SQL WHERE / HAVING** | `module-interview-6.ts` → `int-6-05`; пример также в `module-interview-stack.ts` → `int-stack-sql-03` | `module-interview-5.ts` → `int-5-16` | **WHERE** — до GROUP BY. **HAVING** — после агрегации. Пример: `orders`, `status = 'PAID'`, `GROUP BY user_id`, `HAVING count(*) > 10`. WHERE снижает объём группировки | Агрегат в WHERE. Объяснение без примера |
| **Kafka** | `module-interview-6.ts` → `int-6-01`–`int-6-04`; messaging: `module-interview-5.ts`, `module-interview-ms.ts` → `int-ms-08` | REST vs Kafka: `module-interview-ms.ts` | **Distributed commit log**, не просто queue. topic/partition/offset/**consumer group**. Ordering **внутри partition**. Parallelism ≤ **partitions**. **4 consumers / 3 partitions** → один idle; **3 / 4** → один consumer на двух partitions. retry/backoff/**DLQ**; **poison pill**; **idempotent consumer**; **offset commit**. **Testcontainers** / Embedded Kafka / **TopologyTestDriver**. Integration tests: **side effect** (БД, статус, outbox), не только consume | «Kafka = очередь». Business exactly-once без idempotent consumer. Только mock KafkaTemplate |
| **Scheduler / DB locking** | `module-interview-6.ts` → `int-6-07`, `int-6-08` | Distributed lock в `module-interview-5.ts` (`int-5-12`, `int-5-13`) | Local vs **distributed** scheduler. `@Scheduled` / Quartz / **K8s CronJob**. ShedLock / DB lock / leader election. **Job idempotency**. `SELECT ... FOR UPDATE SKIP LOCKED LIMIT N`; **claim** status/owner; **stale claim** timeout/requeue. **JVM Lock не между pod** | ReentrantLock между pod. `LIMIT N` без transaction/claim/ORDER BY |
| **gRPC / Protobuf** | `module-interview-6.ts` → `int-6-06`; углубление: `module-interview-4.ts` → `int-4-16` | `module-interview-ms.ts` (gRPC в интеграциях) | Protobuf не единственный теоретический формат. **`.proto`** — production-default / source of truth. **codegen stubs**; **schema evolution** / backward compatibility. **JSON transcoding** — gateway option, не замена contract | «Только Protobuf возможен» без нюанса. «Proto не нужен» для нормального gRPC |
| **GraphQL** | `module-interview-6.ts` → `int-6-24`; углубление: `module-interview-4.ts` GraphQL topic | — | Выбор полей; меньше over/underfetching. **N+1**; **DataLoader**; **query depth/complexity**; caching / security / observability | GraphQL как замена REST везде. Без resolver metrics и лимитов complexity |
| **PostgreSQL locks / MVCC / indexes / partition** | `module-interview-7.ts` → `int-7-01`–`int-7-04` | — | Optimistic `@Version` / UPDATE version; pessimistic `FOR UPDATE`; B-Tree vs GIN vs Hash; MVCC snapshot + **40001** retry; RANGE vs LIST partition + pruning | Путать optimistic/pessimistic; String Pool-style myths про MVCC |
| **Kafka lifecycle / ISR / EOS / segments** | `module-interview-6.ts` → `int-6-01`–`int-6-04` (basics); углубление **`module-interview-7.ts`** → `int-7-05`–`int-7-09` | Interview 7 duplicates must sync via `QUESTION_CANONICAL_SYNC` | Full path produce→log→commit; **`__consumer_offsets`**; rebalance + assignors; idempotent producer + txn; ISR/unclean election; log segments/index/compaction | EOS без business idempotency; offsets «где-то у consumer» |
| **JMM / Virtual Threads / G1GC / JPMS / references** | `module-interview-7.ts` → `int-7-10`, `int-7-13`–`int-7-16`, `int-7-14`–`int-7-15` | JVM basics: `module-1.ts`, `module-interview-6.ts` `int-6-18`–`int-6-20` | happens-before; data race vs **volatile**; VT vs platform + pinning; G1 young/mixed/marking; Soft/Weak/Phantom use cases; `requires transitive` | volatile для `i++`; VT для CPU-bound без pinning check |
| **Concurrent collections (lists) / HashMap Java 21** | HashMap: `int-6-16`, `int-4-02`; lists: **`module-interview-7.ts`** → `int-7-11`, `int-7-12` | Interview 7 HashMap must keep int-6-16 bullets in sync | synchronizedList vs CopyOnWrite vs Vector; HashMap treeify threshold 8/6; red-black **TreeNode** | «HashMap always O(1)»; Vector in new code |
| **HikariCP / tx propagation REQUIRES_NEW vs NESTED** | `@Transactional` proxy: `int-6-27`; propagation depth: **`module-interview-7.ts`** → `int-7-18`, `int-7-20` | `module-interview-5.ts` propagation questions | Hikari leak/unclosed ResultSet; REQUIRES_NEW independent tx; NESTED savepoint; Kafka consumer + outbox ordering | NESTED without savepoint DB; commit offset before DB |
| **Idempotency / 2PC / Saga / Circuit Breaker / SCA-SAST** | **`module-interview-7.ts`** → `int-7-19`–`int-7-23` | Idempotency touches Kafka int-6-03 | REST Idempotency-Key + UNIQUE; inbox/outbox; 2PC vs Saga; Resilience4j CB states; SCA transitive CVE (log4j) | 2PC everywhere; SAST-only without dependency scan |
| **Java backend intern matrix (35 вопросов)** | **`module-interview-intern.ts`** → `int-intern-01`–`int-intern-35` | Compact live для Intern/Junior-; пересечения с canonical выше (Spring, Hibernate N+1, Kafka, PostgreSQL, patterns, testing) | 8 секций × 35 карточек; `interviewFocus`: минимум / хороший ответ / красный флаг; не слабее must-keep из строк таблицы для пересекающихся тем | Потеря вопроса из матрицы; `language: 'sql'` в codeExample (только `java`/`text`); VT «быстрее CPU»; Optional в entity fields |

---

## Rules for adding new interview modules

1. **Перед новой темой** — открыть `docs/content-canonical-map.md` и найти строку в таблице (или добавить строку, если тема новая для проекта).
2. **Тема уже есть в учебнике и нужен тот же разбор** — добавить id в `CANONICAL_TOPIC_REUSE` (образец: `int-6-12` → `solid-principles` в `module-interview-6.ts`), `resolveTopic` → `reuseCanonicalTopic`. **Не** создавать вторую SOLID-страницу и **не** полагаться только на `QUESTION_CANONICAL_SYNC`.
3. **Тема только для live, без полного lecture twin** — compact (`QuestionDef` + `buildTopic`); колонки **Must keep everywhere** — в `answer`, hints, glossary, `QUESTION_CANONICAL_SYNC` / `QUESTION_LECTURER_NOTES`.
4. **Новая версия сильнее canonical** — обновить учебную canonical-тему **или** переназначить canonical source в этой карте (не оставлять карту устаревшей).
5. **Сомнение «укоротить учебную тему»** — не сокращать учебный модуль до interview-формата; interview дублирует смысл, не заменяет учебник.
6. **Регистрация** — `src/content/index.ts`, уникальные `id` (префикс пакета, напр. `int-7-01`), `npm run build` после правок.
7. **Не вводить** shared registry в `src/content/shared/` без явной необходимости — см. Current status.

Шаблон interview-модуля: `src/content/module-interview-6.ts` / `module-interview-7.ts` (категории, `QUESTION_OVERRIDES`, `QUESTION_LECTURER_NOTES`, `QUESTION_CANONICAL_SYNC`, `interviewFocus` с тремя фиксированными заголовками).

---

## Current status

- **SOLID** — canonical в `module-3.ts` (`solid-principles`). **Interview 6** `int-6-12` — **полная копия** этой темы (`CANONICAL_TOPIC_REUSE`), id `int-6-12` только для навигации.
- **Interview 6** — compact live для остальных тем; `QUESTION_CANONICAL_SYNC` — для тем **без** reuse, не вместо reuse для SOLID.
- **Interview 7** (`module-interview-7.ts`) — 23 темы PostgreSQL/Kafka deep/JVM 21/distributed; пересечения с int-6 через `QUESTION_CANONICAL_SYNC` (Kafka, HashMap, `@Transactional`).
- **Interview intern** (`module-interview-intern.ts`) — 35 тем Intern/Junior- matrix (Java Core, concurrency, Spring/Hibernate, SQL/PostgreSQL, distributed, microservices, patterns, testing); enrichment в `module-interview-intern-enrichment.ts`.
- Частичная **синхронизация смысла** уже проведена между `module-1`, `module-5`, `interview-4/5/6`, `interview-stack`, `interview-ms` (HashMap, String Pool/heap, `@Transactional`, WHERE/HAVING, SOLID hints); карта фиксирует источники, чтобы дубли не разъезжались снова.
- **Shared registry** (`src/content/shared/canonical-blocks.ts` или аналог) **не вводится** — проект остаётся на явных `topic()` в файлах модулей + эта документация.
- **Следующий шаг (опционально)** — вынести reusable canonical blocks в `src/content/shared/`, если дубли начнут мешать сопровождению или появятся 3+ interview-модуля с одними и теми же 20+ темами.

---

## Quick reference: file roles

| File pattern | Role |
| --- | --- |
| `module-1.ts` … `module-5.ts` | Учебные модули, максимальная глубина |
| `module-interview-3.ts` … `module-interview-7.ts` | Interview-пакеты, compact + live |
| `module-interview-intern.ts` | Intern/Junior- matrix, 35 live-карточек |
| `module-interview-ms.ts`, `module-interview-stack.ts` | Тематические interview-пакеты |
| `module-practice-interview.ts`, `module-cv-interview.ts` | Практика / CV, свои правила UI |
| `.cursor/rules/lecturer-content-fill.mdc` | Стиль наполнения для агентов/авторов |
