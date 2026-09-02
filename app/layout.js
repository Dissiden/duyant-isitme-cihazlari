import "./globals.css";
import { site } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Antalya İşitme Cihazı | DuyAnt İşitme Cihazları",
    template: "%s | DuyAnt İşitme Cihazları",
  },
  description:
    "Antalya Kepez DuyAnt İşitme Cihazları. İşitme cihazı seçimi, uygulama, ayar, bakım, teknik destek, pil ve aksesuar bilgileri.",
  applicationName: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: site.url,
    siteName: site.name,
    title: "Antalya İşitme Cihazı | DuyAnt İşitme Cihazları",
    description:
      "Antalya'da işitme cihazı seçimi, uygulama, ayar, bakım ve satış sonrası destek hakkında bilgi alın.",
    images: [
      {
        url: "/og/duyant-og.jpg",
        width: 1200,
        height: 630,
        alt: "DuyAnt İşitme Cihazları Antalya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Antalya İşitme Cihazı | DuyAnt",
    description:
      "DuyAnt İşitme Cihazları Antalya Kepez. İşitme cihazı seçimi, ayar, bakım ve destek.",
    images: ["/og/duyant-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "health",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
