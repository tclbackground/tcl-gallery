import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/my-account/",
        "/checkout/",
        "/cart/",
        "/login/",
        "/signup/",
      ],
    },
    sitemap: "https://www.tclgallery.com/sitemap.xml",
  };
}