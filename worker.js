// worker.js — Cloudflare Worker в формате ES Modules

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
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
    <title>Тестирование чатов</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f5f0eb;
            padding: 20px;
        }

        .card {
            background: #ffffff;
            border-radius: 32px;
            padding: 50px 40px 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 8px 40px rgba(180, 160, 150, 0.15);
            text-align: center;
            transition: transform 0.2s;
        }

        .card:hover {
            transform: translateY(-2px);
        }

        .icon {
            font-size: 48px;
            margin-bottom: 16px;
            display: block;
        }

        h1 {
            font-size: 1.6rem;
            font-weight: 600;
            color: #4a3f3a;
            margin-bottom: 8px;
            letter-spacing: -0.3px;
        }

        .subtitle {
            font-size: 0.95rem;
            color: #a09088;
            margin-bottom: 28px;
            line-height: 1.5;
        }

        .badge {
            display: inline-block;
            background: #f0ebe6;
            color: #7a6b62;
            padding: 4px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
            margin-bottom: 28px;
        }

        .reset-btn {
            background: #e8e0da;
            color: #5a4f48;
            border: none;
            padding: 12px 32px;
            font-size: 0.95rem;
            font-weight: 500;
            border-radius: 40px;
            cursor: pointer;
            transition: all 0.25s;
            width: 100%;
            max-width: 280px;
        }

        .reset-btn:hover {
            background: #ddd4cc;
            transform: scale(1.01);
        }

        .reset-btn:active {
            transform: scale(0.97);
        }

        .user-info {
            margin-top: 28px;
            padding: 20px 18px;
            background: #f8f5f2;
            border-radius: 20px;
            text-align: left;
            font-size: 0.85rem;
            color: #5a4f48;
            line-height: 1.8;
        }

        .user-info strong {
            color: #8a7a70;
            font-weight: 600;
            display: inline-block;
            width: 60px;
        }

        .user-info .value {
            color: #4a3f3a;
            word-break: break-all;
        }

        .footer-note {
            margin-top: 20px;
            font-size: 0.75rem;
            color: #c5b8b0;
            letter-spacing: 0.2px;
        }

        @media (max-width: 480px) {
            .card {
                padding: 32px 20px 28px;
                border-radius: 24px;
            }

            h1 {
                font-size: 1.3rem;
            }

            .reset-btn {
                font-size: 0.9rem;
                padding: 10px 24px;
            }
        }
    </style>
</head>
<body>

    <div class="card">
        <span class="icon">💬</span>
        <h1>Тестирование чатов</h1>
        <p class="subtitle">Проверьте работу виджета поддержки</p>

        <div class="badge">HappyDesk Messenger</div>

        <button class="reset-btn" id="resetChatBtn">⟳ Сбросить сеанс</button>

        <div class="user-info" id="userInfo">
            <div><strong>ID</strong> <span class="value">—</span></div>
            <div><strong>Имя</strong> <span class="value">—</span></div>
            <div><strong>Email</strong> <span class="value">—</span></div>
        </div>

        <div class="footer-note">Данные хранятся локально</div>
    </div>

    <script src="app.js"></script>
    <script src="chats.js"></script>

