from app import create_app, db, migrate
from flask_migrate import Migrate

# Create Flask app
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
