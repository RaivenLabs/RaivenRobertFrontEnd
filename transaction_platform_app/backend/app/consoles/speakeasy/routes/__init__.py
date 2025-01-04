# backend/app/consoles/speakeasy/routes/__init__.py
from flask import Blueprint
from .questions import speakeasy_routes

# This allows us to import the routes in the main app
def init_speakeasy_routes():
    return speakeasy_routes
