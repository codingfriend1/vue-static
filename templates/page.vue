<template lang="pug">
  article.post-content.page
    header.post-header
        h1.post-title {{file.title}}
    main.post-body.post-body-and-feedback(v-html="file.html")
</template>

<script>
const config = require('config')
module.exports = {
  store: ["file"],
  metaInfo() {
    return this.file
      ? {
          title: this.file.title,
          meta: [
            { property: "og:type", content: "page" },

            { vmid: "og:type", property: "og:type", content: "page" },

            { vmid: "url", name: "url", content: config.site_url + this.file.url },
            { vmid: "identifier-URL", name: "identifier-URL", content: config.site_url + this.file.url },
            { vmid: "og:url", name: "og:url", content: config.site_url + this.file.url },
            {
              vmid: "og:description", property: "og:description",
              content: this.file.excerpt || config.description
            },
            {
              vmid: "twitter:description", name: "twitter:description",
              content: this.file.excerpt || config.description
            },
            {
              vmid: "description", name: "description",
              content: this.file.excerpt || config.description
            },

            { vmid: "twitter:title", name: "twitter:title", content: this.file.title },
            { vmid: "og:title", property: "og:title", content: this.file.title },
            { vmid: "pagename", name: "pagename", content: this.file.title },
            { vmid: "author", name: "author", content: this.file.author || config.author }
          ]
        }
      : {};
  }
};
</script>
