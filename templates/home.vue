<template lang="pug">
  main
    header(v-html='file.html')
    main.teasers
      article.teaser(v-for="post in posts")
        header.teaser-image
          router-link(:to="post.url").block.no-border
            img(v-show="post.thumbnail" :src="post.thumbnail", :alt="post.alt")
        main
          header
            router-link(:to="post.url" onclick="ga('send', 'event', 'Link', 'Click', #{url + '/blog/' + slug})").no-border.block
              h2.teaser-title {{post.title}}
              time.teaser-meta(pubdate="pubdate", :datetime="post.created") {{post.created | prettifyDate}}

          main
            router-link(:to="post.url").no-border.block
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
