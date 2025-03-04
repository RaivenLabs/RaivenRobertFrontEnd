import os
import json
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, DateTime, ForeignKey, CheckConstraint, Index, UniqueConstraint
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy.sql import func
from dotenv import load_dotenv

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

# Define the models - these should match your existing tables
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
    
    # Relationship
    attributes = relationship("Attribute", back_populates="dimension", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Dimension(id={self.id}, dimension_id='{self.dimension_id}', display_name='{self.display_name}')>"

class Attribute(Base):
    __tablename__ = 'asbestosattributes'
    
    id = Column(Integer, primary_key=True)
    dimension_id = Column(Integer, ForeignKey('dimensions.id'), nullable=False)
    attribute_id = Column(String(50), nullable=False)
    display_name = Column(String(200), nullable=False)
    data_type = Column(String(20), nullable=False)
    required = Column(Boolean, nullable=False, default=False)
    max_length = Column(Integer)
    order_num = Column(Integer, nullable=False)
    is_core = Column(Boolean, nullable=False, default=False)
    
    # Relationship
    dimension = relationship("Dimension", back_populates="attributes")
    
    # Constraints
    __table_args__ = (
        CheckConstraint(
            data_type.in_(['text', 'number', 'date', 'boolean', 'string']),
            name='check_data_type'
        ),
        # Create an index on dimension_id
        Index('idx_attributes_dimension', dimension_id),
        # Add a unique constraint for dimension_id + attribute_id
        UniqueConstraint('dimension_id', 'attribute_id', name='uq_dimension_attribute'),
    )
    
    def __repr__(self):
        return f"<Attribute(id={self.id}, attribute_id='{self.attribute_id}', display_name='{self.display_name}')>"

# Create a session
Session = sessionmaker(bind=engine)
session = Session()

def get_file_path(prompt, default=None):
    """Helper function to get and validate a file path."""
    file_path = input(prompt).strip()
    
    if not file_path and default:
        file_path = default
        print(f"Using default path: {file_path}")
    
    # Remove quotes if they exist
    file_path = file_path.strip('"\'')
    
    # Check if file exists
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' does not exist.")
        new_path = input("Would you like to enter a different path? (y/n): ").lower()
        if new_path == 'y':
            return get_file_path(prompt, default)
        return None
    
    return file_path

def import_dimensions_from_file():
    """Import dimensions from a JSON file with interactive file selection."""
    print("\nLet's import dimensions from your JSON file.")
    
    # Get and validate the file path
    file_path = get_file_path(
        "Enter the path to your dimensions JSON file\n(or press Enter to use the default path): ",
        os.path.join(os.path.expanduser("~"), "Desktop", "dimensions.json")
    )
    
    if not file_path:
        return {}  # Return empty dict if no file path
    
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
                return {}
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
                        return {}
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
        dimensions_map = {}  # Track dimension_id to database id mapping
        
        # Print what we found
        print(f"Found {len(dimensions)} dimensions in the file.")
        print("First dimension sample:", dimensions[0] if dimensions else "None")
        
        # Ask for confirmation
        proceed = input("Do you want to import these dimensions? (y/n): ").lower().strip()
        if proceed != 'y':
            print("Import cancelled.")
            return {}
        
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
                dimensions_map[dimension_id] = existing_dimension.id
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
                session.flush()  # Flush to get the ID
                dimensions_map[dimension_id] = new_dimension.id
                dimensions_added += 1
                print(f"  Added dimension: {display_name}")
        
        # Commit changes
        session.commit()
        print(f"\nImport complete: {dimensions_added} dimensions added, {dimensions_updated} dimensions updated.")
        
        return dimensions_map
        
    except json.JSONDecodeError:
        print(f"Error: The file '{file_path}' is not valid JSON.")
    except Exception as e:
        session.rollback()
        print(f"Error importing dimensions: {e}")
    
    return {}

def import_attributes_from_file(dimensions_map=None):
    """Import attributes from a JSON file."""
    print("\nLet's import attributes from your JSON file.")
    
    # If dimensions_map is not provided, get it from the database
    if not dimensions_map:
        dimensions = session.query(Dimension.id, Dimension.dimension_id).all()
        dimensions_map = {dim.dimension_id: dim.id for dim in dimensions}
        
        if not dimensions_map:
            print("No dimensions found in the database. Please import dimensions first.")
            return
    
    # Get and validate the file path
    file_path = get_file_path(
        "Enter the path to your attributes JSON file\n(or press Enter to use the default path): ",
        os.path.join(os.path.expanduser("~"), "Desktop", "attributes.json")
    )
    
    if not file_path:
        return
    
    # Load and parse the JSON file
    try:
        print(f"Loading attributes from: {file_path}")
        with open(file_path, 'r') as f:
            attributes_data = json.load(f)
        
        # Get a sample of the data
        sample_dimension = list(attributes_data.keys())[0] if attributes_data else None
        sample_attribute = attributes_data.get(sample_dimension, [])[0] if sample_dimension and attributes_data.get(sample_dimension) else None
        
        print(f"Found {len(attributes_data)} dimensions with attributes.")
        print(f"Sample: {sample_dimension} - {sample_attribute['displayName'] if sample_attribute else 'No attributes'}")
        
        # Ask for confirmation
        proceed = input("Do you want to import these attributes? (y/n): ").lower().strip()
        if proceed != 'y':
            print("Import cancelled.")
            return
        
        # Import attributes
        attributes_added = 0
        attributes_updated = 0
        dimensions_with_attributes = 0
        
        print("\nImporting attributes...")
        
        for dimension_id, attributes_list in attributes_data.items():
            if dimension_id not in dimensions_map:
                print(f"Warning: Dimension {dimension_id} not found in database. Skipping its attributes.")
                continue
                
            db_dimension_id = dimensions_map[dimension_id]
            dimension_attributes_added = 0
            dimension_attributes_updated = 0
            dimensions_with_attributes += 1
            
            print(f"Processing attributes for dimension: {dimension_id}")
            
            for attr_data in attributes_list:
                attribute_id = attr_data.get('id')
                display_name = attr_data.get('displayName')
                data_type = attr_data.get('dataType', 'text').lower()
                # Normalize data type to match our constraints
                if data_type not in ['text', 'number', 'date', 'boolean', 'string']:
                    data_type = 'text'
                required = attr_data.get('required', False)
                max_length = attr_data.get('maxLength')
                order_num = attr_data.get('order', 0)
                
                # Check if attribute already exists
                existing_attribute = (
                    session.query(Attribute)
                    .filter_by(dimension_id=db_dimension_id, attribute_id=attribute_id)
                    .first()
                )
                
                if existing_attribute:
                    # Update existing attribute
                    existing_attribute.display_name = display_name
                    existing_attribute.data_type = data_type
                    existing_attribute.required = required
                    existing_attribute.max_length = max_length
                    existing_attribute.order_num = order_num
                    existing_attribute.is_core = True
                    
                    attributes_updated += 1
                    dimension_attributes_updated += 1
                else:
                    # Create new attribute
                    new_attribute = Attribute(
                        dimension_id=db_dimension_id,
                        attribute_id=attribute_id,
                        display_name=display_name,
                        data_type=data_type,
                        required=required,
                        max_length=max_length,
                        order_num=order_num,
                        is_core=True
                    )
                    
                    session.add(new_attribute)
                    attributes_added += 1
                    dimension_attributes_added += 1
            
            print(f"  Added {dimension_attributes_added} and updated {dimension_attributes_updated} attributes for {dimension_id}")
        
        # Commit changes
        session.commit()
        print(f"\nImport complete: {attributes_added} attributes added, {attributes_updated} attributes updated across {dimensions_with_attributes} dimensions.")
        
    except json.JSONDecodeError:
        print(f"Error: The file '{file_path}' is not valid JSON.")
    except Exception as e:
        session.rollback()
        print(f"Error importing attributes: {e}")

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

def list_attributes():
    """List all attributes for a selected dimension"""
    dimensions = session.query(Dimension).order_by(Dimension.display_name).all()
    
    if not dimensions:
        print("No dimensions found in the database.")
        return
    
    print("\nSelect a dimension to view its attributes:")
    for i, dimension in enumerate(dimensions, 1):
        print(f"{i}. {dimension.display_name}")
    
    choice = input("\nEnter dimension number (or 'all' to see all attributes): ").strip().lower()
    
    try:
        if choice == 'all':
            # Show count of attributes for each dimension
            for dimension in dimensions:
                attr_count = session.query(Attribute).filter_by(dimension_id=dimension.id).count()
                print(f"{dimension.display_name}: {attr_count} attributes")
            
            # Ask if user wants to see all attributes
            show_all = input("Do you want to see all attributes? This could be a long list. (y/n): ").lower()
            if show_all != 'y':
                return
            
            attributes = session.query(Attribute).join(Dimension).order_by(Dimension.display_name, Attribute.order_num).all()
            
            print("\nAll attributes in the database:")
            print("-" * 100)
            print(f"{'Dimension':<30} {'Attribute ID':<20} {'Display Name':<40} {'Type':<10}")
            print("-" * 100)
            
            for attr in attributes:
                print(f"{attr.dimension.display_name:<30} {attr.attribute_id:<20} {attr.display_name:<40} {attr.data_type:<10}")
            
        elif choice.isdigit() and 1 <= int(choice) <= len(dimensions):
            dimension = dimensions[int(choice) - 1]
            attributes = session.query(Attribute).filter_by(dimension_id=dimension.id).order_by(Attribute.order_num).all()
            
            if not attributes:
                print(f"No attributes found for dimension: {dimension.display_name}")
                return
            
            print(f"\nAttributes for dimension: {dimension.display_name}")
            print("-" * 90)
            print(f"{'ID':<5} {'Attribute ID':<20} {'Display Name':<40} {'Type':<10} {'Required':<10}")
            print("-" * 90)
            
            for attr in attributes:
                print(f"{attr.id:<5} {attr.attribute_id:<20} {attr.display_name:<40} {attr.data_type:<10} {'Yes' if attr.required else 'No':<10}")
        else:
            print("Invalid selection.")
    except Exception as e:
        print(f"Error listing attributes: {e}")

def main_menu():
    """Display the main menu and handle user choices"""
    while True:
        print("\n" + "=" * 40)
        print("HAWKEYE DATA MANAGER")
        print("=" * 40)
        print("1. Import dimensions from JSON file")
        print("2. Import attributes from JSON file")
        print("3. List dimensions")
        print("4. List attributes")
        print("5. Import both dimensions and attributes")
        print("0. Exit")
        
        choice = input("\nEnter your choice (0-5): ").strip()
        
        if choice == '0':
            print("Exiting program. Goodbye!")
            break
        elif choice == '1':
            import_dimensions_from_file()
        elif choice == '2':
            import_attributes_from_file()
        elif choice == '3':
            list_dimensions()
        elif choice == '4':
            list_attributes()
        elif choice == '5':
            print("\nImporting both dimensions and attributes...")
            dimensions_map = import_dimensions_from_file()
            if dimensions_map:
                import_attributes_from_file(dimensions_map)
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    try:
        main_menu()
    finally:
        # Close the session when done
        session.close()
