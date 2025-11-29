"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "../../components/Header";
import AuthenticatedGuard from "../../components/AuthGuard/authguard";

export default function UserSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("explorer");

  // Mettre à jour la section active basée sur le pathname
  useEffect(() => {
    const sections: { [key: string]: string } = {
      "/espace-user": "explorer",
      "/espace-user/favoris": "favorites",
      "/espace-user/profil": "profile",
      "/espace-user/parametres": "settings",
    };
    setActiveSection(sections[pathname] || "explorer");
  }, [pathname]);

  return (
    <AuthenticatedGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header principal */}
        <Header />

        {/* Contenu principal */}
        <main className="pt-16">
          {" "}
          {/* pt-16 pour compenser le header fixe */}
          {children}
        </main>
      </div>
    </AuthenticatedGuard>
  );
}
