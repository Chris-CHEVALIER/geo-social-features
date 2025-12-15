# 🔥 Heatmap avec Leaflet

Une démonstration pédagogique de l'utilisation des cartes de chaleur (heatmaps) avec Leaflet et le plugin Leaflet.heat.

## 📚 Qu'est-ce qu'une Heatmap ?

Une **heatmap** (carte de chaleur) est une visualisation qui représente la **densité ou l'intensité** de données sur une carte géographique. Au lieu d'afficher des marqueurs individuels, elle utilise un dégradé de couleurs pour montrer où se concentrent les données.

### Palette de couleurs typique :
- 🔵 **Bleu** : faible densité
- 🟢 **Vert** : densité moyenne
- 🟡 **Jaune** : densité élevée
- 🔴 **Rouge** : densité très élevée

---

## 🎯 Quand utiliser une Heatmap ?

### ✅ Cas d'usage recommandés :

1. **Visualiser des zones de concentration**
   - Densité de restaurants dans une ville
   - Zones d'événements culturels
   - Points d'accidents sur les routes

2. **Gérer un grand nombre de points**
   - Au-delà de 50-100 marqueurs, la carte devient illisible
   - La heatmap agrège visuellement les données

3. **Identifier des tendances géographiques**
   - Où se situent les zones d'activité ?
   - Quels quartiers sont les plus dynamiques ?

4. **Analyse de données spatiales**
   - Étude de comportements géolocalisés
   - Cartographie de phénomènes naturels

### ❌ Quand éviter les Heatmaps :

- **Peu de points** (moins de 20) → Utiliser des marqueurs classiques
- **Besoin de précision** → La heatmap est imprécise par nature
- **Données individuelles importantes** → Chaque point doit être cliquable et identifiable

---

## 🛠️ Le plugin Leaflet.heat

### Installation

Le plugin **Leaflet.heat** transforme un tableau de coordonnées en une visualisation de densité.

```html
<!-- Après avoir chargé Leaflet -->
<script src="https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>
```

### Utilisation de base

```javascript
// 1. Créer les données (tableau de [lat, lng, intensité])
const points = [
    [48.8566, 2.3522, 0.8],
    [48.8584, 2.3610, 0.6],
    [48.8540, 2.3330, 1.0]
];

// 2. Créer la heatmap avec options
const heat = L.heatLayer(points, {
    radius: 25,
    blur: 15,
    maxZoom: 13
});

// 3. Ajouter à la carte
heat.addTo(map);
```

---

## 📊 Structure des données

### Format attendu

Chaque point est un **tableau de 2 ou 3 valeurs** :

```javascript
[latitude, longitude, intensité]
```

- **latitude** (obligatoire) : coordonnée Nord/Sud
- **longitude** (obligatoire) : coordonnée Est/Ouest
- **intensité** (optionnelle) : valeur entre 0 et 1 (par défaut = 1)

### Exemples

```javascript
// Sans intensité (valeur par défaut = 1)
[48.8566, 2.3522]

// Avec intensité faible (20%)
[48.8566, 2.3522, 0.2]

// Avec intensité maximale (100%)
[48.8566, 2.3522, 1.0]
```

### Tableau complet

```javascript
const myData = [
    [48.8566, 2.3522, 0.8],  // Point 1 : forte intensité
    [48.8584, 2.3610, 0.5],  // Point 2 : intensité moyenne
    [48.8540, 2.3330, 1.0],  // Point 3 : intensité maximale
    [48.8530, 2.3485, 0.3]   // Point 4 : faible intensité
];
```

---

## ⚙️ Configuration des options

### Options principales

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `radius` | Number | 25 | Rayon d'influence de chaque point (en pixels) |
| `blur` | Number | 15 | Degré de flou pour lisser les transitions |
| `maxZoom` | Number | 18 | Niveau de zoom max où la heatmap reste visible |
| `max` | Number | 1.0 | Valeur d'intensité maximale (rouge vif) |
| `minOpacity` | Number | 0.05 | Opacité minimale de la couche |

### Exemple de configuration

```javascript
const options = {
    radius: 30,        // Halo plus large
    blur: 20,          // Transitions très douces
    maxZoom: 14,       // Disparaît au zoom > 14
    max: 1.0,          // Rouge = intensité 1.0
    minOpacity: 0.4    // Minimum 40% d'opacité
};

const heatLayer = L.heatLayer(points, options);
```

---

## 🎨 Personnalisation avancée

### Changer le dégradé de couleurs

Le plugin utilise par défaut un dégradé **bleu → rouge**. Pour le personnaliser :

```javascript
// Gradient personnalisé (nécessite de modifier le code source)
const gradient = {
    0.0: 'blue',
    0.5: 'lime',
    1.0: 'red'
};
```

---

## 🚀 Intégration dans votre projet

### 1. Collecter vos données

Adaptez le format de vos données existantes :

```javascript
// Exemple : vous avez un tableau d'objets
const restaurants = [
    { name: "Café A", lat: 48.8566, lng: 2.3522, popularity: 4.5 },
    { name: "Café B", lat: 48.8584, lng: 2.3610, popularity: 3.2 }
];

// Transformation pour la heatmap
const heatData = restaurants.map(resto => [
    resto.lat,
    resto.lng,
    resto.popularity / 5  // Normaliser entre 0 et 1
]);
```

### 2. Initialiser la carte

```javascript
const map = L.map('map').setView([48.8566, 2.3522], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);
```

### 3. Ajouter la heatmap

```javascript
const heat = L.heatLayer(heatData, {
    radius: 25,
    blur: 15
}).addTo(map);
```

---

## 🔄 Mise à jour dynamique

Pour mettre à jour les données de la heatmap :

```javascript
// Nouvelles données
const newData = [
    [48.8700, 2.3400, 0.9],
    [48.8750, 2.3500, 0.7]
];

// Mise à jour
heatLayer.setLatLngs(newData);
```

---

## 📱 Combinaison avec d'autres couches

Vous pouvez combiner une heatmap avec des marqueurs :

```javascript
// Heatmap pour la vue globale
const heat = L.heatLayer(allPoints, { maxZoom: 14 }).addTo(map);

// Marqueurs pour le détail au zoom
const markers = L.markerClusterGroup();
allPoints.forEach(point => {
    const marker = L.marker([point[0], point[1]]);
    markers.addLayer(marker);
});

// Contrôle de couches
map.on('zoomend', function() {
    if (map.getZoom() > 14) {
        map.removeLayer(heat);
        map.addLayer(markers);
    } else {
        map.addLayer(heat);
        map.removeLayer(markers);
    }
});
```

---

## 📖 Ressources

- [Leaflet.heat sur GitHub](https://github.com/Leaflet/Leaflet.heat)
- [Documentation Leaflet](https://leafletjs.com/)
- [Tutoriel heatmaps](https://leafletjs.com/examples/heatmap/)

---

## 💡 Conseil pédagogique

**Commencez simple** : testez avec 10-15 points visibles à l'écran, puis augmentez progressivement. Cela permet de bien comprendre l'effet de chaque paramètre (`radius`, `blur`, `intensité`).

---

## 🎓 Exercices pratiques

1. **Modifier le rayon** : testez différentes valeurs de `radius` (10, 25, 50)
2. **Ajuster l'intensité** : changez les valeurs d'intensité des points
3. **Ajouter des données** : créez votre propre jeu de données
4. **Combiner avec des marqueurs** : affichez des marqueurs au zoom max
5. **Données dynamiques** : chargez des données depuis un fichier JSON

---

**Prêt à intégrer cette fonctionnalité dans votre projet géolocalisé ! 🗺️**
