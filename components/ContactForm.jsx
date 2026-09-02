"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", subject: "İşitme cihazı hakkında bilgi", note: "" });

  function update(e) {
    setForm((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    const message = [
      "Merhaba DuyAnt, isitmecihaziantalya.com üzerinden bilgi/randevu talebi oluşturuyorum.",
      "",
      `Ad Soyad: ${form.name || "-"}`,
      `Telefon: ${form.phone || "-"}`,
      `Konu: ${form.subject}`,
      `Not: ${form.note || "-"}`,
    ].join("\n");
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        <div className="field"><label>Ad Soyad</label><input name="name" value={form.name} onChange={update} placeholder="Adınız soyadınız" /></div>
        <div className="field"><label>Telefon</label><input name="phone" value={form.phone} onChange={update} placeholder="05xx xxx xx xx" inputMode="tel" /></div>
        <div className="field full"><label>Konu</label><select name="subject" value={form.subject} onChange={update}><option>İşitme cihazı hakkında bilgi</option><option>İşitme cihazı ayarı</option><option>Bakım / teknik destek</option><option>Pil / filtre / aksesuar</option><option>SGK süreci hakkında bilgi</option></select></div>
        <div className="field full"><label>Notunuz</label><textarea name="note" value={form.note} onChange={update} placeholder="Nasıl yardımcı olabileceğimizi kısaca yazabilirsiniz." /></div>
      </div>
      <p style={{ color: "#819597", fontSize: ".68rem" }}>Gönder butonuna bastığınızda bilgiler WhatsApp mesajına aktarılır.</p>
      <button className="button primary" type="submit"><MessageCircle size={17} />WhatsApp'tan Gönder</button>
    </form>
  );
}
