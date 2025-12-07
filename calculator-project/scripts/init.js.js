// Инициализация всех систем
import UserSystem from './modules/user-system.js';
import HogwartsSystem from './modules/hogwarts-system.js';
import MusicSystem from './modules/music-system.js';

// Глобальные обработчики ошибок
window.addEventListener('error', function(event) {
    console.error('Глобальная ошибка:', event.error);
    
    // Показываем пользователю дружелюбное сообщение
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 9999;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    errorDiv.innerHTML = `
        <strong>Ошибка приложения</strong>
        <p style="margin: 5px 0; font-size: 14px;">Произошла ошибка. Пожалуйста, перезагрузите страницу.</p>
        <button onclick="this.parentElement.remove()" style="
            background: white;
            color: #dc3545;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            margin-top: 5px;
        ">Закрыть</button>
    `;
    
    document.body.appendChild(errorDiv);
});

// Проверка поддержки localStorage
function checkLocalStorage() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Запуск приложения...');
    
    // Проверка поддержки localStorage
    if (!checkLocalStorage()) {
        alert('⚠️ Ваш браузер не поддерживает localStorage. Некоторые функции могут быть недоступны.');
    }
    
    // Инициализация основных систем
    try {
        UserSystem.initAdmin();
        HogwartsSystem.init();
        MusicSystem.init();
        
        console.log('✅ Все системы успешно инициализированы');
    } catch (error) {
        console.error('❌ Ошибка инициализации систем:', error);
        alert('Ошибка загрузки приложения. Пожалуйста, перезагрузите страницу.');
    }
});

// Экспорт глобальных систем для отладки
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.UserSystem = UserSystem;
    window.HogwartsSystem = HogwartsSystem;
    window.MusicSystem = MusicSystem;
    console.log('🔧 Отладочный режим: системы доступны в глобальной области видимости');
}