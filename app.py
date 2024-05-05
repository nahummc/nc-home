# app.py

from flask import Flask, render_template
from models import db
from routes.user_routes import user_bp
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

app.register_blueprint(user_bp)

@app.route('/')
def index():
    print("Hello World")
    return render_template('index.html')

@app.route('/sudoku')
def sudoku():
    return render_template('sudoku.html')  

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
