/**
 * Client Side SSR file
 * Here we make the router, store, the site config, and the app global variables
 */

import Vue from "vue";
import path from 'path';
import store from "./store-reconciliation";
import router from "./router";
import config from "../../site.config.js";

import meta_tags from './meta-tags.js';

Vue.config.productionTip = false;

global.store = store
global.router = router
global.config = config

/**
 * This is our config.folderStructure.css entry file
 */
require(main_css);

/**
 * This is our config.folderStructure.vue entry file
 */
let Root = require(main_vue).default;

Root = Object.assign({}, {
  metaInfo() {
    return meta_tags
  },
}, Root);

global.app = new Vue(
  Object.assign(
    {
      router: global.router,
      data: { store: global.store },
    },
    Root
  )
);

/**
 * This is our config.folderStructure.js entry file
 */
require(main_js);

// Check if user is logged in then launch the app unless we are rendering from the server
if (Vue.prototype.$isServer) {
  app.$mount("#app");
} else {
  require("./async-data");

  if(global.config.googleAnalyticsId) {
    require("./analytics.js")
  }
  
  if(global.config.facebook_id) {
    require("./facebook-social.js")
  }
  // Don't hydrate site if google bot is visiting because it may take the screen shot during the hydration phase when ajax content isn't present
  app.$mount("#app");
}

export default { app, router, store };
