import Link from "next/link";
import { Ear } from "lucide-react";
import { site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand footer-brand">
            <span className="brand-mark"><Ear size={26} /></span>
            <span><strong>DuyAnt</strong><small>İşitme Cihazları</small></span>
          </Link>
          <p>Antalya'da işitme cihazı seçimi, uygulama, ayar, bakım ve satış sonrası destek.</p>
        </div>
        <div>
          <h3>İşitme Cihazları</h3>
          <Link href="/isitme-cihazlari">Cihaz türleri</Link>
          <Link href="/isitme-cihazlari#sarjli">Şarj edilebilir cihazlar</Link>
          <Link href="/isitme-cihazlari#kanal-ici">Kanal içi cihazlar</Link>
        </div>
        <div>
          <h3>Bilgi</h3>
          <Link href="/sgk-isitme-cihazi">SGK rehberi</Link>
          <Link href="/blog">Bilgi rehberi</Link>
          <Link href="/hakkimizda">Hakkımızda</Link>
          <Link href="/iletisim">İletişim</Link>
        </div>
        <div>
          <h3>İletişim</h3>
          <a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span>{site.address}</span>
          <span>{site.hours}</span>
        </div>
      </div>
      <div className="container footer-bottom">© 2026 DuyAnt İşitme Cihazları. Tüm hakları saklıdır.</div>
    </footer>
  );
}
