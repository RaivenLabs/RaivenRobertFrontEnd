

# Define semantic groups of equivalent terms
TERM_GROUPS = {
    'ContractorName': [
        'Provider',
        'Supplier',
        'Vendor',
        'Contractor',
        'Consultant'
    ],
    'EffectiveDate': [
        'Order Effective Date',
        'Agreement Effective Date',
        'Contract Effective Date',
        'Effective Date'
    ],
    'CustomerName': [
        'Client',
        'Customer',
        'Buyer',
        'Purchaser'
    ]
}

# Unique marker for handling underscore patterns
MARKER = 'Kk979kK'

def generate_term_variations(term):
    """Generate common variations of a term."""
    variations = [
        term,                           # Original
        f'the {term}',                  # With 'the'
    ]
    
    # Special handling for parenthetical definitions
    parenthetical = f'(the "{term}")'
    variations.extend([
        parenthetical,                              # Basic parenthetical
        f'the {parenthetical}',                    # With leading 'the'
        f'_{parenthetical}',                       # With single underscore
        f'_ {parenthetical}',                      # With single underscore and space
        f'__{parenthetical}',                      # With double underscore
        f'__ {parenthetical}',                     # With double underscore and space
    ])
    return variations

def build_replacement_dict():
    """Build complete dictionary of all possible term replacements."""
    exact_replacements = {}
    wildcard_replacements = {}
    
    # Process each semantic group
    for template_var, terms in TERM_GROUPS.items():
        for term in terms:
            # Generate variations for each term
            variations = generate_term_variations(term)
            
            for variation in variations:
                if '(the "' in variation:
                    # For parenthetical definitions, use the marker pattern
                    replacement = f' {MARKER} {{{{{template_var}}}}} {variation}'
                    exact_replacements[variation] = replacement
                else:
                    # For simple replacements, just use the template variable
                    exact_replacements[variation] = f'{{{{{template_var}}}}}'
                
                # Add lowercase versions
                if not variation.startswith('_'):  # Don't lowercase underscore patterns
                    exact_replacements[variation.lower()] = exact_replacements[variation]
    
    # Add wildcard pattern to clean up underscore patterns
    wildcard_replacements[f'_@ *{MARKER}'] = ''
    
    return exact_replacements, wildcard_replacements

def add_custom_replacements(exact_replacements):
    """Add any custom one-off replacements that don't follow the standard patterns."""
    custom = {
        'Authorized Buyer': '{{CustomerDefinedTerm}}',
        '[nke_entname_lu]': '{{CustomerName}}',
        '[nke_entlcaname_lu]': '{{LocalCountryAgreement}}',
        '[nke_entlcadate_lu]': '{{LocalCountryAgreementDate}}',
        '[IS_entname_lu]': '{{ContractorName}}',
        '[IS_entadd_lu]': '{{ContractorAddress}}',
        '[IS_entcity_lu]': '{{ContractorCity}}',
        '[IS_entcountry_lu]': '{{ContractorCountry}}',
        '[program_name]': '{{ProgramName}}',
        '[program_desc]': '{{ProgramDescription}}',
        '[msacheck]': '{{MasterAgreement}}'
    }
    exact_replacements.update(custom)
    return exact_replacements

def get_template_replacements():
    """Main function to generate all template replacements."""
    exact_replacements, wildcard_replacements = build_replacement_dict()
    exact_replacements = add_custom_replacements(exact_replacements)
    return exact_replacements, wildcard_replacements

# Example usage
if __name__ == "__main__":
    exact_replacements, wildcard_replacements = get_template_replacements()
    
    print("Exact Replacements:")
    for original, replacement in exact_replacements.items():
        if MARKER in str(replacement):  # Show marker-based replacements
            print(f"{original} -> {replacement}")
            
    print("\nWildcard Replacements:")
    for pattern, replacement in wildcard_replacements.items():
        print(f"{pattern} -> '{replacement}'")
