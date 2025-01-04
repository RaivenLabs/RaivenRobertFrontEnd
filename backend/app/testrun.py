import json
import os
from flask import Flask, render_template, session, g, request
from functools import wraps

app = Flask(__name__)
app.secret_key = 'your-secure-secret-key-here'  # Change in production

# Configuration constants
ENTERPRISE_DOMAIN = 'enterprise.tangibleinnovations.ai'
JUSTICE_DOMAIN = 'justice.tangibleinnovations.ai'
BASE_DOMAIN = 'tangibleinnovations.ai'

def load_customer_configs():
    """Load all customer configurations from JSON files"""
    print("\n=== Loading Customer Configs ===")
    current_dir = os.path.dirname(os.path.abspath(__file__))
    config_dir = os.path.join(current_dir, 'config')
    print(f"Config directory={config_dir}")
    
    # Check if config directory exists
    if not os.path.exists(config_dir):
        print(f"Config directory not found at {config_dir}")
        os.makedirs(config_dir, exist_ok=True)
        print(f"Created config directory at {config_dir}")
    
    # List all files in config directory
    print("Files in config directory:", os.listdir(config_dir))
    
    # Default configurations
    default_standard_config = {
        "welcome_template": "global_welcome.html", 
        "features": {
            "advanced": False,
            "basic_reporting": True
        },
        "branding": {
            "primary_color": "#333333",
            "logo_url": "standard_logo.png"
        }
    }

    try:
        with open(os.path.join(config_dir, 'enterprise_customers_config.json'), 'r') as f:
            enterprise_configs = json.load(f)
            print("Successfully loaded enterprise config:", enterprise_configs)
    except FileNotFoundError:
        print("Enterprise config not found, using empty list")
        enterprise_configs = []
    except json.JSONDecodeError as e:
        print(f"Error parsing enterprise config: {e}")
        enterprise_configs = []
    
    try:
        with open(os.path.join(config_dir, 'justice_customers_config.json'), 'r') as f:
            justice_configs = json.load(f)
            print("Successfully loaded justice config:", justice_configs)
    except FileNotFoundError:
        print("Justice config not found, using empty list")
        justice_configs = []
    except json.JSONDecodeError as e:
        print(f"Error parsing justice config: {e}")
        justice_configs = []
    
    try:
        with open(os.path.join(config_dir, 'global_customers_config.json'), 'r') as f:
            standard_config = json.load(f)
            print("Successfully loaded global config:", standard_config)
    except FileNotFoundError:
        print("Global config not found, using default config")
        standard_config = default_standard_config
    except json.JSONDecodeError as e:
        print(f"Error parsing global config: {e}")
        standard_config = default_standard_config
    
    return enterprise_configs, justice_configs, standard_config

def get_customer_type_from_domain(host):
    """Determine customer type and identifier from domain"""
    print(f"\n=== get_customer_type_from_domain ===")
    print(f"Processing domain: {host}")
    
    # Check for test parameters first
    test_type = request.args.get('customer_type')
    test_id = request.args.get('customer_id')
    print(f"Test parameters found - type: {test_type}, id: {test_id}")
    if test_type and test_id:
        print(f"Returning test values: {test_type}, {test_id}")
        return test_type, test_id

    parts = host.split('.')
    print(f"Domain parts: {parts}")
    
    if len(parts) < 2:
        print("No subdomain, returning standard")
        return 'standard', None
        
    if len(parts) >= 3:
        subdomain = parts[0]
        domain_type = parts[1]
        print(f"Found subdomain: {subdomain}, type: {domain_type}")
        
        if domain_type == 'enterprise':
            return 'enterprise', subdomain
        elif domain_type == 'justice':
            return 'justice', subdomain
    
    print("No matching domain type, returning standard")        
    return 'standard', None

def load_configuration(customer_type, identifier):
    """Load specific configuration based on customer type and identifier"""
    print(f"\n=== load_configuration ===")
    print(f"Loading for type={customer_type}, id={identifier}")
    enterprise_configs, justice_configs, standard_config = load_customer_configs()
    
    if customer_type == 'enterprise':
        print("Looking for enterprise config")
        # Modified to handle the "customers" structure
        if isinstance(enterprise_configs, dict) and 'customers' in enterprise_configs:
            config = next((c for c in enterprise_configs['customers'] 
                         if c['identifier'] == identifier), None)
        else:
            config = None
        print(f"Found enterprise config: {config}")
        if config:
            config['customer_type'] = 'enterprise'
            return config
            
    elif customer_type == 'justice':
        print("Looking for justice config")
        # Similar modification for justice configs
        if isinstance(justice_configs, dict) and 'customers' in justice_configs:
            config = next((c for c in justice_configs['customers'] 
                         if c['identifier'] == identifier), None)
        else:
            config = None
        print(f"Found justice config: {config}")
        if config:
            config['customer_type'] = 'justice'
            return config
    
    print("Falling back to standard config")
    standard_config['customer_type'] = 'standard'
    return standard_config

@app.before_request
def configure_customer():
    """Set up customer configuration before each request"""
    print("\n=== Starting New Request ===")
    
    # Clear session if we have test parameters
    if request.args.get('customer_type') or request.args.get('customer_id'):
        session.clear()
        print("Cleared session for test parameters")
    
    if 'customer_config' not in session:
        customer_type, identifier = get_customer_type_from_domain(request.host)
        print(f"Got customer_type: {customer_type}, identifier: {identifier}")
        config = load_configuration(customer_type, identifier)
        print(f"Loaded config: {config}")
        session['customer_config'] = config
        session['customer_type'] = customer_type
        session['customer_identifier'] = identifier
    
    # Make configuration available through g for this request
    g.config = session['customer_config']
    g.customer_type = session['customer_type']
    g.customer_identifier = session['customer_identifier']
    print("Current config:", g.config)

@app.route('/')
def index():
    """Main landing page"""
    print("\n=== Index Route ===")
    try:
        template = g.config.get('welcome_template', 'global_welcome.html')
        print(f"Using template: {template}")
        return render_template(template, config=g.config)
    except Exception as e:
        print(f"Error in index route: {str(e)}")
        return f"""
        <html>
            <body>
                <h1>Welcome</h1>
                <p>Configuration type: {g.config.get('customer_type', 'standard')}</p>
                <p>Customer ID: {g.customer_identifier}</p>
                <p style="color: red;">Note: Template {g.config.get('welcome_template')} not found</p>
            </body>
        </html>
        """

if __name__ == '__main__':
    print("\n=== Starting Application ===")
    # Create templates directory if it doesn't exist
    templates_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
    if not os.path.exists(templates_dir):
        os.makedirs(templates_dir)
        print(f"Created templates directory at {templates_dir}")
    
    print("\nRequired files:")
    print(f"1. Template directory: {templates_dir}")
    print("2. Templates needed:")
    print("   - global_welcome.html")
    print("3. Config directory:", os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config'))
    print("   - enterprise_customers_config.json")
    print("   - justice_customers_config.json")
    print("   - global_customers_config.json")
    
    app.run(debug=True)