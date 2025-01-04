from flask import Blueprint, g, session, request
import json
import os
from functools import wraps

config_blueprint = Blueprint('config', __name__)

class ConfigurationManager:
    def __init__(self):
        self.enterprise_configs = {}
        self.justice_configs = {}
        self.standard_config = {}
        self._load_all_configs()

    def _load_all_configs(self):
        """Load all configurations on initialization"""
        # Get path to the app/config directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        config_dir = os.path.join(current_dir, 'app', 'config')
        
        print(f"Loading configs from: {config_dir}")
        
        # Debug information
        temp_path = os.path.join(config_dir, 'enterprise_customers_config.json')
        print(f"Debug - Looking for enterprise config at: {temp_path}")
        print(f"Debug - File exists: {os.path.exists(temp_path)}")
        
        self._load_customer_configs(config_dir)

    def _load_customer_configs(self, config_dir):
        """Load customer configurations from the config directory"""
        try:
            # Load enterprise configs
            enterprise_path = os.path.join(config_dir, 'enterprise_customers_config.json')
            if os.path.exists(enterprise_path):
                with open(enterprise_path) as f:
                    data = json.load(f)
                    # Convert array of customers to dictionary keyed by identifier
                    self.enterprise_configs = {
                        customer['identifier']: customer 
                        for customer in data.get('customers', [])
                    }
                print(f"Loaded enterprise configs for: {list(self.enterprise_configs.keys())}")
            else:
                print(f"Warning: No enterprise config found at {enterprise_path}")

            # Load justice configs
            justice_path = os.path.join(config_dir, 'justice_customers_config.json')
            if os.path.exists(justice_path):
                with open(justice_path) as f:
                    data = json.load(f)
                    # Convert array of customers to dictionary keyed by identifier
                    self.justice_configs = {
                        customer['identifier']: customer 
                        for customer in data.get('customers', [])
                    }
                print(f"Loaded justice configs for: {list(self.justice_configs.keys())}")
            else:
                print(f"Warning: No justice config found at {justice_path}")

            # Load global/standard config
            standard_path = os.path.join(config_dir, 'global_customers_config.json')
            if os.path.exists(standard_path):
                with open(standard_path) as f:
                    self.standard_config = json.load(f)
                print("Loaded standard config successfully")
            else:
                print(f"Warning: No standard config found at {standard_path}")

        except Exception as e:
            print(f"Error loading configurations: {str(e)}")
            print(f"Current working directory: {os.getcwd()}")
            print(f"Attempted config directory: {config_dir}")
            # Initialize empty configs if loading fails
            self.enterprise_configs = {}
            self.justice_configs = {}
            self.standard_config = {}

    def get_customer_type(self, host):
       
        """
        Determine customer type from domain with detailed debug logging
        """
        print("\n=== CUSTOMER TYPE DETECTION ===")
        print(f"Analyzing host: {host}")
        print(f"Available enterprise configs: {list(self.enterprise_configs.keys())}")
        print(f"Available justice configs: {list(self.justice_configs.keys())}")
        
        # Handle localhost development domains
        if '.localhost:' in host:
            subdomain = host.split('.')[0]
            print(f"Found localhost subdomain: {subdomain}")
            
            # Check enterprise configs
            if subdomain in self.enterprise_configs:
                print(f"✓ Matched {subdomain} to enterprise customer")
                return 'enterprise', subdomain
                
            # Check justice configs    
            if subdomain in self.justice_configs:
                print(f"✓ Matched {subdomain} to justice customer")
                return 'justice', subdomain
                
            print(f"✗ Subdomain {subdomain} not found in any customer configs")
        else:
            print(f"✗ Not a localhost domain: {host}")
        
        # Production domain checks
        if 'enterprise.tangibleinnovations.ai' in host.lower():
            customer_id = host.split('.')[0]
            print(f"Checking enterprise customer: {customer_id}")
            if customer_id in self.enterprise_configs:
                return 'enterprise', customer_id
                
        # Default handlers
        if host in ['localhost:5000', '127.0.0.1:5000', '0.0.0.0:5000']:
            print("✓ Matched standard localhost")
            return 'standard', 'default'
        
        print("✗ Defaulting to standard config")
        print("=== END CUSTOMER TYPE DETECTION ===\n")
        return 'standard', 'default'
        
        
        
       

    def load_config(self, customer_type, identifier):
        """Load specific configuration with debug logging"""
        print(f"\nDEBUG - Loading config for {customer_type}:{identifier}")
        print(f"DEBUG - Standard config: {self.standard_config}")
        
        if customer_type == 'enterprise':
            # Get enterprise config or fall back to standard
            customer_config = self.enterprise_configs.get(identifier)
            print(f"DEBUG - Found enterprise config for {identifier}: {customer_config}")
            
            if customer_config:
                # Merge configs
                merged_config = {**self.standard_config, **customer_config}
                print(f"DEBUG - Config after merge:")
                print(f"- Auth settings: {merged_config.get('auth', {})}")
                print(f"- Features: {merged_config.get('features', {})}")
                print(f"- Template: {merged_config.get('welcome_template')}")
                return merged_config
            
            print("DEBUG - No enterprise config found, using standard")
            return self.standard_config
                
        elif customer_type == 'justice':
            # Get justice config or fall back to standard
            customer_config = self.justice_configs.get(identifier)
            print(f"DEBUG - Found justice config for {identifier}: {customer_config}")
            
            if customer_config:
                # Merge configs
                merged_config = {**self.standard_config, **customer_config}
                print(f"DEBUG - Config after merge:")
                print(f"- Auth settings: {merged_config.get('auth', {})}")
                print(f"- Features: {merged_config.get('features', {})}")
                print(f"- Template: {merged_config.get('welcome_template')}")
                return merged_config
            
            print("DEBUG - No justice config found, using standard")
            return self.standard_config
        
        print("DEBUG - Using standard config (no specific customer type matched)")
        return self.standard_config

    def refresh_configs(self):
        """Refresh all configurations"""
        self._load_all_configs()

