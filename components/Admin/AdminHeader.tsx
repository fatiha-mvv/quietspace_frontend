// "use client";

// import { usePathname } from "next/navigation";

// interface AdminHeaderProps {
//   onToggleSidebar?: () => void;
// }

// export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
//   const pathname = usePathname();

//   const getSectionInfo = () => {
//     const sections = {
//       "/dashboard-admin": {
//         title: "Vue d'ensemble",
//         description: "Tableau de bord principal",
//       },
//       "/dashboard-admin/lieux": {
//         title: "Gestion des lieux",
//         description: "Gérez tous les espaces de travail",
//       },
//       "/dashboard-admin/utilisateurs": {
//         title: "Gestion des utilisateurs",
//         description: "Gérez les utilisateurs de la plateforme",
//       },
//       "/dashboard-admin/messages": {
//         title: "Messages",
//         description: "Centre de messagerie",
//       },
//       "/dashboard-admin/avis": {
//         title: "Avis",
//         description: "Modération des avis",
//       },
//     };
//     return (
//       sections[pathname as keyof typeof sections] ||
//       sections["/dashboard-admin"]
//     );
//   };

//   const sectionInfo = getSectionInfo();

//   return (
//     <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
//       <div className="px-8 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             {/* Bouton toggle pour mobile/tablette */}
//             <button
//               onClick={onToggleSidebar}
//               className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden"
//             >
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 20 20"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path d="M3 6h14M3 12h14M3 18h14" strokeLinecap="round" />
//               </svg>
//             </button>

//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {sectionInfo.title}
//               </h1>
//               <p className="mt-1 text-sm text-gray-500">
//                 {sectionInfo.description}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../../app/hooks/useAuth";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth(); // Utiliser le hook

  const getSectionInfo = () => {
    const sections = {
      "/dashboard-admin": {
        title: "Vue d'ensemble",
        description: "Tableau de bord principal",
      },
      "/dashboard-admin/lieux": {
        title: "Gestion des lieux",
        description: "Gérez tous les espaces de travail",
      },
      "/dashboard-admin/utilisateurs": {
        title: "Gestion des utilisateurs",
        description: "Gérez les utilisateurs de la plateforme",
      },
      "/dashboard-admin/messages": {
        title: "Messages",
        description: "Centre de messagerie",
      },
      "/dashboard-admin/avis": {
        title: "Avis",
        description: "Modération des avis",
      },
    };
    return (
      sections[pathname as keyof typeof sections] ||
      sections["/dashboard-admin"]
    );
  };

  const sectionInfo = getSectionInfo();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Bouton toggle pour mobile/tablette */}
            <button
              onClick={onToggleSidebar}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h14M3 12h14M3 18h14" strokeLinecap="round" />
              </svg>
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {sectionInfo.title}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {sectionInfo.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Afficher le nom de l'utilisateur connecté */}
            <div className="hidden items-center gap-2 text-sm text-gray-600 md:flex">
              <span>Connecté en tant que</span>
              <span className="font-medium">{user?.username}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
