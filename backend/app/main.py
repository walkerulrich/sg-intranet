from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.sdk.resources import Resource
import os

from app.database import init_db, AsyncSessionLocal
from app.services.seed import seed_data
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.gallery import router as gallery_router


def setup_telemetry():
    resource = Resource.create({"service.name": "sg-intranet-backend"})
    provider = TracerProvider(resource=resource)
    otlp_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://jaeger-collector:4317")
    exporter = OTLPSpanExporter(endpoint=otlp_endpoint, insecure=True)
    provider.add_span_processor(BatchSpanProcessor(exporter))
    trace.set_tracer_provider(provider)

setup_telemetry()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
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

FastAPIInstrumentor.instrument_app(app)
SQLAlchemyInstrumentor().instrument()


@app.get("/health")
async def health():
    return {"status": "ok", "service": "sg-intranet-api"}