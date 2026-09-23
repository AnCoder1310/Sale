import json
from typing import Any, Dict, List, Optional
import httpx
from src.config import get_settings

class OpenRouterClient:
    def __init__(self):
        self.settings = get_settings()

    async def generate_chat_completion(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: int = 1500
    ) -> Optional[str]:
        """Send chat completion to OpenRouter API."""
        api_key = self.settings.openrouter_api_key
        if not api_key:
            return None

        base_url = self.settings.openrouter_base_url.rstrip("/")
        selected_model = model or self.settings.openrouter_model
        temp = temperature if temperature is not None else self.settings.llm_temperature

        full_messages = []
        if system_prompt:
            full_messages.append({"role": "system", "content": system_prompt})
        full_messages.extend(messages)

        headers = {
            "Authorization": f"Bearer {api_key}",
            "HTTP-Referer": "https://vinfast-sales-coach.vn",
            "X-Title": "VinFast AI Sales Enablement Coach (VFO2O-20)",
            "Content-Type": "application/json"
        }

        payload = {
            "model": selected_model,
            "messages": full_messages,
            "temperature": temp,
            "max_tokens": max_tokens
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    f"{base_url}/chat/completions",
                    headers=headers,
                    json=payload
                )
                if response.status_code == 200:
                    data = response.json()
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content", "")
                else:
                    print(f"[OpenRouter] Request returned status {response.status_code}: {response.text}")
        except Exception as e:
            # When offline or during local testing without internet
            print(f"[OpenRouter] API call failed (offline or network error): {e}")

        return None

openrouter_client = OpenRouterClient()
