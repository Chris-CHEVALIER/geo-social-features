# 🔍 Recherche de lieu avec géocodage

## Objectif pédagogique

Comprendre et implémenter un système de recherche de lieu en temps réel en utilisant une API de géocodage externe, sans avoir besoin de stocker les lieux dans un fichier JSON local.

---

## 📚 Concepts clés

### 1. Leaflet vs OpenStreetMap : quelle différence ?

**OpenStreetMap (OSM)** :
- Une **base de données géographique** collaborative mondiale
- Contient les routes, villes, bâtiments, points d'intérêt, etc.
- C'est comme Wikipédia pour les cartes
- Fournit les **tuiles d'images** que vous voyez sur la carte

**Leaflet** :
- Une **bibliothèque JavaScript** pour afficher des cartes interactives
- Permet de créer l'interface de carte, ajouter des marqueurs, gérer le zoom, etc.
- Peut afficher des tuiles provenant d'OSM, Google Maps, Mapbox, etc.

**Analogie** :
- OpenStreetMap = les données (comme une base de données)
- Leaflet = l'outil pour afficher ces données (comme un lecteur vidéo)

---

### 2. Qu'est-ce que le géocodage ?

Le **géocodage** est la transformation d'une adresse ou d'un nom de lieu en coordonnées géographiques (latitude et longitude).

**Exemples** :
- `"Tour Eiffel"` → `48.8584, 2.2945`
- `"5 rue de la Paix, Paris"` → `48.8698, 2.3312`
- `"Tokyo"` → `35.6762, 139.6503`

Le **géocodage inversé** fait l'inverse : coordonnées → adresse.

---

### 3. Qu'est-ce que Nominatim ?

**Nominatim** est le service de géocodage officiel d'OpenStreetMap.

**Caractéristiques** :
- ✅ Gratuit
- ✅ Sans clé API (pour usage léger)
- ✅ Couvre le monde entier
- ✅ Open source

**Comment ça marche ?**
1. Vous envoyez une requête HTTP avec le nom d'un lieu
2. Nominatim cherche dans la base de données OpenStreetMap
3. Il renvoie les coordonnées GPS et des informations sur le lieu

**Exemple de requête** :
```
https://nominatim.openstreetmap.org/search?format=json&q=Paris&limit=1
```

**Réponse JSON** :
```json
[
  {
    "lat": "48.8566969",
    "lon": "2.3514616",
    "display_name": "Paris, Île-de-France, France",
    ...
  }
]
```

---

## 🔄 Pourquoi on n'a pas besoin de JSON local ?

### Approche classique (limitée) :
```javascript
// fichier places.json
[
  {"name": "Paris", "lat": 48.8566, "lon": 2.3522},
  {"name": "Londres", "lat": 51.5074, "lon": -0.1278}
]
```

**Problèmes** :
- ❌ Vous devez connaître tous les lieux à l'avance
- ❌ Impossible de chercher "Tour Eiffel" si elle n'est pas dans le JSON
- ❌ Maintenance fastidieuse
- ❌ Limité à quelques dizaines/centaines de lieux

### Approche avec géocodage (dynamique) :
```javascript
// L'utilisateur peut chercher n'importe quoi :
- "Tour Eiffel"
- "Statue de la Liberté"
- "Mont Fuji"
- "123 rue Victor Hugo, Lyon"
```

**Avantages** :
- ✅ Accès à des millions de lieux dans le monde
- ✅ Recherche d'adresses précises
- ✅ Toujours à jour (OSM est maintenu par la communauté)
- ✅ Pas de fichier JSON à maintenir

---

## ⚙️ Comment ça fonctionne techniquement ?

### Étape 1 : L'utilisateur entre un lieu
```javascript
const query = searchInput.value; // Ex: "Paris"
```

### Étape 2 : Appel à l'API Nominatim
```javascript
const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
const response = await fetch(url);
const data = await response.json();
```

