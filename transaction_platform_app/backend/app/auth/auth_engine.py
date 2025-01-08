from flask import Blueprint, render_template, request, redirect, url_for, session, current_app, jsonify
import boto3
import botocore
import os
from functools import wraps
import json
from warrant import Cognito
from ..config.config import config_manager
from botocore.exceptions import ClientError

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

# Updated Cognito configuration for new user pool
COGNITO_CONFIG = {
    'user_pool_id': 'us-west-2_JnwmUHLzc',
    'client_id': '47l1p0md5fpj3adg86no3h0sk6',
    'region': 'us-west-2'
}

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            customer_type, identifier = config_manager.get_customer_type(request.host)
            customer_config = config_manager.load_config(customer_type, identifier)
            
            if customer_config.get('auth', {}).get('require_login', True):
                if 'access_token' not in session:
                    session['next_url'] = request.url
                    return redirect(url_for('auth.login'))
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Auth check error: {str(e)}")
            return redirect(url_for('auth.login'))
    return decorated_function

@auth_blueprint.route('/api/auth/cognito-auth', methods=['POST'])
def cognito_auth():
    try:
        data = request.get_json()
        identifier = data.get('identifier')  # Can be email or username
        password = data.get('password')

        if not identifier or not password:
            return jsonify({'message': 'Username/email and password are required'}), 400

        cognito_client = boto3.client('cognito-idp', region_name=COGNITO_CONFIG['region'])

        try:
            # First try direct authentication
            auth_response = cognito_client.initiate_auth(
                ClientId=COGNITO_CONFIG['client_id'],
                AuthFlow='USER_PASSWORD_AUTH',
                AuthParameters={
                    'USERNAME': identifier,
                    'PASSWORD': password
                }
            )
            
            # Store tokens in session
            session['access_token'] = auth_response['AuthenticationResult']['AccessToken']
            session['id_token'] = auth_response['AuthenticationResult']['IdToken']
            
            return jsonify({
                'accessToken': auth_response['AuthenticationResult']['AccessToken'],
                'idToken': auth_response['AuthenticationResult']['IdToken'],
                'refreshToken': auth_response['AuthenticationResult']['RefreshToken'],
                'expiresIn': auth_response['AuthenticationResult']['ExpiresIn']
            })

        except cognito_client.exceptions.UserNotFoundException:
            # If not found, try to find by email
            try:
                user_response = cognito_client.list_users(
                    UserPoolId=COGNITO_CONFIG['user_pool_id'],
                    Filter=f'email = "{identifier}"'
                )
                
                if not user_response['Users']:
                    return jsonify({'message': 'User not found'}), 404
                
                # Get the username associated with the email
                username = user_response['Users'][0]['Username']
                
                # Try authentication with the found username
                auth_response = cognito_client.initiate_auth(
                    ClientId=COGNITO_CONFIG['client_id'],
                    AuthFlow='USER_PASSWORD_AUTH',
                    AuthParameters={
                        'USERNAME': username,
                        'PASSWORD': password
                    }
                )
                
                # Store tokens in session
                session['access_token'] = auth_response['AuthenticationResult']['AccessToken']
                session['id_token'] = auth_response['AuthenticationResult']['IdToken']
                
                return jsonify({
                    'accessToken': auth_response['AuthenticationResult']['AccessToken'],
                    'idToken': auth_response['AuthenticationResult']['IdToken'],
                    'refreshToken': auth_response['AuthenticationResult']['RefreshToken'],
                    'expiresIn': auth_response['AuthenticationResult']['ExpiresIn']
                })
            
            except ClientError as e:
                return jsonify({'message': str(e)}), 400

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@auth_blueprint.route('/api/auth/refresh-token', methods=['POST'])
def refresh_token():
    try:
        data = request.get_json()
        refresh_token = data.get('refreshToken')

        if not refresh_token:
            return jsonify({'message': 'Refresh token is required'}), 400

        cognito_client = boto3.client('cognito-idp', region_name=COGNITO_CONFIG['region'])
        
        auth_response = cognito_client.initiate_auth(
            ClientId=COGNITO_CONFIG['client_id'],
            AuthFlow='REFRESH_TOKEN_AUTH',
            AuthParameters={
                'REFRESH_TOKEN': refresh_token
            }
        )
        
        # Update session tokens
        session['access_token'] = auth_response['AuthenticationResult']['AccessToken']
        session['id_token'] = auth_response['AuthenticationResult']['IdToken']
        
        return jsonify({
            'accessToken': auth_response['AuthenticationResult']['AccessToken'],
            'idToken': auth_response['AuthenticationResult']['IdToken'],
            'expiresIn': auth_response['AuthenticationResult']['ExpiresIn']
        })

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@auth_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    try:
        customer_type, identifier = config_manager.get_customer_type(request.host)
        customer_config = config_manager.load_config(customer_type, identifier)
        
        print(f"Debug - Auth for customer type: {customer_type}, identifier: {identifier}")
        print(f"Debug - Customer config: {customer_config}")

        if request.method == 'POST':
            try:
                data = request.get_json()
                session['access_token'] = data.get('access_token')
                session['id_token'] = data.get('id_token')
                
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

        if not customer_config:
            return redirect(url_for('main.index'))
            
        if not customer_config.get('auth', {}).get('require_login', True):
            return redirect(url_for('main.index'))
            
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
