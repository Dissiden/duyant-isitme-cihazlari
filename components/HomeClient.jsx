"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowLeft, ArrowRight, BatteryCharging, Bluetooth, CalendarDays,
  CheckCircle2, ChevronDown, CircleHelp, Ear, Headphones, MapPin, MessageCircle,
  Settings2, ShieldCheck, Smartphone, Sparkles, Wrench
} from "lucide-react";
import { site } from "@/lib/site";

const slides = [
  {
    eyebrow: "DuyAnt İşitme Cihazları",
    title: "Antalya'da Daha İyi",
    accent: "Duymanın Adresi",
    description: "İşitme cihazı seçimi, uygulama, ayar ve satış sonrası destek için DuyAnt yanınızda.",
    cta: "Randevu Talebi",
    href: "/iletisim#randevu",
    image: "/slides/duyant-isitme-cihazi-uygulama.webp",
    alt: "Antalya DuyAnt İşitme Cihazları işitme cihazı uygulaması",
  },
  {
    eyebrow: "Modern İşitme Cihazları",
    title: "Küçük Tasarım.",
    accent: "Büyük Bir Fark.",
    description: "Günlük hayatınıza uyum sağlayan modern kulak arkası ve kanal içi işitme cihazlarını keşfedin.",
    cta: "Cihaz Türlerini İncele",
    href: "/isitme-cihazlari",
    image: "/slides/duyant-modern-isitme-cihazi.webp",
    alt: "Kulakta modern işitme cihazı Antalya",
  },
  {
    eyebrow: "Şarj Edilebilir İşitme Cihazları",
    title: "Yeni Nesil",
    accent: "İşitme Teknolojileri",
    description: "Şarj edilebilir, bağlantılı ve kullanımı kolay yeni nesil işitme cihazları hakkında bilgi alın.",
    cta: "Bilgi Al",
    href: "/isitme-cihazlari#sarjli",
    image: "/slides/duyant-sarjli-isitme-cihazi.webp",
    alt: "Şarj edilebilir işitme cihazı ve şarj kutusu Antalya",
  },
];

const deviceTypes = [
  { code: "RIC", icon: Ear, title: "Hoparlörü Kanal İçinde", sub: "RIC / RITE", text: "Kompakt gövdesi kulağın arkasında bulunur. İnce kablo aracılığıyla ses alıcıya iletilir." },
  { code: "BTE", icon: Headphones, title: "Kulak Arkası", sub: "BTE", text: "Elektronik bölüm kulağın arkasında bulunur. Kulak kalıbı veya ince tüp ile kullanılabilir." },
  { code: "CIC", icon: Activity, title: "Kanal İçi", sub: "ITE / ITC / CIC", text: "Kulak yapısına göre hazırlanan ve kulağın içine yerleşen kompakt cihaz seçenekleridir." },
  { code: "SMART", icon: BatteryCharging, title: "Şarj Edilebilir", sub: "Yeni Nesil", text: "Şarj altyapısı ve uygun modellerde telefon bağlantısı gibi teknolojiler sunan cihazlardır." },
];

const questions = [
  "Kalabalık ortamlarda konuşmaları takip etmekte zorlanıyor musunuz?",
  "Televizyon veya telefon sesini çevrenizdekilerden daha yüksek kullanıyor musunuz?",
  "İnsanlardan sık sık söylediklerini tekrar etmelerini istiyor musunuz?",
  "Telefon görüşmelerinde bazı kelimeleri kaçırıyor musunuz?",
  "Sesleri duyduğunuz halde bazı konuşmaları anlamakta zorlanıyor musunuz?",
];

