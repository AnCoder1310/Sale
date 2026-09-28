#!/usr/bin/env bash
# ==============================================================================
# VINFAST CAR IMAGES DOWNLOADER
# Tải ảnh thực tế từ các liên kết web đại lý vào frontend/public/vehicles/
# ==============================================================================

set -e

DIR="$(cd "$(dirname "$0")/../frontend/public/vehicles" && pwd)"
mkdir -p "$DIR"

echo "=================================================="
echo "    ĐANG TẢI ẢNH XE VINFAST VÀO THƯ MỤC CỤC BỘ    "
echo "    Thư mục đích: $DIR"
echo "=================================================="

USER_AGENT="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

download() {
    local name="$1"
    local url="$2"
    local dest="$3"
    echo -n ">> Tải ảnh $name..."
    if curl -sL -A "$USER_AGENT" --max-time 15 "$url" -o "$dest" && [ -s "$dest" ]; then
        echo " ✅ Thành công!"
    else
        echo " ⚠️ Không tải được, giữ nguyên vector SVG gốc."
    fi
}

download "VF 3" "https://vinfastgiare.vn/upload/sanpham/vinfast-vf3-mau-hong-phan.jpg" "$DIR/vf-3.jpg"
download "VF Wild" "https://vinfast.vn/wp-content/uploads/2024/01/VinFast-VF-Wild-CES-2024.jpg" "$DIR/vf-wild.jpg"
download "VF 5" "https://vinfast-vn.vn/wp-content/uploads/2023/04/vinfast-vf-5-plus.png" "$DIR/vf-5.png"
download "VF 6" "https://vfsaigon.com.vn/wp-content/uploads/2023/10/vinfast-vf-6.jpg" "$DIR/vf-6.jpg"
download "VF 7" "https://vinfastdienchau.com/wp-content/uploads/2023/11/vinfast-vf-7.jpg" "$DIR/vf-7.jpg"
download "VF 8" "https://banggiavinfast.vn/wp-content/uploads/2022/10/vinfast-vf8-all-new.jpg" "$DIR/vf-8.jpg"
download "VF 9" "https://vinfastgiare.vn/upload/sanpham/vinfast-vf-9-plus-mau-trang.jpg" "$DIR/vf-9.jpg"

echo "=================================================="
echo "🎉 Hoàn tất! Tất cả ảnh đã được tích hợp cục bộ."
echo "=================================================="
