import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Comisarios Del Norte — Chat",
  description: "Chatbot oficial de Comisarios Del Norte. Consulta eventos, contrataciones, mercancía e información del grupo.",
  keywords: ["Comisarios Del Norte", "grupo norteño", "música regional", "contrataciones", "eventos"],
  manifest: "/manifest.json",
  themeColor: "#131313",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Comisarios",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="antialiased selection:bg-primary selection:text-on-primary">
        <div className="noise-overlay fixed inset-0 z-[100] pointer-events-none"></div>
        {children}
      </body>
    </html>
  );
}
