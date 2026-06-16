# Infinity List

Двухпанельный интерфейс выбора и сортировки над списком из **1 000 000 элементов**
(ID `1..1 000 000`). Левая панель — все элементы, кроме выбранных; правая — выбранные
с сортировкой Drag&Drop. Состояние выбора и порядка хранится **на сервере в памяти**
(без БД) и общее для всех посетителей.

## Стек

- **Монорепо:** npm workspaces — `libs/common`, `backend`, `frontend`.
- **Backend:** TypeScript, Express, чистая архитектура, in-memory store, Swagger на `/docs`.
- **Frontend:** TypeScript, React, Vite, TanStack Query, Zustand, dnd-kit, react-virtuoso (FSD).
- **Общее:** `@infinity/common` — контракты API, константы, коды ошибок (один источник истины).

## Структура

```
libs/common/   # @infinity/common: contracts / constants / errors
backend/       # Express API (чистая архитектура)
frontend/      # React SPA (FSD)
```

## Запуск (dev)

```bash
cp .env.example .env
npm install
npm run dev          # backend + frontend параллельно
```

- Backend: http://localhost:3000 (API — `/api`, Swagger — `/docs`)
- Frontend: http://localhost:5173

## Скрипты (корень)

| Скрипт                 | Назначение                                    |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | backend + frontend параллельно (concurrently) |
| `npm run build`        | сборка common → backend → frontend            |
| `npm run lint`         | ESLint по всему монорепо (вкл. `no-void`)     |
| `npm run format`       | Prettier --write                              |
| `npm run format:check` | Prettier --check                              |

> Подробнее об API и архитектуре backend — в `backend/README.md`.