### Étape 3 : Extraction des coordonnées
```javascript
const lat = data[0].lat;
const lon = data[0].lon;
```

### Étape 4 : Mise à jour de la carte Leaflet
```javascript
map.setView([lat, lon], 13);
L.marker([lat, lon]).addTo(map);
```

---

## ⚠️ Limites et bonnes pratiques avec Nominatim

### Limites d'usage

Nominatim est **gratuit mais limité** :
- 1 requête par seconde maximum
- Usage équitable (fair use)
- Pas pour des applications à fort trafic

**Pour des projets en production**, utilisez :
- Un serveur Nominatim auto-hébergé
- Des services commerciaux (Mapbox Geocoding, Google Geocoding API, etc.)

### Bonnes pratiques

1. **Ajouter un User-Agent** :
```javascript
fetch(url, {
    headers: {
        'User-Agent': 'MonApp - contact@example.com'
    }
})
```

2. **Gérer les erreurs** :
- Aucun résultat trouvé
- Erreur réseau
- Limite de taux dépassée

3. **Optimiser les requêtes** :
- Éviter les recherches automatiques à chaque frappe
- Implémenter un debounce si nécessaire
- Cacher les résultats fréquents

---

## 🎓 Comment réutiliser cette logique dans votre projet ?

### 1. Copier la fonction de géocodage

```javascript
async function searchPlace(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'VotreApp - votre.email@example.com'
        }
    });

    const data = await response.json();
    return data[0]; // Premier résultat
}
```

### 2. Adapter à vos besoins

**Exemple : Recherche avec autocomplétion** :
```javascript
// Modifier limit=1 en limit=5 pour avoir plusieurs suggestions
const url = `...&limit=5`;
```

**Exemple : Filtrer par pays** :
```javascript
// Ajouter countrycodes=fr pour limiter à la France
const url = `...&countrycodes=fr`;
```

**Exemple : Recherche inversée (coordonnées → adresse)** :
```javascript
async function reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(url);
    return await response.json();
}
```

### 3. Intégrer avec vos données existantes

Vous pouvez **combiner** le géocodage avec vos données locales :

```javascript
// 1. Charger vos événements depuis votre JSON
const events = await fetch('events.json').then(r => r.json());

// 2. Permettre la recherche de nouveaux lieux
const searchResult = await searchPlace(userQuery);

// 3. Afficher les événements + le lieu recherché sur la même carte
events.forEach(event => {
    L.marker([event.lat, event.lon]).addTo(map);
});

L.marker([searchResult.lat, searchResult.lon])
    .addTo(map)
    .setIcon(customIcon); // Icône différente pour distinguer
```

---

## 📖 Ressources supplémentaires

- [Documentation Nominatim](https://nominatim.org/release-docs/latest/api/Overview/)
- [Usage Policy Nominatim](https://operations.osmfoundation.org/policies/nominatim/)
- [Leaflet Documentation](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)

---

## 🚀 Exercices pour aller plus loin

1. **Afficher plusieurs résultats** : Modifier `limit=1` en `limit=5` et afficher une liste de suggestions
2. **Recherche inversée** : Ajouter un clic sur la carte pour obtenir l'adresse des coordonnées
3. **Historique de recherche** : Sauvegarder les recherches dans `localStorage`
4. **Filtrage géographique** : Limiter les résultats à un pays spécifique
5. **Calcul de distance** : Calculer la distance entre votre position et le lieu recherché

---

## 💡 Points clés à retenir

✅ Le géocodage permet de transformer n'importe quel nom de lieu en coordonnées GPS
✅ Nominatim est gratuit pour des prototypes et projets étudiants
✅ Vous n'avez pas besoin de stocker tous les lieux dans un fichier JSON
✅ L'API renvoie des données JSON exploitables directement
✅ Respectez les limites d'usage et ajoutez un User-Agent
✅ Pour la production, envisagez un service commercial ou auto-hébergé
