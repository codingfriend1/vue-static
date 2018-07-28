<template lang="pug">
div
  div(v-if="!file.draft || hasPermission")
    main.post-content-and-feedback
      article.post-content
        header.post-header
          div.post-info
            .post-avatar
            .h5.post-meta(role="contentinfo")
              address
                router-link(to="/about", rel='author').no-border  {{file.author || author}} 
              div.time
                time(:datetime="file.created")  {{file.created | prettifyDate}} 
                span.dot 
                span#reading-time  {{file.readingTime}} min read
          h1.post-title {{file.title}}
        div.post-body-and-feedback
          div.post-body(v-html='file.html' ref="postBody" role="main")
          footer.post-feedback.no-print
            comment
        footer



    aside.sidebar.no-print
      section.post-list.no-print(role="navigation")
        header
          p.h4 Articles
        ul(role="menu")
          li.list-article-title(v-for="post in posts", :key="post.url", :class="post.url === $route.path ? 'active' : ''")
            router-link(exact :to="post.url" class="no-border" role="menuitem") {{post.title}}
  div(v-else)
    main.post-content-and-feedback
      header.post-header
        h1.post-title This article isn't ready
      div.post-body-and-feedback
        p
          | Sorry, but this post is currently being edited and isn't ready for reading. However if the author has given you a password for early access you may see it.
</template>

<script>
const config = require("config");

module.exports = {
  store: ["file", "files"],
  data() {
    return {
      author: config.author,
      hasPermission: process.env.NODE_ENV !== 'production'
    }
  },
  computed: {
    posts() {
      return this.files.filter(file => file.url.indexOf("articles/") > -1 && (!file.draft || process.env.NODE_ENV !== 'production'));
    }
  },
  metaInfo() {
    let meta = this.file
      ? {
          title: this.file.title,
          link: [
            { rel: 'canonical', href: config.site_url + this.file.url },
          ],
          meta: [


            { "data-vmid": "og:type", property: "og:type", content: "article" },
            { "data-vmid": "article:published_time", property: "article:published_time", content: this.file.created },
            { "data-vmid": "article:modified_time", property: "article:modified_time", content: this.file.updated },
            { "data-vmid": "article:author", property: "article:author", content: this.file.author || config.author },

            { "data-vmid": "url", name: "url", content: config.site_url + this.file.url },
            { "data-vmid": "identifier-URL", name: "identifier-URL", content: config.site_url + this.file.url },
            { "data-vmid": "og:url", property: "og:url", content: config.site_url + this.file.url },
            {
              "data-vmid": "og:description", property: "og:description",
              content: this.file.description || config.description
            },
            {
              "data-vmid": "twitter:description", name: "twitter:description",
              content: this.file.description || config.description
            },
            {
              "data-vmid": "description", name: "description",
              content: this.file.description || config.description
            },
            { "data-vmid": 'keywords', name: "keywords", content: this.file.keywords || config.keywords },
            { "data-vmid": "twitter:title", name: "twitter:title", content: this.file.title },
            { "data-vmid": "og:title", property: "og:title", content: this.file.title },
            { "data-vmid": "pagename", name: "pagename", content: this.file.title },
            { "data-vmid": "author", name: "author", content: this.file.author || config.author }
          ]
        }
      : {};

      if(this.file.draft) {
        meta.meta = meta.meta.concat([
          { "data-vmid": "robots", name: "robots", content: "noindex" },
          { "data-vmid": "googlebot", name: "googlebot", content: "noindex" }
        ])
      }
      return meta
  },
  mounted() {
    if(!this.$isServer) {
      if(process.env.NODE_ENV === 'production' && this.file.draft) {
        let input = window.prompt('Please enter the password to read this unfinished article: ')

        this.hasPermission = input === this.file.password || input === config.draft_preview_password
        if(!this.hasPermission) {
          window.alert('Sorry but that password was not correct, please wait until the article is published.')
        }
      }
    }
  }
};
</script>
