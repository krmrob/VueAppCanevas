declare module '*.json5' {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const value: any;

   export default value;
}

declare module '*.vue' {
   import type { DefineComponent } from 'vue';

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const component: DefineComponent<object, object, any>;

   export default component;
}
