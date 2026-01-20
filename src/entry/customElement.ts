// -----------------------------------
// Références pour les customs elements
// MDN : https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
// Using custom elements in vue : https://vuejs.org/guide/extras/web-components.html#using-custom-elements-in-vue
// Bonnes pratiques: https://web.dev/articles/custom-elements-best-practices
// -----------------------------------
import { appLoader } from '@entry/appLoader';
import type { AppProperties } from '@entry/appLoader';
// Simplement l'importer fait en sorte que ce soit dans style.css.'
import '@entry/customElementStyles.css';

type AttributeValue = string | null | undefined;
type FontConfig = { id: string; uri: string };

const elementName = 'mozaik-custom-element';

class MozaikElement extends HTMLElement {
   // Si on veut des font customs pour l'élément, on peut les ajouter ici.
   // Elle doivent avoir un id **unique** et l'uri pour la charger.
   // Le texte devrait utiliser la fonte de l'application parent, mais ça peut servir pour une fonte d'icône par exemple.
   // Les fontes seront ajoutées au <header> du document et ne sont donc pas scopée au custom element.
   #fonts: FontConfig[] = [];

   // Le map entre le *nomDePropriete* et *nom-de-attribut* pour les propriété qui peuvent être mappées sur des attributs.
   // Tout ce qui est type simple (string, number...) devrait être là
   // Les propriétés sont toujours en camelCase alors que les attributs sont toujours en kebab-case
   static readonly attrsPropsMap = [
      {
         attr: 'langue',
         prop: 'langue',
      },
      {
         attr: 'displayed-text',
         prop: 'displayedText',
      },
   ];

   // Les attributs observés doivent êtres dans ce tableau statique pour être appelé au attributeChangedCallback.
   // Par défaut on veut tout observer, mais on pourrait en exclure certains au besoin, ou ajouter des attributs de base.
   static readonly observedAttributes = MozaikElement.attrsPropsMap.map((m) => m.attr);

