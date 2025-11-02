import { Brand } from "../../types/brand";
import Image from "next/image";
import brandsData from "./brandsData";

const Brands = () => {
  return (
    <section className="pt-16">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[45px]">
                QuietSpace en Chiffres
              </h2>
              <p className="mt-4 text-base text-body-color dark:text-body-color-dark">
                Une communauté grandissante pour trouver votre espace de concentration idéal
              </p>
            </div>
            <div
              className="wow fadeInUp bg-gray-light dark:bg-gray-dark flex flex-wrap items-center justify-center rounded-sm px-8 py-8 sm:px-10 md:px-[50px] md:py-[40px] xl:p-[50px] 2xl:px-[70px] 2xl:py-[60px]"
              data-wow-delay=".1s"
            >
              {brandsData.map((brand) => (
                <SingleBrand key={brand.id} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;

const SingleBrand = ({ brand }: { brand: Brand }) => {
  const { href, name } = brand;

  // Statistiques pour chaque catégorie
  const stats: { [key: string]: string } = {
    "Espaces Référencés": "500+",
    "Bibliothèques": "150+",
    "Cafés Tranquilles": "200+",
    "Espaces Coworking": "100+",
    "Utilisateurs Actifs": "2000+",
  };

  // Icônes SVG pour chaque catégorie
  const icons: { [key: string]: JSX.Element } = {
    "Espaces Référencés": (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
        <path d="M24 4C13.5 4 5 12.5 5 23C5 33.5 24 44 24 44C24 44 43 33.5 43 23C43 12.5 34.5 4 24 4ZM24 30C19.58 30 16 26.42 16 22C16 17.58 19.58 14 24 14C28.42 14 32 17.58 32 22C32 26.42 28.42 30 24 30Z" />
      </svg>
    ),
    "Bibliothèques": (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
        <path d="M38 6H10C7.79 6 6 7.79 6 10V38C6 40.21 7.79 42 10 42H38C40.21 42 42 40.21 42 38V10C42 7.79 40.21 6 38 6ZM38 38H10V10H38V38ZM14 14H34V18H14V14ZM14 22H34V26H14V22ZM14 30H28V34H14V30Z" />
      </svg>
    ),
    "Cafés Tranquilles": (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
        <path d="M36 6H12C9.79 6 8 7.79 8 10V30C8 32.21 9.79 34 12 34H20V38H16V42H32V38H28V34H36C38.21 34 40 32.21 40 30V14C40 11.79 38.21 10 36 10V6ZM36 30H12V10H36V30ZM40 14H44V18H40V14Z" />
      </svg>
    ),
    "Espaces Coworking": (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
        <path d="M32 4H16C13.79 4 12 5.79 12 8V40C12 42.21 13.79 44 16 44H32C34.21 44 36 42.21 36 40V8C36 5.79 34.21 4 32 4ZM32 40H16V8H32V40ZM20 12H28V16H20V12ZM20 20H28V24H20V20ZM20 28H28V32H20V28Z" />
      </svg>
    ),
    "Utilisateurs Actifs": (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
        <path d="M24 4C18.48 4 14 8.48 14 14C14 19.52 18.48 24 24 24C29.52 24 34 19.52 34 14C34 8.48 29.52 4 24 4ZM24 20C20.69 20 18 17.31 18 14C18 10.69 20.69 8 24 8C27.31 8 30 10.69 30 14C30 17.31 27.31 20 24 20ZM24 26C16.48 26 8 29.76 8 34V38C8 40.21 9.79 42 12 42H36C38.21 42 40 40.21 40 38V34C40 29.76 31.52 26 24 26Z" />
      </svg>
    ),
  };

  return (
    <div className="mx-3 flex w-full max-w-[200px] flex-col items-center justify-center py-[15px] sm:mx-4 lg:max-w-[180px] xl:mx-6 xl:max-w-[200px] 2xl:mx-8 2xl:max-w-[220px]">
      <a
        href={href}
        className="relative flex flex-col items-center gap-3 transition hover:opacity-80"
      >
        <div className="text-primary dark:text-white opacity-70 hover:opacity-100 transition">
          {icons[name]}
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-black dark:text-white mb-1">
            {stats[name]}
          </p>
          <p className="text-sm text-body-color dark:text-body-color-dark">
            {name}
          </p>
        </div>
      </a>
    </div>
  );
};