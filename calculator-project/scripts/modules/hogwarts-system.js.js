// Система Хогвартса
class HogwartsSystem {
    constructor() {
        this.houses = {
            gryffindor: { name: "Гриффиндор", points: 350, color: "#740001", icon: "🦁" },
            slytherin: { name: "Слизерин", points: 320, color: "#1a472a", icon: "🐍" },
            ravenclaw: { name: "Когтевран", points: 280, color: "#0e1a40", icon: "🦅" },
            hufflepuff: { name: "Пуффендуй", points: 260, color: "#ecb939", icon: "🦡" }
        };
        
        this.timerInterval = null;
    }
    
    // Инициализация системы
    init() {
        this.updateHouseDisplay();
        this.startTimer();
    }
    
    // Распределение по факультетам
    sortUser(username) {
        const houses = Object.keys(this.houses);
        const randomHouse = houses[Math.floor(Math.random() * houses.length)];
        
        const houseMessages = {
            gryffindor: [
                "Гриффиндор! Да, именно там ты найдешь настоящих друзей. Храбрость и отвага бьют в тебе ключом!",
                "В Гриффиндоре ценят смелость и благородство. Твои поступки говорят сами за себя!",
                "Ага! Гриффиндор! Где обитают самые отважные волшебники!"
            ],
            slytherin: [
                "Слизерин! Ты добьешься великих целей, да... Великих!",
                "В Слизерине ценят амбиции и хитрость. Ты будешь там как дома!",
                "Слизерин! Факультет, где рождаются великие лидеры!"
            ],
            ravenclaw: [
                "Когтевран! Где ценят мудрость и ученость. Твой ум будет оценен по достоинству!",
                "В Когтевране ты найдешь единомышленников, стремящихся к знаниям!",
                "Когтевран! Факультет для самых умных и проницательных!"
            ],
            hufflepuff: [
                "Пуффендуй! Где ценят верность и трудолюбие. Ты будешь прекрасным другом!",
                "В Пуффендуе ты найдешь настоящую дружбу и поддержку!",
                "Пуффендуй! Самый справедливый и верный факультет!"
            ]
        };
        
        const messages = houseMessages[randomHouse];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        return {
            house: randomHouse,
            message: randomMessage,
            houseInfo: this.houses[randomHouse]
        };
    }
    
    // Добавление очков факультету
    addHousePoints(house, points) {
        if (this.houses[house]) {
            this.houses[house].points += points;
            this.updateHouseDisplay();
            return true;
        }
        return false;
    }
    
    // Обновление отображения очков
    updateHouseDisplay() {
        // Находим максимальное количество очков для расчета процентов
        const maxPoints = Math.max(...Object.values(this.houses).map(h => h.points));
        
        Object.keys(this.houses).forEach(house => {
            const houseData = this.houses[house];
            const pointsElement = document.getElementById(`${house}-points`);
            const progressElement = document.getElementById(`${house}-progress`);
            
            if (pointsElement) {
                pointsElement.textContent = `${houseData.points} очков`;
            }
            
            if (progressElement && maxPoints > 0) {
                const percentage = (houseData.points / maxPoints) * 100;
                progressElement.style.width = `${percentage}%`;
            }
        });
    }
    
    // Таймер турнира
    getTournamentTime() {
        const endDate = new Date('2025-12-31T23:59:59');
        const now = new Date();
        const diff = endDate - now;
        
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
        };
    }
    
    // Запуск таймера
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    
    // Обновление таймера
    updateTimer() {
        const time = this.getTournamentTime();
        const timerElement = document.getElementById('hogwarts-timer');
        
        if (timerElement) {
            timerElement.textContent = 
                `${time.days.toString().padStart(2, '0')}:${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // Остановка таймера
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
}

export default new HogwartsSystem();