# PRD — Phish & Watch

## 1. Vision produit

Créer un mini-jeu web de cybersécurité inspiré directement des consoles LCD portables du début des années 1980, notamment les Nintendo Game & Watch.

Le jeu ne doit pas simplement reprendre une esthétique rétro : il doit reproduire les contraintes et les mécaniques d’un véritable jeu LCD à segments fixes.

Le joueur contrôle un personnage chargé de laisser passer les emails légitimes et de détruire les emails de phishing.

Le jeu ne cherche pas à enseigner comment reconnaître un phishing. La cybersécurité constitue ici le thème du jeu, pas son contenu pédagogique.

Objectif principal :

> créer un jeu immédiatement compréhensible, rapide, addictif et nostalgique, donnant réellement l’impression de jouer à une console LCD des années 1980.

Nom de travail :

**Phish & Watch**

---

# 2. Principes fondamentaux

## 2.1 Simulation d'un écran LCD

Aucun élément du jeu ne doit se déplacer librement à l'écran.

Chaque position possible d'un personnage ou d'un objet est prédessinée et constitue un segment indépendant.

Un mouvement consiste uniquement à :

1. éteindre le segment actuellement actif ;
2. allumer le segment suivant.

Exemple :

```text
mail_lane_1_step_1
mail_lane_1_step_2
mail_lane_1_step_3
mail_lane_1_step_4
mail_lane_1_step_5
```

Pour simuler un déplacement :

```text
step_1 OFF
step_2 ON
```

Il est interdit d'utiliser :

- animation CSS de déplacement ;
- interpolation ;
- `translateX()` / `translateY()` animé ;
- tweening ;
- mouvement pixel par pixel ;
- scrolling d'un sprite.

Le déplacement doit être visuellement discontinu.

---

# 3. Objectifs du jeu

Le joueur doit :

- identifier visuellement le type d'email ;
- intercepter les emails de phishing ;
- laisser passer les emails légitimes ;
- éviter trois erreurs.

Le gameplay doit pouvoir être compris sans tutoriel après quelques secondes.

Une partie doit pouvoir durer :

- quelques secondes pour un débutant ;
- plusieurs minutes pour un bon joueur.

Le jeu doit progressivement devenir difficile principalement par son rythme.

---

# 4. Non-objectifs

Le jeu ne doit pas devenir :

- un quiz phishing ;
- un jeu pédagogique complexe ;
- un simulateur de boîte mail ;
- un jeu nécessitant de lire du texte ;
- un jeu narratif ;
- un jeu avec inventaire ;
- un jeu avec progression RPG ;
- un jeu avec niveaux graphiquement différents.

Il ne doit pas expliquer pourquoi un message est un phishing.

---

# 5. Concept de gameplay

## 5.1 Terrain

L'écran contient plusieurs trajectoires fixes représentant l'arrivée des emails.

Version cible initiale :

**4 zones d'arrivée.**

Par exemple :

```text
 \                         /
  \                       /
   A                     D
    \                   /
     B                 C

       [personnage]
```

Une autre disposition peut être choisie si elle fonctionne mieux graphiquement.

Chaque trajectoire contient environ :

**5 positions successives.**

Exemple :

```text
MAIL_A_1
   ↓
MAIL_A_2
   ↓
MAIL_A_3
   ↓
MAIL_A_4
   ↓
MAIL_A_5
   ↓
ZONE D'INTERCEPTION
```

Le nombre exact pourra être ajusté entre 4 et 6 lors du prototypage.

---

# 6. Personnage

Le personnage possède uniquement des poses fixes.

Il ne se déplace jamais librement.

Version cible :

**4 positions possibles.**

Par exemple :

```text
LEFT_HIGH
LEFT_LOW
RIGHT_LOW
RIGHT_HIGH
```

ou quatre positions correspondant directement aux quatre voies de réception.

Les différentes positions du personnage doivent être de véritables dessins différents et non le même sprite déplacé à l'écran.

Le changement de position doit donc correspondre à :

```text
player_position_1 OFF
player_position_2 ON
```

---

# 7. Emails

Deux catégories existent.

## Email légitime

Représentation visuelle simple.

Exemple :

```text
enveloppe
```

