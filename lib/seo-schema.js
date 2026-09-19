import { site } from "@/lib/site";


export const businessSchema = {
  "@type": [
    "MedicalBusiness",
    "Store",
  ],

  "@id":
    `${site.url}/#business`,

  name:
    site.name,

  alternateName:
    "DuyAnt",

  url:
    site.url,

  logo:
    `${site.url}/icon.svg`,

  image: [
    `${site.url}/og/duyant-og.jpg`,
  ],

  telephone:
    site.phoneHref,

  email:
    site.email,

  address: {
    "@type":
      "PostalAddress",

    streetAddress:
      site.streetAddress,

    addressLocality:
      site.district,

    addressRegion:
      site.city,

    addressCountry:
      "TR",
  },

  areaServed: [
    {
      "@type":
        "City",

      name:
        "Antalya",
    },

    {
      "@type":
        "AdministrativeArea",

      name:
        "Kepez",
    },
  ],

  openingHoursSpecification: [
    {
      "@type":
        "OpeningHoursSpecification",

      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],

      opens:
        "09:00",

      closes:
        "18:00",
    },
  ],

  contactPoint: {
    "@type":
      "ContactPoint",

    telephone:
      site.phoneHref,

    contactType:
      "customer service",

    areaServed:
      "TR",

    availableLanguage: [
      "Turkish",
    ],
  },
};


export const websiteSchema = {
  "@type":
    "WebSite",

  "@id":
    `${site.url}/#website`,

  url:
    site.url,

  name:
    site.name,

  alternateName:
    "DuyAnt",

  inLanguage:
    "tr-TR",

  publisher: {
    "@id":
      `${site.url}/#business`,
  },
};


export function getGlobalSchema() {
  return {
    "@context":
      "https://schema.org",

    "@graph": [
      businessSchema,
      websiteSchema,
    ],
  };
}


export function getHomePageSchema() {
  return {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "WebPage",

        "@id":
          `${site.url}/#webpage`,

        url:
          site.url,

        name:
          "Antalya İşitme Cihazı | DuyAnt İşitme Cihazları",

        description:
          "Antalya Kepez'de Unitron ve Coselgi işitme cihazları, cihaz seçimi, ayar, bakım ve teknik servis hizmetleri.",

        inLanguage:
          "tr-TR",

        isPartOf: {
          "@id":
            `${site.url}/#website`,
        },

        about: {
          "@id":
            `${site.url}/#business`,
        },

        primaryImageOfPage: {
          "@type":
            "ImageObject",

          url:
            `${site.url}/og/duyant-og.jpg`,
        },
      },
    ],
  };
}