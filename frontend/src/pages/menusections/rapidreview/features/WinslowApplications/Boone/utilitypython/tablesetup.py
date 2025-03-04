import os
import json
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, DateTime, ForeignKey, CheckConstraint, Index, UniqueConstraint
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy.sql import func
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Load environment variables
load_dotenv()

# Database connection parameters
PG_USER = os.getenv("PG_USER", "postgres")
PG_PASSWORD = os.getenv("PG_PASSWORD", "")
PG_HOST = os.getenv("PG_HOST", "localhost")
PG_PORT = os.getenv("PG_PORT", "5432")

# SQLAlchemy setup
Base = declarative_base()

def list_and_select_database():
    """List existing databases and let user select one."""
    # Connect to default postgres database
    conn = psycopg2.connect(
        user=PG_USER,
        password=PG_PASSWORD,
        host=PG_HOST,
        port=PG_PORT,
        dbname="postgres"
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    
    cursor = conn.cursor()
    
    try:
        # Get a list of all databases
        cursor.execute("""
            SELECT datname FROM pg_database 
            WHERE datistemplate = false AND datname != 'postgres'
            ORDER BY datname
        """)
        
        databases = [row[0] for row in cursor.fetchall()]
        
        print("\nAvailable databases:")
        for i, db in enumerate(databases, 1):
            print(f"{i}. {db}")
        
        print("\nOptions:")
        print("n. Create a new database")
        print("q. Quit")
        
        choice = input("\nSelect a database or option: ").strip().lower()
        
        if choice == 'q':
            print("Exiting.")
            exit(0)
        elif choice == 'n':
            new_db_name = input("Enter a name for the new database: ").strip()
            if not new_db_name:
                print("Database name cannot be empty.")
                return list_and_select_database()
            
            # Check if the database already exists
            cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (new_db_name,))
            exists = cursor.fetchone()
            
            if exists:
                print(f"Database '{new_db_name}' already exists.")
                use_existing = input("Do you want to use this existing database? (y/n): ").strip().lower()
                if use_existing != 'y':
                    return list_and_select_database()
            else:
                # Create the new database
                print(f"Creating database '{new_db_name}'...")
                cursor.execute(f"CREATE DATABASE {new_db_name}")
                print(f"Database '{new_db_name}' created successfully!")
            
            return new_db_name
        elif choice.isdigit() and 1 <= int(choice) <= len(databases):
            selected_db = databases[int(choice) - 1]
            print(f"Using database: {selected_db}")
            return selected_db
        else:
            print("Invalid selection. Please try again.")
            return list_and_select_database()
    
    except Exception as e:
        print(f"Error: {e}")
        return None
    
    finally:
        cursor.close()
        conn.close()

def create_model_classes(program_prefix):
    """Dynamically create model classes for specific program tables."""
    
    # Create dimension model
    dimension_table_name = f"{program_prefix.lower()}dimensions"
    
    class DimensionModel(Base):
        __tablename__ = dimension_table_name
        
        id = Column(Integer, primary_key=True)
        dimension_id = Column(String(50), unique=True, nullable=False)
        display_name = Column(String(100), nullable=False)
        description = Column(Text)
        is_core = Column(Boolean, nullable=False, default=False)
        program_type = Column(String(50), nullable=False)
        order_num = Column(Integer, nullable=False)
        created_at = Column(DateTime(timezone=True), server_default=func.now())
        
        # Relationship
        attributes = relationship("AttributeModel", back_populates="dimension", cascade="all, delete-orphan")
        
        def __repr__(self):
            return f"<Dimension(id={self.id}, dimension_id='{self.dimension_id}', display_name='{self.display_name}')>"
    
    # Create attribute model
    attribute_table_name = f"{program_prefix.lower()}attributes"
    
    class AttributeModel(Base):
        __tablename__ = attribute_table_name
        
        id = Column(Integer, primary_key=True)
        dimension_id = Column(Integer, ForeignKey(f'{dimension_table_name}.id'), nullable=False)
        attribute_id = Column(String(50), nullable=False)
        display_name = Column(String(200), nullable=False)
        data_type = Column(String(20), nullable=False)
        required = Column(Boolean, nullable=False, default=False)
        max_length = Column(Integer)
        order_num = Column(Integer, nullable=False)
        is_core = Column(Boolean, nullable=False, default=False)
        created_at = Column(DateTime(timezone=True), server_default=func.now())
        
        # Relationship
        dimension = relationship("DimensionModel", back_populates="attributes")
        
        # Constraints and table arguments
        __table_args__ = (
            CheckConstraint(
                data_type.in_(['text', 'number', 'date', 'boolean', 'string']),
                name=f'check_{attribute_table_name}_data_type'
            ),
            # Create an index on dimension_id
            Index(f'idx_{attribute_table_name}_dimension', dimension_id),
            # Add a unique constraint for dimension_id + attribute_id
            UniqueConstraint('dimension_id', 'attribute_id', name=f'uq_{attribute_table_name}_dimension_attribute'),
        )
        
        def __repr__(self):
            return f"<Attribute(id={self.id}, attribute_id='{self.attribute_id}', display_name='{self.display_name}')>"
    
    return DimensionModel, AttributeModel

