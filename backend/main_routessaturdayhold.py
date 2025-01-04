from flask import Blueprint, render_template, send_from_directory, g, request, session
from pathlib import Path

main_blueprint = Blueprint('main', __name__)

# Base path configuration
APP_BASE = 'app/application_groups'

# Asset types configuration
ASSET_TYPES = ['js', 'css', 'data', 'handlers']

# Shared components configuration
SHARED_COMPONENTS = {
    'prototype': ['js', 'css'],
    'table': ['data', 'css', 'js'],
    'dashboardreporting': ['data', 'css', 'js'],
    'shared': ['css', 'js', 'handlers']
}

@main_blueprint.route('/')
def index():
    print(f"Accessing index route")
    
    # Check for customer type in query parameter
    test_type = request.args.get('customer')
    if test_type:
        print(f"Debug - Using test customer type: {test_type}")
        # Clear the session to force reconfiguration
        session.clear()
        
        from config import config_manager
        
        # Parse the full domain string
        parts = test_type.lower().split('.')
        print(f"Debug - Domain parts: {parts}")
        
        if 'enterprise.tangibleinnovations.ai' in test_type:
            customer_type = 'enterprise'
            identifier = parts[0]  # Gets 'falcon', 'eagle', etc.
        elif 'justice.tangibleinnovations.ai' in test_type:
            customer_type = 'justice'
            identifier = parts[0]  # Gets 'curie', etc.
        else:
            customer_type = 'standard'
            identifier = 'default'
            
        print(f"Debug - Loading config for {customer_type}:{identifier}")
        config = config_manager.load_config(customer_type, identifier)
        
        session['customer_config'] = config
        session['customer_type'] = customer_type
        session['customer_identifier'] = identifier
        
        g.config = config
        g.customer_type = customer_type
        g.customer_identifier = identifier
    
    # Debug output to check g object
    print(f"Debug - g object contents: {vars(g)}")
    
    # Check if config exists in g
    if not hasattr(g, 'config') or g.config is None:
        print("Warning: No config found in g, using default template")
        return render_template('global_welcome.html')
    
    # Get the template from the config with debug output
    print(f"Debug - Config contents: {g.config}")
    template = g.config.get('welcome_template', 'global_welcome.html')
    print(f"Debug - Selected template: {template}")
    
    return render_template(template)

@main_blueprint.route('/teamappraisal')
def appraisals():
    return render_template('views/foundrywelcome/indexAppraisal.html')

@main_blueprint.route('/franklin')
def franklin():
    return render_template('views/foundrywelcome/indexFranklin.html')

# General static file handler with nested path support
@main_blueprint.route('/application_groups/static/<path:filepath>')
def serve_static_files(filepath):
    try:
        # Split the filepath into parts
        parts = filepath.split('/')
        if len(parts) >= 1:
            directory = f'{APP_BASE}/static'
            print(f"Looking for static file: {filepath} in directory: {directory}")
            return send_from_directory(directory, filepath)
    except Exception as e:
        print(f"Error serving static file {filepath}: {str(e)}")
        return f"File not found: {filepath}", 404
    
@main_blueprint.route('/application_groups/<section>/applications/team-appraisal/appstatic/<path:filepath>')
def serve_program_appstatic_assets(section, filepath):  # Remove programID parameter
    try:
        directory = f'{APP_BASE}/{section}/applications/team-appraisal/appstatic'  # Hardcode team-appraisal
        print(f"Looking for program appstatic file: {filepath} in directory: {directory}")
        return send_from_directory(directory, filepath)
    except Exception as e:
        print(f"Error serving program appstatic file {filepath}: {str(e)}")
        return f"File not found: {filepath}", 404
# Section-specific handler with nested path support

@main_blueprint.route('/application_groups/<section>/application_group_root/static/<path:filepath>')
def serve_section_assets(section, filepath):
    try:
        directory = f'{APP_BASE}/{section}/application_group_root/static'
        print(f"Looking for section file: {filepath} in directory: {directory}")
        return send_from_directory(directory, filepath)
    except Exception as e:
        print(f"Error serving section file {filepath}: {str(e)}")
        return f"File not found: {filepath}", 404

# Shared component handler with nested path support
def create_shared_component_route(component):
    route = f'/application_groups/static/{component}/<path:filepath>'
    endpoint = f'serve_{component}_files'
    directory = f'{APP_BASE}/static/{component}'
    
    @main_blueprint.route(route)
    def handler(filepath):
        try:
            print(f"Serving {component} file: {filepath} from {directory}")
            return send_from_directory(directory, filepath)
        except Exception as e:
            print(f"Error serving {component} file {filepath}: {str(e)}")
            return f"File not found: {filepath}", 404
    
    handler.__name__ = endpoint
    return handler

# Create routes for shared components
for component in SHARED_COMPONENTS.keys():
    create_shared_component_route(component)

# Program-specific handler with nested path support
@main_blueprint.route('/application_groups/<section>/applications/<programID>/static/<path:filepath>')
def serve_program_assets(section, programID, filepath):
    try:
        directory = f'{APP_BASE}/{section}/applications/{programID}/static'
        print(f"Looking for program file: {filepath} in directory: {directory}")
        return send_from_directory(directory, filepath)
    except Exception as e:
        print(f"Error serving program file {filepath}: {str(e)}")
        return f"File not found: {filepath}", 404