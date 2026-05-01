import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // App Password của Gmail
  },
});

export interface OrderEmailData {
  order_code: string;
  gender: string;
  customer_name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  note?: string | null;
  source?: string;
  items: {
    product_name: string;
    quantity: number;
    price_note?: string;
  }[];
}

export async function sendNewOrderEmail(order: OrderEmailData): Promise<void> {
  const adminEmail = process.env.MAIL_TO || "huynh080104@gmail.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const itemsHtml = order.items
    .map(
      (item, i) => `
      <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"}">
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${item.product_name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right">${item.price_note || "Liên hệ"}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    
    <!-- Header -->
    <div style="background:#1a3a8f;padding:24px 32px">
      <h1 style="margin:0;color:#ffffff;font-size:20px">🛒 Đơn hàng mới</h1>
      <p style="margin:4px 0 0;color:#93c5fd;font-size:14px">Sơn Mặt Trời Việt NaSun</p>
    </div>

    <!-- Order code -->
    <div style="background:#eff6ff;padding:16px 32px;border-bottom:1px solid #dbeafe">
      <p style="margin:0;font-size:14px;color:#1e40af">
        Mã đơn hàng: <strong style="font-size:16px">${order.order_code}</strong>
      </p>
    </div>

    <div style="padding:24px 32px">

      <!-- Thông tin khách hàng -->
      <h2 style="margin:0 0 16px;font-size:16px;color:#111827;border-bottom:2px solid #e5e7eb;padding-bottom:8px">
        👤 Thông tin khách hàng
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151">
        <tr>
          <td style="padding:6px 0;width:140px;color:#6b7280">Họ tên:</td>
          <td style="padding:6px 0"><strong>${order.gender === "chi" ? "Chị" : "Anh"} ${order.customer_name}</strong></td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280">Điện thoại:</td>
          <td style="padding:6px 0"><a href="tel:${order.phone}" style="color:#1a3a8f;font-weight:bold">${order.phone}</a></td>
        </tr>
        ${order.email ? `<tr><td style="padding:6px 0;color:#6b7280">Email:</td><td style="padding:6px 0">${order.email}</td></tr>` : ""}
        ${order.address ? `<tr><td style="padding:6px 0;color:#6b7280">Địa chỉ:</td><td style="padding:6px 0">${order.address}</td></tr>` : ""}
        ${order.note ? `<tr><td style="padding:6px 0;color:#6b7280">Ghi chú:</td><td style="padding:6px 0;color:#dc2626">${order.note}</td></tr>` : ""}
        <tr>
          <td style="padding:6px 0;color:#6b7280">Nguồn:</td>
          <td style="padding:6px 0">${order.source || "website"}</td>
        </tr>
      </table>

      <!-- Sản phẩm -->
      <h2 style="margin:24px 0 16px;font-size:16px;color:#111827;border-bottom:2px solid #e5e7eb;padding-bottom:8px">
        📦 Sản phẩm đặt hàng
      </h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#1a3a8f;color:#ffffff">
            <th style="padding:10px 12px;text-align:left;font-weight:600">Sản phẩm</th>
            <th style="padding:10px 12px;text-align:center;font-weight:600">SL</th>
            <th style="padding:10px 12px;text-align:right;font-weight:600">Giá</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- CTA -->
      <div style="margin-top:24px;text-align:center">
        <a href="${siteUrl}/admin/don-hang"
           style="display:inline-block;background:#1a3a8f;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px">
          Xem đơn hàng trong Admin
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;text-align:center">
      <p style="margin:0;font-size:12px;color:#9ca3af">
        Email tự động từ hệ thống Sơn Mặt Trời Việt NaSun · ${siteUrl}
      </p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"NaSun Paint" <${process.env.MAIL_USER}>`,
    to: adminEmail,
    subject: `[Đơn hàng mới] ${order.order_code} – ${order.gender === "chi" ? "Chị" : "Anh"} ${order.customer_name}`,
    html,
  });
}
