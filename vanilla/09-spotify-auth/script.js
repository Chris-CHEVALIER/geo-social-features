/* =========================================
   SPOTIFY OAUTH 2.0 PKCE - EXEMPLE PÉDAGOGIQUE
   =========================================

   Ce fichier implémente le flux complet OAuth 2.0 Authorization Code
   avec PKCE (Proof Key for Code Exchange) pour l'API Spotify.

   PKCE est OBLIGATOIRE pour les applications sans backend depuis 2021.

   ========================================= */

// ===========================
// CONFIGURATION
// ===========================

// L'URL de redirection DOIT correspondre exactement à celle déclarée
// dans les paramètres de l'application Spotify Dashboard
const REDIRECT_URI = window.location.origin + window.location.pathname;

// Les "scopes" définissent les permissions demandées à l'utilisateur
// Documentation complète : https://developer.spotify.com/documentation/web-api/concepts/scopes
const SCOPES = [
    'user-read-private',              // Lire les informations du profil utilisateur
    'user-read-email',                // Lire l'adresse email de l'utilisateur
    'user-read-currently-playing',    // Lire ce que l'utilisateur écoute actuellement
    'user-read-playback-state',       // Lire l'état de lecture (play/pause/etc.)
    'user-top-read'                   // Lire les artistes et morceaux préférés de l'utilisateur
].join(' '); // Les scopes doivent être joints en une seule chaîne séparée par des espaces

// Clés pour le stockage local (localStorage)
const STORAGE_KEYS = {
    CLIENT_ID: 'spotify_client_id',           // Le Client ID de l'application
    ACCESS_TOKEN: 'spotify_access_token',     // Le token d'accès reçu
    TOKEN_EXPIRY: 'spotify_token_expiry',     // Timestamp d'expiration du token
    CODE_VERIFIER: 'spotify_code_verifier'    // Le code_verifier PKCE (temporaire)
};

// ===========================
// RÉCUPÉRATION DES ÉLÉMENTS DOM
// ===========================

// Sections principales
const configSection = document.getElementById('config-section');
const loginSection = document.getElementById('login-section');
const profileSection = document.getElementById('profile-section');
const logsSection = document.getElementById('logs-section');
const tokenSection = document.getElementById('token-section');

// Inputs et boutons
const clientIdInput = document.getElementById('client-id-input');
const saveClientIdBtn = document.getElementById('save-client-id-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const redirectUriDisplay = document.getElementById('redirect-uri-display');

// Conteneurs de contenu
const logsContainer = document.getElementById('logs-container');
const profileImage = document.getElementById('profile-image');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profileId = document.getElementById('profile-id');
const profileCountry = document.getElementById('profile-country');
const profileProduct = document.getElementById('profile-product');

// Informations token
const tokenPreview = document.getElementById('token-preview');
const tokenType = document.getElementById('token-type');
const tokenExpiry = document.getElementById('token-expiry');
const tokenScopes = document.getElementById('token-scopes');

// Sections pour les nouvelles fonctionnalités
const currentlyPlayingSection = document.getElementById('currently-playing-section');
const currentlyPlayingContent = document.getElementById('currently-playing-content');
const topAlbumsSection = document.getElementById('top-albums-section');
const topAlbumsContent = document.getElementById('top-albums-content');

// ===========================
// INITIALISATION
// ===========================

/**
 * Point d'entrée principal - Appelé au chargement de la page
 */
function init() {
    log('Application initialisée');

    // Afficher l'URL de redirection à configurer dans Spotify Dashboard
    redirectUriDisplay.textContent = REDIRECT_URI;

    // Vérifier si un Client ID est déjà enregistré
    const savedClientId = localStorage.getItem(STORAGE_KEYS.CLIENT_ID);
    if (savedClientId) {
        clientIdInput.value = savedClientId;
        showLoginSection();
        log('Client ID trouvé dans le localStorage');
    }

    // Vérifier si on revient d'une authentification Spotify
    // Spotify renvoie un "code" dans l'URL après autorisation
    handleAuthorizationCallback();

    // Vérifier si un token valide existe déjà
    if (isAuthenticated()) {
        log('Token d\'accès valide trouvé');
        showProfileSection();
        loadUserProfile();
    }

    // Attacher les événements aux boutons
    attachEventListeners();
}

/**
 * Attache les gestionnaires d'événements aux éléments interactifs
 */
function attachEventListeners() {
    saveClientIdBtn.addEventListener('click', saveClientId);
    loginBtn.addEventListener('click', startAuthorizationFlow);
    logoutBtn.addEventListener('click', logout);
}

// ===========================
// GESTION DU CLIENT ID
// ===========================

/**
 * Enregistre le Client ID fourni par l'utilisateur dans le localStorage
 */
function saveClientId() {
    const clientId = clientIdInput.value.trim();

    if (!clientId) {
        alert('Veuillez entrer un Client ID valide');
        return;
    }

    // Vérifier que le Client ID a une longueur raisonnable (32 caractères pour Spotify)
    if (clientId.length !== 32) {
        alert('Le Client ID Spotify fait normalement 32 caractères. Vérifiez votre saisie.');
        return;
    }

    localStorage.setItem(STORAGE_KEYS.CLIENT_ID, clientId);
    log('Client ID enregistré : ' + clientId.substring(0, 8) + '...');

    showLoginSection();
}

// ===========================
// GÉNÉRATION PKCE
// ===========================

/**
 * Génère une chaîne aléatoire sécurisée pour le code_verifier PKCE
 *
 * Le code_verifier doit être :
 * - Une chaîne aléatoire de 43 à 128 caractères
 * - Composée uniquement de caractères alphanumériques, tirets, underscores, points et tildes
 *
 * @returns {string} Le code_verifier généré
 */
function generateCodeVerifier() {
    // Générer un tableau de 32 valeurs aléatoires (32 bytes = 256 bits)
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);

    // Convertir les bytes en chaîne base64 URL-safe
    // On utilise base64url pour respecter les contraintes de caractères PKCE
    const codeVerifier = base64URLEncode(randomBytes);

    log('Code verifier généré (longueur: ' + codeVerifier.length + ')');

    return codeVerifier;
}

