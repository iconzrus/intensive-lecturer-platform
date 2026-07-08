// Canonical alignment: docs/content-canonical-map.md — compact live-формат, синхронизировано с module-1..5 и interview-3..7.
import { INTERN_TOPIC_ENRICHMENT } from './module-interview-intern-enrichment';
import type { LectureModule } from './schema';
import { topic } from './module-1';

type Topic = LectureModule['topics'][number];

type InternCategory =
  | 'java-core'
  | 'concurrency'
  | 'spring-hibernate'
  | 'sql'
  | 'distributed'
  | 'microservices'
  | 'patterns'
  | 'testing';

type QuestionDef = {
  id: string;
  title: string;
  category: InternCategory;
};

const INTERN_LINKS = [
  {
    title: 'Java Language Updates (Oracle)',
    url: 'https://docs.oracle.com/en/java/javase/21/language/java-language-changes.html',
    description: 'records, sealed classes, pattern matching, virtual threads — официальные изменения языка.',
  },
  {
    title: 'Java Garbage Collection Basics (Oracle)',
    url: 'https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html',
    description: 'Heap/generations, G1/ZGC/Shenandoah, основы и тюнинг сборщиков мусора.',
  },
  {
    title: 'java.util.concurrent (OpenJDK Docs)',
    url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html',
    description: 'ExecutorService, CompletableFuture, ConcurrentHashMap, локи — официальный API.',
  },
  {
    title: 'Spring Framework Reference',
    url: 'https://docs.spring.io/spring-framework/reference/',
    description: 'IoC/DI, bean lifecycle, @Transactional, propagation/isolation.',
  },
  {
    title: 'Spring Boot Reference',
    url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/',
    description: 'Auto-configuration, starters, actuator, тестирование Spring Boot приложений.',
  },
  {
    title: 'Hibernate ORM User Guide',
    url: 'https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html',
    description: 'FetchType, N+1, batch fetching, кэши первого/второго уровня, статистика.',
  },
  {
    title: 'PostgreSQL Documentation',
    url: 'https://www.postgresql.org/docs/current/index.html',
    description: 'Индексы, EXPLAIN ANALYZE, уровни изоляции, MVCC.',
  },
  {
    title: 'Apache Kafka Documentation',
    url: 'https://kafka.apache.org/documentation/',
    description: 'acks, ISR, идемпотентный/транзакционный producer, consumer groups.',
  },
  {
    title: 'Testcontainers Documentation',
    url: 'https://testcontainers.com/',
    description: 'Реальная инфраструктура (PostgreSQL, Kafka) в Docker для integration-тестов.',
  },
  {
    title: 'Apache JMeter Documentation',
    url: 'https://jmeter.apache.org/usermanual/index.html',
    description: 'Test plan, thread group, метрики нагрузочного тестирования.',
  },
  {
    title: 'OpenTelemetry Documentation',
    url: 'https://opentelemetry.io/docs/',
    description: 'Distributed tracing, trace id/span, стандарт инструментирования.',
  },
  {
    title: 'Microservices.io — паттерны',
    url: 'https://microservices.io/patterns/index.html',
    description: 'Saga, Outbox, Idempotent Consumer, границы сервисов, API Gateway.',
  },
];

const CATEGORY_LECTURER_NOTES: Record<InternCategory, string[]> = {
  'java-core': [
    'Блок проверяет актуальность знаний (Java 17/21) и базовое устройство JVM — не уходить в историю языка до Java 8.',
  ],
  concurrency: [
    'Держать фокус на "когда что применять", а не на пересказе Javadoc каждого класса.',
  ],
  'spring-hibernate': [
    'Self-invocation и N+1 — два самых частых практических провала на этом блоке, дожимать их конкретными примерами.',
  ],
  sql: [
    'Просить писать реальный SQL/читать реальный EXPLAIN, а не пересказывать теорию словами.',
  ],
  distributed: [
    'Критерий блока — умение связать протокол/паттерн с конкретным требованием (синхронность, гарантии, replay), не список терминов.',
  ],
  microservices: [
    'Проверять понимание границ через ownership данных и bounded context, не через "чем мельче, тем лучше".',
  ],
  patterns: [
    'Обязательно требовать пример из практики кандидата, список названий паттернов без примеров не засчитывать.',
  ],
  testing: [
    'Смотреть, различает ли кандидат уровни тестов по тому, что реально поднимается/мокается, а не по названию аннотации.',
  ],
};

