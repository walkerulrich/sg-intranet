import logging
import json
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from app.database import init_db, AsyncSessionLocal
from app.services.seed import seed_data
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.gallery import router as gallery_router

# --- Logging JSON vers fichier ---
import os
os.makedirs("/var/log/app", exist_ok=True)

json_handler = logging.FileHandler("/var/log/app/backend.log")
json_handler.setLevel(logging.INFO)

class JsonFormatter(logging.Formatter):
    def format(self, record):
        return json.dumps({
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
        })

json_handler.setFormatter(JsonFormatter())
logging.getLogger().addHandler(json_handler)
logging.getLogger().setLevel(logging.INFO)

logger = logging.getLogger("sg-intranet")

@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.telemetry import setup_telemetry
    setup_telemetry()
    Instrumentator().instrument(app).expose(app)
    await init_db()
    async with AsyncSessionLocal() as db:
        await seed_data(db)
    yield

app = FastAPI(
    title="SG Intranet API",
    description="Application interne Société Générale – Annuaire & Galerie",
    version="1.0.0",
    lifespan=lifespan,
)

# --- Middleware HTTP logging ---
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    logger.info(json.dumps({
        "type": "http",
        "method": request.method,
        "path": request.url.path,
        "status_code": response.status_code,
        "duration_ms": duration,
    }))
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://16.171.200.214",
        "http://k8s-sgintran-sgintran-55c5fc87db-1671610882.eu-north-1.elb.amazonaws.com",
    ],
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