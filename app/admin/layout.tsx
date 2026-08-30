import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Administration VK",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function getUnreadCount() {
  if (!process.env.DATABASE_URL) return 0;
  try {
    return await prisma.contactMessage.count({ where: { readAt: null } });
  } catch {
    return 0;
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const unreadCount = await getUnreadCount();
  return <AdminShell unreadCount={unreadCount}>{children}</AdminShell>;
}
