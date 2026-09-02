import Link from "next/link";
import { BatteryCharging, Settings2, Wrench } from "lucide-react";

export const metadata = {
  title: "İşitme Cihazı Bakım ve Teknik Destek Antalya",
  description: "Antalya Kepez'de işitme cihazı bakım, temizlik, ayar, filtre, kubbe ve teknik destek hakkında DuyAnt'tan bilgi alın.",
  alternates: { canonical: "/isitme-cihazi-bakim-onarim-antalya" },
};

export default function Page() {
  return <main className="simple-page"><div className="container">
    <div className="page-hero"><span className="section-kicker"><Wrench size={15}/>Bakım & Destek</span><h1>İşitme cihazınızın günlük performansını koruyun.</h1><p className="page-lead">Nem, kulak kiri, filtreler, kubbeler ve cihaz ayarları günlük kullanım deneyimini etkileyebilir. Uygun bakım işlemi cihazın modeline göre değişir.</p></div>
    <div className="cards-3"><article className="info-card"><Wrench/><h2>Temizlik & Kontrol</h2><p>Cihaz gövdesi, ses çıkışı, kubbe ve filtre gibi parçaların durumu kontrol edilir.</p></article><article className="info-card"><Settings2/><h2>Ayar & Programlama</h2><p>Programlanabilir cihazlarda kullanım geri bildirimlerine göre ayar değişikliği yapılabilir.</p></article><article className="info-card"><BatteryCharging/><h2>Pil & Sarf</h2><p>Uygun pil, filtre, kubbe ve bakım ürünleri cihaz modeline göre belirlenir.</p></article></div>
    <div className="content-grid"><article className="article-card"><h2>Ne zaman kontrol gerekebilir?</h2><ul><li>Ses seviyesinde veya netlikte belirgin değişiklik varsa</li><li>Cihaz sık sık ötüyor veya kesiliyorsa</li><li>Filtre veya kubbe kirlenmiş görünüyorsa</li><li>Şarj veya pil süresi beklenenden kısa ise</li></ul><h2>Evde bakım</h2><p>Cihazı kuru tutmak, modelin bakım talimatlarına uymak ve uygun olmayan sıvılarla temizlememek önemlidir.</p></article><aside className="side-card"><h3>Cihazınızı getirin</h3><p>Marka ve model bilgisiyle mağazamıza başvurarak uygun bakım seçeneği hakkında bilgi alabilirsiniz.</p><Link className="button primary" href="/iletisim">İletişim</Link></aside></div>
  </div></main>;
}
