from flask import Blueprint, render_template, send_from_directory, g, request, session, send_file, abort, json, jsonify, current_app

import json

import boto3

import requests

import os

import traceback

import re

import time
import copy

from datetime import datetime
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


from datetime import datetime

@main_blueprint.route('/api/projects/<project_id>/runs', methods=['GET', 'POST'])
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

        # Define paths for both company data files
        target_data_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'MergerControlDataPackages',
            'targetCompanyData.json'
        ))

        buying_data_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'MergerControlDataPackages',
            'buyingCompanyData.json'
        ))

        print(f"📁 Loading buying and target company data from: {target_data_path} and {buying_data_path}")
        
        # Create consistent timestamp format for both display and file naming
        current_time = datetime.now()
        timestamp_compact = current_time.strftime("%Y%m%d_%H%M")
        timestamp_iso = current_time.strftime("%Y-%m-%dT%H:%M:%S")  # ISO format for JSON
        
        run_id = f"{project_id}_run_{timestamp_compact}"
        run_display_name = f"{project_data['projectName']} Analysis - {current_time.strftime('%B %d, %Y %I:%M %p')}"

        # Set up paths
        project_dir = os.path.join(os.path.dirname(base_path), buying_company.lower(), project_id)
        run_path = os.path.join(project_dir, 'application_runs', run_id)
        os.makedirs(run_path, exist_ok=True)
        print(f"📂 Created run directory: {run_path}")

        # Load and save target company data
        with open(target_data_path, 'r') as f:
            target_companies = json.load(f)
            if target_company not in target_companies:
                raise ValueError(f"Target company {target_company} data not found")
            run_data = target_companies[target_company]
            
            # Add project ID to the run data
            run_data['projectId'] = project_id

        run_data_path = os.path.join(run_path, 'run_data.json')
        with open(run_data_path, 'w') as f:
            json.dump(run_data, f, indent=2)
        print(f"💾 Saved target company data to: {run_data_path}")

        # Load and save buying company data
        with open(buying_data_path, 'r') as f:
            buying_companies = json.load(f)
            if buying_company not in buying_companies:
                raise ValueError(f"Buying company {buying_company} data not found")
            buying_data = buying_companies[buying_company]
            print(buying_data)
        buying_data_path = os.path.join(run_path, 'buyingCompanyDataRun.json')
        with open(buying_data_path, 'w') as f:
            json.dump(buying_data, f, indent=2)
        print(f"💾 Saved buying company data to: {buying_data_path}")

        # Update project's application runs index
        project_data.setdefault('applicationRuns', {})
        project_data['applicationRuns'][run_id] = {
            "runId": run_id,
            "displayName": run_display_name,
            "status": "setup_initiated",
            "dateCreated": timestamp_iso,  # Use consistent ISO format timestamp
            "lastModified": timestamp_iso   # Use consistent ISO format timestamp
        }

        # Save updated project data
        with open(base_path, 'w') as f:
            json.dump(all_projects, f, indent=2)

        print(f"✅ Successfully created new run: {run_id}")
        # Return both sets of data with consistent timestamps
        return jsonify({
            "runId": run_id,
            "projectId": project_id,
            "displayName": run_display_name,
            "dateCreated": timestamp_iso,
            "targetCompanyData": run_data,
            "buyingData": buying_data
        })

    except Exception as e:
        print(f"❌ Error creating new run: {str(e)}")
        return jsonify({'error': str(e)}), 500
 
 
 
