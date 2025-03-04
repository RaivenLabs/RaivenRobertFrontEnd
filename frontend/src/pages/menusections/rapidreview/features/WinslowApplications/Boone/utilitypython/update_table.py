import os
import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import DictCursor

# Load environment variables
load_dotenv()

# Database connection parameters from environment variables with defaults
PG_USER = os.getenv("PG_USER", "postgres")
PG_PASSWORD = os.getenv("PG_PASSWORD", "")
PG_HOST = os.getenv("PG_HOST", "localhost")
PG_PORT = os.getenv("PG_PORT", "5432")
PG_DATABASE = "hawkeye_db"

# Create connection string
connection_string = f"postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DATABASE}"
print(f"Connecting to database: {PG_DATABASE}")

def get_db_connection():
    """Create and return a database connection."""
    conn = psycopg2.connect(
        user=PG_USER,
        password=PG_PASSWORD,
        host=PG_HOST,
        port=PG_PORT,
        dbname=PG_DATABASE
    )
    return conn

def check_related_parties_dimension():
    """Check if the Related Parties dimension already exists in the database."""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=DictCursor)
    
    cursor.execute("SELECT * FROM dimensions WHERE dimension_id = 'related_parties'")
    exists = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    return exists

def add_related_parties_dimension():
    """Add the Related Parties dimension to the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # First get the next order number
    cursor.execute("SELECT MAX(order_num) FROM dimensions")
    max_order = cursor.fetchone()[0] or 0
    next_order = max_order + 1
    
    # Insert the Related Parties dimension
    cursor.execute("""
    INSERT INTO dimensions 
    (dimension_id, display_name, description, is_core, program_type, order_num)
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING id
    """, (
        'related_parties',
        'Related Party Transactions Due Diligence',
        'Documents and information addressing related party transactions',
        True,
        'M&A',
        next_order
    ))
    
    dimension_id = cursor.fetchone()[0]
    conn.commit()
    
    print(f"Successfully added Related Party Transactions dimension with ID {dimension_id}.")
    
    cursor.close()
    conn.close()
    
    return dimension_id

def get_all_dimensions():
    """Get all dimensions from the database."""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=DictCursor)
    
    cursor.execute("""
    SELECT id, dimension_id, display_name 
    FROM dimensions 
    ORDER BY order_num
    """)
    
    dimensions = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return dimensions

def get_attributes_for_dimension(dimension_id):
    """Get all attributes for a specific dimension."""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=DictCursor)
    
    cursor.execute("""
    SELECT id, attribute_id, display_name, data_type, required, max_length, order_num 
    FROM attributes 
    WHERE dimension_id = %s
    ORDER BY order_num
    """, (dimension_id,))
    
    attributes = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return attributes

def add_attribute_to_dimension(dimension_id, attribute_data):
    """Add a new attribute to a dimension."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # First get the next order number for this dimension
    cursor.execute("""
    SELECT MAX(order_num) FROM attributes WHERE dimension_id = %s
    """, (dimension_id,))
    max_order = cursor.fetchone()[0] or 0
    next_order = max_order + 1
    
    # Insert the attribute
    cursor.execute("""
    INSERT INTO attributes 
    (dimension_id, attribute_id, display_name, data_type, required, max_length, order_num, is_core)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING id
    """, (
        dimension_id,
        attribute_data['attribute_id'],
        attribute_data['display_name'],
        attribute_data['data_type'],
        attribute_data['required'],
        attribute_data.get('max_length'),
        attribute_data.get('order_num', next_order),
        True  # is_core
    ))
    
    attribute_id = cursor.fetchone()[0]
    conn.commit()
    
    print(f"Successfully added attribute '{attribute_data['display_name']}' with ID {attribute_id}.")
    
    cursor.close()
    conn.close()
    
    return attribute_id