const faqs = [
  ["İşitme cihazı seçerken nelere dikkat edilir?", "İşitme durumu, günlük kullanım ortamları, cihazın fiziksel yapısı, kullanım kolaylığı, bağlantı seçenekleri ve şarj veya pil tercihi birlikte değerlendirilmelidir."],
  ["Kulak arkası ve kanal içi cihazların farkı nedir?", "Kulak arkası cihazlarda elektronik bölüm kulağın arkasında bulunur. Kanal içi cihazlarda cihazın büyük bölümü kulağın içine yerleşir. Uygun model kişiden kişiye değişebilir."],
  ["Şarj edilebilir işitme cihazı var mı?", "Evet. Birçok yeni nesil işitme cihazında şarj edilebilir seçenekler bulunur. Kullanım süresi ve özellikler modele göre değişir."],
  ["İşitme cihazı ayarları sonradan değiştirilebilir mi?", "Programlanabilir işitme cihazlarının ayarları kullanıcının ihtiyaçları ve kullanım deneyimine göre yeniden düzenlenebilir."],
  ["Pil, filtre ve işitme cihazı aksesuarı satıyor musunuz?", "Cihaz marka ve modeline göre uygun pil, filtre, kubbe ve benzeri sarf malzemeleri için mağazamızdan bilgi alabilirsiniz."],
];

