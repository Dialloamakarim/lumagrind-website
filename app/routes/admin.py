from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for, flash
from functools import wraps
import json
import os
from datetime import datetime

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

# Décorateur pour vérifier l'authentification admin
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('is_admin'):
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    return decorated_function

# Page de connexion admin
@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        if username == 'admin' and password == 'lumagrind2024':
            session['is_admin'] = True
            session['admin_user'] = username
            return redirect(url_for('admin.dashboard'))
        else:
            return render_template('admin/login.html', error='Identifiants incorrects')

    return render_template('admin/login.html')

# Dashboard principal
@admin_bp.route('/')
@admin_bp.route('/dashboard')
@admin_required
def dashboard():
    return render_template('admin/dashboard.html')

# Gestion des articles
@admin_bp.route('/posts')
@admin_required
def posts():
    articles = get_articles()
    return render_template('admin/posts.html', articles=articles)

# Gestion des catégories
@admin_bp.route('/categories')
@admin_required
def categories():
    categories_data = get_categories()
    return render_template('admin/categories.html', categories=categories_data)

# Gestion des médias
@admin_bp.route('/media')
@admin_required
def media():
    return render_template('admin/media.html')

# Gestion des messages de contact
@admin_bp.route('/messages')
@admin_required
def messages():
    messages = get_contact_messages()
    return render_template('admin/messages.html', messages=messages)

# Route pour voir un message spécifique (UNE SEULE DÉFINITION)
@admin_bp.route('/messages/<int:message_id>')
@admin_required
def view_message(message_id):
    messages = get_contact_messages()
    message = next((m for m in messages if m['id'] == message_id), None)
    
    if not message:
        flash('Message non trouvé', 'error')
        return redirect(url_for('admin.messages'))
    
    # Marquer comme lu
    message['status'] = 'read'
    update_contact_messages(messages)
    
    return render_template('admin/message_view.html', message=message)

@admin_bp.route('/messages/<message_id>/delete', methods=['POST'])
@admin_required
def delete_message(message_id):
    messages = get_contact_messages()
    messages = [m for m in messages if m['id'] != int(message_id)]
    
    if update_contact_messages(messages):
        flash('Message supprimé avec succès!', 'success')
    else:
        flash('Erreur lors de la suppression', 'error')
    
    return redirect(url_for('admin.messages'))

# Gestion des témoignages
@admin_bp.route('/testimonials')
@admin_required
def admin_testimonials():
    testimonials_data = get_testimonials_data()
    return render_template('admin/testimonials.html', testimonials=testimonials_data)

@admin_bp.route('/testimonials/new', methods=['GET', 'POST'])
@admin_required
def new_testimonial():
    if request.method == 'POST':
        # Logique pour créer un nouveau témoignage
        flash('Témoignage ajouté avec succès!', 'success')
        return redirect(url_for('admin.admin_testimonials'))
    
    return render_template('admin/testimonial_edit.html')

# Gestion des utilisateurs
@admin_bp.route('/users')
@admin_required
def users():
    users_data = get_users()
    return render_template('admin/users.html', users=users_data)

# Analytics
@admin_bp.route('/analytics')
@admin_required
def analytics():
    return render_template('admin/analytics.html')

# Gestion du thème/apparence
@admin_bp.route('/theme')
@admin_required
def theme():
    return render_template('admin/theme.html')

# Paramètres
@admin_bp.route('/settings', methods=['GET', 'POST'])
@admin_required
def settings():
    if request.method == 'POST':
        settings_data = {
            'site_title': request.form.get('site_title'),
            'admin_email': request.form.get('admin_email'),
            'notifications': request.form.get('notifications') == 'on'
        }
        
        if save_settings(settings_data):
            flash('Paramètres sauvegardés avec succès!', 'success')
    
    current_settings = get_settings()
    return render_template('admin/settings.html', settings=current_settings)

# Déconnexion
@admin_bp.route('/logout')
def logout():
    session.clear()
    flash('Déconnexion réussie', 'success')
    return redirect(url_for('admin.login'))

# Fonctions utilitaires
def get_articles():
    try:
        with open('data/articles.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def save_article(article):
    try:
        articles = get_articles()
        articles.append(article)
        
        with open('data/articles.json', 'w', encoding='utf-8') as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)
        return True
    except:
        return False

def update_article(updated_article):
    try:
        articles = get_articles()
        for i, article in enumerate(articles):
            if article['id'] == updated_article['id']:
                articles[i] = updated_article
                break
        
        with open('data/articles.json', 'w', encoding='utf-8') as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)
        return True
    except:
        return False

def delete_article(article_id):
    try:
        articles = get_articles()
        articles = [a for a in articles if a['id'] != article_id]
        
        with open('data/articles.json', 'w', encoding='utf-8') as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)
        return True
    except:
        return False

def get_categories():
    return [
        {'id': 1, 'name': 'Motivation', 'slug': 'motivation', 'count': 45},
        {'id': 2, 'name': 'Business', 'slug': 'business', 'count': 32},
        {'id': 3, 'name': 'Mindset', 'slug': 'mindset', 'count': 28},
        {'id': 4, 'name': 'Daily Grind', 'slug': 'grind', 'count': 39}
    ]

def get_contact_messages():
    try:
        with open('data/contact_messages.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def update_contact_messages(messages):
    try:
        with open('data/contact_messages.json', 'w', encoding='utf-8') as f:
            json.dump(messages, f, ensure_ascii=False, indent=2)
        return True
    except:
        return False

def get_testimonials_data():
    return [
        {
            'id': 1, 'name': 'Kevin Martin', 'role': 'Entrepreneur E-commerce',
            'content': 'Grâce à LuMaGrind, j\'ai multiplié mon chiffre d\'affaires par 5 en 6 mois.',
            'avatar': 'KM', 'stats': {'value1': '+425%', 'label1': 'CA', 'value2': '6 mois', 'label2': 'Résultats'}
        },
        {
            'id': 2, 'name': 'Sarah Dubois', 'role': 'Manager Tech',
            'content': 'La discipline mentale apprise avec LuMaGrind m\'a permis de surmonter mes blocages.',
            'avatar': 'SD', 'stats': {'value1': '15', 'label1': 'Équipe', 'value2': '2x', 'label2': 'Productivité'}
        },
        {
            'id': 3, 'name': 'Marc Lambert', 'role': 'Freelance Digital',
            'content': 'Les routines daily grind ont révolutionné mon organisation. Je produis maintenant en 4h ce qui me prenait toute une journée.',
            'avatar': 'ML', 'stats': {'value1': '75%', 'label1': 'Temps gagné', 'value2': '3x', 'label2': 'Clients'}
        }
    ]

def get_users():
    return [
        {'id': 1, 'name': 'Jean Dupont', 'email': 'jean@example.com', 'status': 'active', 'joined': '15/01/2024'},
        {'id': 2, 'name': 'Marie Martin', 'email': 'marie@entreprise.com', 'status': 'active', 'joined': '10/01/2024'},
        {'id': 3, 'name': 'Pierre Lambert', 'email': 'pierre@startup.fr', 'status': 'inactive', 'joined': '05/01/2024'}
    ]

def get_settings():
    try:
        with open('data/settings.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return {'site_title': 'LuMaGrind', 'admin_email': 'admin@lumagrind.com', 'notifications': True}

def save_settings(settings):
    try:
        with open('data/settings.json', 'w', encoding='utf-8') as f:
            json.dump(settings, f, ensure_ascii=False, indent=2)
        return True
    except:
        return False

def generate_id():
    return str(int(datetime.now().timestamp()))