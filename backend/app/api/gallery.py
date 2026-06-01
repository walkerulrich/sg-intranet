from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.database import get_db
from app.models.photo import Photo
from app.schemas.user import PhotoOut

router = APIRouter(prefix="/api/gallery", tags=["Galerie"])


@router.get("", response_model=List[PhotoOut])
async def list_photos(
    category: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    """Liste toutes les photos, optionnellement filtrée par catégorie."""
    query = select(Photo).order_by(Photo.id)
    if category:
        query = query.where(Photo.category == category)
    result = await db.execute(query)
    return list(result.scalars().all())
