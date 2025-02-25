import win32com.client as win32
import os
import shutil
from pathlib import Path
import subprocess
import time
import re

# Import the configuration from variables_config
from variables_config import (
    provider_terms, customer_terms, effective_date_terms,
    other_terms, other_terms_also, yet_more_other_terms,
    exact_replacements as base_exact_replacements,
    wildcard_replacements as base_wildcard_replacements,
    cleanup_replacements as base_cleanup_replacements,
    add_variations
)

# Base paths
SOURCE_BASE_PATH = r"C:\Users\RobertReynolds\Python Projects\Python Development Projects\TransactionPlatformDevelopmentAlphaLocal\transaction_platform_app\static\data\SystemITTemplates\TangibleITTemplates\ArchivedSource"
FOUNDATIONAL_BASE_PATH = r"C:\Users\RobertReynolds\Python Projects\Python Development Projects\TransactionPlatformDevelopmentAlphaLocal\transaction_platform_app\static\data\SystemITTemplates\TangibleITTemplates\Foundational"
ARCHIVE_BASE_PATH = r"C:\Users\RobertReynolds\Python Projects\Python Development Projects\TransactionPlatformDevelopmentAlphaLocal\transaction_platform_app\static\data\SystemITTemplates\TangibleITTemplates\ArchivedSource"

def prompt_for_additional_terms():
    """
    Ask user if they want to add additional terms to specific categories
    and update the lists accordingly
    """
    print("\n=== TERM CATEGORY CONFIGURATION ===")
    print("You can add terms to be automatically processed as specific types.")
    print("\nCurrently configured term categories:")
    print(f"1. Provider terms: {provider_terms}")
    print(f"2. Customer terms: {customer_terms}")
    print(f"3. Effective date terms: {effective_date_terms}")
    print(f"4. Other terms category 1: {other_terms}")
    print(f"5. Other terms category 2: {other_terms_also}")
    print(f"6. Other terms category 3: {yet_more_other_terms}")
    
    add_terms = input("\nWould you like to add terms to any category? (y/n): ").lower().strip()
    if add_terms != 'y':
        # Return copies of the original lists
        return {
            'provider_terms': provider_terms.copy(),
            'customer_terms': customer_terms.copy(),
            'effective_date_terms': effective_date_terms.copy(),
            'other_terms': other_terms.copy(),
            'other_terms_also': other_terms_also.copy(),
            'yet_more_other_terms': yet_more_other_terms.copy()
        }
    
    # Create local copies of the lists that we can modify
    local_terms = {
        'provider_terms': provider_terms.copy(),
        'customer_terms': customer_terms.copy(),
        'effective_date_terms': effective_date_terms.copy(),
        'other_terms': other_terms.copy(),
        'other_terms_also': other_terms_also.copy(),
        'yet_more_other_terms': yet_more_other_terms.copy()
    }
    
    template_var_names = {
        'provider_terms': 'ContractorDefinedTerm',
        'customer_terms': 'CustomerDefinedTerm',
        'effective_date_terms': 'EffectiveDate',
        'other_terms': 'OtherTerms',
        'other_terms_also': 'MoreTerms',
        'yet_more_other_terms': 'YetMoreTerms'
    }
    
    while True:
        print("\nSelect category to add terms to (or press Enter to finish):")
        print("1. Provider terms (replaces with {{ContractorDefinedTerm}})")
        print("2. Customer terms (replaces with {{CustomerDefinedTerm}})")
        print("3. Effective date terms (replaces with {{EffectiveDate}})")
        print("4. Other terms category 1 (replaces with {{OtherTerms}})")
        print("5. Other terms category 2 (replaces with {{MoreTerms}})")
        print("6. Other terms category 3 (replaces with {{YetMoreTerms}})")
        
        category = input("Category (1-6 or Enter to finish): ").strip()
        if not category:
            break
            
        try:
            cat_num = int(category)
            if not 1 <= cat_num <= 6:
                print("Invalid category number. Please enter 1-6.")
                continue
                
            # Map category number to list name
            cat_keys = ['provider_terms', 'customer_terms', 'effective_date_terms', 
                        'other_terms', 'other_terms_also', 'yet_more_other_terms']
            selected_category = cat_keys[cat_num - 1]
            
            # Get terms to add
            term = input(f"\nEnter term to add to {selected_category} (will be replaced with {{{{{template_var_names[selected_category]}}}}}): ").strip()
            if term:
                local_terms[selected_category].append(term)
                print(f"Added '{term}' to {selected_category}")
                print(f"Current terms in this category: {local_terms[selected_category]}")
            else:
                print("Term cannot be empty. Please try again.")
                
        except ValueError:
            print("Please enter a valid number or press Enter to finish.")
    
    return local_terms

