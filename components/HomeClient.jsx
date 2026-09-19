"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Bluetooth,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Ear,
  Headphones,
  MapPin,
  MessageCircle,
  Phone,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wrench,
} from "lucide-react";

import {
  site,
} from "@/lib/site";


const slides = [
  {
    label:
      "DuyAnt İşitme Cihazları Antalya",

    image:
      "/slides/duyant-isitme-cihazi-uygulama.webp",

    alt:
      "DuyAnt İşitme Cihazları Antalya Kepez işitme cihazı uygulaması",
  },

  {
    label:
      "Modern İşitme Cihazları",

    image:
      "/slides/duyant-modern-isitme-cihazi.webp",

    alt:
      "Modern işitme cihazı DuyAnt Antalya",
  },

  {
    label:
      "Şarj Edilebilir İşitme Cihazları",

    image:
      "/slides/duyant-sarjli-isitme-cihazi.webp",

    alt:
      "Şarj edilebilir işitme cihazı Antalya",
  },
];


const deviceTypes = [
  {
    code: "RIC",
    icon: Ear,

    title:
      "Hoparlörü Kanal İçinde",

    sub:
      "RIC / RITE",

    text:
      "Kompakt gövdesi kulağın arkasında bulunur. İnce bağlantı aracılığıyla ses alıcıya iletilir.",
  },

  {
    code: "BTE",
    icon: Headphones,

    title:
      "Kulak Arkası",

    sub:
      "BTE",

    text:
      "Elektronik bölüm kulağın arkasında bulunur. Kulak kalıbı veya ince tüp seçenekleriyle kullanılabilir.",
  },

  {
    code: "CIC",
    icon: Activity,

    title:
      "Kanal İçi",

    sub:
      "ITE / ITC / CIC",

    text:
      "Kulak yapısına göre hazırlanan ve kulağın içine yerleşen kompakt işitme cihazı seçenekleridir.",
  },

  {
    code: "SMART",
    icon: BatteryCharging,

    title:
      "Şarj Edilebilir",

    sub:
      "Yeni Nesil",

    text:
      "Şarj altyapısı ve uygun modellerde telefon bağlantısı gibi teknolojiler sunan işitme cihazlarıdır.",
  },
];


const questions = [
  "Kalabalık ortamlarda konuşmaları takip etmekte zorlanıyor musunuz?",

  "Televizyon veya telefon sesini çevrenizdekilerden daha yüksek kullanıyor musunuz?",

  "İnsanlardan sık sık söylediklerini tekrar etmelerini istiyor musunuz?",

  "Telefon görüşmelerinde bazı kelimeleri kaçırıyor musunuz?",

  "Sesleri duyduğunuz halde bazı konuşmaları anlamakta zorlanıyor musunuz?",
];


const faqs = [
  [
    "Antalya'da işitme cihazı seçerken nelere dikkat edilir?",

    "İşitme durumu, günlük kullanım ortamları, cihazın fiziksel yapısı, kullanım kolaylığı, bağlantı özellikleri ve şarj veya pil tercihi birlikte değerlendirilmelidir.",
  ],

  [
    "İşitme cihazı fiyatları neye göre değişir?",

    "Fiyatlar cihazın teknoloji seviyesi, model yapısı, bağlantı özellikleri, şarj sistemi ve tek veya çift cihaz kullanımına göre değişebilir.",
  ],

  [
    "Unitron ve Coselgi işitme cihazları bulunuyor mu?",

    "DuyAnt İşitme Cihazları'nda Unitron ve Coselgi marka işitme cihazı seçenekleri hakkında bilgi alabilirsiniz.",
  ],

  [
    "SGK ve raporlu işitme cihazı işlemleri hakkında bilgi veriyor musunuz?",

    "SGK, raporlu ve kurumlu işitme cihazı süreçleriyle ilgili güncel uygulamalar hakkında mağazamızdan bilgi alabilirsiniz.",
  ],

  [
    "İşitme cihazı ayarları sonradan değiştirilebilir mi?",

    "Programlanabilir işitme cihazlarının ayarları kullanım deneyimi ve ihtiyaçlara göre tekrar düzenlenebilir.",
  ],

  [
    "İşitme cihazı bakım ve teknik servis hizmeti veriyor musunuz?",

    "Cihaz kontrolü, temizlik, ayar, bakım ve teknik servis süreçleri konusunda destek sağlıyoruz.",
  ],
];


