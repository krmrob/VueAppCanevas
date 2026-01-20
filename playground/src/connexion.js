/* global process */
import { UserManager } from 'oidc-client-ts';

const clientId = process.playground.CLIENT_ID;
const authority = process.playground.SERVICE_AUTH_URI;
const scope = process.playground.SCOPE;

let redirectUri = document.location.href;
if (redirectUri.endsWith('/')) {
   redirectUri = redirectUri.substring(0, redirectUri.length - 1);
}

const settings = {
   authority,
   client_id: clientId,
   redirect_uri: redirectUri,
   silent_redirect_uri: redirectUri,
   post_logout_redirect_uri: redirectUri,
   response_type: 'code',
   scope,
};

const callbackSymbol = Symbol('auth callback');

class AuthService {
   #userManager;
   #callbackPromise;
   #callbackResolve;

   constructor() {
      this.#callbackPromise = new Promise((resolve) => {
         this.#callbackResolve = resolve;
      });
      this.#userManager = new UserManager(settings);
   }

   get isConfigured() {
      return clientId !== '' && authority !== '' && scope !== '';
   }

   login() {
      this.#userManager.signinRedirect();
   }

   logout() {
      this.#userManager.signoutRedirect();
   }

   async getIsLoggedInAsync() {
      await this.#callbackPromise;
      const user = await this.#userManager.getUser();
      return !!user;
   }

   async getAccessTokenAsync() {
      const user = await this.#userManager.getUser();
      if (user) {
         return user.access_token;
      }
      return null;
   }

   async [callbackSymbol]() {
      const qs = window.location.search;
      const params = new URLSearchParams(qs);
      const code = params.get('code');

      if (code) {
         await this.#userManager.signinCallback();
         history.replaceState({}, null, '/');
      }

      this.#callbackResolve();
   }
}

const authService = new AuthService();

authService[callbackSymbol]();

window.authService = authService;
