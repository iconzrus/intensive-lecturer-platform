// Обогащение для module-interview-intern.ts: полный контент карточек (35 вопросов).
// Canonical alignment: docs/content-canonical-map.md — не противоречить module-1..5 и другим interview-модулям.
import type { TopicCodeExample, TopicGlossaryEntry } from './schema';

export type InternTopicEnrichment = {
  simpleDefinition: string;
  quickAnswer: string;
  explainBrief: string[];
  questionPlan: { question: string; answerHint: string }[];
  extraKeyPoints: string[];
  goodAnswer: string;
  redFlag: string;
  glossary: TopicGlossaryEntry[];
  codeExample: TopicCodeExample;
  lecturerNotes: string[];
  estimatedMinutes: number;
};

export const INTERN_TOPIC_ENRICHMENT: Record<string, InternTopicEnrichment> = {
  'int-intern-01': {
    simpleDefinition:
      'Java 17 и 21 — LTS-версии (Long-Term Support, версии с длительной поддержкой обновлений). Вопрос проверяет не историю языка, а то, пользуется ли кандидат современным синтаксисом или застрял на стиле Java 8.',
    quickAnswer:
      'LTS-версии — 8, 11, 17, 21. Из современных фич реально используют: records (компактные immutable DTO), sealed classes (закрытый список наследников), pattern matching для instanceof/switch, text blocks (многострочные строки), var (вывод типа локальной переменной). Java 21 — virtual threads: дешёвые потоки для blocking I/O, не "быстрее CPU".',
    explainBrief: [
      'records — компактный immutable класс данных: поля, конструктор, equals/hashCode/toString генерируются автоматически.',
      'sealed classes/interfaces — явно ограничивают, кто может наследовать/реализовывать; удобно вместе с pattern matching и switch без default.',
      'pattern matching для instanceof — убирает ручной каст после проверки типа: if (obj instanceof String s) { ... }.',
      'switch expressions и pattern matching для switch (Java 21) — switch как выражение, без fallthrough, можно матчить по типу и разбирать record.',
      'text blocks (""") — многострочные строки без экранирования \\n и конкатенации, удобно для SQL/JSON в коде.',
      'var — только вывод типа локальной переменной на этапе компиляции, не динамическая типизация: тип фиксирован, просто не написан явно.',
      'virtual threads (Java 21, JEP 444) — дешёвые потоки уровня JVM для blocking I/O; позволяют держать тысячи ожидающих запросов дёшево, но не увеличивают вычислительную мощность CPU.',
    ],
    questionPlan: [
      {
        question: 'Какую версию Java использовали в последнем проекте?',
        answerHint: 'LTS 11/17/21 — нормальный ответ. Если 8 — уточнить, это ограничение legacy-проекта или кандидат просто не знаком с новыми фичами.',
      },
      {
        question: 'Чем record отличается от обычного класса с полями?',
        answerHint:
          'record — immutable: компилятор сам генерирует конструктор, equals/hashCode/toString и accessors; нельзя добавить новые instance-поля сверх списка компонентов.',
      },
      {
        question: 'Зачем нужны virtual threads, если уже есть пул потоков?',
        answerHint:
          'Virtual threads дешевле для blocking I/O — можно создать миллионы, JVM сама планирует их поверх platform threads (carrier threads). Для CPU-bound задач это не ускорение.',
      },
      {
        question: 'В чём разница между var и динамической типизацией?',
        answerHint: 'var — синтаксический сахар: тип выводится компилятором один раз при объявлении и дальше фиксирован, это не как в Python/JS.',
      },
    ],
    extraKeyPoints: [
      'LTS-версии — 8, 11, 17, 21 — на них ориентируются enterprise-проекты.',
      'sealed + pattern matching в switch часто используют вместе для исчерпывающей обработки без ветки default на все случаи.',
      'virtual threads — не замена CompletableFuture/reactive для CPU-bound задач.',
    ],
    goodAnswer:
      'Называет LTS-версии, приводит 2-3 конкретные фичи с примером использования (records для DTO, text blocks для SQL-запроса в коде) и корректно объясняет virtual threads как способ удешевить блокирующий I/O, а не "ускорить процессор".',
    redFlag:
      'Путает var с динамической типизацией; называет virtual threads "быстрее потоков вообще" без уточнения про I/O; не может назвать ни одной фичи после Java 8.',
    glossary: [
      { term: 'LTS', meaning: 'Long-Term Support — версия Java с длительной официальной поддержкой обновлений.' },
      { term: 'JEP', meaning: 'JDK Enhancement Proposal — формальное предложение изменения в Java/JDK.' },
      { term: 'record', meaning: 'Компактный immutable класс данных с автогенерацией конструктора/equals/hashCode/toString.' },
      { term: 'sealed', meaning: 'Модификатор, явно ограничивающий список классов/интерфейсов, которым разрешено наследование.' },
      { term: 'pattern matching', meaning: 'Проверка типа/структуры значения с одновременным извлечением данных без ручного каста.' },
      { term: 'virtual thread', meaning: 'Дешёвый управляемый JVM поток для блокирующих операций (Java 21, JEP 444).' },
      { term: 'carrier thread', meaning: 'Platform-поток, на котором virtual thread реально выполняется в конкретный момент.' },
      { term: 'text block', meaning: 'Многострочный строковый литерал в тройных кавычках """.' },
    ],
    codeExample: {
      title: 'record + sealed + pattern matching в switch',
      language: 'java',
      snippet: `sealed interface Shape permits Circle, Square {}
record Circle(double radius) implements Shape {}
record Square(double side) implements Shape {}

double area(Shape shape) {
  return switch (shape) {
    case Circle c -> Math.PI * c.radius() * c.radius();
    case Square s -> s.side() * s.side();
  }; // exhaustive: default не нужен, компилятор знает все варианты Shape
}`,
      walkthrough: [
        'sealed фиксирует список реализаций Shape — компилятор проверяет, что switch покрывает их все.',
        'record Circle/Square — immutable, доступ к полям через radius()/side(), не через getRadius().',
      ],
      commonPitfall:
        'Компактный record выглядит как обычный DTO, но это immutable value: нельзя просто добавить сеттер для мутации — это уже будет не record.',
      productionNote:
        'records не заменяют JPA entity: Hibernate entity нужна mutable identity, а record не даёт мутации и часто не имеет пустого конструктора, который ожидают ORM-провайдеры.',
    },
    lecturerNotes: [
      'Оценка быстро: LTS-версии + минимум 2 конкретные фичи с примером — зачёт. Не уходить в историю версий Java до 17.',
      'Дожать про virtual threads: спросить прямо "ускоряют ли они CPU-bound код?" — сильный кандидат сразу скажет "нет".',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-02': {
    simpleDefinition:
      'JVM делит память на несколько областей: stack — для вызовов методов и локальных переменных (свой на поток), heap — для объектов (общий), Metaspace — для метаданных классов (общий, вне heap). OutOfMemoryError — JVM не может выделить память в одной из этих областей.',
    quickAnswer:
      'Stack — свой на каждый поток, хранит frames (кадры вызовов методов), локальные переменные и ссылки на объекты; кончается — StackOverflowError. Heap — общий для всех потоков, хранит сами объекты; кончается — OutOfMemoryError: Java heap space. Metaspace — метаданные классов; кончается — OutOfMemoryError: Metaspace. OutOfMemoryError бывает разных видов, не только про heap.',
    explainBrief: [
      'Stack — свой на каждый поток; frame создаётся на вызов метода и уничтожается при возврате; хранит примитивы и ссылки, не сами объекты.',
      'Heap — общая область для всех объектов; делится на young и old generation для нужд сборщика мусора.',
      'Metaspace — метаданные классов (байт-код, constant pool), заменил PermGen в Java 8; растёт при динамической генерации классов (proxy, много classloader-ов).',
      'StackOverflowError — не разновидность OutOfMemoryError; типичная причина — неограниченная или некорректная рекурсия.',
      'OutOfMemoryError бывает нескольких видов: Java heap space, Metaspace, GC overhead limit exceeded, unable to create native thread.',
      '"GC overhead limit exceeded" — JVM тратит более 98% времени на сборку мусора и почти не высвобождает память: фактически утечка или маленький heap.',
      'Direct/native (off-heap) память, например ByteBuffer.allocateDirect, — тоже может закончиться; это отдельная область, не heap и не Metaspace.',
    ],
    questionPlan: [
      {
        question: 'Где хранится объект, а где ссылка на него?',
        answerHint: 'Объект — в heap. Ссылка на объект — как локальная переменная в stack frame, либо как поле другого объекта — тогда сама ссылка тоже в heap.',
      },
      {
        question: 'Чем StackOverflowError отличается от OutOfMemoryError?',
        answerHint:
          'StackOverflowError — переполнен stack одного потока (обычно рекурсия). OutOfMemoryError — не хватает heap, Metaspace или native-памяти, причины разные.',
      },
      {
        question: 'Что за OutOfMemoryError: Metaspace и когда он возникает?',
        answerHint:
          'Не хватает памяти под метаданные классов; часто из-за динамической генерации классов (много classloader-ов, hot redeploy, proxy-классы).',
      },
      {
        question: 'Как будете диагностировать OutOfMemoryError на проде?',
        answerHint:
          'Heap dump (-XX:+HeapDumpOnOutOfMemoryError), анализ в MAT/VisualVM: какие объекты держат ссылки (GC root), это реальная утечка или просто мало heap.',
      },
    ],
    extraKeyPoints: [
      'Кандидат обязан разделять "где лежит объект" (heap) и "где лежит ссылка" (stack или поле heap-объекта).',
      'OutOfMemoryError — семейство ошибок с разным текстом; текст сообщения — первая подсказка, где искать причину.',
      'Metaspace не растёт бесконечно без причины — неограниченный рост обычно означает баг с classloader-ами.',
    ],
    goodAnswer:
      'Чётко раскладывает stack (на поток, frames, локальные переменные/ссылки), heap (объекты, GC) и Metaspace (метаданные классов), называет минимум 2 вида OutOfMemoryError и знает, что StackOverflowError — отдельная ошибка, не подтип OutOfMemoryError.',
    redFlag:
      'Говорит "объект хранится в стеке"; считает, что OutOfMemoryError бывает только про heap; не может объяснить разницу stack/heap на примере.',
    glossary: [
      { term: 'JVM', meaning: 'Виртуальная машина Java: исполняет байткод, управляет памятью и потоками.' },
      { term: 'heap', meaning: 'Общая область памяти для объектов, за которой следит сборщик мусора.' },
      { term: 'stack', meaning: 'Область памяти потока: кадры вызовов методов, локальные переменные, ссылки.' },
      { term: 'frame', meaning: 'Кадр стека — контекст одного вызова метода: параметры, локальные переменные, адрес возврата.' },
      { term: 'Metaspace', meaning: 'Область памяти для метаданных классов; заменила PermGen с Java 8.' },
      { term: 'GC root', meaning: 'Точка отсчёта для сборщика мусора: стек, статические поля, активные потоки.' },
      { term: 'OutOfMemoryError', meaning: 'JVM не смогла выделить память в одной из своих областей.' },
      { term: 'StackOverflowError', meaning: 'Переполнение стека одного потока, обычно из-за рекурсии.' },
    ],
    codeExample: {
      title: 'StackOverflowError vs heap OutOfMemoryError',
      language: 'java',
      snippet: `// StackOverflowError: бесконечная рекурсия переполняет stack одного потока
void recurse() { recurse(); }

// OutOfMemoryError: Java heap space — объекты копятся в heap без освобождения
List<byte[]> leak = new ArrayList<>();
while (true) { leak.add(new byte[1_000_000]); }`,
      walkthrough: [
        'recurse() создаёт новый frame на каждый вызов — stack одного потока переполняется.',
        'leak копит объекты в heap, на которые есть живая ссылка (сам leak) — GC не может их собрать, heap заканчивается.',
      ],
      commonPitfall:
        'Путать "куда положили ссылку" с "где создан объект": переменная типа Object user в методе лежит в stack, а сам объект User — в heap.',
      productionNote:
        'На проде OutOfMemoryError почти никогда не лечится слепым увеличением -Xmx — сначала heap dump и поиск утечки (кэш без eviction, ThreadLocal без remove, listeners без unsubscribe).',
    },
    lecturerNotes: [
      'Дожать конкретным примером: "где лежит объект User, а где ссылка user" — частый провал даже у уверенных кандидатов.',
      'Не уходить в детальный тюнинг GC-флагов — это тема отдельного вопроса про сборщик мусора.',
    ],
    estimatedMinutes: 3,
  },

  'int-intern-03': {
    simpleDefinition:
      'Checked exception — исключение, которое компилятор заставляет объявить (throws) или обработать (try/catch); наследник Exception, но не RuntimeException. Unchecked — компилятор не требует обработки; наследник RuntimeException или Error.',
    quickAnswer:
      'Checked — для ожидаемых, восстановимых ситуаций на границе API (файла нет, сеть недоступна): IOException, SQLException. Unchecked — для ошибок программиста или нарушения инварианта: NullPointerException, IllegalArgumentException, IllegalStateException. Не стоит городить свой checked exception на каждую бизнес-ошибку — это раздувает сигнатуры методов и провоцирует catch(Exception), "чтобы компилировалось".',
    explainBrief: [
      'Checked — наследник Exception (не RuntimeException); компилятор требует throws или try/catch.',
      'Unchecked (RuntimeException) — компилятор не проверяет; это осознанный выбор дизайна, а не забывчивость.',
      'Error (например OutOfMemoryError, StackOverflowError) — тоже unchecked, но означает проблему уровня JVM, обычно не ловится и не восстанавливается в бизнес-логике.',
      'Checked уместен, когда вызывающий код реально может и должен восстановиться (retry, fallback, понятное сообщение пользователю).',
      'Unchecked уместен для программных ошибок: неверный аргумент, нарушенный инвариант, "этого не должно было случиться".',
      'Частая ошибка — checked exception на каждую бизнес-ошибку (например, InsufficientFundsException extends Exception) — раздувает throws-цепочки через все слои.',
      'Ещё одна частая ошибка — "глотать" исключение: catch (Exception e) {} без логирования и без действия — теряется причина сбоя.',
    ],
    questionPlan: [
      {
        question: 'Приведите пример checked и unchecked исключения из стандартной библиотеки.',
        answerHint: 'IOException/SQLException — checked; NullPointerException/IllegalArgumentException — unchecked.',
      },
      {
        question: 'Почему в Spring/REST-контроллерах бизнес-ошибки чаще делают unchecked?',
        answerHint:
          'Unchecked не засоряет сигнатуры throws через все слои (service → repository), обрабатывается централизованно через @ControllerAdvice/@ExceptionHandler.',
      },
      {
        question: 'Что не так с catch (Exception e) {} без логирования?',
        answerHint: 'Скрывает причину сбоя, усложняет диагностику, приложение продолжает работать в неверном состоянии.',
      },
      {
        question: 'Когда всё-таки оправдан свой checked exception?',
        answerHint: 'Библиотечный/SDK-код, где вызывающий обязан явно решить, что делать при сбое (например, парсинг внешнего формата).',
      },
    ],
    extraKeyPoints: [
      'Критерий выбора — "может ли вызывающий код разумно восстановиться" (checked) или "это баг/нарушение контракта" (unchecked).',
      'Error — не для перехвата и восстановления в бизнес-логике.',
      'В современном enterprise Java (Spring) де-факто стандарт — unchecked бизнес-исключения плюс централизованный обработчик.',
    ],
    goodAnswer:
      'Даёт правильные примеры, объясняет критерий выбора через "ожидаемое и восстановимое на границе API" против "программной ошибки", упоминает проблему раздувания throws и правило "не глотать исключения".',
    redFlag:
      'Не знает, что Error тоже unchecked; предлагает checked exception на каждую бизнес-ошибку; не видит проблемы в пустом catch-блоке.',
    glossary: [
      { term: 'checked exception', meaning: 'Исключение, которое компилятор требует объявить или обработать (throws/try-catch).' },
      { term: 'unchecked exception', meaning: 'Исключение, обработку которого компилятор не проверяет (RuntimeException и наследники).' },
      { term: 'RuntimeException', meaning: 'Базовый класс unchecked исключений, обычно программных ошибок.' },
      { term: 'Error', meaning: 'Проблема уровня JVM (например, OutOfMemoryError); обычно не перехватывается для восстановления.' },
      { term: '@ExceptionHandler', meaning: 'Аннотация Spring для централизованной обработки исключений контроллера.' },
    ],
    codeExample: {
      title: 'Unchecked бизнес-исключение + централизованный обработчик',
      language: 'java',
      snippet: `class InsufficientFundsException extends RuntimeException {
  InsufficientFundsException(String message) { super(message); }
}

@ExceptionHandler(InsufficientFundsException.class)
ResponseEntity<ErrorResponse> handle(InsufficientFundsException ex) {
  return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(ex.getMessage()));
}`,
      walkthrough: [
        'InsufficientFundsException unchecked — не нужно объявлять throws через все слои сервиса.',
        '@ExceptionHandler ловит его централизованно в одном месте, а не в каждом методе.',
      ],
      commonPitfall: 'catch (Exception e) { } — компилируется, но исключение исчезает бесследно, а состояние приложения может остаться неконсистентным.',
      productionNote:
        'На границе с внешними системами (HTTP-клиент, файл, БД) всегда логировать exception с контекстом (что делали, какие параметры) — иначе на проде не восстановить причину.',
    },
    lecturerNotes: [
      'Дожать: "а что если внутри catch ничего не сделать?" — сильный кандидат сам назовёт проблему потери контекста.',
      'Не уходить в полный список стандартных исключений — достаточно 1-2 примеров каждого вида.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-04': {
    simpleDefinition:
      'Optional<T> — контейнер-обёртка, которая явно говорит "значение может отсутствовать", вместо того чтобы возвращать null и надеяться, что вызывающий код его проверит.',
    quickAnswer:
      'Optional — контейнер "значение может отсутствовать". Хорош для return type, когда отсутствие — ожидаемый результат. Плох для полей entity/DTO, параметров методов и сериализации. Не спасает от null автоматически: если положить null через ofNullable — получишь empty, а если вызвать get() без проверки — просто перенёс NullPointerException в другое место.',
    explainBrief: [
      'Хорошее место — return type метода, где "ничего не найдено" — нормальный ожидаемый исход (например, репозиторий findByEmail).',
      'Плохое место — поле entity/DTO: Optional не имеет смысла как тип колонки/JSON-поля, усложняет маппинг и сериализацию без пользы.',
      'Плохое место — параметр метода: перегрузка методов или null-check внутри читаются проще, чем Optional<String> в сигнатуре.',
      'get() без isPresent()/orElseThrow — та же проблема, что и с null, просто в другом месте кода (NoSuchElementException вместо NullPointerException).',
      'orElse(...) всегда вычисляет аргумент (eager), orElseGet(Supplier) — лениво; разница важна, если создание значения по умолчанию дорогое.',
      'Optional — не коллекция, хотя API похож (map/filter/stream); семантически это "0 или 1 значение", а не список.',
      'map/flatMap/filter позволяют строить цепочку без ручных проверок на null, но не должны превращаться в нечитаемую "optional-лапшу" из 5+ вызовов подряд.',
    ],
    questionPlan: [
      {
        question: 'Где стоит использовать Optional, а где нет?',
        answerHint: 'Return type сервисов/репозиториев — да; поля entity/DTO, параметры метода, сериализация — нет.',
      },
      {
        question: 'Чем orElse отличается от orElseGet?',
        answerHint: 'orElse всегда вычисляет значение по умолчанию сразу; orElseGet — лениво через Supplier, вызывается только если Optional пуст.',
      },
      {
        question: 'Optional.of(null) — что произойдёт?',
        answerHint: 'NullPointerException сразу; для потенциально пустого значения нужен Optional.ofNullable.',
      },
      {
        question: 'Чем Optional.get() без проверки хуже обычного NPE?',
        answerHint:
          'Не хуже и не лучше — тот же класс проблемы (обращение к отсутствующему значению без проверки), просто другое исключение и часто ложное чувство безопасности "я же обернул в Optional".',
      },
    ],
    extraKeyPoints: [
      'Критерий "хорошего использования" — только return type для "результат может отсутствовать по бизнес-смыслу".',
      'Optional не решает проблему null полностью — переносит ответственность на явную проверку, а не устраняет её.',
      'В DTO для JSON Optional<T> сериализуется неоднозначно в зависимости от библиотеки — на границе API лучше обычное nullable-поле.',
    ],
    goodAnswer:
      'Указывает правильное место применения (return type), явно называет минимум 2 антипаттерна (поля entity/DTO, параметры метода), знает разницу orElse/orElseGet, понимает, что get() без проверки не "безопаснее" null.',
    redFlag:
      'Говорит "Optional нужен, чтобы не было null" без уточнений; использует Optional как поле сущности или тип параметра; вызывает get() везде без проверки.',
    glossary: [
      { term: 'Optional', meaning: 'Контейнер "значение может отсутствовать" для return type метода.' },
      { term: 'orElse', meaning: 'Значение по умолчанию, вычисляется всегда (eager), даже если Optional не пуст.' },
      { term: 'orElseGet', meaning: 'Значение по умолчанию через Supplier, вычисляется только если Optional пуст (lazy).' },
      { term: 'orElseThrow', meaning: 'Бросает исключение, если Optional пуст, вместо возврата значения по умолчанию.' },
      { term: 'ofNullable', meaning: 'Создаёт Optional из значения, которое может быть null (даёт empty вместо NPE).' },
      { term: 'NoSuchElementException', meaning: 'Исключение при вызове get() на пустом Optional.' },
    ],
    codeExample: {
      title: 'Optional как return type репозитория',
      language: 'java',
      snippet: `// хорошо: return type репозитория
Optional<User> findByEmail(String email);

User user = userRepository.findByEmail(email)
    .orElseThrow(() -> new UserNotFoundException(email));

// плохо: поле entity
@Entity
class UserProfile {
  private Optional<String> nickname; // Hibernate не умеет маппить Optional как тип колонки
}`,
      walkthrough: [
        'findByEmail возвращает Optional — вызывающий код обязан явно решить, что делать при отсутствии.',
        'orElseThrow сразу превращает "нет значения" в понятное бизнес-исключение.',
      ],
      commonPitfall: 'Optional<String> nickname в @Entity — лишний уровень обёртки без пользы, Hibernate не маппит его как обычный тип колонки.',
      productionNote:
        'В DTO для внешнего API Optional лучше не выставлять наружу — Jackson сериализует его непредсказуемо в зависимости от версии/модуля; используйте обычное nullable-поле и @JsonInclude при необходимости.',
    },
    lecturerNotes: [
      'Ключевой дожим: попросить назвать 2 места, где Optional НЕ стоит использовать — не только где стоит.',
      'Красный флаг легко проверить: спросить "что делает get() без проверки" — многие путают с "полной защитой от null".',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-05': {
    simpleDefinition:
      'Garbage Collector (GC) — часть JVM, которая находит объекты, до которых нельзя добраться ни по одной цепочке ссылок из "корней" (reachability), и освобождает занятую ими память автоматически.',
    quickAnswer:
      'GC работает по принципу reachability: объект жив, пока до него есть путь от GC root (стек, статические поля). Heap делится на young (Eden + Survivor) и old generation — большинство объектов умирает молодыми. G1 — сборщик по умолчанию в современных JVM (компромисс throughput/latency), ZGC и Shenandoah — для low-latency (паузы почти не зависят от размера heap), Serial/Parallel — простые сборщики для маленьких приложений или batch. Тюнинг GC делают после замеров по GC logs, а не "на глаз".',
    explainBrief: [
      'Reachability — объект собирается, если до него нет пути от GC root (локальные переменные в стеке, статические поля, активные потоки).',
      'Young generation (Eden + 2 Survivor) — новые объекты, частые быстрые сборки (Minor GC); большинство объектов умирает здесь.',
      'Old generation — объекты, пережившие несколько Minor GC (tenuring); собираются реже, но дольше (Major/Full GC).',
      'STW (Stop-The-World) паузы — во время части фаз GC все рабочие потоки приложения останавливаются; цель тюнинга — минимизировать длительность и частоту STW.',
      'G1 (Garbage First) — сборщик по умолчанию с Java 9: делит heap на регионы, собирает сначала регионы с наибольшим количеством мусора.',
      'ZGC и Shenandoah — low-latency сборщики: паузы почти не зависят от размера heap (десятки терабайт), но выше фоновый overhead.',
      'Serial — однопоточный, для маленьких приложений/CLI; Parallel — многопоточный, throughput-ориентированный, для batch без жёстких требований к latency.',
    ],
    questionPlan: [
      {
        question: 'Что значит, что объект "reachable"?',
        answerHint: 'Есть цепочка ссылок от GC root (стек, статические поля) до объекта; unreachable — кандидат на сборку.',
      },
      {
        question: 'Почему heap делят на young и old?',
        answerHint: 'Большинство объектов недолговечны (generational hypothesis): собирать маленький young часто дешевле, чем весь heap.',
      },
      {
        question: 'Какой GC выберете по умолчанию в современном проекте и почему?',
        answerHint: 'G1 как разумный default; ZGC/Shenandoah — для предсказуемо низких пауз на большом heap; Serial/Parallel — нишевые случаи.',
      },
      {
        question: 'Как понять, что GC — реальная проблема, а не выдумка разработчика?',
        answerHint: 'GC logs (-Xlog:gc*), метрики пауз/частоты, профилировщик; тюнинг делают по данным, не по интуиции.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен связать "молодые объекты умирают быстро" с делением heap на generations, а не просто перечислить названия сборщиков.',
      'STW — общий термин; не весь цикл GC обязательно STW (у G1/ZGC есть конкурентные фазы).',
      'Тюнинг "на глаз" (менять -Xmx наугад) — красный флаг; правильный путь — GC logs, гипотеза, эксперимент.',
    ],
    goodAnswer:
      'Объясняет reachability, генерационную гипотезу, называет минимум 3 сборщика с их нишей (G1 default, ZGC/Shenandoah low-latency, Serial/Parallel базовые) и говорит, что тюнинг делается по данным.',
    redFlag:
      'Говорит "GC просто чистит память время от времени" без reachability/generations; не может назвать ни одного сборщика; предлагает тюнить -Xmx интуитивно без логов.',
    glossary: [
      { term: 'GC', meaning: 'Garbage Collector — сборщик мусора JVM.' },
      { term: 'reachability', meaning: 'Достижимость объекта по цепочке ссылок от GC root.' },
      { term: 'GC root', meaning: 'Точка отсчёта для сборщика мусора: стек, статические поля, активные потоки.' },
      { term: 'Young/Old generation', meaning: 'Части heap для новых и переживших несколько сборок объектов.' },
      { term: 'Minor GC', meaning: 'Сборка young generation, обычно быстрая и частая.' },
      { term: 'Full GC', meaning: 'Полная сборка всего heap, обычно дорогая по времени.' },
      { term: 'STW', meaning: 'Stop-The-World — пауза, во время которой рабочие потоки приложения остановлены.' },
      { term: 'G1', meaning: 'Garbage First — сборщик мусора по умолчанию с Java 9, регионный, баланс throughput/latency.' },
      { term: 'ZGC / Shenandoah', meaning: 'Low-latency сборщики: паузы почти не зависят от размера heap.' },
    ],
    codeExample: {
      title: 'Включение GC-логов для диагностики',
      language: 'text',
      snippet: `# запуск с логами GC (Java 9+)
java -Xlog:gc*:file=gc.log:time,uptime,level,tags -jar app.jar

# что смотреть в логах:
# - частота и длительность пауз (Pause Young/Mixed)
# - allocation rate (сколько heap выделяется в секунду)
# - Full GC (failure) — тревожный сигнал`,
      walkthrough: [
        'Логи включают постоянно, не только при инциденте — иначе не с чем сравнить "нормальное" поведение.',
        'Full GC (failure) в G1 обычно означает нехватку heap или гуманоидные объекты, которые не поместились в обычный регион.',
      ],
      commonPitfall: 'Считать сборщик "сломанным" по одной длинной паузе в логах без учёта общей картины (частота, allocation rate, размер heap).',
      productionNote: 'Включать GC logs в проде постоянно (-Xlog:gc*:file=...) — это дёшево и единственный надёжный источник для диагностики пауз и OutOfMemoryError.',
    },
    lecturerNotes: [
      'Дожать вопросом "а что если heap маленький, а объекты большие" — про humongous objects в G1, если кандидат заявляет глубокие знания.',
      'Для intern-уровня достаточно reachability + generations + название 2-3 сборщиков; не уходить в детальный тюнинг флагов.',
    ],
    estimatedMinutes: 3,
  },

  'int-intern-06': {
    simpleDefinition:
      'Thread — низкоуровневый поток выполнения; Runnable/Callable — задача без потока; ExecutorService — управляемый пул потоков, который выполняет задачи; CompletableFuture — способ строить асинхронный конвейер (цепочку шагов) поверх пула, с комбинированием результатов.',
    quickAnswer:
      'Создание потока напрямую (new Thread()) на проде используют редко — это неуправляемо, нет пула, нет лимита. ExecutorService — когда нужно просто выполнить набор независимых задач с контролируемым пулом (submit/invokeAll). CompletableFuture — когда нужно скомпоновать несколько асинхронных шагов (thenApply/thenCompose/allOf), в том числе с разными executor-ами на разных этапах.',
    explainBrief: [
      'Thread/Runnable — базовый API; new Thread(runnable).start() создаёт один неуправляемый поток, на проде почти не используют напрямую.',
      'Callable<V> — как Runnable, но может вернуть результат и бросить checked exception; используется с ExecutorService.submit().',
      'ExecutorService управляет пулом потоков: submit/execute/invokeAll/invokeAny; важно вызывать shutdown()/shutdownNow(), иначе JVM не завершится штатно.',
      'Типы пулов: fixed (стабильная нагрузка), cached (короткие всплески, риск неограниченного роста), single-threaded (последовательная очередь задач).',
      'CompletableFuture — асинхронный конвейер: thenApply (трансформация), thenCompose (цепочка зависимых асинхронных шагов), thenCombine (объединить два независимых Future), allOf/anyOf.',
      'exceptionally/handle в CompletableFuture — обработка ошибок в цепочке, аналог try/catch для асинхронного кода.',
      'Выбор: простое "выполнить N задач параллельно и собрать результаты" — ExecutorService/invokeAll; "выстроить зависимую цепочку с разными источниками" — CompletableFuture.',
    ],
    questionPlan: [
      {
        question: 'Почему на проде избегают new Thread() напрямую?',
        answerHint: 'Нет пула и лимита, каждый поток дорог (память на stack, context switch), сложно контролировать нагрузку.',
      },
      {
        question: 'Что будет, если не вызвать shutdown() у ExecutorService?',
        answerHint: 'Non-daemon потоки пула не дадут JVM завершиться — приложение "зависнет" при попытке остановки.',
      },
      {
        question: 'Чем thenApply отличается от thenCompose?',
        answerHint:
          'thenApply трансформирует результат синхронно (T в U); thenCompose — для случая, когда следующий шаг сам возвращает CompletableFuture (плоская композиция без Future внутри Future).',
      },
      {
        question: 'Как обработать ошибку в цепочке CompletableFuture?',
        answerHint: 'exceptionally(Throwable → T) или handle(BiFunction<T, Throwable, U>) — аналог catch для асинхронного конвейера.',
      },
    ],
    extraKeyPoints: [
      'ExecutorService и CompletableFuture не взаимоисключающие: CompletableFuture.supplyAsync(..., executor) обычно и использует пул ExecutorService.',
      'Забытый shutdown() — частая причина "зависшего" процесса при остановке приложения.',
      'thenCompose vs thenApply — классическая ловушка "знает слово, но не понимает разницу".',
    ],
    goodAnswer:
      'Явно разводит "просто выполнить пул задач" (ExecutorService) и "построить асинхронный конвейер с зависимостями" (CompletableFuture), знает про обязательный shutdown и разницу thenApply/thenCompose.',
    redFlag:
      'Использует new Thread() как единственный способ; не знает, зачем вызывать shutdown(); путает thenApply и thenCompose или вообще не может объяснить разницу.',
    glossary: [
      { term: 'Thread', meaning: 'Низкоуровневый поток выполнения JVM.' },
      { term: 'Runnable / Callable', meaning: 'Задача без потока: Runnable — без результата, Callable — с результатом и checked exception.' },
      { term: 'ExecutorService', meaning: 'Управляемый пул потоков для выполнения задач.' },
      { term: 'Future', meaning: 'Результат асинхронной задачи, доступный позже.' },
      { term: 'CompletableFuture', meaning: 'Future с поддержкой композиции асинхронных шагов.' },
      { term: 'thenApply / thenCompose', meaning: 'Трансформация результата синхронно или через вложенный CompletableFuture соответственно.' },
    ],
    codeExample: {
      title: 'ExecutorService + CompletableFuture pipeline',
      language: 'java',
      snippet: `ExecutorService pool = Executors.newFixedThreadPool(4);
try {
  CompletableFuture<Order> future = CompletableFuture
      .supplyAsync(() -> loadOrder(id), pool)
      .thenCompose(order -> CompletableFuture.supplyAsync(() -> enrich(order), pool))
      .exceptionally(ex -> Order.failed(id));
} finally {
  pool.shutdown();
}`,
      walkthrough: [
        'thenCompose используется потому, что enrich(order) сам возвращает CompletableFuture — без него получили бы Future<Future<Order>>.',
        'exceptionally перехватывает ошибку на любом шаге цепочки и подставляет fallback.',
      ],
      commonPitfall: 'Забыть executorService.shutdown() — пул с non-daemon потоками держит JVM живой, приложение не завершается штатно.',
      productionNote:
        'Указывать свой Executor в CompletableFuture.supplyAsync(...) явно — иначе используется общий ForkJoinPool.commonPool(), который делят все асинхронные задачи JVM, включая parallel stream.',
    },
    lecturerNotes: [
      'Дожать конкретным кейсом: "как получить результат трёх независимых вызовов одновременно" — ждём allOf, не последовательные thenApply.',
      'Не уходить в детали ForkJoinPool.commonPool на intern-уровне, достаточно упомянуть, что он общий.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-07': {
    simpleDefinition:
      'Все три инструмента защищают общие данные от одновременного некорректного доступа из разных потоков, но по-разному: synchronized — встроенный монитор языка, ReentrantLock — явный объект-блокировка с расширенными возможностями, ConcurrentHashMap — готовая потокобезопасная структура данных без ручных блокировок в коде вызывающего.',
    quickAnswer:
      'synchronized — простой встроенный monitor lock на объекте/методе, автоматически освобождается при выходе из блока (в том числе при исключении). ReentrantLock — то же самое, но явно: tryLock() с таймаутом, прерываемое ожидание (lockInterruptibly), fairness — и обязательно освобождать в finally. ConcurrentHashMap — не "Map с synchronized на каждый метод", а структура с внутренним сегментированием и CAS-операциями: put и get разных ключей не обязаны блокировать друг друга целиком.',
    explainBrief: [
      'synchronized — монитор (monitor lock): на входе в блок/метод поток захватывает lock объекта, на выходе (в том числе по exception) освобождает автоматически.',
      'ReentrantLock — та же реентерабельность (свой же поток может взять lock повторно), но управление ручное: обязательно unlock() в finally, иначе блокировка "утечёт".',
      'ReentrantLock даёт то, чего нет у synchronized: tryLock(timeout) — не ждать вечно, lockInterruptibly() — прерываемое ожидание, fairness — FIFO-порядок ожидающих потоков.',
      'ConcurrentHashMap — не просто synchronizedMap: конкурентные put/get на разных ключах не блокируют друг друга целиком; агрегатные операции вроде size() при высокой конкуренции приблизительны.',
      'compute/computeIfAbsent в ConcurrentHashMap атомарны на уровне ключа — это правильный способ "проверить и обновить" без внешней блокировки.',
      'Частая ошибка — синхронизироваться на разных объектах в разных местах кода, которые должны защищать одни и те же данные (мнимая защита).',
      'synchronizedMap(new HashMap<>()) блокирует весь Map целиком на каждую операцию — намного грубее, чем ConcurrentHashMap.',
    ],
    questionPlan: [
      {
        question: 'Чем ReentrantLock лучше synchronized?',
        answerHint: 'tryLock с таймаутом, прерываемое ожидание, fairness — то, чего нет у встроенного монитора.',
      },
      {
        question: 'Что будет, если забыть unlock() у ReentrantLock?',
        answerHint: 'Другие потоки будут ждать блокировку бесконечно — поэтому unlock всегда должен быть в finally.',
      },
      {
        question: 'ConcurrentHashMap — это просто Map с synchronized внутри?',
        answerHint: 'Нет: отдельная реализация с более мелкой гранулярностью блокировок/CAS, доступ к разным ключам не блокирует друг друга полностью.',
      },
      {
        question: 'Как атомарно сделать "если ключа нет — вычислить и положить" в ConcurrentHashMap?',
        answerHint: 'computeIfAbsent(key, function) — атомарная операция на уровне ключа, без ручной синхронизации снаружи.',
      },
    ],
    extraKeyPoints: [
      'Критерий выбора: synchronized достаточен в большинстве случаев; ReentrantLock — когда нужны tryLock/fairness/interruptible; ConcurrentHashMap — когда общий ресурс это сама коллекция.',
      'unlock() в finally — не опция, а обязательное правило для ReentrantLock.',
      'size() и другие агрегаты ConcurrentHashMap при высокой конкуренции — оценка, не гарантированно точное число в конкретный момент.',
    ],
    goodAnswer:
      'Явно называет отличия ReentrantLock от synchronized (tryLock/fairness/interruptible), знает про обязательный finally-unlock, понимает, что ConcurrentHashMap — другая структура, а не "Map плюс synchronized", и знает про computeIfAbsent.',
    redFlag:
      'Говорит "ReentrantLock — то же самое, что synchronized, просто по-другому пишется"; забывает про finally для unlock; считает ConcurrentHashMap просто "потокобезопасным HashMap" без объяснения механизма.',
    glossary: [
      { term: 'monitor', meaning: 'Встроенный механизм блокировки объекта в Java, используемый synchronized.' },
      { term: 'synchronized', meaning: 'Ключевое слово для захвата монитора объекта на блок/метод.' },
      { term: 'ReentrantLock', meaning: 'Явный объект-блокировка с tryLock, fairness и прерываемым ожиданием.' },
      { term: 'fairness', meaning: 'Гарантия FIFO-порядка получения блокировки ожидающими потоками.' },
      { term: 'ConcurrentHashMap', meaning: 'Потокобезопасная реализация Map с мелкой гранулярностью блокировок/CAS.' },
      { term: 'computeIfAbsent', meaning: 'Атомарная операция "вычислить и положить, если ключа нет" на уровне ключа.' },
      { term: 'CAS', meaning: 'Compare-And-Swap — атомарная операция сравнения и замены значения без блокировки.' },
    ],
    codeExample: {
      title: 'synchronized vs ReentrantLock vs ConcurrentHashMap.computeIfAbsent',
      language: 'java',
      snippet: `// synchronized: просто, автоматическое освобождение
synchronized (lockObject) { counter++; }

// ReentrantLock: явно, обязательный finally
Lock lock = new ReentrantLock();
lock.lock();
try { counter++; } finally { lock.unlock(); }

// ConcurrentHashMap: атомарно на уровне ключа, без ручного lock
ConcurrentHashMap<String, Long> cache = new ConcurrentHashMap<>();
cache.computeIfAbsent(key, k -> expensiveLoad(k));`,
      walkthrough: [
        'synchronized освобождается автоматически даже при исключении внутри блока.',
        'ReentrantLock требует ручного unlock() строго в finally — иначе блокировка "утечёт" при исключении.',
      ],
      commonPitfall: 'lock.lock() без try/finally — если между lock() и unlock() выбросится исключение, блокировка никогда не освободится.',
      productionNote:
        'На высоконагруженных счётчиках/кэшах предпочитать ConcurrentHashMap/атомарные классы (AtomicLong) вместо ручной synchronized-обёртки — меньше contention (конкуренция потоков за один и тот же lock).',
    },
    lecturerNotes: [
      'Проверить finally практическим вопросом: "что если exception между lock() и unlock()?" — частый провал.',
      'Не углубляться в внутреннее устройство ConcurrentHashMap (bins/CAS-детали) — для intern достаточно верхнего уровня понимания.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-08': {
    simpleDefinition:
      'Deadlock (взаимная блокировка) — ситуация, когда два и более потока навсегда ждут друг друга: каждый держит ресурс, который нужен другому, и не может продолжить.',
    quickAnswer:
      'Классический пример — два потока берут два lock в разном порядке: поток A взял lock1 и ждёт lock2, поток B взял lock2 и ждёт lock1 — оба зависают навсегда (circular wait, циклическое ожидание). На практике часто встречается в сценарии "перевод денег между двумя счетами", если блокировать счета в порядке параметров метода, а не в едином порядке (например, по id).',
    explainBrief: [
      '4 классических условия deadlock: взаимное исключение, удержание-и-ожидание (hold and wait), отсутствие вытеснения (no preemption), циклическое ожидание (circular wait) — на практике борются именно с последним условием.',
      'Практический пример: transfer(accountA, accountB) блокирует сначала from, потом to; параллельный transfer(accountB, accountA) блокирует в обратном порядке — классический deadlock на двух locks.',
      'Профилактика — единый порядок захвата блокировок (например, всегда сначала счёт с меньшим id) — это убирает циклическое ожидание.',
      'ReentrantLock.tryLock(timeout) — альтернативная защита: не ждать вечно, откатиться и повторить при неудаче вместо бесконечного ожидания.',
      'Deadlock detection на проде — thread dump (jstack) покажет "Found one Java-level deadlock" с указанием потоков и locks.',
      'Livelock — похожая, но другая проблема: потоки не заблокированы, а активно "уступают" друг другу и не продвигаются к результату — тоже вечное зависание, но CPU не простаивает.',
    ],
    questionPlan: [
      {
        question: 'Назовите условие, без которого deadlock невозможен.',
        answerHint: 'Циклическое ожидание (circular wait) — если убрать его единым порядком захвата locks, deadlock из двух locks не случится.',
      },
      {
        question: 'Как на практике избежать deadlock в примере с переводом денег?',
        answerHint: 'Всегда захватывать locks в одном порядке (например, по возрастанию id счёта), а не в порядке параметров вызова.',
      },
      {
        question: 'Как найти deadlock на проде, если приложение зависло?',
        answerHint: 'Снять thread dump (jstack/jcmd) — он явно покажет "Found Java-level deadlock" с цепочкой потоков и locks.',
      },
      {
        question: 'Чем livelock отличается от deadlock?',
        answerHint:
          'В deadlock потоки заблокированы и не выполняются; в livelock потоки активны (используют CPU), но постоянно уступают друг другу и не продвигаются к результату.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен привести конкретный пример, а не только определение "когда потоки блокируют друг друга".',
      'Единый порядок захвата ресурсов — самое дешёвое решение на практике.',
      'Deadlock — логическая ошибка приложения; JVM его не предотвращает сама.',
    ],
    goodAnswer:
      'Формулирует через циклическое ожидание, даёт конкретный пример (перевод между счетами/два lock в разном порядке), знает про единый порядок захвата как профилактику и про thread dump как способ диагностики.',
    redFlag: 'Определение без примера ("это когда потоки блокируют друг друга"); не знает, как диагностировать на проде; путает deadlock с обычным долгим ожиданием lock.',
    glossary: [
      { term: 'deadlock', meaning: 'Взаимная блокировка потоков через циклическое ожидание ресурсов.' },
      { term: 'circular wait', meaning: 'Циклическое ожидание — условие, без которого deadlock невозможен.' },
      { term: 'livelock', meaning: 'Потоки активны, но постоянно уступают друг другу и не продвигаются к результату.' },
      { term: 'thread dump', meaning: 'Снимок состояния всех потоков JVM в конкретный момент времени.' },
      { term: 'jstack', meaning: 'Утилита JDK для снятия thread dump у работающего процесса.' },
    ],
    codeExample: {
      title: 'Deadlock на двух locks и его исправление',
      language: 'java',
      snippet: `// deadlock: разный порядок захвата
void transfer(Account from, Account to, int amount) {
  synchronized (from) {
    synchronized (to) { from.debit(amount); to.credit(amount); }
  }
}
// transfer(A, B, 10) и transfer(B, A, 5) параллельно -> deadlock

// fix: единый порядок по id счёта
void transferSafe(Account a, Account b, int amount) {
  Account first = a.getId() < b.getId() ? a : b;
  Account second = a.getId() < b.getId() ? b : a;
  synchronized (first) { synchronized (second) { /* ... */ } }
}`,
      walkthrough: [
        'В transfer порядок блокировки зависит от порядка аргументов — при встречных вызовах возникает circular wait.',
        'transferSafe всегда блокирует счета в одном и том же порядке (по id) независимо от порядка аргументов.',
      ],
      commonPitfall:
        'Блокировать ресурсы в порядке, в котором они пришли как параметры метода, а не в независимом от вызова порядке (например, по id) — источник большинства deadlock на проде.',
      productionNote: 'При зависании прод-сервиса — первым делом thread dump (jstack <pid> или actuator /threaddump), а не рестарт: рестарт скрывает причину, deadlock повторится.',
    },
    lecturerNotes: [
      'Обязательно попросить пример из практики — определение без примера не засчитывать как полный ответ.',
      'Не уходить в формальные 4 условия Коффмана подробно — для intern достаточно упомянуть circular wait как ключевое.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-09': {
    simpleDefinition:
      '@Async — аннотация Spring, которая заставляет вызов метода выполняться в отдельном потоке из пула, а не в потоке вызывающего кода; работает через AOP-прокси, как и @Transactional.',
    quickAnswer:
      'Нужно включить асинхронную обработку через @EnableAsync и пометить метод @Async; вызов идёт через Spring proxy — метод должен вызываться извне бина (self-invocation не сработает, как и у @Transactional). Метод, возвращающий значение, должен возвращать CompletableFuture<T> (или Future<T>), иначе результат теряется. Настройка пула (Executor) напрямую влияет на throughput, latency, память и поведение при перегрузке (rejection policy).',
    explainBrief: [
      '@EnableAsync на конфигурации плюс @Async на методе — Spring оборачивает бин в proxy, метод выполняется асинхронно в отдельном потоке пула.',
      'Self-invocation не работает: вызов this.asyncMethod() внутри того же бина идёт мимо proxy — выполнится синхронно, как обычный метод.',
      'Метод void — "выстрелил и забыл" (fire-and-forget); исключения внутри теряются, если не настроить AsyncUncaughtExceptionHandler.',
      'Метод с результатом должен возвращать CompletableFuture<T>/Future<T> — иначе вызывающий код не сможет получить результат или узнать об ошибке.',
      'Пул потоков (ThreadPoolTaskExecutor) настраивается явно: corePoolSize, maxPoolSize, queueCapacity — иначе Spring по умолчанию может использовать SimpleAsyncTaskExecutor, который создаёт новый поток на каждый вызов.',
      'Параметры пула напрямую влияют на поведение: маленький corePoolSize плюс большая очередь — задачи копятся в queue (растёт latency, но не падает); маленькая очередь плюс маленький maxPoolSize — задачи начинают reject-иться (RejectedExecutionException) при перегрузке.',
      'Rejection policy (AbortPolicy/CallerRunsPolicy/DiscardPolicy) определяет, что происходит, когда пул и очередь переполнены — это осознанный выбор trade-off, а не деталь "по умолчанию сработает само".',
    ],
    questionPlan: [
      {
        question: 'Что произойдёт, если вызвать @Async-метод из другого метода того же класса напрямую (this.method())?',
        answerHint: 'Сработает синхронно — self-invocation обходит Spring proxy, как и у @Transactional.',
      },
      {
        question: 'Что нужно вернуть из @Async-метода, чтобы получить результат?',
        answerHint: 'CompletableFuture<T> (или Future<T>); void-метод — fire-and-forget, результат и исключение потеряются без специального обработчика.',
      },
      {
        question: 'Что будет, если не настроить свой Executor для @Async?',
        answerHint: 'Spring может использовать SimpleAsyncTaskExecutor — новый поток на каждый вызов, без переиспользования и лимита, риск исчерпания ресурсов под нагрузкой.',
      },
      {
        question: 'Как параметры пула влияют на поведение под нагрузкой?',
        answerHint: 'Маленький пул плюс большая очередь — растёт latency, задачи ждут; маленькая очередь — RejectedExecutionException при пиках.',
      },
    ],
    extraKeyPoints: [
      '@Async без явно настроенного ThreadPoolTaskExecutor — частый источник проблем на проде (неограниченный рост потоков).',
      'Self-invocation — тот же класс ошибок, что и у @Transactional (proxy-based AOP не видит внутренние вызовы).',
      'Обработка ошибок void-метода требует отдельного AsyncUncaughtExceptionHandler — иначе exception теряется или уходит в лог по умолчанию.',
    ],
    goodAnswer:
      'Знает про proxy и self-invocation, называет правильный тип возврата для получения результата, явно указывает, что пул нужно настраивать вручную, и что параметры пула влияют на latency/rejection/память.',
    redFlag:
      'Не знает про proxy-ограничение; думает, что @Async "просто ускоряет" метод без последствий для пула; не видит связи между размером очереди и поведением под нагрузкой.',
    glossary: [
      { term: '@Async', meaning: 'Аннотация Spring для асинхронного выполнения метода в отдельном потоке пула.' },
      { term: '@EnableAsync', meaning: 'Включает поддержку асинхронной обработки в конфигурации Spring.' },
      { term: 'self-invocation', meaning: 'Вызов метода бина через this, обходящий Spring proxy.' },
      { term: 'ThreadPoolTaskExecutor', meaning: 'Настраиваемый пул потоков Spring для @Async/задач.' },
      { term: 'RejectedExecutionException', meaning: 'Исключение при переполнении пула и очереди задач.' },
      { term: 'AsyncUncaughtExceptionHandler', meaning: 'Обработчик необработанных исключений void-методов с @Async.' },
    ],
    codeExample: {
      title: '@Async с явным Executor и CompletableFuture',
      language: 'java',
      snippet: `@Configuration
@EnableAsync
class AsyncConfig {
  @Bean(name = "reportExecutor")
  Executor reportExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(4);
    executor.setMaxPoolSize(8);
    executor.setQueueCapacity(100);
    executor.initialize();
    return executor;
  }
}

@Async("reportExecutor")
CompletableFuture<Report> buildReport(Long id) {
  return CompletableFuture.completedFuture(reportService.build(id));
}`,
      walkthrough: [
        'Именованный Executor "reportExecutor" явно ограничивает пул и очередь под конкретный сценарий.',
        'CompletableFuture<Report> позволяет вызывающему коду дождаться результата и обработать ошибку.',
      ],
      commonPitfall: 'void-метод с @Async, кидающий исключение внутри, — оно нигде не всплывёт в вызывающем коде, если не настроен AsyncUncaughtExceptionHandler.',
      productionNote:
        'Всегда конфигурировать отдельный именованный ThreadPoolTaskExecutor под @Async с явными corePoolSize/maxPoolSize/queueCapacity и мониторить очередь — иначе под нагрузкой либо неограниченный рост потоков, либо тихие reject.',
    },
    lecturerNotes: [
      'Дожать self-invocation тем же вопросом, что и для @Transactional — механизм идентичный, кандидат должен сам это связать.',
      'Не уходить в детальную математику размера пула (формулы Little\'s law) — для intern достаточно понимания trade-off.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-10': {
    simpleDefinition:
      'Spring Framework — ядро (IoC-контейнер, DI, AOP) и набор модулей (MVC, Data, Security и т.д.), которые нужно самому собирать и настраивать. Spring Boot — надстройка над Spring Framework: auto-configuration, стартеры (starters) с готовыми зависимостями, embedded-сервер и actuator "из коробки".',
    quickAnswer:
      'Spring Framework даёт IoC/DI/AOP и модули, но конфигурацию (версии зависимостей, сервер приложений) нужно собирать вручную. Spring Boot добавляет auto-configuration (сам настраивает бины по classpath и свойствам), starters (готовые наборы зависимостей, например spring-boot-starter-web), embedded server (Tomcat/Netty внутри jar, не нужен отдельный сервер приложений) и actuator (готовые эндпоинты для health/metrics).',
    explainBrief: [
      'Spring Framework — IoC-контейнер (ApplicationContext), DI, AOP, модули (MVC, Data, Security, Batch и т.д.); максимально гибкий, но конфигурация ручная.',
      'Spring Boot не заменяет Framework, а работает поверх него: тот же ApplicationContext и те же аннотации DI внутри.',
      'Auto-configuration — Spring Boot анализирует classpath (что подключено) и уже заданные свойства и сам создаёт разумные бины по умолчанию (например, DataSource, если есть JDBC-драйвер и настройки подключения).',
      'Starters — готовые Maven/Gradle-зависимости-агрегаторы (spring-boot-starter-web, -data-jpa, -security) с согласованными версиями библиотек.',
      'Embedded server — Tomcat/Jetty/Netty упакован внутри jar-файла приложения; не нужен отдельный WAR и внешний сервер приложений.',
      'Actuator — готовые production-эндпоинты (/actuator/health, /actuator/metrics) без ручной реализации health-check с нуля.',
      'Auto-configuration можно переопределить своим бином (Spring Boot отступает, если бин уже определён явно) — это conditional-механизм (@ConditionalOnMissingBean и подобные).',
    ],
    questionPlan: [
      {
        question: 'Можно ли использовать Spring без Spring Boot?',
        answerHint: 'Да, это был стандартный способ до Boot — ручной Java Config, отдельный сервер приложений, самостоятельное согласование версий зависимостей.',
      },
      {
        question: 'Что делает auto-configuration технически?',
        answerHint: 'Анализирует classpath и properties, создаёт бины по условиям (@Conditional*), отступает, если разработчик уже определил свой бин того же типа.',
      },
      {
        question: 'Зачем нужен embedded server?',
        answerHint: 'Приложение — самостоятельный исполняемый jar (java -jar app.jar), не нужен внешний Tomcat и деплой WAR — проще CI/CD и контейнеризация.',
      },
      {
        question: 'Что даёт actuator, чего нет в голом Spring Framework?',
        answerHint: 'Готовые эндпоинты health/metrics/info без написания своего кода — легко подключить к мониторингу или liveness/readiness в Kubernetes.',
      },
    ],
    extraKeyPoints: [
      'Spring Boot равно Spring Framework плюс автоконфигурация плюс стартеры плюс embedded server плюс actuator, а не отдельный фреймворк.',
      'Auto-configuration не "магия без контроля" — всегда можно посмотреть, какие условия сработали (--debug, actuator conditions report).',
      'Starters решают проблему согласования версий (dependency hell) внутри одной экосистемы Spring.',
    ],
    goodAnswer:
      'Чётко разводит "ядро/модули" (Framework) и "автоматизация настройки поверх него" (Boot), приводит минимум 2 конкретных механизма Boot (auto-configuration + starters или embedded server), знает, что Boot не отдельная технология DI.',
    redFlag:
      '"Spring Boot — это Spring, но проще" без конкретики; считает, что Boot — это отдельный контейнер DI; не может назвать ни одного механизма (auto-configuration/starters/actuator).',
    glossary: [
      { term: 'Spring Framework', meaning: 'Ядро IoC/DI/AOP и набор модулей Spring.' },
      { term: 'Spring Boot', meaning: 'Надстройка над Spring Framework: auto-configuration, starters, embedded server, actuator.' },
      { term: 'IoC', meaning: 'Inversion of Control — управление созданием объектов передано контейнеру, а не коду вручную.' },
      { term: 'auto-configuration', meaning: 'Автоматическое создание бинов Spring Boot на основе classpath и properties.' },
      { term: 'starter', meaning: 'Готовый набор согласованных зависимостей Spring Boot под конкретную задачу.' },
      { term: 'embedded server', meaning: 'Сервер приложений (Tomcat/Netty), упакованный внутри jar-файла.' },
      { term: 'actuator', meaning: 'Модуль Spring Boot с готовыми production-эндпоинтами health/metrics/info.' },
    ],
    codeExample: {
      title: 'Минимальный Spring Boot стартер',
      language: 'text',
      snippet: `<!-- pom.xml -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

# application.properties
server.port=8080
management.endpoints.web.exposure.include=health,info

# запуск: java -jar app.jar -- embedded Tomcat уже внутри jar`,
      walkthrough: [
        'starter-web автоматически подтягивает Tomcat, Spring MVC, Jackson согласованных версий.',
        'management.endpoints.web.exposure.include явно ограничивает, какие actuator-эндпоинты доступны наружу.',
      ],
      commonPitfall: 'Думать, что Spring Boot и Spring Framework — конкурирующие технологии, а не "фреймворк плюс автоматизация поверх него".',
      productionNote:
        'Actuator по умолчанию может раскрывать чувствительную информацию — на проде явно ограничивать exposed эндпоинты и закрывать их аутентификацией/сетевым периметром.',
    },
    lecturerNotes: [
      'Быстрая оценка: назвал auto-configuration + хотя бы ещё один механизм (starters/embedded server/actuator) — зачёт.',
      'Не уходить в подробный разбор @Conditional-аннотаций — это тема для отдельного глубокого интервью, не intern-уровня.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-11': {
    simpleDefinition:
      'Жизненный цикл бина — последовательность шагов, через которые Spring проводит каждый управляемый объект: от чтения его описания (BeanDefinition) до создания, внедрения зависимостей, инициализации, использования и, в конце, уничтожения.',
    quickAnswer:
      'Упрощённая цепочка: definition (Spring читает описание бина) → instantiate (вызов конструктора) → dependency injection (внедряются зависимости) → BeanPostProcessor-ы (до и после инициализации, например здесь работает AOP-проксирование) → init (@PostConstruct/afterPropertiesSet/init-method) → бин готов к использованию → destroy (@PreDestroy/destroy-method) при остановке контекста. Для DI: @Component/@Service/@Repository/@Controller (или @RestController) — стереотипы, помечающие класс как бин; @Configuration плюс @Bean — для ручного создания бина в конфигурации; @Autowired — внедрение зависимости, при этом конструктор считается предпочтительным способом.',
    explainBrief: [
      'BeanDefinition — метаданные о бине (класс, scope, зависимости) ещё до создания самого объекта; из них Spring строит граф зависимостей.',
      'Порядок: instantiate → populate dependencies (DI) → BeanPostProcessor.postProcessBeforeInitialization → init callbacks (@PostConstruct, InitializingBean.afterPropertiesSet, init-method) → postProcessAfterInitialization → бин готов → на shutdown: @PreDestroy/DisposableBean.destroy/destroy-method.',
      'BeanPostProcessor — расширяемая точка, через которую, например, реализованы @Transactional и @Async: прокси оборачивают бин именно на этом шаге.',
      'Constructor injection — предпочтительный способ DI по умолчанию: делает зависимости обязательными и видимыми в сигнатуре, позволяет делать поля final, упрощает unit-тесты.',
      'Field injection (@Autowired на поле) работает, но усложняет тестирование без контейнера и скрывает обязательные зависимости.',
      'Стереотипы @Component/@Service/@Repository/@Controller (@RestController) семантически похожи (все — @Component), но @Repository добавляет трансляцию исключений доступа к данным, @Controller/@RestController — для web-слоя.',
      '@Configuration плюс @Bean — способ явно создать бин (например, для сторонней библиотеки, которую нельзя пометить @Component), в отличие от компонентного сканирования.',
    ],
    questionPlan: [
      {
        question: 'Что происходит раньше: внедрение зависимостей или @PostConstruct?',
        answerHint: 'Сначала DI (зависимости уже проставлены), потом @PostConstruct — поэтому в @PostConstruct безопасно использовать внедрённые поля.',
      },
      {
        question: 'Почему constructor injection считается предпочтительным?',
        answerHint: 'Обязательные зависимости видны в сигнатуре, поля можно сделать final, проще тестировать без контейнера (new Service(mockRepo)).',
      },
      {
        question: 'Чем @Repository отличается от простого @Component?',
        answerHint: 'Семантически то же самое плюс Spring транслирует специфичные исключения доступа к данным в общую иерархию DataAccessException.',
      },
      {
        question: 'Когда использовать @Bean в @Configuration вместо @Component?',
        answerHint: 'Когда класс сторонний (нельзя добавить аннотацию в исходники) или нужно явно настроить создание объекта с параметрами/условиями.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен назвать минимум 4 шага жизненного цикла в правильном порядке, не просто "Spring создаёт бины".',
      'BeanPostProcessor — ключевое понятие для понимания, откуда берётся AOP-прокси у @Transactional/@Async бинов.',
      'Constructor injection как default — не просто стиль, а осознанный выбор с конкретными преимуществами.',
    ],
    goodAnswer:
      'Называет минимум 4 шага жизненного цикла в правильном порядке, знает про BeanPostProcessor как точку расширения, объясняет предпочтение constructor injection конкретными преимуществами, а не "так принято".',
    redFlag:
      '"Spring сам создаёт бины и всё" без деталей порядка; не знает про @PostConstruct/@PreDestroy; использует field injection и не может объяснить, почему constructor injection считается лучше.',
    glossary: [
      { term: 'BeanDefinition', meaning: 'Метаданные о бине (класс, scope, зависимости) до его создания.' },
      { term: 'ApplicationContext', meaning: 'Контейнер Spring, управляющий бинами и их жизненным циклом.' },
      { term: 'BeanPostProcessor', meaning: 'Точка расширения жизненного цикла бина до/после инициализации.' },
      { term: '@PostConstruct / @PreDestroy', meaning: 'Хуки инициализации и завершения жизни бина.' },
      { term: '@Autowired', meaning: 'Аннотация внедрения зависимости Spring.' },
      { term: '@Component / @Repository / @Configuration / @Bean', meaning: 'Стереотипы и способы регистрации бинов в контексте Spring.' },
      { term: 'DataAccessException', meaning: 'Общая иерархия исключений доступа к данным, в которую Spring транслирует специфичные ошибки.' },
    ],
    codeExample: {
      title: 'Constructor injection + @PostConstruct/@PreDestroy',
      language: 'java',
      snippet: `@Service
class ReportService {
  private final ReportRepository repository;

  ReportService(ReportRepository repository) { // constructor injection
    this.repository = repository;
  }

  @PostConstruct
  void warmUpCache() { repository.preload(); } // зависимости уже внедрены

  @PreDestroy
  void releaseResources() { repository.flush(); }
}`,
      walkthrough: [
        'repository внедрён через конструктор — поле final, обязательность зависимости видна в сигнатуре.',
        '@PostConstruct вызывается уже после DI — можно безопасно использовать repository.',
      ],
      commonPitfall:
        'Field injection (@Autowired на поле) вместо конструктора — тесты вынуждены поднимать контекст Spring или использовать reflection вместо простого new Service(mock).',
      productionNote:
        '@PreDestroy — место для аккуратного graceful shutdown (закрыть соединения, дождаться текущих задач), особенно важно при остановке пода в Kubernetes с ограниченным terminationGracePeriod.',
    },
    lecturerNotes: [
      'Быстрая проверка: попросить перечислить порядок шагов вслух — путаница местами DI и init callbacks — красный флаг.',
      'Не читать лекцию про все возможные Aware-интерфейсы (BeanNameAware и т.д.) — для intern это избыточно.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-12': {
    simpleDefinition:
      '@Transactional — аннотация, которая просит Spring обернуть вызов метода в транзакцию базы данных через AOP-прокси: он открывает транзакцию перед вызовом и делает commit или rollback после.',
    quickAnswer:
      '@Transactional работает через proxy (JDK dynamic proxy для интерфейсов, CGLIB-подкласс для классов) — TransactionInterceptor вокруг реального вызова. Self-invocation (вызов метода того же бина через this) обходит proxy — транзакция не начнётся. Propagation — как метод ведёт себя относительно уже существующей транзакции (REQUIRED — использовать текущую или создать новую; REQUIRES_NEW — приостановить текущую и открыть независимую; NESTED — savepoint внутри той же транзакции). Isolation — насколько транзакция видит изменения других параллельных транзакций — определяет защиту от аномалий чтения ценой производительности.',
    explainBrief: [
      '@Transactional реализован как AOP advice: TransactionInterceptor открывает транзакцию до вызова метода, делает commit при успехе и rollback при (по умолчанию) unchecked-исключении.',
      'Proxy-based — значит, что вызов метода извне бина проходит через proxy; вызов this.method() внутри того же класса (self-invocation) идёт мимо proxy — аннотация фактически не сработает.',
      'final class/final method мешает CGLIB создать подкласс-proxy — с классами (не интерфейсами) final ломает @Transactional.',
      'Propagation REQUIRED (по умолчанию) — если транзакция уже есть, использовать её; если нет — создать новую.',
      'Propagation REQUIRES_NEW — приостановить текущую транзакцию и открыть полностью независимую (например, для аудит-лога, который должен закоммититься даже если основная операция откатится).',
      'Propagation NESTED — savepoint внутри той же транзакции; rollback откатывает только до savepoint, но требует поддержки savepoint на уровне JDBC-драйвера/БД.',
      'Isolation по умолчанию в Spring зависит от БД (в PostgreSQL — READ_COMMITTED); выбор уровня — компромисс между корректностью и конкуренцией.',
    ],
    questionPlan: [
      {
        question: 'Что произойдёт, если вызвать @Transactional-метод через this внутри того же класса?',
        answerHint: 'Транзакция не откроется — self-invocation обходит proxy, метод выполнится как обычный вызов без advice.',
      },
      {
        question: 'В чём разница REQUIRED и REQUIRES_NEW?',
        answerHint:
          'REQUIRED переиспользует текущую транзакцию (или создаёт, если её нет); REQUIRES_NEW всегда приостанавливает текущую и создаёт независимую, чей commit/rollback не зависит от внешней.',
      },
      {
        question: 'Когда используете NESTED вместо REQUIRES_NEW?',
        answerHint: 'Когда нужен частичный откат внутри одной транзакции (savepoint), а не полностью независимая, закоммиченная отдельно от внешней.',
      },
      {
        question: 'Почему final class может сломать @Transactional?',
        answerHint:
          'Spring по умолчанию для классов (не интерфейсов) использует CGLIB-подкласс как proxy; final класс/метод нельзя переопределить в подклассе — proxy не создастся или advice не сработает.',
      },
    ],
    extraKeyPoints: [
      'Self-invocation — самая частая практическая ловушка на собеседовании по @Transactional.',
      'По умолчанию rollback происходит на unchecked exception; checked exception не откатывает транзакцию, если явно не указать rollbackFor.',
      'Isolation — не абстрактная теория: нужно знать хотя бы READ_COMMITTED и то, что более строгий уровень снижает конкурентность.',
    ],
    goodAnswer:
      'Явно объясняет proxy-механизм и self-invocation, различает минимум 2 значения propagation с конкретным примером использования, знает про rollback по умолчанию только для unchecked exception.',
    redFlag:
      '"Аннотация просто работает всегда"; не знает про self-invocation; путает propagation и isolation между собой; думает, что checked exception тоже откатывает транзакцию по умолчанию.',
    glossary: [
      { term: '@Transactional', meaning: 'Аннотация Spring для декларативного управления транзакцией через AOP-прокси.' },
      { term: 'proxy', meaning: 'Объект-обёртка, добавляющий поведение (например, транзакцию) вокруг реального вызова.' },
      { term: 'JDK dynamic proxy / CGLIB', meaning: 'Два способа Spring создать proxy: через интерфейс или через подкласс.' },
      { term: 'self-invocation', meaning: 'Вызов метода бина через this, обходящий Spring proxy.' },
      { term: 'propagation', meaning: 'Поведение метода относительно уже существующей транзакции.' },
      { term: 'isolation', meaning: 'Уровень видимости изменений других параллельных транзакций.' },
      { term: 'savepoint', meaning: 'Промежуточная точка внутри транзакции для частичного отката (NESTED).' },
      { term: 'rollbackFor', meaning: 'Атрибут @Transactional, явно указывающий исключения, откатывающие транзакцию.' },
    ],
    codeExample: {
      title: 'Self-invocation ломает @Transactional',
      language: 'java',
      snippet: `@Service
class OrderService {
  void process(Order order) {
    // ...
    this.updateStatus(order); // self-invocation: proxy не сработает, транзакции нет
  }

  @Transactional
  void updateStatus(Order order) { repository.save(order); }
}

// fix: вызывать через отдельный бин или через self-инъекцию AopContext/прокси`,
      walkthrough: [
        'this.updateStatus(order) — прямой вызов метода того же объекта, минуя Spring proxy.',
        '@Transactional на updateStatus фактически не применяется в этом сценарии вызова.',
      ],
      commonPitfall:
        'orderService.updateStatus() вызванный как this.updateStatus() изнутри другого метода того же бина — транзакция тихо не открывается, баг находят только на проде под нагрузкой.',
      productionNote:
        'REQUIRES_NEW в цикле по списку элементов — это N независимых транзакций и N connection checkout из пула; при большом списке легко исчерпать пул соединений (HikariCP).',
    },
    lecturerNotes: [
      'Обязательно дожать self-invocation вопросом с конкретным кодом — это главный практический маркер понимания темы.',
      'Не читать полную лекцию про все 7 значений propagation — достаточно REQUIRED/REQUIRES_NEW/NESTED для intern-уровня.',
    ],
    estimatedMinutes: 3,
  },

  'int-intern-13': {
    simpleDefinition:
      'N+1 — ситуация, когда для загрузки списка из N сущностей и их связанных данных Hibernate делает 1 запрос на сам список плюс ещё N отдельных запросов (по одному на каждую сущность) для подгрузки связи, вместо одного объединённого запроса.',
    quickAnswer:
      'Причина — lazy-связь (например, order.getItems()), к которой обращаются в цикле по списку: 1 запрос достаёт N заказов, потом при обращении к items каждого заказа Hibernate делает отдельный SELECT — итого 1+N запросов вместо одного. Решения: fetch join в JPQL (JOIN FETCH), @EntityGraph, batch size (hibernate.default_batch_fetch_size — объединяет догрузку по нескольким id за один IN-запрос), или отдельный DTO-запрос сразу с нужными полями.',
    explainBrief: [
      'Симптом виден в SQL-логах: один SELECT для списка плюс повторяющийся однотипный SELECT ... WHERE order_id = ? на каждую запись в цикле.',
      'Fetch join (JOIN FETCH в JPQL) грузит родителя и связь одним SQL-запросом с JOIN; осторожно с несколькими коллекциями сразу — декартово произведение строк.',
      '@EntityGraph — декларативный способ указать, какие связи подгрузить сразу для конкретного запроса, не трогая FetchType на самой сущности.',
      'Batch size (@BatchSize или hibernate.default_batch_fetch_size) не убирает N+1 полностью, но объединяет N отдельных запросов в несколько через WHERE id IN (...).',
      'DTO-проекция (например, Spring Data Projection или конструктор в JPQL) вообще не грузит лишние сущности и связи, если нужны только конкретные поля.',
      'Частая ошибка — "лечить" N+1, вешая @Transactional на весь контроллер и делая FetchType.EAGER на всех связях: это переносит проблему, а не решает.',
      'Обнаружение — включить show-sql/format_sql и статистику Hibernate (hibernate.generate_statistics): считать количество запросов на один HTTP-запрос.',
    ],
    questionPlan: [
      {
        question: 'Как заметить N+1 в логах?',
        answerHint: 'Один SELECT списка плюс N одинаковых по форме SELECT с разными id связи подряд после него.',
      },
      {
        question: 'Чем fetch join отличается от @EntityGraph?',
        answerHint:
          'Оба грузят связь одним запросом; fetch join — часть JPQL-запроса вручную, @EntityGraph — декларативная аннотация без изменения самого JPQL, удобнее переиспользовать.',
      },
      {
        question: 'Почему EAGER на всех связях — не решение?',
        answerHint:
          'EAGER грузит связь всегда, даже когда она не нужна — переносит лишнюю нагрузку в каждый запрос вместо конкретного проблемного места, и может каскадно тянуть цепочку связей.',
      },
      {
        question: 'Как batch size помогает, если он не убирает лишние запросы полностью?',
        answerHint: 'Объединяет догрузку нескольких id одной связи в один SQL с IN (...) вместо отдельного запроса на каждый.',
      },
    ],
    extraKeyPoints: [
      'Правильный ответ обязательно включает конкретный SQL-признак N+1, а не только словесное определение.',
      'Кандидат должен назвать минимум 2 реальных решения (fetch join/EntityGraph/batch size/DTO), не только "включить кэш".',
      'EAGER "решает" N+1 ценой избыточной загрузки данных везде — это trade-off, а не бесплатное решение.',
    ],
    goodAnswer:
      'Описывает механизм (1 + N SELECT), называет 2-3 решения с их различиями и оговорками (fetch join против декартова произведения, batch size не убирает проблему полностью), явно называет EAGER-везде антипаттерном.',
    redFlag:
      '"N+1 — это когда много запросов" без объяснения механизма; единственное решение — "поставить EAGER"; не знает, как обнаружить проблему в логах/статистике.',
    glossary: [
      { term: 'N+1', meaning: '1 запрос на список плюс N отдельных запросов на связь каждой записи.' },
      { term: 'lazy loading', meaning: 'Подгрузка связи по факту первого обращения к ней.' },
      { term: 'fetch join / JOIN FETCH', meaning: 'JPQL-конструкция для загрузки связи одним SQL-запросом с JOIN.' },
      { term: '@EntityGraph', meaning: 'Декларативное указание связей для eager-загрузки в конкретном запросе.' },
      { term: 'batch size', meaning: 'Объединение догрузки нескольких id связи в один запрос с IN (...).' },
      { term: 'DTO-проекция', meaning: 'Запрос сразу нужных полей без загрузки лишних сущностей и связей.' },
      { term: 'Hibernate statistics', meaning: 'Встроенная статистика Hibernate: число запросов, cache hit/miss.' },
    ],
    codeExample: {
      title: 'N+1 в цикле и фикс через JOIN FETCH',
      language: 'text',
      snippet: `-- проблема: 1 SELECT списка + N SELECT на items
SELECT * FROM orders WHERE status = 'PAID'; -- 1 запрос, N заказов
-- в цикле по заказам: SELECT * FROM order_items WHERE order_id = ?; -- N раз

-- fetch join: один запрос вместо 1+N
SELECT o FROM Order o JOIN FETCH o.items WHERE o.status = 'PAID';`,
      walkthrough: [
        'Наивный цикл вызывает order.getItems() отдельно для каждого заказа — Hibernate делает отдельный SELECT на каждый вызов.',
        'JPQL с JOIN FETCH загружает заказы вместе с items одним SQL-запросом.',
      ],
      commonPitfall: 'JOIN FETCH сразу двух @OneToMany коллекций в одном запросе — декартово произведение строк (MultipleBagFetchException или просто раздутый результат).',
      productionNote: 'На каждый релиз стоит смотреть счётчик запросов Hibernate statistics на ключевых эндпоинтах — N+1 часто появляется незаметно после добавления нового поля в DTO.',
    },
    lecturerNotes: [
      'Обязательно попросить назвать SQL-признак (повторяющиеся однотипные запросы), не только определение словами.',
      'Дожать: "почему EAGER — не решение" — сильный кандидат сам приведёт пример каскадной загрузки.',
    ],
    estimatedMinutes: 3,
  },

  'int-intern-14': {
    simpleDefinition:
      'FetchType определяет, когда Hibernate подгружает связанные данные: LAZY — по факту первого обращения к связи (отложенно), EAGER — сразу вместе с самой сущностью, ещё до того, как связь реально понадобилась.',
    quickAnswer:
      'LAZY — разумный default практически для всех связей (в том числе для @ManyToOne, где стандартное значение по спецификации — EAGER, но на практике его обычно переопределяют на LAZY). EAGER оправдан очень редко: только для небольшой, почти всегда нужной связи, которая используется в подавляющем большинстве запросов к сущности. Обращение к LAZY-связи вне активной сессии/транзакции — LazyInitializationException.',
    explainBrief: [
      'По спецификации JPA default для @OneToMany/@ManyToMany — LAZY, а для @ManyToOne/@OneToOne — EAGER; на практике почти всегда явно ставят LAZY везде, чтобы не удивляться скрытым EAGER-подгрузкам.',
      'LazyInitializationException — попытка обратиться к LAZY-связи после закрытия Persistence Context (сессии); типичная причина — сущность "утекла" из @Transactional-метода в слой представления.',
      'OSIV (Open Session In View) — паттерн, держащий сессию открытой до рендеринга ответа, чтобы избежать LazyInitializationException, но ценой размазывания границы транзакции и риска скрытых N+1 прямо во время сериализации.',
      'Правильный способ работы с LAZY — грузить нужные связи явно внутри транзакции (fetch join/@EntityGraph) под конкретный сценарий использования, а не полагаться на случайно ещё открытую сессию.',
      'EAGER на @ManyToOne (например, Order.customer) может казаться безобидным, но каскадно тянет за собой EAGER-связи самого Customer, если они тоже EAGER — цепочка лишних JOIN на каждый запрос Order.',
      'Критерий выбора EAGER: связь маленькая, почти всегда нужна вместе с родителем, и явно понятна цена (один дополнительный JOIN, не цепочка).',
    ],
    questionPlan: [
      {
        question: 'Какой FetchType по умолчанию у @ManyToOne по спецификации и почему на практике его обычно меняют?',
        answerHint: 'EAGER по умолчанию; на практике меняют на LAZY, чтобы не получать неожиданные каскадные JOIN и контролировать загрузку явно.',
      },
      {
        question: 'Когда возникает LazyInitializationException и как его избежать правильно?',
        answerHint: 'При обращении к LAZY-связи вне открытой сессии/транзакции; правильно — явно подгрузить нужное внутри @Transactional-метода, а не расширять сессию до слоя представления.',
      },
      {
        question: 'Что не так с OSIV как "универсальным решением"?',
        answerHint: 'Скрывает проблему, размазывает границу транзакции до рендеринга ответа, может провоцировать N+1 прямо в момент сериализации.',
      },
      {
        question: 'Приведите пример, когда EAGER оправдан.',
        answerHint: 'Маленькая почти всегда нужная связь без цепочки дальнейших EAGER-связей, например справочник-статус, используемый в 95% случаев вместе с родителем.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен знать реальный default по спецификации, а не только "LAZY хорошо, EAGER плохо" без деталей.',
      'Понимание LazyInitializationException и правильного решения через явную загрузку внутри транзакции — обязательный критерий.',
      'Осторожное отношение к OSIV — плюс, если кандидат называет его trade-off, а не серебряной пулей.',
    ],
    goodAnswer:
      'Знает реальные default-значения по спецификации, объясняет LazyInitializationException и правильное решение через явную загрузку в транзакции, аргументированно объясняет, когда EAGER оправдан, а когда это скрытая проблема производительности.',
    redFlag:
      '"LAZY всегда, EAGER никогда" без объяснения default по спецификации; решает LazyInitializationException простым включением OSIV без понимания цены; не знает, что EAGER может каскадно тянуть связи.',
    glossary: [
      { term: 'FetchType', meaning: 'Стратегия загрузки связи сущности: LAZY или EAGER.' },
      { term: 'LazyInitializationException', meaning: 'Ошибка обращения к LAZY-связи после закрытия Persistence Context.' },
      { term: 'Persistence Context', meaning: 'Область отслеживания и кэширования сущностей в рамках сессии Hibernate.' },
      { term: 'OSIV', meaning: 'Open Session In View — паттерн, держащий сессию открытой до рендеринга ответа.' },
      { term: '@EntityGraph', meaning: 'Декларативное указание связей для загрузки в конкретном запросе.' },
    ],
    codeExample: {
      title: 'LAZY по умолчанию + явная загрузка через fetch join',
      language: 'java',
      snippet: `@Entity
class Order {
  @ManyToOne(fetch = FetchType.LAZY) // переопределили default EAGER
  private Customer customer;
}

@Query("SELECT o FROM Order o JOIN FETCH o.customer WHERE o.id = :id")
Optional<Order> findWithCustomer(@Param("id") Long id); // явная загрузка внутри транзакции`,
      walkthrough: [
        'fetch = FetchType.LAZY явно переопределяет default EAGER у @ManyToOne.',
        'findWithCustomer грузит нужную связь одним запросом там, где она реально используется.',
      ],
      commonPitfall:
        'Вернуть entity с LAZY-связью прямо в JSON-ответ контроллера без явной загрузки — либо LazyInitializationException, либо (при включённом OSIV) скрытый N+1 во время сериализации.',
      productionNote: 'spring.jpa.open-in-view=false в проде заставляет явно проектировать загрузку данных под каждый сценарий, вместо неявной зависимости от OSIV.',
    },
    lecturerNotes: [
      'Дожать конкретным default: многие говорят "LAZY везде по умолчанию", не зная, что @ManyToOne по спецификации EAGER.',
      'Не уходить в полный разбор всех типов Hibernate-кэшей — это отдельный вопрос про отладку.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-15': {
    simpleDefinition:
      'Отладка Hibernate — использование встроенных инструментов (логирование SQL, статистика запросов, кэши первого/второго уровня) для того, чтобы понять, какие реальные запросы уходят в базу и почему их больше или дороже, чем ожидалось.',
    quickAnswer:
      'show-sql/format_sql (или логирование org.hibernate.SQL на DEBUG) показывает точный текст SQL; отдельное логирование bind-параметров показывает значения вместо "?". hibernate.generate_statistics плюс StatisticsService считает количество запросов, hit/miss кэша второго уровня, время выполнения. EXPLAIN ANALYZE на стороне PostgreSQL — если проблема не "много запросов", а "один запрос медленный". Кэш первого уровня (Persistence Context) — в рамках одной сессии; кэш второго уровня (опционально) — между сессиями, требует явного включения и осторожности с инвалидацией.',
    explainBrief: [
      'spring.jpa.show-sql=true плюс format_sql=true — базовый способ увидеть SQL в логах при разработке; на проде обычно выключают или переводят в отдельный логгер с ограниченным уровнем.',
      'Логирование значений bind-параметров отдельно от show-sql — без него в логах видны только "?" вместо реальных значений.',
      'hibernate.generate_statistics=true включает счётчики: количество запросов, время, hit/miss кэша; полезно смотреть на конкретном сценарии, а не постоянно в проде из-за overhead.',
      'Persistence Context (кэш первого уровня) живёт в рамках одной сессии; повторный поиск той же сущности по id в той же транзакции не идёт в базу повторно (dirty checking тоже работает через него).',
      'Кэш второго уровня — общий между сессиями; ускоряет повторное чтение одних и тех же данных, но требует продуманной инвалидации, иначе можно читать устаревшие данные.',
      'EXPLAIN ANALYZE — когда проблема не "слишком много запросов" (N+1), а "один конкретный запрос выполняется долго": показывает реальный план выполнения и физическое время.',
      'APM/профилировщики (метрики JDBC, трейсинг медленных запросов) — production-способ увидеть медленные/частые запросы без ручного включения verbose-логирования на весь трафик.',
    ],
    questionPlan: [
      {
        question: 'Как включить логирование реального SQL с параметрами?',
        answerHint: 'show-sql/format_sql для текста запроса плюс отдельный логгер бинд-параметров для значений.',
      },
      {
        question: 'Зачем нужна статистика Hibernate, если уже есть SQL-логи?',
        answerHint: 'Агрегированные числа (сколько запросов, cache hit/miss) на весь сценарий — текстовые логи не дают быстрой картины по объёму.',
      },
      {
        question: 'Чем кэш первого уровня отличается от кэша второго уровня?',
        answerHint: 'Первый — в рамках одной сессии/транзакции, встроен всегда; второй — между сессиями, опционален, нужен явный провайдер и стратегия инвалидации.',
      },
      {
        question: 'Когда смотреть EXPLAIN ANALYZE вместо статистики Hibernate?',
        answerHint: 'Когда проблема не в количестве запросов (N+1), а в одном конкретном медленном запросе — статистика Hibernate не покажет план выполнения на стороне БД.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен различать "много запросов" (решается статистикой/логами) и "один медленный запрос" (решается EXPLAIN ANALYZE).',
      'Понимание разницы кэша первого и второго уровня — обязательный критерий, это частая путаница.',
      'На проде постоянный verbose SQL-лог — сам по себе риск (объём логов, утечка данных).',
    ],
    goodAnswer:
      'Называет минимум 3 инструмента (SQL-лог с параметрами, статистика, EXPLAIN ANALYZE) и правильно сопоставляет инструмент с типом проблемы, знает разницу L1/L2 кэша.',
    redFlag:
      'Знает только show-sql и не знает, что такое статистика Hibernate или разница L1/L2 кэша; включает verbose-логирование как единственный способ отладки на любую проблему, включая прод.',
    glossary: [
      { term: 'show-sql', meaning: 'Настройка Hibernate для вывода текста SQL-запросов в лог.' },
      { term: 'bind parameters', meaning: 'Реальные значения параметров SQL-запроса, отдельно логируемые от текста запроса.' },
      { term: 'Hibernate statistics', meaning: 'Встроенные счётчики Hibernate: число запросов, время, hit/miss кэша.' },
      { term: 'Persistence Context', meaning: 'Кэш первого уровня, область отслеживания сущностей в рамках сессии.' },
      { term: 'кэш второго уровня', meaning: 'Опциональный кэш между сессиями, требующий явного провайдера и инвалидации.' },
      { term: 'EXPLAIN ANALYZE', meaning: 'Команда PostgreSQL, реально выполняющая запрос и показывающая фактический план.' },
    ],
    codeExample: {
      title: 'Включение SQL-логов и статистики Hibernate',
      language: 'text',
      snippet: `# application.properties (только для разработки)
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.generate_statistics=true
logging.level.org.hibernate.orm.jdbc.bind=TRACE`,
      walkthrough: [
        'show-sql/format_sql показывает текст запроса читаемо.',
        'logging.level на bind — отдельная настройка именно для значений параметров, а не текста запроса.',
      ],
      commonPitfall: 'Включить show-sql на проде без ограничения по окружению/уровню — рост объёма логов и потенциальная утечка чувствительных данных из параметров запросов.',
      productionNote: 'На проде лучше точечные APM-инструменты (метрики JDBC, трейсинг медленных запросов) вместо постоянного verbose SQL-лога на весь трафик.',
    },
    lecturerNotes: [
      'Быстрая проверка: спросить "а что покажет EXPLAIN ANALYZE, чего не покажет статистика Hibernate" — разводит два разных типа проблем.',
      'Не углубляться в конкретных провайдеров кэша второго уровня (Ehcache/Caffeine) — для intern достаточно факта существования L1/L2.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-16': {
    simpleDefinition:
      'Запрос объединяет данные из нескольких таблиц (JOIN), группирует строки по одному или нескольким полям (GROUP BY) и считает агрегаты (SUM/COUNT/AVG) по каждой группе.',
    quickAnswer:
      'Пример: посчитать сумму и количество заказов по каждому клиенту через JOIN orders с customers, GROUP BY customer, с опциональным HAVING для фильтра по агрегату. WHERE фильтрует строки до группировки, HAVING — после, по результату агрегатной функции.',
    explainBrief: [
      'JOIN (обычно INNER JOIN) соединяет строки orders и customers по внешнему ключу customer_id = customers.id.',
      'GROUP BY группирует строки после JOIN по указанным столбцам — каждая группа схлопывается в одну строку результата.',
      'SUM(amount)/COUNT(*) считаются в рамках каждой группы отдельно, не по всей таблице сразу.',
      'Все столбцы в SELECT, которые не под агрегатной функцией, обязаны быть в GROUP BY — иначе PostgreSQL вернёт ошибку.',
      'WHERE применяется до группировки (фильтрует исходные строки, например по дате), HAVING — после группировки (фильтрует уже посчитанные агрегаты, например count(*) больше 10).',
      'COUNT(*) считает все строки группы; COUNT(column) — только не-NULL значения этого столбца — разница важна при LEFT JOIN с возможными NULL.',
    ],
    questionPlan: [
      {
        question: 'Почему нельзя просто добавить SELECT customer.name без GROUP BY при использовании SUM?',
        answerHint:
          'PostgreSQL требует, чтобы каждый non-aggregate столбец в SELECT либо был в GROUP BY, либо был функционально зависим от него — иначе неоднозначно, какое значение показать для группы из нескольких строк.',
      },
      {
        question: 'В чём разница WHERE и HAVING в этом запросе?',
        answerHint:
          'WHERE отфильтрует заказы, например только PAID, до группировки; HAVING отфильтрует уже готовые группы, например только клиентов с count(*) больше 10.',
      },
      {
        question: 'Почему COUNT(*) и COUNT(order.id) при LEFT JOIN могут дать разный результат?',
        answerHint: 'COUNT(*) считает саму строку результата (в том числе с NULL от LEFT JOIN); COUNT(order.id) — только строки, где order.id не NULL.',
      },
      {
        question: 'Как посчитать сумму только по заказам за последний месяц, а не за всё время?',
        answerHint: 'WHERE order.created_at >= (условие даты) до GROUP BY — агрегируется только нужный период, а не весь набор с последующей фильтрацией.',
      },
    ],
    extraKeyPoints: [
      'Кандидат обязан написать (или проговорить) реальный синтаксически корректный запрос, а не только описать словами.',
      'Явное понимание концептуального порядка выполнения: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.',
      'Разница COUNT(*) vs COUNT(column) — частая ловушка при LEFT JOIN.',
    ],
    goodAnswer:
      'Пишет корректный SQL с JOIN/GROUP BY/агрегатом, правильно объясняет разницу WHERE/HAVING на конкретном примере, знает разницу COUNT(*)/COUNT(column).',
    redFlag: 'Путает WHERE и HAVING местами; пытается фильтровать по агрегату через WHERE; не может написать синтаксически валидный запрос вообще.',
    glossary: [
      { term: 'JOIN', meaning: 'Соединение строк из нескольких таблиц по условию.' },
      { term: 'GROUP BY', meaning: 'Группировка строк по значениям указанных столбцов.' },
      { term: 'HAVING', meaning: 'Фильтр по результату агрегатной функции, применяется после группировки.' },
      { term: 'WHERE', meaning: 'Фильтр исходных строк до группировки.' },
      { term: 'агрегатная функция', meaning: 'Функция вроде SUM/COUNT/AVG, считающая значение по группе строк.' },
    ],
    codeExample: {
      title: 'JOIN + GROUP BY + HAVING по заказам клиентов',
      language: 'text',
      snippet: `SELECT c.id AS customer_id,
       c.name,
       COUNT(o.id) AS orders_count,
       SUM(o.amount) AS total_amount
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'PAID'
GROUP BY c.id, c.name
HAVING COUNT(o.id) > 10
ORDER BY total_amount DESC;`,
      walkthrough: [
        'WHERE отфильтровывает только оплаченные заказы до группировки.',
        'HAVING оставляет только клиентов с более чем 10 заказами — фильтр уже по результату COUNT.',
      ],
      commonPitfall: 'Пытаться отфильтровать по SUM(amount) больше 1000 через WHERE — WHERE выполняется до вычисления агрегатов, нужен HAVING.',
      productionNote: 'На больших таблицах агрегирующий запрос без индекса под WHERE/JOIN-условие — кандидат на Seq Scan; см. отдельный вопрос про EXPLAIN ANALYZE.',
    },
    lecturerNotes: [
      'Попросить написать запрос на бумаге/в чате, а не только рассказать словами — реальный синтаксис лучше выявляет пробелы.',
      'Не уходить в оконные функции (window functions) — это за пределами intern-уровня для этого вопроса.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-17': {
    simpleDefinition:
      'Индекс — отдельная структура данных (обычно B-Tree), которая хранит упорядоченные ссылки на строки таблицы по значению одного или нескольких столбцов, чтобы находить нужные строки быстрее, чем перебором всей таблицы.',
    quickAnswer:
      'По умолчанию в PostgreSQL — B-Tree, подходит для равенства, диапазонов и ORDER BY. Столбец под индекс выбирают по тому, что реально стоит в WHERE/JOIN/ORDER BY, и по селективности (много различных значений — хорошо, мало — индекс почти бесполезен). Составной индекс на несколько столбцов эффективен только с учётом порядка колонок — под самые частые условия сначала. Индекс не бесплатен: занимает место и замедляет INSERT/UPDATE/DELETE, потому что его тоже нужно обновлять.',
    explainBrief: [
      'B-Tree — тип индекса по умолчанию: равенство (=), диапазоны (>, <, BETWEEN), ORDER BY по индексируемому столбцу.',
      'Селективность — доля уникальных значений столбца; индекс на boolean-поле с 2 значениями почти бесполезен, планировщик чаще выберет Seq Scan.',
      'Столбцы под индекс выбирают по фактическим предикатам WHERE/JOIN и по тому, что участвует в ORDER BY часто выполняемых запросов.',
      'Составной индекс (a, b) эффективно используется для условий по a и по (a и b); для условий только по b (без a) этот индекс обычно не используется полностью — порядок колонок важен.',
      'Индекс небесплатен: занимает диск, и каждая INSERT/UPDATE/DELETE обязана обновить не только таблицу, но и все индексы на ней — это write overhead.',
      'Partial index (индекс только на подмножество строк) компактнее и быстрее под частый запрос с постоянным фильтром, например WHERE active = true.',
    ],
    questionPlan: [
      {
        question: 'Почему индекс не ставят "на всякий случай" на каждый столбец?',
        answerHint: 'Каждый индекс — дополнительная стоимость на запись (обновление всех индексов при INSERT/UPDATE/DELETE) и место на диске.',
      },
      {
        question: 'Что такое селективность и почему она важна?',
        answerHint: 'Доля уникальных значений; на низкоселективном столбце индекс часто не используется планировщиком, Seq Scan может быть дешевле.',
      },
      {
        question: 'Как порядок колонок в составном индексе влияет на его использование?',
        answerHint: 'Индекс (a, b) эффективен для запросов по a или по (a и b); для запроса только по b он, как правило, бесполезен.',
      },
      {
        question: 'Когда стоит сделать partial index?',
        answerHint: 'Когда часто фильтруют по условию, выделяющему небольшую долю таблицы (например, active = true из миллионов строк).',
      },
    ],
    extraKeyPoints: [
      'Правильный ответ явно связывает "какой индекс" с "как выглядит WHERE/JOIN/ORDER BY реального запроса".',
      'Кандидат должен явно назвать write overhead как цену индекса, а не только пользу для чтения.',
      'Composite index column order — критерий "знает слово, не понимает деталь".',
    ],
    goodAnswer:
      'Определяет индекс через структуру для быстрого поиска, называет критерий выбора (что в WHERE/JOIN/ORDER BY плюс селективность), явно говорит про write overhead и про порядок колонок в составном индексе.',
    redFlag: '"Индекс просто ускоряет всё" без упоминания цены записи; предлагает индексировать все столбцы; не знает про важность порядка колонок в composite индексе.',
    glossary: [
      { term: 'индекс', meaning: 'Структура данных для быстрого поиска строк по значению столбца.' },
      { term: 'B-Tree', meaning: 'Индекс по умолчанию в PostgreSQL: равенство, диапазоны, сортировка.' },
      { term: 'селективность', meaning: 'Доля уникальных значений столбца среди всех строк таблицы.' },
      { term: 'составной индекс', meaning: 'Индекс по нескольким столбцам, порядок которых важен для использования.' },
      { term: 'partial index', meaning: 'Индекс только на подмножество строк, удовлетворяющих условию.' },
      { term: 'write overhead', meaning: 'Дополнительная стоимость обновления индексов при изменении данных.' },
    ],
    codeExample: {
      title: 'Одиночный и составной индекс',
      language: 'text',
      snippet: `CREATE INDEX idx_orders_created ON orders (created_at); -- одиночный, диапазоны

-- составной: эффективен для WHERE customer_id = ? AND status = ?
-- и для WHERE customer_id = ?, но НЕ для WHERE status = ? без customer_id
CREATE INDEX idx_orders_customer_status ON orders (customer_id, status);

CREATE INDEX idx_orders_active ON orders (customer_id) WHERE status = 'ACTIVE'; -- partial`,
      walkthrough: [
        'idx_orders_customer_status полезен для запросов, начинающихся с customer_id.',
        'idx_orders_active — меньше по размеру, так как индексирует только активные заказы.',
      ],
      commonPitfall: 'Индекс на low-cardinality столбец (например, status с 3 значениями на миллион строк, где одно значение почти все строки) — планировщик всё равно выберет Seq Scan.',
      productionNote: 'После добавления индекса на прод — ANALYZE таблицы, чтобы планировщик обновил статистику и реально начал использовать новый индекс.',
    },
    lecturerNotes: [
      'Дожать вопросом про порядок колонок в составном индексе — частая ловушка "знает слово, не понимает деталь".',
      'Не уходить в детали внутреннего устройства B-Tree (страницы, высота дерева) — для intern это избыточно.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-18': {
    simpleDefinition:
      'EXPLAIN показывает план выполнения запроса (какие шаги и в каком порядке планировщик собирается сделать) с оценками. EXPLAIN ANALYZE реально выполняет запрос и добавляет фактические цифры (сколько строк, сколько времени) рядом с оценками планировщика.',
    quickAnswer:
      'EXPLAIN ANALYZE выполняет запрос по-настоящему (осторожно с INSERT/UPDATE/DELETE — эффект реально применится, если не в транзакции с ROLLBACK) и показывает по каждому узлу плана: estimated rows vs actual rows, cost, тип доступа (Seq Scan/Index Scan/Bitmap Index Scan), тип соединения (Nested Loop/Hash Join/Merge Join), и, с опцией BUFFERS, сколько блоков прочитано из кэша или диска. Главный сигнал проблемы — большое расхождение estimated vs actual rows (устаревшая статистика) и Seq Scan там, где ожидался Index Scan.',
    explainBrief: [
      'EXPLAIN — только план и оценки планировщика (cost, estimated rows), запрос не выполняется физически.',
      'EXPLAIN ANALYZE — запрос реально выполняется; появляются actual time и actual rows рядом с оценкой — можно сравнить прогноз с реальностью.',
      'Seq Scan — последовательное чтение всей таблицы; нормально для маленькой таблицы или когда выбирается большая доля строк; плохо на большой таблице с селективным фильтром без подходящего индекса.',
      'Index Scan/Index Only Scan — чтение через индекс (Index Only Scan — вообще без обращения к самой таблице, если все нужные столбцы есть в индексе).',
      'Nested Loop — для каждой строки внешнего набора отдельно ищется совпадение во внутреннем — ок для маленьких наборов, плохо при больших без индекса на условии соединения.',
      'Hash Join — строит хэш-таблицу по одной стороне соединения и сканирует другую — обычно эффективен для больших наборов без подходящего индекса под Nested Loop.',
      'BUFFERS (EXPLAIN (ANALYZE, BUFFERS)) показывает shared hit/read — сколько блоков нашлось в кэше PostgreSQL, а сколько реально читалось с диска.',
    ],
    questionPlan: [
      {
        question: 'Чем EXPLAIN отличается от EXPLAIN ANALYZE?',
        answerHint: 'EXPLAIN — только оценка плана без выполнения; EXPLAIN ANALYZE реально выполняет запрос и добавляет фактические rows/time.',
      },
      {
        question: 'На что в первую очередь смотреть в выводе EXPLAIN ANALYZE?',
        answerHint: 'На расхождение estimated vs actual rows (признак устаревшей статистики) и тип сканирования — Seq Scan там, где ожидался Index Scan.',
      },
      {
        question: 'Опасно ли делать EXPLAIN ANALYZE на UPDATE/DELETE в проде?',
        answerHint: 'Да, запрос выполняется по-настоящему и изменения применяются; безопасный способ — обернуть в транзакцию и сделать ROLLBACK после анализа.',
      },
      {
        question: 'Когда Seq Scan — это нормально, а не проблема?',
        answerHint: 'Маленькая таблица или запрос выбирает большую долю строк таблицы — тогда полное чтение дешевле, чем чтение через индекс плюс обращение к таблице по каждой строке.',
      },
    ],
    extraKeyPoints: [
      'Кандидат обязан явно сказать, что EXPLAIN ANALYZE реально выполняет запрос — частая "ловушка на понимание слова, а не факта".',
      'Умение читать конкретные узлы плана (Seq Scan/Index Scan/Nested Loop/Hash Join), а не просто "видел такое слово".',
      'Способность назвать сигнал проблемы (estimated vs actual rows) — критерий хорошего, а не просто среднего ответа.',
    ],
    goodAnswer:
      'Чётко объясняет разницу EXPLAIN/EXPLAIN ANALYZE, называет минимум 2 типа сканирования/соединения и их смысл, знает про опасность выполнения на изменяющих данные запросах и про признак проблемы (расхождение estimated/actual).',
    redFlag:
      'Считает EXPLAIN ANALYZE "просто более подробным EXPLAIN" без понимания, что он выполняет запрос; не может назвать ни одного типа сканирования кроме Seq Scan; не видит проблемы делать его на UPDATE в проде без транзакции.',
    glossary: [
      { term: 'EXPLAIN', meaning: 'Показывает план выполнения запроса без реального выполнения.' },
      { term: 'EXPLAIN ANALYZE', meaning: 'Реально выполняет запрос и добавляет фактические rows/time к плану.' },
      { term: 'Seq Scan', meaning: 'Последовательное чтение всей таблицы без индекса.' },
      { term: 'Index Scan / Index Only Scan', meaning: 'Чтение через индекс, во втором случае — без обращения к самой таблице.' },
      { term: 'Nested Loop', meaning: 'Соединение, перебирающее внутренний набор для каждой строки внешнего.' },
      { term: 'Hash Join', meaning: 'Соединение через построение хэш-таблицы по одной из сторон.' },
      { term: 'BUFFERS', meaning: 'Опция EXPLAIN, показывающая обращения к блокам кэша/диска.' },
    ],
    codeExample: {
      title: 'EXPLAIN ANALYZE: расхождение оценки и реальности',
      language: 'text',
      snippet: `EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE customer_id = 42;

-- Seq Scan on orders (cost=0.00..18334.00 rows=5 width=64)
--   (actual time=0.02..152.30 rows=5000 loops=1)
--   Filter: (customer_id = 42)
-- Planning Time: 0.15 ms
-- Execution Time: 152.40 ms
-- rows=5 (estimate) vs rows=5000 (actual) -> статистика устарела, нужен ANALYZE/индекс`,
      walkthrough: [
        'estimated rows=5, но actual rows=5000 — планировщик ошибся из-за устаревшей статистики.',
        'Seq Scan на большой таблице при таком расхождении — сигнал добавить/поправить индекс и сделать ANALYZE.',
      ],
      commonPitfall: 'Запустить EXPLAIN ANALYZE на тяжёлом UPDATE прямо на проде без BEGIN/ROLLBACK — изменения реально применятся.',
      productionNote: 'Регулярно (после больших миграций данных) проверять критичные запросы через EXPLAIN ANALYZE — рост таблицы меняет выбор плана планировщиком со временем.',
    },
    lecturerNotes: [
      'Обязательно спросить про безопасность выполнения на UPDATE/DELETE — частый провал даже у уверенных кандидатов.',
      'Не требовать наизусть все возможные узлы плана — достаточно Seq Scan/Index Scan и одного типа JOIN.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-19': {
    simpleDefinition:
      'Уровень изоляции транзакции определяет, какие изменения параллельных транзакций видны текущей транзакции, пока она ещё не завершилась.',
    quickAnswer:
      'В PostgreSQL 4 стандартных уровня: READ UNCOMMITTED (на практике ведёт себя как READ COMMITTED — PostgreSQL не допускает грязного чтения ни на одном уровне), READ COMMITTED (по умолчанию: каждый новый оператор внутри транзакции видит данные, зафиксированные к его началу), REPEATABLE READ (снимок данных фиксируется на начало всей транзакции — повторное чтение той же строки в рамках транзакции всегда даёт тот же результат), SERIALIZABLE (максимальная защита, эмулирует последовательное выполнение транзакций, может завершиться ошибкой сериализации 40001, требующей retry).',
    explainBrief: [
      'READ COMMITTED (default в PostgreSQL) — каждый оператор (не вся транзакция) видит снимок данных на момент своего начала; между двумя SELECT в одной транзакции результат может измениться, если кто-то успел закоммитить.',
      'REPEATABLE READ в PostgreSQL — снимок фиксируется на начало транзакции; повторный SELECT той же строки в этой же транзакции всегда даёт одинаковый результат.',
      'Важно не путать поведение PostgreSQL с MySQL: в PostgreSQL REPEATABLE READ реализован через MVCC-снимок, но при конфликтующей записи PostgreSQL может выдать serialization failure вместо тихого "старого" результата.',
      'SERIALIZABLE — самый строгий уровень; PostgreSQL реализует его через SSI (Serializable Snapshot Isolation) и может откатить транзакцию с ошибкой SQLSTATE 40001 при обнаружении конфликта — приложение обязано повторить транзакцию.',
      'Более строгий уровень изоляции — меньше аномалий чтения, но больше вероятность отката из-за конфликта (serialization failure) и потенциально больше нагрузка — классический trade-off.',
      'Dirty read (чтение незакоммиченных данных) в PostgreSQL невозможен ни на одном уровне — это отличает его от некоторых других СУБД.',
    ],
    questionPlan: [
      {
        question: 'Какой уровень изоляции используется в PostgreSQL по умолчанию?',
        answerHint: 'READ COMMITTED.',
      },
      {
        question: 'В чём именно разница между READ COMMITTED и REPEATABLE READ в PostgreSQL?',
        answerHint: 'READ COMMITTED — каждый оператор видит новый снимок на момент своего начала; REPEATABLE READ — снимок фиксируется один раз на всю транзакцию.',
      },
      {
        question: 'Что произойдёт при конфликте на уровне SERIALIZABLE?',
        answerHint: 'PostgreSQL может откатить транзакцию с ошибкой сериализации (SQLSTATE 40001) — приложение должно поймать это и сделать retry.',
      },
      {
        question: 'Правда ли, что PostgreSQL допускает грязное чтение на READ UNCOMMITTED, как некоторые другие СУБД?',
        answerHint: 'Нет, PostgreSQL никогда не допускает dirty read ни на одном уровне — READ UNCOMMITTED фактически ведёт себя как READ COMMITTED.',
      },
    ],
    extraKeyPoints: [
      'Кандидат не должен переносить поведение MySQL/Oracle на PostgreSQL один в один.',
      'Обязательное знание: PostgreSQL default — READ COMMITTED, не REPEATABLE READ и не SERIALIZABLE.',
      'SERIALIZABLE требует retry-логики в приложении — это не "просто самый безопасный уровень без последствий".',
    ],
    goodAnswer:
      'Знает правильный default (READ COMMITTED), точно объясняет разницу READ COMMITTED/REPEATABLE READ через момент фиксации снимка, знает про serialization failure (40001) и необходимость retry на SERIALIZABLE.',
    redFlag:
      'Путает default PostgreSQL с REPEATABLE READ; описывает поведение других СУБД (например, допускает грязное чтение на READ UNCOMMITTED) как факт про PostgreSQL; не знает про retry при serialization failure.',
    glossary: [
      { term: 'isolation level', meaning: 'Уровень изоляции — насколько транзакция видит изменения других параллельных транзакций.' },
      { term: 'READ COMMITTED', meaning: 'Уровень изоляции по умолчанию в PostgreSQL: каждый оператор видит новый снимок.' },
      { term: 'REPEATABLE READ', meaning: 'Снимок фиксируется один раз на всю транзакцию.' },
      { term: 'SERIALIZABLE', meaning: 'Самый строгий уровень, эмулирующий последовательное выполнение транзакций.' },
      { term: 'MVCC', meaning: 'Multi-Version Concurrency Control — механизм PostgreSQL для параллельного доступа без блокировок на чтение.' },
      { term: 'serialization failure (40001)', meaning: 'Ошибка PostgreSQL при конфликте на SERIALIZABLE, требующая retry транзакции.' },
    ],
    codeExample: {
      title: 'SERIALIZABLE с retry на конфликт',
      language: 'text',
      snippet: `BEGIN ISOLATION LEVEL SERIALIZABLE;
-- бизнес-логика перевода средств
COMMIT;
-- если PostgreSQL вернул SQLSTATE 40001, приложение должно
-- повторить всю транзакцию заново (обычно с небольшой задержкой)`,
      walkthrough: [
        'SERIALIZABLE защищает инвариант (например, баланс не уходит в минус) даже при высокой конкуренции.',
        'Ошибка 40001 — не баг, а штатный сигнал "повторите транзакцию".',
      ],
      commonPitfall:
        'Считать REPEATABLE READ в PostgreSQL полностью эквивалентным REPEATABLE READ в MySQL/InnoDB — механизм (MVCC snapshot vs locking) и гарантии по фантомным чтениям отличаются.',
      productionNote:
        'Для инвариантов вроде "сумма переводов не должна уйти в минус" под конкурентной нагрузкой — SERIALIZABLE плюс retry-политика с backoff надёжнее, чем полагаться на READ COMMITTED и ручные блокировки.',
    },
    lecturerNotes: [
      'Ключевая проверка: спросить default PostgreSQL прямо — многие путают с REPEATABLE READ по аналогии с другими СУБД.',
      'Не требовать деталей алгоритма SSI — для intern достаточно знать про 40001 и необходимость retry.',
    ],
    estimatedMinutes: 3,
  },

  'int-intern-20': {
    simpleDefinition:
      'Seq Scan (последовательное сканирование) — PostgreSQL читает таблицу целиком, строку за строкой, без использования индекса, и проверяет условие WHERE на каждой строке.',
    quickAnswer:
      'Seq Scan — нормальный и часто самый быстрый выбор планировщика для маленькой таблицы или когда запрос выбирает большую долю строк таблицы. Seq Scan — проблема на большой таблице, если запрос селективен (выбирает маленькую долю строк) и подходящего индекса нет или планировщик его не использует из-за устаревшей статистики.',
    explainBrief: [
      'Seq Scan читает все страницы таблицы по порядку и проверяет предикат WHERE на каждой строке — стоимость линейно зависит от размера таблицы, а не от размера результата.',
      'Планировщик PostgreSQL сам выбирает между Seq Scan и Index Scan на основе стоимости (cost), которая зависит от статистики таблицы (собирается через ANALYZE/autovacuum).',
      'На маленькой таблице Seq Scan часто быстрее Index Scan — накладные расходы на переход по индексу не окупаются.',
      'На большой таблице с низкоселективным условием (выбираем 50%+ строк) Seq Scan тоже может быть дешевле, чем Index Scan.',
      'Проблема — большая таблица плюс высокоселективное условие (нужно 0.01% строк), а планировщик всё равно выбрал Seq Scan: либо нет подходящего индекса, либо статистика устарела, либо условие написано так, что индекс не может быть использован.',
      'Диагностика — EXPLAIN ANALYZE покажет Seq Scan и actual rows; расхождение с estimated — веский повод сделать ANALYZE и пересмотреть индексы.',
    ],
    questionPlan: [
      {
        question: 'Всегда ли Seq Scan — это плохо?',
        answerHint: 'Нет; для маленьких таблиц и низкоселективных условий он часто оптимален или даже быстрее Index Scan.',
      },
      {
        question: 'Когда Seq Scan — реальная проблема?',
        answerHint: 'Большая таблица плюс запрос выбирает маленькую долю строк, но подходящего индекса нет или он не используется.',
      },
      {
        question: 'Что может помешать планировщику использовать существующий индекс?',
        answerHint: 'Устаревшая статистика, функция над индексируемым столбцом без функционального индекса, несовпадающий тип данных в сравнении.',
      },
      {
        question: 'Как проверить, что именно вызвало Seq Scan в конкретном запросе?',
        answerHint: 'EXPLAIN ANALYZE — смотреть на план, estimated vs actual rows, и пробовать ANALYZE таблицы или создать/поправить индекс.',
      },
    ],
    extraKeyPoints: [
      'Кандидат не должен утверждать, что Seq Scan — это всегда признак ошибки: это осознанный выбор планировщика по стоимости.',
      'Обязательное знание конкретных причин, почему индекс может не использоваться, даже если он существует.',
      'Диагностика всегда через EXPLAIN ANALYZE, а не догадки.',
    ],
    goodAnswer:
      'Явно разводит "нормальный Seq Scan" (маленькая таблица/низкая селективность) и "проблемный Seq Scan" (большая таблица плюс высокая селективность без индекса), называет минимум одну причину, почему существующий индекс может игнорироваться.',
    redFlag:
      '"Seq Scan — это всегда плохо, надо всегда Index Scan"; не может объяснить, почему планировщик вообще выбирает Seq Scan; не знает, что делать, если индекс есть, но не используется.',
    glossary: [
      { term: 'Seq Scan', meaning: 'Последовательное чтение всей таблицы без использования индекса.' },
      { term: 'query planner', meaning: 'Планировщик запросов PostgreSQL, выбирающий план выполнения по стоимости.' },
      { term: 'ANALYZE', meaning: 'Команда сбора статистики по таблице для планировщика.' },
      { term: 'функциональный индекс', meaning: 'Индекс по результату функции над столбцом, например LOWER(email).' },
    ],
    codeExample: {
      title: 'Seq Scan из-за функции над столбцом',
      language: 'text',
      snippet: `-- индекс есть, но не используется
CREATE INDEX idx_users_email ON users (email);
SELECT * FROM users WHERE LOWER(email) = 'user@test.com'; -- Seq Scan

-- fix: функциональный индекс под тот же predicate
CREATE INDEX idx_users_email_lower ON users (LOWER(email));`,
      walkthrough: [
        'Обычный индекс по email не помогает, когда в WHERE применена функция LOWER() над столбцом.',
        'Функциональный индекс по LOWER(email) точно соответствует условию запроса.',
      ],
      commonPitfall: 'WHERE LOWER(email) = \'user@test.com\' при обычном индексе на email (без LOWER) — индекс не используется, планировщик уходит в Seq Scan.',
      productionNote: 'После крупной миграции/массовой вставки данных обязательно ANALYZE (или дождаться autovacuum) — иначе планировщик работает по устаревшей статистике.',
    },
    lecturerNotes: [
      'Дожать: "индекс есть, а планировщик его не использует — почему?" — проверяет реальное понимание, не только заученный факт.',
      'Не уходить в тонкости cost-based planner формул — для intern достаточно верхнеуровневого понимания.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-21': {
    simpleDefinition:
      'Это разные способы, которыми сервисы обмениваются данными: REST поверх HTTP — синхронный запрос-ответ по контракту (обычно JSON), SOAP — более строгий XML-протокол с формальным контрактом (WSDL), JMS/брокер сообщений — асинхронный обмен сообщениями через очередь/топик, Kafka — распределённый лог событий с возможностью повторного чтения истории.',
    quickAnswer:
      'REST/HTTP — когда нужен простой синхронный запрос-ответ: "сделай и сразу скажи результат" (создать заказ, получить профиль). SOAP — legacy или enterprise-контракты с жёсткими формальными требованиями (банки, госсистемы), где важен строгий WSDL-контракт. JMS/брокер сообщений — когда нужно асинхронно передать команду или событие с гарантией доставки, не дожидаясь ответа синхронно. Kafka — когда нужен поток событий, который могут читать несколько независимых потребителей, с возможностью replay и высокой пропускной способностью.',
    explainBrief: [
      'REST/HTTP — синхронный request-response: клиент ждёт ответ в том же соединении; удобен для команд с немедленным результатом.',
      'SOAP — XML-протокол с формальным контрактом (WSDL), встроенной обработкой ошибок (SOAP Fault) и стандартами безопасности; чаще встречается как legacy/enterprise-интеграция.',
      'JMS — Java-стандарт (API) для работы с брокерами сообщений; модель queue (точка-точка) или topic (публикация-подписка).',
      'Kafka — распределённый commit log (журнал событий, не просто очередь): сообщения хранятся заданное время (retention) и могут быть перечитаны независимо разными consumer group.',
      'Ключевое отличие Kafka от классической очереди — сообщение не удаляется сразу после чтения, поэтому несколько разных consumer group могут независимо прочитать одни и те же события.',
      'Файловый обмен (см. отдельный вопрос) — ещё один вариант интеграции для batch/legacy-сценариев, где ни REST, ни брокер сообщений не подходят.',
      'Критерий выбора: нужен немедленный ответ — REST; нужна гарантированная асинхронная доставка команды — JMS/брокер; нужен поток событий с историей для нескольких потребителей — Kafka; жёсткий формальный enterprise-контракт — SOAP.',
    ],
    questionPlan: [
      {
        question: 'Чем JMS-очередь принципиально отличается от Kafka?',
        answerHint: 'В классической очереди сообщение обычно удаляется после обработки одним получателем; в Kafka сообщение остаётся в логе на время retention.',
      },
      {
        question: 'Когда вы бы всё ещё выбрали SOAP для нового интеграционного контракта?',
        answerHint: 'Почти никогда для нового проекта с нуля; выбор оправдан, только если этого явно требует внешний партнёр/legacy-система.',
      },
      {
        question: 'REST — это то же самое, что HTTP?',
        answerHint: 'Нет; HTTP — транспортный протокол, REST — архитектурный стиль поверх него; SOAP тоже может идти по HTTP.',
      },
      {
        question: 'Приведите пример, когда синхронный REST для интеграции — плохой выбор.',
        answerHint: 'Долгая операция (обработка платежа с внешним провайдером) — лучше асинхронная команда плюс событие о результате.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен явно связать выбор протокола с требованием (синхронность, гарантия доставки, replay, формальный контракт).',
      'Ключевое отличие "очередь" от "лог событий" (Kafka) — критично понимать.',
      'REST и HTTP — не синонимы; SOAP тоже может идти по HTTP.',
    ],
    goodAnswer:
      'Даёт по одному чёткому критерию выбора для каждого протокола и явно объясняет разницу между очередью и логом событий, приводит пример из практики хотя бы для одного варианта.',
    redFlag: '"Kafka — это просто очередь, но быстрее"; не видит разницы между REST и HTTP; выбирает протокол без привязки к требованию.',
    glossary: [
      { term: 'REST', meaning: 'Архитектурный стиль синхронного обмена поверх HTTP.' },
      { term: 'SOAP', meaning: 'XML-протокол интеграции с формальным контрактом WSDL.' },
      { term: 'JMS', meaning: 'Java-стандарт API для работы с брокерами сообщений.' },
      { term: 'queue / topic', meaning: 'Модели обмена: точка-точка и публикация-подписка.' },
      { term: 'Kafka', meaning: 'Распределённый лог событий с retention и независимыми consumer group.' },
      { term: 'consumer group', meaning: 'Группа потребителей Kafka, независимо читающая один топик.' },
    ],
    codeExample: {
      title: 'Выбор протокола под сценарий',
      language: 'text',
      snippet: `Сценарий: "проверить остаток на складе перед показом кнопки Купить"
-> REST/HTTP: нужен немедленный ответ

Сценарий: "уведомить 3 независимых сервиса о новом заказе"
-> Kafka: несколько consumer group читают одно событие независимо

Сценарий: "интеграция с банком по устаревшему контракту"
-> SOAP: формальный WSDL, требование партнёра`,
      walkthrough: [
        'Выбор протокола делают под требование конкретной интеграции, не для всего проекта сразу.',
        'Kafka даёт независимость потребителей, которой нет у классической очереди.',
      ],
      commonPitfall: 'Называть Kafka "просто очередью" — это ломает понимание consumer group, retention и replay, которые и есть главное отличие.',
      productionNote: 'Смешанный ландшафт — норма: REST для команд между сервисами, Kafka для событий, иногда SOAP на границе с legacy-партнёром.',
    },
    lecturerNotes: [
      'Дожать конкретным сценарием ("для чего выберете Kafka, а не очередь") — проверяет понимание, а не заучивание списка.',
      'Не уходить в детальное сравнение всех брокеров (RabbitMQ vs ActiveMQ) — за пределами вопроса.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-22': {
    simpleDefinition:
      'Синхронный обмен — вызывающий сервис ждёт ответ в том же соединении/потоке, прежде чем продолжить. Асинхронный обмен — вызывающий сервис отправляет сообщение и продолжает работу, не дожидаясь немедленного ответа; результат приходит позже отдельным событием/сообщением.',
    quickAnswer:
      'REST — синхронный request-response: вызывающий сервис ждёт ответа, есть прямая связь "запрос → ответ", проще отлаживать, но при недоступности получателя запрос сразу падает. Kafka/JMS — асинхронный обмен: отправитель не ждёт обработчика, сообщение сохраняется брокером, получатель обрабатывает его в своё время — выше отказоустойчивость к временной недоступности получателя, но сложнее отследить состояние "в моменте" и нужно явно проектировать идемпотентность.',
    explainBrief: [
      'Синхронный REST — соединение держится открытым (или ожидание через async-клиент), сервис-получатель обязан быть доступен прямо сейчас, иначе вызывающий сразу получает ошибку.',
      'Асинхронный Kafka/JMS — отправитель отгружает сообщение брокеру и не ждёт обработки; временная недоступность consumer не блокирует producer.',
      'Синхронный обмен проще для случаев, где ответ нужен немедленно и напрямую влияет на следующий шаг сценария.',
      'Асинхронный обмен подходит для "сообщить о факте" (событие) или "выполнить команду, не блокируя вызывающего".',
      'Trade-off синхронного — простая отладка (один трейс "запрос-ответ"), но каскадные сбои: если downstream медленный/недоступен, это сразу видно вызывающему и может распространиться дальше.',
      'Trade-off асинхронного — устойчивость к временной недоступности получателя, но сложнее отследить состояние "в моменте" и обязательна идемпотентность обработчика.',
    ],
    questionPlan: [
      {
        question: 'Что произойдёт с вызывающим сервисом, если REST-эндпоинт недоступен, и что произойдёт, если недоступен Kafka consumer?',
        answerHint: 'REST — вызывающий сразу получает ошибку/timeout; Kafka — сообщение остаётся в топике, consumer обработает его позже.',
      },
      {
        question: 'Какой тип обмена выберете для "отправить письмо после регистрации пользователя" и почему?',
        answerHint: 'Асинхронный — отправка письма не должна блокировать и не должна проваливать регистрацию, если почтовый сервис временно недоступен.',
      },
      {
        question: 'Какой тип обмена выберете для "проверить, есть ли товар на складе перед оформлением заказа" и почему?',
        answerHint: 'Синхронный REST — ответ нужен прямо сейчас, чтобы решить следующий шаг сценария.',
      },
      {
        question: 'Какая новая сложность появляется при переходе с REST на Kafka для той же операции?',
        answerHint: 'Нужно явно думать про идемпотентность повторной доставки, порядок обработки, задержку и способ узнать текущий статус.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен явно связать выбор с конкретным сценарием, а не абстрактно "асинхронное лучше/хуже".',
      'Понимание, что асинхронность не убирает сложность, а переносит её (идемпотентность, мониторинг, задержка).',
      'Красный флаг — считать, что синхронный REST "проще, поэтому лучше всегда" без учёта отказоустойчивости.',
    ],
    goodAnswer:
      'Приводит конкретный пример для каждого подхода, объясняет разницу в поведении при недоступности получателя, называет минимум одну новую сложность асинхронного подхода.',
    redFlag:
      '"Асинхронное — просто более современное, поэтому всегда лучше"; не понимает, что происходит с вызывающим сервисом при недоступности получателя; не видит новых сложностей асинхронного подхода.',
    glossary: [
      { term: 'синхронный обмен', meaning: 'Вызывающий сервис ждёт ответ прежде чем продолжить.' },
      { term: 'асинхронный обмен', meaning: 'Вызывающий сервис не ждёт немедленного ответа, результат приходит позже.' },
      { term: 'идемпотентность', meaning: 'Свойство: повторная обработка даёт тот же результат или безопасный no-op.' },
      { term: 'circuit breaker', meaning: 'Паттерн защиты от каскадных сбоев при недоступности downstream-сервиса.' },
    ],
    codeExample: {
      title: 'Гибрид: синхронный приём + асинхронная обработка',
      language: 'text',
      snippet: `POST /orders -> 202 Accepted { orderId }
   (синхронный ответ клиенту сразу, без ожидания полной обработки)

Kafka: OrderCreated -> inventory-service, payment-service
   (асинхронная обработка независимо в своё время)

GET /orders/{id}/status -> текущий статус
   (клиент опрашивает или получает вебхук/уведомление)`,
      walkthrough: [
        '202 Accepted — сразу подтверждает приём запроса, не дожидаясь полной обработки.',
        'Реальная обработка идёт асинхронно через Kafka, статус доступен отдельным запросом.',
      ],
      commonPitfall: 'Перевести операцию на Kafka, но не решить, что делать, если сообщение обработается дважды — типичный забытый шаг при "просто сделаем асинхронным".',
      productionNote: 'На границе синхронного и асинхронного часто нужен гибрид: REST принимает запрос и сразу отвечает 202 Accepted, а реальная обработка идёт асинхронно.',
    },
    lecturerNotes: [
      'Дожать конкретным сценарием (письмо после регистрации) — легко отличить заученный ответ от понимания.',
      'Не уходить в детали конкретных брокеров — вопрос про принцип синхронности/асинхронности, не про Kafka API.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-23': {
    simpleDefinition:
      'Надёжная доставка в Kafka — это набор настроек и практик на стороне producer, брокера и consumer, которые вместе снижают риск потери или дублирования сообщений до приемлемого для бизнеса уровня.',
    quickAnswer:
      'acks=all — producer ждёт подтверждения от всех in-sync реплик (не только лидера), прежде чем считать сообщение отправленным; min.insync.replicas — минимальное число реплик, которые должны подтвердить запись, иначе брокер вернёт ошибку. enable.idempotence=true у producer защищает от дублей при повторной отправке самим producer на уровне одной сессии. Но даже с этим на стороне consumer всё равно нужна идемпотентная обработка, потому что at-least-once — реалистичная гарантия по умолчанию.',
    explainBrief: [
      'acks=0 — producer не ждёт вообще ничего (максимальная скорость, максимальный риск потери); acks=1 — ждёт подтверждения только от лидера партиции; acks=all — ждёт подтверждения от всех in-sync реплик (ISR).',
      'min.insync.replicas работает вместе с acks=all: если реплик, подтвердивших запись, меньше этого числа, брокер вернёт ошибку producer-у, а не тихо потеряет данные.',
      'enable.idempotence=true — Kafka producer нумерует сообщения (sequence number) на партицию, и брокер отбрасывает дубли при повторной отправке из-за retry — защита именно от повторной отправки самим producer.',
      'Transactional producer (transactional.id) позволяет атомарно записать в несколько партиций/топиков как одну транзакцию; применять аккуратно — усложняет систему и требует read_committed на consumer.',
      'Даже с идемпотентным и транзакционным producer consumer всё равно должен быть готов к повторной обработке одного и того же сообщения — поэтому нужна бизнес-идемпотентность на стороне обработчика.',
      'Offset commit после успешной обработки (а не сразу после чтения) — базовое правило at-least-once: если commit сделан раньше обработки и consumer упал, сообщение потеряется; если позже — может обработаться повторно.',
    ],
    questionPlan: [
      {
        question: 'Чем acks=all отличается от acks=1 с точки зрения риска потери данных?',
        answerHint: 'acks=1 — риск потери, если лидер партиции упадёт до репликации; acks=all — подтверждение только после записи на все in-sync реплики.',
      },
      {
        question: 'От чего конкретно защищает enable.idempotence=true, а от чего — нет?',
        answerHint: 'Защищает от дублей из-за повторной отправки одним и тем же producer; не защищает от дублей на уровне всей бизнес-логики.',
      },
      {
        question: 'Почему даже с идемпотентным producer всё равно нужна идемпотентность на стороне consumer?',
        answerHint: 'At-least-once остаётся реалистичной гарантией — consumer может получить одно и то же сообщение дважды из-за падения между обработкой и commit offset.',
      },
      {
        question: 'Когда стоит рассмотреть transactional producer?',
        answerHint: 'Когда нужно атомарно писать в несколько партиций/топиков как одну единицу (паттерн consume-transform-produce).',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен разделять "надёжность на стороне producer/брокера" и "надёжность на стороне бизнес-логики" (consumer-side дедупликация).',
      'Явное понимание, что exactly-once в Kafka — в первую очередь про доставку между Kafka-компонентами, а не автоматическая гарантия для внешних побочных эффектов.',
      'Offset commit после обработки, а не до — базовое, но часто упускаемое правило.',
    ],
    goodAnswer:
      'Правильно объясняет разницу acks=0/1/all и min.insync.replicas, разводит идемпотентность producer (защита от повторной отправки) и consumer (защита от повторной обработки), знает про commit offset после обработки.',
    redFlag:
      '"acks=all гарантирует, что сообщение никогда не потеряется и не продублируется" — без разделения producer-side и consumer-side идемпотентности; коммитит offset сразу после чтения; не знает про min.insync.replicas.',
    glossary: [
      { term: 'acks', meaning: 'Настройка producer: сколько реплик должны подтвердить запись.' },
      { term: 'ISR', meaning: 'In-Sync Replicas — реплики партиции, синхронизированные с лидером.' },
      { term: 'min.insync.replicas', meaning: 'Минимальное число реплик, подтверждение которых требуется при acks=all.' },
      { term: 'idempotent producer', meaning: 'Producer, защищённый от дублей собственных повторных отправок.' },
      { term: 'transactional producer', meaning: 'Producer, пишущий в несколько партиций/топиков атомарно.' },
      { term: 'at-least-once', meaning: 'Гарантия доставки: сообщение доставлено минимум один раз, возможны дубли.' },
      { term: 'offset commit', meaning: 'Фиксация consumer-ом позиции успешно обработанного сообщения.' },
    ],
    codeExample: {
      title: 'Надёжный producer + commit после обработки',
      language: 'text',
      snippet: `# producer.properties
acks=all
enable.idempotence=true
retries=Integer.MAX_VALUE

# на брокере (topic config)
min.insync.replicas=2

# consumer: commit offset ПОСЛЕ успешной обработки, не до
record = poll();
processWithSideEffect(record); // например, запись в БД с дедупликацией
consumer.commitSync();`,
      walkthrough: [
        'acks=all + min.insync.replicas=2 снижают риск потери на стороне брокера.',
        'commitSync() после обработки — offset двигается только когда side effect уже применён.',
      ],
      commonPitfall: 'Коммитить offset сразу после poll(), до реальной обработки сообщения — при падении между commit и обработкой сообщение будет потеряно навсегда.',
      productionNote: 'Мониторить under-replicated partitions и реальный размер ISR в проде — настройка acks=all бесполезна, если реплики систематически отстают.',
    },
    lecturerNotes: [
      'Обязательно развести producer-side и consumer-side идемпотентность — частая путаница даже у уверенных кандидатов.',
      'Не требовать деталей алгоритма ISR/leader election — это тема для более глубокого Kafka-интервью.',
    ],
    estimatedMinutes: 3,
  },

  'int-intern-24': {
    simpleDefinition:
      'Файловый обмен — способ интеграции, при котором системы обмениваются данными через файлы (например, CSV/XML на SFTP, S3, шаре), а не через API или очередь сообщений в реальном времени.',
    quickAnswer:
      'Файловый обмен оправдан для batch-сценариев, интеграции с legacy-системами без API, регуляторных/банковских процессов с обязательным форматом файла-выгрузки, и передачи очень больших объёмов данных, для которых REST/Kafka неудобны или не поддерживаются партнёром. Минусы — задержка (по расписанию, не real-time), сложнее гарантировать целостность и порядок, нужен явный контроль идемпотентности и повторной обработки.',
    explainBrief: [
      'Типичные сценарии: ночная выгрузка отчётов для банка/регулятора, обмен с legacy ERP без нормального API, загрузка большого прайс-листа от поставщика.',
      'Формат обычно фиксированный контрактом (CSV со строгими колонками, XML по XSD) — партнёр часто не готов измениться на REST/Kafka.',
      'Доставка — SFTP, S3-бакет, общая сетевая шара; расписание (cron) вместо real-time событий.',
      'Идемпотентность обязательна: файл может быть прислан повторно — обработка должна распознавать уже обработанный файл (по имени/хэшу) и не применять его дважды.',
      'Частичная обработка — если процесс упал на середине файла, нужна стратегия: транзакционно откатить всё или уметь продолжить с места сбоя (чекпоинт по номеру строки).',
      'Валидация на входе обязательна (иначе кривой файл от партнёра ломает всё вниз по пайплайну), плюс мониторинг "файл не пришёл вовремя".',
    ],
    questionPlan: [
      {
        question: 'Почему для интеграции с некоторыми внешними системами используют файлы, а не REST/Kafka?',
        answerHint: 'У партнёра часто нет API/поддержки очередей, либо это регуляторное/контрактное требование конкретного формата и способа доставки.',
      },
      {
        question: 'Как гарантировать, что один и тот же файл не обработается дважды?',
        answerHint: 'Хранить реестр обработанных файлов (имя, хэш, дата), перед обработкой проверять, не был ли этот файл уже применён.',
      },
      {
        question: 'Что делать, если обработка файла упала на середине?',
        answerHint: 'Либо обрабатывать в транзакции с полным откатом при сбое, либо вести чекпоинт для продолжения без дублирования уже применённых записей.',
      },
      {
        question: 'Какой мониторинг нужен для файлового обмена, которого нет у REST/Kafka?',
        answerHint: 'Контроль "файл не пришёл в ожидаемое время" и валидация схемы на входе.',
      },
    ],
    extraKeyPoints: [
      'Кандидат не должен считать файловый обмен "устаревшим и всегда плохим".',
      'Идемпотентность файлового обмена — та же идея, что и в Kafka/REST, но реализуется через реестр обработанных файлов.',
      'Понимание рисков (задержка, частичная обработка, отсутствие немедленной обратной связи) — обязательная часть хорошего ответа.',
    ],
    goodAnswer:
      'Называет минимум 2 реальных сценария, явно упоминает идемпотентность через реестр обработанных файлов и проблему частичной обработки/мониторинга отсутствия файла.',
    redFlag:
      '"Файловый обмен — это просто устаревший способ, сейчас так не делают"; не видит проблемы повторной обработки одного и того же файла; не упоминает мониторинг отсутствия файла.',
    glossary: [
      { term: 'файловый обмен', meaning: 'Интеграция через передачу файлов вместо API/очереди сообщений.' },
      { term: 'SFTP', meaning: 'Защищённый протокол передачи файлов, частый способ доставки в файловом обмене.' },
      { term: 'реестр обработанных файлов', meaning: 'Таблица учёта уже применённых файлов для защиты от повторной обработки.' },
      { term: 'чекпоинт', meaning: 'Точка сохранения прогресса обработки для продолжения после сбоя.' },
    ],
    codeExample: {
      title: 'Реестр обработанных файлов',
      language: 'text',
      snippet: `CREATE TABLE processed_files (
  file_name TEXT NOT NULL,
  checksum TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL,
  UNIQUE (file_name, checksum)
);

-- перед обработкой: попытка вставить запись
INSERT INTO processed_files (file_name, checksum, status)
VALUES (:name, :checksum, 'PROCESSING')
ON CONFLICT DO NOTHING RETURNING file_name; -- пусто = уже обработан`,
      walkthrough: [
        'UNIQUE (file_name, checksum) — защита от повторной обработки того же файла.',
        'ON CONFLICT DO NOTHING позволяет атомарно проверить "уже было или нет".',
      ],
      commonPitfall: 'Обрабатывать входящий файл без проверки по реестру уже обработанных — повторная заливка того же файла партнёром задваивает данные.',
      productionNote: 'Алертинг на "файл не пришёл к 06:00" так же важен, как обработка самого файла — молчаливое отсутствие интеграции легко пропустить.',
    },
    lecturerNotes: [
      'Не давать сбить себя фразой "мы так не делаем" — попросить пример хотя бы гипотетического banking/legacy-сценария.',
      'Дожать про мониторинг отсутствия файла — часто забываемая деталь.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-25': {
    simpleDefinition:
      'Идемпотентная обработка — свойство, при котором повторная обработка того же сообщения (по ошибке, ретраю, дублированной доставке) даёт тот же результат, что и первая обработка, или безопасно ничего не делает при повторе.',
    quickAnswer:
      'Ключевой инструмент — business key (уникальный идентификатор конкретной бизнес-операции, а не технический offset) плюс уникальное ограничение (UNIQUE constraint) в базе на этот ключ, либо inbox-таблица/processed_messages, куда сначала пробуют вставить запись о том, что сообщение уже обработано (INSERT ... ON CONFLICT DO NOTHING) — если вставка не удалась, значит сообщение уже обработано. Idempotency-Key (для REST) — тот же принцип на уровне HTTP API.',
    explainBrief: [
      'Business key — стабильный идентификатор именно бизнес-операции (например, "заявка №123, попытка оплаты"), а не технический id сообщения/offset, который может быть разным при повторной публикации.',
      'UNIQUE constraint в БД на business key — надёжный способ дедупликации: даже при гонке из нескольких потоков/подов только одна вставка пройдёт успешно.',
      'Inbox table (processed_messages) — таблица, куда пишется факт обработки конкретного сообщения; это можно сделать атомарно в одной транзакции с самой бизнес-операцией.',
      'Idempotency-Key — паттерн для REST API: клиент сам генерирует уникальный ключ на конкретную попытку операции; сервер хранит результат по этому ключу и при повторе возвращает уже готовый результат.',
      'Важно: "просто дедуплицировать в памяти/Redis с TTL" — недостаточно надёжно само по себе, если TTL истёк раньше повтора или сервис перезапустился — нужно durable-хранилище (БД).',
      'Повтор должен либо дать тот же результат, либо безопасно не выполнить операцию повторно — это и есть суть идемпотентности, а не просто "не упасть с ошибкой".',
    ],
    questionPlan: [
      {
        question: 'Чем business key отличается от technical id сообщения (например, offset в Kafka) для целей идемпотентности?',
        answerHint: 'technical id/offset привязан к конкретной доставке и может отличаться при повторной публикации; business key — стабильный идентификатор самой операции.',
      },
      {
        question: 'Как реализовать дедупликацию через unique constraint максимально надёжно при гонке нескольких потоков?',
        answerHint: 'INSERT в таблицу с UNIQUE-индексом на business key внутри той же транзакции, что и бизнес-логика; конфликт трактуется как "уже обработано".',
      },
      {
        question: 'Достаточно ли дедупликации только в памяти сервиса?',
        answerHint: 'Нет как единственного решения — при рестарте сервиса или истечении TTL гарантия теряется; нужен durable источник истины.',
      },
      {
        question: 'Как работает Idempotency-Key на уровне REST API?',
        answerHint: 'Клиент передаёт свой уникальный ключ попытки; сервер при повторном запросе с тем же ключом возвращает сохранённый результат без повторного выполнения.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен назвать хотя бы один durable-механизм (unique constraint/inbox table), а не только "проверим в кэше".',
      'Понимание, что идемпотентность — это про результат, а не про "не упасть с ошибкой при повторе".',
      'Business key vs technical id — критичное различие, которое часто путают.',
    ],
    goodAnswer:
      'Называет минимум 2 механизма (business key плюс unique constraint, inbox table, Idempotency-Key для REST), объясняет, почему только in-memory/TTL-дедупликация недостаточна, формулирует итог как "тот же результат или безопасный no-op".',
    redFlag:
      '"Идемпотентность — это когда сервис не падает при повторном сообщении"; предлагает только in-memory дедупликацию без durable-хранилища; путает technical id доставки с business key операции.',
    glossary: [
      { term: 'идемпотентность', meaning: 'Повтор операции даёт тот же результат или безопасный no-op.' },
      { term: 'business key', meaning: 'Стабильный идентификатор бизнес-операции для дедупликации.' },
      { term: 'UNIQUE constraint', meaning: 'Ограничение БД, гарантирующее единственность значения/комбинации значений.' },
      { term: 'inbox table / processed_messages', meaning: 'Таблица учёта обработанных сообщений для защиты от повтора.' },
      { term: 'Idempotency-Key', meaning: 'HTTP-заголовок с ключом попытки операции для идемпотентного REST API.' },
    ],
    codeExample: {
      title: 'Идемпотентная обработка через unique constraint',
      language: 'text',
      snippet: `CREATE TABLE processed_messages (
  business_key TEXT PRIMARY KEY,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

BEGIN;
INSERT INTO processed_messages (business_key) VALUES (:key)
  ON CONFLICT DO NOTHING;
-- если 0 строк вставлено -> уже обработано, пропустить бизнес-логику
-- если 1 строка -> выполнить бизнес-логику в этой же транзакции
COMMIT;`,
      walkthrough: [
        'PRIMARY KEY на business_key гарантирует единственность даже при гонке нескольких потоков.',
        'Вставка и бизнес-логика — в одной транзакции: либо обе применяются, либо обе откатываются.',
      ],
      commonPitfall: 'Дедуплицировать по offset/technical id сообщения вместо business key — при повторной публикации того же бизнес-события с новым offset дедупликация не сработает.',
      productionNote: 'TTL-очистку идемпотентных записей нужно планировать заранее — таблица дедупликации иначе растёт бесконечно; TTL должен быть больше максимально возможного окна повторной доставки.',
    },
    lecturerNotes: [
      'Дожать вопросом про business key vs technical id — частая путаница даже у уверенных кандидатов.',
      'Не уходить в детали конкретных брокеров — идея универсальна для Kafka/JMS/REST.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-26': {
    simpleDefinition:
      'Границы микросервисов проводят по бизнес-возможностям (business capability) и ограниченным контекстам (bounded context) — что делает бизнес и какие данные принадлежат этой части, а не по техническим слоям вроде Controller/Service/Repository.',
    quickAnswer:
      'Основной критерий — business capability/bounded context: сервис отвечает за конкретную область бизнеса целиком (например, "заказы" или "платежи") и владеет своими данными (только этот сервис пишет в свою БД). Каждый сервис должен деплоиться независимо — изменение в одном не требует пересборки/выката других. Неправильно — делить по техническим слоям и делать наносервисы (слишком мелкое дробление, где overhead на интеграцию превышает пользу от разделения).',
    explainBrief: [
      'Business capability — конкретная бизнес-функция, за которую отвечает сервис целиком, а не техническая часть архитектуры.',
      'Bounded context (термин из DDD — Domain-Driven Design) — граница, внутри которой определённые термины и модели данных имеют один смысл.',
      'Ownership данных — только один сервис пишет (и в идеале читает напрямую) в свою базу данных; другие сервисы получают данные через его API/события.',
      'Independent deployability — можно выкатить новую версию сервиса без синхронного релиза всех остальных.',
      'Антипаттерн — деление по техническим слоям (отдельно "сервис контроллеров", отдельно "сервис бизнес-логики") добавляет сетевые вызовы без реального снижения связанности.',
      'Антипаттерн — наносервисы: чрезмерно мелкое дробление, где стоимость интеграции превышает выгоду от независимости.',
      'Практический признак хорошей границы — команда может месяцами дорабатывать сервис, почти не трогая контракты с соседями.',
    ],
    questionPlan: [
      {
        question: 'Почему деление по слоям Controller/Service/Repository — плохая идея для микросервисов?',
        answerHint: 'Слои логически всегда работают вместе для одной операции — разделение на сервисы добавляет сетевые вызовы без снижения связанности.',
      },
      {
        question: 'Что значит "ownership данных" на практике?',
        answerHint: 'Только сервис-владелец пишет в свою БД напрямую; остальным данные доступны только через его API/события.',
      },
      {
        question: 'Как понять, что разбиение получилось слишком мелким (наносервисы)?',
        answerHint: 'Слишком много сетевых вызовов на одну бизнес-операцию, постоянная координация релизов, overhead инфраструктуры не оправдан размером логики.',
      },
      {
        question: 'Что такое bounded context и зачем он нужен при проектировании границ?',
        answerHint: 'Явная граница, внутри которой термины/модели имеют один согласованный смысл; помогает не тащить одну общую модель через все сервисы.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен явно назвать business capability/bounded context как критерий, а не "по размеру команды".',
      'Ownership данных — обязательный элемент правильного ответа.',
      'Явное упоминание антипаттернов (деление по слоям, наносервисы) — признак практического понимания.',
    ],
    goodAnswer:
      'Формулирует критерий через business capability/bounded context плюс ownership данных плюс independent deployability, называет минимум один антипаттерн деления с объяснением, почему это плохо.',
    redFlag:
      '"Делим по технологиям/слоям, чтобы было проще"; не знает термина bounded context; считает, что чем мельче сервисы, тем лучше архитектура.',
    glossary: [
      { term: 'business capability', meaning: 'Конкретная бизнес-функция, за которую отвечает сервис целиком.' },
      { term: 'bounded context', meaning: 'Граница, внутри которой термины/модели данных имеют один смысл (DDD).' },
      { term: 'DDD', meaning: 'Domain-Driven Design — предметно-ориентированное проектирование.' },
      { term: 'ownership данных', meaning: 'Только сервис-владелец пишет напрямую в свою базу данных.' },
      { term: 'independent deployability', meaning: 'Возможность выкатить сервис независимо от остальных.' },
      { term: 'наносервисы', meaning: 'Чрезмерно мелкое дробление сервисов с overhead интеграции выше пользы.' },
    ],
    codeExample: {
      title: 'Деление по capability, не по слоям',
      language: 'text',
      snippet: `Плохо (деление по слоям):
  orders-controller-service | orders-business-service | orders-repository-service
  -> 3 сетевых вызова на одну операцию "создать заказ"

Хорошо (деление по capability):
  orders-service (свой Controller+Service+Repository+БД)
  payments-service (своя БД, свой контракт наружу)`,
      walkthrough: [
        'Деление по слоям превращает один логический модуль в 3 сервиса с сетевыми вызовами между ними без выгоды.',
        'Деление по capability даёт независимый деплой и владение данными каждого сервиса.',
      ],
      commonPitfall: 'Разбить монолит на "orders-controller-service" и "orders-business-service" — это распределённый монолит с лишними сетевыми вызовами.',
      productionNote: 'Пересмотр границ сервисов — нормальная практика: если два "независимых" сервиса релизятся синхронно почти всегда, вероятно граница проведена неверно.',
    },
    lecturerNotes: [
      'Дожать примером из практики кандидата, а не только теорией DDD-терминов.',
      'Не требовать глубокого DDD (aggregate, entity, value object) — для intern достаточно business capability и ownership.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-27': {
    simpleDefinition:
      'Saga — способ провести бизнес-операцию через несколько сервисов как последовательность локальных транзакций с компенсирующими действиями при сбое, вместо одной распределённой транзакции. Outbox — паттерн, который решает проблему "записать в свою БД и одновременно надёжно отправить сообщение" без потери события при сбое между этими двумя действиями.',
    quickAnswer:
      'Saga заменяет одну распределённую транзакцию серией локальных транзакций в каждом сервисе плюс компенсирующими действиями, если один из шагов не удался — координация может быть хореографией (сервисы реагируют на события друг друга) или оркестрацией (отдельный оркестратор явно вызывает шаги по порядку). Outbox решает проблему dual write: сервис одной локальной транзакцией пишет и бизнес-данные, и запись-намерение "отправить это событие" в свою же таблицу outbox; отдельный процесс читает outbox и публикует событие — так запись в БД и отправка события никогда не расходятся.',
    explainBrief: [
      'Saga (choreography) — каждый сервис публикует событие о своём шаге, следующий сервис реагирует сам — нет единой точки координации, но сложнее понять процесс целиком.',
      'Saga (orchestration) — отдельный оркестратор явно вызывает шаги по порядку и знает весь сценарий целиком — проще отслеживать, но появляется дополнительный компонент.',
      'Компенсирующее действие — не "откат транзакции", а отдельная бизнес-операция, отменяющая эффект уже выполненного шага (например, "вернуть деньги").',
      'Проблема dual write — запись в БД и отправка сообщения не атомарны вместе: при сбое между ними можно потерять событие или отправить его, хотя транзакция БД откатилась.',
      'Outbox-таблица — в той же локальной транзакции, что и бизнес-данные, пишется запись "нужно отправить такое-то событие"; оба изменения либо применяются вместе, либо оба откатываются.',
      'Relay/publisher (отдельный процесс) читает outbox-таблицу и публикует событие в брокер — сама публикация всё ещё требует идемпотентности на стороне consumer.',
      'Идемпотентность всё равно обязательна на принимающей стороне саги/consumer события — Saga и Outbox снижают риск потери/рассинхронизации, но не отменяют необходимость идемпотентной обработки.',
    ],
    questionPlan: [
      {
        question: 'Чем компенсирующее действие в Saga отличается от обычного rollback транзакции?',
        answerHint: 'Rollback откатывает ещё не закоммиченную транзакцию; компенсация — новая бизнес-операция, отменяющая эффект уже завершённого шага в другом сервисе.',
      },
      {
        question: 'В чём разница между хореографией и оркестрацией Saga?',
        answerHint: 'Хореография — сервисы реагируют на события друг друга без центра управления; оркестрация — отдельный компонент явно знает и вызывает весь сценарий.',
      },
      {
        question: 'Какую именно проблему решает Outbox?',
        answerHint: 'Проблему dual write — гарантирует, что запись в БД и намерение отправить событие происходят вместе или не происходят вовсе.',
      },
      {
        question: 'Нужна ли идемпотентность consumer, если используется Outbox?',
        answerHint: 'Да — relay может отправить событие более одного раза при сбое (at-least-once), потребитель всё равно должен уметь безопасно обработать дубль.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен явно объяснить компенсацию как отдельную бизнес-операцию, а не путать её с rollback.',
      'Понимание Outbox именно как решения dual write — критерий глубины ответа.',
      'Явное признание, что Outbox не отменяет необходимость идемпотентности на стороне consumer.',
    ],
    goodAnswer:
      'Различает хореографию и оркестрацию с примером, чётко объясняет dual write problem и то, как Outbox её решает через одну локальную транзакцию, подчёркивает, что идемпотентность consumer всё равно нужна.',
    redFlag:
      '"Saga — это просто цепочка вызовов сервисов подряд"; путает компенсацию с обычным rollback; считает, что Outbox сам по себе гарантирует exactly-once без идемпотентности.',
    glossary: [
      { term: 'Saga', meaning: 'Последовательность локальных транзакций с компенсирующими действиями вместо распределённой транзакции.' },
      { term: 'хореография', meaning: 'Координация Saga через события без центрального оркестратора.' },
      { term: 'оркестрация', meaning: 'Координация Saga через отдельный компонент, явно вызывающий шаги.' },
      { term: 'компенсирующее действие', meaning: 'Бизнес-операция, отменяющая эффект уже выполненного шага.' },
      { term: 'Outbox', meaning: 'Паттерн атомарной записи бизнес-данных и намерения отправить событие в одной транзакции.' },
      { term: 'dual write', meaning: 'Проблема неатомарной записи в БД и отправки сообщения одновременно.' },
      { term: 'relay / publisher', meaning: 'Процесс, читающий outbox-таблицу и публикующий события в брокер.' },
    ],
    codeExample: {
      title: 'Outbox: атомарная запись бизнес-данных и события',
      language: 'text',
      snippet: `BEGIN;
INSERT INTO orders (id, status) VALUES (:id, 'CREATED');
INSERT INTO outbox (id, topic, payload, sent) VALUES (:eventId, 'orders.created', :payload, false);
COMMIT;
-- отдельный relay: SELECT * FROM outbox WHERE sent = false, публикует в Kafka,
-- затем UPDATE outbox SET sent = true WHERE id = :eventId`,
      walkthrough: [
        'orders и outbox пишутся в одной транзакции — либо оба, либо ни одного изменения.',
        'relay публикует событие асинхронно, независимо от основной бизнес-транзакции.',
      ],
      commonPitfall:
        'Писать бизнес-данные в основную таблицу и сразу вызывать отправку в Kafka в том же методе без Outbox — при падении сервиса между commit БД и отправкой событие теряется навсегда.',
      productionNote: 'Мониторить размер и возраст необработанных записей в outbox-таблице — застрявший relay означает, что события копятся и не доходят до других сервисов.',
    },
    lecturerNotes: [
      'Обязательно развести компенсацию и rollback конкретным примером — частая путаница.',
      'Дожать вопросом про идемпотентность consumer при Outbox — многие считают Outbox "полным решением" без этого.',
    ],
    estimatedMinutes: 3,
  },

  'int-intern-28': {
    simpleDefinition:
      'Service Discovery — механизм, который позволяет сервисам находить актуальный сетевой адрес (host:port) друг друга в динамическом окружении, где инстансы появляются/исчезают/переезжают. API Gateway — единая точка входа для внешних клиентов, которая маршрутизирует запросы к нужным внутренним сервисам и берёт на себя сквозные задачи.',
    quickAnswer:
      'Service Discovery решает проблему "у сервиса-заказов может быть 5 инстансов с разными IP, которые меняются при масштабировании/рестарте" — вместо жёстко прописанных адресов сервисы обращаются по логическому имени, а Discovery возвращает актуальный список живых инстансов. API Gateway — единая точка входа снаружи: маршрутизация запроса к нужному сервису, общая аутентификация/авторизация, rate limiting, иногда — осторожная агрегация нескольких вызовов в один ответ.',
    explainBrief: [
      'Проблема без Discovery — статические адреса сервисов ломаются при масштабировании/деплое/рестарте подов, приходится вручную обновлять конфигурацию у всех потребителей.',
      'Client-side discovery — клиент сам спрашивает реестр и балансирует между полученными адресами; server-side discovery — балансировщик/прокси сам решает, на какой инстанс отправить запрос.',
      'В Kubernetes Service Discovery по факту встроен: обращение по DNS-имени Service автоматически резолвится в один из живых Pod — отдельный Eureka часто уже не нужен.',
      'API Gateway — единая точка входа для внешних (иногда и внутренних) клиентов: скрывает внутреннюю структуру сервисов, даёт один hostname/контракт наружу.',
      'Сквозные задачи на Gateway: аутентификация/авторизация в одном месте, rate limiting, единое логирование/трейсинг входящих запросов, TLS termination.',
      'Осторожность с агрегацией на Gateway — если Gateway начинает содержать бизнес-логику, он постепенно превращается в скрытый монолит и единую точку отказа.',
      'Gateway — не замена Service Discovery: Gateway тоже должен знать актуальные адреса внутренних сервисов, используя тот же механизм Discovery.',
    ],
    questionPlan: [
      {
        question: 'Какую конкретную проблему решает Service Discovery в динамическом окружении (например, Kubernetes)?',
        answerHint: 'Инстансы появляются/исчезают/меняют адрес при масштабировании — Discovery даёт актуальный список живых адресов по логическому имени.',
      },
      {
        question: 'Чем client-side discovery отличается от server-side?',
        answerHint: 'Client-side — сам клиент получает список адресов и балансирует; server-side — за клиента это делает промежуточный компонент.',
      },
      {
        question: 'Какие задачи логично вынести на API Gateway, а какие — нет?',
        answerHint: 'Логично — аутентификация, rate limiting, routing, TLS termination; не стоит — сложную бизнес-логику агрегации с условиями.',
      },
      {
        question: 'Нужен ли отдельный Eureka/Consul, если приложение уже работает в Kubernetes?',
        answerHint: 'Не обязательно — Kubernetes уже даёт встроенный Service Discovery через DNS-имена Service.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен явно связать Discovery с динамичностью адресов, а не просто "это реестр сервисов".',
      'Понимание разницы client-side/server-side discovery — критерий глубины.',
      'Осторожное отношение к агрегации бизнес-логики на Gateway — признак практического опыта.',
    ],
    goodAnswer:
      'Формулирует проблему динамических адресов и роль Discovery в её решении, называет конкретные задачи, уместные на API Gateway, явно предупреждает про риск превращения Gateway в скрытый монолит.',
    redFlag:
      '"Service Discovery — это просто список сервисов где-то в конфиге"; не видит разницы между Discovery и Gateway; переносит всю бизнес-логику на Gateway.',
    glossary: [
      { term: 'Service Discovery', meaning: 'Механизм поиска актуального адреса сервиса в динамическом окружении.' },
      { term: 'client-side / server-side discovery', meaning: 'Кто балансирует между инстансами: сам клиент или промежуточный компонент.' },
      { term: 'API Gateway', meaning: 'Единая точка входа для внешних клиентов с routing и сквозными задачами.' },
      { term: 'TLS termination', meaning: 'Расшифровка HTTPS-трафика на границе (обычно на Gateway).' },
      { term: 'Kubernetes Service', meaning: 'Абстракция Kubernetes для стабильного доступа к динамическому набору Pod.' },
    ],
    codeExample: {
      title: 'Service Discovery + Gateway routing',
      language: 'text',
      snippet: `Клиент -> API Gateway (единый hostname, auth, rate limit)
   -> orders-service (адрес через Kubernetes DNS / Service Discovery)
   -> payments-service (адрес через Kubernetes DNS / Service Discovery)

Gateway НЕ содержит: "если статус заказа X, вызвать ещё сервис Y с условием Z"
(это бизнес-логика, место которой — в самих сервисах)`,
      walkthrough: [
        'Gateway маршрутизирует запросы, но не принимает бизнес-решений внутри цепочки.',
        'Discovery отвечает за актуальный адрес каждого внутреннего сервиса независимо от Gateway.',
      ],
      commonPitfall: 'Собирать в Gateway ответ из нескольких сервисов с условной бизнес-логикой — Gateway становится узким местом разработки и единой точкой отказа.',
      productionNote: 'В Kubernetes чаще полагаются на встроенный Service Discovery (DNS + Service) и ставят Gateway только на границе кластера для внешнего трафика.',
    },
    lecturerNotes: [
      'Дожать: "чем Gateway отличается от Discovery" — многие путают эти два разных понятия.',
      'Не уходить в детальное сравнение конкретных инструментов (Eureka vs Consul vs Kubernetes) — для intern достаточно принципа.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-29': {
    simpleDefinition:
      'Distributed tracing — способ проследить путь одного запроса через несколько сервисов, связав все его шаги общим идентификатором (trace id), чтобы увидеть полную картину: где запрос провёл больше всего времени и на каком шаге что-то пошло не так.',
    quickAnswer:
      'Каждому входящему запросу присваивается trace id, а каждому шагу внутри него — span id, связанный с родительским span; данные собираются и визуализируются инструментами вроде Jaeger/Zipkin (или через стандарт OpenTelemetry). Применяется, когда один бизнес-запрос проходит через цепочку из нескольких микросервисов и по отдельным логам каждого сервиса сложно понять общую картину. Tracing не заменяет логи и метрики — это дополняющий инструмент observability.',
    explainBrief: [
      'Trace id — уникальный идентификатор всего запроса от входа в систему до конца обработки, передаётся между сервисами через заголовки.',
      'Span — отдельный именованный отрезок работы со своим id, временем начала/окончания и ссылкой на родительский span — вместе spans образуют дерево вызовов одного trace.',
      'Propagation (распространение контекста) — как trace id/span id передаются между сервисами (W3C Trace Context для HTTP, аналоги для очередей) — без этого шага цепочка spans разрывается.',
      'Jaeger/Zipkin — системы сбора и визуализации трейсов: показывают дерево spans по timeline.',
      'OpenTelemetry — современный вендоронезависимый стандарт инструментирования, который может экспортировать данные в Jaeger, Zipkin или другие backend-системы.',
      'Tracing особенно ценен при расследовании: "запрос выполнялся 3 секунды — где именно?", "ошибка произошла в цепочке из 5 сервисов — на каком шаге?".',
      'Tracing не заменяет логи (детали конкретной ошибки) и метрики (агрегированная картина) — используется вместе с ними как часть observability.',
    ],
    questionPlan: [
      {
        question: 'Что связывает записи разных сервисов в единую картину одного запроса?',
        answerHint: 'Общий trace id, передаваемый между сервисами через заголовки; каждый шаг — span со ссылкой на родителя.',
      },
      {
        question: 'Зачем нужен propagation контекста и что случится, если его не настроить?',
        answerHint: 'Без явной передачи trace id/span id цепочка трейса разрывается на границе сервисов — получится несколько несвязанных кусков.',
      },
      {
        question: 'Чем OpenTelemetry отличается от Jaeger/Zipkin?',
        answerHint: 'OpenTelemetry — стандарт инструментирования и сбора данных, вендоронезависимый; Jaeger/Zipkin — конкретные backend-системы хранения и визуализации.',
      },
      {
        question: 'Заменяет ли tracing логи и метрики?',
        answerHint: 'Нет, это дополняющий инструмент: трейсы показывают путь и тайминги запроса, логи — детали события, метрики — агрегированную картину.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен назвать trace id и span как базовые понятия, а не только "видел слово Jaeger".',
      'Понимание propagation как обязательного технического шага — критерий, отличающий поверхностное знание от практического.',
      'Явное разграничение tracing/логи/метрики — признак понимания observability как системы.',
    ],
    goodAnswer:
      'Правильно объясняет связку trace id/span, называет проблему propagation через границы сервисов, приводит конкретный сценарий использования, разграничивает tracing от логов и метрик.',
    redFlag: '"Jaeger — это просто дашборд с логами"; не знает, что такое trace id/span; считает, что tracing заменяет логирование полностью.',
    glossary: [
      { term: 'distributed tracing', meaning: 'Отслеживание пути одного запроса через несколько сервисов.' },
      { term: 'trace id', meaning: 'Уникальный идентификатор всего запроса от входа до конца обработки.' },
      { term: 'span', meaning: 'Отдельный отрезок работы внутри trace со ссылкой на родительский span.' },
      { term: 'propagation', meaning: 'Передача trace/span контекста между сервисами.' },
      { term: 'Jaeger / Zipkin', meaning: 'Системы сбора и визуализации распределённых трейсов.' },
      { term: 'OpenTelemetry', meaning: 'Вендоронезависимый стандарт инструментирования трейсов/метрик/логов.' },
      { term: 'observability', meaning: 'Совокупность логов, метрик и трейсов для понимания состояния системы.' },
    ],
    codeExample: {
      title: 'Trace с несколькими spans через сервисы',
      language: 'text',
      snippet: `trace_id=abc123
  span: api-gateway (10ms)
    span: orders-service (120ms)
      span: SQL SELECT orders (15ms)
      span: payments-service call (95ms)  <- основная задержка здесь
    span: notification-service (5ms)`,
      walkthrough: [
        'Дерево spans сразу показывает, что основная задержка — вызов payments-service, а не сама orders-service.',
        'Каждый span имеет собственное время и ссылку на родителя (orders-service).',
      ],
      commonPitfall: 'Забыть прокинуть trace-заголовки при вызове следующего сервиса (например, в асинхронном Kafka-обработчике) — трейс обрывается на два несвязанных куска.',
      productionNote: 'При расследовании инцидента tracing особенно полезен вместе с correlation id в логах — по одному trace id можно быстро перейти к конкретным строкам логов нужного сервиса.',
    },
    lecturerNotes: [
      'Дожать конкретным сценарием "запрос долго выполнялся, как найдёте узкое место" — проверяет практическое понимание.',
      'Не требовать деталей формата W3C Trace Context — для intern достаточно понимания идеи propagation.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-30': {
    simpleDefinition:
      'GoF (Gang of Four) — классический набор из 23 паттернов проектирования; на практике используется небольшое ядро из них, которые реально решают конкретную боль в коде, а не применяются "для красоты".',
    quickAnswer:
      'Чаще всего на практике: Strategy (выбор алгоритма поведения без цепочки if/else), Builder (создание объекта со множеством параметров читаемо, без телескопических конструкторов), Factory Method/Abstract Factory (создание объекта без привязки вызывающего кода к конкретному классу), Adapter (подружить несовместимый внешний интерфейс со своим кодом), Decorator (добавить поведение объекту без изменения его класса), Observer (уведомление подписчиков об изменении состояния), Template Method (общий алгоритм с шагами-переопределениями), Singleton (гарантированно один экземпляр — но в Spring эту роль обычно уже играет singleton-scoped bean).',
    explainBrief: [
      'Паттерн решает конкретную повторяющуюся проблему в конкретном контексте, а не применяется потому что "так учили" — это главный критерий уместности.',
      'Strategy инкапсулирует взаимозаменяемые алгоритмы (например, разные способы расчёта скидки) за одним интерфейсом, убирает длинные if/switch по типу.',
      'Builder — для объектов со множеством полей (часть опциональна), даёт читаемое пошаговое создание и валидацию целиком перед сборкой immutable-объекта.',
      'Adapter оборачивает несовместимый API (старую библиотеку или внешний SDK) под интерфейс, ожидаемый остальным кодом.',
      'Decorator добавляет поведение поверх объекта через обёртку с тем же интерфейсом (например, InputStream-обёртки в Java IO).',
      'Observer — publisher уведомляет подписчиков об изменении состояния; в Spring встроен через ApplicationEventPublisher/@EventListener.',
      'Singleton в классическом GoF-смысле редко нужен вручную в Spring-приложении — singleton-scoped bean уже даёт "один экземпляр на контекст" без ручной реализации.',
    ],
    questionPlan: [
      {
        question: 'Приведите пример, где вы использовали Strategy на реальном проекте.',
        answerHint: 'Например, разные способы расчёта скидки/комиссии/налога, выбираемые по типу клиента/страны — без if/else-каскада в вызывающем коде.',
      },
      {
        question: 'Чем GoF Singleton отличается от Spring singleton bean?',
        answerHint:
          'GoF Singleton — собственный класс с private-конструктором и статическим методом доступа; Spring singleton bean — просто scope контейнера, создание берёт на себя контейнер.',
      },
      {
        question: 'Когда паттерн становится вредным, а не полезным?',
        answerHint: 'Когда его добавляют "про запас" или "для best practices", усложняя код без реальной вариативности — типичный признак over-engineering.',
      },
      {
        question: 'Приведите пример Decorator из стандартной библиотеки Java.',
        answerHint: 'java.io — BufferedInputStream/InputStreamReader оборачивают другой поток того же интерфейса, добавляя поведение без изменения оборачиваемого класса.',
      },
    ],
    extraKeyPoints: [
      'Кандидат обязан привести конкретный практический пример хотя бы для одного паттерна, а не только перечислить названия.',
      'Явное разграничение GoF Singleton и Spring singleton bean — обязательный критерий, частая путаница.',
      'Понимание, что "паттерн ради паттерна" — антипаттерн (over-engineering).',
    ],
    goodAnswer:
      'Называет 3+ паттерна с конкретными практическими примерами применения, явно разводит GoF Singleton и Spring singleton bean, формулирует критерий уместности паттерна через "решает реальную боль".',
    redFlag:
      'Перечисляет названия паттернов без примеров; путает Spring singleton bean с ручной реализацией GoF Singleton; не может объяснить, зачем нужен конкретный паттерн, только его структуру.',
    glossary: [
      { term: 'GoF', meaning: 'Gang of Four — авторы классической книги о паттернах проектирования.' },
      { term: 'Strategy', meaning: 'Паттерн выбора взаимозаменяемого алгоритма через единый интерфейс.' },
      { term: 'Builder', meaning: 'Паттерн пошагового создания объекта со множеством параметров.' },
      { term: 'Factory Method / Abstract Factory', meaning: 'Паттерны создания объектов без привязки к конкретному классу.' },
      { term: 'Adapter', meaning: 'Паттерн приведения несовместимого интерфейса к ожидаемому.' },
      { term: 'Decorator', meaning: 'Паттерн добавления поведения через обёртку с тем же интерфейсом.' },
      { term: 'Observer', meaning: 'Паттерн уведомления подписчиков об изменении состояния.' },
      { term: 'Singleton', meaning: 'Паттерн гарантии единственного экземпляра класса.' },
    ],
    codeExample: {
      title: 'Strategy для расчёта скидки',
      language: 'java',
      snippet: `interface DiscountStrategy { BigDecimal apply(BigDecimal price); }

class NoDiscount implements DiscountStrategy {
  public BigDecimal apply(BigDecimal price) { return price; }
}
class PercentDiscount implements DiscountStrategy {
  private final BigDecimal percent;
  PercentDiscount(BigDecimal percent) { this.percent = percent; }
  public BigDecimal apply(BigDecimal price) {
    return price.subtract(price.multiply(percent));
  }
}

// вызывающий код не знает конкретную реализацию
BigDecimal finalPrice = discountStrategy.apply(basePrice);`,
      walkthrough: [
        'DiscountStrategy убирает if/else по типу клиента/акции из вызывающего кода.',
        'Новую стратегию скидки добавляют новым классом, не трогая существующий код.',
      ],
      commonPitfall: 'Писать классический потокобезопасный Singleton с double-checked locking внутри Spring-приложения — в 95% случаев достаточно обычного @Component/@Service.',
      productionNote: 'Оценивать паттерн не по "красоте по учебнику", а по тому, упрощает ли он реальное расширение/тестирование кода в этом конкретном месте.',
    },
    lecturerNotes: [
      'Обязательно требовать пример из практики, а не список названий — это главный дожим вопроса.',
      'Не проверять знание всех 23 паттернов — достаточно 3-4 практических.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-31': {
    simpleDefinition:
      'Strategy и State структурно почти одинаковы (интерфейс плюс сменные реализации), но разный intent (замысел): Strategy — клиент явно выбирает, какой алгоритм использовать; State — объект сам меняет своё поведение в зависимости от внутреннего состояния.',
    quickAnswer:
      'Strategy — "выбираем алгоритм": вызывающий код осознанно передаёт нужную реализацию, и она обычно не меняется сама по себе во время жизни объекта. State — "объект меняет поведение из-за внутреннего состояния": например, заказ ведёт себя по-разному в статусах NEW/PAID/SHIPPED/CANCELLED, и сам объект (или контекст) переключает текущее состояние по ходу работы.',
    explainBrief: [
      'Структурно оба паттерна выглядят одинаково: контекст держит ссылку на интерфейс, и есть несколько классов-реализаций этого интерфейса.',
      'Strategy — про выбор "как сделать" (алгоритм), сделанный снаружи или один раз при конфигурации; сама Strategy обычно не переключает себя на другую изнутри.',
      'State — про то, "что вообще можно делать сейчас", завязано на жизненный цикл объекта; переходы между состояниями — часть бизнес-логики.',
      'Частый сигнал State, а не Strategy — есть явный набор допустимых переходов (state machine) и вопрос "а можно ли сейчас сделать это действие" зависит от текущего состояния.',
      'Частый сигнал Strategy — вопрос "каким способом это сделать", где способ выбирается один раз и не меняется сам по ходу работы объекта.',
      'На практике часто путают не структуру, а именно intent: кандидат может нарисовать одинаковую диаграмму для обоих и не объяснить разницу в назначении.',
    ],
    questionPlan: [
      {
        question: 'Структурно Strategy и State отличаются друг от друга?',
        answerHint: 'Практически нет — оба построены как интерфейс плюс несколько реализаций, разница именно в intent, а не в диаграмме классов.',
      },
      {
        question: 'Приведите пример State на реальном сценарии.',
        answerHint: 'Заказ/платёж/задача с явными статусами (NEW → PAID → SHIPPED → DELIVERED, с ветками CANCELLED/REFUNDED).',
      },
      {
        question: 'Кто обычно переключает текущую реализацию в Strategy, а кто — в State?',
        answerHint: 'В Strategy — внешний код один раз выбирает реализацию; в State — переход часто инициируется самим объектом/контекстом как часть бизнес-логики.',
      },
      {
        question: 'Как быстро отличить, какой паттерн перед вами в незнакомом коде?',
        answerHint: 'Посмотреть, есть ли явная state machine с ограниченными переходами и завязка на жизненный цикл сущности, или просто взаимозаменяемый алгоритм.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен явно проговорить, что структурное сходство — не повод считать паттерны одинаковыми.',
      'Пример State должен включать понятие допустимых переходов, а не любое состояние в любое.',
      'Явное понимание "кто инициирует смену" — сильный признак глубокого понимания.',
    ],
    goodAnswer:
      'Явно говорит про структурное сходство и разницу в intent, приводит конкретный пример State с state machine и пример Strategy, объясняет, кто обычно инициирует смену в каждом случае.',
    redFlag:
      '"Strategy и State — это одно и то же, просто разные названия"; не может привести пример ни одного из паттернов; путает, где применяется state machine, а где — просто выбор реализации.',
    glossary: [
      { term: 'Strategy', meaning: 'Паттерн выбора алгоритма, назначаемого извне.' },
      { term: 'State', meaning: 'Паттерн смены поведения в зависимости от внутреннего состояния объекта.' },
      { term: 'intent', meaning: 'Замысел паттерна — для чего он применяется, а не только его структура.' },
      { term: 'state machine', meaning: 'Конечный автомат — модель с состояниями и допустимыми переходами между ними.' },
    ],
    codeExample: {
      title: 'Strategy vs State: одна структура, разный intent',
      language: 'java',
      snippet: `// Strategy: выбор алгоритма, назначается один раз
interface DiscountStrategy { BigDecimal apply(BigDecimal price); }

// State: объект меняет поведение по ходу работы, есть допустимые переходы
interface OrderState {
  OrderState pay();     // NEW -> PAID
  OrderState ship();    // PAID -> SHIPPED, из NEW бросит исключение
}`,
      walkthrough: [
        'DiscountStrategy — одна реализация на весь срок использования, выбор снаружи.',
        'OrderState — методы pay()/ship() возвращают новое состояние, доступность метода зависит от текущего.',
      ],
      commonPitfall: 'Реализовать статусы заказа через Strategy без state machine (без явных допустимых переходов) — теряется главная ценность паттерна State.',
      productionNote: 'State особенно полезен, когда допустимые переходы часто меняются бизнес-требованиями — явный state machine проще расширять и тестировать, чем набор if/else по строковому статусу.',
    },
    lecturerNotes: [
      'Главный дожим: попросить пример State с явными допустимыми переходами — просто "у объекта есть статус" недостаточно.',
      'Не тратить время на UML-диаграммы — фокус на intent, а не на структуре.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-32': {
    simpleDefinition:
      'Builder — паттерн создания объекта пошагово через отдельный вспомогательный объект (builder), который накапливает значения полей и в конце собирает финальный (обычно immutable) объект одним вызовом build(), вместо одного конструктора с длинным списком параметров.',
    quickAnswer:
      'Использовать Builder, когда у объекта много параметров, часть из них опциональна, и порядок/значение параметров легко перепутать в обычном конструкторе (телескопические конструкторы — несколько перегрузок на разные комбинации параметров — красный флаг, что пора переходить на Builder). Builder делает создание объекта читаемым, позволяет провалидировать всё вместе перед созданием immutable-объекта в build(), и не подходит, если у объекта всего 2-3 простых обязательных поля.',
    explainBrief: [
      'Телескопические конструкторы (несколько перегруженных конструкторов с разным числом параметров) — главный сигнал "пора Builder".',
      'Builder делает вызов самодокументируемым: именованные шаги читаются понятнее, чем позиционные аргументы длинного конструктора.',
      'Опциональные поля — естественная часть Builder: не указанные шаги остаются со значением по умолчанию.',
      'Валидация целиком (все инварианты объекта сразу) логично помещается в build(), а не размазывается по сеттерам.',
      'Итоговый объект обычно immutable (final-поля, без сеттеров) — Builder является единственным "мутируемым" шагом создания.',
      'Не нужен для объекта с 2-3 обязательными простыми полями без вариативности — там обычный конструктор короче и понятнее.',
      'В Java Builder часто пишут вручную (внутренний static class Builder) или генерируют через библиотеку (Lombok @Builder) — идея та же.',
    ],
    questionPlan: [
      {
        question: 'Какой конкретный признак в коде говорит, что пора заменить конструктор на Builder?',
        answerHint: 'Телескопические конструкторы или конструктор с 5+ параметрами, часть из которых опциональна и легко перепутать местами.',
      },
      {
        question: 'Почему итоговый объект Builder обычно делают immutable?',
        answerHint: 'Пошаговое накопление происходит в самом builder (он и есть мутируемая часть), результат build() — уже готовый неизменяемый объект.',
      },
      {
        question: 'Где логично разместить проверку обязательных полей/бизнес-инвариантов у Builder?',
        answerHint: 'Внутри build() — так объект либо создаётся полностью валидным, либо build() сразу бросает исключение.',
      },
      {
        question: 'Когда Builder — это overkill (лишнее усложнение)?',
        answerHint: 'Объект с 2-3 простыми обязательными полями без опциональности и риска перепутать порядок — обычный конструктор проще.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен явно назвать телескопические конструкторы как конкретный, узнаваемый сигнал для перехода к Builder.',
      'Понимание, что валидация в build() — не опция, а именно место, где гарантируют целостность объекта.',
      'Явное признание, что Builder не всегда нужен — критерий "не паттерн ради паттерна".',
    ],
    goodAnswer:
      'Называет телескопические конструкторы как конкретный триггер, объясняет размещение валидации в build(), связывает Builder с immutable-результатом и явно называет случай, когда Builder не нужен.',
    redFlag:
      '"Builder нужен всегда для любого класса с полями"; не видит связи между Builder и immutable-объектом; не может объяснить, зачем нужна валидация в build(), а не в сеттерах.',
    glossary: [
      { term: 'Builder', meaning: 'Паттерн пошагового создания объекта через отдельный вспомогательный класс.' },
      { term: 'телескопический конструктор', meaning: 'Несколько перегруженных конструкторов с разным числом параметров.' },
      { term: 'immutable-объект', meaning: 'Объект с неизменяемым состоянием после создания.' },
      { term: 'build()', meaning: 'Финальный метод Builder, создающий и валидирующий итоговый объект.' },
      { term: 'Lombok @Builder', meaning: 'Аннотация, автоматически генерирующая класс Builder для сущности.' },
    ],
    codeExample: {
      title: 'Builder с валидацией в build()',
      language: 'java',
      snippet: `class OrderRequest {
  private final String customerId;
  private final List<Item> items;
  private final String comment; // опционально

  private OrderRequest(Builder b) {
    this.customerId = b.customerId;
    this.items = b.items;
    this.comment = b.comment;
  }

  static class Builder {
    private String customerId;
    private List<Item> items = new ArrayList<>();
    private String comment;

    Builder customerId(String v) { this.customerId = v; return this; }
    Builder items(List<Item> v) { this.items = v; return this; }
    Builder comment(String v) { this.comment = v; return this; }

    OrderRequest build() {
      if (customerId == null) throw new IllegalStateException("customerId required");
      if (items.isEmpty()) throw new IllegalStateException("items must not be empty");
      return new OrderRequest(this);
    }
  }
}`,
      walkthrough: [
        'comment — опциональное поле, не требует обязательного вызова у клиента.',
        'build() проверяет обязательные customerId и непустой items прежде чем создать итоговый immutable-объект.',
      ],
      commonPitfall:
        'Разрешить получить наружу ещё не полностью настроенный объект через промежуточный getter самого builder — теряется гарантия, что итоговый объект всегда валиден целиком.',
      productionNote: 'Для DTO с 10+ опциональными полями Builder плюс валидация в build() снижает число багов "забыли обязательное поле" по сравнению с сеттерами на голом POJO.',
    },
    lecturerNotes: [
      'Ключевой дожим: "а где вы проверяете обязательные поля" — многие забывают про валидацию в build().',
      'Не путать с фактом, что title содержит слово "конструктор" — buildKnowledgeBoost может добавить пункт про super()/this(), это нормально, не редфлаг сам по себе.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-33': {
    simpleDefinition:
      'Unit-тест проверяет один маленький кусок логики в изоляции (без реальной БД/сети). Integration-тест проверяет взаимодействие компонента с реальной инфраструктурой (Spring-контекст, БД, Kafka, HTTP). E2E (end-to-end) тест проверяет весь сценарий целиком через систему так, как это делает реальный пользователь/клиент.',
    quickAnswer:
      'Unit — быстрый, изолированный, зависимости замоканы, тестирует логику одного класса/метода. Integration — поднимает часть реальной инфраструктуры (Spring context, тестовую БД через Testcontainers, embedded Kafka) и проверяет, что компоненты работают вместе правильно. E2E — самый дорогой и медленный, гоняет реальный сценарий через весь стек. Правильное распределение — тестовая пирамида: много unit-тестов, меньше integration, ещё меньше e2e, потому что чем выше уровень, тем дороже (медленнее, более хрупкий).',
    explainBrief: [
      'Unit-тест не трогает реальную БД/сеть/файловую систему; зависимости — mock/stub; цель — быстро проверить логику класса в изоляции.',
      'Integration-тест поднимает реальный (или near-real) кусок инфраструктуры: Spring context целиком или его срез, реальную БД в контейнере, реальный брокер сообщений.',
      'E2E-тест — сценарий "как настоящий пользователь/внешний клиент": вызов через реальный HTTP API снаружи, минимум моков.',
      'Тестовая пирамида — модель распределения количества тестов по уровням: широкое основание unit-тестов, сужающийся integration-слой, тонкая верхушка e2e.',
      'Частая ошибка — "перевёрнутая пирамида": мало unit-тестов, вся уверенность держится на медленных и хрупких e2e-тестах.',
      'Другая частая ошибка — мокать всё подряд даже в integration-тестах — тест перестаёт проверять реальное взаимодействие, ради которого его писали.',
      'Критерий выбора уровня — что именно нужно проверить: чистую логику ветвления — unit; правильность SQL/маппинга/конфигурации — integration; весь пользовательский путь — e2e.',
    ],
    questionPlan: [
      {
        question: 'Чем именно integration-тест отличается от unit-теста, если оба написаны на JUnit?',
        answerHint: 'Unit — все зависимости замоканы, ничего реального не поднимается; integration — реально поднимается часть инфраструктуры.',
      },
      {
        question: 'Почему e2e-тестов обычно значительно меньше, чем unit?',
        answerHint: 'E2E дороже по времени выполнения, более хрупкие, сложнее локализовать причину падения — держат только для критичных сквозных сценариев.',
      },
      {
        question: 'Что не так с "integration-тестом", где замокан весь Spring context и реальная БД?',
        answerHint: 'Он не проверяет реальное взаимодействие — по сути это unit-тест, назвавший себя integration.',
      },
      {
        question: 'Что вы тестируете unit-тестом, а что не имеет смысла тестировать на этом уровне?',
        answerHint: 'Чистую бизнес-логику/расчёты — unit; корректность реального SQL-запроса, сериализации, конфигурации Spring — не unit.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен явно объяснить критерий "что именно проверяет каждый уровень".',
      'Понимание тестовой пирамиды как модели соотношения количества тестов по уровням.',
      'Явное упоминание антипаттерна "мокать всё в integration-тесте".',
    ],
    goodAnswer:
      'Чётко разводит уровни по тому, что реально поднимается/мокается на каждом, объясняет тестовую пирамиду и её мотивацию, называет антипаттерн переворота пирамиды или излишнего мокания.',
    redFlag:
      '"Unit, integration и e2e — это просто разные названия для тестов" без объяснения отличий; не может объяснить тестовую пирамиду; считает, что чем больше e2e-тестов, тем лучше покрытие.',
    glossary: [
      { term: 'unit-тест', meaning: 'Тест одного маленького куска логики в изоляции.' },
      { term: 'integration-тест', meaning: 'Тест взаимодействия компонента с реальной инфраструктурой.' },
      { term: 'e2e-тест', meaning: 'Тест всего сценария через систему как реальный пользователь.' },
      { term: 'тестовая пирамида', meaning: 'Модель распределения количества тестов: много unit, меньше integration, мало e2e.' },
      { term: 'mock / stub', meaning: 'Замена реальной зависимости на управляемый заменитель в тесте.' },
    ],
    codeExample: {
      title: 'Unit vs integration тест одного и того же метода',
      language: 'java',
      snippet: `// unit: репозиторий замокан
@Test
void unit_shouldApplyDiscount() {
  OrderService service = new OrderService(mockRepository, discountStrategy);
  assertEquals(90, service.calculateTotal(order));
}

// integration: реальная PostgreSQL через Testcontainers
@SpringBootTest
@Testcontainers
class OrderRepositoryIT {
  @Container static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:16");
  @Test void shouldPersistOrder() { /* реальный SQL, реальная БД */ }
}`,
      walkthrough: [
        'Unit-тест проверяет только логику calculateTotal, БД вообще не участвует.',
        'Integration-тест поднимает реальный PostgreSQL в Docker и проверяет реальное сохранение.',
      ],
      commonPitfall: 'Называть тестом с @SpringBootTest и всеми замоканными @MockBean зависимостями "integration-тестом" — фактически это unit-тест с лишним, медленным поднятием Spring context.',
      productionNote: 'В CI разумно разделять запуск unit (на каждый commit, быстро) и integration/e2e (реже, например на PR или перед релизом).',
    },
    lecturerNotes: [
      'Дожать примером: "а это integration или unit тест, если в @SpringBootTest всё замокано" — хороший фильтр глубины понимания.',
      'Не требовать точных цифр соотношения пирамиды — важен принцип, не конкретные проценты.',
    ],
    estimatedMinutes: 2,
  },

  'int-intern-34': {
    simpleDefinition:
      '@SpringBootTest поднимает полный (или почти полный) Spring-контекст приложения для теста; slice-тесты (@WebMvcTest, @DataJpaTest) поднимают только нужный срез контекста для конкретного слоя; @MockBean подменяет конкретный бин в контексте на мок; Testcontainers поднимает реальную инфраструктуру (PostgreSQL, Kafka и т.д.) в Docker-контейнере прямо во время теста.',
    quickAnswer:
      '@SpringBootTest — полный контекст, для настоящих integration/e2e-сценариев внутри приложения (медленнее). @WebMvcTest — только web-слой без реальной БД. @DataJpaTest — только JPA-слой с тестовой БД. @MockBean регистрирует mock конкретного бина прямо в Spring-контексте. Testcontainers поднимает настоящий PostgreSQL/Kafka в Docker для теста — поведение максимально близкое к продовому, а не эмуляция вроде in-memory H2.',
    explainBrief: [
      '@SpringBootTest поднимает весь (или явно указанный) контекст приложения — самый "тяжёлый", но самый реалистичный вариант теста внутри Spring.',
      'Slice-тесты (@WebMvcTest, @DataJpaTest и другие) поднимают только часть контекста, relevantную конкретному слою — быстрее полного @SpringBootTest, но не проверяют интеграцию слоёв между собой.',
      '@MockBean добавляет/заменяет бин в Spring-контексте мок-объектом на время теста; полезен, когда нужно оставить реальным весь контекст, кроме одной внешней зависимости.',
      'Testcontainers поднимает реальный образ (PostgreSQL/Kafka/Redis и т.д.) в Docker перед тестом и корректно останавливает после.',
      'Использование in-memory БД (H2) вместо реального PostgreSQL для integration-тестов рискованно — диалект SQL, типы данных, поведение constraints могут отличаться от продовой БД.',
      'Не стоит мокать всё подряд даже в тесте, помеченном как integration: если замокать репозиторий в "integration"-тесте, теряется весь смысл проверки реальной работы с БД.',
      'Testcontainers обычно комбинируют с @DynamicPropertySource, чтобы прокинуть реальный host/port поднятого контейнера в конфигурацию Spring-контекста для теста.',
    ],
    questionPlan: [
      {
        question: 'Чем @WebMvcTest отличается от @SpringBootTest?',
        answerHint: '@WebMvcTest поднимает только web-слой без реальной БД и остального контекста; @SpringBootTest поднимает полный контекст приложения.',
      },
      {
        question: 'Когда использовать @MockBean, а когда — реальный бин в тесте?',
        answerHint: '@MockBean — для внешних/дорогих/недетерминированных зависимостей; реальный бин — для того, что как раз и хотим проверить в интеграции.',
      },
      {
        question: 'Почему Testcontainers предпочтительнее in-memory H2 для integration-тестов с PostgreSQL-специфичным SQL?',
        answerHint: 'H2 эмулирует PostgreSQL неполно — отличия в диалекте/функциях/constraints могут дать ложно-зелёный тест.',
      },
      {
        question: 'Что не так с integration-тестом, где замокан репозиторий?',
        answerHint: 'Теряется смысл интеграционной проверки — тест перестаёт проверять реальную работу с БД, фактически превращаясь в unit-тест с лишним overhead.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен знать минимум 2 вида slice-тестов и разницу с полным @SpringBootTest.',
      'Понимание риска in-memory БД вместо Testcontainers для PostgreSQL-специфичного кода — критерий глубины.',
      'Явное правило "не мокать то, что как раз проверяем" в integration-тестах.',
    ],
    goodAnswer:
      'Различает @SpringBootTest и slice-тесты по объёму поднимаемого контекста, знает точное назначение @MockBean, объясняет, почему Testcontainers предпочтительнее H2 для реалистичных integration-тестов.',
    redFlag:
      '"@MockBean и Mockito.mock() — это одно и то же" без уточнения контекста Spring; не знает, что такое slice-тесты; считает in-memory H2 полноценной заменой реальному PostgreSQL для любых тестов.',
    glossary: [
      { term: '@SpringBootTest', meaning: 'Поднимает полный Spring-контекст приложения для теста.' },
      { term: '@WebMvcTest / @DataJpaTest', meaning: 'Slice-тесты, поднимающие только web-слой или JPA-слой соответственно.' },
      { term: '@MockBean', meaning: 'Регистрирует мок конкретного бина в Spring-контексте теста.' },
      { term: 'Testcontainers', meaning: 'Библиотека для поднятия реальной инфраструктуры в Docker на время теста.' },
      { term: '@DynamicPropertySource', meaning: 'Механизм прокидывания динамических свойств (host/port контейнера) в Spring-контекст теста.' },
    ],
    codeExample: {
      title: '@SpringBootTest + Testcontainers + @MockBean',
      language: 'java',
      snippet: `@SpringBootTest
@Testcontainers
class OrderServiceIT {
  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

  @DynamicPropertySource
  static void props(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
  }

  @MockBean
  PaymentGatewayClient paymentGatewayClient; // внешний HTTP-клиент замокан

  @Autowired
  OrderService orderService; // реальный бин, реальная БД
}`,
      walkthrough: [
        'PostgreSQLContainer поднимает настоящий PostgreSQL в Docker для реалистичного теста.',
        '@MockBean заменяет только внешний HTTP-клиент, а не весь контекст — репозиторий и БД остаются реальными.',
      ],
      commonPitfall: 'Тестировать JPA-репозиторий на H2 вместо реального PostgreSQL через Testcontainers — специфичные для PostgreSQL вещи в H2 просто не воспроизведутся.',
      productionNote: 'Testcontainers в CI требует доступного Docker на раннере — стоит заранее убедиться, что пайплайн это поддерживает.',
    },
    lecturerNotes: [
      'Дожать: "что именно вы замокаете в этом тесте, а что оставите реальным" — проверяет практическое понимание границ.',
      'Не требовать деталей настройки конкретных версий Testcontainers/образов — важен принцип.',
    ],
    estimatedMinutes: 3,
  },

  'int-intern-35': {
    simpleDefinition:
      'JMeter — инструмент для нагрузочного (load) и производительного (performance) тестирования: он имитирует множество параллельных пользователей/запросов к системе и измеряет, как она себя ведёт под нагрузкой.',
    quickAnswer:
      'JMeter используют, чтобы проверить, как система ведёт себя под ожидаемой (и повышенной) нагрузкой ещё до того, как это увидят реальные пользователи: сколько запросов в секунду система выдерживает (throughput/RPS), какая задержка ответа (latency), с какого момента начинаются ошибки (error rate) и что именно становится узким местом при насыщении (saturation) — CPU, память, пул соединений к БД, пул потоков. Критические метрики — не только средняя latency, а перцентили p95/p99, throughput/RPS, error rate под нагрузкой, и метрики насыщения ресурсов.',
    explainBrief: [
      'Throughput/RPS (requests per second) — сколько запросов система реально обрабатывает в секунду при заданной нагрузке; сравнивается с целевым SLA.',
      'Latency — время ответа; смотреть нужно не только average, а перцентили p95/p99, показывающие задержку для самых медленных запросов.',
      'Error rate — доля запросов с ошибкой под нагрузкой; рост error rate при увеличении нагрузки обычно сигнализирует о достижении предела (saturation point).',
      'Saturation (насыщение) — момент, когда какой-то ресурс (CPU, память, пул соединений к БД, пул потоков веб-сервера) исчерпан и становится узким местом.',
      'Смотреть только на average latency — распространённая ошибка: система может иметь хорошую среднюю задержку, но заметный процент очень медленных запросов (long tail).',
      'JMeter-сценарий обычно строят по реалистичному профилю нагрузки: постепенный рост числа виртуальных пользователей (ramp-up), удержание пиковой нагрузки (steady state), иногда резкий всплеск (spike test).',
      'Для полноты картины JMeter-метрики сопоставляют с метриками самого приложения/инфраструктуры (CPU/memory/GC паузы/DB pool usage).',
    ],
    questionPlan: [
      {
        question: 'Почему средней (average) latency недостаточно для оценки производительности?',
        answerHint: 'Average скрывает "длинный хвост" — часть запросов может отвечать заметно медленнее; нужны перцентили p95/p99.',
      },
      {
        question: 'Что такое saturation и как её обнаружить в тесте?',
        answerHint: 'Момент, когда конкретный ресурс (CPU, DB connection pool, thread pool) исчерпан и ограничивает дальнейший рост throughput.',
      },
      {
        question: 'Зачем делать ramp-up вместо мгновенной максимальной нагрузки?',
        answerHint: 'Постепенный рост числа пользователей показывает, при каком уровне нагрузки начинают расти latency/error rate.',
      },
      {
        question: 'Что означает рост error rate вместе с ростом latency под увеличивающейся нагрузкой?',
        answerHint: 'Система, скорее всего, достигла точки насыщения — какой-то ресурс исчерпан, запросы либо ждут дольше таймаута, либо получают явные ошибки.',
      },
    ],
    extraKeyPoints: [
      'Кандидат должен явно назвать перцентили (p95/p99) как более важный показатель, чем средняя latency.',
      'Понимание saturation через конкретные ресурсы (CPU/memory/DB pool/thread pool), а не абстрактно "стало плохо".',
      'Знание, что JMeter-результаты нужно сопоставлять с метриками системы, а не смотреть изолированно.',
    ],
    goodAnswer:
      'Называет минимум throughput/RPS, перцентили latency (p95/p99) и error rate как ключевые метрики, объясняет saturation через конкретный исчерпанный ресурс, знает про важность профиля нагрузки.',
    redFlag:
      '"JMeter просто проверяет, что сайт не падает"; ориентируется только на average latency; не может назвать ни одного конкретного ресурса, который может стать узким местом.',
    glossary: [
      { term: 'JMeter', meaning: 'Инструмент нагрузочного и производительного тестирования.' },
      { term: 'throughput / RPS', meaning: 'Количество запросов, обрабатываемых системой в секунду.' },
      { term: 'latency', meaning: 'Время ответа системы на запрос.' },
      { term: 'percentile (p95/p99)', meaning: 'Задержка, хуже которой получают только 5%/1% самых медленных запросов.' },
      { term: 'error rate', meaning: 'Доля запросов с ошибкой под нагрузкой.' },
      { term: 'saturation', meaning: 'Исчерпание конкретного ресурса, ограничивающее дальнейший рост throughput.' },
      { term: 'ramp-up', meaning: 'Постепенное увеличение числа виртуальных пользователей в нагрузочном тесте.' },
    ],
    codeExample: {
      title: 'Структура JMeter test plan и ключевые метрики',
      language: 'text',
      snippet: `Thread Group: 500 users, ramp-up 60s, duration 10m
  HTTP Request Sampler: POST /orders
  Listeners: Summary Report, Response Time percentiles

Итоговый отчёт:
  Throughput: 850 req/s
  p50: 45ms, p95: 210ms, p99: 620ms  <- важнее average
  Error rate: 0.2% -> начинает расти после 700 req/s (saturation point)`,
      walkthrough: [
        'ramp-up 60s постепенно наращивает нагрузку, чтобы найти точку начала деградации.',
        'p95/p99 показывают проблему, которую average 60ms мог бы полностью скрыть.',
      ],
      commonPitfall: 'Отчитываться только средней latency в отчёте о нагрузочном тестировании — маскирует long tail задержек, которые реально видят часть пользователей.',
      productionNote: 'Нагрузочный профиль в JMeter стоит строить по реальным данным продовой нагрузки (пиковый RPS, паттерн трафика), а не по произвольно выбранным числам.',
    },
    lecturerNotes: [
      'Дожать: "а что если average хороший, а p99 плохой" — проверяет, действительно ли кандидат понимает роль перцентилей.',
      'Не требовать точной настройки JMeter test plan (Thread Group параметры и т.д.) — фокус на метриках и их интерпретации.',
    ],
    estimatedMinutes: 2,
  },
};
