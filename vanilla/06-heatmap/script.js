// ===================================
// 1. INITIALISATION DE LA CARTE
// ===================================

// On centre la carte sur Paris
const map = L.map('map').setView([48.8566, 2.3522], 13);

// Ajout du fond de carte OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);


// ===================================
// 2. DONNÉES POUR LA HEATMAP
// ===================================

// Tableau de points représentant des cafés à Paris
// Format : [latitude, longitude, intensité]
// L'intensité (optionnelle) permet de pondérer certains points (ex: un café très fréquenté)
const cafePoints = [
    // Quartier Latin
    [48.8534, 2.3488, 0.8],
    [48.8528, 2.3495, 0.6],
    [48.8540, 2.3480, 0.9],
    [48.8536, 2.3492, 0.7],
    [48.8530, 2.3485, 0.5],

    // Le Marais
    [48.8584, 2.3610, 0.9],
    [48.8580, 2.3620, 0.8],
    [48.8588, 2.3605, 0.7],
    [48.8576, 2.3615, 0.6],
    [48.8590, 2.3600, 0.9],
    [48.8582, 2.3608, 0.8],

    // Saint-Germain-des-Prés
    [48.8540, 2.3330, 1.0],
    [48.8536, 2.3340, 0.9],
    [48.8545, 2.3325, 0.8],
    [48.8538, 2.3335, 0.7],
    [48.8542, 2.3328, 0.9],
    [48.8534, 2.3338, 0.8],
    [48.8548, 2.3322, 0.6],

    // Montmartre
    [48.8867, 2.3431, 0.7],
    [48.8870, 2.3425, 0.8],
    [48.8864, 2.3438, 0.6],
    [48.8872, 2.3428, 0.9],

    // Bastille
    [48.8530, 2.3690, 0.8],
    [48.8534, 2.3685, 0.7],
    [48.8528, 2.3695, 0.6],
    [48.8532, 2.3688, 0.9],

    // Louvre / Châtelet
    [48.8606, 2.3376, 0.9],
    [48.8610, 2.3380, 0.8],
    [48.8602, 2.3372, 0.7],
    [48.8608, 2.3378, 0.6],

    // Opéra
    [48.8708, 2.3315, 0.8],
    [48.8712, 2.3320, 0.9],
    [48.8704, 2.3310, 0.7],
    [48.8710, 2.3318, 0.8],

    // Champs-Élysées
    [48.8698, 2.3078, 0.6],
    [48.8702, 2.3085, 0.7],
    [48.8694, 2.3072, 0.5],

    // République
    [48.8675, 2.3635, 0.9],
    [48.8678, 2.3640, 0.8],
    [48.8672, 2.3630, 0.7],
    [48.8680, 2.3638, 0.9],

    // Canal Saint-Martin
    [48.8720, 2.3650, 0.8],
    [48.8724, 2.3655, 0.9],
    [48.8716, 2.3645, 0.7],
    [48.8728, 2.3660, 0.6],

    // Oberkampf
    [48.8655, 2.3780, 0.9],
    [48.8658, 2.3785, 0.8],
    [48.8652, 2.3775, 0.7],
    [48.8660, 2.3788, 0.9]
];


// ===================================
// 3. CRÉATION DE LA HEATMAP
// ===================================

// Configuration des options de la heatmap
const heatmapOptions = {
    radius: 25,        // Rayon d'influence de chaque point (en pixels)
    blur: 15,          // Flou appliqué (lissage des transitions)
    maxZoom: 13,       // Zoom maximal où la heatmap reste visible
    max: 1.0,          // Valeur maximale pour l'intensité (correspond au rouge vif)
    minOpacity: 0.4    // Opacité minimale de la heatmap
};

// Création de la couche heatmap avec nos données et options
const heatLayer = L.heatLayer(cafePoints, heatmapOptions);

// Ajout de la heatmap à la carte
heatLayer.addTo(map);


// ===================================
// 4. INFORMATIONS PÉDAGOGIQUES
// ===================================

/*
EXPLICATION DU FORMAT DES DONNÉES :
-----------------------------------
Chaque point de la heatmap est un tableau [latitude, longitude, intensité]

- latitude : coordonnée nord/sud (obligatoire)
- longitude : coordonnée est/ouest (obligatoire)
- intensité : valeur entre 0 et 1 (optionnelle, par défaut = 1)

Exemple :
[48.8534, 2.3488, 0.8] signifie :
- Latitude : 48.8534° Nord
- Longitude : 2.3488° Est
- Intensité : 0.8 (80% de l'intensité maximale)


PARAMÈTRES DE LA HEATMAP :
---------------------------
- radius : taille du "halo" autour de chaque point
  → Plus le rayon est grand, plus les zones se fondent ensemble
  → Valeur recommandée : 15-30 pixels

- blur : lissage des transitions entre couleurs
  → Plus la valeur est grande, plus les transitions sont douces
  → Valeur recommandée : 10-20 pixels

- maxZoom : niveau de zoom où la heatmap disparaît
  → Permet d'afficher des marqueurs individuels au zoom max

- max : valeur de référence pour la couleur maximale (rouge)
  → Tous les points avec intensité >= max seront rouge vif

- minOpacity : transparence minimale de la heatmap
  → 0 = totalement transparent, 1 = totalement opaque


PALETTE DE COULEURS (par défaut) :
-----------------------------------
Bleu → Cyan → Vert → Jaune → Orange → Rouge
(faible densité)              (forte densité)


QUAND UTILISER UNE HEATMAP ?
-----------------------------
✅ Afficher des zones de densité (restaurants, événements, accidents)
✅ Visualiser des tendances géographiques
✅ Représenter beaucoup de points sans surcharger la carte
✅ Identifier rapidement les "zones chaudes"

❌ Ne pas utiliser pour :
- Afficher des emplacements précis (utiliser des marqueurs)
- Moins de 20-30 points (pas assez de données)
- Des données qui nécessitent des détails individuels
*/
