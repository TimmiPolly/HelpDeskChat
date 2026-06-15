// chats.js — Скрипты установки чатов хелпдеска

// Функция для инициализации чата
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

// Ждём пока helpdeskUser будет готов
function waitForHelpdeskUser(callback) {
    if (window.helpdeskUser) {
        callback();
    } else {
        setTimeout(() => waitForHelpdeskUser(callback), 50);
    }
}

// Инициализируем Intercom
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

// Добавляем обработчик для кнопки сброса после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    const resetBtn = document.getElementById('resetChatBtn');
    if (resetBtn && window.resetChat) {
        resetBtn.addEventListener('click', window.resetChat);
    }
});