@main_blueprint.route('/api/projects/<project_id>/runs/<run_id>/toggle_regional_blocks', methods=['POST'])
def toggle_regional_blocks(project_id, run_id):
    try:
        print(f"🔄 Processing presence updates for project: {project_id}, run: {run_id}")
        
        request_data = request.get_json()
        changes = request_data.get('changes', [])
        print(f"📥 Received {len(changes)} presence changes")

        # First load the main projects file to get the buying company
        base_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'MergerControlDataPackages',
            'mergerControlProjects.json'
        ))

        # Load projects data to get buying company
        with open(base_path, 'r') as f:
            all_projects = json.load(f)
            project_data = all_projects['projects'].get(project_id)
            if not project_data:
                raise ValueError(f"Project {project_id} not found")
            
            buying_company = project_data['buyingCompany']
            print(f"📊 Found buying company: {buying_company}")

        # Now load run data with correct buying company in path
        run_data_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'MergerControlDataPackages',
            buying_company,  # Use buying company instead of hardcoded 'artemis'
            project_id,
            'application_runs',
            run_id,
            'run_data.json'
        ))

        # Load and preserve existing data
        print(f"📝 Loading current run data from: {run_data_path}")
        with open(run_data_path, 'r') as f:
            run_data = json.load(f)
            
        # Get regional_blocks from root level
        regional_blocks = run_data.get('regional_blocks', {})
            
            
            
            
            
            
      

        # Process presence changes
        for change in changes:
            block_key = change['block_key']
            member_state_key = change['member_state_key']
            new_presence = change['presence']

            print(f"⚡ Processing presence change - Block: {block_key}, State: {member_state_key}, New Presence: {new_presence}")

            # Skip template
            if block_key == 'template':
                continue

            # Keep existing block if it exists, or create new one preserving the structure
            if block_key not in regional_blocks:
                if new_presence:
                    print(f"📝 Adding new block: {block_key}")
                    regional_blocks[block_key] = {
                        'presence': True,
                        'block_metrics': {
                            'revenue': None,
                            'revenue_formatted': None,
                            'employees': None,
                            'assets': None,
                            'registered_office': None,
                            'aggregated_market_share': None
                        },
                        'member_states': {}
                    }

            if block_key in regional_blocks:
                block = regional_blocks[block_key]
                member_states = block.get('member_states', {})

                # Just update presence for existing state
                if member_state_key in member_states:
                    print(f"🔄 Updating presence for existing state: {member_state_key}")
                    member_states[member_state_key]['presence'] = new_presence
                # Create new state if needed
                elif new_presence:
                    print(f"📝 Adding new state: {member_state_key}")
                    # Copy structure from template if it exists
                    if 'template' in regional_blocks['template']['member_states']:
                        member_states[member_state_key] = copy.deepcopy(
                            regional_blocks['template']['member_states']['template']
                        )
                        member_states[member_state_key]['presence'] = True
                    else:
                        member_states[member_state_key] = {
                            'presence': True,
                            'metrics': {
                                'revenue': None,
                                'employees': None,
                                'assets': None
                            },
                            'market_shares': {},
                            'merger_control_info': {
                                'filing_required': None,
                                'thresholds': {
                                    'revenue': None,
                                    'market_share': None
                                },
                                'review_period_days': None
                            }
                        }

        # Update block presence based on member states
        for block_key, block_data in regional_blocks.items():
            if block_key != 'template':
                has_active_states = any(
                    state.get('presence', False) 
                    for state in block_data.get('member_states', {}).values()
                    if isinstance(state, dict)  # Skip template
                )
                block_data['presence'] = has_active_states

        # Update run_data and save
        run_data['regional_blocks'] = regional_blocks
        
        current_time = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
        run_data['lastModified'] = current_time

        print(f"💾 Saving presence updates to: {run_data_path}")
        with open(run_data_path, 'w') as f:
            json.dump(run_data, f, indent=2)

        print(f"✅ Successfully updated presence states")
        return jsonify({
            'success': True,
            'message': "Successfully updated presence states",
            'data': run_data
        })

    except Exception as e:
        print(f"❌ Error updating presence states: {str(e)}")
        traceback.print_exc()
        return jsonify(error=str(e)), 500
 
 
 
 
 






