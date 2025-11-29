"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminHeader from "../../components/Admin/AdminHeader";
import AdminGuard from "../../components/Admin/AdminGuard"; // Ajouter cette importation

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mettre à jour la section active basée sur le pathname
  useEffect(() => {
    const sections: { [key: string]: string } = {
      "/dashboard-admin": "overview",
      "/dashboard-admin/lieux": "spaces",
      "/dashboard-admin/utilisateurs": "users",
      "/dashboard-admin/messages": "messages",
      "/dashboard-admin/avis": "reviews",
    };
    setActiveSection(sections[pathname] || "overview");
  }, [pathname]);

  // Charger l'état de la sidebar depuis le localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState) {
      setIsSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Sauvegarder l'état de la sidebar dans le localStorage
  useEffect(() => {
    localStorage.setItem(
      "sidebarCollapsed",
      JSON.stringify(isSidebarCollapsed),
    );
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />

        <main
          className={`
          flex-1 transition-all duration-300
          ${isSidebarCollapsed ? "ml-20" : "ml-64"}
        `}
        >
          <AdminHeader onToggleSidebar={toggleSidebar} />

          <div className="p-8">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}
