from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.dashboard import router as dashboard_router
from routers.auth import router as auth_router
from routers.wallet import router as wallet_router

app = FastAPI(
    title="Voice AI Billing Dashboard",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(wallet_router, prefix="/api")


@app.get("/")
def home():
    return {
        "message": "Voice AI Billing Dashboard API"
    }