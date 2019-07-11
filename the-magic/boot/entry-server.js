/**
 * Runs on server only
 * When our `/the-magic/build/build.js` or `/the-magic/build/server.js` attempt to render our Vue and Markdown files into raw HTML files at `renderer.renderToString()` for better SEO, it critically depends on this file to determine which files to render for a given route, to load all necessary subcomponents for that route and render each, and add any data from our server side AJAX requests that need to be embedded in the raw HTML file. If the store is modified, we also need to deliver a copy of that state to the renderer so the client will initialize it's store in the same condition.
 */

import Vue from "vue";
import path from "path";
import colors from 'colors';

/**
 * For using fetch for async data server-side
 */
global.fetch = require("node-fetch")

export default context => {

  /**
   * It's ok to return a promise to the renderer
   */
  return new Promise((resolve, reject) => {

    let { store, app, router } = require(`./index.js`).default;

    /**
     * Initialize Vue-Meta
     */
    const meta = app.$meta();

    Object.assign(store, context);

    /**
     * The `context` argument provides the url the user is attempting to access in the browser with `context.file.url`. We tell the router to load this route and all it's necessary subcomponents
     */
    router.push(context.file.url);
    
    /**
     * We wait for the router to finish loading all necessary components to this route
     */
    router.onReady(() => {
      let matchedComponents = router.getMatchedComponents();

      // no matched routes
      if (!matchedComponents.length) {
        return reject(colors.red(`${context.file.url}`) + colors.grey(` from `) + colors.red(context.file.path.replace(__dirname, '')) + colors.grey(` is not routed to any vue templates. Match a vue template to this url in the ` + colors.green(`site.config.js`) + ` routes.\n\r`)
        );
      }

      /**
       * For every subcomponent for this route, we check if any of them require AJAX requests to be run and completed before we render. This is helpful in the case that you want to fetch some data at the moment the user or Search Engine Bot load the page and embed the results in the rendered HTML file
       * We provide each `asyncData()` function the store and current route in case that information is needed for making the AJAX request
       */
      Promise.all(
        matchedComponents.map(Component => {
          if (Component.options.asyncData) {

            // call `asyncData()` on all matched route components
            return Component.options.asyncData({
              store,
              route: router.currentRoute
            });
          }
        })
      )
        .then(() => {
          /**
           * AJAX requests or loading the components may have modified our server-side store. It's critical that the server rendering fully matches the client-side rendering on the each's initial render and to have matching pages the store needs to be in the same state on the client and server. Therefore, since our basic store may have been modified by our server-side rendering process, we need to provide the modifications to the context so the client can initialize it's store with the state the server renderer left it in.
           */
          context.state = store;

          /**
           * We also need to provide our meta data rendered by Vue-Meta to our context object so we can inject these tags into our rendered HTML
           */
          context.meta = meta;
          resolve(app);
        })
        .catch(reject);
    });
  });
};
