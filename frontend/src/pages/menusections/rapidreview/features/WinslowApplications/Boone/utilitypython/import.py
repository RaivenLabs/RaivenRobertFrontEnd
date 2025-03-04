import os
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey

# Database connection parameters - hard-coded for simplicity
PG_USER = "postgres"  # Change to your username
PG_PASSWORD = "Raiven7.!!"      # Change to your password
PG_HOST = "localhost"
PG_PORT = "5432"
PG_DATABASE = "hawkeye_db"  # Make sure this matches your actual database name

# Create connection string
connection_string = f"postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DATABASE}"
print(f"Connecting to database: {PG_DATABASE}")
print(f"Connection string: {connection_string}")

# Create SQLAlchemy engine to connect to your existing database
engine = create_engine(connection_string)

# Test the connection before proceeding
try:
    connection = engine.connect()
    print("Successfully connected to the database!")
    connection.close()
except Exception as e:
    print(f"Error connecting to database: {e}")
    print("\nPlease check your database connection parameters and try again.")
    exit(1)

# Define the Dimension model - this should match your existing table
Base = declarative_base()

class Dimension(Base):
    __tablename__ = 'dimensions'
    
    id = Column(Integer, primary_key=True)
    dimension_id = Column(String(50), unique=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    description = Column(Text)
    is_core = Column(Boolean, nullable=False, default=False)
    program_type = Column(String(50), nullable=False)
    order_num = Column(Integer, nullable=False)
    
    def __repr__(self):
        return f"<Dimension(id={self.id}, dimension_id='{self.dimension_id}', display_name='{self.display_name}')>"

# Create a session
Session = sessionmaker(bind=engine)
session = Session()

def import_dimensions_from_file():
    """Import dimensions from a JSON file with interactive file selection."""
    # Ask for the dimensions JSON file
    print("\nLet's import dimensions from your JSON file.")
    
    # Option 1: Ask for file path
    file_path = input("Enter the path to your dimensions JSON file\n(or press Enter to use the default path): ").strip()
    
    # Option 2: Use a default path if none provided
    if not file_path:
        # Provide a default path or ask user to browse
        file_path = os.path.join(os.path.expanduser("~"), "Desktop", "dimensions.json")
        print(f"Using default path: {file_path}")
    
    # Remove quotes if they exist
    file_path = file_path.strip('"\'')
    
    # Check if file exists
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' does not exist.")
        new_path = input("Would you like to enter a different path? (y/n): ").lower()
        if new_path == 'y':
            return import_dimensions_from_file()
        return
    
    # Load and parse the JSON file
    try:
        print(f"Loading dimensions from: {file_path}")
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        # Check if file has the expected format
        if "dimensions" not in data:
            print("Warning: File does not have a 'dimensions' key. Is this the right format?")
            print("Looking at the file structure:", list(data.keys()))
            proceed = input("Do you want to try anyway? (y/n): ").lower()
            if proceed != 'y':
                return
            # If the file structure is different, try to determine which key contains the dimensions
            if isinstance(data, dict) and len(data) > 0:
                key_options = list(data.keys())
                print("Available keys in the file:", key_options)
                if len(key_options) == 1:
                    print(f"Using key: {key_options[0]}")
                    dimensions = data[key_options[0]]
                else:
                    key_choice = input("Which key contains the dimensions? ").strip()
                    if key_choice in data:
                        dimensions = data[key_choice]
                    else:
                        print(f"Key '{key_choice}' not found in file.")
                        return
            else:
                dimensions = data  # Try to use the whole file as dimensions
        else:
            dimensions = data["dimensions"]
        
        # Ask for program type
        program_type = input("Enter the program type for these dimensions (e.g., M&A): ").strip()
        if not program_type:
            program_type = "M&A"  # Default value
        
        # Import dimensions
        dimensions_added = 0
        dimensions_updated = 0
        
        # Print what we found
        print(f"Found {len(dimensions)} dimensions in the file.")
        print("First dimension sample:", dimensions[0] if dimensions else "None")
        
        # Ask for confirmation
        proceed = input("Do you want to import these dimensions? (y/n): ").lower().strip()
        if proceed != 'y':
            print("Import cancelled.")
            return
        
        print("\nImporting dimensions...")
        
        for i, dimension_data in enumerate(dimensions):
            # Extract values
            dimension_id = dimension_data.get("id")
            display_name = dimension_data.get("displayName")
            order_num = dimension_data.get("order", i+1)
            
            # Print what we're importing
            print(f"Processing: {dimension_id} - {display_name}")
            
            # Look for existing dimension
            existing_dimension = session.query(Dimension).filter_by(dimension_id=dimension_id).first()
            
            if existing_dimension:
                # Update existing dimension
                existing_dimension.display_name = display_name
                existing_dimension.is_core = True
                existing_dimension.program_type = program_type
                existing_dimension.order_num = order_num
                dimensions_updated += 1
                print(f"  Updated dimension: {display_name}")
            else:
                # Create new dimension
                new_dimension = Dimension(
                    dimension_id=dimension_id,
                    display_name=display_name,
                    description=None,  # You can add this if it's in your JSON
                    is_core=True,
                    program_type=program_type,
                    order_num=order_num
                )
                session.add(new_dimension)
                dimensions_added += 1
                print(f"  Added dimension: {display_name}")
        
        # Commit changes
        session.commit()
        print(f"\nImport complete: {dimensions_added} dimensions added, {dimensions_updated} dimensions updated.")
        
    except json.JSONDecodeError:
        print(f"Error: The file '{file_path}' is not valid JSON.")
    except Exception as e:
        session.rollback()
        print(f"Error importing dimensions: {e}")

def list_dimensions():
    """List all dimensions in the database"""
    dimensions = session.query(Dimension).order_by(Dimension.order_num).all()
    
    if not dimensions:
        print("No dimensions found in the database.")
        return
    
    print("\nCurrent dimensions in the database:")
    print("-" * 80)
    print(f"{'ID':<5} {'Dimension ID':<25} {'Display Name':<45} {'Program':<10}")
    print("-" * 80)
    
    for dimension in dimensions:
        print(f"{dimension.id:<5} {dimension.dimension_id:<25} {dimension.display_name:<45} {dimension.program_type:<10}")

def main_menu():
    """Display the main menu and handle user choices"""
    while True:
        print("\n" + "=" * 40)
        print("HAWKEYE DIMENSIONS MANAGER")
        print("=" * 40)
        print("1. Import dimensions from JSON file")
        print("2. List all dimensions")
        print("0. Exit")
        
        choice = input("\nEnter your choice (0-2): ").strip()
        
        if choice == '0':
            print("Exiting program. Goodbye!")
            break
        elif choice == '1':
            import_dimensions_from_file()
        elif choice == '2':
            list_dimensions()
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    try:
        main_menu()
    finally:
        # Close the session when done
        session.close()