def setup_program_tables(engine, program_prefix, DimensionModel, AttributeModel):
    """Create tables for a specific program if they don't exist."""
    print(f"\nSetting up tables for {program_prefix} program...")
    
    try:
        # Create tables
        # This will only create tables that don't already exist
        # No need to drop existing tables
        dimension_table = f"{program_prefix.lower()}dimensions"
        attribute_table = f"{program_prefix.lower()}attributes"
        
        # Check if tables already exist
        from sqlalchemy import inspect
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        
        if dimension_table in existing_tables and attribute_table in existing_tables:
            print(f"Tables {dimension_table} and {attribute_table} already exist.")
            return True
        
        # Create only the necessary tables
        Base.metadata.create_all(engine, tables=[DimensionModel.__table__, AttributeModel.__table__])
        print(f"Tables created for {program_prefix} program.")
        return True
    except Exception as e:
        print(f"Error creating tables: {e}")
        return False

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

def import_dimensions(engine, DimensionModel, program_name, dimensions_map=None):
    """Import dimensions from a JSON file."""
    if dimensions_map is None:
        dimensions_map = {}
    
    # Get and validate the file path
    file_path = get_file_path(
        f"Enter the path to your {program_name} dimensions JSON file\n(or press Enter to use the default path): ",
        os.path.join(os.path.expanduser("~"), "Desktop", f"{program_name.lower()}_dimensions.json")
    )
    
    if not file_path:
        return dimensions_map
    
    # Load the JSON file
    try:
        print(f"Loading dimensions from: {file_path}")
        with open(file_path, 'r') as f:
            dimensions_data = json.load(f)
        
        # Check if file has the expected format
        if "dimensions" not in dimensions_data:
            print("Warning: File does not have a 'dimensions' key. Is this the right format?")
            print("Looking at the file structure:", list(dimensions_data.keys()))
            proceed = input("Do you want to try anyway? (y/n): ").lower()
            if proceed != 'y':
                return dimensions_map
            # Try to determine which key contains the dimensions
            if isinstance(dimensions_data, dict) and len(dimensions_data) > 0:
                key_options = list(dimensions_data.keys())
                print("Available keys in the file:", key_options)
                if len(key_options) == 1:
                    print(f"Using key: {key_options[0]}")
                    dimensions = dimensions_data[key_options[0]]
                else:
                    key_choice = input("Which key contains the dimensions? ").strip()
                    if key_choice in dimensions_data:
                        dimensions = dimensions_data[key_choice]
                    else:
                        print(f"Key '{key_choice}' not found in file.")
                        return dimensions_map
            else:
                dimensions = dimensions_data  # Try to use the whole file as dimensions
        else:
            dimensions = dimensions_data["dimensions"]
        
        # Ask for program type
        program_type = input(f"Enter the program type for these dimensions (default: {program_name}): ").strip()
        if not program_type:
            program_type = program_name  # Use program name as default
        
        # Print what we found
        print(f"Found {len(dimensions)} dimensions in the file.")
        print("First dimension sample:", dimensions[0] if dimensions else "None")
        
        # Ask for confirmation
        proceed = input("Do you want to import these dimensions? (y/n): ").lower().strip()
        if proceed != 'y':
            print("Import cancelled.")
            return dimensions_map
        
        # Create SQLAlchemy session
        Session = sessionmaker(bind=engine)
        session = Session()
        
        try:
            # Import dimensions
            dimensions_added = 0
            dimensions_updated = 0
            
            for i, dimension_data in enumerate(dimensions):
                # Extract values
                dimension_id = dimension_data.get("id")
                display_name = dimension_data.get("displayName")
                order_num = dimension_data.get("order", i+1)
                
                # Print what we're importing
                print(f"Processing: {dimension_id} - {display_name}")
                
                # Look for existing dimension
                existing_dimension = session.query(DimensionModel).filter_by(dimension_id=dimension_id).first()
                
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
                    new_dimension = DimensionModel(
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
            
            session.commit()
            print(f"\nImport complete: {dimensions_added} dimensions added, {dimensions_updated} dimensions updated.")
            return dimensions_map
            
        except Exception as e:
            session.rollback()
            print(f"Error importing dimensions: {e}")
            return dimensions_map
        
        finally:
            session.close()
    
    except json.JSONDecodeError:
        print(f"Error: The file '{file_path}' is not valid JSON.")
    except Exception as e:
        print(f"Error importing dimensions: {e}")
    
    return dimensions_map

def import_attributes(engine, DimensionModel, AttributeModel, program_name, dimensions_map=None):
    """Import attributes from a JSON file."""
    # If dimensions_map is not provided, get it from the database
    if not dimensions_map:
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            dimensions = session.query(DimensionModel.id, DimensionModel.dimension_id).all()
            dimensions_map = {dim.dimension_id: dim.id for dim in dimensions}
        finally:
            session.close()
        
        if not dimensions_map:
            print("No dimensions found in the database. Please import dimensions first.")
            return
    
    # Get and validate the file path
    file_path = get_file_path(
        f"Enter the path to your {program_name} attributes JSON file\n(or press Enter to use the default path): ",
        os.path.join(os.path.expanduser("~"), "Desktop", f"{program_name.lower()}_attributes.json")
    )
    
    if not file_path:
        return
    
    # Load the JSON file
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
        
        # Create SQLAlchemy session
        Session = sessionmaker(bind=engine)
        session = Session()
        
        try:
            # Import attributes
            attributes_added = 0
            attributes_updated = 0
            dimensions_with_attributes = 0
            
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
                        session.query(AttributeModel)
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
                        new_attribute = AttributeModel(
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
            
            session.commit()
            print(f"\nImport complete: {attributes_added} attributes added, {attributes_updated} attributes updated across {dimensions_with_attributes} dimensions.")
            
        except Exception as e:
            session.rollback()
            print(f"Error importing attributes: {e}")
        
        finally:
            session.close()
    
    except json.JSONDecodeError:
        print(f"Error: The file '{file_path}' is not valid JSON.")
    except Exception as e:
        print(f"Error importing attributes: {e}")

def list_available_programs():
    """List available programs to import."""
    programs = [
        "Asbestos",
        "Acquisition", 
        "RealEstate", 
        "MasterServices", 
        "SaaS"
    ]
    
    print("\nAvailable Programs:")
    for i, program in enumerate(programs, 1):
        print(f"{i}. {program}")
    
    return programs

def main():
    """Main function to run the program importer."""
    print("=" * 50)
    print("HAWKEYE PROGRAM DATA IMPORTER")
    print("=" * 50)
    print("This tool helps you import program dimensions and attributes from JSON files.")
    
    # Select a database
    db_name = list_and_select_database()
    if not db_name:
        print("Database selection failed. Exiting.")
        return
    
    # Create database engine
    engine = create_engine(f"postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{db_name}")
    
    # Database connection test
    try:
        connection = engine.connect()
        print("Successfully connected to the database!")
        connection.close()
    except Exception as e:
        print(f"Error connecting to database: {e}")
        print("\nPlease check your database connection parameters and try again.")
        return
    
    # Import process
    while True:
        # List available programs
        programs = list_available_programs()
        print("\n0. Exit")
        
        choice = input("\nSelect a program to import (0 to exit): ").strip()
        
        if choice == '0':
            print("Exiting program. Goodbye!")
            break
        
        try:
            program_index = int(choice) - 1
            if 0 <= program_index < len(programs):
                program_name = programs[program_index]
                print(f"\nSelected program: {program_name}")
                
                # Create model classes for this program
                DimensionModel, AttributeModel = create_model_classes(program_name)
                
                # Setup tables for this program
                if setup_program_tables(engine, program_name, DimensionModel, AttributeModel):
                    # Ask what to import
                    print("\nWhat would you like to import?")
                    print("1. Dimensions only")
                    print("2. Attributes only")
                    print("3. Both dimensions and attributes")
                    print("0. Go back to program selection")
                    
                    import_choice = input("\nEnter your choice (0-3): ").strip()
                    
                    if import_choice == '0':
                        continue
                    elif import_choice == '1':
                        import_dimensions(engine, DimensionModel, program_name)
                    elif import_choice == '2':
                        import_attributes(engine, DimensionModel, AttributeModel, program_name)
                    elif import_choice == '3':
                        dimensions_map = import_dimensions(engine, DimensionModel, program_name)
                        if dimensions_map:
                            import_attributes(engine, DimensionModel, AttributeModel, program_name, dimensions_map)
                    else:
                        print("Invalid choice. Going back to program selection.")
            else:
                print("Invalid selection. Please try again.")
        except ValueError:
            print("Please enter a valid number.")

if __name__ == "__main__":
    main()
