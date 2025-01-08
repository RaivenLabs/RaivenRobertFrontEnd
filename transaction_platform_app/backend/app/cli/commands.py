# app/cli/commands.py
import click
from flask.cli import with_appcontext

@click.command()
@with_appcontext
def sync_to_s3():
    """Sync local data files to S3"""
    current_app.storage.sync_to_s3()
    click.echo("Successfully synced local files to S3")

@click.command()
@with_appcontext
def sync_from_s3():
    """Sync S3 files to local"""
    current_app.storage.sync_from_s3()
    click.echo("Successfully synced S3 files to local")
