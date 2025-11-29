"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Coffee,
  BookOpen,
  Briefcase,
  GraduationCap,
  Heart,
  Search,
  SlidersHorizontal,
} from "lucide-react";

// Import dynamique du MapComponent
const MapComponent = dynamic(
  () => import("../../components/Map/MapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    ),
  },
);

// Types de lieux avec leurs icônes Lucide
const placeTypes = [
  {
    value: "BIBLIOTHEQUE",
    label: "Bibliothèque",
    Icon: BookOpen,
    color: "bg-blue-500",
  },
  { value: "CAFE", label: "Café", Icon: Coffee, color: "bg-amber-500" },
  {
    value: "COWORKING",
    label: "Coworking",
    Icon: Briefcase,
    color: "bg-purple-500",
  },
  {
    value: "SALLE_ETUDE",
    label: "Salle d'étude",
    Icon: GraduationCap,
    color: "bg-green-500",
  },
];

// Niveaux de calme
const calmLevels = [
  { value: "TRES_CALME", label: "Très calme", percentage: "85-100%" },
  { value: "CALME", label: "Calme", percentage: "70-84%" },
  { value: "ASSEZ_BRUYANT", label: "Assez bruyant", percentage: "50-69%" },
  { value: "TRES_BRUYANT", label: "Très bruyant", percentage: "0-49%" },
];

// Distances en mètres
const distances = [50, 100, 150, 200];

// Données de démonstration
const mockPlaces = [
  {
    id: 1,
    name: "Café Zen",
    type: "CAFE",
    distance: 200,
    calmLevel: "TRES_CALME",
    percentage: 85,
    lat: 33.5731,
    lng: -7.5898,
    isFavorite: false,
    address: "Boulevard Zerktouni, Casablanca",
    hours: "8h - 22h",
  },
  {
    id: 2,
    name: "BiblioCity",
    type: "BIBLIOTHEQUE",
    distance: 400,
    calmLevel: "CALME",
    percentage: 92,
    lat: 33.5889,
    lng: -7.6114,
    isFavorite: true,
    address: "Avenue Hassan II, Casablanca",
    hours: "9h - 20h",
  },
  {
    id: 3,
    name: "WorkHub",
    type: "COWORKING",
    distance: 800,
    calmLevel: "ASSEZ_BRUYANT",
    percentage: 55,
    lat: 33.5651,
    lng: -7.6037,
    isFavorite: false,
    address: "Rue Prince Moulay Abdellah, Casablanca",
    hours: "7h - 23h",
  },
  {
    id: 4,
    name: "Study Space",
    type: "SALLE_ETUDE",
    distance: 150,
    calmLevel: "TRES_CALME",
    percentage: 95,
    lat: 33.5791,
    lng: -7.5978,
    isFavorite: false,
    address: "Boulevard d'Anfa, Casablanca",
    hours: "8h - 21h",
  },
  {
    id: 5,
    name: "Café Central",
    type: "CAFE",
    distance: 320,
    calmLevel: "CALME",
    percentage: 78,
    lat: 33.595,
    lng: -7.6187,
    isFavorite: false,
    address: "Place Mohammed V, Casablanca",
    hours: "7h - 23h",
  },
];

