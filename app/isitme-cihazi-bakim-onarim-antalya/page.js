import Link from "next/link";

import {
  BatteryCharging,
  CheckCircle2,
  Settings2,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import {
  site,
} from "@/lib/site";


export const metadata = {
  title:
    "İşitme Cihazı Tamiri ve Bakımı Antalya",

  description:
    "Antalya Kepez'de işitme cihazı tamiri, bakım, temizlik, ayar, filtre, kubbe ve teknik servis süreçleri hakkında DuyAnt'tan bilgi alın.",

  alternates: {
    canonical:
      "/isitme-cihazi-bakim-onarim-antalya",
  },

  openGraph: {
    title:
      "İşitme Cihazı Tamiri ve Bakımı Antalya | DuyAnt",

    description:
      "Antalya'da işitme cihazı bakım, ayar, kontrol ve teknik servis süreçleri hakkında bilgi alın.",

    url:
      `${site.url}/isitme-cihazi-bakim-onarim-antalya`,

    images: [
      {
        url:
          "/og/duyant-og.jpg",

        width:
          1200,

        height:
          630,

        alt:
          "DuyAnt İşitme Cihazı Bakım ve Teknik Servis Antalya",
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
        `${site.url}/isitme-cihazi-bakim-onarim-antalya/#webpage`,

      url:
        `${site.url}/isitme-cihazi-bakim-onarim-antalya`,

      name:
        "İşitme Cihazı Tamiri ve Bakımı Antalya",

      description:
        "Antalya'da işitme cihazı bakım, ayar, kontrol ve teknik servis hizmetleri hakkında bilgi.",

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
            "İşitme Cihazı Bakım ve Teknik Destek",

          item:
            `${site.url}/isitme-cihazi-bakim-onarim-antalya`,
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

              <Wrench
                size={15}
              />

              Antalya Bakım & Teknik Destek

            </span>


            <h1>
              Antalya işitme cihazı tamiri, bakım ve ayar desteği
            </h1>


            <p className="page-lead">
              İşitme cihazında ses azalması, kesinti,
              ötme, filtre veya kubbe problemi, şarj
              sorunu ya da ayar ihtiyacı farklı
              nedenlerden kaynaklanabilir. DuyAnt
              İşitme Cihazları'nda cihazın marka,
              model ve durumu değerlendirilerek uygun
              bakım veya teknik servis süreci hakkında
              bilgi verilir.
            </p>

          </div>


          <div className="cards-3">

            <article className="info-card">

              <Wrench
                size={24}
              />

              <h2>
                Temizlik ve Kontrol
              </h2>

              <p>
                Cihaz gövdesi, ses çıkışı, filtre,
                kubbe ve erişilebilir parçaların
                durumu kontrol edilebilir.
              </p>

            </article>


            <article className="info-card">

              <Settings2
                size={24}
              />

              <h2>
                Ayar ve Programlama
              </h2>

              <p>
                Uyumlu programlanabilir cihazlarda
                kullanım geri bildirimleri ve ihtiyaçlara
                göre ayar süreci değerlendirilebilir.
              </p>

            </article>


            <article className="info-card">

              <BatteryCharging
                size={24}
              />

              <h2>
                Pil, Filtre ve Sarf
              </h2>

              <p>
                Cihaz marka ve modeline uygun pil,
                filtre, kubbe ve bakım ürünleri
                hakkında bilgi alabilirsiniz.
              </p>

            </article>

          </div>


          <div className="content-grid">

            <article className="article-card">

              <h2>
                İşitme cihazı ne zaman kontrol edilmelidir?
              </h2>


              <p>
                Cihazın kullanımında alışılmadık bir
                değişiklik fark edildiğinde öncelikle
                sorunun kaynağının değerlendirilmesi
                gerekir.
              </p>


              <ul>

                <li>
                  Ses seviyesi veya netlikte belirgin değişiklik varsa
                </li>

                <li>
                  Cihaz aralıklı çalışıyor veya ses kesiliyorsa
                </li>

                <li>
                  Cihazda normalden farklı ötme veya geri bildirim oluşuyorsa
                </li>

                <li>
                  Filtre veya kubbe kirlenmiş ya da hasarlı görünüyorsa
                </li>

                <li>
                  Şarj veya pil kullanım süresi belirgin şekilde değiştiyse
                </li>

                <li>
                  Cihazın fiziksel parçasında hasar fark edildiyse
                </li>

              </ul>


              <h2>
                İşitme cihazı tamiri nasıl değerlendirilir?
              </h2>


              <p>
                Her sorun aynı bakım işlemiyle çözülmez.
                Bazı durumlarda filtre veya sarf
                malzemesi değişimi yeterli olabilirken,
                bazı durumlarda cihazın teknik olarak
                daha ayrıntılı incelenmesi gerekebilir.
              </p>


              <p>
                Her arızanın mağaza içinde onarılması
                mümkün olmayabilir. Cihazın durumuna
                göre teknik servis süreci gerekebilir.
                Bu nedenle cihaz görülmeden kesin tamir
                yöntemi veya sonuç vermek doğru değildir.
              </p>


              <h2>
                İşitme cihazı ayarı neden yeniden yapılabilir?
              </h2>


              <p>
                Programlanabilir işitme cihazlarında
                kullanım deneyimi, dinleme ortamları
                veya ihtiyaçlardaki değişiklikler
                doğrultusunda ayarlar tekrar
                değerlendirilebilir.
              </p>


              <h2>
                Evde işitme cihazı bakımı
              </h2>


              <p>
                Cihazın kuru tutulması, üreticinin
                bakım talimatlarına uyulması ve
                uygun olmayan temizlik sıvılarından
                kaçınılması önemlidir. Filtre ve
                benzeri sarf parçalarının kullanım
                durumu düzenli olarak takip edilmelidir.
              </p>


              <h2>
                Unitron ve Coselgi cihazlarında destek
              </h2>


              <p>
                DuyAnt'ta satışını yaptığımız Unitron
                ve Coselgi işitme cihazlarının kullanım,
                ayar ve bakım süreçleri hakkında bilgi
                alabilirsiniz.
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

              <Wrench
                size={25}
              />

              <h3>
                Cihazınızı değerlendirelim
              </h3>


              <p>
                Marka ve model bilgisiyle DuyAnt
                mağazamıza ulaşarak uygun bakım,
                ayar veya teknik servis süreci
                hakkında bilgi alabilirsiniz.
              </p>


              <Link
                className="button primary"
                href="/iletisim"
              >
                İletişime Geç
              </Link>


              <Link
                href="/kepez-isitme-cihazi"
                className="text-link"
              >
                Kepez mağaza ve konum →
              </Link>

            </aside>

          </div>


          <div className="cards-3">

            <article className="info-card">

              <CheckCircle2
                size={22}
              />

              <h2>
                Cihaz Türleri
              </h2>

              <p>
                RIC, BTE, kanal içi ve şarjlı
                cihazlar hakkında bilgi alın.
              </p>

              <Link
                href="/isitme-cihazlari"
                className="text-link"
              >
                İşitme cihazlarını incele →
              </Link>

            </article>


            <article className="info-card">

              <BatteryCharging
                size={22}
              />

              <h2>
                Şarjlı mı Pilli mi?
              </h2>

              <p>
                İki kullanım seçeneğinin farklarını
                rehberimizde inceleyin.
              </p>

              <Link
                href="/blog/sarjli-mi-pilli-mi"
                className="text-link"
              >
                Karşılaştırmayı okuyun →
              </Link>

            </article>


            <article className="info-card">

              <ShieldCheck
                size={22}
              />

              <h2>
                Satış Sonrası Destek
              </h2>

              <p>
                Yeni cihaz seçenekleri ve fiyat
                bilgileri için ilgili sayfayı inceleyin.
              </p>

              <Link
                href="/isitme-cihazi-fiyatlari-antalya"
                className="text-link"
              >
                İşitme cihazı fiyatları →
              </Link>

            </article>

          </div>

        </div>

      </main>

    </>
  );
}