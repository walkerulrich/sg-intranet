"""
╔══════════════════════════════════════════════════════════════╗
║  ⚠ ATTENTION : ENDPOINT DE LOGIN VOLONTAIREMENT VULNÉRABLE ⚠      ║
║  La requête SQL concatène directement les inputs utilisateur.║
║  À des fins pédagogiques pour le lab SQLi uniquement.        ║
╚══════════════════════════════════════════════════════════════╝
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db
from app.schemas.user import LoginRequest, LoginResponse, UserOut
from app.services.auth import create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentification"])


# ─── FAILLE : Login vulnérable à la SQLi ─────────────────────────────
# Payload Burp Suite : {"username": "alice' --", "password": "n'importe quoi"}
@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Authentifie l'utilisateur.
    ⚠ VULNÉRABLE : la requête SQL n'utilise pas de paramètres liés.
    PAYLOAD BYPASS : username = alice' --, password = n'importe quoi
    """
    raw_query = (
        f"SELECT id, username, password, full_name, role, department, "
        f"entreprise, email, bio, avatar_url, created_at "
        f"FROM users "
        f"WHERE username = '{body.username}' AND password = '{body.password}'"
    )
    try:
        result = await db.execute(text(raw_query))
        row = result.fetchone()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SQL : {str(e)}")

    if row is None:
        raise HTTPException(status_code=401, detail="Identifiants incorrects")

    user_dict = dict(row._mapping)
    access_token = create_access_token({"sub": user_dict["username"]})

    return LoginResponse(
        access_token=access_token,
        user=UserOut(**user_dict),
    )


# ─── VERSION CORRIGÉE (paramètres liés) ──────────────────────────────
@router.post("/login-secure", response_model=LoginResponse)
async def login_secure(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    ✅ Version corrigée : paramètres liés, aucune injection possible.
    """
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
        raise HTTPException(status_code=401, detail="Identifiants incorrects")

    user_dict = dict(row._mapping)
    access_token = create_access_token({"sub": user_dict["username"]})
    return LoginResponse(access_token=access_token, user=UserOut(**user_dict))
