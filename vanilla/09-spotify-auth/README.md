# 🎵 Spotify OAuth 2.0 PKCE - Exemple Pédagogique

## 📚 Objectif pédagogique

Ce projet est un **exemple pédagogique** destiné à comprendre le fonctionnement complet de l'authentification **OAuth 2.0 avec PKCE** (Proof Key for Code Exchange), sans backend, en HTML/CSS/JavaScript vanilla uniquement.

### Compétences visées

- Comprendre le protocole OAuth 2.0
- Maîtriser le flux Authorization Code avec PKCE
- Savoir générer un code_verifier et un code_challenge
- Faire des appels API REST authentifiés
- Manipuler les APIs natives du navigateur (Crypto API, Fetch API)

---

## ⚠️ AVERTISSEMENT IMPORTANT

### Ce projet N'EST PAS destiné à la production

**Pourquoi ?**

1. **Exposition du Client ID** : Le Client ID est visible côté client (localStorage)
2. **Pas de Client Secret** : PKCE permet d'éviter le secret, mais limite la sécurité
3. **Token dans le localStorage** : Vulnérable aux attaques XSS
4. **Pas de refresh token** : L'utilisateur doit se reconnecter après expiration
5. **CORS limité** : Dépend de la politique CORS de Spotify

### Pour une application en production

Vous devriez :
- **Utiliser un backend** pour sécuriser le Client Secret
- **Implémenter le refresh token** pour renouveler automatiquement l'accès
- **Stocker les tokens dans des cookies HttpOnly** pour éviter les attaques XSS
- **Ajouter un système de validation** et de gestion d'erreurs robuste
- **Utiliser HTTPS** obligatoirement
- **Implémenter le paramètre `state`** pour prévenir les attaques CSRF

---

## 🎯 Fonctionnalités

Cette application permet de :

1. Configurer un Client ID Spotify
2. Se connecter via OAuth 2.0 avec PKCE
3. Afficher le profil utilisateur (nom, email, pays, type de compte)
4. Voir les logs techniques détaillés du processus
5. Consulter les informations sur le token reçu

---

## 🚀 Comment tester ?

### Prérequis

- Un compte Spotify (gratuit ou premium)
- Un serveur local (Python, Node.js, ou Live Server VS Code)

### Étape 1 : Créer une application Spotify

1. Allez sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Connectez-vous avec votre compte Spotify
3. Cliquez sur **"Create app"**
4. Remplissez les informations :
   - **App name** : `Mon App Test OAuth`
   - **App description** : `Test pédagogique OAuth 2.0 PKCE`
   - **Redirect URI** : L'URL complète de votre page (voir étape 2)
   - **API** : Cochez "Web API"
5. Acceptez les conditions et cliquez sur **"Save"**
6. Dans les paramètres de l'app, copiez le **Client ID** (32 caractères)

### Étape 2 : Lancer l'application localement

#### Option 1 : Avec Python

```bash
# Dans le dossier du projet
python3 -m http.server 8000
```

Puis ouvrez : `http://localhost:8000/vanilla/09-spotify-auth/index.html`

**Redirect URI à configurer dans Spotify** :
```
http://localhost:8000/vanilla/09-spotify-auth/index.html
```

#### Option 2 : Avec Node.js (http-server)

```bash
npx http-server -p 8000
```

#### Option 3 : Avec VS Code Live Server

1. Installez l'extension "Live Server"
2. Clic droit sur `index.html` → "Open with Live Server"
3. Notez l'URL (ex: `http://127.0.0.1:5500/vanilla/09-spotify-auth/index.html`)

**Redirect URI à configurer dans Spotify** :
```
http://127.0.0.1:5500/vanilla/09-spotify-auth/index.html
```

### Étape 3 : Configurer l'application

1. Ouvrez l'application dans votre navigateur
2. Collez votre **Client ID** dans le champ prévu
3. Copiez l'URL de redirection affichée
4. Retournez sur Spotify Dashboard → Paramètres de votre app → "Redirect URIs"
5. Collez l'URL de redirection et cliquez sur **"Add"** puis **"Save"**

### Étape 4 : Tester l'authentification

1. Cliquez sur **"Se connecter à Spotify"**
2. Autorisez l'accès sur la page Spotify
3. Vous serez redirigé vers l'application avec vos informations de profil

