# __init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize SQLAlchemy with the app
    db.init_app(app)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.main import main_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)

    return app