def prompt_for_custom_replacements():
    """
    Ask user if they want to add custom direct replacements
    (like 'Authorized Buyer': '{{CustomerDefinedTerm}}')
    """
    custom_replacements = {}
    
    print("\n=== CUSTOM REPLACEMENT CONFIGURATION ===")
    print("You can define exact text to be replaced with template variables.")
    print("For example, replacing 'Authorized Buyer' with '{{CustomerDefinedTerm}}'")
    
    add_custom = input("\nWould you like to add custom replacements? (y/n): ").lower().strip()
    if add_custom != 'y':
        return custom_replacements
    
    print("\nCurrently configured replacements include:")
    for i, (key, value) in enumerate(base_exact_replacements.items(), 1):
        if key.startswith('(') or key.startswith('"'):
            continue  # Skip the automatically generated variations
        print(f"{i}. '{key}' → '{value}'")
    
    print("\nEnter your custom replacements:")
    while True:
        search_text = input("\nEnter exact text to search for (or press Enter to finish): ").strip()
        if not search_text:
            break
            
        template_var = input("Enter template variable WITH {{ }} (e.g. {{CustomerName}}): ").strip()
        if not template_var or not (template_var.startswith('{{') and template_var.endswith('}}')):
            print("Template variable must be in the format {{VariableName}}. Please try again.")
            continue
            
        custom_replacements[search_text] = template_var
        print(f"Added: '{search_text}' → '{template_var}'")
    
    return custom_replacements

def build_replacements_with_terms(term_categories, custom_replacements=None):
    """Build all replacement dictionaries using the provided term categories"""
    # Start with the base exact replacements
    exact_replacements = base_exact_replacements.copy()
    
    # Add provider terms
    for term in add_variations(term_categories['provider_terms']):
        exact_replacements[term] = f'Kk97999kK {term}'
    
    # Add company terms
    for term in add_variations(term_categories['customer_terms']):
        exact_replacements[term] = f'Kk97099kK {term}'
    
    # Add date terms
    for term in add_variations(term_categories['effective_date_terms']):
        exact_replacements[term] = f'Kk979kK {term}'
        
    # Add other term categories
    for term in add_variations(term_categories['other_terms']):
        exact_replacements[term] = f'Kk961kK {term}'
    
    for term in add_variations(term_categories['other_terms_also']):
        exact_replacements[term] = f'Kk961999kK {term}'
    
    for term in add_variations(term_categories['yet_more_other_terms']):
        exact_replacements[term] = f'Kk961099kK {term}'
    
    # Add any custom direct replacements
    if custom_replacements:
        exact_replacements.update(custom_replacements)
    
    # Use the base wildcard and cleanup replacements
    wildcard_replacements = base_wildcard_replacements.copy()
    cleanup_replacements = base_cleanup_replacements.copy()
    
    return exact_replacements, wildcard_replacements, cleanup_replacements

def cleanup_word():
    """Force cleanup of any existing Word processes"""
    try:
        subprocess.run(['taskkill', '/IM', 'winword.exe', '/F'], 
                      capture_output=True, 
                      check=False)
        time.sleep(2)
    except Exception as e:
        print(f"Cleanup warning: {str(e)}")

