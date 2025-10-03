import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.haohuatire.vn"
  const routes = [
    "",
    "/about",
    "/products",
    "/news",
    "/contact",
    
  ]
  const now = new Date().toISOString()
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }))
}



