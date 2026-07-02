from fastapi import APIRouter, File, UploadFile
import random

router = APIRouter()

# Mocking the CNN model since TensorFlow failed to install on this environment
DISEASES = [
    {"name": "Melanoma", "explanation": "A serious form of skin cancer that begins in cells known as melanocytes. Seek medical attention.", "confidence": 92.5},
    {"name": "Benign Nevus", "explanation": "A common mole, usually harmless. Monitor for changes in size, shape, or color.", "confidence": 98.1},
    {"name": "Basal Cell Carcinoma", "explanation": "A type of skin cancer that begins in the basal cells. Usually treatable if caught early.", "confidence": 85.3}
]

@router.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    # Mocking inference delay and result
    prediction = random.choice(DISEASES)
    
    # Normally we would pass the image to a TF model here and use Gemini to generate explanations.
    return {
        "filename": file.filename,
        "prediction": prediction["name"],
        "confidence": prediction["confidence"],
        "explanation": prediction["explanation"],
        "recommendation": "Consult a healthcare professional for an accurate diagnosis."
    }
