from flask import Flask
from flask_login import LoginManager
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Extensions
    from app.models import db
    db.init_app(app)
    
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    
    @login_manager.user_loader
    def load_user(user_id):
        from app.models import User
        return User.query.get(user_id)
    
    # Blueprints
    from app.routes.main import main_bp
    from app.routes.auth import auth_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app