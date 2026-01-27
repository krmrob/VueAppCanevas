/* c8 ignore start */
export interface LangueConfiguration {
   langue?: 'fr' | 'en';
}

export interface AuthentificationConfiguration {
   accessTokenGetter?: () => Promise<string>;
}

export interface ComponentProperties {
   displayedText?: string;
}

export interface AppConfiguration extends LangueConfiguration, AuthentificationConfiguration, ComponentProperties {}

// Cet objet permet de s'assurer d'avoir une proprité définie pour chaque option afin que la réactivité puisse les tracker.
export const defaults: AppConfiguration = {
   langue: undefined,
   accessTokenGetter: undefined,
   displayedText: undefined,
};
