"use client";

import Link from "next/link";
import { useState } from "react";

import {
  CalendarDays,
  Ear,
  Menu,
  Phone,
  X,
} from "lucide-react";

import {
  navigation,
  site,
} from "@/lib/site";


export default function SiteHeader() {
  const [open, setOpen] =
    useState(false);


  function closeMenu() {
    setOpen(false);
  }


  return (
    <header className="site-header">

      <div className="container header-inner">

        <Link
          href="/"
          className="brand"
          aria-label="DuyAnt İşitme Cihazları ana sayfa"
          onClick={closeMenu}
        >

          <span className="brand-mark">

            <Ear size={26} />

          </span>


          <span>

            <strong>
              DuyAnt
            </strong>

            <small>
              İşitme Cihazları
            </small>

          </span>

        </Link>


        <nav
          id="main-navigation"
          className={
            open
              ? "main-nav open"
              : "main-nav"
          }
          aria-label="Ana menü"
        >

          {navigation.map(
            (item) => (

              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </Link>

            )
          )}

        </nav>


        <div className="header-actions">

          <a
            className="header-phone"
            href={
              `tel:${site.phoneHref}`
            }
            aria-label={
              `DuyAnt'ı ara: ${site.phoneDisplay}`
            }
          >

            <Phone size={17} />

            <span>
              {site.phoneDisplay}
            </span>

          </a>


          <Link
            href="/iletisim#randevu"
            className="button primary header-cta"
            onClick={closeMenu}
          >

            <CalendarDays
              size={17}
            />

            Randevu

          </Link>


          <button
            className="menu-button"
            type="button"
            onClick={
              () =>
                setOpen(
                  (current) =>
                    !current
                )
            }
            aria-label={
              open
                ? "Menüyü kapat"
                : "Menüyü aç"
            }
            aria-expanded={open}
            aria-controls="main-navigation"
          >

            {open
              ? (
                  <X size={21} />
                )
              : (
                  <Menu size={21} />
                )}

          </button>

        </div>

      </div>

    </header>
  );
}