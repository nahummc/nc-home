from flask import Blueprint, render_template
from app.models.user import User
from app import db
from flask import request, jsonify
from werkzeug.security import generate_password_hash


auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login')
def login():
    return render_template('login.html')

from flask import render_template, redirect, url_for

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json  # Assuming you're sending JSON data

    # Check if email already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'Email already exists'}), 400

    # Hash the password
    hashed_password = generate_password_hash(data['password'])

    # Create a new user object
    new_user = User(
        fname=data['fname'],
        lname=data['lname'],
        email=data['email'],
        password=hashed_password
    )

    # Add the user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

