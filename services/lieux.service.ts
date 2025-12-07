import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CreateLieuData {
  idLieu?: number;
  idTypeLieu: number;
  nomLieu?: string;
  descriptionLieu?: string;
  geom?: string;
  adresseLieu?: string;
  imageLieu?: string;
  createdAtLieu?: string;
}

export interface UpdateLieuData extends Partial<CreateLieuData> {}

export interface Lieu {
  idLieu: number;
  idTypeLieu: number;
  typeLieu?: {
    idTypeLieu: number;
    typeLieu: string;
    baseScore: number;
  };
  nomLieu?: string;
  descriptionLieu?: string;
  geom?: string;
  scoreCalme?: number;
  niveauCalme?: string;
  adresseLieu?: string;
  imageLieu?: string;
  createdAtLieu?: string;
}

export interface TypeLieu {
  idTypeLieu: number;
  typeLieu: string;
  baseScore: number;
}

class LieuxService {
  private api = axios.create({
    baseURL: `${API_BASE_URL}/lieuxAdmin`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Gestion des erreurs
  private handleError(error: any): never {
    if (error.response) {
      throw new Error(error.response.data.message || 'Erreur serveur');
    } else if (error.request) {
      throw new Error('Impossible de contacter le serveur');
    } else {
      throw new Error('Erreur de configuration');
    }
  }

  // Convertir le chemin relatif en URL complète
  private getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return '';
    
    // Si l'image commence déjà par http:// ou https://, la retourner telle quelle
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Sinon, construire l'URL complète avec le backend
    // Supprimer le slash initial si présent pour éviter les doubles slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${API_BASE_URL}/${cleanPath}`;
  }

  // Normaliser les lieux pour avoir des URLs complètes
  private normalizeLieu(lieu: Lieu): Lieu {
    return {
      ...lieu,
      imageLieu: this.getImageUrl(lieu.imageLieu)
    };
  }

  // Préparer les données pour la création (sans niveauCalme et scoreCalme)
  private prepareCreateData(data: CreateLieuData): any {
    const { niveauCalme, scoreCalme, ...cleanData } = data as any;
    return cleanData;
  }

  // Préparer les données pour la modification (sans niveauCalme et scoreCalme)
  private prepareUpdateData(data: UpdateLieuData): any {
    const { niveauCalme, scoreCalme, ...cleanData } = data as any;
    return cleanData;
  }

  // CRUD pour les lieux
  async getAll(): Promise<Lieu[]> {
    try {
      const response = await this.api.get('/');
      return response.data.map((lieu: Lieu) => this.normalizeLieu(lieu));
    } catch (error) {
      this.handleError(error);
    }
  }

  async getById(id: number): Promise<Lieu> {
    try {
      const response = await this.api.get(`/${id}`);
      return this.normalizeLieu(response.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(data: CreateLieuData): Promise<Lieu> {
    try {
      const cleanData = this.prepareCreateData(data);
      const response = await this.api.post('/', cleanData);
      return this.normalizeLieu(response.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: number, data: UpdateLieuData): Promise<Lieu> {
    try {
      const cleanData = this.prepareUpdateData(data);
      const response = await this.api.patch(`/${id}`, cleanData);
      return this.normalizeLieu(response.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }


  async getByType(idTypeLieu: number): Promise<Lieu[]> {
    try {
      const response = await this.api.get(`/type/${idTypeLieu}`);
      return response.data.map((lieu: Lieu) => this.normalizeLieu(lieu));
    } catch (error) {
      this.handleError(error);
    }
  }

  // Gestion des types de lieux
  async getTypesLieu(): Promise<TypeLieu[]> {
    try {
      const response = await this.api.get('/types/all');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getTypeLieuById(id: number): Promise<TypeLieu> {
    try {
      const response = await this.api.get(`/types/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Upload d'image
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await this.api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Le backend renvoie le chemin relatif (images/lieux/photo.jpg)
      // On retourne ce chemin tel quel, il sera normalisé lors de la récupération
      return response.data.url || response.data.path || response.data.filename;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default new LieuxService();