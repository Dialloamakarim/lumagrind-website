from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__)

# Routes simples sans conflit
@main_bp.route('/')
def home():
    return render_template('index.html')

@main_bp.route('/about')
def about():
    return render_template('about.html')

@main_bp.route('/community')
def community():
    return render_template('community.html')

@main_bp.route('/content')
def content():
    return render_template('content.html')

@main_bp.route('/contact')
def contact():
    return render_template('contact.html')

@main_bp.route('/blog')
def blog():
    return render_template('blog.html')

@main_bp.route('/services')
def services():
    return render_template('services.html')

@main_bp.route('/success')
def success():
    return render_template('success.html')