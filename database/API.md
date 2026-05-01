# NaSun Paint – API Reference

Base URL: `http://localhost:3000/api`

## Authentication
```
POST /api/auth          Login → trả về JWT token
DELETE /api/auth        Logout

Header cho các route cần auth:
Authorization: Bearer <token>
```

## Products
```
GET    /api/products                    Danh sách (public)
GET    /api/products?category=Sơn nước  Lọc theo danh mục
GET    /api/products?search=dulux       Tìm kiếm
GET    /api/products?in_stock=true      Lọc còn hàng
GET    /api/products?page=1&limit=10    Phân trang
GET    /api/products/[id]               Chi tiết (id hoặc slug)
POST   /api/products                    Tạo mới (admin)
PUT    /api/products/[id]               Cập nhật (admin)
DELETE /api/products/[id]               Xóa (admin)
```

## Projects
```
GET    /api/projects                    Danh sách (public)
GET    /api/projects?category=chung-cu  Lọc theo loại
GET    /api/projects/[id]               Chi tiết (id hoặc slug)
POST   /api/projects                    Tạo mới (admin)
PUT    /api/projects/[id]               Cập nhật (admin)
DELETE /api/projects/[id]               Xóa (admin)
```

## Services
```
GET    /api/services        Danh sách (public)
GET    /api/services/[id]   Chi tiết (id hoặc slug)
POST   /api/services        Tạo mới (admin)
PUT    /api/services/[id]   Cập nhật (admin)
DELETE /api/services/[id]   Xóa (admin)
```

## News
```
GET    /api/news                    Danh sách đã publish (public)
GET    /api/news?published=all      Tất cả bài viết (admin)
GET    /api/news/[id]               Chi tiết + tăng views (id hoặc slug)
POST   /api/news                    Tạo mới (admin)
PUT    /api/news/[id]               Cập nhật (admin)
DELETE /api/news/[id]               Xóa (admin)
```

## Orders
```
POST   /api/orders              Đặt hàng (public)
GET    /api/orders              Danh sách đơn hàng (admin)
GET    /api/orders?stats=true   Thống kê đơn hàng (admin)
GET    /api/orders?status=pending  Lọc theo trạng thái
GET    /api/orders/[id]         Chi tiết đơn hàng (admin)
PATCH  /api/orders/[id]         Cập nhật trạng thái (admin)
DELETE /api/orders/[id]         Xóa đơn hàng (admin)
```

## Contact
```
POST /api/contact   Gửi liên hệ (public)
GET  /api/contact   Danh sách tin nhắn (admin)
```

## Settings
```
GET /api/settings   Lấy tất cả cài đặt (public)
PUT /api/settings   Cập nhật cài đặt (admin) — body: { key: value }
```

## Sliders
```
GET  /api/sliders   Danh sách slider active (public)
POST /api/sliders   Tạo slider mới (admin)
```

## Response Format
```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

## Pagination
```json
{
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```
