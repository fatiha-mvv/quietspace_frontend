

"use client";

import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";
import { Inter } from "next/font/google";
import "../styles/index.css";
import { usePathname } from "next/navigation";
import { Providers } from "./providers";
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/dashboard-admin");

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          {/* Affiche Header et Footer uniquement si on n’est pas sur admin */}
          {!isAdminRoute && <Header />}
          {children}
          {!isAdminRoute && <Footer />}
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
