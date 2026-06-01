from sqlalchemy import Column, Integer, String, DateTime, func
from app.database import Base


class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String(500))
    image_url = Column(String(500), nullable=False)
    category = Column(String(50))  # bureau, ambiance, evenement, etc.
    location = Column(String(200))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
