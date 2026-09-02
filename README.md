# DuyAnt İşitme Cihazları — Next.js SEO Production

Domain: `https://isitmecihaziantalya.com`

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcı: `http://localhost:3000`

## Production kontrol

```bash
npm run build
npm start
```

## GitHub

```bash
git init
git add .
git commit -m "DuyAnt production site"
git branch -M main
git remote add origin GITHUB_REPO_URL
git push -u origin main
```

## Vercel

1. Vercel → Add New → Project
2. GitHub reposunu Import et
3. Framework: Next.js (otomatik algılanır)
4. Deploy
5. Settings → Domains
6. `isitmecihaziantalya.com` ve `www.isitmecihaziantalya.com` ekle
7. Vercel panelinin verdiği DNS kayıtlarını domain sağlayıcında uygula
8. Ana domain olarak `isitmecihaziantalya.com` kullan, `www` sürümünü ana domaine yönlendir

## Canlıya çıktıktan sonra

- Google Search Console'a `https://isitmecihaziantalya.com` ekle
- Sitemap gönder: `https://isitmecihaziantalya.com/sitemap.xml`
- Robots kontrol: `https://isitmecihaziantalya.com/robots.txt`
- Google Business Profile web sitesi alanını yeni domaine bağla
- Business Profile adres/telefon/saat bilgilerini sitedekiyle birebir aynı tut

## Önemli

İşletme bilgileri `lib/site.js` dosyasından yönetilir.
Slider görselleri `public/slides/` klasöründedir ve WebP olarak optimize edilmiştir.
