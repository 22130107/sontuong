import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/gio-hang", "/tim-kiem"],
      },
    ],
    sitemap: "https://example.com/sitemap.xml",
  };
}
