from flask import Blueprint, render_template, request, jsonify
import os
import json
from datetime import datetime
from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for, flash 
from functools import wraps
from app.models.user import UserManager
from flask import session
import uuid

main_bp = Blueprint('main', __name__)

class ContactManager:
    @staticmethod
    def save_contact_message(data):
        """Sauvegarder le message dans un fichier JSON"""
        try:
            os.makedirs('data', exist_ok=True)
            file_path = 'data/contact_messages.json'
            
            messages = []
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    try:
                        messages = json.load(f)
                    except json.JSONDecodeError:
                        messages = []
            
            message_data = {
                'id': len(messages) + 1,
                'name': data['name'],
                'email': data['email'],
                'type': data.get('type', 'general'),
                'subject': data['subject'],
                'message': data['message'],
                'timestamp': datetime.now().strftime('%d/%m/%Y %H:%M'),
                'ip': request.remote_addr,
                'status': 'new'
            }
            
            messages.append(message_data)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(messages, f, ensure_ascii=False, indent=2)
                
            return True
            
        except Exception as e:
            print(f"Erreur sauvegarde message: {e}")
            return False

    @staticmethod
    def get_contact_messages():
        """Récupérer tous les messages de contact"""
        try:
            file_path = 'data/contact_messages.json'
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return []
        except Exception as e:
            print(f"Erreur lecture messages: {e}")
            return []

# ===== ROUTES PRINCIPALES =====

@main_bp.route('/')
def home():
    """Page d'accueil avec contenu dynamique"""
    recent_articles = get_recent_articles()
    upcoming_events = get_upcoming_events()
    testimonials = get_testimonials_from_admin()
    
    return render_template('index.html', 
                         recent_articles=recent_articles,
                         upcoming_events=upcoming_events,
                         testimonials=testimonials)

@main_bp.route('/about')
def about_page():
    return render_template('about.html')

@main_bp.route('/community')
def community_page():
    return render_template('community.html')

@main_bp.route('/content')
def content_page():
    return render_template('content.html')

@main_bp.route('/contact')
def contact_page():
    return render_template('contact.html')

@main_bp.route('/services')
def services_page():
    return render_template('services.html')

@main_bp.route('/success')
def success_page():
    return render_template('success.html')

# ===== ROUTES DYNAMIQUES =====

@main_bp.route('/blog')
def blog():
    """Page blog avec tous les articles"""
    articles = get_articles_from_admin()
    return render_template('blog.html', articles=articles)

@main_bp.route('/blog/<slug>')
def blog_post(slug):
    """Page article individuel"""
    article = get_article_by_slug(slug)
    if not article:
        return render_template('404.html'), 404
    return render_template('blog_post.html', article=article)

@main_bp.route('/evenements')
def evenements():
    """Page événements"""
    events = get_events_from_admin()
    return render_template('evenements.html', events=events)

@main_bp.route('/temoignages')
def temoignages():
    """Page témoignages"""
    testimonials = get_testimonials_from_admin()
    return render_template('temoignages.html', testimonials=testimonials)

@main_bp.route('/testimonials')
def testimonials_page():
    return render_template('testimonials.html')

# ===== ROUTES API =====

@main_bp.route('/api/contact', methods=['POST'])
def api_contact():
    try:
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()

        print("Données reçues:", data)
        
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'Le champ {field} est requis.'
                }), 400

        if '@' not in data['email'] or '.' not in data['email']:
            return jsonify({
                'success': False,
                'message': 'Veuillez entrer une adresse email valide.'
            }), 400

        if ContactManager.save_contact_message(data):
            return jsonify({
                'success': True,
                'message': '🎉 Message envoyé avec succès ! Nous te recontacterons dans les 24h. 🔥'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Erreur lors de la sauvegarde du message.'
            }), 500

    except Exception as e:
        print(f"Erreur globale: {e}")
        return jsonify({
            'success': False,
            'message': f'Erreur serveur: {str(e)}'
        }), 500

# ===== ROUTES LÉGALES =====

