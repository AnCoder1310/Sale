"""
LLM Client Gateway (Supports 9Router & OpenRouter).
Chương (Platform Lead).
Kết nối với 9Router (http://127.0.0.1:20128/v1) và OpenRouter với fallback tự động thông minh.
"""
import json
import logging
from typing import Any, Dict, List, Optional
import httpx
from src.config import get_settings

logger = logging.getLogger(__name__)

# Danh sách các models/combos ưu tiên thử trong 9Router
NINEROUTER_FALLBACK_MODELS = [
    "gemini",
    "mixed",
    "gemini-3.8-flash-high",
    "claude",
    "openAI",
    "gpt-4o-mini"
]


class LLMClient:
    def __init__(self):
        self.settings = get_settings()

    @property
    def api_key(self) -> str:
        return (
            self.settings.ninerouter_api_key
            or self.settings.openrouter_api_key
            or self.settings.openai_api_key
            or "sk-3de32802bddf729c-p3z5m1-7d22f262"
        )

    @property
    def base_url(self) -> str:
        url = (
            self.settings.ninerouter_base_url
            or self.settings.openrouter_base_url
            or self.settings.openai_base_url
            or "http://127.0.0.1:20128/v1"
        )
        # Thay thế localhost bằng 127.0.0.1 để tránh xung đột IPv6 ::1 trên macOS
        if "localhost:20128" in url:
            url = url.replace("localhost:20128", "127.0.0.1:20128")
        return url.rstrip("/")

    @property
    def default_model(self) -> str:
        return (
            self.settings.ninerouter_model
            or "gemini"
        )

    async def generate_chat_completion(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: int = 1500
    ) -> Optional[str]:
        """Gửi yêu cầu chat completion tới 9Router proxy."""
        key = self.api_key
        base = self.base_url
        temp = temperature if temperature is not None else self.settings.llm_temperature

        full_messages = []
        if system_prompt:
            full_messages.append({"role": "system", "content": system_prompt})
        full_messages.extend(messages)

        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }

        # Tạo danh sách model để thử: model chỉ định -> default_model -> fallback list
        target_models = []
        if model:
            target_models.append(model)
        if self.default_model not in target_models:
            target_models.append(self.default_model)
        for fb in NINEROUTER_FALLBACK_MODELS:
            if fb not in target_models:
                target_models.append(fb)

        for candidate_model in target_models:
            payload = {
                "model": candidate_model,
                "messages": full_messages,
                "temperature": temp,
                "max_tokens": max_tokens
            }

            try:
                async with httpx.AsyncClient(timeout=12.0) as client:
                    response = await client.post(
                        f"{base}/chat/completions",
                        headers=headers,
                        json=payload
                    )
                    if response.status_code == 200:
                        data = response.json()
                        choices = data.get("choices", [])
                        if choices:
                            content = choices[0].get("message", {}).get("content", "")
                            if content and len(content.strip()) > 0:
                                return content
                    else:
                        logger.debug(f"[9Router] Model {candidate_model} returned {response.status_code}: {response.text[:100]}")
            except Exception as e:
                logger.debug(f"[9Router] Notice for model {candidate_model}: {e}")
                # Nếu không kết nối được cổng hoặc môi trường cô lập, dừng loop thử
                break

        return None


openrouter_client = LLMClient()
