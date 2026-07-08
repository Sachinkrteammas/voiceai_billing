from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from db import get_db2
from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db2)):

    user = db.execute(
        text("""
            SELECT id,name,email
            FROM users
            WHERE email=:email
            AND password=:password
            AND is_active=1
        """),
        {
            "email": data.email,
            "password": data.password,
        }
    ).fetchone()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "success": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        }
    }