// Gestionnaire du slider de témoignages
class TestimonialsSlider {
    constructor() {
        this.track = document.getElementById('testimonialsTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('sliderDots');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.currentIndex = 0;
        this.cardWidth = this.cards[0].offsetWidth + 32; // width + gap
        this.totalCards = this.cards.length;
        
        this.init();
    }

    init() {
        this.createDots();
        this.setupEventListeners();
        this.updateSlider();
    }

    createDots() {
        for (let i = 0; i < this.totalCards; i++) {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Navigation au clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Auto-play
        this.startAutoPlay();
        
        // Pause auto-play on hover
        this.track.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.track.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
        this.updateSlider();
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalCards;
        this.updateSlider();
    }

    updateSlider() {
        const translateX = -this.currentIndex * this.cardWidth;
        this.track.style.transform = `translateX(${translateX}px)`;

        // Mettre à jour les dots
        document.querySelectorAll('.slider-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // Désactiver les boutons si nécessaire
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.totalCards - 1;
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change toutes les 5 secondes
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Animation au scroll pour les cartes
function initScrollAnimations() {
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

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    new TestimonialsSlider();
    initScrollAnimations();
});

// Gestion responsive
function handleResize() {
    const slider = document.querySelector('.testimonials-slider');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (window.innerWidth <= 768) {
        cards.forEach(card => {
            card.style.flex = '0 0 100%';
        });
    } else if (window.innerWidth <= 1024) {
        cards.forEach(card => {
            card.style.flex = '0 0 calc(50% - 1rem)';
        });
    } else {
        cards.forEach(card => {
            card.style.flex = '0 0 calc(33.333% - 1.33rem)';
        });
    }
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);