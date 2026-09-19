import HomeClient from "@/components/HomeClient";

import {
  site,
} from "@/lib/site";

import {
  getHomePageSchema,
} from "@/lib/seo-schema";


export const metadata = {
  title:
    "Antalya İşitme Cihazı",

  description:
    "Antalya Kepez'de Unitron ve Coselgi işitme cihazları, fiyat bilgisi, cihaz seçimi, ayar, bakım ve teknik servis desteği için DuyAnt'a ulaşın.",

  alternates: {
    canonical:
      "/",
  },

  openGraph: {
    title:
      "Antalya İşitme Cihazı | DuyAnt İşitme Cihazları",

    description:
      "Antalya Kepez'de Unitron ve Coselgi işitme cihazları, cihaz seçimi, ayar, bakım ve teknik servis hizmetleri.",

    url:
      site.url,

    images: [
      {
        url:
          "/og/duyant-og.jpg",

        width:
          1200,

        height:
          630,

        alt:
          "DuyAnt İşitme Cihazları Antalya Kepez",
      },
    ],
  },
};


export default function HomePage() {
  const schema =
    getHomePageSchema();


  return (
    <>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              schema
            ),
        }}
      />

      <HomeClient />

    </>
  );
}