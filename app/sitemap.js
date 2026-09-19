import {
  site,
} from "@/lib/site";


const LAST_MAJOR_UPDATE =
  new Date(
    "2026-09-19T00:00:00+03:00"
  );


export default function sitemap() {
  const routes = [
    "",

    "/isitme-cihazlari",

    "/isitme-cihazi-fiyatlari-antalya",

    "/unitron-isitme-cihazlari-antalya",

    "/coselgi-isitme-cihazlari-antalya",

    "/isitme-cihazi-bakim-onarim-antalya",

    "/sgk-isitme-cihazi",

    "/kepez-isitme-cihazi",

    "/hakkimizda",

    "/iletisim",

    "/blog",

    "/blog/isitme-cihazi-secerken",

    "/blog/sarjli-mi-pilli-mi",
  ];


  return routes.map(
    (route) => ({
      url:
        `${site.url}${route}`,

      lastModified:
        LAST_MAJOR_UPDATE,
    })
  );
}