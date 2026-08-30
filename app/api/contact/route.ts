import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.redirect(
      new URL("/contact?error=database", request.url),
      303
    );
  }

  try {
    const form = await request.formData();

    const result = contactMessageSchema.safeParse({
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      subject: String(form.get("subject") || ""),
      message: String(form.get("message") || "")
    });

    if (!result.success) {
      return NextResponse.redirect(
        new URL("/contact?error=validation", request.url),
        303
      );
    }

    await prisma.contactMessage.create({
      data: result.data
    });

    return NextResponse.redirect(new URL("/contact?sent=1", request.url), 303);
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.redirect(
      new URL("/contact?error=server", request.url),
      303
    );
  }
}
