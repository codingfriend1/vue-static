<template lang="pug">
div
  div(v-if="!file.draft || hasPermission")
    main.post-content-and-feedback
      article.post-content
        header.post-header
          h1.post-title {{file.title}}
          .post-avatar
          .h5.post-meta(role="contentinfo")
            | by 
            address
              router-link(to="/about", rel='author').no-border  {{file.author || author}} 
            span.inline-desktop
              |  on
              time(:datetime="file.created")  {{file.created | prettifyDate}}
          .reading-time
            span#reading-time {{readingTime}}
        div.post-body-and-feedback
          div.post-body(v-html='file.html' ref="postBody" role="main")
          footer.post-feedback.no-print
            comment
        footer



    aside.sidebar.no-print
      section.subscribe#mc_embed_signup.no-print
        form#mc-embedded-subscribe-form.validate(:action="mailChimpUrl", method='post', name='mc-embedded-subscribe-form', target='_blank', novalidate='')
            #mc_embed_signup_scroll
              header
                p.h3 Subscribe to new posts
              .mc-field-group
                  label(for='mce-EMAIL') Email Address 
                  input#mce-EMAIL.required.email(type='email', value='', name='EMAIL')
              #mce-responses.clear
                  #mce-error-response.response(style='display:none')
                  #mce-success-response.response(style='display:none')
              // real people should not fill this in and expect good things - do not remove this or risk form bot signups
              div(style='position: absolute; left: -5000px;', aria-hidden='true')
                  input(type='text', name='', tabindex='-1', value='')
              .clear
                  input#mc-embedded-subscribe.button.subscribe-button(type='submit', value='Subscribe', name='subscribe')

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

function get_reading_time() {
  if(window.postBodyEl) {
    const words_only = get_text(window.postBodyEl);
    const word_count = words_only.split(' ').length;
    const orientation_seconds = 4
    const words_per_minute = 275;
    const readable_content = 0.75;
    window.initialScanTimeInSeconds = (word_count / words_per_minute) + orientation_seconds
    const reading_time_in_minutes = Math.round(word_count / words_per_minute) * readable_content;
    this.readingTime = Math.round(reading_time_in_minutes) + ' min read';
    window.predicted_reading_time = parseInt(reading_time_in_minutes * 60);
  }
}

module.exports = {
  store: ["file", "files"],
  data() {
    return {
      author: config.author,
      mailChimpUrl: config.mailChimpUrl,
      hasPermission: process.env.NODE_ENV !== 'production',
      readingTime: 'Calculating reading time...'
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
  beforeRouteUpdate(to, from, next) {
    next();
    this.$nextTick(() => {
      window.postBodyEl = this.$refs["postBody"]
      get_reading_time.apply(this)
    });
    return true;
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

    this.$nextTick(() => {
      window.postBodyEl = this.$refs["postBody"]
      get_reading_time.apply(this)
    });
  }
};
</script>
