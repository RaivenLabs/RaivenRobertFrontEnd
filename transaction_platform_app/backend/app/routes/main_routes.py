from flask import Blueprint, render_template, send_from_directory, g, request, session, send_file, abort, json, jsonify, current_app

import json
import shutil
import boto3

import os


from pathlib import Path
from ..auth.auth_engine import login_required  # Add this import

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





















@main_blueprint.route('/api/check_app_id', methods=['POST'])
def check_app_id():
    data = request.json
    app_id = data['appId']
    
    try:
        json_path = os.path.join(
            current_app.root_path,
             '..',                   # Up to backend
                '..',                   # Up to transaction_platform_app
                'static',
                'data',
            'sandbox_programs.json'
        )
        
        with open(json_path, 'r') as f:
            sandbox_data = json.load(f)
        
        exists = False
        for group in sandbox_data['program_groups']:
            if any(p['id'] == app_id for p in group['programs']):
                exists = True
                break
        
        return jsonify({'exists': exists})
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@main_blueprint.route('/api/create_application', methods=['POST'])
def create_application():
    data = request.json
    app_name = data['appName']
    app_id = data['appId']
    app_group = data['appGroup']
    program_data = data['programData']
    
    try:
        # Your existing create_application logic here, but return JSON instead of rendering templates
        return jsonify({
            'success': True,
            'message': f'Application "{app_name}" created successfully with ID: {app_id}'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# S3 Routes
@main_blueprint.route('/api/s3/upload', methods=['POST'])
def upload_file():
    try:
        files = request.files.getlist('files')
        uploaded_files = []

        for file in files:
            if file:
                try:
                    s3_client.upload_fileobj(
                        file,
                        S3_BUCKET,
                        file.filename
                    )
                    uploaded_files.append({
                        'name': file.filename,
                        'status': 'success'
                    })
                except ClientError as e:
                    uploaded_files.append({
                        'name': file.filename,
                        'status': 'error',
                        'error': str(e)
                    })

        return jsonify({
            'success': True,
            'files': uploaded_files
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@main_blueprint.route('/api/s3/list', methods=['GET'])
def list_files():
    try:
        response = s3_client.list_objects_v2(Bucket=S3_BUCKET)
        
        files = []
        if 'Contents' in response:
            for obj in response['Contents']:
                file_metadata = s3_client.head_object(
                    Bucket=S3_BUCKET,
                    Key=obj['Key']
                )
                
                files.append({
                    'name': obj['Key'],
                    'size': obj['Size'],
                    'last_modified': obj['LastModified'].isoformat(),
                    'content_type': file_metadata.get('ContentType', 'application/octet-stream')
                })

        return jsonify({
            'success': True,
            'files': files
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@main_blueprint.route('/api/s3/delete/<path:filename>', methods=['DELETE'])
def delete_file(filename):
    try:
        s3_client.delete_object(
            Bucket=S3_BUCKET,
            Key=filename
        )
        
        return jsonify({
            'success': True,
            'message': f'File {filename} deleted successfully'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
        
        
        
import boto3
from flask import jsonify, current_app
import os
import json

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
        current_app.logger.error(f"Error loading Rapid Review program data: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@main_blueprint.route('/api/programs/rapidreview', methods=['GET'])
def get_rapidreview_programshold():
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
                'rapidreview_programs.json'
            ))
            print(f"Attempting to read from path: {json_path}")  # Debug print
            with open(json_path, 'r') as f:
                programs_data = json.load(f)
        else:
            # S3 path for production
            s3_client = boto3.client('s3')
            response = s3_client.get_object(
                Bucket='juniperproductiondata',
                Key='data/programs/rapidreview_programs.json'
            )
            programs_data = json.loads(response['Body'].read().decode('utf-8'))
            
        return jsonify(programs_data)
        
    except Exception as e:
        current_app.logger.error(f"Error loading Rapid Review program data: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
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







@main_blueprint.route('/api/programs/launch/<program_id>', methods=['POST'])
def launch_program(program_id):
    try:
        # Here you would handle the program launch logic
        # For now, just return success
        return jsonify({
            'success': True,
            'message': f'Program {program_id} launched successfully',
            'program_id': program_id
        })
    except Exception as e:
        current_app.logger.error(f"Error launching program {program_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
        





    
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
                Key='configs/customerInstances.json'
            )
            config_data = json.loads(response['Body'].read().decode('utf-8'))
        
        return jsonify(config_data)
        
    except Exception as e:
        current_app.logger.error(f"Error loading customer instances: {str(e)}")
        return jsonify({'error': str(e)}), 500
