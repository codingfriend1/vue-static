<template lang="pug">
  #app
    #cookieConsent(ref="cookieConsent")
      span This website is using cookies. 
      router-link(to="/privacy-policy").no-border More info
      a.cookieConsentOK(@click="enableTracking()") Got it!
    navigation
    div
      router-view
    foot
</template>

<script>
const config = require("config");
const Vue = require('vue')

module.exports = {
  methods: {
    enableTracking () {
      global.toggleTracking()
    },
  },
  mounted() {
    if(!this.$isServer && typeof localStorage !== 'undefined' && config.googleAnalyticsId) {
      let consent = localStorage.getItem('no-cookie-consent')
      window.cookieConsentEl = this.$refs['cookieConsent']
      if(!consent) {
        this.$refs['cookieConsent'].style.display = 'block'
      }

      if(consent === 'true') {
        window.allowCookies = true
        this.$ga.enable()
      } else if(consent === 'false') {
        window.allowCookies = false
        this.$ga.disable()
      } else {
        window.allowCookies = undefined
      }
    }
    
    
  }
};
</script>

<style lang="stylus">
  #cookieConsent {
    background-color: rgba(20,20,20,0.8);
    min-height: 26px;
    color: white;
    line-height: 26px;
    padding: 12px 0 12px 30px;
    font-size: 16px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    display: none;
  }
  #cookieConsent a {
    color: #4B8EE7;
    text-decoration: none;
  }
  #cookieConsent span {
    padding: 5px 0;
  }
  #closeCookieConsent {
    float: right;
    display: inline-block;
    cursor: pointer;
    height: 20px;
    width: 20px;
    margin: -15px 0 0 0;
    font-weight: bold;
  }
  #closeCookieConsent:hover {
    color: #FFF;
  }
  #cookieConsent a.cookieConsentOK {
    background-color: #fafafa;
    color: #000;
    display: inline-block;
    border-radius: 5px;
    padding: 5px 20px;
    cursor: pointer;
    float: right;
    margin: 0 60px 0 10px;
  }
  #cookieConsent a.cookieConsentOK:hover {
    background-color: #fafafa;
  }
</style>