@main_blueprint.route('/api/projects/<project_id>/runs/<run_id>/update_member_state_data', methods=['POST'])
def update_member_state_data(project_id, run_id):
    try:
        print(f"\n🚀 STARTING UPDATE PROCESS")
        print(f"📋 Project: {project_id}, Run: {run_id}")
        
       
        print(f"🔄 Processing metrics updates for project: {project_id}, run: {run_id}")
        
        request_data = request.get_json()
        changes = request_data.get('changes', [])
        print(f"📥 Received {len(changes)} presence changes")

        # First load the main projects file to get the buying company
        base_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'MergerControlDataPackages',
            'mergerControlProjects.json'
        ))

        # Load projects data to get buying company
        with open(base_path, 'r') as f:
            all_projects = json.load(f)
            project_data = all_projects['projects'].get(project_id)
            if not project_data:
                raise ValueError(f"Project {project_id} not found")
            
            buying_company = project_data['buyingCompany']
            print(f"📊 Found buying company: {buying_company}")

        # Now load run data with correct buying company in path
        run_data_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'MergerControlDataPackages',
            buying_company,  # Use buying company instead of hardcoded 'artemis'
            project_id,
            'application_runs',
            run_id,
            'run_data.json'
        ))

      
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       

        print(f"\n📝 Loading existing run data from: {run_data_path}")
        with open(run_data_path, 'r') as f:
            run_data = json.load(f)

        # Get updates and regional_blocks from root level
        updates = request_data.get('updates', {})
        regional_blocks = run_data.get('regional_blocks', {})

        # Process each update individually
        for region_key, region_updates in updates.items():
            region = regional_blocks.get(region_key)  # Changed from targetCompanyData
            if not region:
                continue

            for state_key, state_updates in region_updates.items():
                state = region.get('member_states', {}).get(state_key)
                if not state or not state.get('presence', False):
                    continue

                print(f"\n🔄 Processing update for {region_key}/{state_key}")
                
                # Handle metrics updates one at a time
                if 'metrics' in state_updates:
                    update_metrics = state_updates['metrics']
                    # Ensure metrics structure exists
                    if 'metrics' not in state:
                        state['metrics'] = {}
                    
                    # Process each metric individually
                    for metric_key in ['revenue', 'employees', 'assets', 'transaction_size']:
                        if metric_key in update_metrics:
                            print(f"  📊 Updating {metric_key}: {update_metrics[metric_key]}")
                            print(f"  📊 Previous value: {state['metrics'].get(metric_key)}")
                            state['metrics'][metric_key] = update_metrics[metric_key]
                            print(f"  📊 New value: {state['metrics'][metric_key]}")

                # Handle market shares updates
                if 'market_shares' in state_updates and region_key != 'united_states':
                    update_shares = state_updates['market_shares']
                    # Ensure market_shares structure exists
                    if 'market_shares' not in state:
                        state['market_shares'] = {}
                    
                    if 'clinical_software' in update_shares:
                        print(f"  📈 Updating market share: {update_shares['clinical_software']}")
                        print(f"  📈 Previous value: {state['market_shares'].get('clinical_software')}")
                        state['market_shares']['clinical_software'] = update_shares['clinical_software']
                        print(f"  📈 New value: {state['market_shares']['clinical_software']}")

        # Put updated blocks back into run_data
        run_data['regional_blocks'] = regional_blocks
        
        # Update timestamp
        run_data['lastModified'] = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

        # Create backup
        backup_path = f"{run_data_path}.bak"
        if os.path.exists(run_data_path):
            with open(run_data_path, 'r') as source:
                with open(backup_path, 'w') as target:
                    json.dump(json.load(source), target, indent=2)

        # Save updated file
        print(f"\n💾 Saving updates to: {run_data_path}")
        with open(run_data_path, 'w') as f:
            json.dump(run_data, f, indent=2)

        print(f"\n✅ Successfully saved updates")
        return jsonify({
            'success': True,
            'message': "Successfully updated worksheet data",
            'data': run_data
        })

    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        traceback.print_exc()
        return jsonify(error=str(e)), 500











