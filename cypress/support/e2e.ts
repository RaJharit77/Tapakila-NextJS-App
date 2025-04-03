// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top as any;
if (app) {
  app.console.log = () => {};
}

// Prevent uncaught exception from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Prevent unhandled promise rejection from failing tests
Cypress.on('unhandled:rejection', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Add custom event listeners
Cypress.on('test:after:run', (attributes) => {
  // Log test results
  console.log(`Test "${attributes.title}" completed with status: ${attributes.state}`);
});

// Add custom event listeners for test retry
Cypress.on('test:retry', (attributes) => {
  console.log(`Retrying test "${attributes.title}" (attempt ${attributes.currentRetry} of ${attributes.retries})`);
});