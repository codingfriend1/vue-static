const Vue = require("vue");
const config = require("config");
const router = require("./router");

if (!Vue.prototype.$isServer) {
  if (config.googleAnalyticsId) {

    const BOTTOM_READING_HEIGHT = 100
    window.furthest_scroll = 0

    const debug = false

    /**
     * Percent complete to quality
     */
    // Readers
    const reader_scroll = 80
    const reader_time = 80

    // Scanners
    const scanner_scroll = 70
    const scanner_time = 50

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

    let windowHeight = window.innerHeight
    window.getScrollPosition = function() {
      if(!window.postBodyEl) { return 0 }

      let element_position_on_page = getOffset(window.postBodyEl)
      let relative_scroll_position = windowHeight + window.pageYOffset - element_position_on_page - BOTTOM_READING_HEIGHT;
      
      let contentHeight = postBodyEl.clientHeight

      return Math.round((relative_scroll_position / contentHeight) * 100)
    }


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
        riveted.init({
          nonInteraction: true,
          eventHandler: function(active_seconds) {
            window.active_seconds = active_seconds
            if(window.predicted_reading_time) {

              let reading_time_percent = Math.round((window.active_seconds / window.predicted_reading_time) * 100)

              if(debug) {
                console.log(`Percent time finished: ${reading_time_percent}%`)
                console.log('===================')
              }

              if(window.active_seconds > (window.initialScanTimeInSeconds || Math.round(window.predicted_reading_time * 0.4))) {
                window.furthest_scroll = Math.max(getScrollPosition(), window.furthest_scroll)

                if(debug) {
                  console.log(`Scrollbar position: ${window.furthest_scroll}%`)
                  console.log('==============')
                }

                /**
                 * A scanner is at least 80% through the page and has used 50% of the estimated reading time 
                 */

                let minimum_scan_time = window.furthest_scroll > scanner_scroll && reading_time_percent > scanner_time

                /**
                 * A full reader uses 80% of the estimated time and scrolls above 80% of the page
                 */
                let full_reader = reading_time_percent > reader_time && window.furthest_scroll > reader_scroll

                if(full_reader && window.already_read) {
                  riveted.off()
                  if(debug) {
                    alert(`Thanks for reading ${window.store.file.title}! Time: ${reading_time_percent}%, Scroll: ${window.furthest_scroll}%`)
                  } else {
                    Vue.prototype.$ga.set('metric1', 1);

                    // Set scans to zero again
                    Vue.prototype.$ga.set('metric2', 0);

                    Vue.prototype.$ga.event('Reading', 'Reader', window.store.file.title, window.active_seconds)
                  }
                } else if(minimum_scan_time && !window.already_read) {
                  window.already_read = true
                  if(debug) {
                    alert(`Thanks for scanning ${window.store.file.title}. Time: ${reading_time_percent}%, Scroll: ${window.furthest_scroll}%`)
                  } else {
                    Vue.prototype.$ga.set('metric2', 1);
                    Vue.prototype.$ga.event('Reading', 'Scanner', window.store.file.title, window.active_seconds)
                  }
                }

              }
            }
            
          },
          idleTimeout: 30,
          reportInterval: 5,
        });
      }
    });
    
    // Opt-out function
    window.gaOptout = function gaOptout() {

      window.allowCookies = !window.allowCookies

      localStorage.setItem('no-cookie-consent', window.allowCookies)

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
}
