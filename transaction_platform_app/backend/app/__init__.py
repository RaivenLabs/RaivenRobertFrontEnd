# app/__init__.py
from flask import Flask, jsonify
import os
from flask_cors import CORS
from .routes.main_routes import main_blueprint
from .config.config import config_blueprint
from .auth.auth_engine import auth_blueprint

def create_app():
   # Create Flask app with minimal configuration
   app = Flask(__name__,
               template_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), 'templates')),
               static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), 'static')))

   @app.route('/health')
   def health_check():
            return jsonify({"status": "healthy"}), 200
    
    
   # Auto-generate secret key
   app.secret_key = os.urandom(24).hex()

   # CORS Configuration
   CORS(app, resources={
       r"/*": {
           "origins": [
               "https://localhost:3000",
               "http://localhost:3000",
               "https://hawkeye.tangibleinnovations.ai",
               "https://ashelabs.tangibleinnovations.ai"
           ],
           "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
           "allow_headers": [
               "Content-Type",
               "Authorization",
               "X-Requested-With",
               "Accept",
               "Origin",
               "Access-Control-Request-Method",
               "Access-Control-Request-Headers",
               "X-CSRF-Token",
               "x-amz-security-token",  # For AWS/Cognito
               "x-amz-date",            # For AWS/Cognito
               "x-amz-user-agent"       # For AWS/Cognito
           ],
           "expose_headers": [
               "Access-Control-Allow-Origin", 
               "Access-Control-Allow-Credentials",
               "Content-Disposition"    # For file downloads
           ],
           "supports_credentials": True,
           "max_age": 3600
       }
   })




   # Register blueprints
   app.register_blueprint(config_blueprint)
   app.register_blueprint(main_blueprint)
   app.register_blueprint(auth_blueprint)

   return app
