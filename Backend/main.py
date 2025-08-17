import os
import shutil

import uvicorn
from app import Agent
from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserMessage(BaseModel):
    message: str


agent = Agent("documents", "data", "my_collections")


@app.post("/api/agent")
def executeAgent(request: Request, message: UserMessage):
    # Cek dulu content type
    content_type = request.headers.get("content-type")
    if not content_type or "application/json" not in content_type:
        raise HTTPException(
            status_code=415,  # Unsupported Media Type
            detail="Hanya menerima application/json",
        )
    if not message.message:
        return {"response": "Message is required."}
    try:
        result = agent.execute(
            {"user_message": message.message}, thread_id="thread_123"
        )
        human_message = result["user_message"]
        response = result["response"]
        return {"user_message": human_message, "response": response}
    except Exception as e:
        print(f"Error saat execute agent: {e}")
        return {"user_message": message, "response": "Maaf sepertinya kesalahan."}


@app.post("/api/agent/document")
async def withDocument(message: str = Form(...), file: UploadFile = File(...)):
    directory_path = "documents"
    if not os.path.exists(directory_path):
        os.makedirs(directory_path, exist_ok=True)

    file_path = os.path.join(directory_path, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    try:
        result = agent.execute(
            {
                "user_message": message,
                "is_include_document": True,
                "document_name": file.filename,
                "document_type": "pdf"
                if file.content_type == "application/pdf"
                else "txt",
            },
            "thread_123",
        )
        await file.close()
        human_message = result["user_message"]
        response = result["response"]
        print(f"============RESULT==========\n{result}")
        return {"user_message": human_message, "response": response}
    except Exception as e:
        print(f"Error saat execute agent: {e}")
        return {"user_message": message, "response": "Maaf sepertinya kesalahan."}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
