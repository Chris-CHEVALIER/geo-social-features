# 📍 Suivi de position en temps réel

## 📋 Description

Cette fonctionnalité pédagogique montre comment **suivre la position d'un utilisateur en temps réel** en utilisant l'API de géolocalisation native du navigateur (`navigator.geolocation`) et afficher cette position sur une carte interactive Leaflet.

**Ce que vous allez apprendre :**
- Comprendre l'API de géolocalisation du navigateur
- La différence entre `getCurrentPosition` et `watchPosition`
- Comment mettre à jour un marqueur en temps réel sur une carte
- Gérer les autorisations et les erreurs de géolocalisation
- Le rôle de Leaflet (affichage uniquement, pas de calcul GPS)

---

## 🚀 Installation et utilisation

### Prérequis
- Un navigateur web moderne
- **HTTPS** ou **localhost** (obligatoire pour la géolocalisation)
- Autoriser la géolocalisation quand le navigateur le demande

### Lancer la démo

**Option 1 : Avec un serveur local (recommandé)**
```bash
# Avec Python 3
python -m http.server 8000

# Avec Python 2
python -m SimpleHTTPServer 8000

# Avec Node.js (npx)
npx serve

# Avec PHP
php -S localhost:8000
```

Puis ouvrez : `http://localhost:8000/vanilla/03-user-location-tracking/`

**Option 2 : Ouvrir directement le fichier**
- Ouvrez `index.html` dans votre navigateur
- ⚠️ La géolocalisation peut être bloquée en `file://` selon votre navigateur

---

## 🧠 Concepts clés

### L'API de géolocalisation du navigateur

**Ce n'est PAS Leaflet qui calcule votre position !**

