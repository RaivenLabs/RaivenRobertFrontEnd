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

def get_column_constraints(conn, table_name, column_name):
    """Get all constraints on a specific column"""
    with conn.cursor() as cur:
        # First, check if the column exists
        cur.execute("""
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = %s 
            AND column_name = %s
        """, [table_name, column_name])
        
        if cur.fetchone() is None:
            print(f"Column {column_name} does not exist in table {table_name}.")
            return []
        
        # Get constraints on this column
        cur.execute("""
            SELECT con.conname AS constraint_name,
                   pg_get_constraintdef(con.oid) AS constraint_definition
            FROM pg_constraint con
            JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = ANY(con.conkey)
            WHERE con.conrelid = %s::regclass
            AND att.attname = %s
        """, [table_name, column_name])
        
        return cur.fetchall()

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

def set_column_default(conn, table_name, column_name, default_value):
    """Set default value for a column"""
    with conn.cursor() as cur:
        print(f"Setting default value '{default_value}' for {table_name}.{column_name}")
        cur.execute(f"""
            ALTER TABLE {table_name} 
            ALTER COLUMN {column_name} SET DEFAULT %s
        """, [default_value])

def get_column_default(conn, table_name, column_name):
    """Get the current default value for a column"""
    with conn.cursor() as cur:
        cur.execute("""
            SELECT column_default
            FROM information_schema.columns
            WHERE table_name = %s
            AND column_name = %s
        """, [table_name, column_name])
        
        result = cur.fetchone()
        return result[0] if result else None

def process_column(conn, table_name, column_name, current_value, default_value, allowed_values):
    """Process a single column in a table"""
    try:
        print(f"\nProcessing {column_name} in table {table_name}")
        
        # Check if column exists and drop constraints
        if drop_column_constraints(conn, table_name, column_name):
            # Update values
            update_column_values(conn, table_name, column_name, current_value)
            
            # Add new constraint
            add_column_constraint(conn, table_name, column_name, allowed_values)
            
            # Set default value
            set_column_default(conn, table_name, column_name, default_value)
            
            print(f"Successfully processed {column_name} in {table_name}")
        
    except Exception as e:
        conn.rollback()
        print(f"Error processing {column_name} in {table_name}: {e}")
        return False
    
    return True

def verify_constraints(conn, table_name, column_name, allowed_values):
    """Verify that constraints were applied correctly"""
    constraints = get_column_constraints(conn, table_name, column_name)
    
    if not constraints:
        print(f"WARNING: No constraints found for {column_name} in {table_name}")
        return False
    
    # Convert allowed_values to a set for comparison
    allowed_set = set(allowed_values)
    
    for _, definition in constraints:
        # Extract values from constraint definition (format: CHECK (column IN ('val1', 'val2')))
        if "IN (" in definition:
            values_part = definition.split("IN (")[1].split(")")[0]
            values = [v.strip().strip("'\"") for v in values_part.split(",")]
            constraint_set = set(values)
            
            if constraint_set == allowed_set:
                print(f"Constraint verification PASSED for {column_name} in {table_name}")
                return True
    
    print(f"WARNING: Constraint verification FAILED for {column_name} in {table_name}")
    return False

def verify_default(conn, table_name, column_name, expected_default):
    """Verify that the default value was set correctly"""
    current_default = get_column_default(conn, table_name, column_name)
    
    # PostgreSQL stores defaults with quotes, e.g. 'Pending'::text
    if current_default and expected_default in current_default:
        print(f"Default value verification PASSED for {column_name} in {table_name}")
        return True
    
    print(f"WARNING: Default value verification FAILED for {column_name} in {table_name}")
    print(f"  Expected: {expected_default}, Found: {current_default}")
    return False

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
                "All",                                   # Current value to set for existing rows
                "Pending",                               # Default value for new rows
                ["All", "Pending", "Customer Only", "Parked"]  # Allowed values
            )
            conn.commit()
            
            # Verify
            verify_constraints(conn, table, "availability", ["All", "Pending", "Customer Only", "Parked"])
            verify_default(conn, table, "availability", "Pending")
        
        # Process hawkeyeview column in dimension tables
        for table in dimension_tables:
            process_column(
                conn, 
                table, 
                "hawkeyeview", 
                "on",        # Current value to set for existing rows
                "off",       # Default value for new rows
                ["on", "off"]  # Allowed values
            )
            conn.commit()
            
            # Verify
            verify_constraints(conn, table, "hawkeyeview", ["on", "off"])
            verify_default(conn, table, "hawkeyeview", "off")
        
        # Get all attribute tables
        attribute_tables = get_tables_by_suffix(conn, "attributes")
        print(f"Found {len(attribute_tables)} attribute tables: {attribute_tables}")
        
        # Process availability column in attribute tables
        for table in attribute_tables:
            process_column(
                conn, 
                table, 
                "availability", 
                "All",                                   # Current value to set for existing rows
                "Pending",                               # Default value for new rows
                ["All", "Pending", "Customer Only", "Parked"]  # Allowed values
            )
            conn.commit()
            
            # Verify
            verify_constraints(conn, table, "availability", ["All", "Pending", "Customer Only", "Parked"])
            verify_default(conn, table, "availability", "Pending")
        
        # Process hawkeyeview column in attribute tables
        for table in attribute_tables:
            process_column(
                conn, 
                table, 
                "hawkeyeview", 
                "on",        # Current value to set for existing rows
                "off",       # Default value for new rows
                ["on", "off"]  # Allowed values
            )
            conn.commit()
            
            # Verify
            verify_constraints(conn, table, "hawkeyeview", ["on", "off"])
            verify_default(conn, table, "hawkeyeview", "off")
        
        print("\nAll operations completed successfully!")
        
        # Summarize results
        print("\n=== SUMMARY ===")
        all_tables = dimension_tables + attribute_tables
        for table in all_tables:
            print(f"\nTable: {table}")
            # Check availability column
            constraints = get_column_constraints(conn, table, "availability")
            default = get_column_default(conn, table, "availability")
            if constraints:
                print(f"  availability constraints: {constraints}")
            else:
                print(f"  No constraints found for availability")
            print(f"  availability default: {default}")
            
            # Check hawkeyeview column
            constraints = get_column_constraints(conn, table, "hawkeyeview")
            default = get_column_default(conn, table, "hawkeyeview")
            if constraints:
                print(f"  hawkeyeview constraints: {constraints}")
            else:
                print(f"  No constraints found for hawkeyeview")
            print(f"  hawkeyeview default: {default}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main()
