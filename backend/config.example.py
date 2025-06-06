import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'your-mongodb-uri')
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    WEBHOOK_SECRET = os.getenv('WEBHOOK_SECRET', 'your-webhook-secret')
