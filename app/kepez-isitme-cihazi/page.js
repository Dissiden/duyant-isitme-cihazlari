import Link from "next/link";
import { MapPin } from "lucide-react";
import { site } from "@/lib/site";

export const metadata = {
  title: "Kepez İşitme Cihazı | DuyAnt Antalya",
  description: "Kepez Göçerler'de DuyAnt İşitme Cihazları. İşitme cihazı seçimi, ayar, bakım ve destek için canlı konum ve iletişim bilgileri.",
  alternates: { canonical: "/kepez-isitme-cihazi" },
};

export default function Page() {
  const q = encodeURIComponent(site.address);
  return <main className="simple-page"><div className="container">
    <div className="page-hero"><span className="section-kicker"><MapPin size={15}/>Kepez / Antalya</span><h1>Kepez'de DuyAnt İşitme Cihazları mağazası.</h1><p className="page-lead">Göçerler Mahallesi'ndeki mağazamızda işitme cihazı seçenekleri, cihaz ayarı, bakım ve sarf malzemeleri hakkında bilgi alabilirsiniz.</p></div>
    <div className="contact-layout"><div className="contact-panel"><h2>Mağaza bilgileri</h2><p>{site.address}</p><p>{site.hours}</p><p><a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a></p><Link className="button primary" href="/iletisim">İletişim</Link></div><div className="contact-map"><iframe title="DuyAnt Kepez konum" src={`https://www.google.com/maps?q=${q}&output=embed`} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" /></div></div>
  </div></main>;
}
