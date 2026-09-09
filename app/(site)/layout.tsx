import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TopBrandBar } from "@/components/top-brand-bar";
import { isAdmin } from "@/lib/auth";
import { getMaintenanceSettings } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [maintenance, admin] = await Promise.all([
    getMaintenanceSettings(),
    isAdmin()
  ]);

  if (maintenance?.enabled && !admin) {
    redirect("/maintenance");
  }

  return (
    <>
      <TopBrandBar />
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
