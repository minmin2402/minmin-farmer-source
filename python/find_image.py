import cv2
import numpy as np
import sys
import json

def find_image_advanced(target_path, template_path, threshold=0.7, mode="icon"):
    try:
        # 1. Khởi tạo đọc ảnh theo 2 chế độ Tối Ưu Nhất
        if mode == "text":
            # Chế độ Text: Đọc ảnh MÀU (Giữ y nguyên màu cam/xanh/đỏ của nút bấm)
            target_img = cv2.imread(target_path, cv2.IMREAD_COLOR)
            template_img = cv2.imread(template_path, cv2.IMREAD_COLOR)
        else:
            # Chế độ Icon: Đọc ảnh XÁM (Bỏ màu, chỉ lấy nét - Cực nhạy với icon outline/solid)
            target_img = cv2.imread(target_path, cv2.IMREAD_GRAYSCALE)
            template_img = cv2.imread(template_path, cv2.IMREAD_GRAYSCALE)

        if target_img is None or template_img is None:
            print(json.dumps({"success": False, "error": "File không tồn tại"}))
            return

        found = None
        (tgt_H, tgt_W) = target_img.shape[:2]
        (tpl_H, tpl_W) = template_img.shape[:2]

        # 2. Multi-scale matching: CO GIÃN ẢNH MẪU (Bí kíp tối thượng)
        # Thử nghiệm 30 kích thước khác nhau: từ thu nhỏ 5 lần (0.2) đến phóng to gấp đôi (2.0)
        for scale in np.linspace(0.2, 2.0, 30):
            width = int(tpl_W * scale)
            height = int(tpl_H * scale)
            
            # Chặn lỗi vỡ ảnh hoặc ảnh mẫu đem đi ướm lại TO HƠN cả cái màn hình điện thoại
            if width < 10 or height < 10 or width > tgt_W or height > tgt_H:
                continue

            # Resize lại chính cái Ảnh Mẫu của ông
            resized_template = cv2.resize(template_img, (width, height))

            # So khớp
            result = cv2.matchTemplate(target_img, resized_template, cv2.TM_CCOEFF_NORMED)
            (_, maxVal, _, maxLoc) = cv2.minMaxLoc(result)

            if found is None or maxVal > found[0]:
                found = (maxVal, maxLoc, width, height, scale)

        if found is None:
            print(json.dumps({"success": False, "error": "Ảnh mẫu quá to hoặc kích thước không hợp lệ", "conf": 0}))
            return

        (maxVal, maxLoc, found_W, found_H, best_scale) = found

        if maxVal >= threshold:
            # Tọa độ trả về (maxLoc) lúc này chính xác 100% nằm trên màn hình gốc
            # Không cần phải dùng phép chia tọa độ (r) phức tạp như code cũ nữa
            center_x = int(maxLoc[0] + found_W / 2)
            center_y = int(maxLoc[1] + found_H / 2)

            print(json.dumps({
                "success": True, 
                "x": center_x, 
                "y": center_y, 
                "confidence": round(float(maxVal), 2), 
                "scale_found": round(float(best_scale), 2)
            }))
        else:
            print(json.dumps({"success": False, "error": "Not found", "conf": round(float(maxVal), 2)}))

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) > 2:
        target = sys.argv[1]
        template = sys.argv[2]
        thresh = float(sys.argv[3]) if len(sys.argv) > 3 else 0.7
        md = sys.argv[4] if len(sys.argv) > 4 else "icon" # Mặc định là icon
        
        find_image_advanced(target, template, thresh, md)