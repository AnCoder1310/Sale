.PHONY: all run backend frontend test eval db-export db-import lint format clean check

# Khởi chạy toàn bộ hệ thống (Full-stack)
all:
	bash run_all.sh

# Khởi chạy Backend FastAPI
backend:
	bash run_backend.sh

run: backend

# Khởi chạy Frontend Next.js
frontend:
	bash run_frontend.sh

# Chạy kiểm thử tự động toàn diện
test:
	python3 -m pytest tests/ -v

# Chạy hệ thống đánh giá Benchmark tốt nghiệp
eval:
	python3 -m eval.runner

# Xuất cơ sở dữ liệu SQLite ra file SQL
db-export:
	python3 scripts/export_db_sql.py --action export

# Khôi phục cơ sở dữ liệu từ file SQL
db-import:
	python3 scripts/export_db_sql.py --action import

# Kiểm tra mã nguồn
lint:
	python3 -m ruff check src/ tests/

format:
	python3 -m ruff format src/ tests/

check: test eval

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type d -name .pytest_cache -exec rm -rf {} +
	find . -type d -name .ruff_cache -exec rm -rf {} +
