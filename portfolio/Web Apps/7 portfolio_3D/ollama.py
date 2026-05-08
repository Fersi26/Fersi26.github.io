from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import subprocess
import uvicorn
import os
from datetime import datetime
import logging
import json
import asyncio

app = FastAPI()

# More permissive CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Updated models list
MODELS = ["gemma-custom3:1b", "gemma3:1b"]

# Create logs directory if it doesn't exist
LOG_DIR = r"..\"Web Apps"\"7 portfolio_3D"\logs"
os.makedirs(LOG_DIR, exist_ok=True)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(LOG_DIR, "server.log")),
        logging.StreamHandler()
    ]
)

class ChatRequest(BaseModel):
    message: str
    model: str = "gemma-custom3:1b"

# Serve the main HTML page
@app.get("/")
async def serve_index():
    return FileResponse('index.html')

# Serve static files (CSS, JS, images)
@app.get("/{filename}")
async def serve_static(filename: str):
    if filename.endswith('.css') or filename.endswith('.js') or filename.endswith('.png'):
        return FileResponse(filename)
    raise HTTPException(404, "File not found")

async def stream_ollama_response(model: str, message: str):
    """Stream response from Ollama directly"""
    full_response = ""
    try:
        # Run ollama command with streaming
        process = await asyncio.create_subprocess_exec(
            "ollama", "run", model, message,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Stream output character by character for real-time feel
        while True:
            chunk = await process.stdout.read(1)
            if not chunk:
                break
                
            chunk_text = chunk.decode('utf-8', errors='ignore')
            full_response += chunk_text
            
            # Send each character immediately
            yield f"data: {json.dumps({'chunk': chunk_text})}\n\n"
            await asyncio.sleep(0.01)  # Small delay to prevent overwhelming the client
        
        # Wait for process to complete
        await process.wait()
        
        # Log the full interaction
        log_interaction(model, message, full_response.strip())
        
        # Send completion signal
        yield f"data: {json.dumps({'complete': True})}\n\n"
        
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        logging.error(error_msg)
        yield f"data: {json.dumps({'error': error_msg})}\n\n"

def log_interaction(model: str, user_message: str, ai_response: str):
    """Log the conversation to a file"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"\n{'='*50}\nTimestamp: {timestamp}\nModel: {model}\nUser: {user_message}\nAI: {ai_response}\n{'='*50}\n"
    
    # Log to daily file
    daily_file = os.path.join(LOG_DIR, f"conversations_{datetime.now().strftime('%Y%m%d')}.log")
    
    try:
        with open(daily_file, 'a', encoding='utf-8') as f:
            f.write(log_entry)
        logging.info(f"Interaction logged to {daily_file}")
    except Exception as e:
        logging.error(f"Failed to write log: {str(e)}")

@app.post("/chat")
async def chat(request: ChatRequest):
    logging.info(f"Received chat request - Model: {request.model}, Message: {request.message}")
    
    if request.model not in MODELS:
        raise HTTPException(400, "Invalid model")
    
    return StreamingResponse(
        stream_ollama_response(request.model, request.message),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }
    )

@app.get("/models")
def get_models():
    return {"models": MODELS}

@app.get("/logs")
def get_logs():
    """Endpoint to view available log files"""
    try:
        log_files = [f for f in os.listdir(LOG_DIR) if f.endswith('.log')]
        return {"log_files": log_files}
    except Exception as e:
        raise HTTPException(500, f"Error reading log directory: {str(e)}")

if __name__ == "__main__":
    logging.info(f"Starting Ollama server on http://localhost:5343")
    logging.info(f"Logs directory: {LOG_DIR}")
    uvicorn.run(app, host="0.0.0.0", port=5343)  # Changed to 0.0.0.0 for better accessibility