L'API `navigator.geolocation` est **native** au navigateur. Elle utilise :
- Le **GPS** (si disponible sur l'appareil)
- Les **réseaux Wi-Fi** environnants
- Les **antennes cellulaires** (sur mobile)
- L'**adresse IP** (en dernier recours)

**Leaflet ne fait qu'afficher** la position retournée par le navigateur.

---

### `getCurrentPosition` vs `watchPosition`

| Méthode | Usage | Fonctionnement |
|---------|-------|----------------|
| `getCurrentPosition()` | Position **ponctuelle** | Demande la position **une seule fois** |
| `watchPosition()` | Suivi en **temps réel** | Appelle un callback **à chaque déplacement** |

**Exemple `getCurrentPosition` (position unique) :**
```javascript
navigator.geolocation.getCurrentPosition(
    (position) => {
        console.log('Position :', position.coords.latitude, position.coords.longitude);
    }
);
```

**Exemple `watchPosition` (suivi continu) :**
```javascript
const watchId = navigator.geolocation.watchPosition(
    (position) => {
        console.log('Nouvelle position :', position.coords);
        // Cette fonction est appelée à CHAQUE changement de position
    }
);

// Pour arrêter le suivi :
navigator.geolocation.clearWatch(watchId);
```

---

### Les autorisations de géolocalisation

La géolocalisation nécessite **l'autorisation explicite** de l'utilisateur.

**Comportement du navigateur :**
1. L'utilisateur clique sur "Démarrer le suivi"
2. Le navigateur affiche une popup : "Autoriser ce site à accéder à votre position ?"
3. Trois choix possibles :
   - ✅ **Autoriser** → le suivi fonctionne
   - ❌ **Refuser** → erreur `PERMISSION_DENIED`
   - ⏰ **Ignorer** → timeout après quelques secondes

**Révoquer l'autorisation :**
- Chrome : cliquez sur le cadenas dans la barre d'adresse → Paramètres du site
- Firefox : cliquez sur l'icône "i" → Autorisations

---

### Options de `watchPosition()`

```javascript
const options = {
    enableHighAccuracy: true,  // Utiliser le GPS si disponible (plus précis, plus de batterie)
    timeout: 10000,            // Temps max d'attente (10 secondes)
    maximumAge: 0              // Ne pas utiliser de position en cache
};

navigator.geolocation.watchPosition(successCallback, errorCallback, options);
```

**`enableHighAccuracy` :**
- `true` : utilise le GPS → très précis (5-10m) mais consomme de la batterie
- `false` : utilise Wi-Fi/IP → moins précis (50-500m) mais économe

**`timeout` :**
- Temps maximum pour obtenir une position (en millisecondes)
- Si dépassé → erreur `TIMEOUT`

**`maximumAge` :**
- Âge maximum d'une position en cache (en millisecondes)
- `0` = toujours demander une nouvelle position

---

## 📂 Structure du code

```
03-user-location-tracking/
├── index.html       # Page HTML avec la structure
├── style.css        # Styles CSS pour le design
├── script.js        # Logique JavaScript (géolocalisation + Leaflet)
└── README.md        # Ce fichier
```

---

## 🔍 Comment fonctionne le code

### 1. Initialisation de la carte Leaflet

```javascript
const map = L.map('map').setView([48.8566, 2.3522], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);
```

On crée une carte centrée sur Paris par défaut. Elle sera recentrée sur l'utilisateur dès qu'on aura sa position.

---

### 2. Démarrage du suivi

```javascript
function startTracking() {
    // Vérifier que l'API est disponible
    if (!navigator.geolocation) {
        alert('Géolocalisation non disponible');
        return;
    }

    // Lancer le suivi
    watchId = navigator.geolocation.watchPosition(
        successCallback,  // Appelé à chaque nouvelle position
        errorCallback,    // Appelé en cas d'erreur
        options          // Configuration
    );
}
```

**`watchId` :** identifiant du suivi, nécessaire pour l'arrêter avec `clearWatch()`

---

### 3. Réception d'une position (callback de succès)

```javascript
function successCallback(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy; // Précision en mètres

    // Mettre à jour ou créer le marqueur
    if (userMarker === null) {
        // Premier appel : créer le marqueur
        userMarker = L.marker([lat, lng]).addTo(map);
    } else {
        // Appels suivants : déplacer le marqueur existant
        userMarker.setLatLng([lat, lng]);
    }

    // Centrer la carte seulement au premier appel
    if (isFirstPosition) {
        map.setView([lat, lng], 16);
        isFirstPosition = false;
    }
}
```

**Pourquoi créer le marqueur une seule fois ?**
- Créer un nouveau marqueur à chaque position causerait des doublons
- Il vaut mieux **déplacer** le marqueur existant avec `setLatLng()`

---

### 4. Gestion des erreurs

```javascript
function errorCallback(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.error('Autorisation refusée');
            break;

        case error.POSITION_UNAVAILABLE:
            console.error('Position indisponible');
            break;

        case error.TIMEOUT:
            console.error('Timeout');
            break;
    }

    // Arrêter le suivi en cas d'erreur
    stopTracking();
}
```

**Types d'erreurs :**
- `PERMISSION_DENIED` : l'utilisateur a refusé l'autorisation
- `POSITION_UNAVAILABLE` : GPS désactivé, pas de signal, etc.
- `TIMEOUT` : la demande a expiré (dépassement du `timeout`)

---

### 5. Arrêt du suivi

```javascript
function stopTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}
```

**Important :** toujours arrêter le suivi quand il n'est plus nécessaire pour économiser la batterie.

---

## 🎯 Points clés à retenir

### 1. La géolocalisation est une fonctionnalité du navigateur
- ✅ `navigator.geolocation` est une API **native** (pas de bibliothèque externe)
- ✅ Leaflet ne fait qu'**afficher** les positions, il ne les calcule pas
- ✅ Fonctionne sans Leaflet (vous pouvez juste afficher les coordonnées en texte)

### 2. watchPosition() appelle un callback à chaque déplacement
- ✅ Parfait pour un suivi en temps réel (GPS, course à pied, livraison, etc.)
- ✅ Retourne un `watchId` pour pouvoir arrêter le suivi plus tard
- ✅ Plus gourmand en batterie que `getCurrentPosition()`

### 3. Toujours gérer les erreurs
- ✅ L'utilisateur peut refuser l'autorisation
- ✅ Le GPS peut être désactivé ou indisponible
- ✅ Afficher des messages clairs pour guider l'utilisateur

### 4. HTTPS est obligatoire (sauf localhost)
- ✅ En `http://` → la géolocalisation est **bloquée** par sécurité
- ✅ En `https://` → la géolocalisation fonctionne
- ✅ Sur `localhost` → la géolocalisation fonctionne (exception pour le développement)

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

### Étape 3 : Initialiser la carte

```javascript
const map = L.map('map').setView([48.8566, 2.3522], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);
```

---

### Étape 4 : Suivre la position de l'utilisateur

```javascript
let userMarker = null;
let isFirstPosition = true;

const watchId = navigator.geolocation.watchPosition(
    (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Créer ou déplacer le marqueur
        if (userMarker === null) {
            userMarker = L.marker([lat, lng]).addTo(map);
        } else {
            userMarker.setLatLng([lat, lng]);
        }

        // Centrer la carte au premier appel
        if (isFirstPosition) {
            map.setView([lat, lng], 16);
            isFirstPosition = false;
        }
    },
    (error) => {
        console.error('Erreur de géolocalisation :', error);
    },
    {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    }
);

// Arrêter le suivi quand ce n'est plus nécessaire
// navigator.geolocation.clearWatch(watchId);
```

---

### Étape 5 : Nettoyer proprement

```javascript
// Arrêter le suivi avant de fermer la page
window.addEventListener('beforeunload', () => {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
});
```

---

## 🎨 Personnalisation du marqueur

### Utiliser une icône personnalisée

```javascript
const customIcon = L.icon({
    iconUrl: 'https://example.com/marker.png',
    iconSize: [25, 41],       // Taille de l'icône
    iconAnchor: [12, 41],     // Point d'ancrage (pointe du marqueur)
    popupAnchor: [1, -34]     // Point d'ancrage de la popup
});

const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
```

### Ajouter un cercle de précision

```javascript
// Afficher un cercle bleu autour du marqueur
const accuracyCircle = L.circle([lat, lng], {
    radius: position.coords.accuracy, // Rayon = précision en mètres
    color: '#3388ff',
    fillColor: '#3388ff',
    fillOpacity: 0.15
}).addTo(map);
```

---

## 📚 Ressources utiles

- [Documentation MDN : Geolocation API](https://developer.mozilla.org/fr/docs/Web/API/Geolocation_API)
- [Documentation Leaflet](https://leafletjs.com/)
- [Liste de fournisseurs de tuiles](https://leaflet-extras.github.io/leaflet-providers/preview/)
- [Tester les autorisations](https://www.whatismybrowser.com/detect/is-geolocation-enabled)

---

## ⚠️ Bonnes pratiques

### 1. Toujours arrêter le suivi quand il n'est plus nécessaire

```javascript
// ❌ Mauvais : le suivi continue indéfiniment
navigator.geolocation.watchPosition(callback);

// ✅ Bon : on stocke l'ID et on l'arrête plus tard
const watchId = navigator.geolocation.watchPosition(callback);
// ...
navigator.geolocation.clearWatch(watchId);
```

---

### 2. Gérer tous les cas d'erreur

```javascript
// ✅ Toujours prévoir un callback d'erreur
navigator.geolocation.watchPosition(
    successCallback,
    errorCallback,  // ← Ne jamais oublier !
    options
);
```

---

### 3. Adapter `enableHighAccuracy` selon l'usage

```javascript
// Pour du tracking sportif (course, vélo) → précision max
{ enableHighAccuracy: true }

// Pour afficher une ville approximative → économiser la batterie
{ enableHighAccuracy: false }
```

---

### 4. Ne pas recentrer la carte à chaque position

```javascript
// ❌ Mauvais : la carte bouge sans arrêt, l'utilisateur ne peut pas explorer
function successCallback(position) {
    map.setView([position.coords.latitude, position.coords.longitude]);
}

// ✅ Bon : centrer seulement au premier appel
let isFirstPosition = true;

function successCallback(position) {
    if (isFirstPosition) {
        map.setView([position.coords.latitude, position.coords.longitude]);
        isFirstPosition = false;
    }
}
```

---

### 5. Tester avec un serveur local (pas file://)

```bash
# HTTPS simulé avec localhost
python -m http.server 8000
```

---

## 🐛 Problèmes courants

### La géolocalisation ne fonctionne pas

**Vérifications :**
- ✅ Êtes-vous en `https://` ou `localhost` ?
- ✅ Avez-vous autorisé la géolocalisation dans le navigateur ?
- ✅ Le GPS est-il activé sur votre appareil ?
- ✅ Ouvrez la console (F12) pour voir les erreurs

---

### Le marqueur ne bouge pas

**Causes possibles :**
- Vous ne bougez pas assez (essayez de marcher 50m)
- `enableHighAccuracy: false` → précision faible, détecte moins les petits déplacements
- `maximumAge` trop élevé → utilise une position en cache

---

### La carte est centrée sur Paris

**Solutions :**
- Vérifiez que `successCallback` est bien appelé (ajoutez un `console.log`)
- Vérifiez que `isFirstPosition` est bien `true` au démarrage
- Vérifiez qu'aucune erreur n'empêche le callback de s'exécuter

---

### Erreur `PERMISSION_DENIED`

**Solutions :**
- Révoquez l'autorisation dans les paramètres du navigateur
- Rechargez la page pour redemander l'autorisation
- Testez dans une navigation privée (les autorisations sont réinitialisées)

---

## 🎓 Exercices pour aller plus loin

### 1. Afficher un cercle de précision
- Ajoutez un cercle bleu autour du marqueur
- Son rayon = `position.coords.accuracy` (précision en mètres)

### 2. Dessiner le trajet parcouru
- Stockez toutes les positions dans un tableau
- Utilisez `L.polyline()` pour dessiner une ligne reliant tous les points

### 3. Calculer la distance parcourue
- Utilisez la formule de Haversine pour calculer la distance entre deux points GPS
- Affichez la distance totale en kilomètres

### 4. Sauvegarder le trajet
- Utilisez `localStorage` pour sauvegarder les positions
- Rechargez le trajet au prochain chargement de la page

### 5. Afficher la vitesse
- Utilisez `position.coords.speed` (en m/s)
- Convertissez en km/h : `speed * 3.6`

### 6. Mode "suivi automatique"
- Ajoutez un bouton pour activer/désactiver le recentrage automatique
- Quand actif, la carte suit l'utilisateur en temps réel

---

## 📝 Licence

Ce code est libre d'utilisation pour des projets éducatifs.

**Attribution des ressources :**
- Leaflet : BSD-2-Clause License
- OpenStreetMap : © OpenStreetMap contributors
- Icônes de marqueurs : Leaflet Color Markers (MIT License)

---

## 🤝 Contribution

Vous avez des suggestions d'amélioration ? N'hésitez pas à proposer des modifications !

---

**Bon apprentissage ! 🚀**
