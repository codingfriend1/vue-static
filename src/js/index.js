/**
 * This file is included in the production.js build file
 * To know exactly at what point this file is inserted, view `the-magic/boot/index.js` and look for `main_js`
 * `store`, `router`, `config`, `app` are global variables for use in this file, keep in mind this script is run just before the root component is mounted
 */

import Vue from 'vue'

 Vue.filter('prettifyDate', function (value) {
   var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
   var date = new Date(value);
   return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
 })