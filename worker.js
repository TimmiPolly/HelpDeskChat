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

        .reset-btn:active {
            transform: translateY(0);
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
            margin-left: auto;
            margin-right: auto;
        }

        .user-info p {
            margin: 5px 0;
        }

        .user-info strong {
            color: #ffd700;
        }

        .chat-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 6px 16px;
            border-radius: 20px;
            color: white;
            font-size: 0.85rem;
            margin-top: 15px;
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
        
        <div class="chat-badge">💬 UpService Messenger</div>
        
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

    <!-- UpService Widget -->
    <script type="text/javascript" async src="https://messenger.upservice.io/api/widget/a8e5cea9-2df6-49c8-a354-332a4ad6adce"></script>
    
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
                    if (c.trim().startsWith('upservice') || c.trim().startsWith('intercom')) {
                        document.cookie = c.trim() + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    }
                });
                
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
    return `console.log('✅ UpService чат загружен!');

function initUpService() {
    if (window.helpdeskUser) {
        window.__upservice_user = {
            id: window.helpdeskUser.id,
            name: window.helpdeskUser.name,
            email: window.helpdeskUser.email
        };
        
        document.dispatchEvent(new CustomEvent('upservice:userReady', {
            detail: window.helpdeskUser
        }));
        
        console.log('📤 UpService user data sent:', window.helpdeskUser.name);
    }
}

function waitForUpService() {
    if (window.UpService || window.upservice) {
        console.log('✅ UpService API готов');
        initUpService();
    } else {
        document.addEventListener('upservice:loaded', function() {
            console.log('✅ UpService загружен через событие');
            initUpService();
        });
        
        const observer = new MutationObserver(function(mutations) {
            if (window.UpService || window.upservice) {
                console.log('✅ UpService обнаружен MutationObserver');
                initUpService();
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
            console.warn('⏰ UpService не загрузился за 10 секунд');
        }, 10000);
    }
}

function waitForHelpdeskUser(callback) {
    if (window.helpdeskUser) {
        callback();
    } else {
        setTimeout(() => waitForHelpdeskUser(callback), 50);
    }
}

waitForHelpdeskUser(() => {
    waitForUpService();
});

document.addEventListener('DOMContentLoaded', function() {
    if (window.UpService || window.upservice) {
        setTimeout(() => {
            if (window.helpdeskUser) {
                initUpService();
            }
        }, 1000);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const resetBtn = document.getElementById('resetChatBtn');
    if (resetBtn && window.resetChat) {
        resetBtn.addEventListener('click', window.resetChat);
    }
});

document.addEventListener('upservice:message', function(e) {
    console.log('💬 Сообщение UpService:', e.detail);
});

document.addEventListener('upservice:chat:open', function(e) {
    console.log('🔄 Чат UpService открыт');
});

document.addEventListener('upservice:chat:close', function(e) {
    console.log('❌ Чат UpService закрыт');
});

function sendToUpService(action, data) {
    if (window.UpService && typeof window.UpService.send === 'function') {
        window.UpService.send(action, data);
    } else if (window.upservice && typeof window.upservice.send === 'function') {
        window.upservice.send(action, data);
    } else {
        console.warn('⚠️ UpService API не доступен для отправки');
    }
}`;
}
