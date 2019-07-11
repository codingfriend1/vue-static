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

/**
 * Make our store, router, and site.config.js (`config`) global so it can be used instantly in any of our templates, js files or components
 */
global.store = store
global.router = router
global.config = config

/**
 * This is our config.folderStructure.css entry file in `/site.config.js`
 */
require(main_css);

/**
 * This is our `config.folderStructure.vue` entry file in `/site.config.js`
 */
let Root = require(main_vue).default;

Root = Object.assign({}, {

  /**
   * We assign our default meta tags in `./meta-tags.js` to our root component
   */
  metaInfo() {
    return meta_tags
  },
}, Root);

/**
 * Here we construct the root component and connect the Vue-Stash Store and Vue-Router
 */
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
 * This is our config.folderStructure.js entry file from `/site.config.js`
 */
require(main_js);


if (Vue.prototype.$isServer) {
  /**
   * If we are rendering the component on the server we simply want to mount the root component without loading any server-side scripts
   */
  app.$mount("#app");
} else {

  /**
   * If we are rendering the root component on the client, we want to first complete any ajax requests and include their data in our rendered templates
   */
  require("./async-data");

  /**
   * If the user has set `googleAnalyticsId` in `/site.config.js` and we are rendering client-side we want to load our `./analytics.js` script
   */
  if(global.config.googleAnalyticsId) {
    require("./analytics.js")
  }
  
  /**
   * If the user has set a `facebook_id` in `/site.config.js` then we want to initialize facebook comments and likes
   * The `facebook_id` is the App ID you would normally use in the meta tag
   * ```html
   * <meta property="fb:app_id" content="[[facebook_id]]"/>
   * ````
   */
  if(global.config.facebook_id) {
    require("./facebook-social.js")
  }

  app.$mount("#app");
}

/**
 * It's important that we export the our root component, router, and store 
 */
export default { app, router, store };
