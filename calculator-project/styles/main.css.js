// Главный модуль приложения - инициализирует все подмодули
import UserSystem from './modules/user-system.js';
import CalculatorCore from './modules/calculator-core.js';
import HogwartsSystem from './modules/hogwarts-system.js';
import MusicSystem from './modules/music-system.js';
import AdminSystem from './modules/admin-system.js';
import DeepSeekAI from './modules/deepseek-ai.js';
import { showError, updateDisplay, updateEventDisplay } from './modules/utils.js';

// Глобальные переменные приложения
let currentUser = null;
let calculationHistory = [];

// DOM элементы
const domElements = {
    // Контейнеры
    authContainer: document.getElementById('auth-container'),
    calculatorContainer: document.getElementById('calculator'),
    subscriptionExpired: document.getElementById('subscription-expired'),
    
    // Формы авторизации
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    loginButton: document.getElementById('login-button'),
    registerButton: document.getElementById('register-button'),
    authSwitchLink: document.getElementById('auth-switch-link'),
    authSwitchText: document.getElementById('auth-switch-text'),
    authTitle: document.getElementById('auth-title'),
    errorMessage: document.getElementById('error-message'),
    
    // Пользовательская информация
    logoutButton: document.getElementById('logout-button'),
    userGreeting: document.getElementById('user-greeting'),
    adminBadge: document.getElementById('admin-badge'),
    subscriptionInfo: document.getElementById('subscription-info'),
    
    // Калькулятор
    display: document.getElementById('display'),
    resultDisplay: document.getElementById('result'),
    historyList: document.getElementById('history-list'),
    clearBtn: document.getElementById('clear'),
    clearEntryBtn: document.getElementById('clear-entry'),
    equalsBtn: document.getElementById('equals'),
    
    // Ивент
    sortingButton: document.getElementById('sorting-button'),
    hatMessage: document.getElementById('hat-message'),
    commonRoom: document.getElementById('common-room'),
    userPointsDisplay: document.getElementById('user-points-display'),
    userPointsSpan: document.getElementById('user-points'),
    
    // Настройки
    settingsButton: document.getElementById('settings-button'),
    infoButton: document.getElementById('info-button'),
    settingsPanel: document.getElementById('settings-panel'),
    infoPanel: document.getElementById('info-panel'),
    settingsOverlay: document.getElementById('settings-overlay'),
    infoOverlay: document.getElementById('info-overlay'),
    closeSettings: document.getElementById('close-settings'),
    closeInfo: document.getElementById('close-info'),
    
    // AI
    aiCalculateButton: document.getElementById('ai-calculate'),
    aiPrompt: document.getElementById('ai-prompt'),
    aiResult: document.getElementById('ai-result'),
    aiResultText: document.getElementById('ai-result-text'),
    
    // Админ
    adminPanel: document.getElementById('admin-panel'),
    viewUsersBtn: document.getElementById('view-users-btn'),
    subscriptionBtn: document.getElementById('subscription-btn'),
    clearAllHistoryBtn: document.getElementById('clear-all-history-btn'),
    exportDataBtn: document.getElementById('export-data-btn'),
    systemStatsBtn: document.getElementById('system-stats-btn'),
    restoreAdminBtn: document.getElementById('restore-admin-btn'),
    setSubscriptionBtn: document.getElementById('set-subscription-btn'),
    subscriptionControls: document.getElementById('subscription-controls'),
    userList: document.getElementById('user-list'),
    systemStats: document.getElementById('system-stats')
};

// Инициализация приложения
class CalculatorApp {
    constructor() {
        this.init();
    }
    
    async init() {
        try {
            // Инициализация систем
            UserSystem.initAdmin();
            HogwartsSystem.init();
            MusicSystem.init();
            
            // Проверка авторизованного пользователя
            this.checkLoggedInUser();
            
            // Настройка обработчиков событий
            this.setupEventListeners();
            
            console.log('✅ Приложение успешно инициализировано');
        } catch (error) {
            console.error('❌ Ошибка инициализации приложения:', error);
            showError('Ошибка загрузки приложения. Пожалуйста, перезагрузите страницу.');
        }
    }
    
