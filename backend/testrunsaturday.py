from flask import Flask
import os
from main_routes import main_blueprint
from config import config_blueprint

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

# Register blueprints
application.register_blueprint(config_blueprint)  # Register config first
application.register_blueprint(main_blueprint)    # Then routes

app = application

if __name__ == '__main__':
    # Development settings
    application.config['TEMPLATES_AUTO_RELOAD'] = True
    application.config['DEBUG'] = True
    
    # Optional: Print a warning if using the fallback key
    if not os.environ.get('FLASK_SECRET_KEY'):
        print("Warning: Using fallback secret key. For production, set FLASK_SECRET_KEY environment variable.")
    
    application.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
else:
    # Production settings
    application.config['TEMPLATES_AUTO_RELOAD'] = False
    application.config['DEBUG'] = False