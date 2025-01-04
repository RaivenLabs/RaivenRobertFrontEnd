# s3_blueprint.py
from flask import Blueprint, request, jsonify, current_app
import boto3
from botocore.exceptions import ClientError
from functools import wraps
import os
from datetime import datetime
import mimetypes
import uuid

s3_blueprint = Blueprint('s3', __name__)

# Initialize S3 client using environment variables
def get_s3_client():
    return boto3.client('s3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('AWS_REGION')
    )

# Configuration
BUCKET_NAME = os.getenv('S3_BUCKET_NAME', 'transactionplatform')
UPLOAD_FOLDER = 'uploads/'
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Utility functions
def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Add your authentication logic here
        # For now, just passing through
        return f(*args, **kwargs)
    return decorated

def validate_file_type(filename):
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'xlsx', 'xls'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_unique_filename(original_filename):
    """Generate a unique filename while preserving the original extension"""
    ext = os.path.splitext(original_filename)[1]
    return f"{uuid.uuid4()}{ext}"

# Routes
@s3_blueprint.route('/api/s3/upload', methods=['POST'])
@require_auth
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Validate file type
        if not validate_file_type(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400

        # Check file size
        file.seek(0, os.SEEK_END)
        size = file.tell()
        if size > MAX_FILE_SIZE:
            return jsonify({'error': 'File too large'}), 400
        file.seek(0)

        # Generate unique filename
        unique_filename = generate_unique_filename(file.filename)
        file_path = f"{UPLOAD_FOLDER}{unique_filename}"

        # Get content type
        content_type = mimetypes.guess_type(file.filename)[0] or 'application/octet-stream'

        # Upload to S3
        s3_client = get_s3_client()
        s3_client.upload_fileobj(
            file,
            BUCKET_NAME,
            file_path,
            ExtraArgs={
                'ContentType': content_type,
                'Metadata': {
                    'original_filename': file.filename,
                    'upload_date': datetime.utcnow().isoformat()
                }
            }
        )

        return jsonify({
            'success': True,
            'message': 'File uploaded successfully',
            'path': file_path,
            'original_filename': file.filename
        })

    except ClientError as e:
        current_app.logger.error(f"S3 upload error: {str(e)}")
        return jsonify({'error': 'Failed to upload file to S3'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error during upload: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@s3_blueprint.route('/api/s3/files', methods=['GET'])
@require_auth
def list_files():
    try:
        s3_client = get_s3_client()
        response = s3_client.list_objects_v2(
            Bucket=BUCKET_NAME,
            Prefix=UPLOAD_FOLDER
        )
        
        files = []
        if 'Contents' in response:
            for item in response['Contents']:
                # Get object metadata
                obj = s3_client.head_object(
                    Bucket=BUCKET_NAME,
                    Key=item['Key']
                )
                
                files.append({
                    'key': item['Key'],
                    'size': item['Size'],
                    'last_modified': item['LastModified'].isoformat(),
                    'original_filename': obj.get('Metadata', {}).get('original_filename', item['Key']),
                    'content_type': obj.get('ContentType', 'application/octet-stream')
                })

        return jsonify({'files': files})

    except ClientError as e:
        current_app.logger.error(f"S3 list error: {str(e)}")
        return jsonify({'error': 'Failed to list files'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error listing files: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@s3_blueprint.route('/api/s3/delete', methods=['DELETE'])
@require_auth
def delete_file():
    try:
        file_path = request.json.get('file_path')
        if not file_path:
            return jsonify({'error': 'No file path provided'}), 400

        s3_client = get_s3_client()
        s3_client.delete_object(
            Bucket=BUCKET_NAME,
            Key=file_path
        )

        return jsonify({
            'success': True,
            'message': 'File deleted successfully'
        })

    except ClientError as e:
        current_app.logger.error(f"S3 delete error: {str(e)}")
        return jsonify({'error': 'Failed to delete file'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error deleting file: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@s3_blueprint.route('/api/s3/download/<path:file_path>')
@require_auth
def download_file(file_path):
    try:
        s3_client = get_s3_client()
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': BUCKET_NAME,
                'Key': file_path
            },
            ExpiresIn=3600  # URL expires in 1 hour
        )
        
        return jsonify({'download_url': url})

    except ClientError as e:
        current_app.logger.error(f"S3 download error: {str(e)}")
        return jsonify({'error': 'Failed to generate download link'}), 500
    except Exception as e:
        current_app.logger.error(f"Unexpected error generating download link: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500