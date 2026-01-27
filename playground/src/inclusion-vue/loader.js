import { createApp } from 'vue';

import App from './App.vue';

window.loadVuePlayground = (element) => {
   const vueApp = createApp(App);

   vueApp.mount(element);
};
