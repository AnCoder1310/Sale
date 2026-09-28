#!/usr/bin/env python3
"""
Top-level Evaluation Benchmark Runner.
Chủ quản: Đạt (Data, Knowledge & Evaluation)
Thực thi toàn bộ bộ đánh giá benchmark:
- python3 -m eval.runner
- hoặc: python3 eval/runner.py
"""
import asyncio
import sys
from pathlib import Path

# Ensure root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from eval.report_generator import generate_full_evaluation_report


def main():
    print("================================================================")
    print("   VINFAST AI ENABLEMENT COACH - COMPREHENSIVE BENCHMARK RUNNER ")
    print("================================================================")
    result = asyncio.run(generate_full_evaluation_report())
    print("\nTổng kết trạng thái: ", result["overall_status"])
    if result["overall_status"] != "PASS":
        sys.exit(1)


if __name__ == "__main__":
    main()
