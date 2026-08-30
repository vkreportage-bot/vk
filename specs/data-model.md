# Data model — VK

## Project

- `id`
- `title`
- `slug` unique
- `excerpt`
- `description`
- `client?`
- `location?`
- `year?`
- `coverUrl`
- `featured`
- `published`
- `sortOrder`
- timestamps
- categories[]
- media[]

## Category

- `id`
- `name`
- `slug` unique
- `sortOrder`
- timestamps
- projects[]

Relation projet ↔ catégorie : many-to-many.

## Media

- `id`
- `projectId`
- `type`: IMAGE | VIDEO
- `url`
- `alt?`
- `posterUrl?`
- `sortOrder`
- timestamp

## Article

- `id`
- `title`
- `slug` unique
- `excerpt`
- `content` texte long, Markdown léger
- `coverUrl?`
- `coverAlt?`
- `author`
- `keywords[]`
- `metaTitle?`
- `metaDescription?`
- `published`
- `publishedAt?`
- timestamps

Les articles sont autonomes dans le MVP. Une taxonomie dédiée pourra être ajoutée plus tard si le volume éditorial la justifie.

## Contraintes produit

- slug projet unique ;
- slug catégorie unique ;
- slug article unique ;
- suppression projet => suppression de ses médias DB ;
- seuls les articles `published = true` sont exposés dans `/blog`, les pages article et le sitemap ;
- suppression physique des fichiers à ajouter avec le provider de stockage production.
