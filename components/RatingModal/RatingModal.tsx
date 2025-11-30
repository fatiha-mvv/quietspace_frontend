"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: number) => Promise<void>;
  lieuName: string;
  currentRating?: number | null;
}

export default function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  lieuName,
  currentRating,
}: RatingModalProps) {
  const [selectedRating, setSelectedRating] = useState<number>(currentRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      alert("Veuillez sélectionner une note");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(selectedRating);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* UN SEUL Overlay avec z-index élevé */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800"
          onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique sur le modal
        >
          {/* Bouton Fermer */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Titre */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Donner votre avis
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {lieuName}
            </p>
          </div>

          {/* Sélection de note simple avec chiffres */}
          <div className="mb-8">
            <p className="mb-6 text-center text-base font-medium text-gray-700 dark:text-gray-300">
              Sélectionnez votre note
            </p>

            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((note) => (
                <button
                  key={note}
                  onClick={() => setSelectedRating(note)}
                  className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold transition-all ${
                    selectedRating === note
                      ? "bg-blue-600 text-white shadow-lg scale-110"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>

            {/* Étoiles de visualisation */}
            {selectedRating > 0 && (
              <div className="mt-6 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 ${
                      star <= selectedRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedRating === 0 || isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Envoi..." : currentRating ? "Modifier" : "Valider"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}