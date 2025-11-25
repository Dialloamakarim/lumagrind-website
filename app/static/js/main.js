// LuMaGrind - Animations et Interactions
class LuMaGrindApp {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initThemeToggle();
        this.initCounterAnimation();
        this.initParticles();
        this.initTypewriter();
        this.initSmoothScroll();
        console.log('🔥 LuMaGrind - Deux esprits, une vision 🔥');
    }

    // Animation au défilement
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observer tous les éléments avec la classe 'animate-on-scroll'
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Basculer entre dark/light mode
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            body.classList.toggle('dark-mode');
            
            const isLightMode = body.classList.contains('light-mode');
            themeToggle.textContent = isLightMode ? '🌙' : '🌓';
            
            // Sauvegarder la préférence
            localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
        });

        // Charger la préférence sauvegardée
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            themeToggle.textContent = '🌙';
        }
    }

    // Animation des compteurs
    initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 secondes
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    }

    // Effet particules dans le hero
    initParticles() {
        const heroSection = document.querySelector('.hero-background');
        if (!heroSection) return;

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        heroSection.appendChild(particlesContainer);

        // Créer des particules
        for (let i = 0; i < 50; i++) {
            this.createParticle(particlesContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Position aléatoire
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${posX}%;
            top: ${posY}%;
            animation-duration: ${Math.random() * 10 + 10}s;
            animation-delay: ${Math.random() * 5}s;
            opacity: ${Math.random() * 0.5 + 0.1};
        `;
        
        container.appendChild(particle);
    }

    // Effet machine à écrire pour le titre
    initTypewriter() {
        const titles = document.querySelectorAll('.typewriter');
        
        titles.forEach(title => {
            const text = title.textContent;
            title.textContent = '';
            title.style.borderRight = '2px solid var(--primary-color)';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    title.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    title.style.borderRight = 'none';
                }
            };
            
            // Démarrer après un délai
            setTimeout(typeWriter, 1000);
        });
    }

    // Défilement fluide
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialiser l'app quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new LuMaGrindApp();
});

// Effets de souris avancés
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Animation au chargement de la page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Community functionality
class CommunityManager {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('lumagrind_posts')) || [];
        this.members = 12457;
        this.postsCount = 8923;
        this.countries = 67;
        this.initCommunity();
    }

    initCommunity() {
        this.renderPosts();
        this.updateStats();
        this.renderLeaders();
    }

    createPost(content) {
        const post = {
            id: Date.now(),
            content: content,
            username: 'Grinder Anonyme',
            timestamp: new Date().toLocaleTimeString('fr-FR'),
            likes: 0,
            comments: [],
            userAvatar: '💪'
        };

        this.posts.unshift(post);
        this.savePosts();
        this.renderPosts();
        this.updateStats();
    }

    likePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            this.savePosts();
            this.renderPosts();
        }
    }

    renderPosts() {
        const postsGrid = document.getElementById('postsGrid');
        const template = document.getElementById('postTemplate');

        if (!postsGrid || !template) return;

        postsGrid.innerHTML = '';

        this.posts.slice(0, 10).forEach(post => {
            const postElement = template.content.cloneNode(true);
            
            // Remplir les données du post
            postElement.querySelector('.username').textContent = post.username;
            postElement.querySelector('.post-time').textContent = post.timestamp;
            postElement.querySelector('.post-text').textContent = post.content;
            postElement.querySelector('.like-count').textContent = post.likes;
            
            // Ajouter les event listeners
            const likeBtn = postElement.querySelector('.like-btn');
            likeBtn.onclick = () => this.likePost(post.id);
            
            postsGrid.appendChild(postElement);
        });
    }

    renderLeaders() {
        const leadersGrid = document.getElementById('leadersGrid');
        if (!leadersGrid) return;

        const leaders = [
            { name: 'HustlerPro', score: '🔥 2,847', rank: '🥇' },
            { name: 'MindsetMaster', score: '💪 2,451', rank: '🥈' },
            { name: 'GrindQueen', score: '🚀 2,189', rank: '🥉' },
            { name: 'DisciplineDude', score: '⭐ 1,956', rank: '4' }
        ];

        leadersGrid.innerHTML = leaders.map(leader => `
            <div class="leader-card animate-on-scroll">
                <div class="leader-rank">${leader.rank}</div>
                <div class="leader-avatar">${leader.name.charAt(0)}</div>
                <h3 class="leader-name">${leader.name}</h3>
                <div class="leader-score">${leader.score}</div>
            </div>
        `).join('');
    }

    updateStats() {
        // Animation des compteurs
        this.animateCounter('membersCount', this.members);
        this.animateCounter('postsCount', this.postsCount);
        this.animateCounter('countriesCount', this.countries);
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
            element.textContent = Math.floor(current).toLocaleString();
        }, 40);
    }

    savePosts() {
        localStorage.setItem('lumagrind_posts', JSON.stringify(this.posts));
    }
}

// Functions globales pour les templates
function createPost() {
    const input = document.getElementById('postInput');
    const content = input.value.trim();
    
    if (content) {
        if (window.communityManager) {
            window.communityManager.createPost(content);
        }
        input.value = '';
        
        // Feedback visuel
        showNotification('Post partagé avec la communauté ! 🔥');
    }
}

function likePost(button) {
    const likeCount = button.querySelector('.like-count');
    let count = parseInt(likeCount.textContent);
    likeCount.textContent = count + 1;
    
    // Animation
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

function showNewsletterModal() {
    document.getElementById('newsletterModal').style.display = 'block';
}

function showDiscordModal() {
    showNotification('Lien Discord à venir ! 🚀');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function submitNewsletter(event) {
    event.preventDefault();
    showNotification('Bienvenue dans la famille Grinder ! 🔥');
    closeModal('newsletterModal');
}

function showNotification(message) {
    // Créer une notification toast
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--gradient-primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialiser le manager de communauté
document.addEventListener('DOMContentLoaded', () => {
    window.communityManager = new CommunityManager();
    
    // Enter key pour les posts
    const postInput = document.getElementById('postInput');
    if (postInput) {
        postInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                createPost();
            }
        });
    }
});

// app/static/js/content.js
class ContentManager {
    constructor() {
        this.currentPlatform = 'all';
        this.currentCategory = 'all';
        this.currentPage = 1;
        this.content = [];
        this.init();
    }

    init() {
        this.loadContent();
        this.setupEventListeners();
        this.updateStats();
    }

    loadContent() {
        // Données simulées - Plus tard on pourra intégrer des APIs réelles
        this.content = [
            {
                id: 1,
                platform: 'instagram',
                category: 'motivation',
                description: "Le succès n'est pas accidentel. C'est le résultat d'un travail constant, d'une discipline de fer et d'un mindset invincible. 🔥",
                image: "/static/images/placeholder-motivation.jpg",
                likes: 2450,
                comments: 189,
                views: 12500,
                date: "Il y a 2 heures",
                video: false
            },
            {
                id: 2,
                platform: 'tiktok',
                category: 'business',
                description: "3 erreurs qui tuent ton business en 2024 ⚠️ La numéro 2 va te surprendre...",
                image: "/static/images/placeholder-business.jpg",
                likes: 18900,
                comments: 1200,
                views: 150000,
                date: "Il y a 1 jour",
                video: true
            },
            {
                id: 3,
                platform: 'facebook',
                category: 'mindset',
                description: "🧠 Ton mindset détermine 80% de ton succès. Voici comment le reprogrammer pour gagner...",
                image: "/static/images/placeholder-mindset.jpg",
                likes: 890,
                comments: 67,
                views: 8500,
                date: "Il y a 3 jours",
                video: false
            },
            {
                id: 4,
                platform: 'youtube',
                category: 'grind',
                description: "🚀 Ma routine matinale de 5h du matin qui a changé ma vie entrepreneuriale",
                image: "/static/images/placeholder-grind.jpg",
                likes: 4200,
                comments: 450,
                views: 89000,
                date: "Il y a 1 semaine",
                video: true
            },
            {
                id: 5,
                platform: 'instagram',
                category: 'motivation',
                description: "💪 Quand tu veux abandonner, souviens-toi pourquoi tu as commencé. La persévérance paie toujours.",
                image: "/static/images/placeholder-motivation2.jpg",
                likes: 3200,
                comments: 240,
                views: 18000,
                date: "Il y a 4 heures",
                video: false
            },
            {
                id: 6,
                platform: 'tiktok',
                category: 'business',
                description: "📈 J'ai généré 10K€ en 30 jours avec cette stratégie simple...",
                image: "/static/images/placeholder-business2.jpg",
                likes: 25600,
                comments: 1800,
                views: 210000,
                date: "Il y a 2 jours",
                video: true
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
                this.renderContent();
            });
        });

        // Filtres par catégorie
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
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

    renderContent() {
        const grid = document.getElementById('contentGrid');
        const template = document.getElementById('contentCardTemplate');

        if (!grid || !template) return;

        grid.innerHTML = '';

        const filteredContent = this.content.filter(item => {
            const platformMatch = this.currentPlatform === 'all' || item.platform === this.currentPlatform;
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
            card.querySelector('.platform-icon').textContent = this.getPlatformIcon(item.platform);
            card.querySelector('.content-category').textContent = this.getCategoryLabel(item.category);
            card.querySelector('.content-date').textContent = item.date;
            
            // Content
            const media = card.querySelector('.content-media');
            card.querySelector('.media-image').src = item.image;
            card.querySelector('.media-image').alt = item.description.substring(0, 50) + '...';
            
            if (item.video) {
                card.querySelector('.play-overlay').style.display = 'flex';
            }
            
            card.querySelector('.content-description').textContent = item.description;
            
            // Stats
            card.querySelector('.stat:nth-child(1) .stat-count').textContent = this.formatNumber(item.likes);
            card.querySelector('.stat:nth-child(2) .stat-count').textContent = this.formatNumber(item.comments);
            card.querySelector('.stat:nth-child(3) .stat-count').textContent = this.formatNumber(item.views);
            
            grid.appendChild(card);
        });

        this.updateStats();
    }

    loadMoreContent() {
        // Simuler le chargement de plus de contenu
        this.currentPage++;
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        loadMoreBtn.textContent = 'Chargement...';
        loadMoreBtn.disabled = true;

        setTimeout(() => {
            // Ajouter du contenu supplémentaire (simulé)
            const newContent = [
                {
                    id: this.content.length + 1,
                    platform: 'instagram',
                    category: 'grind',
                    description: "🔥 Le grind ne s'arrête jamais. Chaque jour est une nouvelle opportunité de progresser.",
                    image: "/static/images/placeholder-grind2.jpg",
                    likes: 1800,
                    comments: 95,
                    views: 12000,
                    date: "Il y a 5 heures",
                    video: false
                }
            ];

            this.content = [...this.content, ...newContent];
            this.renderContent();
            
            loadMoreBtn.textContent = 'Charger plus de contenu';
            loadMoreBtn.disabled = false;

            showNotification('Nouveau contenu chargé ! 🎉');
        }, 1500);
    }

    updateStats() {
        const totalContent = this.content.length;
        const totalViews = this.content.reduce((sum, item) => sum + item.views, 0);
        const totalLikes = this.content.reduce((sum, item) => sum + item.likes, 0);

        this.animateCounter('totalContent', totalContent);
        this.animateCounter('totalViews', totalViews);
        this.animateCounter('totalLikes', totalLikes);
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

    getPlatformIcon(platform) {
        const icons = {
            'instagram': '📸',
            'tiktok': '🎵',
            'facebook': '🌐',
            'youtube': '▶️',
            'all': '🔥'
        };
        return icons[platform] || '📱';
    }

    getCategoryLabel(category) {
        const labels = {
            'motivation': '💪 Motivation',
            'business': '🚀 Business',
            'mindset': '🧠 Mindset',
            'grind': '🔥 Grind',
            'all': 'Tout'
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

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Simuler l'envoi
        showNotification(`Merci ! Tu recevras notre meilleur contenu à ${email} 🚀`);
        e.target.reset();
    }
}

// Fonctions globales
function shareContent(button) {
    const card = button.closest('.content-card');
    const description = card.querySelector('.content-description').textContent;
    
    if (navigator.share) {
        navigator.share({
            title: 'LuMaGrind - Contenu Motivant',
            text: description,
            url: window.location.href
        });
    } else {
        // Fallback pour navigateurs sans Web Share API
        navigator.clipboard.writeText(description + ' - LuMaGrind');
        showNotification('Lien copié dans le presse-papier ! 📋');
    }
}

function saveContent(button) {
    const card = button.closest('.content-card');
    
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    showNotification('Contenu sauvegardé dans tes favoris ! 💾');
}

// Initialiser le gestionnaire de contenu
document.addEventListener('DOMContentLoaded', () => {
    window.contentManager = new ContentManager();
});

// Gestionnaire du formulaire de contact
class ContactManager {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.charCount = document.getElementById('charCount');
        this.messageInput = document.getElementById('message');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Compteur de caractères
        if (this.messageInput && this.charCount) {
            this.messageInput.addEventListener('input', () => {
                const length = this.messageInput.value.length;
                this.charCount.textContent = length;
                
                if (length > 500) {
                    this.charCount.style.color = '#ff6b6b';
                } else if (length > 400) {
                    this.charCount.style.color = '#f7931e';
                } else {
                    this.charCount.style.color = 'var(--text-gray)';
                }
            });
        }

        // Soumission du formulaire
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Validation en temps réel
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    validateField(field) {
        const errorElement = document.getElementById(field.name + 'Error');
        
        if (!field.value.trim()) {
            this.showError(field, errorElement, 'Ce champ est requis');
            return false;
        }

        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                this.showError(field, errorElement, 'Email invalide');
                return false;
            }
        }

        if (field.name === 'message' && field.value.length > 500) {
            this.showError(field, errorElement, 'Le message ne doit pas dépasser 500 caractères');
            return false;
        }

        this.hideError(field, errorElement);
        return true;
    }

    showError(field, errorElement, message) {
        field.style.borderColor = '#ff6b6b';
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    hideError(field, errorElement) {
        field.style.borderColor = '';
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Valider tous les champs
        const fields = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
            return;
        }

        // Préparer les données
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            type: formData.get('type'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Afficher le loading
        this.setLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccess(result.message);
                this.form.reset();
                this.charCount.textContent = '0';
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.error('Erreur:', error);
            showNotification(error.message || 'Erreur lors de l\'envoi du message', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');

        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            this.submitBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            this.submitBtn.disabled = false;
        }
    }

    showSuccess(message) {
        const successModal = document.getElementById('successModal');
        const successMessage = document.getElementById('successMessage');
        
        if (successMessage) {
            successMessage.textContent = message;
        }
        
        if (successModal) {
            successModal.style.display = 'block';
        }
        
        // Tracking (optionnel)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submit', {
                'event_category': 'engagement',
                'event_label': 'contact_form'
            });
        }
    }
}

// Fonctions globales
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
            <span>${message}</span>
        </div>
    `;

    // Styles de notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--gradient-primary)' : '#ff6b6b'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Initialiser le gestionnaire de contact
document.addEventListener('DOMContentLoaded', () => {
    new ContactManager();
});