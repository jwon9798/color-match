import { SITE_URL } from "@/lib/siteConfig";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/$/, "");
  const lastModified = new Date();

  return [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/play/single`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/play/marathon-10`, lastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/play/marathon-20`, lastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/guide`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/terms`, lastModified, changeFrequency: "yearly", priority: 0.5 },
  ];
}
