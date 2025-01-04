# backend/app/consoles/speakeasy/routes/questions.py
from flask import Blueprint, jsonify, current_app, request
import os
import json
import random

speakeasy_routes = Blueprint('speakeasy', __name__)

@speakeasy_routes.route('/api/speakeasy/questions', methods=['GET'])
def get_questions():
    try:
        # Debug print the current path
        print(f"Current app root path: {current_app.root_path}")
        
        json_path = os.path.join(
            current_app.root_path,
            'app',
            'consoles',
            'speakeasy',
            'data',
            'sesamepairs.json'
        )
        
        # Debug print the constructed path
        print(f"Looking for questions file at: {json_path}")
        print(f"File exists: {os.path.exists(json_path)}")
        
        with open(json_path, 'r') as f:
            all_questions = json.load(f)
            
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
