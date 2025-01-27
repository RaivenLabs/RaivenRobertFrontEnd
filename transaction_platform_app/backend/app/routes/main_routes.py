from flask import Blueprint, render_template, send_from_directory, g, request, session, send_file, abort, json, jsonify, current_app

import json

import boto3

import os

import time
import copy


from pathlib import Path
#from ..auth.auth_engine import login_required  # Add this import

from botocore.exceptions import ClientError

# Get AWS credentials from environment variables
AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
S3_BUCKET = os.environ.get('S3_BUCKET')

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)





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














def load_runs_data():
    try:
        is_development = current_app.config.get('FLASK_ENV') == 'development'
        
        if is_development and os.environ.get('USE_LOCAL_FILES', 'False').lower() == 'true':
            json_path = os.path.abspath(os.path.join(
                current_app.root_path,
                '..',
                '..',
                'static',
                'data',
                'applicationRuns',
                'run_state.json'
            ))
            try:
                with open(json_path, 'r') as f:
                    return json.load(f)
            except FileNotFoundError:
                return {"runs": {"MERGER_CONTROL": {}}}
        else:
            # S3 path for production
            s3_client = boto3.client('s3')
            try:
                response = s3_client.get_object(
                    Bucket='juniperproductiondata',
                    Key='data/applicationRuns/run_state.json'
                )
                return json.loads(response['Body'].read().decode('utf-8'))
            except ClientError:
                return {"runs": {"MERGER_CONTROL": {}}}
                
    except Exception as e:
        current_app.logger.error(f"Error loading runs data: {str(e)}")
        raise

def save_run_data(run_id, run_data):
    try:
        is_development = current_app.config.get('FLASK_ENV') == 'development'
        
        if is_development and os.environ.get('USE_LOCAL_FILES', 'False').lower() == 'true':
            json_path = os.path.abspath(os.path.join(
                current_app.root_path, '..', '..', 'static', 'data',
                'applicationRuns', 'run_state.json'
            ))
            # Read existing data
            try:
                with open(json_path, 'r') as f:
                    existing_data = json.load(f)
            except FileNotFoundError:
                existing_data = {"runs": {"MERGER_CONTROL": {}}}
            
            # Update with new data
            existing_data["runs"]["MERGER_CONTROL"][run_id] = run_data
            
            # Write back to file
            with open(json_path, 'w') as f:
                json.dump(existing_data, f, indent=2)
        else:
            # S3 handling for production
            s3_client = boto3.client('s3')
            try:
                response = s3_client.get_object(
                    Bucket='juniperproductiondata',
                    Key='data/applicationRuns/run_state.json'
                )
                existing_data = json.loads(response['Body'].read().decode('utf-8'))
            except ClientError:
                existing_data = {"runs": {"MERGER_CONTROL": {}}}
            
            existing_data["runs"]["MERGER_CONTROL"][run_id] = run_data
            
            s3_client.put_object(
                Bucket='juniperproductiondata',
                Key='data/applicationRuns/run_state.json',
                Body=json.dumps(existing_data, indent=2)
            )
        return True
    except Exception as e:
        current_app.logger.error(f"Error saving run data: {str(e)}")
        raise
    
    











@main_blueprint.route('/api/programs/exchange', methods=['GET'])
def get_exchange_programshold():
    try:
        is_development = current_app.config.get('FLASK_ENV') == 'development'
        
        if is_development and os.environ.get('USE_LOCAL_FILES', 'False').lower() == 'true':
            # Navigate up from backend/app to transaction_platform_app, then to static/data
            json_path = os.path.abspath(os.path.join(
                current_app.root_path,  # This is backend/app
                '..',                   # Up to backend
                '..',                   # Up to transaction_platform_app
                'static',
                'data',
                'exchange_programs.json'
            ))
            print(f"Attempting to read from path: {json_path}")  # Debug print
            with open(json_path, 'r') as f:
                programs_data = json.load(f)
        else:
            # S3 path for production
            s3_client = boto3.client('s3')
            response = s3_client.get_object(
                Bucket='juniperproductiondata',
                Key='data/programs/exchange_programs.json'
            )
            programs_data = json.loads(response['Body'].read().decode('utf-8'))
            
        return jsonify(programs_data)
        
    except Exception as e:
        current_app.logger.error(f"Error loading Exchang Review program data: {str(e)}")
        return jsonify({'error': str(e)}), 500


