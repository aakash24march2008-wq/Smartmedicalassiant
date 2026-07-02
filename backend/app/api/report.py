from fastapi import APIRouter, File, UploadFile
import random

router = APIRouter()

@router.post("/analyze")
async def analyze_report(file: UploadFile = File(...)):
    # Mocking PDF extraction and Gemini summarization
    # Since PyMuPDF is blocked by the C++ build issue on Python 3.14, we mock the output.
    
    return {
        "filename": file.filename,
        "summary": "The patient's CBC report indicates a slightly elevated White Blood Cell (WBC) count, suggesting a possible mild infection or inflammation. Hemoglobin and Platelet levels are within normal ranges.",
        "abnormal_values": [
            {"test": "WBC", "value": "11.5", "unit": "10^9/L", "normal_range": "4.5-11.0", "status": "High"}
        ],
        "simple_explanation": "Your white blood cells are the fighters in your immune system. A slightly high number usually means your body is fighting off a minor bug or responding to stress.",
        "key_observations": [
            "Elevated WBC count",
            "Normal Red Blood Cell indices",
            "Normal Platelets"
        ],
        "suggested_questions": [
            "Could a recent cold cause this WBC elevation?",
            "Do I need to take any antibiotics?",
            "When should I repeat this blood test?"
        ]
    }
