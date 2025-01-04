from flask import Blueprint, render_template, request, redirect, url_for, session, current_app, jsonify
import boto3
import botocore
import os
from functools import wraps
import json
from warrant import Cognito
from config import config_manager  # Import your config manager

# Debug prints
print("\n--- DEBUG OUTPUT ---")
print(f"Current directory: {os.getcwd()}")
print(f"Auth engine location: {os.path.dirname(__file__)}")
template_path = os.path.join(os.path.dirname(__file__), 'authentication_blueprint', 'templates')
print(f"Looking for templates in: {template_path}")
print(f"Template exists: {os.path.exists(template_path)}")
print("--- END DEBUG ---\n")

auth_blueprint = Blueprint('auth', __name__,
                         template_folder='authentication_blueprint/templates',
                         static_folder='authentication_blueprint/static',
                         url_prefix='/auth')

# Cognito configuration
COGNITO_CONFIG = {
    'user_pool_id': 'us-west-2_PK6TMkBjL',
    'client_id': '1ndgkdrg86ll17nrsl93bkg545',
    'region': 'us-west-2'
}

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Use config manager to get correct configuration
            customer_type, identifier = config_manager.get_customer_type(request.host)
            customer_config = config_manager.load_config(customer_type, identifier)
            
            # Check if auth is required for this customer
            if customer_config.get('auth', {}).get('require_login', True):
                if 'access_token' not in session:
                    session['next_url'] = request.url
                    return redirect(url_for('auth.login'))
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Auth check error: {str(e)}")
            # Default to requiring auth if there's any error
            return redirect(url_for('auth.login'))
    return decorated_function
    



@auth_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    try:
        # Use the same subdomain parsing you already have in config
        customer_type, identifier = config_manager.get_customer_type(request.host)
        customer_config = config_manager.load_config(customer_type, identifier)
        
        print(f"Debug - Auth for customer type: {customer_type}, identifier: {identifier}")
        print(f"Debug - Customer config: {customer_config}")

        # Handle POST request (AJAX token submission)
        if request.method == 'POST':
            try:
                data = request.get_json()
                # Store tokens in session
                session['access_token'] = data.get('access_token')
                session['id_token'] = data.get('id_token')
                
                # Get redirect URL
                next_url = session.get('next_url', url_for('main.index'))
                session.pop('next_url', None)
                
                return jsonify({
                    'success': True,
                    'redirect_url': next_url
                })
                
            except Exception as e:
                print(f"Login POST error: {str(e)}")
                return jsonify({
                    'success': False,
                    'error': str(e)
                }), 400

        # Handle GET request (show login form)
        if not customer_config:
            return redirect(url_for('main.index'))
            
        # Check auth requirements from the loaded config
        if not customer_config.get('auth', {}).get('require_login', True):
            return redirect(url_for('main.index'))
            
        # Get Cognito config from the loaded customer config
        cognito_config = customer_config.get('auth', {}).get('cognito_config', {})
        
        return render_template(
            'auth/login.html', 
            cognito_config=cognito_config,
            customer_config=customer_config,
            customer_type=customer_type,
            customer_identifier=identifier
        )
                             
    except Exception as e:
        print(f"Login route error: {str(e)}")
        raise
        
                             
    

@auth_blueprint.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth.login', message='Successfully logged out'))

@auth_blueprint.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        username = request.form.get('username')
        try:
            u = Cognito(COGNITO_CONFIG['user_pool_id'],
                       COGNITO_CONFIG['client_id'],
                       username=username)
            u.initiate_forgot_password()
            return redirect(url_for('auth.reset_password', username=username))
        except Exception as e:
            return render_template('account/forgotpassword.html', error=str(e))
    return render_template('account/forgotpassword.html')

@auth_blueprint.route('/reset-password', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'POST':
        username = request.form.get('username')
        code = request.form.get('code')
        new_password = request.form.get('new_password')
        try:
            u = Cognito(COGNITO_CONFIG['user_pool_id'],
                       COGNITO_CONFIG['client_id'],
                       username=username)
            u.confirm_forgot_password(code, new_password)
            return redirect(url_for('auth.login', message='Password reset successful!'))
        except Exception as e:
            return render_template('account/passwords.html', error=str(e))
    return render_template('account/passwords.html', username=request.args.get('username'))

@auth_blueprint.route('/profile')
@login_required
def profile():
    try:
        u = Cognito(COGNITO_CONFIG['user_pool_id'],
                   COGNITO_CONFIG['client_id'],
                   access_token=session['access_token'])
        user_data = u.get_user()
        return render_template('account/profile.html', user=user_data._data)
    except Exception as e:
        return redirect(url_for('auth.login', error=str(e)))