export default function ExplorerPage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCalm, setSelectedCalm] = useState<string>("");
  const [selectedDistance, setSelectedDistance] = useState<number>(200);
  const [showFavorites, setShowFavorites] = useState(false);
  const [places, setPlaces] = useState(mockPlaces);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Filtrage des lieux
  const filteredPlaces = places.filter((place) => {
    if (
      searchQuery &&
      !place.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(place.type))
      return false;
    if (selectedCalm && place.calmLevel !== selectedCalm) return false;
    if (place.distance > selectedDistance * 1000) return false;
    if (showFavorites && !place.isFavorite) return false;
    return true;
  });

  // Toggle type de lieu
  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // Toggle favoris
  const toggleFavorite = (id: number) => {
    setPlaces((prev) =>
      prev.map((place) =>
        place.id === id ? { ...place, isFavorite: !place.isFavorite } : place,
      ),
    );
  };

  // Obtenir la couleur du niveau de calme
  const getCalmColor = (percentage: number) => {
    if (percentage >= 85) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  // Obtenir l'icône du type
  const getTypeIcon = (type: string) => {
    const placeType = placeTypes.find((pt) => pt.value === type);
    return placeType?.Icon || MapPin;
  };

  const getTypeColor = (type: string) => {
    const placeType = placeTypes.find((pt) => pt.value === type);
    return placeType?.color || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Explorer les Lieux
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Découvrez les meilleurs espaces de travail à Casablanca
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un lieu par nom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-3 pl-12 pr-4 transition focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                {/* Type Filter */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Type de lieu
                  </h3>
                  <div className="space-y-2">
                    {placeTypes.map((type) => {
                      const Icon = type.Icon;
                      const isSelected = selectedTypes.includes(type.value);
                      return (
                        <button
                          key={type.value}
                          onClick={() => toggleType(type.value)}
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition ${
                            isSelected
                              ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                              : "border-2 border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                          }`}
                        >
                          <div className={`rounded-lg p-2 ${type.color}`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span
                            className={`text-sm font-medium ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
                          >
                            {type.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calme Filter */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Niveau de calme
                  </h3>
                  <select
                    value={selectedCalm}
                    onChange={(e) => setSelectedCalm(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Tous les niveaux</option>
                    {calmLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label} ({level.percentage})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Distance Filter */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Distance maximale
                  </h3>
                  <select
                    value={selectedDistance}
                    onChange={(e) =>
                      setSelectedDistance(Number(e.target.value))
                    }
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    {distances.map((distance) => (
                      <option key={distance} value={distance}>
                        Dans un rayon de {distance}m
                      </option>
                    ))}
                  </select>
                </div>

                {/* Favoris Filter */}
                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 transition ${
                    showFavorites
                      ? "border-2 border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "border-2 border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${showFavorites ? "fill-current" : ""}`}
                  />
                  <span className="font-medium">Favoris uniquement</span>
                </button>

                {/* Reset Filters */}
                {(selectedTypes.length > 0 ||
                  selectedCalm ||
                  showFavorites) && (
                  <button
                    onClick={() => {
                      setSelectedTypes([]);
                      setSelectedCalm("");
                      setShowFavorites(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {/* Results Count & View Toggle */}
            <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {filteredPlaces.length}
                </span>{" "}
                lieu{filteredPlaces.length > 1 ? "x" : ""} trouvé
                {filteredPlaces.length > 1 ? "s" : ""}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg px-4 py-2 transition ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 transition ${
                    viewMode === "map"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  Carte
                </button>
              </div>
            </div>

            {/* List View */}
            {viewMode === "list" ? (
              <div className="space-y-4">
                {filteredPlaces.map((place) => {
                  const Icon = getTypeIcon(place.type);
                  return (
                    <div
                      key={place.id}
                      className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md dark:bg-gray-800"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-1 items-start gap-4">
                            <div
                              className={`rounded-xl p-3 ${getTypeColor(place.type)}`}
                            >
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                                {place.name}
                              </h3>
                              <p className="mb-3 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="h-4 w-4" />
                                {place.address}
                              </p>
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">
                                    {place.distance}m
                                  </span>
                                </span>
                                <span className="text-gray-300 dark:text-gray-600">
                                  •
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {place.hours}
                                </span>
                                <span className="text-gray-300 dark:text-gray-600">
                                  •
                                </span>
                                <span
                                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${getCalmColor(
                                    place.percentage,
                                  )}`}
                                >
                                  {place.percentage}% calme
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFavorite(place.id)}
                            className="flex-shrink-0 rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Heart
                              className={`h-6 w-6 ${
                                place.isFavorite
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Empty State */}
                {filteredPlaces.length === 0 && (
                  <div className="rounded-xl bg-white p-12 text-center shadow-sm dark:bg-gray-800">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      Aucun lieu trouvé
                    </h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                      Essayez d'ajuster vos filtres pour voir plus de résultats
                    </p>
                    <button
                      onClick={() => {
                        setSelectedTypes([]);
                        setSelectedCalm("");
                        setShowFavorites(false);
                        setSearchQuery("");
                      }}
                      className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
                    >
                      Réinitialiser tous les filtres
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Map View */
              <div
                className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800"
                style={{ height: "600px" }}
              >
                <MapComponent places={filteredPlaces} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
