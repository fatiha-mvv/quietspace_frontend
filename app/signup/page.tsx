"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "../../services/auth.service";
import { useVilles } from "../hooks/useVilles"; 

const SignupPage = () => {
  const router = useRouter();
  const { villes, loading: loadingVilles } = useVilles();

  const [formData, setFormData] = useState({
  username: "",  
  email: "",
  password: "",
  ville: "",
});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.email || !formData.password || !formData.ville) {
      setError("Tous les champs sont requis, y compris la ville");
      return;
    }

    if (!acceptTerms) {
      setError("Vous devez accepter les termes et conditions");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      await authService.register({
      username: formData.username,  
      email: formData.email,
      password: formData.password,
      ville: formData.ville,
    });
      router.push("/");
    } catch (err: any) {
      console.error("Register error:", err);
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de l'inscription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Créer votre compte
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  C'est gratuit et super facile
                </p>

              

                <div className="mb-8 flex items-center justify-center">
                  <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>
                  <p className="w-full px-5 text-center text-base font-medium text-body-color">
                    Inscrivez-vous avec votre email
                  </p>
                  <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Nom complet */}
                  <div className="mb-8">
                  <label htmlFor="username" className="mb-3 block text-sm text-dark dark:text-white">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="username"  
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Entrez votre nom complet"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                  />
                </div>

                  {/* Email */}
                  <div className="mb-8">
                    <label htmlFor="email" className="mb-3 block text-sm text-dark dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Entrez votre email"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  {/* Ville */}
                  <div className="mb-8">
                    <label htmlFor="ville" className="mb-3 block text-sm text-dark dark:text-white">
                      Ville
                    </label>
                    <select
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                      disabled={loadingVilles}
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none disabled:opacity-50"
                    >
                      <option value="">
                        {loadingVilles ? "Chargement des villes..." : "Sélectionnez votre ville"}
                      </option>
                      {villes.map((v) => (
                        <option key={v.id} value={v.ville}>
                          {v.ville}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mot de passe */}
                  <div className="mb-8">
                    <label htmlFor="password" className="mb-3 block text-sm text-dark dark:text-white">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Entrez votre mot de passe"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>

                  {/* CGU */}
                  <div className="mb-8 flex">
                    <label
                      htmlFor="checkboxLabel"
                      className="flex cursor-pointer select-none text-sm font-medium text-body-color"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="checkboxLabel"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={`box mr-4 mt-1 flex h-5 w-5 items-center justify-center rounded border ${
                            acceptTerms
                              ? "border-primary bg-primary"
                              : "border-body-color border-opacity-20 dark:border-white dark:border-opacity-10"
                          }`}
                        >
                          <span className={acceptTerms ? "opacity-100" : "opacity-0"}>
                            <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                              <path
                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                fill="white"
                                stroke="white"
                                strokeWidth="0.4"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                      <span>
                        En créant un compte, vous acceptez les{" "}
                        <a href="#0" className="text-primary hover:underline">
                          Termes et Conditions
                        </a>
                        , et notre{" "}
                        <a href="#0" className="text-primary hover:underline">
                          Politique de Confidentialité
                        </a>
                      </span>
                    </label>
                  </div>

                  {/* Bouton */}
                  <div className="mb-6">
                    <button
                      type="submit"
                      disabled={loading || loadingVilles}
                      className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90 disabled:opacity-50"
                    >
                      {loading ? "Inscription en cours..." : "S'inscrire"}
                    </button>
                  </div>
                </form>

                <p className="text-center text-base font-medium text-body-color">
                  Vous avez déjà un compte?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SVG décoratif */}
        <div className="absolute left-0 top-0 z-[-1]">
          <svg width="1440" height="969" viewBox="0 0 1440 969" fill="none">
            <mask id="mask0_95:1005" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="969">
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path opacity="0.1" d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z" fill="url(#paint0_linear_95:1005)" />
              <path opacity="0.1" d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z" fill="url(#paint1_linear_95:1005)" />
            </g>
            <defs>
              <linearGradient id="paint0_linear_95:1005" x1="1178.4" y1="151.853" x2="780.959" y2="453.581">
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="paint1_linear_95:1005" x1="160.5" y1="220" x2="1099.45" y2="1192.04">
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default SignupPage;