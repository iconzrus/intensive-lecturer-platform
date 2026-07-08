import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  equals / hashCode — один файл, Run main
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Открой ЭТОТ файл в IDE → правь блоки TODO → Run main (Shift+F10).
 *  В консоли: Задание N — OK или FAIL + что не так.
 *
 * ─── Задание 1 — класс Task01_GoodKey ─────────────────────────────────────
 *  Реализуй equals() и hashCode() по полю email.
 *
 * ─── Задание 2 — класс Task02_FixHashCodeKey ──────────────────────────────
 *  equals уже есть. Замени hashCode() — сейчас сломан (identityHashCode).
 *
 * ─── Задание 3 — класс Task03_SymmetricKey ────────────────────────────────
 *  Перепиши equals/hashCode: сравнивай ТОЛЬКО email (убери «vip равен всем»).
 *
 * ─── Задание 4 — класс Task04_ImmutableKey ────────────────────────────────
 *  Сделай id финальным, убери setId — ключ не должен меняться после put.
 *
 * ─── Задание 5 — класс Task05_TransitiveKey ───────────────────────────────
 *  Равны только при совпадении name И group. Убери «круговое» равенство 1-2-3.
 *
 *  Когда все строки «OK» — пиши «дальше» (следующая тема: HashMap).
 * ═══════════════════════════════════════════════════════════════════════════
 */
public class EqualsHashCodeLab {

    public static void main(String[] args) {
        int ok = 0;
        ok += check(1, task01()) ? 1 : 0;
        ok += check(2, task02()) ? 1 : 0;
        ok += check(3, task03()) ? 1 : 0;
        ok += check(4, task04()) ? 1 : 0;
        ok += check(5, task05()) ? 1 : 0;
        System.out.println("\nИтого: " + ok + "/5");
        if (ok < 5) {
            System.exit(1);
        }
    }

    private static boolean check(int n, Result r) {
        String mark = r.passed ? "OK" : "FAIL";
        System.out.println("Задание " + n + " — " + mark + ": " + r.message);
        return r.passed;
    }

    private record Result(boolean passed, String message) {
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ТВОЙ КОД — правь только классы ниже
    // ═══════════════════════════════════════════════════════════════════════

    static final class Task01_GoodKey {
        private final String email;

        Task01_GoodKey(String email) {
            this.email = email;
        }

        @Override
        public boolean equals(Object o) {
            // TODO 1
            return false;
        }

        @Override
        public int hashCode() {
            // TODO 1
            return 0;
        }
    }

    static final class Task02_FixHashCodeKey {
        private final String email;

        Task02_FixHashCodeKey(String email) {
            this.email = email;
        }

        @Override
        public boolean equals(Object o) {
            if (!(o instanceof Task02_FixHashCodeKey other)) {
                return false;
            }
            return Objects.equals(email, other.email);
        }

        @Override
        public int hashCode() {
            // TODO 2 — замени identityHashCode на согласованный с equals
            return System.identityHashCode(this);
        }
    }

    static final class Task03_SymmetricKey {
        private final String email;
        private final boolean vip;

        Task03_SymmetricKey(String email, boolean vip) {
            this.email = email;
            this.vip = vip;
        }

        @Override
        public boolean equals(Object o) {
            // TODO 3
            if (!(o instanceof Task03_SymmetricKey other)) {
                return false;
            }
            if (vip) {
                return true;
            }
            return !other.vip && Objects.equals(email, other.email);
        }

        @Override
        public int hashCode() {
            // TODO 3
            return Objects.hash(email, vip);
        }
    }

    static final class Task04_ImmutableKey {
        // TODO 4 — private final String id;
        private String id;

        Task04_ImmutableKey(String id) {
            this.id = id;
        }

        void setId(String id) {
            // TODO 4 — удали метод
            this.id = id;
        }

        @Override
        public boolean equals(Object o) {
            if (!(o instanceof Task04_ImmutableKey other)) {
                return false;
            }
            return Objects.equals(id, other.id);
        }

        @Override
        public int hashCode() {
            return Objects.hash(id);
        }
    }

    static final class Task05_TransitiveKey {
        private final String name;
        private final int group;

        Task05_TransitiveKey(String name, int group) {
            this.name = name;
            this.group = group;
        }

        @Override
        public boolean equals(Object o) {
            // TODO 5 — только name + group, без круга 1-2-3
            if (!(o instanceof Task05_TransitiveKey other)) {
                return false;
            }
            if (group == 1 && other.group == 2) {
                return true;
            }
            if (group == 2 && other.group == 3) {
                return true;
            }
            if (group == 3 && other.group == 1) {
                return true;
            }
            return group == other.group && Objects.equals(name, other.name);
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, group);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  Проверки — не трогай
    // ═══════════════════════════════════════════════════════════════════════

