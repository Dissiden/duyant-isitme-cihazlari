import HomeClient from "@/components/HomeClient";
import { site } from "@/lib/site";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "MedicalBusiness"],
  "@id": `${site.url}/#business`,
  name: site.name,
  url: site.url,
  telephone: site.phoneHref,
  email: site.email,
  image: `${site.url}/og/duyant-og.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.streetAddress,
    addressLocality: site.district,
    addressRegion: site.city,
    addressCountry: "TR",
  },
  areaServed: ["Antalya", "Kepez"],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <HomeClient />
    </>
  );
}
