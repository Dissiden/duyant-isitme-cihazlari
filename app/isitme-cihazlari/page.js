import Link from "next/link";
import { BatteryCharging, Bluetooth, Ear, Headphones } from "lucide-react";

export const metadata = {
  title: "İşitme Cihazları Antalya",
  description: "Antalya'da kulak arkası, kanal içi, RIC ve şarj edilebilir işitme cihazı türleri hakkında bilgi alın. DuyAnt İşitme Cihazları Kepez.",
  alternates: { canonical: "/isitme-cihazlari" },
};

export default function Page() {
  return (
    <main className="simple-page"><div className="container">
      <div className="page-hero"><span className="section-kicker"><Headphones size={15}/>İşitme Cihazları</span><h1>İşitme cihazı türlerini sade biçimde karşılaştırın.</h1><p className="page-lead">Uygun cihaz yalnızca boyuta göre seçilmez. İşitme ihtiyacı, kulak yapısı, kullanım ortamları, şarj veya pil tercihi ve bağlantı beklentileri birlikte değerlendirilir.</p></div>
      <div className="cards-3">
        <article className="info-card"><Ear size={24}/><h2>RIC / RITE</h2><p>Kulak arkasında kompakt gövde, kulak kanalında ince alıcı bulunan yaygın tasarımlardandır.</p></article>
        <article className="info-card"><Headphones size={24}/><h2>BTE – Kulak Arkası</h2><p>Farklı güç seçenekleri ve kulak kalıbı alternatifleriyle geniş kullanım alanına sahip olabilir.</p></article>
        <article className="info-card" id="kanal-ici"><Ear size={24}/><h2>Kanal İçi</h2><p>ITE, ITC ve CIC gibi farklı boyut seçenekleri vardır. Uygunluk kişiye göre değerlendirilir.</p></article>
      </div>
      <div className="content-grid">
        <article className="article-card">
          <h2 id="sarjli">Şarj edilebilir işitme cihazları</h2><p>Birçok yeni nesil cihazda şarj edilebilir batarya seçeneği bulunur. Kullanım süresi, şarj kutusu özellikleri ve bağlantı fonksiyonları modele göre değişir.</p>
          <h2>Bluetooth ve telefon bağlantısı</h2><p>Uyumlu cihazlar telefon görüşmesi, medya aktarımı veya üreticinin mobil uygulamasıyla kontrol gibi seçenekler sunabilir.</p>
          <h2>Cihaz seçerken hangi bilgiler önemlidir?</h2><ul><li>İşitme durumunuz ve mevcut ölçümler</li><li>Kalabalık, ev, iş ve telefon gibi günlük kullanım ortamları</li><li>Fiziksel kullanım kolaylığı</li><li>Şarj veya pil tercihi</li><li>Bağlantı ve aksesuar ihtiyacı</li></ul>
        </article>
        <aside className="side-card"><h3>Mağazada bilgi alın</h3><p>Cihaz türlerini ihtiyacınıza göre karşılaştırmak için DuyAnt ile iletişime geçebilirsiniz.</p><Link className="button primary" href="/iletisim#randevu">Bilgi / Randevu</Link></aside>
      </div>
    </div></main>
  );
}
