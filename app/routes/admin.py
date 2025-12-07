from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for, flash
from functools import wraps
import json
import os
from datetime import datetime

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

# ==== DÉCORATEUR ADMIN ====
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('is_admin'):
            flash('Accès administrateur requis', 'error')
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    return decorated_function

# ==== ROUTES D'AUTHENTIFICATION ====
@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if session.get('is_admin'):
        return redirect(url_for('admin.dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Verification des identifiants
        if username == 'admin' and password == 'lumagrind2025':
            session['is_admin'] = True
            session['admin_user'] = username
            session['login_time'] = datetime.now().strftime('%d/%m/%Y %H:%M')
            flash('Connexion réussie !', 'success')
            return redirect(url_for('admin.dashboard'))
        else:
            flash('Identifiants incorrects', 'error')

    return render_template('admin/login.html')

@admin_bp.route('/logout')
def logout():
    session.clear()
    flash('Déconnexion réussie', 'success')
    return redirect(url_for('admin.login'))

# ==== DASHBOARD ====
@admin_bp.route('/')
@admin_bp.route('/dashboard')
@admin_required
def dashboard():
    stats = get_site_stats()
    recent_activity = get_recent_activity()
    return render_template('admin/dashboard.html', stats=stats, activity=recent_activity)

# ==== GESTION DES ARTICLES ====
@admin_bp.route('/articles')
@admin_required
def articles():
    articles_list = get_articles()
    return render_template('admin/articles.html', articles=articles_list)

@admin_bp.route('/articles/new', methods=['GET', 'POST'])
@admin_required
def new_article():
    if request.method == 'POST':
        article_data = {
            'id': generate_id(),
            'title': request.form.get('title'),
            'slug': request.form.get('slug'),
            'content': request.form.get('content'),
            'excerpt': request.form.get('excerpt', ''),
            'category': request.form.get('category', 'motivation'),
            'tags': request.form.get('tags', '').split(','),
            'status': request.form.get('status', 'draft'),
            'author': session.get('admin_user', 'Admin'),
            'created_at': datetime.now().strftime('%d/%m/%Y %H:%M'),
            'updated_at': datetime.now().strftime('%d/%m/%Y %H:%M'),
            'views': 0,
            'likes': 0
        }
        
        if save_article(article_data):
            flash('Article créé avec succès!', 'success')
            return redirect(url_for('admin.articles'))
        else:
            flash('Erreur lors de la création', 'error')
    
    return render_template('admin/article_edit.html', article=None)

@admin_bp.route('/articles/<article_id>/edit', methods=['GET', 'POST'])
@admin_required
def edit_article(article_id):
    articles_list = get_articles()
    article = next((a for a in articles_list if a['id'] == article_id), None)
    
    if not article:
        flash('Article non trouvé', 'error')
        return redirect(url_for('admin.articles'))
    
    if request.method == 'POST':
        article.update({
            'title': request.form.get('title'),
            'slug': request.form.get('slug'),
            'content': request.form.get('content'),
            'excerpt': request.form.get('excerpt', ''),
            'category': request.form.get('category'),
            'tags': request.form.get('tags', '').split(','),
            'status': request.form.get('status'),
            'updated_at': datetime.now().strftime('%d/%m/%Y %H:%M')
        })

        if update_article(article):
            flash('Article modifié avec succès!', 'success')
            return redirect(url_for('admin.articles'))
        else:
            flash('Erreur lors de la modification', 'error')

    return render_template('admin/article_edit.html', article=article)

@admin_bp.route('/articles/<article_id>/delete', methods=['POST'])
@admin_required
def delete_article(article_id):
    if delete_article_by_id(article_id):
        flash('Article supprimé avec succès!', 'success')
    else:
        flash('Erreur lors de la suppression', 'error')
    return redirect(url_for('admin.articles'))

# ==== GESTION DES ÉVÉNEMENTS ====
@admin_bp.route('/evenements')
@admin_required
def evenements():
    events = get_events()
    return render_template('admin/evenements.html', events=events)

@admin_bp.route('/evenements/new', methods=['GET', 'POST'])
@admin_required
def new_event():
    if request.method == 'POST':
        event_data = {
            'id': generate_id(),
            'title': request.form.get('title'),
            'description': request.form.get('description'),
            'type': request.form.get('type'),
            'date': request.form.get('date'),
            'time': request.form.get('time', '20:00'),
            'status': request.form.get('status', 'planned'),
            'created_at': datetime.now().strftime('%d/%m/%Y %H:%M'),
            'participants': 0
        }

        if save_event(event_data):
            flash('Événement créé avec succès!', 'success')
            return redirect(url_for('admin.evenements'))
        else:
            flash('Erreur lors de la création', 'error')

    return render_template('admin/event_edit.html', event=None)

@admin_bp.route('/evenements/<event_id>/edit', methods=['GET', 'POST'])
@admin_required
def edit_event(event_id):
    events = get_events()
    event = next((e for e in events if e['id'] == event_id), None)

    if not event:
        flash('Événement non trouvé', 'error')
        return redirect(url_for('admin.evenements'))
    
    if request.method == 'POST':
        event.update({
            'title': request.form.get('title'),
            'description': request.form.get('description'),
            'type': request.form.get('type'),
            'date': request.form.get('date'),
            'time': request.form.get('time'),
            'status': request.form.get('status')
        })
        
        if update_event(event):
            flash('Événement modifié avec succès!', 'success')
            return redirect(url_for('admin.evenements'))
        else:
            flash('Erreur lors de la modification', 'error')

    return render_template('admin/event_edit.html', event=event)

# ==== GESTION DES TEMOIGNAGES ====
@admin_bp.route('/temoignages')
@admin_required
def temoignages():
    testimonials = get_testimonials()
    return render_template('admin/temoignages.html', testimonials=testimonials)

@admin_bp.route('/temoignages/new', methods=['GET', 'POST'])
@admin_required
def new_testimonial():
    if request.method == 'POST':
        testimonial_data = {
            'id': generate_id(),
            'name': request.form.get('name'),
            'role': request.form.get('role'),
            'content': request.form.get('content'),
            'rating': int(request.form.get('rating', 5)),
            'status': request.form.get('status', 'approved'),
            'created_at': datetime.now().strftime('%d/%m/%Y %H:%M')
        }

        if save_testimonial(testimonial_data):
            flash('Témoignage ajouté avec succès!', 'success')
            return redirect(url_for('admin.temoignages'))
        else:
            flash('Erreur lors de l\'ajout', 'error')

    return render_template('admin/testimonial_edit.html', testimonial=None)

# ==== GESTION DES UTILISATEURS ====
@admin_bp.route('/utilisateurs')
@admin_required
def utilisateurs():
    users = get_users()
    return render_template('admin/utilisateurs.html', users=users)

# ==== GESTION DES MESSAGES ====
@admin_bp.route('/messages')
@admin_required
def messages():
    messages_list = get_contact_messages()
    return render_template('admin/messages.html', messages=messages_list)

# ==== PARAMÈTRES DU SITE ====
@admin_bp.route('/parametres', methods=['GET', 'POST'])
@admin_required
def parametres():
    if request.method == 'POST':
        settings_data = {
            'site_title': request.form.get('site_title'),
            'site_description': request.form.get('site_description'),
            'admin_email': request.form.get('admin_email'),
            'contact_email': request.form.get('contact_email'),
            'social_facebook': request.form.get('social_facebook'),
            'social_instagram': request.form.get('social_instagram'),
            'social_twitter': request.form.get('social_twitter'),
            'social_linkedin': request.form.get('social_linkedin'),
            'newsletter_active': request.form.get('newsletter_active') == 'on',
            'comments_active': request.form.get('comments_active') == 'on',
            'maintenance_mode': request.form.get('maintenance_mode') == 'on',
            'updated_at': datetime.now().strftime('%d/%m/%Y %H:%M')
        }

        if save_settings(settings_data):
            flash('Paramètres sauvegardés avec succès!', 'success')
        else:
            flash('Erreur lors de la sauvegarde', 'error')

    current_settings = get_settings()
    return render_template('admin/parametres.html', settings=current_settings)

# ==== BACKUP & EXPORT ====
@admin_bp.route('/backup')
@admin_required
def backup():
    return render_template('admin/backup.html')

@admin_bp.route('/export/csv')
@admin_required
def export_csv():
    data_type = request.args.get('type', 'messages')
    flash(f'Export {data_type} généré avec succès!', 'success')
    return redirect(url_for('admin.backup'))

# ==== FONCTIONS UTILITAIRES ====
def get_site_stats():
    return {
        'total_articles': len(get_articles()),
        'published_articles': len([a for a in get_articles() if a.get('status') == 'published']),
        'total_events': len(get_events()),
        'upcoming_events': len([e for e in get_events() if e.get('status') == 'planned']),
        'total_testimonials': len(get_testimonials()),
        'unread_messages': len([m for m in get_contact_messages() if m.get('status') == 'new']),
        'total_users': len(get_users())
    }

def get_recent_activity():
    activities = []
    articles = sorted(get_articles(), key=lambda x: x.get('created_at', ''), reverse=True)[:3]
    for article in articles:
        activities.append({
            'type': 'article',
            'action': 'Créé' if article.get('status') == 'draft' else 'Publié',
            'title': article.get('title'),
            'time': article.get('created_at'),
            'author': article.get('author')
        })
    
    messages = sorted(get_contact_messages(), key=lambda x: x.get('timestamp', ''), reverse=True)[:3]
    for message in messages:
        activities.append({
            'type': 'message',
            'action': 'Reçu',
            'title': f"Message de {message.get('name')}",
            'time': message.get('timestamp'),
            'author': message.get('name')
        })

    return sorted(activities, key=lambda x: x.get('time', ''), reverse=True)[:5]

# Fonctions de gestion des données
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

def delete_article_by_id(article_id):
    try:
        articles = get_articles()
        articles = [a for a in articles if a['id'] != article_id]
        with open('data/articles.json', 'w', encoding='utf-8') as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)
        return True
    except:
        return False

def get_events():
    try:
        with open('data/events.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def save_event(event):
    try:
        events = get_events()
        events.append(event)
        with open('data/events.json', 'w', encoding='utf-8') as f:
            json.dump(events, f, ensure_ascii=False, indent=2)
        return True
    except:
        return False

def update_event(updated_event):
    try:
        events = get_events()
        for i, event in enumerate(events):
            if event['id'] == updated_event['id']:
                events[i] = updated_event
                break
        with open('data/events.json', 'w', encoding='utf-8') as f:
            json.dump(events, f, ensure_ascii=False, indent=2)
        return True
    except:
        return False

def get_testimonials():
    try:
        with open('data/testimonials.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def save_testimonial(testimonial):
    try:
        testimonials = get_testimonials()
        testimonials.append(testimonial)
        with open('data/testimonials.json', 'w', encoding='utf-8') as f:
            json.dump(testimonials, f, ensure_ascii=False, indent=2)
        return True
    except:
        return False

def get_users():
    try:
        with open('data/users.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def get_contact_messages():
    try:
        with open('data/contact_messages.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def get_settings():
    try:
        with open('data/settings.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return {
            'site_title': 'LuMaGrind',
            'site_description': 'Plateforme de développement personnel et professionnel',
            'admin_email': 'admin@lumagrind.com',
            'contact_email': 'contact@lumagrind.com',
            'newsletter_active': True,
            'comments_active': True,
            'maintenance_mode': False
        }

def save_settings(settings):
    try:
        with open('data/settings.json', 'w', encoding='utf-8') as f:
            json.dump(settings, f, ensure_ascii=False, indent=2)
        return True
    except:
        return False

def generate_id():
    return str(int(datetime.now().timestamp()))