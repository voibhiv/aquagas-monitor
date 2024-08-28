'use strict';
import config from 'config';
import { SetupServer } from './server';

(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get('App.port'));
    await server.init();
    server.start();
  } catch (error) {
    console.log('error on init the server', error);
  }
})();
