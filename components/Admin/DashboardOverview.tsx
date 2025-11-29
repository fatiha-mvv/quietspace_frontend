import { StatItem, RecentSpace, RecentMessage, RecentActivity } from "./types";

interface DashboardOverviewProps {
  stats: {
    totalSpaces: number;
    totalUsers: number;
    totalReviews: number;
    pendingMessages: number;
    newSpacesThisWeek: number;
    activeUsers: number;
  };
  recentSpaces: RecentSpace[];
  recentMessages: RecentMessage[];
  recentActivities: RecentActivity[];
}

export default function DashboardOverview({ 
  stats, 
  recentSpaces, 
  recentMessages, 
  recentActivities 
}: DashboardOverviewProps) {
  return (
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
  );
}