# CLAUDE.md — Règles Frontend Website

## Toujours faire en premier
- **Invoquer le skill `frontend-design`** avant d'écrire du code frontend, à chaque session, sans exception.

## Images de référence
- Si une image de référence est fournie : reproduire exactement le layout, l'espacement, la typographie et les couleurs. Remplacer le contenu par du contenu générique (images via `https://placehold.co/`, texte générique). Ne pas améliorer ni ajouter à la maquette.
- Si aucune image de référence : designer from scratch avec un haut niveau de qualité (voir les règles anti-générique ci-dessous).
- Prendre un screenshot, comparer à la référence, corriger les écarts, reprendre un screenshot. Faire au moins 2 rounds de comparaison. S'arrêter uniquement quand il n'y a plus de différences visibles ou que l'utilisateur le dit.

## Serveur local
- **Toujours servir sur localhost** — ne jamais prendre de screenshot d'une URL `file:///`.
- Démarrer le serveur de dev : `node serve.mjs` (sert la racine du projet sur `http://localhost:3000`)
- `serve.mjs` se trouve à la racine du projet. Le démarrer en arrière-plan avant tout screenshot.
- Si le serveur est déjà en cours d'exécution, ne pas en démarrer un second.

## Workflow de screenshots
- Puppeteer est installé localement dans `node_modules/puppeteer/`. Chrome est dans `~/.cache/puppeteer/`.
- **Toujours prendre les screenshots depuis localhost :** `node screenshot.mjs http://localhost:3000`
- Les screenshots sont automatiquement sauvegardés dans `./temporary screenshots/screenshot-N.png` (auto-incrémenté, jamais écrasé).
- Suffixe de label optionnel : `node screenshot.mjs http://localhost:3000 label` → sauvegarde sous `screenshot-N-label.png`
- Sélecteur CSS optionnel (4ème arg) pour scroller jusqu'à un élément : `node screenshot.mjs http://localhost:3000 label "#galerie"`
- `screenshot.mjs` se trouve à la racine du projet. L'utiliser tel quel.
- **Important :** garder `headless: true` (pas `headless: 'new'`) — le mode new casse WebGL.
- Après le screenshot, lire le PNG depuis `temporary screenshots/` avec le Read tool — Claude peut voir et analyser l'image directement.
- Lors des comparaisons, être précis : "le titre fait 32px mais la référence montre ~24px", "l'écart entre les cartes est 16px mais devrait être 24px"
- Vérifier : espacement/padding, taille/graisse/interligne des polices, couleurs (hex exact), alignement, border-radius, ombres, dimensions des images

## Valeurs par défaut de l'output
- Fichier `index.html` unique, tous les styles inline, sauf indication contraire
- Tailwind CSS via CDN : `<script src="https://cdn.tailwindcss.com"></script>`
- Images placeholder : `https://placehold.co/LARGEURxHAUTEUR`
- Responsive mobile-first

## Assets de marque
- Toujours vérifier le dossier `brand_assets/` avant de designer. Il peut contenir des logos, guides de couleurs, guides de style ou images.
- Si des assets sont présents, les utiliser. Ne pas utiliser de placeholders quand de vrais assets sont disponibles.
- Si un logo est présent, l'utiliser. Si une palette de couleurs est définie, utiliser ces valeurs exactes — ne pas inventer des couleurs de marque.

## Règles anti-générique
- **Couleurs :** Ne jamais utiliser la palette Tailwind par défaut (indigo-500, blue-600, etc.). Choisir une couleur de marque personnalisée et en dériver.
- **Ombres :** Ne jamais utiliser `shadow-md` flat. Utiliser des ombres en couches, teintées de couleur avec une faible opacité.
- **Typographie :** Ne jamais utiliser la même police pour les titres et le corps de texte. Associer une police display/serif avec un sans-serif épuré. Appliquer un tracking serré (`-0.03em`) sur les grands titres, un interligne généreux (`1.7`) sur le corps.
- **Dégradés :** Superposer plusieurs dégradés radiaux. Ajouter du grain/texture via un filtre SVG noise pour la profondeur.
- **Animations :** N'animer que `transform` et `opacity`. Jamais `transition-all`. Utiliser un easing de type spring.
- **États interactifs :** Chaque élément cliquable doit avoir des états hover, focus-visible et active. Sans exception.
- **Images :** Ajouter un overlay de dégradé (`bg-gradient-to-t from-black/60`) et une couche de traitement coloré avec `mix-blend-multiply`.
- **Espacement :** Utiliser des tokens d'espacement intentionnels et cohérents — pas des pas Tailwind aléatoires.
- **Profondeur :** Les surfaces doivent avoir un système de couches (base → élevé → flottant), ne pas toutes être sur le même plan z.

## Règles absolues
- Ne pas ajouter de sections, fonctionnalités ou contenu absents de la référence
- Ne pas "améliorer" une maquette de référence — la reproduire
- Ne pas s'arrêter après un seul round de screenshot
- Ne pas utiliser `transition-all`
- Ne pas utiliser le bleu/indigo Tailwind par défaut comme couleur principale
