import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getMaintenanceSettings } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const maintenance = await getMaintenanceSettings();

  if (maintenance?.enabled) {
    redirect("/maintenance");
  }

  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
