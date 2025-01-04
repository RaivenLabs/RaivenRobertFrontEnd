from flask import Blueprint, render_template, send_from_directory, g, request, session, send_file, abort, json, jsonify
import os


from pathlib import Path
from auth_engine import login_required  # Add this import

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
@login_required 
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


        
@main_blueprint.route('/<program_id>')
def launch_application(program_id):
    try:
        
        section = request.args.get('section', 'houseapps')  # This gets the actual section value 
        # Template path for specific application template
        template_path = f'applicationlaunchpages/{program_id}.html'
        
        # Pass program_id to the template
        # This will be used for both constructing sidebar path
        # and loading the correct handler
        return render_template(
            template_path,
            program_id=program_id,
            section=section  # or determine dynamically if needed
        )
    except Exception as e:
        print(f"Error launching application {program_id}: {str(e)}")
        abort(404)       
        
@main_blueprint.route('/<section>')
def launch_running_board():
    try:
        section = request.args.get('section')
        return render_template(
            f'applicationlaunchpages/{section}.html',
            section=section
        )
    except Exception as e:
        print(f"Error launching {section}: {str(e)}")
        abort(404)









@main_blueprint.route('/application_groups/<section>/applications/<application>/static/templates/<template_name>')
def serve_application_template(section, application, template_name):
    try:
        # Build the path to the template
        template_path = os.path.join(
            main_blueprint.root_path,
            'application_groups',
            section,
            'applications',
            application,
            'static',
            'templates',
            template_name
        )
        
        # Check if file exists
        if not os.path.exists(template_path):
            abort(404)
            
        # Send the file
        return send_file(template_path)
    except Exception as e:
        main_blueprint.logger.error(f"Error serving template {template_name}: {str(e)}")
        abort(500)
        
@main_blueprint.route('/api/check_app_id', methods=['POST'])
def check_app_id():
    data = request.json
    app_id = data['appId']
    # Check JSON file for duplicates...

@main_blueprint.route('/api/create_application', methods=['POST'])

def create_application():
    data = request.json
    app_name = data['appName']
    app_group = data['appGroup']
    program_data = data['programData']
    
    try:
        # Path to your JSON file
        json_path = 'C:\Users\RobertReynolds\Python Projects\Python Development Projects\Transaction Platform Development\transaction_platform_app\app\application_groups\sandbox\application_group_root\static\data\sandbox_programs.json'
        
        # Read existing JSON
        with open(json_path, 'r') as f:
            sandbox_data = json.load(f)
        
        # Find the correct group and append new program
        for group in sandbox_data['program_groups']:
            if group['name'].lower() == app_group.lower():
                # Check for duplicate IDs
                if any(p['id'] == program_data['id'] for p in group['programs']):
                    return jsonify({
                        'success': False,
                        'error': 'Application ID already exists'
                    })
                
                group['programs'].append(program_data)
                break
        
        # Write updated JSON back to file
        with open(json_path, 'w') as f:
            json.dump(sandbox_data, f, indent=4)
        
        # Your existing file copying logic here...
        # ... copy directories and files ...

        return jsonify({
            'success': True,
            'createdItems': [
                f'Created application directory: {app_name}',
                f'Created {app_name}.html',
                f'Created {app_name}_sidebar.html',
                'Updated sandbox_programs.json'
            ],
            'jsonUpdated': True
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })




















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