# 🎨 Heatmap avec couleurs personnalisées

## 📖 Description

Cette fonctionnalité permet d'afficher une **heatmap** (carte de chaleur) avec un **gradient de couleurs personnalisé** sur une carte Leaflet. Elle visualise l'intensité ou la densité de données géolocalisées avec des couleurs adaptées à votre projet.

## 🎯 Objectif pédagogique

Apprendre à :
- Créer une heatmap avec Leaflet.heat
- Personnaliser les couleurs du gradient
- Comprendre l'impact des paramètres (radius, blur, maxZoom)
- Visualiser des données d'intensité variable
- Adapter les couleurs à un contexte métier

## 🔍 Qu'est-ce qu'une heatmap ?

Une **heatmap** (carte de chaleur) est une représentation visuelle qui utilise des couleurs pour montrer la **densité** ou l'**intensité** de données sur une zone géographique.

### Exemples d'usage :
- 📍 Zones de forte affluence dans une ville
- 🚗 Densité de circulation routière
- 🏪 Concentration de commerces
- 📱 Points d'activité d'une application mobile
- 🌡️ Zones de température élevée

### Principe de fonctionnement :
1. Chaque point a une **position** (latitude, longitude)
2. Chaque point a une **intensité** (valeur entre 0 et 1)
3. Les points proches se superposent et créent des zones "chaudes"
4. Un **gradient de couleurs** traduit l'intensité en couleur

## 🆚 Heatmap simple vs. personnalisée

### Heatmap simple (par défaut)
```javascript
// Gradient par défaut : bleu → vert → jaune → rouge
L.heatLayer(data).addTo(map);
```

### Heatmap personnalisée
```javascript
// Gradient sur mesure adapté à votre projet
L.heatLayer(data, {
    gradient: {
        0.0: 'blue',
        0.5: 'yellow',
        1.0: 'red'
    }
}).addTo(map);
```

## 🎨 Rôle du gradient de couleurs

Le **gradient** est un objet JavaScript qui associe :
- Une **valeur d'intensité** (de 0.0 à 1.0)
- Une **couleur** (nom, hex, rgb, rgba)

### Exemple de gradient :
```javascript
const gradient = {
    0.0: 'blue',      // Intensité faible
    0.4: 'lime',      // Intensité moyenne-basse
    0.6: 'yellow',    // Intensité moyenne-haute
    1.0: 'red'        // Intensité forte
};
```

### Comment ça fonctionne ?
- **0.0** = zones de faible densité → bleu
- **0.4** = densité modérée → vert
- **0.6** = densité importante → jaune
- **1.0** = densité maximale → rouge

Entre ces valeurs, Leaflet.heat calcule automatiquement les transitions de couleurs.

## ⚙️ Paramètres de la heatmap

### radius (rayon)
- **Définition** : Taille du cercle de chaleur autour de chaque point
- **Unité** : pixels
- **Impact** : Plus le radius est grand, plus les zones de chaleur sont larges
- **Valeur recommandée** : 15 à 30

```javascript
radius: 25  // Chaque point influence une zone de 25 pixels
```

### blur (flou)
- **Définition** : Niveau de flou appliqué aux transitions
- **Unité** : pixels
- **Impact** : Plus le blur est élevé, plus les transitions sont douces
- **Valeur recommandée** : 10 à 20

```javascript
blur: 15  // Transitions douces entre les zones
```

### maxZoom
- **Définition** : Niveau de zoom maximum où la heatmap est recalculée
- **Unité** : niveau de zoom (0 à 18)
- **Impact** : Au-delà de ce zoom, la heatmap garde la même résolution
- **Valeur recommandée** : 17 à 18

```javascript
maxZoom: 18  // Résolution optimale jusqu'au zoom 18
```

## 📊 Format des données

Les données sont un tableau de tableaux :
```javascript
[
    [latitude, longitude, intensité],
    [48.8566, 2.3522, 0.5],  // Intensité moyenne
    [48.8606, 2.3477, 1.0],  // Intensité maximale
    [48.8798, 2.3827, 0.2]   // Intensité faible
]
```

### Explications :
- **latitude** : coordonnée géographique (axe vertical)
- **longitude** : coordonnée géographique (axe horizontal)
- **intensité** : valeur entre 0.0 (faible) et 1.0 (forte)

## 🎯 Comment adapter les couleurs à votre projet

