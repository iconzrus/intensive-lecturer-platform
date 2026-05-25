# Content Canonical Map

Правило проекта для повторяющихся тем в `src/content/`:

- **Учебные модули** (`module-1.ts` … `module-5.ts`) хранят самый полный canonical-разбор: `simpleDefinitionOverride`, развёрнутый `explainBrief`, код, `productionNote`, glossary.
- **Interview-модули** (`module-interview-*.ts`) хранят **compact live-версию**: короткий `answer`, `practicalHint`, `pitfall`, `prevention`, `interviewFocus` с эталоном/красным флагом, `questionPlan`, `lecturerNotes`, glossary.
- Interview-версия **не должна противоречить** canonical-версии и **не должна быть слабее** по ключевым идеям, антипримерам и production-акцентам.
- **Нельзя** заменять сильную учебную тему короткой interview-версией.
- Если тема встречается в нескольких файлах, новые правки берут **лучшее из canonical source** (см. таблицу ниже).
- При добавлении нового interview-модуля **сначала** открыть этот файл.

Сборка тем: `topic()` из `module-1.ts`, регистрация в `src/content/index.ts`. Контракт полей — `src/content/schema.ts` (не менять без необходимости).

---

## Canonical topics

| Topic | Canonical source | Compact / interview duplicates | Must keep everywhere | Do not regress |
| --- | --- | --- | --- | --- |
| **SOLID** | `src/content/module-3.ts` → `solid-principles` | `module-interview-6.ts` → `int-6-12`; связанные OOP/LSP: `int-6-09`, `int-6-11`, `int-6-13`; кратко `module-5.ts` → `final-patterns-solid` | SRP: одна причина изменения. OCP: расширение через стратегии/новые реализации, не if-else. LSP: Bird/Penguin/**Flyable**. ISP: fat interface. DIP: `Notifier` / `PaymentGateway`, не конкретный SDK. SOLID ради меньшей хрупкости, каскадных правок и тестируемости, не «ради интерфейсов» | Только расшифровка букв. Убрать production-примеры. «Чем больше интерфейсов — тем лучше» |
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

---

## Rules for adding new interview modules

1. **Перед новой темой** — открыть `docs/content-canonical-map.md` и найти строку в таблице (или добавить строку, если тема новая для проекта).
2. **Тема уже есть** — взять смысл, антипримеры и production-акценты из **Canonical source**; в interview оставить compact-формат (`QuestionDef` + `buildTopic` как в `module-interview-5.ts` / `module-interview-6.ts`).
3. **Interview version** — короткая, но колонки **Must keep everywhere** должны быть покрыты в `answer`, `practicalHint`, `pitfall`/`prevention`, glossary и при необходимости `QUESTION_LECTURER_NOTES`.
4. **Новая версия сильнее canonical** — обновить учебную canonical-тему **или** переназначить canonical source в этой карте (не оставлять карту устаревшей).
5. **Сомнение «укоротить учебную тему»** — не сокращать учебный модуль до interview-формата; interview дублирует смысл, не заменяет учебник.
6. **Регистрация** — `src/content/index.ts`, уникальные `id` (префикс пакета, напр. `int-7-01`), `npm run build` после правок.
7. **Не вводить** shared registry в `src/content/shared/` без явной необходимости — см. Current status.

Шаблон interview-модуля: `src/content/module-interview-6.ts` (категории, `QUESTION_OVERRIDES`, `QUESTION_LECTURER_NOTES`, `interviewFocus` с тремя фиксированными заголовками).

---

## Current status

- **SOLID** — canonical в `module-3.ts` (`solid-principles`); не подменять учебный разбор compact-версией из interview.
- **Interview 6** (`module-interview-6.ts`) — compact live-пакет по Kafka, Java Core, Spring, SQL, Hibernate, gRPC, GraphQL, scheduler; подключён в `index.ts` как `interview-6`.
- Частичная **синхронизация смысла** уже проведена между `module-1`, `module-5`, `interview-4/5/6`, `interview-stack`, `interview-ms` (HashMap, String Pool/heap, `@Transactional`, WHERE/HAVING, SOLID hints); карта фиксирует источники, чтобы дубли не разъезжались снова.
- **Shared registry** (`src/content/shared/canonical-blocks.ts` или аналог) **не вводится** — проект остаётся на явных `topic()` в файлах модулей + эта документация.
- **Следующий шаг (опционально)** — вынести reusable canonical blocks в `src/content/shared/`, если дубли начнут мешать сопровождению или появятся 3+ interview-модуля с одними и теми же 20+ темами.

---

## Quick reference: file roles

| File pattern | Role |
| --- | --- |
| `module-1.ts` … `module-5.ts` | Учебные модули, максимальная глубина |
| `module-interview-3.ts` … `module-interview-6.ts` | Interview-пакеты, compact + live |
| `module-interview-ms.ts`, `module-interview-stack.ts` | Тематические interview-пакеты |
| `module-practice-interview.ts`, `module-cv-interview.ts` | Практика / CV, свои правила UI |
| `.cursor/rules/lecturer-content-fill.mdc` | Стиль наполнения для агентов/авторов |
