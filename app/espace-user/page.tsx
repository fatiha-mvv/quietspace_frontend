"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Loader2,
  RefreshCw,
  MapPinOff,
} from "lucide-react";
import lieuxUserService, { Lieu, TypeLieu } from "../../services/lieux-user";
import authService from "../../services/auth.service";
import { useUserLocation } from "../../app/hooks/useUserLocation";

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

// Configuration des icônes et couleurs pour les types de lieux
const placeTypesConfig = {
  BIBLIOTHEQUE: { Icon: BookOpen, color: "bg-blue-500", label: "Bibliothèque" },
  CAFE: { Icon: Coffee, color: "bg-amber-500", label: "Café" },
  COWORKING: { Icon: Briefcase, color: "bg-purple-500", label: "Coworking" },
  SALLE_ETUDE: { Icon: GraduationCap, color: "bg-green-500", label: "Salle d'étude" },
};

// Niveaux de calme
const calmLevels = [
  { value: "TRES_CALME", label: "Très calme", percentage: "85-100%" },
  { value: "CALME", label: "Calme", percentage: "70-84%" },
  { value: "ASSEZ_BRUYANT", label: "Assez bruyant", percentage: "50-69%" },
  { value: "TRES_BRUYANT", label: "Très bruyant", percentage: "0-49%" },
];

// Distances en mètres
const distances = [50, 100, 150, 200, 500, 1000, 2000, 5000];

