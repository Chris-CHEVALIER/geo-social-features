// ============================================
// CONFIGURATION INITIALE
// ============================================

/**
 * Coordonnées par défaut (Paris, France)
 * Utilisées avant d'obtenir la position réelle de l'utilisateur
 */
const defaultCoords = [48.8566, 2.3522];
const defaultZoom = 13;

/**
 * Initialisation de la carte Leaflet
 * On commence centré sur Paris, puis on recentrera sur l'utilisateur
 */
const map = L.map('map').setView(defaultCoords, defaultZoom);

/**
 * Ajout du layer de tuiles OpenStreetMap
 * Ce sont les images qui composent la carte
 */
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);


// ============================================
// VARIABLES GLOBALES
// ============================================

/**
 * watchId : l'identifiant retourné par watchPosition()
 * Permet d'arrêter le suivi plus tard avec clearWatch()
 */
let watchId = null;

/**
 * userMarker : le marqueur Leaflet qui représente l'utilisateur
 * On le stocke pour pouvoir déplacer le marqueur au lieu d'en créer un nouveau
 */
let userMarker = null;

/**
 * isFirstPosition : booléen pour savoir si c'est la première position reçue
 * Utilisé pour centrer la carte seulement au début
 */
let isFirstPosition = true;


// ============================================
// RÉFÉRENCES AUX ÉLÉMENTS HTML
// ============================================

const startBtn = document.getElementById('start-tracking');
const stopBtn = document.getElementById('stop-tracking');
const statusBox = document.getElementById('status-box');
const statusTitle = document.getElementById('status-title');
const statusMessage = document.getElementById('status-message');
const infoPanel = document.getElementById('info-panel');
const latitudeEl = document.getElementById('latitude');
const longitudeEl = document.getElementById('longitude');
const accuracyEl = document.getElementById('accuracy');
const timestampEl = document.getElementById('timestamp');


// ============================================
// FONCTION : DÉMARRER LE SUIVI
// ============================================

function startTracking() {
    // 1. Vérifier si le navigateur supporte la géolocalisation
    if (!navigator.geolocation) {
        updateStatus('error', 'Géolocalisation non disponible',
            'Votre navigateur ne supporte pas l\'API de géolocalisation.');
        return;
    }

    // 2. Mettre à jour l'interface
    updateStatus('waiting', 'Demande d\'autorisation...',
        'Le navigateur va vous demander l\'autorisation d\'accéder à votre position.');
    startBtn.disabled = true;
    stopBtn.disabled = false;

    // 3. Options de géolocalisation
    const options = {
        enableHighAccuracy: true,  // Utilise le GPS si disponible (plus précis mais plus de batterie)
        timeout: 10000,            // Temps max d'attente pour obtenir une position (10 secondes)
        maximumAge: 0              // Ne pas utiliser de position en cache, toujours demander une nouvelle
    };

    // 4. Lancer le suivi avec watchPosition()
    // Cette fonction appelle successCallback à chaque nouvelle position
    // et errorCallback en cas d'erreur
    watchId = navigator.geolocation.watchPosition(
        successCallback,    // Appelé quand on reçoit une position
        errorCallback,      // Appelé en cas d'erreur
        options            // Configuration
    );

    console.log('🎯 Suivi démarré avec l\'ID:', watchId);
}


// ============================================
// FONCTION : ARRÊTER LE SUIVI
// ============================================

function stopTracking() {
    // 1. Vérifier qu'un suivi est en cours
    if (watchId !== null) {
        // 2. Arrêter le suivi avec clearWatch()
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        console.log('⏹️ Suivi arrêté');
    }

    // 3. Réinitialiser l'interface
    updateStatus('waiting', 'Suivi arrêté',
        'Cliquez sur "Démarrer le suivi" pour recommencer.');
    startBtn.disabled = false;
    stopBtn.disabled = true;
    isFirstPosition = true; // Permettre un nouveau centrage au prochain démarrage
}


// ============================================
// CALLBACK : SUCCÈS (position reçue)
// ============================================

/**
 * Cette fonction est appelée automatiquement par watchPosition()
 * à chaque fois qu'une nouvelle position est détectée
 *
 * @param {GeolocationPosition} position - Objet contenant les coordonnées
 */
function successCallback(position) {
    console.log('📍 Nouvelle position reçue:', position);

    // 1. Extraire les données de position
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy; // Précision en mètres
    const timestamp = new Date(position.timestamp);

    // 2. Mettre à jour le statut
    updateStatus('tracking', 'Suivi actif',
        `Position mise à jour avec succès (précision : ${Math.round(accuracy)}m)`);

    // 3. Afficher les informations de position
    displayPositionInfo(lat, lng, accuracy, timestamp);

    // 4. Mettre à jour ou créer le marqueur sur la carte
    updateMapMarker(lat, lng);

    // 5. Si c'est la première position, centrer la carte dessus
    if (isFirstPosition) {
        map.setView([lat, lng], 16); // Zoom plus proche (16) pour voir le détail
        isFirstPosition = false;
        console.log('🎯 Carte centrée sur la position initiale');
    }
}


