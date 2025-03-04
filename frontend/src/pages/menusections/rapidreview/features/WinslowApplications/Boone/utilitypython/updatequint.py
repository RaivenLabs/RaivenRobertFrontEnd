#!/usr/bin/env python3
import psycopg2
import psycopg2.extras
import re

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

def check_column_exists(conn, table_name, column_name):
    """Check if a column exists in a table"""
    with conn.cursor() as cur:
        cur.execute("""
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = %s 
            AND column_name = %s
        """, [table_name, column_name])
        return cur.fetchone() is not None

def create_order_num_trigger_function(conn):
    """Create the function for setting default order_num"""
    print("Creating function to set default order_num...")
    with conn.cursor() as cur:
        cur.execute("""
        CREATE OR REPLACE FUNCTION set_default_order() RETURNS TRIGGER AS $$
        BEGIN
            IF NEW.order_num IS NULL THEN
                NEW.order_num := NEW.id;
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        """)
    print("Function created successfully.")

def create_program_type_trigger_function(conn):
    """Create the function for setting default program_type (only for dimension tables)"""
    print("Creating function to set default program_type...")
    with conn.cursor() as cur:
        cur.execute("""
        CREATE OR REPLACE FUNCTION set_default_program_type() RETURNS TRIGGER AS $$
        DECLARE
            table_prefix text;
        BEGIN
            -- Extract prefix from table name
            IF TG_TABLE_NAME LIKE '%dimensions' THEN
                table_prefix := substring(TG_TABLE_NAME from 1 for position('dimensions' in TG_TABLE_NAME) - 1);
            ELSE
                table_prefix := 'unknown';
            END IF;
            
            -- Only set program_type if it exists and is NULL
            -- Check if column exists in the NEW record (it will for dimensions tables)
            IF NEW.program_type IS NULL THEN
                -- Map table prefix to program_type
                IF table_prefix = 'acquisition' THEN
                    NEW.program_type := 'M&A';
                ELSIF table_prefix = 'saas' THEN
                    NEW.program_type := 'SAAS';
                ELSE
                    -- Just use the prefix as-is for other types
                    NEW.program_type := upper(table_prefix);
                END IF;
            END IF;
            
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        """)
    print("Function created successfully.")

def create_trigger(conn, table_name, trigger_name, function_name):
    """Create a trigger on a table if the relevant column exists"""
    # For program_type trigger, only create it if the table has that column
    if function_name == "set_default_program_type" and not check_column_exists(conn, table_name, "program_type"):
        print(f"Skipping {trigger_name} on {table_name} as program_type column doesn't exist.")
        return
    
    print(f"Creating {trigger_name} trigger on {table_name}...")
    with conn.cursor() as cur:
        # Drop the trigger if it already exists
        cur.execute(f"""
        DROP TRIGGER IF EXISTS {trigger_name} ON {table_name};
        """)
        
        # Create the new trigger
        cur.execute(f"""
        CREATE TRIGGER {trigger_name}
        BEFORE INSERT ON {table_name}
        FOR EACH ROW EXECUTE PROCEDURE {function_name}();
        """)
    print(f"Trigger created successfully on {table_name}.")

def show_table_schema(conn, table_name):
    """Show the schema for a table"""
    with conn.cursor() as cur:
        print(f"\n=== Schema for {table_name} ===")
        
        # Column definitions
        cur.execute("""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = %s
        ORDER BY ordinal_position
        """, [table_name])
        
        print("\nColumns:")
        print("| {:<20} | {:<20} | {:<10} | {:<30} |".format(
            "Column Name", "Data Type", "Nullable", "Default Value"))
        print("| {:<20} | {:<20} | {:<10} | {:<30} |".format(
            "-" * 20, "-" * 20, "-" * 10, "-" * 30))
        
        for col in cur.fetchall():
            print("| {:<20} | {:<20} | {:<10} | {:<30} |".format(
                col[0], col[1], col[2], str(col[3])[:30] if col[3] else "None"))
        
        # Constraints
        cur.execute("""
        SELECT con.conname AS constraint_name,
               pg_get_constraintdef(con.oid) AS constraint_definition
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        WHERE rel.relname = %s
        """, [table_name])
        
        print("\nConstraints:")
        constraints = cur.fetchall()
        if constraints:
            for con in constraints:
                print(f"- {con[0]}: {con[1]}")
        else:
            print("No constraints found.")
        
        # Triggers
        cur.execute("""
        SELECT trigger_name, event_manipulation, action_statement
        FROM information_schema.triggers
        WHERE event_object_table = %s
        """, [table_name])
        
        print("\nTriggers:")
        triggers = cur.fetchall()
        if triggers:
            for trig in triggers:
                print(f"- {trig[0]} ({trig[1]}): {trig[2]}")
        else:
            print("No triggers found.")

