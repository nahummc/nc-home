# user_routes.py

from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from werkzeug.security import check_password_hash
from models import db, User
from flask_jwt_extended import create_access_token
from datetime import timedelta
import time

user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already exists!')
            return redirect(url_for('user.register'))
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        flash('Account created successfully! Please log in.')
        print('User created successfully!', new_user.username, new_user.email, new_user.password_hash)
        return redirect(url_for('user.login'))
    return render_template('register.html')

@user_bp.route('/login', methods=['GET', 'POST'])
def login():
    print("Attempting to log in")
    print(request)
    # print(request.method)
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        print(username, password)
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            access_token = create_access_token(identity=user.user_id, expires_delta=timedelta(minutes=30))
            session['user_id'] = user.user_id  # Store user ID in session
            session['username'] = user.username  # Store username in session
            session['fuck'] = 'fuck'
            flash('Logged in successfully! from flash')
            # You can return the access token if needed
            session['access_token'] = access_token
            print('Logged in successfully!', user.username)
            print('Access token:', access_token)
            
            time.sleep(5)
            
            return redirect(url_for('auth.index'))
        else:
            print('Invalid username or password. Please try again.')
            flash('Invalid username or password. Please try again.')
    return render_template('login.html')