const Vue = require("vue");
const Meta = require("vue-meta");
const VueRouter = require("vue-router");
const config = require("config");
const camelCase = require("lodash.camelcase");
const VueStash = require("vue-stash").default;

require('./styles.styl')

Vue.use(VueStash);
Vue.use(Meta);
Vue.use(VueRouter);

Vue.config.productionTip = false;

Vue.filter('prettifyDate', function (value) {
  var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
  var date = new Date(value);
  return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
})

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

const router = new VueRouter({
  mode: "history",
  hashbang: false,
  routes
});

const Root = require("templates/root.vue");

let store = typeof window !== "undefined" && window.__INITIAL_STATE__ ? window.__INITIAL_STATE__ : config.store

const app = new Vue(
  Object.assign({
      router,
      data: { store }
  },
  Root)
);

router.beforeEach((to, from, next) => {
  const found = store.files.find(post => post.url === to.path);
  if (!found) {
    router.replace("/404");
  } else {
    store.file = found;
  }
  next();
});

app.$mount("#app");

module.exports = { app, router, store };