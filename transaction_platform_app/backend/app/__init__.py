# app/__init__.py
from flask import Flask
import os
import sys
print("Current working directory:", os.getcwd())
print("Python path:", sys.path)
print("Directory of __init__.py:", os.path.dirname(__file__))
print("Absolute path of auth directory:", os.path.abspath(os.path.join(os.path.dirname(__file__), 'auth')))
from flask_cors import CORS
from .utils.storage_sync import StorageManager
from .routes.main_routes import main_blueprint
from .routes.s3_blueprint import s3_blueprint
from .config.config import config_blueprint
from .auth.auth_engine import auth_blueprint

def create_app():
    # Get absolute paths
    template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'templates'))
    static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'static'))
    app_groups_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'application_groups'))

    # Create Flask app
    app = Flask(__name__,
                template_folder=template_dir,
                static_folder=static_dir)

    # Configuration
    is_development = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.secret_key = os.environ.get('FLASK_SECRET_KEY') or os.urandom(24).hex()
    app.config.update(
        SESSION_TYPE='filesystem',
        ENV=os.environ.get('FLASK_ENV', 'development'),
        TEMPLATES_AUTO_RELOAD=is_development,
        DEBUG=is_development,
        CORS_HEADERS='Content-Type',
        USE_S3=os.environ.get('USE_S3', 'True').lower() == 'true'
    )

    # Configure CORS
    CORS(app, resources={
        r"/*": {
           "origins": [
            "http://localhost:3000",  # Local development
            "https://juniper.tangibleinnovations.ai",  # Production domain
        ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Register all blueprints
    app.register_blueprint(config_blueprint)
    app.register_blueprint(main_blueprint)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(s3_blueprint)

    # Initialize storage manager if using S3
    if app.config['USE_S3']:
        app.storage = StorageManager(use_s3=True)

    if is_development:
        # Print routes in development
        print("\nRegistered routes:")
        for rule in app.url_map.iter_rules():
            print(f"  {rule.endpoint}: {rule.rule}")

    return app
