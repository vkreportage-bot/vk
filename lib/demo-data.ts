import type { Article, Category, Project } from "@/types";

export const demoCategories: Category[] = [
  { id: "cat-wedding", name: "Mariages", slug: "mariages" },
  { id: "cat-events", name: "Événementiel", slug: "evenementiel" },
  { id: "cat-stories", name: "Histoires", slug: "histoires" }
];

export const demoProjects: Project[] = [
  {
    id: "p-1",
    title: "Élodie & Thomas",
    slug: "elodie-thomas",
    excerpt: "Une journée intime entre lac et montagne.",
    description:
      "Un film construit autour des gestes, des silences et de la lumière naturelle. L'objectif : conserver l'énergie réelle de la journée sans la surproduire.",
    client: "Élodie & Thomas",
    location: "Haute-Savoie",
    year: 2026,
    featured: true,
    published: true,
    coverUrl:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85",
    categories: [demoCategories[0]],
    media: [
      {
        id: "m-1",
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=85",
        alt: "Mariage en extérieur",
        sortOrder: 1
      }
    ]
  },
  {
    id: "p-2",
    title: "Nuits d'été",
    slug: "nuits-d-ete",
    excerpt: "Un événement musical filmé au plus près du public.",
    description:
      "Captation courte et nerveuse d'une soirée estivale. Plans rapprochés, mouvements caméra et montage rythmé.",
    client: "Nuits d'été",
    location: "Annecy",
    year: 2026,
    featured: true,
    published: true,
    coverUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=85",
    categories: [demoCategories[1]],
    media: [
      {
        id: "m-2",
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=85",
        alt: "Concert et foule",
        sortOrder: 1
      }
    ]
  },
  {
    id: "p-3",
    title: "L'atelier",
    slug: "atelier",
    excerpt: "Portrait d'un geste artisanal et de ceux qui le transmettent.",
    description:
      "Un portrait documentaire simple, où le son de l'atelier et les matières deviennent la narration.",
    client: "Atelier",
    location: "France",
    year: 2026,
    featured: true,
    published: true,
    coverUrl:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1600&q=85",
    categories: [demoCategories[2]],
    media: [
      {
        id: "m-3",
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1800&q=85",
        alt: "Travail artisanal",
        sortOrder: 1
      }
    ]
  },
  {
    id: "p-4",
    title: "À deux",
    slug: "a-deux",
    excerpt: "Quelques heures avant la cérémonie.",
    description:
      "Une série courte pensée comme un prologue : préparation, attente et détails avant le départ.",
    client: null,
    location: "Megève",
    year: 2026,
    featured: true,
    published: true,
    coverUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85",
    categories: [demoCategories[0]],
    media: [
      {
        id: "m-4",
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=85",
        alt: "Détails de mariage",
        sortOrder: 1
      }
    ]
  }
];

export const demoArticles: Article[] = [
  {
    id: "a-1",
    title: "Créer un film qui raconte vraiment une journée",
    slug: "creer-un-film-qui-raconte-vraiment-une-journee",
    excerpt:
      "Quelques principes simples pour construire un film naturel, lisible et émotionnel sans transformer la journée en tournage.",
    content: `## Filmer ce qui existe déjà

Une image forte vient rarement d'une mise en scène compliquée. Le point de départ consiste à observer les gestes, les regards, les silences et les détails qui donnent une identité au moment.

## Donner une place au son

Le son direct, les voix et l'ambiance d'un lieu racontent autant que les images. Ils permettent de conserver une trace plus précise de l'expérience vécue.

## Construire au montage

Le montage ne sert pas seulement à raccourcir. Il organise les rythmes, les respirations et les transitions pour faire émerger une histoire claire sans la surcharger.`,
    coverUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85",
    coverAlt: "Caméra de cinéma utilisée pour un tournage documentaire",
    author: "VK",
    keywords: ["vidéaste", "film", "réalisation vidéo", "storytelling"],
    metaTitle: "Créer un film naturel et cinématographique | VK",
    metaDescription:
      "Comment construire un film naturel et émotionnel : observation, son direct et montage au service de l'histoire.",
    published: true,
    publishedAt: new Date("2026-08-30T10:00:00.000Z"),
    createdAt: new Date("2026-08-30T10:00:00.000Z"),
    updatedAt: new Date("2026-08-30T10:00:00.000Z")
  }
];
