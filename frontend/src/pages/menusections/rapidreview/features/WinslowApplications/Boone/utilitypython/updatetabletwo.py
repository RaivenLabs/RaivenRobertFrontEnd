#!/usr/bin/env python3
import psycopg2
import psycopg2.extras

# Database connection parameters - replace with your values
DB_PARAMS = {
    "dbname": "hawkeye_db",
    "user": "postgres",
    "password": "Raiven7.!!",
    "host": "localhost",
    "port": "5432"
}

def connect_to_db():
    """Connect to the PostgreSQL database"""
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        conn.autocommit = False  # We'll handle transactions manually
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise

def get_tables_by_suffix(conn, suffix):
    """Get all tables with the specified suffix"""
    with conn.cursor() as cur:
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name LIKE %s 
            AND table_schema = 'public'
        """, [f'%{suffix}'])
        return [row[0] for row in cur.fetchall()]

def drop_column_constraints(conn, table_name, column_name):
    """Drop any constraints on the specified column"""
    with conn.cursor() as cur:
        # First, check if the column exists
        cur.execute("""
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = %s 
            AND column_name = %s
        """, [table_name, column_name])
        
        if cur.fetchone() is None:
            print(f"Column {column_name} does not exist in table {table_name}. Skipping.")
            return False
        
        # Get all constraints on this column
        cur.execute("""
            SELECT con.conname
            FROM pg_constraint con
            JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = ANY(con.conkey)
            WHERE con.conrelid = %s::regclass
            AND att.attname = %s
        """, [table_name, column_name])
        
        constraints = [row[0] for row in cur.fetchall()]
        
        if not constraints:
            print(f"No constraints found for {column_name} in {table_name}")
        else:
            # Drop each constraint
            for constraint in constraints:
                print(f"Dropping constraint {constraint} from {table_name}")
                cur.execute(f"ALTER TABLE {table_name} DROP CONSTRAINT {constraint}")
        
        return True

def update_column_values(conn, table_name, column_name, value):
    """Update all values in the specified column"""
    with conn.cursor() as cur:
        print(f"Setting all {column_name} values to '{value}' in {table_name}")
        cur.execute(f"UPDATE {table_name} SET {column_name} = %s", [value])
        print(f"Updated {cur.rowcount} rows")

def add_column_constraint(conn, table_name, column_name, allowed_values):
    """Add a constraint to the specified column"""
    constraint_name = f"{table_name}_{column_name}_values"
    values_str = ", ".join([f"'{val}'" for val in allowed_values])
    
    with conn.cursor() as cur:
        print(f"Adding constraint {constraint_name} to {table_name}.{column_name}")
        cur.execute(f"""
            ALTER TABLE {table_name} 
            ADD CONSTRAINT {constraint_name} 
            CHECK ({column_name} IN ({values_str}))
        """)

def process_column(conn, table_name, column_name, default_value, allowed_values):
    """Process a single column in a table"""
    try:
        print(f"\nProcessing {column_name} in table {table_name}")
        
        # Check if column exists and drop constraints
        if drop_column_constraints(conn, table_name, column_name):
            # Update values
            update_column_values(conn, table_name, column_name, default_value)
            
            # Add new constraint
            add_column_constraint(conn, table_name, column_name, allowed_values)
            
            print(f"Successfully processed {column_name} in {table_name}")
        
    except Exception as e:
        conn.rollback()
        print(f"Error processing {column_name} in {table_name}: {e}")
        return False
    
    return True

def main():
    """Main function to update the database schema"""
    try:
        conn = connect_to_db()
        
        # Get all dimension tables
        dimension_tables = get_tables_by_suffix(conn, "dimensions")
        print(f"Found {len(dimension_tables)} dimension tables: {dimension_tables}")
        
        # Process availability column in dimension tables
        for table in dimension_tables:
            process_column(
                conn, 
                table, 
                "availability", 
                "All", 
                ["All", "Pending", "Customer Only", "Parked"]
            )
            conn.commit()
        
        # Process view column in dimension tables
        for table in dimension_tables:
            process_column(
                conn, 
                table, 
                "hawkeyeview", 
                "on", 
                ["on", "off"]
            )
            conn.commit()
        
        # Get all attribute tables
        attribute_tables = get_tables_by_suffix(conn, "attributes")
        print(f"Found {len(attribute_tables)} attribute tables: {attribute_tables}")
        
        # Process availability column in attribute tables
        for table in attribute_tables:
            process_column(
                conn, 
                table, 
                "availability", 
                "All", 
                ["All", "Pending", "Customer Only", "Parked"]
            )
            conn.commit()
        
        # Process view column in attribute tables
        for table in attribute_tables:
            process_column(
                conn, 
                table, 
                "hawkeyeview", 
                "on", 
                ["on", "off"]
            )
            conn.commit()
        
        print("\nAll operations completed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main()
