# utils/storage_sync.py
import boto3
import os
import json

class StorageManager:
    def __init__(self, use_s3=True):
        self.use_s3 = use_s3
        self.s3_client = boto3.client('s3')
        self.bucket = os.environ.get('S3_BUCKET')
        self.local_data_path = 'app/static/data'

    def sync_to_s3(self):
        """Sync local files to S3"""
        for file in os.listdir(self.local_data_path):
            if file.endswith('.json'):
                local_path = os.path.join(self.local_data_path, file)
                s3_key = f'data/{file}'
                self.s3_client.upload_file(local_path, self.bucket, s3_key)

    def sync_from_s3(self):
        """Sync S3 files to local"""
        paginator = self.s3_client.get_paginator('list_objects_v2')
        for page in paginator.paginate(Bucket=self.bucket, Prefix='data/'):
            for obj in page.get('Contents', []):
                local_file = os.path.join(self.local_data_path, 
                                        os.path.basename(obj['Key']))
                self.s3_client.download_file(self.bucket, obj['Key'], local_file)

    def get_data(self, filename):
        """Get data from either S3 or local based on toggle"""
        if self.use_s3:
            response = self.s3_client.get_object(
                Bucket=self.bucket,
                Key=f'data/{filename}'
            )
            return json.loads(response['Body'].read())
        else:
            with open(os.path.join(self.local_data_path, filename), 'r') as f:
                return json.load(f)
