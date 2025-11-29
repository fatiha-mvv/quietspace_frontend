// "use client";

// import { useEffect, useState, useRef } from "react";
// import { lieuxService } from "../../../services/lieux.service";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   useMapEvents,
//   useMap,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Correction des icônes Leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "/images/marker-icon-2x.png",
//   iconUrl: "/images/marker-icon.png",
//   shadowUrl: "/images/marker-shadow.png",
// });

// // Composant pour gérer les clics sur la carte
// function MapClickHandler({
//   onMapClick,
// }: {
//   onMapClick: (latlng: L.LatLng) => void;
// }) {
//   useMapEvents({
//     click: (e) => {
//       onMapClick(e.latlng);
//     },
//   });
//   return null;
// }

// // Composant pour contrôler le centre et le zoom de la carte principale
// function MapController({
//   center,
//   zoom,
// }: {
//   center: [number, number];
//   zoom: number;
// }) {
//   const map = useMap();

//   useEffect(() => {
//     map.setView(center, zoom);
//   }, [center, zoom, map]);

//   return null;
// }

// // Composant pour les mini-cartes dans le tableau
// function MiniMapController({ position }: { position: [number, number] }) {
//   const map = useMap();

//   useEffect(() => {
//     map.setView(position, 14);
//     // Désactiver les interactions pour les mini-cartes
//     map.dragging.disable();
//     map.touchZoom.disable();
//     map.doubleClickZoom.disable();
//     map.scrollWheelZoom.disable();
//     map.boxZoom.disable();
//     map.keyboard.disable();
//   }, [position, map]);

//   return null;
// }

// // Composant container pour les mini-cartes
// function MiniMapContainer({ position }: { position: [number, number] }) {
//   const mapRef = useRef<L.Map>(null);

//   return (
//     <MapContainer
//       ref={mapRef}
//       style={{ height: "100%", width: "100%" }}
//       className="mini-map"
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <MiniMapController position={position} />
//       <Marker position={position} />
//     </MapContainer>
//   );
// }

// // Composant pour la carte principale avec gestion du zoom
// function MainMapContainer({
//   selectedPosition,
//   onMapClick,
// }: {
//   selectedPosition: [number, number];
//   onMapClick: (latlng: L.LatLng) => void;
// }) {
//   const mapRef = useRef<L.Map>(null);

//   return (
//     <MapContainer
//       ref={mapRef}
//       style={{ height: "100%", width: "100%" }}
//       className="main-map"
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <MapController center={selectedPosition} zoom={13} />
//       <MapClickHandler onMapClick={onMapClick} />
//       <Marker position={selectedPosition} />
//     </MapContainer>
//   );
// }

// export default function AdminLieuxPage() {
//   const [lieux, setLieux] = useState<any[]>([]);
//   const [form, setForm] = useState({
//     id_lieu: "",
//     nom_lieu: "",
//     description_lieu: "",
//     geom: "POINT(0 0)",
//     id_type_lieu: "",
//     adresse_lieu: "",
//     image_lieu: "",
//   });
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
//     48.8566, 2.3522,
//   ]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     fetchLieux();
//   }, []);

//   const fetchLieux = async () => {
//     try {
//       setIsLoading(true);
//       const data = await lieuxService.getAll();
//       setLieux(data);
//     } catch (error) {
//       console.error("Erreur lors du chargement des lieux:", error);
//       alert("Erreur lors du chargement des lieux");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleMapClick = (latlng: L.LatLng) => {
//     const newPosition: [number, number] = [latlng.lat, latlng.lng];
//     setSelectedPosition(newPosition);
//     setForm({ ...form, geom: `POINT(${latlng.lng} ${latlng.lat})` });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await lieuxService.update(editingId, form);
//         setEditingId(null);
//       } else {
//         await lieuxService.create(form);
//       }
//       // Réinitialiser le formulaire
//       setForm({
//         id_lieu: "",
//         nom_lieu: "",
//         description_lieu: "",
//         geom: "POINT(0 0)",
//         id_type_lieu: "",
//         adresse_lieu: "",
//         image_lieu: "",
//       });
//       setSelectedPosition([48.8566, 2.3522]);
//       setShowForm(false);
//       fetchLieux();
//     } catch (err) {
//       console.error(err);
//       alert("Erreur lors de l'enregistrement du lieu");
//     }
//   };

