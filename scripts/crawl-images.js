/**
 * Script crawl ảnh từ sonnuocvungtau.com
 * Chạy: node scripts/crawl-images.js
 */

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "../crawled-images");

const IMAGES = [
  // ── SẢN PHẨM ─────────────────────────────────────────────
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/dulux-weathershield-powerflexx-250x250-1.png",
    dest: "products/son-dulux.png",
    name: "Sơn Dulux",
    slug: "son-dulux",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/jota-chong-phai-mau-800x800-1.jpg",
    dest: "products/son-jotun.jpg",
    name: "Sơn Jotun",
    slug: "son-jotun",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/thung-son-gia-da.png",
    dest: "products/son-kova.png",
    name: "Sơn Kova",
    slug: "son-kova",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/2.jpg",
    dest: "products/son-nippon.jpg",
    name: "Sơn Nippon",
    slug: "son-nippon",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/tai-xuong.jpg",
    dest: "products/son-esse.jpg",
    name: "Sơn Esse",
    slug: "son-esse",
  },

  // ── DỊCH VỤ ──────────────────────────────────────────────
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/02/e7c9c891aa8759d90096-600x800.jpg",
    dest: "services/don-vi-thi-cong-son-nuoc.jpg",
    name: "Đơn Vị Thi Công Sơn Nước Chuyên Nghiệp Tại Vũng Tàu",
    slug: "don-vi-thi-cong-son-nuoc-chuyen-nghiep-tai-vung-tau",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/thi-cong-thach-cao-vung-tau2.jpg",
    dest: "services/thi-cong-tran-thach-cao.jpg",
    name: "Thi Công Trần Thạch Cao",
    slug: "thi-cong-tran-thach-cao",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/thi-cong-thach-cao-vung-tau1.jpg",
    dest: "services/thi-cong-tran-thach-cao-2.jpg",
    name: "Chuyên Thi Công Trần Thạch Cao Tại Vũng Tàu",
    slug: "chuyen-thi-cong-tran-thach-cao-tai-vung-tau",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/02/Sua-chua-nha.jpg",
    dest: "services/sua-chua-nha.jpg",
    name: "Chuyên Nhận Sửa Chữa Nhà Tại Bà Rịa Vũng Tàu",
    slug: "chuyen-nhan-sua-chua-nha-tai-ba-ria-vung-tau",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/thi-cong-son-dau-tai-vung-tau-1400x458.jpg",
    dest: "services/thi-cong-son-dau.jpg",
    name: "Chuyên Nhận Thi Công Sơn Dầu Tại Vũng Tàu",
    slug: "thi-cong-son-dau-cho-tuong-tai-vung-tau",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/thi-cong-son-dau-tai-vung-tau5-1.jpg",
    dest: "services/thi-cong-son-dau-2.jpg",
    name: "Chuyên Thi Công Sơn Dầu Tại Vũng Tàu",
    slug: "chuyen-thi-cong-son-dau-tai-vung-tau",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/thi-cong-son-chong-tham-tai-vung-tau-1244x800.png",
    dest: "services/son-chong-tham.png",
    name: "Chuyên Thi Công Sơn Chống Thấm Tại Vũng Tàu",
    slug: "chuyen-thi-cong-son-chong-tham-tai-vung-tau",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/son-chong-tham-tot-va-gia-re-vung-tau2.jpg",
    dest: "services/son-chong-tham-ba-ria.jpg",
    name: "Chuyên Thi Công Sơn Chống Thấm Tại Bà Rịa Vũng Tàu",
    slug: "chuyen-thi-cong-son-chong-tham-tai-ba-ria-vung-tau",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/cung-cap-bot-tret-tuong-tai-vung-tau.jpg",
    dest: "services/bot-tret-tuong.jpg",
    name: "Chuyên Cung Cấp Bột Trét Tường Tại Vũng Tàu",
    slug: "chuyen-thi-cong-bot-tret-tuong-tai-vung-tau",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/thi-cong-son-nuoc-vung-tau5.png",
    dest: "services/thi-cong-son-nuoc.png",
    name: "Chuyên Thi Công Sơn Nước Tại Vũng Tàu",
    slug: "chuyen-thi-cong-son-nuoc-tai-vung-tau",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/phan-phoi-son-nuoc-tai-vung-tau3.jpg",
    dest: "services/cua-hang-phan-phoi.jpg",
    name: "Cửa Hàng Phân Phối Sơn Nước Hoàng Gia Phát Tại Vũng Tàu",
    slug: "cua-hang-phan-phoi-son-nuoc-tai-vung-tau",
  },

  // ── CÔNG TRÌNH ───────────────────────────────────────────
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/02/8b71807c3b7ec820916f-1067x800.jpg",
    dest: "projects/cong-trinh-son-nuoc-uy-tin.jpg",
    name: "Công Trình Thi Công Sơn Nước Uy Tín Nhất Bà Rịa Vũng Tàu",
    slug: "cong-trinh-thi-cong-son-nuoc-uy-tin-nhat-tinh-ba-ria-vung-tau",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/chuyen-thi-cong-son-chong-tham-tai-vung-tau4-730x800.png",
    dest: "projects/cong-trinh-bac-son.png",
    name: "Công Trình Thi Công Chống Thấm Tại Đường Bắc Sơn Vũng Tàu",
    slug: "cong-trinh-thi-cong-tai-117-bac-son-vung-tau",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/thi-cong-son-gia-re-tai-vung-tau5-1067x800.png",
    dest: "projects/cong-trinh-thuy-van.png",
    name: "Công Trình Thi Công Sơn Tại 165 Thùy Vân Vũng Tàu",
    slug: "cong-trinh-thi-cong-son-tai-165-thuy-van-vung-tau",
  },

  // ── TIN TỨC ──────────────────────────────────────────────
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/mau-son-nha-sang-trong-8.jpg",
    dest: "news/mau-son-nha-trang-trong.jpg",
    name: "Màu Sơn Nhà Trang Trọng Và Tinh Tế",
    slug: "mau-son-nha-trang-trong-va-tinh-te",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/thi-cong-son-dau-tai-vung-tau-1400x458.jpg",
    dest: "news/nhung-thong-tin-ve-son-nuoc.jpg",
    name: "Những Thông Tin Về Sơn Nước Không Nên Bỏ Qua",
    slug: "nhung-thong-tin-ve-son-nuoc-khong-nen-bo-qua",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/bai-tin-tuc-2-3-.jpg",
    dest: "news/son-noi-that-ngoai-that.jpg",
    name: "Sự Khác Nhau Giữa Sơn Nội Thất Và Sơn Ngoại Thất",
    slug: "su-khac-nhau-giua-son-noi-that-va-son-ngoai-that",
  },
  {
    url: "https://sonnuocvungtau.com/wp-content/uploads/2021/01/bai-tin-tuc-13-1141x800.jpg",
    dest: "news/4-nguyen-tac-chon-mau-son.jpg",
    name: "4 Nguyên Tắc Khi Chọn Màu Sơn Nội Thất",
    slug: "4-nguyen-tac-khi-chon-mau-son-noi-that",
  },
];

