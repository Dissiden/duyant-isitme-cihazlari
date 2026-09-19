import Link from "next/link";

import {
  Ear,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import {
  deviceLinks,
  infoLinks,
  serviceLinks,
  site,
} from "@/lib/site";


export default function SiteFooter() {
  const whatsappUrl =
    `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
      "Merhaba DuyAnt, işitme cihazları hakkında bilgi almak istiyorum."
    )}`;


  const mapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      site.address
    )}`;


  return (
    <footer className="site-footer">

      <div className="container footer-grid">

        <div>

          <Link
            href="/"
            className="brand footer-brand"
            aria-label="DuyAnt İşitme Cihazları ana sayfa"
          >

            <span className="brand-mark">

              <Ear size={26} />

            </span>


            <span>

              <strong>
                DuyAnt
              </strong>

              <small>
                İşitme Cihazları
              </small>

            </span>

          </Link>


          <p>
            DuyAnt İşitme Cihazları,
            Kepez / Antalya'da Unitron ve
            Coselgi işitme cihazları, cihaz
            seçimi, ayar, bakım ve satış
            sonrası destek hizmetleri sunar.
          </p>


          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >

            <MessageCircle size={16} />

            WhatsApp'tan Bilgi Al

          </a>

        </div>


        <div>

          <h3>
            İşitme Cihazları
          </h3>


          {deviceLinks.map(
            (item) => (

              <Link
                key={item.href}
                href={item.href}
              >
                {item.label}
              </Link>

            )
          )}

        </div>


        <div>

          <h3>
            Hizmetler
          </h3>


          {serviceLinks.map(
            (item) => (

              <Link
                key={item.href}
                href={item.href}
              >
                {item.label}
              </Link>

            )
          )}

        </div>


        <div>

          <h3>
            Bilgi Rehberi
          </h3>


          {infoLinks.map(
            (item) => (

              <Link
                key={item.href}
                href={item.href}
              >
                {item.label}
              </Link>

            )
          )}

        </div>


        <div>

          <h3>
            DuyAnt Antalya
          </h3>


          <a
            href={
              `tel:${site.phoneHref}`
            }
          >

            <Phone size={15} />

            {site.phoneDisplay}

          </a>


          <a
            href={
              `mailto:${site.email}`
            }
          >

            <Mail size={15} />

            {site.email}

          </a>


          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
          >

            <MapPin size={15} />

            {site.address}

          </a>


          <span>
            {site.hours}
          </span>

        </div>

      </div>


      <div className="container footer-bottom">

        <span>
          © 2026 DuyAnt İşitme Cihazları. Tüm hakları saklıdır.
        </span>


        <span>
          Kepez / Antalya
        </span>

      </div>

    </footer>
  );
}