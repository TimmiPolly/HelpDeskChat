# helpdesk-tester

Лёгкий стенд для ручного тестирования виджетов чатов хелпдеска (Intercom, Zendesk, Crisp и других). Разворачивается как Cloudflare Worker за одну команду, не требует бэкенда и баз данных.

---

## Зачем это нужно

При интеграции чата хелпдеска часто нужна страница, на которой можно:

- проверить, что виджет загружается и инициализируется с правильными данными пользователя
- воспроизвести сценарии с конкретными user_id или email без доступа к продакшн-среде
- быстро переключаться между разными чат-платформами, меняя один файл
- отдать ссылку QA-инженеру или менеджеру без поднятия отдельного сервера

Страница генерирует уникального тестового пользователя при первом визите и сохраняет его в `localStorage`, так что повторные открытия воспроизводят ту же личность — это важно для тестирования истории переписки и атрибуции сессий.

---

## Структура проекта

```
.
├── index.html      — страница стенда (HTML + стили)
├── app.js          — логика генерации и хранения данных пользователя
├── chats.js        — скрипты установки чатов (сюда добавляются виджеты)
├── worker.js       — Cloudflare Worker: обработчик запросов и конфигурация
├── wrangler.toml   — конфигурация деплоя для Wrangler CLI
└── README.md       — этот файл
```

### `index.html` — страница

Визуальный стенд. Показывает три карточки с данными текущего тестового пользователя (User ID, email, время сессии) и кнопку для открытия чата. Подключает `app.js` и `chats.js` как внешние скрипты.

### `app.js` — логика пользователя

Запускается первым. Проверяет `localStorage` на наличие сохранённого пользователя:

- если пользователя нет — генерирует уникальный `user_id` вида `test_<timestamp>_<random>`, имя `Тестировщик` и синтетический email `test_<id>@helpdesk.test`, сохраняет всё в `localStorage`
- если пользователь уже есть — читает сохранённые данные

Результат публикуется в глобальную переменную `window.helpdeskUser`:

```js
window.helpdeskUser = {
  id:        "test_1718000000000_x7k3m",
  name:      "Тестировщик",
  email:     "test_test_1718…@helpdesk.test",
  createdAt: 1718000000,   // unix-timestamp
}
```

Все скрипты чатов берут данные отсюда, а не генерируют их самостоятельно.

### `chats.js` — скрипты чатов

Единственный файл, который нужно трогать при добавлении или замене чат-платформы. Текущее содержимое: инициализация Intercom. Данные пользователя доступны через `window.helpdeskUser`.

Чтобы добавить новый чат — вставьте его скрипт в конец файла по той же схеме.

### `worker.js` — Cloudflare Worker

Обработчик запросов. Конфигурация маршрутов и заголовков ответа вынесена в объект `CONFIG` в начале файла. При использовании Wrangler Assets (`[assets]` в `wrangler.toml`) этот файл отдаёт только нестандартные маршруты — статику Wrangler раздаёт сам.

### `wrangler.toml` — конфигурация деплоя

Описывает два окружения: `production` (имя `helpdesk-tester`) и `test` (имя `helpdesk-tester-test`). Оба раздают файлы из текущей папки через `[assets]`. KV-секции закомментированы — раскомментируйте и подставьте ID, если понадобится серверное хранилище.

---

## Быстрый старт

### Требования

- [Node.js](https://nodejs.org/) 18+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) 3+
- Аккаунт Cloudflare (бесплатный достаточен)

### Локальная разработка

```bash
# Установить Wrangler, если ещё не установлен
npm install -g wrangler

# Запустить локальный сервер
wrangler dev
```

Страница будет доступна на `http://localhost:8787`.

### Деплой в production

```bash
wrangler deploy
```

### Деплой в тестовое окружение

```bash
wrangler deploy --env test
```

---

## Как добавить новый чат

Откройте `chats.js` и добавьте скрипт вашей платформы в конец файла. Данные пользователя уже доступны:

```js
// Пример для Zendesk
window.zESettings = {
  webWidget: {
    identify: {
      name:  window.helpdeskUser.name,
      email: window.helpdeskUser.email,
    }
  }
};

(function(d, s) {
  var z = d.createElement(s);
  z.src = 'https://static.zdassets.com/ekr/snippet.js?key=ВАШ_KEY';
  z.async = true;
  d.head.appendChild(z);
})(document, 'script');
```

Те же поля работают для Crisp, HubSpot, LiveChat и любой другой платформы, принимающей `user_id`, `email`, `name`.

---

## Как сбросить тестового пользователя

Данные хранятся в `localStorage` браузера. Чтобы сгенерировать нового пользователя:

```js
// В консоли браузера:
localStorage.clear();
location.reload();
```

Или откройте страницу в режиме инкогнито — каждая сессия инкогнито изолирована.

---

## Окружения и деплой

| Окружение | Команда | Worker name |
|---|---|---|
| Production | `wrangler deploy` | `helpdesk-tester` |
| Test | `wrangler deploy --env test` | `helpdesk-tester-test` |
| Локально | `wrangler dev` | — |

Имена Worker-ов задаются в `wrangler.toml` в полях `name` и `[env.test] name` — поменяйте их, если ваш CI ожидает другие названия.

---

## Настройка Intercom

В `chats.js` прописан `app_id: "n571sxh5"`. Замените его на ID вашего Intercom-воркспейса:

```js
window.intercomSettings = {
  api_base: "https://api-iam.intercom.io",
  app_id:   "ВАШ_APP_ID",       // ← сюда
  user_id:  window.helpdeskUser.id,
  name:     window.helpdeskUser.name,
  email:    window.helpdeskUser.email,
  created_at: window.helpdeskUser.createdAt,
};
```

App ID находится в Intercom → Settings → Installation → Your app's Intercom code.

Если в вашем воркспейсе включена верификация личности (Identity Verification), нужно также передавать `user_hash`. Генерация хэша требует серверного HMAC-SHA256 — в этом случае перенесите инициализацию Intercom в `worker.js` и отдавайте хэш через переменную окружения Cloudflare.

---

## Безопасность

Страница предназначена только для тестирования. Не используйте реальные данные пользователей и не открывайте публичный доступ к ней на продакшн-домене. Рекомендуется:

- деплоить тестовый Worker на отдельный поддомен (`test.example.com`)
- ограничить доступ через Cloudflare Access, если страница не должна быть публичной
- не хранить продакшн-ключи и токены в `chats.js` — используйте переменные окружения Wrangler (`[vars]` в `wrangler.toml` или секреты через `wrangler secret put`)
