# Différentes commandes disponibles

## Installer les dépendances

Installer les dépendances avec cette commande :

```cmd
npm ci
```

## Compiler

Pour compiler en développement

```cmd
npm run build:dev
```

Pour compiler en dev avec monitorage des changements aux fichiers :

```cmd
npm run build:watch
```

Pour compiler en production :

```cmd
npm run build:prod
```

## Analyse du code

### eslint

[eslint](https://eslint.org/) perment d'analyse le code pour prévenir certaines mauvaises pratiques.

Les erreurs devraient apparaître automatiquement dans votre éditeur, mais on peut aussi exécuter l'analyse via les commandes npm.

Pour exéctuer eslint sur le projet :

```cmd
npm run lint
```

Pour exécuter eslint sur le projet et appliquer les corrections automatiques :

```cmd
npm run lint:fix
```

Note : En cas de problème, dans vscode, on peut redémarrer le serveur eslint en appuyant sur F1, puis choiser « Restart ESLint Server »

### TypeScript

Les erreurs de types devrait apparaître automatiquement dans votre éditeur, mais on peut aussi faire la vérification via les commandes npm.

Pour exécuter la vérification des types :

```cmd
npm run check-typing
```

Pour exécuter la vérification des types en mode watch :

```cmd
npm run check-typing:watch
```

Note : En cas de problème, dans vscode, on peut redémarrer le serveur TypeScript en appuyant sur F1, puis choiser « Restart TS Server »

### prettier

[Prettier](https://prettier.io/) est là pour s'assurer que le code est formatter de façon uniforme dans la solution.

Pour exécuter prettier et afficher les fichiers mal formatter :

```cmd
npm run format
```

Pour exécuter prettier et **corriger** les fichiers mal formatter :

```cmd
npm run format:fix
```

Pour que prettier formatte automatiquement vos fichiers à la sauvegarde :

```cmd
npm run format:watch
```

## Exécuter les tests

```cmd
# exécute tous les tests
npm run test

# Exécute tous les tests qui répondent au critère (nom complet/partiel dossiers et/ou fichiers)
npm run test <critère de recherche>
```

Pour exécuter les test unitaires avec monitoring des changements aux fichiers :

```cmd
# exécute seulement les tests relatifs aux fichiers modifiés
npm run test:watch

# exécute tous les tests de la solution
npm run test:watch-all
```

Pour exécuter les tests unitaires et générer le rapport couverture de code :

```cmd
npm run test:coverage
```

Pour ouvrir le rapport de couverture de code :

```cmd
npm run test:open-report
```

En cas d'erreur il est parfois utile de nettoyer le cache de jest

```cmd
npm run test:clear-cache
```
