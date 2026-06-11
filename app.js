// app.js — Основная логика: генерация и хранение данных пользователя

(function () {
    let userId = localStorage.getItem('intercom_user_id');
    let userName = localStorage.getItem('intercom_user_name');
    let userEmail = localStorage.getItem('intercom_user_email');
    let userCreatedAt = localStorage.getItem('intercom_created_at');

    if (!userId) {
        userId = 'test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('intercom_user_id', userId);

        userCreatedAt = Math.floor(Date.now() / 1000);
        localStorage.setItem('intercom_created_at', userCreatedAt);

        userName = "Тестировщик";
        localStorage.setItem('intercom_user_name', userName);

        userEmail = 'test_' + userId + '@helpdesk.test';
        localStorage.setItem('intercom_user_email', userEmail);
    } else {
        userName = localStorage.getItem('intercom_user_name') || "Тестировщик";
        userEmail = localStorage.getItem('intercom_user_email') || 'test_' + userId + '@helpdesk.test';
        userCreatedAt = localStorage.getItem('intercom_created_at') || Math.floor(Date.now() / 1000);
    }

    let createdAtTimestamp = parseInt(userCreatedAt, 10);
    if (isNaN(createdAtTimestamp)) {
        createdAtTimestamp = Math.floor(Date.now() / 1000);
    }

    // Экспортируем данные пользователя в глобальную переменную,
    // чтобы скрипты чатов могли их использовать
    window.helpdeskUser = {
        id: userId,
        name: userName,
        email: userEmail,
        createdAt: createdAtTimestamp,
    };
})();
