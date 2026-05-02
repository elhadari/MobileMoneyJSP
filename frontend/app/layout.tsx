import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner"; // Importation du Toaster pour les notifications
import "./globals.css";

// Configuration de la police Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Variable utilisée dans Tailwind
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Yas Mobile Money",
  description: "Gérez votre argent en toute simplicité",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        
        {/* Le Toaster est placé ici pour être accessible dans toute l'application */}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
        />
      </body>
    </html>
  );
}