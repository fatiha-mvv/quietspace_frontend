// "use client";

// import { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix pour les icônes par défaut
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// });

// interface Place {
//   id: number;
//   name: string;
//   lat: number;
//   lng: number;
//   address: string;
//   percentage: number;
// }

// interface MapComponentProps {
//   places: Place[];
// }
// export default function MapComponent({ places }: MapComponentProps) {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstanceRef = useRef<L.Map | null>(null);

//   useEffect(() => {
//     if (!mapRef.current || mapInstanceRef.current) return;

//     // Initialiser la carte
//     const map = L.map(mapRef.current).setView([33.5731, -7.5898], 13);

//     // Ajouter les tuiles OpenStreetMap
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors',
//     }).addTo(map);

//     mapInstanceRef.current = map;

//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (!mapInstanceRef.current) return;

//     // Supprimer tous les marqueurs existants
//     mapInstanceRef.current.eachLayer((layer) => {
//       if (layer instanceof L.Marker) {
//         mapInstanceRef.current?.removeLayer(layer);
//       }
//     });

//     // Ajouter les nouveaux marqueurs
//     places.forEach((place) => {
//       const marker = L.marker([place.lat, place.lng]).addTo(mapInstanceRef.current!);
//       marker.bindPopup(`
//         <div style="padding: 8px;">
//           <h3 style="font-weight: bold; margin-bottom: 4px;">${place.name}</h3>
//           <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${place.address}</p>
//           <span style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">
//             ${place.percentage}% calme
//           </span>
//         </div>
//       `);
//     });
//   }, [places]);

//   return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;

  
// }




////////////////////////////////////// FATIHA //////////////////////////////////////////////////////////////////////////////////////

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

interface MapComponentProps {
  places: LieuLike[];
}

export default function MapComponent({ places }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([33.5731, -7.5898], 13);

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

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    places.forEach((place) => {
      if (
        typeof place.lat !== 'number' ||
        typeof place.lng !== 'number' ||
        Number.isNaN(place.lat) ||
        Number.isNaN(place.lng)
      ) {
        return;
      }

      const marker = L.marker([place.lat, place.lng]).addTo(mapInstanceRef.current!);
      
      // Créer le popup avec un bouton
      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${place.name}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${place.address}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
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
  }, [places, router]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}