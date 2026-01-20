# Playground

Le playground est une page HTML (`./playground/index.html`) permettant de tester le composant.

Pour y accéder, démarrer le serveur de développement avec cette commande :

```cmd
npm run playground
```

La commande fait la même chose que `npm run watch`, en plus de démarrer le serveur de développement à l'adresse [http://localhost:7777](http://localhost:7777).

Si désiré, on peut démarrer le playground sur un host et/ou un port autre que celui par défaut. Par exemple, pour démarrer le serveur de dev sur `https://mon-nom-de-machine:5001` :

```cmd
npm run playground -- --host mon-nom-de-machine --port=5001
```

## Authentification dans le playground

Pour pouvoir utiliser l'authentification via le playground, il faut ajouter un fichier `.env` à la racine du projet avec les valeurs requises. Ce fichier sera ignoré par git puisque l'information qui s'y retrouve est contextuelle à chaque projet / environnement.

Les valeurs requises sont :

- `PLAYGROUND_CLIENT_ID` : Le client id de l'application à laquelle se connecter
- `PLAYGROUND_SERVICE_AUTH_URI` : L'url du service d'authentification (identity provider)
- `PLAYGROUND_SCOPE` : Les scopes à demander lors de la connexion.

Le fichier doit être complété _avant_ de démarrer la compilation. Les modifications à ce fichier ne seront pas observées par webpack avec la commande `npm run build:watch` ou `npm run playground`.

Exemple :

```text
PLAYGROUND_CLIENT_ID=mon-client-id
PLAYGROUND_SERVICE_AUTH_URI=https://mon-fournnisseur-d-identite.ca
PLAYGROUND_SCOPE=scopes requis separés par des espaces
```

L'application doit permettre le type d'autorisation **Native et basée sur le navigateur (Authorization code + PKCE)**.

**À noter que le rafraîchissement du jeton n'est pas implémenté dans le playground.**

## Utiliser le playground avec IIS

Si on désire configurer le playground dans IIS plutôt que d'utiliser le serveur de développement webpack, il suffit de :

- Créer un site web sur le port désiré, qui pointe sur le dossier `./playground`.
- Créer un répertoire virtuel sous ce même site web, nommé **lib**, qui pointe sur le dossier `./dist`.

On doit alors compiler manuellement le projet à l'aide des commandes `npm run build:dev`, `npm run build:watch` ou `npm run build:prod` selon nos besoins.