export default function HomeClient() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [answers, setAnswers] = useState(questions.map(() => null));
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setSlideIndex((v) => (v + 1) % slides.length), 6500);
    return () => window.clearInterval(id);
  }, []);

  const slide = slides[slideIndex];
  const completed = answers.every((v) => v !== null);
  const score = answers.filter(Boolean).length;
  const result = useMemo(() => {
    if (!completed) return null;
    if (score <= 1) return "Belirgin bir günlük güçlük işareti görünmüyor. Bu kısa kontrol bir işitme testi değildir.";
    if (score <= 3) return "İşitmenizi değerlendirmek faydalı olabilir. Profesyonel değerlendirme daha net bilgi sağlayabilir.";
    return "Birden fazla günlük dinleme durumunda güçlük bildirdiniz. Profesyonel işitme değerlendirmesi planlamayı düşünebilirsiniz.";
  }, [completed, score]);

  const mapQuery = encodeURIComponent(site.address);

  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <div className="hero-card">
            <button className="slider-arrow left" onClick={() => setSlideIndex((slideIndex - 1 + slides.length) % slides.length)} aria-label="Önceki slayt"><ArrowLeft size={19} /></button>
            <div className="hero-copy">
              <span className="eyebrow"><ShieldCheck size={15} />{slide.eyebrow}</span>
              <h1><span>{slide.title}</span><span>{slide.accent}</span></h1>
              <p>{slide.description}</p>
              <div className="hero-actions">
                <Link className="button primary" href={slide.href}><CalendarDays size={18} />{slide.cta}</Link>
                <a className="button whatsapp" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Merhaba DuyAnt, işitme cihazları hakkında bilgi almak istiyorum.")}`} target="_blank" rel="noreferrer"><MessageCircle size={18} />WhatsApp</a>
              </div>
              <div className="trust-row"><span><CheckCircle2 size={15} />Cihaz Seçimi</span><span><CheckCircle2 size={15} />Ayar & Bakım</span><span><CheckCircle2 size={15} />Satış Sonrası Destek</span></div>
            </div>
            <div className="hero-image"><Image src={slide.image} alt={slide.alt} fill sizes="(max-width: 900px) 100vw, 55vw" priority={slideIndex === 0} /></div>
            <button className="slider-arrow right" onClick={() => setSlideIndex((slideIndex + 1) % slides.length)} aria-label="Sonraki slayt"><ArrowRight size={19} /></button>
            <div className="slider-dots">{slides.map((_, i) => <button key={i} className={i === slideIndex ? "dot active" : "dot"} aria-label={`${i + 1}. slayt`} onClick={() => setSlideIndex(i)} />)}</div>
          </div>

          <div className="quick-grid">
            {[ [Ear,"İşitme Değerlendirmesi","İşitme ihtiyaçlarınızı daha yakından tanıyın."], [Headphones,"İşitme Cihazları","İhtiyacınıza uygun cihaz türlerini keşfedin."], [Wrench,"Bakım & Teknik Destek","Ayar, bakım ve cihaz kullanım desteği."] ].map(([Icon,title,text]) => (
              <article className="quick-card" key={title}><span className="icon-box"><Icon size={27} /></span><div><h2>{title}</h2><p>{text}</p></div></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft" id="kontrol">
        <div className="container check-grid">
          <div className="check-info">
            <span className="section-kicker"><CircleHelp size={15} />İşitme Farkındalığı</span>
            <h2>İşitmenizde değişiklik olduğunu nasıl fark edebilirsiniz?</h2>
            <p>Günlük yaşamda karşılaşılan bazı durumlar işitmenizi daha yakından değerlendirmek için işaret olabilir.</p>
            <div className="sign-list">{["Kalabalıkta konuşmaları kaçırmak","Televizyon sesini yükseltmek","Sık sık tekrar istemek","Telefonda kelimeleri kaçırmak"].map((x)=><span key={x}><CheckCircle2 size={17}/>{x}</span>)}</div>
          </div>
          <div className="quiz-card">
            <div className="quiz-head"><strong>1 Dakikalık Farkındalık Kontrolü</strong><span>{answers.filter((x)=>x!==null).length}/{questions.length}</span></div>
            {questions.map((q,i)=><div className="question" key={q}><div>{q}</div><div className="answer-buttons"><button className={answers[i]===true?"answer active":"answer"} onClick={()=>setAnswers(a=>a.map((v,j)=>j===i?true:v))}>Evet</button><button className={answers[i]===false?"answer active":"answer"} onClick={()=>setAnswers(a=>a.map((v,j)=>j===i?false:v))}>Hayır</button></div></div>)}
            {result && <div className="result"><strong>Sonuç</strong><p>{result}</p><Link className="button primary small" href="/iletisim#randevu">Bilgi / Randevu</Link></div>}
            <small className="disclaimer">Bu bölüm genel farkındalık amaçlıdır; tıbbi tanı veya işitme testi değildir.</small>
          </div>
        </div>
      </section>

      <section className="section" id="cihazlar">
        <div className="container">
          <div className="section-head"><span className="section-kicker"><Headphones size={15}/>İşitme Cihazı Türleri</span><h2>Size uygun işitme cihazı hangisi?</h2><p>İşitme cihazları farklı kullanım ihtiyaçlarına göre farklı fiziksel yapılara ve teknoloji seçeneklerine sahiptir.</p></div>
          <div className="device-grid">{deviceTypes.map(({code,icon:Icon,title,sub,text})=><article className="device-card" key={code}><span className="device-code">{code}</span><span className="icon-box"><Icon size={27}/></span><h3>{title}</h3><small>{sub}</small><p>{text}</p><Link href="/isitme-cihazlari" className="text-link">Detaylı bilgi →</Link></article>)}</div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head center"><span className="section-kicker"><Sparkles size={15}/>Süreç Nasıl İlerler?</span><h2>İşitme cihazı seçiminde 4 adım.</h2></div>
          <div className="steps-grid">{[
            ["01","İhtiyacınızı Anlayalım","Günlük yaşamda zorlandığınız dinleme ortamlarını ve beklentilerinizi konuşuyoruz."],
            ["02","Değerlendirme","İşitme durumunuz ve cihaz kullanımına yönelik ihtiyaçlar değerlendirilir."],
            ["03","Cihaz Seçenekleri","İhtiyacınıza uygun cihaz türleri ve özellikleri hakkında bilgi verilir."],
            ["04","Ayar & Destek","Cihaz uygulaması sonrasında kullanım, ayar ve bakım konusunda destek sağlanır."],
          ].map(([n,t,x])=><article className="step-card" key={n}><span>{n}</span><h3>{t}</h3><p>{x}</p></article>)}</div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><span className="section-kicker"><Settings2 size={15}/>DuyAnt Hizmetleri</span><h2>İşitme cihazı satışından daha fazlası.</h2><p>Cihaz seçimi kadar doğru uygulama, ayar ve satış sonrası destek de kullanım deneyiminin önemli parçalarıdır.</p></div>
          <div className="services-grid">{[
            [Ear,"İşitme Değerlendirmesi","İşitme ihtiyaçlarınız ve cihaz seçenekleri hakkında bilgilendirme."],
            [Headphones,"Cihaz Uygulaması","İhtiyacınıza göre cihaz seçeneklerinin değerlendirilmesi."],
            [Settings2,"Programlama & Ayar","Programlanabilir cihazların ihtiyaçlarınıza göre düzenlenmesi."],
            [Wrench,"Bakım & Teknik Destek","Temizlik, kontrol, bakım ve teknik destek."],
            [BatteryCharging,"Pil & Sarf Malzemeleri","Pil, filtre, kubbe ve bakım malzemeleri hakkında bilgi."],
            [ShieldCheck,"Satış Sonrası Destek","Günlük kullanım ve bakım alışkanlıkları konusunda destek."],
          ].map(([Icon,t,x])=><article className="service-card" key={t}><span className="icon-box"><Icon size={23}/></span><div><h3>{t}</h3><p>{x}</p></div></article>)}</div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head"><span className="section-kicker"><Smartphone size={15}/>Kısa Bilgi Rehberi</span><h2>Cihaz almadan önce bilmeniz faydalı olanlar.</h2></div>
          <div className="guide-grid">{[
            [Headphones,"Cihaz Nasıl Seçilir?","En küçük cihaz her zaman en doğru cihaz değildir. İşitme ihtiyacı ve günlük kullanım birlikte değerlendirilmelidir."],
            [BatteryCharging,"Şarj mı, Pil mi?","Şarjlı ve pilli modeller farklı kullanım alışkanlıklarına hitap eder."],
            [Bluetooth,"Telefon Bağlantısı","Uygun cihazlarda telefon görüşmesi, medya aktarımı ve mobil uygulama bağlantısı bulunabilir."],
            [Wrench,"Düzenli Bakım","Nem, kulak kiri, filtre ve sarf malzemelerinin durumu cihaz performansını etkileyebilir."],
          ].map(([Icon,t,x])=><article className="guide-card" key={t}><Icon size={25}/><h3>{t}</h3><p>{x}</p></article>)}</div>
        </div>
      </section>

      <section className="section">
        <div className="container faq-grid">
          <div className="faq-side"><span className="section-kicker"><CircleHelp size={15}/>Sık Sorulan Sorular</span><h2>Merak ettikleriniz.</h2><p>İşitme cihazı satın almadan veya kullanmaya başlamadan önce en sık sorulan konuları sade biçimde yanıtladık.</p><Link className="button primary" href="/iletisim">Bize ulaşın</Link></div>
          <div className="faq-list">{faqs.map(([q,a],i)=><div className={openFaq===i?"faq-item open":"faq-item"} key={q}><button onClick={()=>setOpenFaq(openFaq===i?-1:i)}>{q}<ChevronDown size={18}/></button>{openFaq===i&&<p>{a}</p>}</div>)}</div>
        </div>
      </section>

      <section className="section local-section">
        <div className="container local-card"><span className="local-icon"><MapPin size={30}/></span><div><h2>Antalya İşitme Cihazı – DuyAnt İşitme Cihazları</h2><p>DuyAnt İşitme Cihazları, Antalya Kepez Göçerler Mahallesi'nde hizmet vermektedir. İşitme cihazı seçimi, uygulama, programlama, bakım, teknik destek, pil ve sarf malzemeleri hakkında bilgi almak için mağazamıza ulaşabilirsiniz.</p><div className="local-actions"><Link href="/kepez-isitme-cihazi" className="button light">Kepez mağazamız</Link><Link href="/iletisim" className="button ghost">Canlı konum</Link></div></div></div>
      </section>

      <section className="section soft">
        <div className="container map-home-grid"><div><span className="section-kicker"><MapPin size={15}/>DuyAnt Antalya</span><h2>Mağazamızı canlı haritada görün.</h2><p>{site.address}</p><div className="contact-mini"><a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a></div></div><iframe title="DuyAnt İşitme Cihazları Antalya konum" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" /></div>
      </section>

      <div className="mobile-contact-bar"><a href={`tel:${site.phoneHref}`}>Ara</a><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a></div>
    </main>
  );
}
