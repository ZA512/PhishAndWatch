# Phish & Watch

Un jeu LCD rétro inspiré des références dans `docs/PRD.md`. HTML, CSS et JavaScript, sans dépendance, sans compilation ni backend.

## Jouer

Ouvrir `index.html` dans un navigateur, ou lancer `python -m http.server 8765 --bind 127.0.0.1` dans ce dossier et visiter `http://127.0.0.1:8765`.

- **← / →**, **A / D**, ou les boutons rouges : choisir l’une des quatre positions du personnage. Maintenir une commande permet de parcourir les positions.
- **Game A** : rythme normal. **Game B** : rythme plus rapide avec davantage d’emails simultanés. Cliquer sur un mode démarre une nouvelle partie.
- L’interception est automatique au tick suivant l’arrivée dans la cinquième position : attraper un phishing marqué d’un crâne donne un point. Laisser passer un phishing ou attraper un email légitime compte une erreur. Trois erreurs terminent la partie.
- **Entrée** : démarrer, reprendre ou rejouer. **P / Espace / Échap** : pause. La partie se met aussi en pause quand le navigateur perd le focus.
- Le son et les records des deux modes sont mémorisés localement lorsque le navigateur autorise le stockage.

## Structure

- `src/engine.js` : moteur indépendant du DOM, horloge par ticks, collisions, difficulté, aléatoire avec seed et contraintes de génération.
- `src/screen.js` : décor SVG imprimé, quatre poses distinctes, segments fixes d’emails, d’impacts et d’affichage numérique.
- `src/main.js` : horloge centrale, clavier et tactile, Web Audio, sauvegarde locale et interface.
- `style.css` : console au ratio fixe avec écran horizontal et adaptation à la largeur de l’écran.

`?debug=1&seed=123456` affiche les informations du moteur et permet de reproduire une partie. Le bouton de debug ou **L** allume tous les segments ; le jeu se fige pendant cette inspection.

## Vérifier le moteur

Avec Node.js : `node --test tests/engine.test.cjs`.

Les tests couvrent les règles, les cinq positions, les pauses, les limites des mouvements, les scores supérieurs à 999, les modes, la progression, les seeds reproductibles et la génération sur 160 parties de 900 ticks.
