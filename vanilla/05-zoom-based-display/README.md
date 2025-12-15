# 05 - Affichage adaptatif selon le zoom

## Description

Cette fonctionnalité permet d'afficher différents niveaux d'information sur une carte Leaflet en fonction du niveau de zoom de l'utilisateur. Plus l'utilisateur zoome, plus les détails apparaissent.

## Démo

Ouvrez simplement le fichier `index.html` dans votre navigateur. Aucune installation ni serveur nécessaire !

## Fonctionnalités

- Carte Leaflet / OpenStreetMap interactive
- 3 niveaux d'affichage adaptatifs :
  - **Vue générale** (zoom 1-11) : Grandes villes uniquement
  - **Vue intermédiaire** (zoom 12-14) : Villes + quartiers
  - **Vue détaillée** (zoom 15+) : Toutes les informations
- Indicateur visuel du niveau de zoom actuel
- Mise à jour automatique lors du zoom/dézoom
- Légende explicative

## Structure du projet

```
05-zoom-based-display/
├── index.html    # Structure HTML (carte + indicateur + légende)
├── style.css     # Styles de la carte et des composants
├── script.js     # Logique de gestion des couches selon le zoom
└── README.md     # Ce fichier
```

## Comment ça fonctionne ?

### 1. Les niveaux de zoom dans Leaflet

Leaflet utilise un système de zoom numérique allant de **0 à 19** :

| Niveau | Vue | Échelle approximative |
|--------|-----|----------------------|
| 0-2 | Monde entier | Continents |
| 3-5 | Pays | Régions |
| 6-9 | Région | Départements |
| 10-12 | Ville | Agglomération |
| 13-15 | Quartier | Rues principales |
| 16-19 | Rue détaillée | Bâtiments |

**Important :** Chaque niveau de zoom double la résolution par rapport au précédent.

### 2. Récupérer le niveau de zoom actuel

Leaflet fournit la méthode `map.getZoom()` :

```javascript
const currentZoom = map.getZoom();
console.log('Zoom actuel:', currentZoom); // Exemple: 13
```

Cette méthode retourne un **nombre entier** représentant le niveau de zoom.

### 3. L'événement `zoomend`

Leaflet déclenche plusieurs événements liés au zoom :

| Événement | Quand ? | Usage |
|-----------|---------|-------|
| `zoomstart` | Au début du zoom | Animations de chargement |
| `zoom` | Pendant le zoom | Mises à jour en temps réel |
| `zoomend` | À la fin du zoom | **Recommandé** pour mettre à jour l'affichage |

