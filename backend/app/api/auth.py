from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import hashlib
import time
import jwt
import os
from datetime import datetime

router = APIRouter()

# In-memory user store (replace with MongoDB in production)
# Schema: { "email": { "name": "...", "email": "...", "photo": "...", "provider": "...", "created_at": "..." } }
users_db = {}

SECRET_KEY = os.getenv("SECRET_KEY", "mediai_super_secret_key_change_me")
ALGORITHM = "HS256"


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: str = ""
    country: str = ""


class LoginRequest(BaseModel):
    email: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class OAuthRequest(BaseModel):
    id_token: str


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def create_token(data: dict) -> str:
    payload = {**data, "exp": time.time() + 60 * 60 * 24 * 7}  # 7 days
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register")
async def register(req: RegisterRequest):
    if req.email in users_db:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    if len(req.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")

    users_db[req.email] = {
        "name": req.name,
        "email": req.email,
        "password": hash_password(req.password),
        "phone": req.phone,
        "country": req.country,
        "provider": "email",
        "created_at": datetime.now().isoformat()
    }
    return {"message": "Account created successfully. Please log in."}


@router.post("/login")
async def login(req: LoginRequest):
    user = users_db.get(req.email)
    if not user or user.get("password") != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_token({"sub": req.email, "name": user["name"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"name": user["name"], "email": user["email"], "photo": user.get("photo")}
    }


def handle_oauth(id_token: str, provider: str):
    try:
        # For a local prototype without a Firebase Service Account JSON, we decode the JWT 
        # using PyJWT. In a production app, you would download your service account JSON 
        # and use firebase_admin.auth.verify_id_token(id_token).
        decoded_token = jwt.decode(id_token, options={"verify_signature": False})
        
        email = decoded_token.get("email")
        name = decoded_token.get("name", email.split("@")[0] if email else "User")
        photo = decoded_token.get("picture", "")

        if not email:
            raise HTTPException(status_code=400, detail="No email provided by OAuth provider.")

        # Create user if it doesn't exist
        if email not in users_db:
            users_db[email] = {
                "name": name,
                "email": email,
                "photo": photo,
                "provider": provider,
                "created_at": datetime.now().isoformat()
            }
        else:
            # Update photo and name if missing
            if not users_db[email].get("photo") and photo:
                users_db[email]["photo"] = photo
            if users_db[email].get("name") == email.split("@")[0] and name:
                users_db[email]["name"] = name

        user = users_db[email]
        token = create_token({"sub": email, "name": user["name"]})
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {"name": user["name"], "email": user["email"], "photo": user.get("photo")}
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication token: {str(e)}")


@router.post("/google")
async def google_auth(req: OAuthRequest):
    return handle_oauth(req.id_token, "google")


@router.post("/github")
async def github_auth(req: OAuthRequest):
    return handle_oauth(req.id_token, "github")


@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    # In production, send an actual email
    # We respond with success regardless to prevent email enumeration
    return {"message": "If an account exists for this email, a reset link has been sent."}