@main_bp.route('/legal/mentions-legales')
def legal_mentions():
    return render_template('legal/mentions_legales.html')

@main_bp.route('/legal/politique-confidentialite')
def legal_privacy():
    return render_template('legal/politique_confidentialite.html')

@main_bp.route('/legal/conditions-utilisation')
def legal_terms():
    return render_template('legal/conditions_utilisation.html')

@main_bp.route('/legal/cookies')
def legal_cookies():
    return render_template('legal/politique_cookies.html')

# ==== FONCTIONS D'ACCÈS AUX DONNÉES ====

def get_articles_from_admin():
    """Récupère les articles publiés depuis l'admin"""
    try:
        with open('data/articles.json', 'r', encoding='utf-8') as f:
            articles = json.load(f)
        # Filtrer seulement les articles publiés
        return [article for article in articles if article.get('status') == 'published']
    except:
        return []

def get_article_by_slug(slug):
    """Trouve un article par son slug"""
    articles = get_articles_from_admin()
    return next((article for article in articles if article.get('slug') == slug), None)

def get_events_from_admin():
    """Récupère les événements depuis l'admin"""
    try:
        with open('data/events.json', 'r', encoding='utf-8') as f:
            events = json.load(f)
        return events
    except:
        return []

def get_testimonials_from_admin():
    """Récupère les témoignages approuvés depuis l'admin"""
    try:
        with open('data/testimonials.json', 'r', encoding='utf-8') as f:
            testimonials = json.load(f)
        # Filtrer seulement les témoignages approuvés
        return [testimonial for testimonial in testimonials if testimonial.get('status') == 'approved']
    except:
        return []

def get_recent_articles():
    """Récupère les 3 derniers articles publiés"""
    articles = get_articles_from_admin()
    return sorted(articles, key=lambda x: x.get('created_at', ''), reverse=True)[:3]

def get_upcoming_events():
    """Récupère les événements à venir"""
    events = get_events_from_admin()
    # Filtrer les événements futurs (simplifié)
    return events[:2]  # Pour l'exemple

user_manager = UserManager()

# ==== ROUTES MEMBRES ====

@main_bp.route('/register', methods=['GET', 'POST'])
def register():
    """Page d'inscription"""
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        name = request.form.get('name')
        
        user, message = user_manager.create_user(email, password, name)
        if user:
            # Connexion automatique après inscription
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            session['user_level'] = user['level']
            flash('🎉 Bienvenue chez LuMaGrind ! Ton compte a été créé avec succès.', 'success')
            return redirect(url_for('main.member_dashboard'))
        else:
            flash(message, 'error')
    
    return render_template('auth/register.html')

@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Page de connexion"""
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        user = user_manager.authenticate_user(email, password)
        if user:
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            session['user_level'] = user['level']
            flash(f'🔥 Bon retour, {user["name"]} !', 'success')
            return redirect(url_for('main.member_dashboard'))
        else:
            flash('❌ Email ou mot de passe incorrect', 'error')
    
    return render_template('auth/login.html')

@main_bp.route('/logout')
def logout_member():
    """Déconnexion membre"""
    session.clear()
    flash('👋 À bientôt sur LuMaGrind !', 'success')
    return redirect(url_for('main.home'))

@main_bp.route('/member/dashboard')
def member_dashboard():
    """Tableau de bord membre"""
    if 'user_id' not in session:
        flash('🔒 Connecte-toi pour accéder à ton espace membre', 'error')
        return redirect(url_for('main.login'))
    
    user = user_manager.get_user_by_id(session['user_id'])
    if not user:
        session.clear()
        return redirect(url_for('main.login'))
    
    return render_template('members/dashboard.html', user=user)

# ==== MIDDLEWARE PROTECTION ====

def login_required(f):
    """Décorateur pour les pages réservées aux membres"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('🔒 Connecte-toi pour accéder à cette page', 'error')
            return redirect(url_for('main.login'))
        return f(*args, **kwargs)
    return decorated_function