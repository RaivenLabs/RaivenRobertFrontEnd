# routes.py
from flask import send_from_directory, render_template, request, Blueprint
import os

main = Blueprint('main', __name__, template_folder='templates')

# Home route to serve the index.html page
@main.route('/')
def home():
    return render_template('views/dashboard/index.html')

# Static file serving routes
@main.route('/application_groups/static/<path:filename>')
def serve_static_files(filename):
    return send_from_directory('app/application_groups/static', filename)

@main.route('/application_groups/static/shared/<path:filename>')
def serve_shared_files(filename):
    return send_from_directory('app/application_groups/static/shared', filename)

@main.route('/application_groups/<section>/application_group_root/static/data/<path:filename>')
def serve_section_data(section, filename):
    return send_from_directory(f'app/application_groups/{section}/application_group_root/static/data', filename)

@main.route('/application_groups/<section>/applications/<programID>/static/js/<path:filename>')
def serve_program_js(section, programID, filename):
    return send_from_directory(f'app/application_groups/{section}/applications/{programID}/static/js', filename)

@main.route('/application_groups/<section>/applications/<programID>/static/css/<path:filename>')
def serve_program_css(section, programID, filename):
    return send_from_directory(f'app/application_groups/{section}/applications/{programID}/static/css', filename)
