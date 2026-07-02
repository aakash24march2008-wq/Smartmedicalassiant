import logging
from fastapi import APIRouter, File, UploadFile, HTTPException
import random
import asyncio

logger = logging.getLogger(__name__)

router = APIRouter()

DISEASES = [
    {
        "prediction": "Melanoma", 
        "confidence": 92.5,
        "description": "A serious form of skin cancer that begins in cells known as melanocytes.",
        "symptoms": ["Change in an existing mole", "Development of a new unusual-looking growth on the skin"],
        "causes": ["UV radiation exposure", "Genetic factors", "Fair skin"],
        "prevention": ["Avoid excessive sun exposure", "Use broad-spectrum sunscreen", "Regular skin checks"],
        "treatment": "Surgical removal, immunotherapy, or targeted therapy.",
        "recommendation": "Consult an oncologist or dermatologist immediately.",
        "severity": "High"
    },
    {
        "prediction": "Benign Nevus", 
        "confidence": 98.1,
        "description": "A common mole, usually harmless, consisting of a cluster of melanocytes.",
        "symptoms": ["Evenly colored brown or black spot", "Round or oval shape", "Smaller than 1/4 inch"],
        "causes": ["Genetics", "Sun exposure during childhood"],
        "prevention": ["Monitor for changes in size, shape, or color (ABCDE rule)"],
        "treatment": "No treatment needed unless it changes or for cosmetic reasons.",
        "recommendation": "Routine monitoring is recommended. No immediate concern.",
        "severity": "Low"
    },
    {
        "prediction": "Basal Cell Carcinoma", 
        "confidence": 85.3,
        "description": "A type of skin cancer that begins in the basal cells, often appearing as a slightly transparent bump.",
        "symptoms": ["A pearly or waxy bump", "A flat, flesh-colored or brown scar-like lesion", "A bleeding or scabbing sore that heals and returns"],
        "causes": ["Long-term exposure to ultraviolet (UV) radiation from sunlight"],
        "prevention": ["Avoid midday sun", "Wear sunscreen year-round", "Wear protective clothing"],
        "treatment": "Prescription creams, surgery, or radiation therapy.",
        "recommendation": "Consult a dermatologist for a biopsy and treatment plan.",
        "severity": "Medium"
    }
]

@router.post("")
async def predict_disease(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
        await asyncio.sleep(2) # Simulate CNN processing time
        return random.choice(DISEASES)
    except Exception as e:
        logger.error(f"CNN Model Error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="The CNN model could not be loaded or failed to process the image.")
