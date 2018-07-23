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
              span.reading-time-meta  - {{post.readingTime}}
          div
            p.teaser-preview(v-html="post.excerpt")
          footer
            router-link(:to="post.url").no-border.block
              .read-article.button Read more
</template>

<script>
const Vue = require('vue')
const config = require('config')

function get_text(el) {
  var ret = "";
  var length = el.childNodes.length;
  for(var i = 0; i < length; i++) {
    var node = el.childNodes[i];
    if(node.nodeType != 8) {
      ret += node.nodeType != 1 ? node.nodeValue : get_text(node);
    }
  }
  return ret;
}

function get_reading_time(el) {
    const words_only = get_text(el);
    const word_count = words_only.split(' ').length;
    const words_per_minute = 275;
    const readable_content = 0.75;
    const reading_time_in_minutes = Math.round(word_count / words_per_minute) * readable_content;
    return Math.round(reading_time_in_minutes)
}

module.exports = {
  store: ['file', 'files'],
  computed: {
    posts() {
      return this.files
        // Unless we are in development mode, don't list articles that are in draft mode.
        .filter(file => file.url.indexOf('articles/') > -1 && (!file.draft || process.env.NODE_ENV !== 'production'))

        // Estimate the read time of every article
        .map(file => {
          if(typeof window !== 'undefined') {
            var div = document.createElement("div")
            div.innerHTML = file.html
            file.readingTime = get_reading_time(div) + ' min read'
          }
          return file
        })
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
