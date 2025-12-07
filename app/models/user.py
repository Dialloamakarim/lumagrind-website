import json
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
import os 
from datetime import datetime
import uuid
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    username = db.Column(db.String(80), unique=True, nullable=False)
    full_name = db.Column(db.String(120))
    avatar = db.Column(db.String(20), default='💪')
    
    # Profil
    bio = db.Column(db.Text)
    website = db.Column(db.String(200))
    location = db.Column(db.String(100))
    
    # Statistiques
    posts_count = db.Column(db.Integer, default=0)
    likes_count = db.Column(db.Integer, default=0)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Badges
    badges = db.Column(db.JSON, default=list)
    
    # Admin
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)

class Post(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Engagement
    likes_count = db.Column(db.Integer, default=0)
    comments_count = db.Column(db.Integer, default=0)
    
    # Relations
    user = db.relationship('User', backref=db.backref('posts', lazy=True))
    comments = db.relationship('Comment', backref='post', lazy=True)

class Comment(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.String(36), db.ForeignKey('post.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('comments', lazy=True))
# Au lieu de 'data/users.json', utilisez un chemin absolu
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')

class UserManager:
    def __init__(self):
        self.users_file = os.path.join(DATA_DIR, 'users.json')

        # self.users_file = 'data/users.json'
        self.ensure_data_file()
    
    def ensure_data_file(self):
        """Créer le fichier users.json s'il n'existe pas"""
        os.makedirs('data', exist_ok=True)
        if not os.path.exists(self.users_file):
            with open(self.users_file, 'w', encoding='utf-8') as f:
                json.dump([], f, ensure_ascii=False, indent=2)
    
    def create_user(self, email, password, name, plan='free'):
        """Créer un nouvel utilisateur"""
        users = self.get_all_users()
        
        # Vérifier si l'email existe déjà
        if any(user['email'] == email for user in users):
            return None, "Cet email est déjà utilisé"
        
        user_data = {
            'id': self.generate_user_id(),
            'email': email,
            'password_hash': generate_password_hash(password),
            'name': name,
            'plan': plan,
            'level': 1,
            'xp': 0,
            'badges': ['👋 Nouveau Grinder'],
            'joined_date': datetime.now().strftime('%d/%m/%Y %H:%M'),
            'last_login': datetime.now().strftime('%d/%m/%Y %H:%M'),
            'is_active': True,
            'profile_complete': False
        }
        
        users.append(user_data)
        self.save_users(users)
        return user_data, "Compte créé avec succès !"
    
    def authenticate_user(self, email, password):
        """Authentifier un utilisateur"""
        users = self.get_all_users()
        user = next((u for u in users if u['email'] == email and u['is_active']), None)
        
        if user and check_password_hash(user['password_hash'], password):
            # Mettre à jour la dernière connexion
            user['last_login'] = datetime.now().strftime('%d/%m/%Y %H:%M')
            self.save_users(users)
            return user
        return None
    
    def get_user_by_id(self, user_id):
        """Récupérer un utilisateur par son ID"""
        users = self.get_all_users()
        return next((u for u in users if u['id'] == user_id), None)
    
    def update_user_xp(self, user_id, xp_earned):
        """Ajouter de l'XP à un utilisateur"""
        users = self.get_all_users()
        user = next((u for u in users if u['id'] == user_id), None)
        
        if user:
            user['xp'] += xp_earned
            # Vérifier le niveau up
            new_level = self.calculate_level(user['xp'])
            if new_level > user['level']:
                user['level'] = new_level
                user['badges'].append(f'🎯 Niveau {new_level}')
            
            self.save_users(users)
            return True
        return False
    
    def calculate_level(self, xp):
        """Calculer le niveau basé sur l'XP"""
        return max(1, (xp // 100) + 1)
    
    def generate_user_id(self):
        """Générer un ID utilisateur unique"""
        return str(int(datetime.now().timestamp()))
    
    def get_all_users(self):
        """Récupérer tous les utilisateurs"""
        try:
            with open(self.users_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    
    def save_users(self, users):
        """Sauvegarder les utilisateurs"""
        with open(self.users_file, 'w', encoding='utf-8') as f:
            json.dump(users, f, ensure_ascii=False, indent=2)