## Phishing

Même silhouette générale mais avec un détail graphique immédiatement reconnaissable.

Exemples possibles :

- enveloppe fissurée ;
- petit hameçon ;
- symbole éclair ;
- enveloppe noire ;
- petit crâne ;
- œil ;
- morsure ;
- symbole d'alerte.

Le symbole choisi doit rester lisible même lorsque le jeu est affiché sur un petit écran.

Il ne doit y avoir aucun texte permettant d'identifier le phishing.

---

# 8. Règle principale

Lorsqu'un email atteint sa dernière position :

### Phishing

Si le joueur se trouve dans la bonne position :

```text
phishing détruit
+1 point
```

Sinon :

```text
phishing passe
MISS +1
```

### Email légitime

Si le joueur se trouve dans la position d'interception :

```text
email légitime détruit
MISS +1
```

Sinon :

```text
email légitime passe
aucune pénalité
```

Cette règle crée un comportement important :

> parfois le joueur doit volontairement NE PAS attraper un objet.

---

# 9. Destruction

L'interception doit rester extrêmement simple.

Option privilégiée :

**l'interception est automatique.**

Si le joueur se trouve dans la bonne position lorsque le phishing atteint sa zone finale, il est détruit.

Cela reproduit mieux les mécaniques des anciens jeux LCD.

Aucun bouton d'attaque supplémentaire n'est nécessaire pour la première version.

Une variante avec bouton ACTION pourra être expérimentée ultérieurement mais ne doit pas faire partie du MVP.

---

# 10. Erreurs

Le joueur dispose de :

**3 MISS.**

Les erreurs sont :

- laisser passer un phishing ;
- détruire un email légitime.

Affichage :

```text
MISS
● ● ●
```

ou équivalent LCD.

Après trois erreurs :

```text
GAME OVER
```

Le redémarrage doit être immédiat.

---

# 11. Score

Le score utilise un affichage LCD numérique.

Format :

```text
000
```

ou éventuellement :

```text
0000
```

Le score augmente lorsqu'un phishing est correctement détruit.

Le jeu doit pouvoir supporter un score supérieur à 999 en interne même si l'affichage initial est limité.

---

# 12. Game A / Game B

Comme sur de nombreux Game & Watch, l'écran d'accueil propose :

```text
GAME A
GAME B
```

## GAME A

Mode normal.

Caractéristiques :

- fréquence d'apparition raisonnable ;
- montée en vitesse progressive ;
- quantité limitée d'emails simultanés ;
- bon mode découverte.

## GAME B

Même jeu.

Aucune nouvelle mécanique.

Différences uniquement liées au rythme :

- davantage d'emails simultanés ;
- intervalles plus courts ;
- séquences moins prévisibles ;
- difficulté initiale supérieure.

Game B ne doit pas introduire de nouveaux contrôles.

---

# 13. Difficulté

La difficulté repose uniquement sur quelques variables.

## Variables principales

### Tick rate

Temps entre deux changements de position d'un email.

Exemple initial :

```text
700 ms
```

Puis progressivement :

```text
650
600
550
500
450
400
...
```

Une limite basse doit empêcher le jeu de devenir physiquement impossible.

Exemple :

```text
minimum ≈ 220–300 ms
```

La valeur exacte sera réglée après test.

---

## Nombre d'emails simultanés

Début :

```text
1
```

Puis :

```text
2
3
4
...
```

La difficulté doit venir en grande partie de l'obligation de suivre plusieurs trajectoires simultanément.

---

## Intervalle d'apparition

Ne pas faire apparaître les emails à intervalle parfaitement régulier.

Exemple :

```text
spawn_delay = base_delay × random(0.75, 1.25)
```

Cela évite que le joueur puisse simplement mémoriser un rythme musical.

---

# 14. Fair-play du générateur

Le jeu ne doit jamais créer une situation mathématiquement impossible.

Le moteur doit vérifier les objets déjà actifs avant de générer un nouvel email.

Exemple :

si deux emails nécessitent deux positions opposées exactement au même tick d'interception :

```text
spawn interdit
```

Le joueur doit perdre parce qu'il s'est trompé ou a été trop lent, pas parce que le moteur a généré une situation impossible.

