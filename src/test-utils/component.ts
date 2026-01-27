import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import type { Component } from 'vue';
import { createI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

interface MountComponentSettings {
   props?: object;
   slots?: object;
   shallow?: boolean;
}

type MountComponentCallbackFn = ({ wrapper }: { wrapper: VueWrapper<Component> }) => Promise<void>;

export const mountComponent = async (component: Component, settings: MountComponentSettings, testCallback: MountComponentCallbackFn) => {
   const i18n = createI18n({
      legacy: false,
      missing: () => {},
   });

   const baseComponentOptions = {
      global: {
         plugins: [createVuetify({ components, directives }), i18n],
      },
      shallow: settings.shallow,
   };

   const wrapper = mount(component, { ...baseComponentOptions, props: settings.props, slots: settings.slots });

   await testCallback({ wrapper });

   wrapper.unmount();
};
