import type { MetadataRoute } from "next";

const BASE = "https://devbounty.example";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/bounties`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/leaderboard`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/login`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
