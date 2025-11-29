import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  ville: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    avatar?: string;
    ville?: string;
    createdAt: string;
  };
}

// Helper pour vérifier si on est côté client
const isClient = typeof window !== 'undefined';

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    if (response.data.access_token && isClient) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    if (response.data.access_token && isClient) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  logout() {
    if (isClient) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  getCurrentUser() {
    if (!isClient) return null;
    
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  getToken() {
    if (!isClient) return null;
    
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    if (!isClient) return false;
    
    try {
      return !!this.getToken();
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  isAdmin(): boolean {
    if (!isClient) return false;
    
    try {
      const user = this.getCurrentUser();
      return user?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  }
}

export default new AuthService();