---

## 🧠 Comprendre OAuth 2.0 et PKCE

### Qu'est-ce qu'OAuth 2.0 ?

**OAuth 2.0** est un protocole d'autorisation standard qui permet à une application d'accéder aux ressources d'un utilisateur **sans connaître son mot de passe**.

### Pourquoi PKCE ?

**PKCE** (Proof Key for Code Exchange, prononcé "pixie") a été créé pour sécuriser les applications **publiques** (applications mobiles, SPA, applications sans backend).

#### Problème du flux classique

Dans le flux "Authorization Code" classique :
1. L'utilisateur autorise l'app
2. Spotify renvoie un **code**
3. L'app échange le code contre un token **en utilisant un Client Secret**

**Problème** : Les applications publiques ne peuvent pas stocker de secret de manière sécurisée.

#### Solution : PKCE

PKCE résout ce problème en remplaçant le Client Secret par une **preuve cryptographique** :

1. L'app génère un **code_verifier** (chaîne aléatoire)
2. L'app calcule un **code_challenge** (hash SHA-256 du code_verifier)
3. L'app envoie le **code_challenge** à Spotify lors de la demande d'autorisation
4. Spotify renvoie un **code**
5. L'app envoie le **code** + le **code_verifier** pour obtenir le token
6. Spotify vérifie que le hash du code_verifier correspond au code_challenge initial

**Avantage** : Même si un attaquant intercepte le code, il ne peut pas l'échanger sans le code_verifier.

---

## 📊 Schéma du flux OAuth 2.0 PKCE

```
+----------+                                       +---------------+
|          |                                       |               |
| Utilisateur                                      |    Spotify    |
|  (You)   |                                       |   (API OAuth) |
|          |                                       |               |
+----+-----+                                       +-------+-------+
     |                                                     |
     |  1. Clique sur "Se connecter"                      |
     |                                                     |
+----v-----+                                               |
|          |  2. Génère code_verifier (aléatoire)         |
|  App JS  |                                               |
|          |  3. Calcule code_challenge = SHA256(code_verifier)
+----+-----+                                               |
     |                                                     |
     |  4. Redirige vers Spotify avec code_challenge      |
     +---------------------------------------------------->+
     |                                                     |
     |  5. Page d'autorisation Spotify                    |
     |  (Utilisateur accepte)                             |
     |                                                     |
     |  6. Redirect vers app avec "code"                  |
     +<----------------------------------------------------+
     |                                                     |
+----v-----+                                               |
|          |  7. Récupère le "code" depuis l'URL          |
|  App JS  |                                               |
|          |  8. POST /api/token avec :                   |
|          |     - code                                    |
|          |     - code_verifier                           |
+----+-----+     - client_id                               |
     |           - redirect_uri                            |
     +---------------------------------------------------->+
     |                                                     |
     |  9. Spotify vérifie :                              |
     |     SHA256(code_verifier) == code_challenge ?      |
     |                                                     |
     |  10. Renvoie access_token + expires_in             |
     +<----------------------------------------------------+
     |                                                     |
+----v-----+                                               |
|          |  11. Sauvegarde token dans localStorage      |
|  App JS  |                                               |
|          |  12. Appelle /v1/me avec token               |
+----+-----+                                               |
     |                                                     |
     +---------------------------------------------------->+
     |                                                     |
     |  13. Renvoie les données utilisateur               |
     +<----------------------------------------------------+
     |                                                     |
     |  14. Affiche le profil                             |
     |                                                     |
```

---

## 📂 Structure des fichiers

```
vanilla/09-spotify-auth/
├── index.html    # Structure HTML avec sections config, login, profil
├── style.css     # Styles inspirés de Spotify (dark theme)
├── script.js     # Logique OAuth PKCE complète
└── README.md     # Ce fichier (documentation pédagogique)
```

---

## 🔍 Points d'attention dans le code

### 1. Génération du code_verifier

**Fichier** : `script.js`, ligne ~153

```javascript
function generateCodeVerifier() {
    // Générer 32 bytes aléatoires (256 bits de sécurité)
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);

    // Encoder en base64 URL-safe (43 caractères)
    return base64URLEncode(randomBytes);
}
```

