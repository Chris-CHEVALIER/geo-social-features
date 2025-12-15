// ========================================
// CONFIGURATION DE LA CARTE
// ========================================

// Initialisation de la carte centrée sur Paris
const map = L.map('map').setView([48.8566, 2.3522], 12);

// Ajout de la couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);


// ========================================
// DONNÉES DE LA HEATMAP
// ========================================

// Jeu de données représentant des points d'activité
// Format : [latitude, longitude, intensité]
// L'intensité va de 0 (faible) à 1 (forte)
const heatmapData = [
    // Zone très active - Centre de Paris (Châtelet, Les Halles)
    [48.8606, 2.3477, 1.0],
    [48.8620, 2.3470, 0.9],
    [48.8595, 2.3490, 0.95],
    [48.8610, 2.3465, 0.85],
    [48.8600, 2.3480, 0.9],

    // Zone active - Opéra
    [48.8719, 2.3318, 0.8],
    [48.8730, 2.3330, 0.75],
    [48.8710, 2.3305, 0.7],
    [48.8725, 2.3340, 0.8],

    // Zone moyenne - Marais
    [48.8586, 2.3610, 0.6],
    [48.8595, 2.3620, 0.65],
    [48.8575, 2.3600, 0.6],
    [48.8590, 2.3630, 0.55],
    [48.8580, 2.3590, 0.6],

    // Zone moyenne - République
    [48.8671, 2.3635, 0.5],
    [48.8680, 2.3645, 0.55],
    [48.8665, 2.3625, 0.5],

    // Zone faible - Parc des Buttes-Chaumont
    [48.8798, 2.3827, 0.3],
    [48.8810, 2.3840, 0.25],
    [48.8785, 2.3815, 0.3],
    [48.8805, 2.3835, 0.2],

    // Zone faible - Quartier Latin
    [48.8500, 2.3440, 0.4],
    [48.8510, 2.3450, 0.35],
    [48.8490, 2.3430, 0.4],
    [48.8505, 2.3445, 0.3],

    // Zone moyenne - Montmartre
    [48.8867, 2.3431, 0.65],
    [48.8875, 2.3420, 0.6],
    [48.8860, 2.3445, 0.7],
    [48.8870, 2.3438, 0.65],

    // Zone active - Bastille
    [48.8532, 2.3690, 0.75],
    [48.8540, 2.3700, 0.8],
    [48.8525, 2.3680, 0.7],
    [48.8535, 2.3695, 0.75],

    // Points supplémentaires pour enrichir la visualisation
    [48.8566, 2.3522, 0.5],  // Notre-Dame
    [48.8738, 2.2950, 0.6],  // Arc de Triomphe
    [48.8584, 2.2945, 0.55], // Tour Eiffel
    [48.8606, 2.3376, 0.7],  // Louvre
    [48.8462, 2.3372, 0.4],  // Jardin du Luxembourg
];


// ========================================
// GRADIENT DE COULEURS PERSONNALISÉ
// ========================================

// Le gradient définit les couleurs utilisées selon l'intensité
// Format : { pourcentage: 'couleur' }
// 0.0 = intensité minimale, 1.0 = intensité maximale
const customGradient = {
    0.0: 'blue',      // Bleu pour les zones de faible intensité
    0.4: 'lime',      // Vert pour les zones d'intensité moyenne-basse
    0.6: 'yellow',    // Jaune pour les zones d'intensité moyenne-haute
    1.0: 'red'        // Rouge pour les zones de forte intensité
};

// Alternative : gradient avec des couleurs RGB précises
// const customGradient = {
//     0.0: 'rgb(0, 0, 255)',      // Bleu
//     0.3: 'rgb(0, 255, 255)',    // Cyan
//     0.5: 'rgb(0, 255, 0)',      // Vert
//     0.7: 'rgb(255, 255, 0)',    // Jaune
//     0.9: 'rgb(255, 128, 0)',    // Orange
//     1.0: 'rgb(255, 0, 0)'       // Rouge
// };


// ========================================
// PARAMÈTRES DE LA HEATMAP
// ========================================

const heatmapOptions = {
    // radius : taille du cercle de chaleur autour de chaque point (en pixels)
    // Plus grande valeur = zones de chaleur plus larges
    radius: 25,

    // blur : niveau de flou appliqué (en pixels)
    // Plus grande valeur = transitions plus douces entre les zones
    blur: 15,

    // maxZoom : niveau de zoom maximum où la heatmap est calculée
    // Au-delà, la heatmap ne change plus de résolution
    maxZoom: 18,

    // gradient : définition des couleurs personnalisées
    // C'est ici qu'on applique notre gradient personnalisé !
    gradient: customGradient
};


// ========================================
// CRÉATION DE LA HEATMAP
// ========================================

// Création de la couche heatmap avec nos données et options
const heatLayer = L.heatLayer(heatmapData, heatmapOptions);

// Ajout de la heatmap à la carte
heatLayer.addTo(map);


// ========================================
// INFORMATIONS DANS LA CONSOLE
// ========================================

console.log('🗺️ Carte Leaflet initialisée');
console.log('🔥 Heatmap créée avec', heatmapData.length, 'points de données');
console.log('🎨 Gradient personnalisé appliqué :', customGradient);
console.log('⚙️ Paramètres :', heatmapOptions);
console.log('');
console.log('💡 Astuce : Zoomez et dézoomez pour voir l\'effet de la heatmap');
console.log('💡 Les zones rouges indiquent une forte concentration');
console.log('💡 Les zones bleues indiquent une faible concentration');