# Create global config manager instance
config_manager = ConfigurationManager()

@config_blueprint.before_app_request
def configure_customer():
    """Configure customer before each request"""
    print("\nDebug - Starting configure_customer")
    print(f"Debug - Current session: {dict(session)}")
    
    # Always get fresh config
    customer_type, identifier = config_manager.get_customer_type(request.host)
    print(f"Debug - Detected customer type: {customer_type}, identifier: {identifier}")
    config = config_manager.load_config(customer_type, identifier)
    print(f"Debug - Loaded config: {config}")
    
    # Check if config has changed
    if config != session.get('customer_config'):
        print("Debug - Config changed, updating session")
        session['customer_config'] = config
        session['customer_type'] = customer_type
        session['customer_identifier'] = identifier
    
    # Always set g values for current request
    g.config = config
    g.customer_type = customer_type
    g.customer_identifier = identifier
    
    print(f"Debug - Final g.config: {g.config}")
    print(f"Debug - Final g.customer_type: {g.customer_type}")

@config_blueprint.route('/admin/config/refresh', methods=['POST'])
def refresh_configuration():
    """Admin endpoint to refresh configurations"""
    config_manager.refresh_configs()
    return {'status': 'success', 'message': 'Configurations refreshed'}

@config_blueprint.route('/admin/config/status')
def config_status():
    """Admin endpoint to check configuration status"""
    return {
        'enterprise_customers': bool(config_manager.enterprise_configs),
        'justice_customers': bool(config_manager.justice_configs),
        'standard_config': bool(config_manager.standard_config)
    }

def requires_feature(feature_name):
    """Decorator to check if a feature is enabled for the current customer"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not g.config.get('features', {}).get(feature_name):
                return {'error': 'Feature not available'}, 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator