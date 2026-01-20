export type AccessTokenGetterFunction = () => Promise<string> | string;
export type ErrorHandler = (error: unknown, message: string | null | undefined) => void | undefined;
export type PathBuilderConfiguration = {
   basePath: string;
   queryString?: string | null;
};

export interface AppSettings {
   readonly accessTokenGetter: AccessTokenGetterFunction;
   readonly errorHandler: ErrorHandler;
   readonly pathConfiguration: PathBuilderConfiguration;
}

// !!!!
// Les settings sont gardés dans un singletons
// C'est problématique si on veut avoir plusieurs instances d'un même composant en même temps.
// Des solutions possible existent
// - Utiliiser AsyncContext quand ce sera disponible (https://github.com/tc39/proposal-async-context)
// - Se service de l'application vue comme conteneur de dépendance avec provide/inject (voir la branche https://tfs.grics.qc.ca/tfs/grics/MozaikGrics/_git/VueAppCanevas?version=GBpoc%2Finjection-services)
// - Il y a sûrement d'autres solutions
// !!!!
let _appSettings: AppSettings | undefined = undefined;

export const configure = (appSettings: AppSettings) => {
   _appSettings = sanitizeAppSettings(appSettings);
};

export const getAppSettings = () => {
   return _appSettings!;
};

function sanitizeAppSettings(inputSettings: AppSettings): AppSettings {
   if (typeof inputSettings.accessTokenGetter !== 'function') throw new Error('accessTokenGetter doit être une fonction');

   const pathConfiguration = { ...inputSettings.pathConfiguration };
   if (pathConfiguration.basePath)
      if (!pathConfiguration.basePath.endsWith('/')) {
         pathConfiguration.basePath = `${pathConfiguration.basePath}/`;
      }

   return {
      ...inputSettings,
      pathConfiguration,
   };
}
