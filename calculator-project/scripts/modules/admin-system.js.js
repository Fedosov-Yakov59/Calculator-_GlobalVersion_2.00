// Система администрирования
import UserSystem from './user-system.js';
import { showError } from './utils.js';

class AdminSystem {
    // Показать список пользователей
    showUsersList() {
        const users = UserSystem.getAllUsers();
        const userList = document.getElementById('user-list');
        const systemStats = document.getElementById('system-stats');
        
        if (!userList) return;
        
        userList.innerHTML = '';
        userList.style.display = 'block';
        if (systemStats) systemStats.style.display = 'none';
        
        Object.keys(users).forEach(username => {
            const user = users[username];
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <div>
                    <strong>${username}</strong>
                    ${user.isAdmin ? ' <span style="color: #ff6b6b;">(Admin)</span>' : ''}
                </div>
                <div class="user-stats">
                    ${user.history.length} вычислений | ${user.magicPoints || 0} очков
                    ${user.house ? ` | ${user.house}` : ''}
                </div>
            `;
            userList.appendChild(userItem);
        });
    }
    
    // Показать управление подписками
    showSubscriptionControls() {
        const subscriptionControls = document.getElementById('subscription-controls');
        const userList = document.getElementById('user-list');
        const systemStats = document.getElementById('system-stats');
        
        if (!subscriptionControls) return;
        
        subscriptionControls.style.display = 'block';
        if (userList) userList.style.display = 'none';
        if (systemStats) systemStats.style.display = 'none';
        
        // Заполнить список пользователей
        const subscriptionUserSelect = document.getElementById('subscription-user');
        if (!subscriptionUserSelect) return;
        
        subscriptionUserSelect.innerHTML = '<option value="">Выберите пользователя</option>';
        
        const users = UserSystem.getAllUsers();
        Object.keys(users).forEach(username => {
            const option = document.createElement('option');
            option.value = username;
            option.textContent = username;
            subscriptionUserSelect.appendChild(option);
        });
    }
    
    // Показать статистику системы
    showSystemStats() {
        const stats = UserSystem.getSystemStats();
        const systemStats = document.getElementById('system-stats');
        const userList = document.getElementById('user-list');
        const subscriptionControls = document.getElementById('subscription-controls');
        
        if (!systemStats) return;
        
        systemStats.innerHTML = `
            <h4>📊 Статистика системы</h4>
            <div style="font-size: 12px; line-height: 1.4;">
                <div>👥 Всего пользователей: ${stats.totalUsers}</div>
                <div>👑 Администраторов: ${stats.adminUsers}</div>
                <div>👤 Обычных пользователей: ${stats.regularUsers}</div>
                <div>🎩 Распределенных пользователей: ${stats.sortedUsers}</div>
                <div>🧮 Всего вычислений: ${stats.totalCalculations}</div>
                <div>✨ Всего магических очков: ${stats.totalMagicPoints}</div>
                <div>📈 Активных подписок:</div>
                <div style="margin-left: 10px;">
                    - Базовая: ${stats.basicSubscriptions}<br>
                    - Pro🎃: ${stats.proSubscriptions}<br>
                    - Pro+☃️: ${stats.proPlusSubscriptions}
                </div>
                <div>❌ Истекших подписок: ${stats.expiredSubscriptions}</div>
            </div>
        `;
        systemStats.style.display = 'block';
        if (userList) userList.style.display = 'none';
        if (subscriptionControls) subscriptionControls.style.display = 'none';
    }
    
    // Очистить всю историю
    clearAllHistory() {
        if (confirm('Вы уверены, что хотите очистить всю историю вычислений у всех пользователей?')) {
            UserSystem.clearAllHistory();
            alert('История всех пользователей очищена!');
        }
    }
    
    // Экспорт данных
    exportData() {
        const users = UserSystem.getAllUsers();
        const dataStr = JSON.stringify(users, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'calculator_users_backup.json';
        link.click();
        
        alert('Данные экспортированы в файл calculator_users_backup.json');
    }
    
    // Восстановить администраторов
    restoreAdmin() {
        const result = UserSystem.restoreAdmin();
        alert(result.message);
    }
    
    // Установить подписку пользователю
    setUserSubscription() {
        const username = document.getElementById('subscription-user')?.value;
        const type = document.getElementById('subscription-type')?.value;
        const period = document.getElementById('subscription-period')?.value;
        
        if (!username) {
            alert('Выберите пользователя');
            return;
        }
        
        if (UserSystem.setSubscription(username, type, period)) {
            alert(`Подписка ${type} установлена пользователю ${username} на ${period} месяцев`);
        } else {
            alert('Ошибка при установке подписки');
        }
    }
}

export default new AdminSystem();