@main_blueprint.route('/api/company-report/<customer_id>', methods=['GET'])
def get_customer_data(customer_id):
    try:
        # Add debug prints
        print(f"Root path: {current_app.root_path}")
        json_path = os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'companyreport_programs.json'
        )
        print(f"Constructed path: {json_path}")
        print(f"File exists: {os.path.exists(json_path)}")
        
        with open(json_path, 'r') as f:
            all_customer_data = json.load(f)
            
        # Find specific customer
        customer_data = next(
            (customer for customer in all_customer_data["customers"] 
             if customer["customer_id"] == customer_id),
            None
        )
        
        if not customer_data:
            return jsonify({'error': 'Customer not found'}), 404
            
        return jsonify(customer_data)
        
    except Exception as e:
        current_app.logger.error(f"Error loading customer data: {str(e)}")
        return jsonify({'error': str(e)}), 500



@main_blueprint.route('/api/programs/speakeasy', methods=['GET'])
def get_speakeasy_programshold():
    try:
        is_development = current_app.config.get('FLASK_ENV') == 'development'
        
        if is_development and os.environ.get('USE_LOCAL_FILES', 'False').lower() == 'true':
            # Navigate up from backend/app to transaction_platform_app, then to static/data
            json_path = os.path.abspath(os.path.join(
                current_app.root_path,  # This is backend/app
                '..',                   # Up to backend
                '..',                   # Up to transaction_platform_app
                'static',
                'data',
                'speakeasy_programs.json'
            ))
            print(f"Attempting to read from path: {json_path}")  # Debug print
            with open(json_path, 'r') as f:
                programs_data = json.load(f)
        else:
            # S3 path for production
            s3_client = boto3.client('s3')
            response = s3_client.get_object(
                Bucket='juniperproductiondata',
                Key='data/programs/speakeasy_programs.json'
            )
            programs_data = json.loads(response['Body'].read().decode('utf-8'))
            
        return jsonify(programs_data)
        
    except Exception as e:
        current_app.logger.error(f"Error loading Speakeasy Review program data: {str(e)}")
        return jsonify({'error': str(e)}), 500

    


