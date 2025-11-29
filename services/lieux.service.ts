import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface TypeLieu {
  id_type_lieu: number;
  type_lieu: string;
  base_score: number;
}

export interface Lieu {
  id_lieu: number;
  nom_lieu: string;
  description_lieu?: string;
  geom: string; // Format: "POINT(lng lat)"
  score_calme: number;
  niveau_calme: string;
  adresse_lieu?: string;
  image_lieu?: string;
  created_at_lieu: string;
  typeLieu?: TypeLieu; // Rendre optionnel pour correspondre au backend
  id_type_lieu: number;
}

// Interface pour la création sans id_lieu
export interface CreateLieuData {
  nom_lieu: string;
  description_lieu?: string;
  geom: string;
  id_type_lieu: number;
  adresse_lieu?: string;
  image_lieu?: string;
}

class LieuxService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // Gestion des lieux
  async getAll(): Promise<Lieu[]> {
    const response = await axios.get(`${API_URL}/lieux`, this.getAuthHeaders());
    return response.data;
  }

  async getById(id: number): Promise<Lieu> {
    const response = await axios.get(`${API_URL}/lieux/${id}`, this.getAuthHeaders());
    return response.data;
  }

  async create(data: CreateLieuData): Promise<Lieu> {
    const response = await axios.post(`${API_URL}/lieux`, data, this.getAuthHeaders());
    return response.data;
  }

  async update(id: number, data: Partial<CreateLieuData>): Promise<Lieu> {
    const response = await axios.patch(`${API_URL}/lieux/${id}`, data, this.getAuthHeaders());
    return response.data;
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await axios.delete(`${API_URL}/lieux/${id}`, this.getAuthHeaders());
    return response.data;
  }

  // Gestion des types de lieux
  async getTypesLieu(): Promise<TypeLieu[]> {
    const response = await axios.get(`${API_URL}/type-lieu`, this.getAuthHeaders());
    return response.data;
  }

  async getTypeLieuById(id: number): Promise<TypeLieu> {
    const response = await axios.get(`${API_URL}/type-lieu/${id}`, this.getAuthHeaders());
    return response.data;
  }
}

export default new LieuxService();