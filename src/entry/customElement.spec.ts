import { appLoader } from '@entry/appLoader';
import { flushPromises } from '@vue/test-utils';

import '@entry/customElement';
import type { MozaikElementProps } from './MozaikElementProps';

jest.mock('@entry/appLoader', () => ({
   appLoader: jest.fn(),
}));
//
type CustomComponent = MozaikElementProps & HTMLElement;

describe('mozaik-custom-element', () => {
   let unmount: jest.Mock;
   let registerOnError: jest.Mock;
   beforeEach(() => {
      unmount = jest.fn();
      registerOnError = jest.fn();
      (appLoader as jest.Mock).mockResolvedValue({ props: {}, unmount, registerOnError });
   });

   describe.each([
      ['langue', 'langue'],
      ['displayed-text', 'displayedText'],
   ])('propriétés et attributs %s', (attrName, propName) => {
      it('les attributs sont réflétés dans les propriétés', async () => {
         const value = 'attribute value';

         document.body.innerHTML = `<div>
            <mozaik-custom-element id="component-under-test" ${attrName}="${value}"></mozaik-custom-element>
         </div>`;

         await flushPromises();

         const component = document.getElementById('component-under-test') as CustomComponent;

         // @ts-expect-error on sait que la propriété existe
         expect(component[propName]).toBe(value);
      });

      it('les propriétés sont réflétées dans les attributs', async () => {
         const value = 'prop value';

         document.body.innerHTML = `<div>
            <mozaik-custom-element id="component-under-test"></mozaik-custom-element>
         </div>`;

         await flushPromises();

         const component = document.getElementById('component-under-test') as CustomComponent;

         // @ts-expect-error on sait que la propriété existe
         component[propName] = value;

         expect(component.getAttribute(attrName)).toBe(value);
      });

      it.each([undefined, null])("les propriétés non définie sont réflétées en chaines vide sur l'attribue", async (value) => {
         document.body.innerHTML = `<div>
            <mozaik-custom-element id="component-under-test"></mozaik-custom-element>
         </div>`;

         await flushPromises();

         const component = document.getElementById('component-under-test') as CustomComponent;

         // @ts-expect-error le test est légitime
         component[propName] = value;

         expect(component.getAttribute(attrName)).toBe('');
      });
   });

   it('attribut et propriétés passées au appLoader', async () => {
      const langue = 'fr';
      const accessTokenGetter = () => Promise.resolve('token');
      const displayedText = 'hello';

      // On crée le component à la mitaine parce que accesTokenGetter ne peut pas être fixé par attribut
      // et on veut que tout soit up en partant.
      const component = document.createElement('mozaik-custom-element') as CustomComponent;
      component.setAttribute('id', 'component-under-test');
      component.setAttribute('langue', langue);
      component.setAttribute('displayed-text', displayedText);
      component.accessTokenGetter = accessTokenGetter;

      document.body.appendChild(component);

      await flushPromises();

      expect(appLoader).toHaveBeenCalledWith(expect.anything(), {
         langue,
         accessTokenGetter,
         displayedText,
      });
   });

   it('propriété sans pendant attribut - correctement créer et récupérée', async () => {
      const accessTokenGetter = jest.fn();

      const component = document.createElement('mozaik-custom-element') as CustomComponent;
      component.accessTokenGetter = accessTokenGetter;

      document.body.appendChild(component);

      await flushPromises();

      expect(component.accessTokenGetter).toBe(accessTokenGetter);
   });

   it('propriété sans pendant attribut assignée après que le component soit connecté - correctement créer et récupérée', async () => {
      const accessTokenGetter = jest.fn();

      const component = document.createElement('mozaik-custom-element') as CustomComponent;
      document.body.appendChild(component);

      await flushPromises();

      component.accessTokenGetter = accessTokenGetter;

      expect(component.accessTokenGetter).toBe(accessTokenGetter);
   });

   it('élement créé, retiré et rajouté - application unmounted et recrée', async () => {
      const langue = 'fr';

      document.body.innerHTML = `<div id="wrapper">
         <mozaik-custom-element id="component-under-test" langue="${langue}"></mozaik-custom-element>
      </div>`;

      await flushPromises();

      expect(appLoader).toHaveBeenCalledTimes(1);
      (appLoader as jest.Mock).mockClear();

      const component = document.getElementById('component-under-test') as CustomComponent;

      component.remove();
      await flushPromises();
      expect(unmount).toHaveBeenCalledTimes(1);

      const wrapper = document.getElementById('wrapper') as HTMLElement;
      wrapper.appendChild(component);

      expect(appLoader).toHaveBeenCalledTimes(1);
   });

   it.each(['message custom', null, undefined])("S'enregistre pour émettre un évenement en cas d'erreur", async (message) => {
      let onErrorHandler: (errror: any, detail: any) => void;
      registerOnError.mockImplementation((handler) => {
         onErrorHandler = handler;
      });

      const component = document.createElement('mozaik-custom-element') as CustomComponent;
      component.langue = 'fr';
      component.accessTokenGetter = () => Promise.resolve('token');

      document.body.appendChild(component);

      await flushPromises();

      expect(registerOnError).toHaveBeenCalledTimes(1);

      const eventListener = jest.fn();
      component.addEventListener('error', eventListener);

      const error = new Error('boom');

      onErrorHandler!(error, message);

      const expectedMessage = message ?? '';
      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(
         expect.objectContaining({
            error,
            message: expectedMessage,
         }),
      );
   });
});