const QUESTIONS: QuestionDef[] = [
  // 1. Java Core — 5 вопросов
  { id: 'int-intern-01', category: 'java-core', title: 'Какими версиями Java пользовались? Какие фичи Java 17/21 используете чаще всего?' },
  { id: 'int-intern-02', category: 'java-core', title: 'Расскажите про устройство памяти JVM: heap, stack, Metaspace. Что такое OutOfMemoryError?' },
  { id: 'int-intern-03', category: 'java-core', title: 'Чем отличается checked exception от unchecked? Где какой тип применяете?' },
  { id: 'int-intern-04', category: 'java-core', title: 'Что такое Optional? Какие проблемы решает, а какие создаёт?' },
  { id: 'int-intern-05', category: 'java-core', title: 'Как работает сборщик мусора в Java? Назовите основные типы GC.' },

  // 2. Многопоточность и асинхронность — 4 вопроса
  { id: 'int-intern-06', category: 'concurrency', title: 'Как создать поток в Java? Когда используете ExecutorService, а когда CompletableFuture?' },
  { id: 'int-intern-07', category: 'concurrency', title: 'Как синхронизировать доступ к общим данным? synchronized vs ReentrantLock vs ConcurrentHashMap.' },
  { id: 'int-intern-08', category: 'concurrency', title: 'Что такое deadlock? Приведите пример из практики.' },
  { id: 'int-intern-09', category: 'concurrency', title: 'Как в Spring реализовать асинхронную обработку через @Async? На что влияет пул потоков?' },

  // 3. Spring Framework + Hibernate — 6 вопросов
  { id: 'int-intern-10', category: 'spring-hibernate', title: 'В чём отличие Spring Boot от классического Spring?' },
  { id: 'int-intern-11', category: 'spring-hibernate', title: 'Что такое жизненный цикл бина? Какие основные аннотации для DI?' },
  { id: 'int-intern-12', category: 'spring-hibernate', title: 'Как работает @Transactional? Что такое propagation и isolation?' },
  { id: 'int-intern-13', category: 'spring-hibernate', title: 'Что такое проблема N+1 запроса в Hibernate? Как её решить?' },
  { id: 'int-intern-14', category: 'spring-hibernate', title: 'Когда использовать FetchType.LAZY, а когда EAGER?' },
  { id: 'int-intern-15', category: 'spring-hibernate', title: 'Как вы отлаживаете Hibernate: показ SQL, статистика, кэши?' },

  // 4. SQL и PostgreSQL — 5 вопросов
  { id: 'int-intern-16', category: 'sql', title: 'Напишите запрос с JOIN, GROUP BY и агрегацией: SUM, COUNT.' },
  { id: 'int-intern-17', category: 'sql', title: 'Что такое индекс? Как выбрать столбцы для индекса в PostgreSQL?' },
  { id: 'int-intern-18', category: 'sql', title: 'Как проанализировать медленный запрос? Что показывает EXPLAIN ANALYZE?' },
  { id: 'int-intern-19', category: 'sql', title: 'Какие уровни изоляции транзакций в PostgreSQL? Чем отличается READ COMMITTED от REPEATABLE READ?' },
  { id: 'int-intern-20', category: 'sql', title: 'Что такое последовательное сканирование, seq scan, и когда оно плохо?' },

  // 5. Архитектура распределённых приложений — 5 вопросов
  { id: 'int-intern-21', category: 'distributed', title: 'Какие протоколы интеграции использовали: HTTP, REST, SOAP, JMS, Kafka? Когда что лучше?' },
  { id: 'int-intern-22', category: 'distributed', title: 'Чем отличается синхронный обмен REST от асинхронного Kafka/JMS?' },
  { id: 'int-intern-23', category: 'distributed', title: 'Как гарантировать надёжную доставку сообщений в Kafka: acks, idempotency?' },
  { id: 'int-intern-24', category: 'distributed', title: 'Что такое файловый обмен? В каких случаях он оправдан?' },
  { id: 'int-intern-25', category: 'distributed', title: 'Как обеспечить идемпотентность обработки сообщений?' },

  // 6. Микросервисная архитектура — 4 вопроса
  { id: 'int-intern-26', category: 'microservices', title: 'По какому принципу делите монолит на микросервисы?' },
  { id: 'int-intern-27', category: 'microservices', title: 'Как в микросервисах реализовать распределённую транзакцию: SAGA, Outbox?' },
  { id: 'int-intern-28', category: 'microservices', title: 'Что такое Service Discovery и API Gateway? Зачем они нужны?' },
  { id: 'int-intern-29', category: 'microservices', title: 'Что такое distributed tracing: Jaeger/Zipkin? Когда применяется?' },

  // 7. Шаблоны проектирования — 3 вопроса
  { id: 'int-intern-30', category: 'patterns', title: 'Какие шаблоны GoF чаще всего используете? Приведите пример.' },
  { id: 'int-intern-31', category: 'patterns', title: 'Чем отличается Strategy от State?' },
  { id: 'int-intern-32', category: 'patterns', title: 'Что такое Builder? Когда его использовать вместо конструктора с многими параметрами?' },

  // 8. Автоматизированное тестирование — 3 вопроса
  { id: 'int-intern-33', category: 'testing', title: 'Какие виды тестов пишете: unit, integration, e2e?' },
  { id: 'int-intern-34', category: 'testing', title: 'Как тестируете Spring Boot приложение? Что такое @MockBean и Testcontainers?' },
  { id: 'int-intern-35', category: 'testing', title: 'Для чего используете JMeter? Какие метрики считаете критическими?' },
];

