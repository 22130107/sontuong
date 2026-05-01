const https = require("https");

const urls = [
  "https://sonnuocvungtau.com/san-pham/son-dulux/",
  "https://sonnuocvungtau.com/dich-vu/chuyen-thi-cong-son-nuoc-tai-vung-tau/",
  "https://sonnuocvungtau.com/dich-vu/chuyen-thi-cong-tran-thach-cao-tai-vung-tau/",
  "https://sonnuocvungtau.com/dich-vu/cua-hang-phan-phoi-son-nuoc-tai-vung-tau/",
  "https://sonnuocvungtau.com/cong-trinh/cong-trinh-thi-cong-son-tai-165-thuy-van-vung-tau/",
  "https://sonnuocvungtau.com/dich-vu/chuyen-thi-cong-son-chong-tham-tai-ba-ria-vung-tau/",
  "https://sonnuocvungtau.com/dich-vu/thi-cong-son-dau-cho-tuong-tai-vung-tau/",
];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (r) => {
      if (r.statusCode === 301 || r.statusCode === 302) {
        return fetchHtml(r.headers.location).then(resolve).catch(reject);
      }
      let d = "";
      r.on("data", (c) => (d += c));
      r.on("end", () => resolve(d));
    }).on("error", reject);
  });
}

(async () => {
  for (const url of urls) {
    const html = await fetchHtml(url);
    let m = html.match(/pinterest\.com\/pin\/create\/button\/\?.*?media=(https[^&"]+)/);
    if (!m) {
      const ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/);
      if (ogMatch) m = [null, ogMatch[1]];
    }
    const img = m ? decodeURIComponent(m[1]) : "NOT FOUND";
    const slug = url.split("/").filter(Boolean).pop();
    console.log(slug + " =>\n  " + img + "\n");
  }
})();