def get_view_column_name(conn, table_name):
    """Get the name of the view column - could be 'view' or 'hawkeyeview'"""
    if check_column_exists(conn, table_name, "view"):
        return "view"
    elif check_column_exists(conn, table_name, "hawkeyeview"):
        return "hawkeyeview"
    else:
        return None

def test_triggers_dimensions(conn, table_name):
    """Test the triggers on a dimensions table"""
    print(f"\n=== Testing triggers on {table_name} ===")
    
    # Extract the table prefix for dimension_id creation
    prefix = re.sub(r'dimensions$', '', table_name)
    test_id = f"{prefix}_test_trigger_{table_name}"
    
    try:
        with conn.cursor() as cur:
            # Get the view column name
            view_column = get_view_column_name(conn, table_name)
            
            # Insert a test record
            cur.execute(f"""
            INSERT INTO {table_name} (dimension_id, display_name)
            VALUES (%s, %s)
            RETURNING id, dimension_id, display_name, program_type, order_num, availability, {view_column}
            """, [test_id, f"Test {table_name} Trigger"])
            
            result = cur.fetchone()
            if result:
                print("Test row inserted successfully!")
                print(f"ID: {result[0]}")
                print(f"Dimension ID: {result[1]}")
                print(f"Display Name: {result[2]}")
                print(f"Program Type: {result[3]}")
                print(f"Order Num: {result[4]}")
                print(f"Availability: {result[5]}")
                print(f"{view_column.capitalize()}: {result[6]}")
            else:
                print("No result returned from insert.")

        # Roll back the test
        conn.rollback()
        print("Test rolled back (no data was permanently inserted).")
        
    except Exception as e:
        conn.rollback()
        print(f"Error testing triggers: {e}")

def test_triggers_attributes(conn, table_name):
    """Test the triggers on an attributes table"""
    print(f"\n=== Testing triggers on {table_name} ===")
    
    # Extract the table prefix for attribute_id creation
    prefix = re.sub(r'attributes$', '', table_name)
    test_id = f"{prefix}_test_trigger_{table_name}"
    
    try:
        with conn.cursor() as cur:
            # First, find a valid dimension_id for this attribute
            cur.execute(f"""
            SELECT id FROM {prefix}dimensions LIMIT 1
            """)
            dim_result = cur.fetchone()
            
            if not dim_result:
                print(f"No dimension found for {prefix}. Creating one...")
                cur.execute(f"""
                INSERT INTO {prefix}dimensions (dimension_id, display_name)
                VALUES (%s, %s)
                RETURNING id
                """, [f"{prefix}_test_dim", f"Test {prefix} Dimension"])
                dim_result = cur.fetchone()
            
            if dim_result:
                dimension_id = dim_result[0]
                
                # Get the view column name
                view_column = get_view_column_name(conn, table_name)
                
                # Insert a test attribute
                cur.execute(f"""
                INSERT INTO {table_name} (dimension_id, attribute_id, display_name)
                VALUES (%s, %s, %s)
                RETURNING id, attribute_id, display_name, order_num, availability, {view_column}
                """, [dimension_id, test_id, f"Test {table_name} Trigger"])
                
                result = cur.fetchone()
                if result:
                    print("Test row inserted successfully!")
                    print(f"ID: {result[0]}")
                    print(f"Attribute ID: {result[1]}")
                    print(f"Display Name: {result[2]}")
                    print(f"Order Num: {result[3]}")
                    print(f"Availability: {result[4]}")
                    print(f"{view_column.capitalize()}: {result[5]}")
                else:
                    print("No result returned from insert.")
            else:
                print(f"Could not create a test dimension for {table_name}")
                return

        # Roll back the test
        conn.rollback()
        print("Test rolled back (no data was permanently inserted).")
        
    except Exception as e:
        conn.rollback()
        print(f"Error testing triggers: {e}")

