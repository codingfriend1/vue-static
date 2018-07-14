<template lang="pug">
div
  article.post-content-and-feedback
    main.post-content
      header.post-header
        h1.post-title {{file.title}}
        .post-avatar
        h5.post-meta
          | by 
          address
            router-link(to="/about", rel='author').no-border  {{file.author || author}} 
          .inline-desktop
            |  on
            time(pubdate='pubdate', :datetime="file.created")  {{file.created | prettifyDate}}
        .reading-time
          time#reading-time
      main.post-body-and-feedback
        .post-body(v-html='file.html' ref="postBody")
        footer.post-feedback.no-print
          comment
      footer



  aside.sidebar.no-print
    section.subscribe#mc_embed_signup
      form#mc-embedded-subscribe-form.validate(:action="mailChimpUrl", method='post', name='mc-embedded-subscribe-form', target='_blank', novalidate='')
          #mc_embed_signup_scroll
              h3 Subscribe to new posts
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

    section.post-list
      h4 Articles
      ul
        li.list-article-title(v-for="post in posts", :key="post.url", :class="post.url === $route.path ? 'active' : ''")
          router-link(exact :to="post.url") {{post.title}}

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
          meta: [
            { vmid: "og:type", property: "og:type", content: "article" },

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
    if(window.trackReading) {
      window.trackReading(
        this.$refs["postBody"],
        this.makeEvent,
        this.file.title,
        this.gaSet
      );
    }
    next();
    return true;
  },
  mounted() {
    this.$nextTick(() => {
      if(window.trackReading) {
        window.trackReading(
          this.$refs["postBody"],
          this.makeEvent,
          this.file.title,
          this.gaSet
        );
      }
    });
  }
};
</script>
