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

## Contraintes produit

- slug projet unique ;
- slug catégorie unique ;
- suppression projet => suppression de ses médias DB ;
- suppression physique des fichiers à ajouter avec le provider de stockage production.