def safe_find_replace(doc, find_text, replace_text, use_wildcards=False):
    """
    Perform a single find/replace operation with safety checks
    """
    print(f"\nDEBUG - Starting find/replace operation:")
    print(f"DEBUG - Find text: '{find_text}'")
    print(f"DEBUG - Replace text: '{replace_text}'")
    print(f"DEBUG - Using wildcards: {use_wildcards}")
    
    # First do the main content as before
    find = doc.Content.Find
    find.ClearFormatting()
    find.Replacement.ClearFormatting()
    
    # Basic setup
    find.Text = find_text
    find.Replacement.Text = replace_text
    find.Forward = True
    find.Wrap = 1  # wdFindContinue
    find.Format = False
    find.MatchCase = True
    find.MatchWholeWord = not use_wildcards
    find.MatchWildcards = use_wildcards
    
    try:
        # Execute find/replace for main content
        result = find.Execute(
            FindText=find_text,
            ReplaceWith=replace_text,
            Replace=2,  # wdReplaceAll
            Forward=True,
            MatchCase=True,
            MatchWholeWord=not use_wildcards
        )
        
        # Now check footers
        for section in doc.Sections:
            for footer in section.Footers:
                if footer.Exists:
                    footer_find = footer.Range.Find
                    footer_find.ClearFormatting()
                    footer_find.Replacement.ClearFormatting()
                    footer_find.Text = find_text
                    footer_find.Replacement.Text = replace_text
                    footer_find.Forward = True
                    footer_find.Wrap = 1
                    footer_find.Format = False
                    footer_find.MatchCase = True
                    footer_find.MatchWholeWord = not use_wildcards
                    footer_find.MatchWildcards = use_wildcards
                    
                    footer_find.Execute(
                        FindText=find_text,
                        ReplaceWith=replace_text,
                        Replace=2,
                        Forward=True,
                        MatchCase=True,
                        MatchWholeWord=not use_wildcards
                    )
        
        return True
        
    except Exception as e:
        print(f"Warning: Could not replace '{find_text}': {str(e)}")
        return False

def get_paths_for_file(file_path):
    """
    Determine the appropriate paths for saving processed files
    Returns: (current_processed_path, foundational_path, archive_path)
    """
    file_path = os.path.abspath(file_path)
    
    # Get the original filename and directory
    original_dir = os.path.dirname(file_path)
    original_filename = os.path.basename(file_path)
    file_stem = Path(file_path).stem
    
    # 1. Path for saving in current directory with _processed suffix
    current_processed_path = os.path.join(original_dir, f"{file_stem}_processed.docx")
    
    # For both Foundational and Archive, determine the appropriate subdirectory
    if SOURCE_BASE_PATH in file_path:
        # Extract the subdirectory structure after SOURCE_BASE_PATH
        rel_path = os.path.relpath(original_dir, SOURCE_BASE_PATH)
        foundational_subdir = os.path.join(FOUNDATIONAL_BASE_PATH, rel_path)
        archive_subdir = os.path.join(ARCHIVE_BASE_PATH, rel_path)
    else:
        # If not in SOURCE_BASE_PATH, use the same directory name
        dir_name = os.path.basename(original_dir)
        foundational_subdir = os.path.join(FOUNDATIONAL_BASE_PATH, dir_name)
        archive_subdir = os.path.join(ARCHIVE_BASE_PATH, dir_name)
    
    # Ensure the subdirectories exist
    os.makedirs(foundational_subdir, exist_ok=True)
    os.makedirs(archive_subdir, exist_ok=True)
    
    # 2. Path for saving in Foundational with original filename
    foundational_path = os.path.join(foundational_subdir, original_filename)
    
    # 3. Path for archiving the source file
    # Use current timestamp to create a unique archived filename
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    archive_filename = f"{file_stem}_{timestamp}.docx"
    archive_path = os.path.join(archive_subdir, archive_filename)
    
    return current_processed_path, foundational_path, archive_path

def archive_source_file(file_path, archive_path):
    """Archive the original source file"""
    try:
        print(f"\nArchiving source file to: {archive_path}")
        shutil.copy2(file_path, archive_path)
        return True
    except Exception as e:
        print(f"Warning: Could not archive source file: {str(e)}")
        return False

