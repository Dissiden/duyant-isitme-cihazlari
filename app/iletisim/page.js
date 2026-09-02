import { CalendarDays, Clock3, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata = {
  title: "İletişim ve Konum",
  description: "DuyAnt İşitme Cihazları Antalya Kepez iletişim, telefon, WhatsApp, çalışma saatleri ve canlı harita bilgileri.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent(site.address);
  return (
    <main className="simple-page">
      <div className="container">
        <div className="page-hero">
          <span className="section-kicker"><MapPin size={15} />DuyAnt Antalya</span>
          <h1>İletişim, canlı konum ve bilgi talebi.</h1>
          <p className="page-lead">İşitme cihazları, cihaz ayarı, bakım, sarf malzemeleri veya mağaza ziyareti hakkında bize ulaşabilirsiniz.</p>
        </div>
        <div className="contact-layout">
          <div className="contact-panel" id="randevu">
            <h2>Bilgi / Randevu Talebi</h2>
            <div className="contact-items">
              <a href={`tel:${site.phoneHref}`}><Phone size={17} /> {site.phoneDisplay}</a>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp ile iletişim</a>
              <span><MapPin size={17} /> {site.address}</span>
              <span><Clock3 size={17} /> {site.hours}</span>
            </div>
            <ContactForm />
          </div>
          <div className="contact-map"><iframe title="DuyAnt İşitme Cihazları Antalya konum" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" /></div>
        </div>
      </div>
    </main>
  );
}
