from flask import Flask, jsonify, send_from_directory, send_file, request
import os
from flask_cors import CORS
import mimetypes
import base64
from pathlib import Path
import time
import json

APP_DIR = os.path.dirname(os.path.abspath(__file__))  # main dir
BASE_DIR = os.path.abspath(os.path.join(APP_DIR, "..", ".."))  # sub ir

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

directory_cache = {}
cache_timeout = 5
file_metadata_cache = {}
file_metadata_timeout = 10

TEXT_EXTENSIONS = {'.txt', '.md', '.rtf', '.js', '.py', '.html', '.css', 
                   '.json', '.xml', '.yml', '.yaml', '.ini', '.conf', '.cfg',
                   '.java', '.c', '.cpp', '.h', '.hpp', '.php', '.rb', '.go',
                   '.swift', '.kt', '.ts', '.jsx', '.tsx', '.vue', '.svelte'}

@app.route('/')
def serve_index():
    return send_from_directory(APP_DIR, 'index.html')

@app.route('/1.mp3')
def serve_audio():
    return send_from_directory(APP_DIR, '1.mp3')

# Add this new endpoint for the directory index JSON
@app.route('/api/directory-index')
def serve_directory_index():
    """Serve the complete directory index JSON file"""
    json_path = os.path.join(APP_DIR, 'directory_index.json')
    
    if not os.path.exists(json_path):
        return jsonify({"error": "directory_index.json not found"}), 404
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            directory_data = json.load(f)
        return jsonify(directory_data)
    except Exception as e:
        return jsonify({"error": f"Error reading directory index: {str(e)}"}), 500

# Add search endpoint that uses the directory index
@app.route('/api/search')
def search_files():
    """Search files and folders using the directory index"""
    query = request.args.get('q', '').lower().strip()
    
    if not query or len(query) < 2:
        return jsonify({"success": True, "results": []})
    
    json_path = os.path.join(APP_DIR, 'directory_index.json')
    
    if not os.path.exists(json_path):
        return jsonify({"error": "Search index not available"}), 404
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            directory_data = json.load(f)
        
        results = []
        
        def search_recursive(items, current_path=""):
            for item in items:
                item_name = item.get('name', '').lower()
                item_path = item.get('path', '')
                
                # Check if name matches query
                if query in item_name:
                    results.append({
                        'name': item.get('name', ''),
                        'path': item_path,
                        'is_dir': item.get('is_dir', False)
                    })
                
                # Recursively search children
                if item.get('is_dir', False) and item.get('children'):
                    search_recursive(item['children'], item_path)
        
        # Start search from root items
        search_recursive(directory_data.get('items', []))
        
        return jsonify({
            "success": True,
            "results": results,
            "query": query,
            "count": len(results)
        })
        
    except Exception as e:
        return jsonify({"error": f"Search failed: {str(e)}"}), 500

def is_safe_path(path):
    """Fast path safety check"""
    return os.path.abspath(path).startswith(os.path.abspath(BASE_DIR))

def get_cached_directory_listing(path):
    """Get directory listing from cache or generate it"""
    current_time = time.time()
    cached = directory_cache.get(path)
    if cached and current_time - cached['timestamp'] < cache_timeout:
        return cached['data']
    
    try:
        items = os.listdir(path)
        result = []
        for item in items:
            item_path = os.path.join(path, item)
            result.append({
                'name': item,
                'is_dir': os.path.isdir(item_path),
                'path': os.path.join(os.path.relpath(path, BASE_DIR), item).replace("\\", "/")
            })
        
        directory_cache[path] = {
            'data': result,
            'timestamp': current_time
        }
        return result
    except (FileNotFoundError, NotADirectoryError):
        return None

@app.route('/api/files')
@app.route('/api/files/<path:subpath>')
def api_files(subpath=''):
    full_path = os.path.join(BASE_DIR, subpath)
    if not is_safe_path(full_path):
        return jsonify({"error": "Access denied"}), 403
    
    items = get_cached_directory_listing(full_path)
    if items is None:
        return jsonify({"error": "Directory not found"}), 404
    
    clean_subpath = subpath.replace('./', '').replace('/./', '/')
    if clean_subpath == '':
        display_path = "Portfolio"
    else:
        clean_subpath = clean_subpath.replace('//', '/')
        display_path = f"Portfolio/{clean_subpath}"
    
    return jsonify({
        "current_path": display_path,
        "items": items
    })

