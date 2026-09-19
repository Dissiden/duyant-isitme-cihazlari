import Link from "next/link";

import {
  CheckCircle2,
  CircleHelp,
  Headphones,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

import {
  site,
} from "@/lib/site";

import styles from "./SeoLandingPage.module.css";


export default function SeoLandingPage({
  eyebrow,
  title,
  intro,
  answerTitle,
  answer,
  highlights = [],
  sections = [],
  faqs = [],
  relatedLinks = [],
  source = null,
}) {
  const whatsappUrl =
    `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
      "Merhaba DuyAnt, işitme cihazları hakkında bilgi almak istiyorum."
    )}`;


  return (
    <main>

      <section className={styles.hero}>

        <div className={styles.container}>

          <span className={styles.eyebrow}>

            <Headphones
              size={16}
            />

            {eyebrow}

          </span>


          <h1>
            {title}
          </h1>


          <p className={styles.lead}>
            {intro}
          </p>


          <div className={styles.heroActions}>

            <a
              className={styles.primaryButton}
              href={
                `tel:${site.phoneHref}`
              }
            >

              <Phone
                size={18}
              />

              {site.phoneDisplay}

            </a>


            <a
              className={styles.whatsappButton}
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >

              <MessageCircle
                size={18}
              />

              WhatsApp'tan Bilgi Al

            </a>

          </div>


          <div className={styles.trustRow}>

            <span>

              <CheckCircle2
                size={16}
              />

              Kepez / Antalya

            </span>


            <span>

              <CheckCircle2
                size={16}
              />

              Unitron & Coselgi

            </span>


            <span>

              <CheckCircle2
                size={16}
              />

              Satış Sonrası Destek

            </span>

          </div>

        </div>

      </section>


      <section className={styles.answerSection}>

        <div className={styles.container}>

          <article className={styles.answerCard}>

            <span>

              <CircleHelp
                size={21}
              />

            </span>


            <div>

              <h2>
                {answerTitle}
              </h2>

              <p>
                {answer}
              </p>

            </div>

          </article>

        </div>

      </section>


      {highlights.length >
        0 && (

        <section className={styles.section}>

          <div className={styles.container}>

            <div className={styles.highlightGrid}>

              {highlights.map(
                (item) => (

                  <article
                    className={styles.highlightCard}
                    key={
                      item.title
                    }
                  >

                    <span className={styles.checkIcon}>

                      <CheckCircle2
                        size={20}
                      />

                    </span>


                    <h2>
                      {item.title}
                    </h2>


                    <p>
                      {item.text}
                    </p>

                  </article>

                )
              )}

            </div>

          </div>

        </section>

      )}


      {sections.map(
        (
          section,
          index
        ) => (

          <section
            className={
              index % 2 ===
              0
                ? styles.sectionSoft
                : styles.section
            }
            key={
              section.title
            }
          >

            <div className={styles.narrowContainer}>

              <h2>
                {section.title}
              </h2>


              {(section.paragraphs || []).map(
                (
                  paragraph,
                  paragraphIndex
                ) => (

                  <p
                    key={
                      `${section.title}-${paragraphIndex}`
                    }
                  >
                    {paragraph}
                  </p>

                )
              )}


              {section.bullets?.length >
                0 && (

                <ul className={styles.bulletList}>

                  {section.bullets.map(
                    (bullet) => (

                      <li key={bullet}>

                        <CheckCircle2
                          size={17}
                        />

                        <span>
                          {bullet}
                        </span>

                      </li>

                    )
                  )}

                </ul>

              )}


              {section.link && (

                <Link
                  className={styles.textLink}
                  href={
                    section.link.href
                  }
                >
                  {section.link.label} →
                </Link>

              )}

            </div>

          </section>

        )
      )}


      {faqs.length >
        0 && (

        <section className={styles.section}>

          <div className={styles.container}>

            <div className={styles.sectionHead}>

              <span className={styles.eyebrow}>

                <CircleHelp
                  size={16}
                />

                Sık Sorulan Sorular

              </span>


              <h2>
                Merak edilen kısa cevaplar
              </h2>

            </div>


            <div className={styles.faqGrid}>

              {faqs.map(
                (
                  [
                    question,
                    answer,
                  ]
                ) => (

                  <article
                    className={styles.faqCard}
                    key={
                      question
                    }
                  >

                    <h3>
                      {question}
                    </h3>

                    <p>
                      {answer}
                    </p>

                  </article>

                )
              )}

            </div>

          </div>

        </section>

      )}


      {source && (

        <section className={styles.sourceSection}>

          <div className={styles.narrowContainer}>

            <div className={styles.sourceBox}>

              <ShieldCheck
                size={20}
              />


              <div>

                <strong>
                  Teknik bilgiler için üretici kaynağı
                </strong>


                <p>
                  Model ve teknoloji özellikleri zaman içinde değişebilir.
                  Güncel teknik özellikleri üreticinin resmi sayfasından da kontrol edebilirsiniz.
                </p>


                <a
                  href={
                    source.href
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.label} →
                </a>

              </div>

            </div>

          </div>

        </section>

      )}


      {relatedLinks.length >
        0 && (

        <section className={styles.sectionSoft}>

          <div className={styles.container}>

            <div className={styles.sectionHead}>

              <h2>
                İlgili sayfalar
              </h2>

            </div>


            <div className={styles.relatedGrid}>

              {relatedLinks.map(
                (item) => (

                  <Link
                    className={styles.relatedCard}
                    href={
                      item.href
                    }
                    key={
                      item.href
                    }
                  >

                    <strong>
                      {item.title}
                    </strong>

                    <span>
                      {item.text}
                    </span>

                    <small>
                      Detaylı bilgi →
                    </small>

                  </Link>

                )
              )}

            </div>

          </div>

        </section>

      )}


      <section className={styles.localSection}>

        <div className={styles.container}>

          <div className={styles.localCard}>

            <span className={styles.locationIcon}>

              <MapPin
                size={28}
              />

            </span>


            <div>

              <h2>
                DuyAnt İşitme Cihazları – Kepez / Antalya
              </h2>


              <p>
                {site.address}
              </p>


              <p>
                Pazartesi – Cumartesi 09:00 – 18:00
              </p>


              <div className={styles.localActions}>

                <Link
                  href="/iletisim"
                  className={styles.lightButton}
                >
                  İletişim ve Yol Tarifi
                </Link>


                <Link
                  href="/kepez-isitme-cihazi"
                  className={styles.outlineButton}
                >
                  Kepez Mağazamız
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}