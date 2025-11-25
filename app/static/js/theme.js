// Gestionnaire du thème LuMaGrind
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'dark-mode';
        
        this.init();
    }

    init() {
        // Appliquer le thème sauvegardé
        this.applyTheme(this.currentTheme);
        
        // Configurer l'écouteur d'événements
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Mettre à jour l'icône
        this.updateToggleIcon();
        
        // Ajouter la transition globale
        this.addGlobalTransitions();
    }

    applyTheme(theme) {
        // Transition fluide
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            document.body.className = theme;
            localStorage.setItem('theme', theme);
            this.updateToggleIcon();
            this.updateMetaThemeColor(theme);
            
            // Restaurer l'opacité
            document.body.style.opacity = '1';
        }, 150);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
        this.currentTheme = newTheme;
        this.applyTheme(newTheme);
        
        // Animation du toggle
        this.animateToggle();
        
        // Son de transition (optionnel)
        this.playTransitionSound();
    }

    updateToggleIcon() {
        const icon = this.currentTheme === 'dark-mode' ? '🌙' : '☀️';
        const label = this.currentTheme === 'dark-mode' ? 'Activer le mode clair' : 'Activer le mode sombre';
        
        this.themeToggle.textContent = icon;
        this.themeToggle.setAttribute('aria-label', label);
        this.themeToggle.title = label;
    }

    animateToggle() {
        this.themeToggle.style.transform = 'rotate(180deg) scale(0.8)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'rotate(0deg) scale(1)';
        }, 300);
    }

    updateMetaThemeColor(theme) {
        const color = theme === 'dark-mode' ? '#0a0a0a' : '#fed7e2';
        
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = color;
    }

    addGlobalTransitions() {
        // S'assurer que les transitions sont appliquées
        if (!document.querySelector('#theme-transitions')) {
            const style = document.createElement('style');
            style.id = 'theme-transitions';
            style.textContent = `
                body, .navbar, .cosmic-footer, .theme-toggle,
                .content-card, .community-card, .testimonial-card,
                input, textarea, select, button {
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                }
                
                * {
                    transition: background-color 0.4s ease, 
                              color 0.4s ease, 
                              border-color 0.4s ease,
                              box-shadow 0.4s ease !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    playTransitionSound() {
        // Son de transition subtil (optionnel)
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Le son n'est pas supporté, on ignore
        }
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    const themeManager = new ThemeManager();
    
    // Ajouter une classe pour les animations après le chargement
    setTimeout(() => {
        document.body.classList.add('theme-ready');
    }, 100);
});

// Détection automatique de la préférence système
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light-mode';
    }
    return 'dark-mode';
}

// Synchronisation avec le thème système
if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    const handleSystemThemeChange = (e) => {
        // Seulement si l'utilisateur n'a pas explicitement choisi un thème
        if (!localStorage.getItem('theme')) {
            const themeManager = new ThemeManager();
            themeManager.applyTheme(e.matches ? 'light-mode' : 'dark-mode');
        }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Appliquer le thème système au premier chargement si aucun choix utilisateur
    if (!localStorage.getItem('theme')) {
        const systemTheme = detectSystemTheme();
        document.body.className = systemTheme;
    }
}