def add_related_parties_attributes(dimension_id):
    """Add predefined attributes for the Related Party Transactions dimension."""
    attributes = [
        {
            "attribute_id": "officer_interest_business",
            "display_name": "Has any officer, director, stockholder, or employee had direct or indirect interest in a business that competes or does any business with the company?",
            "data_type": "text",
            "required": True,
            "max_length": 2000,
            "order_num": 1
        },
        {
            "attribute_id": "officer_interest_property",
            "display_name": "Has any officer, director, stockholder, or employee had a direct or indirect interest in real estate, intellectual property, personal property, etc., of the company?",
            "data_type": "text",
            "required": True,
            "max_length": 2000,
            "order_num": 2
        },
        {
            "attribute_id": "government_notices",
            "display_name": "Citations and notices issued by any government agency",
            "data_type": "text",
            "required": True,
            "max_length": 2000,
            "order_num": 3
        },
        {
            "attribute_id": "pending_investigations",
            "display_name": "Pending or potential investigations or government proceedings",
            "data_type": "text",
            "required": True,
            "max_length": 2000,
            "order_num": 4
        },
        {
            "attribute_id": "agency_communications",
            "display_name": "Reports to and communication with an agency, including FDA, USDA, EPA, and OSHA",
            "data_type": "text",
            "required": True,
            "max_length": 2000,
            "order_num": 5
        },
        {
            "attribute_id": "regulatory_compliance",
            "display_name": "Certification of compliance with regulatory standards of the company",
            "data_type": "text",
            "required": True,
            "max_length": 2000,
            "order_num": 6
        },
        {
            "attribute_id": "regulatory_costs",
            "display_name": "Reports on costs of regulatory compliance",
            "data_type": "text",
            "required": True,
            "max_length": 2000,
            "order_num": 7
        },
        {
            "attribute_id": "compliance_problems",
            "display_name": "Problems with regulatory compliance",
            "data_type": "text",
            "required": True,
            "max_length": 2000,
            "order_num": 8
        },
        {
            "attribute_id": "permits_licenses",
            "display_name": "Permits and licenses necessary to perform the operations of the company or its subsidiaries",
            "data_type": "text",
            "required": True,
            "max_length": 2000,
            "order_num": 9
        },
        {
            "attribute_id": "terminated_permits",
            "display_name": "Information on any canceled or terminated permits or licenses",
            "data_type": "text",
            "required": True,
            "max_length": 2000,
            "order_num": 10
        },
        {
            "attribute_id": "permit_exemptions",
            "display_name": "Exemptions from any permit or license requirement",
            "data_type": "text",
            "required": True,
            "max_length": 2000,
            "order_num": 11
        },
        {
            "attribute_id": "llc_agreements",
            "display_name": "LLC or partnership agreements",
            "data_type": "text",
            "required": True,
            "max_length": 2000,
            "order_num": 12
        },
        {
            "attribute_id": "guarantees",
            "display_name": "Copy of all guarantees to which the company is a party",
            "data_type": "text",
            "required": True,
            "max_length": 2000,
            "order_num": 13
        },
        {
            "attribute_id": "owner",
            "display_name": "Owner",
            "data_type": "string",
            "required": True,
            "max_length": 100,
            "order_num": 14
        },
        {
            "attribute_id": "completion_status",
            "display_name": "Complete?",
            "data_type": "boolean",
            "required": True,
            "order_num": 15
        },
        {
            "attribute_id": "completion_date",
            "display_name": "Date of Completion",
            "data_type": "date",
            "required": False,
            "order_num": 16
        },
        {
            "attribute_id": "notes",
            "display_name": "Notes",
            "data_type": "text",
            "required": False,
            "max_length": 5000,
            "order_num": 17
        }
    ]
    
    for attribute in attributes:
        add_attribute_to_dimension(dimension_id, attribute)
    
    print(f"Successfully added {len(attributes)} attributes to the Related Party Transactions dimension.")

def check_attribute_exists(dimension_id, attribute_id):
    """Check if an attribute already exists for a dimension."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT id FROM attributes 
    WHERE dimension_id = %s AND attribute_id = %s
    """, (dimension_id, attribute_id))
    
    exists = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    return exists is not None

