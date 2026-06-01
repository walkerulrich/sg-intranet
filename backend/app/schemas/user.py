from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: str
    full_name: str
    role: str
    department: str
    entreprise: str
    email: str


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class PhotoOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    image_url: str
    category: Optional[str] = None
    location: Optional[str] = None

    model_config = {"from_attributes": True}
