# 🎯 Swipeable Edge Drawer - JavaScript Vanilla

## 📋 Description

Un **tiroir interactif** (drawer) positionné en bas de l'écran, qui peut être **ouvert/fermé** par un bouton ou **glissé** avec la souris ou le doigt (touch).

Cette fonctionnalité est entièrement développée en **HTML / CSS / JavaScript vanilla** sans aucune dépendance externe.

---

## 🎨 Cas d'usage

- **Panneaux d'informations** mobiles
- **Filtres** de recherche sur mobile
- **Menus additionnels** depuis le bas de l'écran
- **Paramètres** ou **options** accessibles rapidement
- **Cartes** d'informations contextuelles

---

## 🚀 Utilisation

1. **Télécharge** ou **copie** les fichiers dans ton projet
2. **Ouvre** `index.html` dans ton navigateur
3. Teste les interactions :
   - Clique sur **"Ouvrir le panneau"**
   - **Glisse** la poignée vers le haut ou le bas
   - Clique sur **l'overlay** pour fermer
   - Appuie sur **Échap** pour fermer

---

## 📂 Structure des fichiers

```
vanilla/01-swipeable-edge-drawer/
├── README.md        ← Ce fichier
├── index.html       ← Structure HTML
├── style.css        ← Styles CSS
└── script.js        ← Logique JavaScript
```

---

## 🏗️ Structure HTML

### Les éléments principaux

```html
<!-- Contenu principal de la page -->
<main class="main-content">
    <button id="openDrawerBtn">Ouvrir le panneau</button>
</main>

<!-- Overlay (fond semi-transparent) -->
<div id="overlay" class="overlay"></div>

<!-- Le drawer (tiroir) -->
<div id="drawer" class="drawer">
    <!-- Poignée pour glisser -->
    <div class="drawer-handle">
        <div class="handle-bar"></div>
    </div>

    <!-- Contenu du drawer -->
    <div class="drawer-content">
        <h2>Contenu</h2>
        <button id="closeDrawerBtn">Fermer</button>
    </div>
</div>
```

### Rôles des éléments

- **`main-content`** : Contenu principal de la page
- **`overlay`** : Fond sombre semi-transparent qui apparaît derrière le drawer
- **`drawer`** : Le tiroir qui monte depuis le bas
- **`drawer-handle`** : La zone cliquable pour glisser le drawer
- **`drawer-content`** : Le contenu affiché dans le drawer

---

## 🎨 Logique CSS

### Position initiale du drawer

```css
.drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;

    /* Caché sous l'écran */
    transform: translateY(100%);

    /* Animation fluide */
    transition: transform 0.3s ease;
}
```

Le drawer est **positionné en bas de l'écran** (`bottom: 0`) mais **caché** grâce à `transform: translateY(100%)` qui le déplace de **100% de sa hauteur vers le bas**.

### État ouvert

```css
.drawer.open {
    transform: translateY(0);
}
```

Quand on ajoute la classe `.open`, le drawer **remonte** à sa position initiale (`translateY(0)`).

### Désactivation de la transition pendant le drag

```css
.drawer.dragging {
    transition: none;
}
```

Pendant le glissement, on **désactive la transition CSS** pour un mouvement **fluide et immédiat**.

### Overlay

```css
.overlay {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease;
}

.overlay.active {
    opacity: 1;
    visibility: visible;
}
```

L'overlay apparaît **en fondu** quand le drawer est ouvert.

---

## 🧠 Logique JavaScript

### 1️⃣ Sélection des éléments

```js
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const openDrawerBtn = document.getElementById('openDrawerBtn');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const drawerHandle = document.querySelector('.drawer-handle');
```

On récupère tous les éléments du DOM dont on a besoin.

---

### 2️⃣ Variables d'état

```js
let isOpen = false;      // Le drawer est-il ouvert ?
let isDragging = false;  // L'utilisateur glisse-t-il le drawer ?
let startY = 0;          // Position Y de départ du drag
let currentY = 0;        // Position Y actuelle du drag
```

Ces variables permettent de **suivre l'état du drawer** et la **position du curseur/doigt**.

---

### 3️⃣ Ouvrir / Fermer le drawer

```js
function openDrawer() {
    isOpen = true;
    drawer.classList.add('open');
    overlay.classList.add('active');
}

function closeDrawer() {
    isOpen = false;
    drawer.classList.remove('open');
    overlay.classList.remove('active');
}
```

Ces fonctions ajoutent ou retirent simplement les classes CSS qui déclenchent l'animation.

---

### 4️⃣ Gestion du drag/swipe

#### a) Début du drag

```js
function handleDragStart(event) {
    startY = event.type === 'touchstart'
        ? event.touches[0].clientY
        : event.clientY;

    isDragging = true;
    drawer.classList.add('dragging'); // Désactive la transition CSS
}
```

On enregistre la **position de départ** (`startY`) et on active le mode **dragging**.

#### b) Pendant le drag

```js
function handleDragMove(event) {
    if (!isDragging) return;

    event.preventDefault(); // Empêche le scroll de la page

    currentY = event.type === 'touchmove'
        ? event.touches[0].clientY
        : event.clientY;

    const deltaY = currentY - startY; // Distance parcourue

    // Applique le déplacement au drawer
    drawer.style.transform = `translateY(${deltaY}px)`;
}
```

On calcule la **différence** entre la position actuelle et la position de départ, puis on **applique ce déplacement** au drawer.

#### c) Fin du drag

