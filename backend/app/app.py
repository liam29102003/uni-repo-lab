from beanie import init_beanie
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from app.api.api_v1.router import router
from app.core.config import settings
from app.models.user_model import User
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path
from fastapi.staticfiles import StaticFiles


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    # allow_origins=["*"],  # allows requests from any origin

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app_dir = Path(__file__).parent  # this points to 'app' folder
static_path = app_dir / "static"

app.mount("/static", StaticFiles(directory=static_path), name="static")

@app.on_event("startup")
async def app_init():
    """
        initialize crucial application services
    """
    
    db_client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING).unirepo
    
    await init_beanie(
        database=db_client,
        document_models= [
          User
        ]
    )

# app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(router, prefix=settings.API_V1_STR)
print("CORS origins:", settings.BACKEND_CORS_ORIGINS)
print("Database connected:", settings.MONGO_CONNECTION_STRING)