export default function ExplorerPage() {
  const { userPosition, isLoading: isLoadingPosition, error: positionError, getPosition } = useUserLocation({
    highAccuracy: true,
    watchPosition: false,
    timeout: 10000,
  });

  // États pour les filtres
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCalm, setSelectedCalm] = useState<string>("");
  const [selectedDistance, setSelectedDistance] = useState<number>(1000);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // États pour les données
  const [places, setPlaces] = useState<Lieu[]>([]);
  const [typesLieux, setTypesLieux] = useState<TypeLieu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les favoris
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  // État utilisateur
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isInitialized = useRef(false);

  // Charger les types de lieux au montage
  useEffect(() => {
    initializePage();
  }, []);

  // Charger les favoris quand l'utilisateur est authentifié
  useEffect(() => {
    if (isAuthenticated && !isInitialized.current) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  
  const loadPlaces = useCallback(async () => {
    if (!userPosition) return;

    try {
      setLoading(true);

      if (showFavorites && favoriteIds.size === 0) {
        setPlaces([]);
        setLoading(false);
        return;
      }

      const params = {
        search: searchQuery || undefined,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        niveauCalme: selectedCalm || undefined,
        latitude: userPosition.latitude,
        longitude: userPosition.longitude,
        distance: selectedDistance,
      };

      console.log('🔍 Chargement des lieux avec params:', params);

      let lieux = await lieuxUserService.getLieux(params);

      lieux = lieux.map((lieu) => ({
        ...lieu,
        isFavorite: favoriteIds.has(lieu.id),
      }));

      if (showFavorites) {
        lieux = lieux.filter((lieu) => favoriteIds.has(lieu.id));
      }

      setPlaces(lieux);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des lieux:', err);
      setError('Erreur lors du chargement des lieux');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [
    userPosition?.latitude,
    userPosition?.longitude,
    selectedTypes,
    selectedCalm,
    selectedDistance,
    searchQuery,
    showFavorites,
    favoriteIds.size, 
  ]);

 
  useEffect(() => {
    if (userPosition && isInitialized.current) {
      loadPlaces();
    }
  }, [loadPlaces, userPosition?.latitude, userPosition?.longitude]);

  
  useEffect(() => {
    if (userPosition && typesLieux.length > 0 && !isInitialized.current) {
      isInitialized.current = true;
      loadPlaces();
    }
  }, [userPosition, typesLieux.length, loadPlaces]);

  /**
   * Initialiser la page
   */
  const initializePage = async () => {
    try {
      setLoading(true);
      
      // Vérifier l'authentification
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);

      // Charger les types de lieux
      const types = await lieuxUserService.getTypesLieux();
      setTypesLieux(types);

      setError(null);
    } catch (err) {
      console.error('Erreur lors de l\'initialisation:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Charger les favoris de l'utilisateur
   */
  const loadFavorites = async () => {
    try {
      const favoris = await lieuxUserService.getFavoris();
      const ids = new Set(favoris.map((fav: any) => fav.lieu.idLieu));
      setFavoriteIds(ids);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleFavorite = async (id: number, isFavorite: boolean) => {
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour gérer vos favoris');
      return;
    }

    try {
      await lieuxUserService.toggleFavoris(id, isFavorite);
      
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (isFavorite) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
      
      setPlaces((prev) =>
        prev.map((place) =>
          place.id === id ? { ...place, isFavorite: !isFavorite } : place,
        ),
      );
    } catch (error) {
      console.error('Erreur lors du toggle favori:', error);
      alert('Erreur lors de la modification du favori');
    }
  };

  const getCalmColor = (percentage: number) => {
    if (percentage >= 85) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  const getTypeIcon = (type: string) => {
    return placeTypesConfig[type as keyof typeof placeTypesConfig]?.Icon || MapPin;
  };

  const getTypeColor = (type: string) => {
    return placeTypesConfig[type as keyof typeof placeTypesConfig]?.color || "bg-gray-500";
  };

  const resetAllFilters = () => {
    setSelectedTypes([]);
    setSelectedCalm("");
    setShowFavorites(false);
    setSearchQuery("");
  };

  // Affichage pendant le chargement initial
  if (!userPosition || (loading && places.length === 0 && !isInitialized.current)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {isLoadingPosition ? 'Récupération de votre position...' : 'Chargement des lieux...'}
          </p>
          {positionError && (
            <p className="mt-2 text-sm text-amber-600">
              Utilisation de la position par défaut (Casablanca)
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                Explorer les Lieux
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Découvrez les meilleurs espaces de travail à Casablanca
              </p>
            </div>
            
            {/* Statut de géolocalisation */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm dark:bg-gray-800">
                {userPosition.isDefault ? (
                  <>
                    <MapPinOff className="h-5 w-5 text-amber-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Position par défaut
                    </span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Position GPS
                      {userPosition.accuracy && ` (±${Math.round(userPosition.accuracy)}m)`}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={getPosition}
                disabled={isLoadingPosition}
                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 disabled:opacity-50 dark:hover:bg-blue-900/30"
                title="Rafraîchir la position"
              >
                <RefreshCw className={`h-5 w-5 ${isLoadingPosition ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

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
                    {typesLieux.map((type) => {
                      const config = placeTypesConfig[type.value as keyof typeof placeTypesConfig];
                      if (!config) return null;
                      
                      const Icon = config.Icon;
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
                          <div className={`rounded-lg p-2 ${config.color}`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              isSelected
                                ? "text-blue-700 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
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
                    onChange={(e) => setSelectedDistance(Number(e.target.value))}
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 transition focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    {distances.map((distance) => (
                      <option key={distance} value={distance}>
                        Dans un rayon de {distance >= 1000 ? `${distance/1000}km` : `${distance}m`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Favoris Filter */}
                {isAuthenticated && (
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
                    <span className="font-medium">
                      Favoris uniquement ({favoriteIds.size})
                    </span>
                  </button>
                )}

                {/* Reset Filters */}
                {(selectedTypes.length > 0 || selectedCalm || showFavorites) && (
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
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Chargement...
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {places.length}
                    </span>{" "}
                    lieu{places.length > 1 ? "x" : ""} trouvé
                    {places.length > 1 ? "s" : ""}
                  </>
                )}
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
                {places.map((place) => {
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
                                {place.distance !== undefined && (
                                  <>
                                    <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                      <span className="font-medium">
                                        {place.distance >= 1000 
                                          ? `${(place.distance / 1000).toFixed(1)}km`
                                          : `${place.distance}m`}
                                      </span>
                                    </span>
                                    <span className="text-gray-300 dark:text-gray-600">
                                      •
                                    </span>
                                  </>
                                )}
                                <span
                                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${getCalmColor(
                                    place.scoreCalme,
                                  )}`}
                                >
                                  {place.scoreCalme}% calme
                                </span>
                                {place.noteMoyenne && (
                                  <>
                                    <span className="text-gray-300 dark:text-gray-600">
                                      •
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      ⭐ {place.noteMoyenne.toFixed(1)} ({place.nombreAvis} avis)
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {isAuthenticated && (
                            <button
                              onClick={() => toggleFavorite(place.id, place.isFavorite || false)}
                              className="flex-shrink-0 rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-700"
                              disabled={loading}
                            >
                              <Heart
                                className={`h-6 w-6 ${
                                  place.isFavorite
                                    ? "fill-red-500 text-red-500"
                                    : "text-gray-400"
                                }`}
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Empty State */}
                {places.length === 0 && !loading && (
                  <div className="rounded-xl bg-white p-12 text-center shadow-sm dark:bg-gray-800">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {showFavorites ? "Aucun favori trouvé" : "Aucun lieu trouvé"}
                    </h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                      {showFavorites 
                        ? "Vous n'avez pas encore ajouté de lieux en favoris"
                        : "Essayez d'ajuster vos filtres pour voir plus de résultats"}
                    </p>
                    <button
                      onClick={resetAllFilters}
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
                <MapComponent 
                  places={places} 
                  userPosition={userPosition}
                  showUserPosition={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}






