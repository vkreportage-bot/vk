import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL required." }, { status: 503 });
  }

  const { id } = await params;

  const message = await prisma.contactMessage.findUnique({
    where: { id },
    select: { id: true, readAt: true }
  });

  if (!message) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  if (!message.readAt) {
    await prisma.contactMessage.update({
      where: { id },
      data: { readAt: new Date() }
    });
  }

  const unreadCount = await prisma.contactMessage.count({
    where: { readAt: null }
  });

  return NextResponse.json({ ok: true, unreadCount });
}
