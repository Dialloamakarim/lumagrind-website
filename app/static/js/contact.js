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
        this.charCount.textContent = `${length}/500 caractères`;
        
        if (length > 450) {
          this.charCount.classList.add('warning');
        } else {
          this.charCount.classList.remove('warning');
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
      input.addEventListener('input', () => this.clearError(input));
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

    if (field.name === 'message') {
      if (field.value.length < 10) {
        this.showError(field, errorElement, 'Le message doit contenir au moins 10 caractères');
        return false;
      }
      if (field.value.length > 500) {
        this.showError(field, errorElement, 'Le message ne doit pas dépasser 500 caractères');
        return false;
      }
    }

    this.clearError(field);
    return true;
  }

  showError(field, errorElement, message) {
    field.style.borderColor = '#ff6b6b';
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }

  clearError(field) {
    field.style.borderColor = '';
    const errorElement = document.getElementById(field.name + 'Error');
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
      this.showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }

    // Préparer les données
    const formData = new FormData(this.form);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
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
        this.charCount.textContent = '0/500 caractères';
        this.charCount.classList.remove('warning');
      } else {
        throw new Error(result.message);
      }

    } catch (error) {
      console.error('Erreur:', error);
      this.showNotification(error.message || 'Erreur lors de l\'envoi du message', 'error');
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
      successModal.style.display = 'flex';
    }

    // Tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'contact_form_submit', {
        'event_category': 'engagement',
        'event_label': 'contact_form'
      });
    }
  }

  showNotification(message, type = 'success') {
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
      background: ${type === 'success' ? 'var(--gradient-fire)' : '#ff6b6b'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 15px;
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      max-width: 400px;
      box-shadow: var(--glow-primary);
      font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }
}

// Fonctions globales
function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Animation pour les notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(style);

// Fermer la modal en cliquant à l'extérieur
document.addEventListener('click', (e) => {
  const modal = document.getElementById('successModal');
  if (e.target === modal) {
    closeModal();
  }
});

// Fermer la modal avec la touche Échap
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Initialiser le gestionnaire de contact
document.addEventListener('DOMContentLoaded', () => {
  new ContactManager();
});