    // Проверить авторизованного пользователя
    checkLoggedInUser() {
        const loggedInUser = localStorage.getItem('calculatorCurrentUser');
        if (loggedInUser) {
            const users = UserSystem.getUsers();
            const userData = users[loggedInUser];
            
            if (userData) {
                // Проверка подписки
                const subscription = UserSystem.getSubscriptionInfo(loggedInUser);
                if (subscription && !subscription.isActive && !userData.isAdmin) {
                    this.showSubscriptionExpired();
                    return;
                }
                
                currentUser = {
                    username: loggedInUser,
                    history: userData.history || [],
                    isAdmin: userData.isAdmin || false,
                    subscriptionType: userData.subscriptionType || 'basic',
                    subscriptionEnd: userData.subscriptionEnd,
                    magicPoints: userData.magicPoints || 0,
                    house: userData.house || null,
                    purchasedItems: userData.purchasedItems || [],
                    hasBeenSorted: userData.hasBeenSorted || false
                };
                
                calculationHistory = currentUser.history;
                this.showCalculator();
            }
        }
    }
    
    // Показать калькулятор
    showCalculator() {
        domElements.authContainer.style.display = 'none';
        domElements.subscriptionExpired.style.display = 'none';
        domElements.calculatorContainer.style.display = 'block';
        domElements.userGreeting.textContent = `Привет, ${currentUser.username}`;
        
        // Показать админ-панель если пользователь админ
        if (currentUser.isAdmin) {
            domElements.adminBadge.style.display = 'inline';
            domElements.adminPanel.style.display = 'block';
        } else {
            domElements.adminBadge.style.display = 'none';
            domElements.adminPanel.style.display = 'none';
        }
        
        // Показать информацию о подписке
        const subscription = UserSystem.getSubscriptionInfo(currentUser.username);
        if (subscription) {
            domElements.subscriptionInfo.style.display = 'inline';
            
            let subscriptionText = '';
            let subscriptionClass = '';
            
            if (subscription.type === 'pro') {
                subscriptionText = `Pro🎃: ${subscription.daysLeft} дн.`;
                subscriptionClass = 'pro-subscription';
            } else if (subscription.type === 'pro-plus') {
                subscriptionText = `Pro+☃️: ${subscription.daysLeft} дн.`;
                subscriptionClass = 'pro-plus-subscription';
            } else {
                subscriptionText = `Базовая: ${subscription.daysLeft} дн.`;
            }
            
            domElements.subscriptionInfo.textContent = subscriptionText;
            domElements.subscriptionInfo.className = 'subscription-info ' + subscriptionClass;
        } else {
            domElements.subscriptionInfo.style.display = 'none';
        }
        
        // Управление видимостью вкладок
        this.updateTabVisibility();
        
        // Обновление отображения Ивента
        updateEventDisplay(currentUser);
        
        // Обновить отображение истории
        this.updateHistoryDisplay();
        
        // Обновить таймер Хогвартса
        HogwartsSystem.updateTimer();
    }
    
    // Обновить видимость вкладок
    updateTabVisibility() {
        const subscriptionType = currentUser.subscriptionType;
        
        // Всегда доступные вкладки
        const basicTabs = ['basic', 'scientific', 'deepseek', 'event', 'history'];
        basicTabs.forEach(tab => {
            const tabElement = document.querySelector(`[data-tab="${tab}"]`);
            if (tabElement) tabElement.style.display = 'block';
        });
        
        // Премиум вкладки
        const proTab = document.querySelector('[data-tab="pro"]');
        const formulasTab = document.querySelector('[data-tab="formulas"]');
        
        if (subscriptionType === 'pro') {
            if (proTab) proTab.style.display = 'block';
            if (formulasTab) formulasTab.style.display = 'none';
        } else if (subscriptionType === 'pro-plus') {
            if (proTab) proTab.style.display = 'none';
            if (formulasTab) formulasTab.style.display = 'block';
        } else {
            if (proTab) proTab.style.display = 'none';
            if (formulasTab) formulasTab.style.display = 'none';
        }
    }
    
    // Показать авторизацию
    showAuth() {
        domElements.authContainer.style.display = 'flex';
        domElements.calculatorContainer.style.display = 'none';
        domElements.subscriptionExpired.style.display = 'none';
        currentUser = null;
        localStorage.removeItem('calculatorCurrentUser');
        calculationHistory = [];
    }
    
