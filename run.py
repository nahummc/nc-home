# run.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object('config.Config')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Register blueprints
from app.routes.auth import auth_bp
from app.routes.main import main_bp

app.register_blueprint(auth_bp)
app.register_blueprint(main_bp)

if __name__ == '__main__':
    app.run(debug=True)
