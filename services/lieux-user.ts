// frontend/services/lieux-user.ts
import axios from 'axios';
import authService from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Position par défaut : Centre de Casablanca
export const DEFAULT_POSITION = {
  latitude: 33.5731,
  longitude: -7.5898,
};

export interface TypeLieu {
  value: string;
  label: string;
  baseScore: number;
}

export interface Lieu {
  id: number;
  name: string;
  type: string;
  typeId: number;
  description: string;
  address: string;
  lat: number;
  lng: number;
  scoreCalme: number;
  niveauCalme: string;
  image: string;
  distance?: number;
  isFavorite?: boolean;
  noteMoyenne?: number | null;
  nombreAvis?: number;
  createdAt: string;
}

export interface GetLieuxParams {
  search?: string;
  types?: string[];
  niveauCalme?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

export interface AvisData {
  note: number;
}

export interface AvisResponse {
  message: string;
  avis: {
    userId: number;
    username: string;
    lieuId: number;
    lieuName: string;
    note: number;
  };
}

export interface UserPosition {
  latitude: number;
  longitude: number;
  isDefault: boolean;
  accuracy?: number;
  timestamp?: number;
}

// Intercepteur pour ajouter le token automatiquement
axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class LieuxUserService {
  
  // ========== MÉTHODES API ==========

  async getTypesLieux(): Promise<TypeLieu[]> {
    try {
      const response = await axios.get(`${API_URL}/lieux/types`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des types de lieux:', error);
      throw error;
    }
  }

  async getLieux(params?: GetLieuxParams): Promise<Lieu[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.search) {
        queryParams.append('search', params.search);
      }
      
      if (params?.types && params.types.length > 0) {
        queryParams.append('types', params.types.join(','));
      }
      
      if (params?.niveauCalme) {
        queryParams.append('niveauCalme', params.niveauCalme);
      }
      
      if (params?.latitude !== undefined) {
        queryParams.append('latitude', params.latitude.toString());
      }
      
      if (params?.longitude !== undefined) {
        queryParams.append('longitude', params.longitude.toString());
      }
      
      if (params?.distance !== undefined) {
        queryParams.append('distance', params.distance.toString());
      }
      

      const url = `${API_URL}/lieux${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axios.get(url);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des lieux:', error);
      throw error;
    }
  }

  async getLieuById(id: number): Promise<Lieu> {
    try {
      const response = await axios.get(`${API_URL}/lieux/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du lieu ${id}:`, error);
      throw error;
    }
  }

  async getFavoris(): Promise<any[]> {
    try {
      if (!authService.isAuthenticated()) {
        console.warn('Utilisateur non authentifié');
        return [];
      }
      
      const response = await axios.get(`${API_URL}/favoris`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      throw error;
    }
  }

  async addFavoris(lieuId: number): Promise<{ message: string }> {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Vous devez être connecté pour ajouter un favori');
      }
      
      const response = await axios.post(`${API_URL}/favoris/${lieuId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du favori:', error);
      throw error;
    }
  }

  async removeFavoris(lieuId: number): Promise<{ message: string }> {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Vous devez être connecté pour retirer un favori');
      }
      
      const response = await axios.delete(`${API_URL}/favoris/${lieuId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
      throw error;
    }
  }

  async toggleFavoris(lieuId: number, isFavorite: boolean): Promise<{ message: string }> {
    if (isFavorite) {
      return this.removeFavoris(lieuId);
    } else {
      return this.addFavoris(lieuId);
    }
  }

  async createOrUpdateAvis(lieuId: number, note: number): Promise<AvisResponse> {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Vous devez être connecté pour donner un avis');
      }
      
      if (note < 1 || note > 5) {
        throw new Error('La note doit être entre 1 et 5');
      }
      
      const response = await axios.post(
        `${API_URL}/avis/lieu/${lieuId}`,
        { note }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création/mise à jour de l\'avis:', error);
      throw error;
    }
  }

  async getAvisByLieu(lieuId: number): Promise<any[]> {
    try {
      const response = await axios.get(`${API_URL}/avis/lieu/${lieuId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des avis du lieu ${lieuId}:`, error);
      throw error;
    }
  }

  async getMyAvis(): Promise<any[]> {
    try {
      if (!authService.isAuthenticated()) {
        console.warn('Utilisateur non authentifié');
        return [];
      }
      
      const response = await axios.get(`${API_URL}/avis/user`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de vos avis:', error);
      throw error;
    }
  }

  async deleteAvis(lieuId: number): Promise<{ message: string }> {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Vous devez être connecté pour supprimer un avis');
      }
      
      const response = await axios.delete(`${API_URL}/avis/lieu/${lieuId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avis:', error);
      throw error;
    }
  }
}

export default new LieuxUserService();