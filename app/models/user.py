# app/models/user.py

from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"User('{self.fname}', '{self.lname}', '{self.email}')"
