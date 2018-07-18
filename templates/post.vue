<template lang="pug">
div
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
          span#reading-time
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
                input(type='text', name='b_5827b931d53a5f014ae1a4a49_589bf9111e', tabindex='-1', value='')
            .clear
                input#mc-embedded-subscribe.button.subscribe-button(type='submit', value='Subscribe', name='subscribe')

    section.post-list.no-print(role="navigation")
      header
        p.h4 Articles
      ul(role="menu")
        li.list-article-title(v-for="post in posts", :key="post.url", :class="post.url === $route.path ? 'active' : ''")
          router-link(exact :to="post.url" class="no-border" role="menuitem") {{post.title}}

</template>

<script>
const config = require("config");
module.exports = {
  store: ["file", "files"],
  data() {
    return {
      author: config.author,
      mailChimpUrl: config.mailChimpUrl
    }
  },
  computed: {
    posts() {
      return this.files.filter(file => file.url.indexOf("articles/") > -1);
    }
  },
  metaInfo() {
    return this.file
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

            { "data-vmid": "twitter:title", name: "twitter:title", content: this.file.title },
            { "data-vmid": "og:title", property: "og:title", content: this.file.title },
            { "data-vmid": "pagename", name: "pagename", content: this.file.title },
            { "data-vmid": "author", name: "author", content: this.file.author || config.author }
          ]
        }
      : {};
  },
  methods: {
    makeEvent(category, action, value) {
      if (this.$ga && this.$ga.event) {
        this.$ga.event({
          eventCategory: category,
          eventAction: action,
          eventLabel: this.file.title,
          eventValue: value
        });
      }
    },
    gaSet(key, value) {
      if (this.$ga && this.$ga.set) {
        this.$ga.set(key, value);
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    window.trackReading(
      this.$refs["postBody"],
      this.makeEvent,
      this.file.title,
      this.gaSet
    );
    next();
    return true;
  },
  mounted() {
    this.$nextTick(() => {
      window.trackReading(
        this.$refs["postBody"],
        this.makeEvent,
        this.file.title,
        this.gaSet
      );
    });
  }
};
</script>