function buildTopic(question: QuestionDef): Topic {
  const enrichment = INTERN_TOPIC_ENRICHMENT[question.id];
  if (!enrichment) {
    throw new Error(`Missing INTERN_TOPIC_ENRICHMENT for ${question.id}`);
  }

  return topic({
    id: question.id,
    title: question.title,
    priority: 'core',
    simpleDefinitionOverride: enrichment.simpleDefinition,
    quickAnswer: enrichment.quickAnswer,
    explainBrief: enrichment.explainBrief,
    extraKeyPoints: enrichment.extraKeyPoints,
    questionPlan: enrichment.questionPlan,
    interviewFocus: [
      {
        question: 'Минимум для стажёра: ожидаемый короткий ответ',
        expectedAnswer: enrichment.quickAnswer,
      },
      {
        question: 'Хороший ответ',
        expectedAnswer: enrichment.goodAnswer,
      },
      {
        question: 'Красный флаг / поверхностный ответ',
        expectedAnswer: enrichment.redFlag,
      },
    ],
    codeExample: enrichment.codeExample,
    usefulLinksOverride: INTERN_LINKS,
    glossary: enrichment.glossary,
    lecturerNotes: [...enrichment.lecturerNotes, ...CATEGORY_LECTURER_NOTES[question.category]],
    estimatedMinutes: enrichment.estimatedMinutes,
  });
}

export const moduleInterviewIntern: LectureModule = {
  id: 'interview-intern',
  interviewSectionKicker: 'Java backend intern matrix — 35 вопросов по 8 темам, 60–90 минут',
  title: 'Интервью: Java backend intern matrix',
  targetDurationMinutes: 78,
  audienceLevel: 'Intern / Junior- / Junior',
  isAvailable: true,
  summary:
    'Live-шпаргалка для собеседования стажёров: 35 вопросов по 8 темам (Java Core, многопоточность, Spring/Hibernate, SQL/PostgreSQL, распределённые системы, микросервисы, паттерны, тестирование). У каждой темы — эталонный ответ, критерии оценки и красные флаги.',
  topics: QUESTIONS.map(buildTopic),
};
