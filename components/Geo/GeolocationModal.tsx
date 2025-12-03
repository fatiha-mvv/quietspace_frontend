// frontend/components/GeolocationModal.tsx
"use client";

import { useState, useEffect } from "react";
import { MapPin, X, AlertCircle, Navigation } from "lucide-react";

interface GeolocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
  onDeny: () => void;
}

export function GeolocationModal({
  isOpen,
  onClose,
  onAllow,
  onDeny,
}: GeolocationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900/30">
            <Navigation className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Activer la géolocalisation
        </h2>

        {/* Description */}
        <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
          Pour vous proposer les lieux les plus proches de vous, nous avons
          besoin d'accéder à votre position.
        </p>

        {/* Benefits */}
        <div className="mb-6 space-y-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Résultats personnalisés
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Découvrez les espaces de travail près de vous
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Navigation className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Calcul de distance
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Voyez à quelle distance se trouve chaque lieu
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mb-6 flex items-start gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-gray-500" />
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Votre position n'est jamais stockée ni partagée. Elle est utilisée
            uniquement pour calculer les distances.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onDeny}
            className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Plus tard
          </button>
          <button
            onClick={onAllow}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Autoriser
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== Composant pour afficher le statut de géolocalisation ==========

interface GeolocationStatusProps {
  isDefault: boolean;
  onRequestLocation: () => void;
  accuracy?: number;
}

export function GeolocationStatus({
  isDefault,
  onRequestLocation,
  accuracy,
}: GeolocationStatusProps) {
  if (!isDefault && accuracy) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
        <Navigation className="h-4 w-4" />
        <span>
          Position activée (±{accuracy.toFixed(0)}m)
        </span>
      </div>
    );
  }

  if (isDefault) {
    return (
      <button
        onClick={onRequestLocation}
        className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 transition hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
      >
        <MapPin className="h-4 w-4" />
        <span>Position par défaut (Casablanca)</span>
        <span className="ml-1 text-xs underline">Activer ma position</span>
      </button>
    );
  }

  return null;
}