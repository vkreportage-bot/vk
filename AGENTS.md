# VK — Agent handoff

Read `/specs` before changing product behavior or layout.

## Non-negotiables

- Brand name: **VK**
- Public site: premium, cinematic, editorial, minimal.
- All project thumbnails must align: same aspect ratio, same grid rhythm, `object-fit: cover`.
- Projects can contain photos, videos, or both.
- Categories are managed by the admin and can be created while editing a project.
- YouTube is the preferred video source.
- Admin is intentionally single-user.
- SEO + GEO are first-class requirements.
- Do not expose `/admin` content to crawlers.
- Public pages must remain usable when `DATABASE_URL` is absent by falling back to demo content.
- Keep data access behind `lib/repository.ts`.
- Do not couple public components directly to Prisma.
