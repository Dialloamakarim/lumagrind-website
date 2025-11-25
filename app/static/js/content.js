// Gestionnaire de contenu premium
class ContentManager {
    constructor() {
        this.currentPlatform = 'all';
        this.currentCategory = 'all';
        this.currentPage = 1;
        this.isLoading = false;
        this.content = [];
        this.init();
    }

    init() {
        this.loadContent();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.animateStats();
    }

    loadContent() {
        // Données de contenu simulées - ultra réalistes
        this.content = [
            {
                id: 1,
                platform: 'instagram',
                category: 'motivation',
                description: "🔥 Le succès n'est pas accidentel. C'est le résultat d'un travail constant, d'une discipline de fer et d'un mindset invincible. La question n'est pas si tu vas réussir, mais quand !",
                image: "/static/images/placeholder-motivation.jpg",
                likes: "12.4K",
                comments: "892",
                views: "124.7K",
                date: "Il y a 2h",
                video: false,
                platformIcon: "📸",
                platformName: "Instagram"
            },
            {
                id: 2,
                platform: 'tiktok',
                category: 'business',
                description: "💼 3 erreurs qui tuent ton business en 2024 ⚠️ La numéro 2 va te surprendre... Spoiler : C'est lié à ton mindset !",
                image: "/static/images/placeholder-business.jpg",
                likes: "45.2K",
                comments: "2.1K",
                views: "1.2M",
                date: "Il y a 1j",
                video: true,
                platformIcon: "🎵",
                platformName: "TikTok"
            },
            {
                id: 3,
                platform: 'youtube',
                category: 'mindset',
                description: "🧠 Ta mentalité détermine 80% de ton succès. Dans cette vidéo, je te montre comment reprogrammer ton cerveau pour gagner systématiquement.",
                image: "/static/images/placeholder-mindset.jpg",
                likes: "8.7K",
                comments: "423",
                views: "156.3K",
                date: "Il y a 3j",
                video: true,
                platformIcon: "▶️",
                platformName: "YouTube"
            },
            {
                id: 4,
                platform: 'facebook',
                category: 'grind',
                description: "⏰ 5h du matin, déjà en action pendant que le monde dort. Le grind ne s'arrête jamais. Chaque minute compte dans la course vers le succès.",
                image: "/static/images/placeholder-grind.jpg",
                likes: "15.8K",
                comments: "1.2K",
                views: "289.4K",
                date: "Il y a 5h",
                video: false,
                platformIcon: "🌐",
                platformName: "Facebook"
            },
            {
                id: 5,
                platform: 'linkedin',
                category: 'success',
                description: "🏆 De 0 à 100K€ en 6 mois : L'histoire vraie d'un grinder qui a appliqué nos principes. Spoiler : La discipline a tout changé.",
                image: "/static/images/placeholder-success.jpg",
                likes: "3.2K",
                comments: "287",
                views: "89.6K",
                date: "Il y a 2j",
                video: false,
                platformIcon: "💼",
                platformName: "LinkedIn"
            },
            {
                id: 6,
                platform: 'twitter',
                category: 'tips',
                description: "💡 Un seul changement dans ta routine matinale peut doubler ta productivité. Je te révèle lequel dans ce thread ↓",
                image: "/static/images/placeholder-tips.jpg",
                likes: "7.9K",
                comments: "654",
                views: "234.1K",
                date: "Il y a 8h",
                video: false,
                platformIcon: "🐦",
                platformName: "Twitter"
            },
            {
                id: 7,
                platform: 'instagram',
                category: 'motivation',
                description: "💪 Quand tu veux abandonner, souviens-toi pourquoi tu as commencé. La persévérance paie toujours, même quand tu ne vois pas les résultats immédiats.",
                image: "/static/images/placeholder-motivation2.jpg",
                likes: "23.1K",
                comments: "1.8K",
                views: "367.2K",
                date: "Il y a 12h",
                video: false,
                platformIcon: "📸",
                platformName: "Instagram"
            },
            {
                id: 8,
                platform: 'tiktok',
                category: 'business',
                description: "📈 J'ai généré 10K€ en 30 jours avec cette stratégie simple mais ultra efficace. Je te montre tout en 60 secondes ⏱️",
                image: "/static/images/placeholder-business2.jpg",
                likes: "89.4K",
                comments: "4.2K",
                views: "2.3M",
                date: "Il y a 2j",
                video: true,
                platformIcon: "🎵",
                platformName: "TikTok"
            },

            // ===== NOUVEAUX CONTENUS SPORT =====
            {
                id: 9,
                platform: 'instagram',
                category: 'sport',
                description: "💪 Sport = Performance Business. Ton corps est ton premier outil de travail. Entraîne-le comme un athlète, performe comme un champion.",
                image: "/static/images/placeholder-sport1.jpg",
                likes: "8.7K",
                comments: "423",
                views: "145.2K",
                date: "Il y a 1j",
                video: false,
                platformIcon: "📸",
                platformName: "Instagram"
            },
            {
                id: 10,
                platform: 'youtube',
                category: 'sport',
                description: "🏋️ Routine d'entraînement de 20min pour entrepreneurs. Boost ton énergie, ta focus et ta productivité pour toute la journée.",
                image: "/static/images/placeholder-sport2.jpg",
                likes: "12.3K",
                comments: "856",
                views: "289.4K",
                date: "Il y a 3j",
                video: true,
                platformIcon: "▶️",
                platformName: "YouTube"
            },
            {
                id: 11,
                platform: 'tiktok',
                category: 'sport',
                description: "🔥 Comment je combine sport intensif et business scaling. Les 3 secrets pour ne jamais manquer d'énergie. ↓",
                image: "/static/images/placeholder-sport3.jpg",
                likes: "45.8K",
                comments: "2.1K",
                views: "1.2M",
                date: "Il y a 5j",
                video: true,
                platformIcon: "🎵",
                platformName: "TikTok"
            },
            {
                id: 12,
                platform: 'facebook',
                category: 'sport',
                description: "🧠 Mindset d'athlète appliqué au business. La discipline sportive qui transforme tes résultats entrepreneuriaux.",
                image: "/static/images/placeholder-sport4.jpg",
                likes: "15.6K",
                comments: "1.2K",
                views: "234.7K",
                date: "Il y a 1 sem",
                video: false,
                platformIcon: "🌐",
                platformName: "Facebook"
            },
            {
                id: 13,
                platform: 'instagram',
                category: 'sport',
                description: "⚡ Récupération optimale pour grinders. Comment bien récupérer pour performer jour après jour sans burnout.",
                image: "/static/images/placeholder-sport5.jpg",
                likes: "9.8K",
                comments: "567",
                views: "178.3K",
                date: "Il y a 2 sem",
                video: false,
                platformIcon: "📸",
                platformName: "Instagram"
            },
            {
                id: 14,
                platform: 'youtube',
                category: 'sport',
                description: "🏃‍♂️ Running & Business : Comment mes meilleures idées viennent pendant ma course matinale. Testé et approuvé !",
                image: "/static/images/placeholder-sport6.jpg",
                likes: "7.4K",
                comments: "389",
                views: "156.9K",
                date: "Il y a 2 sem",
                video: true,
                platformIcon: "▶️",
                platformName: "YouTube"
            }
        ];

        this.renderContent();
    }

