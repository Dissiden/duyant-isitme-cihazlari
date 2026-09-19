import SeoLandingPage from "@/components/SeoLandingPage";

import {
  site,
} from "@/lib/site";


export const metadata = {
  title:
    "Coselgi İşitme Cihazları Antalya",

  description:
    "Antalya Kepez'de Coselgi işitme cihazları hakkında bilgi alın. Şarjlı, pilli ve bağlantılı cihaz seçenekleri için DuyAnt'a ulaşın.",

  alternates: {
    canonical:
      "/coselgi-isitme-cihazlari-antalya",
  },

  openGraph: {
    title:
      "Coselgi İşitme Cihazları Antalya | DuyAnt",

    description:
      "Antalya'da Coselgi işitme cihazı seçenekleri, şarj, bağlantı ve cihaz yapıları hakkında bilgi.",

    url:
      `${site.url}/coselgi-isitme-cihazlari-antalya`,
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
        `${site.url}/coselgi-isitme-cihazlari-antalya/#webpage`,

      url:
        `${site.url}/coselgi-isitme-cihazlari-antalya`,

      name:
        "Coselgi İşitme Cihazları Antalya",

      inLanguage:
        "tr-TR",

      about: {
        "@id":
          `${site.url}/#business`,
      },

      isPartOf: {
        "@id":
          `${site.url}/#website`,
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
            "Coselgi İşitme Cihazları Antalya",

          item:
            `${site.url}/coselgi-isitme-cihazlari-antalya`,
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


      <SeoLandingPage
        eyebrow="Coselgi Antalya"
        title="Coselgi İşitme Cihazları Antalya"
        intro="DuyAnt İşitme Cihazları'nda Coselgi marka işitme cihazı seçenekleri hakkında bilgi alabilir; cihaz tipi, şarj sistemi, bağlantı özellikleri ve günlük kullanım ihtiyaçlarınızı birlikte değerlendirebilirsiniz."
        answerTitle="Coselgi işitme cihazlarında hangi seçenekler bulunur?"
        answer="Coselgi ürün ailesinde farklı cihaz yapıları, teknoloji seviyeleri ve kullanım özellikleri bulunabilir. Markanın resmi Türkiye ürünlerinde şarj edilebilir ve Bluetooth bağlantılı seçenekler de yer almaktadır. Uygun cihaz kişinin ihtiyacına göre değerlendirilmelidir."
        highlights={[
          {
            title:
              "Şarj Edilebilir Seçenekler",

            text:
              "Coselgi ürün ailesinde lityum iyon şarj altyapısına sahip cihaz seçenekleri bulunabilir.",
          },

          {
            title:
              "Bluetooth Bağlantısı",

            text:
              "Uygun modellerde telefon ve diğer uyumlu cihazlarla bağlantı özellikleri bulunabilir.",
          },

          {
            title:
              "Farklı Teknoloji Seviyeleri",

            text:
              "Coselgi cihazlarında kullanım ve teknoloji ihtiyaçlarına göre farklı performans seviyeleri bulunabilir.",
          },

          {
            title:
              "Ayar ve Kullanım Desteği",

            text:
              "Cihaz seçimi sonrasında programlama, kullanım ve bakım konusunda destek alınabilir.",
          },
        ]}
        sections={[
          {
            title:
              "Coselgi işitme cihazı seçimi",

            paragraphs: [
              "İşitme cihazı seçerken yalnızca cihazın küçük görünmesi veya tek bir teknoloji özelliği yeterli değildir. İşitme ihtiyacı, günlük kullanılan ortamlar, cihazı kullanma kolaylığı, şarj veya pil tercihi ve bağlantı ihtiyacı birlikte değerlendirilmelidir.",

              "Coselgi ürün seçenekleri arasında karar verirken cihazın fiziksel yapısı ve teknoloji seviyesi kişinin kullanım beklentisiyle eşleştirilmelidir.",
            ],
          },

          {
            title:
              "Coselgi şarjlı ve bağlantılı cihaz seçenekleri",

            paragraphs: [
              "Coselgi'nin resmi Türkiye ürün sayfalarında şarj edilebilir ve Bluetooth bağlantılı cihaz örnekleri bulunmaktadır. Örneğin Mojo BTE R D modeli lityum iyon batarya ve Bluetooth bağlantısı sunan bir BTE seçeneği olarak listelenmektedir.",
            ],

            bullets: [
              "Şarj edilebilir model seçenekleri",
              "Uygun cihazlarda Bluetooth bağlantısı",
              "Farklı performans ve teknoloji seviyeleri",
              "Cihaz tipine göre farklı kullanım seçenekleri",
            ],
          },

          {
            title:
              "Coselgi işitme cihazı fiyatları",

            paragraphs: [
              "Coselgi işitme cihazı fiyatları cihazın modeli, teknoloji seviyesi, özellikleri ve tek veya çift cihaz kullanımına göre değişebilir. Güncel model ve fiyat bilgisi için mağazamızla iletişime geçebilirsiniz.",
            ],

            link: {
              href:
                "/isitme-cihazi-fiyatlari-antalya",

              label:
                "Antalya işitme cihazı fiyatları",
            },
          },

          {
            title:
              "Cihaz bakımı ve satış sonrası süreç",

            paragraphs: [
              "İşitme cihazlarında düzenli temizlik, filtre ve sarf malzemesi kontrolü ile gerektiğinde programlama ve ayar yapılması kullanım deneyimi açısından önemlidir. DuyAnt'ta bakım ve teknik destek süreçleri hakkında bilgi alabilirsiniz.",
            ],

            link: {
              href:
                "/isitme-cihazi-bakim-onarim-antalya",

              label:
                "İşitme cihazı bakım ve teknik servis",
            },
          },
        ]}
        faqs={[
          [
            "Coselgi şarjlı işitme cihazı var mı?",

            "Evet. Coselgi'nin resmi ürün ailesinde şarj edilebilir işitme cihazı seçenekleri bulunmaktadır.",
          ],

          [
            "Coselgi cihazlar Bluetooth destekliyor mu?",

            "Bazı Coselgi modellerinde Bluetooth bağlantısı bulunabilir. Bağlantı özelliği ve telefon uyumluluğu model bazında kontrol edilmelidir.",
          ],

          [
            "Coselgi işitme cihazı fiyatları ne kadar?",

            "Fiyat cihaz modeli, teknoloji seviyesi ve tek veya çift kullanım durumuna göre değişebilir. Güncel fiyat için DuyAnt'tan bilgi alabilirsiniz.",
          ],

          [
            "Antalya'da Coselgi cihazları hakkında nereden bilgi alabilirim?",

            "DuyAnt İşitme Cihazları'nın Kepez / Antalya mağazasından Coselgi cihaz seçenekleri hakkında bilgi alabilirsiniz.",
          ],
        ]}
        source={{
          href:
            "https://www.coselgi.com/tr-tr/hearing-aids/",

          label:
            "Coselgi Türkiye resmi ürün sayfası",
        }}
        relatedLinks={[
          {
            title:
              "İşitme Cihazı Fiyatları Antalya",

            text:
              "Fiyatları etkileyen faktörleri öğrenin.",

            href:
              "/isitme-cihazi-fiyatlari-antalya",
          },

          {
            title:
              "Unitron İşitme Cihazları Antalya",

            text:
              "Unitron cihaz seçeneklerini inceleyin.",

            href:
              "/unitron-isitme-cihazlari-antalya",
          },

          {
            title:
              "Kepez İşitme Cihazı",

            text:
              "DuyAnt mağaza ve iletişim bilgileri.",

            href:
              "/kepez-isitme-cihazi",
          },
        ]}
      />

    </>
  );
}