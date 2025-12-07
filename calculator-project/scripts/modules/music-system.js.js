// Музыкальная система
class MusicSystem {
    constructor() {
        this.currentTrack = 0;
        this.isPlaying = false;
        this.audioElement = null;
        this.currentTheme = 'classic';
        
        this.playlists = {
            classic: [
                { title: "Григ - Утро", url: "" },
                { title: "Григ - Весна", url: "" },
                { title: "Моцарт - Соната", url: "" }
            ],
            magical: [
                { title: "Hedwig's Theme", url: "" },
                { title: "Hogwarts Theme", url: "" },
                { title: "Magic Forest", url: "" }
            ],
            calm: [
                { title: "Тихий океан", url: "" },
                { title: "Легкий ветер", url: "" },
                { title: "Спокойная ночь", url: "" }
            ]
        };
    }
    
    // Инициализация
    init() {
        this.setupAudio();
        this.setupEventListeners();
        this.loadSettings();
        
        // Автоматически запускаем музыку
        setTimeout(() => {
            if (this.currentTheme !== 'none') {
                this.play();
            }
        }, 2000);
    }
    
    // Настройка аудио
    setupAudio() {
        try {
            this.audioElement = new Audio();
            this.audioElement.crossOrigin = "anonymous";
            
            this.audioElement.addEventListener('timeupdate', () => {
                this.updateProgress();
            });
            
            this.audioElement.addEventListener('ended', () => {
                this.next();
            });
            
        } catch (error) {
            console.error('Error setting up audio:', error);
        }
    }
    
    // Настройка обработчиков событий
    setupEventListeners() {
        document.getElementById('play-music-btn')?.addEventListener('click', () => {
            this.togglePlay();
        });
        
        document.getElementById('prev-music')?.addEventListener('click', () => {
            this.previous();
        });
        
        document.getElementById('next-music')?.addEventListener('click', () => {
            this.next();
        });
        
        document.getElementById('music-volume')?.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });
        
        // Обработчики для кнопок выбора темы
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.changeTheme(theme);
                
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // Прогресс бар
        const progressContainer = document.getElementById('music-progress-container');
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                const progressBar = e.currentTarget;
                const clickX = e.offsetX;
                const width = progressBar.clientWidth;
                const duration = this.audioElement.duration || 0;
                
                if (duration > 0) {
                    const seekTime = (clickX / width) * duration;
                    this.audioElement.currentTime = seekTime;
                }
            });
        }
    }
    
    // Загрузка настроек
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('calculatorSettings') || '{}');
        this.currentTheme = settings.musicTheme || 'classic';
        this.setVolume((settings.volume || 50) / 100);
    }
    
    // Смена темы
    changeTheme(theme) {
        this.currentTheme = theme;
        this.currentTrack = 0;
        
        // Сохраняем настройки
        const settings = JSON.parse(localStorage.getItem('calculatorSettings') || '{}');
        settings.musicTheme = theme;
        localStorage.setItem('calculatorSettings', JSON.stringify(settings));
        
        if (theme === 'none') {
            this.stop();
            document.getElementById('music-player')?.classList.remove('active');
        } else {
            document.getElementById('music-player')?.classList.add('active');
            this.loadTrack();
            if (this.isPlaying) {
                this.play();
            }
        }
    }
    
    // Загрузка трека
    loadTrack() {
        if (this.currentTheme === 'none') return;
        
        const playlist = this.playlists[this.currentTheme];
        if (!playlist || !playlist[this.currentTrack]) return;
        
        const track = playlist[this.currentTrack];
        
        try {
            this.audioElement.src = track.url;
            document.getElementById('music-title').textContent = track.title;
        } catch (error) {
            console.error('Error loading track:', error);
        }
    }
    
    // Воспроизведение
    play() {
        if (this.currentTheme === 'none') return;
        
        if (!this.audioElement.src) {
            this.loadTrack();
        }
        
        this.audioElement.play().then(() => {
            this.isPlaying = true;
            document.getElementById('play-music-btn').innerHTML = '⏸️';
        }).catch(error => {
            console.error('Play failed:', error);
        });
    }
    
    // Пауза
    pause() {
        this.audioElement.pause();
        this.isPlaying = false;
        document.getElementById('play-music-btn').innerHTML = '▶️';
    }
    
    // Переключение воспроизведения
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    // Остановка
    stop() {
        this.pause();
        this.audioElement.currentTime = 0;
    }
    
    // Следующий трек
    next() {
        if (this.currentTheme === 'none') return;
        
        const playlist = this.playlists[this.currentTheme];
        this.currentTrack = (this.currentTrack + 1) % playlist.length;
        this.loadTrack();
        if (this.isPlaying) {
            this.play();
        }
    }
    
    // Предыдущий трек
    previous() {
        if (this.currentTheme === 'none') return;
        
        const playlist = this.playlists[this.currentTheme];
        this.currentTrack = (this.currentTrack - 1 + playlist.length) % playlist.length;
        this.loadTrack();
        if (this.isPlaying) {
            this.play();
        }
    }
    
    // Установка громкости
    setVolume(volume) {
        this.audioElement.volume = volume;
        
        // Сохраняем настройки
        const settings = JSON.parse(localStorage.getItem('calculatorSettings') || '{}');
        settings.volume = Math.round(volume * 100);
        localStorage.setItem('calculatorSettings', JSON.stringify(settings));
    }
    
    // Обновление прогресса
    updateProgress() {
        const currentTime = this.audioElement.currentTime;
        const duration = this.audioElement.duration;
        
        if (duration > 0) {
            const progress = (currentTime / duration) * 100;
            const progressBar = document.getElementById('music-progress');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            
            // Форматирование времени
            const formatTime = (time) => {
                const minutes = Math.floor(time / 60);
                const seconds = Math.floor(time % 60);
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            };
            
            const timeDisplay = document.getElementById('music-time');
            if (timeDisplay) {
                timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
            }
        }
    }
    
    // Смена музыки для режима ивента
    setEventMusic(isEvent) {
        if (isEvent) {
            this.changeTheme('magical');
        } else {
            this.changeTheme('classic');
        }
    }
}

export default new MusicSystem();