-- ============================================================
--  NaSun Paint – MySQL Database Schema
--  Charset: utf8mb4 (hỗ trợ tiếng Việt + emoji)
-- ============================================================

-- ============================================================
-- 1. PRODUCTS (Sản phẩm)
-- ============================================================
CREATE TABLE products (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  slug        VARCHAR(255)    NOT NULL UNIQUE,
  name        VARCHAR(255)    NOT NULL,
  category    VARCHAR(100)    NOT NULL DEFAULT 'Sơn nước',
  price       VARCHAR(100)    NOT NULL DEFAULT 'Liên hệ',
  description TEXT,
  thumbnail   VARCHAR(500)    NOT NULL,
  in_stock    TINYINT(1)      NOT NULL DEFAULT 1,
  sort_order  SMALLINT        NOT NULL DEFAULT 0,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_slug      (slug),
  INDEX idx_category  (category),
  INDEX idx_in_stock  (in_stock),
  INDEX idx_sort      (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ảnh gallery của sản phẩm (1 sản phẩm – nhiều ảnh)
CREATE TABLE product_images (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  product_id  INT UNSIGNED    NOT NULL,
  url         VARCHAR(500)    NOT NULL,
  alt_text    VARCHAR(255),
  sort_order  SMALLINT        NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX idx_product (product_id),
  CONSTRAINT fk_pi_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- thông số kỹ thuật dạng key-value
CREATE TABLE product_specs (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  product_id  INT UNSIGNED    NOT NULL,
  spec_key    VARCHAR(100)    NOT NULL,
  spec_value  VARCHAR(255)    NOT NULL,
  sort_order  SMALLINT        NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX idx_product (product_id),
  CONSTRAINT fk_ps_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. PROJECTS (Công trình)
-- ============================================================
CREATE TABLE projects (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  slug        VARCHAR(255)    NOT NULL UNIQUE,
  title       VARCHAR(255)    NOT NULL,
  category    ENUM(
                'chung-cu',
                'biet-thu',
                'nha-pho',
                'phong-bep',
                'phong-ngu',
                'phong-tre-em'
              )               NOT NULL DEFAULT 'chung-cu',
  image       VARCHAR(500)    NOT NULL,
  description TEXT,
  sort_order  SMALLINT        NOT NULL DEFAULT 0,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_slug     (slug),
  INDEX idx_category (category),
  INDEX idx_sort     (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. SERVICES (Dịch vụ)
-- ============================================================
CREATE TABLE services (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  slug        VARCHAR(255)    NOT NULL UNIQUE,
  title       VARCHAR(255)    NOT NULL,
  description TEXT            NOT NULL,
  details     LONGTEXT,
  image       VARCHAR(500)    NOT NULL,
  sort_order  SMALLINT        NOT NULL DEFAULT 0,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_slug (slug),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. NEWS (Tin tức / Bài viết)
-- ============================================================
CREATE TABLE news (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  slug         VARCHAR(255)   NOT NULL UNIQUE,
  title        VARCHAR(500)   NOT NULL,
  excerpt      TEXT,
  content      LONGTEXT       NOT NULL,
  image        VARCHAR(500)   NOT NULL,
  category     VARCHAR(100)   NOT NULL DEFAULT 'Tin tức',
  published_at DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_published TINYINT(1)     NOT NULL DEFAULT 1,
  views        INT UNSIGNED   NOT NULL DEFAULT 0,
  created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_slug        (slug),
  INDEX idx_category    (category),
  INDEX idx_published   (is_published, published_at),
  FULLTEXT idx_search   (title, excerpt, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. ORDERS (Đơn đặt hàng / Yêu cầu báo giá)
-- ============================================================
CREATE TABLE orders (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  order_code   VARCHAR(20)    NOT NULL UNIQUE,   -- VD: ORD-20240115-001
  gender       ENUM('anh','chi') NOT NULL DEFAULT 'anh',
  customer_name VARCHAR(255)  NOT NULL,
  phone        VARCHAR(20)    NOT NULL,
  email        VARCHAR(255),
  address      VARCHAR(500),
  note         TEXT,
  total_items  SMALLINT       NOT NULL DEFAULT 0,
  status       ENUM(
                 'pending',    -- chờ xử lý
                 'confirmed',  -- đã xác nhận
                 'processing', -- đang xử lý
                 'completed',  -- hoàn thành
                 'cancelled'   -- đã hủy
               )              NOT NULL DEFAULT 'pending',
  source       ENUM('website','phone','zalo','facebook') NOT NULL DEFAULT 'website',
  created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_order_code (order_code),
  INDEX idx_phone      (phone),
  INDEX idx_status     (status),
  INDEX idx_created    (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- chi tiết sản phẩm trong đơn hàng
CREATE TABLE order_items (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  order_id    INT UNSIGNED    NOT NULL,
  product_id  INT UNSIGNED,                       -- NULL nếu SP đã bị xóa
  product_name VARCHAR(255)   NOT NULL,           -- snapshot tên lúc đặt
  product_slug VARCHAR(255),
  quantity    SMALLINT        NOT NULL DEFAULT 1,
  price_note  VARCHAR(100)    NOT NULL DEFAULT 'Liên hệ',
  PRIMARY KEY (id),
  INDEX idx_order   (order_id),
  INDEX idx_product (product_id),
  CONSTRAINT fk_oi_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_oi_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. CONTACT MESSAGES (Liên hệ / Tư vấn)
-- ============================================================
CREATE TABLE contact_messages (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  name         VARCHAR(255)   NOT NULL,
  phone        VARCHAR(20)    NOT NULL,
  email        VARCHAR(255),
  message      TEXT           NOT NULL,
  is_read      TINYINT(1)     NOT NULL DEFAULT 0,
  replied_at   DATETIME,
  created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_is_read  (is_read),
  INDEX idx_created  (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. ADMIN USERS (Tài khoản quản trị)
-- ============================================================
CREATE TABLE admin_users (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  username     VARCHAR(100)   NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,           -- bcrypt hash
  full_name    VARCHAR(255),
  email        VARCHAR(255)   UNIQUE,
  role         ENUM('superadmin','admin','editor') NOT NULL DEFAULT 'admin',
  is_active    TINYINT(1)     NOT NULL DEFAULT 1,
  last_login   DATETIME,
  created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_username (username),
  INDEX idx_role     (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. SETTINGS (Cấu hình website)
-- ============================================================
CREATE TABLE settings (
  setting_key   VARCHAR(100)  NOT NULL,
  setting_value TEXT,
  description   VARCHAR(255),
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. SLIDERS (Banner trang chủ)
-- ============================================================
CREATE TABLE sliders (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  image       VARCHAR(500)    NOT NULL,
  alt_text    VARCHAR(255)    NOT NULL,
  link_url    VARCHAR(500),
  is_active   TINYINT(1)      NOT NULL DEFAULT 1,
  sort_order  SMALLINT        NOT NULL DEFAULT 0,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA – Dữ liệu mẫu ban đầu
-- ============================================================

-- Admin mặc định (password: nasun2024 – đổi ngay sau khi deploy!)
INSERT INTO admin_users (username, password_hash, full_name, role) VALUES
('admin', '$2b$12$rTW4RvCCptKSCgCMK4D.VePiTbc2jLlU7jEOdm4ZSutMeGTPCM9mC', 'Quản trị viên', 'superadmin');

-- Cấu hình website
INSERT INTO settings (setting_key, setting_value, description) VALUES
('site_name',        'Sơn Mặt Trời Việt NaSun',                    'Tên website'),
('site_url',         'https://example.com',                         'URL website'),
('company_name',     'Công ty TNHH Sơn Mặt Trời Việt NaSun',       'Tên công ty đầy đủ'),
('company_address',  'Địa chỉ công ty, TP Vũng Tàu',               'Địa chỉ'),
('company_phone',    '0xx xxx xxxx',                                'Số điện thoại chính'),
('company_phone2',   '0xx xxx xxxx',                                'Số hỗ trợ kỹ thuật'),
('company_email',    'info@example.com',                            'Email liên hệ'),
('facebook_url',     'https://facebook.com/',                       'Facebook'),
('zalo_url',         'https://zalo.me/',                            'Zalo'),
('google_maps_embed','',                                            'Iframe Google Maps'),
('meta_description', 'Chuyên thi công sơn nước tại Vũng Tàu',      'Meta description mặc định');

-- Sản phẩm mẫu
INSERT INTO products (slug, name, category, price, description, thumbnail, in_stock, sort_order) VALUES
('son-dulux',  'Sơn Dulux',  'Sơn nước',        'Liên hệ', 'Sơn Dulux chính hãng, chất lượng cao, đa dạng màu sắc.', '/images/products/son-dulux.png',  1, 1),
('son-jotun',  'Sơn Jotun',  'Sơn chống thấm',  'Liên hệ', 'Sơn Jotun chống thấm cao cấp từ Na Uy.',                '/images/products/son-jotun.jpg',  1, 2),
('son-kova',   'Sơn Kova',   'Sơn nước',        'Liên hệ', 'Sơn Kova thương hiệu Việt, chất lượng quốc tế.',        '/images/products/son-kova.png',   1, 3),
('son-nippon', 'Sơn Nippon', 'Sơn nước cao cấp','Liên hệ', 'Sơn Nippon chất lượng Nhật Bản, bền màu vượt trội.',    '/images/products/son-nippon.jpg', 1, 4),
('son-esse',   'Sơn Esse',   'Sơn nước',        'Liên hệ', 'Sơn Esse giá tốt, chất lượng ổn định.',                 '/images/products/son-esse.jpg',   1, 5);

-- Thông số kỹ thuật mẫu
INSERT INTO product_specs (product_id, spec_key, spec_value, sort_order) VALUES
(1, 'Xuất xứ',   'Anh Quốc',              1),
(1, 'Loại sơn',  'Sơn nước',              2),
(1, 'Ứng dụng',  'Nội thất, Ngoại thất',  3),
(2, 'Xuất xứ',   'Na Uy',                 1),
(2, 'Loại sơn',  'Sơn chống thấm',        2),
(2, 'Ứng dụng',  'Ngoại thất, Mái nhà',   3),
(3, 'Xuất xứ',   'Việt Nam',              1),
(3, 'Loại sơn',  'Sơn nước, Chống thấm',  2),
(4, 'Xuất xứ',   'Nhật Bản',              1),
(4, 'Loại sơn',  'Sơn nước cao cấp',      2),
(5, 'Xuất xứ',   'Việt Nam',              1),
(5, 'Loại sơn',  'Sơn nước',              2);

-- Dịch vụ mẫu
INSERT INTO services (slug, title, description, details, image, sort_order) VALUES
('thi-cong-son-nuoc',      'Thi Công Sơn Nước',         'Chuyên thi công sơn nước nội thất và ngoại thất.', 'Dịch vụ thi công sơn nước chuyên nghiệp tại Vũng Tàu...', '/images/services/thi-cong-son-nuoc.jpg',      1),
('son-nha-moi',            'Sơn Nhà Mới',               'Hoàn thiện sơn nhà mới xây, đảm bảo chất lượng.',  'Thi công sơn nhà mới với quy trình chuẩn...',             '/images/services/son-nha-moi.jpg',            2),
('son-sua-nha-cu',         'Sơn Sửa Nhà Cũ',            'Làm mới nhà cũ với dịch vụ sơn sửa chuyên nghiệp.','Chuyên xử lý và sơn lại nhà cũ...',                       '/images/services/son-sua-nha-cu.jpg',         3),
('thi-cong-tran-thach-cao','Thi Công Trần Thạch Cao',   'Thiết kế và thi công trần thạch cao các loại.',    'Thi công trần thạch cao theo yêu cầu...',                  '/images/services/tran-thach-cao.jpg',         4),
('xu-ly-tuong-nut-tham-dot','Xử Lý Tường Nứt, Thấm Dột','Chuyên xử lý tường nứt, thấm dột, ố vàng.',       'Sử dụng vật liệu chống thấm cao cấp...',                   '/images/services/xu-ly-tuong-nut.jpg',        5);

-- Công trình mẫu
INSERT INTO projects (slug, title, category, image, description, sort_order) VALUES
('chuyen-nhan-sua-chua-nha-tai-ba-ria-vung-tau', 'Chuyên Nhận Sửa Chữa Nhà Tại Bà Rịa Vũng Tàu', 'chung-cu',    '/images/projects/cong-trinh-1.jpg', 'Dự án sửa chữa và sơn lại toàn bộ chung cư.', 1),
('don-vi-thi-cong-son-nuoc-chuyen-nghiep',        'Đơn Vị Thi Công Sơn Nước Chuyên Nghiệp',        'biet-thu',    '/images/projects/cong-trinh-2.jpg', 'Thi công sơn nước biệt thự cao cấp.',          2),
('thi-cong-son-nha-pho-vung-tau',                 'Thi Công Sơn Nhà Phố Vũng Tàu',                 'nha-pho',     '/images/projects/cong-trinh-3.jpg', 'Thi công sơn nhà phố, hoàn thiện nội ngoại.',  3),
('thi-cong-tran-thach-cao-phong-bep',             'Thi Công Trần Thạch Cao Phòng Bếp',             'phong-bep',   '/images/projects/cong-trinh-4.jpg', 'Thi công trần thạch cao phòng bếp hiện đại.',  4),
('son-phong-ngu-dep-vung-tau',                    'Sơn Phòng Ngủ Đẹp Tại Vũng Tàu',               'phong-ngu',   '/images/projects/cong-trinh-5.jpg', 'Sơn phòng ngủ với màu sắc nhẹ nhàng.',         5),
('son-phong-tre-em-an-toan',                      'Sơn Phòng Trẻ Em Đẹp, An Toàn',                'phong-tre-em','/images/projects/cong-trinh-6.jpg', 'Sơn phòng trẻ em với màu sắc tươi sáng.',      6);

-- Slider mẫu
INSERT INTO sliders (image, alt_text, is_active, sort_order) VALUES
('/images/sliders/banner-1.jpg', 'Sơn nước Vũng Tàu - NaSun Paint',                    1, 1),
('/images/sliders/banner-2.jpg', 'Thi công sơn nước chuyên nghiệp tại Vũng Tàu',       1, 2),
('/images/sliders/banner-3.jpg', 'Sơn nước chính hãng tại Vũng Tàu - NaSun Paint',     1, 3);
