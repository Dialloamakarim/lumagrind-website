// Gestionnaire de communauté ultra-interactif
class CommunityManager {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('lumagrind_posts')) || this.getDefaultPosts();
        this.members = 12457;
        this.postsCount = 8923;
        this.countries = 67;
        this.successStories = 2341;
        this.init();
    }

    init() {
        this.renderPosts();
        this.setupEventListeners();
        this.animateStats();
        this.renderLeaders();
    }

    getDefaultPosts() {
        return [
            {
                id: 1,
                username: "HustlerPro",
                avatar: "💪",
                content: "🚀 Juste clos mon premier mois à 10K€ de revenue ! Merci à la communauté LuMaGrind pour le mindset et les stratégies partagées. Le grind paye !",
                timestamp: "Il y a 2h",
                likes: 142,
                comments: [
                    { user: "GrindQueen", avatar: "👑", content: "Félicitations ! Inspirant 🔥", time: "Il y a 1h" },
                    { user: "MindsetMaster", avatar: "🧠", content: "Tu mérites chaque centime ! Continue comme ça 💪", time: "Il y a 45min" }
                ],
                userLiked: false
            },
            {
                id: 2,
                username: "StartupGirl",
                avatar: "🚀",
                content: "💡 Question communauté : Comment gérez-vous la productivité les jours où la motivation n'est pas au rendez-vous ? J'ai besoin de vos tips !",
                timestamp: "Il y a 5h",
                likes: 89,
                comments: [
                    { user: "DisciplineDude", avatar: "⏰", content: "Routine > Motivation. Je me force à commencer 25min de travail, après ça roule tout seul !", time: "Il y a 4h" },
                    { user: "ProductivityPro", avatar: "📊", content: "La technique Pomodoro sauve des vies ! 25min travail / 5min pause", time: "Il y a 3h" }
                ],
                userLiked: true
            },
            {
                id: 3,
                username: "VisionnaireFR",
                avatar: "🌟",
                content: "🏆 Objectif du jour atteint : 5h de travail deep focus sans distractions. Petite victoire mais ça compte ! 💯",
                timestamp: "Il y a 8h",
                likes: 203,
                comments: [
                    { user: "FocusMaster", avatar: "🎯", content: "Respect ! Le deep focus c'est le secret des performants", time: "Il y a 7h" },
                    { user: "EarlyRiser", avatar: "🌅", content: "Inspirant ! Je relève le défi demain 💪", time: "Il y a 6h" }
                ],
                userLiked: false
            }
        ];
    }

    setupEventListeners() {
        // Post input
        const postInput = document.getElementById('postInput');
        const postSubmit = document.getElementById('postSubmit');
        const charCount = document.getElementById('charCount');

        if (postInput && postSubmit && charCount) {
            postInput.addEventListener('input', () => {
                const length = postInput.value.length;
                charCount.textContent = length;
                postSubmit.disabled = length === 0 || length > 500;

                if (length > 450) {
                    charCount.style.color = '#ff6b6b';
                } else if (length > 400) {
                    charCount.style.color = '#f7931e';
                } else {
                    charCount.style.color = 'var(--text-meteor)';
                }
            });

            postSubmit.addEventListener('click', () => this.createPost(postInput.value));
            
            // Enter key pour soumettre
            postInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!postSubmit.disabled) {
                        this.createPost(postInput.value);
                    }
                }
            });
        }
    }

    createPost(content) {
        if (!content.trim()) return;

        const newPost = {
            id: Date.now(),
            username: "Moi",
            avatar: "💪",
            content: content.trim(),
            timestamp: "Maintenant",
            likes: 0,
            comments: [],
            userLiked: false
        };

        this.posts.unshift(newPost);
        this.savePosts();
        this.renderPosts();

        // Reset le formulaire
        document.getElementById('postInput').value = '';
        document.getElementById('charCount').textContent = '0';
        document.getElementById('postSubmit').disabled = true;

        this.showNotification('Post partagé avec la communauté ! 🔥');
    }

    likePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            if (post.userLiked) {
                post.likes--;
                post.userLiked = false;
            } else {
                post.likes++;
                post.userLiked = true;
            }
            this.savePosts();
            this.renderPosts();
        }
    }

    addComment(postId, content) {
        const post = this.posts.find(p => p.id === postId);
        if (post && content.trim()) {
            post.comments.unshift({
                user: "Moi",
                avatar: "💪",
                content: content.trim(),
                time: "Maintenant"
            });
            this.savePosts();
            this.renderPosts();
        }
    }

    renderPosts() {
        const grid = document.getElementById('postsGrid');
        const template = document.getElementById('postTemplate');

        if (!grid || !template) return;

        grid.innerHTML = '';

        this.posts.forEach(post => {
            const postElement = template.content.cloneNode(true);
            const postCard = postElement.querySelector('.post-card');
            
            // Header
            postCard.querySelector('.post-user-avatar').textContent = post.avatar;
            postCard.querySelector('.username').textContent = post.username;
            postCard.querySelector('.post-time').textContent = post.timestamp;
            
            // Content
            postCard.querySelector('.post-text').textContent = post.content;
            
            // Stats
            const likeStat = postCard.querySelector('.like-stat');
            const likeCount = postCard.querySelector('.like-count');
            
            likeCount.textContent = post.likes;
            if (post.userLiked) {
                likeStat.classList.add('active');
            }
            
            likeStat.addEventListener('click', () => this.likePost(post.id));
            
            postCard.querySelector('.comment-count').textContent = post.comments.length;
            
            // Comments
            const commentsList = postCard.querySelector('.comments-list');
            post.comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment-item';
                commentElement.innerHTML = `
                    <div class="comment-avatar">${comment.avatar}</div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author">${comment.user}</span>
                            <span class="comment-time">${comment.time}</span>
                        </div>
                        <div class="comment-text">${comment.content}</div>
                    </div>
                `;
                commentsList.appendChild(commentElement);
            });
            
            // Comment form
            const commentForm = postCard.querySelector('.comment-form');
            const commentInput = postCard.querySelector('.comment-input');
            
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addComment(post.id, commentInput.value);
                commentInput.value = '';
            });
            
            grid.appendChild(postElement);
        });
    }

    renderLeaders() {
        const leadersGrid = document.getElementById('leadersGrid');
        if (!leadersGrid) return;

        const leaders = [
            {
                rank: "🥇",
                name: "HustlerPro",
                title: "Top Contributor",
                avatar: "💪",
                stats: { posts: "2.8K", likes: "45.2K", helped: "127" }
            },
            {
                rank: "🥈",
                name: "MindsetMaster",
                title: "Expert Mindset",
                avatar: "🧠",
                stats: { posts: "2.1K", likes: "38.7K", helped: "98" }
            },
            {
                rank: "🥉",
                name: "GrindQueen",
                title: "Reine du Hustle",
                avatar: "👑",
                stats: { posts: "1.9K", likes: "42.3K", helped: "113" }
            },
            {
                rank: "4",
                name: "DisciplineDude",
                title: "Maître Routine",
                avatar: "⏰",
                stats: { posts: "1.7K", likes: "35.8K", helped: "86" }
            }
        ];

        leadersGrid.innerHTML = leaders.map(leader => `
            <div class="leader-card animate-on-scroll">
                <div class="leader-rank">${leader.rank}</div>
                <div class="leader-avatar">${leader.avatar}</div>
                <h3 class="leader-name">${leader.name}</h3>
                <div class="leader-title">${leader.title}</div>
                <div class="leader-stats">
                    <div class="leader-stat">
                        <span class="leader-stat-value">${leader.stats.posts}</span>
                        <span class="leader-stat-label">Posts</span>
                    </div>
                    <div class="leader-stat">
                        <span class="leader-stat-value">${leader.stats.likes}</span>
                        <span class="leader-stat-label">Likes</span>
                    </div>
                    <div class="leader-stat">
                        <span class="leader-stat-value">${leader.stats.helped}</span>
                        <span class="leader-stat-label">Aidés</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    animateStats() {
        this.animateCounter('membersCount', this.members);
        this.animateCounter('postsCount', this.postsCount);
        this.animateCounter('countriesCount', this.countries);
        this.animateCounter('successCount', this.successStories);
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
}

// Initialisation globale
document.addEventListener('DOMContentLoaded', function() {
    window.communityManager = new CommunityManager();
});