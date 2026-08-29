# Architecture — VK

## Runtime

- Next.js App Router
- TypeScript strict
- React 19
- Tailwind CSS
- Prisma + PostgreSQL
- Server Components par défaut
- Client Components uniquement lorsque l'interaction le nécessite

## Couches

### `app/`
Routing et composition.

### `components/`
Composants visuels sans accès direct à la DB.

### `lib/repository.ts`
Seule API de lecture utilisée par le front public.
Elle fournit un fallback de démonstration si `DATABASE_URL` est absent.

### `lib/prisma.ts`
Client Prisma.

### `app/api/admin/*`
Écritures du back-office.

## Auth admin

Single-user auth :
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- cookie HTTP-only signé via `AUTH_SECRET`.

Cette solution est volontairement plus simple qu'un provider complet.
Si le besoin devient multi-utilisateur, migrer vers Auth.js/Clerk/Supabase Auth.

## Média

MVP :
- YouTube pour la vidéo distante ;
- upload local disponible en développement.

Production :
- brancher un provider objet persistant dans `lib/media-storage.ts`;
- recommandations : Cloudflare R2 / S3 / Cloudinary ;
- conserver la même interface d'upload afin de ne pas réécrire l'admin.

## Déploiement

Compatible Vercel pour le front.
Attention : `public/uploads` n'est pas un stockage persistant sur une plateforme serverless.
