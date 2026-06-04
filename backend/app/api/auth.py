from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from opentelemetry import trace

from app.database import get_db
from app.schemas.user import LoginRequest, LoginResponse, UserOut
from app.services.auth import create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentification"])
tracer = trace.get_tracer("sg-intranet")


@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    with tracer.start_as_current_span("login_vulnerabile") as span:
        span.set_attribute("username", body.username)
        raw_query = (
            f"SELECT id, username, password, full_name, role, department, "
            f"entreprise, email, bio, avatar_url, created_at "
            f"FROM users "
            f"WHERE username = '{body.username}' AND password = '{body.password}'"
        )
        span.set_attribute("db.statement", raw_query)
        try:
            result = await db.execute(text(raw_query))
            row = result.fetchone()
        except Exception as e:
            span.set_attribute("error", str(e))
            raise HTTPException(status_code=500, detail=f"Erreur SQL : {str(e)}")

        if row is None:
            span.set_attribute("auth.success", False)
            raise HTTPException(status_code=401, detail="Identifiants incorrects")

        user_dict = dict(row._mapping)
        span.set_attribute("auth.success", True)
        access_token = create_access_token({"sub": user_dict["username"]})

        return LoginResponse(
            access_token=access_token,
            user=UserOut(**user_dict),
        )


@router.post("/login-secure", response_model=LoginResponse)
async def login_secure(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    with tracer.start_as_current_span("login_secure") as span:
        span.set_attribute("username", body.username)
        result = await db.execute(
            text("""
                SELECT id, username, password, full_name, role, department,
                       entreprise, email, bio, avatar_url, created_at
                FROM users
                WHERE username = :username AND password = :password
            """),
            {"username": body.username, "password": body.password},
        )
        row = result.fetchone()
        if row is None:
            span.set_attribute("auth.success", False)
            raise HTTPException(status_code=401, detail="Identifiants incorrects")

        user_dict = dict(row._mapping)
        span.set_attribute("auth.success", True)
        access_token = create_access_token({"sub": user_dict["username"]})
        return LoginResponse(access_token=access_token, user=UserOut(**user_dict))