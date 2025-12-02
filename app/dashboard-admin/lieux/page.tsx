"use client";

import { useEffect, useState, useRef } from "react";
import lieuxService, {
  CreateLieuData,
  Lieu,
} from "../../../services/lieux.service";
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
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [typesLieu, setTypesLieu] = useState<any[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    48.8566, 2.3522,
  ]);
  const [latitude, setLatitude] = useState<string>("48.8566");
  const [longitude, setLongitude] = useState<string>("2.3522");
  const [form, setForm] = useState<CreateLieuData>({
    nomLieu: "",
    descriptionLieu: "",
    geom: "POINT(2.3522 48.8566)",
    idTypeLieu: 0,
    adresseLieu: "",
    imageLieu: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "idTypeLieu" ? parseInt(value, 10) : value,
    }));
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLatitude(value);

    // Mettre à jour la position si la longitude est également définie
    if (longitude && value) {
      const lat = parseFloat(value);
      const lng = parseFloat(longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        const newPosition: [number, number] = [lat, lng];
        setSelectedPosition(newPosition);
        const geom = `POINT(${lng} ${lat})`;
        setForm((prev) => ({
          ...prev,
          geom: geom,
        }));
        console.log("Geom mis à jour depuis latitude:", geom);
      }
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLongitude(value);

    // Mettre à jour la position si la latitude est également définie
    if (latitude && value) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(value);
      if (!isNaN(lat) && !isNaN(lng)) {
        const newPosition: [number, number] = [lat, lng];
        setSelectedPosition(newPosition);
        const geom = `POINT(${lng} ${lat})`;
        setForm((prev) => ({
          ...prev,
          geom: geom,
        }));
        console.log("Geom mis à jour depuis longitude:", geom);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image est trop volumineuse. Taille maximale : 5MB");
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        alert("Le fichier doit être une image");
        return;
      }

      setSelectedImage(file);

      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMapClick = (latlng: L.LatLng) => {
    const newPosition: [number, number] = [latlng.lat, latlng.lng];
    setSelectedPosition(newPosition);
    setLatitude(latlng.lat.toFixed(6));
    setLongitude(latlng.lng.toFixed(6));
    const geom = `POINT(${latlng.lng} ${latlng.lat})`;
    setForm((prev) => ({
      ...prev,
      geom: geom,
    }));
    console.log("Geom mis à jour depuis carte:", geom);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // DEBUG: Vérifier ce qui est envoyé
  //   console.log("Données envoyées au backend:");
  //   console.log("Latitude:", latitude);
  //   console.log("Longitude:", longitude);
  //   console.log("Geom:", form.geom);
  //   console.log("Form complet:", form);

  //   // Validation
  //   if (!form.nomLieu.trim()) {
  //     alert("Le nom du lieu est requis");
  //     return;
  //   }

  //   if (!form.idTypeLieu || form.idTypeLieu === 0) {
  //     alert("Veuillez sélectionner un type de lieu");
  //     return;
  //   }

  //   // Validation des coordonnées
  //   const lat = parseFloat(latitude);
  //   const lng = parseFloat(longitude);
  //   if (isNaN(lat) || isNaN(lng)) {
  //     alert("Veuillez entrer des coordonnées valides");
  //     return;
  //   }

  //   if (lat < -90 || lat > 90) {
  //     alert("La latitude doit être comprise entre -90 et 90");
  //     return;
  //   }

  //   if (lng < -180 || lng > 180) {
  //     alert("La longitude doit être comprise entre -180 et 180");
  //     return;
  //   }

  //   try {
  //     setIsUploading(true);
  //     let imageUrl = form.imageLieu;

  //     // Si une nouvelle image est sélectionnée, l'uploader
  //     if (selectedImage) {
  //       try {
  //         imageUrl = await lieuxService.uploadImage(selectedImage);
  //         console.log("Image uploadée:", imageUrl);
  //       } catch (error) {
  //         console.error("Erreur lors de l'upload de l'image:", error);
  //         alert(
  //           "Erreur lors de l'upload de l'image. Le lieu sera enregistré sans image.",
  //         );
  //         imageUrl = "";
  //       }
  //     }

  //     const lieuData: CreateLieuData = {
  //       ...form,
  //       imageLieu: imageUrl,
  //     };

  //     if (editingId) {
  //       await lieuxService.update(editingId, lieuData);
  //       alert("Lieu modifié avec succès");
  //     } else {
  //       await lieuxService.create(lieuData);
  //       alert("Lieu ajouté avec succès");
  //     }

  //     // Réinitialiser le formulaire
  //     resetForm();
  //     fetchLieux();
  //   } catch (err) {
  //     console.error("Erreur lors de l'enregistrement:", err);
  //     alert(
  //       `Erreur lors de l'enregistrement du lieu: ${err instanceof Error ? err.message : "Erreur inconnue"}`,
  //     );
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ÉTAPE CRITIQUE : Toujours s'assurer que le geom est une string WKT valide
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    let geomToSend: string;

    if (!isNaN(lat) && !isNaN(lng)) {
      // Cas normal : utiliser les coordonnées actuelles
      geomToSend = `POINT(${lng} ${lat})`;
    } else {
      // Fallback : essayer d'extraire du geom existant
      const coords = parseGeom(form.geom || "POINT(0 0)");
      geomToSend = `POINT(${coords[1]} ${coords[0]})`;
    }

    // Mettre à jour le form avec le geom garanti en WKT
    setForm((prev) => ({
      ...prev,
      geom: geomToSend,
    }));

    console.log("=== DONNÉES FINALES ===");
    console.log("Geom garanti WKT:", geomToSend);
    console.log("Type:", typeof geomToSend);

    // Validation
    if (!form.nomLieu.trim()) {
      alert("Le nom du lieu est requis");
      return;
    }

    if (!form.idTypeLieu || form.idTypeLieu === 0) {
      alert("Veuillez sélectionner un type de lieu");
      return;
    }

    // Validation des coordonnées
    if (isNaN(lat) || isNaN(lng)) {
      alert("Veuillez entrer des coordonnées valides");
      return;
    }

    if (lat < -90 || lat > 90) {
      alert("La latitude doit être comprise entre -90 et 90");
      return;
    }

    if (lng < -180 || lng > 180) {
      alert("La longitude doit être comprise entre -180 et 180");
      return;
    }

    try {
      setIsUploading(true);
      let imageUrl = form.imageLieu;

      // Si une nouvelle image est sélectionnée, l'uploader
      if (selectedImage) {
        try {
          imageUrl = await lieuxService.uploadImage(selectedImage);
          console.log("Image uploadée:", imageUrl);
        } catch (error) {
          console.error("Erreur lors de l'upload de l'image:", error);
          alert(
            "Erreur lors de l'upload de l'image. Le lieu sera enregistré sans image.",
          );
          imageUrl = "";
        }
      }

      const lieuData: CreateLieuData = {
        ...form,
        geom: geomToSend, // ← Utiliser le geom garanti en WKT
        imageLieu: imageUrl,
      };

      console.log("Données envoyées au backend:", lieuData);

      if (editingId) {
        await lieuxService.update(editingId, lieuData);
        alert("Lieu modifié avec succès");
      } else {
        await lieuxService.create(lieuData);
        alert("Lieu ajouté avec succès");
      }

      // Réinitialiser le formulaire
      resetForm();
      fetchLieux();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      alert(
        `Erreur lors de l'enregistrement du lieu: ${err instanceof Error ? err.message : "Erreur inconnue"}`,
      );
    } finally {
      setIsUploading(false);
    }
  };
  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setEditingId(null);
    setForm({
      nomLieu: "",
      descriptionLieu: "",
      geom: "POINT(2.3522 48.8566)",
      idTypeLieu: 0,
      adresseLieu: "",
      imageLieu: "",
    });
    setSelectedPosition([48.8566, 2.3522]);
    setLatitude("48.8566");
    setLongitude("2.3522");
    setShowForm(false);
  };

  const handleEdit = (lieu: Lieu) => {
    // Utiliser la fonction parseGeom pour extraire correctement les coordonnées
    const coords = parseGeom(lieu.geom || "POINT(0 0)");
    const lat = coords[0];
    const lng = coords[1];

    console.log("Édition du lieu:", {
      nom: lieu.nomLieu,
      geom: lieu.geom,
      coordsExtracted: { lat, lng },
    });

    setForm({
      nomLieu: lieu.nomLieu || "",
      descriptionLieu: lieu.descriptionLieu || "",
      geom: lieu.geom || `POINT(${lng} ${lat})`,
      idTypeLieu: Number(lieu.idTypeLieu) || 0,
      adresseLieu: lieu.adresseLieu || "",
      imageLieu: lieu.imageLieu || "",
    });

    // Reset image selection mais garder l'aperçu de l'image existante
    setSelectedImage(null);
    setImagePreview(lieu.imageLieu || null);

    const newPosition: [number, number] = [lat, lng];
    setSelectedPosition(newPosition);
    setLatitude(lat.toString());
    setLongitude(lng.toString());

    setEditingId(lieu.idLieu);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce lieu ?")) {
      return;
    }

    try {
      await lieuxService.delete(id);
      alert("Lieu supprimé avec succès");
      fetchLieux();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert(
        `Erreur lors de la suppression du lieu: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      );
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const parseGeom = (geom: any): [number, number] => {
    if (!geom) return [0, 0];

    console.log("Type de geom:", typeof geom, "Valeur:", geom);

    // Cas 1: geom est un objet GeoJSON avec coordinates
    if (
      typeof geom === "object" &&
      geom.coordinates &&
      Array.isArray(geom.coordinates)
    ) {
      const [lng, lat] = geom.coordinates;
      console.log("Coordonnées extraites de l'objet:", { lat, lng });
      return [lat, lng];
    }

    // Cas 2: geom est une string au format WKT (Well-Known Text)
    if (typeof geom === "string") {
      const match = geom.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
      if (match) {
        const lng = parseFloat(match[1]);
        const lat = parseFloat(match[2]);
        console.log("Coordonnées extraites de la string:", { lat, lng });
        return [lat, lng];
      }
    }

    // Cas 3: geom est un objet avec x,y (format PostGIS)
    if (
      typeof geom === "object" &&
      geom.x !== undefined &&
      geom.y !== undefined
    ) {
      console.log("Coordonnées extraites de x,y:", {
        lat: geom.y,
        lng: geom.x,
      });
      return [geom.y, geom.x];
    }

    console.log("Format de geom non reconnu, retour [0,0]");
    return [0, 0];
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {lieux.length} lieu{lieux.length > 1 ? "x" : ""} trouvé
            {lieux.length > 1 ? "s" : ""}
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
              disabled={isUploading}
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
                  name="nomLieu"
                  placeholder="Nom du lieu"
                  value={form.nomLieu}
                  onChange={handleChange}
                  required
                  disabled={isUploading}
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Type de lieu *
                </label>
                <select
                  name="idTypeLieu"
                  value={form.idTypeLieu}
                  onChange={handleChange}
                  required
                  disabled={isUploading}
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="0">Choisir un type de lieu</option>
                  {typesLieu.map((type) => (
                    <option key={type.idTypeLieu} value={type.idTypeLieu}>
                      {type.typeLieu}
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
                  name="adresseLieu"
                  placeholder="Adresse complète"
                  value={form.adresseLieu}
                  onChange={handleChange}
                  disabled={isUploading}
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Latitude *
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 48.8566"
                    value={latitude}
                    onChange={handleLatitudeChange}
                    required
                    disabled={isUploading}
                    className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Longitude *
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 2.3522"
                    value={longitude}
                    onChange={handleLongitudeChange}
                    required
                    disabled={isUploading}
                    className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="descriptionLieu"
                  placeholder="Description du lieu"
                  value={form.descriptionLieu}
                  onChange={handleChange}
                  rows={4}
                  disabled={isUploading}
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Image du lieu
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploading}
                  className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
                </p>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 rounded border border-gray-200 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Carte pour visualiser la position */}
            <div className="col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Visualisation de la position sur la carte
                </label>
                <span className="text-sm text-gray-500">
                  Cliquez sur la carte pour changer la position
                </span>
              </div>
              <div className="h-64 overflow-hidden rounded-lg border border-gray-300">
                <MainMapContainer
                  selectedPosition={selectedPosition}
                  onMapClick={handleMapClick}
                />
              </div>
              <div className="mt-2 rounded border border-blue-100 bg-blue-50 p-3 text-sm text-gray-600">
                <p>
                  <strong>Position actuelle :</strong>
                </p>
                <p>
                  Lat: {selectedPosition[0].toFixed(6)}, Lng:{" "}
                  {selectedPosition[1].toFixed(6)}
                </p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="col-span-2 flex justify-end gap-4 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUploading}
                className="rounded border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex items-center gap-2 rounded bg-[#2B7FD8] px-6 py-2 font-medium text-white shadow-md shadow-[#2B7FD8]/20 transition-colors hover:bg-[#4A90E2] disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>{editingId ? "Modifier le lieu" : "Ajouter le lieu"}</>
                )}
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
        ) : lieux.length === 0 ? (
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
                    Nom
                  </th>
                  <th className="border-b p-4 font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="border-b p-4 font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="border-b p-4 font-semibold text-gray-700">
                    Adresse
                  </th>
                  <th className="border-b p-4 font-semibold text-gray-700">
                    Coordonnées
                  </th>
                  <th className="border-b p-4 font-semibold text-gray-700">
                    Score Calme
                  </th>
                  <th className="border-b p-4 font-semibold text-gray-700">
                    Niveau Calme
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
                {lieux.map((lieu) => {
                  const coords = parseGeom(lieu.geom || "POINT(0 0)");
                  return (
                    <tr
                      key={lieu.idLieu}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {lieu.nomLieu}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="max-w-xs truncate text-sm text-gray-600">
                          {lieu.descriptionLieu || "Pas de description"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                          {lieu.typeLieu?.typeLieu || "Non spécifié"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="max-w-xs truncate">
                          {lieu.adresseLieu || "Non renseignée"}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div>Lat: {coords[0].toFixed(4)}</div>
                        <div>Lng: {coords[1].toFixed(4)}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-center">
                          <div
                            className={`text-lg font-semibold ${lieu.scoreCalme ? "text-gray-900" : "text-gray-400"}`}
                          >
                            {lieu.scoreCalme || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-center">
                          <div
                            className={`text-sm ${lieu.niveauCalme ? "text-gray-700" : "text-gray-400"}`}
                          >
                            {lieu.niveauCalme || "Non défini"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {lieu.imageLieu ? (
                          <img
                            src={lieu.imageLieu}
                            alt={lieu.nomLieu}
                            className="h-16 w-16 rounded border border-gray-200 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/placeholder.jpg";
                              target.onerror = null;
                            }}
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded border border-gray-200 bg-gray-100">
                            <svg
                              className="h-8 w-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(lieu)}
                            className="flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            title="Modifier"
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
                          </button>

                          <button
                            onClick={() => handleDelete(lieu.idLieu)}
                            className="flex items-center gap-2 rounded bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                            title="Supprimer"
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

      <style jsx>{`
        .main-map {
          cursor: crosshair;
        }
      `}</style>
    </div>
  );
}
