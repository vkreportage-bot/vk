# VK — portfolio vidéaste

Starter Next.js pour un portfolio de vidéaste avec projets, catégories, photos, vidéos YouTube, back-office propriétaire et fondations SEO/GEO.

## 1. Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Le front public fonctionne immédiatement avec des données de démonstration si `DATABASE_URL` n'est pas configuré.

## 2. Base de données

Créer une base PostgreSQL puis renseigner `DATABASE_URL`.

```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

## 3. Admin

Renseigner dans `.env.local` :

```env
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
AUTH_SECRET=...
```

Puis ouvrir `/admin/login`.

## 4. Médias

- Vidéo recommandée : URL YouTube.
- Upload local photo/vidéo : uniquement pratique en développement.
- Avant production, remplacer `lib/media-storage.ts` par un stockage persistant R2/S3/Cloudinary.

## 5. Structure importante

- `app/` : App Router public + admin + API.
- `components/` : UI publique et admin.
- `lib/repository.ts` : couche de données avec fallback démo.
- `prisma/schema.prisma` : modèle de données.
- `specs/` : spécifications produit, design, architecture, SEO/GEO et critères d'acceptation.
- `specs/mockup.html` : maquette HTML autonome.

## 6. Avant mise en production

1. Remplacer les médias de démonstration.
2. Brancher un stockage persistant pour les uploads.
3. Configurer PostgreSQL.
4. Définir `NEXT_PUBLIC_SITE_URL`.
5. Définir les identifiants admin et un `AUTH_SECRET` fort.
6. Brancher le formulaire de contact à Resend ou au fournisseur choisi.
7. Vérifier Lighthouse, métadonnées, sitemap, robots et données structurées.
