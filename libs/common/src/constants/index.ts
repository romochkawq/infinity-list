/** Размер страницы для обеих панелей (инфинити-скролл порциями по 20). */
export const PAGE_SIZE = 20;

/** Максимальный «базовый» ID встроенной вселенной элементов: 1..MAX_BASE_ID. */
export const MAX_BASE_ID = 1_000_000;

/** Интервал флаша очереди добавления элементов (батчинг раз в 10 секунд). */
export const ADD_BATCH_MS = 10_000;

/** Интервал флаша очереди мутаций select/deselect/reorder (раз в 1 секунду). */
export const MUTATION_BATCH_MS = 1_000;

/** Троттлинг триггеров «загрузить ещё» при инфинити-скролле (раз в 1 секунду). */
export const FETCH_THROTTLE_MS = 1_000;

/** Анти-DoS: максимум ID в одном запросе на добавление. */
export const MAX_ADD_BATCH = 1_000;

/** Анти-DoS: максимум операций в одном запросе мутаций. */
export const MAX_MUTATION_BATCH = 1_000;

/** Жёсткий потолок limit для пагинации (клампинг входа). */
export const MAX_PAGE_LIMIT = 100;
