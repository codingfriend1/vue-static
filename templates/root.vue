<template lang="pug">
	#app
		navigation
		main
			router-view
		foot
</template>

<script>
const config = require("config");
module.exports = {
	metaInfo() {
		return {
			title: config.site_title,
			titleTemplate: "%s | " + config.site_title,
			link: [
				{ rel: 'alternate', type: 'application/rss+xml', title: `${config.site_url} > Feed`, href: `${config.site_url + '/feed.xml'}` }
			],
			meta: [
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1"
				},
				{ vmid: 'url', name: "url", content: config.site_url },
				{ vmid: 'identifier-URL', name: "identifier-URL", content: config.site_url },
				{ vmid: 'og:url', name: "og:url", content: config.site_url },
				{ vmid: 'owner', name: "owner", content: config.author },
				{ vmid: "author", name: "author", content: config.author },
				{ vmid: 'copyright', name: "copyright", content: config.author },
				{ vmid: 'medium', name: "medium", content: "blog" },
				{ vmid: 'robots', name: "robots", content: "index,follow" },
				{ vmid: 'description', name: "description", content: config.description },
				{ vmid: 'keywords', name: "keywords", content: config.keywords },
				{ vmid: 'language', name: "language", content: config.language },
				{ vmid: 'fb:app_id', property:"fb:app_id", content: config.facebook_id },
				{ vmid: 'og:locale', property:"og:locale", content: config.locale },
				{ vmid: 'og:site_name', property:"og:site_name", content: config.site_title },
				{ vmid: 'og:title', property: "og:title", content: config.site_title },
				{ vmid: 'og:description', property: "og:description", content: config.description },
				{ vmid: 'og:image', property: "og:image", content: config.site_url + config.logo },
				{ vmid: 'twitter:image', name: "twitter:image", content: config.site_url + config.logo },
				{ vmid: 'twitter:card', name: "twitter:card", content: config.twitterCard },
				{ vmid: 'twitter:creator', name: "twitter:creator", content: config.twitterCreator },
				{ vmid: 'twitter:title', name: "twitter:title", content: config.site_title },
				{
					vmid: 'twitter:description',
					name: "twitter:description",
					content: config.description
				},
				{ vmid: 'pagename', name: "pagename", content: config.site_title }
			]
		};
		// if no subcomponents specify a metaInfo.title, this title will be used
		// all titles will be injected into this template
	}
};
</script>
