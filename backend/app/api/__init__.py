from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.gallery import router as gallery_router

__all__ = ["auth_router", "users_router", "gallery_router"]