**Pourquoi utiliser `zoomend` ?**
- Déclenché une seule fois à la fin
- Plus performant (pas d'appels multiples)
- L'utilisateur a fini son action

```javascript
map.on('zoomend', function() {
    const zoom = map.getZoom();
    console.log('Zoom terminé à:', zoom);
    // Mettre à jour l'affichage ici
});
```

### 4. Les LayerGroups

Un `LayerGroup` est un **conteneur** qui permet de regrouper plusieurs marqueurs :

```javascript
// Créer un groupe vide
const myGroup = L.layerGroup();

// Ajouter des marqueurs au groupe
const marker1 = L.marker([48.8566, 2.3522]);
const marker2 = L.marker([45.7640, 4.8357]);
myGroup.addLayer(marker1);
myGroup.addLayer(marker2);

// Ajouter tout le groupe à la carte en une seule opération
myGroup.addTo(map);
// ou
map.addLayer(myGroup);

// Retirer tout le groupe de la carte
map.removeLayer(myGroup);
```

**Avantages :**
- Gestion simplifiée de groupes de marqueurs
- Ajout/retrait en une seule opération
- Meilleure performance qu'ajouter des marqueurs individuellement

### 5. Vérifier si une couche est sur la carte

Avant d'ajouter une couche, il est recommandé de vérifier si elle n'est pas déjà présente :

```javascript
if (!map.hasLayer(myGroup)) {
    map.addLayer(myGroup);
}
```

**Pourquoi ?**
- Évite d'ajouter plusieurs fois la même couche
- Améliore les performances
- Évite les comportements inattendus

### 6. Logique de notre exemple

```javascript
function updateLayersBasedOnZoom() {
    const currentZoom = map.getZoom();

    // Vue générale (zoom <= 11)
    if (currentZoom <= 11) {
        map.addLayer(generalLayer);      // Afficher grandes villes
        map.removeLayer(intermediateLayer); // Masquer quartiers
        map.removeLayer(detailedLayer);     // Masquer POI
    }

    // Vue intermédiaire (zoom 12-14)
    else if (currentZoom >= 12 && currentZoom <= 14) {
        map.addLayer(generalLayer);      // Afficher grandes villes
        map.addLayer(intermediateLayer); // Afficher quartiers
        map.removeLayer(detailedLayer);     // Masquer POI
    }

    // Vue détaillée (zoom >= 15)
    else if (currentZoom >= 15) {
        map.addLayer(generalLayer);      // Tout afficher
        map.addLayer(intermediateLayer);
        map.addLayer(detailedLayer);
    }
}

// Écouter les changements de zoom
map.on('zoomend', updateLayersBasedOnZoom);

// Initialiser au chargement
updateLayersBasedOnZoom();
```

## Pourquoi ne pas tout afficher en même temps ?

### 1. Performance
- Trop de marqueurs ralentissent le navigateur
- Le rendu de la carte devient lent
- L'interaction utilisateur est dégradée

### 2. Lisibilité
- Trop d'informations = surcharge visuelle
- Les marqueurs se superposent
- L'utilisateur ne sait plus où regarder

### 3. Expérience utilisateur
- L'utilisateur voit ce qui est **pertinent** à son niveau de zoom
- Vue globale → informations générales
- Vue rapprochée → détails précis

### 4. Économie de bande passante
- Pas besoin de charger toutes les données d'un coup
- On peut charger dynamiquement selon le zoom
- Particulièrement important avec des données distantes (API)

## Comment adapter cette logique à votre projet ?

### Exemple 1 : Restaurants selon le zoom

```javascript
const ZOOM_THRESHOLDS = {
    SHOW_RESTAURANTS: 14,  // Afficher restaurants à partir de zoom 14
    SHOW_CAFES: 16         // Afficher cafés à partir de zoom 16
};

const restaurantsLayer = L.layerGroup();
const cafesLayer = L.layerGroup();

function updateLayers() {
    const zoom = map.getZoom();

    if (zoom >= ZOOM_THRESHOLDS.SHOW_RESTAURANTS) {
        map.addLayer(restaurantsLayer);
    } else {
        map.removeLayer(restaurantsLayer);
    }

    if (zoom >= ZOOM_THRESHOLDS.SHOW_CAFES) {
        map.addLayer(cafesLayer);
    } else {
        map.removeLayer(cafesLayer);
    }
}
```

### Exemple 2 : Charger des données dynamiquement

```javascript
map.on('zoomend', async function() {
    const zoom = map.getZoom();

    // Ne charger les détails que si zoom élevé
    if (zoom >= 15) {
        const data = await fetch('/api/detailed-data');
        const json = await data.json();
        displayDetailedData(json);
    }
});
```

### Exemple 3 : Plus de 3 niveaux

```javascript
const ZOOM_LEVELS = {
    COUNTRY: 6,     // Niveau pays
    REGION: 9,      // Niveau région
    CITY: 12,       // Niveau ville
    DISTRICT: 15,   // Niveau quartier
    STREET: 17      // Niveau rue
};

function updateLayers() {
    const zoom = map.getZoom();

    // Retirer toutes les couches
    map.eachLayer(layer => {
        if (layer instanceof L.LayerGroup) {
            map.removeLayer(layer);
        }
    });

    // Ajouter les couches appropriées
    if (zoom >= ZOOM_LEVELS.COUNTRY) map.addLayer(countryLayer);
    if (zoom >= ZOOM_LEVELS.REGION) map.addLayer(regionLayer);
    if (zoom >= ZOOM_LEVELS.CITY) map.addLayer(cityLayer);
    if (zoom >= ZOOM_LEVELS.DISTRICT) map.addLayer(districtLayer);
    if (zoom >= ZOOM_LEVELS.STREET) map.addLayer(streetLayer);
}
```

## Concepts JavaScript abordés

1. **Manipulation de la carte Leaflet**
   - `map.getZoom()` - Récupérer le niveau de zoom
   - `map.addLayer()` / `map.removeLayer()` - Gérer les couches
   - `map.hasLayer()` - Vérifier la présence d'une couche
   - `map.on()` - Écouter les événements

2. **LayerGroups**
   - `L.layerGroup()` - Créer un groupe
   - `.addLayer()` - Ajouter un élément au groupe
   - `.addTo(map)` - Ajouter le groupe à la carte

3. **Conditions et logique**
   - Conditions `if/else if/else`
   - Opérateurs de comparaison (`<=`, `>=`)
   - Logique conditionnelle pour l'affichage

4. **Événements**
   - `map.on('zoomend', callback)` - Écouter le zoom
   - Fonction callback exécutée automatiquement

5. **Constantes et configuration**
   - Utilisation de `const` pour les seuils
   - Organisation du code avec des objets de configuration

## Technologies utilisées

- **HTML5** : Structure de la page
- **CSS3** : Styles et animations
- **JavaScript ES6** : Logique interactive
- **Leaflet 1.9.4** : Bibliothèque de cartographie

## Compatibilité

- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Responsive (fonctionne sur mobile et tablette)
- Pas de dépendances npm ou build tool

## Améliorations possibles

Pour aller plus loin, vous pourriez :

1. **Clustering automatique** avec [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)
2. **Charger les données depuis une API** en fonction du zoom et de la zone visible
3. **Filtres utilisateur** pour choisir quelles catégories afficher
4. **Heatmap** pour les zones à forte densité de points
5. **Animation** lors de l'apparition/disparition des marqueurs
6. **Sauvegarde des préférences** de l'utilisateur dans localStorage

## Cas d'usage réels

Cette technique est utilisée par :
- **Google Maps** : affiche plus de détails quand on zoome
- **OpenStreetMap** : adapte les éléments selon le niveau de zoom
- **Airbnb** : montre progressivement plus de logements
- **Citymapper** : affiche transports selon la proximité

## Ressources

- [Documentation Leaflet - Zoom](https://leafletjs.com/reference.html#map-zoom)
- [Documentation Leaflet - Events](https://leafletjs.com/reference.html#map-event)
- [Documentation Leaflet - LayerGroup](https://leafletjs.com/reference.html#layergroup)
- [MDN - Conditions JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/if...else)

## Licence

Code pédagogique libre d'utilisation pour vos projets étudiants.
