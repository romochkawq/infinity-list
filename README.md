# Infinity List

Двухпанельный выбор и сортировка над списком из 1 000 000 элементов. Состояние выбора и
порядка хранится на сервере в памяти (без БД), общее для всех.

## Команды

```bash
cp .env.example .env
npm install
npm run dev            # backend + frontend параллельно
```

| Команда                | Назначение                          |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | backend + frontend параллельно      |
| `npm run build`        | сборка common → backend → frontend  |
| `npm run lint`         | ESLint по всему монорепо             |
| `npm run format`       | Prettier --write                     |
| `npm run format:check` | Prettier --check                     |

- Backend: http://localhost:3000 (Swagger UI — `/docs`)
- Frontend: http://localhost:5173

## API (префикс `/api`)

| Метод  | Путь                       | Назначение                                  |
| ------ | -------------------------- | ------------------------------------------- |
| `GET`  | `/items/available`         | левая панель — курсор `?cursor&limit&search`|
| `GET`  | `/items/selected`          | правая панель — `?offset&limit&search`      |
| `POST` | `/items`                   | батч-добавление новых ID (идемпотентно)     |
| `POST` | `/selection/mutations`     | батч select / deselect / reorder по порядку |
