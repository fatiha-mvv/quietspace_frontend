"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  // Données mockées
  const stats = {
    totalSpaces: 156,
    totalUsers: 2453,
    totalReviews: 892,
    pendingMessages: 12,
    newSpacesThisWeek: 8,
    activeUsers: 1847,
  };

  const recentSpaces = [
    {
      id: 1,
      name: "Bibliothèque Centrale",
      type: "Bibliothèque",
      rating: 4.5,
      location: "Casablanca",
      status: "active",
      reviews: 45,
    },
    {
      id: 2,
      name: "Café Silence",
      type: "Café",
      rating: 4.2,
      location: "Rabat",
      status: "active",
      reviews: 32,
    },
  ];

  const recentMessages = [
    {
      id: 1,
      user: "Ahmed El Mansouri",
      subject: "Suggestion d'ajout de lieu",
      time: "Il y a 2h",
      unread: true,
    },
  ];

  const recentActivities = [
    { id: 1, action: "Nouvel espace ajouté", item: "Café Silence", time: "Il y a 30min" },
    { id: 2, action: "Avis publié", item: "Bibliothèque Centrale", time: "Il y a 1h" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-full flex flex-col shadow-sm">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="block">
            <Image
              src="/images/logo/quitSpace_logo.png"
              alt="QuietSpace Logo"
              width={140}
              height={30}
              className="w-full"
            />
          </Link>
        </div>

        {/* Profile Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2B7FD8] to-[#4A90E2] rounded-full flex items-center justify-center overflow-hidden shadow-md">
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
            </div>
            <div>
              <p className="font-semibold text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === "overview"
                    ? "bg-[#2B7FD8] text-white shadow-md shadow-[#2B7FD8]/30"
                    : "text-gray-600 hover:bg-blue-50 hover:text-[#2B7FD8]"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="6" height="6" rx="1" />
                  <rect x="11" y="3" width="6" height="6" rx="1" />
                  <rect x="3" y="11" width="6" height="6" rx="1" />
                  <rect x="11" y="11" width="6" height="6" rx="1" />
                </svg>
                <span className="text-sm font-medium">Vue d'ensemble</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("spaces")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === "spaces"
                    ? "bg-[#2B7FD8] text-white shadow-md shadow-[#2B7FD8]/30"
                    : "text-gray-600 hover:bg-blue-50 hover:text-[#2B7FD8]"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="10" cy="9" r="2" />
                </svg>
                <span className="text-sm font-medium">Lieux</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === "users"
                    ? "bg-[#2B7FD8] text-white shadow-md shadow-[#2B7FD8]/30"
                    : "text-gray-600 hover:bg-blue-50 hover:text-[#2B7FD8]"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 19v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                  <circle cx="10" cy="7" r="4" />
                </svg>
                <span className="text-sm font-medium">Utilisateurs</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("messages")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === "messages"
                    ? "bg-[#2B7FD8] text-white shadow-md shadow-[#2B7FD8]/30"
                    : "text-gray-600 hover:bg-blue-50 hover:text-[#2B7FD8]"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 13a2 2 0 0 1-2 2H5l-4 4V3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-sm font-medium">Messages</span>
                {stats.pendingMessages > 0 && (
                  <span className="ml-auto bg-[#2B7FD8] text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                    {stats.pendingMessages}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("reviews")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === "reviews"
                    ? "bg-[#2B7FD8] text-white shadow-md shadow-[#2B7FD8]/30"
                    : "text-gray-600 hover:bg-blue-50 hover:text-[#2B7FD8]"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10 2l2.5 5 5.5.5-4 4 1 5.5-5-3-5 3 1-5.5-4-4 5.5-.5L10 2z" />
                </svg>
                <span className="text-sm font-medium">Avis</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 19H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h4M14 15l5-5-5-5M19 10H7" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Custom Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeSection === "overview" && "Vue d'ensemble"}
                  {activeSection === "spaces" && "Gestion des lieux"}
                  {activeSection === "users" && "Gestion des utilisateurs"}
                  {activeSection === "messages" && "Messages"}
                  {activeSection === "reviews" && "Avis"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {activeSection === "overview" && "Tableau de bord principal"}
                  {activeSection === "spaces" && "Gérez tous les espaces de travail"}
                  {activeSection === "users" && "Gérez les utilisateurs de la plateforme"}
                  {activeSection === "messages" && "Centre de messagerie"}
                  {activeSection === "reviews" && "Modération des avis"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 2a6 6 0 0 0-6 6c0 4 3 7 3 7h6s3-3 3-7a6 6 0 0 0-6-6z" />
                    <path d="M8 15h4" strokeLinecap="round" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="10" cy="10" r="8" />
                    <path d="M10 6v4l3 2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {activeSection === "overview" && (
            <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-2">Espaces totaux</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalSpaces}</p>
                    <span className="text-xs text-green-600">+{stats.newSpacesThisWeek}</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-2">Utilisateurs</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                    <span className="text-xs text-gray-500">{stats.activeUsers} actifs</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-500 mb-2">Avis totaux</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalReviews}</p>
                    <span className="text-xs text-yellow-600">4.5/5</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Spaces */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-semibold text-gray-900">Espaces récents</h2>
                      <button className="text-xs text-[#2B7FD8] hover:text-[#4A90E2] font-medium">
                        Voir tout
                      </button>
                    </div>
                    <div className="space-y-3">
                      {recentSpaces.map((space) => (
                        <div
                          key={space.id}
                          className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{space.name}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span>{space.location}</span>
                              <span className="text-gray-400">•</span>
                              <span>⭐ {space.rating}</span>
                              <span className="text-gray-400">•</span>
                              <span>{space.reviews} avis</span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              space.status === "active"
                                ? "bg-green-50 text-green-700"
                                : "bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            {space.status === "active" ? "Actif" : "En attente"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Recent Messages */}
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Messages</h2>
                    <div className="space-y-3">
                      {recentMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            message.unread ? "bg-blue-50 hover:bg-blue-100" : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-medium text-gray-900 text-sm">{message.user}</p>
                            {message.unread && (
                              <span className="w-2 h-2 bg-[#2B7FD8] rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{message.subject}</p>
                          <p className="text-xs text-gray-400 mt-1">{message.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Activités</h2>
                    <div className="space-y-3">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-[#2B7FD8] rounded-full mt-1.5"></div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-900 font-medium">{activity.action}</p>
                            <p className="text-xs text-gray-600">{activity.item}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "spaces" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                    Tous
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                    Actifs
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                    En attente
                  </button>
                </div>
                <button className="px-4 py-2 bg-[#2B7FD8] text-white rounded-lg hover:bg-[#4A90E2] transition-colors text-sm font-medium shadow-md shadow-[#2B7FD8]/20">
                  + Ajouter un lieu
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-gray-500">Liste complète des lieux...</p>
              </div>
            </div>
          )}

          {activeSection === "users" && (
            <div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-gray-500">Gestion des utilisateurs...</p>
              </div>
            </div>
          )}

          {activeSection === "messages" && (
            <div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-gray-500">Centre de messagerie...</p>
              </div>
            </div>
          )}

          {activeSection === "reviews" && (
            <div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-gray-500">Modération des avis...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}