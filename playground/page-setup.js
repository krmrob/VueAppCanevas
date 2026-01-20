if (!window.authService.isConfigured) {
   document.getElementById('zone-connexion').hidden = true;
   document.getElementById('zone-configuration').hidden = false;
}

const btnConnexion = document.getElementById('connexion');
btnConnexion.addEventListener('click', () => {
   window.authService.login();
});
const btnDeconnexion = document.getElementById('deconnexion');
btnDeconnexion.addEventListener('click', () => {
   window.authService.logout();
});

(async () => {
   const loggedIn = await window.authService.getIsLoggedInAsync();
   btnConnexion.hidden = loggedIn;
   btnDeconnexion.hidden = !loggedIn;
})();

const langueInput = document.getElementById('langueInput');
langueInput.addEventListener('change', () => {
   document.documentElement.lang = langueInput.value;
});

(() => {
   const logZone = document.getElementById('logZone');

   window.logToScreen = (error, message) => {
      // eslint-disable-next-line no-console
      console.error(error);

      const template = document.createElement('template');
      let detail;
      if (error instanceof Error) {
         detail = error.stack;
      } else {
         detail = JSON.stringify(error, null, 2);
      }
      template.innerHTML = `<li>
         <p>${message}</p>
         <pre>${detail}</pre>
      </li>`;

      logZone.append(template.content);

      logZone.parentElement.scrollTo({ left: 0, top: logZone.scrollHeight, behavior: 'smooth' });
   };

   document.getElementById('clearLog').addEventListener('click', () => {
      logZone.innerHTML = '';
   });
})();
