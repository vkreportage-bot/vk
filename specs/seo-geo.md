# SEO + GEO — VK

## SEO technique

Le projet doit fournir :
- metadata globale ;
- title template ;
- meta descriptions uniques ;
- canonical ;
- Open Graph ;
- Twitter card ;
- `robots.txt` dynamique ;
- `sitemap.xml` dynamique ;
- pages admin en `noindex`;
- HTML sémantique ;
- textes alternatifs ;
- images via `next/image`.

## SEO contenu

Chaque projet doit avoir :
- un titre descriptif ;
- un extrait unique ;
- une description utile ;
- catégorie(s) ;
- lieu et année lorsque pertinents ;
- médias accompagnés d'alt text.

Ne pas créer de pages catégories vides uniquement pour multiplier les URLs.

## GEO / moteurs génératifs

Objectif : rendre les informations sur VK faciles à extraire et attribuer.

- présenter clairement qui est VK et ce qu'il réalise ;
- utiliser des formulations factuelles ;
- expliciter les types de prestations et zones lorsque validés ;
- JSON-LD `ProfessionalService` sur la home ;
- JSON-LD `CreativeWork` sur les projets ;
- relier les projets à leur catégorie ;
- conserver les contenus essentiels dans le HTML serveur et non uniquement dans des interactions JS ;
- créer ultérieurement des FAQ utiles si de vraies questions clients apparaissent.

## Données structurées MVP

Home :
- `ProfessionalService`

Projet :
- `CreativeWork`

Évolution possible :
- `VideoObject` pour chaque vidéo lorsque titre, thumbnail, date et durée sont disponibles via YouTube.