</body>
</html>`;
}

async function getAppJS() {
    return `(function () {
    try {
        let userId = localStorage.getItem('helpdesk_user_id');
        let userName = localStorage.getItem('helpdesk_user_name');
        let userEmail = localStorage.getItem('helpdesk_user_email');
        let userCreatedAt = localStorage.getItem('helpdesk_created_at');

        if (userId && (typeof userId !== 'string' || userId.trim() === '')) {
            userId = null;
        }

        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
            localStorage.setItem('helpdesk_user_id', userId);

            userCreatedAt = Math.floor(Date.now() / 1000);
            localStorage.setItem('helpdesk_created_at', userCreatedAt);

            userName = "Тестировщик";
            localStorage.setItem('helpdesk_user_name', userName);

            userEmail = 'test_' + userId + '@helpdesk.test';
            localStorage.setItem('helpdesk_user_email', userEmail);
        } else {
            userName = localStorage.getItem('helpdesk_user_name');
            if (!userName || typeof userName !== 'string' || userName.trim() === '') {
                userName = "Тестировщик";
                localStorage.setItem('helpdesk_user_name', userName);
            }
            
            userEmail = localStorage.getItem('helpdesk_user_email');
            if (!userEmail || typeof userEmail !== 'string' || userEmail.trim() === '') {
                userEmail = 'test_' + userId + '@helpdesk.test';
                localStorage.setItem('helpdesk_user_email', userEmail);
            }
            
            userCreatedAt = localStorage.getItem('helpdesk_created_at');
            let createdAtNum = parseInt(userCreatedAt, 10);
            if (isNaN(createdAtNum) || createdAtNum <= 0) {
                userCreatedAt = Math.floor(Date.now() / 1000);
                localStorage.setItem('helpdesk_created_at', userCreatedAt);
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
                userInfoDiv.innerHTML = \`
                    <div><strong>ID</strong> <span class="value">\${window.helpdeskUser.id}</span></div>
                    <div><strong>Имя</strong> <span class="value">\${window.helpdeskUser.name}</span></div>
                    <div><strong>Email</strong> <span class="value">\${window.helpdeskUser.email}</span></div>
                \`;
            }
        }

        window.resetChat = function() {
            if (confirm('Вы уверены? Это очистит данные текущего чата и начнёт новый сеанс.')) {
                const keysToRemove = [
                    'helpdesk_user_id',
                    'helpdesk_user_name', 
                    'helpdesk_user_email',
                    'helpdesk_created_at',
                    'upservice_session',
                    'upservice_user',
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
                    if (c.trim().startsWith('upservice') || 
                        c.trim().startsWith('intercom') ||
                        c.trim().startsWith('happydesk')) {
                        document.cookie = c.trim() + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    }
                });
                
                const happydeskScript = document.querySelector('script[src*="happydesk.ru"]');
                if (happydeskScript) {
                    happydeskScript.remove();
                }
                
                const happydeskFrame = document.querySelector('iframe[src*="happydesk"]');
                if (happydeskFrame) {
                    happydeskFrame.remove();
                }
                
                const upserviceScript = document.querySelector('script[src*="messenger.upservice.io"]');
                if (upserviceScript) {
                    upserviceScript.remove();
                }
                
                const upserviceFrame = document.querySelector('iframe[src*="upservice"]');
                if (upserviceFrame) {
                    upserviceFrame.remove();
                }
                
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
    return `console.log('✅ HappyDesk чат загружается...');

function initHappyDesk() {
    if (!window.helpdeskUser) {
        console.warn('⚠️ helpdeskUser не найден, ждём...');
        return;
    }

    if (typeof Happydesk !== 'undefined' && Happydesk.initChat) {
        console.log('✅ HappyDesk уже загружен, инициализируем с пользователем:', window.helpdeskUser.name);
        
        window.HAPPYDESK_USER = {
            id: window.helpdeskUser.id,
            name: window.helpdeskUser.name,
            email: window.helpdeskUser.email,
            created_at: window.helpdeskUser.createdAt
        };

        try {
            Happydesk.initChat({
                clientId: 8864,
                server: 'https://61hd2-widget.happydesk.ru',
                host: 'neocrypto.happydesk.ru'
            }, {
                page_url: window.location.href,
                user_agent: window.navigator.userAgent,
                language: 'ru',
                user: {
                    id: window.helpdeskUser.id,
                    name: window.helpdeskUser.name,
                    email: window.helpdeskUser.email
                }
            });
            
            console.log('🎉 HappyDesk инициализирован с пользователем:', window.helpdeskUser.name);
        } catch (error) {
            console.error('❌ Ошибка инициализации HappyDesk:', error);
        }
    } else {
        console.log('⏳ Ждём загрузку HappyDesk...');
        
        const observer = new MutationObserver(function(mutations) {
            if (typeof Happydesk !== 'undefined' && Happydesk.initChat) {
                console.log('✅ HappyDesk обнаружен, инициализируем...');
                initHappyDesk();
                observer.disconnect();
            }
        });
        
        observer.observe(document, { 
            childList: true, 
            subtree: true,
            script: true
        });
        
        setTimeout(() => {
            observer.disconnect();
            console.warn('⏰ HappyDesk не загрузился за 10 секунд');
        }, 10000);
    }
}

function loadHappyDesk() {
    if (document.querySelector('script[src*="happydesk.ru/widget.js"]')) {
        console.log('✅ Скрипт HappyDesk уже загружен');
        initHappyDesk();
        return;
    }

    console.log('📥 Загружаем HappyDesk...');
    
    var script = document.createElement('script');
    script.src = 'https://61hd2-widget.happydesk.ru/widget.js';
    script.charset = 'utf-8';
    script.async = true;
    
    script.onload = function() {
        console.log('✅ HappyDesk скрипт загружен');
        setTimeout(initHappyDesk, 100);
    };
    
    script.onerror = function() {
        console.error('❌ Ошибка загрузки HappyDesk');
    };
    
    document.head.appendChild(script);
}

function waitForHelpdeskUser(callback) {
    if (window.helpdeskUser) {
        callback();
    } else {
        setTimeout(() => waitForHelpdeskUser(callback), 50);
    }
}

waitForHelpdeskUser(() => {
    console.log('👤 Пользователь готов, загружаем HappyDesk');
    loadHappyDesk();
});

document.addEventListener('DOMContentLoaded', function() {
    const existingScript = document.querySelector('script[src*="happydesk.ru/widget.js"]');
    if (existingScript && typeof Happydesk !== 'undefined') {
        console.log('✅ HappyDesk уже загружен через HTML');
        initHappyDesk();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const resetBtn = document.getElementById('resetChatBtn');
    if (resetBtn && window.resetChat) {
        resetBtn.addEventListener('click', window.resetChat);
    }
});

document.addEventListener('happydesk:ready', function(e) {
    console.log('🔄 HappyDesk готов к работе');
});

document.addEventListener('happydesk:message', function(e) {
    console.log('💬 Новое сообщение в HappyDesk:', e.detail);
});

document.addEventListener('happydesk:chat:open', function(e) {
    console.log('🔄 Чат HappyDesk открыт');
});

document.addEventListener('happydesk:chat:close', function(e) {
    console.log('❌ Чат HappyDesk закрыт');
});

console.log('✅ chats.js загружен');`;
}