Cette règle est très importante.

---

# 15. Architecture temporelle

Le jeu fonctionne sur un système de ticks.

Exemple :

```text
GameClock
    ↓
tick()
    ↓
update mails
    ↓
resolve collisions
    ↓
spawn éventuel
    ↓
render segments
```

Éviter d'avoir une animation indépendante par objet.

Le jeu doit idéalement être piloté par une horloge centrale.

---

# 16. Modèle d'un objet

Exemple conceptuel :

```javascript
{
  id: 42,
  lane: 2,
  type: "phishing",
  step: 3,
  active: true
}
```

À chaque tick :

```javascript
mail.step += 1
```

Puis l'affichage correspondant est activé.

---

# 17. Définition d'une voie

Exemple :

```javascript
lane = {
  id: 1,

  segments: [
    "mail_lane_1_step_1",
    "mail_lane_1_step_2",
    "mail_lane_1_step_3",
    "mail_lane_1_step_4",
    "mail_lane_1_step_5"
  ],

  targetPlayerPosition: 1
}
```

Le moteur de jeu ne doit pas avoir besoin de connaître les coordonnées graphiques.

Il manipule uniquement des identifiants de segments.

---

# 18. Rendu LCD

Chaque segment possède deux états :

```text
OFF
ON
```

Les segments OFF ne doivent pas être totalement invisibles.

Ils doivent rester légèrement perceptibles, comme sur certains écrans LCD vus sous un angle particulier.

Valeur indicative :

```css
opacity: 0.02 à 0.06
```

Segment ON :

```css
opacity: 0.80 à 1
```

Le réglage final dépendra du rendu.

---

# 19. Décor

Le décor est totalement fixe.

Il doit donner l'impression d'être imprimé sous ou autour de la couche LCD.

Exemples d'éléments possibles :

- bureau ;
- ordinateur ;
- serveur ;
- antenne ;
- nuage Internet ;
- corbeille ;
- bâtiment ;
- logo fictif ;
- câbles réseau.

Le décor peut utiliser plusieurs couleurs.

Les segments LCD dynamiques doivent rester visuellement monochromes ou quasi monochromes.

---

# 20. Style visuel

Référence visuelle :

console électronique portable 1980–1985.

Éviter :

- pixel art moderne ;
- synthwave ;
- néons ;
- scanlines CRT ;
- effet borne d'arcade ;
- écran cathodique ;
- sprites 8-bit.

Un Game & Watch n'est pas un jeu NES.

L'esthétique recherchée est :

**illustration imprimée + segments LCD.**

---

# 21. Boîtier

Le jeu web doit être affiché à l'intérieur d'une représentation de console portable.

Exemple :

```text
┌───────────────────────────────┐
│                               │
│       PHISH & WATCH           │
│                               │
│     ┌───────────────────┐     │
│     │                   │     │
│     │       LCD         │     │
│     │                   │     │
│     └───────────────────┘     │
│                               │
│    ◀      GAME A      ▶       │
│                               │
└───────────────────────────────┘
```

L'interface peut contenir :

- bouton gauche ;
- bouton droite ;
- Game A ;
- Game B ;
- éventuellement Time.

Le design peut s'inspirer des proportions historiques mais ne doit pas recopier une console existante ni utiliser les marques Nintendo/Game & Watch dans l'interface finale.

---

# 22. Contrôles

Desktop :

```text
←
→
```

ou éventuellement :

```text
← ↑ ↓ →
```

selon la disposition retenue.

Support également :

```text
A / D
```

Mobile :

boutons tactiles intégrés à la console.

Aucun joystick virtuel.

Les boutons doivent avoir :

- état normal ;
- état pressé ;
- retour visuel immédiat.

---

# 23. Son

Son volontairement minimaliste.

Utiliser de petits sons électroniques simples.

Exemples :

### déplacement

```text
tick
```

### phishing détruit

```text
bip
```

### erreur

```text
BEEP
```

### game over

courte séquence de quelques notes.

Éviter les samples audio réalistes.

Le son peut idéalement être généré avec Web Audio API.

---

# 24. Écran d'attente

Lorsque le jeu n'est pas démarré, l'écran doit pouvoir afficher une fonction horloge en clin d'œil aux Game & Watch.