/**
 * Génère le code_challenge à partir du code_verifier
 *
 * Le code_challenge est calculé en :
 * 1. Hashant le code_verifier avec SHA-256
 * 2. Encodant le hash en base64 URL-safe
 *
 * @param {string} codeVerifier - Le code_verifier à hasher
 * @returns {Promise<string>} Le code_challenge généré
 */
async function generateCodeChallenge(codeVerifier) {
    // Étape 1 : Convertir le code_verifier en ArrayBuffer (format binaire)
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);

    // Étape 2 : Calculer le hash SHA-256
    // SubtleCrypto.digest() est une API native du navigateur pour le hashing
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Étape 3 : Convertir le hash en base64 URL-safe
    const codeChallenge = base64URLEncode(new Uint8Array(hashBuffer));

    log('Code challenge généré avec SHA-256');

    return codeChallenge;
}

/**
 * Encode un ArrayBuffer ou Uint8Array en base64 URL-safe
 *
 * Base64 URL-safe remplace les caractères problématiques pour les URLs :
 * - '+' devient '-'
 * - '/' devient '_'
 * - Le padding '=' est supprimé
 *
 * @param {Uint8Array} buffer - Les données à encoder
 * @returns {string} La chaîne base64 URL-safe
 */
function base64URLEncode(buffer) {
    // Convertir le buffer en chaîne binaire
    let binary = '';
    for (let i = 0; i < buffer.length; i++) {
        binary += String.fromCharCode(buffer[i]);
    }

    // Encoder en base64 standard
    const base64 = btoa(binary);

    // Convertir en base64 URL-safe
    return base64
        .replace(/\+/g, '-')  // Remplacer + par -
        .replace(/\//g, '_')  // Remplacer / par _
        .replace(/=/g, '');   // Supprimer le padding =
}

// ===========================
// FLUX D'AUTORISATION OAUTH
// ===========================

/**
 * Démarre le flux d'autorisation OAuth 2.0 avec PKCE
 *
 * Étapes :
 * 1. Générer le code_verifier et le code_challenge
 * 2. Sauvegarder le code_verifier dans le localStorage (nécessaire pour l'échange)
 * 3. Construire l'URL d'autorisation Spotify
 * 4. Rediriger l'utilisateur vers Spotify
 */
async function startAuthorizationFlow() {
    const clientId = localStorage.getItem(STORAGE_KEYS.CLIENT_ID);

    if (!clientId) {
        alert('Client ID manquant. Veuillez le configurer d\'abord.');
        return;
    }

    log('Démarrage du flux d\'autorisation OAuth 2.0 PKCE');

    // Étape 1 : Générer le code_verifier (chaîne aléatoire)
    const codeVerifier = generateCodeVerifier();

    // Étape 2 : Générer le code_challenge (hash SHA-256 du code_verifier)
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Étape 3 : Sauvegarder le code_verifier pour l'utiliser après le retour
    // IMPORTANT : Le code_verifier ne doit JAMAIS être envoyé à Spotify maintenant,
    // il sera envoyé uniquement lors de l'échange du code contre le token
    localStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);
    log('Code verifier sauvegardé dans localStorage');

    // Étape 4 : Construire l'URL d'autorisation Spotify
    const authUrl = new URL('https://accounts.spotify.com/authorize');

    // Paramètres obligatoires pour OAuth 2.0 PKCE
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'code');  // IMPORTANT : 'code' et non 'token'
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('scope', SCOPES);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');  // SHA-256

    log('Redirection vers Spotify pour autorisation...');
    log('URL : ' + authUrl.toString().substring(0, 100) + '...');

    // Étape 5 : Rediriger l'utilisateur vers la page d'autorisation Spotify
    window.location.href = authUrl.toString();
}

