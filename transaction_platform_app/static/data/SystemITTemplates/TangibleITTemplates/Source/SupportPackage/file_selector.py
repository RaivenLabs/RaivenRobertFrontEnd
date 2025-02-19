import os
from pathlib import Path

def select_file_from_directory(directory_path=None):
    """
    Lists all files in a directory and lets user select one.
    If no directory is provided, asks for one.
    """
    # If no directory provided, use current directory as default
    if directory_path is None:
        directory_path = input("Please enter the directory path (or press Enter for current directory): ").strip()
        if not directory_path:
            directory_path = os.getcwd()

    # Convert to Path object for easier handling
    dir_path = Path(directory_path)

    # Verify directory exists
    if not dir_path.exists() or not dir_path.is_dir():
        print(f"Error: {directory_path} is not a valid directory")
        return None

    # Get all files (not directories) in the specified directory
    files = [f for f in dir_path.iterdir() if f.is_file()]
    
    # Sort files alphabetically
    files.sort()

    # If no files found
    if not files:
        print(f"No files found in {directory_path}")
        return None

    # Print numbered list of files
    print("\nAvailable files:")
    for i, file in enumerate(files, 1):
        print(f"{i}. {file.name}")

    # Get user selection
    while True:
        try:
            choice = input("\nSelect a file number (or 'q' to quit): ")
            
            if choice.lower() == 'q':
                return None
                
            choice_num = int(choice)
            if 1 <= choice_num <= len(files):
                selected_file = files[choice_num - 1]
                print(f"\nYou selected: {selected_file.name}")
                return selected_file
            else:
                print(f"Please enter a number between 1 and {len(files)}")
        except ValueError:
            print("Please enter a valid number or 'q' to quit")

if __name__ == "__main__":
    # Example usage
    target_dir = r"C:\Users\RobertReynolds\Python Projects\Python Development Projects\TransactionPlatformDevelopmentAlphaLocal\transaction_platform_app\static\data\BaseITTemplates\OrderTemplates"
    
    selected_file = select_file_from_directory(target_dir)
    
    if selected_file:
        print(f"\nFull path of selected file: {selected_file.absolute()}")
