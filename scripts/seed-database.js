/**
 * Script để seed dữ liệu mẫu vào database
 * Chạy: node scripts/seed-database.js
 */

const mysql = require("mysql2/promise");
require("dotenv").config({ path: ".env.local" });

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_NAME || "nasun_paint",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  charset: "utf8mb4",
  timezone: "+07:00",
};

// Base image URL from the original design
const IMG_BASE = "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F";

const SAMPLE_DATA = {
  products: [
    {
      slug: "son-dulux",
      name: "Sơn Dulux",
      category: "Sơn nước",
      price: "Liên hệ",
      description: "Sơn Dulux chính hãng, chất lượng cao, đa dạng màu sắc. Phù hợp cho nội thất và ngoại thất. Bền màu, chống thấm, dễ thi công.",
      thumbnail: `${IMG_BASE}d2bebc07683c9f6c3019ee50f589acb3a713a551.png?generation=1777545030716546&alt=media`,
      images: [
        `${IMG_BASE}d2bebc07683c9f6c3019ee50f589acb3a713a551.png?generation=1777545030716546&alt=media`,
        `${IMG_BASE}e7d250cd1f1e39d2ab8ef8d78d39c43789509bb9.jpg?generation=1777545030662315&alt=media`,
        `${IMG_BASE}37ac5fb801efb95cd460f6045dcd54df3a19203f.jpg?generation=1777545030665669&alt=media`,
      ],
      specs: {
        "Xuất xứ": "Anh Quốc",
        "Loại sơn": "Sơn nước",
        "Ứng dụng": "Nội thất, Ngoại thất",
      },
    },
    {
      slug: "son-jotun",
      name: "Sơn Jotun",
      category: "Sơn chống thấm",
      price: "Liên hệ",
      description: "Sơn Jotun chống thấm cao cấp, bảo vệ công trình khỏi thời tiết khắc nghiệt. Sản phẩm nhập khẩu chính hãng từ Na Uy.",
      thumbnail: `${IMG_BASE}6ab4c27d4d3fa99da9e7042daf15964b5bcd205f.jpg?generation=1777545030655960&alt=media`,
      images: [
        `${IMG_BASE}6ab4c27d4d3fa99da9e7042daf15964b5bcd205f.jpg?generation=1777545030655960&alt=media`,
        `${IMG_BASE}f1f2b14887a0c2b9e3497e86d6eadb61a2fb03fa.jpg?generation=1777545030868159&alt=media`,
      ],
      specs: {
        "Xuất xứ": "Na Uy",
        "Loại sơn": "Sơn chống thấm",
        "Ứng dụng": "Ngoại thất, Mái nhà",
      },
    },
    {
      slug: "son-kova",
      name: "Sơn Kova",
      category: "Sơn nước",
      price: "Liên hệ",
      description: "Sơn Kova thương hiệu Việt, chất lượng quốc tế. Sơn chống thấm, sơn nội thất, ngoại thất đa dạng dòng sản phẩm.",
      thumbnail: `${IMG_BASE}661a15c10c9ed86b73edf7eb17d4642990cc86f4.png?generation=1777545199454855&alt=media`,
      images: [
        `${IMG_BASE}661a15c10c9ed86b73edf7eb17d4642990cc86f4.png?generation=1777545199454855&alt=media`,
        `${IMG_BASE}774ea9010fbe9ca2f453fb3286420a020e258fbe.png?generation=1777545199479168&alt=media`,
      ],
      specs: {
        "Xuất xứ": "Việt Nam",
        "Loại sơn": "Sơn nước, Sơn chống thấm",
        "Ứng dụng": "Nội thất, Ngoại thất",
      },
    },
    {
      slug: "son-nippon",
      name: "Sơn Nippon",
      category: "Sơn nước cao cấp",
      price: "Liên hệ",
      description: "Sơn Nippon chất lượng Nhật Bản, bền màu vượt trội, kháng nấm mốc hiệu quả. Lý tưởng cho khí hậu nhiệt đới.",
      thumbnail: `${IMG_BASE}5fef1a46ece711b9c8fe34c127c7f1240a727283.jpg?generation=1777545199456994&alt=media`,
      images: [
        `${IMG_BASE}5fef1a46ece711b9c8fe34c127c7f1240a727283.jpg?generation=1777545199456994&alt=media`,
        `${IMG_BASE}439848eaac656467136c16a44ae91aa17dec0682.jpg?generation=1777545199464215&alt=media`,
      ],
      specs: {
        "Xuất xứ": "Nhật Bản",
        "Loại sơn": "Sơn nước cao cấp",
        "Ứng dụng": "Nội thất, Ngoại thất",
      },
    },
    {
      slug: "son-esse",
      name: "Sơn Esse",
      category: "Sơn nước",
      price: "Liên hệ",
      description: "Sơn Esse giá tốt, chất lượng ổn định, phù hợp cho các công trình dân dụng. Đa dạng màu sắc theo yêu cầu.",
      thumbnail: `${IMG_BASE}f674c53654e226fd620e2a988869c1376c3f1066.jpg?generation=1777545031253598&alt=media`,
      images: [
        `${IMG_BASE}f674c53654e226fd620e2a988869c1376c3f1066.jpg?generation=1777545031253598&alt=media`,
        `${IMG_BASE}85cd9bb1aecc99871b6716bc66abe0165df2eabd.jpg?generation=1777545199453240&alt=media`,
      ],
      specs: {
        "Xuất xứ": "Việt Nam",
        "Loại sơn": "Sơn nước",
        "Ứng dụng": "Nội thất",
      },
    },
  ],
  
  projects: [
    {
      slug: "chuyen-nhan-sua-chua-nha-tai-ba-ria-vung-tau",
      title: "Chuyên Nhận Sửa Chữa Nhà Tại Bà Rịa Vũng Tàu",
      category: "chung-cu",
      image: `${IMG_BASE}501b139efa8dfd5cec279d32118c4cace0c5909c.jpg?generation=1777545030327700&alt=media`,
      description: "Dự án sửa chữa và sơn lại toàn bộ chung cư tại Bà Rịa Vũng Tàu, hoàn thiện đúng tiến độ.",
    },
    {
      slug: "don-vi-thi-cong-son-nuoc-chuyen-nghiep-tai-vung-tau",
      title: "Đơn Vị Thi Công Sơn Nước Chuyên Nghiệp Tại Vũng Tàu",
      category: "biet-thu",
      image: `${IMG_BASE}dacece20e0cec9d4fbd116290a8c34f2ef603939.jpg?generation=1777545030357214&alt=media`,
      description: "Thi công sơn nước biệt thự cao cấp, hoàn thiện nội ngoại thất chuyên nghiệp.",
    },
  ],
  
  services: [
    {
      slug: "thi-cong-son-nuoc",
      title: "Thi Công Sơn Nước",
      description: "Chuyên thi công sơn nước nội thất và ngoại thất cho mọi loại công trình. Đội ngũ thợ lành nghề, kinh nghiệm nhiều năm.",
      details: "Dịch vụ thi công sơn nước chuyên nghiệp tại Vũng Tàu. Chúng tôi nhận thi công sơn nhà mới, sơn sửa nhà cũ, sơn chung cư, biệt thự, văn phòng...",
      image: `${IMG_BASE}dacece20e0cec9d4fbd116290a8c34f2ef603939.jpg?generation=1777545030357214&alt=media`,
    },
    {
      slug: "son-nha-moi",
      title: "Sơn Nhà Mới",
      description: "Hoàn thiện sơn nhà mới xây, đảm bảo chất lượng bề mặt, màu sắc đồng đều và bền đẹp theo thời gian.",
      details: "Thi công sơn nhà mới với quy trình chuẩn: xử lý bề mặt, bả matit, sơn lót, sơn phủ 2 lớp. Bảo hành công trình.",
      image: `${IMG_BASE}501b139efa8dfd5cec279d32118c4cace0c5909c.jpg?generation=1777545030327700&alt=media`,
    },
  ],
  
  sliders: [
    {
      image: `${IMG_BASE}0081477e131ab91a47682e6ea17e8ef751cf4fba.jpg?generation=1777545030309979&alt=media`,
      alt_text: "Sơn nước Vũng Tàu - NaSun Paint",
    },
    {
      image: `${IMG_BASE}bdd77ab9e1fa1e88cb19af1ceb7c9937bf9c97d7.jpg?generation=1777545030356216&alt=media`,
      alt_text: "Thi công sơn nước chuyên nghiệp tại Vũng Tàu",
    },
  ],
};

