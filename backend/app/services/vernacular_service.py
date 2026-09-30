"""
VayuGrid Vernacular Translation & Speech Synthesis Engine
Generates high-precision citizen health advisories across 6 Indian languages
(English, Hindi, Telugu, Kannada, Tamil, Malayalam) via Google Gemini 3.5 Flash-Lite,
and directs audio synthesis using built-in browser Web Speech API (with optional Google Cloud TTS).
"""

import base64
import json
import logging
import re
from typing import Dict, Optional, Any

from app.core.config import settings
from app.core.prompts import (
    VERNACULAR_TRANSLATION_SYSTEM_PROMPT,
    build_vernacular_prompt
)
from app.models.forensic import (
    VernacularAdvisories,
    VernacularAudioResponse
)
from app.data.sample_audit_payloads import SAMPLE_AUDIT_PAYLOADS

logger = logging.getLogger("vayugrid.vernacular_service")
logger.setLevel(logging.INFO)

# Check for Google Cloud Text-to-Speech SDK
try:
    from google.cloud import texttospeech
    HAS_GCP_TTS = True
except ImportError:
    HAS_GCP_TTS = False
    logger.info("google-cloud-texttospeech not installed locally. Web Speech API fallback active.")

# Check for google-generativeai SDK
try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False


# Canonical voice mapping for Indian linguistic accents
VOICE_MAPPING = {
    "en": {"language_code": "en-IN", "name": "en-IN-Wavenet-D", "ssml_gender": "NEUTRAL"},
    "hi": {"language_code": "hi-IN", "name": "hi-IN-Wavenet-A", "ssml_gender": "FEMALE"},
    "te": {"language_code": "te-IN", "name": "te-IN-Standard-A", "ssml_gender": "FEMALE"},
    "kn": {"language_code": "kn-IN", "name": "kn-IN-Standard-A", "ssml_gender": "FEMALE"},
    "ta": {"language_code": "ta-IN", "name": "ta-IN-Standard-A", "ssml_gender": "FEMALE"},
    "ml": {"language_code": "ml-IN", "name": "ml-IN-Standard-A", "ssml_gender": "FEMALE"},
}


class VernacularService:
    """
    Multilingual advisory generator & Text-to-Speech synthesis service.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self._tts_client = None
        self._genai_model = None

        # Initialize Gemini for translation if credentials exist
        if HAS_GENAI and self.api_key and self.api_key not in ("your_gemini_api_key_here", "mock_key"):
            candidate_models = [settings.GEMINI_MODEL, "gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-2.0-flash-lite", "gemini-1.5-flash"]
            for cand in candidate_models:
                try:
                    genai.configure(api_key=self.api_key)
                    self._genai_model = genai.GenerativeModel(
                        model_name=cand,
                        system_instruction=VERNACULAR_TRANSLATION_SYSTEM_PROMPT,
                        generation_config={
                            "temperature": 0.2,
                            "top_p": 0.9,
                            "response_mime_type": "application/json"
                        }
                    )
                    break
                except Exception as e:
                    logger.warning(f"Could not initialize Gemini for translation with model {cand}: {e}")

        # Initialize GCP Text-to-Speech if credentials exist
        if HAS_GCP_TTS and settings.GOOGLE_APPLICATION_CREDENTIALS:
            try:
                self._tts_client = texttospeech.TextToSpeechClient()
                logger.info("Google Cloud Text-to-Speech client initialized.")
            except Exception as e:
                logger.warning(f"Could not initialize Google Cloud TTS client: {e}")

    def generate_advisories(
        self,
        source_classification: str,
        severity_score: float,
        city_name: str = "Delhi-NCR",
        detected_markers: Optional[list] = None
    ) -> VernacularAdvisories:
        """
        Synthesizes localized public health advisories across all 6 Indian languages.
        """
        # If Gemini is available, generate dynamically
        if self._genai_model:
            try:
                prompt = build_vernacular_prompt(
                    source_classification=source_classification,
                    severity_score=severity_score,
                    city_name=city_name,
                    detected_markers=detected_markers
                )
                response = self._genai_model.generate_content(prompt)
                if response and response.text:
                    parsed = self._clean_json(response.text)
                    return VernacularAdvisories(**parsed)
            except Exception as e:
                logger.warning(f"Gemini live translation failed: {e}. Falling back to pre-compiled advisories.")

        # Fallback to pre-compiled high-quality curated advisories
        return self._get_fallback_advisories(source_classification)

    def synthesize_speech(
        self,
        text: str,
        language_code: str
    ) -> VernacularAudioResponse:
        """
        Synthesizes audio for a single advisory text string.
        Uses Google Cloud TTS if available, else returns metadata for browser Web Speech synthesis.
        """
        lang = language_code.lower()
        if lang not in VOICE_MAPPING:
            lang = "en"

        # Try Google Cloud TTS
        if self._tts_client:
            try:
                voice_cfg = VOICE_MAPPING[lang]
                synthesis_input = texttospeech.SynthesisInput(text=text)
                voice = texttospeech.VoiceSelectionParams(
                    language_code=voice_cfg["language_code"],
                    name=voice_cfg["name"]
                )
                audio_config = texttospeech.AudioConfig(
                    audio_encoding=texttospeech.AudioEncoding.MP3,
                    speaking_rate=0.95  # Slightly slower for urgent advisory clarity
                )

                response = self._tts_client.synthesize_speech(
                    input=synthesis_input,
                    voice=voice,
                    audio_config=audio_config
                )

                b64_audio = base64.b64encode(response.audio_content).decode("utf-8")
                return VernacularAudioResponse(
                    language_code=lang,
                    text=text,
                    audio_base64=f"data:audio/mp3;base64,{b64_audio}",
                    audio_format="audio/mp3",
                    is_fallback=False
                )
            except Exception as e:
                logger.warning(f"Cloud TTS synthesis failed: {e}. Returning client-side fallback.")

        # Client-side Web Speech fallback
        return VernacularAudioResponse(
            language_code=lang,
            text=text,
            audio_base64=None,
            audio_format="web-speech-api",
            is_fallback=True
        )

    def _get_fallback_advisories(self, source_classification: str) -> VernacularAdvisories:
        """Retrieves verified pre-compiled advisory dictionaries for given classification."""
        payload = SAMPLE_AUDIT_PAYLOADS.get(source_classification)
        if payload and "vernacular_advisories" in payload:
            return VernacularAdvisories(**payload["vernacular_advisories"])

        # Default fallback
        default_payload = SAMPLE_AUDIT_PAYLOADS["OPEN_MUNICIPAL_WASTE_BURNING"]
        return VernacularAdvisories(**default_payload["vernacular_advisories"])

    def _clean_json(self, text: str) -> Dict[str, Any]:
        """Strips markdown code fences and returns parsed dict."""
        clean = re.sub(r"^```(?:json)?\s*", "", text.strip(), flags=re.MULTILINE)
        clean = re.sub(r"\s*```$", "", clean, flags=re.MULTILINE).strip()
        start = clean.find("{")
        end = clean.rfind("}")
        if start != -1 and end != -1:
            clean = clean[start:end + 1]
        return json.loads(clean)


# Global singleton instance
vernacular_service = VernacularService()
