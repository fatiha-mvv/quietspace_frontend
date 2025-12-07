// frontend/hooks/useUserLocation.ts
import { useGeolocated } from 'react-geolocated';
import { UserPosition, DEFAULT_POSITION } from '../../services/lieux-user';

interface UseUserLocationOptions {
  /**
   * Activer la haute précision (GPS)
   * @default true
   */
  highAccuracy?: boolean;
  
  /**
   * Suivre la position en continu
   * @default false
   */
  watchPosition?: boolean;
  
  /**
   * Timeout en millisecondes
   * @default 10000
   */
  timeout?: number;
  
  /**
   * Âge maximum du cache en millisecondes
   * @default 0
   */
  maximumAge?: number;
}

interface UseUserLocationReturn {
  /** Position actuelle de l'utilisateur */
  userPosition: UserPosition | null;
  
  /** La géolocalisation est en cours */
  isLoading: boolean;
  
  /** Erreur de géolocalisation */
  error: GeolocationPositionError | null;
  
  /** La géolocalisation est supportée */
  isSupported: boolean;
  
  /** Demander à nouveau la position */
  getPosition: () => void;
}

/**
 * Hook personnalisé pour gérer la géolocalisation de l'utilisateur
 * Utilise react-geolocated en interne
 */
export function useUserLocation(
  options: UseUserLocationOptions = {}
): UseUserLocationReturn {
  const {
    highAccuracy = true,
    watchPosition = false,
    timeout = 10000,
    maximumAge = 0,
  } = options;

  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError,
    getPosition,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: highAccuracy,
      timeout,
      maximumAge,
    },
    watchPosition,
    userDecisionTimeout: undefined, // Pas de timeout pour la décision utilisateur
    suppressLocationOnMount: false, // Demander la position au montage
    isOptimisticGeolocationEnabled: true, // Mode optimiste
  });

  // Déterminer si on est en train de charger
  const isLoading = isGeolocationAvailable && isGeolocationEnabled && !coords && !positionError;

  // Construire l'objet UserPosition
  let userPosition: UserPosition | null = null;

  if (coords) {
    // Position GPS réelle obtenue
    userPosition = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      isDefault: false,
      accuracy: coords.accuracy,
      timestamp: Date.now(),
    };
    
    console.log(' Position GPS obtenue:', {
      lat: coords.latitude.toFixed(6),
      lng: coords.longitude.toFixed(6),
      accuracy: `${coords.accuracy?.toFixed(0)}m`,
    });
  } else if (positionError || !isGeolocationAvailable || !isGeolocationEnabled) {
    // Erreur ou géolocalisation non disponible : utiliser la position par défaut
    userPosition = {
      ...DEFAULT_POSITION,
      isDefault: true,
      timestamp: Date.now(),
    };

    if (positionError) {
      console.warn(' Erreur de géolocalisation:', getErrorMessage(positionError));
    } else if (!isGeolocationAvailable) {
      console.warn(' Géolocalisation non supportée par ce navigateur');
    } else if (!isGeolocationEnabled) {
      console.warn('Géolocalisation non activée ou permission refusée');
    }

    console.log(' Utilisation de la position par défaut (Casablanca centre)');
  }

  return {
    userPosition,
    isLoading,
    error: positionError || null,
    isSupported: isGeolocationAvailable,
    getPosition,
  };
}

/**
 * Convertir l'erreur en message lisible
 */
function getErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Permission de géolocalisation refusée par l\'utilisateur';
    case error.POSITION_UNAVAILABLE:
      return 'Position indisponible. Vérifiez votre connexion et les services de localisation';
    case error.TIMEOUT:
      return 'Délai d\'attente dépassé pour obtenir la position';
    default:
      return 'Erreur inconnue de géolocalisation';
  }
}