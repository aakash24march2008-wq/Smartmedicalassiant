from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Verify Groq API key on startup
groq_key = os.getenv("GROQ_API_KEY", "")
if not groq_key:
    print("WARNING: Groq API key not found. Please add GROQ_API_KEY to your .env file.")
else:
    print("INFO: Groq API key loaded successfully.")
    # Simple test of the key
    try:
        from groq import Groq
        client = Groq(api_key=groq_key)
        client.models.list()
        print("INFO: Groq API key connection verified successfully.")
    except Exception as e:
        print(f"WARNING: Groq API key verification failed: {str(e)}")

app = FastAPI(title="MediAI Backend API", version="1.0.0")

# Configure CORS — allow localhost dev + deployed Vercel frontend
FRONTEND_URL = os.getenv("FRONTEND_URL", "")

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "https://smartmedicalassiant.vercel.app",
    "https://frontend-gilt-nine-rc0o3o9lhx.vercel.app",
    "https://frontend-a8a2mjuma-aakash24march2008-wqs-projects.vercel.app",
]

# Allow any custom FRONTEND_URL set via env var (e.g. your Vercel deployment URL)
if FRONTEND_URL and FRONTEND_URL not in origins:
    origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import auth, image_diagnosis, report_analysis, chat, symptom_check

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(image_diagnosis.router, prefix="/api/image-diagnosis", tags=["image-diagnosis"])
app.include_router(report_analysis.router, prefix="/api/report-analysis", tags=["report-analysis"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(symptom_check.router, prefix="/api/symptom-check", tags=["symptom-check"])

@app.get("/")
def read_root():
    return {"message": "Welcome to MediAI API"}

# We will include routers for authentication, diagnosis, report analysis, etc. later.
