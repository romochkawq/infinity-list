# Infinity List

## Команды

```bash
cp .env.example .env
npm install
npm run dev
```

## API

| Метод  | Путь                       | Назначение                                   |
|--------|----------------------------|----------------------------------------------|
| `GET`  | `/api/items/available`     | левая панель - курсор `?cursor&limit&search` |
| `GET`  | `/api/items/selected`      | правая панель - `?offset&limit&search`       |
| `POST` | `/api/items`               | батч-добавление новых ID (идемпотентно)      |
| `POST` | `/api/selection/mutations` | батч select / deselect / reorder по порядку  |