    private static Result task01() {
        Task01_GoodKey a = new Task01_GoodKey("u@mail.com");
        Task01_GoodKey b = new Task01_GoodKey("u@mail.com");
        return probeCollections("Task01", a, b, true);
    }

    private static Result task02() {
        Task02_FixHashCodeKey a = new Task02_FixHashCodeKey("a@x.com");
        Task02_FixHashCodeKey b = new Task02_FixHashCodeKey("a@x.com");
        if (!a.equals(b)) {
            return new Result(false, "equals должен быть true");
        }
        if (a.hashCode() == b.hashCode() && probeCollections("Task02", a, b, true).passed) {
            return new Result(true, "HashMap/HashSet/distinct/groupingBy как у List");
        }
        Probe p = probe(a, b);
        if (p.listContains && !p.hashMapGet) {
            return new Result(false, "типичный баг: List.contains=true, HashMap.get=null — почини hashCode");
        }
        return new Result(false, "hashCode не согласован с equals");
    }

    private static Result task03() {
        Task03_SymmetricKey vip = new Task03_SymmetricKey("boss", true);
        Task03_SymmetricKey user = new Task03_SymmetricKey("user@x.com", false);
        if (vip.equals(user) != user.equals(vip)) {
            return new Result(false, "нет симметрии: vip.equals(user)=" + vip.equals(user)
                    + ", user.equals(vip)=" + user.equals(vip));
        }
        return new Result(true, "equals симметричен");
    }

    private static Result task04() {
        try {
            if (!java.lang.reflect.Modifier.isFinal(Task04_ImmutableKey.class.getDeclaredField("id").getModifiers())) {
                return new Result(false, "поле id должно быть final");
            }
        } catch (NoSuchFieldException e) {
            return new Result(false, "нет поля id");
        }
        Task04_ImmutableKey key = new Task04_ImmutableKey("id-1");
        Task04_ImmutableKey lookup = new Task04_ImmutableKey("id-1");
        Map<Task04_ImmutableKey, String> map = new HashMap<>();
        map.put(key, "ok");
        if (map.get(lookup) == null) {
            return new Result(false, "map.get после put — null");
        }
        return new Result(true, "immutable ключ, map находит");
    }

    private static Result task05() {
        Task05_TransitiveKey a = new Task05_TransitiveKey("A", 1);
        Task05_TransitiveKey b = new Task05_TransitiveKey("B", 2);
        Task05_TransitiveKey c = new Task05_TransitiveKey("C", 3);
        if (a.equals(b) && b.equals(c) && !a.equals(c)) {
            return new Result(false, "A=B, B=C, но A!=C — нет транзитивности");
        }
        Task05_TransitiveKey x = new Task05_TransitiveKey("same", 1);
        Task05_TransitiveKey y = new Task05_TransitiveKey("same", 1);
        return probeCollections("Task05", x, y, true);
    }

    private static Result probeCollections(String name, Object a, Object b, boolean expectEqual) {
        if (expectEqual && !contractOk(a, b)) {
            return new Result(false, "equals/hashCode контракт: equals=" + a.equals(b)
                    + " hashEqual=" + (a.hashCode() == b.hashCode()));
        }
        Probe p = probe(a, b);
        if (!p.hashSetContains || !p.hashMapGet || !p.hashMapRemove || p.distinctSize != 1 || p.groupBuckets != 1) {
            return new Result(false, name + " HashSet/HashMap/distinct/groupingBy — "
                    + "set=" + p.hashSetContains + " map=" + p.hashMapGet
                    + " distinct=" + p.distinctSize + " buckets=" + p.groupBuckets
                    + " (list.contains=" + p.listContains + ")");
        }
        return new Result(true, "все коллекции согласованы");
    }

    private static boolean contractOk(Object a, Object b) {
        return a.equals(b) && b.equals(a) && a.equals(a) && a.hashCode() == b.hashCode();
    }

    private static final class Probe {
        boolean hashSetContains;
        boolean hashMapGet;
        boolean hashMapRemove;
        boolean listContains;
        int distinctSize;
        int groupBuckets;
    }

    private static Probe probe(Object a, Object b) {
        Probe p = new Probe();
        Set<Object> set = new HashSet<>();
        set.add(a);
        p.hashSetContains = set.contains(b);
        Map<Object, String> map = new HashMap<>();
        map.put(a, "v");
        p.hashMapGet = map.get(b) != null;
        p.hashMapRemove = map.remove(b) != null;
        p.listContains = new ArrayList<>(List.of(a)).contains(b);
        p.distinctSize = List.of(a, b).stream().distinct().toList().size();
        p.groupBuckets = List.of(a, b).stream().collect(Collectors.groupingBy(k -> k, Collectors.counting())).size();
        return p;
    }
}
