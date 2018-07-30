const Vue = require("vue");
const Meta = require("vue-meta");
const VueRouter = require("vue-router");
const config = require("config");
const camelCase = require("lodash.camelcase");
const VueStash = require("vue-stash").default;

require('./styles.styl')

Vue.use(VueStash);
Vue.use(Meta, {
  tagIDKeyName: 'data-vmid'
});
Vue.use(VueRouter);

Vue.config.productionTip = false;

/**
 * Make our individual templates and partials available globally
 */
const components = {
  // globalize vue components
  home: Vue.component('home', require("theme/templates/home.vue")),
  missing: Vue.component('missing', require("theme/templates/missing.vue")),
  page: Vue.component('page', require("theme/templates/page.vue")),
  post: Vue.component('post', require("theme/templates/post.vue")),
  comment: Vue.component('comment', require("theme/partials/comment.vue")),
  foot: Vue.component('foot', require("theme/partials/foot.vue")),
  navigation: Vue.component('navigation', require("theme/partials/navigation.vue")),
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

const Root = require("./root.vue");

let store = typeof window !== "undefined" && window.__INITIAL_STATE__ ? window.__INITIAL_STATE__ : config.store

const app = new Vue(
  Object.assign({
      router,
      data: { store }
  },
  Root)
);

router.beforeEach((to, from, next) => {
  let path = to.path.replace('.html', '').replace('.htm', '')
  const found = store.files.find(post => post.url === path);
  if (!found) {
    router.replace("/404");
  } else {
    store.file = found;
    store.social_url = config.site_url + store.file.url
  }
  next();
});

if(!Vue.prototype.$isServer) {
  
  Vue.mixin({
    beforeMount() {
      const { asyncData } = this.$options;
      if (asyncData) {
        this.dataPromise = asyncData({
          store: this.$store,
          route: this.$route
        });
      }
    }
  });

  Vue.mixin({
    beforeRouteUpdate(to, from, next) {
      const { asyncData } = this.$options;
      if (asyncData) {
        asyncData({
          store: this.$store,
          route: to
        })
          .then(next)
          .catch(next);
      } else {
        next();
      }
    }
  });

  window.store = store;

  if (config.googleAnalyticsId) {
    const VueAnalytics = require("vue-analytics").default;
    Vue.use(VueAnalytics, {
      id: config.googleAnalyticsId,
      router,
      disabled: localStorage.getItem('no-cookie-consent') !== 'true',
      autoTracking: {
        pageviewTemplate(route) {
          let file = store.files.find(file => {
            return file.url === route.path;
          });
          return {
            page: route.path,
            title: file ? file.title : "home",
            location: window.location.href
          };
        }
      },
    });

    // Opt Out of Google Analytics
    window.gaOptout = function gaOptout() {

      if(typeof window.allowCookies === 'undefined') {
        window.allowCookies = true
      }

      window.allowCookies = !window.allowCookies

      localStorage.setItem('no-cookie-consent', window.allowCookies)

      if(cookieConsentEl) {
        cookieConsentEl.style.display = 'none'
      }
      
      if(window.allowCookies) {
        Vue.prototype.$ga.enable()
        alert(`You have re-enabled google analytics data collection. This data will be collected.`);
      } else {
        Vue.prototype.$ga.disable()
        alert(
          "Google Analytics data will no longer be collected on you for this site."
        );
        // Delete all existing cookies
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
      }
    };
  }
  /**
   * Enable facebook comments
   */
  if (!window.fbAsyncInit) {
    window.enableComments = function() {
      (function(d, s, id) {
          var js,
              fjs = d.getElementsByTagName(s)[0];
          js = d.createElement(s);
          js.id = id;
          js.src = "https://connect.facebook.net/en_US/all.js";

          if (d.getElementById(id)) {
              //if <script id="facebook-jssdk"> exists
              delete window.FB;
              fjs.parentNode.replaceChild(js, fjs);
          } else {
              fjs.parentNode.insertBefore(js, fjs);
          }
      })(document, "script", "facebook-jssdk");

      window.fbAsyncInit = function() {
        if (typeof FB != "undefined" && FB != null) {
          FB.init({
            appId: config.facebook_id, //App ID from the app dashboard
            status: true, //Check Facebook Login status
            xfbml: true //Look for social plugins on the page
          });
        }
      }
    }
  }
}

app.$mount("#app");

module.exports = { app, router, store };