def process_template(file_path):
    """Process template with careful replacements and save to multiple locations"""
    word = None
    print(f"\nStarting to process: {os.path.basename(file_path)}")
    
    try:
        # Get additional terms from user
        term_categories = prompt_for_additional_terms()
        
        # ALWAYS get custom replacements from user after term categories,
        # regardless of whether they added terms or not
        custom_replacements = prompt_for_custom_replacements()
        
        # Build replacement dictionaries with user-provided terms and replacements
        exact_replacements, wildcard_replacements, cleanup_replacements = build_replacements_with_terms(
            term_categories, custom_replacements
        )
        
        print("Initializing Word...")
        word = win32.gencache.EnsureDispatch('Word.Application')
        word.Visible = True
        
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Could not find file: {file_path}")
        
        print("Opening document...")
        doc = word.Documents.Open(file_path)
        
        # Process exact replacements first
        print("\nProcessing exact replacements...")
        for find_text, replace_text in exact_replacements.items():
            print(f"\nProcessing replacement: {find_text}")
            safe_find_replace(doc, find_text, replace_text, use_wildcards=False)
        
        # Process wildcard replacements
        print("\nProcessing wildcard replacements...")
        for find_text, replace_text in wildcard_replacements.items():
            print(f"\nProcessing wildcard replacement: {find_text}")
            safe_find_replace(doc, find_text, replace_text, use_wildcards=True)
        
        # Process any cleanup replacements
        if cleanup_replacements:
            print("\nProcessing final cleanup replacements...")
            for find_text, replace_text in cleanup_replacements.items():
                print(f"\nProcessing cleanup: {find_text}")
                safe_find_replace(doc, find_text, replace_text, use_wildcards=False)
        
        # Get appropriate save paths
        current_processed_path, foundational_path, archive_path = get_paths_for_file(file_path)
        
        # Create a temporary directory in a shorter path for initial save
        temp_dir = Path(os.environ['TEMP']) / 'doc_processing'
        temp_dir.mkdir(exist_ok=True)
        temp_path = temp_dir / f"temp_processed_{int(time.time())}.docx"
        
        print(f"\nSaving processed file to temporary location: {temp_path}")
        doc.SaveAs2(str(temp_path))
        doc.Close()
        
        # Now copy the file to both locations
        print(f"\nSaving to current directory: {os.path.basename(current_processed_path)}")
        if os.path.exists(current_processed_path):
            os.remove(current_processed_path)
        
        Path(os.path.dirname(current_processed_path)).mkdir(parents=True, exist_ok=True)
        shutil.copy2(str(temp_path), current_processed_path)
        
        print(f"\nSaving to foundational directory: {os.path.basename(foundational_path)}")
        if os.path.exists(foundational_path):
            os.remove(foundational_path)
            
        Path(os.path.dirname(foundational_path)).mkdir(parents=True, exist_ok=True)
        shutil.copy2(str(temp_path), foundational_path)
        
        # Clean up temp file
        os.remove(temp_path)
        
        # Archive the source file
        archive_source_file(file_path, archive_path)
        
        return True
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return False
    
    finally:
        if word:
            try:
                word.Quit()
                print("Word closed successfully")
            except:
                print("Note: Could not close Word normally")
                cleanup_word()
        
        # Cleanup temp directory
        try:
            if 'temp_dir' in locals():
                for file in temp_dir.glob('*'):
                    try:
                        file.unlink()
                    except:
                        pass
                temp_dir.rmdir()
        except:
            pass

def list_docx_files():
    """List all .docx files in current directory and return full paths"""
    current_dir = os.path.abspath(os.getcwd())
    files = []
    file_paths = {}
    
    for file in os.listdir(current_dir):
        if file.endswith('.docx') and not file.startswith('~'):
            full_path = os.path.join(current_dir, file)
            files.append(file)
            file_paths[file] = full_path
    
    return files, file_paths

def main():
    # Initial cleanup
    cleanup_word()
    
    print("Available files:")
    files, file_paths = list_docx_files()
    
    if not files:
        print("No .docx files found in the current directory")
        return
        
    for i, file in enumerate(files, 1):
        print(f"{i}. {file}")
    
    while True:
        choice = input("\nSelect a file number (or 'q' to quit): ")
        
        if choice.lower() == 'q':
            break
            
        try:
            file_index = int(choice) - 1
            if 0 <= file_index < len(files):
                selected_file = files[file_index]
                full_path = file_paths[selected_file]
                print(f"You selected: {selected_file}")
                
                if process_template(full_path):
                    print("\nProcessing complete!")
                else:
                    print("\nProcessing failed!")
                break
            else:
                print("Invalid file number")
        except ValueError:
            print("Please enter a valid number or 'q' to quit")
        except Exception as e:
            print(f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    main()
