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

Vue.filter('prettifyDate', function (value) {
  var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
  var date = new Date(value);
  return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
})

module.exports = {
	methods: {
		enableTracking () {
			if(typeof window !== 'undefined' && config.googleAnalyticsId) {
				localStorage.setItem('no-cookie-consent', true)
	      this.$ga.enable()
	      this.$refs['cookieConsent'].style.display = 'none'
	      window.allowCookies = true

	      this.$ga.page({
          page: this.$route.path,
          title: window.store.file ? window.store.file.title : "home",
          location: window.location.href
        })
	      // from now on analytics is enabled
			}
			
    },
    disableTracking () {
    	if(typeof window !== 'undefined' && config.googleAnalyticsId) {
	    	localStorage.setItem('no-cookie-consent', false)
				this.$ga.disable()
				this.$refs['cookieConsent'].style.display = 'none'
				window.allowCookies = false
				// from now on analytics is disabled
    	}
    	
		},
	},
	metaInfo() {
		return {
			title: config.site_title,
			link: [
				{ rel: 'alternate', type: 'application/rss+xml', title: `${config.site_url} > Feed`, href: `${config.site_url + '/feed.xml'}` }
			],
			meta: [
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1"
				},
				{ "data-vmid": 'url', name: "url", content: config.site_url },
				{ "data-vmid": 'identifier-URL', name: "identifier-URL", content: config.site_url },
				{ "data-vmid": 'og:url', name: "og:url", content: config.site_url },
				{ "data-vmid": 'owner', name: "owner", content: config.author },
				{ "data-vmid": "author", name: "author", content: config.author },
				{ "data-vmid": 'copyright', name: "copyright", content: config.author },
				{ "data-vmid": 'medium', name: "medium", content: "blog" },
				{ "data-vmid": 'robots', name: "robots", content: "index,follow" },
				{ "data-vmid": 'description', name: "description", content: config.description },
				{ "data-vmid": 'keywords', name: "keywords", content: config.keywords },
				{ "data-vmid": 'language', name: "language", content: config.language },
				{ "data-vmid": 'fb:app_id', property:"fb:app_id", content: config.facebook_id },
				{ "data-vmid": 'og:locale', property:"og:locale", content: config.locale },
				{ "data-vmid": 'og:site_name', property:"og:site_name", content: config.site_title },
				{ "data-vmid": 'og:title', property: "og:title", content: config.site_title },
				{ "data-vmid": 'og:description', property: "og:description", content: config.description },
				{ "data-vmid": 'og:image', property: "og:image", content: config.site_url + config.logo },
				{ "data-vmid": 'twitter:image', name: "twitter:image", content: config.site_url + config.logo },
				{ "data-vmid": 'twitter:card', name: "twitter:card", content: config.twitterCard },
				{ "data-vmid": 'twitter:creator', name: "twitter:creator", content: config.twitterCreator },
				{ "data-vmid": 'twitter:title', name: "twitter:title", content: config.site_title },
				{
					"data-vmid": 'twitter:description',
					name: "twitter:description",
					content: config.description
				},
				{ "data-vmid": 'pagename', name: "pagename", content: config.site_title }
			]
		};
		// if no subcomponents specify a metaInfo.title, this title will be used
		// all titles will be injected into this template
	},
	mounted() {
		if(!this.$isServer && typeof localStorage !== 'undefined' && config.googleAnalyticsId) {
			let consent = localStorage.getItem('no-cookie-consent')
			if(!consent) {
				this.$refs['cookieConsent'].style.display = 'block'
			}

			if(consent === 'true') {
				window.allowCookies = true
				this.$ga.enable()
			} else {
				window.allowCookies = false
				this.$ga.disable()
			}
		}
		
		
	}
};
</script>

<style lang="styl">
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
