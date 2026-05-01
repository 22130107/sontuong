/**
 * Script tạo password hash cho admin
 * Chạy: node scripts/create-admin.js
 *
 * Sau khi chạy, copy câu SQL in ra và chạy trong MySQL
 */

const bcrypt = require("bcryptjs");

// ── Thay đổi thông tin admin tại đây ──────────────
const ADMIN_USERNAME  = "admin";
const ADMIN_PASSWORD  = "nasun2024";   // ← đổi password mạnh hơn trước khi deploy!
const ADMIN_FULLNAME  = "Quản trị viên";
const ADMIN_EMAIL     = "admin@example.com";
const ADMIN_ROLE      = "superadmin";  // superadmin | admin | editor
// ──────────────────────────────────────────────────

async function main() {
  console.log("⏳ Đang tạo bcrypt hash...\n");

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  console.log("✅ Hash tạo thành công!\n");
  console.log("─".repeat(60));
  console.log("📋 Chạy câu SQL sau trong MySQL:\n");

  const sql = `-- Xóa admin cũ nếu có
DELETE FROM admin_users WHERE username = '${ADMIN_USERNAME}';

-- Tạo admin mới
INSERT INTO admin_users (username, password_hash, full_name, email, role, is_active)
VALUES (
  '${ADMIN_USERNAME}',
  '${hash}',
  '${ADMIN_FULLNAME}',
  '${ADMIN_EMAIL}',
  '${ADMIN_ROLE}',
  1
);

-- Kiểm tra kết quả
SELECT id, username, full_name, email, role, is_active, created_at
FROM admin_users
WHERE username = '${ADMIN_USERNAME}';`;

  console.log(sql);
  console.log("─".repeat(60));
  console.log("\n📌 Thông tin đăng nhập:");
  console.log(`   Username : ${ADMIN_USERNAME}`);
  console.log(`   Password : ${ADMIN_PASSWORD}`);
  console.log(`   Role     : ${ADMIN_ROLE}`);
  console.log("\n⚠️  Nhớ đổi password mạnh hơn trước khi deploy lên production!\n");
}

main().catch(console.error);
