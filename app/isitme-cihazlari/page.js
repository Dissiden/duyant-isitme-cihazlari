import Link from "next/link";

import {
  BatteryCharging,
  Bluetooth,
  CheckCircle2,
  Ear,
  Headphones,
  ShieldCheck,
} from "lucide-react";

import {
  site,
} from "@/lib/site";


export const metadata = {
  title:
    "İşitme Cihazları Antalya",

  description:
    "Antalya Kepez'de RIC, kulak arkası, kanal içi, şarjlı ve pilli işitme cihazı seçenekleri hakkında bilgi alın. Unitron ve Coselgi için DuyAnt'a ulaşın.",

  alternates: {
    canonical:
      "/isitme-cihazlari",
  },

  openGraph: {
    title:
      "İşitme Cihazları Antalya | DuyAnt",

    description:
      "Antalya'da işitme cihazı türleri, Unitron ve Coselgi seçenekleri, şarjlı cihazlar ve cihaz seçimi hakkında bilgi.",

    url:
      `${site.url}/isitme-cihazlari`,

    images: [
      {
        url:
          "/og/duyant-og.jpg",

        width:
          1200,

        height:
          630,

        alt:
          "DuyAnt İşitme Cihazları Antalya",
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
        `${site.url}/isitme-cihazlari/#webpage`,

      url:
        `${site.url}/isitme-cihazlari`,

      name:
        "İşitme Cihazları Antalya",

      description:
        "Antalya'da işitme cihazı türleri, cihaz seçimi, Unitron ve Coselgi seçenekleri hakkında bilgi.",

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
            "İşitme Cihazları",

          item:
            `${site.url}/isitme-cihazlari`,
        },
      ],
    },
  ],
};


