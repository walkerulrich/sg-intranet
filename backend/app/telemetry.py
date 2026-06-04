import os
import logging
from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

logger = logging.getLogger(__name__)


def setup_telemetry() -> None:
    endpoint = os.getenv(
        "OTEL_EXPORTER_OTLP_TRACES_ENDPOINT",
        "http://jaeger-collector.observability.svc.cluster.local:4318/v1/traces",
    )
    service_name = os.getenv("OTEL_SERVICE_NAME", "sg-intranet-backend")
    resource = Resource.create({"service.name": service_name})
    provider = TracerProvider(resource=resource)
    try:
        exporter = OTLPSpanExporter(endpoint=endpoint, timeout=5)
        provider.add_span_processor(BatchSpanProcessor(exporter))
        logger.info(f"OpenTelemetry initialisé → {endpoint}")
    except Exception as e:
        logger.warning(f"OTel non disponible : {e}")
    trace.set_tracer_provider(provider)


def get_tracer():
    return trace.get_tracer("sg-intranet")