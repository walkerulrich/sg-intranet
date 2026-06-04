from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select
from typing import List, Optional
from opentelemetry import trace

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserOut

router = APIRouter(prefix="/api/users", tags=["Utilisateurs"])
tracer = trace.get_tracer("sg-intranet")


@router.get("", response_model=List[UserOut])
async def list_users(db: AsyncSession = Depends(get_db)):
    with tracer.start_as_current_span("list_users"):
        result = await db.execute(select(User).order_by(User.id))
        return list(result.scalars().all())


@router.get("/search")
async def search_users(q: str = Query(default=""), db: AsyncSession = Depends(get_db)):
    with tracer.start_as_current_span("search_users") as span:
        span.set_attribute("query", q)
        raw_query = (
            f"SELECT id, username, full_name, role, department, entreprise, "
            f"email, avatar_url, bio "
            f"FROM users "
            f"WHERE full_name ILIKE '%{q}%' OR role ILIKE '%{q}%'"
        )
        try:
            result = await db.execute(text(raw_query))
            rows = result.fetchall()
            return {
                "query_executed": raw_query,
                "count": len(rows),
                "data": [dict(r._mapping) for r in rows],
            }
        except Exception as e:
            return {"error": str(e), "query_attempted": raw_query}


@router.get("/by-name/{name}")
async def get_user_by_name(name: str, db: AsyncSession = Depends(get_db)):
    with tracer.start_as_current_span("get_user_by_name") as span:
        span.set_attribute("name", name)
        raw_query = f"SELECT id, username, full_name, role, department, entreprise, email, avatar_url, bio FROM users WHERE full_name = '{name}'"
        try:
            result = await db.execute(text(raw_query))
            rows = result.fetchall()
            if not rows:
                raise HTTPException(status_code=404, detail="Utilisateur introuvable")
            return {
                "query_executed": raw_query,
                "data": [dict(r._mapping) for r in rows],
            }
        except HTTPException:
            raise
        except Exception as e:
            return {"error": str(e), "query_attempted": raw_query}


@router.get("/search-secure")
async def search_users_secure(q: str = Query(default=""), db: AsyncSession = Depends(get_db)):
    with tracer.start_as_current_span("search_users_secure"):
        result = await db.execute(
            text("""
                SELECT id, username, full_name, role, department, entreprise,
                       email, avatar_url, bio
                FROM users
                WHERE full_name ILIKE :q OR role ILIKE :q
            """),
            {"q": f"%{q}%"},
        )
        rows = result.fetchall()
        return {"count": len(rows), "data": [dict(r._mapping) for r in rows]}