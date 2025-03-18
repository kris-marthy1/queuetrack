import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://yourwebsite.com";

  return [
    { url: `${baseUrl}/`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/serviceWindow`, lastModified: new Date().toISOString() },
    { url: `${baseUrl}/queuePage`, lastModified: new Date().toISOString() },
  ];
}