**Explication** :
- On utilise `crypto.getRandomValues()` pour une génération cryptographiquement sécurisée
- 32 bytes = 256 bits (niveau de sécurité équivalent à AES-256)
- Le résultat est encodé en base64 URL-safe (caractères `-_` au lieu de `+/`)

### 2. Génération du code_challenge

**Fichier** : `script.js`, ligne ~177

```javascript
async function generateCodeChallenge(codeVerifier) {
    // Convertir le code_verifier en bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);

    // Calculer le hash SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Encoder en base64 URL-safe
    return base64URLEncode(new Uint8Array(hashBuffer));
}
```

**Explication** :
- `crypto.subtle.digest()` est l'API native pour calculer des hashs
- SHA-256 produit un hash de 256 bits (32 bytes)
- Le hash est ensuite encodé en base64 URL-safe

### 3. Encodage base64 URL-safe

**Fichier** : `script.js`, ligne ~205

```javascript
function base64URLEncode(buffer) {
    let binary = '';
    for (let i = 0; i < buffer.length; i++) {
        binary += String.fromCharCode(buffer[i]);
    }

    const base64 = btoa(binary);

    return base64
        .replace(/\+/g, '-')  // + devient -
        .replace(/\//g, '_')  // / devient _
        .replace(/=/g, '');   // Supprimer padding =
}
```

**Explication** :
- `btoa()` encode en base64 standard
- Les caractères `+` et `/` posent problème dans les URLs
- Le padding `=` est optionnel pour base64url

### 4. Redirection vers Spotify

**Fichier** : `script.js`, ligne ~235

```javascript
async function startAuthorizationFlow() {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // IMPORTANT : Sauvegarder le code_verifier pour plus tard
    localStorage.setItem('spotify_code_verifier', codeVerifier);

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'code');  // Pas 'token' !
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('scope', SCOPES);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');  // SHA-256

    window.location.href = authUrl.toString();
}
```

**Points clés** :
- `response_type=code` : on demande un code, pas un token
- `code_challenge` : le hash SHA-256 du code_verifier
- `code_challenge_method=S256` : indique qu'on utilise SHA-256
- Le `code_verifier` reste stocké localement (jamais envoyé maintenant)

### 5. Échange du code contre un token

**Fichier** : `script.js`, ligne ~318

```javascript
async function exchangeCodeForToken(code) {
    const codeVerifier = localStorage.getItem('spotify_code_verifier');

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: clientId,
        code_verifier: codeVerifier  // Envoyé maintenant !
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
    });

    const data = await response.json();
    // data contient : { access_token, token_type, expires_in, scope }
}
```

**Points clés** :
- `grant_type=authorization_code` : flux Authorization Code
- `code_verifier` : Spotify va vérifier que `SHA256(code_verifier) == code_challenge`
- Pas de `client_secret` nécessaire grâce à PKCE
- Le format est `application/x-www-form-urlencoded` (pas JSON)

### 6. Appel API avec le token

**Fichier** : `script.js`, ligne ~413

```javascript
async function loadUserProfile() {
    const token = localStorage.getItem('spotify_access_token');

    const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token  // Format Bearer
        }
    });

    const userData = await response.json();
    // userData contient : { display_name, email, id, country, product, ... }
}
```

**Points clés** :
- Le token est passé dans l'en-tête `Authorization`
- Format : `Bearer <token>` (avec un espace)
- Si le token est invalide, l'API renvoie un 401 Unauthorized

---

## 🆚 Comparaison : Implicit Grant vs PKCE

### Ancien flux : Implicit Grant (DÉPRÉCIÉ)

```javascript
// URL d'autorisation
authUrl.searchParams.append('response_type', 'token');  // ❌ Token direct

// Spotify renvoie directement le token dans l'URL
// Exemple : https://app.com/#access_token=BQC...
```

**Problèmes** :
- Le token transite par l'URL (visible dans l'historique)
- Pas de refresh token possible
- Vulnérable aux attaques par interception

### Nouveau flux : Authorization Code avec PKCE (RECOMMANDÉ)

```javascript
// URL d'autorisation
authUrl.searchParams.append('response_type', 'code');  // ✅ Code temporaire
authUrl.searchParams.append('code_challenge', codeChallenge);
authUrl.searchParams.append('code_challenge_method', 'S256');

// Spotify renvoie un code temporaire
// Exemple : https://app.com/?code=AQD...

// On échange le code contre un token (avec le code_verifier)
```

