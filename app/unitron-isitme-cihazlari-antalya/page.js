import SeoLandingPage from "@/components/SeoLandingPage";

import {
  site,
} from "@/lib/site";


export const metadata = {
  title:
    "Unitron İşitme Cihazları Antalya",

  description:
    "Antalya Kepez'de Unitron işitme cihazları hakkında bilgi alın. Şarj edilebilir, bağlantılı ve farklı cihaz tipi seçeneklerini DuyAnt'ta inceleyin.",

  alternates: {
    canonical:
      "/unitron-isitme-cihazlari-antalya",
  },

  openGraph: {
    title:
      "Unitron İşitme Cihazları Antalya | DuyAnt",

    description:
      "Antalya'da Unitron işitme cihazı seçenekleri, cihaz türleri, şarj ve bağlantı özellikleri hakkında bilgi.",

    url:
      `${site.url}/unitron-isitme-cihazlari-antalya`,
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
        `${site.url}/unitron-isitme-cihazlari-antalya/#webpage`,

      url:
        `${site.url}/unitron-isitme-cihazlari-antalya`,

      name:
        "Unitron İşitme Cihazları Antalya",

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
            "Unitron İşitme Cihazları Antalya",

          item:
            `${site.url}/unitron-isitme-cihazlari-antalya`,
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
        eyebrow="Unitron Antalya"
        title="Unitron İşitme Cihazları Antalya"
        intro="DuyAnt İşitme Cihazları'nda Unitron marka işitme cihazı seçenekleri hakkında bilgi alabilir; kullanım ihtiyacınıza göre cihaz yapısı, şarj sistemi ve bağlantı özelliklerini değerlendirebilirsiniz."
        answerTitle="Unitron işitme cihazlarının hangi seçenekleri bulunur?"
        answer="Unitron'un ürün ailesinde şarj edilebilir ve pilli modeller, RIC, kulak arkası ve kulak içi gibi farklı cihaz yapıları ile uygun modellerde kablosuz bağlantı seçenekleri bulunabilir. Uygun ürün, kişinin işitme ihtiyacı ve günlük kullanım beklentilerine göre değerlendirilmelidir."
        highlights={[
          {
            title:
              "Şarj Edilebilir Modeller",

            text:
              "Unitron ürün ailesinde lityum iyon şarj sistemine sahip işitme cihazı seçenekleri bulunur.",
          },

          {
            title:
              "Kablosuz Bağlantı",

            text:
              "Uygun Unitron modellerinde Bluetooth tabanlı telefon ve medya bağlantısı seçenekleri bulunabilir.",
          },

          {
            title:
              "Farklı Cihaz Yapıları",

            text:
              "RIC, kulak arkası ve kulak içi gibi farklı fiziksel tasarımlar arasından ihtiyaçlara göre değerlendirme yapılabilir.",
          },

          {
            title:
              "Programlama ve Ayar",

            text:
              "Programlanabilir cihazlarda kullanım ihtiyaçlarına göre ayar ve kontrol süreçleri uygulanabilir.",
          },
        ]}
        sections={[
          {
            title:
              "Unitron işitme cihazı seçerken nelere bakılır?",

            paragraphs: [
              "Marka seçimi cihaz kararının yalnızca bir bölümüdür. Kişinin işitme durumu, konuşma anlama ihtiyacı, günlük bulunduğu ortamlar, telefon kullanımı, şarj tercihi ve cihazın fiziksel yapısı birlikte değerlendirilmelidir.",

              "Aynı marka içinde dahi farklı model ve teknoloji seviyeleri bulunabildiği için ürün seçimini yalnızca model ismine göre yapmak yerine kullanım ihtiyacını esas almak daha anlamlıdır.",
            ],
          },

          {
            title:
              "Şarjlı Unitron işitme cihazları",

            paragraphs: [
              "Unitron'un resmi Türkiye ürün ailesinde şarj edilebilir cihaz seçenekleri bulunmaktadır. Bazı modeller ayrıca telefon ve medya bağlantısı gibi kablosuz özellikler sunabilir. Özellikler modele göre değiştiğinden cihaz bazında kontrol edilmelidir.",
            ],

            bullets: [
              "Şarj edilebilir cihaz seçenekleri",
              "Bazı modellerde Bluetooth ve kablosuz bağlantı",
              "Farklı RIC ve BTE cihaz tasarımları",
              "Mobil uygulama destekli modeller",
            ],
          },

          {
            title:
              "Unitron işitme cihazı fiyatları",

            paragraphs: [
              "Unitron işitme cihazı fiyatları seçilen model, teknoloji seviyesi, tek veya çift cihaz kullanımı ve ürün özelliklerine göre değişebilir. Güncel fiyat bilgisi için DuyAnt'la iletişime geçebilirsiniz.",
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
              "Unitron cihazlarda satış sonrası destek",

            paragraphs: [
              "İşitme cihazından verim alınabilmesi yalnızca cihazın satın alınmasıyla bitmez. Kullanım alışkanlığı, programlama, kontrol, temizlik ve bakım süreci de önemlidir. DuyAnt'ta cihaz kullanımı ve satış sonrası süreçler hakkında destek alabilirsiniz.",
            ],

            link: {
              href:
                "/isitme-cihazi-bakim-onarim-antalya",

              label:
                "Bakım ve teknik destek bilgileri",
            },
          },
        ]}
        faqs={[
          [
            "Unitron şarjlı işitme cihazı var mı?",

            "Evet. Unitron'un resmi ürün ailesinde şarj edilebilir işitme cihazı seçenekleri bulunur.",
          ],

          [
            "Unitron cihazlar telefona bağlanabilir mi?",

            "Bazı Unitron modellerinde Bluetooth ve kablosuz bağlantı özellikleri bulunabilir. Telefon uyumluluğu cihaz modeline göre kontrol edilmelidir.",
          ],

          [
            "Unitron işitme cihazı fiyatları ne kadar?",

            "Fiyat seçilen model ve teknoloji seviyesine göre değişir. Güncel seçenekler için DuyAnt'tan fiyat bilgisi alabilirsiniz.",
          ],

          [
            "Antalya'da Unitron işitme cihazı için nereye ulaşabilirim?",

            "DuyAnt İşitme Cihazları'nın Kepez / Antalya mağazasından Unitron cihaz seçenekleri hakkında bilgi alabilirsiniz.",
          ],
        ]}
        source={{
          href:
            "https://www.unitron.com/tr-tr/hearing-solutions/hearing-aids",

          label:
            "Unitron Türkiye resmi işitme cihazı sayfası",
        }}
        relatedLinks={[
          {
            title:
              "İşitme Cihazı Fiyatları Antalya",

            text:
              "Fiyatları etkileyen faktörleri inceleyin.",

            href:
              "/isitme-cihazi-fiyatlari-antalya",
          },

          {
            title:
              "Coselgi İşitme Cihazları Antalya",

            text:
              "Coselgi cihaz seçenekleri hakkında bilgi alın.",

            href:
              "/coselgi-isitme-cihazlari-antalya",
          },

          {
            title:
              "İşitme Cihazları",

            text:
              "Cihaz türleri ve kullanım seçenekleri.",

            href:
              "/isitme-cihazlari",
          },
        ]}
      />

    </>
  );
}