/**
 * Gère le retour de l'autorisation Spotify
 *
 * Après autorisation, Spotify redirige vers notre page avec un "code" dans l'URL
 * Format : ?code=AQD...&state=xyz
 *
 * On doit ensuite échanger ce code contre un access_token
 */
async function handleAuthorizationCallback() {
    // Récupérer les paramètres de l'URL (query string)
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');
    const error = urlParams.get('error');

    // Vérifier si Spotify a renvoyé une erreur
    if (error) {
        log('Erreur d\'autorisation : ' + error);
        alert('Erreur d\'autorisation : ' + error);
        return;
    }

    // Si pas de code, l'utilisateur n'a pas encore autorisé
    if (!authorizationCode) {
        return;
    }

    log('Code d\'autorisation reçu : ' + authorizationCode.substring(0, 20) + '...');

    // Nettoyer l'URL pour plus de sécurité (enlever le code de l'URL)
    window.history.replaceState({}, document.title, window.location.pathname);

    // Échanger le code contre un access_token
    await exchangeCodeForToken(authorizationCode);
}

/**
 * Échange le code d'autorisation contre un access_token
 *
 * Cette requête est faite directement depuis le navigateur vers l'API Spotify.
 * En production, cette étape devrait être faite par un backend pour plus de sécurité.
 *
 * @param {string} code - Le code d'autorisation reçu de Spotify
 */
async function exchangeCodeForToken(code) {
    const clientId = localStorage.getItem(STORAGE_KEYS.CLIENT_ID);
    const codeVerifier = localStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);

    if (!codeVerifier) {
        log('Erreur : code_verifier introuvable');
        alert('Erreur : code_verifier manquant. Veuillez recommencer le processus.');
        return;
    }

    log('Échange du code contre un access_token...');

    // Construire le corps de la requête (format x-www-form-urlencoded)
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: clientId,
        code_verifier: codeVerifier  // IMPORTANT : On envoie le code_verifier maintenant
    });

    try {
        // Faire la requête POST vers l'endpoint /api/token de Spotify
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body.toString()
        });

        // Vérifier si la requête a réussi
        if (!response.ok) {
            const errorData = await response.json();
            log('Erreur lors de l\'échange : ' + errorData.error_description);
            throw new Error('Erreur lors de l\'échange du code : ' + errorData.error_description);
        }

        // Récupérer la réponse JSON contenant le token
        const data = await response.json();

        log('Access token reçu avec succès');
        log('Token expire dans : ' + data.expires_in + ' secondes');

        // Sauvegarder le token et sa date d'expiration
        const expiryTime = Date.now() + (data.expires_in * 1000);
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
        localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());

        // Nettoyer le code_verifier (plus besoin)
        localStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);

        // Afficher les informations du token
        displayTokenInfo(data);

        // Charger le profil utilisateur
        showProfileSection();
        loadUserProfile();

    } catch (error) {
        log('Erreur : ' + error.message);
        alert('Erreur lors de l\'authentification : ' + error.message);
    }
}

// ===========================
// APPELS À L'API SPOTIFY
// ===========================

