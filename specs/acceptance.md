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

## SEO / GEO

- [ ] `/robots.txt` interdit `/admin/` et `/api/admin/`.
- [ ] `/sitemap.xml` contient les pages publiques et projets publiés.
- [ ] Chaque projet a un title + description uniques.
- [ ] Home contient JSON-LD `ProfessionalService`.
- [ ] Projet contient JSON-LD `CreativeWork`.
- [ ] Admin est `noindex`.

## Production

- [ ] Stockage local remplacé par un stockage persistant.
- [ ] `DATABASE_URL` de production configuré.
- [ ] `AUTH_SECRET` fort configuré.
- [ ] `NEXT_PUBLIC_SITE_URL` pointe sur le domaine canonique.