@main_blueprint.route('/api/litigation/cases', methods=['GET'])
def get_litigation_cases():
    try:
        # Get path to litigation packages
        base_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'PaceLitigationPackages'
        ))
        
        if not os.path.exists(base_path):
            return jsonify({
                'error': 'Litigation directory not found',
                'status': 'error'
            }), 404

        # Get all JSON files in directory
        json_files = [f for f in os.listdir(base_path) if f.endswith('.json')]
        
        if not json_files:
            return jsonify({
                'message': 'No litigation cases found',
                'data': [],
                'status': 'success'
            }), 200

        cases = []
        for json_file in json_files:
            try:
                file_path = os.path.join(base_path, json_file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    case_data = json.load(f)
                    cases.append(case_data)
            except json.JSONDecodeError as e:
                print(f"Error reading {json_file}: {str(e)}")
                continue
            except Exception as e:
                print(f"Unexpected error reading {json_file}: {str(e)}")
                continue

        # Optional query parameters for filtering
        filters = {
            'jurisdiction': request.args.get('jurisdiction'),
            'status': request.args.get('status'),
            'disease': request.args.get('disease')
        }

        # Apply filters if they exist
        filtered_cases = filter_cases(cases, filters)

        return jsonify({
            'data': filtered_cases,
            'total': len(filtered_cases),
            'status': 'success'
        }), 200

    except Exception as e:
        print(f"Error getting litigation cases: {str(e)}")
        return jsonify(error=str(e)), 500

def filter_cases(cases, filters):
    """Filter cases based on query parameters"""
    filtered = cases
    
    if filters['jurisdiction']:
        filtered = [
            case for case in filtered 
            if any(
                lawsuit.get('lawsuit_jurisdiction') == filters['jurisdiction']
                for lawsuit in case.get('lawsuit_service', [])
            )
        ]
    
    if filters['disease']:
        filtered = [
            case for case in filtered 
            if any(
                any(
                    diagnosis.get('diagnosis_disease_name') == filters['disease']
                    for diagnosis in injured_party.get('diagnosis', [])
                )
                for lawsuit in case.get('lawsuit_service', [])
                for injured_party in lawsuit.get('injured_party', [])
            )
        ]
    
    if filters['status']:
        filtered = [
            case for case in filtered 
            if any(
                calculate_status(lawsuit.get('lawsuit_answer_due_date')) == filters['status']
                for lawsuit in case.get('lawsuit_service', [])
            )
        ]
    
    return filtered

def calculate_status(due_date):
    """Calculate status based on due date"""
    from datetime import datetime
    if not due_date:
        return 'PENDING'
    
    try:
        due = datetime.strptime(due_date, '%m/%d/%Y')
        days_until_due = (due - datetime.now()).days
        
        if days_until_due < 0:
            return 'OVERDUE'
        if days_until_due <= 7:
            return 'URGENT'
        return 'ACTIVE'
    except ValueError:
        return 'PENDING'







@main_blueprint.route('/api/projects/<project_id>/runs/<run_id>', methods=['GET'])
def get_run(project_id, run_id):
    try:
        print(f"🔍 Fetching run data for project: {project_id}, run: {run_id}")
        
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

        # Load projects data to get company info
        with open(base_path, 'r') as f:
            all_projects = json.load(f)
            project_data = all_projects['projects'].get(project_id)
            if not project_data:
                raise ValueError(f"Project {project_id} not found")
            
            buying_company = project_data['buyingCompany']
            print(f"📊 Found buying company: {buying_company}")

        # Get path to run data
        project_dir = os.path.join(os.path.dirname(base_path), buying_company.lower(), project_id)
        run_path = os.path.join(project_dir, 'application_runs', run_id)
        run_data_path = os.path.join(run_path, 'run_data.json')
        buying_data_path = os.path.join(run_path, 'buyingCompanyDataRun.json')

        print(f"📁 Loading run data from: {run_data_path}")

        # Load run data
        with open(run_data_path, 'r') as f:
            run_data = json.load(f)

      

        # Construct response with all necessary data
        response_data = {
            "runId": run_id,
            "projectId": project_id,
            "displayName": project_data['applicationRuns'][run_id]['displayName'],
            "dateCreated": project_data['applicationRuns'][run_id]['dateCreated'],
            "lastModified": project_data['applicationRuns'][run_id]['lastModified'],
            "buyingCompany": buying_company,
            "targetCompanyData": run_data,
           
            "status": project_data['applicationRuns'][run_id]['status']
        }

        print(f"✅ Successfully retrieved run data")
        print(run_data)
        return jsonify(response_data)

    except FileNotFoundError as e:
        print(f"❌ File not found error: {str(e)}")
        return jsonify(error=f"Could not find required file: {str(e)}"), 404
    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error: {str(e)}")
        return jsonify(error="Invalid JSON data encountered"), 400
    except Exception as e:
        print(f"❌ Error retrieving run data: {str(e)}")
        return jsonify(error=str(e)), 500





@main_blueprint.route('/api/projects/<project_id>/runs/<run_id>/buying_data', methods=['GET'])
def get_buying_data(project_id, run_id):
    try:
        print(f"🔍 Fetching buying data for project: {project_id}, run: {run_id}")
        
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

        # Load projects data to get company info
        with open(base_path, 'r') as f:
            all_projects = json.load(f)
            project_data = all_projects['projects'].get(project_id)
            if not project_data:
                raise ValueError(f"Project {project_id} not found")
            
            buying_company = project_data['buyingCompany']
            print(f"📊 Found buying company: {buying_company}")

        # Get path to run data
        project_dir = os.path.join(os.path.dirname(base_path), buying_company.lower(), project_id)
        run_path = os.path.join(project_dir, 'application_runs', run_id)
     
        buying_data_path = os.path.join(run_path, 'buyingCompanyDataRun.json')

        print(f"📁 Loading buying data from: {buying_data_path}")

    
    

        # Load buying company data
        with open(buying_data_path, 'r') as f:
            buying_data = json.load(f)

        # Construct response with all necessary data
        response_data = {
            "runId": run_id,
            "projectId": project_id,
            "displayName": project_data['applicationRuns'][run_id]['displayName'],
            "dateCreated": project_data['applicationRuns'][run_id]['dateCreated'],
            "lastModified": project_data['applicationRuns'][run_id]['lastModified'],
            "buyingCompany": buying_company,
         
            "buyingCompanyData": buying_data,
            "status": project_data['applicationRuns'][run_id]['status']
        }

        print(f"✅ Successfully retrieved buying company data")
        print(buying_data)
        return jsonify(response_data)

    except FileNotFoundError as e:
        print(f"❌ File not found error: {str(e)}")
        return jsonify(error=f"Could not find required file: {str(e)}"), 404
    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error: {str(e)}")
        return jsonify(error="Invalid JSON data encountered"), 400
    except Exception as e:
        print(f"❌ Error retrieving run data: {str(e)}")
        return jsonify(error=str(e)), 500








# Inside main_routes.py

@main_blueprint.route('/api/funds/registry', methods=['GET'])
def get_fund_registry():
    try:
        print("🔍 Fetching fund registry data")
        
        # Build path to registry file
        base_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'FundDataPackages',
            'fund_registry.json'
        ))
        
        print(f"📁 Loading registry from: {base_path}")
        
        with open(base_path, 'r') as f:
            registry = json.load(f)
        return jsonify(registry)
    except FileNotFoundError as e:
        print(f"❌ Registry file not found: {e}")
        return jsonify({"error": "Registry not found"}), 404
    except json.JSONDecodeError as e:
        print(f"❌ Invalid registry format: {e}")
        return jsonify({"error": "Invalid registry format"}), 500

