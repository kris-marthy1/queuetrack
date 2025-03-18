import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://queuetrack.vercel.app";

  return [
    { url: `${baseUrl}/`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/serviceWindow`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/queuePage`, lastModified: new Date().toISOString() },
  ];
}
