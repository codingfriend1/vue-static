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
			meta: [
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1"
				},
				{ name: "url", content: config.site_url },
				{ name: "identifier-URL", content: config.site_url },
				{ name: "og:url", content: config.site_url },
				{ name: "owner", content: config.author },
				{ name: "author", content: config.author },
				{ name: "copyright", content: config.author },
				{ name: "medium", content: "blog" },
				{ name: "robots", content: "index,follow" },
				{ name: "description", content: config.description },
				{ name: "keywords", content: config.keywords },
				{ name: "language", content: config.language },
				{ property: "fb:app_id", content: config.facebook_id },
				{ property: "og:locale", content: config.locale },
				{ property: "og:site_name", content: config.site_title },
				{ property: "og:title", content: config.site_title },
				{ property: "og:description", content: config.description },
				{ property: "og:image", content: config.logo },
				{ name: "twitter:image", content: config.logo },
				{ name: "twitter:card", content: config.twitterCard },
				{ name: "twitter:creator", content: config.twitterCreator },
				{ name: "twitter:title", content: config.site_title },
				{
					name: "twitter:description",
					content: config.description
				},
				{ name: "pagename", content: config.site_title }
			]
		};
		// if no subcomponents specify a metaInfo.title, this title will be used
		// all titles will be injected into this template
	}
};
</script>
