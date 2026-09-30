"""
VayuGrid Vernacular & Speech API Endpoints
Provides routes for synthesizing multi-language citizen advisories and audio streams.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.models.forensic import (
    VernacularAdvisories,
    VernacularAudioResponse
)
from app.services.vernacular_service import vernacular_service

router = APIRouter(prefix="/vernacular", tags=["Vernacular Intelligence"])


class AdvisorySynthesisRequest(BaseModel):
    source_classification: str = Field(..., json_schema_extra={"example": "OPEN_MUNICIPAL_WASTE_BURNING"})
    severity_score: float = Field(..., ge=0.0, le=1.0, json_schema_extra={"example": 0.88})
    city_name: str = Field(default="Delhi-NCR", json_schema_extra={"example": "Delhi-NCR"})
    detected_markers: Optional[List[str]] = Field(default_factory=list)


class SpeechAudioRequest(BaseModel):
    text: str = Field(..., json_schema_extra={"example": "Dense toxic smoke detected nearby. Vulnerable groups should stay indoors."})
    language_code: str = Field(..., json_schema_extra={"example": "hi"})


@router.post("/synthesize", response_model=VernacularAdvisories)
async def synthesize_vernacular_advisories(payload: AdvisorySynthesisRequest):
    """
    Generates translated public health emergency advisories across all 6 Indian languages:
    English (en), Hindi (hi), Telugu (te), Kannada (kn), Tamil (ta), Malayalam (ml).
    """
    try:
        advisories = vernacular_service.generate_advisories(
            source_classification=payload.source_classification,
            severity_score=payload.severity_score,
            city_name=payload.city_name,
            detected_markers=payload.detected_markers
        )
        return advisories
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Advisory synthesis error: {str(exc)}")


@router.post("/audio", response_model=VernacularAudioResponse)
async def synthesize_speech_audio(payload: SpeechAudioRequest):
    """
    Synthesizes speech audio for an advisory string in a target language (en, hi, te, kn, ta, ml).
    Returns Base64 MP3 stream or Web Speech fallback directive.
    """
    try:
        audio_response = vernacular_service.synthesize_speech(
            text=payload.text,
            language_code=payload.language_code
        )
        return audio_response
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Speech synthesis error: {str(exc)}")