    // Показать сообщение об истекшей подписке
    showSubscriptionExpired() {
        domElements.authContainer.style.display = 'none';
        domElements.calculatorContainer.style.display = 'none';
        domElements.subscriptionExpired.style.display = 'block';
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        // Авторизация
        domElements.loginButton.addEventListener('click', () => this.handleLogin());
        domElements.registerButton.addEventListener('click', () => this.handleRegister());
        domElements.authSwitchLink.addEventListener('click', () => this.toggleAuthForm());
        domElements.logoutButton.addEventListener('click', () => this.handleLogout());
        document.getElementById('back-to-login').addEventListener('click', () => this.showAuth());
        
        // Калькулятор
        this.setupCalculatorListeners();
        
        // Ивент
        this.setupEventListeners();
        
        // Настройки
        this.setupSettingsListeners();
        
        // Админ панель
        this.setupAdminListeners();
        
        // AI
        this.setupAIListeners();
        
        // Вкладки
        this.setupTabListeners();
    }
    
    // Обработчики калькулятора
    setupCalculatorListeners() {
        // Цифры
        document.querySelectorAll('.button.number').forEach(button => {
            button.addEventListener('click', (e) => {
                CalculatorCore.inputNumber(e.target.dataset.value);
                updateDisplay(domElements.display, CalculatorCore.currentInput);
            });
        });
        
        // Операции
        document.querySelectorAll('.button.operation').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleOperation(e.target.dataset.operation);
            });
        });
        
        // Научные операции
        document.querySelectorAll('.button.scientific').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleScientificOperation(e.target.dataset.operation);
            });
        });
        
        // Pro функции
        document.querySelectorAll('.button.pro-feature').forEach(button => {
            button.addEventListener('click', (e) => {
                if (e.target.dataset.operation) {
                    this.handleProOperation(e.target.dataset.operation);
                } else if (e.target.dataset.formula) {
                    this.handleProFormula(e.target.dataset.formula);
                }
            });
        });
        
        // Pro+ функции
        document.querySelectorAll('.button.pro-plus-feature').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleProPlusFormula(e.target.dataset.formula);
            });
        });
        
        // Кнопки очистки и равно
        domElements.clearBtn.addEventListener('click', () => CalculatorCore.clearAll());
        domElements.clearEntryBtn.addEventListener('click', () => CalculatorCore.clearEntry());
        domElements.equalsBtn.addEventListener('click', () => this.calculate());
        
        // Обновление дисплея
        CalculatorCore.onDisplayUpdate = (value) => {
            updateDisplay(domElements.display, value);
        };
    }
    
    // Обработка операций
    handleOperation(operation) {
        CalculatorCore.inputOperation(operation, currentUser);
        updateDisplay(domElements.display, CalculatorCore.currentInput);
    }
    
    // Обработка научных операций
    handleScientificOperation(operation) {
        CalculatorCore.handleScientificOperation(operation, currentUser);
        
        // Начислить очки
        if (currentUser) {
            UserSystem.addMagicPoints(currentUser.username, 3);
            currentUser.magicPoints = UserSystem.getUsers()[currentUser.username].magicPoints;
            updateEventDisplay(currentUser);
        }
        
        updateDisplay(domElements.display, CalculatorCore.currentInput);
        this.updateResultDisplay(CalculatorCore.lastResult);
    }
    
    // Обработка Pro операций
    handleProOperation(operation) {
        if (currentUser.subscriptionType === 'basic') {
            showError('Эта функция доступна только для подписчиков Pro🎃 и Pro+☃️');
            return;
        }
        
        CalculatorCore.handleProOperation(operation, currentUser);
        
        // Начислить очки
        if (currentUser) {
            UserSystem.addMagicPoints(currentUser.username, 5);
            currentUser.magicPoints = UserSystem.getUsers()[currentUser.username].magicPoints;
            updateEventDisplay(currentUser);
        }
    }
    
    // Обработка Pro формул
    handleProFormula(formula) {
        if (currentUser.subscriptionType === 'basic') {
            showError('Эта функция доступна только для подписчиков Pro🎃 и Pro+☃️');
            return;
        }
        
        CalculatorCore.handleProFormula(formula, currentUser);
        
        // Начислить очки
        if (currentUser) {
            UserSystem.addMagicPoints(currentUser.username, 5);
            currentUser.magicPoints = UserSystem.getUsers()[currentUser.username].magicPoints;
            updateEventDisplay(currentUser);
        }
    }
    
    // Обработка Pro+ формул
    handleProPlusFormula(formula) {
        if (currentUser.subscriptionType !== 'pro-plus') {
            showError('Эта функция доступна только для подписчиков Pro+☃️');
            return;
        }
        
        CalculatorCore.handleProPlusFormula(formula, currentUser);
        
        // Начислить очки
        if (currentUser) {
            UserSystem.addMagicPoints(currentUser.username, 8);
            currentUser.magicPoints = UserSystem.getUsers()[currentUser.username].magicPoints;
            updateEventDisplay(currentUser);
        }
    }
    
    // Вычисление
    calculate() {
        const result = CalculatorCore.calculate();
        if (result !== undefined) {
            // Добавить в историю
            this.addToHistory(`${CalculatorCore.previousInput} ${CalculatorCore.operation} ${CalculatorCore.currentInput} = ${result}`, result);
            
            // Начислить очки
            if (currentUser) {
                UserSystem.addMagicPoints(currentUser.username, 2);
                currentUser.magicPoints = UserSystem.getUsers()[currentUser.username].magicPoints;
                updateEventDisplay(currentUser);
                
                // Добавить очки факультету
                if (currentUser.house) {
                    HogwartsSystem.addHousePoints(currentUser.house, 2);
                }
            }
            
            this.updateResultDisplay(result);
        }
    }
    
    // Обработчики Ивента
    setupEventListeners() {
        domElements.sortingButton.addEventListener('click', () => {
            if (!currentUser) return;
            
            if (currentUser.hasBeenSorted) {
                showError('Вы уже были распределены по факультету!');
                return;
            }
            
            const result = HogwartsSystem.sortUser(currentUser.username);
            domElements.hatMessage.textContent = result.message;
            
            // Обновляем данные пользователя
            currentUser.house = result.house;
            currentUser.hasBeenSorted = true;
            UserSystem.setHouse(currentUser.username, result.house);
            
            // Начисляем бонусные очки
            UserSystem.addMagicPoints(currentUser.username, 50);
            currentUser.magicPoints = UserSystem.getUsers()[currentUser.username].magicPoints;
            
            // Обновляем отображение
            updateEventDisplay(currentUser);
        });
        
        // Магазин
        document.querySelectorAll('.shop-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!currentUser) return;
                
                const itemId = e.target.closest('.shop-item').dataset.item;
                const price = parseInt(e.target.closest('.shop-item').dataset.price);
                
                const result = UserSystem.purchaseItem(currentUser.username, itemId, price);
                if (result.success) {
                    currentUser = { ...currentUser, ...UserSystem.getUsers()[currentUser.username] };
                    updateEventDisplay(currentUser);
                }
                alert(result.message);
            });
        });
    }
    
    // Обработчики настроек
    setupSettingsListeners() {
        domElements.settingsButton.addEventListener('click', () => {
            domElements.settingsPanel.style.display = 'block';
            domElements.settingsOverlay.style.display = 'block';
        });
        
        domElements.infoButton.addEventListener('click', () => {
            domElements.infoPanel.style.display = 'block';
            domElements.infoOverlay.style.display = 'block';
        });
        
        domElements.closeSettings.addEventListener('click', () => {
            domElements.settingsPanel.style.display = 'none';
            domElements.settingsOverlay.style.display = 'none';
        });
        
        domElements.closeInfo.addEventListener('click', () => {
            domElements.infoPanel.style.display = 'none';
            domElements.infoOverlay.style.display = 'none';
        });
        
        domElements.settingsOverlay.addEventListener('click', () => {
            domElements.settingsPanel.style.display = 'none';
            domElements.settingsOverlay.style.display = 'none';
        });
        
        domElements.infoOverlay.addEventListener('click', () => {
            domElements.infoPanel.style.display = 'none';
            domElements.infoOverlay.style.display = 'none';
        });
    }
    
    // Обработчики админ панели
    setupAdminListeners() {
        if (!domElements.viewUsersBtn) return;
        
        domElements.viewUsersBtn.addEventListener('click', () => AdminSystem.showUsersList());
        domElements.subscriptionBtn.addEventListener('click', () => AdminSystem.showSubscriptionControls());
        domElements.clearAllHistoryBtn.addEventListener('click', () => AdminSystem.clearAllHistory());
        domElements.exportDataBtn.addEventListener('click', () => AdminSystem.exportData());
        domElements.systemStatsBtn.addEventListener('click', () => AdminSystem.showSystemStats());
        domElements.restoreAdminBtn.addEventListener('click', () => AdminSystem.restoreAdmin());
        domElements.setSubscriptionBtn.addEventListener('click', () => AdminSystem.setUserSubscription());
    }
    
    // Обработчики AI
    setupAIListeners() {
        domElements.aiCalculateButton.addEventListener('click', () => {
            const query = domElements.aiPrompt.value.trim();
            if (!query) {
                showError('Введите запрос для AI');
                return;
            }
            
            domElements.aiResultText.textContent = 'Обработка запроса...';
            domElements.aiResult.style.display = 'block';
            
            setTimeout(() => {
                const response = DeepSeekAI.processQuery(query);
                domElements.aiResultText.textContent = response;
                
                // Добавить в историю
                this.addToHistory(`AI: ${query}`, response);
                
                // Начислить очки
                if (currentUser) {
                    UserSystem.addMagicPoints(currentUser.username, 1);
                    currentUser.magicPoints = UserSystem.getUsers()[currentUser.username].magicPoints;
                    updateEventDisplay(currentUser);
                }
            }, 1000);
        });
    }
    
    // Обработчики вкладок
    setupTabListeners() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                
                // Смена музыки для вкладки Ивент
                if (tabId === 'event') {
                    MusicSystem.setEventMusic(true);
                } else {
                    MusicSystem.setEventMusic(false);
                }
                
                // Обновление активных вкладок
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }
    
    // Вход
    handleLogin() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            showError('Заполните все поля');
            return;
        }
        
        const result = UserSystem.login(username, password);
        if (result.success) {
            currentUser = result.user;
            calculationHistory = currentUser.history;
            localStorage.setItem('calculatorCurrentUser', username);
            this.showCalculator();
        } else {
            if (result.error === 'subscription_expired') {
                this.showSubscriptionExpired();
            } else {
                showError(result.error);
            }
        }
    }
    
    // Регистрация
    handleRegister() {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        
        const result = UserSystem.register(username, password, confirmPassword);
        if (result.success) {
            // Автоматически входим после регистрации
            this.handleLogin();
        } else {
            showError(result.error);
        }
    }
    
    // Выход
    handleLogout() {
        if (currentUser) {
            UserSystem.saveUserHistory(currentUser.username, calculationHistory);
        }
        this.showAuth();
    }
    
    // Переключение форм авторизации
    toggleAuthForm() {
        const isLoginForm = domElements.loginForm.style.display !== 'none';
        
        if (isLoginForm) {
            domElements.loginForm.style.display = 'none';
            domElements.registerForm.style.display = 'flex';
            domElements.authTitle.textContent = 'Регистрация';
            domElements.authSwitchText.textContent = 'Уже есть аккаунт?';
            domElements.authSwitchLink.textContent = 'Войти';
        } else {
            domElements.loginForm.style.display = 'flex';
            domElements.registerForm.style.display = 'none';
            domElements.authTitle.textContent = 'Вход в калькулятор';
            domElements.authSwitchText.textContent = 'Нет аккаунта?';
            domElements.authSwitchLink.textContent = 'Зарегистрироваться';
        }
        
        domElements.errorMessage.style.display = 'none';
    }
    
    // Добавить в историю
    addToHistory(expression, result) {
        const timestamp = new Date().toLocaleTimeString();
        calculationHistory.unshift({
            expression: expression,
            result: result,
            timestamp: timestamp
        });
        
        // Сохранить историю пользователя
        if (currentUser) {
            UserSystem.saveUserHistory(currentUser.username, calculationHistory);
        }
        
        this.updateHistoryDisplay();
    }
    
    // Обновить отображение истории
    updateHistoryDisplay() {
        if (!domElements.historyList) return;
        
        if (calculationHistory.length === 0) {
            domElements.historyList.innerHTML = '<div class="history-item"><span>История вычислений появится здесь</span><span class="history-time">После первых расчетов</span></div>';
            return;
        }
        
        domElements.historyList.innerHTML = '';
        calculationHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span>${item.expression}</span>
                <span class="history-time">${item.timestamp}</span>
            `;
            domElements.historyList.appendChild(historyItem);
        });
    }
    
    // Обновить отображение результата
    updateResultDisplay(result) {
        if (domElements.resultDisplay) {
            domElements.resultDisplay.textContent = `Результат: ${result}`;
        }
    }
}

// Экспорт глобальных переменных
export { currentUser, calculationHistory, domElements };

// Запуск приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new CalculatorApp();
});