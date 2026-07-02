from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MediAI"
    MONGODB_URL: str = "mongodb://localhost:27017" # Replace with Atlas URI in .env
    DATABASE_NAME: str = "mediai_db"
    SECRET_KEY: str = "SUPER_SECRET_KEY_FOR_JWT_TESTING_ONLY"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    GEMINI_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
