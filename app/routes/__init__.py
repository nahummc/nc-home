from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
main_bp = Blueprint('main', __name__)

from . import auth, main  # Import routes from individual modules
