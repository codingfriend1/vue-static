const Vue = require("vue");
const store = require("./store-reconciliation");
const router = require("./router");

Vue.config.productionTip = false;

require("./analytics");
require("./main");

const Root = require("templates/root.vue");

const app = new Vue(
  Object.assign(
    {
      router,
      data: { store }
    },
    Root
  )
);

// Check if user is logged in then launch the app unless we are rendering from the server
if (Vue.prototype.$isServer) {
  app.$mount("#app");
} else {
  require("./async-data");
  window.store = store;
  setTimeout(() => {
    app.$mount("#app");
  }, 1000);
  
}

module.exports = { app, router, store };
