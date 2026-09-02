import Link from "next/link";
import { FileText, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "SGK İşitme Cihazı Süreci Antalya",
  description: "SGK işitme cihazı rapor, reçete ve temin süreci hakkında genel bilgilendirme. Güncel işlemler için DuyAnt İşitme Cihazları ile iletişime geçin.",
  alternates: { canonical: "/sgk-isitme-cihazi" },
};

export default function Page() {
  return <main className="simple-page"><div className="container">
    <div className="page-hero"><span className="section-kicker"><FileText size={15}/>SGK Rehberi</span><h1>SGK işitme cihazı sürecini önceden öğrenin.</h1><p className="page-lead">İşitme cihazı temin süreci rapor, reçete, uygunluk ve güncel SGK kurallarına göre değişebilir. Bu sayfa genel bilgilendirme amaçlıdır.</p></div>
    <div className="content-grid"><article className="article-card"><h2>Süreç neden kişiden kişiye değişebilir?</h2><p>Rapor ve reçetenin içeriği, cihaz ihtiyacı, güncel mevzuat ve başvuru tarihindeki SGK koşulları işlemleri etkileyebilir.</p><h2>Mağazaya gelirken</h2><p>Elinizde mevcut rapor, reçete veya ilgili sağlık belgeleri varsa yanınızda getirmeniz sürecin değerlendirilmesini kolaylaştırabilir.</p><h2>Önemli not</h2><p>SGK ödeme tutarları ve temin koşulları zaman içinde değişebilir. Bu nedenle kesin işlem bilgisi için güncel belgeler ve yürürlükteki kurallar kontrol edilmelidir.</p></article><aside className="side-card"><ShieldCheck size={24}/><h3>Güncel durumunuzu sorun</h3><p>Elinizdeki belgeleri ve sürecinizi görüşmek için DuyAnt ile iletişime geçebilirsiniz.</p><Link className="button primary" href="/iletisim">Bilgi al</Link></aside></div>
  </div></main>;
}
