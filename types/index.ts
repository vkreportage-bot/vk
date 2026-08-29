export type MediaType = "IMAGE" | "VIDEO";

export type MediaItem = {
  id: string;
  type: MediaType;
  url: string;
  alt?: string | null;
  posterUrl?: string | null;
  sortOrder: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  client?: string | null;
  location?: string | null;
  year?: number | null;
  featured: boolean;
  published: boolean;
  coverUrl: string;
  categories: Category[];
  media: MediaItem[];
};
