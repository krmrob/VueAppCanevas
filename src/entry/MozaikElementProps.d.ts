/* c8 ignore start [Types seulement] */

export interface MozaikElementProps {
   langue?: 'fr' | 'en';
   accessTokenGetter?: () => Promise<string>;
   displayedText?: string;
}
