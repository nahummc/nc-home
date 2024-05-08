from flask import Blueprint, render_template
from app.models.user import User
from app import db
from flask import request, jsonify
from werkzeug.security import generate_password_hash


auth_bp = Blueprint('auth', __name__, url_prefix='/auth', template_folder='../../templates')

@auth_bp.route('/login')
def login():
    return render_template('login.html')

@auth_bp.route('/register', methods=['POST'])
def register():
    if request.is_json:
        # If the request is JSON, directly access the parsed JSON data
        request_data = request.json
    else:
        # If the request is not JSON, Flask automatically parses form data
        request_data = request.form.to_dict()

    # Check if required fields are present
    required_fields = ['fname', 'lname', 'email', 'password']
    for field in required_fields:
        if field not in request_data:
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    # Check if email already exists
    existing_user = User.query.filter_by(email=request_data['email']).first()
    if existing_user:
        return jsonify({'message': 'Email already exists'}), 400

    # Hash the password
    hashed_password = generate_password_hash(request_data['password'])

    # Create a new user object
    new_user = User(
        fname=request_data['fname'],
        lname=request_data['lname'],
        email=request_data['email'],
        password=hashed_password
    )

    # Add the user to the database
    db.session.add(new_user)
    db.session.commit()
    
    return render_template('login.html')
    

    # return render_template('login.html')
    # return jsonify({'message': 'User registered successfully'}), 201
