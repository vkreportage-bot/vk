import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { articleSchema } from "@/lib/schemas";

function parseArticleForm(form: FormData) {
  return {
    title: form.get("title"),
    slug: form.get("slug"),
    excerpt: form.get("excerpt"),
    content: form.get("content"),
    coverUrl: form.get("coverUrl") || "",
    coverAlt: form.get("coverAlt") || "",
    author: form.get("author") || "VK",
    keywords: String(form.get("keywords") || "")
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    metaTitle: form.get("metaTitle") || "",
    metaDescription: form.get("metaDescription") || "",
    published: form.get("published") === "true",
    publishedAt: form.get("publishedAt") || ""
  };
}

function publicationDate(published: boolean, value: string | null) {
  if (!published) return null;
  if (!value) return new Date();

  const date = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL required." }, { status: 503 });
  }

  const { id } = await params;
  const form = await request.formData();
  const result = articleSchema.safeParse(parseArticleForm(form));

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { publishedAt, ...data } = result.data;
  const article = await prisma.article.update({
    where: { id },
    data: {
      ...data,
      publishedAt: publicationDate(data.published, publishedAt)
    }
  });

  return NextResponse.redirect(
    new URL(`/admin/blog/${article.slug}`, request.url),
    303
  );
}
