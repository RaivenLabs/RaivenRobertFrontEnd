# mongocollectionsetupbase.py

from pymongo import MongoClient
from pymongo.errors import CollectionInvalid
from datetime import datetime

class MongoCollectionSetup:
    def __init__(self, db):
        self.db = db

    def setup_asbestos_confirmation(self):
        """
        One-time setup for asbestosConfirmation collection.
        Can be repurposed for other collections by copying this pattern.
        """
        try:
            # Define the schema
            schema = {
                "bsonType": "object",
                "required": ["log_number", "case_caption"],
                "properties": {
                    # Original case fields
                    "log_number": { "bsonType": "string" },
                    "case_caption": { "bsonType": "string" },
                    "file_metadata": { "bsonType": "object" },
                    "lawsuit_info": { 
                        "bsonType": "object",
                        "properties": {
                            "jurisdiction": { "bsonType": "string" },
                            "court": { "bsonType": "string" },
                            "file_date": { "bsonType": "date" },
                            "answer_due_date": { "bsonType": "date" }
                        }
                    },
                    "defendants": { 
                        "bsonType": "array",
                        "items": { "bsonType": "string" }
                    },
                    "injured_parties": {
                        "bsonType": "array",
                        "items": { "bsonType": "object" }
                    },

                    # Matching results block
                    "matching_results": {
                        "bsonType": "object",
                        "required": ["algorithm_version", "run_date", "confidence_score"],
                        "properties": {
                            "algorithm_version": { "bsonType": "string" },
                            "run_date": { "bsonType": "date" },
                            "confidence_score": { "bsonType": "double" },
                            "matched_defendants": {
                                "bsonType": "array",
                                "items": {
                                    "bsonType": "object",
                                    "required": ["defendant_name", "matched_client", "confidence"],
                                    "properties": {
                                        "defendant_name": { "bsonType": "string" },
                                        "matched_client": { "bsonType": "string" },
                                        "confidence": { "bsonType": "double" }
                                    }
                                }
                            }
                        }
                    },

                    # Confirmation status block
                    "confirmation_status": {
                        "bsonType": "object",
                        "required": ["current_status", "created_date"],
                        "properties": {
                            "current_status": {
                                "enum": ["PENDING", "CONFIRMED", "REJECTED", "ARCHIVED"]
                            },
                            "created_date": { "bsonType": "date" },
                            "confirmed_date": { "bsonType": "date" },
                            "confirmed_by": { "bsonType": "string" },
                            "rejection_reason": { "bsonType": "string" },
                            "notes": { "bsonType": "string" }
                        }
                    }
                }
            }

            # Create or update collection
            try:
                self.db.create_collection(
                    "asbestosConfirmation",
                    validator={"$jsonSchema": schema}
                )
                print("Created asbestosConfirmation collection with schema validation")
            except CollectionInvalid:
                self.db.command({
                    'collMod': 'asbestosConfirmation',
                    'validator': {"$jsonSchema": schema}
                })
                print("Updated asbestosConfirmation schema validation")

            # Create indexes
            collection = self.db.asbestosConfirmation
            collection.create_index([("log_number", 1)], unique=True)
            collection.create_index([("matching_results.confidence_score", 1)])
            collection.create_index([("confirmation_status.current_status", 1)])
            collection.create_index([
                ("matching_results.confidence_score", 1),
                ("confirmation_status.current_status", 1)
            ])

            print("Successfully set up asbestosConfirmation collection with indexes")
            return True

        except Exception as e:
            print(f"Error setting up asbestosConfirmation: {str(e)}")
            return False

    def setup_asbestos_archived(self):
        """One-time setup for asbestosArchived collection."""
        try:
            # Define the schema
            schema = {
                "bsonType": "object",
                "required": ["file_metadata", "archive_data"],
                "properties": {
                    # Original case fields (same as confirmation)
                    "file_metadata": { "bsonType": "object" },
                    "lawsuit_info": { "bsonType": "object" },
                    "counsel": { 
                        "bsonType": "array",
                        "items": { "bsonType": "object" }
                    },
                    "injured_parties": {
                        "bsonType": "array",
                        "items": { "bsonType": "object" }
                    },
                    "defendants": {
                        "bsonType": "array",
                        "items": { "bsonType": "string" }
                    },
                    
                    # Archive-specific data
                    "archive_data": {
                        "bsonType": "object",
                        "required": ["original_case_id", "archive_date", "archive_reason"],
                        "properties": {
                            "original_case_id": { "bsonType": "string" },
                            "archive_date": { "bsonType": "date" },
                            "archive_reason": { "bsonType": "string" },
                            "confidence_score": { "bsonType": "double" },
                            "archived_by": { "bsonType": "string" }
                        }
                    },
                    
                    # Matching results
                    "matching_results": {
                        "bsonType": "object",
                        "required": ["confidence_score", "match_date"],
                        "properties": {
                            "best_match": { "bsonType": "string" },
                            "confidence_score": { "bsonType": "double" },
                            "confidence_threshold": { "bsonType": "double" },
                            "potential_matches": {
                                "bsonType": "array",
                                "items": { "bsonType": "object" }
                            },
                            "match_date": { "bsonType": "date" }
                        }
                    }
                }
            }

            # Create collection with validation
            try:
                self.db.create_collection(
                    "asbestosArchived",
                    validator={"$jsonSchema": schema}
                )
                print("Created asbestosArchived collection with schema validation")
            except CollectionInvalid:
                self.db.command({
                    'collMod': 'asbestosArchived',
                    'validator': {"$jsonSchema": schema}
                })
                print("Updated asbestosArchived schema validation")

            # Create indexes
            collection = self.db.asbestosArchived
            collection.create_index([("file_metadata.log_number", 1)], unique=True)
            collection.create_index([("archive_data.archive_date", 1)])
            collection.create_index([("archive_data.confidence_score", 1)])
            collection.create_index([("matching_results.confidence_score", 1)])

            print("Successfully set up asbestosArchived collection with indexes")
            return True

        except Exception as e:
            print(f"Error setting up asbestosArchived: {str(e)}")
            return False

    def setup_new_collection(self, collection_name, schema, indexes):
        """
        Generic method for setting up new collections.
        Can be used as a template for future collection setups.
        
        :param collection_name: Name of the collection to create
        :param schema: JSON Schema for validation
        :param indexes: List of index specifications
        """
        try:
            try:
                self.db.create_collection(
                    collection_name,
                    validator={"$jsonSchema": schema}
                )
                print(f"Created {collection_name} collection with schema validation")
            except CollectionInvalid:
                self.db.command({
                    'collMod': collection_name,
                    'validator': {"$jsonSchema": schema}
                })
                print(f"Updated {collection_name} schema validation")

            # Create indexes
            collection = self.db[collection_name]
            for index_spec in indexes:
                collection.create_index(index_spec['fields'], **index_spec.get('options', {}))

            print(f"Successfully set up {collection_name} collection with indexes")
            return True

        except Exception as e:
            print(f"Error setting up {collection_name}: {str(e)}")
            return False
        
    def setup_asbestos_client(self):
        """One-time setup for asbestosClient collection."""
        try:
            # Define the schema
            schema = {
                "bsonType": "object",
                "required": ["log_number", "case_caption", "matching_results", "client_data"],
                "properties": {
                    # Original case fields
                    "log_number": { "bsonType": "string" },
                    "case_caption": { "bsonType": "string" },
                    "file_metadata": { "bsonType": "object" },
                    "lawsuit_info": { 
                        "bsonType": "object",
                        "properties": {
                            "jurisdiction": { "bsonType": "string" },
                            "court": { "bsonType": "string" },
                            "file_date": { "bsonType": "date" },
                            "answer_due_date": { "bsonType": "date" }
                        }
                    },
                    "defendants": { 
                        "bsonType": "array",
                        "items": { "bsonType": "string" }
                    },
                    "injured_parties": {
                        "bsonType": "array",
                        "items": { "bsonType": "object" }
                    },

                    # Matching results (preserved from confirmation)
                    "matching_results": {
                        "bsonType": "object",
                        "required": ["confidence_score", "best_match"],
                        "properties": {
                            "confidence_score": { "bsonType": "double" },
                            "best_match": { "bsonType": "string" },
                            "match_date": { "bsonType": "date" }
                        }
                    },

                    # Client-specific data
                    "client_data": {
                        "bsonType": "object",
                        "required": ["promotion_date", "promoted_by"],
                        "properties": {
                            "promotion_date": { "bsonType": "date" },
                            "promoted_by": { "bsonType": "string" },
                            "client_reference": { "bsonType": "string" },
                            "notes": { "bsonType": "string" },
                            "status": {
                                "enum": ["ACTIVE", "CLOSED", "SETTLED"]
                            }
                        }
                    },

                    # Audit trail
                    "audit_trail": {
                        "bsonType": "object",
                        "required": ["created_at", "created_by"],
                        "properties": {
                            "created_at": { "bsonType": "date" },
                            "created_by": { "bsonType": "string" },
                            "modification_history": {
                                "bsonType": "array",
                                "items": {
                                    "bsonType": "object",
                                    "required": ["date", "action"],
                                    "properties": {
                                        "date": { "bsonType": "date" },
                                        "action": { "bsonType": "string" },
                                        "details": { "bsonType": "string" }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            # Create collection with validation
            try:
                self.db.create_collection(
                    "asbestosClient",
                    validator={"$jsonSchema": schema}
                )
                print("Created asbestosClient collection with schema validation")
            except CollectionInvalid:
                self.db.command({
                    'collMod': 'asbestosClient',
                    'validator': {"$jsonSchema": schema}
                })
                print("Updated asbestosClient schema validation")

            # Create indexes
            collection = self.db.asbestosClient
            collection.create_index([("log_number", 1)], unique=True)
            collection.create_index([("client_data.promotion_date", 1)])
            collection.create_index([("client_data.status", 1)])
            collection.create_index([("matching_results.best_match", 1)])
            collection.create_index([
                ("matching_results.best_match", 1),
                ("client_data.status", 1)
            ])

            print("Successfully set up asbestosClient collection with indexes")
            return True

        except Exception as e:
            print(f"Error setting up asbestosClient: {str(e)}")
            return False       


if __name__ == "__main__":
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017')
    db = client.asbestosDB
    
    # Initialize and run setup
    setup = MongoCollectionSetup(db)
    setup.setup_asbestos_confirmation()
    setup.setup_asbestos_archived()
    setup.setup_asbestos_client()  # Add this line