@app.route('/api/raw-file/<path:filepath>')
def api_raw_file(filepath):
    full_path = os.path.join(BASE_DIR, filepath)
    if not is_safe_path(full_path):
        return jsonify({"error": "Access denied"}), 403
    
    try:
        if not os.path.isfile(full_path):
            return "File not found", 404
        
        mimetype = get_cached_mimetype(full_path)
        return send_file(full_path, mimetype=mimetype, as_attachment=False)
    except FileNotFoundError:
        return "File not found", 404
    except Exception as e:
        return f"Error reading file: {str(e)}", 500

def get_cached_mimetype(filepath):
    """Get MIME type with caching"""
    current_time = time.time()
    cached = file_metadata_cache.get(filepath)
    if cached and current_time - cached['timestamp'] < file_metadata_timeout:
        return cached['mimetype']
    
    mimetype, _ = mimetypes.guess_type(filepath)
    if not mimetype:
        mimetype = 'application/octet-stream'
    
    file_metadata_cache[filepath] = {
        'mimetype': mimetype,
        'timestamp': current_time
    }
    return mimetype

def is_text_file(filepath):
    """Fast text file detection using extension and MIME type"""
    ext = os.path.splitext(filepath)[1].lower()
    if ext in TEXT_EXTENSIONS:
        return True
    
    mimetype = get_cached_mimetype(filepath)
    return mimetype.startswith('text/') or mimetype in [
        'application/json', 
        'application/xml',
        'application/javascript'
    ]

@app.route('/api/file-content-enhanced/<path:filepath>')
def api_file_content_enhanced(filepath):
    full_path = os.path.join(BASE_DIR, filepath)
    if not is_safe_path(full_path):
        return jsonify({"error": "Access denied"}), 403
    
    try:
        if not os.path.isfile(full_path):
            return jsonify({"error": "File not found"}), 404
        
        file_size = os.path.getsize(full_path)
        mimetype = get_cached_mimetype(full_path)
        
        if mimetype.startswith('image/') and file_size > 1024 * 1024:
            return jsonify({
                "type": "image",
                "content": f"/api/raw-file/{filepath}",
                "mimetype": mimetype,
                "size": file_size
            })
        
        if is_text_file(full_path):
            try:
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read(8000)
                    return jsonify({
                        "type": "text",
                        "content": content,
                        "mimetype": mimetype,
                        "size": file_size
                    })
            except UnicodeDecodeError:
                pass
        elif mimetype.startswith('image/') and file_size <= 1024 * 1024:
            try:
                with open(full_path, 'rb') as f:
                    encoded = base64.b64encode(f.read()).decode('utf-8')
                    return jsonify({
                        "type": "image",
                        "content": f"data:{mimetype};base64,{encoded}",
                        "mimetype": mimetype,
                        "size": file_size
                    })
            except Exception:
                pass
        elif mimetype.startswith('audio/') or file_size > 1024 * 1024:
            return jsonify({
                "type": "audio" if mimetype.startswith('audio/') else "binary",
                "content": f"/api/raw-file/{filepath}",
                "mimetype": mimetype,
                "size": file_size
            })
        else:
            try:
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read(2000)
                    return jsonify({
                        "type": "text",
                        "content": content,
                        "mimetype": mimetype,
                        "size": file_size
                    })
            except UnicodeDecodeError:
                return jsonify({
                    "type": "binary",
                    "content": f"/api/raw-file/{filepath}",
                    "mimetype": mimetype,
                    "size": file_size
                })  
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Error reading file: {str(e)}"}), 500

@app.route('/api/file-content/<path:filepath>')
def api_file_content(filepath):
    full_path = os.path.join(BASE_DIR, filepath)
    if not is_safe_path(full_path):
        return jsonify({"error": "Access denied"}), 403
    
    try:
        ext = os.path.splitext(full_path)[1].lower()
        if ext in TEXT_EXTENSIONS:
            with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read(4000)
                return content
        else:
            return "Not a text file", 400
    except FileNotFoundError:
        return "File not found", 404
    except Exception as e:
        return f"Error reading file: {str(e)}", 500

@app.before_request
def clear_old_cache():
    """Clear old cache entries before each request"""
    current_time = time.time()
    global directory_cache
    directory_cache = {k: v for k, v in directory_cache.items() 
                      if current_time - v['timestamp'] < cache_timeout}
    global file_metadata_cache
    file_metadata_cache = {k: v for k, v in file_metadata_cache.items() 
                          if current_time - v['timestamp'] < file_metadata_timeout}

if __name__ == '__main__':
    mimetypes.init()
    app.run(debug=True, port=8000, host='0.0.0.0', threaded=True)




