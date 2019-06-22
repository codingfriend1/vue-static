const Vue = require("vue");
const config = require("config");
const router = require("./router");
const throttle = require('lodash.throttle');

if (!Vue.prototype.$isServer && config.googleAnalyticsId) {

  const BOTTOM_READING_HEIGHT = 100
  const reader_scroll_percent = 90
  global.furthest_scroll = 1
  const debug = false
  let already_read = false
  let windowHeight = window.innerHeight

  /**
   * Get scroll position of element
   * @param {object} el DOM element
   * @return {number} Scroll position of DOM element
   */
  function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return _y;
  }

  /**
   * Get relative scroll position to the main content of your articles in percent form
   * @return {number} A percent of how much of the article has been read
   */
  window.getScrollPosition = function() {
    if(!window.postBodyEl) { return 0 }

    let element_position_on_page = getOffset(window.postBodyEl)
    let relative_scroll_position = windowHeight + window.pageYOffset - element_position_on_page - BOTTOM_READING_HEIGHT;
    
    let contentHeight = postBodyEl.clientHeight

    return Math.round((relative_scroll_position / contentHeight) * 100)
  }

  /**
   * Notify Google Analytics that the visitor has read the page
   */
  global.notify_read = function() {
    already_read = true
    if(debug) {
      alert(`Thanks for reading ${window.store.file.title}, Scroll: ${global.furthest_scroll}%`)
    } else {
      Vue.prototype.$ga.set('metric2', 1);
      Vue.prototype.$ga.event('Interest', 'Reads', window.store.file.title)
    }
  }

  /**
   * Measure the visitor's scroll position and see if it covered most of the article content
   */
  global.trackScrolling = throttle(() => {
    global.furthest_scroll = Math.max(getScrollPosition(), global.furthest_scroll)

    let reader = global.furthest_scroll > reader_scroll_percent

    if(reader && !already_read) {
      notify_read()
      window.removeEventListener("scroll", trackScrolling)
    }
  }, 400)

  /**
   * Reset trackScrolling
   */
  function after_navigating() {
    already_read = false
    global.furthest_scroll = 1
    window.removeEventListener("scroll", trackScrolling)
    window.addEventListener("scroll", trackScrolling);
  }

  router.afterEach(after_navigating);


  const VueAnalytics = require("vue-analytics").default;
  const disableStr = "ga-disable-" + config.googleAnalyticsId;
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
      },
      shouldRouterUpdate(to, from) {
        return to.path !== from.path;
      }
    },
    beforeFirstHit () {
      after_navigating()
    }
  });
  
  // Opt-out function
  global.toggleTracking = function toggleTracking() {

    if(!config.googleAnalyticsId) { return false; }

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
      alert(`You have re-enabled Google Analytics data collection. This data will be collected.`);
    } else {
      Vue.prototype.$ga.disable()
      alert(
        "Google Analytics data will no longer be collected on you on this site."
      );

      // Delete all existing cookies
      document.cookie
        .split(";")
        .forEach(function(c) { 
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date()
            .toUTCString() + 
            ";path=/"); 
        });
    }
  };
}
