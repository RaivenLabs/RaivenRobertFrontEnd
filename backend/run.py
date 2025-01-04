# in run.py
from flask import Flask
import os
from flask_cors import CORS
from main_routes import main_blueprint
from config import config_blueprint
from auth_engine import auth_blueprint
from s3_blueprint import s3_blueprint
from app.consoles.speakeasy.routes import init_speakeasy_routes

# Get absolute paths
template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'app', 'templates'))
static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'app', 'static'))
app_groups_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'app', 'application_groups'))

# Create the Flask app
application = Flask(__name__,
                   template_folder=template_dir,
                   static_folder=static_dir)

# Use the environment variable for the secret key, with a fallback for safety
application.secret_key = os.environ.get('FLASK_SECRET_KEY') or os.urandom(24).hex()
application.config['SESSION_TYPE'] = 'filesystem'

# Set development mode by default if not specified
application.config['ENV'] = os.environ.get('FLASK_ENV', 'development')

# Configure CORS based on environment
if application.config['ENV'] == 'development':
    CORS(application, resources={
        r"/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
else:
    CORS(application, resources={
        r"/*": {
            "origins": [os.environ.get('ALLOWED_ORIGIN', 'https://yourdomain.com')],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

# Register blueprints
print("Registering blueprints...")
application.register_blueprint(config_blueprint)    # Register config first
application.register_blueprint(main_blueprint)      # Then routes
application.register_blueprint(auth_blueprint)      # Then routes
application.register_blueprint(s3_blueprint)        # Then routes

# Register Speakeasy routes with debug logging
try:
    print("Attempting to register Speakeasy routes...")
    speakeasy_blueprint = init_speakeasy_routes()
    application.register_blueprint(speakeasy_blueprint)
    print("Successfully registered Speakeasy routes")
except Exception as e:
    print(f"Error registering Speakeasy routes: {str(e)}")

app = application

if __name__ == '__main__':
    # Development settings
    application.config['TEMPLATES_AUTO_RELOAD'] = True
    application.config['DEBUG'] = True
    
    # Optional: Print a warning if using the fallback key
    if not os.environ.get('FLASK_SECRET_KEY'):
        print("Warning: Using fallback secret key. For production, set FLASK_SECRET_KEY environment variable.")
    
    # Development-specific configuration
    application.config.update(
        CORS_HEADERS='Content-Type'
    )
    
    print("\nRegistered routes:")
    for rule in application.url_map.iter_rules():
        print(f"  {rule.endpoint}: {rule.rule}")
    
    application.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
    
    
    
else:
    # Production settings
    application.config['TEMPLATES_AUTO_RELOAD'] = False
    application.config['DEBUG'] = False
    
    application.config.update(
        CORS_HEADERS='Content-Type'
    )
