# Acceptance criteria — VK

## Public

- [ ] La home charge sans base de données.
- [ ] Le logo affiché est VK.
- [ ] La grille desktop affiche jusqu'à 4 projets par ligne.
- [ ] Toutes les photos d'une même grille sont parfaitement alignées.
- [ ] La grille passe en 2 colonnes tablette, 1 colonne mobile.
- [ ] Le filtre catégorie modifie la liste des projets.
- [ ] Une fiche projet peut afficher uniquement des photos.
- [ ] Une fiche projet peut afficher uniquement des vidéos.
- [ ] Une fiche projet peut afficher photos + vidéos.
- [ ] Une URL YouTube valide s'affiche via `youtube-nocookie.com`.
- [ ] Chaque projet publié possède une URL unique.
- [ ] Les brouillons n'apparaissent pas publiquement.
- [ ] `/blog` liste uniquement les articles publiés.
- [ ] Chaque article publié possède une URL `/blog/[slug]` unique.
- [ ] Le blog reste consultable avec les données demo lorsque `DATABASE_URL` est absent.
- [ ] Le contenu article est rendu dans le HTML serveur.

## Admin

- [ ] `/admin` demande une authentification.
- [ ] L'admin peut créer une catégorie.
- [ ] L'admin peut créer un projet.
- [ ] L'admin peut modifier un projet.
- [ ] L'admin peut choisir plusieurs catégories.
- [ ] L'admin peut définir publié / brouillon.
- [ ] L'admin peut définir featured.
- [ ] L'admin peut uploader une photo en environnement local.
- [ ] L'admin peut uploader une vidéo en environnement local.
- [ ] L'admin peut ajouter une URL YouTube.
- [ ] L'admin peut créer et modifier un article.
- [ ] L'admin peut publier et dépublier un article.
- [ ] L'admin peut supprimer un article.
- [ ] L'admin peut gérer couverture, alt, auteur, date, mots-clés et métadonnées SEO d'un article.

## SEO / GEO

- [ ] `/robots.txt` interdit `/admin/` et `/api/admin/`.
- [ ] `/sitemap.xml` contient les pages publiques, projets publiés et articles publiés.
- [ ] Chaque projet a un title + description uniques.
- [ ] Chaque article a une canonical et des métadonnées uniques ou un fallback titre/résumé.
- [ ] Home contient JSON-LD `ProfessionalService`.
- [ ] Projet contient JSON-LD `CreativeWork`.
- [ ] Blog contient JSON-LD `Blog`.
- [ ] Article contient JSON-LD `BlogPosting`.
- [ ] Admin est `noindex`.

## Production

- [ ] Stockage local remplacé par un stockage persistant.
- [ ] `DATABASE_URL` de production configuré.
- [ ] La migration `add_blog_articles` est déployée en production.
- [ ] `AUTH_SECRET` fort configuré.
- [ ] `NEXT_PUBLIC_SITE_URL` pointe sur le domaine canonique.
