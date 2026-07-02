from fastapi import APIRouter
from pydantic import BaseModel
import asyncio

router = APIRouter()

class SymptomRequest(BaseModel):
    symptoms: list
    age: str
    gender: str
    duration: str
    severity: str
    history: str

@router.post("")
async def check_symptoms(request: SymptomRequest):
    await asyncio.sleep(1)
    
    # Simple logic mapping based on symptoms
    symptoms_str = " ".join(request.symptoms).lower()
    
    conditions = ["Common Cold", "Seasonal Allergies"]
    risk = "Low"
    specialist = "General Practitioner"
    urgency = "Routine medical care if symptoms persist"
    
    if "fever" in symptoms_str and "cough" in symptoms_str:
        conditions = ["Influenza (Flu)", "COVID-19", "Bronchitis"]
        risk = "Moderate"
    
    if "shortness of breath" in symptoms_str or request.severity == "Severe":
        conditions = ["Pneumonia", "Severe Asthma Exacerbation"]
        risk = "High"
        urgency = "Seek immediate emergency medical attention"
        specialist = "Emergency Medicine / Pulmonologist"

    return {
        "conditions": conditions,
        "risk_level": risk,
        "urgency": urgency,
        "specialist": specialist,
        "lifestyle_advice": [
            "Get plenty of rest",
            "Stay hydrated by drinking water or clear broths",
            "Monitor your temperature and breathing"
        ],
        "disclaimer": "This analysis is for educational purposes only and does not constitute a medical diagnosis. Always consult a healthcare professional."
    }
