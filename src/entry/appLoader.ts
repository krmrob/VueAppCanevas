/* c8 ignore start [Types seulement] */

import type { MozaikElementProps } from './MozaikElementProps';
import buildFilePath from './buildFilePath';

// On utilise pas directement le type retourné par le bootstrap de l'app afin de rendre plus facile l'utilisation par customElement.
// Ça va éviter des ts-expect-error, et ça permettra de détecter les bris de contrat.
// Ce fichier est le seul sous /entry qui connait l'application
export type AppProperties = { [key: string]: unknown };
type AppControl = {
   props: AppProperties;
   unmount: () => void;
   registerOnError: (callback: (error: unknown, message: string | null | undefined) => void) => void;
};

export const appLoader: (root: Node, componentOptions: MozaikElementProps) => Promise<AppControl> = async (
   root: Node,
   componentOptions: MozaikElementProps,
) => {
   appendStyle(root, 'styles.css');

   const container = document.createElement('div');
   root.appendChild(container);

   const fakePath = buildFilePath('|');
   const [basePath, queryString] = fakePath.split('|');

   const { bootstrap } = await import('@/bootstrap');
   const { props, unmount, registerOnError } = bootstrap(container, { basePath, queryString }, componentOptions);

   return { props, unmount, registerOnError };
};

function appendStyle(root: Node, file: string) {
   const styleElement = document.createElement('link');
   styleElement.setAttribute('rel', 'stylesheet');
   styleElement.setAttribute('href', buildFilePath(file)); // Le nom du fichier css est défini dans webpack.config.
   root.appendChild(styleElement);
}
