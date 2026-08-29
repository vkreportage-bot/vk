# Product spec — VK

## Objectif

Créer un portfolio premium pour un vidéaste amateur souhaitant :
- montrer son travail ;
- classer ses projets par catégorie ;
- publier des projets comprenant photos, vidéos, ou les deux ;
- recevoir des demandes de contact ;
- administrer lui-même son contenu.

## Identité

Nom public : **VK**

## Contenu public

### Home
- hero cinématique ;
- sélection de projets ;
- accès aux catégories ;
- présentation courte de l'approche ;
- CTA contact.

### Portfolio
- liste de tous les projets ;
- filtres par catégories ;
- images parfaitement alignées dans une grille cohérente ;
- chaque carte mène à une fiche projet.

### Projet
- titre, résumé, description ;
- catégories ;
- client / lieu / année facultatifs ;
- couverture ;
- galerie photos ;
- vidéos ;
- YouTube préféré pour la diffusion vidéo.

### À propos
- présentation courte du vidéaste et de l'approche.

### Contact
- email dans le MVP ;
- formulaire transactionnel possible ensuite.

## Back-office

Utilisateur unique : propriétaire du site.

Fonctions :
- connexion ;
- créer / modifier / publier un projet ;
- mettre un projet en avant ;
- créer une catégorie ;
- associer une ou plusieurs catégories à un projet ;
- upload photo ;
- upload vidéo local pour développement ;
- ajouter une vidéo YouTube ;
- consulter les projets publiés et brouillons.

## Règles médias

- Un projet peut contenir 0..n photos.
- Un projet peut contenir 0..n vidéos.
- Un projet peut mélanger photos et vidéos.
- La couverture est obligatoire avant publication.
- Les médias ont un `sortOrder`.
- Les miniatures portfolio conservent toutes le même ratio.

## Hors MVP

- paiement / vente de prestation en ligne ;
- espace client ;
- commentaires ;
- multi-utilisateur ;
- upload automatique d'une vidéo vers le compte YouTube via OAuth.