def add_customer_sales_suppliers_attributes():
    """Helper function to add attributes to the Customer/Sales/Suppliers dimension."""
    # First, find the dimension ID
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM dimensions WHERE dimension_id = 'customer_sales_suppliers'")
    dimension_id = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    if not dimension_id:
        print("Error: Customer/Sales/Suppliers dimension not found in the database.")
        return
    
    dimension_id = dimension_id[0]
    
    # Sample attributes from the checklist for Customer/Sales/Suppliers
    attributes = [
        {
            "attribute_id": "customer_leave_issues",
            "display_name": "Issues that may cause customers to leave (including the potential buyer)",
            "data_type": "text",
            "required": True,
            "max_length": 2000
        },
        {
            "attribute_id": "top_customers",
            "display_name": "Top customers and revenues",
            "data_type": "text",
            "required": True,
            "max_length": 2000
        },
        {
            "attribute_id": "customer_satisfaction",
            "display_name": "Customer satisfaction",
            "data_type": "text",
            "required": True,
            "max_length": 2000
        },
        # Add more attributes here as needed
    ]
    
    for attribute in attributes:
        if not check_attribute_exists(dimension_id, attribute["attribute_id"]):
            answer = input(f"Add attribute '{attribute['display_name']}' to Customer/Sales/Suppliers? (y/n): ")
            if answer.lower() == 'y':
                add_attribute_to_dimension(dimension_id, attribute)
        else:
            print(f"Attribute '{attribute['attribute_id']}' already exists for this dimension.")

def main():
    """Main function to run the script."""
    print("Welcome to the Hawkeye Database Update Script")
    print("="*50)
    
    # Check if Related Parties dimension exists
    related_parties = check_related_parties_dimension()
    if not related_parties:
        answer = input("Related Party Transactions dimension does not exist. Would you like to add it? (y/n): ")
        if answer.lower() == 'y':
            dimension_id = add_related_parties_dimension()
            
            # Ask if user wants to add attributes for this dimension
            answer = input("Would you like to add attributes for the Related Party Transactions dimension? (y/n): ")
            if answer.lower() == 'y':
                add_related_parties_attributes(dimension_id)
    else:
        print("Related Party Transactions dimension already exists in the database.")
    
    # Get all dimensions
    dimensions = get_all_dimensions()
    print("\nCurrent dimensions in the database:")
    for i, dim in enumerate(dimensions, 1):
        print(f"{i}. {dim['display_name']} (ID: {dim['dimension_id']})")
    
    # Ask which dimension the user wants to add attributes to
    while True:
        try:
            dim_choice = input("\nEnter the number of the dimension you want to add attributes to (or 'q' to quit): ")
            
            if dim_choice.lower() == 'q':
                break
                
            dim_index = int(dim_choice) - 1
            if 0 <= dim_index < len(dimensions):
                selected_dim = dimensions[dim_index]
                
                # Show current attributes
                attributes = get_attributes_for_dimension(selected_dim['id'])
                print(f"\nCurrent attributes for {selected_dim['display_name']}:")
                if attributes:
                    for attr in attributes:
                        print(f"- {attr['display_name']} ({attr['attribute_id']})")
                else:
                    print("No attributes found for this dimension.")
                
                # For demonstration, we'll implement adding attributes for Customer/Sales/Suppliers
                if selected_dim['dimension_id'] == 'customer_sales_suppliers':
                    add_customer_sales_suppliers_attributes()
                else:
                    print(f"\nAdding attributes for {selected_dim['display_name']} is not yet implemented.")
                    print("This would be where you'd implement the specific attributes for this dimension.")
                    
                    # Here you would add code to offer attributes specific to the selected dimension
                    # Similar to the add_customer_sales_suppliers_attributes() function
            else:
                print("Invalid dimension number. Please try again.")
        except ValueError:
            print("Please enter a valid number or 'q' to quit.")
    
    print("\nUpdate complete!")

if __name__ == "__main__":
    main()
