import os
from pymongo import MongoClient
import json
from datetime import datetime
from bson import ObjectId
from pathlib import Path

# Configuration class to manage database settings
class DBConfig:
    def __init__(self):
        # Based on your MongoDB Compass screenshot
        self.database_name = "litigationDatabase"
        self.collection_name = "asbestosProduction"
        self.mongo_uri = "mongodb://localhost:27017/"
        
        # Your specific file path
        self.base_path = Path(r"C:\Users\RobertReynolds\Python Projects\Python Development Projects\TransactionPlatformDevelopmentAlphaLocal\transaction_platform_app\static\data\PaceLitigationPackages")

    def validate_and_confirm(self):
        """Validate and confirm settings with user"""
        print("\nPlease confirm the following settings:")
        print(f"MongoDB URI: {self.mongo_uri}")
        print(f"Database name: {self.database_name}")
        print(f"Collection name: {self.collection_name}")
        print(f"Data files path: {self.base_path}")
        
        confirm = input("\nAre these settings correct? (yes/no): ").lower().strip()
        if not confirm.startswith('y'):
            print("\nPlease update the settings in the DBConfig class.")
            return False
        return True

def connect_mongodb(config):
    """Establish MongoDB connection and return client"""
    try:
        client = MongoClient(config.mongo_uri)
        # Test connection
        client.admin.command('ismaster')
        print("Successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return None

def convert_date_string(date_str):
    """Convert various date formats to ISO format"""
    if not date_str:
        return None
    
    date_formats = [
        "%m/%d/%Y",
        "%m/%d/%y",
        "%Y-%m-%d"
    ]
    
    for fmt in date_formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return date_str

def process_json_for_mongo(data):
    """Process the JSON data and flatten/transform it for MongoDB"""
    # Extract the main lawsuit service data (assuming first item in array)
    if data.get('lawsuit_service') and len(data['lawsuit_service']) > 0:
        lawsuit_data = data['lawsuit_service'][0]
    else:
        return None

    # Create the base document structure
    mongo_doc = {
        "_id": ObjectId(),
        "file_metadata": {
            "file_name": data.get('file_name'),
            "file_sent_from": data.get('file', {}).get('file_sent_from'),
            "log_number": data.get('file', {}).get('log_number'),
            "file_category_type": data.get('file', {}).get('file_category_type')
        },
        "lawsuit_info": {
            "case_caption": lawsuit_data.get('lawsuit_case_caption'),
            "jurisdiction": lawsuit_data.get('lawsuit_jurisdiction'),
            "jurisdiction_state": lawsuit_data.get('lawsuit_jurisdiction_state'),
            "docket_number": lawsuit_data.get('lawsuit_docket_number'),
            "file_date": convert_date_string(lawsuit_data.get('lawsuit_file_date')),
            "service_date": convert_date_string(lawsuit_data.get('lawsuit_service_date')),
            "answer_due_date": convert_date_string(lawsuit_data.get('lawsuit_answer_due_date')),
            "damage_descriptions": lawsuit_data.get('lawsuit_damage_descriptions'),
            "allegation": lawsuit_data.get('lawsuit_allegation'),
            "harmful_material": lawsuit_data.get('lawsuit_harmful_material')
        },
        "counsel": [],
        "injured_parties": [],
        "defendants": []
    }

    # Process counsel information
    for counsel in lawsuit_data.get('counsel', []):
        mongo_doc['counsel'].append({
            "firm_name": counsel.get('counsel_firm_name'),
            "attorney_name": counsel.get('counsel_name_of_attorney'),
            "type": counsel.get('counsel_type'),
            "is_primary": counsel.get('counsel_primary') == 'Yes'
        })

    # Process injured party information
    for injured in lawsuit_data.get('injured_party', []):
        injured_party = {
            "personal_info": {
                "first_name": injured.get('injured_party_first_name'),
                "last_name": injured.get('injured_party_last_name'),
                "middle_name": injured.get('injured_party_middle_name'),
                "suffix": injured.get('injured_party_suffix'),
                "gender": injured.get('injured_party_gender'),
                "birth_date": convert_date_string(injured.get('injured_party_birth_date')),
                "death_date": convert_date_string(injured.get('injured_party_death_date')),
                "ssn": injured.get('injured_party_SSN')
            },
            "address": {
                "street": injured.get('injured_party_street'),
                "city": injured.get('injured_party_city'),
                "state": injured.get('injured_party_state'),
                "zip": injured.get('injured_party_zip')
            },
            "case_details": {
                "plaintiff_type": injured.get('injured_party_plaintiff_type'),
                "is_deceased": injured.get('injured_party_deceased') == 'DECEASED',
                "wrongful_death_claimed": injured.get('injured_party_is_wrongful_death_claimed') == 'YES',
                "military_member": injured.get('injured_party_military_member')
            },
            "diagnoses": [],
            "occupations": [],
            "plaintiffs": [],
            "related_parties": []
        }

        # Process diagnoses
        for diagnosis in injured.get('diagnosis', []):
            injured_party['diagnoses'].append({
                "disease_name": diagnosis.get('diagnosis_disease_name'),
                "disease_category": diagnosis.get('diagnosis_disease_category'),
                "date": convert_date_string(diagnosis.get('diagnosis_date')),
                "is_primary": diagnosis.get('diagnosis_is_primary') == 'YES'
            })

        # Process occupations
        for occupation in injured.get('occupation_exposure', []):
            injured_party['occupations'].append({
                "title": occupation.get('occupation_title'),
                "jobsite": occupation.get('occupation_jobsite'),
                "category": occupation.get('occupation_jobsite_category'),
                "city": occupation.get('occupation_jobsite_city'),
                "start_date": convert_date_string(occupation.get('occupation_start_date')),
                "end_date": convert_date_string(occupation.get('occupation_end_date')),
                "is_primary": occupation.get('occupation_is_primary') == 'YES'
            })

        # Process plaintiffs
        for plaintiff in injured.get('plaintiff', []):
            injured_party['plaintiffs'].append({
                "first_name": plaintiff.get('plaintiff_first_name'),
                "last_name": plaintiff.get('plaintiff_last_name'),
                "middle_name": plaintiff.get('plaintiff_middle_name'),
                "suffix": plaintiff.get('plaintiff_suffix'),
                "is_lead": plaintiff.get('lead_plaintiff_yn') == 'YES',
                "legal_capacity": plaintiff.get('plaintiff_legal_capacity'),
                "address": {
                    "street": plaintiff.get('plaintiff_street'),
                    "city": plaintiff.get('plaintiff_city'),
                    "state": plaintiff.get('plaintiff_state'),
                    "zip": plaintiff.get('plaintiff_zip')
                }
            })

        # Process related parties
        for related in injured.get('related_party', []):
            injured_party['related_parties'].append({
                "first_name": related.get('related_party_first_name'),
                "last_name": related.get('related_party_last_name'),
                "middle_name": related.get('related_party_middle_name'),
                "suffix": related.get('related_party_suffix'),
                "relationship": related.get('related_party_relationship'),
                "legal_capacity": related.get('related_party_legal_capacity')
            })

        mongo_doc['injured_parties'].append(injured_party)

    # Process defendants
    for defendant in lawsuit_data.get('defendant_namings', []):
        mongo_doc['defendants'].append({
            "company": defendant.get('defendant_company'),
            "parent_company": defendant.get('defendant_parent')
        })

    return mongo_doc

def ingest_json_files(config):
    """Ingest all JSON files from the specified directory into MongoDB"""
    client = connect_mongodb(config)
    if not client:
        return
    
    db = client[config.database_name]
    collection = db[config.collection_name]
    
    # Get all JSON files from the directory
    json_files = list(config.base_path.glob('*.json'))
    
    print(f"\nFound {len(json_files)} JSON files to process")
    process = input("Proceed with processing? (yes/no): ").lower().strip()
    if not process.startswith('y'):
        print("Operation cancelled")
        return

    
    processed_count = 0
    error_count = 0
    
    for file_path in json_files:
        try:
            with open(file_path, 'r') as file:
                print(f"\nProcessing {file_path.name}...")
                data = json.load(file)
                processed_doc = process_json_for_mongo(data)
                if processed_doc:
                    collection.insert_one(processed_doc)
                    processed_count += 1
                    print(f"Successfully processed {file_path.name}")
                else:
                    error_count += 1
                    print(f"Error: No valid lawsuit data found in {file_path.name}")
        except Exception as e:
            error_count += 1
            print(f"Error processing {file_path.name}: {str(e)}")
    
    print(f"\nProcessing complete!")
    print(f"Successfully processed: {processed_count} files")
    print(f"Errors encountered: {error_count} files")
    
    # Create indexes for common queries
    print("\nCreating indexes...")
    collection.create_index([("lawsuit_info.case_caption", 1)])
    collection.create_index([("lawsuit_info.docket_number", 1)])
    collection.create_index([("file_metadata.log_number", 1)])
    print("Indexes created successfully")

if __name__ == "__main__":
    config = DBConfig()
    if config.validate_and_confirm():
        ingest_json_files(config)
