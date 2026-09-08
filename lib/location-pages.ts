export type LocationPage = {
  slug: string;
  city: string;
  department: string;
  region: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  introduction: string[];
  localTitle: string;
  localContent: string[];
  nearby: string[];
  faq: Array<{
    question: string;
    answer: string;
  }>;
};

export const locationPages: LocationPage[] = [
  {
    slug: "paris",
    city: "Paris",
    department: "Paris",
    region: "Île-de-France",
    metaTitle: "Photographe & vidéaste à Paris | VK",
    metaDescription:
      "Photographe et vidéaste à Paris pour mariages, événements, portraits et projets professionnels. Une approche naturelle, documentaire et cinématographique.",
    eyebrow: "Paris / Photographe & vidéaste",
    title: "Des images naturelles pour raconter Paris autrement.",
    lead:
      "Photographie, films de mariage, événements, portraits et contenus professionnels à Paris et en Île-de-France.",
    introduction: [
      "À Paris, chaque projet impose son propre rythme. Un mariage, un événement, un portrait ou un film de marque ne se raconte pas de la même manière. Je commence donc par observer le lieu, la lumière et les personnes avant de chercher l'image.",
      "Mon approche privilégie les moments spontanés, les gestes naturels et une mise en scène minimale. L'objectif est de produire des images contemporaines et élégantes sans perdre ce qui rend chaque histoire singulière.",
    ],
    localTitle: "Photographier et filmer à Paris",
    localContent: [
      "Je me déplace dans tous les arrondissements de Paris ainsi que dans l'ensemble de l'Île-de-France pour des reportages photo et vidéo, des mariages, des événements privés ou professionnels, des portraits et des productions de contenu.",
      "Le travail peut être très discret et documentaire ou davantage construit selon le projet. Dans les deux cas, la lumière, le mouvement et le rythme restent au centre de la réalisation.",
    ],
    nearby: ["Triel-sur-Seine", "Versailles", "Saint-Germain-en-Laye", "Île-de-France"],
    faq: [
      {
        question: "Vous déplacez-vous dans tout Paris ?",
        answer:
          "Oui. Je réalise des prestations photo et vidéo dans tous les arrondissements de Paris et plus largement en Île-de-France.",
      },
      {
        question: "Réalisez-vous des films de mariage à Paris ?",
        answer:
          "Oui. Je réalise des films et reportages photo de mariage avec une approche naturelle, documentaire et cinématographique.",
      },
      {
        question: "Travaillez-vous aussi pour les entreprises et les marques ?",
        answer:
          "Oui. Je réalise des portraits, événements, interviews et films de présentation pour les entreprises, indépendants et marques.",
      },
    ],
  },
  {
    slug: "triel-sur-seine",
    city: "Triel-sur-Seine",
    department: "Yvelines",
    region: "Île-de-France",
    metaTitle: "Photographe & vidéaste à Triel-sur-Seine | VK",
    metaDescription:
      "Photographe et vidéaste basé à Triel-sur-Seine dans les Yvelines. Mariages, événements, portraits, entreprises et films avec une approche naturelle.",
    eyebrow: "Triel-sur-Seine / Photographe & vidéaste",
    title: "Photographe et vidéaste basé à Triel-sur-Seine.",
    lead:
      "Des images naturelles, sensibles et cinématographiques pour les particuliers, les entreprises et les événements dans les Yvelines.",
    introduction: [
      "VK est basé à Triel-sur-Seine, dans les Yvelines. Cette proximité permet de travailler facilement dans l'ouest parisien tout en conservant une grande disponibilité pour les projets locaux.",
      "Je réalise des photographies et des films de mariage, des portraits, des événements et des contenus professionnels avec une approche documentaire : observer, anticiper et laisser les moments exister avant d'intervenir.",
    ],
    localTitle: "Un photographe et vidéaste local dans les Yvelines",
    localContent: [
      "Depuis Triel-sur-Seine, je me déplace régulièrement autour de Verneuil-sur-Seine, Villennes-sur-Seine, Poissy, Conflans-Sainte-Honorine, Saint-Germain-en-Laye et plus largement dans les Yvelines.",
      "Être basé localement facilite les repérages, les rendez-vous préparatoires et les projets qui demandent plusieurs temps de prise de vue. Pour les mariages et productions plus importantes, je me déplace également partout en Île-de-France et en France.",
    ],
    nearby: ["Paris", "Versailles", "Saint-Germain-en-Laye", "Yvelines"],
    faq: [
      {
        question: "Êtes-vous réellement basé à Triel-sur-Seine ?",
        answer:
          "Oui. VK est basé à Triel-sur-Seine dans les Yvelines et intervient régulièrement dans les communes voisines et dans toute l'Île-de-France.",
      },
      {
        question: "Quels types de projets réalisez-vous à Triel-sur-Seine ?",
        answer:
          "Mariages, portraits, événements privés ou professionnels, reportages, vidéos de présentation et contenus photo ou vidéo pour les entreprises.",
      },
      {
        question: "Pouvez-vous vous déplacer en dehors des Yvelines ?",
        answer:
          "Oui. Je travaille à Paris, dans toute l'Île-de-France et je me déplace partout en France selon les projets.",
      },
    ],
  },
  {
    slug: "versailles",
    city: "Versailles",
    department: "Yvelines",
    region: "Île-de-France",
    metaTitle: "Photographe & vidéaste à Versailles | VK",
    metaDescription:
      "Photographe et vidéaste à Versailles pour mariages, événements, portraits et projets professionnels. Reportage naturel et réalisation cinématographique.",
    eyebrow: "Versailles / Photographe & vidéaste",
    title: "Des images élégantes, sans figer les moments.",
    lead:
      "Photographe et vidéaste à Versailles pour les mariages, événements, portraits et projets professionnels.",
    introduction: [
      "À Versailles, les lieux peuvent être très présents visuellement. Mon travail consiste à les intégrer au récit sans qu'ils prennent le dessus sur les personnes et sur ce qui se passe réellement.",
      "Je privilégie une photographie vivante et une vidéo fluide, avec peu de poses imposées et une attention particulière portée à la lumière, aux gestes, aux regards et aux détails.",
    ],
    localTitle: "Reportages photo et vidéo à Versailles",
    localContent: [
      "J'interviens à Versailles et dans les communes voisines pour des mariages, événements privés, événements professionnels, portraits et contenus destinés aux entreprises ou aux indépendants.",
      "Chaque prestation est préparée en fonction du lieu, des horaires et du déroulement réel de la journée afin de conserver une réalisation naturelle tout en sécurisant les images essentielles.",
    ],
    nearby: ["Triel-sur-Seine", "Saint-Germain-en-Laye", "Paris", "Yvelines"],
    faq: [
      {
        question: "Réalisez-vous des mariages à Versailles ?",
        answer:
          "Oui. Je réalise des films et reportages photo de mariage à Versailles et dans les Yvelines, avec une approche naturelle et documentaire.",
      },
      {
        question: "Proposez-vous à la fois la photo et la vidéo ?",
        answer:
          "Oui. Les prestations peuvent concerner la photographie, la vidéo ou être pensées selon un dispositif combinant les deux médiums en fonction du projet.",
      },
      {
        question: "Intervenez-vous pour des événements professionnels ?",
        answer:
          "Oui. Je couvre des événements professionnels et réalise également des portraits, interviews et films de présentation.",
      },
    ],
  },
  {
    slug: "saint-germain-en-laye",
    city: "Saint-Germain-en-Laye",
    department: "Yvelines",
    region: "Île-de-France",
    metaTitle: "Photographe & vidéaste à Saint-Germain-en-Laye | VK",
    metaDescription:
      "Photographe et vidéaste à Saint-Germain-en-Laye : mariages, événements, portraits et projets professionnels dans les Yvelines et en Île-de-France.",
    eyebrow: "Saint-Germain-en-Laye / Photographe & vidéaste",
    title: "Raconter les personnes avant de mettre en scène les images.",
    lead:
      "Photographie et vidéo à Saint-Germain-en-Laye avec une approche documentaire, naturelle et contemporaine.",
    introduction: [
      "À Saint-Germain-en-Laye, je réalise des reportages photo et vidéo pour les particuliers comme pour les professionnels. Le point de départ reste toujours le même : comprendre ce qui doit être raconté avant de choisir comment le filmer ou le photographier.",
      "Cette méthode permet de conserver des images spontanées et cohérentes, tout en laissant suffisamment de place à une direction plus précise lorsque le portrait, la communication ou la production l'exigent.",
    ],
    localTitle: "Photographe et vidéaste dans l'ouest parisien",
    localContent: [
      "Basé à Triel-sur-Seine, je suis proche de Saint-Germain-en-Laye et j'interviens facilement sur les projets organisés dans ce secteur des Yvelines et dans l'ouest parisien.",
      "Mariages, portraits, événements, interviews ou films de présentation : la réalisation s'adapte au contexte sans abandonner une esthétique sobre, naturelle et cinématographique.",
    ],
    nearby: ["Triel-sur-Seine", "Versailles", "Paris", "Yvelines"],
    faq: [
      {
        question: "Vous déplacez-vous à Saint-Germain-en-Laye ?",
        answer:
          "Oui. Étant basé à Triel-sur-Seine, j'interviens facilement à Saint-Germain-en-Laye et dans l'ensemble de l'ouest parisien.",
      },
      {
        question: "Quels types de prestations proposez-vous ?",
        answer:
          "Photographie et vidéo de mariage, portraits, reportages, événements privés ou professionnels, interviews et films de présentation.",
      },
      {
        question: "Travaillez-vous uniquement dans les Yvelines ?",
        answer:
          "Non. Je travaille dans les Yvelines, à Paris, dans toute l'Île-de-France et je me déplace partout en France selon les projets.",
      },
    ],
  },
];

export const locationPageMap = Object.fromEntries(
  locationPages.map((page) => [page.slug, page]),
) as Record<string, LocationPage>;
