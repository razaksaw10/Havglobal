'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const pathname = usePathname();

  // Do not show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <a
      href="https://wa.me/905431736173?text=Bonjour%20HAVA%20Global%20Trade%2C%20je%20souhaite%20des%20informations%20sur%20vos%20produits%20et%20services%20d%27export."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      title="Discuter directement sur WhatsApp"
      aria-label="WhatsApp HAVA Global Trade"
    >
      <MessageCircle size={32} />
    </a>
  );
}
