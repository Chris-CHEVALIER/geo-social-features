# 🗺️ Changeur de style de carte Leaflet

## 📋 Description

Cette fonctionnalité pédagogique montre comment **changer l'apparence d'une carte OpenStreetMap** en utilisant différents fournisseurs de tuiles (tilesets) avec la bibliothèque Leaflet.

**Ce que vous allez apprendre :**
- La différence entre OpenStreetMap et Leaflet
- Ce qu'est une tuile (tile) et un tileset
- Pourquoi on ne peut pas recolorer OSM directement
- Comment changer dynamiquement le style d'une carte

---

## 🚀 Installation et utilisation

### Prérequis
- Un navigateur web moderne
- Aucune installation nécessaire !

### Lancer la démo
1. Ouvrez le fichier `index.html` dans votre navigateur
2. La carte s'affiche centrée sur Paris
3. Cliquez sur les boutons pour changer de style

---

## 🧠 Concepts clés

### OpenStreetMap vs Leaflet : quelle différence ?

**OpenStreetMap (OSM)** :
- C'est une **base de données géographiques** collaborative et gratuite
- Contient les données brutes : routes, bâtiments, points d'intérêt, etc.
- Comme Wikipedia, mais pour les cartes du monde

**Leaflet** :
- C'est une **bibliothèque JavaScript** pour afficher des cartes interactives
- Ne contient PAS de données géographiques
- Permet d'afficher des cartes dans une page web

**Analogie :**
- OSM = base de données SQL
- Leaflet = bibliothèque JavaScript pour afficher ces données

---

### Qu'est-ce qu'une tuile (tile) ?

Une carte interactive n'est pas une seule grande image, mais un **assemblage de petites images carrées** appelées **tuiles** (tiles).

**Pourquoi des tuiles ?**
- Charger une carte du monde entier en une seule image serait trop lourd
- Les tuiles permettent de charger uniquement la zone visible
- Quand on zoome ou déplace la carte, on charge de nouvelles tuiles

**Structure d'une URL de tuile :**
```
https://tile.example.com/{z}/{x}/{y}.png
```
- `{z}` = niveau de zoom (0 = monde entier, 18 = rue)
- `{x}` = coordonnée X de la tuile
- `{y}` = coordonnée Y de la tuile

---

### Pourquoi on ne peut pas recolorer OSM directement ?

**Ce qu'on ne peut PAS faire :**
- ❌ Modifier les couleurs d'OpenStreetMap avec CSS
- ❌ Appliquer des filtres sur les tuiles (mauvaise pratique)
- ❌ "Hacker" les images de tuiles en JavaScript

**Pourquoi ?**
- Les tuiles sont des **images PNG/JPG** servies par un serveur
- On ne peut pas modifier le contenu d'une image externe avec CSS
- Les filtres CSS rendent la carte illisible (textes flous, couleurs bizarres)

**La bonne pratique :**
✅ **Changer de fournisseur de tuiles** (tileset provider)

Chaque fournisseur propose différents styles de rendu des mêmes données OSM :
- Style clair
- Style sombre
- Style artistique
- Style minimaliste
- Etc.

---

## 📂 Structure du code

```
02-map-style-switcher/
├── index.html       # Page HTML avec la structure
├── style.css        # Styles CSS pour le design
├── script.js        # Logique JavaScript
└── README.md        # Ce fichier
```

---

## 🔍 Comment fonctionne le code

### 1. Initialisation de la carte

```javascript
const parisCoords = [48.8566, 2.3522];
const map = L.map('map').setView(parisCoords, 12);
```

On crée une carte Leaflet centrée sur Paris avec un zoom de 12.

---

### 2. Définition des styles disponibles

```javascript
const mapStyles = {
    standard: {
        name: 'Standard',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
        layer: null
    },
    // ... autres styles
};
```

Chaque style contient :
- `name` : nom affiché à l'utilisateur
- `url` : URL du serveur de tuiles
- `attribution` : crédits obligatoires
- `layer` : objet Leaflet (créé plus tard)

---

### 3. Création des layers Leaflet

```javascript
for (let styleKey in mapStyles) {
    const style = mapStyles[styleKey];
    style.layer = L.tileLayer(style.url, {
        attribution: style.attribution,
        maxZoom: 19
    });
}
```

On crée un **layer** (couche) pour chaque style, mais on ne l'ajoute pas encore à la carte.

---

### 4. Affichage du style initial

```javascript
let currentStyle = 'standard';
mapStyles[currentStyle].layer.addTo(map);
```

On ajoute le style "standard" à la carte au démarrage.

---

### 5. Fonction pour changer de style

```javascript
function changeMapStyle(newStyleKey) {
    // 1. Retirer l'ancien layer
    map.removeLayer(mapStyles[currentStyle].layer);

    // 2. Ajouter le nouveau layer
    mapStyles[newStyleKey].layer.addTo(map);

    // 3. Mettre à jour la variable
    currentStyle = newStyleKey;

    // 4. Mettre à jour l'affichage
    document.getElementById('current-style').textContent = mapStyles[newStyleKey].name;
    updateActiveButton(newStyleKey);
}
```