export default function Page() {
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

              <Headphones
                size={15}
              />

              Antalya İşitme Cihazları

            </span>


            <h1>
              Antalya'da işitme cihazı türleri ve cihaz seçimi
            </h1>


            <p className="page-lead">
              İşitme cihazı seçimi yalnızca cihazın
              boyutuna veya fiyatına göre yapılmaz.
              İşitme ihtiyacı, günlük dinleme
              ortamları, kulak yapısı, kullanım
              kolaylığı, şarj veya pil tercihi ve
              bağlantı özellikleri birlikte değerlendirilmelidir.
              DuyAnt İşitme Cihazları'nda Unitron ve
              Coselgi cihaz seçenekleri hakkında
              bilgi alabilirsiniz.
            </p>

          </div>


          <div className="cards-3">

            <article className="info-card">

              <Ear
                size={24}
              />

              <h2>
                RIC / RITE İşitme Cihazları
              </h2>

              <p>
                Cihaz gövdesinin kulağın arkasında,
                hoparlörün ise kulak kanalında
                bulunduğu yaygın işitme cihazı
                tasarımlarındandır.
              </p>

            </article>


            <article className="info-card">

              <Headphones
                size={24}
              />

              <h2>
                BTE – Kulak Arkası İşitme Cihazları
              </h2>

              <p>
                Elektronik bölüm kulağın arkasında
                bulunur. Kulak kalıbı veya ince tüp
                gibi farklı uygulama seçenekleriyle
                kullanılabilir.
              </p>

            </article>


            <article
              className="info-card"
              id="kanal-ici"
            >

              <Ear
                size={24}
              />

              <h2>
                Kanal İçi İşitme Cihazları
              </h2>

              <p>
                ITE, ITC ve CIC gibi farklı fiziksel
                tasarım seçenekleri bulunabilir.
                Hangi yapının uygun olduğu kişinin
                ihtiyacına göre değerlendirilir.
              </p>

            </article>

          </div>


          <div className="content-grid">

            <article className="article-card">

              <h2 id="sarjli">
                Şarj edilebilir işitme cihazları
              </h2>


              <p>
                Yeni nesil işitme cihazlarının birçok
                modelinde şarj edilebilir seçenekler
                bulunmaktadır. Şarj sistemi, kullanım
                süresi ve şarj ünitesinin özellikleri
                marka ve modele göre değişebilir.
              </p>


              <p>
                Şarjlı cihazlar özellikle düzenli pil
                değişimiyle uğraşmak istemeyen kullanıcılar
                için kullanım kolaylığı sağlayabilir.
                Bununla birlikte cihaz seçimi yalnızca
                şarj özelliğine göre yapılmamalıdır.
              </p>


              <h2>
                Bluetooth ve telefon bağlantısı
              </h2>


              <p>
                Uyumlu işitme cihazlarında telefon
                görüşmeleri, medya aktarımı ve üreticinin
                mobil uygulaması üzerinden çeşitli kontrol
                özellikleri bulunabilir. Telefon ve cihaz
                uyumluluğu model bazında değerlendirilmelidir.
              </p>


              <h2>
                İşitme cihazı seçerken hangi bilgiler önemlidir?
              </h2>


              <ul>

                <li>
                  Mevcut işitme durumu ve değerlendirme sonuçları
                </li>

                <li>
                  Ev, iş, kalabalık ortam ve telefon gibi günlük kullanım ihtiyaçları
                </li>

                <li>
                  Cihazın fiziksel yapısı ve kullanım kolaylığı
                </li>

                <li>
                  Şarj edilebilir veya pilli cihaz tercihi
                </li>

                <li>
                  Telefon ve Bluetooth bağlantısı ihtiyacı
                </li>

                <li>
                  Tek veya çift cihaz kullanımı
                </li>

              </ul>


              <h2>
                Unitron ve Coselgi işitme cihazları
              </h2>


              <p>
                DuyAnt İşitme Cihazları'nda Unitron
                ve Coselgi marka işitme cihazı
                seçenekleri hakkında bilgi alabilirsiniz.
                Marka içinde de farklı cihaz yapıları
                ve teknoloji seviyeleri bulunabildiğinden
                doğru model kullanım ihtiyacına göre
                değerlendirilmelidir.
              </p>


              <div className="cards-3">

                <article className="info-card">

                  <Headphones
                    size={22}
                  />

                  <h2>
                    Unitron
                  </h2>

                  <p>
                    Unitron işitme cihazı seçenekleri,
                    şarj ve bağlantı özellikleri hakkında
                    bilgi alın.
                  </p>

                  <Link
                    href="/unitron-isitme-cihazlari-antalya"
                    className="text-link"
                  >
                    Unitron İşitme Cihazları Antalya →
                  </Link>

                </article>


                <article className="info-card">

                  <Ear
                    size={22}
                  />

                  <h2>
                    Coselgi
                  </h2>

                  <p>
                    Coselgi işitme cihazlarının model
                    ve teknoloji seçeneklerini inceleyin.
                  </p>

                  <Link
                    href="/coselgi-isitme-cihazlari-antalya"
                    className="text-link"
                  >
                    Coselgi İşitme Cihazları Antalya →
                  </Link>

                </article>


                <article className="info-card">

                  <ShieldCheck
                    size={22}
                  />

                  <h2>
                    Fiyat ve SGK
                  </h2>

                  <p>
                    İşitme cihazı fiyatları ve SGK
                    süreçleri hakkında ayrı rehberlerimizi
                    inceleyin.
                  </p>

                  <Link
                    href="/isitme-cihazi-fiyatlari-antalya"
                    className="text-link"
                  >
                    Antalya fiyat rehberi →
                  </Link>

                </article>

              </div>


              <h2>
                İşitme cihazı fiyatları neye göre değişir?
              </h2>


              <p>
                Cihaz fiyatı; marka ve modelin yanında
                teknoloji seviyesi, tek veya çift cihaz
                kullanımı, fiziksel cihaz tipi, şarj sistemi
                ve bağlantı özelliklerine göre değişebilir.
              </p>


              <Link
                href="/isitme-cihazi-fiyatlari-antalya"
                className="text-link"
              >
                İşitme Cihazı Fiyatları Antalya →
              </Link>


              <h2>
                SGK kapsamında işlem yapılacaksa
              </h2>


              <p>
                Raporlu ve SGK kapsamındaki işlemlerde
                geçerli belge ve güncel uygulamaların
                kontrol edilmesi gerekir.
              </p>


              <Link
                href="/sgk-isitme-cihazi"
                className="text-link"
              >
                SGK İşitme Cihazı Rehberi →
              </Link>

            </article>


            <aside className="side-card">

              <Headphones
                size={25}
              />


              <h3>
                Cihaz seçeneklerini birlikte değerlendirelim
              </h3>


              <p>
                İşitme cihazı türleri, Unitron ve
                Coselgi seçenekleri ve güncel fiyat
                bilgisi için DuyAnt'a ulaşabilirsiniz.
              </p>


              <Link
                className="button primary"
                href="/iletisim#randevu"
              >
                Bilgi / Randevu
              </Link>


              <Link
                href="/isitme-cihazi-fiyatlari-antalya"
                className="text-link"
              >
                İşitme cihazı fiyatları →
              </Link>

            </aside>

          </div>


          <div className="cards-3">

            <article className="info-card">

              <BatteryCharging
                size={23}
              />

              <h2>
                Şarjlı mı Pilli mi?
              </h2>

              <p>
                İki kullanım biçiminin farklarını
                hazırladığımız rehberde inceleyebilirsiniz.
              </p>

              <Link
                href="/blog/sarjli-mi-pilli-mi"
                className="text-link"
              >
                Şarjlı mı pilli mi? →
              </Link>

            </article>


            <article className="info-card">

              <Bluetooth
                size={23}
              />

              <h2>
                Cihaz Seçim Rehberi
              </h2>

              <p>
                İşitme cihazı seçerken değerlendirilmesi
                gereken temel başlıkları okuyun.
              </p>

              <Link
                href="/blog/isitme-cihazi-secerken"
                className="text-link"
              >
                İşitme cihazı seçerken →
              </Link>

            </article>


            <article className="info-card">

              <ShieldCheck
                size={23}
              />

              <h2>
                Kepez / Antalya
              </h2>

              <p>
                DuyAnt mağaza adresi, çalışma
                saatleri ve yol tarifi bilgilerine ulaşın.
              </p>

              <Link
                href="/kepez-isitme-cihazi"
                className="text-link"
              >
                Kepez mağazamız →
              </Link>

            </article>

          </div>

        </div>

      </main>

    </>
  );
}