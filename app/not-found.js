import Link from "next/link";

export default function NotFound() {
  return (
    <main className="simple-page">
      <div className="container narrow center-text">
        <span className="section-kicker">404</span>
        <h1>Aradığınız sayfa bulunamadı.</h1>
        <p>İşitme cihazları ve DuyAnt hizmetleri için ana sayfaya dönebilirsiniz.</p>
        <Link className="button primary" href="/">Ana sayfaya dön</Link>
      </div>
    </main>
  );
}
