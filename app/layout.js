import "./globals.css";

import {
  site,
} from "@/lib/site";

import {
  getGlobalSchema,
} from "@/lib/seo-schema";

import SiteChrome from "@/components/SiteChrome";


export const metadata = {
  metadataBase:
    new URL(
      site.url
    ),

  title: {
    default:
      "Antalya İşitme Cihazı | DuyAnt İşitme Cihazları",

    template:
      "%s | DuyAnt İşitme Cihazları",
  },

  description:
    "Antalya Kepez'de Unitron ve Coselgi işitme cihazları, cihaz seçimi, fiyat bilgisi, ayar, bakım ve teknik servis desteği için DuyAnt'a ulaşın.",

  applicationName:
    site.name,

  creator:
    site.name,

  publisher:
    site.name,

  icons: {
    icon:
      "/icon.svg",
  },

  openGraph: {
    type:
      "website",

    locale:
      "tr_TR",

    siteName:
      site.name,

    title:
      "Antalya İşitme Cihazı | DuyAnt İşitme Cihazları",

    description:
      "Antalya Kepez'de işitme cihazı seçimi, fiyat bilgisi, uygulama, ayar, bakım ve satış sonrası destek.",

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

  twitter: {
    card:
      "summary_large_image",

    title:
      "Antalya İşitme Cihazı | DuyAnt İşitme Cihazları",

    description:
      "Antalya Kepez'de işitme cihazı seçimi, fiyat bilgisi, ayar, bakım ve teknik servis desteği.",

    images: [
      "/og/duyant-og.jpg",
    ],
  },

  robots: {
    index:
      true,

    follow:
      true,

    googleBot: {
      index:
        true,

      follow:
        true,

      "max-image-preview":
        "large",

      "max-snippet":
        -1,

      "max-video-preview":
        -1,
    },
  },

  category:
    "health",
};


export default function RootLayout({
  children,
}) {
  const schema =
    getGlobalSchema();


  return (
    <html lang="tr">

      <body>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                schema
              ),
          }}
        />

        <SiteChrome>
          {children}
        </SiteChrome>

      </body>

    </html>
  );
}