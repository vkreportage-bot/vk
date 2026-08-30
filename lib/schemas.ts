import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(100)
});

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(140),
  slug: z.string().trim().min(2).max(160),
  excerpt: z.string().trim().min(10).max(240),
  description: z.string().trim().min(20),
  client: z.string().trim().max(120).optional().nullable(),
  location: z.string().trim().max(120).optional().nullable(),
  year: z.number().int().min(2000).max(2100).optional().nullable(),
  coverUrl: z.string().trim().min(1),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string()).default([])
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z
    .string()
    .trim()
    .max(30)
    .transform((value) => value || null),
  subject: z
    .string()
    .trim()
    .max(160)
    .transform((value) => value || null),
  message: z.string().trim().min(10).max(5000)
});