@main_blueprint.route('/api/funds/<frn>', methods=['GET'])
def get_fund_data(frn):
    try:
        print(f"🔍 Fetching data for fund FRN: {frn}")
        
        # Build path to registry file
        base_path = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'FundDataPackages',
            'fund_registry.json'
        ))
        
        # Load registry to get file path
        with open(base_path, 'r') as f:
            registry = json.load(f)
        
        if frn not in registry['firms']:
            print(f"❌ Fund {frn} not found in registry")
            return jsonify({"error": "Fund not found"}), 404
            
        fund_file = registry['firms'][frn]['dataFile']
        
        # Build path to individual fund file
        fund_data_path = os.path.join(
            os.path.dirname(base_path),
            'FundDetails',
            fund_file
        )
        
        print(f"📁 Loading fund data from: {fund_data_path}")
        
        # Load individual fund data
        with open(fund_data_path, 'r') as f:
            fund_data = json.load(f)
            
        return jsonify(fund_data)
    except FileNotFoundError as e:
        print(f"❌ File not found: {e}")
        return jsonify({"error": "Data not found"}), 404
    except json.JSONDecodeError as e:
        print(f"❌ Invalid data format: {e}")
        return jsonify({"error": "Invalid data format"}), 500












@main_blueprint.route('/api/funds/query/general-details', methods=['POST'])
def query_fund_details():
    try:
        data = request.get_json()
        print(f"🔍 Processing query request for funds: {data['funds']}")

        # Build path to FundDetails directory using the same pattern
        base_dir = os.path.abspath(os.path.join(
            current_app.root_path,
            '..',
            '..',
            'static',
            'data',
            'FundDataPackages',
            'FundDetails'
        ))
        
        print(f"📁 Target directory: {base_dir}")
        
        # Create directory if it doesn't exist
        os.makedirs(base_dir, exist_ok=True)
        
        results = []
        for frn in data['funds']:
            # Construct FCA API URL
            url = f"https://register.fca.org.uk/services/V0.1/Firm/{frn}"
            
            headers = {
                'x-auth-email': 'rreynolds@tangiblelabs.ai',
                'x-auth-key': '6085d3802c5a4a255e38fb30b914899a',
                'Content-Type': 'application/json'
            }
            
            print(f"📤 Requesting details for FRN: {frn}")
            response = requests.get(url, headers=headers)
            
            if response.ok:
                print(f"✅ Received data for FRN: {frn}")
                fund_data = response.json()
                
                # Debug the response structure
                print(f"📊 Response structure: {json.dumps(fund_data, indent=2)}")
                
                # Extract organization name from Data[0]
                org_name = fund_data['Data'][0]['Organisation Name']
                first_word = org_name.split()[0].lower()
                filename = f"{first_word}_{frn}.json"
                
                # Construct full file path
                file_path = os.path.join(base_dir, filename)
                print(f"📝 Writing to: {file_path}")
                
                # Save the data to a JSON file
                print(f"💾 Saving fund details to {filename}")
                with open(file_path, 'w') as f:
                    json.dump(fund_data, f, indent=2)
                
                results.append(fund_data)
            else:
                print(f"❌ Error fetching FRN {frn}: {response.status_code}")
            
        return jsonify({
            'status': 'success',
            'results': results
        })
        
    except Exception as e:
        print(f"❌ Error processing query: {str(e)}")
        print(f"Full error details: ", str(e.__class__), str(e))
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