Exemple :

```text
17:42
```

La première version peut toutefois se limiter à :

```text
PHISH & WATCH

GAME A
GAME B
```

---

# 25. États du jeu

Le moteur doit gérer au minimum :

```text
IDLE
PLAYING
MISS_ANIMATION
GAME_OVER
PAUSED
```

---

# 26. Animation des erreurs

Même les animations d'erreur doivent utiliser des segments prédéfinis.

Par exemple :

```text
personnage normal
↓
personnage surpris
↓
personnage normal
```

ou :

```text
mail
↓
explosion LCD
↓
vide
```

Aucune animation fluide.

---

# 27. Feedback d'une interception

Lorsqu'un phishing est détruit :

```text
MAIL
↓
IMPACT
↓
EXPLOSION
↓
OFF
```

Chaque étape correspond à un segment différent.

Le tout peut durer seulement quelques ticks.

---

# 28. Technologies recommandées

Application web statique.

Stack préférée :

```text
HTML
CSS
TypeScript
Vite
SVG
Web Audio API
```

Éviter les dépendances inutiles.

React n'est pas nécessaire pour le MVP.

Si un framework est utilisé, il ne doit pas compliquer le moteur.

---

# 29. SVG comme technologie de rendu

L'écran LCD devrait idéalement être un SVG.

Chaque segment possède un identifiant :

```html
<g id="mail-lane1-step1">
...
</g>
```

ou :

```html
<path id="mail-lane1-step1">
```

Le moteur manipule uniquement les classes :

```text
lcd-on
lcd-off
```

Exemple :

```css
.lcd-segment {
    opacity: 0.04;
}

.lcd-segment.active {
    opacity: 0.92;
}
```

---

# 30. Séparation moteur / rendu

Architecture importante :

```text
GameEngine
    |
    +-- GameState
    |
    +-- SpawnManager
    |
    +-- DifficultyManager
    |
    +-- CollisionResolver
    |
    +-- Renderer
    |
    +-- AudioManager
```

Le GameEngine ne doit pas manipuler directement le DOM.

Le Renderer reçoit un état et décide quels segments afficher.

---

# 31. Structure de projet suggérée

```text
src/
    game/
        GameEngine.ts
        GameState.ts
        GameClock.ts
        SpawnManager.ts
        DifficultyManager.ts
        CollisionResolver.ts

    render/
        LcdRenderer.ts

    input/
        InputManager.ts

    audio/
        AudioManager.ts

    config/
        gameA.ts
        gameB.ts
        lanes.ts

    assets/
        lcd.svg

    main.ts

index.html
style.css
```

---

# 32. Configuration du gameplay

Les valeurs principales doivent être configurables.

Exemple :

```typescript
const gameA = {
    initialTickMs: 700,
    minTickMs: 260,

    speedIncreaseEvery: 10,
    speedIncreaseMs: 25,

    initialMaxObjects: 1,
    maxObjects: 6,

    phishingProbability: 0.55,

    maxMisses: 3
}
```

Ces valeurs ne sont que des valeurs initiales de développement.

Elles devront être ajustées par le gameplay.

---

# 33. Génération pseudo-aléatoire

Pour faciliter les tests :

le générateur aléatoire doit pouvoir utiliser une seed.

Exemple :

```text
seed=123456
```

Cela permettra de reproduire exactement une partie problématique.

---

# 34. Mode debug

Créer un mode :

```text
?debug=1
```

Il peut afficher hors de la console :

```text
tick
score
speed
activeObjects
currentSeed
playerPosition
spawnQueue
```

Le debug ne doit jamais apparaître dans le rendu normal.

---

# 35. Debug LCD

Prévoir également une page ou touche permettant d'allumer tous les segments simultanément.

Objectif :

vérifier facilement l'écran complet.

Exemple :

```text
DEBUG SEGMENTS
```

Tous les mails, positions du personnage, impacts et chiffres deviennent visibles.

Ce rendu sera également utile pendant la création graphique.

---

# 36. Responsive design

Le ratio de la console doit rester fixe.

Sur desktop :

console centrée.

Sur mobile :

console adaptée à la largeur de l'écran.

