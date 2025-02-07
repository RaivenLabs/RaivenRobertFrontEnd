import os
from pymongo import MongoClient
from pathlib import Path
import json
from datetime import datetime
from bson import ObjectId

class InteractiveDBConfig:
    def __init__(self):
        self.mongo_uri = "mongodb://localhost:27017/"
        self.client = None
        self.database_name = None
        self.collection_name = None
        self.base_path = Path(r"C:\Users\RobertReynolds\Python Projects\Python Development Projects\TransactionPlatformDevelopmentAlphaLocal\transaction_platform_app\static\data\PaceLitigationPackages")

    def connect(self):
        """Establish MongoDB connection"""
        try:
            self.client = MongoClient(self.mongo_uri)
            self.client.admin.command('ismaster')
            print("Successfully connected to MongoDB!")
            return True
        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}")
            return False

    def choose_database(self):
        """Let user choose from available databases"""
        if not self.client:
            return False

        # Get list of databases
        databases = self.client.list_database_names()
        
        print("\nAvailable databases:")
        for i, db in enumerate(databases, 1):
            print(f"{i}. {db}")
        
        while True:
            try:
                choice = input("\nEnter the number of the database you want to use: ")
                db_index = int(choice) - 1
                if 0 <= db_index < len(databases):
                    self.database_name = databases[db_index]
                    return True
                else:
                    print("Invalid selection. Please try again.")
            except ValueError:
                print("Please enter a valid number.")

    def choose_collection(self):
        """Let user choose from available collections or create new one"""
        if not self.client or not self.database_name:
            return False

        db = self.client[self.database_name]
        collections = db.list_collection_names()
        
        print("\nAvailable collections:")
        for i, coll in enumerate(collections, 1):
            print(f"{i}. {coll}")
        print(f"{len(collections) + 1}. Create new collection")
        
        while True:
            try:
                choice = input("\nEnter the number of the collection you want to use (or create): ")
                choice_index = int(choice) - 1
                
                if 0 <= choice_index < len(collections):
                    self.collection_name = collections[choice_index]
                    return True
                elif choice_index == len(collections):
                    new_name = input("Enter name for new collection: ").strip()
                    if new_name:
                        self.collection_name = new_name
                        return True
                    else:
                        print("Collection name cannot be empty.")
                else:
                    print("Invalid selection. Please try again.")
            except ValueError:
                print("Please enter a valid number.")

    def confirm_path(self):
        """Confirm or update the data files path"""
        print(f"\nCurrent data files path: {self.base_path}")
        change = input("Would you like to change this path? (y/n): ").lower().strip()
        
        if change.startswith('y'):
            while True:
                new_path = input("Enter new path: ").strip()
                path = Path(new_path)
                if path.exists() and path.is_dir():
                    self.base_path = path
                    break
                else:
                    print("Invalid path. Please enter a valid directory path.")

    def validate_and_confirm(self):
        """Show final configuration and get confirmation"""
        print("\nFinal Configuration:")
        print(f"MongoDB URI: {self.mongo_uri}")
        print(f"Database: {self.database_name}")
        print(f"Collection: {self.collection_name}")
        print(f"Data files path: {self.base_path}")
        
        confirm = input("\nAre these settings correct? (y/n): ").lower().strip()
        return confirm.startswith('y')

    def setup(self):
        """Run the complete setup process"""
        if not self.connect():
            return None
            
        if not self.choose_database():
            return None
            
        if not self.choose_collection():
            return None
            
        self.confirm_path()
        
        if self.validate_and_confirm():
            return self
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

if __name__ == "__main__":
    config = InteractiveDBConfig()
    if config.setup():
        print("\nConfiguration complete! Ready to process files.")
        
        # Process files using the existing MongoDB connection from config
        # Get all JSON files from the directory
        json_files = list(config.base_path.glob('*.json'))
        
        print(f"\nFound {len(json_files)} JSON files to process")
        process = input("Proceed with processing? (y/n): ").lower().strip()
        if process.startswith('y'):
            processed_count = 0
            error_count = 0
            
            # Use the existing connection from config
            db = config.client[config.database_name]
            collection = db[config.collection_name]
            
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
        else:
            print("File processing cancelled")
    else:
        print("\nConfiguration cancelled.")
