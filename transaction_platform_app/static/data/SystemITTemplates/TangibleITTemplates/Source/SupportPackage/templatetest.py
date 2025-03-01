import win32com.client as win32
import os

def process_test_template(file_path):
    # Dictionary of your specific replacements
    replacements = {
        '[msacheck]': '{{MSA}}',
        '[nke_entname_lu]': '{{NikeEntityName}}',
        '[nke_entadd_lu]': '{{NikeAddress}}',
        '[nke_entcity_lu]': '{{NikeCity}}',
        '[nke_entstate_lu]': '{{NikeState}}',
        '[nke_entpost_lu]': '{{NikePostalCode}}',
        '[IS_entname_lu]': '{{ServiceProviderName}}',
        '[IS_entcountry_lu]': '{{ServiceProviderCountry}}',
        '__________': '{{EffectiveDate}}'
    }

    print(f"Starting to process: {os.path.basename(file_path)}")
    
    try:
        # Start Word
        print("Initializing Word...")
        word = win32.gencache.EnsureDispatch('Word.Application')
        word.Visible = True  # Set to True for testing so we can see what's happening
        
        # Open the document
        print("Opening document...")
        doc = word.Documents.Open(file_path)
        
        # Process each replacement
        for search_text, replace_text in replacements.items():
            print(f"Searching for: {search_text}")
            find = doc.Content.Find
            find.ClearFormatting()
            find.Replacement.ClearFormatting()
            find.Text = search_text
            find.Replacement.Text = replace_text
            
            # Do the replacement
            result = find.Execute(
                Replace=2,      # wdReplaceAll
                Forward=True,
                Wrap=1,         # wdFindContinue
                MatchCase=True,
                MatchWholeWord=False
            )
            
            if result:
                print(f"Successfully replaced {search_text} with {replace_text}")
            else:
                print(f"No instances of {search_text} found")
        
        # Save with a new name to preserve original
        new_path = file_path.replace('.docx', '_processed.docx')
        doc.SaveAs(new_path)
        print(f"Saved processed file as: {os.path.basename(new_path)}")
        
        # Close the document
        doc.Close()
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
    
    finally:
        # Clean up Word
        try:
            word.Quit()
            print("Word closed successfully")
        except:
            print("Note: Could not close Word normally")

if __name__ == "__main__":
    # Your specific test file
    test_file = r"C:\Users\RobertReynolds\Python Projects\Python Development Projects\OrderTemplates\01a WHQ Program Support Order Agile Template Final 6.1.docx"
    
    if os.path.exists(test_file):
        process_test_template(test_file)
        print("\nProcessing complete!")
    else:
        print("Error: Test file not found!")
