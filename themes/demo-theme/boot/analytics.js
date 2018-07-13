const Vue = require("vue");
const config = require("config");
const router = require("./router");

if (!Vue.prototype.$isServer) {
  if (config.googleAnalyticsId) {
    const VueAnalytics = require("vue-analytics").default;

    const disableStr = "ga-disable-" + config.googleAnalyticsId;
    console.log("setting");
    Vue.use(VueAnalytics, {
      id: config.googleAnalyticsId,
      router,
      disabled: () => document.cookie.indexOf(disableStr + "=true") > -1,
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
        },
        shouldRouterUpdate(to, from) {
          return to.path !== from.path;
        }
      }
    });

    if (document.cookie.indexOf(disableStr + "=true") > -1) {
      window[disableStr] = true;
    }
    // Opt-out function
    window.gaOptout = function gaOptout() {
      if (!window[disableStr]) {
        alert(
          "Google Analytics data will no longer be collected on you for this site."
        );
        document.cookie =
          disableStr + "=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/";
        window[disableStr] = true;
      } else {
        alert(
          `You have re-enabled google analytics data collection. This data will be collected.`
        );
        document.cookie =
          disableStr + "=false; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/";
        window[disableStr] = false;
      }
    };
  }
}