//   const handleEdit = (lieu: any) => {
//     setForm({
//       id_lieu: lieu.id_lieu.toString(),
//       nom_lieu: lieu.nom_lieu || "",
//       description_lieu: lieu.description_lieu || "",
//       geom: lieu.geom || "POINT(0 0)",
//       id_type_lieu: lieu.id_type_lieu?.toString() || "",
//       adresse_lieu: lieu.adresse_lieu || "",
//       image_lieu: lieu.image_lieu || "",
//     });

//     const match = lieu.geom?.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
//     if (match) {
//       const lng = parseFloat(match[1]);
//       const lat = parseFloat(match[2]);
//       const newPosition: [number, number] = [lat, lng];
//       setSelectedPosition(newPosition);
//     }
//     setEditingId(lieu.id_lieu);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (confirm("Voulez-vous vraiment supprimer ce lieu ?")) {
//       try {
//         await lieuxService.delete(id);
//         fetchLieux();
//       } catch (error) {
//         console.error("Erreur lors de la suppression:", error);
//         alert("Erreur lors de la suppression du lieu");
//       }
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setForm({
//       id_lieu: "",
//       nom_lieu: "",
//       description_lieu: "",
//       geom: "POINT(0 0)",
//       id_type_lieu: "",
//       adresse_lieu: "",
//       image_lieu: "",
//     });
//     setSelectedPosition([48.8566, 2.3522]);
//     setShowForm(false);
//   };

//   const parseGeom = (geom: string): [number, number] => {
//     if (!geom) return [0, 0];

//     const match = geom.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
//     if (match) {
//       const lng = parseFloat(match[1]);
//       const lat = parseFloat(match[2]);
//       return [lat, lng];
//     }
//     return [0, 0];
//   };

//   const filteredLieux = lieux.filter((lieu) => {
//     if (filter === "all") return true;
//     if (filter === "active") return true; // Vous pouvez adapter selon vos besoins
//     return true;
//   });

//   return (
//     <div className="space-y-6">
//       {/* En-tête avec filtres et bouton d'ajout */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setFilter("all")}
//             className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
//               filter === "all"
//                 ? "border-[#2B7FD8] bg-[#2B7FD8] text-white shadow-md shadow-[#2B7FD8]/20"
//                 : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//           >
//             Tous les lieux
//           </button>
//           <button
//             onClick={() => setFilter("active")}
//             className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
//               filter === "active"
//                 ? "border-[#2B7FD8] bg-[#2B7FD8] text-white shadow-md shadow-[#2B7FD8]/20"
//                 : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
//             }`}
//           >
//             Lieux actifs
//           </button>
//           <div className="text-sm text-gray-500">
//             {filteredLieux.length} lieu{filteredLieux.length > 1 ? "x" : ""}{" "}
//             trouvé{filteredLieux.length > 1 ? "s" : ""}
//           </div>
//         </div>

//         <button
//           onClick={() => setShowForm(true)}
//           className="flex items-center gap-2 rounded-lg bg-[#2B7FD8] px-4 py-2 text-sm font-medium text-white shadow-md shadow-[#2B7FD8]/20 transition-colors hover:bg-[#4A90E2]"
//         >
//           <svg
//             width="16"
//             height="16"
//             viewBox="0 0 16 16"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//           >
//             <path d="M8 1v14M1 8h14" strokeLinecap="round" />
//           </svg>
//           Ajouter un lieu
//         </button>
//       </div>

//       {/* Formulaire d'ajout/modification */}
//       {showForm && (
//         <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-900">
//               {editingId ? "Modifier le lieu" : "Ajouter un nouveau lieu"}
//             </h2>
//             <button
//               onClick={handleCancel}
//               className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
//             >
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 20 20"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path d="M15 5L5 15M5 5l10 10" strokeLinecap="round" />
//               </svg>
//             </button>
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 gap-4 md:grid-cols-2"
//           >
//             <div className="space-y-4">
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   ID Lieu
//                 </label>
//                 <input
//                   type="number"
//                   name="id_lieu"
//                   placeholder="ID du lieu"
//                   value={form.id_lieu}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Nom du lieu
//                 </label>
//                 <input
//                   type="text"
//                   name="nom_lieu"
//                   placeholder="Nom du lieu"
//                   value={form.nom_lieu}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Type de lieu
//                 </label>
//                 <select
//                   name="id_type_lieu"
//                   value={form.id_type_lieu}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Choisir un type de lieu</option>
//                   <option value="1">Bibliothèque</option>
//                   <option value="2">Café</option>
//                   <option value="3">Parc</option>
//                   <option value="4">Restaurant</option>
//                   <option value="5">Musée</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Adresse
//                 </label>
//                 <input
//                   type="text"
//                   name="adresse_lieu"
//                   placeholder="Adresse complète"
//                   value={form.adresse_lieu}
//                   onChange={handleChange}
//                   className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Description
//                 </label>
//                 <input
//                   type="text"
//                   name="description_lieu"
//                   placeholder="Description du lieu"
//                   value={form.description_lieu}
//                   onChange={handleChange}
//                   className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   URL de l'image
//                 </label>
//                 <input
//                   type="text"
//                   name="image_lieu"
//                   placeholder="/images/nom-image.jpg"
//                   value={form.image_lieu}
//                   onChange={handleChange}
//                   className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="rounded border border-blue-100 bg-blue-50 p-3 text-sm text-gray-600">
//                 <p>
//                   <strong>Position sélectionnée :</strong>
//                 </p>
//                 <p>
//                   Lat: {selectedPosition[0].toFixed(6)}, Lng:{" "}
//                   {selectedPosition[1].toFixed(6)}
//                 </p>
//                 <p className="mt-1 text-xs">
//                   Cliquez sur la carte pour changer la position
//                 </p>
//               </div>
//             </div>

//             {/* Carte pour choisir la position */}
//             <div className="col-span-2 h-64 overflow-hidden rounded-lg border border-gray-300">
//               <MainMapContainer
//                 selectedPosition={selectedPosition}
//                 onMapClick={handleMapClick}
//               />
//             </div>

//             {/* Boutons d'action */}
//             <div className="col-span-2 flex justify-end gap-4 border-t border-gray-200 pt-4">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="rounded border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
//               >
//                 Annuler
//               </button>
//               <button
//                 type="submit"
//                 className="rounded bg-[#2B7FD8] px-6 py-2 font-medium text-white shadow-md shadow-[#2B7FD8]/20 transition-colors hover:bg-[#4A90E2]"
//               >
//                 {editingId ? "Modifier le lieu" : "Ajouter le lieu"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Liste des lieux */}
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
//         {isLoading ? (
//           <div className="p-8 text-center">
//             <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
//             <p className="mt-2 text-gray-600">Chargement des lieux...</p>
//           </div>
//         ) : filteredLieux.length === 0 ? (
//           <div className="p-8 text-center text-gray-500">
//             <svg
//               className="mx-auto mb-4 h-12 w-12 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//               />
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//               />
//             </svg>
//             <p className="mb-2 text-lg font-medium text-gray-900">
//               Aucun lieu trouvé
//             </p>
//             <p className="mb-4 text-gray-500">
//               Commencez par ajouter votre premier lieu.
//             </p>
//             <button
//               onClick={() => setShowForm(true)}
//               className="rounded-lg bg-[#2B7FD8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4A90E2]"
//             >
//               + Ajouter un lieu
//             </button>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="border-b p-4 font-semibold text-gray-700">
//                     ID
//                   </th>
//                   <th className="border-b p-4 font-semibold text-gray-700">
//                     Nom
//                   </th>
//                   <th className="border-b p-4 font-semibold text-gray-700">
//                     Type
//                   </th>
//                   <th className="border-b p-4 font-semibold text-gray-700">
//                     Adresse
//                   </th>
//                   <th className="border-b p-4 font-semibold text-gray-700">
//                     Position
//                   </th>
//                   <th className="border-b p-4 font-semibold text-gray-700">
//                     Image
//                   </th>
//                   <th className="border-b p-4 font-semibold text-gray-700">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredLieux.map((lieu) => {
//                   const position = parseGeom(lieu.geom);

//                   return (
//                     <tr
//                       key={lieu.id_lieu}
//                       className="border-b border-gray-100 hover:bg-gray-50"
//                     >
//                       <td className="p-4 font-medium text-gray-900">
//                         {lieu.id_lieu}
//                       </td>
//                       <td className="p-4">
//                         <div>
//                           <div className="font-medium text-gray-900">
//                             {lieu.nom_lieu}
//                           </div>
//                           {lieu.description_lieu && (
//                             <div className="mt-1 line-clamp-2 text-sm text-gray-500">
//                               {lieu.description_lieu}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
//                           {lieu.typeLieu?.type_lieu || "Non spécifié"}
//                         </span>
//                       </td>
//                       <td className="p-4 text-sm text-gray-600">
//                         {lieu.adresse_lieu || "Non renseignée"}
//                       </td>
//                       <td className="p-4">
//                         <div className="h-24 w-32 overflow-hidden rounded border border-gray-200">
//                           <MiniMapContainer position={position} />
//                         </div>
//                         <div className="mt-1 text-xs text-gray-500">
//                           {position[0].toFixed(4)}, {position[1].toFixed(4)}
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         {lieu.image_lieu ? (
//                           <img
//                             src={lieu.image_lieu}
//                             alt={lieu.nom_lieu}
//                             className="h-16 w-16 rounded border border-gray-200 object-cover"
//                             onError={(e) => {
//                               (e.target as HTMLImageElement).src =
//                                 "/images/placeholder.jpg";
//                             }}
//                           />
//                         ) : (
//                           <div className="flex h-16 w-16 items-center justify-center rounded border border-gray-200 bg-gray-100">
//                             <span className="text-xs text-gray-400">
//                               Aucune image
//                             </span>
//                           </div>
//                         )}
//                       </td>
//                       <td className="p-4">
//                         <div className="flex flex-col gap-2">
//                           <button
//                             onClick={() => handleEdit(lieu)}
//                             className="flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
//                           >
//                             <svg
//                               width="14"
//                               height="14"
//                               viewBox="0 0 14 14"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             >
//                               <path d="M11.5 1.5a1.121 1.121 0 1 1 1.5 1.5l-1 1-1.5-1.5 1-1z" />
//                               <path d="m10.5 2.5-8 8-1.5 3.5 3.5-1.5 8-8" />
//                             </svg>
//                             Modifier
//                           </button>
//                           <button
//                             onClick={() => handleDelete(lieu.id_lieu)}
//                             className="flex items-center gap-2 rounded bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
//                           >
//                             <svg
//                               width="14"
//                               height="14"
//                               viewBox="0 0 14 14"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             >
//                               <path d="M11.5 3.5h-9M5.5 6v4M8.5 6v4M1.5 3.5h11v9a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-9zM4.5 3.5v-2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
//                             </svg>
//                             Supprimer
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Styles CSS pour désactiver les interactions sur les mini-cartes */}
//       <style jsx>{`
//         .mini-map {
//           pointer-events: none;
//         }
//         .main-map {
//           cursor: crosshair;
//         }
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import lieuxService, { CreateLieuData } from "../../../services/lieux.service"; // Importer la nouvelle interface
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Correction des icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/marker-icon-2x.png",
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});

// Composant pour gérer les clics sur la carte
function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (latlng: L.LatLng) => void;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Composant pour contrôler le centre et le zoom de la carte principale
function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

// Composant pour les mini-cartes dans le tableau
function MiniMapController({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 14);
    // Désactiver les interactions pour les mini-cartes
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
  }, [position, map]);

  return null;
}

