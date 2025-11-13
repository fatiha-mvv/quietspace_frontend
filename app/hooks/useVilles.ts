// hooks/useVilles.ts → OK
import { useState, useEffect } from 'react';

interface Ville {
  id: string;
  ville: string;
  region: string;
}

export const useVilles = () => {
  const [villes, setVilles] = useState<Ville[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/villes.json')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: Ville, b: Ville) =>
          a.ville.localeCompare(b.ville)
        );
        setVilles(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  return { villes, loading };
};