**Avantages** :
- Le token ne transite jamais par l'URL
- Le code est à usage unique et temporaire (10 minutes)
- Protection contre les attaques par interception
- Possibilité d'obtenir un refresh token (pas implémenté ici)

---

## 🔐 Pourquoi `response_type=token` ne fonctionne plus

Depuis 2021, Spotify (et la plupart des fournisseurs OAuth) ont **désactivé le flux Implicit Grant** (`response_type=token`) pour des raisons de sécurité.

### Raisons

1. **Exposition du token** : Le token apparaît dans l'URL (fragment `#access_token=...`)
2. **Historique du navigateur** : Le token peut être visible dans l'historique
3. **Logs serveur** : Les proxies peuvent loguer les URLs
4. **Pas de refresh** : Impossible d'obtenir un refresh token
5. **Norme OAuth 2.1** : Le nouveau standard OAuth 2.1 supprime complètement l'Implicit Grant

### Migration vers PKCE

**Avant (Implicit Grant)** :
```javascript
response_type: 'token'
// Renvoie directement : #access_token=...
```

**Après (PKCE)** :
```javascript
response_type: 'code'
code_challenge: SHA256(code_verifier)
// Renvoie : ?code=AQD...
// Puis on échange le code contre un token
```

---

## 📖 Ressources complémentaires

### Documentation officielle

- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Spotify Authorization Guide](https://developer.spotify.com/documentation/web-api/concepts/authorization)
- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)
- [PKCE RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636)
- [OAuth 2.0 for Browser-Based Apps (Draft)](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps)

### Tutoriels et articles

- [OAuth 2.0 Simplified](https://www.oauth.com/)
- [PKCE Explained](https://oauth.net/2/pkce/)
- [MDN - SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

### Concepts clés à approfondir

- **JWT (JSON Web Tokens)** : format standard pour les tokens
- **CORS** : Cross-Origin Resource Sharing
- **XSS** : Cross-Site Scripting (attaques)
- **CSRF** : Cross-Site Request Forgery (attaques)
- **Refresh tokens** : renouveler l'accès sans redemander l'autorisation

---

## 🛠️ Exercices pour aller plus loin

1. **Ajouter un timer** affichant le temps restant avant expiration du token
2. **Implémenter le paramètre `state`** pour prévenir les attaques CSRF
3. **Ajouter plus de scopes** et afficher d'autres données (artistes préférés, playlists)
4. **Créer un backend** (Node.js/Express) pour gérer le Client Secret
5. **Implémenter le refresh token** pour renouveler automatiquement l'accès
6. **Ajouter une gestion d'erreurs** plus robuste (erreurs réseau, token invalide, etc.)

---

## ❓ FAQ

### Pourquoi le token expire-t-il après 1 heure ?

Pour limiter les dégâts en cas de vol du token. Un attaquant ne pourra l'utiliser que pendant 1 heure maximum.

### Peut-on utiliser ce code en production ?

**Non**. Ce code expose le Client ID côté client et stocke le token dans le localStorage (vulnérable aux XSS). En production, utilisez un backend.

### Que faire si j'ai l'erreur "Invalid redirect URI" ?

Vérifiez que l'URL dans les paramètres Spotify correspond **exactement** à l'URL de votre page (même protocole, port, chemin).

### Pourquoi PKCE est-il nécessaire ?

PKCE protège contre les attaques par interception du code d'autorisation. Sans PKCE, un attaquant pourrait voler le code et l'échanger contre un token.

### Comment obtenir un refresh token ?

Ajoutez le scope `offline_access` dans certaines APIs (pas Spotify). Le refresh token permet de renouveler l'access token sans redemander l'autorisation.

### Puis-je utiliser ce flux pour d'autres APIs ?

Oui ! La plupart des APIs OAuth 2.0 modernes (Google, GitHub, Microsoft, etc.) supportent PKCE. Adaptez les URLs et les scopes.

---

## 📝 Licence

Ce code est fourni à des fins **pédagogiques uniquement**. Libre de modification et d'utilisation pour l'apprentissage.

---

**Bon apprentissage ! 🚀**

**N'oubliez pas** : Ce projet est un outil d'apprentissage. Pour une application réelle, utilisez un backend sécurisé et suivez les meilleures pratiques de sécurité OAuth 2.0.
