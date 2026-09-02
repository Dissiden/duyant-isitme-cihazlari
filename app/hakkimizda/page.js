import Link from "next/link";
import { Ear } from "lucide-react";

export const metadata = {
  title: "Hakkımızda",
  description: "DuyAnt İşitme Cihazları Antalya Kepez hakkında. İşitme cihazı seçimi, uygulama, ayar, bakım ve satış sonrası destek yaklaşımımız.",
  alternates: { canonical: "/hakkimizda" },
};

export default function Page() {
  return <main className="simple-page"><div className="container"><div className="page-hero"><span className="section-kicker"><Ear size={15}/>DuyAnt</span><h1>İşitme cihazı seçiminde anlaşılır bilgi ve devam eden destek.</h1><p className="page-lead">DuyAnt İşitme Cihazları Antalya Kepez'de işitme cihazı seçenekleri, uygulama, ayar, bakım ve satış sonrası destek konularında hizmet verir.</p></div><div className="content-grid"><article className="article-card"><h2>Yaklaşımımız</h2><p>Cihaz seçimini yalnızca ürün özelliklerine indirgemeden, günlük kullanım ihtiyacını anlamayı ve seçenekleri sade biçimde açıklamayı önemsiyoruz.</p><h2>Satış sonrası</h2><p>İşitme cihazının günlük kullanımı zaman içinde ayar, bakım, filtre, kubbe ve kullanım desteği gerektirebilir. Bu nedenle satış sonrası iletişimi sürecin bir parçası olarak görüyoruz.</p></article><aside className="side-card"><h3>DuyAnt'a ulaşın</h3><p>Mağazamızın konumu ve iletişim bilgileri için iletişim sayfamızı kullanabilirsiniz.</p><Link className="button primary" href="/iletisim">İletişim</Link></aside></div></div></main>;
}
