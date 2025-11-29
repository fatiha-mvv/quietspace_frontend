

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../app/hooks/useAuth";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pendingMessages] = useState(12);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout, user } = useAuth();

  const menuItems = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: "overview",
      path: "/dashboard-admin",
    },
    {
      id: "spaces",
      label: "Lieux",
      icon: "spaces",
      path: "/dashboard-admin/lieux",
    },
    {
      id: "users",
      label: "Utilisateurs",
      icon: "users",
      path: "/dashboard-admin/utilisateurs",
    },
    {
      id: "messages",
      label: "Messages",
      icon: "messages",
      path: "/dashboard-admin/messages",
      badge: pendingMessages,
    },
    {
      id: "reviews",
      label: "Avis",
      icon: "reviews",
      path: "/dashboard-admin/avis",
    },
  ];

  const handleSectionClick = (sectionId: string, path: string) => {
    onSectionChange(sectionId);
    router.push(path);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      if (!confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
        setIsLoggingOut(false);
        return;
      }

      logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons = {
      overview: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="6" height="6" rx="1" />
          <rect x="11" y="3" width="6" height="6" rx="1" />
          <rect x="3" y="11" width="6" height="6" rx="1" />
          <rect x="11" y="11" width="6" height="6" rx="1" />
        </svg>
      ),
      spaces: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="10" cy="9" r="2" />
        </svg>
      ),
      users: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 19v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="10" cy="7" r="4" />
        </svg>
      ),
      messages: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 13a2 2 0 0 1-2 2H5l-4 4V3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      reviews: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 2l2.5 5 5.5.5-4 4 1 5.5-5-3-5 3 1-5.5-4-4 5.5-.5L10 2z" />
        </svg>
      ),
    };
    return icons[iconName as keyof typeof icons] || icons.overview;
  };

  return (
    <aside
      className={`
      fixed left-0 top-0 z-40 flex h-full flex-col border-r border-gray-200 bg-white shadow-sm transition-all duration-300
      ${isCollapsed ? "w-20" : "w-64"}
    `}
    >
      {/* Logo Section */}
      <div className="relative border-b border-gray-100 p-6">
        <Link href="/" className="block">
          {!isCollapsed ? (
            <Image
              src="/images/logo/quitSpace_logo.png"
              alt="QuietSpace Logo"
              width={140}
              height={30}
              className="w-full dark:hidden"
            />
          ) : (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2B7FD8] to-[#4A90E2]">
              <span className="text-sm font-bold text-white">Q</span>
            </div>
          )}
        </Link>
        
        {/* Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300 bg-white shadow-md transition-colors hover:bg-gray-50"
        >
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          >
            <path d="M4 2L8 6L4 10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Profile Section */}
      {!isCollapsed && (
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#2B7FD8] to-[#4A90E2] shadow-md">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {user?.username || "Admin"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role || "Administrateur"}
              </p>
              {user?.ville && (
                <p className="text-xs text-gray-400">{user.ville}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleSectionClick(item.id, item.path)}
                className={`
                  group relative flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all
                  ${pathname === item.path
                    ? "bg-[#2B7FD8] text-white shadow-md shadow-[#2B7FD8]/30"
                    : "text-gray-600 hover:bg-blue-50 hover:text-[#2B7FD8]"
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.label : ''}
              >
                {getIcon(item.icon)}
                
                {!isCollapsed && (
                  <>
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto rounded-full bg-[#2B7FD8] px-2 py-0.5 text-xs font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip pour la version réduite */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 z-50 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <span className="ml-1 text-xs">({item.badge})</span>
                    )}
                  </div>
                )}

                {/* Badge pour la version réduite */}
                {isCollapsed && item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`
            flex w-full items-center gap-3 rounded-lg text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50
            ${isCollapsed ? "justify-center" : "px-4 py-3"}
          `}
          title={isCollapsed ? "Déconnexion" : ""}
        >
          {isLoggingOut ? (
            <svg className="h-5 w-5 animate-spin text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 19H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h4M14 15l5-5-5-5M19 10H7" strokeLinecap="round" />
            </svg>
          )}
          
          {!isCollapsed && (
            <span className="text-sm font-medium">
              {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}