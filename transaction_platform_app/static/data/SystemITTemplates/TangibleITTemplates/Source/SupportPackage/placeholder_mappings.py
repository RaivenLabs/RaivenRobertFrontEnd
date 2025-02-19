from pathlib import Path
import json
import os
class PlaceholderMappings:
    """Manages mappings between document placeholders and Jinja2-style constants"""
    
    def __init__(self):
        # Complex terms should be replaced before simple terms to avoid partial replacements
        self.ordered_replacements = [
            # Complex terms (with possession)
            {
                "Service Provider's": "{{ContractorName}}'s",
                "Authorized Buyer's": "{{CustomerName}}'s",
                "Master Agreement's": "{{MasterAgreement}}'s"
            },
            # Base terms
            {
                "[IS_entname_lu]": "{{ContractorName}}",
                "Service Provider": "{{ContractorName}}",
                "[nke_entname_lu]": "{{CustomerName}}",
                "Authorized Buyer": "{{CustomerName}}",
                "[msacheck]": "{{MasterAgreement}}",
                "Master Agreement": "{{MasterAgreement}}",
                "[IS_entadd_lu]": "{{ContractorAddress}}",
                "[IS_entcity_lu]": "{{ContractorCity}}",
                "[IS_entcountry_lu]": "{{ContractorCountry}}"
            }
        ]
        
        # Special patterns that need regex
       # Special patterns that need regex
        self.patterns = [
            {
                "pattern": "as of [_]@(the *\"Order Effective Date\")",  # @ means "one or more"
                "replacement": "as of {{EffectiveDate}} (the \"Order Effective Date\")"
            },
            {
                "pattern": "dated [_]@",  # @ means "one or more"
                "replacement": "dated {{EffectiveDate}}"
            },
            {
                "pattern": "\[N_domain_name_lu\]",  # Escape square brackets
                "replacement": "{{DomainName}}"
            },
            {
                "pattern": "\[N_domain_desc_lu\]",  # Escape square brackets
                "replacement": "{{DomainDescription}}"
            },
            {
                "pattern": "\[program_name\]",  # Escape square brackets
                "replacement": "{{ProgramName}}"
            },
            {
                "pattern": "\[program_desc\]",  # Escape square brackets
                "replacement": "{{ProgramDescription}}"
            }
        ]
    def get_all_replacements(self):
        """Get ordered list of replacement dictionaries"""
        return self.ordered_replacements
    
    def get_patterns(self):
        """Get all regex patterns"""
        return self.patterns
