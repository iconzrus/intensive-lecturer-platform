import type { LectureModule } from './schema';
import { topic } from './module-1';

const PRACTICE_LINKS = [
  {
    title: 'Java Stream (Oracle)',
    url: 'https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html',
    description: 'Документация Stream для задач groupingBy/counting.',
  },
  {
    title: 'Spring MVC',
    url: 'https://docs.spring.io/spring-framework/reference/web/webmvc.html',
    description: 'Контроллеры, ответы и исключения.',
  },
];

export const modulePracticeInterview: LectureModule = {
  id: 'practice-interview',
  practiceSectionKicker: 'Один слот — одна матрица',
  title: 'Практика: матрица на 60 минут',
  targetDurationMinutes: 60,
  audienceLevel: 'Middle / мидл + IDE',
  isAvailable: true,
  summary:
    'Один час в IDE по одной согласованной дорожке: сначала карточка «Матрица…» (схема слота и тайминг), затем шесть задач от потока данных в Java до SQL, Spring Web, JPA-запроса и Mockito. Каждая карточка даёт готовый сниппет, ожидаемый результат и эталон с комментариями [Шаг N] — чтобы и кандидат, и ведущий, и HR видели один и тот же сценарий.',
  topics: [
    topic({
      id: 'prac-00-readme',
      title: 'Матрица практики на 60 минут',
      simpleDefinitionOverride:
        'Эта карточка — «обложка» практического слота: на одном экране видно порядок задач, сколько минут на каждую и что именно считается результатом. Дальше в сайдбаре идут шесть карточек M1–M6 в том же порядке — их не переставляют и не заменяют соседними темами.',
      quickAnswer:
        'Цепочка id: prac-java-01 → prac-sql-01 → prac-spring-01 → prac-spring-02 → prac-jpa-01 → prac-test-01. Вместе с этой вводной сумма полей estimatedMinutes = 60 — это и есть бюджет слота.',
      explainBrief: [
        'Как читать сайдбар: сверху вниз — ровно одна дорожка. Каждая строка M* — отдельный таймбокс; внутри карточки сначала «Практика в слот» (что сдать), затем «Код для вставки» (что кинуть в чат).',
        'Эталон с маркерами [Шаг N] нужен ведущему как шпаргалка: там расписано, какая строка кода за какой мыслью стоит. Кандидату эталон показываете после попытки или по таймеру — не в начале.',
        'Для HR: названия M1–M6 и id из сниппета ниже можно копировать в письмо кандидату или в табель — это фиксированное содержание часа, без формулировок «на усмотрение интервьюера».',
        'Почему нет Redis/Kafka/миграций в этом слоте: они раздувают подготовку окружения и размывают сравнение кандидатов; эта матрица заточена под core + SQL + типовой Spring/JPA/тест за час.',
      ],
      questionPlan: [
        {
          question: 'Куда смотреть HR, если не уверен в формулировках?',
          answerHint:
            'На эту карточку: фиксированные id и таймбоксы. Вопросы для беседы — в блоках «После кода» на каждой задаче и в «Полном разборе»; их можно зачитывать дословно.',
        },
        {
          question: 'Что делать, если к концу часа не успели последнюю задачу?',
          answerHint:
            'Зафиксировать, на какой id остановились; prac-test-01 можно сократить до объяснения эталона без запуска, но порядок матрицы не перетасовывать.',
        },
        {
          question:
            'Дан класс User с полями name и age. Напиши equals() и hashCode() руками (без Lombok). Объясни, почему важна иммутабельность ключей в HashMap.',
          answerHint:
            'Сравнение по name+age, hashCode по тем же полям. Mutable-ключ в HashMap после изменения поля может «потеряться» из-за смены hashCode.',
        },
        {
          question:
            'Напиши метод, который из Kafka-консюмера обрабатывает сообщение. Покажи try-catch вокруг обработки. Что делать при исключении? Commit или нет?',
          answerHint:
            'Базово: commit только после успешной обработки. При исключении обычно не commit (at-least-once) + логирование/ретрай/DLQ по политике.',
        },
        {
          question:
            'Напиши метод, который пушит сообщение в Kafka с ключом = userId. Объясни, зачем нужен ключ.',
          answerHint:
            'ProducerRecord(topic, userId, payload). Ключ определяет партицию: порядок сообщений сохраняется внутри партиции для одного userId.',
        },
        {
          question:
            'Напиши код, который ловит LazyInitializationException. Покажи, как правильно загрузить lazy-связку внутри транзакции.',
          answerHint:
            'Доступ к lazy-коллекции вне сессии роняет LIE; корректно — @Transactional(readOnly = true) на сервисе и инициализация связи внутри транзакции.',
        },
        {
          question:
            'Реализуй producer-consumer на BlockingQueue. Один поток кладёт числа, другой забирает и выводит.',
          answerHint:
            'Использовать put/take и протокол завершения (poison pill). Так избегаем busy-wait и зависаний при остановке consumer.',
        },
        {
          question:
            'Напиши метод, который принимает дату и возвращает первую секунду следующего дня.',
          answerHint:
            'LocalDate next = date.plusDays(1); return next.atStartOfDay(zone). Важна явная ZoneId для предсказуемости времени.',
        },
      ],
      interviewFocus: [
        {
          question: 'Что считать «сдано» за слот?',
          expectedAnswer:
            'По каждой пройденной карточке: компиляция или валидный SQL, ожидаемый вывод/поведение, одна короткая устная формулировка риска из карточки.',
        },
      ],
      codeExample: {
        title: 'Ран-лист матрицы (фиксированный порядок)',
        language: 'text',
        snippet: `# Один столбец — одна «петля» слота: слева id для отчёта, справа — суть задачи.
# Таймер на шаг = число «мин» (то же число в блоке «Практика в слот» на карточке).

M1   12 мин   prac-java-01    Java Stream: из строк → слова → счётчики в Map
M2   10 мин   prac-sql-01     SQL: все пользователи + MAX(order); без заказов NULL
M3   12 мин   prac-spring-01  HTTP: GET /users/{id} → 200 JSON или 404 без тела
M4    8 мин   prac-spring-02  Ошибки: ISE из контроллера → 400 JSON из @ControllerAdvice
M5    8 мин   prac-jpa-01     JPQL: пользователи с заказом > порога, DISTINCT
M6    5 мин   prac-test-01    Тест: Mockito when / assert / verify без сети

# Дополнительный перечень вопросов (по аналогии; можно брать как отдельные карточки/домашку):
# Q1  Дан класс User с полями name и age. Напиши equals() и hashCode() руками (без Lombok).
#     Объясни, почему важна иммутабельность ключей в HashMap.
# Q2  Напиши метод, который из Kafka-консюмера обрабатывает сообщение. Покажи try-catch вокруг
#     обработки. Что делать при исключении? Commit или нет?
# Q3  Напиши метод, который пушит сообщение в Kafka с ключом = userId. Объясни, зачем нужен ключ.
# Q4  Напиши код, который ловит LazyInitializationException. Покажи, как правильно загрузить
#     lazy-связку внутри транзакции.
# Q5  Реализуй producer-consumer на BlockingQueue. Один поток кладёт числа, другой забирает и выводит.
# Q6  Напиши метод, который принимает дату и возвращает первую секунду следующего дня.

# Вводная карточка (эта) — 5 мин на объяснение формата + общий таймер часа.`,
        walkthrough: [
          '1) Откройте сайдбар: первая строка после этой карточки должна быть M1 (prac-java-01). Если порядок другой — вы не в том модуле.',
          '2) На каждом M*: в чат уходит только превью «Код для вставки в IDE»; подсказки из walkthrough на карточке — по запросу кандидата.',
          '3) После сдачи или по будильнику: открыть «Эталон» на той же карточке и пройти построчно по [Шаг N] — так видно «думаем как здесь».',
          '4) В конце часа: один раз проговорить риск по каждой пройденной задаче (вопросы есть в карточке в блоке «После кода» / «Полный разбор»).',
        ],
        commonPitfall:
          'Смешивать этот слот с «докинем ещё concurrency/redis» — ломает тайминг и делает отчёт HR несопоставимым между кандидатами.',
        referenceSolution: `# --- Шпаргалка ведущего: один час глазами ---
#
#   [ввод 5 мин]  prac-00-readme  ← вы здесь: объяснить M1–M6 и правила
#        |
#        v
#   [M1 12 мин]   поток строк -> слова -> Map частот
#        |
#        v
#   [M2 10 мин]   таблицы users/orders -> LEFT JOIN + MAX
#        |
#        v
#   [M3 12 мин]   Spring MVC: 200 vs 404 на GET
#        |
#        v
#   [M4  8 мин]   глобальный обработчик ошибок -> JSON 400
#        |
#        v
#   [M5  8 мин]   JPQL по связи User.orders
#        |
#        v
#   [M6  5 мин]   Mockito: изоляция HTTP-клиента
#
# Сумма: 5 + 12 + 10 + 12 + 8 + 8 + 5 = 60 минут.
#
# [Шаг 1] Запустить общий таймер 60 мин (или завести шесть отдельных — как удобнее команде).
# [Шаг 2] Для M1: отправить сниппет prac-java-01, таймер 12 мин, не подсказывать эталон до попытки.
# [Шаг 3] Для M2…M6: повторить тот же ритуал — сниппет -> работа -> эталон по [Шаг N].
# [Шаг 4] После M6: короткий обход «что улучшить» по 1 пункту на задачу (без новых тем).
#
# --- Чеклист в конце (для заметок HR / ведущего) ---
# [ ] Пройдены подряд M1–M6 или явно отмечено «остановились на …».
# [ ] У каждой пройденной M*: компиляция/SQL + ожидаемый вывод или поведение.
# [ ] В отчёт скопирована строка id из сниппета выше — без самодельного набора задач.`,
        referenceSolutionLanguage: 'text',
      },
      usefulLinksOverride: PRACTICE_LINKS,
      practiceHint: {
        task:
          'За 5 минут нарисовать «дорожку» слота: показать таблицу M1–M6 из сниппета выше и договориться, что эталон открывается только после попытки на каждом шаге.',
        timeboxMinutes: 5,
        expectedOutcome:
          'Кандидат понимает порядок карточек в сайдбаре, где таймеры, и что каждая задача заканчивается мини-дебрифом по эталону с [Шаг N].',
        mentorCheck:
          'На листе/в чате команды записана цепочка id через стрелку prac-java-01 → … → prac-test-01 без дополнительных вставок.',
      },
      lecturerNotes: [
        'Нет готового Spring-проекта: выдайте заготовку (spring-boot-starter-web, data-jpa, test) или договоритесь «пишем только тела методов в одном файле».',
        'Кандидат убегает вперёд по времени: удлините устный блок «Почему так» на текущей карточке, не подмешивайте новые IDE-задачи.',
        'Экран делится пополам: слева IDE кандидата, справа у вас открыта та же карточка — так проще ссылаться на «Практика в слот» и эталон.',
      ],
      estimatedMinutes: 5,
    }),
    topic({
      id: 'prac-java-01',
      title: 'Задача: частоты слов (Stream API)',
      simpleDefinitionOverride:
        'Представьте лог-файл из строк: нужно собрать статистику «какое слово сколько раз встретилось» в виде Map. Слово — это токен после trim и приведения к нижнему регистру; строки режем по пробелам (один или несколько подряд).',
      quickAnswer:
        'Один проход по списку строк: stream → flatMap (строка → поток слов) → map(lowerCase) → filter пустых → collect(groupingBy + counting).',
      explainBrief: [
        'Вход: List<String> — каждая строка может содержать несколько слов, пустые строки и null в списке нужно обработать без падения (см. контракт в коде).',
        'Выход: Map<String, Long> — ключ нормализованное слово, значение сколько раз встретилось суммарно во всех строках.',
        'Почему flatMap, а не map: map оставил бы «строку целиком»; flatMap «разворачивает» каждую строку в последовательность слов и склеивает их в один общий поток токенов.',
        'После сдачи попросите одну фразу: зачем groupingBy именно с counting, и что изменится, если считать частоты строк, а не слов.',
      ],
      glossary: [
        { term: 'flatMap', meaning: 'Оператор Stream: из каждого элемента получаем вложенный поток, затем все вложенные потоки сливаются в один слева направо.' },
        { term: 'groupingBy + counting', meaning: 'Коллектор: сгруппировать элементы по ключу и посчитать размер каждой группы; здесь ключ — само слово.' },
        { term: '\\\\s+ в split', meaning: 'Регулярное выражение «один или больше пробельных символов» — режем слова по любым пробелам подряд.' },
      ],
      interviewFocus: [
        {
          question: 'Что вернёт метод для пустого списка?',
          expectedAnswer: 'Пустая map; null в элементе списка — договориться в коде (фильтр или NPE по контракту).',
        },
      ],
      codeExample: {
        title: 'Код для вставки (класс WordFrequencyLab)',
        language: 'java',
        snippet: `import java.util.*;
import java.util.stream.*;

public final class WordFrequencyLab {

    /**
     * Частота каждого «слова» после нормализации: trim + lowerCase.
     * Слова в строке режьте по пробелам (один пробел или несколько — без разницы).
     */
    public static Map<String, Long> wordFrequencies(List<String> lines) {
        // TODO: реализовать через Stream API
        return Collections.emptyMap();
    }

    public static void main(String[] args) {
        List<String> sample = Arrays.asList("Java Java", " stream ", "", "STREAM");
        System.out.println(wordFrequencies(sample));
        // ожидаемо: java -> 2, stream -> 2 (если так договорились про регистр)
    }
}`,
        walkthrough: [
          'Картина данных: [ "Java Java", " stream ", "", "STREAM" ]  --->  поток слов  java,java,stream,stream  --->  {java=2, stream=2}.',
          '1) Сначала решите крайний случай: null или пустой список строк → сразу Collections.emptyMap().',
          '2) Дальше lines.stream(): filter(null), flatMap: для каждой строки trim → если пусто Stream.empty() иначе Arrays.stream(split по \\\\s+).',
          '3) После flatMap: toLowerCase, filter пустых токенов, затем collect(groupingBy(identity(), counting())).',
        ],
        commonPitfall:
          'Считать частоты целых строк (без flatMap) или делать два отдельных прохода по lines — оба варианта мимо постановки «слова через пробелы».',
        productionNote:
          'На доске можно нарисовать стрелку: List<String> => Stream<String> всех слов => Map частот. Эталон ниже повторяет эту картину построчно.',
        referenceSolution: `import java.util.*;
import java.util.stream.*;

public final class WordFrequencyLab {

    public static Map<String, Long> wordFrequencies(List<String> lines) {
        /*
         * Эталон — «рентген» решения. Логика трёх слоёв:
         *   (A) границы входа  (B) строка→слова  (C) слова→счётчики
         */
        // [Шаг A1] Нет входных строк — нечего считать, map пустая (не null)
        if (lines == null || lines.isEmpty()) {
            return Collections.emptyMap();
        }
        // [Шаг B1] Один pipeline на весь список: каждая строка даёт вклад в общий поток слов
        return lines.stream()
                // [Шаг B2] null в списке строк — выкидываем, иначе NPE на trim у плохого элемента
                .filter(Objects::nonNull)
                /*
                 * [Шаг B3] flatMap: «матрёшка» строка внутри содержит много слов
                 *   "Java Java"  -->  stream(java, java)
                 *   " stream "   -->  stream(stream)
                 *   ""           -->  пустой поток (не кормим split пустой строкой)
                 */
                .flatMap(line -> {
                    String trimmed = line.trim();
                    if (trimmed.isEmpty()) {
                        return Stream.empty();
                    }
                    // [Шаг B4] split("\\\\s+") — один или несколько пробелов подряд = один разделитель
                    return Arrays.stream(trimmed.split("\\\\s+"));
                })
                // [Шаг C1] Регистр: JAVA и java — одно и то же слово-ключ
                .map(String::toLowerCase)
                // [Шаг C2] Страховка: если split когда-то дал пустой токен — не попадёт в map
                .filter(s -> !s.isEmpty())
                /*
                 * [Шаг C3] Сборка частот:
                 *   groupingBy(слово -> слово)  +  counting()
                 * итог: {java=2, stream=2} на демо-данных main
                 */
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
    }

    public static void main(String[] args) {
        // [Шаг D1] Демо: печать map для глазомерной проверки ведущим
        List<String> sample = Arrays.asList("Java Java", " stream ", "", "STREAM");
        System.out.println(wordFrequencies(sample));
    }
}`,
      },
      practiceHint: {
        task:
          'Дописать wordFrequencies так, чтобы main на sample печатал map с java=2 и stream=2; пустой список и null-список — пустая map.',
        timeboxMinutes: 12,
        expectedOutcome:
          'Код компилируется; на sample счётчики сходятся; крайние случаи null/пустой список не бросают NPE без явного контракта.',
        mentorCheck:
          'Попросите кандидата проговорить вслух путь данных: где был flatMap и зачем, и показать в отладчике или println один промежуточный stream по желанию.',
      },
      lecturerNotes: [
        'Застрял на split: напишите на доске пример "  a   b " → токены a, b без пустых между ними.',
        'Сильный кандидат: спросите про Locale.toLowerCase vs просто toLowerCase для турецкой i.',
      ],
      usefulLinksOverride: PRACTICE_LINKS,
      estimatedMinutes: 12,
    }),
    topic({
      id: 'prac-sql-01',
      title: 'Задача: SQL — пользователи и максимальная сумма заказа',
      simpleDefinitionOverride:
        'Нужна «витрина» для отчёта: по каждому пользователю из таблицы users показать его имя и величину самого дорогого заказа из orders. Если заказов нет — в колонке с максимумом должен быть SQL NULL, но сам пользователь в результате остаётся.',
      quickAnswer:
        'Каркас: FROM users u LEFT JOIN orders o ON o.user_id = u.id, затем GROUP BY по ключу пользователя и MAX(o.amount). INNER JOIN здесь обычно ошибка — он «съест» пользователей без заказов.',
      explainBrief: [
        'Нарисуйте связь: orders.user_id — внешний ключ на users.id. Одному пользователю соответствует много строк заказов; агрегат MAX сжимает их в одно число на пользователя.',
        'LEFT JOIN оставляет строку пользователя даже если подходящих заказов 0: тогда все поля o.* в строке NULL, и MAX по пустому набору в PostgreSQL даёт NULL — это ожидаемый сигнал «нет заказов».',
        'GROUP BY обязан содержать все неагрегированные колонки из SELECT (здесь u.id, u.name) — иначе СУБД вернёт ошибку или недетерминированный результат в зависимости от режима.',
        'Проверка глазами: добавьте в фикстуры пользователя без заказов и убедитесь, что он есть в результате с NULL в max_order_amount.',
      ],
      glossary: [
        { term: 'LEFT JOIN', meaning: 'В результат попадают все строки левой таблицы; для правой подставляются NULL, если совпадения не нашлось.' },
        { term: 'MAX + GROUP BY', meaning: 'Сначала строки группируются по пользователю, затем внутри группы берётся максимум amount.' },
      ],
      interviewFocus: [
        {
          question: 'Почему INNER JOIN потеряет пользователей без заказов?',
          expectedAnswer: 'Строки без совпадения отфильтруются.',
        },
      ],
      codeExample: {
        title: 'Код для вставки (как строка или .sql файл)',
        language: 'text',
        snippet: `-- users(id, name)
-- orders(id, user_id, amount)

-- TODO: один запрос
-- ожидание: каждая строка = пользователь; max_order_amount либо число либо NULL

SELECT 1; -- заглушка: заменить`,
        walkthrough: [
          'Схема на доске: users ──< orders (один ко многим). Нужна одна строка на левый users.',
          '1) FROM users u — «якорь» результата: сколько пользователей, столько строк минимум.',
          '2) LEFT JOIN orders o ON o.user_id = u.id — подтянуть все заказы; отсутствие заказов не удаляет пользователя.',
          '3) SELECT u.id, u.name, MAX(o.amount) AS max_order_amount + GROUP BY u.id, u.name — схлопнуть много заказов в одно число.',
        ],
        commonPitfall:
          'Сделать INNER JOIN «по привычке» или забыть GROUP BY: первое теряет пользователей без заказов, второе ломает SQL или даёт неверную агрегацию.',
        productionNote:
          'Для наглядности нарисуйте две колонки: «пользователь» и «столбик заказов»; MAX — это «верхушка столбика», а NULL — «пустой столбик».',
        referenceSolution: `-- Таблицы (смысл связи):
--   users (1)  ----<  orders (N)   по users.id = orders.user_id
--
-- Цель SELECT: одна строка на пользователя из users
--   id | name | max_order_amount
--   ---+------+-------------------
--   1  | Ann  | 5000
--   2  | Bob  | NULL   <-- заказов не было, но пользователь виден

-- [Шаг 1] Якорь выборки — вся таблица users (каждая строка будущего отчёта = один user)
SELECT u.id,
       u.name,
       /*
        * [Шаг 2] MAX по сумме заказа внутри группы пользователя.
        * Если заказов не было, агрегат MAX по «пустому набору» в PostgreSQL даёт NULL —
        * это ровно тот UX, который нужен в отчёте «нет заказов».
        */
       MAX(o.amount) AS max_order_amount
FROM users u
-- [Шаг 3] LEFT JOIN: не отбрасываем users без совпавших orders
LEFT JOIN orders o ON o.user_id = u.id
-- [Шаг 4] GROUP BY согласован с неагрегированными полями SELECT
GROUP BY u.id, u.name
ORDER BY u.id;`,
        referenceSolutionLanguage: 'text',
      },
      practiceHint: {
        task:
          'Один SELECT: все пользователи, третья колонка — максимальный amount по их заказам; для пользователя без заказов в третьей колонке NULL.',
        timeboxMinutes: 10,
        expectedOutcome:
          'Запрос выполняется на тестовой БД; визуально видно, что «осиротевший» пользователь не пропал из результата.',
        mentorCheck:
          'Попросите кандидата показать на доске, как INNER JOIN выкинул бы пользователя без заказов, и где в плане LEFT сохраняет строку.',
      },
      lecturerNotes: [
        'Дайте 3–4 INSERT: два пользователя с заказами, один без — иначе проверка «NULL» нечестная.',
        'Если спорят про DISTINCT: здесь он не нужен, потому что агрегат MAX уже сжимает много заказов в одно число на группу.',
      ],
      usefulLinksOverride: PRACTICE_LINKS,
      estimatedMinutes: 10,
    }),
    topic({
      id: 'prac-spring-01',
      title: 'Задача: GET /users/{id} и 404 если нет',
      simpleDefinitionOverride:
        'Мини-эндпоинт Spring MVC: по числовому id вернуть JSON с данными пользователя и статус 200, а если сервис вернул «не нашли» — отдать 404 так, чтобы клиент не получил случайный stack trace в теле.',
      quickAnswer:
        'Ветвление по null из сервиса: ResponseEntity.ok(dto) либо ResponseEntity.notFound().build(); альтернатива — throw new ResponseStatusException(NOT_FOUND).',
      explainBrief: [
        'Контроллер тонкий: он не лезет в БД, а вызывает userService.find(id), который в учебной задаче может быть заглушкой, возвращающей null.',
        'HTTP-контракт: 200 + тело DTO при успехе; 404 без «случайного» JSON со стеком (если не договорились иначе).',
        'ResponseEntity даёт явно задать статус и тело; Jackson сериализует публичные поля UserDto в JSON при 200.',
        'После сдачи: одна устная фраза — почему return ResponseEntity.ok(null) плохая идея даже если статус 200.',
      ],
      glossary: [
        { term: 'ResponseEntity', meaning: 'Обёртка Spring для HTTP-ответа: статус, заголовки и тело в одном возвращаемом значении метода контроллера.' },
        { term: '404 Not Found', meaning: 'Клиент обратился к существующему ресурсу по URL, но конкретной сущности с таким id нет.' },
      ],
      interviewFocus: [
        {
          question: 'Почему не бросать голый RuntimeException?',
          expectedAnswer: 'Превратится в 500 без контракта; нужен маппинг или ResponseStatusException.',
        },
      ],
      codeExample: {
        title: 'Код для вставки (Spring Boot)',
        language: 'java',
        snippet: `import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> get(@PathVariable long id) {
        // TODO: userService.find(id) -> 200 или 404
        throw new UnsupportedOperationException("TODO");
    }

    public static final class UserDto {
        public long id;
        public String name;
    }

    public interface UserService {
        UserDto find(long id); // null если нет
    }
}`,
        walkthrough: [
          'Рисунок ветвления: find(id) -> dto == null? --да--> 404; --нет--> 200 + JSON.',
          'Проверка: curl -i http://localhost:8080/users/1 и /users/999 — во втором случае статус 404, без огромного HTML-trace от Spring (в учебном проекте).',
          'Если кандидат путается: напомните, что @RestController уже включает @ResponseBody на методах — DTO уйдёт в JSON сам.',
        ],
        commonPitfall:
          'Вернуть 200 с пустым телом или с null, «чтобы не падало» — клиент не отличит «нет пользователя» от «пользователь с пустыми полями».',
        productionNote:
          'На слайде можно таблицей: id найден | HTTP 200 + JSON; id не найден | HTTP 404 + пустое тело (по умолчанию notFound().build()).',
        referenceSolution: `import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> get(@PathVariable long id) {
        /*
         * [Шаг 1] Сервис — граница: он знает, есть ли пользователь.
         * Контроллер только переводит бизнес-факт «нет dto» в HTTP-семантику.
         */
        UserDto dto = userService.find(id);
        /*
         * [Шаг 2] Ветка «не найдено»:
         *   HTTP 404 + пустое тело (типичный контракт REST для отсутствующего ресурса)
         */
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        /*
         * [Шаг 3] Ветка «найдено»:
         *   HTTP 200 + тело DTO -> Jackson превращает поля в JSON
         */
        return ResponseEntity.ok(dto);
    }

    public static final class UserDto {
        public long id;
        public String name;
    }

    public interface UserService {
        UserDto find(long id);
    }
}`,
      },
      practiceHint: {
        task:
          'Реализовать get(@PathVariable long id): для существующего пользователя — 200 и JSON; для несуществующего — 404 без тела со stack trace.',
        timeboxMinutes: 12,
        expectedOutcome:
          'curl/тест показывает различимые ответы; в логах нет необработанного 500 на «легальный» несуществующий id.',
        mentorCheck:
          'Попросите кандидата нарисовать на доске две стрелки из find(id): вниз к 404 и вправо к 200 — совпадает с кодом.',
      },
      lecturerNotes: [
        'Альтернатива для уверенных: throw new ResponseStatusException(HttpStatus.NOT_FOUND) вместо if (dto == null).',
        'Если нет curl — используйте MockMvc perform(get("/users/1")) и print() для наглядного ответа.',
      ],
      usefulLinksOverride: PRACTICE_LINKS,
      estimatedMinutes: 12,
    }),
    topic({
      id: 'prac-spring-02',
      title: 'Задача: @RestControllerAdvice — IllegalStateException → 400 JSON',
      simpleDefinitionOverride:
        'Централизованный слой ошибок: любой контроллер может бросить IllegalStateException как сигнал «бизнес-логика не сработала», а @RestControllerAdvice перехватывает это один раз и отдаёт клиенту структурированный JSON с кодом 400 — без дублирования try/catch в каждом методе.',
      quickAnswer:
        'Класс с @RestControllerAdvice + метод @ExceptionHandler(IllegalStateException.class), внутри — сборка DTO ошибки и ResponseEntity.status(BAD_REQUEST).',
      explainBrief: [
        'PingController внизу файла — учебный «пистолет»: он всегда бросает ISE, чтобы вы проверили, что Advice реально срабатывает на живом запросе.',
        'Тело ошибки — маленький JSON-объект с полями code и message: клиентам проще парсить, чем свободный текст stack trace.',
        'Этот Advice не обязан ловить всё: для слота достаточно одного типа исключения; остальные пусть идут в дефолтный обработчик Spring.',
        'После сдачи: сравните устно Advice и локальный try/catch — где граница ответственности слоя web.',
      ],
      glossary: [
        { term: '@RestControllerAdvice', meaning: 'Специализация @ControllerAdvice для REST: методы могут сразу возвращать тела ответов с кодами HTTP.' },
        { term: '@ExceptionHandler', meaning: 'Метод Spring, который вызывается вместо «проброса наружу», если тип исключения подошёл.' },
      ],
      interviewFocus: [
        {
          question: 'Чем Advice отличается от try/catch в контроллере?',
          expectedAnswer: 'Централизация для всех контроллеров и единый формат ошибки.',
        },
      ],
      codeExample: {
        title: 'Код для вставки',
        language: 'java',
        snippet: `import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalErrorHandler {

    // TODO: @ExceptionHandler(IllegalStateException.class)
    // вернуть 400 и JSON { "code": "illegal_state", "message": ex.getMessage() }
}

@RestController
class PingController {
    @GetMapping("/ping")
    public String ping() {
        throw new IllegalStateException("bad");
    }
}`,
        walkthrough: [
          'Цепочка запроса: GET /ping -> метод ping() бросает ISE -> DispatcherServlet ищет @ExceptionHandler -> ваш handleIllegalState.',
          'Проверка в браузере/curl: статус 400 и тело вида {"code":"illegal_state","message":"bad"} (имена полей как в ErrorBody).',
          'Если видите 500: чаще всего Advice не в пакете сканирования или опечатка в аннотациях.',
        ],
        commonPitfall:
          'Пометить класс как @ControllerAdvice без @ResponseBody на методе, возвращающем DTO, в старом стиле MVC — в REST-варианте используйте @RestControllerAdvice.',
        productionNote:
          'Нарисуйте «конус» ошибок: несколько @RestController слева сходятся в один GlobalErrorHandler справа.',
        referenceSolution: `import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalErrorHandler {

    /*
     * [Шаг 1] DTO тела ошибки — ровно те поля, которые увидит клиент в JSON.
     * public final поля достаточны для Jackson в простом учебном примере.
     */
    public static class ErrorBody {
        public final String code;
        public final String message;

        public ErrorBody(String code, String message) {
            this.code = code;
            this.message = message;
        }
    }

    /*
     * [Шаг 2] Точка входа Advice: любой IllegalStateException из контроллеров
     * в зоне компонент-сканирования попадёт сюда.
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorBody> handleIllegalState(IllegalStateException ex) {
        /*
         * [Шаг 3] Маппинг исключения на HTTP 400 и стабильный JSON-контракт.
         * code — машинно читаемый ярлык; message — текст из исключения.
         */
        ErrorBody body = new ErrorBody("illegal_state", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }
}

@RestController
class PingController {
    @GetMapping("/ping")
    public String ping() {
        /*
         * [Шаг 4] Учебный триггер: без try/catch — проверяем, что Advice перехватывает.
         * В реальном коде здесь была бы бизнес-проверка, которая решила бросить ISE.
         */
        throw new IllegalStateException("bad");
    }
}`,
      },
      practiceHint: {
        task:
          'Дописать GlobalErrorHandler так, чтобы GET /ping возвращал HTTP 400 и JSON с полями code и message; без ручного try/catch в PingController.',
        timeboxMinutes: 8,
        expectedOutcome:
          'В Network/curl видно application/json, статус 400, тело соответствует ErrorBody.',
        mentorCheck:
          'Попросите кандидата удалить Advice и показать, какой ответ станет по умолчанию — затем вернуть Advice и сравнить.',
      },
      lecturerNotes: [
        'Для прод-уровня следующий шаг — ProblemDetails (RFC 7807); в этой матрице достаточно простого JSON.',
      ],
      usefulLinksOverride: PRACTICE_LINKS,
      estimatedMinutes: 8,
    }),
    topic({
      id: 'prac-jpa-01',
      title: 'Задача: JPQL — пользователи с заказом > 1000',
      simpleDefinitionOverride:
        'Нужен запрос к объектной модели: вернуть сущности User, у которых в коллекции orders есть хотя бы один Order с полем amount строго больше заданного порога. Это типичный join по связи @OneToMany, но результатом должны остаться пользователи, а не строки заказов.',
      quickAnswer:
        'JPQL: SELECT DISTINCT u FROM User u JOIN u.orders o WHERE o.amount > :threshold — параметр :threshold подставляет Spring Data из @Param.',
      explainBrief: [
        'Имена в запросе (User, u.orders, o.amount) должны совпадать с именами сущностей и полей в Java, а не с именами таблиц SQL.',
        'JOIN u.orders разворачивает коллекцию заказов каждого пользователя в «плоские» пары (user, order); фильтр по amount отсекает лишние пары.',
        'DISTINCT нужен, чтобы один и тот же User не вернулся несколько раз, если подходящих заказов несколько — без DISTINCT список может содержать дубликаты сущностей.',
        'Метод в репозитории только объявляется — тело генерируется Spring Data по @Query.',
      ],
      glossary: [
        { term: 'JPQL', meaning: 'Объектный язык запросов JPA: работает с классами и полями сущностей, а не с таблицами напрямую.' },
        { term: 'DISTINCT в SELECT', meaning: 'Убирает дубликаты корня выборки (здесь User) после соединения с коллекцией.' },
      ],
      interviewFocus: [
        {
          question: 'Зачем DISTINCT?',
          expectedAnswer: 'JOIN может дублировать пользователя при нескольких заказах.',
        },
      ],
      codeExample: {
        title: 'Код для вставки',
        language: 'java',
        snippet: `import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;

// Сущности (упрощённо — положить рядом)
@Entity class User { @Id Long id; @OneToMany(mappedBy = "user") List<Order> orders; }
@Entity class Order { @Id Long id; @ManyToOne User user; long amount; }

interface UserRepository extends JpaRepository<User, Long> {

    // TODO: @Query(" ... JPQL ... ")
    List<User> findWithBigOrder(@Param("threshold") long threshold);
}`,
        walkthrough: [
          'Граф объектов: User.orders (List) <—mappedBy— Order.user: в JPQL идём от u к u.orders как к «виртуальной таблице заказов».',
          'Проверка DISTINCT: нарисуйте пользователя с двумя большими заказами — без DISTINCT Hibernate вернёт две ссылки на одного и того же User.',
          'Если mappedBy другое имя — синхронно поправьте и поле в сущности, и путь u.<имя> в JPQL.',
        ],
        commonPitfall:
          'Писать SQL-имена таблиц/колонок вместо имён полей сущности — JPQL в чистом виде этого не понимает без специальных функций.',
        productionNote:
          'На доске: круг User, стрелка к множеству Order, подпись «JOIN = развернуть множество в пары».',
        referenceSolution: `import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;

@Entity
class User {
    @Id
    Long id;
    @OneToMany(mappedBy = "user")
    List<Order> orders;
}

@Entity
class Order {
    @Id
    Long id;
    @ManyToOne
    User user;
    long amount;
}

interface UserRepository extends JpaRepository<User, Long> {

    /*
     * [Шаг 1] Корень SELECT — User u: в коллекции результатов хотим сущности пользователей.
     * [Шаг 2] JOIN u.orders o — пройти связь OneToMany; o — «текущий заказ» в паре (u,o).
     * [Шаг 3] WHERE o.amount > :threshold — оставить только пары с крупным заказом.
     * [Шаг 4] DISTINCT — если подходящих заказов несколько, User в списке не дублируется.
     */
    @Query("SELECT DISTINCT u FROM User u JOIN u.orders o WHERE o.amount > :threshold")
    List<User> findWithBigOrder(@Param("threshold") long threshold);
}`,
      },
      practiceHint: {
        task:
          'Оформить @Query в UserRepository: вернуть List<User> с DISTINCT, фильтр по amount через именованный параметр :threshold.',
        timeboxMinutes: 8,
        expectedOutcome:
          'Строка JPQL согласована с полями User/Order; метод компилируется вместе с проектом или принимается как корректный ответ без БД.',
        mentorCheck:
          'Пусть кандидат проговорит: что будет без DISTINCT при двух больших заказах одного пользователя.',
      },
      lecturerNotes: [
        'Без Hibernate в IDE: оценивайте только строку JPQL + рисунок связи; компиляцию репозитория можно не требовать.',
      ],
      usefulLinksOverride: PRACTICE_LINKS,
      estimatedMinutes: 8,
    }),
    topic({
      id: 'prac-test-01',
      title: 'Задача: JUnit 5 + Mockito — сервис зовёт REST-клиент',
      simpleDefinitionOverride:
        'Сервис UserApiService делегирует вызов в UserHttpClient. В юнит-тесте сеть не поднимают: вместо реального HTTP подставляют Mockito-стаб клиента, задают ответ when(...), вызывают сервис и проверяют результат и факт вызова verify(...).',
      quickAnswer:
        '@ExtendWith(MockitoExtension.class) на класс теста, @Mock на клиент, @InjectMocks на сервис; в тесте цепочка when → вызов сервиса → assert → verify.',
      explainBrief: [
        'Три акта теста: (Arrange) настроить мок, (Act) вызвать метод сервиса, (Assert) сравнить результат и (опционально Verify) убедиться, что клиент вызван с нужным id.',
        '@InjectMocks создаёт сервис и внедряет мок клиента в конструктор — важно, чтобы зависимость была полем и принималась через конструктор.',
        'verify не заменяет assert: assert проверяет результат для пользователя, verify — что граница HTTP реально использовалась, а не «случайно совпало значение».',
        'Интерфейс UserHttpClient в эталоне упрощает Mockito; с классом-заглушкой из сниппета иногда нужен lenient или рефакторинг.',
      ],
      glossary: [
        { term: '@Mock', meaning: 'Mockito создаёт объект-заглушку с настраиваемым поведением вместо реальной реализации зависимости.' },
        { term: 'verify', meaning: 'Проверка, что на моке вызывали ожидаемый метод с ожидаемыми аргументами (или сколько раз).' },
      ],
      interviewFocus: [
        {
          question: 'Почему не ходить в реальный REST в юнит-тесте?',
          expectedAnswer: 'Флейки, скорость, изоляция юнита.',
        },
      ],
      codeExample: {
        title: 'Код для вставки',
        language: 'java',
        snippet: `import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.*;
import org.mockito.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class UserApiServiceTest {

    @Mock
    UserHttpClient client;

    @InjectMocks
    UserApiService service;

    @Test
    void returnsName() {
        // TODO when(client.fetchName(1L)).thenReturn("Ann");
        // TODO assertEquals("Ann", service.getDisplayName(1L));
        // TODO verify(client).fetchName(1L);
    }
}

// заглушки классов — студент может перенести в свои файлы
class UserHttpClient { String fetchName(long id) { throw new UnsupportedOperationException(); } }
class UserApiService {
    private final UserHttpClient client;
    UserApiService(UserHttpClient c) { this.client = c; }
    String getDisplayName(long id) { return client.fetchName(id); }
}`,
        walkthrough: [
          'Таймлайн теста: (1) when — «клиент якобы ответил Ann»; (2) service.getDisplayName — реальный вызов; (3) assert — пользователь видит Ann; (4) verify — клиент реально дернули с 1L.',
          'Если verify падает: чаще всего id другой или метод сервиса не вызывал client.',
        ],
        commonPitfall:
          'Забыть @ExtendWith(MockitoExtension.class) — тогда @Mock/@InjectMocks останутся null и тест упадёт с NPE.',
        productionNote:
          'Можно дорисовать на полях: [Тест] -> (сервис) -> [мок клиента] -> наружу сеть не идёт.',
        referenceSolution: `import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/*
 * [Шаг 1] Расширение JUnit 5: Mockito сам создаёт поля @Mock и внедряет их в @InjectMocks
 * до выполнения тестовых методов.
 */
@ExtendWith(MockitoExtension.class)
class UserApiServiceTest {

    @Mock
    UserHttpClient client;

    @InjectMocks
    UserApiService service;

    @Test
    void returnsName() {
        /*
         * [Шаг 2] Arrange: фиксируем контракт границы — при запросе id=1 клиент «как будто» вернул Ann.
         * Сети нет: это только заглушка.
         */
        when(client.fetchName(1L)).thenReturn("Ann");
        /*
         * [Шаг 3] Act + Assert: вызываем реальный сервис и сравниваем с ожидаемым именем.
         */
        assertEquals("Ann", service.getDisplayName(1L));
        /*
         * [Шаг 4] Verify: убеждаемся, что сервис действительно ходил в клиент с аргументом 1L,
         * а не вернул строку из воздуха.
         */
        verify(client).fetchName(1L);
    }
}

interface UserHttpClient {
    String fetchName(long id);
}

class UserApiService {
    private final UserHttpClient client;

    UserApiService(UserHttpClient c) {
        this.client = c;
    }

    String getDisplayName(long id) {
        return client.fetchName(id);
    }
}`,
      },
      practiceHint: {
        task:
          'Дописать тест returnsName: when(client.fetchName(1L)), вызов service.getDisplayName(1L), assertEquals и verify на fetchName(1L).',
        timeboxMinutes: 5,
        expectedOutcome:
          'Тест зелёный; при намеренном удалении verify или when падает предсказуемо.',
        mentorCheck:
          'Пусть кандидат называет вслух три роли: Arrange / Act / Assert+Verify — совпадает с телом теста.',
      },
      lecturerNotes: [
        'Если Mockito ругается на финальный класс клиента — переведите клиент на интерфейс, как в эталоне.',
      ],
      usefulLinksOverride: PRACTICE_LINKS,
      estimatedMinutes: 5,
    }),
    topic({
      id: 'prac-java-02',
      title: 'Задача: User equals/hashCode + иммутабельность ключей HashMap',
      simpleDefinitionOverride:
        'Дан value-объект User(name, age). Нужно вручную реализовать equals/hashCode без Lombok и показать, почему ключи HashMap должны быть неизменяемыми после put.',
      quickAnswer:
        'equals/hashCode считаются по одним и тем же полям; если поле ключа меняется после put, hashCode меняется, и get может не найти запись.',
      explainBrief: [
        'Сначала сделать корректный контракт equals/hashCode на полях name и age.',
        'Потом проверить на HashMap: два логически равных User должны находить одно и то же значение.',
        'Отдельно проговорить риск mutable-ключа: изменить поле после put — запись окажется в старой корзине и станет «пропавшей» для get.',
      ],
      glossary: [
        {
          term: 'equals/hashCode контракт',
          meaning: 'Если два объекта равны по equals, их hashCode обязан совпадать.',
        },
        {
          term: 'mutable key',
          meaning: 'Изменяемый ключ в HashMap опасен: после изменения полей меняется hashCode, поиск ломается.',
        },
      ],
      interviewFocus: [
        {
          question: 'Почему равные объекты обязаны иметь одинаковый hashCode?',
          expectedAnswer:
            'Иначе HashMap поместит/поискает их в разные корзины и логическое равенство перестанет работать.',
        },
      ],
      codeExample: {
        title: 'Код для вставки',
        language: 'java',
        snippet: `import java.util.*;

public final class User {
    private final String name;
    private final int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // TODO: equals/hashCode

    public static void main(String[] args) {
        Map<User, String> map = new HashMap<>();
        User a = new User("Ann", 20);
        User b = new User("Ann", 20);
        map.put(a, "ok");
        System.out.println(map.get(b)); // ожидаемо: ok
    }
}`,
        walkthrough: [
          '1) Сделать equals: this==o, проверки null/класса, затем сравнение name+age.',
          '2) Сделать hashCode по тем же полям name+age.',
          '3) Проверка в main: map.put(a, "ok"); map.get(b) печатает ok.',
          '4) Устно: почему User должен быть immutable при использовании как ключ.',
        ],
        commonPitfall: 'Сравнивать только одно поле или менять поле ключа после put.',
        referenceSolution: `import java.util.*;

public final class User {
    private final String name;
    private final int age;

    public User(String name, int age) {
        // [Шаг 1] Поля final: делаем value-объект, безопасный для ключа в HashMap
        this.name = name;
        this.age = age;
    }

    @Override
    public boolean equals(Object o) {
        // [Шаг 2] Быстрый путь: тот же объект
        if (this == o) {
            return true;
        }
        // [Шаг 3] Null/другой класс -> не равны
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        // [Шаг 4] Логическое равенство по тем же полям, что пойдут в hashCode
        User user = (User) o;
        return age == user.age && Objects.equals(name, user.name);
    }

    @Override
    public int hashCode() {
        // [Шаг 5] Hash по тем же полям: соблюдение контракта equals/hashCode
        return Objects.hash(name, age);
    }

    public static void main(String[] args) {
        // [Шаг 6] Проверка: два равных ключа находят одну запись
        Map<User, String> map = new HashMap<>();
        User a = new User("Ann", 20);
        User b = new User("Ann", 20);
        map.put(a, "ok");
        System.out.println(map.get(b));
    }
}`,
      },
      practiceHint: {
        task: 'Написать equals/hashCode и устно объяснить риск mutable-ключей в HashMap.',
        timeboxMinutes: 10,
        expectedOutcome: 'Два равных User корректно работают как ключ в HashMap.',
        mentorCheck: 'Кандидат проговаривает причину «потери» ключа после изменения поля.',
      },
      usefulLinksOverride: PRACTICE_LINKS,
      estimatedMinutes: 10,
    }),
    topic({
      id: 'prac-java-03',
      title: 'Задача: потокобезопасный счётчик — 3 способа',
      simpleDefinitionOverride:
        'Нужно реализовать инкремент счётчика тремя разными механизмами синхронизации: synchronized, ReentrantLock и AtomicInteger.',
      quickAnswer:
        'Все три варианта должны давать корректный результат в гонке потоков; выбор зависит от сложности критической секции и требований к управлению блокировкой.',
      explainBrief: [
        'Сделайте три реализации счётчика с методами increment()/get(): SyncCounter, LockCounter, AtomicCounter.',
        'Запустите два потока, каждый делает N инкрементов одного и того же счётчика; ожидаемый итог = 2 * N.',
        'Сравните подходы: synchronized — самый простой, ReentrantLock — более управляемый, AtomicInteger — лучший для простых атомарных операций.',
        'Ключевая цель задачи: показать, что без потокобезопасности итог «плавает», а с корректным примитивом всегда детерминирован.',
      ],
      glossary: [
        {
          term: 'synchronized',
          meaning: 'Монитор Java: только один поток одновременно исполняет защищённый блок/метод на одном объекте-мониторе.',
        },
        {
          term: 'ReentrantLock',
          meaning: 'Явная блокировка с ручным lock/unlock и дополнительными возможностями (tryLock, fairness, interruptible lock).',
        },
        {
          term: 'AtomicInteger',
          meaning: 'Неблокирующая атомарная переменная на CAS-операциях; удобна для простых счётчиков и флагов.',
        },
      ],
      interviewFocus: [
        {
          question: 'Когда AtomicInteger уже недостаточно?',
          expectedAnswer:
            'Когда нужно атомарно менять несколько полей/инвариантов сразу или делать составные операции с общей консистентностью.',
        },
      ],
      codeExample: {
        title: 'Код для вставки',
        language: 'java',
        snippet: `import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

public final class CountersLab {

    public static final class SyncCounter {
        private int v;
        public synchronized void increment() { /* TODO */ }
        public synchronized int get() { return v; }
    }

    public static final class LockCounter {
        private final ReentrantLock lock = new ReentrantLock();
        private int v;
        public void increment() { /* TODO: lock + try/finally */ }
        public int get() { /* TODO: lock + try/finally */ return 0; }
    }

    public static final class AtomicCounter {
        private final AtomicInteger v = new AtomicInteger();
        public void increment() { /* TODO */ }
        public int get() { return v.get(); }
    }

    private static void printResult(String label, int value) {
        System.out.println(label + "=" + value);
    }
}`,
        walkthrough: [
          '1) Реализуйте три increment(): v++, lock+v++, incrementAndGet().',
          '2) Для LockCounter обязательно unlock в finally, иначе дедлок/зависание.',
          '3) Добавьте общий тест-раннер с двумя потоками и N=100_000 для каждой реализации.',
          '4) В выводе ожидайте одинаковый итог 200_000 для всех трёх реализаций.',
        ],
        commonPitfall:
          'Сделать lock.lock() без finally/unlock или проверить результат до join потоков — это даёт ложные/нестабильные числа.',
        productionNote:
          'Для простого счётчика в проде обычно берут AtomicInteger/LongAdder; для сложных критических секций с несколькими полями — lock/synchronized.',
        referenceSolution: `import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

public final class CountersLab {

    public static final class SyncCounter {
        private int v;

        public synchronized void increment() {
            // [Шаг 1] Монитор this: один поток за раз обновляет v
            v++;
        }

        public synchronized int get() {
            // [Шаг 2] Чтение под тем же монитором для консистентности
            return v;
        }
    }

    public static final class LockCounter {
        private final ReentrantLock lock = new ReentrantLock();
        private int v;

        public void increment() {
            // [Шаг 3] Явная блокировка + обязательно unlock в finally
            lock.lock();
            try {
                v++;
            } finally {
                lock.unlock();
            }
        }

        public int get() {
            // [Шаг 4] Для чтения также используем lock, чтобы не читать «между» апдейтами
            lock.lock();
            try {
                return v;
            } finally {
                lock.unlock();
            }
        }
    }

    public static final class AtomicCounter {
        private final AtomicInteger v = new AtomicInteger();

        public void increment() {
            // [Шаг 5] Атомарный CAS-инкремент без внешнего lock
            v.incrementAndGet();
        }

        public int get() {
            return v.get();
        }
    }

    private static void printResult(String label, int value) {
        System.out.println(label + "=" + value);
    }

    private static void runRace(Runnable action) throws InterruptedException {
        // [Шаг 6] Два потока выполняют один и тот же action
        Thread t1 = new Thread(action);
        Thread t2 = new Thread(action);
        t1.start();
        t2.start();
        // [Шаг 7] join обязателен: читаем результат только после завершения обоих потоков
        t1.join();
        t2.join();
    }

    public static void main(String[] args) throws Exception {
        int n = 100_000;

        // [Шаг 8] synchronized-вариант
        SyncCounter synchronizedCounter = new SyncCounter();
        runRace(() -> {
            for (int i = 0; i < n; i++) {
                synchronizedCounter.increment();
            }
        });
        printResult("synchronized", synchronizedCounter.get());

        // [Шаг 9] ReentrantLock-вариант
        LockCounter lockCounter = new LockCounter();
        runRace(() -> {
            for (int i = 0; i < n; i++) {
                lockCounter.increment();
            }
        });
        printResult("reentrant-lock", lockCounter.get());

        // [Шаг 10] AtomicInteger-вариант
        AtomicCounter atomicCounter = new AtomicCounter();
        runRace(() -> {
            for (int i = 0; i < n; i++) {
                atomicCounter.increment();
            }
        });
        printResult("atomic-integer", atomicCounter.get());
    }
}`,
      },
      practiceHint: {
        task: 'Реализовать 3 счётчика (synchronized / ReentrantLock / AtomicInteger) и прогнать гонку из двух потоков.',
        timeboxMinutes: 12,
        expectedOutcome: 'Для всех трёх реализаций итог стабильно равен 200_000 при N=100_000 на поток.',
        mentorCheck:
          'Кандидат объясняет, почему join обязателен, и чем lock/synchronized отличаются от атомиков по применимости.',
      },
      lecturerNotes: [
        'Если не успевает: сначала AtomicCounter и SyncCounter, потом расширение до LockCounter.',
        'Сильному кандидату: спросите про LongAdder и почему он полезен при высоком contention.',
      ],
      usefulLinksOverride: PRACTICE_LINKS,
      estimatedMinutes: 12,
    }),
    topic({
      id: 'prac-kafka-01',
      title: 'Задача: Kafka consumer — try/catch и commit при ошибке',
      simpleDefinitionOverride:
        'Нужно написать обработчик входящего Kafka-сообщения в стиле Spring (@KafkaListener): try/catch вокруг бизнес-логики и явное решение, когда подтверждать offset.',
      quickAnswer:
        'В вашем стиле: listener-метод как Spring-бин, в try выполняем сервис, в конце acknowledgment.acknowledge(); в catch обычно не ack, чтобы сохранить at-least-once.',
      explainBrief: [
        'Формат задачи: отдельный consumer-компонент, не static-утилита. Метод принимает payload + key + acknowledgment.',
        'Ветка успеха: валидируем/обрабатываем событие, потом ack. Ветка ошибки: логируем и не ack (или отправляем в retry/DLQ по политике команды).',
        'Ожидаемый комментарий от кандидата: commit до обработки опасен потерей сообщения, commit после обработки даёт at-least-once и возможные дубли.',
      ],
      glossary: [
        { term: 'offset commit', meaning: 'Подтверждение Kafka, что сообщение обработано и можно двигать позицию чтения.' },
        { term: 'at-least-once', meaning: 'Сообщение может прийти повторно, но не теряется при сбоях.' },
      ],
      interviewFocus: [
        {
          question: 'Что случится, если commit сделать до обработки?',
          expectedAnswer:
            'При падении после commit сообщение потеряется для повторной обработки.',
        },
      ],
      codeExample: {
        title: 'Код для вставки',
        language: 'java',
        snippet: `import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserEventConsumer {

    private final UserEventHandlerService handlerService;

    @KafkaListener(topics = "user-events", groupId = "practice-group")
    public void onMessage(
            UserEventDto event,
            @Header(KafkaHeaders.RECEIVED_KEY) String key,
            Acknowledgment acknowledgment
    ) {
        // TODO try/catch + ack policy
    }
}`,
        walkthrough: [
          '1) Отдельный бин-consumer, бизнес-логика вынесена в сервис.',
          '2) В try вызвать handlerService.handle(event), затем acknowledgment.acknowledge().',
          '3) В catch логировать и не подтверждать offset (или отправлять в retry/DLQ по принятой политике).',
        ],
        commonPitfall: 'Подтверждать offset в finally или до handlerService.handle(event).',
        referenceSolution: `import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserEventConsumer {

    private final UserEventHandlerService handlerService;

    @KafkaListener(topics = "user-events", groupId = "practice-group")
    public void onMessage(
            UserEventDto event,
            @Header(KafkaHeaders.RECEIVED_KEY) String key,
            Acknowledgment acknowledgment
    ) {
        try {
            // [Шаг 1] Делегируем бизнес-обработку в сервисный слой
            handlerService.handle(event);
            // [Шаг 2] Подтверждаем offset только после успешной обработки
            acknowledgment.acknowledge();
        } catch (Exception ex) {
            // [Шаг 3] Ошибка: не ack, чтобы сообщение можно было переработать (at-least-once)
            log.error("Failed to process Kafka event. key={}, event={}", key, event, ex);
        }
    }
}`,
      },
      practiceHint: {
        task: 'Реализовать @KafkaListener-метод с try/catch и политикой ack/no-ack при исключении.',
        timeboxMinutes: 10,
        expectedOutcome: 'В коде явно видно: handle -> ack на успехе, no-ack на ошибке.',
        mentorCheck: 'Кандидат объясняет trade-off «дубли vs потеря» и почему ack в finally опасен.',
      },
      usefulLinksOverride: PRACTICE_LINKS,
      estimatedMinutes: 10,
    }),
    topic({
      id: 'prac-kafka-02',
      title: 'Задача: Kafka producer — отправка с key=userId',
      simpleDefinitionOverride:
        'Нужно отправить событие в Kafka в вашем проектном стиле: отдельный ...EventProducer-бин, MessageProducer + MessageBuilder + KafkaHeaders.MESSAGE_KEY.',
      quickAnswer:
        'Собираем доменное событие (DTO), кладём key в KafkaHeaders.MESSAGE_KEY и отправляем через MessageProducer; key=userId фиксирует партицию и порядок per user.',
      explainBrief: [
        'Формат: класс UserEventProducer как Spring-компонент с зависимостью UserEventMessageProducer.',
        'Событие оборачиваем в MessageBuilder.withPayload(event).setHeader(KafkaHeaders.MESSAGE_KEY, userId).build().',
        'Отправка без callback в задаче: обработка ошибок — через логирование/исключения выше по стеку, как в ваших сервисах.',
      ],
      glossary: [
        { term: 'Kafka key', meaning: 'Поле, по которому выбирается партиция сообщения.' },
        { term: 'order per key', meaning: 'Порядок для одного ключа сохраняется в пределах одной партиции.' },
      ],
      interviewFocus: [
        {
          question: 'Почему без ключа сложнее гарантировать порядок по пользователю?',
          expectedAnswer:
            'Сообщения могут распределяться по разным партициям и относительный порядок для userId теряется.',
        },
      ],
      codeExample: {
        title: 'Код для вставки',
        language: 'java',
        snippet: `import lombok.RequiredArgsConstructor;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserCreatedEventProducer {

    private final UserCreatedMessageProducer messageProducer;

    public void send(String userId, UserCreatedEventDto event) {
        // TODO собрать MessageBuilder с KafkaHeaders.MESSAGE_KEY и отправить через messageProducer
    }
}`,
        walkthrough: [
          '1) Отдельный ...EventProducer-класс как Spring-бин.',
          '2) key класть через KafkaHeaders.MESSAGE_KEY, payload — DTO события.',
          '3) Отправлять через messageProducer.send(message), без raw KafkaProducer и callback.',
        ],
        commonPitfall: 'Использовать KafkaProducer напрямую и callback, игнорируя инфраструктурный MessageProducer проекта.',
        referenceSolution: `import lombok.RequiredArgsConstructor;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserCreatedEventProducer {

    private final UserCreatedMessageProducer messageProducer;

    public void send(String userId, UserCreatedEventDto event) {
        // [Шаг 1] Формируем Spring Message: payload = событие, header key = userId
        Message<UserCreatedEventDto> message = MessageBuilder
                .withPayload(event)
                .setHeader(KafkaHeaders.MESSAGE_KEY, userId)
                .build();
        // [Шаг 2] Отправляем через проектный MessageProducer
        messageProducer.send(message);
    }
}`,
      },
      practiceHint: {
        task: 'Реализовать ...EventProducer-класс с MessageProducer + MessageBuilder + KafkaHeaders.MESSAGE_KEY.',
        timeboxMinutes: 8,
        expectedOutcome: 'Отправка сделана «как у вас»: бин-продюсер, DTO payload, key в header.',
        mentorCheck: 'Кандидат проговаривает «key=userId -> одна партиция -> порядок событий пользователя».',
      },
      usefulLinksOverride: PRACTICE_LINKS,
      estimatedMinutes: 8,
    }),
    topic({
      id: 'prac-jpa-02',
      title: 'Задача: LazyInitializationException и загрузка lazy внутри транзакции',
      simpleDefinitionOverride:
        'Показать сценарий LazyInitializationException и правильный фикс: инициализация lazy-связи внутри @Transactional.',
      quickAnswer:
        'Вне активной сессии lazy-коллекция падает; фикс — сервисный метод @Transactional(readOnly=true) и доступ к связи внутри него.',
      explainBrief: [
        'Сделать broken/fixed: broken имитирует доступ вне сессии, fixed читает связь в транзакции.',
        'Альтернатива: fetch join/DTO-проекция.',
      ],
      glossary: [
        { term: 'LazyInitializationException', meaning: 'Исключение при попытке загрузить LAZY-связь вне активной сессии Hibernate.' },
        { term: '@Transactional', meaning: 'Граница транзакции и persistence context, внутри которой можно безопасно трогать lazy-связи.' },
      ],
      interviewFocus: [
        {
          question: 'Почему нельзя решать это «Open Session in Controller»?',
          expectedAnswer:
            'Размываются границы слоя и транзакций, код становится хрупким и сложнее тестировать.',
        },
      ],
      codeExample: {
        title: 'Код для вставки',
        language: 'java',
        snippet: `public int broken(User user) {
    // TODO: показать проблему доступа к lazy вне транзакции
    throw new UnsupportedOperationException("TODO");
}

@Transactional(readOnly = true)
public int fixed(User user) {
    // TODO: доступ к user.getOrders() внутри транзакции
    return 0;
}`,
        walkthrough: [
          '1) Сделать broken с комментарием «вне сессии».',
          '2) В fixed пометить @Transactional(readOnly=true) и тронуть user.getOrders().size() внутри метода.',
          '3) Устно назвать альтернативы: fetch join или DTO.',
        ],
        commonPitfall: 'Трогать lazy-поле после выхода из транзакции.',
        referenceSolution: `import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.Collections;
import java.util.List;

@Entity
class User {
    @Id
    Long id;

    @OneToMany(mappedBy = "user")
    List<Order> orders = Collections.emptyList();
}

@Entity
class Order {
    @Id
    Long id;
}

@Service
public class UserService {

    public int broken(User user) {
        // [Шаг 1] Имитация доступа к lazy вне активной сессии
        throw new IllegalStateException("simulate LIE: lazy association outside transaction");
    }

    @Transactional(readOnly = true)
    public int fixed(User user) {
        // [Шаг 2] Доступ к lazy-связи внутри транзакции
        return user.getOrders().size();
    }
}`,
      },
      practiceHint: {
        task: 'Показать broken/fixed и объяснить причину LIE.',
        timeboxMinutes: 10,
        expectedOutcome: 'Понятно, что lazy нужно инициализировать внутри транзакции.',
        mentorCheck: 'Кандидат называет источник проблемы: закрытая сессия.',
      },
      usefulLinksOverride: PRACTICE_LINKS,
      estimatedMinutes: 10,
    }),
    topic({
      id: 'prac-java-07',
      title: 'Задача: producer-consumer на BlockingQueue',
      simpleDefinitionOverride:
        'Один поток кладёт числа в BlockingQueue, другой забирает и выводит; корректно завершить consumer.',
      quickAnswer:
        'Использовать put/take и poison pill для остановки без busy-wait.',
      explainBrief: [
        'Producer кладёт рабочие значения и финальный маркер остановки.',
        'Consumer читает в цикле take(), печатает/суммирует и останавливается на poison pill.',
      ],
      glossary: [
        { term: 'BlockingQueue', meaning: 'Потокобезопасная очередь; put/take блокируют поток до возможности операции.' },
        { term: 'poison pill', meaning: 'Специальное значение-сигнал, которым producer завершает consumer.' },
      ],
      interviewFocus: [
        {
          question: 'Зачем poison pill?',
          expectedAnswer:
            'Чтобы consumer завершился предсказуемо и не завис в вечном ожидании.',
        },
      ],
      codeExample: {
        title: 'Код для вставки',
        language: 'java',
        snippet: `import java.util.concurrent.*;

BlockingQueue<Integer> q = new ArrayBlockingQueue<>(10);
// TODO: producer кладет 1..N и -1
// TODO: consumer читает до -1 и печатает`,
        walkthrough: [
          '1) Producer: put(1..N), потом put(-1).',
          '2) Consumer: take() в цикле, break на -1.',
          '3) Дождаться join обоих потоков и проверить, что приложение не зависает.',
        ],
        commonPitfall: 'Не положить сигнал остановки.',
        referenceSolution: `import java.util.concurrent.*;

public final class QueueLab {
    public static void main(String[] args) throws Exception {
        // [Шаг 1] Очередь с ограничением: backpressure через put/take
        BlockingQueue<Integer> q = new ArrayBlockingQueue<>(10);

        Thread producer = new Thread(() -> {
            try {
                // [Шаг 2] Рабочие значения
                for (int i = 1; i <= 10; i++) {
                    q.put(i);
                }
                // [Шаг 3] Poison pill для завершения consumer
                q.put(-1);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        Thread consumer = new Thread(() -> {
            try {
                while (true) {
                    // [Шаг 4] take блокируется без busy-wait
                    int value = q.take();
                    // [Шаг 5] Условие завершения
                    if (value == -1) {
                        break;
                    }
                    // [Шаг 6] Полезная обработка
                    System.out.println(value);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        // [Шаг 7] Старт и корректное завершение
        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
    }
}`,
      },
      practiceHint: {
        task: 'Реализовать producer-consumer на BlockingQueue с корректным завершением.',
        timeboxMinutes: 10,
        expectedOutcome: 'Оба потока завершаются, результат выводится.',
        mentorCheck: 'Использованы блокирующие put/take.',
      },
      usefulLinksOverride: PRACTICE_LINKS,
      estimatedMinutes: 10,
    }),
    topic({
      id: 'prac-java-08',
      title: 'Задача: первая секунда следующего дня',
      simpleDefinitionOverride:
        'Написать метод, который принимает дату и возвращает первую секунду следующего дня в заданной зоне.',
      quickAnswer:
        'LocalDate next = date.plusDays(1); return next.atStartOfDay(zone).',
      explainBrief: [
        'Вход LocalDate + ZoneId, выход LocalDateTime следующего дня в 00:00:00.',
        'Подчеркнуть, что плюс день не мутирует исходную дату.',
      ],
      glossary: [
        { term: 'LocalDate', meaning: 'Дата без времени и зоны.' },
        { term: 'ZoneId', meaning: 'Явная временная зона, чтобы поведение не зависело от настроек машины.' },
      ],
      interviewFocus: [
        {
          question: 'Почему лучше передавать ZoneId явно?',
          expectedAnswer:
            'Чтобы не зависеть от системной зоны машины и избежать скрытых расхождений во времени.',
        },
      ],
      codeExample: {
        title: 'Код для вставки',
        language: 'java',
        snippet: `import java.time.*;

public static LocalDateTime firstInstantOfNextDay(LocalDate date, ZoneId zone) {
    // TODO
    throw new UnsupportedOperationException("TODO");
}`,
        walkthrough: [
          '1) LocalDate next = date.plusDays(1).',
          '2) return next.atStartOfDay(zone).',
          '3) Проверка на фиксированной дате и зоне Europe/Moscow.',
        ],
        commonPitfall: 'Забыть плюс день перед atStartOfDay.',
        referenceSolution: `import java.time.*;

public final class NextDayLab {

    public static LocalDateTime firstInstantOfNextDay(LocalDate date, ZoneId zone) {
        // [Шаг 1] Следующий календарный день
        LocalDate nextDay = date.plusDays(1);
        // [Шаг 2] Полночь следующего дня в заданной зоне
        return nextDay.atStartOfDay(zone);
    }

    public static void main(String[] args) {
        // [Шаг 3] Демонстрация
        LocalDate d = LocalDate.of(2026, 5, 4);
        System.out.println(firstInstantOfNextDay(d, ZoneId.of("Europe/Moscow")));
    }
}`,
      },
      practiceHint: {
        task: 'Реализовать firstInstantOfNextDay(LocalDate, ZoneId).',
        timeboxMinutes: 8,
        expectedOutcome: 'Метод возвращает полночь следующего дня.',
        mentorCheck: 'Используется java.time и явная зона.',
      },
      usefulLinksOverride: PRACTICE_LINKS,
      estimatedMinutes: 8,
    }),
  ],
};
