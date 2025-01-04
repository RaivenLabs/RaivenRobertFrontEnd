from flask import Flask, render_template
import json

app = Flask(__name__)

# Manually set the customer identifier (hard-coded for now)
customer_id = "customer1"  # You can switch this to "customer2" to see the difference

@app.route('/')
def index():
    # Step 1: Load the configuration file containing all customer configurations
    config_file_path = 'config/customers_config.json'

    try:
        with open(config_file_path, 'r') as file:
            all_configs = json.load(file)
    except FileNotFoundError:
        return "Configuration file not found.", 404

    # Step 2: Find the correct configuration based on the customer_id
    config = next((c for c in all_configs if c['customer_id'] == customer_id), None)

    if not config:
        return "Configuration not found for this customer.", 404

    # Step 3: Extract the welcome page from the configuration
    welcome_page = config.get('welcome_page', 'default_welcome.html')

    # Step 4: Render the correct welcome page
    return render_template(welcome_page, config=config)

if __name__ == '__main__':
    app.run(debug=True)
