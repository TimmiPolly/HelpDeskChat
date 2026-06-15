// worker.js — Cloudflare Worker в формате ES Modules

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
        // Маршрутизация
        if (url.pathname === '/' || url.pathname === '/index.html') {
            const html = await getHTML();
            return new Response(html, {
                headers: { 'Content-Type': 'text/html;charset=UTF-8' }
            });
        }
        
        if (url.pathname === '/app.js') {
            const appJS = await getAppJS();
            return new Response(appJS, {
                headers: { 'Content-Type': 'application/javascript;charset=UTF-8' }
            });
        }
        
        if (url.pathname === '/chats.js') {
            const chatsJS = await getChatsJS();
            return new Response(chatsJS, {
                headers: { 'Content-Type': 'application/javascript;charset=UTF-8' }
            });
        }
        
        return new Response('Not Found', { status: 404 });
    }
};

async function getHTML() {
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
            position: relative;
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
            margin-bottom: 30px;
        }

        .reset-btn {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            padding: 12px 32px;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .reset-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .user-info {
            margin-top: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            color: white;
            font-size: 0.9rem;
            text-align: left;
            max-width: 400px;
        }

        .user-info p {
            margin: 5px 0;
        }

        .user-info strong {
            color: #ffd700;
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
        
        <button class="reset-btn" id="resetChatBtn">
            🔄 Сбросить чат и начать новый сеанс
        </button>
        
        <div class="user-info" id="userInfo">
            <p><strong>🆔 ID:</strong> Загрузка...</p>
            <p><strong>👤 Имя:</strong> Загрузка...</p>
            <p><strong>📧 Email:</strong> Загрузка...</p>
            <p><strong>📅 Создан:</strong> Загрузка...</p>
        </div>
    </div>

    <script src="app.js"></script>
    <script src="chats.js"></script>
</body>
</html>`;
}

async function getAppJS() {
    return `// app.js — Основная логика: генерация и хранение данных пользователя

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

        function displayUserInfo() {
            const userInfoDiv = document.getElementById('userInfo');
            if (userInfoDiv && window.helpdeskUser) {
                const date = new Date(window.helpdeskUser.createdAt * 1000);
                userInfoDiv.innerHTML = \`
                    <p><strong>🆔 ID:</strong> \${window.helpdeskUser.id}</p>
                    <p><strong>👤 Имя:</strong> \${window.helpdeskUser.name}</p>
                    <p><strong>📧 Email:</strong> \${window.helpdeskUser.email}</p>
                    <p><strong>📅 Создан:</strong> \${date.toLocaleString()}</p>
                \`;
            }
        }

        window.resetChat = function() {
            if (confirm('Вы уверены? Это очистит данные текущего чата и начнёт новый сеанс.')) {
                const keysToRemove = [
                    'intercom_user_id',
                    'intercom_user_name', 
                    'intercom_user_email',
                    'intercom_created_at',
                    'Intercom.identity',
                    'intercom.identity',
                    'intercom-session'
                ];
                
                keysToRemove.forEach(key => {
                    localStorage.removeItem(key);
                });
                
                sessionStorage.clear();
                
                document.cookie.split(";").forEach(function(c) {
                    if (c.trim().startsWith('intercom')) {
                        document.cookie = c.trim() + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    }
                });
                
                if (window.Intercom) {
                    try {
                        window.Intercom('shutdown');
                    } catch(e) {}
                    delete window.Intercom;
                }
                
                const intercomScript = document.querySelector('script[src*="widget.intercom.io"]');
                if (intercomScript) {
                    intercomScript.remove();
                }
                
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', displayUserInfo);
        } else {
            displayUserInfo();
        }

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
})();`;
}

async function getChatsJS() {
    return `// chats.js — Скрипты установки чатов хелпдеска

function initIntercom() {
    if (!window.helpdeskUser) {
        console.error('helpdeskUser not initialized!');
        return;
    }

    window.intercomSettings = {
        api_base: "https://api-iam.intercom.io",
        app_id: "e7s8lh5w",
        user_id: window.helpdeskUser.id,
        name: window.helpdeskUser.name,
        email: window.helpdeskUser.email,
        created_at: window.helpdeskUser.createdAt,
        custom_attributes: {
            platform: "web",
            version: "1.0"
        }
    };
}

function waitForHelpdeskUser(callback) {
    if (window.helpdeskUser) {
        callback();
    } else {
        setTimeout(() => waitForHelpdeskUser(callback), 50);
    }
}

waitForHelpdeskUser(() => {
    initIntercom();
    
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
                s.src = 'https://widget.intercom.io/widget/e7s8lh5w';
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
    
    console.log('Intercom initialized with user:', window.helpdeskUser.name);
});

document.addEventListener('DOMContentLoaded', function() {
    const resetBtn = document.getElementById('resetChatBtn');
    if (resetBtn && window.resetChat) {
        resetBtn.addEventListener('click', window.resetChat);
    }
});`;
}
