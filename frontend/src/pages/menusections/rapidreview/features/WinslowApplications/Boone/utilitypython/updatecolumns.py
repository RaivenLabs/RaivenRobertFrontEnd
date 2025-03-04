import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection parameters
PG_USER = os.getenv("PG_USER", "postgres")
PG_PASSWORD = os.getenv("PG_PASSWORD", "")
PG_HOST = os.getenv("PG_HOST", "localhost")
PG_PORT = os.getenv("PG_PORT", "5432")

def connect_to_database():
    """Connect to PostgreSQL and select a database."""
    # Connect to default postgres database first
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
        # Get list of available databases
        cursor.execute("""
            SELECT datname FROM pg_database 
            WHERE datistemplate = false AND datname != 'postgres'
            ORDER BY datname
        """)
        
        databases = [row[0] for row in cursor.fetchall()]
        
        print("\nAvailable databases:")
        for i, db in enumerate(databases, 1):
            print(f"{i}. {db}")
        
        choice = input("\nSelect a database number: ").strip()
        
        if not choice.isdigit() or int(choice) < 1 or int(choice) > len(databases):
            print("Invalid selection. Exiting.")
            return None
        
        selected_db = databases[int(choice) - 1]
        print(f"Selected database: {selected_db}")
        
        # Close the connection to postgres
        cursor.close()
        conn.close()
        
        # Connect to the selected database
        conn = psycopg2.connect(
            user=PG_USER,
            password=PG_PASSWORD,
            host=PG_HOST,
            port=PG_PORT,
            dbname=selected_db
        )
        return conn
    
    except Exception as e:
        print(f"Error: {e}")
        return None

def get_program_tables(conn):
    """Get all dimension and attribute tables in the database."""
    cursor = conn.cursor()
    
    try:
        # Get all tables that end with 'dimensions' or 'attributes'
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND (table_name LIKE '%dimensions' OR table_name LIKE '%attributes')
            ORDER BY table_name
        """)
        
        tables = [row[0] for row in cursor.fetchall()]
        return tables
    
    except Exception as e:
        print(f"Error getting tables: {e}")
        return []
    
    finally:
        cursor.close()

def check_column_exists(conn, table_name, column_name):
    """Check if a column already exists in a table."""
    cursor = conn.cursor()
    
    try:
        cursor.execute(f"""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = '{table_name}' 
            AND column_name = '{column_name}'
        """)
        
        return cursor.fetchone() is not None
    
    except Exception as e:
        print(f"Error checking column: {e}")
        return False
    
    finally:
        cursor.close()

def add_columns_to_table(conn, table_name):
    """Add the new columns to a specific table."""
    cursor = conn.cursor()
    
    # Column definitions
    columns = [
        {"name": "origin", "type": "VARCHAR(50)", "default": "'core'", "comment": "'core', 'customer', etc"},
        {"name": "status", "type": "VARCHAR(50)", "default": "'approved'", "comment": "'proposed', 'approved', etc"},
        {"name": "customer_id", "type": "VARCHAR(100)", "default": "NULL", "comment": "NULL for core, customer ID for customer-specific"}
    ]
    
    try:
        for column in columns:
            # Check if column already exists
            if check_column_exists(conn, table_name, column["name"]):
                print(f"Column '{column['name']}' already exists in table '{table_name}'. Skipping.")
                continue
            
            # Add column
            sql = f"ALTER TABLE {table_name} ADD COLUMN {column['name']} {column['type']} DEFAULT {column['default']};"
            cursor.execute(sql)
            print(f"Added column '{column['name']}' to table '{table_name}'")
            
            # Add comment if needed
            # cursor.execute(f"COMMENT ON COLUMN {table_name}.{column['name']} IS '{column['comment']}';")
    
    except Exception as e:
        print(f"Error adding columns to {table_name}: {e}")
        conn.rollback()
    
    finally:
        cursor.close()

def main():
    """Main function to add columns to all program tables."""
    print("=" * 50)
    print("ADD COLUMNS TO PROGRAM TABLES")
    print("=" * 50)
    
    # Connect to the database
    conn = connect_to_database()
    if not conn:
        return
    
    try:
        # Get all program tables
        tables = get_program_tables(conn)
        
        if not tables:
            print("No program tables found in the database.")
            return
        
        print(f"\nFound {len(tables)} program tables:")
        for i, table in enumerate(tables, 1):
            print(f"{i}. {table}")
        
        # Confirm before proceeding
        confirm = input("\nDo you want to add the new columns to all these tables? (y/n): ").strip().lower()
        if confirm != 'y':
            print("Operation cancelled.")
            return
        
        # Add columns to each table
        for table in tables:
            print(f"\nProcessing table: {table}")
            add_columns_to_table(conn, table)
        
        # Commit the changes
        conn.commit()
        print("\nAll columns added successfully!")
    
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    
    finally:
        conn.close()

if __name__ == "__main__":
    main()
