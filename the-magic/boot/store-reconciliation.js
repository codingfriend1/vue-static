// The server may have made changes to the store before rendering the initial html. It writes those changes to window.__INITIAL_STATE__. We need to set out local store to be the same as the server so vue does not throw an hydration error (server and client html out of sync)
import Vue from "vue";
import VueStash from "vue-stash";
import router from "./router";
import config from "config";
import './facebook-social';
Vue.use(VueStash);
const isProd = process.env.NODE_ENV === "production";
const defaultStore = config.store;

let store = defaultStore;

/**
 * When our Vue and Markdown files are rendered into HTML, Server-Side Rendering will save the server-side rendered state of the store to the variable `window.__INITIAL_STATE__`
 * We want to set our client-side store to initialize with whatever is in this variable, so the server and client store will be in sync
 */
try {
  if (typeof window !== "undefined" && window.__INITIAL_STATE__) {
    store = window.__INITIAL_STATE__;
  }
} catch (err) {}


/**
 * Before loading the URL, finding the markdown file matching that URL and set the markdown's rendered HTML and metadata object as the `file` property of the store. If a markdown file cannot be found, then load a 404 page
 */
router.beforeEach(async (to, from, next) => {
  let path = to.path.replace('.html', '').replace('.htm', '');

  let found
  if(isProd) {
    found = store.file.url === path ? store.file : await fetch(`/json/${path}.json`)
      .then(res => res.json());
  } else {
    found = store.files.find(post => post.url === path);
  }

  /**
   * Setting `postBodyEl` will enable scroll tracking with Google Analytics on a page.
   * Scrolling tracking is how we determine if the article was completely read (the user reaches the bottom of the article content).
   * We want to reset this value between pages in case there's a page that we don't want to track
   */
  if(typeof postBodyEl !== 'undefined') {
    global.postBodyEl = null;
  }

  if (!found) {
    router.replace("/404");
  } else {

    store.file = found;

    /**
     * `social_url` is used for matching Facebook Comments and Likes to the current page in the `:data-href="$store.social_url"` attribute
     */
    store.social_url = config.site_url + store.file.url;
  }
  next();
});

export default store;
