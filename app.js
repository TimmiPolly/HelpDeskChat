// app.js — Основная логика: генерация и хранение данных пользователя

(function () {
    try {
        let userId = localStorage.getItem('helpdesk_user_id');
        let userName = localStorage.getItem('helpdesk_user_name');
        let userEmail = localStorage.getItem('helpdesk_user_email');
        let userCreatedAt = localStorage.getItem('helpdesk_created_at');

        // Валидация существующих данных
        if (userId && (typeof userId !== 'string' || userId.trim() === '')) {
            userId = null;
        }

        if (!userId) {
            // Генерация нового ID
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
            localStorage.setItem('helpdesk_user_id', userId);

            userCreatedAt = Math.floor(Date.now() / 1000);
            localStorage.setItem('helpdesk_created_at', userCreatedAt);

            userName = "Тестировщик";
            localStorage.setItem('helpdesk_user_name', userName);

            userEmail = 'test_' + userId + '@helpdesk.test';
            localStorage.setItem('helpdesk_user_email', userEmail);
        } else {
            // Восстановление существующих данных с проверкой
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

        // Отображаем информацию о пользователе
        function displayUserInfo() {
            const userInfoDiv = document.getElementById('userInfo');
            if (userInfoDiv && window.helpdeskUser) {
                const date = new Date(window.helpdeskUser.createdAt * 1000);
                userInfoDiv.innerHTML = `
                    <p><strong>🆔 ID:</strong> ${window.helpdeskUser.id}</p>
                    <p><strong>👤 Имя:</strong> ${window.helpdeskUser.name}</p>
                    <p><strong>📧 Email:</strong> ${window.helpdeskUser.email}</p>
                    <p><strong>📅 Создан:</strong> ${date.toLocaleString()}</p>
                `;
            }
        }

        // Функция сброса чата
        window.resetChat = function() {
            if (confirm('Вы уверены? Это очистит данные текущего чата и начнёт новый сеанс.')) {
                // Очищаем все данные из localStorage
                const keysToRemove = [
                    'helpdesk_user_id',
                    'helpdesk_user_name', 
                    'helpdesk_user_email',
                    'helpdesk_created_at',
                    // UpService keys
                    'upservice_session',
                    'upservice_user',
                    // Intercom keys (если остались)
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
                
                // Очищаем sessionStorage
                sessionStorage.clear();
                
                // Удаляем куки
                document.cookie.split(";").forEach(function(c) {
                    if (c.trim().startsWith('upservice') || c.trim().startsWith('intercom')) {
                        document.cookie = c.trim() + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    }
                });
                
                // Удаляем скрипт UpService из DOM
                const upserviceScript = document.querySelector('script[src*="messenger.upservice.io"]');
                if (upserviceScript) {
                    upserviceScript.remove();
                }
                
                // Удаляем iframe UpService
                const upserviceFrame = document.querySelector('iframe[src*="upservice"]');
                if (upserviceFrame) {
                    upserviceFrame.remove();
                }
                
                // Удаляем Intercom если есть
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
                
                // Перезагружаем страницу для полной переинициализации
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        };

        // Ждём загрузки DOM перед отображением информации
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
})();
