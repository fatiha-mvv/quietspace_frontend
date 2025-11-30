"use client";

import AuthenticatedGuard from "../../../components/AuthGuard/authguard";

export default function LieuDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedGuard>
      {children}
    </AuthenticatedGuard>
  );
}