### 1. Contexte positif (ex: zones de croissance)
```javascript
const gradient = {
    0.0: 'white',
    0.5: 'lightgreen',
    1.0: 'darkgreen'
};
```

### 2. Contexte d'alerte (ex: zones de pollution)
```javascript
const gradient = {
    0.0: 'green',      // Bon état
    0.5: 'orange',     // Attention
    1.0: 'darkred'     // Danger
};
```

### 3. Contexte neutre (ex: densité de population)
```javascript
const gradient = {
    0.0: 'lightblue',
    0.3: 'cyan',
    0.6: 'purple',
    1.0: 'darkpurple'
};
```

### 4. Contexte froid/chaud (ex: température)
```javascript
const gradient = {
    0.0: 'darkblue',   // Froid
    0.5: 'white',      // Tempéré
    1.0: 'darkred'     // Chaud
};
```

## 🔧 Comment réutiliser dans votre projet

### Étape 1 : Copier les fichiers
Copiez les fichiers `script.js`, `style.css` et `index.html` dans votre projet.

### Étape 2 : Adapter les données
Remplacez le tableau `heatmapData` par vos propres données :

```javascript
// Exemple : données depuis une API
fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
        const heatmapData = data.map(item => [
            item.latitude,
            item.longitude,
            item.intensity
        ]);

        L.heatLayer(heatmapData, heatmapOptions).addTo(map);
    });
```

### Étape 3 : Personnaliser le gradient
Adaptez les couleurs selon votre contexte métier :

```javascript
const gradient = {
    0.0: 'votre-couleur-faible',
    0.5: 'votre-couleur-moyenne',
    1.0: 'votre-couleur-forte'
};
```

### Étape 4 : Ajuster les paramètres
Testez différentes valeurs pour obtenir le rendu souhaité :

```javascript
{
    radius: 20,        // Testez entre 15 et 35
    blur: 12,          // Testez entre 10 et 20
    maxZoom: 17,       // Gardez entre 17 et 18
    gradient: gradient
}
```

## 🚀 Utilisation

1. Ouvrez `index.html` dans votre navigateur
2. La carte s'affiche avec la heatmap
3. Zoomez et dézoomez pour voir l'effet
4. Observez les transitions de couleurs

## 📦 Dépendances

- **Leaflet** v1.9.4 (via CDN)
- **Leaflet.heat** v0.2.0 (via CDN)

Aucune installation nécessaire, tout fonctionne directement dans le navigateur.

## 💡 Astuces

### Pour une heatmap plus précise
- Augmentez le nombre de points de données
- Réduisez le `radius` et le `blur`
- Augmentez le `maxZoom`

### Pour une heatmap plus douce
- Augmentez le `blur`
- Augmentez le `radius`
- Utilisez plus d'étapes dans le gradient

### Pour tester rapidement
- Ouvrez la console du navigateur (F12)
- Les informations de configuration s'affichent
- Modifiez les valeurs dans `script.js` et rechargez

## 📚 Ressources

- [Documentation Leaflet](https://leafletjs.com/)
- [Documentation Leaflet.heat](https://github.com/Leaflet/Leaflet.heat)
- [Générateur de gradient CSS](https://cssgradient.io/)
- [Palettes de couleurs](https://coolors.co/)

## 🎓 Exercices suggérés

1. **Modifier le gradient** : Créez un gradient avec 5 couleurs au lieu de 4
2. **Ajuster les paramètres** : Testez différentes valeurs de radius et blur
3. **Ajouter des données** : Ajoutez 10 nouveaux points à la heatmap
4. **Changer la zone** : Centrez la carte sur une autre ville
5. **Créer un thème** : Adaptez les couleurs à un contexte spécifique (température, affluence, etc.)

## ⚠️ Points d'attention

- L'intensité doit toujours être entre 0.0 et 1.0
- Plus il y a de points, plus la visualisation est précise
- Les couleurs du gradient doivent être lisibles et contrastées
- Testez toujours sur mobile pour vérifier la lisibilité

## 🔄 Différence avec la feature "04-heatmap"

- **04-heatmap** : Heatmap simple avec le gradient par défaut
- **08-heatmap-custom-colors** : Heatmap avec gradient personnalisable et paramètres explicites

Cette version permet un contrôle total sur l'apparence visuelle de la heatmap.
