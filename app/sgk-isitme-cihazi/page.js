import Link from "next/link";

import {
  CheckCircle2,
  FileText,
  Headphones,
  ShieldCheck,
} from "lucide-react";

import {
  site,
} from "@/lib/site";


export const metadata = {
  title:
    "SGK İşitme Cihazı Antalya",

  description:
    "Antalya'da SGK işitme cihazı, rapor, reçete ve temin süreci hakkında genel bilgi alın. Raporlu işitme cihazı işlemleri için DuyAnt Kepez'e ulaşın.",

  alternates: {
    canonical:
      "/sgk-isitme-cihazi",
  },

  openGraph: {
    title:
      "SGK İşitme Cihazı Antalya | DuyAnt",

    description:
      "SGK işitme cihazı, raporlu işlemler ve güncel süreç hakkında genel bilgilendirme.",

    url:
      `${site.url}/sgk-isitme-cihazi`,

    images: [
      {
        url:
          "/og/duyant-og.jpg",

        width:
          1200,

        height:
          630,

        alt:
          "DuyAnt SGK İşitme Cihazı Antalya",
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
        `${site.url}/sgk-isitme-cihazi/#webpage`,

      url:
        `${site.url}/sgk-isitme-cihazi`,

      name:
        "SGK İşitme Cihazı Antalya",

      description:
        "SGK işitme cihazı, rapor ve ilgili belge süreçleri hakkında genel bilgilendirme.",

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
            "SGK İşitme Cihazı",

          item:
            `${site.url}/sgk-isitme-cihazi`,
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

              <FileText
                size={15}
              />

              SGK İşitme Cihazı Rehberi

            </span>


            <h1>
              SGK işitme cihazı süreci Antalya
            </h1>


            <p className="page-lead">
              SGK kapsamında işitme cihazı temin
              süreci; mevcut rapor, reçete, ilgili
              sağlık belgeleri ve işlem tarihindeki
              yürürlükte olan uygulamalara göre
              değişebilir. Bu sayfa genel bilgilendirme
              amacı taşır; güncel işlem bilgisi
              belgeler üzerinden kontrol edilmelidir.
            </p>

          </div>


          <div className="cards-3">

            <article className="info-card">

              <FileText
                size={24}
              />

              <h2>
                Rapor ve Belgeler
              </h2>

              <p>
                Mevcut rapor, reçete ve işitme
                değerlendirmesiyle ilgili belgeler
                işlem sürecinin değerlendirilmesinde
                önemlidir.
              </p>

            </article>


            <article className="info-card">

              <Headphones
                size={24}
              />

              <h2>
                Cihaz Seçimi
              </h2>

              <p>
                SGK işleminin yanında kişinin günlük
                kullanımına uygun işitme cihazının
                değerlendirilmesi de ayrı bir adımdır.
              </p>

            </article>


            <article className="info-card">

              <ShieldCheck
                size={24}
              />

              <h2>
                Güncel Kontrol
              </h2>

              <p>
                Ödeme tutarları, belge şartları ve
                temin koşulları değişebileceğinden
                işlem öncesinde güncel durumun kontrol
                edilmesi gerekir.
              </p>

            </article>

          </div>


          <div className="content-grid">

            <article className="article-card">

              <h2>
                SGK işitme cihazı süreci neden kişiden kişiye değişebilir?
              </h2>


              <p>
                İşlem sırasında değerlendirilmesi gereken
                belgeler ve kişinin cihaz ihtiyacı aynı
                olmayabilir. Ayrıca SGK uygulamaları ve
                ödeme koşulları zaman içinde değişebilir.
                Bu nedenle internette geçmiş yıllara ait
                tutarları veya şartları güncel bilgi gibi
                değerlendirmemek gerekir.
              </p>


              <h2>
                Mağazaya gelirken hangi belgeleri getirmelisiniz?
              </h2>


              <p>
                Elinizde işitme cihazı işlemiyle ilişkili
                mevcut sağlık belgeleri bulunuyorsa
                bunları yanınızda getirmeniz sürecin
                değerlendirilmesini kolaylaştırabilir.
              </p>


              <ul>

                <li>
                  Mevcut rapor veya ilgili sağlık belgeleri
                </li>

                <li>
                  Varsa reçete bilgileri
                </li>

                <li>
                  Mevcut işitme değerlendirmesi sonuçları
                </li>

                <li>
                  Daha önce kullanılan işitme cihazına ait bilgiler
                </li>

              </ul>


              <h2>
                SGK desteği ile cihaz fiyatı aynı şey değildir
              </h2>


              <p>
                İşitme cihazının toplam satış fiyatı;
                cihazın marka, model ve teknoloji
                özelliklerine bağlıdır. SGK kapsamında
                uygulanabilecek destek veya ödeme süreci
                ise ayrıca değerlendirilir.
              </p>


              <Link
                href="/isitme-cihazi-fiyatlari-antalya"
                className="text-link"
              >
                İşitme Cihazı Fiyatları Antalya →
              </Link>


              <h2>
                Cihaz seçimi nasıl yapılır?
              </h2>


              <p>
                Raporlu işlem yapılması cihazın yalnızca
                belgeye göre seçileceği anlamına gelmez.
                Günlük kullanım ortamı, işitme ihtiyacı,
                cihaz yapısı, şarj veya pil tercihi ve
                bağlantı özellikleri de değerlendirilmelidir.
              </p>


              <Link
                href="/isitme-cihazlari"
                className="text-link"
              >
                İşitme cihazı türlerini inceleyin →
              </Link>


              <h2>
                Önemli bilgilendirme
              </h2>


              <p>
                Bu sayfadaki bilgiler genel bilgilendirme
                amaçlıdır. SGK ödeme tutarları, belge
                gereklilikleri ve temin koşulları
                değişebileceğinden kesin işlem bilgisi
                için yürürlükteki güncel kurallar ve
                mevcut belgeler kontrol edilmelidir.
              </p>

            </article>


            <aside className="side-card">

              <ShieldCheck
                size={25}
              />

              <h3>
                Belgelerinizi birlikte değerlendirelim
              </h3>


              <p>
                Raporlu, raporsuz, kurumlu veya
                kurumsuz işlem durumunuz hakkında
                bilgi almak için DuyAnt İşitme
                Cihazları'na ulaşabilirsiniz.
              </p>


              <Link
                className="button primary"
                href="/iletisim"
              >
                Güncel Bilgi Al
              </Link>


              <Link
                href="/kepez-isitme-cihazi"
                className="text-link"
              >
                Kepez mağaza bilgileri →
              </Link>

            </aside>

          </div>


          <div className="cards-3">

            <article className="info-card">

              <CheckCircle2
                size={22}
              />

              <h2>
                İşitme Cihazı Fiyatları
              </h2>

              <p>
                Cihaz fiyatlarını etkileyen temel
                faktörleri ayrı rehberimizde inceleyin.
              </p>

              <Link
                href="/isitme-cihazi-fiyatlari-antalya"
                className="text-link"
              >
                Fiyat rehberi →
              </Link>

            </article>


            <article className="info-card">

              <Headphones
                size={22}
              />

              <h2>
                Unitron ve Coselgi
              </h2>

              <p>
                DuyAnt'ta bulunan marka seçenekleri
                hakkında ayrıntılı bilgi alın.
              </p>

              <Link
                href="/isitme-cihazlari"
                className="text-link"
              >
                İşitme cihazları →
              </Link>

            </article>


            <article className="info-card">

              <ShieldCheck
                size={22}
              />

              <h2>
                Kepez / Antalya
              </h2>

              <p>
                Adres, çalışma saatleri ve iletişim
                bilgilerimize ulaşın.
              </p>

              <Link
                href="/kepez-isitme-cihazi"
                className="text-link"
              >
                DuyAnt Kepez →
              </Link>

            </article>

          </div>

        </div>

      </main>

    </>
  );
}