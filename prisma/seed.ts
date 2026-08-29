import { PrismaClient, MediaType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const wedding = await prisma.category.upsert({
    where: { slug: "mariages" },
    update: {},
    create: { name: "Mariages", slug: "mariages", sortOrder: 1 }
  });

  const events = await prisma.category.upsert({
    where: { slug: "evenementiel" },
    update: {},
    create: { name: "Événementiel", slug: "evenementiel", sortOrder: 2 }
  });

  await prisma.project.upsert({
    where: { slug: "elodie-thomas" },
    update: {},
    create: {
      title: "Élodie & Thomas",
      slug: "elodie-thomas",
      excerpt: "Une journée intime entre lac et montagne.",
      description:
        "Un film construit autour des gestes, des silences et de la lumière naturelle.",
      location: "Haute-Savoie",
      year: 2026,
      coverUrl:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85",
      featured: true,
      published: true,
      categories: { connect: [{ id: wedding.id }] },
      media: {
        create: [
          {
            type: MediaType.IMAGE,
            url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=85",
            alt: "Mariage en extérieur",
            sortOrder: 1
          }
        ]
      }
    }
  });

  await prisma.project.upsert({
    where: { slug: "nuits-d-ete" },
    update: {},
    create: {
      title: "Nuits d'été",
      slug: "nuits-d-ete",
      excerpt: "Un événement musical filmé au plus près du public.",
      description: "Captation courte et nerveuse d'une soirée estivale.",
      location: "Annecy",
      year: 2026,
      coverUrl:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=85",
      featured: true,
      published: true,
      categories: { connect: [{ id: events.id }] }
    }
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
