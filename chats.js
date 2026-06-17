// chats.js — Скрипты установки чатов хелпдеска

// =============================================================================
// UPSERVICE CHAT
// =============================================================================

console.log('✅ UpService чат загружен!');

// Функция для передачи данных пользователя в UpService
function initUpService() {
    if (window.helpdeskUser) {
        // Если у UpService есть API для авторизации пользователя
        // Можно использовать события или глобальные переменные
        window.__upservice_user = {
            id: window.helpdeskUser.id,
            name: window.helpdeskUser.name,
            email: window.helpdeskUser.email
        };
        
        // Отправляем событие о готовности пользователя
        document.dispatchEvent(new CustomEvent('upservice:userReady', {
            detail: window.helpdeskUser
        }));
        
        console.log('📤 UpService user data sent:', window.helpdeskUser.name);
    }
}

// Ждём загрузки скрипта UpService
function waitForUpService() {
    // Проверяем наличие объекта UpService в глобальной области
    if (window.UpService || window.upservice) {
        console.log('✅ UpService API готов');
        initUpService();
    } else {
        // Слушаем событие загрузки скрипта
        document.addEventListener('upservice:loaded', function() {
            console.log('✅ UpService загружен через событие');
            initUpService();
        });
        
        // Или проверяем через MutationObserver
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
        
        // Таймаут на случай если не загрузился
        setTimeout(() => {
            observer.disconnect();
            console.warn('⏰ UpService не загрузился за 10 секунд');
        }, 10000);
    }
}

// Ждём helpdeskUser и инициализируем UpService
function waitForHelpdeskUser(callback) {
    if (window.helpdeskUser) {
        callback();
    } else {
        setTimeout(() => waitForHelpdeskUser(callback), 50);
    }
}

// Основная инициализация
waitForHelpdeskUser(() => {
    // Инициализируем UpService
    waitForUpService();
});

// Если UpService загрузился до helpdeskUser, передаём данные позже
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем загружен ли UpService
    if (window.UpService || window.upservice) {
        setTimeout(() => {
            if (window.helpdeskUser) {
                initUpService();
            }
        }, 1000);
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
// ДОПОЛНИТЕЛЬНО: ПЕРЕХВАТ СОБЫТИЙ UPSERVICE
// =============================================================================

// Если UpService генерирует события, можно их перехватывать
document.addEventListener('upservice:message', function(e) {
    console.log('💬 Сообщение UpService:', e.detail);
});

document.addEventListener('upservice:chat:open', function(e) {
    console.log('🔄 Чат UpService открыт');
});

document.addEventListener('upservice:chat:close', function(e) {
    console.log('❌ Чат UpService закрыт');
});

// Пример работы с API UpService (если доступно)
function sendToUpService(action, data) {
    if (window.UpService && typeof window.UpService.send === 'function') {
        window.UpService.send(action, data);
    } else if (window.upservice && typeof window.upservice.send === 'function') {
        window.upservice.send(action, data);
    } else {
        console.warn('⚠️ UpService API не доступен для отправки');
    }
}
