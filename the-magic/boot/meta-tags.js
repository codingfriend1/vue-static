const config = require('config');

module.exports = {
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
}