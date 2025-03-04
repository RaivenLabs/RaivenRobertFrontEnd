import os
import json
import anthropic
import psycopg2
from psycopg2.extras import DictCursor
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

# Database connection parameters
PG_USER = os.getenv("PG_USER", "postgres")
PG_PASSWORD = os.getenv("PG_PASSWORD", "")
PG_HOST = os.getenv("PG_HOST", "localhost")
PG_PORT = os.getenv("PG_PORT", "5432")
PG_DATABASE = "hawkeye_db"

# Anthropic API key
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

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

def find_dimensions_without_attributes():
    """Find dimensions that don't have any attributes in the attributes table."""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=DictCursor)
    
    # This improved query uses NOT EXISTS instead of LEFT JOIN
    # It specifically finds dimensions that don't have any corresponding records in the attributes table
    cursor.execute("""
    SELECT d.id, d.dimension_id, d.display_name 
    FROM saasdimensions d
    WHERE NOT EXISTS (
        SELECT 1 FROM saasattributes a 
        WHERE a.dimension_id = d.id
    )
    ORDER BY d.order_num
    """)
    
    orphaned_dimensions = cursor.fetchall()
    
    # Let's also print the total counts for verification
    cursor.execute("SELECT COUNT(*) FROM saasdimensions")
    total_dimensions = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(DISTINCT dimension_id) FROM saasattributes")
    dimensions_with_attributes = cursor.fetchone()[0]
    
    print(f"Database has {total_dimensions} total dimensions")
    print(f"Database has {dimensions_with_attributes} dimensions with attributes")
    print(f"Found {len(orphaned_dimensions)} dimensions without any attributes")
    
    cursor.close()
    conn.close()
    
    return orphaned_dimensions

def read_file_content(file_path):
    """
    Read the content of a document.
    Handles both text and basic PDF files.
    """
    try:
        # Simple extension check to determine file type
        if file_path.lower().endswith('.pdf'):
            try:
                # Try to use PyPDF2 if available
                import PyPDF2
                with open(file_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    content = ""
                    for page_num in range(len(reader.pages)):
                        content += reader.pages[page_num].extract_text() + "\n\n"
                    return content
            except ImportError:
                print("PyPDF2 not installed. Please install with 'pip install PyPDF2' for PDF support.")
                return None
        else:
            # Read as text file
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
    except UnicodeDecodeError:
        # Try with a different encoding if utf-8 fails
        try:
            with open(file_path, 'r', encoding='latin-1') as file:
                return file.read()
        except Exception as e:
            print(f"Error reading file with latin-1 encoding: {e}")
            return None
    except Exception as e:
        print(f"Error reading file: {e}")
        return None

def extract_json_from_text(text):
    """Extract JSON from text, handling markdown code blocks."""
    # Check if the text is wrapped in markdown code blocks
    if text.startswith("```") and "```" in text[3:]:
        # Find the end of the opening code block marker
        start_pos = text.find("\n", 3) + 1
        # Find the start of the closing code block marker
        end_pos = text.rfind("```")
        
        # Extract what's inside the code blocks
        extracted = text[start_pos:end_pos].strip()
        return extracted
    
    # If it's not wrapped in code blocks, try to find JSON directly
    # This is a simple approach: find outermost matching braces
    json_pattern = re.compile(r'\{.*\}', re.DOTALL)
    match = json_pattern.search(text)
    if match:
        return match.group(0)
    
    # If all else fails, return the original text
    return text

def list_all_dimensions():
    """List all dimensions in the database with their attribute counts."""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=DictCursor)
    
    cursor.execute("""
    SELECT d.id, d.dimension_id, d.display_name, COUNT(a.id) as attribute_count
    FROM saasdimensions d
    LEFT JOIN saasattributes a ON d.id = a.dimension_id
    GROUP BY d.id, d.dimension_id, d.display_name
    ORDER BY d.order_num
    """)
    
    dimensions = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return dimensions

def query_claude_for_attributes(dimension, document_content):
    """
    Query Claude API to suggest attributes for a single dimension
    based on the content of the document.
    """
    if not ANTHROPIC_API_KEY:
        print("Error: ANTHROPIC_API_KEY not set in environment variables")
        return None
    
    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        
        # Create a shorter version of the content if it's too long
        # Claude has token limits, so we need to be careful
        max_content_length = 50000  # Roughly 12,500 tokens
        if len(document_content) > max_content_length:
            document_content = document_content[:max_content_length] + "...\n[Document truncated due to length]"
        
        # Prepare the prompt for Claude
        prompt = f"""
I have a PostgreSQL database for M&A due diligence with dimensions and attributes.

The dimension "{dimension['display_name']}" (ID: {dimension['dimension_id']}) currently has no attributes.

I have a document containing standard M&A due diligence checklists. Here's the content:

{document_content}

Based on this document, please generate appropriate attributes for the "{dimension['display_name']}" dimension.
For each attribute, provide:
1. attribute_id: a lowercase snake_case unique identifier
2. display_name: a human-readable name for the attribute
3. data_type: one of [text, string, boolean, date, number]
4. required: true or false
5. max_length: for text/string fields, maximum length (use 2000 for most text fields)
6. order_num: sequential order starting from 1

Important: Each dimension should include standard administrative attributes at the end:
- owner (who is responsible for this item)
- completion_status (boolean indicating if it's complete)
- completion_date (date when it was completed)
- notes (general notes field)

Format your response as a JSON object where the key is the dimension_id and the value is an array of attribute objects. Example:

{{
  "{dimension['dimension_id']}": [
    {{
      "attribute_id": "example_attribute",
      "display_name": "Example Attribute",
      "data_type": "text",
      "required": true,
      "max_length": 2000,
      "order_num": 1
    }},
    ...more attributes...
  ]
}}

Return ONLY the JSON object, no other text.
"""
        
        # Call the Anthropic API
        print("Querying Claude for attribute suggestions...")
        response = client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=4000,
            temperature=0.2,  # Lower temperature for more precise/predictable responses
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        # Extract the content from the response
        content = response.content[0].text
        
        # Clean up the JSON content by extracting it from markdown or other wrapping
        print("Processing Claude's response...")
        json_content = extract_json_from_text(content)
        
        # Try to parse the JSON
        try:
            result = json.loads(json_content)
            print("Successfully parsed JSON response from Claude.")
            return result
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            print("Raw response:", content)
            print("\nExtracted JSON content:", json_content)
            return None
            
    except Exception as e:
        print(f"Error querying Claude API: {e}")
        return None

