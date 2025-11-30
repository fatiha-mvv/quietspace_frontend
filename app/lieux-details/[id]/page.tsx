"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Heart,
  Star,
  Coffee,
  BookOpen,
  Briefcase,
  GraduationCap,
  Volume2,
  Calendar,
  Navigation,
  Loader2,
} from "lucide-react";
import lieuxUserService, { Lieu } from "../../../services/lieux-user";
import authService from "../../../services/auth.service";
import dynamic from "next/dynamic";
import AuthenticatedGuard from "../../../components/AuthGuard/authguard"; 
import RatingModal from "../../../components/RatingModal/RatingModal";

// Import dynamique de la carte
const MapComponent = dynamic(
  () => import("../../../components/Map/MapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    ),
  }
);

// Configuration des icônes
const placeTypesConfig = {
  BIBLIOTHEQUE: { Icon: BookOpen, color: "bg-blue-500", label: "Bibliothèque" },
  CAFE: { Icon: Coffee, color: "bg-amber-500", label: "Café" },
  COWORKING: { Icon: Briefcase, color: "bg-purple-500", label: "Coworking" },
  SALLE_ETUDE: { Icon: GraduationCap, color: "bg-green-500", label: "Salle d'étude" },
};

export default function LieuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [lieu, setLieu] = useState<Lieu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const handleGoBack = () => {
    router.push("/espace-user");
  };

  useEffect(() => {
    const initPage = async () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      // Charger les détails du lieu
      await loadLieuDetails();
      
      // Si authentifié, charger l'avis et vérifier si favori
      if (isAuth) {
        await loadUserRating();
        await checkIfFavorite(); // ⭐ NOUVEAU
      }
    };
    
    initPage();
  }, [id]);

  /*vérifier si le lieu est dans les favoris
   */
  const checkIfFavorite = async () => {
    try {
      const favoris = await lieuxUserService.getFavoris();
      // Chercher si ce lieu est dans les favoris
      const isFav = favoris.some((fav: any) => fav.lieu.idLieu === id);
      setIsFavorite(isFav);
      
      // Mettre à jour également l'objet lieu
      if (lieu) {
        setLieu({ ...lieu, isFavorite: isFav });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des favoris:", error);
    }
  };

  const loadUserRating = async () => {
    try {
      const myAvis = await lieuxUserService.getMyAvis();
      const avisForThisLieu = myAvis.find((a: any) => a.lieuId === id);
      if (avisForThisLieu) {
        setUserRating(avisForThisLieu.note);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'avis:", error);
    }
  };

  const handleSubmitRating = async (note: number) => {
    try {
      await lieuxUserService.createOrUpdateAvis(id, note);
      setUserRating(note);
      // Recharger les détails du lieu pour mettre à jour la note moyenne
      await loadLieuDetails();
      alert("Votre avis a été enregistré avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'avis:", error);
      alert("Erreur lors de l'enregistrement de votre avis");
    }
  };

  const loadLieuDetails = async () => {
    try {
      setLoading(true);
      const data = await lieuxUserService.getLieuById(id);
      setLieu(data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement du lieu:", err);
      setError("Impossible de charger les détails du lieu");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      alert("Vous devez être connecté pour gérer vos favoris");
      return;
    }

    try {
      setFavoriteLoading(true);
      
      if (isFavorite) {
        // Retirer des favoris
        await lieuxUserService.removeFavoris(id);
        setIsFavorite(false);
        if (lieu) {
          setLieu({ ...lieu, isFavorite: false });
        }
        console.log(" Lieu retiré des favoris");
      } else {
        // Ajouter aux favoris
        await lieuxUserService.addFavoris(id);
        setIsFavorite(true);
        if (lieu) {
          setLieu({ ...lieu, isFavorite: true });
        }
        console.log(" Lieu ajouté aux favoris");
      }
    } catch (error: any) {
      console.error(" Erreur lors du toggle favori:", error);
      
      // Afficher un message d'erreur plus détaillé
      if (error.response?.status === 401) {
        alert("Votre session a expiré. Veuillez vous reconnecter.");
        router.push("/login");
      } else {
        alert(error.response?.data?.message || "Erreur lors de la modification du favori");
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  const getCalmColor = (percentage: number) => {
    if (percentage >= 85) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  const getCalmLabel = (niveauCalme: string) => {
    const labels = {
      TRES_CALME: "Très calme",
      CALME: "Calme",
      ASSEZ_BRUYANT: "Assez bruyant",
      TRES_BRUYANT: "Très bruyant",
    };
    return labels[niveauCalme as keyof typeof labels] || niveauCalme;
  };

  return (
    <AuthenticatedGuard>
      {loading ? (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Chargement des détails...
            </p>
          </div>
        </div>
      ) : error || !lieu ? (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <MapPin className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Lieu introuvable
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {error || "Le lieu demandé n'existe pas"}
            </p>
            <button
              onClick={handleGoBack}
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              ← Retour à l'explorateur
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Header avec image */}
          <div className="relative h-96 w-full">
            {lieu.image ? (
              <img
                src={lieu.image}
                alt={lieu.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className={`flex h-full items-center justify-center ${
                  placeTypesConfig[lieu.type as keyof typeof placeTypesConfig]
                    ?.color || "bg-gray-400"
                }`}
              >
                {(() => {
                  const Icon =
                    placeTypesConfig[lieu.type as keyof typeof placeTypesConfig]
                      ?.Icon || MapPin;
                  return <Icon className="h-32 w-32 text-white opacity-50" />;
                })()}
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Bouton retour */}
            <button
              onClick={handleGoBack}
              className="absolute left-4 top-4 z-50 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700"
            >
              ← Retour
            </button>

            {isAuthenticated && (
              <button
                onClick={toggleFavorite}
                disabled={favoriteLoading}
                className="absolute right-4 top-4 z-50 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur-sm transition hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {favoriteLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-900" />
                ) : (
                  <Heart
                    className={`h-5 w-5 transition-all ${
                      isFavorite
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-gray-900 hover:text-red-500"
                    }`}
                  />
                )}
              </button>
            )}

            {/* Titre sur l'image */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="mx-auto max-w-7xl">
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={`rounded-xl p-3 ${
                      placeTypesConfig[lieu.type as keyof typeof placeTypesConfig]
                        ?.color || "bg-gray-500"
                    }`}
                  >
                    {(() => {
                      const Icon =
                        placeTypesConfig[
                          lieu.type as keyof typeof placeTypesConfig
                        ]?.Icon || MapPin;
                      return <Icon className="h-6 w-6 text-white" />;
                    })()}
                  </div>
                  <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
                    {placeTypesConfig[lieu.type as keyof typeof placeTypesConfig]
                      ?.label || lieu.type}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-white">{lieu.name}</h1>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Colonne principale */}
              <div className="space-y-6 lg:col-span-2">
                {/* Informations principales */}
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                    À propos
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {lieu.description || "Aucune description disponible."}
                  </p>

                  <div className="mt-6 space-y-4">
                    {/* Adresse */}
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Adresse
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {lieu.address}
                        </p>
                      </div>
                    </div>

                    {/* Distance */}
                    {lieu.distance !== undefined && (
                      <div className="flex items-start gap-3">
                        <Navigation className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Distance
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {lieu.distance >= 1000
                              ? `${(lieu.distance / 1000).toFixed(1)} km`
                              : `${lieu.distance} m`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Date d'ajout */}
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Ajouté le
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {new Date(lieu.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carte */}
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                    Localisation
                  </h2>
                  <div className="h-96 overflow-hidden rounded-lg">
                    <MapComponent places={[lieu]} />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Niveau de calme */}
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <div className="mb-4 flex items-center gap-3">
                    <Volume2 className="h-6 w-6 text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Niveau de calme
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {lieu.scoreCalme}%
                      </span>
                      <span
                        className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${getCalmColor(
                          lieu.scoreCalme
                        )}`}
                      >
                        {getCalmLabel(lieu.niveauCalme)}
                      </span>
                    </div>

                    {/* Barre de progression */}
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-full transition-all ${getCalmColor(
                          lieu.scoreCalme
                        )}`}
                        style={{ width: `${lieu.scoreCalme}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes et avis */}
                {lieu.noteMoyenne !== null && (
                  <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <div className="mb-4 flex items-center gap-3">
                      <Star className="h-6 w-6 text-gray-400" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Évaluations
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900 dark:text-white">
                            {lieu.noteMoyenne.toFixed(1)}
                          </div>
                          <div className="mt-2 flex justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.round(lieu.noteMoyenne!)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Basé sur{" "}
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {lieu.nombreAvis}
                            </span>{" "}
                            avis
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsRatingModalOpen(true)} 
                        className="w-full rounded-lg border-2 border-blue-600 px-4 py-3 font-medium text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        {userRating ? "Modifier mon avis" : "Donner mon avis"}
                      </button>
                    </div>
                  </div>
                )}

                {isAuthenticated && (
                  <div className={`rounded-xl p-6 text-white shadow-sm transition-all ${
                    isFavorite 
                      ? "bg-gradient-to-br from-red-500 to-pink-600" 
                      : "bg-gradient-to-br from-blue-600 to-purple-600"
                  }`}>
                    <h3 className="mb-2 text-lg font-bold">
                      {isFavorite ? "Lieu dans vos favoris !" : "Vous aimez cet endroit ?"}
                    </h3>
                    <p className="mb-4 text-sm opacity-90">
                      {isFavorite 
                        ? "Ce lieu est sauvegardé dans vos favoris"
                        : "Ajoutez-le à vos favoris pour le retrouver facilement !"}
                    </p>
                    <button
                      onClick={toggleFavorite}
                      disabled={favoriteLoading}
                      className="w-full rounded-lg bg-white px-4 py-3 font-medium transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ color: isFavorite ? "#dc2626" : "#2563eb" }}
                    >
                      {favoriteLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        <>
                          <Heart className={isFavorite ? "fill-current" : ""} />
                          {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleSubmitRating}
        lieuName={lieu?.name || ""}
        currentRating={userRating}
      />
    </AuthenticatedGuard>
  );
}