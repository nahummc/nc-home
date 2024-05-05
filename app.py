from flask import Flask
from flask_migrate import Migrate  # Import Flask-Migrate
from models import db
from routes.base_routes import base_bp
from routes.user_routes import user_bp
from config import Config
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

migrate = Migrate(app, db)  # Initialize Flask-Migrate

jwt = JWTManager(app)

app.register_blueprint(base_bp, url_prefix='/')
app.register_blueprint(user_bp, url_prefix='/user')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
