from flask import Blueprint, current_app
import os
from flask import Blueprint

# Define the Blueprint
test_blueprint = Blueprint('test_blueprint', __name__)

# Define a route within the blueprint that simply prints "Woohoo"
@test_blueprint.route('/woohoo')
def woohoo():
    # Print "Woohoo" to the terminal for debugging
    print("Woohoo")
    return "Blueprint is working!"

# You can add more routes here if you need to further test other sections or paths