**Étapes clés :**
1. On retire le layer actuel de la carte
2. On ajoute le nouveau layer
3. On met à jour l'interface (texte + bouton actif)

---

### 6. Écoute des clics sur les boutons

```javascript
styleButtons.forEach(button => {
    button.addEventListener('click', function() {
        const selectedStyle = this.getAttribute('data-style');
        changeMapStyle(selectedStyle);
    });
});
```

Quand on clique sur un bouton, on récupère son attribut `data-style` et on change le style.

---

## 🎨 Fournisseurs de tuiles utilisés

| Nom | Style | URL |
|-----|-------|-----|
| **OpenStreetMap** | Standard | `https://tile.openstreetmap.org` |
| **Carto Light** | Clair | `https://basemaps.cartocdn.com/light_all` |
| **Carto Dark** | Sombre | `https://basemaps.cartocdn.com/dark_all` |
| **Stamen Watercolor** | Aquarelle | `https://tiles.stadiamaps.com/tiles/stamen_watercolor` |

Tous ces fournisseurs sont **gratuits et libres d'utilisation** pour des projets personnels et éducatifs.

---

## ♻️ Réutiliser ce code dans votre projet

### Étape 1 : Inclure Leaflet

Ajoutez dans votre `<head>` :

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

---

### Étape 2 : Créer un conteneur pour la carte

```html
<div id="map" style="width: 100%; height: 500px;"></div>
```

---

### Étape 3 : Initialiser la carte avec un style

```javascript
const map = L.map('map').setView([48.8566, 2.3522], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);
```

---

### Étape 4 : Ajouter un système de changement de style

Copiez les objets `mapStyles` et la fonction `changeMapStyle()` de `script.js`.

---

## 📚 Ressources utiles

- [Documentation Leaflet](https://leafletjs.com/)
- [Liste de fournisseurs de tuiles](https://leaflet-extras.github.io/leaflet-providers/preview/)
- [OpenStreetMap France](https://www.openstreetmap.fr/)
- [Conditions d'utilisation OSM](https://operations.osmfoundation.org/policies/tiles/)

---

## ⚠️ Bonnes pratiques

### Attribution obligatoire
Tous les fournisseurs de tuiles exigent d'afficher des **crédits** (attribution).

✅ **Toujours inclure** :
```javascript
attribution: '© OpenStreetMap contributors'
```

❌ **Ne jamais retirer** l'attribution, c'est illégal.

---

### Limites d'utilisation

Les serveurs de tuiles gratuits ont des **limites de requêtes** :
- OSM standard : ~2000 requêtes/jour pour du développement
- Pour un site en production, utilisez un CDN ou un fournisseur payant

**Pour un site avec beaucoup de trafic :**
- Utilisez Mapbox (gratuit jusqu'à 50 000 vues/mois)
- Hébergez vos propres tuiles
- Utilisez un service payant (Maptiler, Thunderforest, etc.)

---

## 🎓 Exercices pour aller plus loin

1. **Ajouter un nouveau style** :
   - Trouvez un autre fournisseur sur [leaflet-providers](https://leaflet-extras.github.io/leaflet-providers/preview/)
   - Ajoutez-le dans `mapStyles`
   - Créez un nouveau bouton

2. **Sauvegarder le choix de l'utilisateur** :
   - Utilisez `localStorage` pour mémoriser le style choisi
   - Rechargez ce style au prochain chargement de la page

3. **Ajouter une transition** :
   - Utilisez l'opacity CSS pour un fondu entre les styles
   - Indice : `layer.setOpacity(0.5)`

4. **Centrer la carte sur la position de l'utilisateur** :
   - Utilisez `navigator.geolocation.getCurrentPosition()`
   - Remplacez les coordonnées de Paris par celles de l'utilisateur

---

## 🐛 Problèmes courants

### La carte ne s'affiche pas
- ✅ Vérifiez que Leaflet CSS et JS sont bien chargés
- ✅ Vérifiez que `#map` a une hauteur définie en CSS
- ✅ Ouvrez la console (F12) pour voir les erreurs

### Les tuiles ne chargent pas
- ✅ Vérifiez votre connexion Internet
- ✅ Vérifiez l'URL du fournisseur de tuiles (pas de faute de frappe)
- ✅ Certains fournisseurs nécessitent une clé API

### Le changement de style ne fonctionne pas
- ✅ Vérifiez que `data-style` correspond bien à une clé de `mapStyles`
- ✅ Ouvrez la console pour voir les logs

---

## 📝 Licence

Ce code est libre d'utilisation pour des projets éducatifs.

**Attribution des fournisseurs de tuiles :**
- OpenStreetMap : © OpenStreetMap contributors
- Carto : © CARTO
- Stamen Watercolor : © Stadia Maps © Stamen Design

---

## 🤝 Contribution

Vous avez des suggestions d'amélioration ? N'hésitez pas à proposer des modifications !

---

**Bon apprentissage ! 🚀**