```js
function handleDragEnd() {
    if (!isDragging) return;

    isDragging = false;
    drawer.classList.remove('dragging'); // Réactive la transition

    const deltaY = currentY - startY;
    const threshold = 100; // Seuil de déclenchement

    // Si on a glissé de plus de 100px, on change l'état
    if (isOpen && deltaY > threshold) {
        closeDrawer();
    } else if (!isOpen && deltaY < -threshold) {
        openDrawer();
    } else {
        drawer.style.transform = ''; // Retour à la position initiale
    }
}
```

On vérifie si l'utilisateur a **glissé suffisamment** (plus de 100px). Si oui, on **change l'état** du drawer. Sinon, on **revient à la position initiale**.

---

### 5️⃣ Écouteurs d'événements

```js
// Souris
drawerHandle.addEventListener('mousedown', handleDragStart);
document.addEventListener('mousemove', handleDragMove);
document.addEventListener('mouseup', handleDragEnd);

// Touch (mobile/tablette)
drawerHandle.addEventListener('touchstart', handleDragStart);
document.addEventListener('touchmove', handleDragMove);
document.addEventListener('touchend', handleDragEnd);
```

On écoute à la fois les **événements souris** (`mousedown`, `mousemove`, `mouseup`) et les **événements tactiles** (`touchstart`, `touchmove`, `touchend`).

---

## 🔧 Intégration dans ton projet

### Étape 1 : Copier les fichiers

Copie les fichiers dans ton projet :

```
ton-projet/
├── index.html
├── css/
│   └── drawer.css       ← Copie de style.css
└── js/
    └── drawer.js        ← Copie de script.js
```

---

### Étape 2 : Ajouter le HTML

Dans ton fichier HTML, ajoute la structure du drawer **avant la balise `</body>`** :

```html
<!-- Overlay -->
<div id="overlay" class="overlay"></div>

<!-- Drawer -->
<div id="drawer" class="drawer">
    <div class="drawer-handle">
        <div class="handle-bar"></div>
    </div>
    <div class="drawer-content">
        <!-- TON CONTENU ICI -->
        <h2>Mon contenu personnalisé</h2>
        <button id="closeDrawerBtn">Fermer</button>
    </div>
</div>

<!-- Lien vers les fichiers CSS et JS -->
<link rel="stylesheet" href="css/drawer.css">
<script src="js/drawer.js"></script>
```

---

### Étape 3 : Ajouter un bouton pour ouvrir le drawer

Ajoute un bouton **n'importe où dans ta page** :

```html
<button id="openDrawerBtn">Ouvrir le panneau</button>
```

---

### Étape 4 : Personnaliser le contenu

Modifie le contenu dans `.drawer-content` selon tes besoins :

```html
<div class="drawer-content">
    <h2>Mes filtres</h2>
    <label>
        <input type="checkbox"> Option 1
    </label>
    <label>
        <input type="checkbox"> Option 2
    </label>
    <button id="closeDrawerBtn">Appliquer</button>
</div>
```

---

## 🎓 Concepts pédagogiques

### 1. **`transform: translateY()`**

- Déplace un élément verticalement **sans affecter le layout**
- Plus performant que `top` ou `bottom` pour les animations

### 2. **Classes CSS dynamiques**

- `drawer.classList.add('open')` : Ajoute une classe
- `drawer.classList.remove('open')` : Retire une classe
- Permet de contrôler les styles depuis JavaScript

### 3. **Événements souris vs touch**

- **Souris** : `mousedown`, `mousemove`, `mouseup`
- **Touch** : `touchstart`, `touchmove`, `touchend`
- Il faut gérer les deux pour un support complet

### 4. **`event.preventDefault()`**

- Empêche le comportement par défaut (ex: scroll de la page)
- Essentiel pour éviter les conflits pendant le drag

### 5. **Seuil de déclenchement (threshold)**

- On définit une distance minimale (100px) pour valider l'action
- Évite les fermetures/ouvertures accidentelles

---

## 📱 Responsive

Le drawer est **responsive** par défaut :

- Sur **mobile** : Occupe toute la largeur
- Sur **desktop** : Occupe toute la largeur également
- Hauteur maximale : **85vh** pour laisser de l'espace en haut

---

## ♿ Accessibilité

- **Touche Échap** : Ferme le drawer
- **Overlay cliquable** : Permet de fermer facilement
- **Poignée visuelle** : Indique clairement qu'on peut glisser

---

## 🎨 Personnalisation

### Changer la couleur

Dans `style.css`, modifie les couleurs :

```css
.card {
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
}
```

### Changer la hauteur maximale

```css
.drawer {
    max-height: 70vh; /* Au lieu de 85vh */
}
```

### Changer le seuil de déclenchement

Dans `script.js` :

```js
const threshold = 150; // Au lieu de 100
```

---

## 🐛 Dépannage

### Le drawer ne s'ouvre pas

- Vérifie que les **IDs** correspondent : `drawer`, `overlay`, `openDrawerBtn`
- Vérifie que le **script.js** est bien chargé après le HTML

### Le drag ne fonctionne pas

- Vérifie que `touch-action: none` est présent sur `.drawer-handle`
- Vérifie que les événements `touchstart` et `touchmove` sont bien écoutés

### Le drawer "saute" pendant le drag

- Assure-toi que la classe `.dragging` est bien ajoutée pendant le drag
- Cette classe désactive la transition CSS

---

## 📚 Ressources

- [MDN : Touch events](https://developer.mozilla.org/fr/docs/Web/API/Touch_events)
- [MDN : transform](https://developer.mozilla.org/fr/docs/Web/CSS/transform)
- [MDN : transition](https://developer.mozilla.org/fr/docs/Web/CSS/transition)

---

## 📝 Licence

Libre d'utilisation pour des projets éducatifs et personnels.

---

**Bon apprentissage ! 🚀**