   // Les propriétés qui ne peuvent pas être mappés sur des attributs parce que ce ne sont pas des types simples.
   // Des fonctions, objets ou tableaux.
   // Elle *doivent* être définies ici, avec leur valeurs par défaut si nécessaire.
   #nonAttributeProps: { [key: string]: unknown } = {
      accessTokenGetter: undefined,
   };

   // Les propriétés réactives de l'application, une fois qu'elle sera montée.
   #props: AppProperties | undefined;

   // Le shadow root
   #root: ShadowRoot;

   #unmount: (() => void) | null = null;

   constructor() {
      super();

      this.#root = this.attachShadow({ mode: 'open' });
   }

   // --------------
   // Propriétés et attributs
   // --------------

   get langue() {
      return this.#getPropFromAttribute('langue');
   }

   set langue(value: AttributeValue) {
      this.#setPropToAttribute('langue', value);
   }

   get accessTokenGetter() {
      return this.#getNonAttributeProp('accessTokenGetter');
   }

   set accessTokenGetter(value: unknown) {
      this.#setNonAttributeProp('accessTokenGetter', value);
   }

   get displayedText() {
      return this.#getPropFromAttribute('displayedText');
   }

   set displayedText(value: AttributeValue) {
      this.#setPropToAttribute('displayedText', value);
   }

   // --------------
   // Lifecycle du custom element
   // La signature de ces fonctions doit être conforme à ce qui est attendu.
   // doc: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#lifecycle_callbacks
   // --------------

   async connectedCallback() {
      this.#loadAllFonts();

      this.#upgradeProperties();

      // Construire les options à partir des attributs et des propriétés du composant
      const options: { [key: string]: unknown } = {};

      for (const { prop, attr } of MozaikElement.attrsPropsMap) {
         options[prop] = this.getAttribute(attr);
      }

      for (const [prop, value] of Object.entries(this.#nonAttributeProps)) {
         options[prop] = value;
      }

      const { props, unmount, registerOnError } = await appLoader(this.#root, options);

      // Réassigner les valeurs au cas où elles auraient changées pendant le chargement de l'app.
      // À ce point-ci, comme on assigne à props, la réactivité va embarquer.
      for (const { prop, attr } of MozaikElement.attrsPropsMap) {
         props[prop] = this.getAttribute(attr);
      }

      for (const [prop, value] of Object.entries(this.#nonAttributeProps)) {
         props[prop] = value;
      }

      registerOnError((error, message) => this.#onError(error, message));

      this.#props = props;
      this.#unmount = unmount;
   }

   disconnectedCallback() {
      if (this.#unmount) {
         this.#unmount();
      }
      this.#unloadAllFonts();
   }

   attributeChangedCallback(name: string, _oldValue: AttributeValue, newValue: AttributeValue) {
      if (!this.#props) return;

      const map = MozaikElement.attrsPropsMap.find((m) => m.attr === name);

      if (map) {
         this.#props[map.prop] = newValue;
      }
   }

   // --------------
   // Utilitaires privés
   // --------------

   #onError(error: unknown, message: string | null | undefined) {
      message = message ?? undefined;
      const event = new ErrorEvent('error', {
         bubbles: false,
         cancelable: false,
         error,
         message,
      });

      this.dispatchEvent(event);
   }

   #upgradeProperties() {
      /* c8 ignore start [difficile à tester unitairement, mais le playground passe par là] */
      // Permet de conserver les valeurs de propriétés qui auraient été assignées avant que le custom élément
      // soit promu en MozaikElement, par exemple si ce script met du temps à se charger.

      const getAndDeleteProp = (propName: string) => {
         // @ts-expect-error TypeScript ne peut pas savoir si la propriété existe, mais c'est correct on gère.
         const value = this[propName];
         // @ts-expect-error  TypeScript ne peut pas savoir si la propriété existe, mais c'est correct on gère.
         delete this[propName];
         return value;
      };

      for (const prop of Object.keys(this.#nonAttributeProps)) {
         if (Object.prototype.hasOwnProperty.call(this, prop)) {
            const value = getAndDeleteProp(prop);
            this.#setNonAttributeProp(prop, value);
         }
      }
      /* c8 ignore stop */

      /* c8 ignore start [difficile à tester unitairement, mais le playground passe par là] */
      for (const { prop } of MozaikElement.attrsPropsMap) {
         if (Object.prototype.hasOwnProperty.call(this, prop)) {
            const value = getAndDeleteProp(prop);
            this.#setPropToAttribute(prop, value);
         }
      }
      /* c8 ignore stop */
   }

   #getPropFromAttribute(propName: string) {
      const attr = MozaikElement.attrsPropsMap.find((m) => m.prop === propName)!.attr;
      return this.getAttribute(attr);
   }

   #setPropToAttribute(propName: string, value: AttributeValue) {
      const attr = MozaikElement.attrsPropsMap.find((m) => m.prop === propName)!.attr;
      this.setAttribute(attr, value ?? '');
   }

   #getNonAttributeProp(name: string) {
      return this.#nonAttributeProps[name];
   }

   #setNonAttributeProp(name: string, value: unknown) {
      this.#nonAttributeProps[name] = value;
      if (this.#props) {
         this.#props[name] = value;
      }
   }

   /* c8 ignore start [Par défaut il n'y a pas de fonte sur le composant, les fonctions de chargement ne sont donct pas exécutées] */
   #loadAllFonts() {
      for (const { uri, id } of this.#fonts) {
         this.#loadFont(uri, id);
      }
   }

   #unloadAllFonts() {
      for (const { id } of this.#fonts) {
         const font = document.getElementById(id);
         if (font) {
            font.remove();
         }
      }
   }

   #loadFont(uri: string, id: string) {
      let font = document.getElementById(id) as HTMLLinkElement | null;
      if (font) {
         font.remove();
      }
      font = document.createElement('link');
      font.href = uri;
      font.id = id;
      font.rel = 'stylesheet';

      // NOTE: Pour ajouter une font custom, on doit l’ajouter au DOM de l’élément parent et non au shadow DOM.
      //       Référence: https://issues.chromium.org/issues/41085401
      document.head.appendChild(font);
   }
   /* c8 ignore stop */
}

customElements.define(elementName, MozaikElement);