// Composant container pour les mini-cartes
function MiniMapContainer({ position }: { position: [number, number] }) {
  const mapRef = useRef<L.Map>(null);

  return (
    <MapContainer
      ref={mapRef}
      style={{ height: "100%", width: "100%" }}
      className="mini-map"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MiniMapController position={position} />
      <Marker position={position} />
    </MapContainer>
  );
}

// Composant pour la carte principale avec gestion du zoom
function MainMapContainer({
  selectedPosition,
  onMapClick,
}: {
  selectedPosition: [number, number];
  onMapClick: (latlng: L.LatLng) => void;
}) {
  const mapRef = useRef<L.Map>(null);

  return (
    <MapContainer
      ref={mapRef}
      style={{ height: "100%", width: "100%" }}
      className="main-map"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapController center={selectedPosition} zoom={13} />
      <MapClickHandler onMapClick={onMapClick} />
      <Marker position={selectedPosition} />
    </MapContainer>
  );
}

export default function AdminLieuxPage() {
  const [lieux, setLieux] = useState<any[]>([]);
  const [typesLieu, setTypesLieu] = useState<any[]>([]);
  const [form, setForm] = useState<CreateLieuData>({
    nom_lieu: "",
    description_lieu: "",
    geom: "POINT(0 0)",
    id_type_lieu: 0, // Changer en number et 0 par défaut
    adresse_lieu: "",
    image_lieu: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    48.8566, 2.3522,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchLieux();
    fetchTypesLieu();
  }, []);

  const fetchLieux = async () => {
    try {
      setIsLoading(true);
      const data = await lieuxService.getAll();
      setLieux(data);
    } catch (error) {
      console.error("Erreur lors du chargement des lieux:", error);
      alert("Erreur lors du chargement des lieux");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTypesLieu = async () => {
    try {
      const data = await lieuxService.getTypesLieu();
      setTypesLieu(data);
    } catch (error) {
      console.error("Erreur lors du chargement des types de lieu:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "id_type_lieu" ? parseInt(value, 10) : value,
    }));
  };

  const handleMapClick = (latlng: L.LatLng) => {
    const newPosition: [number, number] = [latlng.lat, latlng.lng];
    setSelectedPosition(newPosition);
    setForm((prev) => ({
      ...prev,
      geom: `POINT(${latlng.lng} ${latlng.lat})`,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await lieuxService.update(editingId, form);
        setEditingId(null);
      } else {
        await lieuxService.create(form);
      }
      // Réinitialiser le formulaire
      setForm({
        nom_lieu: "",
        description_lieu: "",
        geom: "POINT(0 0)",
        id_type_lieu: 0,
        adresse_lieu: "",
        image_lieu: "",
      });
      setSelectedPosition([48.8566, 2.3522]);
      setShowForm(false);
      fetchLieux();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du lieu");
    }
  };

  const handleEdit = (lieu: any) => {
    setForm({
      nom_lieu: lieu.nom_lieu || "",
      description_lieu: lieu.description_lieu || "",
      geom: lieu.geom || "POINT(0 0)",
      id_type_lieu: lieu.id_type_lieu || 0,
      adresse_lieu: lieu.adresse_lieu || "",
      image_lieu: lieu.image_lieu || "",
    });

    const match = lieu.geom?.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
    if (match) {
      const lng = parseFloat(match[1]);
      const lat = parseFloat(match[2]);
      const newPosition: [number, number] = [lat, lng];
      setSelectedPosition(newPosition);
    }
    setEditingId(lieu.id_lieu);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce lieu ?")) {
      try {
        await lieuxService.delete(id);
        fetchLieux();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du lieu");
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      nom_lieu: "",
      description_lieu: "",
      geom: "POINT(0 0)",
      id_type_lieu: 0,
      adresse_lieu: "",
      image_lieu: "",
    });
    setSelectedPosition([48.8566, 2.3522]);
    setShowForm(false);
  };

  const parseGeom = (geom: string): [number, number] => {
    if (!geom) return [0, 0];

    const match = geom.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
    if (match) {
      const lng = parseFloat(match[1]);
      const lat = parseFloat(match[2]);
      return [lat, lng];
    }
    return [0, 0];
  };

  const filteredLieux = lieux.filter((lieu) => {
    if (filter === "all") return true;
    if (filter === "active") return true; // Vous pouvez adapter selon vos besoins
    return true;
  });

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres et bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              filter === "all"
                ? "border-[#2B7FD8] bg-[#2B7FD8] text-white shadow-md shadow-[#2B7FD8]/20"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Tous les lieux
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              filter === "active"
                ? "border-[#2B7FD8] bg-[#2B7FD8] text-white shadow-md shadow-[#2B7FD8]/20"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Lieux actifs
          </button>
          <div className="text-sm text-gray-500">
            {filteredLieux.length} lieu{filteredLieux.length > 1 ? "x" : ""}{" "}
            trouvé{filteredLieux.length > 1 ? "s" : ""}
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-[#2B7FD8] px-4 py-2 text-sm font-medium text-white shadow-md shadow-[#2B7FD8]/20 transition-colors hover:bg-[#4A90E2]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 1v14M1 8h14" strokeLinecap="round" />
          </svg>
          Ajouter un lieu
        </button>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? "Modifier le lieu" : "Ajouter un nouveau lieu"}
            </h2>
            <button
              onClick={handleCancel}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 5L5 15M5 5l10 10" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nom du lieu *
                </label>
                <input
                  type="text"
                  name="nom_lieu"
                  placeholder="Nom du lieu"
                  value={form.nom_lieu}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Type de lieu *
                </label>
                <select
                  name="id_type_lieu"
                  value={form.id_type_lieu}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">Choisir un type de lieu</option>
                  {typesLieu.map((type) => (
                    <option key={type.id_type_lieu} value={type.id_type_lieu}>
                      {type.type_lieu}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <input
                  type="text"
                  name="adresse_lieu"
                  placeholder="Adresse complète"
                  value={form.adresse_lieu}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  name="description_lieu"
                  placeholder="Description du lieu"
                  value={form.description_lieu}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  URL de l'image
                </label>
                <input
                  type="text"
                  name="image_lieu"
                  placeholder="/images/nom-image.jpg"
                  value={form.image_lieu}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="rounded border border-blue-100 bg-blue-50 p-3 text-sm text-gray-600">
                <p>
                  <strong>Position sélectionnée :</strong>
                </p>
                <p>
                  Lat: {selectedPosition[0].toFixed(6)}, Lng:{" "}
                  {selectedPosition[1].toFixed(6)}
                </p>
                <p className="mt-1 text-xs">
                  Cliquez sur la carte pour changer la position
                </p>
              </div>
            </div>

            {/* Carte pour choisir la position */}
            <div className="col-span-2 h-64 overflow-hidden rounded-lg border border-gray-300">
              <MainMapContainer
                selectedPosition={selectedPosition}
                onMapClick={handleMapClick}
              />
            </div>

            {/* Boutons d'action */}
            <div className="col-span-2 flex justify-end gap-4 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="rounded bg-[#2B7FD8] px-6 py-2 font-medium text-white shadow-md shadow-[#2B7FD8]/20 transition-colors hover:bg-[#4A90E2]"
              >
                {editingId ? "Modifier le lieu" : "Ajouter le lieu"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des lieux */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Chargement des lieux...</p>
          </div>
        ) : filteredLieux.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg
              className="mx-auto mb-4 h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="mb-2 text-lg font-medium text-gray-900">
              Aucun lieu trouvé
            </p>
            <p className="mb-4 text-gray-500">
              Commencez par ajouter votre premier lieu.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-[#2B7FD8] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4A90E2]"
            >
              + Ajouter un lieu
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border-b p-4 font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="border-b p-4 font-semibold text-gray-700">
                    Nom
                  </th>
                  <th className="border-b p-4 font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="border-b p-4 font-semibold text-gray-700">
                    Adresse
                  </th>
                  <th className="border-b p-4 font-semibold text-gray-700">
                    Position
                  </th>
                  <th className="border-b p-4 font-semibold text-gray-700">
                    Image
                  </th>
                  <th className="border-b p-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLieux.map((lieu) => {
                  const position = parseGeom(lieu.geom);

                  return (
                    <tr
                      key={lieu.id_lieu}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        {lieu.id_lieu}
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {lieu.nom_lieu}
                          </div>
                          {lieu.description_lieu && (
                            <div className="mt-1 line-clamp-2 text-sm text-gray-500">
                              {lieu.description_lieu}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                          {lieu.typeLieu?.type_lieu || "Non spécifié"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {lieu.adresse_lieu || "Non renseignée"}
                      </td>
                      <td className="p-4">
                        <div className="h-24 w-32 overflow-hidden rounded border border-gray-200">
                          <MiniMapContainer position={position} />
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {position[0].toFixed(4)}, {position[1].toFixed(4)}
                        </div>
                      </td>
                      <td className="p-4">
                        {lieu.image_lieu ? (
                          <img
                            src={lieu.image_lieu}
                            alt={lieu.nom_lieu}
                            className="h-16 w-16 rounded border border-gray-200 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/placeholder.jpg";
                            }}
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded border border-gray-200 bg-gray-100">
                            <span className="text-xs text-gray-400">
                              Aucune image
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleEdit(lieu)}
                            className="flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11.5 1.5a1.121 1.121 0 1 1 1.5 1.5l-1 1-1.5-1.5 1-1z" />
                              <path d="m10.5 2.5-8 8-1.5 3.5 3.5-1.5 8-8" />
                            </svg>
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(lieu.id_lieu)}
                            className="flex items-center gap-2 rounded bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11.5 3.5h-9M5.5 6v4M8.5 6v4M1.5 3.5h11v9a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-9zM4.5 3.5v-2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
                            </svg>
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Styles CSS pour désactiver les interactions sur les mini-cartes */}
      <style jsx>{`
        .mini-map {
          pointer-events: none;
        }
        .main-map {
          cursor: crosshair;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
