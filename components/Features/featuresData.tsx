import { Feature } from "../../types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-current">
        <path
          opacity="0.5"
          d="M20 0C8.95 0 0 8.95 0 20C0 31.05 8.95 40 20 40C31.05 40 40 31.05 40 20C40 8.95 31.05 0 20 0ZM20 36C11.18 36 4 28.82 4 20C4 11.18 11.18 4 20 4C28.82 4 36 11.18 36 20C36 28.82 28.82 36 20 36Z"
        />
        <path d="M20 8C15.58 8 12 11.58 12 16C12 20.42 15.58 24 20 24C24.42 24 28 20.42 28 16C28 11.58 24.42 8 20 8ZM20 28C14.48 28 10 32.48 10 38H30C30 32.48 25.52 28 20 28Z" />
      </svg>
    ),
    title: "Carte Interactive",
    paragraph:
      "Visualisez tous les espaces calmes sur une carte Leaflet interactive. Naviguez facilement entre bibliothèques, cafés tranquilles et espaces de coworking près de vous.",
  },
  {
    id: 2,
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-current">
        <path
          opacity="0.5"
          d="M35 5H5C2.24 5 0 7.24 0 10V30C0 32.76 2.24 35 5 35H35C37.76 35 40 32.76 40 30V10C40 7.24 37.76 5 35 5Z"
        />
        <path d="M8 15H32V19H8V15ZM8 23H25V27H8V23Z" />
      </svg>
    ),
    title: "Filtres Avancés",
    paragraph:
      "Recherchez et filtrez les espaces selon vos besoins : type d'espace, niveau de calme, distance depuis votre position. Trouvez l'endroit parfait en quelques clics.",
  },
  {
    id: 3,
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-current">
        <path
          opacity="0.5"
          d="M20 0C8.95 0 0 8.95 0 20C0 31.05 8.95 40 20 40C31.05 40 40 31.05 40 20C40 8.95 31.05 0 20 0Z"
        />
        <path d="M20 10C14.48 10 10 14.48 10 20C10 25.52 14.48 30 20 30C25.52 30 30 25.52 30 20C30 14.48 25.52 10 20 10ZM20 26C16.69 26 14 23.31 14 20C14 16.69 16.69 14 20 14C23.31 14 26 16.69 26 20C26 23.31 23.31 26 20 26Z" />
      </svg>
    ),
    title: "Recherche par Proximité",
    paragraph:
      "Découvrez les espaces calmes dans un rayon de 50m à 1km autour de votre position. Calcul intelligent de distance pour vous faire gagner du temps.",
  },
  {
    id: 4,
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-current">
        <path
          opacity="0.5"
          d="M20 2L25.39 12.82L37 14.54L28.5 22.87L30.61 34.46L20 29.27L9.39 34.46L11.5 22.87L3 14.54L14.61 12.82L20 2Z"
        />
        <path d="M20 5L23.88 13.53L33 15L26.5 21.39L28.18 30.47L20 26.23L11.82 30.47L13.5 21.39L7 15L16.12 13.53L20 5Z" />
      </svg>
    ),
    title: "Système d'Avis",
    paragraph:
      "Partagez votre expérience en notant le niveau de calme de chaque lieu (1-5 étoiles). Consultez les notes moyennes pour faire le meilleur choix.",
  },
  {
    id: 5,
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-current">
        <path
          opacity="0.5"
          d="M35 8H30V5C30 2.24 27.76 0 25 0H15C12.24 0 10 2.24 10 5V8H5C2.24 8 0 10.24 0 13V35C0 37.76 2.24 40 5 40H35C37.76 40 40 37.76 40 35V13C40 10.24 37.76 8 35 8Z"
        />
        <path d="M14 5C14 4.45 14.45 4 15 4H25C25.55 4 26 4.45 26 5V8H14V5ZM20 28C16.69 28 14 25.31 14 22C14 18.69 16.69 16 20 16C23.31 16 26 18.69 26 22C26 25.31 23.31 28 20 28Z" />
      </svg>
    ),
    title: "Informations Détaillées",
    paragraph:
      "Accédez aux détails complets de chaque espace : horaires d'ouverture, équipements disponibles, ambiance générale et photos pour mieux vous décider.",
  },
  {
    id: 6,
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-current">
        <path
          opacity="0.5"
          d="M38 10C38 8.9 37.1 8 36 8H4C2.9 8 2 8.9 2 10V30C2 31.1 2.9 32 4 32H36C37.1 32 38 31.1 38 30V10Z"
        />
        <path d="M36 0H4C1.79 0 0 1.79 0 4V36C0 38.21 1.79 40 4 40H36C38.21 40 40 38.21 40 36V4C40 1.79 38.21 0 36 0ZM36 36H4V10L20 20L36 10V36Z" />
      </svg>
    ),
    title: "Notifications Personnalisées",
    paragraph:
      "Recevez des alertes pour les espaces calmes près de vous. Activez ou désactivez les notifications selon vos préférences pour rester informé.",
  },
];

export default featuresData;