@main_blueprint.route('/api/programs/houseapps', methods=['GET'])
def get_houseapps_programshold():
    try:
        is_development = current_app.config.get('FLASK_ENV') == 'development'
        
        if is_development and os.environ.get('USE_LOCAL_FILES', 'False').lower() == 'true':
            # Navigate up from backend/app to transaction_platform_app, then to static/data
            json_path = os.path.abspath(os.path.join(
                current_app.root_path,  # This is backend/app
                '..',                   # Up to backend
                '..',                   # Up to transaction_platform_app
                'static',
                'data',
                'houseapps_programs.json'
            ))
            print(f"Attempting to read from path: {json_path}")  # Debug print
            with open(json_path, 'r') as f:
                programs_data = json.load(f)
        else:
            # S3 path for production
            s3_client = boto3.client('s3')
            response = s3_client.get_object(
                Bucket='juniperproductiondata',
                Key='data/programs/houseapps_programs.json'
            )
            programs_data = json.loads(response['Body'].read().decode('utf-8'))
            
        return jsonify(programs_data)
        
    except Exception as e:
        current_app.logger.error(f"Error loading House App Review program data: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@main_blueprint.route('/api/programs/buildkits', methods=['GET'])
def get_buildkits_programshold():
    try:
        is_development = current_app.config.get('FLASK_ENV') == 'development'
        
        if is_development and os.environ.get('USE_LOCAL_FILES', 'False').lower() == 'true':
            # Navigate up from backend/app to transaction_platform_app, then to static/data
            json_path = os.path.abspath(os.path.join(
                current_app.root_path,  # This is backend/app
                '..',                   # Up to backend
                '..',                   # Up to transaction_platform_app
                'static',
                'data',
                'buildkits_programs.json'
            ))
            print(f"Attempting to read from path: {json_path}")  # Debug print
            with open(json_path, 'r') as f:
                programs_data = json.load(f)
        else:
            # S3 path for production
            s3_client = boto3.client('s3')
            response = s3_client.get_object(
                Bucket='juniperproductiondata',
                Key='data/programs/buildkits_programs.json'
            )
            programs_data = json.loads(response['Body'].read().decode('utf-8'))
            
        return jsonify(programs_data)
        
    except Exception as e:
        current_app.logger.error(f"Error loading Build Kit program data: {str(e)}")
        return jsonify({'error': str(e)}), 500
    




@main_blueprint.route('/api/programs/<program_type>', methods=['GET'])
def get_programs(program_type):
    try:
        # Get environment and customer path from headers
        react_env = request.headers.get('X-Environment', 'development')
        customer_path = request.headers.get('X-Customer-Path', 'hawkeyetest')
        
        print("\n=== Debug Information ===")
        print(f"Program Type: {program_type}")
        print(f"React Environment: {react_env}")
        print(f"Customer Path: {customer_path}")

        if react_env == 'development':
            # Local file path construction
            json_path = os.path.abspath(os.path.join(
                current_app.root_path,
                '..',
                '..',
                'static',
                'data',
                customer_path,  # Customer-specific folder
                f'{program_type}_programs.json'
            ))
            print(f"\n🔍 Using local path: {json_path}")
            print(f"Does path exist? {os.path.exists(json_path)}")
            
            with open(json_path, 'r') as f:
                programs_data = json.load(f)
        else:
            # S3 path construction
            s3_key = f'data/programs/{customer_path}/{program_type}_programs.json'
            print(f"\n🔍 Using S3 path: {s3_key}")
            
            s3_client = boto3.client('s3')
            response = s3_client.get_object(
                Bucket='juniperproductiondata',
                Key=s3_key
            )
            programs_data = json.loads(response['Body'].read().decode('utf-8'))
            
        return jsonify(programs_data)

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({'error': 'Failed to load program data'}), 500








    
@main_blueprint.route('/api/programs/r2d2', methods=['GET'])
def get_r2d2_programshold():
    try:
        is_development = current_app.config.get('FLASK_ENV') == 'development'
        
        if is_development and os.environ.get('USE_LOCAL_FILES', 'False').lower() == 'true':
            # Navigate up from backend/app to transaction_platform_app, then to static/data
            json_path = os.path.abspath(os.path.join(
                current_app.root_path,  # This is backend/app
                '..',                   # Up to backend
                '..',                   # Up to transaction_platform_app
                'static',
                'data',
                'r2d2_programs.json'
            ))
            print(f"Attempting to read from path: {json_path}")  # Debug print
            with open(json_path, 'r') as f:
                programs_data = json.load(f)
        else:
            # S3 path for production
            s3_client = boto3.client('s3')
            response = s3_client.get_object(
                Bucket='juniperproductiondata',
                Key='data/programs/r2d2_programs.json'
            )
            programs_data = json.loads(response['Body'].read().decode('utf-8'))
            
        return jsonify(programs_data)
        
    except Exception as e:
        current_app.logger.error(f"Error loading Insight Review program data: {str(e)}")
        return jsonify({'error': str(e)}), 500



@main_blueprint.route('/api/programs/tangibleteams', methods=['GET'])
def get_tangibleteams_programs():
    try:
        is_development = current_app.config.get('FLASK_ENV') == 'development'
        
        if is_development and os.environ.get('USE_LOCAL_FILES', 'False').lower() == 'true':
            # Navigate up from backend/app to transaction_platform_app, then to static/data
            json_path = os.path.abspath(os.path.join(
                current_app.root_path,  # This is backend/app
                '..',                   # Up to backend
                '..',                   # Up to transaction_platform_app
                'static',
                'data',
                'tangibleteams_programs.json'
            ))
            print(f"Attempting to read from path: {json_path}")  # Debug print
            with open(json_path, 'r') as f:
                programs_data = json.load(f)
        else:
            # S3 path for production
            s3_client = boto3.client('s3')
            response = s3_client.get_object(
                Bucket='juniperproductiondata',
                Key='data/programs/tangibleteams_programs.json'
            )
            programs_data = json.loads(response['Body'].read().decode('utf-8'))
            
        return jsonify(programs_data)
        
    except Exception as e:
        current_app.logger.error(f"Error loading Tangible Teams Review program data: {str(e)}")
        return jsonify({'error': str(e)}), 500













    
@main_blueprint.route('/api/sampleagreementdata', methods=['GET'])   
def get_sample_agreement_data():
    try:
        is_development = current_app.config.get('FLASK_ENV') == 'development'
        
        if is_development and os.environ.get('USE_LOCAL_FILES', 'False').lower() == 'true':
            # Navigate up from backend/app to transaction_platform_app, then to static/data
            json_path = os.path.abspath(os.path.join(
                current_app.root_path,  # This is backend/app
                '..',                   # Up to backend
                '..',                   # Up to transaction_platform_app
                'static',
                'data',
                'sampleagreementdata.json'
            ))
            print(f"Attempting to read from path: {json_path}")  # Debug print
            with open(json_path, 'r') as f:
                programs_data = json.load(f)
        else:
            # S3 path for production
            s3_client = boto3.client('s3')
            response = s3_client.get_object(
                Bucket='juniperproductiondata',
                Key='data/programs/sampleagreementdata.json'
            )
            programs_data = json.loads(response['Body'].read().decode('utf-8'))
            
        return jsonify(programs_data)
        
    except Exception as e:
        current_app.logger.error(f"Error loading Sample AGreement Data for Import program data: {str(e)}")
        return jsonify({'error': str(e)}), 500

@main_blueprint.route('/api/flightdeck/dashboard', methods=['GET'])   
def dashboardreporting_data():
    try:
        is_development = current_app.config.get('FLASK_ENV') == 'development'
        
        if is_development and os.environ.get('USE_LOCAL_FILES', 'False').lower() == 'true':
            # Navigate up from backend/app to transaction_platform_app, then to static/data
            json_path = os.path.abspath(os.path.join(
                current_app.root_path,  # This is backend/app
                '..',                   # Up to backend
                '..',                   # Up to transaction_platform_app
                'static',
                'data',
                'dashboardreporting.json'
            ))
            print(f"Attempting to read from path: {json_path}")  # Debug print
            with open(json_path, 'r') as f:
                programs_data = json.load(f)
        else:
            # S3 path for production
            s3_client = boto3.client('s3')
            response = s3_client.get_object(
                Bucket='juniperproductiondata',
                Key='data/programs/dashboardreporting.json'
            )
            programs_data = json.loads(response['Body'].read().decode('utf-8'))
            
        return jsonify(programs_data)
        
    except Exception as e:
        current_app.logger.error(f"Error loading Sample Dashboard Reporting Data for Import program data: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
     
    
    
    
    
    
    
    
@main_blueprint.route('/api/speakeasy/questions', methods=['GET'])

def get_questions():
    try:
        is_development = current_app.config.get('FLASK_ENV') == 'development'
        
        if is_development and os.environ.get('USE_LOCAL_FILES', 'False').lower() == 'true':
            # Navigate up from backend/app to transaction_platform_app, then to static/data
            json_path = os.path.abspath(os.path.join(
                current_app.root_path,  # This is backend/app
                '..',                   # Up to backend
                '..',                   # Up to transaction_platform_app
                'static',
                'data',
                'sesamepairs.json'
            ))
            print(f"Attempting to read from path: {json_path}")  # Debug print
            with open(json_path, 'r') as f:
                all_questions = json.load(f)
        else:
            # S3 path for production
            s3_client = boto3.client('s3')
            response = s3_client.get_object(
                Bucket='juniperproductiondata',
                Key='data/programs/sesamepairs.json'
            )
            all_questions = json.loads(response['Body'].read().decode('utf-8'))
            print("Successfully read from S3")
            
        return jsonify({
            'success': True,
            'questions': all_questions['questionPairs']
        })
        
    except Exception as e:
        print(f"Error in get_questions: {str(e)}")
        current_app.logger.error(f"Error loading questions: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
        
@main_blueprint.route('/api/config/customer-instances', methods=['GET'])
def get_customer_instances():
    try:
        is_development = os.environ.get('FLASK_ENV') == 'development'
        
        if is_development:
            print(f"Root path: {current_app.root_path}")
            json_path = os.path.join(
                current_app.root_path,
                '..',
                '..',
                'static',
                'data',
                'customerInstances.json'
            )
            print(f"Constructed path: {json_path}")
            print(f"File exists: {os.path.exists(json_path)}")
            with open(json_path, 'r') as f:
                config_data = json.load(f)
        else:
            # Production S3 path
            s3_client = boto3.client('s3')
            response = s3_client.get_object(
                Bucket='juniperproductiondata',
                Key='data/configs/customerInstances.json'
            )
            config_data = json.loads(response['Body'].read().decode('utf-8'))
        
        return jsonify(config_data)
        
    except Exception as e:
        current_app.logger.error(f"Error loading customer instances: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@main_blueprint.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200



















@main_blueprint.route('/api/projects/search', methods=['GET'])
def find_project():
    try:
        buying_company = request.args.get('buyingCompany')
        target_company = request.args.get('targetCompany')
        
        if not buying_company or not target_company:
            return jsonify({"error": "Missing required query parameters"}), 400

        # Construct path to mergerControlProjects.json
        json_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'MergerControlDataPackages',
            'mergerControlProjects.json'
        ))

        try:
            with open(json_path, 'r') as f:
                data = json.load(f)
        except FileNotFoundError:
            data = {"projects": {}}

        # Find matching projects
        matching_projects = [
            project for project in data["projects"].values()
            if project["buyingCompany"] == buying_company 
            and project["targetCompany"] == target_company
        ]

        return jsonify(matching_projects)

    except Exception as e:
        print(f"Error finding project: {str(e)}")
        return jsonify({'error': str(e)}), 500



@main_blueprint.route('/api/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    try:
        json_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'MergerControlDataPackages',
            'mergerControlProjects.json'
        ))

        try:
            with open(json_path, 'r') as f:
                data = json.load(f)
        except FileNotFoundError:
            return jsonify({"error": "Project not found"}), 404

        project = data["projects"].get(project_id)
        if not project:
            return jsonify({"error": "Project not found"}), 404

        return jsonify(project)

    except Exception as e:
        print(f"Error getting project: {str(e)}")
        return jsonify({'error': str(e)}), 500
    





@main_blueprint.route('/api/projects', methods=['POST'])
def create_project():
    try:
        project_data = request.json
        print(f"Received project data: {project_data}")
        
        if not all(k in project_data for k in ['projectName', 'buyingCompany', 'targetCompany']):
            return jsonify({"error": "Missing required fields"}), 400

        # Base directory for all merger control data
        base_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'MergerControlDataPackages'
        ))

        # Create clean directory names
        buyer_dir_name = project_data['buyingCompany'].lower().replace(' ', '_')
        project_dir_name = project_data['projectName'].lower().replace(' ', '_')

        # Construct paths
        buyer_path = os.path.join(base_path, buyer_dir_name)
        project_path = os.path.join(buyer_path, project_dir_name)
        runs_path = os.path.join(project_path, 'application_runs')

        # Create directory structure if it doesn't exist
        os.makedirs(buyer_path, exist_ok=True)
        os.makedirs(project_path, exist_ok=True)
        os.makedirs(runs_path, exist_ok=True)

        print(f"Created directory structure:")
        print(f"Buyer path: {buyer_path}")
        print(f"Project path: {project_path}")
        print(f"Runs path: {runs_path}")

        # Create or update the main projects index
        index_path = os.path.join(base_path, 'mergerControlProjects.json')
        try:
            with open(index_path, 'r') as f:
                index_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            index_data = {
                "projects": {},
                "indices": {
                    "byCompanyPair": {}
                }
            }

        # Create project data structure
        timestamp = int(time.time() * 1000)
        project_id = project_dir_name
        new_project = {
            "projectId": project_id,
            "projectName": project_data['projectName'],
            "buyingCompany": project_data['buyingCompany'],
            "targetCompany": project_data['targetCompany'],
            "status": "active",
            "dateCreated": timestamp,
            "lastModified": timestamp,
            "metadata": {
                "createdBy": "system",
                "description": project_data.get('description', ''),
                "priority": "medium",
                "phase": "initial_filing"
            },
            "directoryPaths": {
                "base": project_path,
                "runs": runs_path
            },
            "applicationRuns": {}
        }

        # Update the main index
        index_data["projects"][project_id] = new_project
        company_pair_key = f"{project_data['buyingCompany']}_{project_data['targetCompany']}"
        if company_pair_key not in index_data["indices"]["byCompanyPair"]:
            index_data["indices"]["byCompanyPair"][company_pair_key] = []
        if project_id not in index_data["indices"]["byCompanyPair"][company_pair_key]:
            index_data["indices"]["byCompanyPair"][company_pair_key].append(project_id)

        # Write main index
        with open(index_path, 'w') as f:
            json.dump(index_data, f, indent=2)

        # Create project-specific data file
        project_data_path = os.path.join(project_path, 'project_data.json')
        with open(project_data_path, 'w') as f:
            json.dump(new_project, f, indent=2)

        return jsonify(new_project)

    except Exception as e:
        print(f"Error creating project: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
    
    
@main_blueprint.route('/api/setup/merger-control-directories', methods=['POST'])
def setup_merger_control_directories():
    try:
        # Base directory for all merger control data
        base_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'MergerControlDataPackages'
        ))
        
        print(f"Setting up directories in: {base_path}")

        # Create base directory if it doesn't exist
        os.makedirs(base_path, exist_ok=True)

        # Read existing project data
        json_path = os.path.join(base_path, 'mergerControlProjects.json')
        
        try:
            with open(json_path, 'r') as f:
                data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            return jsonify({
                "error": f"Could not read project data: {str(e)}",
                "basePath": base_path
            }), 500

        # Track what we create
        created_dirs = []
        existing_dirs = []

        # Process each project
        for project_id, project in data['projects'].items():
            buyer_dir_name = project['buyingCompany'].lower().replace(' ', '_')
            project_dir_name = project_id.lower().replace(' ', '_')

            # Create paths
            buyer_path = os.path.join(base_path, buyer_dir_name)
            project_path = os.path.join(buyer_path, project_dir_name)
            runs_path = os.path.join(project_path, 'application_runs')

            # Create directories if they don't exist
            for path in [buyer_path, project_path, runs_path]:
                if not os.path.exists(path):
                    os.makedirs(path)
                    created_dirs.append(path)
                else:
                    existing_dirs.append(path)

            # Create or update project-specific data file
            project_data_path = os.path.join(project_path, 'project_data.json')
            with open(project_data_path, 'w') as f:
                json.dump(project, f, indent=2)

        return jsonify({
            "success": True,
            "basePath": base_path,
            "created": created_dirs,
            "existing": existing_dirs
        })

    except Exception as e:
        print(f"Error setting up directories: {str(e)}")
        return jsonify({
            "error": str(e),
            "basePath": base_path
        }), 500 





