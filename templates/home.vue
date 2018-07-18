<template lang="pug">
  main
    header(v-html='file.html')
    div(role="menu").teasers
      div.teaser(v-for="post in posts")
        header.teaser-image(v-if="post.thumbnail")
          router-link(:to="post.url", role="menuitem").block.no-border
            img(:src="post.thumbnail", :alt="post.alt")
        article
          header
            router-link(:to="post.url").no-border.block
              h2.teaser-title {{post.title}}
              time.teaser-meta(:datetime="post.created") {{post.created | prettifyDate}}
          div
            p.teaser-preview(v-html="post.excerpt")
          footer
            router-link(:to="post.url").no-border.block
              .read-article.button Read more
</template>

<script>
const Vue = require('vue')
const config = require('config')
module.exports = {
	store: ['file', 'files'],
  computed: {
    posts() {
      return this.files
        .filter(file => file.url.indexOf('articles/') > -1)
    },
  },
  metaInfo() {
    return this.file
      ? {
          title: this.file.title,
          link: [
            { rel: 'canonical', href: config.site_url },
          ]

        } 
      : {}
  }
}
</script>

<style lang="stylus">
	
</style>
