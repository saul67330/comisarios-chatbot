import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Comisarios Del Norte — Chat",
  description: "Chatbot oficial de Comisarios Del Norte. Consulta eventos, contrataciones, mercancía e información del grupo.",
  keywords: ["Comisarios Del Norte", "grupo norteño", "música regional", "contrataciones", "eventos"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased selection:bg-primary selection:text-on-primary">
        <div className="noise-overlay fixed inset-0 z-[100] pointer-events-none"></div>
        {children}
      </body>
    </html>
  );
}
