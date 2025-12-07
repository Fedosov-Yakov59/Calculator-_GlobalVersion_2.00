// Система управления пользователями
class UserSystem {
    constructor() {
        this.users = this.getUsers();
    }
    
    getUsers() {
        const users = localStorage.getItem('calculatorUsers');
        return users ? JSON.parse(users) : {};
    }
    
    saveUsers(users) {
        localStorage.setItem('calculatorUsers', JSON.stringify(users));
    }
    
    initAdmin() {
        const users = this.getUsers();
        
        // Первый администратор
        if (!users['Admin_1']) {
            users['Admin_1'] = this.createUserObject('adm_57', true, 'pro-plus');
        }
        
        // Второй администратор
        if (!users['Admin_2Loh']) {
            users['Admin_2Loh'] = this.createUserObject('adm_2gay', true, 'pro-plus');
        }
        
        this.saveUsers(users);
        console.log('✅ Администраторы инициализированы');
    }
    
    createUserObject(password, isAdmin = false, subscriptionType = 'basic') {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        
        return {
            password: password,
            history: [],
            isAdmin: isAdmin,
            subscriptionType: subscriptionType,
            registrationDate: new Date().toISOString(),
            subscriptionEnd: endDate.toISOString(),
            magicPoints: isAdmin ? 1000 : 0,
            house: null,
            purchasedItems: [],
            hasBeenSorted: false,
            eventProgress: {
                calculations: 0,
                equations: 0,
                geometry: 0,
                scientific: 0,
                matrices: 0,
                statistics: 0,
                programming: 0,
                aiRequests: 0
            }
        };
    }
    
    register(username, password, confirmPassword) {
        if (!username || !password || !confirmPassword) {
            return { success: false, error: 'Заполните все поля' };
        }
        
        if (password !== confirmPassword) {
            return { success: false, error: 'Пароли не совпадают' };
        }
        
        if (username.length < 3) {
            return { success: false, error: 'Имя пользователя должно быть не менее 3 символов' };
        }
        
        if (password.length < 4) {
            return { success: false, error: 'Пароль должен быть не менее 4 символов' };
        }
        
        const users = this.getUsers();
        
        if (users[username]) {
            return { success: false, error: 'Пользователь уже существует' };
        }
        
        users[username] = this.createUserObject(password, false, 'basic');
        this.saveUsers(users);
        
        return { success: true };
    }
    
    login(username, password) {
        const users = this.getUsers();
        
        if (!users[username]) {
            return { success: false, error: 'Неверное имя пользователя или пароль' };
        }
        
        if (users[username].password !== password) {
            return { success: false, error: 'Неверное имя пользователя или пароль' };
        }
        
        // Проверка подписки
        const user = users[username];
        if (user.subscriptionEnd && new Date(user.subscriptionEnd) < new Date() && !user.isAdmin) {
            return { success: false, error: 'subscription_expired' };
        }
        
        return { 
            success: true, 
            user: { 
                username, 
                history: user.history,
                isAdmin: user.isAdmin || false,
                subscriptionType: user.subscriptionType || 'basic',
                subscriptionEnd: user.subscriptionEnd,
                magicPoints: user.magicPoints || 0,
                house: user.house || null,
                purchasedItems: user.purchasedItems || [],
                hasBeenSorted: user.hasBeenSorted || false,
                eventProgress: user.eventProgress || {}
            } 
        };
    }
    
    saveUserHistory(username, history) {
        const users = this.getUsers();
        if (users[username]) {
            users[username].history = history;
            this.saveUsers(users);
        }
    }
    
    addMagicPoints(username, points) {
        const users = this.getUsers();
        if (users[username]) {
            users[username].magicPoints = (users[username].magicPoints || 0) + points;
            this.saveUsers(users);
            return users[username].magicPoints;
        }
        return 0;
    }
    
    purchaseItem(username, itemId, price) {
        const users = this.getUsers();
        const user = users[username];
        
        if (!user || user.magicPoints < price) {
            return { success: false, message: 'Недостаточно очков!' };
        }
        
        if (!user.purchasedItems) user.purchasedItems = [];
        
        // Проверяем уникальные предметы
        const uniqueItems = ['invisibility-cloak', 'gryffindor-sword', 'fire-cup'];
        if (uniqueItems.includes(itemId) && user.purchasedItems.includes(itemId)) {
            return { success: false, message: 'Этот уникальный предмет уже куплен!' };
        }
        
        // Списание очков
        user.magicPoints -= price;
        user.purchasedItems.push(itemId);
        
        // Применение эффектов
        if (itemId === 'pro-subscription') {
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
            user.subscriptionType = 'pro';
            user.subscriptionEnd = endDate.toISOString();
        } else if (itemId === 'pro-plus-subscription') {
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
            user.subscriptionType = 'pro-plus';
            user.subscriptionEnd = endDate.toISOString();
        }
        
        this.saveUsers(users);
        return { success: true, message: 'Покупка успешна!' };
    }
    
    setHouse(username, house) {
        const users = this.getUsers();
        if (users[username]) {
            users[username].house = house;
            users[username].hasBeenSorted = true;
            this.saveUsers(users);
            return true;
        }
        return false;
    }
    
    getAllUsers() {
        return this.getUsers();
    }
    
    clearAllHistory() {
        const users = this.getUsers();
        Object.keys(users).forEach(username => {
            users[username].history = [];
        });
        this.saveUsers(users);
        return true;
    }
    
    getSystemStats() {
        const users = this.getUsers();
        const stats = {
            totalUsers: Object.keys(users).length,
            totalCalculations: 0,
            adminUsers: 0,
            regularUsers: 0,
            basicSubscriptions: 0,
            proSubscriptions: 0,
            proPlusSubscriptions: 0,
            expiredSubscriptions: 0,
            totalMagicPoints: 0,
            sortedUsers: 0
        };
        
        Object.values(users).forEach(user => {
            stats.totalCalculations += user.history.length;
            stats.totalMagicPoints += user.magicPoints || 0;
            
            if (user.isAdmin) {
                stats.adminUsers++;
            } else {
                stats.regularUsers++;
            }
            
            if (user.hasBeenSorted) {
                stats.sortedUsers++;
            }
            
            if (user.subscriptionEnd) {
                if (new Date(user.subscriptionEnd) > new Date()) {
                    if (user.subscriptionType === 'basic') stats.basicSubscriptions++;
                    else if (user.subscriptionType === 'pro') stats.proSubscriptions++;
                    else if (user.subscriptionType === 'pro-plus') stats.proPlusSubscriptions++;
                } else {
                    stats.expiredSubscriptions++;
                }
            }
        });
        
        return stats;
    }
    
    setSubscription(username, type, months) {
        const users = this.getUsers();
        if (users[username]) {
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + parseInt(months));
            users[username].subscriptionEnd = endDate.toISOString();
            users[username].subscriptionType = type;
            this.saveUsers(users);
            return true;
        }
        return false;
    }
    
    getSubscriptionInfo(username) {
        const users = this.getUsers();
        if (users[username] && users[username].subscriptionEnd) {
            const endDate = new Date(users[username].subscriptionEnd);
            const now = new Date();
            const diffTime = endDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return {
                endDate: endDate,
                daysLeft: diffDays > 0 ? diffDays : 0,
                isActive: diffTime > 0,
                type: users[username].subscriptionType || 'basic'
            };
        }
        return null;
    }
    
    restoreAdmin() {
        this.initAdmin();
        return { success: true, message: 'Администраторы восстановлены!' };
    }
}

export default new UserSystem();