export default function HomeClient() {
  const [
    slideIndex,
    setSlideIndex,
  ] =
    useState(0);


  const [
    answers,
    setAnswers,
  ] =
    useState(
      questions.map(
        () => null
      )
    );


  const [
    openFaq,
    setOpenFaq,
  ] =
    useState(0);


  useEffect(
    () => {
      const id =
        window.setInterval(
          () =>
            setSlideIndex(
              (current) =>
                (
                  current + 1
                ) %
                slides.length
            ),
          6500
        );


      return () =>
        window.clearInterval(
          id
        );
    },
    []
  );


  const slide =
    slides[
      slideIndex
    ];


  const completed =
    answers.every(
      (answer) =>
        answer !== null
    );


  const score =
    answers.filter(
      Boolean
    ).length;


  const result =
    useMemo(
      () => {
        if (!completed) {
          return null;
        }


        if (
          score <= 1
        ) {
          return "Belirgin bir günlük güçlük işareti görünmüyor. Bu kısa kontrol bir işitme testi değildir.";
        }


        if (
          score <= 3
        ) {
          return "İşitmenizi profesyonel olarak değerlendirmek daha net bilgi sağlayabilir.";
        }


        return "Birden fazla günlük dinleme durumunda güçlük bildirdiniz. Profesyonel işitme değerlendirmesi planlamayı düşünebilirsiniz.";
      },
      [
        completed,
        score,
      ]
    );


  const whatsappUrl =
    `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
      "Merhaba DuyAnt, işitme cihazları hakkında bilgi almak istiyorum."
    )}`;


  const mapQuery =
    encodeURIComponent(
      site.address
    );


  return (
    <main>

      <section className="hero-section">

        <div className="container">

          <div className="hero-card">

            <button
              className="slider-arrow left"
              type="button"
              onClick={
                () =>
                  setSlideIndex(
                    (
                      slideIndex -
                      1 +
                      slides.length
                    ) %
                    slides.length
                  )
              }
              aria-label="Önceki görsel"
            >

              <ArrowLeft
                size={19}
              />

            </button>


            <div className="hero-copy">

              <span className="eyebrow">

                <ShieldCheck
                  size={15}
                />

                Antalya Kepez • DuyAnt İşitme Cihazları

              </span>


              <h1>

                Antalya'da İşitme Cihazı

                <span>
                  Seçimi ve Satış Sonrası Destek
                </span>

              </h1>


              <p>
                DuyAnt İşitme Cihazları,
                Kepez / Antalya'da Unitron
                ve Coselgi işitme cihazı
                seçenekleri, cihaz uygulaması,
                programlama, ayar, bakım ve
                teknik destek hizmetleri sunar.
              </p>


              <div className="hero-actions">

                <Link
                  className="button primary"
                  href="/isitme-cihazlari"
                >

                  <Headphones
                    size={18}
                  />

                  İşitme Cihazlarını İncele

                </Link>


                <a
                  className="button whatsapp"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >

                  <MessageCircle
                    size={18}
                  />

                  WhatsApp

                </a>

              </div>


              <div className="trust-row">

                <span>

                  <CheckCircle2
                    size={15}
                  />

                  Unitron & Coselgi

                </span>


                <span>

                  <CheckCircle2
                    size={15}
                  />

                  Ayar & Bakım

                </span>


                <span>

                  <CheckCircle2
                    size={15}
                  />

                  Kepez / Antalya

                </span>

              </div>

            </div>


            <div className="hero-image">

              <Image
                src={
                  slide.image
                }
                alt={
                  slide.alt
                }
                fill
                sizes="(max-width: 900px) 100vw, 55vw"
                priority={
                  slideIndex ===
                  0
                }
              />

            </div>


            <button
              className="slider-arrow right"
              type="button"
              onClick={
                () =>
                  setSlideIndex(
                    (
                      slideIndex +
                      1
                    ) %
                    slides.length
                  )
              }
              aria-label="Sonraki görsel"
            >

              <ArrowRight
                size={19}
              />

            </button>


            <div className="slider-dots">

              {slides.map(
                (
                  item,
                  index
                ) => (

                  <button
                    key={
                      item.image
                    }
                    type="button"
                    className={
                      index ===
                      slideIndex
                        ? "dot active"
                        : "dot"
                    }
                    aria-label={
                      `${item.label} görselini göster`
                    }
                    onClick={
                      () =>
                        setSlideIndex(
                          index
                        )
                    }
                  />

                )
              )}

            </div>

          </div>


          <div className="quick-grid">

            <article className="quick-card">

              <span className="icon-box">
                <Ear size={27} />
              </span>

              <div>

                <h3>
                  İşitme Cihazı Seçimi
                </h3>

                <p>
                  Günlük kullanım ihtiyaçlarınıza uygun cihaz seçeneklerini değerlendirin.
                </p>

              </div>

            </article>


            <article className="quick-card">

              <span className="icon-box">
                <Headphones size={27} />
              </span>

              <div>

                <h3>
                  Unitron & Coselgi
                </h3>

                <p>
                  Antalya'da satışını yaptığımız işitme cihazı markaları hakkında bilgi alın.
                </p>

              </div>

            </article>


            <article className="quick-card">

              <span className="icon-box">
                <Wrench size={27} />
              </span>

              <div>

                <h3>
                  Ayar, Bakım & Teknik Destek
                </h3>

                <p>
                  Cihaz programlama, kontrol, bakım ve satış sonrası kullanım desteği.
                </p>

              </div>

            </article>

          </div>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <div className="section-head">

            <span className="section-kicker">

              <Sparkles
                size={15}
              />

              DuyAnt Antalya

            </span>


            <h2>
              İşitme cihazı konusunda hangi desteğe ihtiyacınız var?
            </h2>


            <p>
              Cihaz seçimi, fiyatlar, SGK işlemleri,
              bakım ve teknik destek hakkında
              ilgili sayfalarımızdan ayrıntılı bilgi alın.
            </p>

          </div>


          <div className="services-grid">

            <article className="service-card">

              <span className="icon-box">

                <Headphones
                  size={23}
                />

              </span>

              <div>

                <h3>
                  Antalya İşitme Cihazları
                </h3>

                <p>
                  RIC, kulak arkası, kanal içi ve şarj edilebilir işitme cihazı türlerini inceleyin.
                </p>

                <Link
                  href="/isitme-cihazlari"
                  className="text-link"
                >
                  İşitme cihazlarını incele →
                </Link>

              </div>

            </article>


            <article className="service-card">

              <span className="icon-box">

                <MessageCircle
                  size={23}
                />

              </span>

              <div>

                <h3>
                  İşitme Cihazı Fiyatları Antalya
                </h3>

                <p>
                  Fiyatı etkileyen cihaz teknolojisi, tek veya çift kullanım ve diğer faktörleri öğrenin.
                </p>

                <Link
                  href="/isitme-cihazi-fiyatlari-antalya"
                  className="text-link"
                >
                  Fiyat bilgilerini incele →
                </Link>

              </div>

            </article>


            <article className="service-card">

              <span className="icon-box">

                <ShieldCheck
                  size={23}
                />

              </span>

              <div>

                <h3>
                  SGK ve Raporlu İşlemler
                </h3>

                <p>
                  SGK, raporlu ve kurumlu işitme cihazı süreçleri hakkında bilgi alın.
                </p>

                <Link
                  href="/sgk-isitme-cihazi"
                  className="text-link"
                >
                  SGK işitme cihazı rehberi →
                </Link>

              </div>

            </article>


            <article className="service-card">

              <span className="icon-box">

                <Wrench
                  size={23}
                />

              </span>

              <div>

                <h3>
                  İşitme Cihazı Bakım ve Tamiri
                </h3>

                <p>
                  Antalya'da cihaz ayarı, bakım, kontrol ve teknik destek süreçleri.
                </p>

                <Link
                  href="/isitme-cihazi-bakim-onarim-antalya"
                  className="text-link"
                >
                  Bakım ve teknik servis →
                </Link>

              </div>

            </article>

          </div>

        </div>

      </section>


      <section className="section soft">

        <div className="container">

          <div className="section-head">

            <span className="section-kicker">

              <Headphones
                size={15}
              />

              DuyAnt'ta İşitme Cihazları

            </span>


            <h2>
              Unitron ve Coselgi işitme cihazları.
            </h2>


            <p>
              İşitme cihazı seçiminde marka,
              teknoloji seviyesi, fiziksel yapı,
              şarj veya pil tercihi ve günlük
              kullanım beklentileri birlikte değerlendirilmelidir.
            </p>

          </div>


          <div className="guide-grid">

            <article className="guide-card">

              <Headphones
                size={25}
              />

              <h3>
                Unitron İşitme Cihazları Antalya
              </h3>

              <p>
                Unitron işitme cihazı seçenekleri,
                şarj edilebilir modeller ve bağlantı
                teknolojileri hakkında bilgi alın.
              </p>

              <Link
                href="/unitron-isitme-cihazlari-antalya"
                className="text-link"
              >
                Unitron cihazlarını incele →
              </Link>

            </article>


            <article className="guide-card">

              <Ear
                size={25}
              />

              <h3>
                Coselgi İşitme Cihazları Antalya
              </h3>

              <p>
                Coselgi işitme cihazlarının
                model, şarj ve bağlantı
                seçeneklerini inceleyin.
              </p>

              <Link
                href="/coselgi-isitme-cihazlari-antalya"
                className="text-link"
              >
                Coselgi cihazlarını incele →
              </Link>

            </article>


            <article className="guide-card">

              <MessageCircle
                size={25}
              />

              <h3>
                İşitme Cihazı Fiyatları
              </h3>

              <p>
                Fiyatların teknoloji, model,
                tek veya çift cihaz ve ürün
                özelliklerine göre neden değiştiğini öğrenin.
              </p>

              <Link
                href="/isitme-cihazi-fiyatlari-antalya"
                className="text-link"
              >
                Antalya fiyat rehberi →
              </Link>

            </article>


            <article className="guide-card">

              <ShieldCheck
                size={25}
              />

              <h3>
                SGK İşitme Cihazı
              </h3>

              <p>
                Rapor, SGK ve kurumlu
                işitme cihazı süreçleriyle
                ilgili bilgilere ulaşın.
              </p>

              <Link
                href="/sgk-isitme-cihazi"
                className="text-link"
              >
                SGK rehberini incele →
              </Link>

            </article>

          </div>

        </div>

      </section>


      <section
        className="section"
        id="kontrol"
      >

        <div className="container check-grid">

          <div className="check-info">

            <span className="section-kicker">

              <CircleHelp size={15} />

              İşitme Farkındalığı

            </span>


            <h2>
              İşitmenizde değişiklik olduğunu nasıl fark edebilirsiniz?
            </h2>


            <p>
              Günlük yaşamda karşılaşılan bazı
              durumlar işitmenizi daha yakından
              değerlendirmek için işaret olabilir.
            </p>


            <div className="sign-list">

              {[
                "Kalabalıkta konuşmaları kaçırmak",
                "Televizyon sesini yükseltmek",
                "Sık sık tekrar istemek",
                "Telefonda kelimeleri kaçırmak",
              ].map(
                (item) => (

                  <span key={item}>

                    <CheckCircle2
                      size={17}
                    />

                    {item}

                  </span>

                )
              )}

            </div>

          </div>


          <div className="quiz-card">

            <div className="quiz-head">

              <strong>
                1 Dakikalık Farkındalık Kontrolü
              </strong>

              <span>
                {
                  answers.filter(
                    (answer) =>
                      answer !== null
                  ).length
                }
                /
                {questions.length}
              </span>

            </div>


            {questions.map(
              (
                question,
                index
              ) => (

                <div
                  className="question"
                  key={question}
                >

                  <div>
                    {question}
                  </div>


                  <div className="answer-buttons">

                    <button
                      type="button"
                      className={
                        answers[index] ===
                        true
                          ? "answer active"
                          : "answer"
                      }
                      onClick={
                        () =>
                          setAnswers(
                            (current) =>
                              current.map(
                                (
                                  value,
                                  itemIndex
                                ) =>
                                  itemIndex ===
                                  index
                                    ? true
                                    : value
                              )
                          )
                      }
                    >
                      Evet
                    </button>


                    <button
                      type="button"
                      className={
                        answers[index] ===
                        false
                          ? "answer active"
                          : "answer"
                      }
                      onClick={
                        () =>
                          setAnswers(
                            (current) =>
                              current.map(
                                (
                                  value,
                                  itemIndex
                                ) =>
                                  itemIndex ===
                                  index
                                    ? false
                                    : value
                              )
                          )
                      }
                    >
                      Hayır
                    </button>

                  </div>

                </div>

              )
            )}


            {result && (

              <div className="result">

                <strong>
                  Sonuç
                </strong>

                <p>
                  {result}
                </p>

                <Link
                  className="button primary small"
                  href="/iletisim#randevu"
                >
                  Bilgi / Randevu
                </Link>

              </div>

            )}


            <small className="disclaimer">
              Bu bölüm genel farkındalık amaçlıdır;
              tıbbi tanı veya işitme testi değildir.
            </small>

          </div>

        </div>

      </section>


      <section
        className="section soft"
        id="cihazlar"
      >

        <div className="container">

          <div className="section-head">

            <span className="section-kicker">

              <Headphones size={15} />

              İşitme Cihazı Türleri

            </span>


            <h2>
              Hangi işitme cihazı türü size uygun olabilir?
            </h2>


            <p>
              İşitme cihazları farklı kullanım
              ihtiyaçlarına göre farklı fiziksel
              yapılara ve teknoloji seçeneklerine sahiptir.
            </p>

          </div>


          <div className="device-grid">

            {deviceTypes.map(
              ({
                code,
                icon: Icon,
                title,
                sub,
                text,
              }) => (

                <article
                  className="device-card"
                  key={code}
                >

                  <span className="device-code">
                    {code}
                  </span>


                  <span className="icon-box">

                    <Icon size={27} />

                  </span>


                  <h3>
                    {title}
                  </h3>


                  <small>
                    {sub}
                  </small>


                  <p>
                    {text}
                  </p>


                  <Link
                    href="/isitme-cihazlari"
                    className="text-link"
                  >
                    İşitme cihazı türlerini incele →
                  </Link>

                </article>

              )
            )}

          </div>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <div className="section-head center">

            <span className="section-kicker">

              <Sparkles size={15} />

              Süreç Nasıl İlerler?

            </span>


            <h2>
              İşitme cihazı seçiminde 4 adım.
            </h2>

          </div>


          <div className="steps-grid">

            {[
              [
                "01",
                "İhtiyacınızı Anlayalım",
                "Günlük yaşamda zorlandığınız dinleme ortamlarını ve beklentilerinizi konuşuyoruz.",
              ],

              [
                "02",
                "Değerlendirme",
                "İşitme durumunuz ve cihaz kullanımına yönelik ihtiyaçlar değerlendirilir.",
              ],

              [
                "03",
                "Cihaz Seçenekleri",
                "Uygun işitme cihazı türleri, marka ve teknoloji seçenekleri hakkında bilgi verilir.",
              ],

              [
                "04",
                "Ayar ve Destek",
                "Cihaz uygulaması sonrasında kullanım, programlama, ayar ve bakım konusunda destek sağlanır.",
              ],
            ].map(
              ([
                number,
                title,
                text,
              ]) => (

                <article
                  className="step-card"
                  key={number}
                >

                  <span>
                    {number}
                  </span>

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {text}
                  </p>

                </article>

              )
            )}

          </div>

        </div>

      </section>


      <section className="section soft">

        <div className="container">

          <div className="section-head">

            <span className="section-kicker">

              <Settings2 size={15} />

              DuyAnt Hizmetleri

            </span>


            <h2>
              İşitme cihazı satışından daha fazlası.
            </h2>


            <p>
              Cihaz seçimi kadar doğru uygulama,
              ayar, kontrol ve satış sonrası destek
              de kullanım sürecinin önemli parçalarıdır.
            </p>

          </div>


          <div className="services-grid">

            {[
              [
                Ear,
                "İşitme İhtiyacının Değerlendirilmesi",
                "İşitme ihtiyaçlarınız ve cihaz seçenekleri hakkında bilgilendirme.",
              ],

              [
                Headphones,
                "İşitme Cihazı Uygulaması",
                "İhtiyacınıza göre işitme cihazı seçeneklerinin değerlendirilmesi.",
              ],

              [
                Settings2,
                "Programlama ve Ayar",
                "Programlanabilir cihazların kullanım ihtiyaçlarına göre düzenlenmesi.",
              ],

              [
                Wrench,
                "Bakım ve Teknik Destek",
                "İşitme cihazı temizliği, kontrol, bakım ve teknik servis desteği.",
              ],

              [
                BatteryCharging,
                "Pil ve Sarf Malzemeleri",
                "Pil, filtre, kubbe ve bakım malzemeleri hakkında bilgi.",
              ],

              [
                ShieldCheck,
                "Satış Sonrası Destek",
                "Cihaz kullanımı, kontrol ve bakım alışkanlıkları konusunda destek.",
              ],
            ].map(
              ([
                Icon,
                title,
                text,
              ]) => (

                <article
                  className="service-card"
                  key={title}
                >

                  <span className="icon-box">

                    <Icon size={23} />

                  </span>


                  <div>

                    <h3>
                      {title}
                    </h3>

                    <p>
                      {text}
                    </p>

                  </div>

                </article>

              )
            )}

          </div>

        </div>

      </section>


      <section className="section">

        <div className="container">

          <div className="section-head">

            <span className="section-kicker">

              <Smartphone size={15} />

              İşitme Cihazı Bilgi Rehberi

            </span>


            <h2>
              İşitme cihazı almadan önce bilmeniz faydalı olanlar.
            </h2>

          </div>


          <div className="guide-grid">

            <article className="guide-card">

              <Headphones size={25} />

              <h3>
                İşitme Cihazı Nasıl Seçilir?
              </h3>

              <p>
                İşitme ihtiyacı, günlük kullanım ve
                cihaz özellikleri birlikte değerlendirilmelidir.
              </p>

              <Link
                href="/blog/isitme-cihazi-secerken"
                className="text-link"
              >
                İşitme cihazı seçim rehberi →
              </Link>

            </article>


            <article className="guide-card">

              <BatteryCharging size={25} />

              <h3>
                Şarjlı mı, Pilli mi?
              </h3>

              <p>
                Şarjlı ve pilli işitme cihazları
                farklı kullanım alışkanlıklarına hitap eder.
              </p>

              <Link
                href="/blog/sarjli-mi-pilli-mi"
                className="text-link"
              >
                Şarjlı ve pilli cihazları karşılaştır →
              </Link>

            </article>


            <article className="guide-card">

              <Bluetooth size={25} />

              <h3>
                Bluetooth ve Telefon Bağlantısı
              </h3>

              <p>
                Uygun cihazlarda telefon görüşmesi,
                medya ve mobil uygulama bağlantısı bulunabilir.
              </p>

              <Link
                href="/isitme-cihazlari"
                className="text-link"
              >
                Modern cihazları incele →
              </Link>

            </article>


            <article className="guide-card">

              <Wrench size={25} />

              <h3>
                İşitme Cihazı Bakımı
              </h3>

              <p>
                Filtre, nem, temizlik ve sarf
                malzemelerinin durumu cihazın kullanımını etkileyebilir.
              </p>

              <Link
                href="/isitme-cihazi-bakim-onarim-antalya"
                className="text-link"
              >
                Bakım ve teknik servis →
              </Link>

            </article>

          </div>

        </div>

      </section>


      <section className="section soft">

        <div className="container faq-grid">

          <div className="faq-side">

            <span className="section-kicker">

              <CircleHelp size={15} />

              Sık Sorulan Sorular

            </span>


            <h2>
              Antalya'da işitme cihazı hakkında merak edilenler.
            </h2>


            <p>
              İşitme cihazı satın almadan veya
              kullanmaya başlamadan önce sık sorulan
              konuların kısa cevapları.
            </p>


            <Link
              className="button primary"
              href="/iletisim"
            >
              DuyAnt'a Ulaşın
            </Link>

          </div>


          <div className="faq-list">

            {faqs.map(
              (
                [
                  question,
                  answer,
                ],
                index
              ) => (

                <div
                  className={
                    openFaq ===
                    index
                      ? "faq-item open"
                      : "faq-item"
                  }
                  key={question}
                >

                  <button
                    type="button"
                    onClick={
                      () =>
                        setOpenFaq(
                          openFaq ===
                          index
                            ? -1
                            : index
                        )
                    }
                  >

                    {question}

                    <ChevronDown
                      size={18}
                    />

                  </button>


                  {openFaq ===
                    index && (

                    <p>
                      {answer}
                    </p>

                  )}

                </div>

              )
            )}

          </div>

        </div>

      </section>


      <section className="section local-section">

        <div className="container local-card">

          <span className="local-icon">

            <MapPin size={30} />

          </span>


          <div>

            <h2>
              DuyAnt İşitme Cihazları – Kepez / Antalya
            </h2>


            <p>
              DuyAnt İşitme Cihazları,
              Antalya Kepez Göçerler Mahallesi'nde
              hizmet vermektedir. Unitron ve Coselgi
              işitme cihazları, cihaz seçimi,
              programlama, ayar, bakım ve teknik
              destek hakkında mağazamızdan bilgi alabilirsiniz.
            </p>


            <p>
              <strong>
                Adres:
              </strong>
              {" "}
              {site.address}
            </p>


            <p>
              <strong>
                Çalışma saatleri:
              </strong>
              {" "}
              {site.hours}
            </p>


            <div className="local-actions">

              <Link
                href="/kepez-isitme-cihazi"
                className="button light"
              >
                Kepez İşitme Cihazı Mağazası
              </Link>


              <Link
                href="/iletisim"
                className="button ghost"
              >
                İletişim ve Yol Tarifi
              </Link>

            </div>

          </div>

        </div>

      </section>


      <section className="section soft">

        <div className="container map-home-grid">

          <div>

            <span className="section-kicker">

              <MapPin size={15} />

              DuyAnt Antalya

            </span>


            <h2>
              Kepez'deki mağazamıza ulaşın.
            </h2>


            <p>
              {site.address}
            </p>


            <div className="contact-mini">

              <a
                href={
                  `tel:${site.phoneHref}`
                }
              >

                <Phone size={15} />

                {site.phoneDisplay}

              </a>


              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >

                <MessageCircle
                  size={15}
                />

                WhatsApp

              </a>

            </div>

          </div>


          <iframe
            title="DuyAnt İşitme Cihazları Kepez Antalya harita konumu"
            src={
              `https://www.google.com/maps?q=${mapQuery}&output=embed`
            }
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />

        </div>

      </section>


      <div className="mobile-contact-bar">

        <a
          href={
            `tel:${site.phoneHref}`
          }
        >
          Ara
        </a>


        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>

      </div>

    </main>
  );
}