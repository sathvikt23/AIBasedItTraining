# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


from routes.api_v1 import router as api_router 


app = FastAPI(
    title="AI Services API",
    description="API for text processing, code analysis, DSA questions, and chat",
    version="1.0.0"
)


origins = [
   "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router, prefix="/api/v1", tags=["API"])

@app.get("/")
def root():
    return {"message": "Server is up on 8032 btw cross check the port it is hardcoded , lol how would u hit the server if u did not know the route , F i am dumb "}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8032, reload=True)
