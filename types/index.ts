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

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl?: string | null;
  coverAlt?: string | null;
  author: string;
  keywords: string[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  published: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
