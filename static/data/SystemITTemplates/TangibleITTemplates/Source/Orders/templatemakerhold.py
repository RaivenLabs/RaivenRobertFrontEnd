import win32com.client as win32
import os
from pathlib import Path
import subprocess
import time

from variables_config import exact_replacements, wildcard_replacements

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

def process_template(file_path):
    """Process template with careful replacements"""
    word = None
    print(f"\nStarting to process: {os.path.basename(file_path)}")
    
    try:
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
        
        # Create a temporary directory in a shorter path
        temp_dir = Path(os.environ['TEMP']) / 'doc_processing'
        temp_dir.mkdir(exist_ok=True)
        
        # Create temporary filename
        original_filename = Path(file_path).stem
        temp_path = temp_dir / f"{original_filename}_processed.docx"
        
        print(f"\nSaving processed file to temporary location: {temp_path}")
        doc.SaveAs2(str(temp_path))
        doc.Close()
        
        # Now move the file to the final destination using Python
        final_path = "\\\\?\\" + str(Path(file_path).absolute().with_suffix('')) + '_processed.docx'
        print(f"Moving file to final location: {os.path.basename(final_path)}")
        
        # Ensure the destination directory exists
        Path(os.path.dirname(final_path)).mkdir(parents=True, exist_ok=True)
        
        # Move the file from temp to final location
        if os.path.exists(final_path):
            os.remove(final_path)
        os.rename(str(temp_path), final_path)
        
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
