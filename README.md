# Canevas de composant web

## Prérequis

### node

Les versions minimales requises de node et npm sont fixées dans le noeud `engine` du fichier package.json.

Il est **fortement** recommendé de gérer les différentes versions de node avec [nvm](https://github.com/coreybutler/nvm-windows/releases).

Installer nvm en suivant [la documentatation](https://github.com/coreybutler/nvm-windows?tab=readme-ov-file#installation--upgrades). Il est important de supprimer les versions existantes de node avant d'installer nvm.

Une fois nvm installé, exécuter le script `/script/useNodeVersion.ps1` pour installer la bonne version de node.

### Éditeur

L'éditeur privilégié est vscode, avec les extensions recommandées par le projet (voir le fichier `.vscode/extensions.json`). L'éditeur devrait proposer de les installer automatiquement à la première ouverture du projet.

Si un autre éditeur est utilisé, s'assurer qu'il respecte le fichier `.editorconfig`. Pour vscode, c'est l'extension editorconfig qui le prend en charge.

## Démarrage rapide

Une fois les prériques installés, exécuter ces commandes.

```cmd
# Installer les dépendances
npm ci

# Démarrer le playground
npm run playground
```

## Commandes

Les différentes sont détaillées dans le fichier [doc/commandes](/doc/commandes.md), notamment pour :

- [Exécuter les tests](./doc/commandes.md#exécuter-les-tests)
- [Analyser et formatter le code](./doc/commandes.md#analyse-du-code)

## Playground

Voir la [documentation du playground](/doc/playground.md)