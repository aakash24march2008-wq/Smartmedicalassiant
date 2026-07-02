import logging
import io
import os
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from groq import Groq
import PyPDF2

load_dotenv()

logger = logging.getLogger(__name__)
router = APIRouter()

SYSTEM_PROMPT = """You are VitaCare AI, an advanced medical assistant.

Your responsibility is to analyze uploaded medical reports and explain them professionally in simple language.

IMPORTANT RULES:
• Never mention the uploaded filename.
• Never say "The analysis of filename.pdf..."
• Never generate one-paragraph responses.
• Use professional medical formatting.
• Explain medical terms in plain English.
• Highlight abnormal findings.
• Mention normal findings.
• If values are unavailable, state that clearly.
• Give confidence-based suggestions only.
• Never diagnose diseases with certainty.
• Always recommend consulting a healthcare professional.

Return the response in Markdown using EXACTLY this format:

# 🩺 Medical Report Analysis

## 📋 Overall Health Summary

Write a concise professional summary of the patient's overall condition.

---

## ✅ Normal Findings

List all values that appear within the normal range using bullet points:
• Test Name: Value — Normal

---

## ⚠️ Abnormal Findings

Create a table:

| Test | Result | Normal Range | Interpretation |
|------|--------|--------------|----------------|

Explain every abnormal result below the table.

---

## 🧬 Possible Clinical Interpretation

Explain what the abnormal values could indicate. Use cautious wording such as:
"This may suggest..."
"This could be associated with..."

Do NOT claim a diagnosis.

---

## 💡 Lifestyle Recommendations

Provide personalized recommendations:
• Hydration
• Sleep
• Exercise
• Balanced nutrition
• Stress management

---

## 🍎 Dietary Suggestions

Recommend foods that may help improve the reported abnormalities. Example:
• Iron-rich foods
• Vitamin C sources
• Leafy vegetables
• Protein sources

---

## 👨‍⚕️ Suggested Follow-Up

Mention whether additional tests or consultation may be beneficial. Example:
• Repeat CBC in two weeks
• Consult a physician
• Monitor symptoms

---

## ⚠️ Disclaimer

*This AI-generated report is intended for informational purposes only and should not replace professional medical advice. Always consult a qualified healthcare professional for diagnosis and treatment.*
"""


def extract_text_from_file(file_content: bytes, filename: str, content_type: str) -> str:
    """Extract text from PDF or plain text file."""
    text = ""
    try:
        if content_type == "application/pdf" or filename.lower().endswith(".pdf"):
            reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        else:
            text = file_content.decode("utf-8", errors="ignore")
    except Exception as e:
        logger.error(f"Text extraction error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Could not extract text from the file: {str(e)}")

    if not text.strip():
        # If no text could be extracted (e.g., scanned PDF), return a fallback analysis
        text = "The uploaded document appears to be a scanned image or contains no extractable text. Please provide a text-based medical report."

    return text[:12000]  # Limit to ~12k chars to stay within Groq context limits


@router.post("")
async def analyze_report(file: UploadFile = File(...)):
    groq_api_key = os.getenv("GROQ_API_KEY", "")
    if not groq_api_key:
        logger.error("GROQ_API_KEY is not configured.")
        raise HTTPException(status_code=500, detail="AI service is not configured. Please check the server environment.")

    # Read and extract file content
    file_content = await file.read()
    if not file_content:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    report_text = extract_text_from_file(file_content, file.filename, file.content_type)

    user_message = f"Please analyze the following medical report and provide a professional structured analysis:\n\n---\n{report_text}\n---"

    try:
        client = Groq(api_key=groq_api_key)
        logger.info("Sending medical report to Groq for analysis...")

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,  # Lower temp for more consistent, factual medical output
            max_tokens=2048,
        )

        ai_response = completion.choices[0].message.content
        logger.info("Groq analysis complete.")

        return {
            "success": True,
            "summary": ai_response,
        }

    except Exception as e:
        logger.error(f"Groq API Error during report analysis: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"The AI report analysis service encountered an error: {str(e)}"
        )