@main_blueprint.route('/api/projects/<project_id>/runs/<run_id>', methods=['GET'])
def get_run(project_id, run_id):
    try:
        base_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'MergerControlDataPackages',
            'mergerControlProjects.json'  # Now matches create_run base_path
        ))

        # Load project data to get buying company
        with open(base_path, 'r') as f:
            all_projects = json.load(f)
            project_data = all_projects['projects'].get(project_id)
            if not project_data:
                raise ValueError(f"Project {project_id} not found")
            
            buying_company = project_data['buyingCompany']
            print(f"Loading run {run_id} for project {project_id} under company {buying_company}")

        # Construct path using consistent naming - now matches create_run pattern
        run_data_path = os.path.join(
            os.path.dirname(base_path),  # Remove mergerControlProjects.json from path
            buying_company.lower(),
            project_id,
            'application_runs',
            run_id,
            'run_data.json'
        )

        print(f"Looking for run data at: {run_data_path}")

        # Load and return the run data
        with open(run_data_path, 'r') as f:
            run_data = json.load(f)
            
        print(f"Successfully loaded run data for {run_id}")
        return jsonify(run_data)

    except Exception as e:
        print(f"Error loading run data: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@main_blueprint.route('/api/projects/<project_id>/runs/<run_id>/toggle_regional_blocks', methods=['POST'])
def toggle_regional_blocks(project_id, run_id):
    try:
        request_data = request.get_json()
        changes = request_data.get('changes', [])
        
        if not changes:
            return jsonify(error="No changes provided"), 400

        base_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'MergerControlDataPackages',
            'mergerControlProjects.json'
        ))

        print(f"Processing request for project: {project_id}, run: {run_id}")

        # Load project data to get buying company
        with open(base_path, 'r') as f:
            all_projects = json.load(f)
            project_data = all_projects['projects'].get(project_id)
            if not project_data:
                raise ValueError(f"Project {project_id} not found")
            
            buying_company = project_data['buyingCompany']
            print(f"Found buying company: {buying_company}")

        run_data_path = os.path.join(
            os.path.dirname(base_path),
            buying_company.lower(),
            project_id,
            'application_runs',
            run_id,
            'run_data.json'
        )

        print(f"Attempting to update run data at: {run_data_path}")

        # Load existing run data
        with open(run_data_path, 'r') as f:
            run_data = json.load(f)

        # Ensure regional_blocks structure exists
        if 'regional_blocks' not in run_data['targetCompanyData']['original']:
            run_data['targetCompanyData']['original']['regional_blocks'] = {}

        regional_blocks = run_data['targetCompanyData']['original']['regional_blocks']
        
        # Get or create template for new member states
        template = regional_blocks.get('template', {
            'presence': True,
            'filing_required': False,
            'filing_threshold_met': False,
            'member_states': {}
        })
        
        print(f"Processing {len(changes)} regional block changes")

        # Process each change
        for change in changes:
            block_key = change['block_key']
            member_state_key = change.get('member_state_key')  # Optional for block-level changes
            active = change['active']
            
            print(f"Processing change for block: {block_key}, member state: {member_state_key}, active: {active}")

            # Ensure block exists in run_data
            if block_key not in regional_blocks:
                regional_blocks[block_key] = {
                    'presence': False,
                    'member_states': {}
                }

            if member_state_key:
                # Member state level change
                if 'member_states' not in regional_blocks[block_key]:
                    regional_blocks[block_key]['member_states'] = {}

                member_states = regional_blocks[block_key]['member_states']
                
                if active:
                    # Create or update member state
                    if member_state_key not in member_states:
                        new_member_state = template.copy()
                        new_member_state['presence'] = True
                        member_states[member_state_key] = new_member_state
                    else:
                        member_states[member_state_key]['presence'] = True
                    
                    # Ensure block is marked as present if it has active member states
                    regional_blocks[block_key]['presence'] = True
                else:
                    if member_state_key in member_states:
                        member_states[member_state_key]['presence'] = False
            else:
                # Block level change
                regional_blocks[block_key]['presence'] = active
                if not active:
                    # If block is deactivated, deactivate all member states
                    for state in regional_blocks[block_key].get('member_states', {}).values():
                        state['presence'] = False

        # Save updated run data
        with open(run_data_path, 'w') as f:
            json.dump(run_data, f, indent=2)

        print(f"Successfully updated regional blocks for run {run_id}")
        return jsonify({
            'success': True,
            'message': f"Successfully updated regional blocks for run {run_id}",
            'updated_blocks': [change['block_key'] for change in changes]
        })

    except FileNotFoundError as e:
        print(f"File not found error: {str(e)}")
        return jsonify(error=f"Could not find required file: {str(e)}"), 404
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {str(e)}")
        return jsonify(error="Invalid JSON data encountered"), 400
    except Exception as e:
        print(f"Error processing regional block changes: {str(e)}")
        return jsonify(error=str(e)), 500
    
