/* c8 ignore start */

// Cette vérification doit se faire à l'extérieur de la fonction, afin
// de s'exécuter seulement au chargement initial du script.
// C'est le seul moment où document.currentScript est accessible
const currentScript = document.currentScript as HTMLScriptElement;
if (currentScript.tagName.toUpperCase() !== 'SCRIPT') {
   /**
    * Prévenir le cas où un html malicieux aurait pu être injecté et rendre le widget vulnérable aux attaques XSS
    * <img name="currentScript" src="https://malicious.server/">
    * Si c'est un tag <script> qui a été injecté, le site est déjà vulnérable.
    */
   throw new Error('La page semble compromise');
}

export default function buildFilePath(file: string) {
   const currentURL = new URL(currentScript.src);
   const host = currentURL.host;

   let path = currentURL.pathname;
   const lastPartsIndex = path.lastIndexOf('/');
   path = path.substring(0, lastPartsIndex);

   // On va repasser la même chaine après le ? que le script actuel
   // afin de permettre la gestion de cache avec exemple `?v=build_version`
   const search = currentURL.search;

   return `//${host}${path}/${file}${search}`;
}
