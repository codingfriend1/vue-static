const Vue = require('vue')
require('./track-reading.js')
require('./main.styl')

Vue.filter('prettifyDate', function (value) {
  var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
  var date = new Date(value);
  return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
})

if(!Vue.prototype.$isServer) {
  

  document.addEventListener("DOMContentLoaded", function(event) {

    /**
     * Make all links new tabs
     */
    const links = document.links;
    for (var i = 0, linksLength = links.length; i < linksLength; i++) {
       if (links[i].hostname != window.location.hostname) {
           links[i].target = '_blank';
       } 
    }

    // Mail Chimp Email Subscribe
    (function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='ADDRESS';ftypes[3]='address';fnames[4]='PHONE';ftypes[4]='phone';fnames[5]='BIRTHDAY';ftypes[5]='birthday';}(jQuery));var $mcj = jQuery.noConflict(true);
    // End mc_embed_signup
  })
}
