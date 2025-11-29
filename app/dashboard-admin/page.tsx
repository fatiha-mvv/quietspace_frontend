
"use client";

import { useState } from "react";
import DashboardOverview from "../../components/Admin/DashboardOverview";

export default function AdminDashboard() {
  // Données mockées
  const [stats] = useState({
    totalSpaces: 156,
    totalUsers: 2453,
    totalReviews: 892,
    pendingMessages: 12,
    newSpacesThisWeek: 8,
    activeUsers: 1847,
  });

  const [recentSpaces] = useState([
    {
      id: 1,
      name: "Bibliothèque Centrale",
      type: "Bibliothèque",
      rating: 4.5,
      location: "Casablanca",
      status: "active" as const,
      reviews: 45,
    },
    {
      id: 2,
      name: "Café Silence",
      type: "Café",
      rating: 4.2,
      location: "Rabat",
      status: "active" as const,
      reviews: 32,
    },
  ]);

  const [recentMessages] = useState([
    {
      id: 1,
      user: "Ahmed El Mansouri",
      subject: "Suggestion d'ajout de lieu",
      time: "Il y a 2h",
      unread: true,
    },
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      action: "Nouvel espace ajouté",
      item: "Café Silence",
      time: "Il y a 30min",
    },
    {
      id: 2,
      action: "Avis publié",
      item: "Bibliothèque Centrale",
      time: "Il y a 1h",
    },
  ]);

  return (
    <DashboardOverview
      stats={stats}
      recentSpaces={recentSpaces}
      recentMessages={recentMessages}
      recentActivities={recentActivities}
    />
  );
}
