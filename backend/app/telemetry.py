import os
import logging

from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

logger = logging.getLogger(__name__)


def setup_telemetry() -> None:
    endpoint = os.getenv(
        "OTEL_EXPORTER_OTLP_ENDPOINT",
        "http://jaeger-collector.observability.svc.cluster.local:4317",
    )
    service_name = os.getenv("OTEL_SERVICE_NAME", "sg-intranet-backend")

    resource = Resource.create(
        attributes={
            "service.name": service_name,
            "service.version": "1.0.0",
            "deployment.environment": os.getenv("ENV", "production"),
        }
    )

    provider = TracerProvider(resource=resource)

    try:
        exporter = OTLPSpanExporter(
            endpoint=endpoint,
            insecure=True,
        )
        provider.add_span_processor(BatchSpanProcessor(exporter))
        logger.info(f"OpenTelemetry initialisé → {endpoint}")
    except Exception as e:
        logger.warning(f"OTel exporter non disponible : {e}")

    trace.set_tracer_provider(provider)