import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/schemas";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is required to create categories." },
      { status: 503 }
    );
  }

  const form = await request.formData();
  const result = categorySchema.safeParse({
    name: form.get("name"),
    slug: form.get("slug")
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  await prisma.category.create({ data: result.data });
  return NextResponse.redirect(new URL("/admin/categories", request.url), 303);
}
