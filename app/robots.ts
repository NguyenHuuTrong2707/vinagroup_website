import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const base = "https://www.haohuatire.vn"
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}



