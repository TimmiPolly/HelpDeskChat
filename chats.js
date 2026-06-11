// chats.js — Скрипты установки чатов хелпдеска
// Данные пользователя доступны через window.helpdeskUser (задаются в app.js):
//   window.helpdeskUser.id        — уникальный ID пользователя
//   window.helpdeskUser.name      — имя пользователя
//   window.helpdeskUser.email     — email пользователя
//   window.helpdeskUser.createdAt — unix-timestamp создания пользователя

// =============================================================================
// INTERCOM
// =============================================================================

// Проверяем, что данные пользователя существуют
if (!window.helpdeskUser) {
    console.error('helpdeskUser not initialized! Make sure app.js is loaded first.');
} else {
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

// =============================================================================
// ZENDESK (Пример)
// =============================================================================

if (window.helpdeskUser) {
    window.zESettings = {
        webWidget: {
            contactForm: {
                attachments: false
            },
            chat: {
                connect: {
                    name: window.helpdeskUser.name,
                    email: window.helpdeskUser.email
                }
            }
        }
    };
}

(function() {
    if (document.getElementById('ze-snippet')) return;
    
    var s = document.createElement('script');
    s.id = 'ze-snippet';
    s.src = 'https://static.zdassets.com/ekr/snippet.js?key=YOUR_ZENDESK_KEY'; // Замените на ваш ключ
    s.async = true;
    s.onerror = function() {
        console.error('Failed to load Zendesk widget');
    };
    
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
})();

// =============================================================================
// TIDIO (Пример)
// =============================================================================

(function() {
    if (window.tidioChatApi) return;
    
    var s = document.createElement('script');
    s.src = '//code.tidio.io/YOUR_TIDIO_KEY.js'; // Замените на ваш ключ
    s.async = true;
    s.onload = function() {
        if (window.tidioChatApi && window.helpdeskUser) {
            window.tidioChatApi.identify({
                id: window.helpdeskUser.id,
                name: window.helpdeskUser.name,
                email: window.helpdeskUser.email
            });
        }
    };
    s.onerror = function() {
        console.error('Failed to load Tidio widget');
    };
    
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
})();

// =============================================================================
// УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ ЧАТОВ
// =============================================================================

window.loadChatWidget = function(config) {
    if (!config || !config.src) {
        console.error('Chat config required');
        return;
    }
    
    var s = document.createElement('script');
    s.src = config.src;
    s.async = config.async !== false;
    s.id = config.id || '';
    
    if (config.onload && typeof config.onload === 'function') {
        s.onload = config.onload;
    }
    
    if (config.onerror && typeof config.onerror === 'function') {
        s.onerror = config.onerror;
    } else {
        s.onerror = function() {
            console.error('Failed to load chat widget:', config.src);
        };
    }
    
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
};

// =============================================================================
// ИНИЦИАЛИЗАЦИЯ (вызовите нужный чат)
// =============================================================================

// Раскомментируйте нужную строку:

// Для Intercom (уже инициализирован выше)
console.log('Intercom initialized with user:', window.helpdeskUser?.name);

// Для Zendesk:
// window.loadChatWidget({
//     src: 'https://static.zdassets.com/ekr/snippet.js?key=YOUR_KEY',
//     id: 'ze-snippet'
// });

// Для Tidio:
// window.loadChatWidget({
//     src: '//code.tidio.io/YOUR_KEY.js'
// });

// Для Drift:
// window.loadChatWidget({
//     src: 'https://js.driftt.com/include/YOUR_KEY.js'
// });
