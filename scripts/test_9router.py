#!/usr/bin/env python3
"""
9Router Diagnostics & Connectivity Test Script.
Kiểm tra kết nối tới 9Router proxy tại http://127.0.0.1:20128/v1.
Thử các model combos có sẵn trong 9Router: gemini, mixed, claude, openAI.
"""
import sys
import json
import urllib.request
import urllib.error

ENDPOINT = "http://127.0.0.1:20128/v1"
API_KEY = "sk-3de32802bddf729c-p3z5m1-7d22f262"

CANDIDATE_MODELS = [
    "gemini",
    "gemini-3.8-flash-high",
    "mixed",
    "claude",
    "openAI",
    "gpt-4o-mini"
]

def test_models():
    print(f"==================================================")
    print(f"      9ROUTER CONNECTIVITY & MODEL TESTER         ")
    print(f"==================================================")
    print(f"Endpoint: {ENDPOINT}")
    print(f"API Key:  {API_KEY[:10]}...{API_KEY[-8:]}\n")

    # 1. Test /models endpoint
    try:
        req = urllib.request.Request(
            f"{ENDPOINT}/models",
            headers={"Authorization": f"Bearer {API_KEY}"}
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            models = [m.get("id") for m in data.get("data", [])]
            print(f"✅ Kết nối 9Router thành công!")
            print(f"📋 Các models tìm thấy ({len(models)}): {', '.join(models[:10])}\n")
    except urllib.error.HTTPError as e:
        print(f"⚠️ /models trả về HTTP {e.code}: {e.read().decode('utf-8')[:200]}")
    except Exception as e:
        print(f"❌ Không kết nối được tới {ENDPOINT}: {e}\n")

    # 2. Test chat completion with candidate models
    print(f">> Đang thử gửi prompt test tới các model combos...")
    success_model = None

    for model_name in CANDIDATE_MODELS:
        payload = {
            "model": model_name,
            "messages": [
                {"role": "user", "content": "Trả lời ngắn gọn: 1 + 1 bằng mấy?"}
            ],
            "max_tokens": 50
        }
        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            f"{ENDPOINT}/chat/completions",
            data=body,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            }
        )

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status == 200:
                    res_json = json.loads(resp.read().decode("utf-8"))
                    answer = res_json.get("choices", [{}])[0].get("message", {}).get("content", "")
                    print(f"  ✅ Model '{model_name}': THÀNH CÔNG! Trả về: \"{answer.strip()}\"")
                    success_model = model_name
                    break
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode("utf-8")[:150]
            print(f"  ❌ Model '{model_name}': Lỗi HTTP {e.code} ({err_msg})")
        except Exception as e:
            print(f"  ❌ Model '{model_name}': Lỗi kết nối ({e})")

    print("\n==================================================")
    if success_model:
        print(f"🎉 Khuyến nghị cấu hình .env: NINEROUTER_MODEL={success_model}")
    else:
        print("💡 Vui lòng đảm bảo 9Router đang chạy (port 20128) với ít nhất 1 connection đang Active.")
    print("==================================================")


if __name__ == "__main__":
    test_models()