/**
 * Vérifie si l'utilisateur est authentifié et si le token est encore valide
 *
 * @returns {boolean} true si authentifié, false sinon
 */
function isAuthenticated() {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

    if (!token || !expiry) {
        return false;
    }

    // Vérifier si le token n'a pas expiré
    if (Date.now() >= parseInt(expiry)) {
        log('Token expiré');
        logout();
        return false;
    }

    return true;
}

/**
 * Appelle l'endpoint /me de l'API Spotify pour récupérer le profil utilisateur
 */
async function loadUserProfile() {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (!token) {
        log('Erreur : pas de token d\'accès');
        return;
    }

    log('Récupération du profil utilisateur...');

    try {
        // Faire la requête GET vers l'API Spotify
        // Le token est passé dans l'en-tête Authorization
        const response = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token  // Format : "Bearer <token>"
            }
        });

        // Vérifier les erreurs HTTP
        if (!response.ok) {
            if (response.status === 401) {
                log('Token invalide ou expiré');
                logout();
                throw new Error('Session expirée. Veuillez vous reconnecter.');
            }
            throw new Error('Erreur API : ' + response.status);
        }

        // Récupérer les données JSON
        const userData = await response.json();

        log('Profil utilisateur récupéré : ' + userData.display_name);

        // Afficher les informations du profil
        displayUserProfile(userData);

    } catch (error) {
        log('Erreur : ' + error.message);
        alert('Erreur lors du chargement du profil : ' + error.message);
    }
}

/**
 * Récupère ce que l'utilisateur écoute actuellement sur Spotify
 *
 * Endpoint : GET https://api.spotify.com/v1/me/player/currently-playing
 *
 * Cette fonction gère trois cas possibles :
 * 1. L'utilisateur écoute une musique → afficher les détails
 * 2. L'utilisateur n'écoute rien → afficher un message approprié
 * 3. L'API renvoie 204 No Content → aucune donnée disponible
 */
async function fetchCurrentlyPlaying() {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (!token) {
        log('Erreur : pas de token d\'accès pour récupérer l\'écoute en cours');
        return;
    }

    log('Récupération de l\'écoute en cours...');

    try {
        // Appeler l'endpoint Spotify pour l'écoute actuelle
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        // Vérifier le code de statut HTTP
        if (response.status === 401) {
            log('Token invalide ou expiré lors de la récupération de l\'écoute en cours');
            logout();
            throw new Error('Session expirée. Veuillez vous reconnecter.');
        }

        // Si le statut est 204 (No Content), l'utilisateur n'écoute rien
        if (response.status === 204) {
            log('Aucune écoute en cours détectée (204 No Content)');
            displayNoCurrentlyPlaying();
            return;
        }

        // Vérifier les autres erreurs HTTP
        if (!response.ok) {
            throw new Error('Erreur API : ' + response.status);
        }

        // Récupérer les données JSON
        const data = await response.json();

        // Vérifier si l'utilisateur écoute quelque chose
        // Note : même avec un 200 OK, le champ "item" peut être null
        if (!data || !data.item) {
            log('Aucune écoute en cours (champ "item" vide)');
            displayNoCurrentlyPlaying();
            return;
        }

        log('Écoute en cours récupérée : ' + data.item.name);

        // Afficher les informations de la musique en cours
        displayCurrentlyPlaying(data);

    } catch (error) {
        log('Erreur lors de la récupération de l\'écoute en cours : ' + error.message);
        currentlyPlayingContent.innerHTML = '<p class="error-text">❌ Erreur : ' + error.message + '</p>';
    }
}

/**
 * Récupère les top tracks de l'utilisateur et en déduit les albums
 *
 * Endpoint : GET https://api.spotify.com/v1/me/top/tracks
 *
 * Cette fonction :
 * 1. Récupère les 5 tracks les plus écoutées (time_range=medium_term, environ 6 mois)
 * 2. Extrait les albums uniques de ces tracks
 * 3. Affiche les informations de chaque album (pochette, nom, artiste)
 */
