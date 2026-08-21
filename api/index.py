import os
import sys

# Add backend directory to sys.path
backend_dir = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.append(backend_dir)

from main import app

# Export the FastAPI instance for Vercel Serverless Python runtime
# Vercel will automatically detect ASGI applications (app)
