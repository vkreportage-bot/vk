import Link from "next/link";
import { LogOut } from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projets" },
  { href: "/admin/categories", label: "Catégories" }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f6f4] pt-24">
      <div className="container-vk grid gap-8 py-8 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="mb-6 text-xl font-black tracking-[-0.08em]">VK / ADMIN</p>
          <nav className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm hover:bg-black/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action="/api/admin/logout" method="post" className="mt-8">
            <button className="flex items-center gap-2 px-3 text-sm text-black/60">
              <LogOut size={15} /> Déconnexion
            </button>
          </form>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
