# NaSun Paint – Database Design

## Sơ đồ quan hệ (ERD)

```
products ──< product_images   (1 sản phẩm – nhiều ảnh)
products ──< product_specs    (1 sản phẩm – nhiều thông số)
orders   ──< order_items >── products  (đơn hàng – sản phẩm)
```

## Danh sách bảng

| Bảng               | Mô tả                              | Rows dự kiến |
|--------------------|------------------------------------|-------------|
| `products`         | Sản phẩm sơn                       | ~50–200     |
| `product_images`   | Ảnh gallery sản phẩm               | ~200–1000   |
| `product_specs`    | Thông số kỹ thuật                  | ~200–800    |
| `projects`         | Công trình thi công                | ~20–200     |
| `services`         | Dịch vụ cung cấp                   | ~5–20       |
| `news`             | Tin tức / bài viết                 | ~50–500     |
| `orders`           | Đơn đặt hàng / yêu cầu báo giá    | ~100–10000  |
| `order_items`      | Chi tiết sản phẩm trong đơn        | ~200–30000  |
| `contact_messages` | Tin nhắn liên hệ                   | ~50–5000    |
| `admin_users`      | Tài khoản quản trị                 | ~1–10       |
| `settings`         | Cấu hình website                   | ~10–30      |
| `sliders`          | Banner trang chủ                   | ~3–10       |

## Cài đặt

### 1. Tạo database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Tạo user riêng (khuyến nghị)
```sql
CREATE USER 'nasun_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON nasun_paint.* TO 'nasun_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Cấu hình .env
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nasun_paint
DB_USER=nasun_user
DB_PASSWORD=strong_password_here
```

## Giải thích thiết kế

### products
- `slug` UNIQUE — dùng làm URL `/san-pham/[slug]`
- `in_stock` — toggle còn/hết hàng
- `sort_order` — sắp xếp thứ tự hiển thị

### product_images
- Tách riêng để 1 sản phẩm có nhiều ảnh
- `sort_order` — ảnh đầu tiên (sort=0) là ảnh chính

### orders + order_items
- `order_code` — mã đơn dạng `ORD-20240115-001`
- `product_name` trong order_items lưu snapshot tên lúc đặt (tránh mất dữ liệu khi sản phẩm bị sửa/xóa)
- `status` ENUM: pending → confirmed → processing → completed / cancelled

### news
- `FULLTEXT` index trên title + excerpt + content — hỗ trợ tìm kiếm nhanh
- `is_published` — draft/publish workflow

### settings
- Key-value store cho cấu hình động (tên công ty, SĐT, địa chỉ...)
- Admin có thể sửa qua giao diện mà không cần deploy lại
