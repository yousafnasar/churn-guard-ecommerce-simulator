from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import APP_NAME, APP_VERSION
from app.core.database import Base, engine
from app.models.product import Product
from app.models.event import Event
from app.models.user import User
from app.models.gmail_account import GmailAccount

app = FastAPI(title=APP_NAME, version=APP_VERSION)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return {
        "message": "Ecommerce Simulator API is running",
        "version": APP_VERSION,
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}