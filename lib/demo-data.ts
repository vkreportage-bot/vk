import type { Category, Project } from "@/types";

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
