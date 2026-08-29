# Design system — VK

## Direction

Référence : portfolio vidéo haut de gamme, éditorial, cinématographique.
Inspirations conceptuelles : Whiftman / studios créatifs minimalistes.
Ne pas copier une marque ou un site existant à l'identique.

## Principes

1. Grande typographie.
2. Peu de couleurs.
3. Images dominantes.
4. Beaucoup d'espace négatif.
5. Animations discrètes.
6. Aucun effet "template SaaS".
7. Alignement strict des médias.

## Palette

- Fond principal : `#f3f1ed`
- Texte : `#151515`
- Fond sombre : `#101010`
- Texte clair : `#f7f5f0`
- Muted : `#6e6a64`

## Typographie

MVP : pile système pour ne pas bloquer le projet.
Évolution recommandée : une grotesque éditoriale + éventuellement une serif d'accent.

- Display : clamp ~54px → 152px
- H2 : clamp ~35px → 80px
- Corps : 16–24px selon contexte
- Eyebrow : uppercase, tracking large

## Grille projets

Desktop :
- 4 colonnes ;
- `gap-x: 16px` ;
- toutes les covers en `aspect-ratio: 4 / 5` ;
- `object-fit: cover` ;
- titres sous l'image.

Tablet :
- 2 colonnes.

Mobile :
- 1 colonne.

### Règle critique
Ne jamais laisser la hauteur intrinsèque des photos déterminer la hauteur des cartes.
C'est cette règle qui garantit l'alignement demandé.

## Mouvement

- hover média : scale max 1.025 ;
- transition ~700ms ;
- pas de parallaxe agressive ;
- respecter `prefers-reduced-motion`.
