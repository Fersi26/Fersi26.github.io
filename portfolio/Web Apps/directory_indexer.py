import os
import json
from pathlib import Path
import time

class DirectoryIndexer:
    def __init__(self, base_dir):
        self.base_dir = Path(base_dir).resolve()
        self.index_file = Path(__file__).parent / "directory_index.json"
        
    def index_directory(self):
        """Recursively index all files and folders"""
        print("Indexing directory structure...")
        start_time = time.time()
        
        index_data = {
            "timestamp": time.time(),
            "items": self._scan_directory(self.base_dir)
        }
        
        # Save to JSON file
        with open(self.index_file, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, indent=2)
        
        elapsed = time.time() - start_time
        print(f"Indexing completed in {elapsed:.2f} seconds")
        print(f"Index saved to: {self.index_file}")
        
        return index_data
    
    def _scan_directory(self, directory, relative_path=""):
        """Recursively scan directory and return structure"""
        items = []
        
        try:
            for item in os.listdir(directory):
                item_path = directory / item
                rel_path = str(Path(relative_path) / item) if relative_path else item
                
                item_data = {
                    'name': item,
                    'path': rel_path.replace("\\", "/"),
                    'is_dir': item_path.is_dir()
                }
                
                if item_path.is_dir():
                    item_data['children'] = self._scan_directory(item_path, rel_path)
                
                items.append(item_data)
                
        except (PermissionError, FileNotFoundError) as e:
            print(f"Warning: Could not access {directory}: {e}")
            
        return items
    
    def load_index(self):
        """Load the existing index"""
        if self.index_file.exists():
            with open(self.index_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return None
    
    def is_index_fresh(self, max_age_minutes=60):
        """Check if index is fresh enough"""
        data = self.load_index()
        if not data:
            return False
            
        age_minutes = (time.time() - data['timestamp']) / 60
        return age_minutes < max_age_minutes

def update_directory_index():
    """Update the directory index (call this periodically)"""
    # Use the same BASE_DIR as your Flask app
    BASE_DIR = Path(__file__).parent.parent  # Adjust path as needed
    
    indexer = DirectoryIndexer(BASE_DIR)
    
    # Only reindex if index is older than 1 hour
    if not indexer.is_index_fresh(max_age_minutes=60):
        return indexer.index_directory()
    else:
        print("Index is still fresh, using existing index")
        return indexer.load_index()

if __name__ == "__main__":
    update_directory_index()