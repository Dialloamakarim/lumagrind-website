from flask import Blueprint, render_template, request, jsonify
import os
import json
from datetime import datetime
from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from functools import wraps

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
    return render_template('index.html')

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

@main_bp.route('/blog')
def blog_page():
    return render_template('blog.html')

@main_bp.route('/services')
def services_page():
    return render_template('services.html')

@main_bp.route('/success')
def success_page():
    return render_template('success.html')

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

@main_bp.route('/testimonials')
def testimonials_page():
    return render_template('testimonials.html')

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