import type { LectureModule } from './schema';
import { topic } from './module-1';

const MODULE5_LINKS = [
  {
    title: 'Java SE 11 API',
    url: 'https://docs.oracle.com/en/java/javase/11/docs/api/index.html',
    description: 'Официальная документация Java 11 по исключениям, коллекциям, потокам и Stream API.',
  },
  {
    title: 'Maven Lifecycle',
    url: 'https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html',
    description: 'Фазы жизненного цикла Maven и их назначение.',
  },
  {
    title: 'Git Book',
    url: 'https://git-scm.com/book/en/v2',
    description: 'Справочник по Git командам revert, reset, stash и работе с историей.',
  },
];

export const module5: LectureModule = {
  id: 'module-5',
  title: 'Module 5: Final Test Preparation',
  targetDurationMinutes: 60,
  audienceLevel: 'Java interns',
  isAvailable: true,
  summary:
    'Финальная теоретическая подготовка к тесту: исключения, I/O, многопоточность, Maven/Git, паттерны и SOLID, сеть/HTTP/Tomcat, Core Java, коллекции и Stream API.',
  topics: [
    topic({
      id: 'final-exceptions-io',
      title: 'Исключения, finally и I/O',
      quickAnswer:
        'Ключевые слова обработки: try/catch/throw; finally нужен для гарантированного cleanup; I/O-ресурсы закрывают автоматически через try-with-resources.',
      explainBrief: [
        'try содержит рискованный код, catch перехватывает исключения, throw выбрасывает исключение явно.',
        'finally выполняется независимо от успеха/ошибки и часто используется для освобождения ресурсов.',
        'Для I/O важно закрывать потоки и корректно обрабатывать IOException.',
        'try-with-resources — удобный и безопасный способ гарантированного закрытия AutoCloseable.',
        'Контрольный вопрос: какой блок отрабатывает и при успехе, и при ошибке? (finally).',
        'Контрольный вопрос: чем обычно закрывают I/O в новом коде? (try-with-resources).',
      ],
      glossary: [
        { term: 'try/catch/throw', meaning: 'Базовые элементы обработки исключений: выполнение, перехват и явный выброс.' },
        { term: 'finally', meaning: 'Блок, который выполняется независимо от результата try/catch.' },
        { term: 'try-with-resources', meaning: 'Конструкция для автоматического закрытия AutoCloseable-ресурсов.' },
        { term: 'IOException', meaning: 'Проверяемое исключение при ошибках ввода-вывода.' },
      ],
      interviewFocus: [
        {
          question: 'Почему finally важен даже при успешном выполнении try?',
          expectedAnswer: 'Потому что в finally помещают код, который должен выполниться всегда (например, cleanup).',
        },
      ],
      codeExample: {
        title: 'try-with-resources как стандарт I/O',
        language: 'java',
        snippet: `try (BufferedReader reader = Files.newBufferedReader(path)) {
    String line = reader.readLine();
    System.out.println(line);
} catch (IOException ex) {
    throw new IllegalStateException("I/O failed", ex);
}`,
        walkthrough: [
          'Ресурс закрывается автоматически по завершении блока.',
          'Ошибка не игнорируется: её поднимают выше в осмысленном виде.',
        ],
        commonPitfall: 'Оставлять открытые потоки или глотать исключения пустым catch.',
      },
      usefulLinksOverride: MODULE5_LINKS,
      estimatedMinutes: 8,
    }),
    topic({
      id: 'final-concurrency',
      title: 'Потоки и java.util.concurrent',
      quickAnswer:
        'Ключевые элементы: состояния потока, пакет java.util.concurrent, Executors, Lock и дисциплина lock/unlock через try/finally.',
      explainBrief: [
        'Состояния Thread важны для диагностики зависаний и блокировок.',
        'Executors создаёт пулы потоков через фабричные методы (fixed, scheduled и др.).',
        'Lock даёт явное управление блокировкой, но требует дисциплины lock/unlock.',
        'Контрольный вопрос: какой пакет дают для high-level concurrency? (java.util.concurrent).',
        'Контрольный вопрос: какие фабрики Executors чаще всего вспоминают? (newFixedThreadPool, newScheduledThreadPool).',
      ],
      glossary: [
        { term: 'Thread.State', meaning: 'Набор состояний потока в JVM, включая RUNNABLE и TERMINATED.' },
        { term: 'java.util.concurrent', meaning: 'Пакет с готовыми инструментами многопоточности.' },
        { term: 'Executors', meaning: 'Фабрика для создания и конфигурации пулов потоков.' },
        { term: 'Lock', meaning: 'Интерфейс явной синхронизации, например ReentrantLock.' },
      ],
      interviewFocus: [
        {
          question: 'Почему lock/unlock требует try/finally?',
          expectedAnswer: 'Чтобы гарантированно освобождать блокировку даже при исключении.',
        },
      ],
      codeExample: {
        title: 'ReentrantLock шаблон',
        language: 'java',
        snippet: `private final Lock lock = new ReentrantLock();

public void update() {
    lock.lock();
    try {
        // critical section
    } finally {
        lock.unlock();
    }
}`,
        walkthrough: [
          'lock перед критической секцией, unlock в finally.',
          'Такой шаблон защищает от дедлоков при исключениях.',
        ],
        commonPitfall: 'Вызвать lock и забыть unlock.',
      },
      usefulLinksOverride: MODULE5_LINKS,
      estimatedMinutes: 8,
    }),
    topic({
      id: 'final-maven-git',
      title: 'Maven и Git для теста',
      quickAnswer:
        'Maven: compile/verify/install — рабочие фазы; Git: revert делает обратный коммит, reset двигает локальное состояние, stash временно убирает изменения из рабочего дерева.',
      explainBrief: [
        'compile компилирует проект, verify запускает проверки, install кладёт артефакт в локальный репозиторий.',
        'git revert безопасен для общей истории, потому что не переписывает её.',
        'git reset меняет локальное состояние, использовать нужно осознанно.',
        'git stash удобен перед переключением веток и быстрой очисткой рабочего дерева.',
        'Контрольный вопрос: чем безопасно отменять уже опубликованный коммит? (git revert).',
        'Контрольный вопрос: какой командой временно убрать локальные правки? (git stash).',
      ],
      glossary: [
        { term: 'Maven lifecycle', meaning: 'Набор фаз сборки проекта от компиляции до публикации артефакта.' },
        { term: 'git revert', meaning: 'Создает новый коммит, который отменяет изменения целевого коммита.' },
        { term: 'git reset', meaning: 'Перемещает указатель и/или рабочее состояние локального репозитория.' },
        { term: 'git stash', meaning: 'Временно сохраняет незакоммиченные изменения вне рабочего дерева.' },
      ],
      interviewFocus: [
        {
          question: 'Почему revert обычно безопаснее reset для уже опубликованных коммитов?',
          expectedAnswer: 'revert сохраняет историю и добавляет явный обратный коммит.',
        },
      ],
      codeExample: {
        title: 'Команды для тренировки',
        language: 'text',
        snippet: `mvn compile
mvn verify
mvn install

git revert <sha>
git reset --hard <sha>
git stash`,
        walkthrough: [
          'Проговаривайте не только команду, но и эффект на историю/рабочее дерево.',
        ],
        commonPitfall: 'Путать revert и reset по последствиям для истории.',
      },
      usefulLinksOverride: MODULE5_LINKS,
      estimatedMinutes: 7,
    }),
    topic({
      id: 'final-patterns-solid',
      title: 'Паттерны и SOLID (Builder, Decorator, DIP)',
      quickAnswer:
        'Builder часто делают через вложенный static class; Decorator расширяет поведение через обёртку; DIP требует зависимости от абстракций вместо concrete-классов.',
      explainBrief: [
        'SRP: одна причина изменения класса — не смешивать бизнес-логику, БД и email в одном сервисе.',
        'OCP: новый сценарий — новая `PaymentStrategy`, а не ещё один `if` в старом коде.',
        'LSP: `Penguin extends Bird` с `fly()` и `UnsupportedOperationException` — антипример; лучше `Flyable` отдельно.',
        'ISP: fat interface с лишними методами хуже нескольких узких контрактов.',
        'DIP: сервис зависит от `PaymentGateway`/`Notifier`, а не от `StripeClient`/`EmailSender`.',
        'SOLID не ради интерфейсов, а ради снижения хрупкости, тестируемости и каскадных правок.',
        'Красный флаг на собесе: только расшифровка букв без примеров из кода.',
        'Builder — вложенный static class; Decorator — обёртка; контрольный вопрос по DIP — зависимость от абстракций.',
      ],
      glossary: [
        { term: 'Builder', meaning: 'Паттерн пошаговой сборки сложного объекта.' },
        { term: 'Decorator', meaning: 'Паттерн обёртки для добавления поведения без изменения исходного класса.' },
        { term: 'DIP', meaning: 'Dependency Inversion Principle: зависеть от абстракций, а не реализаций.' },
      ],
      interviewFocus: [
        {
          question: 'Как DIP влияет на тестируемость?',
          expectedAnswer: 'Через абстракции проще подменять зависимости моками/стабами в тестах.',
        },
      ],
      codeExample: {
        title: 'DIP на уровне конструктора',
        language: 'java',
        snippet: `class PaymentService {
    private final PaymentGateway gateway;

    PaymentService(PaymentGateway gateway) {
        this.gateway = gateway;
    }
}`,
        walkthrough: [
          'Сервис зависит от интерфейса PaymentGateway, а не от конкретного класса.',
        ],
        commonPitfall: 'Жёстко new-ить конкретный dependency внутри сервиса; расшифровывать SOLID без живых примеров.',
        productionNote:
          'Если после «улучшения архитектуры» стало больше файлов, а менять код не стало легче — SOLID применили формально.',
      },
      usefulLinksOverride: MODULE5_LINKS,
      estimatedMinutes: 7,
    }),
    topic({
      id: 'final-network-web',
      title: 'OSI, HTTP, Tomcat и жизненный цикл сервлета',
      simpleDefinitionOverride:
        'Эта тема связывает сетевую диагностику и серверную обработку HTTP: OSI помогает локализовать сбой по уровням, свойства HTTP-методов задают безопасную стратегию повторов, а Tomcat как контейнер сервлетов управляет созданием сервлета, обработкой запросов и завершением его жизненного цикла.',
      quickAnswer:
        'OSI используют как чек-лист уровней (физика -> приложение), чтобы не спорить «где именно проблема». POST/PATCH обычно неидемпотентны, поэтому ретраи требуют аккуратности. Tomcat — servlet container: поднимает сервлет, вызывает init один раз, service/doGet/doPost на запросах и destroy при остановке.',
      explainBrief: [
        'OSI нужна как карта уровней при обсуждении сетевых проблем: сначала канал/сеть/транспорт, потом протокол приложения.',
        'Идемпотентность HTTP-методов влияет на стратегию ретраев: повтор не должен ломать бизнес-состояние.',
        'POST обычно создаёт ресурс или инициирует действие, PATCH вносит частичное изменение и тоже может быть неидемпотентным в конкретной реализации.',
        'Tomcat исполняет сервлеты/JSP, маршрутизирует HTTP-запрос к нужному servlet и управляет жизненным циклом его экземпляра.',
        'Жизненный цикл сервлета: init (подготовка), service/doXxx (обработка запросов), destroy (освобождение ресурсов).',
        'Контрольный вопрос: какой компонент в Java web принимает HTTP и передает его в сервлет? (servlet container, например Tomcat).',
      ],
      glossary: [
        {
          term: 'OSI',
          meaning:
            'Сетевая модель из 7 уровней, которую используют как «дорожную карту» при поиске причины сетевой проблемы.',
        },
        {
          term: 'Идемпотентность',
          meaning:
            'Свойство операции давать тот же итоговый результат при повторном выполнении с теми же входными данными.',
        },
        {
          term: 'Servlet container',
          meaning:
            'Среда выполнения сервлетов (например, Tomcat), которая принимает HTTP-запросы и передаёт их в Java-код.',
        },
        {
          term: 'Servlet lifecycle',
          meaning:
            'Набор этапов жизни сервлета: init -> service/doGet/doPost -> destroy.',
        },
      ],
      interviewFocus: [
        {
          question: 'Почему POST обычно неидемпотентен?',
          expectedAnswer: 'Повторный POST часто создаёт новый ресурс или повторяет действие.',
        },
      ],
      codeExample: {
        title: 'Сервлет в минимуме',
        language: 'java',
        snippet: `public class PingServlet extends HttpServlet {
    @Override
    public void init() { }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.getWriter().write("pong");
    }
}`,
        walkthrough: [
          'init вызывается один раз при инициализации, service/doGet — на запросах.',
        ],
        commonPitfall: 'Путать контейнер сервлетов с СУБД или брокером сообщений.',
      },
      usefulLinksOverride: MODULE5_LINKS,
      estimatedMinutes: 8,
    }),
    topic({
      id: 'final-core-java-theory',
      title: 'ClassLoader, интерфейсы, enum, наследование',
      quickAnswer:
        'В Java есть Bootstrap/Platform/App classloader; сериализация поддерживается через Serializable/Externalizable; интерфейс задаёт контракт, enum может иметь конструктор и implement интерфейсы; наследуются доступные члены, но не конструкторы.',
      explainBrief: [
        'ClassLoader модель проверяет понимание загрузки классов в рантайме.',
        'Для сериализации нужны интерфейсы Serializable или Externalizable (второй требует ручной read/write-логику).',
        'В интерфейсах нет обычных конструкторов, но есть abstract/default/static/private методы.',
        'enum не наследуется от произвольного класса, но может implement интерфейсы.',
        'Для полей класса abstract и synchronized недопустимы; volatile и transient допустимы.',
        'Наследуются доступные члены класса (включая static-методы), а конструкторы не наследуются.',
        'Контрольный вопрос: какие classloader обычно называют базовыми? (Bootstrap, Platform, App).',
        'Контрольный вопрос: какие интерфейсы дают сериализацию? (Serializable, Externalizable).',
      ],
      glossary: [
        { term: 'ClassLoader', meaning: 'Механизм JVM загрузки классов во время выполнения.' },
        { term: 'Serializable', meaning: 'Маркерный интерфейс стандартной сериализации объекта.' },
        { term: 'Externalizable', meaning: 'Интерфейс сериализации с ручным writeExternal/readExternal.' },
        { term: 'enum', meaning: 'Тип с ограниченным набором допустимых констант.' },
      ],
      interviewFocus: [
        {
          question: 'Почему конструктор родителя не считается унаследованным членом?',
          expectedAnswer: 'Он вызывается при создании объекта, но не становится методом дочернего класса.',
        },
        {
          question: 'Какие интерфейсы дают объекту возможность сериализоваться?',
          expectedAnswer: 'Serializable и Externalizable.',
        },
      ],
      codeExample: {
        title: 'enum + interface',
        language: 'java',
        snippet: `interface CodeProvider {
    String code();
}

enum Status implements CodeProvider {
    NEW("N"), DONE("D");
    private final String code;
    Status(String code) { this.code = code; }
    public String code() { return code; }
}`,
        walkthrough: [
          'Enum имеет собственный конструктор и реализует интерфейс.',
        ],
        commonPitfall: 'Считать, что enum может расширять произвольные классы.',
      },
      usefulLinksOverride: MODULE5_LINKS,
      estimatedMinutes: 8,
    }),
    topic({
      id: 'final-collections-stream',
      title: 'Коллекции, сложность и Stream API',
      quickAnswer:
        'Контрольные ориентиры: какой default capacity у HashMap? (16); какая сложность binary search? (O(log n)); удаление первого: ArrayList (O(n)) vs LinkedList (O(1)); какие Stream операции промежуточные? (filter/map); где Consumer? (forEach/peek).',
      explainBrief: [
        'Вопросы по сложности проверяют базовое понимание структур данных.',
        'В Stream API важно отличать intermediate и terminal операции.',
        'Consumer используется там, где функция потребляет элемент и не возвращает значение.',
        'Контрольный вопрос: почему удаление первого элемента в ArrayList дороже? (Нужно сдвигать элементы массива).',
      ],
      glossary: [
        { term: 'Capacity', meaning: 'Внутренняя емкость структуры до перераспределения памяти.' },
        { term: 'O(log n)', meaning: 'Логарифмическая асимптотическая сложность (например, бинарный поиск).' },
        { term: 'Intermediate operation', meaning: 'Промежуточная операция Stream, возвращающая новый Stream.' },
        { term: 'Consumer', meaning: 'Функциональный интерфейс, который принимает значение и ничего не возвращает.' },
      ],
      interviewFocus: [
        {
          question: 'Почему удаление первого элемента в ArrayList медленнее, чем в LinkedList?',
          expectedAnswer: 'В ArrayList нужно сдвигать хвост массива.',
        },
      ],
      codeExample: {
        title: 'Stream-контраст операций',
        language: 'java',
        snippet: `List<String> out = input.stream()
    .filter(s -> !s.isBlank())
    .map(String::trim)
    .toList();

out.forEach(System.out::println);`,
        walkthrough: [
          'filter/map — промежуточные операции, forEach — терминальная.',
        ],
        commonPitfall: 'Считать findFirst/reduce промежуточными операциями.',
      },
      usefulLinksOverride: MODULE5_LINKS,
      estimatedMinutes: 10,
    }),
  ],
};
