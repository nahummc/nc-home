from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__, template_folder='../../templates')
user_bp = Blueprint('user', __name__, template_folder='../../templates')

@main_bp.route('/')
def index():
    print("Hello")
    return render_template('index.html')

@main_bp.route('/sudoku')
def sudoku():
    return render_template('sudoku.html')

@user_bp.route('/register', methods=['GET'])
def register():
    return render_template('register.html')

@user_bp.route('/login')
def login():
    return render_template('login.html')


