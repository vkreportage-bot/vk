import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/schemas";

function parseProjectForm(form: FormData) {
  return {
    title: form.get("title"),
    slug: form.get("slug"),
    excerpt: form.get("excerpt"),
    description: form.get("description"),
    client: form.get("client") || null,
    location: form.get("location") || null,
    year: form.get("year") ? Number(form.get("year")) : null,
    coverUrl: form.get("coverUrl"),
    featured: form.get("featured") === "true",
    published: form.get("published") === "true",
    categoryIds: form.getAll("categoryIds").map(String)
  };
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is required to create projects." },
      { status: 503 }
    );
  }

  const form = await request.formData();
  const result = projectSchema.safeParse(parseProjectForm(form));

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const { categoryIds, ...data } = result.data;

  const project = await prisma.project.create({
    data: {
      ...data,
      categories: {
        connect: categoryIds.map((id) => ({ id }))
      }
    }
  });

  return NextResponse.redirect(
    new URL(`/admin/projects/${project.slug}`, request.url),
    303
  );
}
