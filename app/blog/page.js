import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "İşitme Cihazı Bilgi Rehberi",
  description: "İşitme cihazı seçimi, şarjlı ve pilli cihazlar, bakım ve kullanım hakkında DuyAnt bilgi rehberi.",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  const posts = [
    ["İşitme cihazı seçerken nelere dikkat edilir?","/blog/isitme-cihazi-secerken","Cihaz tipi, kullanım ortamı, şarj, bağlantı ve fiziksel kullanım kolaylığı."],
    ["Şarjlı mı pilli mi?","/blog/sarjli-mi-pilli-mi","Şarj edilebilir ve değiştirilebilir pilli cihazların günlük kullanım farkları."],
  ];
  return <main className="simple-page"><div className="container"><div className="page-hero"><span className="section-kicker"><BookOpen size={15}/>Bilgi Rehberi</span><h1>İşitme cihazları hakkında sade, faydalı içerikler.</h1><p className="page-lead">Satın alma kararı vermeden önce cihaz özelliklerini ve günlük kullanım farklarını daha iyi anlamanıza yardımcı olacak rehberler.</p></div><div className="cards-3">{posts.map(([t,h,d])=><article className="info-card" key={h}><h2>{t}</h2><p>{d}</p><Link className="text-link" href={h}>Rehberi oku →</Link></article>)}</div></div></main>;
}
