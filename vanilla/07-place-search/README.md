# 07 - Recherche de lieu sur la carte

## 🎯 Objectif pédagogique

Apprendre à rechercher un lieu par son nom (ville, adresse, monument) et l'afficher sur une carte interactive **sans avoir besoin de données locales**.

Cette fonctionnalité utilise le **géocodage** pour transformer un nom de lieu en coordonnées géographiques (latitude/longitude).

---

## 🗺️ Concepts clés

### Leaflet vs OpenStreetMap : quelle différence ?

- **OpenStreetMap (OSM)** : c'est une **base de données cartographique** mondiale et collaborative (comme Wikipédia pour les cartes)
- **Leaflet** : c'est une **bibliothèque JavaScript** qui permet d'afficher des cartes interactives dans le navigateur

**Analogie** : OpenStreetMap fournit les données de la carte, Leaflet les affiche joliment dans votre page web.

### Qu'est-ce que le géocodage ?

Le **géocodage** consiste à transformer une adresse ou un nom de lieu en coordonnées géographiques.

**Exemples** :
- "Tour Eiffel" → `48.858370, 2.294481`
- "10 Downing Street, London" → `51.503396, -0.127764`
- "Tokyo" → `35.689487, 139.691711`

C'est exactement ce que fait Google Maps quand vous tapez une adresse !

### Qu'est-ce que Nominatim ?

**Nominatim** est le service de géocodage officiel d'OpenStreetMap.

- **Gratuit** et **open source**
- Pas besoin de clé API pour un usage léger
- Accessible via une simple URL

**URL de base** : `https://nominatim.openstreetmap.org/search`

---

## ⚙️ Comment ça fonctionne ?

### 1. L'utilisateur entre un lieu

```html
<input type="text" placeholder="Entrez une ville, adresse ou lieu" />
```

### 2. On appelle l'API Nominatim

```javascript
const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
const response = await fetch(url);
const data = await response.json();
```

**Paramètres importants** :
- `format=json` : on veut une réponse en JSON
- `q=Paris` : le lieu recherché
- `limit=1` : on ne veut que le meilleur résultat

### 3. On reçoit les coordonnées

```json
[
  {
    "lat": "48.8566969",
    "lon": "2.3514616",
    "display_name": "Paris, Île-de-France, France"
  }
]
```

### 4. On centre la carte et on ajoute un marqueur

```javascript
map.setView([lat, lon], 13);
L.marker([lat, lon]).addTo(map).bindPopup(name);
```

---

## 🚀 Utilisation

1. Ouvrez `index.html` dans votre navigateur
2. Tapez un lieu dans le champ de recherche :
   - Une ville : "Lyon", "New York", "Tokyo"
   - Un monument : "Tour Eiffel", "Big Ben"
   - Une adresse : "10 Downing Street, London"
3. Cliquez sur "Rechercher"
4. La carte se centre sur le lieu et un marqueur apparaît

---

## 🎓 Points techniques importants

### Pourquoi pas besoin de fichier JSON local ?

Contrairement aux autres exemples de cette bibliothèque où les données sont dans un fichier `data.json`, **ici les données viennent d'internet** :

- Les lieux du monde entier sont dans la base OpenStreetMap
- L'API Nominatim interroge cette base en temps réel
- Aucun fichier local n'est nécessaire

**Avantage** : vous pouvez chercher n'importe quel lieu du monde !

### Gestion des erreurs

Le code gère trois cas d'erreur :

1. **Aucun résultat trouvé** : le lieu n'existe pas ou le nom est mal orthographié
2. **Erreur réseau** : pas de connexion internet ou API indisponible
3. **Champ vide** : l'utilisateur n'a rien saisi

### Bonne pratique : le User-Agent

Nominatim demande d'identifier votre application via un `User-Agent` :

```javascript
fetch(url, {
    headers: {
        'User-Agent': 'GeoSocialFeaturesDemo/1.0 (Educational purpose)'
    }
})
```

C'est une politesse technique qui permet à OpenStreetMap de comprendre qui utilise leur service.

---

## ⚠️ Limites de Nominatim

### Usage étudiant / prototype uniquement

Nominatim est **gratuit mais limité** :

- **1 requête par seconde maximum**
- Conçu pour un usage léger (tests, prototypes, étudiants)
- Pour un site en production avec beaucoup d'utilisateurs, il faut :
  - Installer votre propre serveur Nominatim
  - Utiliser un service commercial (MapBox, Google Maps Geocoding, etc.)

### Pas d'autocomplétion

Cette démo ne propose **pas de suggestions pendant la frappe** (comme Google Maps).

Pour ajouter cette fonctionnalité :
- Il faudrait appeler l'API à chaque lettre tapée
- Cela dépasserait rapidement la limite de 1 requête/seconde
- Des services comme MapBox ou Algolia sont plus adaptés

---

## 🔄 Réutiliser cette logique dans votre projet

### Code minimal pour rechercher un lieu

```javascript
async function searchPlace(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    const response = await fetch(url, {
        headers: { 'User-Agent': 'MonApp/1.0' }
    });

    const data = await response.json();

    if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        return { lat, lon, name: data[0].display_name };
    }

    return null;
}
```

### Intégration dans un projet

1. Copiez la fonction `searchPlace()` dans votre projet
2. Appelez-la quand l'utilisateur soumet le formulaire
3. Utilisez les coordonnées retournées pour mettre à jour votre carte

**Exemple** :

```javascript
const result = await searchPlace("Paris");
if (result) {
    map.setView([result.lat, result.lon], 13);
}
```

---

## 📚 Pour aller plus loin

### Améliorer la recherche

- Ajouter un filtre par pays : `&countrycodes=fr`
- Limiter à un type : `&type=city` (ville uniquement)
- Obtenir plus de résultats : `&limit=5` (pour laisser l'utilisateur choisir)

### Alternatives à Nominatim

Pour un projet plus ambitieux :

1. **MapBox Geocoding API** : autocomplétion rapide, 100 000 requêtes/mois gratuites
2. **Google Maps Geocoding API** : très précis, payant au-delà de 200$/mois
3. **Algolia Places** (maintenant Mapbox Search) : spécialisé dans l'autocomplétion

---

## 🛠️ Structure du projet

```
07-place-search/
├── index.html      # Page HTML avec formulaire et carte
├── style.css       # Styles pour le formulaire et la carte
├── script.js       # Logique de recherche et mise à jour de la carte
└── README.md       # Ce fichier
```

---

## ✅ Ce que vous avez appris

- ✅ Faire une requête à une API externe avec `fetch()`
- ✅ Comprendre le concept de géocodage
- ✅ Utiliser Nominatim pour transformer un lieu en coordonnées
- ✅ Mettre à jour dynamiquement une carte Leaflet
- ✅ Gérer les cas d'erreur (aucun résultat, problème réseau)
- ✅ Ajouter/supprimer des marqueurs sur une carte
- ✅ Distinguer OpenStreetMap (données) et Leaflet (affichage)

---

## 🎨 Personnalisation possible

- Changer le style du marqueur (icône personnalisée)
- Ajouter un historique des recherches
- Permettre de sauvegarder les lieux favoris
- Afficher plusieurs résultats au lieu d'un seul
- Ajouter une animation lors du centrage de la carte

---

**Bon apprentissage ! 🗺️**