async function seedDatabase() {
  let connection;
  
  try {
    console.log("🔌 Kết nối database...");
    connection = await mysql.createConnection(DB_CONFIG);
    console.log("✅ Kết nối thành công!");

    // Clear existing data
    console.log("🧹 Xóa dữ liệu cũ...");
    await connection.execute("DELETE FROM product_specs");
    await connection.execute("DELETE FROM product_images");
    await connection.execute("DELETE FROM products");
    await connection.execute("DELETE FROM projects");
    await connection.execute("DELETE FROM services");
    await connection.execute("DELETE FROM sliders");
    
    // Reset auto increment
    await connection.execute("ALTER TABLE products AUTO_INCREMENT = 1");
    await connection.execute("ALTER TABLE projects AUTO_INCREMENT = 1");
    await connection.execute("ALTER TABLE services AUTO_INCREMENT = 1");
    await connection.execute("ALTER TABLE sliders AUTO_INCREMENT = 1");

    // Seed products
    console.log("📦 Thêm sản phẩm...");
    for (const product of SAMPLE_DATA.products) {
      const [result] = await connection.execute(
        "INSERT INTO products (slug, name, category, price, description, thumbnail, in_stock, sort_order) VALUES (?, ?, ?, ?, ?, ?, 1, ?)",
        [product.slug, product.name, product.category, product.price, product.description, product.thumbnail, 0]
      );
      const productId = result.insertId;

      // Add images
      for (let i = 0; i < product.images.length; i++) {
        await connection.execute(
          "INSERT INTO product_images (product_id, url, alt_text, sort_order) VALUES (?, ?, ?, ?)",
          [productId, product.images[i], product.name, i]
        );
      }

      // Add specs
      let specIndex = 0;
      for (const [key, value] of Object.entries(product.specs)) {
        await connection.execute(
          "INSERT INTO product_specs (product_id, spec_key, spec_value, sort_order) VALUES (?, ?, ?, ?)",
          [productId, key, value, specIndex++]
        );
      }
    }

    // Seed projects
    console.log("🏗️ Thêm công trình...");
    for (let i = 0; i < SAMPLE_DATA.projects.length; i++) {
      const project = SAMPLE_DATA.projects[i];
      await connection.execute(
        "INSERT INTO projects (slug, title, category, image, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
        [project.slug, project.title, project.category, project.image, project.description, i]
      );
    }

    // Seed services
    console.log("🔧 Thêm dịch vụ...");
    for (let i = 0; i < SAMPLE_DATA.services.length; i++) {
      const service = SAMPLE_DATA.services[i];
      await connection.execute(
        "INSERT INTO services (slug, title, description, details, image, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
        [service.slug, service.title, service.description, service.details, service.image, i]
      );
    }

    // Seed sliders
    console.log("🖼️ Thêm slider...");
    for (let i = 0; i < SAMPLE_DATA.sliders.length; i++) {
      const slider = SAMPLE_DATA.sliders[i];
      await connection.execute(
        "INSERT INTO sliders (image, alt_text, is_active, sort_order) VALUES (?, ?, 1, ?)",
        [slider.image, slider.alt_text, i]
      );
    }

    console.log("🎉 Seed database thành công!");
    console.log(`   - ${SAMPLE_DATA.products.length} sản phẩm`);
    console.log(`   - ${SAMPLE_DATA.projects.length} công trình`);
    console.log(`   - ${SAMPLE_DATA.services.length} dịch vụ`);
    console.log(`   - ${SAMPLE_DATA.sliders.length} slider`);

  } catch (error) {
    console.error("❌ Lỗi seed database:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the seed
seedDatabase();