    setupEventListeners() {
        // Filtres par plateforme
        document.querySelectorAll('.platform-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentPlatform = e.target.dataset.platform;
                this.currentPage = 1;
                this.renderContent();
            });
        });

        // Filtres par catégorie
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.currentPage = 1;
                this.renderContent();
            });
        });

        // Bouton Load More
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreContent());
        }

        // Newsletter
        const newsletterForm = document.getElementById('contentNewsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    renderContent() {
        const grid = document.getElementById('contentGrid');
        const template = document.getElementById('contentCardTemplate');

        if (!grid || !template) return;

        grid.innerHTML = '';

        const filteredContent = this.content.filter(item => {
            const platformMatch = this.currentPlatform === 'all' || 
                                 (this.currentPlatform === 'sport' ? item.category === 'sport' : item.platform === this.currentPlatform);
            const categoryMatch = this.currentCategory === 'all' || item.category === this.currentCategory;
            return platformMatch && categoryMatch;
        });

        filteredContent.forEach(item => {
            const card = template.content.cloneNode(true);
            const cardElement = card.querySelector('.content-card');
            
            // Données de la carte
            cardElement.dataset.platform = item.platform;
            cardElement.dataset.category = item.category;
            
            // Header
            card.querySelector('.platform-icon').textContent = item.platformIcon;
            card.querySelector('.platform-name').textContent = item.platformName;
            card.querySelector('.content-category').textContent = this.getCategoryLabel(item.category);
            card.querySelector('.content-date').textContent = item.date;
            
            // Media
            card.querySelector('.media-image').src = item.image;
            card.querySelector('.media-image').alt = item.description;
            
            // Afficher le bouton play pour les vidéos
            if (!item.video) {
                card.querySelector('.play-button').style.display = 'none';
            }
            
            // Description
            card.querySelector('.content-description').textContent = item.description;
            
            // Stats
            card.querySelector('.stat-item:nth-child(1) .stat-count').textContent = item.likes;
            card.querySelector('.stat-item:nth-child(2) .stat-count').textContent = item.comments;
            card.querySelector('.stat-item:nth-child(3) .stat-count').textContent = item.views;
            
            // Actions
            const shareBtn = card.querySelector('.share-btn');
            const saveBtn = card.querySelector('.save-btn');
            const viewBtn = card.querySelector('.view-btn');
            
            shareBtn.addEventListener('click', () => this.shareContent(item));
            saveBtn.addEventListener('click', () => this.saveContent(item));
            viewBtn.addEventListener('click', () => this.viewContent(item));
            
            grid.appendChild(card);
        });

        this.updateEmptyState();
        this.updateSportStats();
    }

    loadMoreContent() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        loadMoreBtn.textContent = 'Chargement...';
        loadMoreBtn.classList.add('loading');

        // Simuler le chargement
        setTimeout(() => {
            this.currentPage++;
            
            // Ajouter du contenu supplémentaire (simulé)
            const newContent = [
                {
                    id: this.content.length + 1,
                    platform: 'instagram',
                    category: 'grind',
                    description: "🌅 Lever à 4h30, méditation, sport, planification. La routine des winners. Chaque jour compte dans la construction de ton empire.",
                    image: "/static/images/placeholder-grind2.jpg",
                    likes: "18.3K",
                    comments: "1.1K",
                    views: "245.8K",
                    date: "Il y a 6h",
                    video: false,
                    platformIcon: "📸",
                    platformName: "Instagram"
                }
            ];

            this.content = [...this.content, ...newContent];
            this.renderContent();
            
            loadMoreBtn.textContent = '📥 Charger Plus de Contenu';
            loadMoreBtn.classList.remove('loading');
            this.isLoading = false;

            this.showNotification('Nouveau contenu chargé ! 🎉');
        }, 1500);
    }

    animateStats() {
        const totalContent = this.content.length;
        const totalViews = this.content.reduce((sum, item) => sum + parseInt(item.views.replace('K', '000').replace('M', '000000')), 0);
        const totalLikes = this.content.reduce((sum, item) => sum + parseInt(item.likes.replace('K', '000').replace('M', '000000')), 0);
        const sportContent = this.content.filter(item => item.category === 'sport').length;

        this.animateCounter('totalContent', totalContent);
        this.animateCounter('totalViews', totalViews);
        this.animateCounter('totalLikes', totalLikes);
        this.animateCounter('sportContent', sportContent);
    }

    updateSportStats() {
        const sportContent = this.content.filter(item => item.category === 'sport').length;
        const sportElement = document.getElementById('sportContent');
        if (sportElement) {
            sportElement.textContent = sportContent;
        }
    }

    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = this.formatNumber(Math.floor(current));
        }, 40);
    }

    shareContent(item) {
        if (navigator.share) {
            navigator.share({
                title: `LuMaGrind - ${item.platformName}`,
                text: item.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(item.description + ' - LuMaGrind');
            this.showNotification('Lien copié dans le presse-papier ! 📋');
        }
    }

    saveContent(item) {
        // Sauvegarder dans le localStorage
        const savedContent = JSON.parse(localStorage.getItem('savedContent') || '[]');
        if (!savedContent.find(content => content.id === item.id)) {
            savedContent.push(item);
            localStorage.setItem('savedContent', JSON.stringify(savedContent));
            this.showNotification('Contenu sauvegardé dans tes favoris ! 💾');
        } else {
            this.showNotification('Contenu déjà sauvegardé ! ⭐');
        }
    }

    viewContent(item) {
        // Simuler l'ouverture du contenu
        this.showNotification(`Ouverture du contenu sur ${item.platformName}... 🚀`);
        
        // Animation de visualisation
        const event = new CustomEvent('contentView', { detail: item });
        document.dispatchEvent(event);
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        this.showNotification(`🎉 Super ! Tu recevras notre meilleur contenu à ${email}`);
        e.target.reset();
        
        // Tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_subscribe', {
                'event_category': 'engagement',
                'event_label': 'content_page'
            });
        }
    }

    updateEmptyState() {
        const grid = document.getElementById('contentGrid');
        if (grid.children.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">📭</div>
                    <h3 style="color: var(--text-meteor); margin-bottom: 1rem;">Aucun contenu trouvé</h3>
                    <p style="color: var(--text-meteor);">Essaye de changer tes filtres pour voir plus de contenu !</p>
                </div>
            `;
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--gradient-fire);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            box-shadow: var(--glow-primary);
            font-weight: 600;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getCategoryLabel(category) {
        const labels = {
            'motivation': '💪 Motivation',
            'business': '📈 Business',
            'mindset': '🧠 Mindset',
            'sport': '🏋️ Sport & Performance',
            'grind': '🔥 Daily Grind',
            'success': '🏆 Success Stories',
            'tips': '💡 Tips & Astuces'
        };
        return labels[category] || category;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Initialisation globale
document.addEventListener('DOMContentLoaded', function() {
    window.contentManager = new ContentManager();
});