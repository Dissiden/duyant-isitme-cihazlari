import Link from "next/link";

import {
  Clock3,
  Headphones,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

import {
  site,
} from "@/lib/site";


export const metadata = {
  title:
    "Kepez İşitme Cihazı",

  description:
    "Kepez Göçerler'de DuyAnt İşitme Cihazları. Unitron ve Coselgi cihaz seçenekleri, fiyat bilgisi, SGK, ayar, bakım ve teknik destek için mağazamıza ulaşın.",

  alternates: {
    canonical:
      "/kepez-isitme-cihazi",
  },

  openGraph: {
    title:
      "Kepez İşitme Cihazı | DuyAnt Antalya",

    description:
      "Antalya Kepez Göçerler'deki DuyAnt İşitme Cihazları mağazası, adres, telefon, yol tarifi ve hizmet bilgileri.",

    url:
      `${site.url}/kepez-isitme-cihazi`,

    images: [
      {
        url:
          "/og/duyant-og.jpg",

        width:
          1200,

        height:
          630,

        alt:
          "DuyAnt İşitme Cihazları Kepez Antalya",
      },
    ],
  },
};


const schema = {
  "@context":
    "https://schema.org",

  "@graph": [
    {
      "@type":
        "WebPage",

      "@id":
        `${site.url}/kepez-isitme-cihazi/#webpage`,

      url:
        `${site.url}/kepez-isitme-cihazi`,

      name:
        "Kepez İşitme Cihazı",

      description:
        "DuyAnt İşitme Cihazları Kepez Antalya mağazası ve hizmet bilgileri.",

      inLanguage:
        "tr-TR",

      isPartOf: {
        "@id":
          `${site.url}/#website`,
      },

      about: {
        "@id":
          `${site.url}/#business`,
      },
    },

    {
      "@type":
        "BreadcrumbList",

      itemListElement: [
        {
          "@type":
            "ListItem",

          position:
            1,

          name:
            "Ana Sayfa",

          item:
            site.url,
        },

        {
          "@type":
            "ListItem",

          position:
            2,

          name:
            "Kepez İşitme Cihazı",

          item:
            `${site.url}/kepez-isitme-cihazi`,
        },
      ],
    },
  ],
};


export default function Page() {
  const mapQuery =
    encodeURIComponent(
      site.address
    );


  const mapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;


  const whatsappUrl =
    `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
      "Merhaba DuyAnt, Kepez mağazanız ve işitme cihazları hakkında bilgi almak istiyorum."
    )}`;


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


      <main className="simple-page">

        <div className="container">

          <div className="page-hero">

            <span className="section-kicker">

              <MapPin
                size={15}
              />

              Kepez / Antalya

            </span>


            <h1>
              Kepez İşitme Cihazı – DuyAnt İşitme Cihazları
            </h1>


            <p className="page-lead">
              DuyAnt İşitme Cihazları,
              Antalya'nın Kepez ilçesi Göçerler
              Mahallesi'nde hizmet vermektedir.
              Unitron ve Coselgi işitme cihazları,
              cihaz seçimi, fiyat bilgisi, SGK
              süreçleri, programlama, ayar, bakım
              ve teknik destek hakkında mağazamızdan
              bilgi alabilirsiniz.
            </p>

          </div>


          <div className="cards-3">

            <article className="info-card">

              <Headphones
                size={24}
              />

              <h2>
                İşitme Cihazları
              </h2>

              <p>
                Unitron ve Coselgi marka cihaz
                seçenekleri ile farklı cihaz türleri
                hakkında bilgi alın.
              </p>

              <Link
                href="/isitme-cihazlari"
                className="text-link"
              >
                İşitme cihazlarını incele →
              </Link>

            </article>


            <article className="info-card">

              <ShieldCheck
                size={24}
              />

              <h2>
                SGK ve Raporlu İşlemler
              </h2>

              <p>
                SGK, raporlu ve kurumlu işitme
                cihazı süreçleri hakkında genel
                bilgi alın.
              </p>

              <Link
                href="/sgk-isitme-cihazi"
                className="text-link"
              >
                SGK rehberi →
              </Link>

            </article>


            <article className="info-card">

              <MapPin
                size={24}
              />

              <h2>
                Bakım ve Teknik Destek
              </h2>

              <p>
                İşitme cihazı ayarı, bakım,
                kontrol ve teknik servis süreçleri
                hakkında bilgi alın.
              </p>

              <Link
                href="/isitme-cihazi-bakim-onarim-antalya"
                className="text-link"
              >
                Bakım ve teknik servis →
              </Link>

            </article>

          </div>


          <div className="contact-layout">

            <div className="contact-panel">

              <h2>
                DuyAnt Kepez mağaza bilgileri
              </h2>


              <p>

                <MapPin
                  size={17}
                />

                <strong>
                  Adres:
                </strong>

                {" "}

                {site.address}

              </p>


              <p>

                <Clock3
                  size={17}
                />

                <strong>
                  Çalışma saatleri:
                </strong>

                {" "}

                {site.hours}

              </p>


              <p>

                <Phone
                  size={17}
                />

                <strong>
                  Telefon:
                </strong>

                {" "}

                <a
                  href={
                    `tel:${site.phoneHref}`
                  }
                >
                  {site.phoneDisplay}
                </a>

              </p>


              <div className="hero-actions">

                <a
                  className="button primary"
                  href={
                    `tel:${site.phoneHref}`
                  }
                >

                  <Phone
                    size={17}
                  />

                  DuyAnt'ı Ara

                </a>


                <a
                  className="button whatsapp"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >

                  <MessageCircle
                    size={17}
                  />

                  WhatsApp

                </a>

              </div>


              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Google Haritalar'da yol tarifi →
              </a>

            </div>


            <div className="contact-map">

              <iframe
                title="DuyAnt İşitme Cihazları Kepez Antalya konumu"
                src={
                  `https://www.google.com/maps?q=${mapQuery}&output=embed`
                }
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

            </div>

          </div>


          <div className="content-grid">

            <article className="article-card">

              <h2>
                Kepez'de hangi işitme cihazı hizmetlerini sunuyoruz?
              </h2>


              <p>
                DuyAnt İşitme Cihazları'nda işitme
                cihazı seçimi ve ürün bilgisine ek
                olarak cihaz kullanımı sonrasında
                ayar, bakım ve teknik destek süreçleri
                hakkında da bilgi alabilirsiniz.
              </p>


              <ul>

                <li>
                  İşitme cihazı seçenekleri hakkında bilgilendirme
                </li>

                <li>
                  Unitron ve Coselgi marka cihaz seçenekleri
                </li>

                <li>
                  Şarjlı ve pilli cihaz seçenekleri
                </li>

                <li>
                  Cihaz programlama ve ayar süreçleri
                </li>

                <li>
                  Bakım, kontrol ve teknik servis
                </li>

                <li>
                  Pil, filtre, kubbe ve sarf malzemeleri
                </li>

                <li>
                  SGK ve raporlu işlemler hakkında bilgilendirme
                </li>

              </ul>


              <h2>
                Kepez'de işitme cihazı fiyatları
              </h2>


              <p>
                İşitme cihazı fiyatları cihazın
                marka, model, teknoloji seviyesi,
                şarj sistemi ve tek veya çift cihaz
                kullanımına göre değişebilir.
              </p>


              <Link
                href="/isitme-cihazi-fiyatlari-antalya"
                className="text-link"
              >
                İşitme Cihazı Fiyatları Antalya →
              </Link>


              <h2>
                DuyAnt'ta Unitron ve Coselgi
              </h2>


              <p>
                Mağazamızda Unitron ve Coselgi
                marka işitme cihazı seçenekleri
                hakkında bilgi alabilirsiniz.
              </p>


              <Link
                href="/unitron-isitme-cihazlari-antalya"
                className="text-link"
              >
                Unitron İşitme Cihazları Antalya →
              </Link>


              <br />


              <Link
                href="/coselgi-isitme-cihazlari-antalya"
                className="text-link"
              >
                Coselgi İşitme Cihazları Antalya →
              </Link>

            </article>


            <aside className="side-card">

              <MapPin
                size={25}
              />

              <h3>
                DuyAnt İşitme Cihazları
              </h3>


              <p>
                Göçerler Mahallesi, Kepez / Antalya.
                Cihaz, fiyat, SGK veya bakım hakkında
                bilgi almak için bize ulaşabilirsiniz.
              </p>


              <Link
                className="button primary"
                href="/iletisim"
              >
                İletişim
              </Link>


              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Haritada aç →
              </a>

            </aside>

          </div>

        </div>

      </main>

    </>
  );
}