@main_blueprint.route('/api/projects/<project_id>/runs/<run_id>/update_member_state_data', methods=['POST'])
def update_member_state_data(project_id, run_id):
    try:
        request_data = request.get_json()
        block_key = request_data.get('block_key')            # e.g., 'uk' as it exists in run_data
        member_state_key = request_data.get('member_state_key')  # e.g., 'uk' as it exists in run_data
        updates = request_data.get('updates')
        
        print(f"Updating member state data: block={block_key}, state={member_state_key}")
        
        if not all([block_key, member_state_key, updates]):
            return jsonify(error="Missing required data"), 400

        # Get path to run_data.json
        base_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'MergerControlDataPackages',
            'mergerControlProjects.json'
        ))

        # Load project data to get buying company
        with open(base_path, 'r') as f:
            all_projects = json.load(f)
            project_data = all_projects['projects'].get(project_id)
            if not project_data:
                raise ValueError(f"Project {project_id} not found")
            
            buying_company = project_data['buyingCompany']

        # Construct path to run_data.json
        run_data_path = os.path.join(
            os.path.dirname(base_path),
            buying_company.lower(),
            project_id,
            'application_runs',
            run_id,
            'run_data.json'
        )

        # Load existing run data
        with open(run_data_path, 'r') as f:
            run_data = json.load(f)

        # Get regional blocks data structure
        target_data = run_data['targetCompanyData']['original']
        if 'regional_blocks' not in target_data:
            target_data['regional_blocks'] = {}

        regional_blocks = target_data['regional_blocks']
        
        # Ensure block exists
        if block_key not in regional_blocks:
            template = regional_blocks.get('template', {
                'presence': True,
                'member_states': {},
                'merger_control_info': {
                    'filing_required': False,
                    'has_asset_test': False,
                    'has_market_share_test': False,
                    'review_period_days': None
                }
            })
            regional_blocks[block_key] = template.copy()

        # Ensure member_states structure exists
        if 'member_states' not in regional_blocks[block_key]:
            regional_blocks[block_key]['member_states'] = {}

        member_states = regional_blocks[block_key]['member_states']
        
        # Update member state data
        if member_state_key not in member_states:
            # If member state doesn't exist, create it
            member_state_template = {
                'presence': True,
                'revenue': None,
                'employees': None,
                'assets': None,
                'market_share': None,
                'local_entities': [],
                'merger_control_info': {
                    'filing_required': False,
                    'has_asset_test': False,
                    'has_market_share_test': False,
                    'review_period_days': None
                }
            }
            member_states[member_state_key] = member_state_template

        # Update fields
        for key, value in updates.items():
            if key == 'merger_control_info':
                member_states[member_state_key]['merger_control_info'].update(value)
            else:
                member_states[member_state_key][key] = value

        print(f"Updated member state data: {member_states[member_state_key]}")

        # Save updated run data
        with open(run_data_path, 'w') as f:
            json.dump(run_data, f, indent=2)

        return jsonify({
            'success': True,
            'message': f"Successfully updated {member_state_key} data in {block_key}",
            'updated_fields': list(updates.keys())
        })

    except FileNotFoundError as e:
        print(f"File not found error: {str(e)}")
        return jsonify(error=f"Could not find required file: {str(e)}"), 404
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {str(e)}")
        return jsonify(error="Invalid JSON data encountered"), 400
    except Exception as e:
        print(f"Error updating member state data: {str(e)}")
        return jsonify(error=str(e)), 500


