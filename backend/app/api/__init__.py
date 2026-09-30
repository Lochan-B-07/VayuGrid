"""VayuGrid REST API routers."""

from app.api.telemetry import router as telemetry_router
from app.api.dispersion import router as dispersion_router
from app.api.incidents import router as incidents_router
from app.api.endpoints.vernacular import router as vernacular_router

__all__ = [
    "telemetry_router",
    "dispersion_router",
    "incidents_router",
    "vernacular_router",
]
