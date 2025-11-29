"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/hooks/useAuth";

export default function AuthenticatedGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated()) {
        console.log("Non authentifié, redirection vers /signin");
        router.push("/signin");
        return;
      }

      // Si authentifié (peu importe le rôle), on autorise l'affichage
      setIsChecking(false);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">
            Vérification de l'authentification...
          </p>
        </div>
      </div>
    );
  }

  // Si on arrive ici, c'est que l'utilisateur est authentifié
  return <>{children}</>;
}