async function fetchTopAlbums() {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (!token) {
        log('Erreur : pas de token d\'accès pour récupérer les top albums');
        return;
    }

    log('Récupération des top tracks pour déduire les albums...');

    try {
        // Appeler l'endpoint Spotify pour les top tracks
        // limit=5 : on demande 5 tracks seulement
        // time_range=medium_term : environ 6 mois de données (autres valeurs : short_term, long_term)
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=medium_term', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        // Vérifier le code de statut HTTP
        if (response.status === 401) {
            log('Token invalide ou expiré lors de la récupération des top tracks');
            logout();
            throw new Error('Session expirée. Veuillez vous reconnecter.');
        }

        // Vérifier les autres erreurs HTTP
        if (!response.ok) {
            throw new Error('Erreur API : ' + response.status);
        }

        // Récupérer les données JSON
        const data = await response.json();

        // Vérifier si on a bien des tracks
        if (!data.items || data.items.length === 0) {
            log('Aucune track trouvée dans les top tracks');
            topAlbumsContent.innerHTML = '<p class="info-text">Aucun historique d\'écoute disponible. Écoutez plus de musique pour voir vos albums favoris ici !</p>';
            return;
        }

        log('Top tracks récupérées : ' + data.items.length + ' tracks');

        // Extraire les albums uniques
        // On utilise un Map pour éviter les doublons (clé = album ID)
        const albumsMap = new Map();

        data.items.forEach(track => {
            // Chaque track contient un objet "album"
            const album = track.album;

            // Vérifier que l'album existe et qu'on ne l'a pas déjà ajouté
            if (album && !albumsMap.has(album.id)) {
                albumsMap.set(album.id, {
                    id: album.id,
                    name: album.name,
                    // Prendre l'image de taille moyenne (index 1), ou la première si pas d'autre
                    image: album.images && album.images.length > 0 ? album.images[1] || album.images[0] : null,
                    // Prendre le nom du premier artiste
                    artist: album.artists && album.artists.length > 0 ? album.artists[0].name : 'Artiste inconnu',
                    // URL externe pour ouvrir l'album sur Spotify
                    url: album.external_urls.spotify
                });
            }
        });

        // Convertir le Map en tableau
        const uniqueAlbums = Array.from(albumsMap.values());

        log('Albums uniques extraits : ' + uniqueAlbums.length);

        // Afficher les albums
        displayTopAlbums(uniqueAlbums);

    } catch (error) {
        log('Erreur lors de la récupération des top albums : ' + error.message);
        topAlbumsContent.innerHTML = '<p class="error-text">❌ Erreur : ' + error.message + '</p>';
    }
}

// ===========================
// AFFICHAGE DES DONNÉES
// ===========================

/**
 * Affiche les informations du profil utilisateur dans l'interface
 *
 * @param {Object} user - Les données utilisateur de l'API Spotify
 */
function displayUserProfile(user) {
    // Image de profil (ou placeholder si pas d'image)
    const imageUrl = user.images && user.images.length > 0
        ? user.images[0].url
        : 'https://via.placeholder.com/100?text=' + encodeURIComponent(user.display_name.charAt(0));

    profileImage.src = imageUrl;
    profileName.textContent = user.display_name;
    profileEmail.textContent = user.email || 'Non disponible';
    profileId.textContent = user.id;
    profileCountry.textContent = user.country || 'Non spécifié';
    profileProduct.textContent = user.product || 'Non spécifié';

    log('Profil affiché : ' + user.display_name);
}

/**
 * Affiche les informations de la musique en cours d'écoute
 *
 * @param {Object} data - Les données de l'écoute en cours retournées par l'API Spotify
 */
function displayCurrentlyPlaying(data) {
    const track = data.item;
    const isPlaying = data.is_playing;

    // Extraire les informations importantes
    const trackName = track.name;
    const artistName = track.artists.map(artist => artist.name).join(', ');
    const albumName = track.album.name;
    const albumImage = track.album.images && track.album.images.length > 0 ? track.album.images[0].url : '';
    const trackUrl = track.external_urls.spotify;

    // Construire le HTML pour afficher la musique en cours
    const html = `
        <div class="currently-playing-card">
            ${albumImage ? `<img src="${albumImage}" alt="Pochette de ${albumName}" class="album-cover">` : ''}
            <div class="track-info">
                <p class="track-status">${isPlaying ? '▶️ En lecture' : '⏸️ En pause'}</p>
                <h3 class="track-name"><a href="${trackUrl}" target="_blank">${trackName}</a></h3>
                <p class="track-artist">${artistName}</p>
                <p class="track-album">Album : ${albumName}</p>
            </div>
        </div>
    `;

    currentlyPlayingContent.innerHTML = html;
    log('Écoute en cours affichée : ' + trackName);
}