Le jeu doit rester utilisable en orientation portrait.

Le SVG permet de conserver exactement les proportions.

---

# 37. Sauvegarde locale

Utiliser `localStorage` uniquement pour :

```text
highScoreGameA
highScoreGameB
soundEnabled
```

Aucun compte utilisateur.

Aucun backend.

---

# 38. Performance

Le jeu doit pouvoir fonctionner facilement à 60 FPS côté navigateur, mais le moteur de gameplay reste volontairement lent et basé sur ses ticks.

Le rendu ne doit pas essayer de rendre le gameplay plus fluide que le jeu LCD simulé.

---

# 39. Accessibilité

Prévoir :

- clavier ;
- tactile ;
- possibilité de couper le son ;
- contraste suffisant entre LCD ON et OFF ;
- aucune information essentielle reposant uniquement sur le son.

La différence phishing / légitime doit également être identifiable autrement que par une simple différence de couleur.

---

# 40. MVP

Le premier prototype doit contenir uniquement :

- console web ;
- écran LCD SVG ;
- 4 positions joueur ;
- 4 trajectoires ;
- environ 5 segments par trajectoire ;
- emails légitimes ;
- phishing ;
- déplacement par ticks ;
- interception ;
- 3 MISS ;
- score ;
- accélération ;
- Game A ;
- Game B ;
- son minimal ;
- high score local.

Ne rien ajouter avant que cette boucle de gameplay soit amusante.

---

# 41. Ordre de développement

## Étape 1

Créer une console très simple sans graphismes définitifs.

## Étape 2

Créer l'écran SVG avec :

```text
4 player segments
20 mail segments
score
MISS
```

## Étape 3

Créer le moteur de ticks.

## Étape 4

Faire descendre un email sur une seule voie.

## Étape 5

Ajouter les quatre voies.

## Étape 6

Ajouter le déplacement du joueur.

## Étape 7

Ajouter phishing / légitime.

## Étape 8

Ajouter collisions et erreurs.

## Étape 9

Ajouter plusieurs objets simultanés.

## Étape 10

Ajouter montée en difficulté.

## Étape 11

Tester la génération pour supprimer les situations impossibles.

## Étape 12

Seulement ensuite travailler le véritable design graphique LCD.

---

# 42. Critères d'acceptation MVP

Le MVP est validé lorsque :

1. Aucun objet ne possède de mouvement fluide.
2. Chaque position affichée correspond à un segment fixe.
3. Le personnage possède plusieurs poses réellement dessinées.
4. Plusieurs emails peuvent être simultanément présents.
5. Les emails peuvent être légitimes ou phishing.
6. Attraper un phishing donne un point.
7. Rater un phishing donne un MISS.
8. Attraper un mail légitime donne un MISS.
9. Trois MISS terminent la partie.
10. Le rythme accélère progressivement.
11. Le jeu peut générer davantage d'emails simultanés avec la progression.
12. Le générateur évite les situations impossibles.
13. Game A et Game B utilisent la même mécanique avec des paramètres différents.
14. Le meilleur score est mémorisé localement.
15. Le jeu fonctionne au clavier.
16. Le jeu fonctionne au tactile.
17. L'écran semble être un LCD et non un jeu vidéo moderne pixellisé.
18. Une personne doit comprendre le principe du jeu en moins de dix secondes.

---

# 43. Règle artistique absolue

À tout moment pendant le développement, appliquer cette question :

> « Est-ce que ce comportement aurait été techniquement réalisable avec un écran LCD à segments personnalisés en 1982 ? »

Si la réponse est non, le comportement ne doit probablement pas être utilisé.

Exceptions autorisées :

- responsive web ;
- stockage du high score ;
- Web Audio ;
- interface tactile ;
- confort navigateur.

Le gameplay et l'affichage doivent rester soumis à cette contrainte fictive.

---

# 44. Principe directeur

Le projet ne doit pas être :

> un jeu web rétro qui ressemble à un Game & Watch.

Il doit être conçu comme :

> un Game & Watch imaginaire de cybersécurité que quelqu'un aurait réellement pu fabriquer au début des années 1980, puis reproduit fidèlement dans un navigateur.

Cette distinction doit guider toutes les décisions de développement.