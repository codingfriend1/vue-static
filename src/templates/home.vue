<template lang="pug">
  main
    header(v-html='file.html')
    div(role="menu").teasers
      div.teaser(v-for="post in posts" :class="post.draft ? 'draft': ''")
        header.teaser-image(v-if="post.thumbnail")
          router-link(:to="post.url", role="menuitem").block.no-border
            img(:src="post.thumbnail", :alt="post.alt")
        article
          header
            router-link(:to="post.url").no-border.block
              h2.teaser-title {{post.title}}
              time.teaser-meta(:datetime="post.created") {{post.created | prettifyDate}} 
              span.reading-time-meta  - {{post.readingTime}} min read
          div
            p.teaser-preview(v-html="post.excerpt")
          footer
            router-link(:to="post.url").no-border.block
              .read-article.button Read more
</template>

<script>
import Vue from 'vue'
import config from 'config'

export default {
  name: 'home',
  store: ['file', 'files'],
  computed: {
    posts() {
      return this.files
        // Unless we are in development mode, don't list articles that are in draft mode.
        .filter(file => file.url.indexOf('articles/') > -1 && (!file.draft || process.env.NODE_ENV !== 'production'))
    },
  },
  metaInfo() {
    return this.file
      ? {
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
