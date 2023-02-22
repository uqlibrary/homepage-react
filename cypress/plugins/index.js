// ***********************************************************
// This example plugins/e2e.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// const {initPlugin} = require('cypress-plugin-snapshots/plugin');

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// eslint-disable-next-line no-unused-vars

module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    // initPlugin(on, config);
    require('@cypress/code-coverage/task')(on, config);
    on('file:preprocessor', require('@cypress/code-coverage/use-browserify-istanbul'));
    return config;
};