def update_existing_records(conn, table_name):
    """Update existing records according to our new logic"""
    print(f"\n=== Updating existing records in {table_name} ===")
    try:
        with conn.cursor() as cur:
            # Update records with NULL order_num to use their ID
            cur.execute(f"""
            UPDATE {table_name}
            SET order_num = id
            WHERE order_num IS NULL
            """)
            print(f"Updated {cur.rowcount} rows with NULL order_num to use ID")
            
            # Only update program_type for dimensions tables
            if 'dimensions' in table_name and check_column_exists(conn, table_name, "program_type"):
                # Extract table prefix for program_type
                table_prefix = re.sub(r'dimensions$', '', table_name)
                
                # Map prefix to program_type (same logic as trigger)
                if table_prefix == 'acquisition':
                    program_type = 'M&A'
                elif table_prefix == 'saas':
                    program_type = 'SAAS'
                else:
                    program_type = table_prefix.upper()
                
                # Update records with NULL program_type
                cur.execute(f"""
                UPDATE {table_name}
                SET program_type = %s
                WHERE program_type IS NULL
                """, [program_type])
                print(f"Updated {cur.rowcount} rows with NULL program_type to '{program_type}'")
    except Exception as e:
        conn.rollback()
        print(f"Error updating existing records: {e}")
        return False
    
    return True

def main():
    """Main function to set up triggers and show table schema"""
    try:
        conn = connect_to_db()
        
        # Step 1: Create the trigger functions
        create_order_num_trigger_function(conn)
        create_program_type_trigger_function(conn)
        conn.commit()
        print("Trigger functions created successfully.\n")
        
        # Step 2: Get all dimension and attribute tables
        dimension_tables = get_tables_by_suffix(conn, "dimensions")
        attribute_tables = get_tables_by_suffix(conn, "attributes")
        
        print(f"Found {len(dimension_tables)} dimension tables: {dimension_tables}")
        print(f"Found {len(attribute_tables)} attribute tables: {attribute_tables}")
        print()
        
        # Step 3: Create triggers on dimension tables
        for table in dimension_tables:
            create_trigger(conn, table, "set_order_num_trigger", "set_default_order")
            create_trigger(conn, table, "set_program_type_trigger", "set_default_program_type")
            conn.commit()
        
        # Step 4: Create triggers on attribute tables (only order_num trigger)
        for table in attribute_tables:
            create_trigger(conn, table, "set_order_num_trigger", "set_default_order")
            # Skip program_type trigger for attributes tables since they don't have this column
            conn.commit()
        
        print("\nAll triggers created successfully!")
        
        # Step 5: Update existing records
        print("\n=== Updating Existing Records ===")
        update_existing = input("Do you want to update existing records? (y/n): ").lower().strip()
        
        if update_existing == 'y':
            print("Updating existing records...")
            
            # Update dimension tables
            for table in dimension_tables:
                if update_existing_records(conn, table):
                    conn.commit()
                    print(f"Successfully updated records in {table}")
                else:
                    print(f"Failed to update records in {table}")
            
            # Update attribute tables
            for table in attribute_tables:
                if update_existing_records(conn, table):
                    conn.commit()
                    print(f"Successfully updated records in {table}")
                else:
                    print(f"Failed to update records in {table}")
        else:
            print("Skipping update of existing records.")
        
        # Step 6: Show schema for acquisition tables
        show_table_schema(conn, "acquisitiondimensions")
        show_table_schema(conn, "acquisitionattributes")
        
        # Step 7: Test the triggers
        test_triggers_dimensions(conn, "acquisitiondimensions")
        test_triggers_attributes(conn, "acquisitionattributes")
        
        print("\nSetup completed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    main()
