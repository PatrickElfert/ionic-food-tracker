import { defineConfig } from 'cypress';
import { environment } from './src/environments/environment';

export default defineConfig({
  e2e: {
    env: environment,
    baseUrl: environment.baseUrl,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
