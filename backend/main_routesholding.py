from flask import Blueprint, render_template, send_from_directory

main_blueprint = Blueprint('main', __name__)


@main_blueprint.route('/')
def index():
    print(f"Accessing index route")  # Debug print
    return render_template('views/foundrywelcome/indexLaunch.html')

@main_blueprint.route('/application_groups/static/<path:filename>')
def serve_static_files(filename):
    return send_from_directory('app/application_groups/static', filename)

@main_blueprint.route('/application_groups/<section>/application_group_root/static/data/<path:filename>')
def serve_section_data(section, filename):
    return send_from_directory(f'app/application_groups/{section}/application_group_root/static/data', filename)

@main_blueprint.route('/application_groups/<section>/applications/<programID>/static/js/<path:filename>')
def serve_program_js(section, programID, filename):
    return send_from_directory(f'app/application_groups/{section}/applications/{programID}/static/js', filename)

@main_blueprint.route('/application_groups/<section>/applications/<programID>/static/css/<path:filename>')
def serve_program_css(section, programID, filename):
    return send_from_directory(f'app/application_groups/{section}/applications/{programID}/static/css', filename)

@main_blueprint.route('/application_groups/static/shared/<path:filename>')
def serve_shared_files(filename):
    return send_from_directory('app/application_groups/static/shared', filename)

@main_blueprint.route('/application_groups/static/shared/prototype/static/js/<path:filename>')
def serve_shared_prototype_js(filename):
    return send_from_directory('app/application_groups/static/shared/prototype/static/js', filename)

@main_blueprint.route('/application_groups/static/shared/prototype/static/css/<path:filename>')
def serve_shared_prototype_css(filename):
    return send_from_directory('app/application_groups/static/shared/prototype/static/css', filename)

@main_blueprint.route('/application_groups/static/shared/table/static/data/<path:filename>')
def serve_table_data(filename):
    return send_from_directory('app/application_groups/static/shared/table/static/data', filename)

@main_blueprint.route('/application_groups/static/shared/table/static/css/<path:filename>')
def serve_table_css(filename):
    return send_from_directory('app/application_groups/static/shared/table/static/css', filename)

@main_blueprint.route('/application_groups/static/shared/table/static/js/<path:filename>')
def serve_table_js(filename):
    return send_from_directory('app/application_groups/static/shared/table/static/js', filename)


@main_blueprint.route('/application_groups/static/shared/dashboardreporting/static/data/<path:filename>')
def serve_dashboardreporting_data(filename):
    return send_from_directory('app/application_groups/static/shared/dashboardreporting/static/data', filename)

@main_blueprint.route('/application_groups/static/shared/dashboardreporting/static/css/<path:filename>')
def serve_dashboardreporting_css(filename):
    return send_from_directory('app/application_groups/static/shared/dashboardreporting/static/css', filename)

@main_blueprint.route('/application_groups/static/shared/dashboardreporting/static/js/<path:filename>')
def serve_dashboardreporting_js(filename):
    return send_from_directory('app/application_groups/static/shared/dashboardreporting/static/js', filename)

