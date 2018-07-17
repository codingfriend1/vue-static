const Vue = require("vue");
const config = require("../site.config.js");
const path = require("path");

export default context => {
  return new Promise((resolve, reject) => {
    var { store, app, router } = require(`../themes/demo-theme/index.js`);

    const meta = app.$meta();
    Object.assign(store, context);
    router.push(context.file.url);
    router.onReady(() => {
      let matchedComponents = router.getMatchedComponents();
      // no matched routes
      if (!matchedComponents.length) {
        return reject(
          new Error(`There are no vue components for this url: ${context.url}`)
        );
      }
      // call `asyncData()` on all matched route components
      Promise.all(
        matchedComponents.map(Component => {
          if (Component.asyncData) {
            return Component.asyncData({
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
