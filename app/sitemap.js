import { site } from "@/lib/site";

export default function sitemap() {
  const routes = [
    "",
    "/isitme-cihazlari",
    "/isitme-cihazi-bakim-onarim-antalya",
    "/sgk-isitme-cihazi",
    "/kepez-isitme-cihazi",
    "/hakkimizda",
    "/iletisim",
    "/blog",
    "/blog/isitme-cihazi-secerken",
    "/blog/sarjli-mi-pilli-mi",
  ];

  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date("2026-09-03"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/isitme-cihazlari" ? 0.9 : 0.7,
  }));
}
