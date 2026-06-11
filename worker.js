// worker.js — Конфигурация и точка входа Cloudflare Worker

// =============================================================================
// НАСТРОЙКИ
// =============================================================================

const CONFIG = {
    // Заголовки ответа
    headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        // Раскомментируйте, если нужен CORS:
        // 'Access-Control-Allow-Origin': '*',
    },

    // Маршруты: какой путь отдаёт страницу
    routes: {
        home: '/',
    },
};

// =============================================================================
// ОБРАБОТЧИК ЗАПРОСОВ
// =============================================================================

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);

    // Главная страница
    if (url.pathname === CONFIG.routes.home || url.pathname === '/index.html') {
        // Файлы index.html, app.js и chats.js собираются через wrangler
        // и подставляются сюда через __HTML_CONTENT__ (см. wrangler.toml → [vars])
        // Либо при деплое через CI используйте Assets / Static Files binding.

        const html = await getPageHTML();
        return new Response(html, { headers: CONFIG.headers });
    }

    // Всё остальное → 404
    return new Response('Not found', { status: 404 });
}

// =============================================================================
// СБОРКА HTML
// Если вы используете Cloudflare Pages или Workers Assets,
// замените эту функцию на fetch из KV / Assets binding.
// =============================================================================

async function getPageHTML() {
    // При деплое сюда вставляется содержимое index.html,
    // а app.js и chats.js инлайнятся через <script> теги.
    // Для локальной разработки используйте `wrangler dev`.
    return HTML_TEMPLATE;
}

// =============================================================================
// HTML_TEMPLATE — при сборке заменяется содержимым index.html
// Для быстрого старта без сборки — редактируйте прямо здесь,
// вставив содержимое index.html, app.js и chats.js.
// =============================================================================

const HTML_TEMPLATE = `<!-- Содержимое index.html подставляется здесь при деплое -->`;
