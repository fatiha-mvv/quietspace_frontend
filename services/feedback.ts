import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface FeedbackData {
  id?: number;
  userId?: number | null;
  name?: string | null;
  email?: string | null;
  message: string;
  createdAt?: string;
}

class FeedbackService {
  // Créer un nouveau feedback
  async create(data: FeedbackData) {
    
    try {
      const response = await axios.post(`${API_URL}/feedback`, data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating feedback:", error.response?.data || error.message);
      throw error;
    }
  }

  // Récupérer tous les feedbacks
  async findAll() {
    try {
      const response = await axios.get(`${API_URL}/feedback`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching feedbacks:", error.response?.data || error.message);
      throw error;
    }
  }

  // Récupérer un feedback par ID
  async findOne(id: number) {
    try {
      const response = await axios.get(`${API_URL}/feedback/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching feedback:", error.response?.data || error.message);
      throw error;
    }
  }

  // Mettre à jour un feedback
  async update(id: number, data: FeedbackData) {
    try {
      const response = await axios.put(`${API_URL}/feedback/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Error updating feedback:", error.response?.data || error.message);
      throw error;
    }
  }

  // Supprimer un feedback
  async delete(id: number) {
    try {
      const response = await axios.delete(`${API_URL}/feedback/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting feedback:", error.response?.data || error.message);
      throw error;
    }
  }
}

export default new FeedbackService();
