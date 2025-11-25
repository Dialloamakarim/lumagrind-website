import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Base
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'lumagrind-super-secret-2024'
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///lumagrind.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Email
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'lumagrind-admin-super-secret-2024'
    # Autres configurations...