/**
 * Affiche un message quand l'utilisateur n'écoute rien
 */
function displayNoCurrentlyPlaying() {
    currentlyPlayingContent.innerHTML = `
        <p class="info-text">🎵 Aucune musique en cours de lecture.</p>
        <p class="info-text">Lancez Spotify et écoutez quelque chose, puis rechargez cette page !</p>
    `;
}

/**
 * Affiche la liste des albums les plus écoutés
 *
 * @param {Array} albums - Tableau d'objets album {id, name, image, artist, url}
 */
function displayTopAlbums(albums) {
    // Construire le HTML pour chaque album
    const albumsHtml = albums.map(album => {
        const imageUrl = album.image ? album.image.url : 'https://via.placeholder.com/150?text=Album';
        return `
            <div class="album-card">
                <a href="${album.url}" target="_blank">
                    <img src="${imageUrl}" alt="Pochette de ${album.name}" class="album-image">
                </a>
                <div class="album-info">
                    <h4 class="album-name"><a href="${album.url}" target="_blank">${album.name}</a></h4>
                    <p class="album-artist">${album.artist}</p>
                </div>
            </div>
        `;
    }).join('');

    topAlbumsContent.innerHTML = `<div class="albums-grid">${albumsHtml}</div>`;
    log('Top albums affichés : ' + albums.length + ' albums');
}

/**
 * Affiche les informations du token dans l'interface
 *
 * @param {Object} tokenData - Les données du token reçues de Spotify
 */
function displayTokenInfo(tokenData) {
    tokenSection.classList.remove('hidden');

    // Afficher les 10 premiers caractères du token (pour la sécurité)
    tokenPreview.textContent = tokenData.access_token.substring(0, 10) + '...';
    tokenType.textContent = tokenData.token_type;
    tokenExpiry.textContent = tokenData.expires_in;
    tokenScopes.textContent = tokenData.scope || SCOPES;
}

// ===========================
// GESTION DE L'INTERFACE
// ===========================

/**
 * Affiche la section de connexion (après avoir enregistré le Client ID)
 */
function showLoginSection() {
    configSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    profileSection.classList.add('hidden');
}

/**
 * Affiche la section du profil (après authentification réussie)
 */
function showProfileSection() {
    configSection.classList.add('hidden');
    loginSection.classList.add('hidden');
    profileSection.classList.remove('hidden');

    // Afficher les nouvelles sections
    currentlyPlayingSection.classList.remove('hidden');
    topAlbumsSection.classList.remove('hidden');

    // Charger les nouvelles données
    fetchCurrentlyPlaying();
    fetchTopAlbums();
}

/**
 * Déconnexion : supprime tous les tokens et réinitialise l'interface
 */
function logout() {
    log('Déconnexion de l\'utilisateur');

    // Supprimer toutes les données liées à l'authentification
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
    localStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);

    // Réinitialiser l'interface
    tokenSection.classList.add('hidden');
    currentlyPlayingSection.classList.add('hidden');
    topAlbumsSection.classList.add('hidden');
    showLoginSection();
}

// ===========================
// LOGS PÉDAGOGIQUES
// ===========================

/**
 * Ajoute un message dans la section des logs pédagogiques
 *
 * @param {string} message - Le message à afficher
 */
function log(message) {
    // Enlever le message "vide" si c'est le premier log
    const emptyLog = logsContainer.querySelector('.log-empty');
    if (emptyLog) {
        emptyLog.remove();
    }

    // Créer une nouvelle entrée de log
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';

    // Ajouter un timestamp
    const timestamp = new Date().toLocaleTimeString('fr-FR');
    logEntry.innerHTML = `<strong>[${timestamp}]</strong> ${message}`;

    // Ajouter au début de la liste (les logs les plus récents en haut)
    logsContainer.insertBefore(logEntry, logsContainer.firstChild);

    // Limiter à 50 logs maximum pour éviter de surcharger le DOM
    while (logsContainer.children.length > 50) {
        logsContainer.removeChild(logsContainer.lastChild);
    }

    // Aussi loguer dans la console pour le débogage
    console.log('[Spotify Auth]', message);
}

// ===========================
// LANCEMENT DE L'APPLICATION
// ===========================

// Attendre que le DOM soit complètement chargé avant d'initialiser
document.addEventListener('DOMContentLoaded', init);
