import SeoLandingPage from "@/components/SeoLandingPage";

import {
  site,
} from "@/lib/site";


export const metadata = {
  title:
    "İşitme Cihazı Fiyatları Antalya",

  description:
    "Antalya işitme cihazı fiyatları hakkında bilgi alın. Cihaz teknolojisi, tek veya çift kullanım, şarjlı ve pilli modeller ile fiyatı etkileyen faktörleri DuyAnt'ta öğrenin.",

  alternates: {
    canonical:
      "/isitme-cihazi-fiyatlari-antalya",
  },

  openGraph: {
    title:
      "İşitme Cihazı Fiyatları Antalya | DuyAnt",

    description:
      "Antalya Kepez'de işitme cihazı fiyatları, Unitron ve Coselgi cihaz seçenekleri ve güncel fiyat bilgisi.",

    url:
      `${site.url}/isitme-cihazi-fiyatlari-antalya`,
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
        `${site.url}/isitme-cihazi-fiyatlari-antalya/#webpage`,

      url:
        `${site.url}/isitme-cihazi-fiyatlari-antalya`,

      name:
        "İşitme Cihazı Fiyatları Antalya",

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
            "İşitme Cihazı Fiyatları Antalya",

          item:
            `${site.url}/isitme-cihazi-fiyatlari-antalya`,
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
        eyebrow="Antalya İşitme Cihazı Fiyatları"
        title="İşitme Cihazı Fiyatları Antalya"
        intro="İşitme cihazı fiyatı tek bir rakamdan oluşmaz. Cihazın teknoloji seviyesi, fiziksel yapısı, şarj veya pil sistemi, bağlantı özellikleri ve tek ya da çift cihaz kullanımı fiyatı etkileyebilir."
        answerTitle="Antalya'da işitme cihazı fiyatları neye göre değişir?"
        answer="İşitme cihazı fiyatları marka ve modelin yanında cihazın teknoloji seviyesi, özellikleri, tek veya çift kullanım ihtiyacı ve ürün paketine göre değişebilir. DuyAnt İşitme Cihazları'nda Unitron ve Coselgi cihaz seçenekleri için güncel fiyat bilgisini mağazamızdan veya telefon ve WhatsApp üzerinden alabilirsiniz."
        highlights={[
          {
            title:
              "Tek veya Çift Cihaz",

            text:
              "Tek kulak ve çift kulak kullanımında toplam cihaz sayısı fiyat üzerinde doğrudan etkili olabilir.",
          },

          {
            title:
              "Şarjlı veya Pilli",

            text:
              "Şarj edilebilir ve geleneksel pil kullanan modeller farklı ürün ve aksesuar yapılarına sahip olabilir.",
          },

          {
            title:
              "Teknoloji Seviyesi",

            text:
              "Gürültü yönetimi, bağlantı özellikleri ve farklı dinleme ortamlarına yönelik özellikler modele göre değişebilir.",
          },

          {
            title:
              "SGK / Rapor Süreci",

            text:
              "Raporlu ve SGK kapsamındaki işlemler için güncel süreç ayrıca değerlendirilmelidir.",
          },
        ]}
        sections={[
          {
            title:
              "En ucuz cihaz mı, ihtiyaca uygun cihaz mı?",

            paragraphs: [
              "İşitme cihazı seçerken yalnızca fiyat üzerinden karar vermek doğru bir yaklaşım olmayabilir. Günlük yaşamda hangi ortamlarda zorlanıldığı, telefon kullanımı, şarj tercihi, cihazın fiziksel yapısı ve işitme ihtiyacı birlikte değerlendirilmelidir.",

              "Daha yüksek fiyatlı bir cihaz her kullanıcı için otomatik olarak daha doğru anlamına gelmediği gibi, yalnızca düşük fiyatlı olduğu için seçilen bir cihaz da kişinin beklentilerini karşılamayabilir.",
            ],
          },

          {
            title:
              "Antalya'da fiyat bilgisi alırken hangi bilgileri paylaşmalısınız?",

            paragraphs: [
              "Size daha anlamlı ürün seçenekleri sunulabilmesi için mevcut işitme değerlendirmesi, tek veya çift cihaz ihtiyacı, tercih edilen cihaz yapısı ve günlük kullanım beklentileri önemlidir.",
            ],

            bullets: [
              "Tek cihaz mı çift cihaz mı kullanılacağı",
              "Şarjlı veya pilli cihaz tercihi",
              "Telefon ve Bluetooth bağlantısının önemli olup olmadığı",
              "Kulak arkası, RIC veya kanal içi cihaz tercihi",
              "Raporlu veya raporsuz işlem durumu",
            ],
          },

          {
            title:
              "Unitron ve Coselgi fiyatları",

            paragraphs: [
              "DuyAnt'ta Unitron ve Coselgi işitme cihazı seçenekleri hakkında bilgi alabilirsiniz. Her iki markada da model ve teknoloji seviyesine göre farklı ürün seçenekleri bulunabildiğinden tek bir sabit fiyat vermek yerine güncel cihaz seçeneği üzerinden değerlendirme yapmak daha sağlıklıdır.",
            ],

            link: {
              href:
                "/isitme-cihazlari",

              label:
                "İşitme cihazı türlerini inceleyin",
            },
          },

          {
            title:
              "SGK işitme cihazı desteği fiyatı nasıl etkiler?",

            paragraphs: [
              "SGK ve raporlu işitme cihazı işlemlerinde güncel mevzuat, rapor ve reçete süreci önemlidir. Bu bilgiler zaman içinde değişebildiği için sabit tutar yazmak yerine güncel uygulamayı kontrol etmek gerekir.",
            ],

            link: {
              href:
                "/sgk-isitme-cihazi",

              label:
                "SGK işitme cihazı sayfasına gidin",
            },
          },
        ]}
        faqs={[
          [
            "İşitme cihazı için telefondan fiyat alabilir miyim?",

            "Genel fiyat ve model seçenekleri hakkında telefondan bilgi alabilirsiniz. Uygun cihazın belirlenmesi için ihtiyaçların ayrıca değerlendirilmesi gerekebilir.",
          ],

          [
            "Çift işitme cihazı daha mı pahalıdır?",

            "Çift kullanımda iki cihaz bulunduğu için toplam maliyet tek cihaza göre farklı olacaktır. Toplam fiyat seçilen modellere göre değişir.",
          ],

          [
            "Şarjlı işitme cihazları var mı?",

            "Evet. Unitron ve Coselgi dahil farklı markalarda şarj edilebilir seçenekler bulunabilir.",
          ],

          [
            "İşitme cihazı fiyatı internette neden farklı görünüyor?",

            "Model, teknoloji seviyesi, hizmet paketi, aksesuarlar ve satış sonrası destek gibi unsurlar fiyatları etkileyebilir. Karşılaştırırken aynı ürün ve hizmet kapsamına bakmak önemlidir.",
          ],
        ]}
        relatedLinks={[
          {
            title:
              "Unitron İşitme Cihazları Antalya",

            text:
              "Unitron cihaz seçenekleri ve teknolojileri.",

            href:
              "/unitron-isitme-cihazlari-antalya",
          },

          {
            title:
              "Coselgi İşitme Cihazları Antalya",

            text:
              "Coselgi cihaz seçenekleri hakkında bilgi.",

            href:
              "/coselgi-isitme-cihazlari-antalya",
          },

          {
            title:
              "SGK İşitme Cihazı",

            text:
              "Rapor ve SGK süreci hakkında bilgi.",

            href:
              "/sgk-isitme-cihazi",
          },
        ]}
      />

    </>
  );
}