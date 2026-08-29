"""
Backend Entry Script
Starts the Uvicorn ASGI server on port 8000
"""

import uvicorn

if __name__ == "__main__":
    print("==================================================================")
    print("Starting Cyclone AI/ML Backend Server (FastAPI + YOLO11 API)")
    print("API Docs: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    print("==================================================================")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
