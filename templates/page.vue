<template lang="pug">
  article.post-content.page
    header.post-header
        h1.post-title {{file.title}}
    main.post-body.post-body-and-feedback(v-html="file.html")
</template>

<script>
module.exports = {
  store: ["file"],
  metaInfo() {
    return this.file
      ? {
          title: this.file.title,
          meta: [
            { property: "og:type", content: "page" },

            { name: "url", content: this.file.url },
            { name: "identifier-URL", content: this.file.url },
            { name: "og:url", content: this.file.url },
            {
              property: "og:description",
              content: this.file.excerpt || this.$store.description
            },
            {
              name: "twitter:description",
              content: this.file.excerpt || this.$store.description
            },
            {
              name: "description",
              content: this.file.excerpt || this.$store.description
            },

            { name: "twitter:title", content: this.file.title },
            { property: "og:title", content: this.file.title },
            { name: "pagename", content: this.file.title },
            { name: "author", content: this.file.author || this.$store.author }
          ]
        }
      : {};
  }
};
</script>
