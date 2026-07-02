from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
import os
import io
import json
import PyPDF2
from groq import Groq
import logging
from dotenv import load_dotenv

# Ensure dotenv is loaded
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize Groq client
api_key = os.getenv("GROQ_API_KEY", "")
client = None
if api_key:
    try:
        client = Groq(api_key=api_key)
    except Exception as e:
        logger.error(f"Failed to initialize Groq client: {str(e)}")

class MessageModel(BaseModel):
    role: str
    content: str

class StreamRequest(BaseModel):
    messages: list[MessageModel]
    use_rag: bool = False

# Simple in-memory document store for prototype RAG
uploaded_docs = {}

@router.post("/message")
async def chat_message(msg: MessageModel):
    """Receive a single user message and return Groq response (non‑stream)."""
    model_name = "llama-3.3-70b-versatile"
    logger.info(f"Chat Message Request - Model: {model_name}, Role: {msg.role}")
    local_api_key = os.getenv("GROQ_API_KEY", "")
    if not local_api_key:
        error_msg = "Groq API key is missing."
        logger.error(error_msg)
        return JSONResponse(status_code=500, content={"success": False, "error": error_msg})
    try:
        local_client = Groq(api_key=local_api_key)
    except Exception as e:
        error_msg = f"Groq client initialization failed: {str(e)}"
        logger.error(error_msg)
        return JSONResponse(status_code=500, content={"success": False, "error": error_msg})
    system_prompt = (
        "You are VitaCure Hospital's AI Medical Assistant. "
        "Answer healthcare questions professionally using trusted medical knowledge. "
        "Never invent facts. If uncertain, clearly say so. "
        "Encourage users to consult qualified healthcare professionals for diagnosis or emergencies."
    )
    messages = [{"role": "system", "content": system_prompt},
                {"role": msg.role, "content": msg.content}]
    try:
        response = local_client.chat.completions.create(
            messages=messages,
            model=model_name,
            stream=False,
        )
        # Groq returns .choices[0].message.content
        content = response.choices[0].message.content
        return {"success": True, "content": content}
    except Exception as e:
        err_msg = f"Groq API Error: {str(e)}"
        logger.error(err_msg, exc_info=True)
        return JSONResponse(status_code=500, content={"success": False, "error": err_msg})

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    content = await file.read()
    text = ""
    if file.filename.lower().endswith(".pdf"):
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    else:
        text = content.decode('utf-8', errors='ignore')
        
    uploaded_docs["latest"] = {"filename": file.filename, "text": text[:15000]}
    return {"message": "Upload successful", "filename": file.filename}

@router.post("/stream")
async def chat_stream(request: StreamRequest):
    model_name = "llama-3.3-70b-versatile"
    logger.info(f"Chat Stream Request - Model: {model_name}, Messages Count: {len(request.messages)}")
    
    local_api_key = os.getenv("GROQ_API_KEY", "")
    if not local_api_key:
        error_msg = "Groq API key is missing."
        logger.error(error_msg)
        return JSONResponse(status_code=500, content={"success": false, "error": error_msg})

    try:
        local_client = Groq(api_key=local_api_key)
    except Exception as e:
        error_msg = f"Groq client is not initialized: {str(e)}"
        logger.error(error_msg)
        return JSONResponse(status_code=500, content={"success": false, "error": error_msg})

    async def generate_response():
        system_prompt = (
            "You are VitaCure Hospital's AI Medical Assistant. "
            "Answer healthcare questions professionally using trusted medical knowledge. "
            "Never invent facts. If uncertain, clearly say so. "
            "Encourage users to consult qualified healthcare professionals for diagnosis or emergencies."
        )
        
        if request.use_rag and "latest" in uploaded_docs:
            doc = uploaded_docs["latest"]
            system_prompt += (
                f"\n\n--- MEDICAL DOCUMENT CONTEXT ({doc['filename']}) ---\n"
                f"{doc['text']}\n"
                "-----------------------------------------------------\n"
                "RAG SUPPORT ENABLED:\n"
                "Answer ONLY using the retrieved medical knowledge provided in the context above.\n"
                "If the answer is not found in the uploaded documents, clearly state that it is unavailable in the uploaded knowledge base."
            )
            
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history
        for msg in request.messages:
            role = msg.role
            if role == "ai":
                role = "assistant"
            messages.append({"role": role, "content": msg.content})
        
        try:
            logger.info(f"Sending request to Groq API with {len(messages)} messages...")
            stream = local_client.chat.completions.create(
                messages=messages,
                model=model_name,
                stream=True,
            )
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    yield f"data: {json.dumps({'content': content})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            err_msg = f"Groq API Error: {str(e)}"
            logger.error(err_msg, exc_info=True)
            yield f"data: {json.dumps({'content': f'Error: {err_msg}'})}\n\n"
            
    return StreamingResponse(generate_response(), media_type="text/event-stream")


