// Gestionnaire du menu mobile
class MobileMenu {
    constructor() {
        this.navToggle = document.getElementById('navToggle');
        this.navMobile = document.getElementById('navMobile');
        this.mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
        this.themeToggle = document.getElementById('themeToggle');
        
        this.init();
    }

    init() {
        // Burger menu toggle
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        
        // Dropdowns mobiles
        this.mobileDropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('.mobile-dropdown-btn');
            button.addEventListener('click', () => this.toggleDropdown(dropdown));
        });
        
        // Fermer le menu en cliquant sur un lien
        this.navMobile.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.closeMenu();
            }
        });
        
        // Fermer le menu en appuyant sur Echap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.navToggle.classList.toggle('active');
        this.navMobile.classList.toggle('active');
        
        // Bloquer le scroll du body quand le menu est ouvert
        document.body.style.overflow = this.navMobile.classList.contains('active') ? 'hidden' : '';
    }

    toggleDropdown(dropdown) {
        dropdown.classList.toggle('active');
        
        // Fermer les autres dropdowns
        this.mobileDropdowns.forEach(otherDropdown => {
            if (otherDropdown !== dropdown) {
                otherDropdown.classList.remove('active');
            }
        });
    }

    closeMenu() {
        this.navToggle.classList.remove('active');
        this.navMobile.classList.remove('active');
        document.body.style.overflow = '';
        
        // Fermer tous les dropdowns
        this.mobileDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    new MobileMenu();
    
    // Fermer le menu au redimensionnement (au cas où)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 968) {
            const mobileMenu = document.getElementById('navMobile');
            const navToggle = document.getElementById('navToggle');
            if (mobileMenu && navToggle) {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});