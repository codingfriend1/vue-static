const Vue = require("vue");
const Meta = require("vue-meta");
const VueRouter = require("vue-router");
const config = require("config");
const camelCase = require("lodash.camelcase");

/**
 * Make our individual templates and partials available globally
 */
const components = {
  // globalize vue components
  comment: Vue.component('comment', require("../../src/partials/comment.vue")),
  foot: Vue.component('foot', require("../../src/partials/foot.vue")),
  navigation: Vue.component('navigation', require("../../src/partials/navigation.vue")),
  home: Vue.component('home', require("../../src/templates/home.vue")),
  missing: Vue.component('missing', require("../../src/templates/missing.vue")),
  page: Vue.component('page', require("../../src/templates/page.vue")),
  post: Vue.component('post', require("../../src/templates/post.vue")),
  // end globalize vue components
};

/**
 * Take routes in /site.config.js and attach the named components to them
 */
const routes = config.routes
  .map(route => {
    route.component = camelCase(route.component);
    return components[route.component]
      ? Object.assign({}, route, { component: components[route.component] })
      : null;
  })
  .filter(a => a);

Vue.use(Meta, {
  tagIDKeyName: 'data-vmid'
});
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  hashbang: false,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return new Promise((resolve, reject) => {

      /**
       * Here is where you determine scroll position for the page you navigate to
       */
      resolve({x: 0, y: 0})
    })    
  }
});

module.exports = router;
