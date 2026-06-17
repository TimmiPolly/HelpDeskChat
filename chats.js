// chats.js — Скрипты установки чатов хелпдеска

// =============================================================================
// HAPPYDESK CHAT
// =============================================================================

console.log('✅ HappyDesk чат загружается...');

// Функция для инициализации HappyDesk с данными пользователя
function initHappyDesk() {
    if (!window.helpdeskUser) {
        console.warn('⚠️ helpdeskUser не найден, ждём...');
        return;
    }

    // Проверяем, загружен ли уже HappyDesk
    if (typeof Happydesk !== 'undefined' && Happydesk.initChat) {
        console.log('✅ HappyDesk уже загружен, инициализируем с пользователем:', window.helpdeskUser.name);
        
        // Передаём данные пользователя в HappyDesk
        // Используем глобальную переменную для данных пользователя
        window.HAPPYDESK_USER = {
            id: window.helpdeskUser.id,
            name: window.helpdeskUser.name,
            email: window.helpdeskUser.email,
            created_at: window.helpdeskUser.createdAt
        };

        // Инициализируем чат с данными пользователя
        try {
            Happydesk.initChat({
                clientId: 8864,
                server: 'https://61hd2-widget.happydesk.ru',
                host: 'neocrypto.happydesk.ru'
            }, {
                page_url: window.location.href,
                user_agent: window.navigator.userAgent,
                language: 'ru',
                // Дополнительные данные пользователя
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
        
        // Слушаем событие загрузки скрипта HappyDesk
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
        
        // Таймаут на случай если не загрузился
        setTimeout(() => {
            observer.disconnect();
            console.warn('⏰ HappyDesk не загрузился за 10 секунд');
        }, 10000);
    }
}

// Функция для динамической загрузки HappyDesk
function loadHappyDesk() {
    // Проверяем, не загружен ли уже скрипт
    if (document.querySelector('script[src*="happydesk.ru/widget.js"]')) {
        console.log('✅ Скрипт HappyDesk уже загружен');
        initHappyDesk();
        return;
    }

    console.log('📥 Загружаем HappyDesk...');
    
    // Создаём и загружаем скрипт HappyDesk
    var script = document.createElement('script');
    script.src = 'https://61hd2-widget.happydesk.ru/widget.js';
    script.charset = 'utf-8';
    script.async = true;
    
    script.onload = function() {
        console.log('✅ HappyDesk скрипт загружен');
        // Небольшая задержка для инициализации
        setTimeout(initHappyDesk, 100);
    };
    
    script.onerror = function() {
        console.error('❌ Ошибка загрузки HappyDesk');
    };
    
    document.head.appendChild(script);
}

// Ждём helpdeskUser и загружаем HappyDesk
function waitForHelpdeskUser(callback) {
    if (window.helpdeskUser) {
        callback();
    } else {
        setTimeout(() => waitForHelpdeskUser(callback), 50);
    }
}

// Основная инициализация
waitForHelpdeskUser(() => {
    console.log('👤 Пользователь готов, загружаем HappyDesk');
    loadHappyDesk();
});

// Также проверяем, если скрипт уже загружен в HTML
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, загружен ли скрипт в HTML
    const existingScript = document.querySelector('script[src*="happydesk.ru/widget.js"]');
    if (existingScript && typeof Happydesk !== 'undefined') {
        console.log('✅ HappyDesk уже загружен через HTML');
        initHappyDesk();
    }
});

// Добавляем обработчик для кнопки сброса
document.addEventListener('DOMContentLoaded', function() {
    const resetBtn = document.getElementById('resetChatBtn');
    if (resetBtn && window.resetChat) {
        resetBtn.addEventListener('click', window.resetChat);
    }
});

// =============================================================================
// ДОПОЛНИТЕЛЬНО: ОБРАБОТЧИКИ СОБЫТИЙ HAPPYDESK
// =============================================================================

// Слушаем события HappyDesk (если они поддерживаются)
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

console.log('✅ chats.js загружен');
