// Вспомогательные функции

// Показать ошибку
export function showError(message) {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    } else {
        alert(message);
    }
}

// Обновить дисплей
export function updateDisplay(displayElement, value) {
    if (displayElement) {
        displayElement.textContent = value;
    }
}

// Обновить отображение Ивента
export function updateEventDisplay(currentUser) {
    if (!currentUser) return;
    
    // Обновить очки пользователя
    const userPointsSpan = document.getElementById('user-points');
    if (userPointsSpan) {
        userPointsSpan.textContent = currentUser.magicPoints;
    }
    
    // Обновить кнопку распределения
    const sortingButton = document.getElementById('sorting-button');
    const hatMessage = document.getElementById('hat-message');
    const commonRoom = document.getElementById('common-room');
    
    if (sortingButton && hatMessage) {
        if (currentUser.hasBeenSorted) {
            sortingButton.disabled = true;
            sortingButton.textContent = '🎩 Уже распределен!';
            hatMessage.textContent = `Вы уже были распределены в факультет!`;
        } else {
            sortingButton.disabled = false;
            sortingButton.textContent = '🎩 Пройти распределение';
        }
    }
    
    // Обновить общую гостиную
    if (commonRoom && currentUser.house) {
        commonRoom.innerHTML = `
            <div class="room-title">🏰 Общая гостиная вашего факультета</div>
            <div style="text-align: center; color: #ccc; font-size: 14px; margin-top: 10px;">
                Добро пожаловать в ${currentUser.house}!<br>
                Ваши магические очки: <strong>${currentUser.magicPoints}</strong>
            </div>
        `;
    }
    
    // Обновить магазин (пометить купленные предметы)
    document.querySelectorAll('.shop-item').forEach(item => {
        const itemId = item.dataset.item;
        if (currentUser.purchasedItems && currentUser.purchasedItems.includes(itemId)) {
            item.classList.add('purchased');
        } else {
            item.classList.remove('purchased');
        }
    });
}

// Форматирование времени
export function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Валидация email
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Генерация случайного числа
export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Проверка подписки
export function checkSubscription(user) {
    if (!user || !user.subscriptionEnd) return false;
    
    const endDate = new Date(user.subscriptionEnd);
    const now = new Date();
    return endDate > now;
}

// Сохранение настроек
export function saveSettings(settings) {
    localStorage.setItem('calculatorSettings', JSON.stringify(settings));
}

// Загрузка настроек
export function loadSettings() {
    return JSON.parse(localStorage.getItem('calculatorSettings') || '{}');
}

// Проверка администратора
export function isAdmin(user) {
    return user && user.isAdmin === true;
}

// Получение текущей даты в формате строки
export function getCurrentDateString() {
    return new Date().toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Очистка всех данных (для отладки)
export function clearAllData() {
    if (confirm('Вы уверены, что хотите удалить все данные? Это действие необратимо!')) {
        localStorage.clear();
        alert('Все данные удалены. Страница будет перезагружена.');
        location.reload();
    }
}