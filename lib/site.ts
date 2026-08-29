export const siteConfig = {
  name: "VK",
  title: "VK — Films, histoires & émotions",
  description:
    "Portfolio VK : films de mariage, événements et projets créatifs racontés avec une approche cinématographique.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com",
  locale: "fr_FR",
  keywords: [
    "vidéaste",
    "portfolio vidéaste",
    "film mariage",
    "vidéo événementielle",
    "réalisation vidéo",
    "film cinématique",
    "VK"
  ]
} as const;
