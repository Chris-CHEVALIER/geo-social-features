# 04 - Modale au clic sur carte Leaflet

## Description

Cette fonctionnalité permet d'afficher une fenêtre modale contenant les coordonnées géographiques (latitude/longitude) lorsque l'utilisateur clique sur une carte Leaflet.

## Démo

Ouvrez simplement le fichier `index.html` dans votre navigateur. Aucune installation ni serveur nécessaire !

## Fonctionnalités

- Carte Leaflet / OpenStreetMap interactive
- Détection des clics sur la carte
- Affichage des coordonnées dans une modale élégante
- Plusieurs moyens de fermer la modale :
  - Bouton × dans l'en-tête
  - Bouton "Fermer" dans le pied de page
  - Clic sur le fond semi-transparent
  - Touche **Échap** du clavier

## Structure du projet

```
04-map-click-modal/
├── index.html    # Structure HTML (carte + modale)
├── style.css     # Styles de la modale et de la carte
├── script.js     # Logique JavaScript
└── README.md     # Ce fichier
```

## Comment ça fonctionne ?

### 1. L'événement `click` de Leaflet

Leaflet fournit un système d'événements très complet. Lorsqu'on clique sur la carte, Leaflet déclenche un événement `click` :

```javascript
map.on('click', function(event) {
    const latitude = event.latlng.lat;
    const longitude = event.latlng.lng;
    // Faire quelque chose avec ces coordonnées
});
```

**Ce qui se passe :**
- Leaflet détecte le clic sur le canvas de la carte
- Il calcule les coordonnées géographiques correspondant au pixel cliqué
- Il crée un objet événement contenant `latlng` (LatLng object)
- Notre fonction de callback est appelée avec cet événement

### 2. L'objet `event.latlng`

C'est un objet Leaflet de type `LatLng` qui contient :

| Propriété | Description | Exemple |
|-----------|-------------|---------|
| `lat` | Latitude (nord/sud) | `48.856614` |
| `lng` | Longitude (est/ouest) | `2.352222` |

**Pourquoi `lng` et pas `lon` ?**
Leaflet utilise `lng` par convention, même si "longitude" s'abrège souvent en "lon". Les deux désignent la même chose.

### 3. La modale HTML/CSS

#### Structure HTML

La modale est présente dès le chargement de la page, mais **cachée par défaut** :

```html
<div id="modal" class="modal">
    <div class="modal-content">
        <!-- Contenu de la modale -->
    </div>
</div>
```

#### Affichage/Masquage avec CSS

Le CSS utilise une classe `.show` pour contrôler la visibilité :

```css
.modal {
    display: none; /* Cachée par défaut */
}

.modal.show {
    display: flex; /* Visible quand la classe 'show' est ajoutée */
}
```

#### Contrôle en JavaScript

```javascript
// Afficher la modale
modal.classList.add('show');

// Cacher la modale
modal.classList.remove('show');
```

### 4. Mise à jour du contenu

Les coordonnées sont insérées dynamiquement dans le DOM :

```javascript
function openModal(lat, lng) {
    // Formater avec 6 décimales
    const latFormatted = lat.toFixed(6);
    const lngFormatted = lng.toFixed(6);

    // Mettre à jour le texte
    document.getElementById('latitude').textContent = latFormatted;
    document.getElementById('longitude').textContent = lngFormatted;

    // Afficher la modale
    modal.classList.add('show');
}
```

## Points pédagogiques importants

### Séparation des responsabilités

Le code est organisé en 3 fichiers distincts :
- **HTML** : Structure et contenu
- **CSS** : Présentation et styles
- **JavaScript** : Comportement et logique

### Événements JavaScript

Ce projet utilise plusieurs types d'événements :

| Événement | Élément | Utilité |
|-----------|---------|---------|
| `click` (Leaflet) | Carte | Détecter le clic sur la carte |
| `click` (DOM) | Boutons | Fermer la modale |
| `keydown` | Document | Fermer avec Échap |

### Expérience utilisateur (UX)

La modale offre plusieurs moyens de fermeture pour améliorer l'UX :
1. **Bouton × explicite** : Intuitif et visible
2. **Bouton "Fermer"** : Action claire dans le footer
3. **Clic sur le fond** : Convention web courante
4. **Touche Échap** : Réflexe des utilisateurs expérimentés

## Comment réutiliser cette logique ?

### Exemple 1 : Ajouter un marqueur au clic

```javascript
map.on('click', function(event) {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;

    // Créer un marqueur à l'endroit cliqué
    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`Position : ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
        .openPopup();
});
```

### Exemple 2 : Sauvegarder dans un tableau

```javascript
const clickedPositions = [];

map.on('click', function(event) {
    const position = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
        timestamp: new Date()
    };

    clickedPositions.push(position);
    console.log('Positions enregistrées:', clickedPositions);
});
```

### Exemple 3 : Afficher l'adresse avec une API

```javascript
map.on('click', async function(event) {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;

    // Utiliser l'API Nominatim pour le géocodage inversé
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Adresse:', data.display_name);
    } catch (error) {
        console.error('Erreur:', error);
    }
});
```

## Technologies utilisées

- **HTML5** : Structure de la page
- **CSS3** : Styles et animations
- **JavaScript ES6** : Logique interactive
- **Leaflet 1.9.4** : Bibliothèque de cartographie

## Concepts JavaScript abordés

1. **Manipulation du DOM**
   - `document.getElementById()`
   - `element.classList.add()` / `.remove()`
   - `element.textContent`

2. **Événements**
   - `addEventListener()`
   - `map.on()` (syntaxe Leaflet)
   - `event.target`
   - `event.key`

3. **Fonctions**
   - Déclaration de fonction
   - Paramètres et arguments
   - Fonctions de callback

4. **Méthodes de formatage**
   - `toFixed()` pour les décimales
   - Template literals (backticks)

## Compatibilité

- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Responsive (fonctionne sur mobile et tablette)
- Pas de dépendances npm ou build tool

## Améliorations possibles

Pour aller plus loin, vous pourriez :

1. **Ajouter un marqueur temporaire** à l'endroit cliqué
2. **Afficher l'altitude** en utilisant une API
3. **Permettre la copie des coordonnées** dans le presse-papier
4. **Historique des derniers clics** dans la modale
5. **Choix du format de coordonnées** (décimal, DMS, etc.)
6. **Géocodage inversé** pour afficher l'adresse

## Ressources

- [Documentation Leaflet - Events](https://leafletjs.com/reference.html#map-event)
- [MDN - classList](https://developer.mozilla.org/fr/docs/Web/API/Element/classList)
- [MDN - addEventListener](https://developer.mozilla.org/fr/docs/Web/API/EventTarget/addEventListener)

## Licence

Code pédagogique libre d'utilisation pour vos projets étudiants.
