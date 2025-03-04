#!/usr/bin/env python3
"""
Enhanced Due Diligence Schema Generator with File Upload

This script helps you:
1. Upload due diligence materials directly
2. Process them through the schema_blueprint API
3. Generate a schema based on analysis of files and contextual background
4. Save the schema to a file and to the API
"""

import os
import sys
import json
import requests
from datetime import datetime
import time
import argparse
import glob

# Default settings
DEFAULT_BASE_URL = "http://localhost:5000"

def clear_screen():
    """Clear the terminal screen"""
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header(text):
    """Print a formatted header"""
    print("\n" + "=" * 80)
    print(f" {text}")
    print("=" * 80 + "\n")

def print_step(step_num, text):
    """Print a step header"""
    print(f"\n[Step {step_num}] {text}")
    print("-" * 80)

def get_project_info():
    """Get project information from the user"""
    print_step(1, "Project Information")
    
    project_name = input("Enter project name (default: 3MAcquisition): ").strip()
    if not project_name:
        project_name = f"3MAcquisition"
        print(f"Using default project name: {project_name}")
    
    schema_name = input("Enter schema name (default: SequoiaSchema): ").strip()
    if not schema_name:
        schema_name = f"SequoiaSchema"
        print(f"Using default schema name: {schema_name}")
    
    document_type = input("Enter document type (default: due_diligence): ").strip()
    if not document_type:
        document_type = "due_diligence"
        print(f"Using default document type: {document_type}")
    
    return {
        "project_name": project_name,
        "schema_name": schema_name,
        "document_type": document_type,
        "timestamp": datetime.now().strftime("%Y%m%d_%H%M%S")
    }

def get_extraction_goals():
    """Get extraction goals from the user"""
    print_step(2, "Extraction Goals")
    print("Default extraction goals:")
    default_goals = [
        "Extract financial metrics and KPIs",
        "Identify key risks and liabilities",
        "Catalog intellectual property assets",
        "Extract contractual obligations and commitments",
        "Identify regulatory compliance issues"
    ]
    
    for i, goal in enumerate(default_goals, 1):
        print(f"  {i}. {goal}")
    
    use_default = input("\nUse default extraction goals? (y/n) [y]: ").strip().lower()
    if not use_default or use_default == 'y':
        return default_goals
    
    print("\nEnter extraction goals (what data should be extracted), one per line.")
    print("Press Enter twice when done.")
    
    goals = []
    while True:
        goal = input(f"Goal {len(goals)+1} (or Enter to finish): ").strip()
        if not goal:
            break
        goals.append(goal)
    
    if not goals:
        print("No goals entered. Using default extraction goals.")
        return default_goals
    
    return goals

def get_files_to_upload():
    """Get files to upload from the current directory"""
    print_step(3, "Select Files to Upload")
    
    # Look for common due diligence file types
    file_patterns = ['*.xlsx', '*.xls', '*.csv', '*.pdf', '*.docx', '*.doc', '*.txt', '*.json']
    all_files = []
    
    for pattern in file_patterns:
        all_files.extend(glob.glob(pattern))
    
    if not all_files:
        print("No suitable files found in the current directory.")
        return []
    
    print("Files available for upload:")
    for i, file in enumerate(all_files, 1):
        file_size = os.path.getsize(file) / 1024  # Size in KB
        print(f"  {i}. {file} ({file_size:.1f} KB)")
    
    # Get user selection
    use_all = input("\nUpload all files? (y/n) [y]: ").strip().lower()
    if not use_all or use_all == 'y':
        selected_files = all_files
    else:
        selection = input("Enter file numbers to upload (comma-separated, e.g., 1,3,4): ").strip()
        try:
            indices = [int(idx.strip()) - 1 for idx in selection.split(',') if idx.strip()]
            selected_files = [all_files[idx] for idx in indices if 0 <= idx < len(all_files)]
        except (ValueError, IndexError):
            print("Invalid selection. Please try again.")
            return get_files_to_upload()
    
    if not selected_files:
        print("No files selected. Please select at least one file.")
        return get_files_to_upload()
    
    print("\nSelected files:")
    for file in selected_files:
        print(f"  - {file}")
    
    confirm = input("\nConfirm these selections? (y/n) [y]: ").strip().lower()
    if not confirm or confirm == 'y':
        return selected_files
    else:
        return get_files_to_upload()

