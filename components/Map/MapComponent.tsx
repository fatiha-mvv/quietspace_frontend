"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes par défaut
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LieuLike {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  scoreCalme: number;
}

interface UserPosition {
  latitude: number;
  longitude: number;
  isDefault: boolean;
  accuracy?: number;
}

interface MapComponentProps {
  places: LieuLike[];
  userPosition?: UserPosition | null;
  showUserPosition?: boolean;
}

export default function MapComponent({ 
  places, 
  userPosition,
  showUserPosition = true 
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const router = useRouter();

  // Initialiser la carte
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Déterminer le centre initial (position utilisateur ou Casablanca par défaut)
    const initialCenter: [number, number] = userPosition 
      ? [userPosition.latitude, userPosition.longitude]
      : [33.5731, -7.5898];

    const map = L.map(mapRef.current).setView(initialCenter, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Mettre à jour la position utilisateur
  useEffect(() => {
    if (!mapInstanceRef.current || !showUserPosition || !userPosition) return;

    // Supprimer l'ancien marqueur utilisateur s'il existe
    if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    // Supprimer l'ancien cercle de précision s'il existe
    if (accuracyCircleRef.current) {
      mapInstanceRef.current.removeLayer(accuracyCircleRef.current);
      accuracyCircleRef.current = null;
    }

    // Créer une icône personnalisée pour l'utilisateur
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div style="position: relative; width: 24px; height: 24px;">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 16px;
            height: 16px;
            background: ${userPosition.isDefault ? '#f59e0b' : '#3b82f6'};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>
          ${userPosition.isDefault ? '' : `
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 32px;
              height: 32px;
              background: rgba(59, 130, 246, 0.2);
              border: 2px solid rgba(59, 130, 246, 0.4);
              border-radius: 50%;
              animation: pulse 2s ease-in-out infinite;
            "></div>
          `}
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.3; }
          }
        </style>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // Ajouter le marqueur utilisateur
    const userMarker = L.marker(
      [userPosition.latitude, userPosition.longitude],
      { icon: userIcon }
    ).addTo(mapInstanceRef.current);

    // Créer le popup pour l'utilisateur
    const positionType = userPosition.isDefault 
      ? '📍 Position par défaut (Casablanca centre)'
      : '📍 Votre position actuelle';
    
    const accuracyText = userPosition.accuracy 
      ? `<br/>Précision: ±${Math.round(userPosition.accuracy)}m`
      : '';

    userMarker.bindPopup(`
      <div style="padding: 8px; min-width: 200px; text-align: center;">
        <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">
          ${positionType}
        </h3>
        <p style="font-size: 12px; color: #666; margin: 0;">
          ${userPosition.latitude.toFixed(6)}°, ${userPosition.longitude.toFixed(6)}°
          ${accuracyText}
        </p>
      </div>
    `);

    userMarkerRef.current = userMarker;

    // Ajouter un cercle de précision si disponible et si ce n'est pas la position par défaut
    if (userPosition.accuracy && !userPosition.isDefault) {
      const accuracyCircle = L.circle(
        [userPosition.latitude, userPosition.longitude],
        {
          radius: userPosition.accuracy,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          weight: 1,
        }
      ).addTo(mapInstanceRef.current);

      accuracyCircleRef.current = accuracyCircle;
    }

    // Centrer la carte sur la position utilisateur si c'est la première fois
    if (places.length === 0 || userPosition.isDefault) {
      mapInstanceRef.current.setView(
        [userPosition.latitude, userPosition.longitude],
        userPosition.isDefault ? 13 : 15
      );
    }

  }, [userPosition, showUserPosition, places.length]);

  // Mettre à jour les marqueurs des lieux
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Supprimer tous les marqueurs de lieux (mais pas l'utilisateur)
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer !== userMarkerRef.current) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    // Si on a des lieux, ajuster la vue pour tout montrer
    if (places.length > 0) {
      const bounds = L.latLngBounds(
        places.map(place => [place.lat, place.lng] as [number, number])
      );

      // Inclure la position utilisateur dans les bounds si disponible
      if (userPosition && !userPosition.isDefault) {
        bounds.extend([userPosition.latitude, userPosition.longitude]);
      }

      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    // Ajouter les marqueurs des lieux
    places.forEach((place) => {
      if (
        typeof place.lat !== 'number' ||
        typeof place.lng !== 'number' ||
        Number.isNaN(place.lat) ||
        Number.isNaN(place.lng)
      ) {
        return;
      }

      // Créer une icône personnalisée selon le score de calme
      const getCalmColor = (score: number): string => {
        if (score >= 85) return '#10b981'; // vert
        if (score >= 70) return '#3b82f6'; // bleu
        if (score >= 50) return '#f59e0b'; // orange
        return '#ef4444'; // rouge
      };

      const placeIcon = L.divIcon({
        className: 'place-marker',
        html: `
          <div style="
            background: ${getCalmColor(place.scoreCalme)};
            color: white;
            border: 3px solid white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            ${place.scoreCalme}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([place.lat, place.lng], { icon: placeIcon })
        .addTo(mapInstanceRef.current!);
      
      // Créer le popup avec un bouton
      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${place.name}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${place.address}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span style="background: ${getCalmColor(place.scoreCalme)}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
              ${place.scoreCalme}% calme
            </span>
            <button 
              id="view-details-${place.id}" 
              style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;"
            >
              Voir détails
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Ajouter l'événement au clic sur le bouton
      marker.on('popupopen', () => {
        const button = document.getElementById(`view-details-${place.id}`);
        if (button) {
          button.addEventListener('click', () => {
            router.push(`/lieux-details/${place.id}`);
          });
        }
      });
    });
  }, [places, router, userPosition]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}