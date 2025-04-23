
import React from "react";
import { MessageSquare } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/+6287788980084?text=Halo%20saya%20ingin%20daftar%20ke%20Rapatin";

const WhatsAppWidget = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Hubungi via WhatsApp"
    className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full bg-green-500 hover:bg-green-600 text-white p-4 flex items-center justify-center transition-colors duration-200"
    style={{
      boxShadow:
        "0 4px 20px 0 rgba(39, 174, 96, 0.30), 0 1.5px 4px 0 rgba(39,174,96,0.20)",
    }}
  >
    <MessageSquare className="w-7 h-7" />
    <span className="sr-only">Hubungi via WhatsApp</span>
  </a>
);

export default WhatsAppWidget;