def analyze_documents(base_url, file_paths, document_type, extraction_goals):
    """Upload and analyze documents using the API"""
    print_step(4, "Analyzing Documents")
    print("Uploading and analyzing files...")
    
    # Prepare API endpoint URL
    url = f"{base_url}/api/analyze-documents"
    
    # Prepare context data
    context = {
        "documentType": document_type,
        "extractionGoals": extraction_goals,
        "userNotes": "Generated via Enhanced Due Diligence Schema Generator script"
    }
    
    # Create multipart form data
    files = {}
    for i, path in enumerate(file_paths):
        print(f"Preparing file {i+1}/{len(file_paths)}: {path}")
        # Make a copy of the file to avoid locking issues
        temp_path = f"temp_copy_{os.path.basename(path)}"
        try:
            with open(path, 'rb') as src, open(temp_path, 'wb') as dst:
                dst.write(src.read())
            files[f'file_{i}'] = (os.path.basename(path), open(temp_path, 'rb'))
        except Exception as e:
            print(f"Error preparing file {path}: {str(e)}")
            # Try without making a copy
            try:
                files[f'file_{i}'] = (os.path.basename(path), open(path, 'rb'))
            except Exception as e:
                print(f"Cannot open file {path}: {str(e)}")
                continue
    
    # Add context to form data
    form_data = {'context': json.dumps(context)}
    
    # Send request to API
    try:
        print("Sending files to API for analysis...")
        response = requests.post(url, files=files, data=form_data)
        
        # Close file handles
        for file_obj in files.values():
            file_obj[1].close()
        
        # Remove temp files
        for path in glob.glob("temp_copy_*"):
            try:
                os.remove(path)
            except:
                pass
        
        if response.status_code == 200:
            print("Analysis completed successfully!")
            return response.json()
        else:
            print(f"Error analyzing documents: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Create fallback analysis results
            print("Creating fallback analysis results...")
            
            # Get briefing context
            try:
                briefing_response = requests.get(f"{base_url}/api/briefing/test-project-123").json()
            except:
                briefing_response = {
                    "context": {
                        "business_context": "This is a due diligence review for a private equity acquisition"
                    },
                    "scope": "The scope includes reviewing financial statements, operational metrics, and risk factors."
                }
            
            # Create synthetic analysis results
            return {
                "document_type": document_type,
                "extraction_goals": extraction_goals,
                "file_analyses": [
                    {
                        "file_type": "structured_data" if path.endswith(('.xlsx', '.xls', '.csv')) else "document",
                        "filename": os.path.basename(path)
                    } for path in file_paths
                ],
                "briefing_context": briefing_response
            }
    except Exception as e:
        print(f"Error during document analysis: {str(e)}")
        
        # Close file handles
        for file_obj in files.values():
            try:
                file_obj[1].close()
            except:
                pass
        
        # Remove temp files
        for path in glob.glob("temp_copy_*"):
            try:
                os.remove(path)
            except:
                pass
        
        return None

def generate_schema(base_url, analysis_results, document_type, extraction_goals):
    """Generate schema using the API"""
    print_step(5, "Generating Schema")
    print("Generating schema based on document analysis...")
    
    # Prepare API endpoint URL
    url = f"{base_url}/api/generate-schema"
    
    # Prepare context data
    context = {
        "documentType": document_type,
        "extractionGoals": extraction_goals,
        "userNotes": "Generated via Enhanced Due Diligence Schema Generator script"
    }
    
    # Prepare model settings
    model_settings = {
        "temperature": 0.3,  # Slightly higher temperature to encourage proper schema generation
        "maxTokens": 4000,
        "model": "claude-3-7-sonnet-20250219"
    }
    
    # Prepare request payload
    payload = {
        "analysisResults": analysis_results,
        "context": context,
        "modelSettings": model_settings
    }
    
    # Send request to API
    try:
        print("Sending request to generate schema...")
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            print("Schema generated successfully!")
            return response.json()
        else:
            print(f"Error generating schema: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Fall back to sample schema
            print("Falling back to sample schema...")
            return create_sample_schema(document_type)
    except Exception as e:
        print(f"Error during schema generation: {str(e)}")
        
        # Fall back to sample schema
        print("Falling back to sample schema due to error...")
        return create_sample_schema(document_type)

def create_sample_schema(document_type):
    """Create a sample schema for testing"""
    return {
        "name": f"{document_type}_schema",
        "description": f"Schema for extracting data from {document_type} documents",
        "fields": [
            {
                "name": "document_id",
                "type": "string",
                "description": "Unique identifier for the document",
                "required": True
            },
            {
                "name": "document_title",
                "type": "string",
                "description": "Title of the document",
                "required": True
            },
            {
                "name": "document_date",
                "type": "date",
                "description": "Date of the document",
                "required": True,
                "format": "YYYY-MM-DD"
            },
            {
                "name": "document_type",
                "type": "string",
                "description": "Type of document (e.g., contract, financial statement)",
                "required": True
            },
            {
                "name": "parties_involved",
                "type": "array",
                "description": "List of parties involved in the document",
                "required": False,
                "items": {
                    "type": "object",
                    "fields": [
                        {
                            "name": "party_name",
                            "type": "string",
                            "description": "Name of the party",
                            "required": True
                        },
                        {
                            "name": "party_role",
                            "type": "string",
                            "description": "Role of the party in the document",
                            "required": False
                        }
                    ]
                }
            },
            {
                "name": "financial_data",
                "type": "object",
                "description": "Financial information extracted from the document",
                "required": False,
                "fields": [
                    {
                        "name": "revenue",
                        "type": "number",
                        "description": "Revenue amount",
                        "required": False
                    },
                    {
                        "name": "expenses",
                        "type": "number",
                        "description": "Expense amount",
                        "required": False
                    },
                    {
                        "name": "profit",
                        "type": "number",
                        "description": "Profit amount",
                        "required": False
                    }
                ]
            }
        ]
    }

def display_schema_summary(schema):
    """Display a summary of the generated schema"""
    print_step(6, "Schema Summary")
    
    if not schema:
        print("No schema available to display")
        return
    
    print(f"Schema Name: {schema.get('name', 'Unnamed Schema')}")
    print(f"Description: {schema.get('description', 'No description')}")
    
    fields = schema.get('fields', [])
    print(f"\nFields: {len(fields)}")
    
    for i, field in enumerate(fields[:10], 1):  # Show first 10 fields
        field_type = field.get('type', 'unknown')
        required = "Required" if field.get('required', False) else "Optional"
        print(f"  {i}. {field.get('name', 'Unnamed')} ({field_type}, {required})")
    
    if len(fields) > 10:
        print(f"  ... and {len(fields) - 10} more fields")

def save_schema_to_file(schema, project_info):
    """Save the schema to a file"""
    print_step(7, "Save Schema")
    
    if not schema:
        print("No schema available to save")
        return False
    
    # Create directory path - adjust to use absolute path
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    directory = os.path.join(
        project_root,
        'static', 
        'data', 
        project_info['project_name'],
        'schemas'
    )
    
    # Allow user to modify the path
    print(f"Default directory: {directory}")
    custom_path = input(f"Save to directory (or press Enter for default): ").strip()
    if custom_path:
        directory = custom_path
    
    # Create directory if it doesn't exist
    try:
        os.makedirs(directory, exist_ok=True)
        print(f"Directory created/verified: {directory}")
    except Exception as e:
        print(f"Error creating directory: {str(e)}")
        return False
    
    # Create filename with timestamp
    filename = f"{project_info['schema_name']}_{project_info['timestamp']}.json"
    
    # Allow user to modify the filename
    custom_filename = input(f"Save as (or press Enter for default: {filename}): ").strip()
    if custom_filename:
        filename = custom_filename
        if not filename.endswith('.json'):
            filename += '.json'
    
    # Full path to save
    full_path = os.path.join(directory, filename)
    
    # Ask for confirmation
    confirmation = input(f"Save schema to {full_path}? (y/n) [y]: ").strip().lower()
    if confirmation not in ('n', 'no'):
        # Save file
        try:
            with open(full_path, 'w', encoding='utf-8') as f:
                json.dump(schema, f, indent=2)
            print(f"Schema saved successfully to {full_path}")
            return True
        except Exception as e:
            print(f"Error saving schema: {str(e)}")
            return False
    else:
        print("Schema not saved to file")
        return False

def save_to_api(base_url, schema, project_info):
    """Save the schema using the API"""
    print_step(8, "Save Schema to API")
    
    if not schema:
        print("No schema available to save")
        return False
    
    # Ask for confirmation
    project_id = project_info['project_name']
    confirmation = input(f"Save schema to API with project ID '{project_id}'? (y/n) [y]: ").strip().lower()
    if confirmation not in ('n', 'no'):
        # Prepare API endpoint URL
        url = f"{base_url}/api/save-schema/{project_id}"
        
        # Send request to API
        try:
            print(f"Saving schema to project ID: {project_id}")
            response = requests.post(url, json=schema)
            
            if response.status_code == 200:
                print("Schema saved successfully to API!")
                return True
            else:
                print(f"Error saving schema to API: {response.status_code}")
                print(f"Response: {response.text}")
                return False
        except Exception as e:
            print(f"Error during API save: {str(e)}")
            return False
    else:
        print("Schema not saved to API")
        return False

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Enhanced Due Diligence Schema Generator with File Upload")
    parser.add_argument("--url", default=DEFAULT_BASE_URL, help=f"Base URL of the API (default: {DEFAULT_BASE_URL})")
    args = parser.parse_args()
    
    base_url = args.url
    
    clear_screen()
    print_header("Enhanced Due Diligence Schema Generator")
    
    # Check API connection first
    print("Checking API connection...")
    try:
        response = requests.get(f"{base_url}/api/test-claude-connection")
        if response.status_code == 200:
            print("API connection successful!")
        else:
            print(f"Warning: API connection returned status {response.status_code}")
            print(f"Response: {response.text}")
            proceed = input("Do you want to continue anyway? (y/n) [n]: ").strip().lower()
            if proceed not in ('y', 'yes'):
                print("Exiting due to API connection issues.")
                sys.exit(1)
    except Exception as e:
        print(f"Error connecting to API: {str(e)}")
        print(f"Please make sure the API is running at {base_url}")
        proceed = input("Do you want to continue anyway? (y/n) [n]: ").strip().lower()
        if proceed not in ('y', 'yes'):
            print("Exiting due to API connection issues.")
            sys.exit(1)
    
    # Step 1: Get project information
    project_info = get_project_info()
    
    # Step 2: Get extraction goals
    extraction_goals = get_extraction_goals()
    
    # Step 3: Get files to upload
    file_paths = get_files_to_upload()
    
    if not file_paths:
        print("No files selected. Cannot proceed.")
        sys.exit(1)
    
    # Step 4: Analyze documents
    analysis_results = analyze_documents(
        base_url, 
        file_paths, 
        project_info['document_type'], 
        extraction_goals
    )
    
    if not analysis_results:
        print("Document analysis failed. Cannot proceed with schema generation.")
        sys.exit(1)
    
    # Step 5: Generate schema
    schema = generate_schema(
        base_url, 
        analysis_results, 
        project_info['document_type'], 
        extraction_goals
    )
    
    if not schema:
        print("Schema generation failed.")
        sys.exit(1)
    
    # Step 6: Display schema summary
    display_schema_summary(schema)
    
    # Step 7: Save schema to file
    save_schema_to_file(schema, project_info)
    
    # Step 8: Save schema to API
    save_to_api(base_url, schema, project_info)
    
    print_header("Schema Generation Complete")
    print("Thank you for using the Enhanced Due Diligence Schema Generator!")

if __name__ == "__main__":
    main()
