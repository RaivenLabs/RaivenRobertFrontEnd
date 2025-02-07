# mongoshemainferrertocollection.py

from pymongo import MongoClient
from datetime import datetime
import json
import os

class MongoSchemaInferrer:
    def __init__(self, db_uri="mongodb://localhost:27017"):
        self.client = MongoClient(db_uri)
        
    def infer_type(self, value):
        """Infer MongoDB/BSON type from a Python value"""
        if isinstance(value, str):
            return "string"
        elif isinstance(value, int):
            return "int"
        elif isinstance(value, float):
            return "double"
        elif isinstance(value, bool):
            return "bool"
        elif isinstance(value, datetime):
            return "date"
        elif isinstance(value, dict):
            return "object"
        elif isinstance(value, list):
            return "array"
        elif value is None:
            return None
        return "string"  # default fallback

    def analyze_array_items(self, array_data):
        """Analyze contents of an array to determine schema"""
        if not array_data:
            return {"bsonType": "array"}
            
        # If array contains objects, analyze first object as template
        if all(isinstance(item, dict) for item in array_data):
            return {
                "bsonType": "array",
                "items": self.infer_schema_from_data(array_data[0])
            }
        
        # For simple arrays, use type of first non-null item
        for item in array_data:
            if item is not None:
                return {
                    "bsonType": "array",
                    "items": {"bsonType": self.infer_type(item)}
                }
        
        return {"bsonType": "array"}

    def infer_schema_from_data(self, data):
        """Generate MongoDB schema from sample document"""
        schema = {
            "bsonType": "object",
            "required": [],
            "properties": {}
        }

        for key, value in data.items():
            if value is None:
                continue

            if isinstance(value, dict):
                schema["properties"][key] = self.infer_schema_from_data(value)
                schema["required"].append(key)
            
            elif isinstance(value, list):
                schema["properties"][key] = self.analyze_array_items(value)
                if value:  # Only require if array has items
                    schema["required"].append(key)
            
            else:
                bson_type = self.infer_type(value)
                if bson_type:
                    schema["properties"][key] = {"bsonType": bson_type}
                    schema["required"].append(key)

        return schema

    def create_collection_from_json(self, db_name, collection_name, json_file_path):
        """Create a MongoDB collection with schema inferred from JSON file"""
        try:
            print(f"Reading JSON file: {json_file_path}")
            with open(json_file_path, 'r') as f:
                data = json.load(f)

            # Handle both single documents and arrays
            if isinstance(data, list):
                if not data:
                    raise ValueError("Empty JSON array")
                sample_doc = data[0]
                print(f"Using first document from array of {len(data)} documents")
            else:
                sample_doc = data
                print("Using single document for schema inference")

            # Infer schema
            schema = self.infer_schema_from_data(sample_doc)
            print("\nInferred schema:")
            print(json.dumps(schema, indent=2))

            # Get or create database
            db = self.client[db_name]
            
            # Create collection with schema validation
            print(f"\nCreating collection {collection_name} with schema validation...")
            db.create_collection(
                collection_name,
                validator={"$jsonSchema": schema}
            )
            
            # Create indexes for likely key fields
            collection = db[collection_name]
            for field in schema["properties"]:
                if any(key_term in field.lower() for key_term in ['id', 'number', 'key', 'code']):
                    print(f"Creating index for field: {field}")
                    collection.create_index([(field, 1)], unique=True)
                elif schema["properties"][field].get("bsonType") == "date":
                    print(f"Creating index for date field: {field}")
                    collection.create_index([(field, 1)])

            print("\nCollection created successfully!")
            
            # Optional: Insert the data
            if isinstance(data, list):
                collection.insert_many(data)
                print(f"Inserted {len(data)} documents")
            else:
                collection.insert_one(data)
                print("Inserted 1 document")

            return True

        except Exception as e:
            print(f"Error: {str(e)}")
            return False

if __name__ == "__main__":
    # Example usage
    inferrer = MongoSchemaInferrer()
    
    # Get JSON file path from user
    json_file = input("Enter path to JSON file: ")
    db_name = input("Enter database name: ")
    collection_name = input("Enter collection name: ")
    
    if os.path.exists(json_file):
        inferrer.create_collection_from_json(db_name, collection_name, json_file)
    else:
        print("File not found!")
