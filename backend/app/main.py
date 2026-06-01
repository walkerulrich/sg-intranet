from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db, AsyncSessionLocal
from app.services.seed import seed_data
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.gallery import router as gallery_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    # Seed initial des données
    async with AsyncSessionLocal() as db:
        await seed_data(db)
    yield


app = FastAPI(
    title="SG Intranet API",
    description="Application interne Société Générale — Annuaire & Galerie",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(gallery_router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "sg-intranet-api"}
