

# Define replacement sets
exact_replacements = {
    'Authorized Buyer': '{{CustomerDefinedTerm7}}',
    '[nke_entname_lu]': '{{CustomerName}}',
    '[nke_entlcaname_lu]': '{{LocalCountryAgreement}}',
    '[nke_entlcadate_lu]': '{{LocalCountryAgreementDate}}',
    '[IS_entname_lu]': '{{ContractorName}}',
    '[IS_entadd_lu]': '{{ContractorAddress}}',
    '[IS_entcity_lu]': '{{ContractorCity}}',
    '[IS_entcountry_lu]': '{{ContractorCountry}}',
    '[program_name]': '{{ProgramName}}',
    '[program_desc]': '{{ProgramDescription}}',
    '[msacheck]': '{{MasterAgreement}}',
    '(the "Order Effective Date")': 'Hold (the "Order Effective Date")'
}

wildcard_replacements = {
    '_@Hold': '{{EffectiveDate}}'  # Matching multiple underscores
}
