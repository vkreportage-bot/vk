import { demoArticles, demoCategories, demoProjects } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";
import type { Article, Category, Project } from "@/types";

const hasDatabase = Boolean(process.env.DATABASE_URL);

const projectInclude = {
  categories: true,
  media: { orderBy: { sortOrder: "asc" as const } }
};

function getDemoArticles(includeDrafts = false) {
  return demoArticles
    .filter((article) => includeDrafts || article.published)
    .sort(
      (a, b) =>
        (b.publishedAt?.getTime() ?? b.createdAt.getTime()) -
        (a.publishedAt?.getTime() ?? a.createdAt.getTime())
    );
}

function isMissingArticleTable(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2021"
  );
}

export async function getProjects(options?: {
  featured?: boolean;
  category?: string;
  includeDrafts?: boolean;
}): Promise<Project[]> {
  if (!hasDatabase) {
    return demoProjects.filter((project) => {
      const publishedOk = options?.includeDrafts ? true : project.published;
      const featuredOk = options?.featured ? project.featured : true;
      const categoryOk = options?.category
        ? project.categories.some((category) => category.slug === options.category)
        : true;
      return publishedOk && featuredOk && categoryOk;
    });
  }

  const projects = await prisma.project.findMany({
    where: {
      ...(options?.includeDrafts ? {} : { published: true }),
      ...(options?.featured ? { featured: true } : {}),
      ...(options?.category
        ? { categories: { some: { slug: options.category } } }
        : {})
    },
    include: projectInclude,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });

  return projects as Project[];
}

export async function getProjectBySlug(
  slug: string,
  includeDrafts = false
): Promise<Project | null> {
  if (!hasDatabase) {
    return (
      demoProjects.find(
        (project) => project.slug === slug && (includeDrafts || project.published)
      ) ?? null
    );
  }

  const project = await prisma.project.findFirst({
    where: {
      slug,
      ...(includeDrafts ? {} : { published: true })
    },
    include: projectInclude
  });

  return project as Project | null;
}

export async function getCategories(): Promise<Category[]> {
  if (!hasDatabase) return demoCategories;

  return (await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  })) as Category[];
}

export async function getArticles(options?: {
  includeDrafts?: boolean;
}): Promise<Article[]> {
  if (!hasDatabase) return getDemoArticles(Boolean(options?.includeDrafts));

  try {
    return (await prisma.article.findMany({
      where: options?.includeDrafts ? {} : { published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
    })) as Article[];
  } catch (error) {
    if (isMissingArticleTable(error)) {
      return getDemoArticles(Boolean(options?.includeDrafts));
    }
    throw error;
  }
}

export async function getArticleBySlug(
  slug: string,
  includeDrafts = false
): Promise<Article | null> {
  const demoArticle = () =>
    demoArticles.find(
      (article) => article.slug === slug && (includeDrafts || article.published)
    ) ?? null;

  if (!hasDatabase) return demoArticle();

  try {
    return (await prisma.article.findFirst({
      where: {
        slug,
        ...(includeDrafts ? {} : { published: true })
      }
    })) as Article | null;
  } catch (error) {
    if (isMissingArticleTable(error)) return demoArticle();
    throw error;
  }
}
