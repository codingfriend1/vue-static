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
  home: Vue.component('home', require("templates/home.vue")),
  missing: Vue.component('missing', require("templates/missing.vue")),
  page: Vue.component('page', require("templates/page.vue")),
  post: Vue.component('post', require("templates/post.vue")),
  root: Vue.component('root', require("templates/root.vue")),
  comment: Vue.component('comment', require("templates/partials/comment.vue")),
  foot: Vue.component('foot', require("templates/partials/foot.vue")),
  navigation: Vue.component('navigation', require("templates/partials/navigation.vue")),
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

Vue.use(Meta);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  hashbang: false,
  routes
});

module.exports = router;
