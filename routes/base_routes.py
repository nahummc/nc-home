# routes.py

from flask import Blueprint, render_template


base_bp = Blueprint('auth', __name__)

@base_bp.route('/')
def index():
    return render_template('index.html')

@base_bp.route('/sudoku')
def sudoku():
    return render_template('sudoku.html')

@base_bp.route('/login')
def login():
    return render_template('login.html')

@base_bp.route('/register')
def register():
    return render_template('register.html')


