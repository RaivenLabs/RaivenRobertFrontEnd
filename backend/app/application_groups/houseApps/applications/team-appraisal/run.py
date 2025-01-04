from flask import Flask, render_template, jsonify, request, send_from_directory
import json
import os
from datetime import datetime

# Path configurations using absolute paths
# Path configurations using absolute paths
current_dir = os.path.abspath(__file__)  # Get the current file's path
parent_dirs = [
    'Team Appraisal',
    'applications',
    'houseapps',
    'application_groups',
  
]

# Climb up through each parent directory
BASE_DIR = os.path.dirname(current_dir)  # Start at current directory
for _ in parent_dirs:
    BASE_DIR = os.path.dirname(BASE_DIR)  # Go up one level for each parent

# Now we're at the 'app' directory, which is where we want to be
PLATFORM_STATIC = os.path.join(BASE_DIR, 'static')  # No need to add 'app' since we're already there
APP_STATIC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'appstatic')
DATA_DIR = os.path.join(APP_STATIC, 'data', 'appraisal_sample_data.js')
APP_STATIC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'appstatic')
DATA_DIR = os.path.join(APP_STATIC, 'data', 'appraisal_sample_data.js')
CSS_DIR = os.path.join(APP_STATIC, 'css', 'appraisal.css')
# Add debug prints
print(f"__file__: {__file__}")
print(f"BASE_DIR: {BASE_DIR}")
print(f"APP_STATIC: {APP_STATIC}")
print(f"DATA_DIR: {DATA_DIR}")
print(f"CSS_DIR: {CSS_DIR}")







# Let's add some debug prints to verify:
print(f"__file__: {__file__}")
print(f"BASE_DIR: {BASE_DIR}")
print(f"PLATFORM_STATIC: {PLATFORM_STATIC}")




# Initialize Flask with platform-wide static folder
app = Flask(__name__,
    static_folder=PLATFORM_STATIC,
    static_url_path='/static')

# Register app-specific static files
@app.route('/appstatic/<path:filename>')
def app_static_files(filename):
    return send_from_directory(APP_STATIC, filename)

def load_sample_data():
    """Load sample data from the specified path."""
    try:
        with open(DATA_DIR, 'r') as file:
            # Skip the first line which contains the JS variable declaration
            content = file.readlines()[1:]
            # Join the remaining lines and parse as JSON
            json_content = ''.join(content).strip().rstrip(';')
            return json.loads(json_content)
    except FileNotFoundError:
        print(f"Warning: Could not find sample data file at {DATA_DIR}")
        return {"recipients": [], "metadata": {}, "filters": {}}
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON from sample data: {e}")
        return {"recipients": [], "metadata": {}, "filters": {}}








# ============================================================================
# Route: Main Application Entry Point
# MIGRATION NOTE: This will be handled by your base_handler.js in main app
# ============================================================================
@app.route('/')
def index():
    """Entry point for the Team Appraisal Service."""
    return render_template('index.html')
# Update the sample data route to use app_static_files

@app.route('/static/data/appraisal_sample_data.js')
def get_sample_data():
    """Serve the sample data file for development."""
    return send_from_directory(os.path.join(APP_STATIC, 'data'), 'appraisal_sample_data.js')




# ============================================================================
# Route: Get Appraisal Recipients
# MIGRATION NOTE: Move to routes.py under /applications/team_appraisal/recipients
# ============================================================================
@app.route('/api/recipients', methods=['GET'])
def get_recipients():
    """Get all appraisal recipients with optional filtering."""
    role = request.args.get('role')
    department = request.args.get('department')
    
    data = load_sample_data()
    recipients = data['recipients']
    
    if role:
        recipients = [r for r in recipients if r['role'] == role]
    if department:
        recipients = [r for r in recipients if r['department'] == department]
        
    return jsonify(recipients)

# ============================================================================
# Route: Update Recipient Status
# MIGRATION NOTE: Move to routes.py under /applications/team_appraisal/status
# ============================================================================
@app.route('/api/recipients/<record_id>/status', methods=['PUT'])
def update_status(record_id):
    """Update the status of a specific recipient."""
    new_status = request.json.get('status')
    # In real app, this would update database
    return jsonify({'success': True, 'record_id': record_id, 'new_status': new_status})

# ============================================================================
# Route: Send Appraisal
# MIGRATION NOTE: Move to routes.py under /applications/team_appraisal/send
# ============================================================================
@app.route('/api/send-appraisal', methods=['POST'])
def send_appraisal():
    """Send appraisal to selected recipients."""
    recipient_ids = request.json.get('recipient_ids', [])
    # In real app, this would trigger email service
    return jsonify({
        'success': True,
        'sent_to': recipient_ids,
        'timestamp': datetime.now().isoformat()
    })

# ============================================================================
# Route: Get Filters
# MIGRATION NOTE: Move to routes.py under /applications/team_appraisal/filters
# ============================================================================
@app.route('/api/filters', methods=['GET'])
def get_filters():
    """Get available filter options."""
    data = load_sample_data()
    return jsonify({
        'roles': data['filters']['roles'],
        'departments': data['filters']['departments'],
        'statuses': data['filters']['statuses']
    })

# ============================================================================
# Route: Get Dashboard Stats
# MIGRATION NOTE: Move to routes.py under /applications/team_appraisal/stats
# ============================================================================
@app.route('/api/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    """Get statistics for the dashboard."""
    data = load_sample_data()
    # In real app, this would calculate real-time stats
    return jsonify({
        'total_pending': len([r for r in data['recipients'] if r['status'] == 'Pending']),
        'total_sent': len([r for r in data['recipients'] if r['status'] == 'Sent']),
        'total_completed': len([r for r in data['recipients'] if r['status'] == 'Completed'])
    })

@app.route('/health')
def health_check():
    """Simple health check to verify app is running."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'data_file_exists': os.path.exists(DATA_DIR)
    })

if __name__ == '__main__':
    app.run(debug=True)