// ============================================
// CALLBACK : ERREUR
// ============================================

/**
 * Cette fonction est appelée automatiquement par watchPosition()
 * en cas d'erreur (refus d'autorisation, timeout, etc.)
 *
 * @param {GeolocationPositionError} error - Objet contenant le type d'erreur
 */
function errorCallback(error) {
    console.error('❌ Erreur de géolocalisation:', error);

    let errorTitle = 'Erreur de géolocalisation';
    let errorMessage = '';

    // Analyser le type d'erreur et afficher un message adapté
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = 'Vous avez refusé l\'accès à votre position. ' +
                          'Autorisez la géolocalisation dans les paramètres de votre navigateur.';
            break;

        case error.POSITION_UNAVAILABLE:
            errorMessage = 'Impossible de déterminer votre position. ' +
                          'Vérifiez que le GPS est activé et que vous êtes dans une zone couverte.';
            break;

        case error.TIMEOUT:
            errorMessage = 'La demande de position a expiré. ' +
                          'Réessayez dans quelques instants.';
            break;

        default:
            errorMessage = 'Une erreur inconnue s\'est produite.';
    }

    // Afficher l'erreur à l'utilisateur
    updateStatus('error', errorTitle, errorMessage);

    // Arrêter automatiquement le suivi en cas d'erreur
    stopTracking();
}


// ============================================
// FONCTION : METTRE À JOUR LE STATUT
// ============================================

/**
 * Met à jour la boîte de statut avec un état, un titre et un message
 *
 * @param {string} state - 'waiting', 'tracking' ou 'error'
 * @param {string} title - Titre du statut
 * @param {string} message - Message détaillé
 */
function updateStatus(state, title, message) {
    // Retirer toutes les anciennes classes
    statusBox.classList.remove('waiting', 'tracking', 'error');

    // Ajouter la nouvelle classe
    statusBox.classList.add(state);

    // Mettre à jour le texte
    statusTitle.textContent = title;
    statusMessage.textContent = message;

    // Changer l'icône selon l'état
    const statusIcon = statusBox.querySelector('.status-icon');
    if (state === 'waiting') {
        statusIcon.textContent = '⏳';
    } else if (state === 'tracking') {
        statusIcon.textContent = '✅';
    } else if (state === 'error') {
        statusIcon.textContent = '❌';
    }
}


// ============================================
// FONCTION : AFFICHER LES INFOS DE POSITION
// ============================================

/**
 * Affiche les coordonnées et informations dans le panneau d'info
 *
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} accuracy - Précision en mètres
 * @param {Date} timestamp - Date et heure de la position
 */
function displayPositionInfo(lat, lng, accuracy, timestamp) {
    // Afficher le panneau s'il est caché
    infoPanel.style.display = 'block';

    // Formater et afficher les valeurs
    latitudeEl.textContent = lat.toFixed(6);  // 6 décimales pour la précision
    longitudeEl.textContent = lng.toFixed(6);
    accuracyEl.textContent = Math.round(accuracy) + ' m';

    // Formater la date et l'heure
    const timeString = timestamp.toLocaleTimeString('fr-FR');
    timestampEl.textContent = timeString;
}


// ============================================
// FONCTION : METTRE À JOUR LE MARQUEUR
// ============================================

/**
 * Crée ou déplace le marqueur de l'utilisateur sur la carte
 *
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 */
function updateMapMarker(lat, lng) {
    if (userMarker === null) {
        // PREMIER APPEL : créer un nouveau marqueur
        userMarker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map);

        // Ajouter une popup au marqueur
        userMarker.bindPopup('<strong>📍 Vous êtes ici</strong><br>Position en temps réel');

        console.log('✨ Marqueur créé');
    } else {
        // APPELS SUIVANTS : déplacer le marqueur existant
        userMarker.setLatLng([lat, lng]);
        console.log('🔄 Marqueur mis à jour');
    }
}


// ============================================
// ÉCOUTEURS D'ÉVÉNEMENTS
// ============================================

// Clic sur le bouton "Démarrer le suivi"
startBtn.addEventListener('click', startTracking);

// Clic sur le bouton "Arrêter le suivi"
stopBtn.addEventListener('click', stopTracking);

// Arrêter proprement le suivi si l'utilisateur ferme ou quitte la page
window.addEventListener('beforeunload', () => {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        console.log('🧹 Suivi nettoyé avant fermeture de la page');
    }
});


// ============================================
// MESSAGE DE DÉMARRAGE
// ============================================

console.log('✅ Script chargé et prêt !');
console.log('💡 Cliquez sur "Démarrer le suivi" pour commencer');
