/**
 * Runs on server only
 */

const Vue = require("vue");
const path = require("path");
const colors = require('colors')

/**
 * For using fetch for async data server-side
 */
global.fetch = require("node-fetch")

export default context => {
  return new Promise((resolve, reject) => {

    let { store, app, router } = require(`./index.js`);

    const meta = app.$meta();

    Object.assign(store, context);

    router.push(context.file.url);
    
    router.onReady(() => {
      let matchedComponents = router.getMatchedComponents();
      // no matched routes
      if (!matchedComponents.length) {
        return reject(colors.red(`${context.file.url}`) + colors.grey(` from `) + colors.red(context.file.path.replace(__dirname, '')) + colors.grey(` is not routed to any vue templates. Match a vue template to this url in the ` + colors.green(`site.config.js`) + ` routes.\n\r`)
        );
      }
      // call `asyncData()` on all matched route components
      Promise.all(
        matchedComponents.map(Component => {
          if (Component.options.asyncData) {
            return Component.options.asyncData({
              store,
              route: router.currentRoute
            });
          }
        })
      )
        .then(() => {
          context.state = store;
          context.meta = meta;
          resolve(app);
        })
        .catch(reject);
    });
  });
};
