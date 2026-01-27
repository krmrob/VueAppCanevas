import { createApp } from 'vue';

import setup from './setup';

jest.mock('@/core/services/logging', () => ({
   configure: jest.fn(),
}));

describe('errorHandling setup', () => {
   const component = {
      template: '<div />',
      setup() {},
   };

   it('registerOnError - tous les handlers sont appelés par le errorHandler de vue', () => {
      const app = createApp(component);
      const { registerOnError } = setup(app);

      const handler1 = jest.fn();
      const handler2 = jest.fn();
      registerOnError(handler1);
      registerOnError(handler2);

      const error = new Error('boom');
      const vueInfo = 'some vue info';
      app.config.errorHandler!(error, null, vueInfo);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler1).toHaveBeenCalledWith(error, vueInfo);

      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledWith(error, vueInfo);
   });

   it('registerOnError - tous les handlers sont appelés par le onError', () => {
      const app = createApp(component);
      const { registerOnError, onError } = setup(app);

      const handler1 = jest.fn();
      const handler2 = jest.fn();
      registerOnError(handler1);
      registerOnError(handler2);

      const error = new Error('boom');
      const message = 'test onError';
      onError(error, message);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler1).toHaveBeenCalledWith(error, message);

      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledWith(error, message);
   });

   it("onError - les handlers sont libérés quand l'application est umounted", async () => {
      const app = createApp(component);

      const { registerOnError, onError } = setup(app);

      const handler1 = jest.fn();
      const handler2 = jest.fn();
      registerOnError(handler1);
      registerOnError(handler2);

      await app.mount(document.createElement('div'));
      await app.unmount();

      onError!(new Error('boom'), 'message');

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
   });
});
