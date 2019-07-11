/**
 * Runs client side only
 * Before the component mounts or updates it's route, we want to finish running any requied AJAX requests that the component may depend on to load
 */

import Vue from "vue";

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
