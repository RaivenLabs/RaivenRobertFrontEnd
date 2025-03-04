import json
from pprint import pformat
import os

# Print current directory to make sure we're where we expect
print(f"Working in directory: {os.getcwd()}")

# Print if we can find the JSON file
print(f"Looking for targetCompanyData.json...")
if os.path.exists('targetCompanyData.json'):
    print("Found the JSON file!")
else:
    print("JSON file not found!")

try:
    with open('targetCompanyData.json', 'r') as json_file:
        data = json.load(json_file)
        print("Successfully loaded JSON data")
    
    with open('companies.py', 'w') as py_file:
        py_file.write('COMPANIES = ')
        py_file.write(pformat(data))
        print("Successfully created companies.py")
except Exception as e:
    print(f"An error occurred: {str(e)}")