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

# SQLAlchemy setup - using updated approach
Base = declarative_base()

def list_and_select_database():
    """List existing databases and let user select or create a new one."""
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

# Define models
class Dimension(Base):
    __tablename__ = 'dimensions'
    
    id = Column(Integer, primary_key=True)
    dimension_id = Column(String(50), unique=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    description = Column(Text)
    is_core = Column(Boolean, nullable=False, default=False)
    program_type = Column(String(50), nullable=False)
    order_num = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    attributes = relationship("Attribute", back_populates="dimension", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Dimension(id={self.id}, dimension_id='{self.dimension_id}', display_name='{self.display_name}')>"

class Attribute(Base):
    __tablename__ = 'attributes'
    
    id = Column(Integer, primary_key=True)
    dimension_id = Column(Integer, ForeignKey('dimensions.id'), nullable=False)
    attribute_id = Column(String(50), nullable=False)
    display_name = Column(String(200), nullable=False)
    data_type = Column(String(20), nullable=False)
    required = Column(Boolean, nullable=False, default=False)
    max_length = Column(Integer)
    order_num = Column(Integer, nullable=False)
    is_core = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    dimension = relationship("Dimension", back_populates="attributes")
    
    # Constraints and table arguments
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

# Create tables
def setup_database(db_name):
    """Create tables in the database."""
    # Create SQLAlchemy engine
    engine = create_engine(f"postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{db_name}")
    
    try:
        # Create all tables
        Base.metadata.create_all(engine)
        print("Database tables created successfully!")
        return engine
    except Exception as e:
        print(f"Error creating tables: {e}")
        return None

# Import dimensions
def import_dimensions(engine, dimensions_map=None):
    """Import dimensions from a JSON file."""
    if dimensions_map is None:
        dimensions_map = {}
    
    # Ask user for the dimensions JSON file path
    file_path = input("Enter the path to your dimensions JSON file: ").strip()
    
    # Validate file exists
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' does not exist.")
        return dimensions_map
    
    # Load the JSON file
    try:
        with open(file_path, 'r') as f:
            dimensions_data = json.load(f)
        
        # Print some information about the file
        num_dimensions = len(dimensions_data.get('dimensions', []))
        print(f"Found {num_dimensions} dimensions in the file.")
        
        # Ask for program type if not specified in the dimensions
        program_type = input("Enter the program type for these dimensions (e.g., M&A, Real Estate): ").strip()
        if not program_type:
            program_type = "M&A"  # Default value
        
        # Create SQLAlchemy session
        Session = sessionmaker(bind=engine)
        session = Session()
        
        try:
            # Import dimensions
            dimensions_added = 0
            
            for i, dimension_data in enumerate(dimensions_data.get('dimensions', [])):
                dimension_id = dimension_data.get('id')
                display_name = dimension_data.get('displayName')
                description = None  # Add description field if it exists in your JSON
                order_num = dimension_data.get('order', i+1)
                
                # Check if dimension already exists
                existing_dimension = session.query(Dimension).filter_by(dimension_id=dimension_id).first()
                
                if existing_dimension:
                    # Update existing dimension
                    existing_dimension.display_name = display_name
                    existing_dimension.description = description
                    existing_dimension.is_core = True
                    existing_dimension.program_type = program_type
                    existing_dimension.order_num = order_num
                    
                    print(f"Updated dimension: {display_name}")
                    dimensions_map[dimension_id] = existing_dimension.id
                else:
                    # Create new dimension
                    new_dimension = Dimension(
                        dimension_id=dimension_id,
                        display_name=display_name,
                        description=description,
                        is_core=True,
                        program_type=program_type,
                        order_num=order_num
                    )
                    
                    session.add(new_dimension)
                    session.flush()  # Flush to get the ID
                    
                    dimensions_map[dimension_id] = new_dimension.id
                    dimensions_added += 1
                    print(f"Added dimension: {display_name}")
            
            session.commit()
            print(f"Successfully imported {dimensions_added} dimensions.")
            
        except Exception as e:
            session.rollback()
            print(f"Error importing dimensions: {e}")
        
        finally:
            session.close()
        
        return dimensions_map
    
    except json.JSONDecodeError:
        print(f"Error: The file '{file_path}' is not valid JSON.")
    except Exception as e:
        print(f"Error importing dimensions: {e}")
    
    return dimensions_map

# Import attributes
def import_attributes(engine, dimensions_map):
    """Import attributes from a JSON file."""
    if not dimensions_map:
        # If we don't have dimensions map, let's fetch from the database
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            dimensions = session.query(Dimension.id, Dimension.dimension_id).all()
            dimensions_map = {dim.dimension_id: dim.id for dim in dimensions}
        finally:
            session.close()
        
        if not dimensions_map:
            print("No dimensions found in the database. Please import dimensions first.")
            return
    
    # Ask user for the attributes JSON file path
    file_path = input("Enter the path to your attributes JSON file: ").strip()
    
    # Validate file exists
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' does not exist.")
        return
    
    # Load the JSON file
    try:
        with open(file_path, 'r') as f:
            attributes_data = json.load(f)
        
        # Create SQLAlchemy session
        Session = sessionmaker(bind=engine)
        session = Session()
        
        try:
            # Import attributes
            attributes_added = 0
            dimensions_with_attributes = 0
            
            for dimension_id, attributes_list in attributes_data.items():
                if dimension_id not in dimensions_map:
                    print(f"Warning: Dimension {dimension_id} not found in database. Skipping its attributes.")
                    continue
                    
                db_dimension_id = dimensions_map[dimension_id]
                dimension_attributes_added = 0
                dimensions_with_attributes += 1
                
                for order_num, attr_data in enumerate(attributes_list, 1):
                    attribute_id = attr_data.get('id')
                    display_name = attr_data.get('displayName')
                    data_type = attr_data.get('dataType', 'text').lower()
                    # Normalize data type to match our constraints
                    if data_type not in ['text', 'number', 'date', 'boolean', 'string']:
                        data_type = 'text'
                    required = attr_data.get('required', False)
                    max_length = attr_data.get('maxLength')
                    attr_order = attr_data.get('order', order_num)
                    
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
                        existing_attribute.order_num = attr_order
                        existing_attribute.is_core = True
                        
                        print(f"Updated attribute: {display_name} for dimension ID {dimension_id}")
                    else:
                        # Create new attribute
                        new_attribute = Attribute(
                            dimension_id=db_dimension_id,
                            attribute_id=attribute_id,
                            display_name=display_name,
                            data_type=data_type,
                            required=required,
                            max_length=max_length,
                            order_num=attr_order,
                            is_core=True
                        )
                        
                        session.add(new_attribute)
                        dimension_attributes_added += 1
                        print(f"Added attribute: {display_name} for dimension ID {dimension_id}")
                
                attributes_added += dimension_attributes_added
                print(f"Added {dimension_attributes_added} attributes for dimension {dimension_id}")
            
            session.commit()
            print(f"Successfully imported {attributes_added} attributes across {dimensions_with_attributes} dimensions.")
            
        except Exception as e:
            session.rollback()
            print(f"Error importing attributes: {e}")
        
        finally:
            session.close()
    
    except json.JSONDecodeError:
        print(f"Error: The file '{file_path}' is not valid JSON.")
    except Exception as e:
        print(f"Error importing attributes: {e}")

def main():
    """Main function to execute the script."""
    print("Welcome to the Due Diligence Database Setup Tool")
    print("="*50)
    
    # Let user select or create a database
    db_name = list_and_select_database()
    if not db_name:
        print("Database selection failed. Exiting.")
        return
    
    # Setup SQLAlchemy models and tables
    engine = setup_database(db_name)
    if not engine:
        return
    
    # Ask user if they want to import dimensions
    import_dims = input("\nDo you want to import dimensions from a JSON file? (y/n): ").lower().strip()
    
    dimensions_map = {}
    if import_dims == 'y':
        dimensions_map = import_dimensions(engine)
    
    # Ask user if they want to import attributes
    import_attrs = input("\nDo you want to import attributes from a JSON file? (y/n): ").lower().strip()
    
    if import_attrs == 'y':
        import_attributes(engine, dimensions_map)
    
    print("\nSetup complete!")
    print(f"You now have a PostgreSQL database '{db_name}' ready for your due diligence application.")

if __name__ == "__main__":
    main()
