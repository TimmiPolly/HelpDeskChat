// worker.js — Конфигурация и точка входа Cloudflare Worker (ES Modules формат)

// =============================================================================
// НАСТРОЙКИ
// =============================================================================

const CONFIG = {
    // Заголовки ответа
    headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
    routes: {
        home: '/',
        health: '/health',
    },
};

// =============================================================================
// ОСНОВНОЙ ОБРАБОТЧИК (ES Modules export)
// =============================================================================

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const method = request.method;

        // Обработка CORS preflight (OPTIONS)
        if (method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

        // Health check endpoint
        if (url.pathname === CONFIG.routes.health) {
            return new Response(JSON.stringify({ 
                status: 'ok', 
                timestamp: Date.now(),
                version: '1.0.0'
            }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Главная страница
        if (url.pathname === CONFIG.routes.home || url.pathname === '/index.html') {
            try {
                const html = generateFullHTML();
                return new Response(html, { headers: CONFIG.headers });
            } catch (error) {
                console.error('Error generating page:', error);
                return new Response('Internal Server Error', { status: 500 });
            }
        }

        // Всё остальное → 404
        return new Response('Not Found', { status: 404 });
    },
};

// =============================================================================
// ПОЛНЫЙ HTML С ВСТРОЕННЫМИ СКРИПТАМИ
// =============================================================================

function generateFullHTML() {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Тестирование чатов хелпдеска</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .center {
            text-align: center;
            padding: 20px;
        }

        h1 {
            font-size: 3rem;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            font-weight: 600;
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 1.8rem;
            }
        }
    </style>
</head>
<body>
    <div class="center">
        <h1>Привет! Это страница для тестирования чатов хелпдеска</h1>
    </div>

    <script>
        // app.js — Основная логика: генерация и хранение данных пользователя
        (function () {
            try {
                let userId = localStorage.getItem('intercom_user_id');
                let userName = localStorage.getItem('intercom_user_name');
                let userEmail = localStorage.getItem('intercom_user_email');
                let userCreatedAt = localStorage.getItem('intercom_created_at');

                if (userId && (typeof userId !== 'string' || userId.trim() === '')) {
                    userId = null;
                }

                if (!userId) {
                    userId = 'test_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
                    localStorage.setItem('intercom_user_id', userId);

                    userCreatedAt = Math.floor(Date.now() / 1000);
                    localStorage.setItem('intercom_created_at', userCreatedAt);

                    userName = "Тестировщик";
                    localStorage.setItem('intercom_user_name', userName);

                    userEmail = 'test_' + userId + '@helpdesk.test';
                    localStorage.setItem('intercom_user_email', userEmail);
                } else {
                    userName = localStorage.getItem('intercom_user_name');
                    if (!userName || typeof userName !== 'string' || userName.trim() === '') {
                        userName = "Тестировщик";
                        localStorage.setItem('intercom_user_name', userName);
                    }
                    
                    userEmail = localStorage.getItem('intercom_user_email');
                    if (!userEmail || typeof userEmail !== 'string' || userEmail.trim() === '') {
                        userEmail = 'test_' + userId + '@helpdesk.test';
                        localStorage.setItem('intercom_user_email', userEmail);
                    }
                    
                    userCreatedAt = localStorage.getItem('intercom_created_at');
                    let createdAtNum = parseInt(userCreatedAt, 10);
                    if (isNaN(createdAtNum) || createdAtNum <= 0) {
                        userCreatedAt = Math.floor(Date.now() / 1000);
                        localStorage.setItem('intercom_created_at', userCreatedAt);
                    }
                }

                let createdAtTimestamp = parseInt(userCreatedAt, 10);
                if (isNaN(createdAtTimestamp) || createdAtTimestamp <= 0) {
                    createdAtTimestamp = Math.floor(Date.now() / 1000);
                }

                window.helpdeskUser = {
                    id: String(userId),
                    name: String(userName),
                    email: String(userEmail),
                    createdAt: createdAtTimestamp,
                };

                console.log('Helpdesk user initialized:', window.helpdeskUser);
                
            } catch (error) {
                console.error('Error initializing helpdesk user:', error);
                window.helpdeskUser = {
                    id: 'fallback_' + Date.now(),
                    name: 'Тестировщик',
                    email: 'fallback@helpdesk.test',
                    createdAt: Math.floor(Date.now() / 1000),
                };
            }
        })();
    </script>

    <script>
        // chats.js — Скрипты установки чатов хелпдеска

        // Intercom
        if (typeof window.helpdeskUser !== 'undefined' && window.helpdeskUser) {
            window.intercomSettings = {
                api_base: "https://api-iam.intercom.io",
                app_id: "n571sxh5",
                user_id: window.helpdeskUser.id,
                name: window.helpdeskUser.name,
                email: window.helpdeskUser.email,
                created_at: window.helpdeskUser.createdAt,
            };
        }

        (function() {
            var w = window;
            var ic = w.Intercom;
            
            if (typeof ic === "function") {
                ic('reattach_activator');
                if (w.intercomSettings) {
                    ic('update', w.intercomSettings);
                }
            } else {
                var d = document;
                var i = function() { 
                    i.c(arguments); 
                };
                i.q = [];
                i.c = function(args) { 
                    i.q.push(args); 
                };
                w.Intercom = i;
                
                var l = function() {
                    var s = d.createElement('script');
                    s.type = 'text/javascript';
                    s.async = true;
                    s.src = 'https://widget.intercom.io/widget/n571sxh5';
                    s.onload = function() {
                        if (w.Intercom && w.intercomSettings) {
                            w.Intercom('update', w.intercomSettings);
                        }
                    };
                    s.onerror = function() {
                        console.error('Failed to load Intercom widget');
                    };
                    var x = d.getElementsByTagName('script')[0];
                    x.parentNode.insertBefore(s, x);
                };
                
                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                    setTimeout(l, 0);
                } else {
                    w.addEventListener('load', l, false);
                }
            }
        })();

        console.log('Chats initialized with user:', window.helpdeskUser?.name);
    </script>
</body>
</html>`;
}
