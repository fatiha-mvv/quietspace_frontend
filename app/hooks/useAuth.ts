"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../services/auth.service';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/');
    // Forcer un rechargement pour nettoyer complètement l'état
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  const isAdmin = () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
    isAdmin
  };
}