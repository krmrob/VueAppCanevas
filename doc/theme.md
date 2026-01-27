# Thème

Ce projet utilise [Vuetify](https://vuetifyjs.com/en/) comme librairie de composants.

**⚠️ À savoir**

- Le thème est manuellement ajouté via `/src/app/assets/css/theme.css` afin de pouvoir l’utiliser dans le _Shadow DOM_. Peut-être qu'une future version de vuetify rendra cette manipulation superflue, mais pour le moment elle est nécessaire.
- Le thème tel que défini dans ce repo repose sur le système de desing du gouvernement du Québec et a été mis en place dans le cadre du projet clic-école. Il est laissé tel quel à titre d'exemple seulement, le thème d'une application grics devant respecter ce que nos designers décideront.
- La présente documentation est tirée du composant de messagerie de clic-école et a été épurée pour garder l'essentiel. En cas de besoin on peut se référer à celle du composant de messagerie.

## Génération du thème

Comme mentionné plus haut, le thème doit être manuellement généré et importé afin de pouvoir être utilisé dans le _Shadow DOM_, qui est la racine du composant de messagerie.

1. Modifier les couleurs et variables dans `/src/app/bootstrap/vuetify/themes/custom.ts`;
2. Suivre les notes mentionnées dans `/src/app/bootstrap/vuetify/setup.ts` afin de remplacer `theme: false` et permettre la génération du thème;
3. Recompiler l’application;
4. Copier le style qui se trouve dans la balise `<style type="text/css" id="vuetify-theme-stylesheet">` de la page du _playground_.
5. Mettre à jour le contenu de `/src/app/assets/css/theme.scss` en suivant ces étapes :
   1. On doit conserver les `@use` dans le haut du fichier
   2. De ce qui a été généré à l'étape 4, on conserve seulement le contenu de `.v-theme--Custom` et les classe qui viennet à la suite.
   3. On garde le selecteur `:host` qui englobe ces définitions, il ne faut pas prendre le `:root` de l'étape 4.
   4. La comparaison avant/après devrait donner une bonne idée pour savoir si on a fait ça comme il faut.
6. S'assurer que la variable `--v-theme-overlay-multiplier: 1;` est toujours présente dans le fichier. Si elle n'est plus présente, il faut l'ajouter. Certains styles ne réagissent pas bien si la variable est manquante;

## Autres configurations

### Variables SASS

Il est aussi possible de définir des règles plus strictes avec les variables SASS. Ces règles peuvent être modifiées dans `/src/app/assets/css/vuetify.css` et seront appliquées au _build time_.

Pour en savoir plus : [SASS Variables](https://vuetifyjs.com/en/features/sass-variables/#installation)

Les variables qui peuvent être remplacées sont recherchables via la [documentation](https://vuetifyjs.com/en/features/sass-variables/#variable-api) ou directement dans le répertoire GitHub (i.e. [`Global`](https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/styles/settings/_variables.scss), [`VBtn`](https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/components/VBtn/_variables.scss), etc.).

### _Override de classes_

Et, finalement, pour des subtilités encore plus poussées, il est possible de viser une classe précise afin d’appliquer des changements. **Ce n’est pas une approche à privilégier, mais elle est parfois nécessaire.**

Exemple :

```css
// NOTE: `font-weight` pour un bouton `compact` est de 600 au lieu du 700 original
.v-btn--density-compact {
   .v-btn__content {
      font-weight: 600;
   }
```
