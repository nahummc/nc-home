# config.py

class Config:
    DEBUG = True
    SECRET_KEY = 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///nc_games_1.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Add more configuration options here as needed
