/**
 * The mocked data in this module will be used on the client when a developer sets the MOCK
 * environment variable in their process to mocks/default before starting the server.
 */

/* eslint no-console: 0 */

import Reng from 'redux';

Reng.Page.setConfig({

  http: {
    request: {

      // all unmocked calls result in an error
      '*': (opts) => {
        throw new Error(`Unmocked http call: ${opts.method}:${opts.url}`);
      },

      // regex example of a mocked call to either http://google.com or https://google.com
      '/GET:https?://google.com/': () => {
        console.log('** GOOGLE **');
        return {
          text: 'OK'
        };
      }

    }
  }
});
