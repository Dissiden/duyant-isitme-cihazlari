"use client";

import Link from "next/link";
import { useState } from "react";
import { Ear, Menu, Phone, X, CalendarDays } from "lucide-react";
import { navigation, site } from "@/lib/site";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="DuyAnt ana sayfa">
          <span className="brand-mark"><Ear size={26} /></span>
          <span><strong>DuyAnt</strong><small>İşitme Cihazları</small></span>
        </Link>

        <nav className={open ? "main-nav open" : "main-nav"} aria-label="Ana menü">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <a className="header-phone" href={`tel:${site.phoneHref}`}>
            <Phone size={17} /><span>{site.phoneDisplay}</span>
          </a>
          <Link href="/iletisim#randevu" className="button primary header-cta">
            <CalendarDays size={17} /> Randevu
          </Link>
          <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-label="Menüyü aç veya kapat">
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}
