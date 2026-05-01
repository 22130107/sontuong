const mysql = require("mysql2/promise");

async function testConnection() {
  console.log("⏳ Đang kiểm tra kết nối MySQL...\n");

  // Load .env.local manually
  const fs = require("fs");
  const path = require("path");
  const envPath = path.join(__dirname, "../.env.local");

  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          process.env[key] = val;
        }
      }
    }
  }

  const config = {
    host:     process.env.DB_HOST     || "localhost",
    port:     Number(process.env.DB_PORT || 3306),
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME     || "nasun_paint",
  };

  console.log("📋 Cấu hình kết nối:");
  console.log("   Host    :", config.host);
  console.log("   Port    :", config.port);
  console.log("   User    :", config.user);
  console.log("   Database:", config.database);
  console.log("   Password:", config.password ? "***" + config.password.slice(-2) : "(trống)");
  console.log();

  try {
    const conn = await mysql.createConnection(config);

    const [versionRows] = await conn.execute("SELECT VERSION() AS version");
    const [dbRows]      = await conn.execute("SELECT DATABASE() AS db_name");
    const [tableRows]   = await conn.execute("SHOW TABLES");

    console.log("✅ Kết nối thành công!\n");
    console.log("   MySQL version :", versionRows[0].version);
    console.log("   Database      :", dbRows[0].db_name);
    console.log("   Số bảng       :", tableRows.length);

    if (tableRows.length > 0) {
      console.log("\n📦 Danh sách bảng:");
      tableRows.forEach((row) => {
        const tableName = Object.values(row)[0];
        console.log("   -", tableName);
      });
    } else {
      console.log("\n⚠️  Database trống — chưa chạy schema.sql");
      console.log("   Chạy: mysql -u root -p < database/schema.sql");
    }

    await conn.end();
  } catch (err) {
    console.error("❌ Kết nối thất bại!\n");
    console.error("   Lỗi  :", err.message);
    console.error("   Code :", err.code);
    console.log("\n💡 Kiểm tra lại:");
    console.log("   1. MySQL đang chạy chưa?");
    console.log("   2. User/password đúng chưa?");
    console.log("   3. Database 'nasun_paint' đã tạo chưa?");
    console.log("   4. User có quyền truy cập database không?");
    process.exit(1);
  }
}

testConnection();