def add_attributes_to_database(attributes_json):
    """Add the suggested attributes to the database."""
    if not attributes_json:
        print("No valid attributes to add.")
        return
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        total_attributes_added = 0
        
        # Process each dimension's attributes
        for dimension_id, attributes in attributes_json.items():
            # Get the database ID for this dimension
            cursor.execute("SELECT id FROM saasdimensions WHERE dimension_id = %s", (dimension_id,))
            result = cursor.fetchone()
            
            if not result:
                print(f"Error: Dimension {dimension_id} not found in database.")
                continue
                
            db_dimension_id = result[0]
            attributes_added = 0
            
            # Add each attribute
            for attr in attributes:
                # Check if attribute already exists
                cursor.execute(
                    "SELECT id FROM saasattributes WHERE dimension_id = %s AND attribute_id = %s",
                    (db_dimension_id, attr['attribute_id'])
                )
                
                if cursor.fetchone():
                    print(f"Attribute {attr['attribute_id']} already exists for {dimension_id}, skipping...")
                    continue
                
                # Insert the new attribute
                cursor.execute("""
                INSERT INTO saasattributes 
                (dimension_id, attribute_id, display_name, data_type, required, max_length, order_num, is_core)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    db_dimension_id,
                    attr['attribute_id'],
                    attr['display_name'],
                    attr['data_type'],
                    attr['required'],
                    attr.get('max_length'),
                    attr['order_num'],
                    True  # is_core
                ))
                
                attributes_added += 1
            
            total_attributes_added += attributes_added
            print(f"Added {attributes_added} attributes to {dimension_id}")
        
        conn.commit()
        print(f"Successfully added {total_attributes_added} attributes to the database.")
        
    except Exception as e:
        conn.rollback()
        print(f"Error adding attributes to database: {e}")
    
    finally:
        cursor.close()
        conn.close()

def main():
    """Main function to run the script."""
    print("Welcome to the Attribute Generator")
    print("="*50)
    
    # First list all dimensions with their attribute counts for visibility
    print("\nCurrent dimensions and their attribute counts:")
    dimensions = list_all_dimensions()
    for i, dim in enumerate(dimensions, 1):
        print(f"{i}. {dim['display_name']} - {dim['attribute_count']} attributes")
    
    # Step 1: Find dimensions without attributes
    print("\nSearching for dimensions without attributes...")
    dimensions_without_attributes = find_dimensions_without_attributes()
    
    if not dimensions_without_attributes:
        print("All dimensions have attributes! Nothing to do.")
        return
    
    # Step 2: Display dimensions without attributes
    print(f"\nFound {len(dimensions_without_attributes)} dimensions without attributes:")
    for i, dim in enumerate(dimensions_without_attributes, 1):
        print(f"{i}. {dim['display_name']} (ID: {dim['dimension_id']})")
    
    # Step 3: Let user select one dimension
    while True:
        try:
            choice = input("\nSelect one dimension to work on (enter the number): ")
            dim_index = int(choice) - 1
            if 0 <= dim_index < len(dimensions_without_attributes):
                selected_dimension = dimensions_without_attributes[dim_index]
                break
            else:
                print("Invalid selection. Please try again.")
        except ValueError:
            print("Please enter a valid number.")
    
    print(f"\nSelected dimension: {selected_dimension['display_name']}")
    
    # Step 4: Ask for file path
    file_path = input("\nEnter the path to your due diligence document (PDF/TXT): ")
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' does not exist.")
        return
    
    # Step 5: Read the document content
    print(f"Reading file: {file_path}")
    content = read_file_content(file_path)
    if not content:
        print("Failed to read file content. Please check the file format and try again.")
        return
    
    print(f"Successfully read {len(content)} characters from the file.")
    
    # Step 6: Query Claude for attribute suggestions
    print(f"\nAsking Claude to suggest attributes for {selected_dimension['display_name']}...")
    attributes_json = query_claude_for_attributes(selected_dimension, content)
    
    if not attributes_json:
        print("Failed to generate attributes.")
        return
    
    # Step 7: Display the suggested attributes
    print("\nClaude suggested the following attributes:")
    print("="*50)
    
    # Format and print the JSON
    formatted_json = json.dumps(attributes_json, indent=2)
    print(formatted_json)
    
    # Step 8: Ask if user wants to save to a file
    save_choice = input("\nWould you like to save these suggestions to a JSON file? (y/n): ")
    if save_choice.lower() == 'y':
        output_file = f"{selected_dimension['dimension_id']}_attributes.json"
        with open(output_file, 'w') as f:
            f.write(formatted_json)
        print(f"Saved to {output_file}")
    
    # Step 9: Ask if user wants to add these attributes to the database
    add_choice = input("\nWould you like to add these attributes to the database? (y/n): ")
    if add_choice.lower() == 'y':
        add_attributes_to_database(attributes_json)

if __name__ == "__main__":
    main()