// Tạo thư mục
["products", "services", "projects", "news"].forEach((d) => {
  const p = path.join(OUTPUT_DIR, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

function downloadFile(url, destPath, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error("Too many redirects"));
    const file = fs.createWriteStream(destPath);
    const client = url.startsWith("https") ? https : http;

    const req = client.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return downloadFile(res.headers.location, destPath, redirectCount + 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    });

    req.on("error", (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function main() {
  console.log(`\n📥 Crawl ${IMAGES.length} ảnh từ sonnuocvungtau.com...\n`);
  let ok = 0, fail = 0;
  const results = [];

  for (const img of IMAGES) {
    const destPath = path.join(OUTPUT_DIR, img.dest);
    try {
      await downloadFile(img.url, destPath);
      const size = fs.statSync(destPath).size;
      console.log(`  ✅ ${img.dest} (${(size / 1024).toFixed(1)} KB)`);
      ok++;
      results.push({ ...img, status: "ok" });
    } catch (err) {
      console.log(`  ❌ ${img.dest} — ${err.message}`);
      fail++;
      results.push({ ...img, status: "failed", error: err.message });
    }
  }

  // Tạo README
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "README.md"),
    `# Crawled Images từ sonnuocvungtau.com\n\n` +
    `Tổng: ${IMAGES.length} | ✅ ${ok} | ❌ ${fail}\n\n` +
    `## Cách dùng\n` +
    `Copy các folder \`products/\`, \`services/\`, \`projects/\`, \`news/\` vào:\n` +
    `\`paint-store/public/images/\`\n\n` +
    `## Danh sách ảnh\n\n` +
    results.map((r) =>
      `- **${r.status === "ok" ? "✅" : "❌"}** \`${r.dest}\`\n  - Tên: ${r.name}\n  - Slug: \`${r.slug}\``
    ).join("\n"),
    "utf8"
  );

  // Tạo mapping.json để dùng khi insert DB
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "mapping.json"),
    JSON.stringify(
      results.filter((r) => r.status === "ok").map((r) => ({
        slug: r.slug,
        name: r.name,
        localPath: `/images/${r.dest}`,
        originalUrl: r.url,
      })),
      null, 2
    ),
    "utf8"
  );

  console.log(`\n📊 Kết quả: ✅ ${ok} thành công | ❌ ${fail} thất bại`);
  console.log(`📁 Lưu tại: ${OUTPUT_DIR}`);
  console.log(`\n👉 Tiếp theo:`);
  console.log(`   1. Copy các folder vào paint-store/public/images/`);
  console.log(`   2. Xem mapping.json để biết slug tương ứng với ảnh nào\n`);
}

main().catch(console.error);
