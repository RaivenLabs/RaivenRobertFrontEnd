from pathlib import Path
from typing import Dict, Optional

class TemplateRegistry:
    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        self.root = Path(app.root_path)
        self.template_locations: Dict[str, Path] = {
            # Main application templates
            'launch_pages': self.root / 'app' / 'templates' / 'applicationlaunchpages',
            'components': self.root / 'app' / 'templates' / 'components',
            'errors': self.root / 'app' / 'templates' / 'errors',
            'views': self.root / 'app' / 'templates' / 'views',
            'auth': self.root / 'app' / 'templates' / 'auth_processing',
            
            # Application Group Templates
            'sandbox_templates': self.root / 'app' / 'application_groups' / 'sandbox' / 'templates',
            'engineering_templates': self.root / 'app' / 'application_groups' / 'engineering' / 'templates',
            'analytics_templates': self.root / 'app' / 'application_groups' / 'analyticsgroup' / 'templates',
            
            # Auth Blueprint Templates
            'auth_templates': self.root / 'authentication_blueprint' / 'templates',
            
            # Shared Components
            'shared_components': self.root / 'app' / 'templates' / 'components' / 'partials',
            'shared_svg': self.root / 'app' / 'templates' / 'components' / 'svg',
        }

        # Register common template paths
        self.common_templates = {
            'error_404': self.get_template_path('errors', '404.html'),
            'error_500': self.get_template_path('errors', '500.html'),
            'base': self.get_template_path('launch_pages', 'base.html'),
            'footer': self.get_template_path('shared_components', 'footer.html'),
        }

        app.template_registry = self

    def get_application_group_templates(self, group_name: str) -> Optional[Path]:
        """Get templates directory for a specific application group"""
        path = self.root / 'app' / 'application_groups' / group_name / 'templates'
        return path if path.exists() else None

    def list_templates_by_type(self, template_type: str) -> list:
        """List all templates of a certain type (e.g., 'sidebar', 'launch')"""
        templates = []
        for location in self.template_locations.values():
            if location.exists():
                templates.extend([
                    p for p in location.glob(f'*_{template_type}.html')
                ])
        return templates