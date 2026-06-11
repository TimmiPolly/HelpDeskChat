// app.js — Основная логика: генерация и хранение данных пользователя

(function () {
    try {
        let userId = localStorage.getItem('intercom_user_id');
        let userName = localStorage.getItem('intercom_user_name');
        let userEmail = localStorage.getItem('intercom_user_email');
        let userCreatedAt = localStorage.getItem('intercom_created_at');

        // Валидация существующих данных
        if (userId && (typeof userId !== 'string' || userId.trim() === '')) {
            userId = null;
        }

        if (!userId) {
            // Генерация нового ID (исправлен substr на substring)
            userId = 'test_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
            localStorage.setItem('intercom_user_id', userId);

            userCreatedAt = Math.floor(Date.now() / 1000);
            localStorage.setItem('intercom_created_at', userCreatedAt);

            userName = "Тестировщик";
            localStorage.setItem('intercom_user_name', userName);

            userEmail = 'test_' + userId + '@helpdesk.test';
            localStorage.setItem('intercom_user_email', userEmail);
        } else {
            // Восстановление существующих данных с проверкой
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

        // Финальная проверка timestamp
        let createdAtTimestamp = parseInt(userCreatedAt, 10);
        if (isNaN(createdAtTimestamp) || createdAtTimestamp <= 0) {
            createdAtTimestamp = Math.floor(Date.now() / 1000);
        }

        // Экспортируем данные пользователя в глобальную переменную,
        // чтобы скрипты чатов могли их использовать
        window.helpdeskUser = {
            id: String(userId),
            name: String(userName),
            email: String(userEmail),
            createdAt: createdAtTimestamp,
        };

        // Для отладки (можно удалить в продакшене)
        console.log('Helpdesk user initialized:', window.helpdeskUser);
        
    } catch (error) {
        console.error('Error initializing helpdesk user:', error);
        // Fallback на случай ошибки
        window.helpdeskUser = {
            id: 'fallback_' + Date.now(),
            name: 'Тестировщик',
            email: 'fallback@helpdesk.test',
            createdAt: Math.floor(Date.now() / 1000),
        };
    }
})();
