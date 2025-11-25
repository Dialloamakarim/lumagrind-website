// Gestionnaire du blog
class BlogManager {
    constructor() {
        this.articles = this.getSampleArticles();
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        this.renderArticles();
        this.setupEventListeners();
        this.animateStats();
    }

    getSampleArticles() {
        return [
            {
                id: 1,
                title: "Comment 10x Ta Productivité en 30 Jours",
                excerpt: "Découvre les stratégies concrètes pour multiplier ta productivité et accomplir en 1 jour ce que la plupart font en 1 semaine.",
                category: "productivity",
                image: "/static/images/blog/productivite.jpg",
                date: "15 Déc 2024",
                readTime: "8 min",
                author: { name: "Luidgi", avatar: "💪" },
                views: 1247
            },
            {
                id: 2,
                title: "Les 7 Erreurs qui Tuent Ton Business en 2024",
                excerpt: "Évite ces pièges courants que font 90% des entrepreneurs et qui les empêchent de scaler leur business.",
                category: "business",
                image: "/static/images/blog/erreurs.jpg",
                date: "12 Déc 2024",
                readTime: "12 min",
                author: { name: "Mamadou", avatar: "🚀" },
                views: 2891
            },
            {
                id: 3,
                title: "Mindset du Winner : Reprogramme Ton Cerveau",
                excerpt: "Apprends à développer la mentalité des grands gagnants et transforme tes limitations en super-pouvoirs.",
                category: "mindset",
                image: "/static/images/blog/mindset.jpg",
                date: "10 Déc 2024",
                readTime: "10 min",
                author: { name: "Luidgi", avatar: "💪" },
                views: 1876
            },
            {
                id: 4,
                title: "Acquisition Clients : Stratégies à Moindre Coût",
                excerpt: "Des techniques éprouvées pour attirer des clients qualifiés sans dépenser des fortunes en publicité.",
                category: "marketing",
                image: "/static/images/blog/acquisition.jpg",
                date: "8 Déc 2024",
                readTime: "15 min",
                author: { name: "Mamadou", avatar: "🚀" },
                views: 2156
            },
            // NOUVEAUX ARTICLES SPORT
        {
            id: 5,
            title: "Comment le Sport 10x Ta Performance Business",
            excerpt: "Découvre pourquoi les entrepreneurs qui s'entraînent réussissent mieux et comment intégrer le sport dans ta routine de grinder.",
            category: "sport",
            image: "/static/images/blog/sport-business.jpg",
            date: "14 Déc 2024",
            readTime: "10 min",
            author: { name: "Luidgi", avatar: "💪" },
            views: 1567
        },
        {
            id: 6,
            title: "Routine Matinale Sportive des Winners",
            excerpt: "La routine d'entraînement de 20 minutes qui booste ton énergie, ta focus et ta productivité pour toute la journée.",
            category: "sport",
            image: "/static/images/blog/routine-sport.jpg",
            date: "11 Déc 2024",
            readTime: "8 min",
            author: { name: "Mamadou", avatar: "🚀" },
            views: 1983
        },
        {
            id: 7,
            title: "Nutrition Performance : Le Carburant du Grinder",
            excerpt: "Optimise ton alimentation pour maximiser ton énergie, ta récupération et tes performances mentales.",
            category: "sport",
            image: "/static/images/blog/nutrition.jpg",
            date: "9 Déc 2024",
            readTime: "12 min",
            author: { name: "Luidgi", avatar: "💪" },
            views: 1324
        }
        ];
    }

    setupEventListeners() {
        // Filtres catégories
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.renderArticles();
            });
        });

        // Recherche
        const searchInput = document.getElementById('blogSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterArticles(e.target.value);
            });
        }
    }

    renderArticles() {
        const grid = document.getElementById('blogGrid');
        const template = document.getElementById('articleTemplate');

        if (!grid || !template) return;

        grid.innerHTML = '';

        const filteredArticles = this.articles.filter(article => {
            return this.currentCategory === 'all' || article.category === this.currentCategory;
        });

        filteredArticles.forEach(article => {
            const articleElement = template.content.cloneNode(true);
            const card = articleElement.querySelector('.article-card');
            
            card.dataset.category = article.category;
            
            // Image et catégorie
            card.querySelector('.article-image img').src = article.image;
            card.querySelector('.article-image img').alt = article.title;
            card.querySelector('.article-category').textContent = this.getCategoryLabel(article.category);
            
            // Métadonnées
            card.querySelector('.article-date').textContent = article.date;
            card.querySelector('.article-read-time').textContent = article.readTime;
            
            // Contenu
            card.querySelector('.article-title').textContent = article.title;
            card.querySelector('.article-excerpt').textContent = article.excerpt;
            
            // Auteur
            card.querySelector('.author-avatar').textContent = article.author.avatar;
            card.querySelector('.author-name').textContent = article.author.name;
            
            grid.appendChild(articleElement);
        });

        this.updateArticleCount();
    }

    filterArticles(searchTerm) {
        const articles = document.querySelectorAll('.article-card');
        
        articles.forEach(article => {
            const title = article.querySelector('.article-title').textContent.toLowerCase();
            const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
            
            if (title.includes(searchTerm.toLowerCase()) || excerpt.includes(searchTerm.toLowerCase())) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    }

    animateStats() {
        const totalArticles = this.articles.length;
        const totalViews = this.articles.reduce((sum, article) => sum + article.views, 0);
        const uniqueAuthors = new Set(this.articles.map(article => article.author.name)).size;

        this.animateCounter('articleCount', totalArticles);
        this.animateCounter('readCount', totalViews);
        this.animateCounter('authorCount', uniqueAuthors);
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

    updateArticleCount() {
        const visibleArticles = document.querySelectorAll('.article-card[style=""]').length + 
                               document.querySelectorAll('.article-card:not([style])').length;
        document.getElementById('articleCount').textContent = visibleArticles;
    }

    getCategoryLabel(category) {
        const labels = {
            'business': '🚀 Business',
            'mindset': '🧠 Mindset', 
            'productivity': '⚡ Productivité',
            'sport': '🏋️ Sport & Performance',
            'marketing': '📈 Marketing',
            'finance': '💰 Finance'
        };
        return labels[category] || category;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    new BlogManager();
});