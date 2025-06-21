import os
import shutil
import time
import gc
from git import Repo
from datetime import datetime

# Move out of temp_repo if current working directory is inside it
if os.getcwd().startswith(os.path.abspath('./temp_repo')):
    os.chdir('..')

# Configuration
GITHUB_USERNAME = 'dhiraj7kr'
REPO_NAME = 'Credentials'
ACCESS_TOKEN = '**************************'  # Use your GitHub PAT
REPO_URL = f'https://{GITHUB_USERNAME}:{ACCESS_TOKEN}@github.com/{GITHUB_USERNAME}/{REPO_NAME}.git'
CLONE_DIR = './temp_repo'

def handle_remove_readonly(func, path, exc_info):
    import stat
    os.chmod(path, stat.S_IWRITE)  # Change the file to writable
    func(path)

def remove_folder_with_retries(path, retries=5, delay=1):
    for i in range(retries):
        try:
            shutil.rmtree(path, onerror=handle_remove_readonly)
            print(f"Deleted folder {path}")
            break
        except PermissionError:
            print(f"PermissionError deleting folder {path}, retrying in {delay} sec... ({i+1}/{retries})")
            time.sleep(delay)
    else:
        print(f"Failed to delete folder {path} after {retries} retries.")

try:
    # Clean up old clone if exists
    if os.path.exists(CLONE_DIR):
        remove_folder_with_retries(CLONE_DIR)

    # Clone the private repository
    repo = Repo.clone_from(REPO_URL, CLONE_DIR)

    # Path to README.md
    readme_path = os.path.join(CLONE_DIR, 'README.md')

    # Modify README file (append timestamp)
    with open(readme_path, 'a') as f:
        f.write(f"\n\nUpdated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Stage, commit, and push changes
    repo.git.add('README.md')
    repo.git.commit('-m', 'Auto-update README with timestamp')
    origin = repo.remote(name='origin')
    origin.push()

    print("README.md updated and pushed successfully.")

finally:
    # Release repo reference and force garbage collection
    repo = None
    gc.collect()

    # Remove the temporary clone directory with retries
    if os.path.exists(CLONE_DIR):
        remove_folder_with_retries(CLONE_DIR)