@main_blueprint.route('/api/projects/<project_id>/runs', methods=['POST'])
def create_run(project_id):
   try:
       print(f"🚀 Creating new run for project: {project_id}")
       
       # First load the main projects file to get the companies
       base_path = os.path.abspath(os.path.join(
           current_app.root_path,
           '..',
           '..',
           'static',
           'data',
           'MergerControlDataPackages',
           'mergerControlProjects.json'
       ))

       # Load projects data
       with open(base_path, 'r') as f:
           all_projects = json.load(f)
           project_data = all_projects['projects'].get(project_id)
           if not project_data:
               raise ValueError(f"Project {project_id} not found")
           
           buying_company = project_data['buyingCompany']
           target_company = project_data['targetCompany']
           print(f"📊 Project details - Buying: {buying_company}, Target: {target_company}")

       # Load target company data for new run initialization
       target_data_path = os.path.abspath(os.path.join(
           current_app.root_path,
           '..',
           '..',
           'static',
           'data',
           'targetCompanyData.json'
       ))

       print(f"📁 Loading target company data from: {target_data_path}")
       with open(target_data_path, 'r') as f:
           target_companies = json.load(f)
           target_company_data = target_companies[target_company]
           if not target_company_data:
               raise ValueError(f"Target company {target_company} data not found")

       # Create timestamps
       timestamp_compact = time.strftime("%Y%m%d_%H%M")
       timestamp_display = time.strftime("%B %d, %Y %I:%M %p")
       
       # Create run identifiers
       run_id = f"{project_id}_run_{timestamp_compact}"
       run_display_name = f"{project_data['projectName']} Analysis - {timestamp_display}"

       # Set up paths using compact naming
       project_dir = os.path.join(os.path.dirname(base_path), buying_company.lower(), project_id)
       run_path = os.path.join(project_dir, 'application_runs', run_id)
       os.makedirs(run_path, exist_ok=True)
       print(f"📂 Created run directory: {run_path}")

       # Create run data structure initialized with target company data
       run_data = {
           "runId": run_id,
           "projectId": project_id,
           "displayName": run_display_name,
           "status": "setup_initiated",
           "dateCreated": time.strftime("%Y-%m-%dT%H:%M:%S"),
           "lastModified": time.strftime("%Y-%m-%dT%H:%M:%S"),
           "analysis": {
               "currentStep": "initial_assessment",
               "jurisdictionalFindings": {},
               "selectedJurisdictions": [],
               "calculatedResults": {}
           },
           "targetCompanyData": {
               "original": target_company_data,
               "modified": copy.deepcopy(target_company_data),  # Deep copy to prevent reference issues
               "changeLog": []
           },
           "workflowStatus": {
               "stage": "setup",
               "lastSaved": time.strftime("%Y-%m-%dT%H:%M:%S"),
               "modifications": False,
               "pendingChanges": False
           }
       }

       # Save run data
       run_data_path = os.path.join(run_path, 'run_data.json')
       with open(run_data_path, 'w') as f:
           json.dump(run_data, f, indent=2)
       print(f"💾 Saved run data to: {run_data_path}")

       # Update project's application runs index
       project_data.setdefault('applicationRuns', {})
       project_data['applicationRuns'][run_id] = {
           "runId": run_id,
           "displayName": run_display_name,
           "status": "setup_initiated",
           "dateCreated": time.strftime("%Y-%m-%dT%H:%M:%S"),
           "lastModified": time.strftime("%Y-%m-%dT%H:%M:%S")
       }

       # Save updated project data
       with open(base_path, 'w') as f:
           json.dump(all_projects, f, indent=2)

       print(f"✅ Successfully created new run: {run_id}")
       return jsonify(run_data)

   except Exception as e:
       print(f"❌ Error creating new run: {str(e)}")
       return jsonify({'error': str(e)}), 500
