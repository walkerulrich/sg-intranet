from sqlalchemy import Column, Integer, String, DateTime, func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)  # ⚠ Plaintext for lab (real app would hash)
    full_name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    entreprise = Column(String(100), nullable=False, default="Société Générale")
    email = Column(String(120), unique=True, nullable=False)
    bio = Column(String(500))
    avatar_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
